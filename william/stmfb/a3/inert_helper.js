function toggleInert() {
	const isPageInert = embedded_svc.settings.isPageInert || false;
	const num_children = document.body.children.length;
	console.log('Toggling inert status of every child element of the body to: ' + !isPageInert);
	for (let i = 0; i < num_children; i++) {
		const child = document.body.children[i];
		if (['button_goes_here', 'inert-button'].indexOf(child.id) === -1) {
			child.inert = !isPageInert;
		}
	}

	embedded_svc.settings.isPageInert = !isPageInert;
}