   $Lightning.use("embeddedService:liveAgentSidebarApp", function() {
       $Lightning.createComponent("embeddedService:liveAgentSidebar", {
         deploymentId : '572D00000004CSa',
         orgId : '00DD00000008649',
         buttonId : '573D00000004CYO',
         endpointURL : 'https://d.la-blitz02.soma.salesforce.com/chat',
         avatarImgURL : 'avatar.png',
         prechatBackgroundImgURL : 'Prechat_image.png',
         waitingStateBackgroundImgURL : 'waitingStateImage.png',
         smallCompanyLogoImgURL : 'smallCompanyLogoImg.png',
         chasitorContentServerEndpointURL : 'https://d.la-blitz02.soma.salesforce.com/content',
         chasitorSrcURL : ['https://na1-blitz04.soma.salesforce.com/jslibrary/1457334052000/ui-sfdc-javascript-impl/SfdcCore.js','https://d.la-blitz02.soma.salesforce.com/content/g/js/37.0/chasitor.js']
        }, "button_goes_here");
   },"https://subbu.blitz04.soma.force.com/esw0108");
