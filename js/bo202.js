document.addEventListener('DOMContentLoaded', function(event) {
  var buttonDiv = document.createElement('div');
  var buttonDivId = 'button_goes_here';
  buttonDiv.setAttribute('id', buttonDivId);
  document.body.appendChild(buttonDiv);
  
  var ltngOutScript = document.createElement('script');
  ltngOutScript.setAttribute('src', 'http://bochean-ltm2.internal.salesforce.com:6109/lightning/lightning.out.js');
  document.body.appendChild(ltngOutScript);
  
  window.setTimeout(function() {
    // esw@bo.org
    $Lightning.use('embeddedService:liveAgentSidebarApp', function() {
      $Lightning.createComponent('embeddedService:liveAgentSidebar', {
        deploymentId : '572xx000000001x',
        orgId : '00Dxx0000001gMk',
        buttonId : '573xx000000001x',
        endpointURL : 'http://bochean-ltm2.internal.salesforce.com:8096/chat',
        chasitorContentServerEndpointURL : 'http://bochean-ltm2.internal.salesforce.com:8095/content',
        chasitorSrcURL : ['http://bochean-ltm2.internal.salesforce.com:6109/jslibrary/1446053165000/ui-sfdc-javascript-impl/debug/SfdcCore.js','http://bochean-ltm2.internal.salesforce.com:8095/content/g/js/37.0/chasitor.js']
      }, buttonDivId);
    }, 'http://subbu-153c1e39e36.localhost.force.com:6109/esw0108');
  }, 0);
});
