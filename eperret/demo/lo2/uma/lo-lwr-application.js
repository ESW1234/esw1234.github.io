(function(that) {
    'use strict';

    class LightningOut extends HTMLElement {

        /*#frameDomain = 'https://dsg00000axdtj2a3.test1.my.pc-rnd.site.com';
        #framePath = '/lp/lo?embeddedCmp=fragment/z4vef6fpe0h7wnpytaj5p1600u5elax6i6m7rq364wp';*/
        #frameDomain = 'https://dsb00000aegn92ah.test1.my.pc-rnd.site.com';
        #framePath = '/';

        #iframeRef;
        #shadow;

        #lastWidth;
        #ready = false;
        #messageListener;

        #preload(endpoint, parentDomElement) {
            const iframe = that.document.createElement('iframe');
            const shadow = parentDomElement.attachShadow({ mode: 'closed' });
            this.#shadow = shadow;
            iframe.name = 'lightning_af';
            iframe.sandbox = 'allow-same-origin allow-downloads allow-forms allow-scripts';
            iframe.frameborder = 0;
            iframe.scrolling = 'no' // USE style="overflow:hidden;"
            iframe.style = 'width:100%;position:relative;border:0;padding:1px;overflow:none;visibility:none;background-color:#fffcb5';
            iframe.onerror = () => that.alert('Error Loading <iframe> for ' + iframe.src);
            iframe.onload = (event) => {
                if (parentDomElement.#ready) {
                    // Someone is trying to change the page
                    this.#shadow.innerHTML = '';
                    this.remove();
                    return;
                }
                iframe.style.display = 'block';
                parentDomElement.#ready = true;
            };

            const title = parentDomElement.getAttribute("title");
            if (title) {
                iframe.title = title;
            }

            // (1) Ensure that event.origin is set for all postMessage events.
            // (3) For events from the iframe to the host document. We will need to do the reverse.
            //     The target origin will need to be the URL of the host document and we will need to 
            //     check if it matches the URL of the host document before reading the message.
            //     This flow is trickier as we do not necessarily know the URL of the host document 
            //     from the iframe. However, from the iframe back to the host document is slightly less of
            //     a concern and we could set the targetOrigin to '*' for now and fix this up later.

            this.#messageListener = (event) => {
                if (event.origin !== parentDomElement.#frameDomain) {
                    that.console.trace(`Lightning Out: Message ignored from ${event.origin}.`);
                    return;
                }
                if (event.source !== parentDomElement.#iframeRef.contentWindow) {
                    that.console.trace("Lightning Out: Message ignored due to different source.");
                    return;
                }
                switch(event.data.type) {
                    case 'lo.container-sized': {
                        if (event.data) {
                            parentDomElement.#iframeRef.height = event.data.height;
                        }
                        break;
                    }
                    case 'lo.dispatchEvent': {
                        const customEvent = new that.CustomEvent(event.data.name, { detail: event.data.detail });
                        parentDomElement.#dispatchEventComponent(customEvent);
                        break;
                    }
                    case 'lo.ready': {
                        parentDomElement.addEventListener('ShowRecaptcha', () => {
                            const form = that.document.getElementById('form');
                            form.style.display = 'inline-block';
                            const button = that.document.getElementById('button');
                            button.addEventListener('click', () => {
                                const inputEl = that.document.getElementById('returnInput');
                                const customEvent = new that.CustomEvent('returnValue', {
                                    detail: {
                                        returnValue: inputEl.value
                                    }
                                });
                                parentDomElement.dispatchEvent(customEvent);
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
            parentDomElement.#iframeRef = shadow.appendChild(iframe);
        }

        #adjustIFrameSize() {
            // Set Max-Width for LWR Container
            const { offsetWidth, offsetHeight } = this;
            if (this.#lastWidth !== offsetWidth) {
                this.#lastWidth = offsetWidth;
                this.#iframeRef.width = offsetWidth;
                this.#iframeRef.contentWindow.postMessage({
                    type: 'lo.wrapper-size',
                    width: offsetWidth,
                    height: offsetHeight,
                }, '*');
            }
        }

        #dispatchEventComponent() {
            super.dispatchEvent(...arguments);
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
            throw new Error("This component cannot be rerendered for security reasons.");
        }
        connectedCallback() {
            if (!this.#shadow) {
                this.#preload(this.#frameDomain, this);
            } else {
                this.remove();
                throw new Error("This component cannot be rerendered for security reasons.");
            }
        }
        disconnectedCallback() {
            this.#shadow.innerHTML = '';
            if (this.#messageListener) {
                that.removeEventListener('message', this.#messageListener);
            }
        }
    }
    that.customElements.define('lo-lwr-application', LightningOut);
})(window);
