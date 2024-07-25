(function(that) {
    "use strict";

    var $$iframeRef$$;

    function load(endpoint, parentDomElement) {
        const iframe = that.document.createElement("iframe");
        const shadow = parentDomElement.attachShadow({ mode: "closed" });
        iframe.id = "lightning_af";
        iframe.name = "lightning_af";
        iframe.scrolling = "no" // USE style="overflow:hidden;"
        iframe.sandxox = "allow-downloads allow-forms allow-scripts";
        iframe.frameborder = 0;
        iframe.width = "100%";
        iframe.style = "position:relative;border:0;padding:5px;overflow:none;visibility:none;background-color:#FFFCB5;"
        //iframe.width = iframe.style.width;
        iframe.height = "100%";
            //iframe.height = iframe.style.height;
        iframe.onerror = (err) => alert("Error Loading iframe for " + iframe.src);
        iframe.onload = (event) => {
            $$iframeRef$$ = event.target;
        };

        // (1) Ensure that event.origin is set for all postMessage events.
        // (3) For events from the iframe to the host document. We will need to do the reverse.
        //     The target origin will need to be the URL of the host document and we will need to 
        //     check if it matches the URL of the host document before reading the message.
        //     This flow is trickier as we do not necessarily know the URL of the host document 
        //     from the iframe. However, from the iframe back to the host document is slightly less of
        //     a concern and we could set the targetOrigin to '*' for now and fix this up later.
        // function compareOrigin(eventOrigin) {
        //     eventOrigin === window.location.href; // TODO
        // }

        window.addEventListener("message", (event) => {
                switch(event.data.type) {
                    case 'lo.iframeSize':
                        break;
                    case 'lo.dispatchEvent':
                        debugger;
                        const customEvent = new CustomEvent(event.data.name, { detail: event.data.detail });
                        parentDomElement.dispatchEventComponent(customEvent);
                        break;
                }
        });

        shadow.appendChild(iframe);
        iframe.src = endpoint;
    }

    function preload(endpoint, parentDomElement) {
        load(endpoint, parentDomElement);
    }

    class LightningOut extends HTMLElement {
        static get observedAttributes() {
                    return ['data-url'];
                }
        addEventListener(eventName) {
            super.addEventListener(...arguments);
            debugger;
            $$iframeRef$$.contentWindow.postMessage({
                name: eventName,
                type: 'lo.addEventListener',
            }, '*');
        }

        dispatchEvent(event) {
            super.dispatchEvent(...arguments);
            debugger;
            $$iframeRef$$.contentWindow.postMessage({
                name: event.type,
                detail: event.detail,
                type: 'lo.dispatchEvent',
            }, '*');
        }

        dispatchEventComponent() {
            debugger;
            super.dispatchEvent(...arguments);
        }

        adoptedCallback() {
            this.remove();
        }
        connectedCallback() {
            const url = this.getAttribute('data-url');
                    if (url) {

                        preload(url , this);
                    } else {
                        console.error('No URL provided for LightningOut element.');
                    }
            //preload("https://dsb00000aegn92ah.test1.my.pc-rnd.site.com/", this)
        }
    }
    customElements.define("lo-lwr-application", LightningOut);
})(this);
