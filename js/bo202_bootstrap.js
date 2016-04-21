document.addEventListener('DOMContentLoaded', function(event) {
  var buttonDiv = document.createElement('div');
  var buttonDivId = 'button_goes_here';
  buttonDiv.setAttribute('id', buttonDivId);
  document.body.appendChild(buttonDiv);
  
  var ltngOutScript = document.createElement('script');
  ltngOutScript.setAttribute('src', 'http://bochean-ltm2.internal.salesforce.com:6109/lightning/lightning.out.js');
  document.body.appendChild(ltngOutScript);
  
  var widgetScript = document.createElement('script');
  widgetScript.setAttribute('src', '/js/bo202.js');
  document.body.appendChild(widgetScript);
});
