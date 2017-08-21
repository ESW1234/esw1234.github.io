cy={};

cy._version='3.6.14/331/DW';

cy.documentdomain=window.document.domain;
cy.locationpathname=window.location.pathname;
cy.documentreferrer=window.document.referrer;

cy_defaults={};
cy_defaults.PageName="";
cy_defaults.FunnelLevel="0";
cy_defaults.Section="";
cy_defaults.UserId="";
cy_defaults.Product="";
cy_defaults.Quantity=0;
cy_defaults.Value=0.0;
cy_defaults.OrderNumber="";
cy_defaults.ReturnToLink="";
cy_defaults.Custom1="";
cy_defaults.Custom2="";
cy_defaults.Custom3="";
cy_defaults.Custom4="";
cy_defaults.Custom5="";
cy_defaults.Custom6="";
cy_defaults.Custom7="";
cy_defaults.Custom8="";
cy_defaults.Custom9="";
cy_defaults.Custom10="";
cy_defaults.Custom11="0";
cy_defaults.Custom12="0";
cy_defaults.Custom13="0";
cy_defaults.Custom14="0";
cy_defaults.Custom15="0";
cy_defaults.Custom16="0";
cy_defaults.Custom17="0";
cy_defaults.Custom18="0";
cy_defaults.Custom19="0";
cy_defaults.Custom20="0";

cy.WAIT_DURATION=100;
cy.UPPER_LIMIT_WAIT_DURATION=2000;

cy.CSSR=0.0;
cy.CSM=0;
cy.CSSID='';
cy.CSSESSIONFLAG=-1;

cy.CUSTOMERCODE='@ABANDONMENT_SERVICE_CODE@';
cy.BASKETAPPEND='0';

cy.SUPPRESSDEFAULT=false;

var cyPageBasket="";
var cyCurrLineNumber="";

var _cyImages={};

_cyGetUniqueId = (function() {
	var id=0; 
	return function(){ return "_" + id++; };
})();

var cySessionIdDetails;
var cyGenerateSessionId=true;

function cyResetCYToDefaults()
{
	cy.documentdomain=window.document.domain;
	cy.locationpathname=window.location.pathname;
	cy.documentreferrer=window.document.referrer;

	cy_defaults.PageName="";
	cy_defaults.FunnelLevel="0";
	cy_defaults.Section="";
	cy_defaults.UserId="";
	cy_defaults.Product="";
	cy_defaults.Quantity=0;
	cy_defaults.OrderNumber="";
	cy_defaults.Value=0.0;
	cy_defaults.ReturnToLink="";
	cy_defaults.Custom1="";
	cy_defaults.Custom2="";
	cy_defaults.Custom3="";
	cy_defaults.Custom4="";
	cy_defaults.Custom5="";
	cy_defaults.Custom6="";
	cy_defaults.Custom7="";
	cy_defaults.Custom8="";
	cy_defaults.Custom9="";
	cy_defaults.Custom10="";
	cy_defaults.Custom11="0";
	cy_defaults.Custom12="0";
	cy_defaults.Custom13="0";
	cy_defaults.Custom14="0";
	cy_defaults.Custom15="0";
	cy_defaults.Custom16="0";
	cy_defaults.Custom17="0";
	cy_defaults.Custom18="0";
	cy_defaults.Custom19="0";
	cy_defaults.Custom20="0";
}

var _cyBrowser = {
isMicrosoft: navigator.appName.indexOf("Microsoft") != -1
};

// On all versions of Internet Explorer, setting the document.location to load a new page results in the document.referrer on the
// new page not being set. This function provides a workaround to that problem.
function _cyNavigate(url)
{
	if (_cyBrowser.isMicrosoft === true)
	{
		var referLink = document.createElement('a');
		referLink.href = url;
		document.body.appendChild(referLink);
		referLink.click();
	}
	else
	{
		window.location=url;
	}
}

function _cyGetCookie(c_name, suffix_allowed)
{
	var c_start;
	var c_end;
	
	// Search case-insensitive
	if (document.cookie.length>0)
	{
		if (suffix_allowed === false)
		{
			// Look for a complete word match
			c_start = document.cookie.toLowerCase().indexOf(c_name.toLowerCase() + "=");

			if (c_start != -1)
			{
				c_start = c_start + c_name.length + 1;
				c_end = document.cookie.indexOf(";", c_start);

				if (c_end == -1)
				{
					c_end = document.cookie.length;
				}

				return decodeURIComponent(document.cookie.substring(c_start, c_end));
			}
		}
		else
		{
			// Look for a partial word match
			var regexp = c_name.toLowerCase() + "(.*)=";

			c_start = document.cookie.toLowerCase().search(regexp);

			if (c_start != -1)
			{
				// create new string with our search criteria at the beginning
				var s1 = document.cookie.slice(c_start);

				// Search from the beginning of this new string for "="
				c_start = s1.indexOf("=") +1;

				if (c_start != -1)	// overkill
				{
					c_end = s1.indexOf(";");

					if (c_end == -1)
					{
						c_end = s1.length;
					}

					return decodeURIComponent(s1.substring(c_start, c_end));
				}
			}
		}

	}

	return "";
}

