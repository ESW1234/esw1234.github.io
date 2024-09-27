document.getElementById('editThisPageLink').href = "https://github.com/ESW1234/esw1234.github.io/edit/master" + window.location.pathname;		

function switchToVerifiedDeployment() {
  console.log("switching to verified deployment");
  //realistically this would be set by a customer's login function - we are simulating here for simplicity
  sessionStorage.setItem("USER_TOKEN", "123456");
  
  console.log("Clearing user session.");
  //save this reference so we know when we've finished with clearSession
  let emEl = document.getElementById("embedded-messaging")

  //end existing session, remove event handlers	
  embeddedservice_bootstrap.userVerificationAPI.clearSession(); //this also clears DOM elements
  waitForClearSession(emEl, loadVerifiedDeployment);
}

function switchToUnverifiedDeployment() {
  console.log("switching to unverified deployment");
  sessionStorage.removeItem("USER_TOKEN");
  
  console.log("Clearing user session.");
  //save this reference so we know when we've finished with clearSession
  let emEl = document.getElementById("embedded-messaging");

  //end existing session, remove event handlers	
  embeddedservice_bootstrap.userVerificationAPI.clearSession(); //this also clears DOM elements		
  waitForClearSession(emEl, loadUnverifiedDeployment);
}

function loadUnverifiedDeployment() {
  loadBootstrapScript(
    "https://esw-sdb3-blitz.test1.my.pc-rnd.site.com/ESWwebMessaging041674063807205/assets/js/bootstrap.js", 
    "00DSB0000005YCL",
    "webMessaging03", 
    "https://esw-sdb3-blitz.test1.my.pc-rnd.site.com/ESWwebMessaging031674063746989",
    "https://esw-sdb3-blitz.test1.my.pc-rnd.salesforce-scrt.com");
  //show the guest user options
  document.getElementById("userLoggedInPanel").style.display="none";
  document.getElementById("userNotLoggedInPanel").style.display="";
}

function loadVerifiedDeployment() {		
  loadBootstrapScript(
    "https://esw-sdb3-blitz.test1.my.pc-rnd.site.com/ESWwebMessaging041674063807205/assets/js/bootstrap.js", 
    "00DSB0000005YCL",
    "webMessaging04", 
    "https://esw-sdb3-blitz.test1.my.pc-rnd.site.com/ESWwebMessaging041674063807205",
    "https://esw-sdb3-blitz.test1.my.pc-rnd.salesforce-scrt.com");
  //show the logged in user options
  document.getElementById("userLoggedInPanel").style.display="";
  document.getElementById("userNotLoggedInPanel").style.display="none";
}

function waitForClearSession(emEl, callback) {
  //userVerificationAPI.clearSession() reloads ESW DOM elements; this is how we know it is finished
  if(emEl && document.getElementById("embedded-messaging") === emEl) {
    window.setTimeout( waitForClearSession, 100, emEl, callback);
  } else {
    embeddedservice_bootstrap.removeMarkup();
    //remove remaining DOM items, event handler
    document.getElementById("bootstrapScript").remove();
    document.getElementById("embeddedMessagingSiteContextFrame").remove();
    embeddedservice_bootstrap.removeEventHandlers();	
    //now that we have called all the APIs we need, unset this so we can load other deployment
    embeddedservice_bootstrap = undefined;
    callback();
  }
}

function loadBootstrapScript(scriptUrl, orgId, deploymentName, siteUrl, scrtUrl) {
  var s = document.createElement('script');
  s.setAttribute('src', scriptUrl);
  s.setAttribute("id", "bootstrapScript");
  s.onload = function() {
    try {
      embeddedservice_bootstrap.settings.language = 'en'; // For example, enter 'en' or 'en-US'
      embeddedservice_bootstrap.init(
        orgId,
        deploymentName,
        siteUrl,
        {
          scrt2URL: scrtUrl,
            });
      
    } catch (err) {
      console.error('Error loading Embedded Messaging: ', err);
    }
  };
  document.body.appendChild(s);
}

function setUserAccessToken() {
  var token = prompt("Please enter user access token");
  //Storing in sessionStorage to make things easier
  sessionStorage.setItem("VERIFICATION_TOKEN", token);
  embeddedservice_bootstrap.userVerificationAPI.setIdentityToken({"identityTokenType": "JWT", "identityToken": token});
}

window.addEventListener("load", () => {
  //use verified deployment if user token present, else unverified
  if (sessionStorage.getItem("USER_TOKEN")) {		
    loadVerifiedDeployment();
    let token = sessionStorage.getItem("VERIFICATION_TOKEN");
    if(token) {
      embeddedservice_bootstrap.userVerificationAPI.setIdentityToken({"identityTokenType": "JWT", "identityToken": token});
    }
  } else {
    loadUnverifiedDeployment();
  }
});

window.addEventListener("onEmbeddedMessagingReady", () => {
  console.log("Received the onEmbeddedMessagingReady event.");

  let token = sessionStorage.getItem("VERIFICATION_TOKEN");
  embeddedservice_bootstrap.userVerificationAPI.setIdentityToken({
    identityTokenType: "JWT",
    identityToken: token});
});
