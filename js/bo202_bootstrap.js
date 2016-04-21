document.addEventListener('DOMContentLoaded', function(event) {
  var buttonDiv = document.createElement('div');
  buttonDiv.setAttribute('id', 'button_goes_here');
  document.body.appendChild(buttonDiv);
  
  var ltngOutScript = document.createElement('script');
  ltngOutScript.setAttribute('src', 'http://bochean-ltm2.internal.salesforce.com:6109/lightning/lightning.out.js');
  document.body.appendChild(ltngOutScript);
  
  var widgetScript = document.createElement('script');
  widgetScript.setAttribute('src', '/js/bo202_widget.js');
  document.body.appendChild(widgetScript);
});