function _cyConvertCYPropertyNamesToUpperCase()
{
	var propertyValue = "";
	for (var propertyName in cy)
	{
		propertyValue = cy[propertyName];
		delete cy[propertyName];
		cy[propertyName.toUpperCase()] = propertyValue;
	}
	return "";
}

function _cyGetWaitDuration()
{
	return cy.WAIT_DURATION;
}

function cySetWaitDuration(millis)
{
	cy.WAIT_DURATION = millis;
}

function _cyGetUpperLimitWaitDuration()
{
	return cy.UPPER_LIMIT_WAIT_DURATION;
}

function cySetUpperLimitWaitDuration(millis)
{
	cy.UPPER_LIMIT_WAIT_DURATION = millis;
}

function _cyOnImageLoad(elementId)
{
	_cyImages[elementId].loadingComplete = true;
}

function _cyGetLoaded(elementId)
{
	return _cyImages[elementId].loadingComplete;
}

function _cyOnImageAbort(elementId)
{
	_cyImages[elementId].loadingComplete = false;
}

// The doCreateHandlers parameter is an optional boolean value that, if true, means that an onLoad and onAbort handler should be
// added to the created image. In general, a value of true will be passed when an actual image is being requested and we are to
// wait on the image being loaded before carrying out the action in question.
function _cyCreateImage(doCreateHandlers)
{
	// Note - images are not removed from the document when they are no longer required. There will be only one image
	// created in most circumstances, and never enough in a realistic scenario to cause a problem.
	var cy_image = document.createElement("img");

	cy_image.id = _cyGetUniqueId();

	var createHandlers = false;
	if (doCreateHandlers && typeof(doCreateHandlers) == "boolean")
	{
		createHandlers = doCreateHandlers;
	}
	
	if (createHandlers === true)
	{
		cy_image.onload = function(){_cyOnImageLoad(cy_image.id);};
		cy_image.onabort = function(){_cyOnImageAbort(cy_image.id);};
	}
	
	cy_image.width = 1;
	cy_image.height = 1;
	cy_image.border = 0;
	
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(cy_image, s);

	return cy_image;
}

function _cySetCYProperties(/* optional */ ocy, /* optional */ cysetter)
{
	if (ocy)
	{
		for (var p in ocy)
		{
			cy[p] = ocy[p];
		}
		_cyConvertCYPropertyNamesToUpperCase();
	}
	
	if (cysetter && typeof(cysetter) == "function")
	{
		cysetter();
		_cyConvertCYPropertyNamesToUpperCase();
	}
}

function _cyTimeoutSubmit(thisForm, elementId, resetTimeout)
{
	if (resetTimeout === true && _cyIsImageLoadedOrTimedOut(elementId) === false)
	{
		// If resetTimeout = true, then we have to wait for the image to be returned from our server before
		// submitting the form. So if we haven't yet loaded the image from our server, reset the timeout function
		// so that we come back in here to check in a little while.
		
		setTimeout(function(){_cyTimeoutSubmit(thisForm, elementId, true);}, _cyGetWaitDuration());
		_cyImages[elementId].totalWaitTime += _cyGetWaitDuration();
	}
	else
	{
		// If resetTimeout is false, then we are not required to wait for the image to be returned from our server (in
		// fact, in that case, no image is actually returned). So in this case, submit the form.
		// Also, it may be that we are required to wait for the image to be loaded from our server, and that image has
		// now loaded. In this case, submit the form.
		
		thisForm.submit();
	}
}

// thisForm - the form to be submitted
// wait - boolean. If true, send our request, return actual image, wait for image to come back, wait in increments up to max duration
//                 if false, send our request (do not return an image), wait for 100ms (or whatever is configured), submit the form
function _cyOnSubmit(thisForm, wait)
{
	try
	{
		var cy_image = _cyCreateImage(wait);

		if (wait === true)
		{
			// Set a property of the _cyImages object. The property name is cy_image.id. The value of the property is an
			// object. That object has two properties, totalWaitTime and loadingComplete. These are given initial values
			// of 0 and false respectively.
			_cyImages[cy_image.id] = {totalWaitTime:0, loadingComplete:false};
		
			cy_image.src = _cyGetElementSrc("seewhy.gif");
		}
		else
		{
			cy_image.src = _cyGetElementSrc("seewhy.nogif");
		}
	
		setTimeout(function(){_cyTimeoutSubmit(thisForm, cy_image.id, wait);}, _cyGetWaitDuration());		
	}
	catch(err){}
	
	return false;
}

function cyOnSubmit(thisForm, /* optional */ doWait, /* optional */ ocy, /* optional */ cysetter)
{
	try
	{
		_cySetCYProperties(ocy, cysetter);

		waitOnImage = false;
		if (doWait && typeof(doWait) == "boolean")
		{
			waitOnImage = doWait;
		}
	}
	catch(err){}
	
	return _cyOnSubmit(thisForm, waitOnImage);
}

function _cyIsImageLoadedOrTimedOut(elementId)
{
	if ((_cyImages[elementId].totalWaitTime > _cyGetUpperLimitWaitDuration()) ||
	    (document.getElementById(elementId).complete === true && _cyGetLoaded(elementId) === true))
	{
		return true;
	}

	return false;
}

// This function should not be used with impunity
function _cyWait(millis)
{
	var start = new Date().getTime();
	while(new Date().getTime() < (start+millis)) {
	}
}

