var initESW = function(gslbBaseURL) {
embedded_svc.settings.displayHelpButton = true; //Or false
embedded_svc.settings.language = ''; //For example, enter 'en' or 'en-US'
//embedded_svc.settings.defaultMinimizedText = '...'; //(Defaults to Chat with an Expert)
//embedded_svc.settings.disabledMinimizedText = '...'; //(Defaults to Agent Offline)
//embedded_svc.settings.loadingText = ''; //(Defaults to Loading)
//embedded_svc.settings.storageDomain = 'yourdomain.com'; //(Sets the domain for your deployment so that visitors can navigate subdomains during a chat session)
// Settings for Live Agent
//embedded_svc.settings.directToButtonRouting = function(prechatFormData) {
// Dynamically changes the button ID based on what the visitor enters in the pre-chat form.
// Returns a valid button ID.
//};
//embedded_svc.settings.prepopulatedPrechatFields = {}; //Sets the auto-population of pre-chat form fields
//embedded_svc.settings.fallbackRouting = []; //An array of button IDs, user IDs, or userId_buttonId
//embedded_svc.settings.offlineSupportMinimizedText = '...'; //(Defaults to Contact Us)
embedded_svc.settings.enabledFeatures = ['LiveAgent'];
embedded_svc.settings.entryFeature = 'LiveAgent';
embedded_svc.init('https://mokshith-dev-ed.my.salesforce.com', 'https://mohsaha-developer-edition.na46.force.com/', gslbBaseURL, '00Di0000000kajm', 'Chat_Deployment', { baseLiveAgentContentURL: 'https://c.la1-c2-iad.salesforceliveagent.com/content', deploymentId: '5720H0000006rq8', buttonId: '5730H0000006vzf', baseLiveAgentURL: 'https://d.la1-c2-iad.salesforceliveagent.com/chat', eswLiveAgentDevName: 'EmbeddedServiceLiveAgent_Parent04I0H000000TN61UAG_16326a5b2fa', isOfflineSupportEnabled: false}); };if (!window.embedded_svc) { var s = document.createElement('script'); s.setAttribute('src', 'https://mokshith-dev-ed.my.salesforce.com/embeddedservice/5.0/esw.min.js'); s.onload = function() { initESW(null); }; document.body.appendChild(s); } else { initESW('https://service.force.com'); }
