var initESW = function(gslbBaseURL) {
	embedded_svc.settings.displayHelpButton = true; //Or false
	// embedded_svc.settings.language = 'es'; //For example, enter 'en' or 'en-US'
	embedded_svc.settings.__synchronous_decrement_tab = true;
	embedded_svc.settings.defaultMinimizedText = 'Chat With a Bot'; //(Defaults to Chat with an Expert)
	embedded_svc.settings.disabledMinimizedText = 'Offline'; //(Defaults to Agent Offline)
	//embedded_svc.settings.__synchronous_decrement_tab = true;
	//embedded_svc.settings.loadingText = ''; //(Defaults to Loading)
	//embedded_svc.settings.storageDomain = 'yourdomain.com'; //(Sets the domain for your deployment so that visitors can navigate subdomains during a chat session)

	// Settings for Live Agent
	//embedded_svc.settings.directToButtonRouting = function(prechatFormData) {
		// Dynamically changes the button ID based on what the visitor enters in the pre-chat form.
		// Returns a valid button ID.
	//};
	embedded_svc.settings.prepopulatedPrechatFields = {FirstName: "justin", LastName: "mac", Email: "jmacmillin@salesforce.com", Subject: "Change my password."}; //Sets the auto-population of pre-chat form fields
	//embedded_svc.settings.fallbackRouting = []; //An array of button IDs, user IDs, or userId_buttonId
	//embedded_svc.settings.offlineSupportMinimizedText = '...'; //(Defaults to Contact Us)

	embedded_svc.settings.enabledFeatures = ['LiveAgent'];
	embedded_svc.settings.entryFeature = 'LiveAgent';

	// Avatars
	//embedded_svc.settings.avatarImgURL = "../../avatar.png";
	embedded_svc.settings.chatbotAvatarImgURL = "../../bot-avatar.png";

	// Debug
	embedded_svc.settings.devMode = false;

	embedded_svc.init(
		'https://snapins.my.stmfb.stm.salesforce.com',
		'https://snapins-1600942b294.stmfb.stm.force.com/cypress071218',
		gslbBaseURL,
		'00DRM0000005jYI',
		'justinChatbot',
		{
			baseLiveAgentContentURL: 'https://c.la2-stmfb1-0-prd.stmfb.stm.salesforceliveagent.com/content',
			deploymentId: '572RM0000004DDM',
			buttonId: '573RM0000004HAw',
			baseLiveAgentURL: 'https://d.la2-stmfb1-0-prd.stmfb.stm.salesforceliveagent.com/chat',
			eswLiveAgentDevName: 'EmbeddedServiceLiveAgent_Parent04IRM00000000Z42AI_165ca0519a9',
			isOfflineSupportEnabled: false
		}
	);
};

if (!window.embedded_svc) {
	var s = document.createElement('script');
// 		s.setAttribute('src', 'https://snapins.my.stmfb.stm.salesforce.com/embeddedservice/5.0/esw.min.js');
	s.setAttribute('src', 'https://snapins.my.stmfb.stm.salesforce.com/embeddedservice/5.0/esw.js');
	s.onload = function() {
		initESW(null);
	};
	document.body.appendChild(s);
} else {
// 		initESW('https://service.force.com');
	initESW('https://snapins.my.stmfb.stm.salesforce.com');
}
