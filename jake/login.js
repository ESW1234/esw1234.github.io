(function() {
  document.querySelector("#login-button").onclick = () => {
    const username = document.querySelector("#login-name").value;

    const request = new XMLHttpRequest();

    request.onload = function(e) {      
      if(request.status === 200) {
        embedded_svc.auth.oauthToken = request.responseText;
        console.log("[Login] Login successful!");
      } else {
        console.log(`[Login] Unable to login: ${responseData.error} - ${responseData.error_description}.`);
      }
    }
    request.open("POST", `http://communities-developer-edition.localhost.soma.force.com:6109/wsm5/services/apexrest/JWT?username=${username}`);
    request.send();
  };
})()
