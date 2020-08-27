var initESW = function(gslbBaseURL) {
      embedded_svc.settings.displayHelpButton = true; //Or false
      embedded_svc.settings.prepopulatedPrechatFields = {FirstName: "justin", LastName: "mac"}; //Sets the auto-population of pre-chat form fields
      embedded_svc.settings.enabledFeatures = ['LiveAgent'];
      embedded_svc.settings.entryFeature = 'LiveAgent';

      embedded_svc.settings.devMode = true;

      embedded_svc.init(
        'http://jmacmillin-ltm4.internal.salesforce.com:6109',
        'http://communities.localhost.soma.force.com:6109/customerService',
        gslbBaseURL,
        '00Dxx0000006GeZ',
        'justinChat',
        {
          baseLiveAgentContentURL: 'http://jmacmillin-ltm4.internal.salesforce.com:8095/content',
          deploymentId: '572xx0000004C92',
          buttonId: '573xx0000004C92',
          baseLiveAgentURL: 'http://jmacmillin-ltm4.internal.salesforce.com:8096/chat',
          eswLiveAgentDevName: 'EmbeddedServiceLiveAgent_Parent04Ixx0000004C92EAE_16e67b01315',
          isOfflineSupportEnabled: false
        }
      );
};
if (!window.embedded_svc) {
      var s = document.createElement('script');
      s.setAttribute('src', 'http://jmacmillin-ltm4.internal.salesforce.com:6109/embeddedservice/5.0/esw.js');
      s.onload = function() { initESW(null); };
      document.body.appendChild(s);
} else {
      initESW('http://jmacmillin-ltm4.internal.salesforce.com:6109');
}

console.log("Loaded snippet.js");