function cyOnPageLoad(/* optional */ isBlocking, /* optional */ doDelay, /* optional */ ocy, /* optional */ cysetter)
{
	var block = false;
	if (isBlocking && typeof(isBlocking) == "boolean")
	{
		block = isBlocking;
	}

	try
	{
		_cySetCYProperties(ocy, cysetter);
		
		if (block === true)
		{
			src = _cyGetElementSrc("seewhy.js");

			// Doing a document.write requires that it be done before the page has finished loading (otherwise we will completely
			// overwrite the page with the output of the document.write call).

			if (document.readyState)
			{
				if (document.readyState != "complete")
				{
					document.write('<script type="text/javascript" src="',src,'"><\/script>');
				}
			}
			else
			{
				document.write('<script type="text/javascript" src="',src,'"><\/script>');
			}
		}
		else
		{
			var cy_image = _cyCreateImage(false);

			cy_image.src = _cyGetElementSrc("seewhy.nogif");
		}

		var delay = false;
		if (doDelay && typeof(doDelay) == "boolean")
		{
			delay = doDelay;
		}

		if (delay === true)
		{
			_cyWait(_cyGetWaitDuration());
		}
	}
	catch(err){}
}

function _cyTimeoutLink(anchor, elementId, resetTimeout)
{
	if (resetTimeout === true && _cyIsImageLoadedOrTimedOut(elementId) === false)
	{
		setTimeout(function(){_cyTimeoutLink(anchor, elementId, true);}, _cyGetWaitDuration());
		_cyImages[elementId].totalWaitTime += _cyGetWaitDuration();
	}
	else
	{
		if (anchor && anchor.href)
		{
			_cyNavigate(anchor.href);
		}
	}
}

function cyOnLink(anchor, /* optional */doWait, /* optional */ ocy, /* optional */ cysetter)
{
	var wait = false;
	if (doWait && typeof(doWait) == "boolean")
	{
		wait = doWait;
	}
	
	try
	{
		_cySetCYProperties(ocy, cysetter);
		
		var cy_image = _cyCreateImage(wait);

		if (wait)
		{
			_cyImages[cy_image.id] = {totalWaitTime:0, loadingComplete:false};
			cy_image.src = _cyGetElementSrc("seewhy.gif");
		}
		else
		{
			cy_image.src = _cyGetElementSrc("seewhy.nogif");
		}
		
		setTimeout(function(){_cyTimeoutLink(anchor, cy_image.id, wait);}, _cyGetWaitDuration());
	}
	catch(err){}
	
	// Returning false stops the browser from following the link as a consequence of the user clicking the link. The link will
	// be followed when the timeout code is invoked.
	return false;
}

function cyOnClick(/* optional */ doDelay, /* optional */ ocy, /* optional */ cysetter)
{
	try
	{
		_cySetCYProperties(ocy, cysetter);
		
		var cy_image = _cyCreateImage(false);

		cy_image.src = _cyGetElementSrc("seewhy.nogif");

		var delay = false;
		if (doDelay && typeof(doDelay) == "boolean")
		{
			delay = doDelay;
		}
		
		if (delay)
		{
			_cyWait(_cyGetWaitDuration());
		}
	}
	catch(err){}
}

function cyOnChange(/* optional */ doDelay, /* optional */ ocy, /* optional */ cysetter)
{
	try
	{
		_cySetCYProperties(ocy, cysetter);

		var cy_image = _cyCreateImage(false);

		cy_image.src = _cyGetElementSrc("seewhy.nogif");

		var delay = false;
		if (doDelay && typeof(doDelay) == "boolean")
		{
			delay = doDelay;
		}
		
		if (delay)
		{
			_cyWait(_cyGetWaitDuration());
		}
	}
	catch(err){}
}

function _cyGetDT()
{
	var d = new Date();
	var t = d.getTime();
	var tz = d.getTimezoneOffset();
	
	return t+"~"+tz;
}

function _getBaseURL(/* optional */ res)
{
	var resource="seewhy.gif";
	if (res)
	{
		resource = res;
	}

	var protocol;
	var port;
	var swd='abandonment.saas.seewhy.com';
	var path='/abandonment2/WE/' +resource;
	var ssl = window.location.protocol.toLowerCase().indexOf('https') >= 0;
	if (ssl)
	{
		protocol='https';
		port=443;
	}
	else
	{
		protocol='http';
		port=80;
	}
	var swi = protocol+'://'+swd+':'+port+path;
	var rn = Math.random();
	
	return swi+"/"+rn;
}

