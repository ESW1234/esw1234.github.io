/**
 * This function controls toggles whether the background page is inert.
 * 
 * @param {boolean} [setInert] - Explicitly set inert.
 */
function toggleInert(setInert) {
	const isPageInert = embedded_svc.settings.isPageInert || false;
	const shouldSetInert = (typeof setInert === 'boolean' && setInert) || !isPageInert;
	const numChildren = document.body.children.length;
	const previousInertSettings = {}
	console.log('Toggling inert status of every child element of the body to: ' + shouldSetInert);
	for (let i = 0; i < numChildren; i++) {
		const child = document.body.children[i];
		if (['button_goes_here', 'inert-button'].indexOf(child.id) === -1 &&
				child.className.indexOf('embeddedServiceHelpButton') === -1 &&
				child.className.indexOf('embeddedServiceSidebar') === -1) {
			child.inert = shouldSetInert;
		}
	}

	embedded_svc.settings.isPageInert = shouldSetInert;
}