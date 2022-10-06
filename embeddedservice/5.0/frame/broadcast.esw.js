/*
 * Copyright, 2016, SALESFORCE.com
 * All Rights Reserved
 * Company Confidential
 *
 * TO MINIFY: Use Google Closure Compiler:
 *				google-closure-compiler --js=broadcast.esw.js --js_output_file=broadcast.esw.min.js --rewrite_polyfills=false
 *
 *			Install google-closure-compiler by running:
 *				npm install -g google-closure-compiler
 */

window.esw.defineFeature("Broadcast", function(esw) {
	/**
	 * Broadcast events across all tabs using localStorage.
	 * Whenever something changes in the localStorage, the window object
	 * emits the `storage` event in the other tabs letting them know about the change.
	 *
	 * NOTE* This file is a stripped down version of the Hermes github project which uses only
	 * the localstorage implementation. Here is a link to the github project :https://github.com/arnellebalane/hermes.
	 * This project uses the MIT License.
	 *
	 * @class
	 * @property {ESW} esw - The parent ESW object.
	 * @property {object} callbacks - A list of all callbacks for event handlers
	 * @property {object} storage - Local Storage.
	 * @property {string} prefix - Identifier prefixed to all names of messages which call send.
	 * @property {object} queue - List of names that have called send but have not been executed yet.
	 */
	function BroadcastAPI() {
		this.esw = esw;
		this.callbacks = {};

		if(!esw.noLocalStorageAvailable) {
			this.storage = window.localStorage;
		}else if(!esw.noSessionStorageAvailable){
			this.storage = window.sessionStorage;
		}

		this.prefix = "__broadcastAPI:";
		this.queue = {};
		
		// workaround for W-7599718
		// On Safari we must ignore events which originated on this tab
		// see  https://bugs.webkit.org/show_bug.cgi?id=210512		
		this.postedEvents = new Set();
		this.postedEvents2 = new Set();

		this.on();
		this.off();
		this.send();

		// Add a listener to the storage event which will call the broadcast method if
		// the event is one that has listeners added via the broadcastAPI method
		window.addEventListener("storage", function(event) {
			var newValue = event.newValue;
			var data = "";
			var name;
			
			// We only want to call the broadcast method it the event name is prefixed with
			// the broadcastAPI prefix
			if(event.key.indexOf(this.prefix) === 0 && event.oldValue === null) {
				name = event.key.replace(this.prefix, "");
				
				if(newValue !== "undefined") {
					data = JSON.parse(newValue);
				}
				
				//Workaround for W-7599718
				if(this.safariWorkaroundIgnoreSameTabEvents(event.key, data)){
					return;
				}
				this.broadcast(name, data);
			}
		}.bind(this));

		// Add a listener to the storage event which will call send and remove the
		// name from the queue. This queue is in place so that multiple calls to send from the same name do not get overwritten.
		window.addEventListener("storage", function(event) {
			var name;
			
			if(event.key.indexOf(this.prefix) === 0 && event.newValue === null) {
				name = event.key.replace(this.prefix, "");
				
				//Workaround for W-7599718
				if(this.safariWorkaroundIgnoreSameTabEvents(event.key, JSON.parse(event.oldValue))){
					return;
				}
				
				if(name in this.queue) {
					this.send(name, this.queue[name].shift());
					if(this.queue[name].length === 0) {
						delete this.queue[name];
					}
				}
			}
		}.bind(this));
	}

	/**
	 * Turn on listener for specific message in a tab and specify handler for that message.
	 *
	 * @param {string} name - The name of the message to listen for.
	 * @param {function} callback - Handler for message.
	 */
	BroadcastAPI.prototype.on = function on(name, callback) {
		if(!(name in this.callbacks)) {
			this.callbacks[name] = [];
		}
		this.callbacks[name].push(callback);
	};

	/**
	 * Turn off listener for specific message in a tab and remove handler for that message.
	 *
	 * @param {string} name - The name of the message to remove.
	 * @param {function} callback - Handler to remove.
	 */
	BroadcastAPI.prototype.off = function off(name, callback) {
		var index;

		if(name in this.callbacks) {
			if(typeof callback === "function") {
				index = this.callbacks[name].indexOf(callback);

				this.callbacks[name].splice(index, 1);
			}
			if(typeof callback !== "function" || this.callbacks[name].length === 0) {
				delete this.callbacks[name];
			}
		}
	};

	/**
	 * Sends a message to all tabs except the one you're on.
	 *
	 * @param {string} name - The name of the message to broadcast.
	 * @param {object} data - Data associated with message.
	 */
	BroadcastAPI.prototype.send = function send(name, data) {
		if(!this.storage){
			return;
		}

		var key = this.prefix + name;

		this.safariWorkaroundStoreOutgoingForTab(key, data);
		
		if(this.storage.getItem(key) === null) {
			// Convert undefined to null before stringifying as undefined isn't a standard JSON value and will be lost
			this.storage.setItem(key, this.stringify(data));
			this.storage.removeItem(key);
		} else {
			// The queueing system ensures that multiple calls to the send
			// function using the same name does not override each other's
			// values and makes sure that the next value is sent only when
			// the previous one has already been deleted from the storage.
			// NOTE: This could just be trying to solve a problem that is
			// very unlikely to occur.
			if(!(key in this.queue)) {
				this.queue[key] = [];
			}
			this.queue[key].push(data);
		}
	};

	/**
	 * Broadcast message to all tabs.
	 *
	 * @param {string} name - The name of the message to broadcast.
	 * @param {object} data - Data associated with message.
	 */
	BroadcastAPI.prototype.broadcast = function broadcast(name, data) {
		if(name in this.callbacks) {
			this.callbacks[name].forEach(function(callback) {
				callback(data);
			});
		}
	};
	
	/**
	 * Helper method to stringify in a consistent manner
	 * 
	 * @param {object} - data to stringify
	 */
	BroadcastAPI.prototype.stringify = function stringify(data) {
		return JSON.stringify(data, function(k, v) { if(v === undefined) { return null; } else { return v; } });
	}
	
	// workaround for W-7599718
	// On Safari we must ignore events which originated on this tab
	// see  https://bugs.webkit.org/show_bug.cgi?id=210512		
	if(esw.getSafariType() != "none"){
		BroadcastAPI.prototype.safariWorkaroundStoreOutgoingForTab = function safariWorkaroundStoreOutgoingForTab(key, data){
			var outgoing= this.stringify({ "key": key, "data": data});

			this.postedEvents.add(outgoing);
			this.postedEvents2.add(outgoing);
		};

		BroadcastAPI.prototype.safariWorkaroundIgnoreSameTabEvents = function safariWorkaroundIgnoreSameTabEvents(key, data){
			var incoming =  this.stringify({ "key": key, "data":  data});

			//operator || will return 1st true return value
			var returnVal = this.postedEvents.delete(incoming) || this.postedEvents2.delete(incoming);
			return returnVal;
		};
	}else{
		//other browsers can just ignore of course...
		BroadcastAPI.prototype.safariWorkaroundStoreOutgoingForTab = function safariWorkaroundStoreOutgoingForTab(key, data){
			return;
		};

		BroadcastAPI.prototype.safariWorkaroundIgnoreSameTabEvents = function safariWorkaroundIgnoreSameTabEvents(key, data){
			return false;
		};
	}
	
	esw.broadcastAPI = new BroadcastAPI();
});
