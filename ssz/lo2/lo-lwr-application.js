(function(that) {
    'use strict';

    class LightningOut extends HTMLElement {

        #frameDomain = 'https://trialorgfarmforu5.my.localhost.sfdcdev.site.com:7443';
        //#frameDomain = 'https://trialorgfarmforu3.my.site-com.sisi-zhang-j34g7vcm333o1.wa.crm.dev:6101'
        //#frameDomain = 'https://dsg00000exfct2av.test1.my.pc-rnd.site.com';
        
        #framePath = '/lp/lo/fragment__z4vhnq8fkhy8w941q1l08rzx70o7nprbilcuti8snyl';
        //#framePath = '/lp/lo/fragment__z4vegofl6txy3q90qecmlz7ovhl9w5d7e5jtf439cud';
        //#framePath = '/lp/lo/fragment__z4vhol8ey0agx4rn91uzngh9txri138i6jnsyxmwlkx';

        #iframeRef;
        #shadowRef;

        #ready = false;

        #messageListener;

        #preload(endpoint) {
            const iframe = that.document.createElement('iframe');
            const shadow = this.attachShadow({ mode: 'closed' });
            iframe.name = 'lightning_af';
            iframe.sandbox = 'allow-same-origin allow-downloads allow-forms allow-scripts';
            iframe.frameborder = 0;
            // DEPRECATED: https://caniuse.com/?search=iframe%20scrolling 
            //   Suggested to use 'overflow:hidden;'
            //   But some browsers might wrongly support overflow.
            //   Therefore, we add both.
            iframe.scrolling = 'no';
            // DEFAULT STYLES:
            //   BORDER: Remove 1px border that is the default style for <iframe>.
            //   OVERFLOW: Content outside of the <iframe> will be hidden.
            //   WIDTH: Dynamically resize to fit the width of the container.
            iframe.style = 'border:0;overflow:hidden;width:100%;';
            iframe.onerror = () => that.alert('Lightning Out: Error loading <iframe> for ' + iframe.src);
            iframe.onload = () => {
                // It is possible in edge cases, to change the iframe URL.
                // This code will delete the web component if this happens,
                // because it is assumed to be someone hacking the code.
                if (this.#ready) {
                    this.#shadowRef.innerHTML = '';
                    this.remove();
                    throw new Error('Lightning Out: This component cannot be rerendered for security reasons.');
                }
                iframe.style.display = 'block';
                this.#ready = true;
            };

            // Property Access === '';
            // 'getAttribute' Access === null;
            const title = this.getAttribute('title');
            if (title) {
                iframe.title = title;
            }

            this.#messageListener = (event) => {
                // (1) Ensure that event.origin is set for all postMessage events.
                // (3) For events from the iframe to the host document. We will need to do the reverse.
                //     The target origin will need to be the URL of the host document and we will need to 
                //     check if it matches the URL of the host document before reading the message.
                //     This flow is trickier as we do not necessarily know the URL of the host document 
                //     from the iframe. However, from the iframe back to the host document is slightly less of
                //     a concern and we could set the targetOrigin to '*' for now and fix this up later.
                if (event.origin !== this.#frameDomain) {
                    that.console.trace(`Lightning Out: Message ignored due to different ${event.origin}.`);
                    return;
                }
                if (event.source !== this.#iframeRef.contentWindow) {
                    that.console.trace('Lightning Out: Message ignored due to different source.');
                    return;
                }
                switch(event.data.type) {
                    case 'lo.height-change': {
                        if (event.data) {
                            this.#iframeRef.height = event.data.height;
                        }
                        break;
                    }
                    case 'lo.dispatchEvent': {
                        const customEvent = new that.CustomEvent(event.data.name, { detail: event.data.detail });
                        super.dispatchEvent(customEvent);
                        break;
                    }
                    case 'lo.ready': {
                        // TODO: Remove Case
                        this.addEventListener('ShowRecaptcha', () => {
                            const form = that.document.getElementById('form');
                            form.style.display = 'inline-block';
                            form.addEventListener('submit', (event) => {
                                event.preventDefault();
                                const inputEl = that.document.getElementById('returnInput');
                                const customEvent = new that.CustomEvent('returnValue', {
                                    detail: {
                                        returnValue: inputEl.value
                                    }
                                });
                                this.dispatchEvent(customEvent);
                                form.style.display = 'none';
                            });
                        });
                        break;
                    }
                }
                event.stopImmediatePropagation();
            };            
            that.addEventListener('message', this.#messageListener);

            iframe.src = endpoint;
            this.#iframeRef = shadow.appendChild(iframe);
            this.#shadowRef = shadow;
        }

        addEventListener(eventName) {
            super.addEventListener(...arguments);
            this.#iframeRef.contentWindow.postMessage({
                name: eventName,
                type: 'lo.addEventListener',
            }, this.#frameDomain);
        }

        dispatchEvent(event) {
            super.dispatchEvent(...arguments);
            this.#iframeRef.contentWindow.postMessage({
                name: event.type,
                detail: event.detail,
                type: 'lo.dispatchEvent',
            }, this.#frameDomain);
        }

        adoptedCallback() {
            this.remove();
            throw new Error('Lightning Out: This component cannot be rerendered for security reasons.');
        }
        connectedCallback() {
            if (!this.#shadowRef) {
                this.#preload(this.#frameDomain + this.#framePath);
            } else {
                this.remove();
                throw new Error('Lightning Out: This component cannot be rerendered for security reasons.');
            }
        }
        disconnectedCallback() {
            this.#shadowRef.innerHTML = '';
            if (this.#messageListener) {
                that.removeEventListener('message', this.#messageListener);
            }
        }
    }
    that.customElements.define('lo-lwr-application', LightningOut);
})(window);
