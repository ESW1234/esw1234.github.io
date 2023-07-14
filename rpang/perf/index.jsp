<html lang="en-US">
  <head>
    <title>Example JSP</title>
    <link rel="stylesheet" type="text/css" href="/qa/css/ftest.css" />
</head>
<body>

  <%
    // Get the VPod ID from the request
    String vpodId = request.getParameter("vpodId");
 %>
    <%
    if (null == vpodId) {
 %>
    and no value was specified for that parameter.</p>
<% } else { %>    
    and its value is <tt><%= vpodId %></tt>.</p>
<% } %>
    
<p>To specify a value for the parameter, give it as a query-string parameter,
such as <tt><a href="parameterExample.jsp?vpodId=12345678">parameterExample.jsp?vpodId=12345678</a></tt>.</p>    
<%
  String url = "https://perftesting999-corsa04-perfeng2-" + vpodId + ".vpod.t.salesforce-communities.com"
   %>
<script src= url + "/lightning/lightning.out.js"></script>
 
<div ng-app="myApp" ng-controller="myCtrl"> 

<p>Today's welcome message is:</p>
<div ng-bind-html="rawHtml">{{myWelcome}}</div>

</div>
<div id="lightning">
  </div>
<script>
            $Lightning.use("c:loApp", function() {
              $Lightning.createComponent("c:auraCmp", 
              { },
              "lightning",
              function(cmp) {
                // do some stuff
              });
            },

         url + 'accountPortal' // Community endpoint
        );                   

</script>
</body>
</html>
