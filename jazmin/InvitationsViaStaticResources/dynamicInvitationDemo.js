(function() {


	function DynamicInvitationDemo() {
		this.loadAndDisplayInvitationResource();
	};

	DynamicInvitationDemo.prototype.loadAndDisplayInvitationResource = function() {
		var script = document.createElement("script");

		script.type = "text/javascript";
		script.src = "https://cm224local.stmfa.stm.force.com/community0605/resource/1588899848000/sampleInvitationResource";

		script.onload = this.generateInvitation;

		document.body.appendChild(script);
	};

	DynamicInvitationDemo.prototype.generateInvitation = function() {
		var invitation = document.createElement("div");
		var invitationStyle = document.createElement('style');
		var invitationScript =  document.createElement("script");

		//This is the invitation markup
		invitation.innerHTML = dynamicInvitationDemo.invitationMarkup;
		
		// This is the invitation style
		invitationStyle.type = "text/css";
		
		// This is the styles to apply to the invitation.
		invitationStyle.innerHTML = dynamicInvitationDemo.styleTag;
		
		// Append the style to the markup
		invitation.append(invitationStyle);
		
		
		// Now that we have created the invitation append it to the page
		document.body.appendChild(invitation);
		
		
		// This is the invitation API specified in the static resource
		// In the actual implementation idk if we should have peopleinclude this in their
		// static resource as I don't see what exactly they would want to customize in it. So the
		// invitationScript specific logic will probs go away.
		invitationScript.type = "text/javascript";
		invitationScript.innerHTML = dynamicInvitationDemo.invitationAPIs;
		// Append the script to the page
		document.body.appendChild(invitationScript);
	};

	window.dynamicInvitationDemo = new DynamicInvitationDemo();
})();
