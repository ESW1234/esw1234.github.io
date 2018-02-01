embedded_svc.defineFeature("FieldService", function(esw) {
	/**
	 * Module for Field Service functionality.
	 * Current list of Field Service ESW settings params:
	 * - loginClientId: Client id of connected app
	 * - loginRedirectURL: Oauth callback URI
	 * - loginTargetQuerySelector: Query selector of the field service button's container
	 * - fieldServiceStartLabel: Label for the button after you are logged in
	 *
	 * @class
	 */
	function FieldServiceAPI() {
		esw.setDefaultButtonText("FieldService", "Book an Appointment");

		esw.requireAuthentication();
		
		esw.registerLinkAction("FieldService", "View");
		esw.registerLinkAction("FieldService", "AppointmentList")
	}

	esw.fieldServiceAPI = new FieldServiceAPI();
});