function _cyGetElementSrc(res)
{
	_cyConvertCYPropertyNamesToUpperCase();
	var baseURL = _getBaseURL(res);
	
	var sessionId = _cyGetSessionId();
	
	var csData='';
	if (_cyIsCSSession() == true)
	{
		if (cy.CSM == 0)
		{
			csData = "&ClickstreamFlag=2&ClickstreamSessionID=" +cy.CSSID;
		}
	}
	else
	{
		csData = "&ClickstreamFlag=0";
	}
	
	var queryString="?Event=WebEvent"+
			"&CustomerCode=" +cy.CUSTOMERCODE+
			"&Server=" +cy.DOCUMENTDOMAIN+
			"&DefaultPageName=" +encodeURIComponent(cy.LOCATIONPATHNAME)+
			"&Referrer=" +encodeURIComponent(cy.DOCUMENTREFERRER)+
			"&SessionID=" +encodeURIComponent(sessionId)+
			"&FunnelLevel=" +encodeURIComponent((cy.FUNNELLEVEL==undefined) ? cy_defaults.FunnelLevel : cy.FUNNELLEVEL)+
			"&Section=" +encodeURIComponent((cy.SECTION==undefined) ? cy_defaults.Section : cy.SECTION)+
			"&UserID=" +encodeURIComponent((cy.USERID==undefined) ? cy_defaults.UserId : cy.USERID)+
			"&Product=" +encodeURIComponent((cy.PRODUCT==undefined) ? cy_defaults.Product : cy.PRODUCT)+
			"&Quantity=" +encodeURIComponent((cy.QUANTITY==undefined) ? cy_defaults.Quantity : cy.QUANTITY)+
			"&OrderNumber=" +encodeURIComponent((cy.ORDERNUMBER==undefined) ? cy_defaults.OrderNumber : cy.ORDERNUMBER)+
			"&Value=" +encodeURIComponent((cy.VALUE==undefined) ? cy_defaults.Value : cy.VALUE)+
			"&PageName=" +encodeURIComponent((cy.PAGENAME==undefined) ? cy_defaults.PageName : cy.PAGENAME)+
			"&ReturnToLink=" +encodeURIComponent((cy.RETURNTOLINK==undefined) ? cy_defaults.ReturnToLink : cy.RETURNTOLINK)+
			"&Custom1=" +encodeURIComponent((cy.CUSTOM1==undefined) ? cy_defaults.Custom1 : cy.CUSTOM1)+
			"&Custom2=" +encodeURIComponent((cy.CUSTOM2==undefined) ? cy_defaults.Custom2 : cy.CUSTOM2)+
			"&Custom3=" +encodeURIComponent((cy.CUSTOM3==undefined) ? cy_defaults.Custom3 : cy.CUSTOM3)+
			"&Custom4=" +encodeURIComponent((cy.CUSTOM4==undefined) ? cy_defaults.Custom4 : cy.CUSTOM4)+
			"&Custom5=" +encodeURIComponent((cy.CUSTOM5==undefined) ? cy_defaults.Custom5 : cy.CUSTOM5)+
			"&Custom6=" +encodeURIComponent((cy.CUSTOM6==undefined) ? cy_defaults.Custom6 : cy.CUSTOM6)+
			"&Custom7=" +encodeURIComponent((cy.CUSTOM7==undefined) ? cy_defaults.Custom7 : cy.CUSTOM7)+
			"&Custom8=" +encodeURIComponent((cy.CUSTOM8==undefined) ? cy_defaults.Custom8 : cy.CUSTOM8)+
			"&Custom9=" +encodeURIComponent((cy.CUSTOM9==undefined) ? cy_defaults.Custom9 : cy.CUSTOM9)+
			"&Custom10=" +encodeURIComponent((cy.CUSTOM10==undefined) ? cy_defaults.Custom10 : cy.CUSTOM10)+
			"&Custom11=" +encodeURIComponent((cy.CUSTOM11==undefined) ? cy_defaults.Custom11 : cy.CUSTOM11)+
			"&Custom12=" +encodeURIComponent((cy.CUSTOM12==undefined) ? cy_defaults.Custom12 : cy.CUSTOM12)+
			"&Custom13=" +encodeURIComponent((cy.CUSTOM13==undefined) ? cy_defaults.Custom13 : cy.CUSTOM13)+
			"&Custom14=" +encodeURIComponent((cy.CUSTOM14==undefined) ? cy_defaults.Custom14 : cy.CUSTOM14)+
			"&Custom15=" +encodeURIComponent((cy.CUSTOM15==undefined) ? cy_defaults.Custom15 : cy.CUSTOM15)+
			"&Custom16=" +encodeURIComponent((cy.CUSTOM16==undefined) ? cy_defaults.Custom16 : cy.CUSTOM16)+
			"&Custom17=" +encodeURIComponent((cy.CUSTOM17==undefined) ? cy_defaults.Custom17 : cy.CUSTOM17)+
			"&Custom18=" +encodeURIComponent((cy.CUSTOM18==undefined) ? cy_defaults.Custom18 : cy.CUSTOM18)+
			"&Custom19=" +encodeURIComponent((cy.CUSTOM19==undefined) ? cy_defaults.Custom19 : cy.CUSTOM19)+
			"&Custom20=" +encodeURIComponent((cy.CUSTOM20==undefined) ? cy_defaults.Custom20 : cy.CUSTOM20)+
			csData+
			"&ClientTimeAndTZ=" +_cyGetDT()+
			"&Version=" +cy._VERSION + 
			_cyGetBasketLinesQueryString() + 
			"&BasketAppend=" + cy.BASKETAPPEND;

	var src = baseURL+queryString;
	//alert(src);
	return src;
}

function cySetSessionDetails(sessionIdName, /* optional */ suffixAllowed)
{
	var isSuffixAllowed = false;
	if (suffixAllowed && typeof(suffixAllowed) == "boolean")
	{
		isSuffixAllowed = suffixAllowed;
	}
	cySessionIdDetails = {sessionKeyName:sessionIdName, sessionKeySuffixAllowed:isSuffixAllowed};
}

