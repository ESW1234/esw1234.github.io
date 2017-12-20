/*
 This login script wont work unless you override your headers to fake cross-origin. If you use requestly
 (make sure you replace jakerouss-ltm1 with your app server):
 
   {
    "creationDate": 1513705693613,
    "description": "",
    "id": "Headers_1513705693613",
    "name": "OAuth Response",
    "pairs": [
      {
        "header": "Access-Control-Allow-Origin",
        "source": {
          "key": "Url",
          "operator": "Contains",
          "value": "http://jakerouss-ltm1.internal.salesforce.com:6109/services/oauth2/token"
        },
        "target": "Response",
        "type": "Add",
        "value": "http://esw1234.github.io"
      },
      {
        "header": "Access-Control-Allow-Credentials",
        "source": {
          "key": "Url",
          "operator": "Contains",
          "value": "http://jakerouss-ltm1.internal.salesforce.com:6109/services/oauth2/token"
        },
        "target": "Response",
        "type": "Add",
        "value": "true"
      },
      {
        "header": "Access-Control-Allow-Methods",
        "source": {
          "key": "Url",
          "operator": "Contains",
          "value": "http://jakerouss-ltm1.internal.salesforce.com:6109/services/oauth2/token"
        },
        "target": "Response",
        "type": "Add",
        "value": "HEAD, GET, POST, PUT, PATCH, DELETE"
      }
    ],
    "ruleType": "Headers",
    "status": "Active"
  }
*/
(function() {
  const OAUTH_CLIENT_ID = "3MVG9AOp4kbriZOLiNgBjx.ukyB1nkyyeMSqElIwjT_cJg7P6FjIxyKYcvPFoubYhwesNHl6zUJdugbDETJMe";
  const OAUTH_CLIENT_SECRET = "15410901038364326";
  document.querySelector("#login-button").onclick = () => {
    const username = document.querySelector("#login-name").value;
    const password = document.querySelector("#login-pass").value;

    const request = new XMLHttpRequest();

    request.onload = function(e) {
      const responseData = JSON.parse(request.responseText);
      
      if(request.status === 200) {
        embedded_svc.auth.oauthToken = responseData.access_token;
        console.log("[Login] Login successful!");
      } else {
        console.log(`[Login] Unable to login: ${responseData.error} - ${responseData.error_description}.`);
      }
    }
    request.open("POST", `http://jakerouss-ltm1.internal.salesforce.com:6109/services/oauth2/token?grant_type=password&client_id=${OAUTH_CLIENT_ID}&client_secret=${OAUTH_CLIENT_SECRET}&username=${username}&password=${password}`);
    request.send();
  };
})()
