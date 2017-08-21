/* eslint-disable */
/* fetch 1.0.0 from https://cdnjs.cloudflare.com/ajax/libs/fetch/1.0.0/fetch.js */
(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
	new Blob()
	return true
      } catch(e) {
	return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
	var value = items.shift()
	return {done: value === undefined, value: value}
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
	return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
	this.append(name, value)
      }, this)

    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
	this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var list = this.map[name]
    if (!list) {
      list = []
      this.map[name] = list
    }
    list.push(value)
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    var values = this.map[normalizeName(name)]
    return values ? values[0] : null
  }

  Headers.prototype.getAll = function(name) {
    return this.map[normalizeName(name)] || []
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = [normalizeValue(value)]
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    Object.getOwnPropertyNames(this.map).forEach(function(name) {
      this.map[name].forEach(function(value) {
	callback.call(thisArg, value, name, this)
      }, this)
    }, this)
  }

  Headers.prototype.keys = function() {
    var items = []
    this.forEach(function(value, name) { items.push(name) })
    return iteratorFor(items)
  }

  Headers.prototype.values = function() {
    var items = []
    this.forEach(function(value) { items.push(value) })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function() {
    var items = []
    this.forEach(function(value, name) { items.push([name, value]) })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
	resolve(reader.result)
      }
      reader.onerror = function() {
	reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    reader.readAsArrayBuffer(blob)
    return fileReaderReady(reader)
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    reader.readAsText(blob)
    return fileReaderReady(reader)
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function(body) {
      this._bodyInit = body
      if (typeof body === 'string') {
	this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
	this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
	this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	this._bodyText = body.toString()
      } else if (!body) {
	this._bodyText = ''
      } else if (support.arrayBuffer && ArrayBuffer.prototype.isPrototypeOf(body)) {
	// Only support ArrayBuffers for POST method.
	// Receiving ArrayBuffers happens via Blobs, instead.
      } else {
	throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
	if (typeof body === 'string') {
	  this.headers.set('content-type', 'text/plain;charset=UTF-8')
	} else if (this._bodyBlob && this._bodyBlob.type) {
	  this.headers.set('content-type', this._bodyBlob.type)
	} else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	  this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
	}
      }
    }

    if (support.blob) {
      this.blob = function() {
	var rejected = consumed(this)
	if (rejected) {
	  return rejected
	}

	if (this._bodyBlob) {
	  return Promise.resolve(this._bodyBlob)
	} else if (this._bodyFormData) {
	  throw new Error('could not read FormData body as blob')
	} else {
	  return Promise.resolve(new Blob([this._bodyText]))
	}
      }

      this.arrayBuffer = function() {
	return this.blob().then(readBlobAsArrayBuffer)
      }

      this.text = function() {
	var rejected = consumed(this)
	if (rejected) {
	  return rejected
	}

	if (this._bodyBlob) {
	  return readBlobAsText(this._bodyBlob)
	} else if (this._bodyFormData) {
	  throw new Error('could not read FormData body as text')
	} else {
	  return Promise.resolve(this._bodyText)
	}
      }
    } else {
      this.text = function() {
	var rejected = consumed(this)
	return rejected ? rejected : Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
	return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body
    if (Request.prototype.isPrototypeOf(input)) {
      if (input.bodyUsed) {
	throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
	this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body) {
	body = input._bodyInit
	input.bodyUsed = true
      }
    } else {
      this.url = input
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this)
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
	var split = bytes.split('=')
	var name = split.shift().replace(/\+/g, ' ')
	var value = split.join('=').replace(/\+/g, ' ')
	form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function headers(xhr) {
    var head = new Headers()
    var pairs = (xhr.getAllResponseHeaders() || '').trim().split('\n')
    pairs.forEach(function(header) {
      var split = header.trim().split(':')
      var key = split.shift().trim()
      var value = split.join(':').trim()
      head.append(key, value)
    })
    return head
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = options.status
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = options.statusText
    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers
  self.Request = Request
  self.Response = Response

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request
      if (Request.prototype.isPrototypeOf(input) && !init) {
	request = input
      } else {
	request = new Request(input, init)
      }

      var xhr = new XMLHttpRequest()

      function responseURL() {
	if ('responseURL' in xhr) {
	  return xhr.responseURL
	}

	// Avoid security warnings on getResponseHeader when not allowed by CORS
	if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
	  return xhr.getResponseHeader('X-Request-URL')
	}

	return
      }

      xhr.onload = function() {
	var options = {
	  status: xhr.status,
	  statusText: xhr.statusText,
	  headers: headers(xhr),
	  url: responseURL()
	}
	var body = 'response' in xhr ? xhr.response : xhr.responseText
	resolve(new Response(body, options))
      }

      xhr.onerror = function() {
	reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function() {
	reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
	xhr.withCredentials = true
      }

      if ('responseType' in xhr && support.blob) {
	xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
	xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);
/* End fetch */
/* eslint-enable */

/* global fetch, CustomEvent */
if (window.dw && window.dw.applepay && window.ApplePaySession && window.ApplePaySession.canMakePayments()) {
	(function (config, location, ApplePaySession) {
		/** Used version of ApplePaySession */
		var APPLE_PAY_VERSION = 1;

		/** CSS class name indicating an element was processed by a directive */
		var CLASS_PROCESSED = 'dw-apple-pay-processed';

		/** Name of the SKU element attribute indicating add to basket */
		var ATTR_SKU = 'sku';

		/** Left hand side of cookie indicating to update the Apple Pay request. */
		var UPDATE_REQUEST_COOKIE_LHS = '; dwapupreq=';

		/** Map of Demandware status names to Apple Pay status codes */
		var STATUSES = {
			Failure: ApplePaySession.STATUS_FAILURE,
			InvalidBillingPostalAddress: ApplePaySession.STATUS_INVALID_BILLING_POSTAL_ADDRESS,
			InvalidShippingPostalAddress: ApplePaySession.STATUS_INVALID_SHIPPING_POSTAL_ADDRESS,
			InvalidShippingContact: ApplePaySession.STATUS_INVALID_SHIPPING_CONTACT,
			PINRequired: ApplePaySession.STATUS_PIN_REQUIRED,
			PINIncorrect: ApplePaySession.STATUS_PIN_INCORRECT,
			PINLockout: ApplePaySession.STATUS_PIN_LOCKOUT
		};

		if (location.protocol !== 'https:' || !ApplePaySession.supportsVersion(APPLE_PAY_VERSION)) {
			return;
		}
		var action = config.action;
		var inject = config.inject;

		/** Last value of the cookie indicating to update the Apple Pay request. */
		var lastUpdateRequestCookie = '';

		/** URL to which to redirect if the Apple Pay session is aborted. */
		var redirect;

		/** Latest Apple Pay request data to use to create a session. */
		var request;
		
		/** Request object that gets updated with new data from server responses. */
		var updatedRequest;

		/** Current Apple Pay session. */
		var session;

		function hasClass (element, className) {
			return (' ' + element.className + ' ').replace(/[\t\r\n\f]/g, ' ').indexOf(' ' + className + ' ') > -1;
		}

		function mapStatus (status) {
			if (status && STATUSES[status]) {
				return STATUSES[status];
			}
			return ApplePaySession.STATUS_FAILURE;
		}

		function handleResponse (response) {
			return response.json()
				.then(function (json) {
					if (response.status >= 200 && response.status < 300) {
						// Return success JSON response
						return json;
					}

					// Throw error with response status
					var err = new Error(json ? json.status : 'Request error');
					err.response = json;
					throw err;
				});
		}

		function postJson (url, data) {
			var json = data;
			if (typeof data === 'object') {
				json = JSON.stringify(data);
			} else if (typeof data !== 'string') {
				throw new Error('Data must be an object or a JSON string.');
			}
			return fetch(url, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				body: json
			}).then(handleResponse);
		}

		function getJson (url) {
			return fetch(url, {
				credentials: 'include',
				headers: {
					'Accept': 'application/json'
				}
			}).then(handleResponse);
		}

		/* Filter out properties that are not from Event prototype,
		 * and include all others as ownProperty to a new object.
		 * @param {Event} e
		 * @return {Object} object with relevant properties as ownProperty
		 */
		function filterEvent (e) {
			var filteredEvent = {};
			for (var prop in e) {
				/* global Event */
				if (!Event.prototype.hasOwnProperty(prop)) {
					filteredEvent[prop] = e[prop];
				}
			}
			return filteredEvent;
		}

		/**
		 * On successful creation of an order, submit it through a form
		 * @param {String} formAction URL to which to POST form to
		 */
		function submitOrder (formAction) {
			var form = document.createElement('form');
			form.action = formAction;
			form.method = 'post';

			document.body.appendChild(form);
			form.submit();
		}

		function doRedirect () {
			if (redirect) {
				// Redirect to last responded redirect
				location.href = redirect;
			}
		}

		function dispatchEvent (event) {
			if (!event || !event.name) {
				return;
			}
			document.body.dispatchEvent(new CustomEvent(event.name, {
				bubbles: true,
				detail: event.detail
			}));
		}

		function processServerResponse (response) {
			if (!response) {
				return;
			}
			// redirect could be an empty string
			if (typeof response.redirect !== 'undefined') {
				// set redirect URL
				redirect = response.redirect;
			}
			dispatchEvent(response.event);
		}

		function oncancelHandler (e) {
			setSession(null);

			postJson(action.cancel, {}).then(function (response) {
				processServerResponse(response);
				doRedirect();
			}, function (error) {
				processServerResponse(error.response);
				doRedirect();
			}).catch(function (err) {
				console.error(err);
			});
		}

		function onpaymentauthorizedHandler (e) {
			postJson(action.onpaymentauthorized, filterEvent(e)).then(function (response) {
				session.completePayment(ApplePaySession.STATUS_SUCCESS);
				processServerResponse(response);
				setSession(null);
				submitOrder(response.redirect);
			}, function (error) {
				session.completePayment(mapStatus(error.message));
				processServerResponse(error.response);
			}).catch(function (err) {
				console.error(err);
			});
		}

		function onpaymentmethodselectedHandler (e) {
			postJson(action.onpaymentmethodselected, filterEvent(e)).then(function (response) {
				// update updatedRequest with new server response
				updatedRequest = Object.assign(updatedRequest, response);
				session.completePaymentMethodSelection(response.total, response.lineItems);
				processServerResponse(response);
			}, function (error) {
				// No way to communicate error status on this event to Apple Pay
				session.completePaymentMethodSelection(
						updatedRequest.total, updatedRequest.lineItems);
				processServerResponse(error.response);
			}).catch(function (err) {
				console.error(err);
			});
		}

		function onshippingcontactselectedHandler (e) {
			postJson(action.onshippingcontactselected, filterEvent(e)).then(function (response) {
				// update updatedRequest with new server response
				updatedRequest = Object.assign(updatedRequest, response);
				session.completeShippingContactSelection(ApplePaySession.STATUS_SUCCESS,
					response.shippingMethods, response.total, response.lineItems);
				processServerResponse(response);
			}, function (error) {
				session.completeShippingContactSelection(mapStatus(error.message),
						[], updatedRequest.total, updatedRequest.lineItems);
				processServerResponse(error.response);
			}).catch(function (err) {
				console.error(err);
			});
		}

		function onshippingmethodselectedHandler (e) {
			postJson(action.onshippingmethodselected, filterEvent(e)).then(function (response) {
				// update updatedRequest with new server response
				updatedRequest = Object.assign(updatedRequest, response);
				session.completeShippingMethodSelection(ApplePaySession.STATUS_SUCCESS,
					response.total, response.lineItems);
				processServerResponse(response);
			}, function (error) {
				session.completeShippingMethodSelection(mapStatus(error.message),
						updatedRequest.total, updatedRequest.lineItems);
				processServerResponse(error.response);
			}).catch(function (err) {
				console.error(err);
			});
		}

		function onvalidatemerchantHandler (e) {
			postJson(action.onvalidatemerchant, Object.assign(filterEvent(e), {
				hostname: window.location.hostname
			})).then(function (response) {
				session.completeMerchantValidation(response.session);
			}, function (error) {
				session.abort();
			}).catch(function (err) {
				console.error(err);
			});
		}

		function setSession (s) {
			if (session) {
				session.oncancel = null;
				session.onpaymentauthorized = null;
				session.onpaymentmethodselected = null;
				session.onshippingcontactselected = null;
				session.onshippingmethodselected = null;
				session.onvalidatemerchant = null;
			}

			session = s;

			if (session) {
				session.oncancel = oncancelHandler;
				session.onpaymentauthorized = onpaymentauthorizedHandler;
				session.onpaymentmethodselected = onpaymentmethodselectedHandler;
				session.onshippingcontactselected = onshippingcontactselectedHandler;
				session.onshippingmethodselected = onshippingmethodselectedHandler;
				session.onvalidatemerchant = onvalidatemerchantHandler;
			}
		}

		/**
		 * Begins the ApplePaySession.
		 */
		function createSession () {
			// fake the total amount to make it a valid request
			// if the basket is empty.
			// @TODO some basic addition should be calculated instead
			// to reflect a more reasonable amount
			// this relies on the SKU price to be available on render
			if (parseFloat(request.total.amount) === 0) {
				request.total.amount = '0.01';
			}
			setSession(new ApplePaySession(APPLE_PAY_VERSION, request));
			session.begin();

			// set updatedRequest to request
			updatedRequest = Object.assign({}, request);
		}

		/**
		 * Prepares an Apple Pay basket, optionally
		 * containing exclusively the product with the given SKU to buy.
		 * @param {String} [sku] SKU of product to buy
		 */
		function prepareBasket (sku) {
			postJson(action.prepareBasket, {
				sku: sku
			}).then(function (response) {
				processServerResponse(response);
			}, function (error) {
				session.abort();
				processServerResponse(error.response);
			}).catch(function (err) {
				console.error(err);
			});
		}

		function validateInject (element, directive) {
			if (element.hasAttribute(ATTR_SKU)) {
				// No minimum total price required to inject for add to cart
				return !!request;
			}

			// Inject only if request total price is positive
			return request && request.total && request.total.amount &&
				parseFloat(request.total.amount) > 0;
		}

		function createButton (element, directive) {
			// Create button element
			var button = document.createElement('button');
			button.type = 'button';

			// Compose button class name
			var className = '';
			if (directive.css) {
				className += directive.css;
			}

			// Copy attributes to button
			if (directive.copy) {
				if (element.getAttribute(ATTR_SKU)) {
					button.setAttribute(ATTR_SKU, element.getAttribute(ATTR_SKU));
				}
				if (element.className) {
					className += ' ' + element.className;
				}
				if (element.id) {
					var id = element.id;
					element.id = '';
					button.id = id;
				}
			}

			if (className) {
				button.className = className;
			}

			// Dynamically style the button
			if (directive.style) {
				var styleElement;
				if (directive.style.ref === 'this') {
					// Style reference is same element
					styleElement = element;
				} else if (directive.style.ref) {
					// Query style reference element
					styleElement = document.querySelector(directive.style.ref);
				}

				if (styleElement && directive.style.attr && 'getComputedStyle' in window) {
					// Copy declared style attributes to button
					var computedStyle = window.getComputedStyle(styleElement);
					var style = '';
					for (var i = 0; i < directive.style.attr.length; i++) {
						style += directive.style.attr[i] + ':' + computedStyle.getPropertyValue(directive.style.attr[i]) + ';';
					}
					button.style = style;
				}
			}

			// Add button click handler
			button.onclick = function () {
				// Create Apple Pay basket
				prepareBasket(button.getAttribute(ATTR_SKU));

				// Create Apple Pay session synchronously
				createSession();

				// Quit further event handling
				return false;
			};

			return button;
		}

		function process (element, directive) {
			if (hasClass(element, CLASS_PROCESSED)) {
				// Element has already been processed
				return;
			}

			if (!validateInject(element, directive)) {
				// Element is not valid for this directive
				return;
			}

			// Create button for element
			var button = createButton(element, directive);

			// Execute action for button
			switch (directive.action) {
				case 'after':
					element.parentNode.appendChild(button, element.nextSibling);
					break;
				case 'before':
					element.parentNode.insertBefore(button, element);
					break;
				case 'replace':
					element.parentNode.insertBefore(button, element);
					element.parentNode.removeChild(element);
					break;
				case 'append':
					element.appendChild(button);
					break;
			}

			// Mark element as processed
			element.className += ' ' + CLASS_PROCESSED;
		}

		function processDirectives () {
			if (!request) {
				// Quit processing without a valid request
				return;
			}

			var directive, elements;
			for (var i = 0; i < inject.directives.length; i++) {
				directive = inject.directives[i];
				elements = document.querySelectorAll(directive.query);
				if (elements && elements.length > 0) {
					for (var j = 0; j < elements.length; j++) {
						process(elements[j], directive);
					}
				}
			}

			if (inject.directives.length) {
				// Repeat processing in one second
				setTimeout(processDirectives, 1000);
			}
		}

		/**
		 * Retrieves Apple Pay request info from the server.
		 */
		function getRequest () {
			getJson(action.getRequest).then(function (response) {
				request = Object.assign({}, response.request);
				processDirectives();
				processServerResponse(response);
			}).catch(function (err) {
				console.error(err);
				processServerResponse(error.response);
			});
		}

		function getUpdateRequestCookie () {
			var cookie = '; ' + (document.cookie || '') + '; ';
			var start = cookie.indexOf(UPDATE_REQUEST_COOKIE_LHS);
			if (start < 0) {
				return '';
			}

			start += UPDATE_REQUEST_COOKIE_LHS.length;
			return cookie.substring(start, cookie.indexOf('; ', start));
		}

		function pollCookies () {
			var value = getUpdateRequestCookie();
			if (value && value !== lastUpdateRequestCookie) {
				lastUpdateRequestCookie = value;
				getRequest();
			}
		}

		// Kick off XHR to get initial Apple Pay request
		getRequest();

		// Poll for cookie to update Apple Pay request
		setInterval(pollCookies, 200);
	})(window.dw.applepay, window.location, window.ApplePaySession);
}
