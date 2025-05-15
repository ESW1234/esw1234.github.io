(function(that) {
    "use strict";

    class LightningOut extends HTMLElement {
        iframeRef;
        lastWidth;
        ready = false;

        preload(endpoint, parentDomElement) {
            const iframe = that.document.createElement("iframe");
            const shadow = parentDomElement.attachShadow({ mode: "closed" })
            iframe.id = "lightning_af";
            iframe.name = "lightning_af";
            iframe.scrolling = "no" // USE style="overflow:hidden;"
            iframe.sandxox = "allow-downloads allow-forms allow-scripts";
            iframe.frameborder = 0;
            iframe.style.width = '100%';
            iframe.style = "position:relative;border:0;padding:1px;overflow:none;visibility:none;background-color:#FFFCB5;"
            iframe.onerror = () => alert("Error Loading <iframe> for " + iframe.src);
            iframe.onload = (event) => {
                this.iframeRef = event.target;
                this.iframeRef.style.display = 'block';
                this.adjustIFrameSize();
            };

            // (1) Ensure that event.origin is set for all postMessage events.
            // (3) For events from the iframe to the host document. We will need to do the reverse.
            //     The target origin will need to be the URL of the host document and we will need to 
            //     check if it matches the URL of the host document before reading the message.
            //     This flow is trickier as we do not necessarily know the URL of the host document 
            //     from the iframe. However, from the iframe back to the host document is slightly less of
            //     a concern and we could set the targetOrigin to '*' for now and fix this up later.
            // function compareOrigin(eventOrigin) {
            //     // TODO
            // }

            window.addEventListener("message", (event) => {
                switch(event.data.type) {
                    case "lo.container-sized":
                        if (event.data) {
                            this.iframeRef.height = event.data.height;
                        }
                        break;
                    case 'lo.dispatchEvent':
                        const customEvent = new CustomEvent(event.data.name, { detail: event.data.detail });
                        parentDomElement.dispatchEventComponent(customEvent);
                        break;
                    case "lo.ready":
                        parentDomElement.addEventListener('ShowRecaptcha', () => {
                            const form = document.getElementById('form');
                            form.style.display = 'inline-block';
                            const button = document.getElementById('button');
                            button.addEventListener("click", () => {
                                const inputEl = document.getElementById('returnInput');
                                const customEvent = new CustomEvent('returnValue', {
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
            });

            new ResizeObserver(this.adjustIFrameSize).observe(parentDomElement);

            shadow.appendChild(iframe);
            iframe.src = endpoint;
        }

        adjustIFrameSize() {
            // Set Max-Width for LWR Container
            const { offsetWidth, offsetHeight } = this;
            if (this.lastWidth !== offsetWidth) {
                this.lastWidth = offsetWidth;
                this.iframeRef.width = offsetWidth;
                this.iframeRef.contentWindow.postMessage({
                    type: 'lo.wrapper-size',
                    width: offsetWidth,
                    height: offsetHeight,
                }, '*');
            }
        }

        addEventListener(eventName) {
            super.addEventListener(...arguments);
            this.iframeRef.contentWindow.postMessage({
                name: eventName,
                type: 'lo.addEventListener',
            }, '*');
        }

        dispatchEvent(event) {
            super.dispatchEvent(...arguments);
            this.iframeRef.contentWindow.postMessage({
                name: event.type,
                detail: event.detail,
                type: 'lo.dispatchEvent',
            }, '*');
        }

        dispatchEventComponent() {
            super.dispatchEvent(...arguments);
        }

        adoptedCallback() {
            this.remove();
        }
        connectedCallback() {
            this.preload("https://trialorgfarmforu3.my.site-com.sisi-zhang-j34g7vcm333o1.wa.crm.dev:6101/lp/lplo2?embeddedCmp=fragment/z4vegofl6txy3q90qecmlz7ovhl9w5d7e5jtf439cud", this)
        }
    }
    customElements.define("lo-lwr-application", LightningOut);
})(this);
