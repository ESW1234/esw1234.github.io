class Hacking extends HTMLElement {
  
}

function hack() {
  debugger;
  let app = document.querySelector("lo-lwr-application");
  //customElements.define('lo-lwr-application', Hacking);
  window.addEventListener("message", function(e) {
    debugger;
    e.source.location.href = "https://www.example.com";
  });
}
