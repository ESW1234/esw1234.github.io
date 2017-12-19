(function() {
  const OAUTH_CLIENT_ID = "3MVG9AOp4kbriZOLiNgBjx.ukyB1nkyyeMSqElIwjT_cJg7P6FjIxyKYcvPFoubYhwesNHl6zUJdugbDETJMe";
  const OAUTH_CLIENT_SECRET = "15410901038364326";
  document.querySelector("#login-button").onclick = () => {
    const username = document.querySelector("#login-name").value;
    const password = document.querySelector("#login-pass").value;

    const request = new XMLHttpRequest();

    request.onload = function(e) {
      const response = request.responseText; // not responseText
      console.log(response)
    }
    request.open("POST", `http://jakerouss-ltm1.internal.salesforce.com:6109/services/oauth2/token?grant_type=password&client_id=${OAUTH_CLIENT_ID}&client_secret=${OAUTH_CLIENT_SECRET}&username=${username}&password=${password}`);
    request.send();
  };
})();