function _cyGetSessionId()
{
	var sessionId;

	if (cy.SESSIONID != null)
	{
		sessionId = cy.SESSIONID;
	}
	else
	{
		if (cyGenerateSessionId === true)
		{
			sessionId = _cyGetGeneratedSessionId();
		}
		else
		{
			if (cySessionIdDetails && cySessionIdDetails.sessionKeyName)
			{
				sessionId = _cyGetCookie(cySessionIdDetails.sessionKeyName, cySessionIdDetails.sessionKeySuffixAllowed);
			}
			else
			{
				var sessionId = _cyGetCookie("JSESSIONID", false);
				if (sessionId == "")
				{
					sessionId = _cyGetCookie("ASPSESSIONID", true);
				}
				if (sessionId == "")
				{
					sessionId = _cyGetCookie("PHPSESSID", false);
				}
				if (sessionId == "")
				{
					sessionId = _cyGetCookie("ASP.NET_SessionId", false);
				}
				if (sessionId == "")
				{
					sessionId = _cyGetCookie("sid", false);
				}
				if (sessionId == "")
				{
					sessionId = _cyGetCookie("SESS", true);
				}
			}
		}
	}
	
	return sessionId;
}

function _cyGetGeneratedSessionId()
{
	var cyd;
	
	cyd = _cyGetCookie("__cy_d", false);
	
	if (cyd == "")
	{
		cyd = _cyGenerateUUID();
	}
	
	_cyCreateClientCookie("__cy_d", cyd, (60*60*24*365*2));
	
	return cyd;
}

function _cyGenerateUUID()
{
	// Generate an RFC 4122 compliant version 4 UUID
	return 'NNNNNNNN-NNNN-4NNN-XNNN-NNNNNNNNNNNN'.replace(/[NX]/g,
							      function(c) {
									var rn = Math.floor(Math.random()*16);
									if (c == 'N')
									{
										v = rn;
									}
									else
									{
										// 0 <= rn < 16, but RFC 4122 requires that the 2 most sig bits be 1 and 0
										v = (rn&0x3|0x8);
									}
									return v.toString(16);
								}).toUpperCase();
}

// maxage in seconds
function _cyCreateClientCookie(cookieName, cookieValue, /* optional */ maxage)
{
	/* Removed cookie creation for SeeWhy integration to avoid issues
	 * where customers have lost sessions due to cookie flooding */
}

// Backwards compatibility. The cy_getImageSrc function is used for Page Load events. Page Load events do not require an image event
// handler, and therefore there is no need to add one dynamically here.
function cy_getImageSrc()
{
	// Non-blocking, non-waiting call used in the backwards compatibility version
	cyOnPageLoad(false, false);
}

function _getCSSampleRate()
{
	return cy.CSSR;
}

function _cyCreateClickStreamCookie(isCS)
{
	var css_c_val;
	if (isCS)
	{
		var css_id = _cyGenerateUUID();
		cy.cssid = css_id;
		css_c_val = "1:" + css_id;
	}
	else
	{
		css_c_val = "0:";
	}
	_cyCreateClientCookie("__cy_e", css_c_val);
}

function _cyIsCSSession()
{
	if (cy.CSSESSIONFLAG == -1)
	{
		cy.CSSESSIONFLAG = _cyCSSession() == true ? 1 : 0;
	}
	return cy.CSSESSIONFLAG == 1 ? true : false;
}

function _cyCSSession()
{
	var sr = _getCSSampleRate();
	
	if (sr <= 0) {
		return false;
	}

	var css = false;
	var cssid = _cyGetCookie("__cy_e", false);
	
	if (cssid != "")
	{
		cssid_details = [];
		cssid_details = cssid.split(':');
		if (cssid_details.length > 0)
		{
			is_css = cssid_details[0];
			if (is_css == 1)
			{
				css = true;
				if (cssid_details.length > 1) {
					cy.cssid = cssid_details[1];
				}
				else {
					css = _cyClickStreamCookie();
				}
			}
		}
		else {
			css = _cyClickStreamCookie();
		}
	}
	else
	{
		var rn = Math.random();
		if (rn < sr)
		{
			_cyCreateClickStreamCookie(true);
			css = true;
		}
		else {
			_cyCreateClickStreamCookie(false);
		}
	}

	return css;
}

function _cyClickStreamCookie()
{
	var css = false;
	var rn = Math.random();
	if (rn < sr)
	{
		_cyCreateClickStreamCookie(true);
		css = true;
	}
	else {
		_cyCreateClickStreamCookie(false);
	}
	
	return css;
}

function _cyCS()
{
	if (_cyIsCSSession() == true)
	{
		cy.CSM == 1 ? _cyCS1() : _cyCS0();
	}
}

