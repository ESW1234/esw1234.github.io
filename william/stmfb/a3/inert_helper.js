function toggleInert() {
	const inertEnabled = embedded_svc && embedded_svc.settings && embedded_svc.settings.inertEnabled;
	const num_children = document.body.children.length;
	console.log('Toggling inert status of every child element of the body to: ' + inertEnabled);
	for (let i = 0; i < num_children; i++) {
		const child = document.body.children[i];
		if (['button_goes_here', 'inert-button'].indexOf(child.id) === -1) {
			child.inert = !inertEnabled;
		}
	}
}