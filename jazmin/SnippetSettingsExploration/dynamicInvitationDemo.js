(function() {


	function DynamicInvitationDemo() {
		this.loadAndDisplayInvitationResource();
	};

	DynamicInvitationDemo.prototype.loadAndDisplayInvitationResource = function() {
		var script = document.createElement("script");

		script.type = "text/javascript";
		script.src = "https://cm224local.stmfa.stm.force.com/community0605/resource/1588888606000/sampleInvitationResource";

		script.onload = this.generateInvitation;

		document.body.appendChild(script);
	};

	DynamicInvitationDemo.prototype.generateInvitation = function() {
		var invitation = document.createElement("div");
		var invitationStyle = document.createElement('style');

		//This is the invitation markup
		invitation.innerHTML = dynamicInvitationDemo.invitationMarkup;
		
		// This is the invitation style
		invitationStyle.type = "text/css";
		// This is the styles to apply to the invitation.
		invitationStyle.innerHTML = dynamicInvitationDemo.styleTag;
		
		invitation.append(invitationStyle);
		
		
		/ Now that we have created the invitation append it to the page
		document.body.appendChild(invitation);
	};

	window.dynamicInvitationDemo = new DynamicInvitationDemo();
})();