function _cyCS0()
{
	_cyConvertCYPropertyNamesToUpperCase();
	
	var baseURL = _getBaseURL();
	var ref = encodeURIComponent(cy.DOCUMENTREFERRER);

	var queryString="?Event=WebEvent"+
			"&CustomerCode=" +cy.CUSTOMERCODE+
			"&DefaultPageName=" +encodeURIComponent(cy.LOCATIONPATHNAME)+
			"&Referrer=" +encodeURIComponent(cy.DOCUMENTREFERRER)+
			"&ClickstreamSessionID=" +cy.CSSID+
			"&ClientTimeAndTZ=" +_cyGetDT()+
			"&FunnelLevel=0"+
			"&ClickstreamFlag=1"+
			"&Version=" +cy._VERSION;

	var src = baseURL+queryString;
	
	var cy_image = _cyCreateImage(false);
	cy_image.src = src;
}

function _cyCS1()
{
}

function _cyFormatLineNumber(iLineNumber)
{
  var strLineNumber;
  iLineNumber < 10?(strLineNumber = '00' + iLineNumber):iLineNumber < 100?(strLineNumber = '0' + iLineNumber):(strLineNumber = '' + iLineNumber);
  return strLineNumber;
}

function _cyGetBasketDetailNameFromKeyStartingAt(strValue, iStartPosition)
{
  var iEqualsStartPosition, iLineNameStartPosition, strLineName;
  iLineNameStartPosition = iStartPosition + 7;
  iEqualsStartPosition = strValue.indexOf(':', iStartPosition);
  strLineName = strValue.substr(iLineNameStartPosition, iEqualsStartPosition - iLineNameStartPosition);
  return strLineName;
}

function _cyGetBasketDetailValueFromKeyStartingAt(strValue, iStartPosition)
{
  var iKVDelimiterStartPosition, iPairDelimiterStartPosition, strLineValue;
  iKVDelimiterStartPosition = strValue.indexOf(':', iStartPosition);
  iPairDelimiterStartPosition = strValue.indexOf('&', iStartPosition);
  iPairDelimiterStartPosition == -1?(strLineValue = strValue.substr(iKVDelimiterStartPosition + 1, strValue.length - (iKVDelimiterStartPosition + 1))):(strLineValue = strValue.substr(iKVDelimiterStartPosition + 1, iPairDelimiterStartPosition - (iKVDelimiterStartPosition + 1)));
  return strLineValue;
}

function _cyGetNextBasketLineNumber()
{
  var iCurrentLineNumber, iHighestLineNumber, iNextStartPosition, iPos, strBasketLineCookieValue, strLineNumber, iLineNumberStartPosition;
  iNextStartPosition = 0;
  iHighestLineNumber = 0;
  strBasketLineCookieValue = _cyGetBasketLineCookieValue();
  while ((iPos = strBasketLineCookieValue.indexOf('CYBK', iNextStartPosition)) != -1)
  {
    strLineNumber = (iLineNumberStartPosition = iPos + 4 , strBasketLineCookieValue.substr(iLineNumberStartPosition, iLineNumberStartPosition + 3 - iLineNumberStartPosition));
    iCurrentLineNumber = parseInt(strLineNumber, 10);
    iCurrentLineNumber > iHighestLineNumber && (iHighestLineNumber = iCurrentLineNumber);
    iNextStartPosition = iPos + 1;
  }
  return _cyFormatLineNumber(iHighestLineNumber + 1);
}

function _cyGetNextBasketLineNumberInt()
{
  var strNextLineNumber;
  var iNextLineNumber;

  strNextLineNumber = _cyGetNextBasketLineNumber();
  iNextLineNumber = parseInt(strNextLineNumber, 10);

  return iNextLineNumber;
}

function _cyInsertBasketLineValue(strBeforeLineNumber, strInsertionName, strInsertionValue)
{
  var blnFirst, iCurrentLineNumber, iInsertionPointLineNumber, iNextStartPosition, iPos, strBasketLineCookieValue, strDetailsToKeep, strLineNumber, strName, strValue, iLineNumberStartPosition;
  iNextStartPosition = 0;
  strDetailsToKeep = '';
  blnFirst = true;
  strBasketLineCookieValue = _cyGetBasketLineCookieValue();
  if (strBasketLineCookieValue != null)
  {
    iInsertionPointLineNumber = parseInt(strBeforeLineNumber, 10);
    while ((iPos = strBasketLineCookieValue.indexOf('CYBK', iNextStartPosition)) != -1)
    {
      strLineNumber = (iLineNumberStartPosition = iPos + 4 , strBasketLineCookieValue.substr(iLineNumberStartPosition, iLineNumberStartPosition + 3 - iLineNumberStartPosition));
      strName = _cyGetBasketDetailNameFromKeyStartingAt(strBasketLineCookieValue, iPos);
      strValue = _cyGetBasketDetailValueFromKeyStartingAt(strBasketLineCookieValue, iPos);
      iNextStartPosition = iPos + 1;
      iCurrentLineNumber = parseInt(strLineNumber, 10);
      iCurrentLineNumber >= iInsertionPointLineNumber && ++iCurrentLineNumber;
      blnFirst || (strDetailsToKeep = strDetailsToKeep + '&');
      strDetailsToKeep = strDetailsToKeep + 'CYBK';
      strDetailsToKeep = strDetailsToKeep + _cyFormatLineNumber(iCurrentLineNumber);
      strDetailsToKeep = strDetailsToKeep + strName;
      strDetailsToKeep = strDetailsToKeep + ':';
      strDetailsToKeep = strDetailsToKeep + strValue;
      blnFirst = false;
    }
    _cySetBasketLineCookieValue(strDetailsToKeep);
  }
  _cyUpdateBasketLineValue(strBeforeLineNumber, strInsertionName, strInsertionValue);
}

