app.define('component/checkout/CartExpiryTimer', [
    'jquery',
    'utils/cookies',
    'Component',
    'utils/url'
], function (jQuery, cookies, Component, urlUtils) {
    'use strict';
    
    var VALID_TRESHOLD = 70;
	var WARN_TRESHOLD = 90;
	var storage = jQuery.jStorage;
    function CartExpiryTimer(el) {
        Component.call(this, el);
        this.headerSticky = jQuery('.header-sticky-selfservice-wrapper-main');
        this.adidasDtHeaderStickyExists = app.isAdidas && !app.isMobile && this.headerSticky.length;

        this.control('scroll', this.hideTimer, jQuery(document));
		if (window.RESERVATION_TIME_END) {
			this.reservationEnd = parseInt(window.RESERVATION_TIME_END);
			this.reservationBegin = this.reservationEnd - (10 * 60 * 1000);
		}
	}

    function countProgressBarPosition(element, visible) {
    	var scroll = jQuery(window).scrollTop();
    	
    	if (jQuery('body').hasClass(visible) && scroll > 0 && jQuery('.global_counter').hasClass('global_counter-sticky')) {
    		element.css('opacity', '0');
    		element.css('top', scroll + 'px');
    		setTimeout(function() {
        		element.css('opacity', '1');
        	}, 100);
    	} else {
    		element.css('top', '');
    	}
    }

    CartExpiryTimer.prototype = jQuery.extend({}, Component.prototype);
    
    CartExpiryTimer.prototype.render = function () {
    	if(this.reservationEnd) {
    		var currentTime = new Date().getTime();
    		var delta = this.reservationEnd - currentTime;
	    	this.newProduct  = jQuery(document).find(".minicart_flash").data("addnewproduct") || false;
	        this.URL 	 = this.el.data('url');
	        
	        //Removing styles for minicart_overlay 
	        if (this.newProduct) {
	        	this.el.removeClass('row');
	        	this.el.find('.global_counter-body').removeClass('container');
	        }
	        if(delta > 0) {
	        	this.progress();
	        } else {
		    	this.counter('100%', '00', '00');
		    	this.el.addClass('m-danger');
	        }
    	} else {
			this.counter('100%', '00', '00');
			this.el.addClass('m-danger');
		}
    };
    
    CartExpiryTimer.prototype.progress = function() {
		var currentTime = new Date().getTime();
		var delta = this.reservationEnd - currentTime;
		var that = this;
		if(delta < 0 && !jQuery('button.processing').hasClass('btn-processing')) {
			//Out of time redirecting back to the Cart
			var redirectTo = urlUtils.appendParamToURL(this.URL, 'timeIsUp', true);
			if (window.IS_HYPE_BASKET) {
				redirectTo = urlUtils.appendParamToURL(redirectTo, 'wasHype', true);
			}
			window.location.href = redirectTo;
		} else {
			var percent = (currentTime - this.reservationBegin) / (this.reservationEnd - this.reservationBegin) * 100;
			
			var allSeconds = (delta > 0) ? delta / 1000 : 0;
			var minutes = this.leadingZero(Math.floor(allSeconds / 60));
			var seconds = this.leadingZero(Math.floor(allSeconds % 60));
			this.counter(percent, minutes, seconds);
			setTimeout(function() {that.progress()}, 1000);
		}
    };
    
    CartExpiryTimer.prototype.counter = function (percent, minutes, seconds) {
		this.el.find('.global_counter-progress-bar').css({ width: percent + '%' });
		this.el.find('.global_counter-progress-bar .global_counter-countdown').text(minutes + ':' + seconds);
		
		this.el.find('.global_counter-minutes .global_counter-countdown_value').text(minutes[0]);
		this.el.find('.global_counter-minutes .global_counter-countdown_value:eq(1)').text(minutes[1]);
		
		this.el.find('.global_counter-seconds .global_counter-countdown_value').text(seconds[0]);
		this.el.find('.global_counter-seconds .global_counter-countdown_value:eq(1)').text(seconds[1]);
		
		if( VALID_TRESHOLD > percent) {
			this.el.addClass('m-valid');
		
		} else if( VALID_TRESHOLD < percent && WARN_TRESHOLD >= percent) {
			this.el.addClass('m-warning');
			this.el.removeClass('m-valid');
			
		} else if( WARN_TRESHOLD < percent) {
			this.el.addClass('m-danger');
			this.el.removeClass('m-warning');
		}
    };
    
    CartExpiryTimer.prototype.hideTimer = function () { 
		var scroll = jQuery(window).scrollTop();
		var stickyHeight = jQuery(".header-sticky").height() - 5;
		var offsetValue = (this.adidasDtHeaderStickyExists) ? jQuery(".global_counter").height() : 148;
		stickyHeight = (stickyHeight > 0 ) ? stickyHeight : offsetValue;
		//Do not scroll counter-progress-bar for minicart_overlay
		if (this.el.hasClass('overlaymobile')) {
			return;
		}
		if (!this.newProduct) {
			if (scroll >= stickyHeight && !this.isTimerVisible()) {
				this.el.addClass('global_counter-sticky');
				this.stickyProgressBarPosition();
			} else {
				this.el.removeClass('global_counter-sticky');
				this.el.find('.global_counter-progress').css('top', '');
			}
		}
		if (Modernizr.touch && /iPad|iPhone|iPod/.test(navigator.platform)) {
			var body = jQuery('body'),
				fixfixed = 'fixfixed',
				area = 'input:not([type="radio"][type="checkbox"]), textarea',
				progressElement = jQuery('.global_counter-progress');
			
			jQuery(document)
				.on('focus', area, function() {
					body.addClass(fixfixed);
					countProgressBarPosition(progressElement, fixfixed);
				})
				.on('blur', area, function() {
					body.removeClass(fixfixed);
					progressElement.css('top', '');
				})
				.scroll(function() {
					countProgressBarPosition(progressElement, fixfixed);
				});
		}
    };
    
    CartExpiryTimer.prototype.leadingZero = function(number, digits) {
    	return new Array((digits || 2) + 1 - String(number).length).join('0') + String(number);
	};
	
	CartExpiryTimer.prototype.isTimerVisible = function() {
        var progressBar = jQuery('.global_counter-progress-bar');
		var timer = jQuery('.global_counter-countdown');
		var timerOffset = (this.adidasDtHeaderStickyExists) ? 0 : timer.offset().top;
		if(jQuery(document).scrollTop() < (timerOffset + timer.height() + progressBar.height()))
			return true;
	    return false;
    };

    CartExpiryTimer.prototype.stickyProgressBarPosition = function() {
    	if (this.headerSticky.length) {
    		var headerTopValue = +this.headerSticky.css('top').replace('px', ''),
    			headerHeight = this.headerSticky.height();
	    	jQuery('.global_counter-progress').css('top', headerTopValue + headerHeight);
    	}
    };

	return CartExpiryTimer;
});