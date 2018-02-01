/* Copyright, 2016, SALESFORCE.com
 * All Rights Reserved
 * Company Confidential
 *
 * To create a new version of sessionapi.esw.js:
 * https://docs.google.com/a/salesforce.com/document/d/1SofIGBPyHJtNTrZ5zSeFbLvngomJOCmdCTjBOq_-2LI/edit?usp=sharing
 *
 * Version 3.0 - Refactored to follow prototype pattern and utilize new modularization system.
 *
 * TO MINIFY: java -jar ~/yuicompressor-2.4.8.jar --preserve-semi --disable-optimizations sessionapi.esw.js -o sessionapi.esw.min.js
 */

/**
 * Messages handled by this module:
 *     session.get|session.set|session.delete
 * 
 * Messages sent from this module:
 *    - When the module is loaded:
 *      {
 *        method : session.onLoad
 *        data: A list of all requested keys.
 *      }
 * 		- As a response to session.get:
 *     {
 *        method : session.sessionData
 *        data: A key-value mapping of all the requested session storage items.
 *     }
 */

window.esw.defineFeature("Session", function(esw) {
	/**
	 * Handle session storage functionality within the iframe.
	 *
	 * @class
	 */
	function SessionAPI() {
		esw.addMessageHandler("session.set", this.setSessionData.bind(this));
		esw.addMessageHandler("session.get", function(domain, data) {
			parent.postMessage({
				method: "session.sessionData",
				data: this.getSessionData(domain, data)
			}, esw.parentOrigin);
		}.bind(this));
		esw.addMessageHandler("session.delete", this.deleteSessionData.bind(this));
	}

	/**
	 * Given a domain and a key, return the session storage key that maps to that domain-key pairing.
	 *
	 * @param {string} domain - The domain that issued the request.
	 * @param {string} key - The key to retrieve from session storage.
	 * @returns {string} The session storage key for this domain-key pairing.
	 */
	SessionAPI.prototype.getKeyName = function getKeyName(domain, key) {
		if(key !== undefined && key !== null && typeof key === "string") {
			return domain + key;
		} else {
			throw new Error("key is a required parameter must be a string, cannot be undefined or null");
		}
	};

	/**
	 * Retrieve all requested keys for a provided domain.
	 *
	 * @param {string} domain - The domain that issued the request.
	 * @param {string} keys - A list of keys from which to retrieve values.
	 * @returns {object} A key-value mapping of stored values.
	 */
	SessionAPI.prototype.getSessionData = function getSessionData(domain, keys) {
		var returnData = {};

		if(domain && keys) {
			keys.forEach(function(key) {
				returnData[key] = sessionStorage.getItem(this.getKeyName(domain, key));
			}.bind(this));
		} else {
			throw new Error("getSessionData requires two non-null arguments (domain, keys).");
		}

		return returnData;
	};

	/**
	 * Remove keys from session storage.
	 *
	 * @param {string} domain - The domain that issued the request.
	 * @param {Array.<string>} keys - A list of keys to remove.
	 */
	SessionAPI.prototype.deleteSessionData = function deleteSessionData(domain, keys) {
		if(domain && keys) {
			keys.forEach(function(key) {
				sessionStorage.removeItem(this.getKeyName(domain, key));
			}.bind(this));
		} else {
			throw new Error("deleteSessionData requires two non-null arguments (domain, keys).");
		}
	};

	/**
	 * Update multiple values within session storage.
	 *
	 * @param {string} domain - The domain that issued the request.
	 * @param {object} data - An object containing new key-value pairs.
	 */
	SessionAPI.prototype.setSessionData = function setSessionData(domain, data) {
		if(domain && data) {
			Object.keys(data).forEach(function(key) {
				sessionStorage.setItem(this.getKeyName(domain, key), data[key]);
			}.bind(this));
		} else {
			throw new Error("setSessionData requires two non-null arguments (domain, data).");
		}
	};

	esw.sessionAPI = new SessionAPI();
});