function _cyInsertBasketLineValueInt(iBeforeLineNumber, strInsertionName, strInsertionValue)
{
  _cyInsertBasketLineValue(_cyFormatLineNumber(iBeforeLineNumber), strInsertionName, strInsertionValue);
}

function _cyRemoveBasketLine(strLineNumberToRemove)
{
  var blnFirst, iCurrentLineNumber, iLineNumberToRemove, iNextStartPosition, iPos, strBasketLineCookieValue, strDetailsToKeep, strLineNumber, strName, strValue, iLineNumberStartPosition;
  iNextStartPosition = 0;
  strDetailsToKeep = '';
  blnFirst = true;
  strBasketLineCookieValue = _cyGetBasketLineCookieValue();
  if (strBasketLineCookieValue != null)
  {
    iLineNumberToRemove = parseInt(strLineNumberToRemove, 10);
    while ((iPos = strBasketLineCookieValue.indexOf('CYBK', iNextStartPosition)) != -1)
    {
      strLineNumber = (iLineNumberStartPosition = iPos + 4 , strBasketLineCookieValue.substr(iLineNumberStartPosition, iLineNumberStartPosition + 3 - iLineNumberStartPosition));
      strName = _cyGetBasketDetailNameFromKeyStartingAt(strBasketLineCookieValue, iPos);
      strValue = _cyGetBasketDetailValueFromKeyStartingAt(strBasketLineCookieValue, iPos);
      iNextStartPosition = iPos + 1;
      iCurrentLineNumber = parseInt(strLineNumber, 10);
      if (iLineNumberToRemove != iCurrentLineNumber)
      {
        iCurrentLineNumber > iLineNumberToRemove && --iCurrentLineNumber;
        blnFirst || (strDetailsToKeep = strDetailsToKeep + '&');
        strDetailsToKeep = strDetailsToKeep + 'CYBK';
        strDetailsToKeep = strDetailsToKeep + _cyFormatLineNumber(iCurrentLineNumber);
        strDetailsToKeep = strDetailsToKeep + strName;
        strDetailsToKeep = strDetailsToKeep + ':';
        strDetailsToKeep = strDetailsToKeep + strValue;
        blnFirst = false;
      }
    }
    _cySetBasketLineCookieValue(strDetailsToKeep);
  }
}

function _cyRemoveBasketLineInt(iLineNumberToRemove)
{
  _cyRemoveBasketLine(_cyFormatLineNumber(iLineNumberToRemove));
}

function _cyRemoveBasketLineValue(strLineNumberOfValue, strNameOfValue)
{
  var blnDetailsStillExistForLine, blnFirst, iNextStartPosition, iPos, strBasketLineCookieValue, strDetailsToKeep, strLineNumber, strName, strValue, iLineNumberStartPosition;
  iNextStartPosition = 0;
  strDetailsToKeep = '';
  blnFirst = true;
  blnDetailsStillExistForLine = false;
  strBasketLineCookieValue = _cyGetBasketLineCookieValue();
  if (strBasketLineCookieValue != null) 
  {
    while ((iPos = strBasketLineCookieValue.indexOf('CYBK', iNextStartPosition)) != -1) 
    {
      strLineNumber = (iLineNumberStartPosition = iPos + 4 , strBasketLineCookieValue.substr(iLineNumberStartPosition, iLineNumberStartPosition + 3 - iLineNumberStartPosition));
      strName = _cyGetBasketDetailNameFromKeyStartingAt(strBasketLineCookieValue, iPos);
      strValue = _cyGetBasketDetailValueFromKeyStartingAt(strBasketLineCookieValue, iPos);
      iNextStartPosition = iPos + 1;
      if (compareTo(strLineNumber, strLineNumberOfValue) != 0 || compareTo(strName, strNameOfValue) != 0) 
      {
        compareTo(strLineNumber, strLineNumberOfValue) == 0 && (blnDetailsStillExistForLine = true);
        blnFirst || (strDetailsToKeep = strDetailsToKeep + '&');
        strDetailsToKeep = strDetailsToKeep + 'CYBK';
        strDetailsToKeep = strDetailsToKeep + strLineNumber;
        strDetailsToKeep = strDetailsToKeep + strName;
        strDetailsToKeep = strDetailsToKeep + ':';
        strDetailsToKeep = strDetailsToKeep + strValue;
        blnFirst = false;
      }
    }
    _cySetBasketLineCookieValue(strDetailsToKeep);
    blnDetailsStillExistForLine || _cyRemoveBasketLine(strLineNumberOfValue);
  }
  
  return !blnDetailsStillExistForLine;
}

function _cyRemoveBasketLineValueInt(iLineNumberOfValue, strNameOfValue)
{
  return _cyRemoveBasketLineValue(_cyFormatLineNumber(iLineNumberOfValue), strNameOfValue);
}

