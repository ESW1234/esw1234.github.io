(function() {

	function DynamicInvitationDemo() {
		this.loadAndDisplayInvitationResource();
	};

	DynamicInvitationDemo.prototype.loadAndDisplayInvitationResource = function() {
		var script = document.createElement("script");

		script.type = "text/javascript";
		script.src = "https://cm224local.stmfa.stm.force.com/community0605/resource/1588885881000/sampleInvitationResource";

		script.onload = this.generateInvitation();

		document.body.appendChild(script);
	};

	DynamicInvitationDemo.prototype.generateInvitation = function(callback) {
		var invitation = document.createElement("div");

		//This is the invitation markup
		invitation.innerHTML = DynamicInvitationDemo.invitationMarkup;

		// This is the invitation style tag
		invitation.style = DynamicInvitationDemo.styleTag;

		// Now that we have created the invitation append it to the page
		document.body.appendChild(invitation);
	};

	window.dynamicInvitationDemo = new DynamicInvitationDemo();
})(window.dynamicInvitationDemo || {});
