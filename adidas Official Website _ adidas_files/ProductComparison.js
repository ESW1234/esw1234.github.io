app.define('component/product/ProductComparison', [
    'jquery',
    'utils/cookies',
    'Component',
    'app.resources',
    'Analytics'
], function (jQuery, cookies, Component, app, Analytics) {
	'use strict';
	
	var isMobile = jQuery('body').hasClass('mobile');
	var storage = jQuery.jStorage;
	var MAX_PODUCTS_TO_COMPARE = 3;
	
	return {
		init: function (el) {
			if(!el) return false;
			this.el = el;
			
			var that = this;
			el.on('click', '.hockeycard .checkbox.compare', function (event) {
				var sender = jQuery(event.currentTarget);
				if(that.isCheckable || sender.hasClass('selected')) {
					if (sender.hasClass('selected')) {
						sender.removeClass('selected');
						var productId = sender.data('product-id');
			    		that.removeProductFromCompare(productId);
			    	} else {
			    		sender.addClass('selected');
				    	that.addProduct(sender);
			    	}
				}
			});
			
			el.on('click', '.comparison-tool-bar .remove', function (event) {
				var productId = jQuery(event.target).closest('.product-placeholder').data('product-id');
				that.removeProductFromCompare(productId);
				return false;
			});
			
			el.on('click', '.comparison-tool-bar .comparison-start', function(event) {
				that.savedKeys[that.configurationId + '_backUrl'] = window.location.href;
		    	storage.set('ComparisonProducts', that.savedKeys);
		    	
		    	var params = {
		    		configurationID: that.configurationId,
		    		products: that.getProductsSelected()
		    	};
                
		    	window.location.href = app.URLs.productComparisonPage + "?" + jQuery.param(params);
			});
			
			if (isMobile) {
				el.on('click', '.comparison-tool-bar .product-placeholder img', function(event) {
					jQuery(this).closest(".product-placeholder").toggleClass('expanded');
					jQuery(".product-placeholder-remove-cancellation").show();
					jQuery(".comparison-start").hide();
					return false;
				});
				el.on('click', '.product-placeholder-remove-cancellation', function(event) {
					jQuery(this).closest(".comparison-tool-inner").find(".product-placeholder.expanded").removeClass('expanded');
					jQuery(".product-placeholder-remove-cancellation").hide();
					jQuery(".comparison-start").show();
					return false;
				});
			}
			
			this.comparisonToolBar = jQuery('.comparison-tool-bar');
			
			this.translations = app.resources.COMPARE;
			this.savedKeys = storage.get('ComparisonProducts') || {}; 
			
			jQuery(app).on('filters-changed', function(e) {
				that.checkComparableConfiguration();
			});
			
			that.checkComparableConfiguration();
	    },
	    
	    checkComparableConfiguration: function () {
	    	var gridEl = this.el.hasClass('comparable') ? this.el : this.el.find('.comparable');
	    	this.isComparable = (gridEl.length !== 0);
	    	this.configurationId = this.isComparable ? gridEl.data('comparison-configuration-id') : null;
	    	
	    	if(this.isComparable) {
				this.savedProducts = this.savedKeys[this.configurationId] || (this.savedKeys[this.configurationId] = []);
				for (var i=0; i<this.savedProducts.length; i++) {
					if(this.savedProducts[i]) {
						jQuery('.compare.' + this.savedProducts[i].id).toggleClass('selected');
					}
		    	}
		    	this.fillPlaceholders();
		    	
		    	jQuery(document).on('scroll', function() {
					var comparisonBar = jQuery('.comparison-tool-bar'),
						comparisonBarHeight = comparisonBar.outerHeight(),
						documentHeight = jQuery(this).outerHeight(),				
						barPosition = comparisonBar.offset().top + comparisonBarHeight;
						
					(documentHeight <= barPosition || jQuery('.new-plp-filters-disabled').is(':visible')) ? comparisonBar.addClass('hidden-state') : comparisonBar.removeClass('hidden-state');
				});
		    	
	    	} else {
	    		jQuery(document).off('scroll');
	    		this.savedProducts = null;
	    	}
	    	this.updateCommonView();
			
	    	return this.isComparable;
	    },
	    
	    addProduct: function (sender) {
	    	var hockeycardEl = sender.closest('.hockeycard').find('.innercard');
	    	var productName = hockeycardEl.find('.product-info-wrapper span.title').text();
	    	var productImage = hockeycardEl.find('.image img').attr('src') || hockeycardEl.find('.image img').prop('currentSrc');
	    	var productId = jQuery(sender).data('product-id');
	    	var imageSrcSet = hockeycardEl.find('.image img').attr('srcset');
			this.addProductToStorage(productId, productName, productImage, imageSrcSet);
	    	this.fillPlaceholders();
	    	return;
	    },
	    
	    addProductToStorage: function(id, name, image, imageSrcSet) {
			if(this.savedProducts.length < MAX_PODUCTS_TO_COMPARE) {
	    		this.savedProducts.push({
	    			id: id,
	    			name: name,
	    			image: image, 
					imageSrcSet: imageSrcSet
	    		});
	        	storage.set('ComparisonProducts', this.savedKeys);
	    	} else {
	    		this.cleanStorage();
	    	}
	    	return this.savedProducts;
	    },
	    
	    removeProductFromStorage: function(id) {
	    	for(var i in this.savedProducts) {
	    		if(this.savedProducts[i].id === id) {
	    			this.savedProducts.splice(i, 1);
	    			break;
	    		}
	    	}
	    	storage.set('ComparisonProducts', this.savedKeys);
	    },
	    
	    cleanStorage: function() {
	    	if(this.savedProducts.length >= MAX_PODUCTS_TO_COMPARE) {
	    		this.savedProducts = this.savedProducts.slice(0, MAX_PODUCTS_TO_COMPARE);
	    		storage.set('ComparisonProducts', this.savedKeys);
	    	}
	    },
	    
	    fillPlaceholders: function() {
	    	var productPlaceholders = this.comparisonToolBar.find('.products-wrap .product-placeholder');
	    	var count = 0;
	    	for(var i = 0; i < MAX_PODUCTS_TO_COMPARE; i++) {
				var product = this.savedProducts[i];
				var placeholderEl = productPlaceholders.eq(i);
				placeholderEl.toggleClass('active', !!product);
				if(product) {
					placeholderEl.data('product-id', product.id);
					var imageTag = placeholderEl.find('img');
					imageTag.attr({
		    			src: product.image,
		    			alt: product.name,
		    			title: product.name
		    		});
					if(product.imageSrcSet){
						imageTag.attr('srcset', product.imageSrcSet);
					}
					placeholderEl.find('.product-name').text(product.name);
				}
	    	}
	    	var count = this.savedProducts.length;
	    	if (count < 2) {
	    		var text = app.resources["COMPARE_SINGLE"].replace("{0}", count).replace("{1}",MAX_PODUCTS_TO_COMPARE);
	    		this.comparisonToolBar.find('.products-text-wrap .result p').text(text);
	    	} else if (count >= 2) {
	    		var text = app.resources["COMPARE_PLURAL"].replace("{0}", count).replace("{1}",MAX_PODUCTS_TO_COMPARE);
	    		this.comparisonToolBar.find('.products-text-wrap .result p').text(text);
	    	}

	    	this.comparisonToolBar.find('.comparison-start').prop('disabled', !(count > 1)).toggleClass('disabled', !(count >= MAX_PODUCTS_TO_COMPARE - 1));
	    	if(count <= 1 || count >= MAX_PODUCTS_TO_COMPARE - 1) this.updateCommonView();
	    },
	    
	    updateCommonView: function() {
	    	this.el.find('.checkbox.compare').toggleClass('hidden', !this.isComparable);
	    	if(this.isComparable) {
		    	var count = this.savedProducts.length;
		    	jQuery('#hc-container').toggleClass('disabled-compare-checkbox', count > MAX_PODUCTS_TO_COMPARE - 1);
		    	this.isCheckable = count < MAX_PODUCTS_TO_COMPARE;
		    	if(isMobile) {
		    		this.comparisonToolBar.find('.products-text-wrap .inform-text').text(app.resources["COMPARE_INFORM"].replace("{0}", MAX_PODUCTS_TO_COMPARE));
			    	this.comparisonToolBar.find('.products-text-wrap').toggleClass('hidden', count > 0);
					this.comparisonToolBar.find('.products-wrap').toggleClass('hidden', count < 1);
					this.comparisonToolBar.removeClass('hidden');
		    	} else {
		    		this.comparisonToolBar.toggleClass('hidden', count < 1);
		    	}
	    	} else {
	    		this.comparisonToolBar.addClass('hidden');
	    	}
	    },
	    
	    getProductsSelected: function() {
	    	var list = [];
	    	for(var i in this.savedProducts) {
	    		list.push(this.savedProducts[i].id);
	    	}
	    	return list.join('|');
	    },
	    
	    removeProductFromCompare: function (productId) {
    		this.removeProductFromStorage(productId);
	    	this.el.find('.checkbox.compare.' + productId ).removeClass('selected');
	    	this.fillPlaceholders();
	    	jQuery(".product-placeholder-remove-cancellation").hide();
			jQuery(".comparison-start").show();
			jQuery(".product-placeholder.expanded").removeClass("expanded")
	    	return;
	    }
	}
});