function _cyUpdateBasketLineValue(strLineNumber, strKey, strValue)
{
  var blnLineRemoved = false;
  var strBasketLineCookieValue, strDetailsToKeep;
  strBasketLineCookieValue = _cyGetBasketLineCookieValue();

  if (strBasketLineCookieValue.indexOf('CYBK000') != -1)
  {
    _cyRemoveBasketLine('000');
    strBasketLineCookieValue = _cyGetBasketLineCookieValue();
  }

  if (strBasketLineCookieValue.indexOf('CYBK' + strLineNumber + strKey) != -1)
  {
    blnLineRemoved = _cyRemoveBasketLineValue(strLineNumber, strKey);
  }

  if( blnLineRemoved == true )
  {
    _cyInsertBasketLineValue(strLineNumber, strKey, strValue);
  }
  else
  {
    strBasketLineCookieValue = _cyGetBasketLineCookieValue();

    strBasketLineCookieValue == null && (strBasketLineCookieValue = '');
    
    strDetailsToKeep = '' + strBasketLineCookieValue;
    compareTo(strBasketLineCookieValue, '') != 0 && (strDetailsToKeep = strDetailsToKeep + '&');
    strDetailsToKeep = strDetailsToKeep + 'CYBK';
    strDetailsToKeep = strDetailsToKeep + strLineNumber;
    strDetailsToKeep = strDetailsToKeep + strKey;
    strDetailsToKeep = strDetailsToKeep + ':';
    strDetailsToKeep = strDetailsToKeep + encodeURIComponent(strValue);
    _cySetBasketLineCookieValue(strDetailsToKeep);
  }
}

function _cyUpdateBasketLineValueInt(iLineNumber, strKey, strValue)
{
  _cyUpdateBasketLineValue(_cyFormatLineNumber(iLineNumber), strKey, strValue);
}


function _cyEmptyTheServerBasket()
{
  _cyUpdateBasketLineValue('000', 'Empty', 'TheBasket');
}

function _cyEmptyTheClientBasket()
{
  _cySetBasketLineCookieValue('');
}

function _cySetBasketLineCookieValue(strValue)
{
  cyPageBasket = strValue;
  _cyCreateClientCookie('_cybskt', strValue);
}

function _cyGetBasketLineCookieValue()
{
  var strValue = '';

  if( cyPageBasket == '' )
  {
    strValue = _cyGetCookie('_cybskt', false);
  }
  else
  {
    strValue = cyPageBasket;
  }

  return strValue;
}

function _cyGetBasketLinesQueryString()
{
  var strValue = '';
  
  strValue = _cyGetBasketLineCookieValue();
  _cySetBasketLineCookieValue('');
  _cySetCurrentLineNumberCookieValue('');

  if( strValue != undefined && strValue != null && strValue != '' )
  {
    strValue = $replaceAll(strValue, ':', '=');
    strValue = "&" + strValue;
  }

  return strValue;
}

function $replaceAll(strValue, regex, replace)
{
  replace = __translateReplaceString(replace);
  return strValue.replace(RegExp(regex, 'g'), replace);
}

function __translateReplaceString(replaceStr)
{
  var pos;
  pos = 0;
  while (0 <= (pos = replaceStr.indexOf('\\', pos)))
  {
    replaceStr.charCodeAt(pos + 1) == 36?(replaceStr = replaceStr.substr(0, pos - 0) + '$' + $substring(replaceStr, ++pos)):(replaceStr = replaceStr.substr(0, pos - 0) + $substring(replaceStr, ++pos));
  }
  return replaceStr;
}

function compareTo(thisStr, otherStr)
{
  thisStr = String(thisStr);
  if (thisStr == otherStr)
  {
    return 0;
  }
  return thisStr < otherStr?-1:1;
}

function _cySetCurrentLineNumberCookieValue(strValue)
{
  cyCurrLineNumber = strValue;
  _cyCreateClientCookie('_cycurrln', strValue);
}

function _cyGetCurrentLineNumberCookieValue()
{
  var strValue = '';

  if( cyCurrLineNumber == '' )
  {
    strValue = _cyGetCookie('_cycurrln', false);
  }
  else
  {
    strValue = cyCurrLineNumber;
  }

  return strValue;
}

function cyNewBasketLine()
{
  var strLineNumber = '';

  strLineNumber = _cyGetNextBasketLineNumber();

  _cySetCurrentLineNumberCookieValue(strLineNumber);
}

function cyAddBasketLineDetail(strKey, strValue)
{
  var strLineNumber = '';

  strLineNumber = _cyGetCurrentLineNumberCookieValue();

  if( strLineNumber == undefined || strLineNumber == null || strLineNumber == '' )
  {
  	cyNewBasketLine();
  	strLineNumber = _cyGetCurrentLineNumberCookieValue();
  }

  _cyUpdateBasketLineValue(strLineNumber, strKey, strValue);
}

function cyRemoveCurrentBasketLine()
{
  var strLineNumber = '';

  strLineNumber = _cyGetCurrentLineNumberCookieValue();

  if( strLineNumber != undefined && strLineNumber != null && strLineNumber != '' )
  {
    _cyRemoveBasketLine(strLineNumberToRemove)
  }
}

function cyClientSideBasketReset()
{
  _cySetCurrentLineNumberCookieValue('');
  _cyEmptyTheClientBasket();
}

function cyServerSideBasketReset()
{
  _cyEmptyTheServerBasket();
}

app.define&&app.define('vendor/web-event', function () {
    return cy;
});
/*_cyCS();*/