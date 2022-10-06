/* Copyright, 2016, SALESFORCE.com
 * All Rights Reserved
 * Company Confidential
 *
 * To create a new version of session.esw.js:
 * https://docs.google.com/a/salesforce.com/document/d/1SofIGBPyHJtNTrZ5zSeFbLvngomJOCmdCTjBOq_-2LI/edit?usp=sharing
 *
 * TO MINIFY: Use Google Closure Compiler:
 *				google-closure-compiler --js=session.esw.js --js_output_file=session.esw.min.js --rewrite_polyfills=false
 *
 *			Install google-closure-compiler by running:
 *				npm install -g google-closure-compiler
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
		// Used for clearing all keys in deleteAllSessionData function.
		this.trackedKeys = [];

		esw.addMessageHandler("session.set", this.setSessionData.bind(this));
		esw.addMessageHandler("session.get", function(domain, data) {
			parent.postMessage({
				method: "session.sessionData",
				data: esw.noSessionStorageAvailable ? null : this.getSessionData(domain, data)
			}, esw.parentOrigin);
		}.bind(this));
		esw.addMessageHandler("session.delete", this.deleteSessionData.bind(this));
		esw.addMessageHandler("session.deleteAllKeys", function(domain) {
			this.deleteAllSessionData(domain);
		}.bind(this));
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
	 * @param {boolean} isLocalStorage - Pass in true if you want keys retrieved from localStorage (fallback to session storage if not available)
	 * @returns {object} A key-value mapping of stored values.
	 */
	SessionAPI.prototype.getSessionData = function getSessionData(domain, keys, isLocalStorage) {
		var returnData = {};
		var storage;

		if(domain && keys) {
			if(isLocalStorage) {
				if(esw.noLocalStorageAvailable){
					isLocalStorage = false;
				} else {
					storage = localStorage;
				}
			} 
			//can't use else - variable can change in check above
			if(!isLocalStorage) {
				storage = esw.noSessionStorageAvailable ? null : sessionStorage;
			}

			keys.forEach(function(key) {
				returnData[key] = storage ? storage.getItem(this.getKeyName(domain, key)) : null;
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
	 * @param {boolean} isLocalStorage - Pass in true if you want keys removed from localStorage - fallback to sessionStorage if not available
	 */
	SessionAPI.prototype.deleteSessionData = function deleteSessionData(domain, keys, isLocalStorage) {
		var storage;
		var keyIndex;

		if((isLocalStorage && esw.noLocalStorageAvailable)){
			isLocalStrage = false;
		}

		if(!isLocalStorage && esw.noSessionStorageAvailable){
			return;
		}

		if(isLocalStorage) {
			storage = localStorage;
		} else {
			storage = sessionStorage;
		}

		if(domain && keys) {
			keys.forEach(function(key) {
				if(this.trackedKeys.indexOf(key) > -1) {
					keyIndex = this.trackedKeys.indexOf(key);
					this.trackedKeys.splice(keyIndex, 1);
				}

				storage.removeItem(this.getKeyName(domain, key));
				// Notify parent frame that it is no longer the primary tab
				if(key === "MASTER_DEPLOYMENT_ID") {
					parent.postMessage({
						method: "session.updatePrimary",
						data: {
							isPrimary: false
						}
					}, esw.parentOrigin);
				}
			}.bind(this));
			
			parent.postMessage({
				method: "session.deletedSessionData",
				data: keys
			}, esw.parentOrigin);
		} else {
			throw new Error("deleteSessionData requires two non-null arguments (domain, keys).");
		}
	};

	/**
	 * Remove keys from local storage and session storage.
	 *
	 * @param {string} domain - The domain that issued the request.
	 */
	SessionAPI.prototype.deleteAllSessionData = function deleteAllSessionData(domain) {
		this.deleteSessionData(domain, this.trackedKeys, true);
		this.deleteSessionData(domain, this.trackedKeys, false);
		parent.postMessage({
			method: "session.deletedAllSessionData"
		}, esw.parentOrigin);
	};

	/**
	 * Update multiple values within session storage.
	 *
	 * @param {string} domain - The domain that issued the request.
	 * @param {object} data - An object containing new key-value pairs.
	 * @param {boolean} isLocalStorage - Pass in true if you want keys to be set in localStorage (if available). Will fallback to sessionStorage if not
	 */
	SessionAPI.prototype.setSessionData = function setSessionData(domain, data, isLocalStorage) {
		var storage;

		if(isLocalStorage && esw.noLocalStorageAvailable){
			isLocalStorage = false;
		}
		
		if(!isLocalStorage && esw.noSessionStorageAvailable){
			return;
		}

		if(isLocalStorage) {
			storage = localStorage;
		} else {
			storage = sessionStorage;
		}

		if(domain && data) {
			Object.keys(data).forEach(function(key) {
				this.trackedKeys.push(key);

				// Store the key.
				storage.setItem(this.getKeyName(domain, key), data[key]);
				// Notify parent frame that its the primary tab
				if(key === "MASTER_DEPLOYMENT_ID") {
					parent.postMessage({
						method: "session.updatePrimary",
						data: {
							isPrimary: true
						}
					}, esw.parentOrigin);
				}
			}.bind(this));
		} else {
			throw new Error("setSessionData requires two non-null arguments (domain, data).");
		}
	};

	esw.sessionAPI = new SessionAPI();
});
