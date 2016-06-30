var $ = jQuery.noConflict();

$.fn.inlineStyle = function (prop) {
	return this.prop("style")[$.camelCase(prop)];
};

$.fn.doOnce = function( func ) {
	this.length && func.apply( this );
	return this;
}

$.extend($.infinitescroll.prototype,{
	_setup_portfolioinfiniteitemsloader: function infscr_setup_portfolioinfiniteitemsloader() {
		var opts = this.options,
			instance = this;
		// Bind nextSelector link to retrieve
		$(opts.nextSelector).click(function(e) {
			if (e.which == 1 && !e.metaKey && !e.shiftKey) {
				e.preventDefault();
				instance.retrieve();
			}
		});
		// Define loadingStart to never hide pager
		instance.options.loading.start = function (opts) {
			opts.loading.msg
				.appendTo(opts.loading.selector)
				.show(opts.loading.speed, function () {
					instance.beginAjax(opts);
				});
		}
	},
	_showdonemsg_portfolioinfiniteitemsloader: function infscr_showdonemsg_portfolioinfiniteitemsloader () {
		var opts = this.options,
			instance = this;
		//Do all the usual stuff
		opts.loading.msg
			.find('img')
			.hide()
			.parent()
			.find('div').html(opts.loading.finishedMsg).animate({ opacity: 1 }, 2000, function () {
				$(this).parent().fadeOut('normal');
			});
		//And also hide the navSelector
		$(opts.navSelector).fadeOut('normal');
		// user provided callback when done
		opts.errorCallback.call($(opts.contentSelector)[0],'done');
	}
});

(function() {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
									|| window[vendors[x]+'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() { callback(currTime + timeToCall); },
			  timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};

	if (!window.cancelAnimationFrame)
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
}());



function debounce(func, wait, immediate) {
	var timeout, args, context, timestamp, result;
	return function() {
		context = this;
		args = arguments;
		timestamp = new Date();
		var later = function() {
			var last = (new Date()) - timestamp;
			if (last < wait) {
				timeout = setTimeout(later, wait - last);
			} else {
				timeout = null;
				if (!immediate) result = func.apply(context, args);
			}
		};
		var callNow = immediate && !timeout;
		if (!timeout) {
			timeout = setTimeout(later, wait);
		}
		if (callNow) result = func.apply(context, args);
		return result;
	};
}


var requesting = false;

var killRequesting = debounce(function () {
	requesting = false;
}, 100);

function onScrollSliderParallax() {
	if (!requesting) {
		requesting = true;
		requestAnimationFrame(function(){
			eBiz.slider.sliderParallax();
			eBiz.slider.sliderElementsFade();
		});
	}
	killRequesting();
}



var eBiz = eBiz || {};

(function($){

	// USE STRICT
	"use strict";

	eBiz.initialize = {

		init: function(){

			eBiz.initialize.responsiveClasses();
			eBiz.initialize.imagePreload( '.portfolio-item:not(:has(.fslider)) img' );
			eBiz.initialize.stickyElements();
			eBiz.initialize.goToTop();
			eBiz.initialize.fullScreen();
			eBiz.initialize.verticalMiddle();
			eBiz.initialize.lightbox();
			eBiz.initialize.resizeVideos();
			eBiz.initialize.imageFade();
			eBiz.initialize.pageTransition();
			eBiz.initialize.dataResponsiveClasses();
			eBiz.initialize.dataResponsiveHeights();

			$('.fslider').addClass('preloader2');

		},

		responsiveClasses: function(){
			var jRes = jRespond([
				{
					label: 'smallest',
					enter: 0,
					exit: 479
				},{
					label: 'handheld',
					enter: 480,
					exit: 767
				},{
					label: 'tablet',
					enter: 768,
					exit: 991
				},{
					label: 'laptop',
					enter: 992,
					exit: 1199
				},{
					label: 'desktop',
					enter: 1200,
					exit: 10000
				}
			]);
			jRes.addFunc([
				{
					breakpoint: 'desktop',
					enter: function() { $body.addClass('device-lg'); },
					exit: function() { $body.removeClass('device-lg'); }
				},{
					breakpoint: 'laptop',
					enter: function() { $body.addClass('device-md'); },
					exit: function() { $body.removeClass('device-md'); }
				},{
					breakpoint: 'tablet',
					enter: function() { $body.addClass('device-sm'); },
					exit: function() { $body.removeClass('device-sm'); }
				},{
					breakpoint: 'handheld',
					enter: function() { $body.addClass('device-xs'); },
					exit: function() { $body.removeClass('device-xs'); }
				},{
					breakpoint: 'smallest',
					enter: function() { $body.addClass('device-xxs'); },
					exit: function() { $body.removeClass('device-xxs'); }
				}
			]);
		},
		
		imagePreload: function(selector, parameters){
			var params = {
				delay: 250,
				transition: 400,
				easing: 'linear'
			};
			$.extend(params, parameters);

			$(selector).each(function() {
				var image = $(this);
				image.css({visibility:'hidden', opacity: 0, display:'block'});
				image.wrap('<span class="preloader" />');
				image.one("load", function(evt) {
					$(this).delay(params.delay).css({visibility:'visible'}).animate({opacity: 1}, params.transition, params.easing, function() {
						$(this).unwrap('<span class="preloader" />');
					});
				}).each(function() {
					if(this.complete) $(this).trigger("load");
				});
			});
		},

		verticalMiddle: function(){
			if( $verticalMiddleEl.length > 0 ) {
				$verticalMiddleEl.each( function(){
					var element = $(this),
						verticalMiddleH = element.outerHeight(),
						headerHeight = $header.outerHeight();

					if( element.parents('#slider').length > 0 && !element.hasClass('ignore-header') ) {
						if( $header.hasClass('transparent-header') && ( $body.hasClass('device-lg') || $body.hasClass('device-md') ) ) {
							verticalMiddleH = verticalMiddleH - 70;
							if( $slider.next('#header').length > 0 ) { verticalMiddleH = verticalMiddleH + headerHeight; }
						}
					}

					if( $body.hasClass('device-xs') || $body.hasClass('device-xxs') ) {
						if( element.parents('.full-screen').length && !element.parents('.force-full-screen').length ){
							if( element.children('.col-padding').length > 0 ) {
								element.css({ position: 'relative', top: '0', width: 'auto', marginTop: '0' }).addClass('clearfix');
							} else {
								element.css({ position: 'relative', top: '0', width: 'auto', marginTop: '0', paddingTop: '60px', paddingBottom: '60px' }).addClass('clearfix');
							}
						} else {
							element.css({ position: 'absolute', top: '50%', width: '100%', paddingTop: '0', paddingBottom: '0', marginTop: -(verticalMiddleH/2)+'px' });
						}
					} else {
						element.css({ position: 'absolute', top: '50%', width: '100%', paddingTop: '0', paddingBottom: '0', marginTop: -(verticalMiddleH/2)+'px' });
					}
				});
			}
		},

		stickyElements: function(){
			if( $siStickyEl.length > 0 ) {
				var siStickyH = $siStickyEl.outerHeight();
				$siStickyEl.css({ marginTop: -(siStickyH/2)+'px' });
			}

			if( $dotsMenuEl.length > 0 ) {
				var opmdStickyH = $dotsMenuEl.outerHeight();
				$dotsMenuEl.css({ marginTop: -(opmdStickyH/2)+'px' });
			}
		},

		goToTop: function(){
			$goToTopEl.click(function() {
				$('body,html').stop(true).animate({scrollTop:0},400);
				return false;
			});
		},

		goToTopScroll: function(){
			if( $body.hasClass('device-lg') || $body.hasClass('device-md') || $body.hasClass('device-sm') ) {
				if($window.scrollTop() > 450) {
					$goToTopEl.fadeIn();
				} else {
					$goToTopEl.fadeOut();
				}
			}
		},

		fullScreen: function(){
			if( $fullScreenEl.length > 0 ) {
				$fullScreenEl.each( function(){
					var element = $(this),
						scrHeight = window.innerHeight ? window.innerHeight : $window.height(),
						negativeHeight = element.attr('data-negative-height');

					if( element.attr('id') == 'slider' ) {
						var sliderHeightOff = $slider.offset().top;
						scrHeight = scrHeight - sliderHeightOff;
						if( element.hasClass('slider-parallax') ) {
							var transformVal = element.css('transform'),
								transformX = transformVal.match(/-?[\d\.]+/g);
							if( !transformX ) { var transformXvalue = 0; } else { var transformXvalue = transformX[5]; }
							scrHeight = ( ( window.innerHeight ? window.innerHeight : $window.height() ) + Number( transformXvalue ) ) - sliderHeightOff;
						}
						if( $('#slider.with-header').next('#header:not(.transparent-header)').length > 0 && ( $body.hasClass('device-lg') || $body.hasClass('device-md') ) ) {
							var headerHeightOff = $header.outerHeight();
							scrHeight = scrHeight - headerHeightOff;
						}
					}
					if( element.parents('.full-screen').length > 0 ) { scrHeight = element.parents('.full-screen').height(); }

					if( $body.hasClass('device-xs') || $body.hasClass('device-xxs') ) {
						if( !element.hasClass('force-full-screen') ){ scrHeight = 'auto'; }
					}

					if( negativeHeight ){ scrHeight = scrHeight - Number(negativeHeight); }

					element.css('height', scrHeight);
					if( element.attr('id') == 'slider' && !element.hasClass('canvas-slider-grid') ) { if( element.has('.swiper-slide') ) { element.find('.swiper-slide').css('height', scrHeight); } }
				});
			}
		},

		maxHeight: function(){
			if( $commonHeightEl.length > 0 ) {
				$commonHeightEl.each( function(){
					var element = $(this);
					if( element.has('.common-height') ) {
						eBiz.initialize.commonHeight( element.find('.common-height') );
					}

					eBiz.initialize.commonHeight( element );
				});
			}
		},

		commonHeight: function( element ){
			var maxHeight = 0;
			element.children('[class^=col-]').each(function() {
				var element = $(this).children('div');
				if( element.hasClass('max-height') ){
					maxHeight = element.outerHeight();
				} else {
					if (element.outerHeight() > maxHeight)
					maxHeight = element.outerHeight();
				}
			});

			element.children('[class^=col-]').each(function() {
				$(this).height(maxHeight);
			});
		},

		testimonialsGrid: function(){
			if( $testimonialsGridEl.length > 0 ) {
				if( $body.hasClass('device-sm') || $body.hasClass('device-md') || $body.hasClass('device-lg') ) {
					var maxHeight = 0;
					$testimonialsGridEl.each( function(){
						$(this).find("li > .testimonial").each(function(){
						   if ($(this).height() > maxHeight) { maxHeight = $(this).height(); }
						});
						$(this).find("li").height(maxHeight);
						maxHeight = 0;
					});
				} else {
					$testimonialsGridEl.find("li").css({ 'height': 'auto' });
				}
			}
		},

		lightbox: function(){
			var $lightboxImageEl = $('[data-lightbox="image"]'),
				$lightboxGalleryEl = $('[data-lightbox="gallery"]'),
				$lightboxIframeEl = $('[data-lightbox="iframe"]'),
				$lightboxInlineEl = $('[data-lightbox="inline"]'),
				$lightboxAjaxEl = $('[data-lightbox="ajax"]'),
				$lightboxAjaxGalleryEl = $('[data-lightbox="ajax-gallery"]');

			if( $lightboxImageEl.length > 0 ) {
				$lightboxImageEl.magnificPopup({
					type: 'image',
					closeOnContentClick: true,
					closeBtnInside: false,
					fixedContentPos: true,
					mainClass: 'mfp-no-margins mfp-fade', // class to remove default margin from left and right side
					image: {
						verticalFit: true
					}
				});
			}

			if( $lightboxGalleryEl.length > 0 ) {
				$lightboxGalleryEl.each(function() {
					var element = $(this);

					if( element.find('a[data-lightbox="gallery-item"]').parent('.clone').hasClass('clone') ) {
						element.find('a[data-lightbox="gallery-item"]').parent('.clone').find('a[data-lightbox="gallery-item"]').attr('data-lightbox','');
					}

					element.magnificPopup({
						delegate: 'a[data-lightbox="gallery-item"]',
						type: 'image',
						closeOnContentClick: true,
						closeBtnInside: false,
						fixedContentPos: true,
						mainClass: 'mfp-no-margins mfp-fade', // class to remove default margin from left and right side
						image: {
							verticalFit: true
						},
						gallery: {
							enabled: true,
							navigateByImgClick: true,
							preload: [0,1] // Will preload 0 - before current, and 1 after the current image
						}
					});
				});
			}

			if( $lightboxIframeEl.length > 0 ) {
				$lightboxIframeEl.magnificPopup({
					disableOn: 600,
					type: 'iframe',
					removalDelay: 160,
					preloader: false,
					fixedContentPos: false
				});
			}

			if( $lightboxInlineEl.length > 0 ) {
				$lightboxInlineEl.magnificPopup({
					type: 'inline',
					mainClass: 'mfp-no-margins mfp-fade',
					closeBtnInside: false,
					fixedContentPos: true
				});
			}

			if( $lightboxAjaxEl.length > 0 ) {
				$lightboxAjaxEl.magnificPopup({
					type: 'ajax',
					closeBtnInside: false,
					callbacks: {
						ajaxContentAdded: function(mfpResponse) {
							eBiz.widget.loadFlexSlider();
							eBiz.initialize.resizeVideos();
							eBiz.widget.masonryThumbs();
						},
						open: function() {
							$body.addClass('ohidden');
						},
						close: function() {
							$body.removeClass('ohidden');
						}
					}
				});
			}

			if( $lightboxAjaxGalleryEl.length > 0 ) {
				$lightboxAjaxGalleryEl.magnificPopup({
					delegate: 'a[data-lightbox="ajax-gallery-item"]',
					type: 'ajax',
					closeBtnInside: false,
					gallery: {
						enabled: true,
						preload: 0,
						navigateByImgClick: false
					},
					callbacks: {
						ajaxContentAdded: function(mfpResponse) {
							eBiz.widget.loadFlexSlider();
							eBiz.initialize.resizeVideos();
							eBiz.widget.masonryThumbs();
						},
						open: function() {
							$body.addClass('ohidden');
						},
						close: function() {
							$body.removeClass('ohidden');
						}
					}
				});
			}
		},

		modal: function(){
			var $modal = $('.modal-on-load:not(.customjs)');
			if( $modal.length > 0 ) {
				$modal.each( function(){
					var element				= $(this),
						elementTarget		= element.attr('data-target'),
						elementTargetValue	= elementTarget.split('#')[1],
						elementDelay		= element.attr('data-delay'),
						elementTimeout		= element.attr('data-timeout'),
						elementAnimateIn	= element.attr('data-animate-in'),
						elementAnimateOut	= element.attr('data-animate-out');

					if( !element.hasClass('enable-cookie') ) { $.removeCookie( elementTargetValue ); }

					if( element.hasClass('enable-cookie') ) {
						var elementCookie = $.cookie( elementTargetValue );

						if( typeof elementCookie !== 'undefined' && elementCookie == '0' ) {
							return true;
						}
					}

					if( !elementDelay ) {
						elementDelay = 1500;
					} else {
						elementDelay = Number(elementDelay) + 1500;
					}

					var t = setTimeout(function() {
						$.magnificPopup.open({
							items: { src: elementTarget },
							type: 'inline',
							mainClass: 'mfp-no-margins mfp-fade',
							closeBtnInside: false,
							fixedContentPos: true,
							removalDelay: 500,
							callbacks: {
								open: function(){
									if( elementAnimateIn != '' ) {
										$(elementTarget).addClass( elementAnimateIn + ' animated' );
									}
								},
								beforeClose: function(){
									if( elementAnimateOut != '' ) {
										$(elementTarget).removeClass( elementAnimateIn ).addClass( elementAnimateOut );
									}
								},
								afterClose: function() {
									if( elementAnimateIn != '' || elementAnimateOut != '' ) {
										$(elementTarget).removeClass( elementAnimateIn + ' ' + elementAnimateOut + ' animated' );
									}
									if( element.hasClass('enable-cookie') ) {
										$.cookie( elementTargetValue, '0' );
									}
								}
							}
						}, 0);
					}, Number(elementDelay) );

					if( elementTimeout != '' ) {
						var to = setTimeout(function() {
							$.magnificPopup.close();
						}, Number(elementDelay) + Number(elementTimeout) );
					}
				});
			}
		},

		resizeVideos: function(){
			if ( $().fitVids ) {
				$("#content,#footer,#slider:not(.revslider-wrap),.landing-offer-media,.portfolio-ajax-modal").fitVids({
					customSelector: "iframe[src^='http://www.dailymotion.com/embed']",
					ignore: '.no-fv'
				});
			}
		},

		imageFade: function(){
			$('.image_fade').hover( function(){
				$(this).filter(':not(:animated)').animate({opacity: 0.8}, 400);
			}, function() {
				$(this).animate({opacity: 1}, 400);
			});
		},

		blogTimelineEntries: function(){
			$('.post-timeline.grid-2').find('.entry').each( function(){
				var position = $(this).inlineStyle('left');
				if( position == '0px' ) {
					$(this).removeClass('alt');
				} else {
					$(this).addClass('alt');
				}
				$(this).find('.entry-timeline').fadeIn();
			});
		},

		pageTransition: function(){
			if( !$body.hasClass('no-transition') ){
				var animationIn = $body.attr('data-animation-in'),
					animationOut = $body.attr('data-animation-out'),
					durationIn = $body.attr('data-speed-in'),
					durationOut = $body.attr('data-speed-out'),
					loaderTimeOut = $body.attr('data-loader-timeout'),
					loaderStyle = $body.attr('data-loader'),
					loaderColor = $body.attr('data-loader-color'),
					loaderStyleHtml = $body.attr('data-loader-html'),
					loaderBgStyle = '',
					loaderBorderStyle = '',
					loaderBgClass = '',
					loaderBorderClass = '',
					loaderBgClass2 = '',
					loaderBorderClass2 = '';

				if( !animationIn ) { animationIn = 'fadeIn'; }
				if( !animationOut ) { animationOut = 'fadeOut'; }
				if( !durationIn ) { durationIn = 1500; }
				if( !durationOut ) { durationOut = 800; }
				if( !loaderStyleHtml ) { loaderStyleHtml = '<div class="css3-spinner-bounce1"></div><div class="css3-spinner-bounce2"></div><div class="css3-spinner-bounce3"></div>'; }

				if( !loaderTimeOut ) {
					loaderTimeOut = false;
				} else {
					loaderTimeOut = Number(loaderTimeOut);
				}

				if( loaderColor ) {
					if( loaderColor == 'theme' ) {
						loaderBgClass = ' bgcolor';
						loaderBorderClass = ' border-color';
						loaderBgClass2 = ' class="bgcolor"';
						loaderBorderClass2 = ' class="border-color"';
					} else {
						loaderBgStyle = ' style="background-color:'+ loaderColor +';"';
						loaderBorderStyle = ' style="border-color:'+ loaderColor +';"';
					}
					loaderStyleHtml = '<div class="css3-spinner-bounce1'+ loaderBgClass +'"'+ loaderBgStyle +'></div><div class="css3-spinner-bounce2'+ loaderBgClass +'"'+ loaderBgStyle +'></div><div class="css3-spinner-bounce3'+ loaderBgClass +'"'+ loaderBgStyle +'></div>'
				}

				if( loaderStyle == '2' ) {
					loaderStyleHtml = '<div class="css3-spinner-flipper'+ loaderBgClass +'"'+ loaderBgStyle +'></div>';
				} else if( loaderStyle == '3' ) {
					loaderStyleHtml = '<div class="css3-spinner-double-bounce1'+ loaderBgClass +'"'+ loaderBgStyle +'></div><div class="css3-spinner-double-bounce2'+ loaderBgClass +'"'+ loaderBgStyle +'></div>';
				} else if( loaderStyle == '4' ) {
					loaderStyleHtml = '<div class="css3-spinner-rect1'+ loaderBgClass +'"'+ loaderBgStyle +'></div><div class="css3-spinner-rect2'+ loaderBgClass +'"'+ loaderBgStyle +'></div><div class="css3-spinner-rect3'+ loaderBgClass +'"'+ loaderBgStyle +'></div><div class="css3-spinner-rect4'+ loaderBgClass +'"'+ loaderBgStyle +'></div><div class="css3-spinner-rect5'+ loaderBgClass +'"'+ loaderBgStyle +'></div>';
				} else if( loaderStyle == '5' ) {
					loaderStyleHtml = '<div class="css3-spinner-cube1'+ loaderBgClass +'"'+ loaderBgStyle +'></div><div class="css3-spinner-cube2'+ loaderBgClass +'"'+ loaderBgStyle +'></div>';
				} else if( loaderStyle == '6' ) {
					loaderStyleHtml = '<div class="css3-spinner-scaler'+ loaderBgClass +'"'+ loaderBgStyle +'></div>';
				} else if( loaderStyle == '7' ) {
					loaderStyleHtml = '<div class="css3-spinner-grid-pulse"><div'+ loaderBgClass2 + loaderBgStyle +'></div><div'+ loaderBgClass2 + loaderBgStyle +'></div><div'+ loaderBgClass2 + loaderBgStyle +'></div><div'+ loaderBgClass2 + loaderBgStyle +'></div><div'+ loaderBgClass2 + loaderBgStyle +'></div><div'+ loaderBgClass2 + loaderBgStyle +'></div><div'+ loaderBgClass2 + loaderBgStyle +'></div><div'+ loaderBgClass2 + loaderBgStyle +'></div><div'+ loaderBgClass2 + loaderBgStyle +'></div></div>';
				} else if( loaderStyle == '8' ) {
					loaderStyleHtml = '<div class="css3-spinner-clip-rotate"><div'+ loaderBorderClass2 + loaderBorderStyle +'></div></div>';
				} else if( loaderStyle == '9' ) {
					loaderStyleHtml = '<div class="css3-spinner-ball-rotate"><div'+ loaderBgClass2 + loaderBgStyle +'></div><div'+ loaderBgClass2 + loaderBgStyle +'></div><div'+ loaderBgClass2 + loaderBgStyle +'></div></div>';
				} else if( loaderStyle == '10' ) {
					loaderStyleHtml = '<div class="css3-spinner-zig-zag"><div'+ loaderBgClass2 + loaderBgStyle +'></div><div'+ loaderBgClass2 + loaderBgStyle +'></div></div>';
				} else if( loaderStyle == '11' ) {
					loaderStyleHtml = '<div class="css3-spinner-triangle-path"><div'+ loaderBgClass2 + loaderBgStyle +'></div><div'+ loaderBgClass2 + loaderBgStyle +'></div><div'+ loaderBgClass2 + loaderBgStyle +'></div></div>';
				} else if( loaderStyle == '12' ) {
					loaderStyleHtml = '<div class="css3-spinner-ball-scale-multiple"><div'+ loaderBgClass2 + loaderBgStyle +'></div><div'+ loaderBgClass2 + loaderBgStyle +'></div><div'+ loaderBgClass2 + loaderBgStyle +'></div></div>';
				} else if( loaderStyle == '13' ) {
					loaderStyleHtml = '<div class="css3-spinner-ball-pulse-sync"><div'+ loaderBgClass2 + loaderBgStyle +'></div><div'+ loaderBgClass2 + loaderBgStyle +'></div><div'+ loaderBgClass2 + loaderBgStyle +'></div></div>';
				} else if( loaderStyle == '14' ) {
					loaderStyleHtml = '<div class="css3-spinner-scale-ripple"><div'+ loaderBorderClass2 + loaderBorderStyle +'></div><div'+ loaderBorderClass2 + loaderBorderStyle +'></div><div'+ loaderBorderClass2 + loaderBorderStyle +'></div></div>';
				}

				$wrapper.animsition({
					inClass : animationIn,
					outClass : animationOut,
					inDuration : Number(durationIn),
					outDuration : Number(durationOut),
					linkElement : '#primary-menu ul li a:not([target="_blank"]):not([href*=#]):not([data-lightbox])',
					loading : true,
					loadingParentElement : 'body',
					loadingClass : 'css3-spinner',
					loadingHtml : loaderStyleHtml,
					unSupportCss : [
									 'animation-duration',
									 '-webkit-animation-duration',
									 '-o-animation-duration'
								   ],
					overlay : false,
					overlayClass : 'animsition-overlay-slide',
					overlayParentElement : 'body',
					timeOut: loaderTimeOut
				});
			}
		},

		topScrollOffset: function() {
			var topOffsetScroll = 0;

			if( ( $body.hasClass('device-lg') || $body.hasClass('device-md') ) && !eBiz.isMobile.any() ) {
				if( $header.hasClass('sticky-header') ) {
					if( $pagemenu.hasClass('dots-menu') ) { topOffsetScroll = 100; } else { topOffsetScroll = 144; }
				} else {
					if( $pagemenu.hasClass('dots-menu') ) { topOffsetScroll = 140; } else { topOffsetScroll = 184; }
				}

				if( !$pagemenu.length ) {
					if( $header.hasClass('sticky-header') ) { topOffsetScroll = 100; } else { topOffsetScroll = 140; }
				}
			} else {
				topOffsetScroll = 40;
			}

			return topOffsetScroll;
		},

		defineColumns: function( element ){
			var column = 4;

			if( element.hasClass('portfolio-full') ) {
				if( element.hasClass('portfolio-3') ) column = 3;
				else if( element.hasClass('portfolio-5') ) column = 5;
				else if( element.hasClass('portfolio-6') ) column = 6;
				else column = 4;

				if( $body.hasClass('device-sm') && ( column == 4 || column == 5 || column == 6 ) ) {
					column = 3;
				} else if( $body.hasClass('device-xs') && ( column == 3 || column == 4 || column == 5 || column == 6 ) ) {
					column = 2;
				} else if( $body.hasClass('device-xxs') ) {
					column = 1;
				}
			} else if( element.hasClass('masonry-thumbs') ) {

				var lgCol = element.attr('data-lg-col'),
					mdCol = element.attr('data-md-col'),
					smCol = element.attr('data-sm-col'),
					xsCol = element.attr('data-xs-col'),
					xxsCol = element.attr('data-xxs-col');

				if( element.hasClass('col-2') ) column = 2;
				else if( element.hasClass('col-3') ) column = 3;
				else if( element.hasClass('col-5') ) column = 5;
				else if( element.hasClass('col-6') ) column = 6;
				else column = 4;

				if( $body.hasClass('device-lg') ) {
					if( lgCol ) { column = Number(lgCol); }
				} else if( $body.hasClass('device-md') ) {
					if( mdCol ) { column = Number(mdCol); }
				} else if( $body.hasClass('device-sm') ) {
					if( smCol ) { column = Number(smCol); }
				} else if( $body.hasClass('device-xs') ) {
					if( xsCol ) { column = Number(xsCol); }
				} else if( $body.hasClass('device-xxs') ) {
					if( xxsCol ) { column = Number(xxsCol); }
				}

			}

			return column;
		},

		setFullColumnWidth: function( element ){

			if( element.hasClass('portfolio-full') ) {
				var columns = eBiz.initialize.defineColumns( element );
				var containerWidth = element.width();
				if( containerWidth == ( Math.floor(containerWidth/columns) * columns ) ) { containerWidth = containerWidth - 1; }
				var postWidth = Math.floor(containerWidth/columns);
				if( $body.hasClass('device-xxs') ) { var deviceSmallest = 1; } else { var deviceSmallest = 0; }
				element.find(".portfolio-item").each(function(index){
					if( deviceSmallest == 0 && $(this).hasClass('wide') ) { var elementSize = ( postWidth*2 ); } else { var elementSize = postWidth; }
					$(this).css({"width":elementSize+"px"});
				});
			} else if( element.hasClass('masonry-thumbs') ) {
				var columns = eBiz.initialize.defineColumns( element ),
					containerWidth = element.innerWidth(),
					windowWidth = $window.width();
				if( containerWidth == windowWidth ){
					containerWidth = windowWidth*1.004;
					element.css({ 'width': containerWidth+'px' });
				}
				var postWidth = (containerWidth/columns);

				postWidth = Math.floor(postWidth);

				if( ( postWidth * columns ) >= containerWidth ) { element.css({ 'margin-right': '-1px' }); }

				element.children('a').css({"width":postWidth+"px"});

				var firstElementWidth = element.find('a:eq(0)').outerWidth();

				element.isotope({
					masonry: {
						columnWidth: firstElementWidth
					}
				});

				var bigImageNumbers = element.attr('data-big');
				if( bigImageNumbers ) {
					bigImageNumbers = bigImageNumbers.split(",");
					var bigImageNumber = '',
						bigi = '';
					for( bigi = 0; bigi < bigImageNumbers.length; bigi++ ){
						bigImageNumber = Number(bigImageNumbers[bigi]) - 1;
						element.find('a:eq('+bigImageNumber+')').css({ width: firstElementWidth*2 + 'px' });
					}
					var t = setTimeout( function(){
						element.isotope('layout');
					}, 1000 );
				}
			}

		},

		aspectResizer: function(){
			var $aspectResizerEl = $('.aspect-resizer');
			if( $aspectResizerEl.length > 0 ) {
				$aspectResizerEl.each( function(){
					var element = $(this),
						elementW = element.inlineStyle('width'),
						elementH = element.inlineStyle('height'),
						elementPW = element.parent().innerWidth();
				});
			}
		},

		dataResponsiveClasses: function(){
			var $dataClassXxs = $('[data-class-xxs]'),
				$dataClassXs = $('[data-class-xs]'),
				$dataClassSm = $('[data-class-sm]'),
				$dataClassMd = $('[data-class-md]'),
				$dataClassLg = $('[data-class-lg]');

			if( $dataClassXxs.length > 0 ) {
				$dataClassXxs.each( function(){
					var element = $(this),
						elementClass = element.attr('data-class-xxs'),
						elementClassDelete = element.attr('data-class-xs') + ' ' + element.attr('data-class-sm') + ' ' + element.attr('data-class-md') + ' ' + element.attr('data-class-lg');

					if( $body.hasClass('device-xxs') ) {
						element.removeClass( elementClassDelete );
						element.addClass( elementClass );
					}
				});
			}

			if( $dataClassXs.length > 0 ) {
				$dataClassXs.each( function(){
					var element = $(this),
						elementClass = element.attr('data-class-xs'),
						elementClassDelete = element.attr('data-class-xxs') + ' ' + element.attr('data-class-sm') + ' ' + element.attr('data-class-md') + ' ' + element.attr('data-class-lg');

					if( $body.hasClass('device-xs') ) {
						element.removeClass( elementClassDelete );
						element.addClass( elementClass );
					}
				});
			}

			if( $dataClassSm.length > 0 ) {
				$dataClassSm.each( function(){
					var element = $(this),
						elementClass = element.attr('data-class-sm'),
						elementClassDelete = element.attr('data-class-xxs') + ' ' + element.attr('data-class-xs') + ' ' + element.attr('data-class-md') + ' ' + element.attr('data-class-lg');

					if( $body.hasClass('device-sm') ) {
						element.removeClass( elementClassDelete );
						element.addClass( elementClass );
					}
				});
			}

			if( $dataClassMd.length > 0 ) {
				$dataClassMd.each( function(){
					var element = $(this),
						elementClass = element.attr('data-class-md'),
						elementClassDelete = element.attr('data-class-xxs') + ' ' + element.attr('data-class-xs') + ' ' + element.attr('data-class-sm') + ' ' + element.attr('data-class-lg');

					if( $body.hasClass('device-md') ) {
						element.removeClass( elementClassDelete );
						element.addClass( elementClass );
					}
				});
			}

			if( $dataClassLg.length > 0 ) {
				$dataClassLg.each( function(){
					var element = $(this),
						elementClass = element.attr('data-class-lg'),
						elementClassDelete = element.attr('data-class-xxs') + ' ' + element.attr('data-class-xs') + ' ' + element.attr('data-class-sm') + ' ' + element.attr('data-class-md');

					if( $body.hasClass('device-lg') ) {
						element.removeClass( elementClassDelete );
						element.addClass( elementClass );
					}
				});
			}
		},

		dataResponsiveHeights: function(){
			var $dataHeightXxs = $('[data-height-xxs]'),
				$dataHeightXs = $('[data-height-xs]'),
				$dataHeightSm = $('[data-height-sm]'),
				$dataHeightMd = $('[data-height-md]'),
				$dataHeightLg = $('[data-height-lg]');

			if( $dataHeightXxs.length > 0 ) {
				$dataHeightXxs.each( function(){
					var element = $(this),
						elementHeight = element.attr('data-height-xxs');

					if( $body.hasClass('device-xxs') ) {
						if( elementHeight != '' ) { element.css( 'height', elementHeight ); }
					}
				});
			}

			if( $dataHeightXs.length > 0 ) {
				$dataHeightXs.each( function(){
					var element = $(this),
						elementHeight = element.attr('data-height-xs');

					if( $body.hasClass('device-xs') ) {
						if( elementHeight != '' ) { element.css( 'height', elementHeight ); }
					}
				});
			}

			if( $dataHeightSm.length > 0 ) {
				$dataHeightSm.each( function(){
					var element = $(this),
						elementHeight = element.attr('data-height-sm');

					if( $body.hasClass('device-sm') ) {
						if( elementHeight != '' ) { element.css( 'height', elementHeight ); }
					}
				});
			}

			if( $dataHeightMd.length > 0 ) {
				$dataHeightMd.each( function(){
					var element = $(this),
						elementHeight = element.attr('data-height-md');

					if( $body.hasClass('device-md') ) {
						if( elementHeight != '' ) { element.css( 'height', elementHeight ); }
					}
				});
			}

			if( $dataHeightLg.length > 0 ) {
				$dataHeightLg.each( function(){
					var element = $(this),
						elementHeight = element.attr('data-height-lg');

					if( $body.hasClass('device-lg') ) {
						if( elementHeight != '' ) { element.css( 'height', elementHeight ); }
					}
				});
			}
		},

		stickFooterOnSmall: function(){
			var windowH = $window.height(),
				wrapperH = $wrapper.height();

			if( !$body.hasClass('sticky-footer') && $footer.length > 0 && $wrapper.has('#footer') ) {
				if( windowH > wrapperH ) {
					$footer.css({ 'margin-top': ( windowH - wrapperH ) });
				}
			}
		},

		stickyFooter: function(){
			if( $body.hasClass('sticky-footer') && $footer.length > 0 && ( $body.hasClass('device-lg') || $body.hasClass('device-md') ) ) {
				var stickyFooter = $footer.outerHeight();
				$content.css({ 'margin-bottom': stickyFooter });
			} else {
				$content.css({ 'margin-bottom': 0 });
			}
		}

	};

	eBiz.header = {

		init: function(){

			eBiz.header.superfish();
			eBiz.header.menufunctions();
			eBiz.header.fullWidthMenu();
			eBiz.header.overlayMenu();
			eBiz.header.stickyMenu();
			eBiz.header.stickyPageMenu();
			eBiz.header.sideHeader();
			eBiz.header.sidePanel();
			eBiz.header.onePageScroll();
			eBiz.header.onepageScroller();
			eBiz.header.logo();
			eBiz.header.topsearch();
			eBiz.header.topcart();

		},

		superfish: function(){

			if ( $().superfish ) {
				if( $body.hasClass('device-lg') || $body.hasClass('device-md') ) {
					$('#primary-menu ul ul, #primary-menu ul .mega-menu-content').css('display', 'block');
					eBiz.header.menuInvert();
				}

				$('body:not(.side-header) #primary-menu > ul, body:not(.side-header) #primary-menu > div > ul, .top-links > ul').superfish({
					popUpSelector: 'ul,.mega-menu-content,.top-link-section',
					delay: 250,
					speed: 350,
					animation: {opacity:'show'},
					animationOut:  {opacity:'hide'},
					cssArrows: false
				});

				$('body.side-header #primary-menu > ul').superfish({
					popUpSelector: 'ul',
					delay: 250,
					speed: 350,
					animation: {opacity:'show',height:'show'},
					animationOut:  {opacity:'hide',height:'hide'},
					cssArrows: false
				});
			}

		},

		menuInvert: function() {

			$('#primary-menu .mega-menu-content, #primary-menu ul ul').each( function( index, element ){
				var $menuChildElement = $(element);
				var windowWidth = $window.width();
				var menuChildOffset = $menuChildElement.offset();
				var menuChildWidth = $menuChildElement.width();
				var menuChildLeft = menuChildOffset.left;

				if(windowWidth - (menuChildWidth + menuChildLeft) < 0) {
					$menuChildElement.addClass('menu-pos-invert');
				}
			});

		},

		menufunctions: function(){

			$( '#primary-menu ul li:has(ul)' ).addClass('sub-menu');
			$( '.top-links ul li:has(ul) > a, #page-menu nav ul li:has(ul) > a' ).append( '<i class="icon-angle-down"></i>' );
			$( '.top-links > ul' ).addClass( 'clearfix' );

			if( $body.hasClass('device-lg') || $body.hasClass('device-md') ) {
				$('#primary-menu.sub-title > ul > li').hover(function() {
					$(this).prev().css({ backgroundImage : 'none' });
				}, function() {
					$(this).prev().css({ backgroundImage : 'url("images/icons/menu-divider.png")' });
				});

				$('#primary-menu.sub-title').children('ul').children('.current').prev().css({ backgroundImage : 'none' });
			}

			if( eBiz.isMobile.Android() ) {
				$( '#primary-menu ul li.sub-menu' ).children('a').on('touchstart', function(e){
					if( !$(this).parent('li.sub-menu').hasClass('sfHover') ) {
						e.preventDefault();
					}
				});
			}

			if( eBiz.isMobile.Windows() ) {
				$('#primary-menu > ul, #primary-menu > div > ul,.top-links > ul').superfish('destroy').addClass('windows-mobile-menu');

				$( '#primary-menu ul li:has(ul)' ).append('<a href="#" class="wn-submenu-trigger"><i class="icon-angle-down"></i></a>');

				$( '#primary-menu ul li.sub-menu' ).children('a.wn-submenu-trigger').click( function(e){
					$(this).parent().toggleClass('open');
					$(this).parent().find('> ul, > .mega-menu-content').stop(true,true).toggle();
					return false;
				});
			}

		},

		fullWidthMenu: function(){
			if( $body.hasClass('stretched') ) {
				if( $header.find('.container-fullwidth').length > 0 ) { $('.mega-menu .mega-menu-content').css({ 'width': $wrapper.width() - 120 }); }
				if( $header.hasClass('full-header') ) { $('.mega-menu .mega-menu-content').css({ 'width': $wrapper.width() - 60 }); }
			} else {
				if( $header.find('.container-fullwidth').length > 0 ) { $('.mega-menu .mega-menu-content').css({ 'width': $wrapper.width() - 120 }); }
				if( $header.hasClass('full-header') ) { $('.mega-menu .mega-menu-content').css({ 'width': $wrapper.width() - 80 }); }
			}
		},

		overlayMenu: function(){
			if( $body.hasClass('overlay-menu') ) {
				var overlayMenuItem = $('#primary-menu').children('ul').children('li'),
					overlayMenuItemHeight = overlayMenuItem.outerHeight(),
					overlayMenuItemTHeight = overlayMenuItem.length * overlayMenuItemHeight,
					firstItemOffset = ( $window.height() - overlayMenuItemTHeight ) / 2;

				$('#primary-menu').children('ul').children('li:first-child').css({ 'margin-top': firstItemOffset+'px' });
			}
		},

		stickyMenu: function( headerOffset ){
			if ($window.scrollTop() > headerOffset) {
				if( $body.hasClass('device-lg') || $body.hasClass('device-md') ) {
					$('body:not(.side-header) #header:not(.no-sticky)').addClass('sticky-header');
					if( !$headerWrap.hasClass('force-not-dark') ) { $headerWrap.removeClass('not-dark'); }
					eBiz.header.stickyMenuClass();
				} else if( $body.hasClass('device-xs') || $body.hasClass('device-xxs') || $body.hasClass('device-sm') ) {
					if( $body.hasClass('sticky-responsive-menu') ) {
						$('#header:not(.no-sticky)').addClass('responsive-sticky-header');
						eBiz.header.stickyMenuClass();
					}
				}
			} else {
				eBiz.header.removeStickyness();
			}
		},

		stickyPageMenu: function( pageMenuOffset ){
			if ($window.scrollTop() > pageMenuOffset) {
				if( $body.hasClass('device-lg') || $body.hasClass('device-md') ) {
					$('#page-menu:not(.dots-menu,.no-sticky)').addClass('sticky-page-menu');
				} else if( $body.hasClass('device-xs') || $body.hasClass('device-xxs') || $body.hasClass('device-sm') ) {
					if( $body.hasClass('sticky-responsive-pagemenu') ) {
						$('#page-menu:not(.dots-menu,.no-sticky)').addClass('sticky-page-menu');
					}
				}
			} else {
				$('#page-menu:not(.dots-menu,.no-sticky)').removeClass('sticky-page-menu');
			}
		},

		removeStickyness: function(){
			if( $header.hasClass('sticky-header') ){
				$('body:not(.side-header) #header:not(.no-sticky)').removeClass('sticky-header');
				$header.removeClass().addClass(oldHeaderClasses);
				$headerWrap.removeClass().addClass(oldHeaderWrapClasses);
				if( !$headerWrap.hasClass('force-not-dark') ) { $headerWrap.removeClass('not-dark'); }
				eBiz.slider.swiperSliderMenu();
				eBiz.slider.revolutionSliderMenu();
			}
			if( $header.hasClass('responsive-sticky-header') ){
				$('body.sticky-responsive-menu #header').removeClass('responsive-sticky-header');
			}
			if( ( $body.hasClass('device-xs') || $body.hasClass('device-xxs') || $body.hasClass('device-sm') ) && ( typeof responsiveMenuClasses === 'undefined' ) ) {
				$header.removeClass().addClass(oldHeaderClasses);
				$headerWrap.removeClass().addClass(oldHeaderWrapClasses);
				if( !$headerWrap.hasClass('force-not-dark') ) { $headerWrap.removeClass('not-dark'); }
			}
		},

		sideHeader: function(){
			$("#header-trigger").click(function(){
				$('body.open-header').toggleClass("side-header-open");
				return false;
			});
		},

		sidePanel: function(){
			$(".side-panel-trigger").click(function(){
				$body.toggleClass("side-panel-open");
				if( $body.hasClass('device-touch') ) {
					$body.toggleClass("ohidden");
				}
				return false;
			});
		},

		onePageScroll: function(){
			if( $onePageMenuEl.length > 0 ){
				var onePageSpeed = $onePageMenuEl.attr('data-speed'),
					onePageOffset = $onePageMenuEl.attr('data-offset'),
					onePageEasing = $onePageMenuEl.attr('data-easing');

				if( !onePageSpeed ) { onePageSpeed = 1000; }
				if( !onePageEasing ) { onePageEasing = 'easeOutQuad'; }

				$onePageMenuEl.find('a[data-href]').click(function(){
					var element = $(this),
						divScrollToAnchor = element.attr('data-href'),
						divScrollSpeed = element.attr('data-speed'),
						divScrollOffset = element.attr('data-offset'),
						divScrollEasing = element.attr('data-easing');

					if( $( divScrollToAnchor ).length > 0 ) {

						if( !onePageOffset ) {
							var onePageOffsetG = eBiz.initialize.topScrollOffset();
						} else {
							var onePageOffsetG = onePageOffset;
						}

						if( !divScrollSpeed ) { divScrollSpeed = onePageSpeed; }
						if( !divScrollOffset ) { divScrollOffset = onePageOffsetG; }
						if( !divScrollEasing ) { divScrollEasing = onePageEasing; }

						if( $onePageMenuEl.hasClass('no-offset') ) { divScrollOffset = 0; }

						onePageGlobalOffset = Number(divScrollOffset);

						$onePageMenuEl.find('li').removeClass('current');
						$onePageMenuEl.find('a[data-href="' + divScrollToAnchor + '"]').parent('li').addClass('current');

						$('#primary-menu > ul, #primary-menu > .container > ul').toggleClass('show', function() {
							$('html,body').stop(true).animate({
								'scrollTop': $( divScrollToAnchor ).offset().top - Number(divScrollOffset)
							}, Number(divScrollSpeed), divScrollEasing);
						}, false);

						onePageGlobalOffset = Number(divScrollOffset);
					}

					return false;
				});
			}
		},

		onepageScroller: function(){
			$onePageMenuEl.find('li').removeClass('current');
			$onePageMenuEl.find('a[data-href="#' + eBiz.header.onePageCurrentSection() + '"]').parent('li').addClass('current');
		},

		onePageCurrentSection: function(){
			var currentOnePageSection = 'home',
				headerHeight = $headerWrap.outerHeight();

			$pageSectionEl.each(function(index) {
				var h = $(this).offset().top;
				var y = $window.scrollTop();

				var offsetScroll = headerHeight + onePageGlobalOffset;

				if( y + offsetScroll >= h && y < h + $(this).height() && $(this).attr('id') != currentOnePageSection ) {
					currentOnePageSection = $(this).attr('id');
				}
			});

			return currentOnePageSection;
		},

		logo: function(){
			if( ( $header.hasClass('dark') || $body.hasClass('dark') ) && !$headerWrap.hasClass('not-dark') ) {
				if( defaultDarkLogo ){ defaultLogo.find('img').attr('src', defaultDarkLogo); }
				if( retinaDarkLogo ){ retinaLogo.find('img').attr('src', retinaDarkLogo); }
			} else {
				if( defaultLogoImg ){ defaultLogo.find('img').attr('src', defaultLogoImg); }
				if( retinaLogoImg ){ retinaLogo.find('img').attr('src', retinaLogoImg); }
			}
			if( $header.hasClass('sticky-header') ) {
				if( defaultStickyLogo ){ defaultLogo.find('img').attr('src', defaultStickyLogo); }
				if( retinaStickyLogo ){ retinaLogo.find('img').attr('src', retinaStickyLogo); }
			}
			if( $body.hasClass('device-xs') || $body.hasClass('device-xxs') ) {
				if( defaultMobileLogo ){ defaultLogo.find('img').attr('src', defaultMobileLogo); }
				if( retinaMobileLogo ){ retinaLogo.find('img').attr('src', retinaMobileLogo); }
			}
		},

		stickyMenuClass: function(){
			if( stickyMenuClasses ) { var newClassesArray = stickyMenuClasses.split(/ +/); } else { var newClassesArray = ''; }
			var noOfNewClasses = newClassesArray.length;

			if( noOfNewClasses > 0 ) {
				var i = 0;
				for( i=0; i<noOfNewClasses; i++ ) {
					if( newClassesArray[i] == 'not-dark' ) {
						$header.removeClass('dark');
						$headerWrap.addClass('not-dark');
					} else if( newClassesArray[i] == 'dark' ) {
						$headerWrap.removeClass('not-dark force-not-dark');
						if( !$header.hasClass( newClassesArray[i] ) ) {
							$header.addClass( newClassesArray[i] );
						}
					} else if( !$header.hasClass( newClassesArray[i] ) ) {
						$header.addClass( newClassesArray[i] );
					}
				}
			}
		},

		responsiveMenuClass: function(){
			if( $body.hasClass('device-xs') || $body.hasClass('device-xxs') || $body.hasClass('device-sm') ){
				if( responsiveMenuClasses ) { var newClassesArray = responsiveMenuClasses.split(/ +/); } else { var newClassesArray = ''; }
				var noOfNewClasses = newClassesArray.length;

				if( noOfNewClasses > 0 ) {
					var i = 0;
					for( i=0; i<noOfNewClasses; i++ ) {
						if( newClassesArray[i] == 'not-dark' ) {
							$header.removeClass('dark');
							$headerWrap.addClass('not-dark');
						} else if( newClassesArray[i] == 'dark' ) {
							$headerWrap.removeClass('not-dark force-not-dark');
							if( !$header.hasClass( newClassesArray[i] ) ) {
								$header.addClass( newClassesArray[i] );
							}
						} else if( !$header.hasClass( newClassesArray[i] ) ) {
							$header.addClass( newClassesArray[i] );
						}
					}
				}
				eBiz.header.logo();
			}
		},

		topsocial: function(){
			if( $topSocialEl.length > 0 ){
				if( $body.hasClass('device-md') || $body.hasClass('device-lg') ) {
					$topSocialEl.show();
					$topSocialEl.find('a').css({width: 40});

					$topSocialEl.find('.ts-text').each( function(){
						var $clone = $(this).clone().css({'visibility': 'hidden', 'display': 'inline-block', 'font-size': '13px', 'font-weight':'bold'}).appendTo($body),
							cloneWidth = $clone.innerWidth() + 52;
						$(this).parent('a').attr('data-hover-width',cloneWidth);
						$clone.remove();
					});

					$topSocialEl.find('a').hover(function() {
						if( $(this).find('.ts-text').length > 0 ) {
							$(this).css({width: $(this).attr('data-hover-width')});
						}
					}, function() {
						$(this).css({width: 40});
					});
				} else {
					$topSocialEl.show();
					$topSocialEl.find('a').css({width: 40});

					$topSocialEl.find('a').each(function() {
						var topIconTitle = $(this).find('.ts-text').text();
						$(this).attr('title', topIconTitle);
					});

					$topSocialEl.find('a').hover(function() {
						$(this).css({width: 40});
					}, function() {
						$(this).css({width: 40});
					});

					if( $body.hasClass('device-xxs') ) {
						$topSocialEl.hide();
						$topSocialEl.slice(0, 8).show();
					}
				}
			}
		},

		topsearch: function(){

			$(document).on('click', function(event) {
				if (!$(event.target).closest('#top-search').length) { $body.toggleClass('top-search-open', false); }
				if (!$(event.target).closest('#top-cart').length) { $topCart.toggleClass('top-cart-open', false); }
				if (!$(event.target).closest('#page-menu').length) { $pagemenu.toggleClass('pagemenu-active', false); }
				if (!$(event.target).closest('#side-panel').length) { $body.toggleClass('side-panel-open', false); }
			});

			$("#top-search-trigger").click(function(e){
				$body.toggleClass('top-search-open');
				$topCart.toggleClass('top-cart-open', false);
				$( '#primary-menu > ul, #primary-menu > div > ul' ).toggleClass("show", false);
				$pagemenu.toggleClass('pagemenu-active', false);
				if ($body.hasClass('top-search-open')){
					$topSearch.find('input').focus();
				}
				e.stopPropagation();
				e.preventDefault();
			});

		},

		topcart: function(){

			$("#top-cart-trigger").click(function(e){
				$pagemenu.toggleClass('pagemenu-active', false);
				$topCart.toggleClass('top-cart-open');
				e.stopPropagation();
				e.preventDefault();
			});

		}

	};

	eBiz.slider = {

		init: function() {

			eBiz.slider.sliderParallax();
			eBiz.slider.sliderElementsFade();
			eBiz.slider.captionPosition();

		},

		sliderParallaxOffset: function(){
			var sliderParallaxOffsetTop = 0;
			var headerHeight = $header.outerHeight();
			if( $body.hasClass('side-header') || $header.hasClass('transparent-header') ) { headerHeight = 0; }
			if( $pageTitle.length > 0 ) {
				var pageTitleHeight = $pageTitle.outerHeight();
				sliderParallaxOffsetTop = pageTitleHeight + headerHeight;
			} else {
				sliderParallaxOffsetTop = headerHeight;
			}

			if( $slider.next('#header').length > 0 ) { sliderParallaxOffsetTop = 0; }

			return sliderParallaxOffsetTop;
		},

		sliderParallax: function(){
			if( $sliderParallaxEl.length > 0 ) {
				if( ( $body.hasClass('device-lg') || $body.hasClass('device-md') ) && !eBiz.isMobile.any() ) {
					var parallaxOffsetTop = eBiz.slider.sliderParallaxOffset(),
						parallaxElHeight = $sliderParallaxEl.outerHeight();

					if( ( parallaxElHeight + parallaxOffsetTop + 50 ) > $window.scrollTop() ){
						if ($window.scrollTop() > parallaxOffsetTop) {
							var tranformAmount = (($window.scrollTop()-parallaxOffsetTop) / 1.5 ).toFixed(2);
							var tranformAmount2 = (($window.scrollTop()-parallaxOffsetTop) / 7 ).toFixed(2);
							$sliderParallaxEl.stop(true,true).transition({ y: tranformAmount },0);
							$('.slider-parallax .slider-caption,.ei-title').stop(true,true).transition({ y: -tranformAmount2 },0);
						} else {
							$('.slider-parallax,.slider-parallax .slider-caption,.ei-title').transition({ y: 0 },0);
						}
					}
					if (requesting) {
						requestAnimationFrame(function(){
							eBiz.slider.sliderParallax();
							eBiz.slider.sliderElementsFade();
						});
					}
				} else {
					$('.slider-parallax,.slider-parallax .slider-caption,.ei-title').transition({ y: 0 },0);
				}
			}
		},

		sliderElementsFade: function(){
			if( $sliderParallaxEl.length > 0 ) {
				if( ( $body.hasClass('device-lg') || $body.hasClass('device-md') ) && !eBiz.isMobile.any() ) {
					var parallaxOffsetTop = eBiz.slider.sliderParallaxOffset();
					if( $slider.length > 0 ) {
						if( $header.hasClass('transparent-header') || $('body').hasClass('side-header') ) { var tHeaderOffset = 100; } else { var tHeaderOffset = 0; }
						$sliderParallaxEl.find('#slider-arrow-left,#slider-arrow-right,.vertical-middle:not(.no-fade),.slider-caption,.ei-title,.camera_prev,.camera_next').css({'opacity':( ( 100 + ( $slider.offset().top + parallaxOffsetTop + tHeaderOffset ) - $window.scrollTop() ) ) /90});
					}
				} else {
					$sliderParallaxEl.find('#slider-arrow-left,#slider-arrow-right,.vertical-middle:not(.no-fade),.slider-caption,.ei-title,.camera_prev,.camera_next').css({'opacity': 1});
				}
			}
		},

		captionPosition: function(){
			$slider.find('.slider-caption:not(.custom-caption-pos)').each(function(){
				var scapHeight = $(this).outerHeight();
				var scapSliderHeight = $slider.outerHeight();
				if( $(this).parents('#slider').prev('#header').hasClass('transparent-header') && ( $body.hasClass('device-lg') || $body.hasClass('device-md') ) ) {
					if( $(this).parents('#slider').prev('#header').hasClass('floating-header') ) {
						$(this).css({ top: ( scapSliderHeight + 160 - scapHeight ) / 2 + 'px' });
					} else {
						$(this).css({ top: ( scapSliderHeight + 100 - scapHeight ) / 2 + 'px' });
					}
				} else {
					$(this).css({ top: ( scapSliderHeight - scapHeight ) / 2 + 'px' });
				}
			});
		},

		swiperSliderMenu: function( onWinLoad ){
			onWinLoad = typeof onWinLoad !== 'undefined' ? onWinLoad : false;
			if( $body.hasClass('device-lg') || $body.hasClass('device-md') ) {
				var activeSlide = $slider.find('.swiper-slide.swiper-slide-visible');
				eBiz.slider.headerSchemeChanger(activeSlide, onWinLoad);
			}
		},

		revolutionSliderMenu: function( onWinLoad ){
			onWinLoad = typeof onWinLoad !== 'undefined' ? onWinLoad : false;
			if( $body.hasClass('device-lg') || $body.hasClass('device-md') ) {
				var activeSlide = $slider.find('.active-revslide');
				eBiz.slider.headerSchemeChanger(activeSlide, onWinLoad);
			}
		},

		headerSchemeChanger: function( activeSlide, onWinLoad ){
			if( activeSlide.length > 0 ) {
				var darkExists = false;
				if( activeSlide.hasClass('dark') ){
					if( oldHeaderClasses ) { var oldClassesArray = oldHeaderClasses.split(/ +/); } else { var oldClassesArray = ''; }
					var noOfOldClasses = oldClassesArray.length;

					if( noOfOldClasses > 0 ) {
						var i = 0;
						for( i=0; i<noOfOldClasses; i++ ) {
							if( oldClassesArray[i] == 'dark' && onWinLoad == true ) {
								darkExists = true;
								break;
							}
						}
					}
					$('#header.transparent-header:not(.sticky-header,.semi-transparent,.floating-header)').addClass('dark');
					if( !darkExists ) {
						$('#header.transparent-header.sticky-header,#header.transparent-header.semi-transparent.sticky-header,#header.transparent-header.floating-header.sticky-header').removeClass('dark');
					}
					$headerWrap.removeClass('not-dark');
				} else {
					if( $body.hasClass('dark') ) {
						activeSlide.addClass('not-dark');
						$('#header.transparent-header:not(.semi-transparent,.floating-header)').removeClass('dark');
						$('#header.transparent-header:not(.sticky-header,.semi-transparent,.floating-header)').find('#header-wrap').addClass('not-dark');
					} else {
						$('#header.transparent-header:not(.semi-transparent,.floating-header)').removeClass('dark');
						$headerWrap.removeClass('not-dark');
					}
				}
				eBiz.header.logo();
			}
		},

		owlCaptionInit: function(){
			if( $owlCarouselEl.length > 0 ){
				$owlCarouselEl.each( function(){
					var element = $(this);
					if( element.find('.owl-dot').length > 0 ) {
						element.find('.owl-controls').addClass('with-carousel-dots');
					}
				});
			}
		}

	};

	eBiz.portfolio = {

		init: function(){

			eBiz.portfolio.ajaxload();

		},

		portfolioDescMargin: function(){
			var $portfolioOverlayEl = $('.portfolio-overlay');
			if( $portfolioOverlayEl.length > 0 ){
				$portfolioOverlayEl.each(function() {
					var element = $(this);
					if( element.find('.portfolio-desc').length > 0 ) {
						var portfolioOverlayHeight = element.outerHeight();
						var portfolioOverlayDescHeight = element.find('.portfolio-desc').outerHeight();
						if( element.find('a.left-icon').length > 0 || element.find('a.right-icon').length > 0 || element.find('a.center-icon').length > 0 ) {
							var portfolioOverlayIconHeight = 40 + 20;
						} else {
							var portfolioOverlayIconHeight = 0;
						}
						var portfolioOverlayMiddleAlign = ( portfolioOverlayHeight - portfolioOverlayDescHeight - portfolioOverlayIconHeight ) / 2
						element.find('.portfolio-desc').css({ 'margin-top': portfolioOverlayMiddleAlign });
					}
				});
			}
		},

		arrange: function(){
			eBiz.initialize.setFullColumnWidth( $portfolio );
			$('#portfolio.portfolio-full').isotope('layout');
		},

		ajaxload: function(){
			$('.portfolio-ajax .portfolio-item a.center-icon').click( function(e) {
				var portPostId = $(this).parents('.portfolio-item').attr('id');
				if( !$(this).parents('.portfolio-item').hasClass('portfolio-active') ) {
					eBiz.portfolio.loadItem(portPostId, prevPostPortId);
				}
				e.preventDefault();
			});
		},

		newNextPrev: function( portPostId ){
			var portNext = eBiz.portfolio.getNextItem(portPostId);
			var portPrev = eBiz.portfolio.getPrevItem(portPostId);
			$('#next-portfolio').attr('data-id', portNext);
			$('#prev-portfolio').attr('data-id', portPrev);
		},

		loadItem: function( portPostId, prevPostPortId, getIt ){
			if(!getIt) { getIt = false; }
			var portNext = eBiz.portfolio.getNextItem(portPostId);
			var portPrev = eBiz.portfolio.getPrevItem(portPostId);
			if(getIt == false) {
				eBiz.portfolio.closeItem();
				$portfolioAjaxLoader.fadeIn();
				var portfolioDataLoader = $('#' + portPostId).attr('data-loader');
				$portfolioDetailsContainer.load(portfolioDataLoader, { portid: portPostId, portnext: portNext, portprev: portPrev },
				function(){
					eBiz.portfolio.initializeAjax(portPostId);
					eBiz.portfolio.openItem();
					$portfolioItems.removeClass('portfolio-active');
					$('#' + portPostId).addClass('portfolio-active');
				});
			}
		},

		closeItem: function(){
			if( $portfolioDetails && $portfolioDetails.height() > 32 ) {
				$portfolioAjaxLoader.fadeIn();
				$portfolioDetails.find('#portfolio-ajax-single').fadeOut('600', function(){
					$(this).remove();
				});
				$portfolioDetails.removeClass('portfolio-ajax-opened');
			}
		},

		openItem: function(){
			var noOfImages = $portfolioDetails.find('img').length;
			var noLoaded = 0;

			if( noOfImages > 0 ) {
				$portfolioDetails.find('img').on('load', function(){
					noLoaded++;
					var topOffsetScroll = eBiz.initialize.topScrollOffset();
					if(noOfImages === noLoaded) {
						$portfolioDetailsContainer.css({ 'display': 'block' });
						$portfolioDetails.addClass('portfolio-ajax-opened');
						$portfolioAjaxLoader.fadeOut();
						var t=setTimeout(function(){
							eBiz.widget.loadFlexSlider();
							eBiz.initialize.lightbox();
							eBiz.initialize.resizeVideos();
							eBiz.widget.masonryThumbs();
							$('html,body').stop(true).animate({
								'scrollTop': $portfolioDetails.offset().top - topOffsetScroll
							}, 900, 'easeOutQuad');
						},500);
					}
				});
			} else {
				var topOffsetScroll = eBiz.initialize.topScrollOffset();
				$portfolioDetailsContainer.css({ 'display': 'block' });
				$portfolioDetails.addClass('portfolio-ajax-opened');
				$portfolioAjaxLoader.fadeOut();
				var t=setTimeout(function(){
					eBiz.widget.loadFlexSlider();
					eBiz.initialize.lightbox();
					eBiz.initialize.resizeVideos();
					eBiz.widget.masonryThumbs();
					$('html,body').stop(true).animate({
						'scrollTop': $portfolioDetails.offset().top - topOffsetScroll
					}, 900, 'easeOutQuad');
				},500);
			}
		},

		getNextItem: function( portPostId ){
			var portNext = '';
			var hasNext = $('#' + portPostId).next();
			if(hasNext.length != 0) {
				portNext = hasNext.attr('id');
			}
			return portNext;
		},

		getPrevItem: function( portPostId ){
			var portPrev = '';
			var hasPrev = $('#' + portPostId).prev();
			if(hasPrev.length != 0) {
				portPrev = hasPrev.attr('id');
			}
			return portPrev;
		},

		initializeAjax: function( portPostId ){
			prevPostPortId = $('#' + portPostId);

			$('#next-portfolio, #prev-portfolio').click( function() {
				var portPostId = $(this).attr('data-id');
				$portfolioItems.removeClass('portfolio-active');
				$('#' + portPostId).addClass('portfolio-active');
				eBiz.portfolio.loadItem(portPostId,prevPostPortId);
				return false;
			});

			$('#close-portfolio').click( function() {
				$portfolioDetailsContainer.fadeOut('600', function(){
					$portfolioDetails.find('#portfolio-ajax-single').remove();
				});
				$portfolioDetails.removeClass('portfolio-ajax-opened');
				$portfolioItems.removeClass('portfolio-active');
				return false;
			});
		}

	};

	eBiz.widget = {

		init: function(){

			eBiz.widget.animations();
			eBiz.widget.youtubeBgVideo();
			eBiz.widget.tabs();
			eBiz.widget.tabsJustify();
			eBiz.widget.tabsJustifyResponsive();			
			eBiz.widget.responsiveTabs();			
			eBiz.widget.toggles();
			eBiz.widget.accordions();
			eBiz.widget.counter();
			eBiz.widget.roundedSkill();
			eBiz.widget.progress();
			eBiz.widget.twitterFeed();
			eBiz.widget.flickrFeed();
			eBiz.widget.instagramPhotos( '36286274.b9e559e.4824cbc1d0c94c23827dc4a2267a9f6b', 'b9e559ec7c284375bf41e9a9fb72ae01' );
			eBiz.widget.dribbbleShots();
			eBiz.widget.navTree();
			eBiz.widget.textRotater();
			eBiz.widget.linkScroll();
			eBiz.widget.cookieNotify();
			eBiz.widget.extras();

		},

		parallax: function(){
			if( $parallaxEl.length > 0 || $parallaxPageTitleEl.length > 0 || $parallaxPortfolioEl.length > 0 ) {
				if( !eBiz.isMobile.any() ){
					$.stellar({
						horizontalScrolling: false,
						verticalOffset: 150
					});
				} else {
					$parallaxEl.addClass('mobile-parallax');
					$parallaxPageTitleEl.addClass('mobile-parallax');
					$parallaxPortfolioEl.addClass('mobile-parallax');
				}
			}
		},

		animations: function(){
			var $dataAnimateEl = $('[data-animate]');
			if( $dataAnimateEl.length > 0 ){
				if( $body.hasClass('device-lg') || $body.hasClass('device-md') || $body.hasClass('device-sm') ){
					$dataAnimateEl.each(function(){
						var element = $(this),
							animationDelay = element.attr('data-delay'),
							animationDelayTime = 0;

						if( element.parents('.fslider.no-thumbs-animate').length > 0 ) { return true; }

						if( animationDelay ) { animationDelayTime = Number( animationDelay ) + 500; } else { animationDelayTime = 500; }

						if( !element.hasClass('animated') ) {
							element.addClass('not-animated');
							var elementAnimation = element.attr('data-animate');
							element.appear(function () {
								setTimeout(function() {
									element.removeClass('not-animated').addClass( elementAnimation + ' animated');
								}, animationDelayTime);
							},{accX: 0, accY: -120},'easeInCubic');
						}
					});
				}
			}
		},

		loadFlexSlider: function(){
			var $flexSliderEl = $('.fslider:not(.customjs)').find('.flexslider');
			if( $flexSliderEl.length > 0 ){
				$flexSliderEl.each(function() {
					var $flexsSlider = $(this),
						flexsAnimation = $flexsSlider.parent('.fslider').attr('data-animation'),
						flexsEasing = $flexsSlider.parent('.fslider').attr('data-easing'),
						flexsDirection = $flexsSlider.parent('.fslider').attr('data-direction'),
						flexsSlideshow = $flexsSlider.parent('.fslider').attr('data-slideshow'),
						flexsPause = $flexsSlider.parent('.fslider').attr('data-pause'),
						flexsSpeed = $flexsSlider.parent('.fslider').attr('data-speed'),
						flexsVideo = $flexsSlider.parent('.fslider').attr('data-video'),
						flexsPagi = $flexsSlider.parent('.fslider').attr('data-pagi'),
						flexsArrows = $flexsSlider.parent('.fslider').attr('data-arrows'),
						flexsThumbs = $flexsSlider.parent('.fslider').attr('data-thumbs'),
						flexsHover = $flexsSlider.parent('.fslider').attr('data-hover'),
						flexsSheight = $flexsSlider.parent('.fslider').attr('data-smooth-height'),
						flexsUseCSS = false;

					if( !flexsAnimation ) { flexsAnimation = 'slide'; }
					if( !flexsEasing || flexsEasing == 'swing' ) {
						flexsEasing = 'swing';
						flexsUseCSS = true;
					}
					if( !flexsDirection ) { flexsDirection = 'horizontal'; }
					if( !flexsSlideshow ) { flexsSlideshow = true; } else { flexsSlideshow = false; }
					if( !flexsPause ) { flexsPause = 5000; }
					if( !flexsSpeed ) { flexsSpeed = 600; }
					if( !flexsVideo ) { flexsVideo = false; }
					if( flexsSheight == 'false' ) { flexsSheight = false; }
					if( flexsDirection == 'vertical' ) { flexsSheight = false; }
					if( flexsPagi == 'false' ) { flexsPagi = false; } else { flexsPagi = true; }
					if( flexsThumbs == 'true' ) { flexsPagi = 'thumbnails'; } else { flexsPagi = flexsPagi; }
					if( flexsArrows == 'false' ) { flexsArrows = false; } else { flexsArrows = true; }
					if( flexsHover == 'false' ) { flexsHover = false; } else { flexsHover = true; }

					$flexsSlider.flexslider({
						selector: ".slider-wrap > .slide",
						animation: flexsAnimation,
						easing: flexsEasing,
						direction: flexsDirection,
						slideshow: flexsSlideshow,
						slideshowSpeed: Number(flexsPause),
						animationSpeed: Number(flexsSpeed),
						pauseOnHover: flexsHover,
						video: flexsVideo,
						controlNav: flexsPagi,
						directionNav: flexsArrows,
						smoothHeight: flexsSheight,
						useCSS: flexsUseCSS,
						start: function(slider){
							eBiz.widget.animations();
							eBiz.initialize.verticalMiddle();
							slider.parent().removeClass('preloader2');
							var t = setTimeout( function(){ $('#portfolio.portfolio-masonry,#portfolio.portfolio-full,#posts.post-masonry').isotope('layout'); }, 1200 );
							eBiz.initialize.lightbox();
							$('.flex-prev').html('<i class="icon-angle-left"></i>');
							$('.flex-next').html('<i class="icon-angle-right"></i>');
							eBiz.portfolio.portfolioDescMargin();
						},
						after: function(){
							if( $portfolio.has('portfolio-full') ) {
								$('#portfolio.portfolio-full').isotope('layout');
								eBiz.portfolio.portfolioDescMargin();
							}
						}
					});
				});
			}
		},

		html5Video: function(){
			var videoEl = $('.video-wrap:has(video)');
			if( videoEl.length > 0 ) {
				videoEl.each(function(){
					var element = $(this),
						elementVideo = element.find('video'),
						outerContainerWidth = element.outerWidth(),
						outerContainerHeight = element.outerHeight(),
						innerVideoWidth = elementVideo.outerWidth(),
						innerVideoHeight = elementVideo.outerHeight();

					if( innerVideoHeight < outerContainerHeight ) {
						var videoAspectRatio = innerVideoWidth/innerVideoHeight,
							newVideoWidth = outerContainerHeight * videoAspectRatio,
							innerVideoPosition = (newVideoWidth - outerContainerWidth) / 2;
						elementVideo.css({ 'width': newVideoWidth+'px', 'height': outerContainerHeight+'px', 'left': -innerVideoPosition+'px' });
					} else {
						var innerVideoPosition = (innerVideoHeight - outerContainerHeight) / 2;
						elementVideo.css({ 'width': innerVideoWidth+'px', 'height': innerVideoHeight+'px', 'top': -innerVideoPosition+'px' });
					}

					if( eBiz.isMobile.any() ) {
						var placeholderImg = elementVideo.attr('poster');

						if( placeholderImg != '' ) {
							element.append('<div class="video-placeholder" style="background-image: url('+ placeholderImg +');"></div>')
						}
					}
				});
			}
		},

		youtubeBgVideo: function(){
			if( $youtubeBgPlayerEl.length > 0 ){
				$youtubeBgPlayerEl.each( function(){
					var element = $(this),
						ytbgVideo = element.attr('data-video'),
						ytbgMute = element.attr('data-mute'),
						ytbgRatio = element.attr('data-ratio'),
						ytbgQuality = element.attr('data-quality'),
						ytbgOpacity = element.attr('data-opacity'),
						ytbgContainer = element.attr('data-container'),
						ytbgOptimize = element.attr('data-optimize'),
						ytbgLoop = element.attr('data-loop'),
						ytbgVolume = element.attr('data-volume'),
						ytbgStart = element.attr('data-start'),
						ytbgStop = element.attr('data-stop'),
						ytbgAutoPlay = element.attr('data-autoplay'),
						ytbgFullScreen = element.attr('data-fullscreen');

					if( ytbgMute == 'false' ) { ytbgMute = false; } else { ytbgMute = true; }
					if( !ytbgRatio ) { ytbgRatio = '16/9'; }
					if( !ytbgQuality ) { ytbgQuality = 'hd720'; }
					if( !ytbgOpacity ) { ytbgOpacity = 1; }
					if( !ytbgContainer ) { ytbgContainer = 'self'; }
					if( ytbgOptimize == 'false' ) { ytbgOptimize = false; } else { ytbgOptimize = true; }
					if( ytbgLoop == 'false' ) { ytbgLoop = false; } else { ytbgLoop = true; }
					if( !ytbgVolume ) { ytbgVolume = 1; }
					if( !ytbgStart ) { ytbgStart = 0; }
					if( !ytbgStop ) { ytbgStop = 0; }
					if( ytbgAutoPlay == 'false' ) { ytbgAutoPlay = false; } else { ytbgAutoPlay = true; }
					if( ytbgFullScreen == 'true' ) { ytbgFullScreen = true; } else { ytbgFullScreen = false; }

					element.mb_YTPlayer({
						videoURL: ytbgVideo,
						mute: ytbgMute,
						ratio: ytbgRatio,
						quality: ytbgQuality,
						opacity: Number(ytbgOpacity),
						containment: ytbgContainer,
						optimizeDisplay: ytbgOptimize,
						loop: ytbgLoop,
						vol: Number(ytbgVolume),
						startAt: Number(ytbgStart),
						stopAt: Number(ytbgStop),
						autoplay: ytbgAutoPlay,
						realfullscreen: ytbgFullScreen,
						showYTLogo: false,
						showControls: false
					});
				});
			}
		},

		tabs: function(){
			var $tabs = $('.tabs:not(.customjs)');
			if( $tabs.length > 0 ) {
				$tabs.each( function(){
					var element = $(this),
						elementSpeed = element.attr('data-speed'),
						tabActive = element.attr('data-active');

					if( !elementSpeed ) { elementSpeed = 400; }
					if( !tabActive ) { tabActive = 0; } else { tabActive = tabActive - 1; }

					element.tabs({
						active: Number(tabActive),
						show: {
							effect: "fade",
							duration: Number(elementSpeed)
						}
					});
				});
			}
		},

		tabsJustify: function(){
			if( !$('body').hasClass('device-xxs') && !$('body').hasClass('device-xs') ){
				var $tabsJustify = $('.tabs.tabs-justify');
				if( $tabsJustify.length > 0 ) {
					$tabsJustify.each( function(){
						var element = $(this),
							elementTabs = element.find('.tab-nav > li'),
							elementTabsNo = elementTabs.length,
							elementContainer = 0,
							elementWidth = 0;

						if( element.hasClass('tabs-bordered') || element.hasClass('tabs-bb') ) {
							elementContainer = element.find('.tab-nav').outerWidth();
						} else {
							if( element.find('tab-nav').hasClass('tab-nav2') ) {
								elementContainer = element.find('.tab-nav').outerWidth() - (elementTabsNo * 10);
							} else {
								elementContainer = element.find('.tab-nav').outerWidth() - 30;
							}
						}

						elementWidth = Math.floor(elementContainer/elementTabsNo);
						elementTabs.css({ 'width': elementWidth + 'px' });

					});
				}
			} else { $('.tabs.tabs-justify').find('.tab-nav > li').css({ 'width': 'auto' }); }
		},
		
		tabsJustifyResponsive: function(){
			if( !$('body').hasClass('device-xxs') && !$('body').hasClass('device-xs') ){
				var $tabsJustify = $('.responsiveTabs.tabs-justify-responsive');
				if( $tabsJustify.length > 0 ) {
					$tabsJustify.each( function(){
						var element = $(this),
							elementTabs = element.find('.tab-nav > li'),
							elementTabsNo = elementTabs.length,
							elementContainer = 0,
							elementWidth = 0;

						if( element.hasClass('tabs-bordered') || element.hasClass('tabs-bb') ) {
							elementContainer = element.find('.tab-nav').outerWidth();
						} else {
							if( element.find('tab-nav').hasClass('tab-nav2') ) {
								elementContainer = element.find('.tab-nav').outerWidth() - (elementTabsNo * 10);
							} else {
								elementContainer = element.find('.tab-nav').outerWidth() - 30;
							}
						}

						elementWidth = Math.floor(elementContainer/elementTabsNo);
						elementTabs.css({ 'width': elementWidth + 'px' });

					});
				}
			} else { $('.responsiveTabs.tabs-justify-responsive').find('.tab-nav > li').css({ 'width': 'auto' }); }
		},		
		
		responsiveTabs: function(){
            var $responsiveTabs = $('.responsiveTabs');
            $responsiveTabs.responsiveTabs({
                rotate: false,
                startCollapsed: 'accordion',
                collapsible: 'accordion',
                setHash: false
            });			
		},

		toggles: function(){
			var $toggle = $('.toggle');
			if( $toggle.length > 0 ) {
				$toggle.each( function(){
					var element = $(this),
						elementState = element.attr('data-state');

					if( elementState != 'open' ){
						element.find('.togglec').hide();
					} else {
						element.find('.togglet').addClass("toggleta");
					}

					element.find('.togglet').click(function(){
						$(this).toggleClass('toggleta').next('.togglec').slideToggle(300);
						return true;
					});
				});
			}
		},

		accordions: function(){
			var $accordionEl = $('.accordion');
			if( $accordionEl.length > 0 ){
				$accordionEl.each( function(){
					var element = $(this),
						elementState = element.attr('data-state'),
						accordionActive = element.attr('data-active');

					if( !accordionActive ) { accordionActive = 0; } else { accordionActive = accordionActive - 1; }

					element.find('.acc_content').hide();

					if( elementState != 'closed' ) {
						element.find('.acctitle:eq('+ Number(accordionActive) +')').addClass('acctitlec').next().show();
					}

					element.find('.acctitle').click(function(){
						if( $(this).next().is(':hidden') ) {
							element.find('.acctitle').removeClass('acctitlec').next().slideUp("normal");
							$(this).toggleClass('acctitlec').next().slideDown("normal");
						}
						return false;
					});
				});
			}
		},

		counter: function(){
			var $counterEl = $('.counter:not(.counter-instant)');
			if( $counterEl.length > 0 ){
				$counterEl.each(function(){
					var element = $(this);
					var counterElementComma = $(this).find('span').attr('data-comma');
					if( !counterElementComma ) { counterElementComma = false; } else { counterElementComma = true; }
					if( $body.hasClass('device-lg') || $body.hasClass('device-md') ){
						element.appear( function(){
							eBiz.widget.runCounter( element, counterElementComma );
							if( element.parents('.common-height') ) {
								eBiz.initialize.maxHeight();
							}
						},{accX: 0, accY: -120},'easeInCubic');
					} else {
						eBiz.widget.runCounter( element, counterElementComma );
					}
				});
			}
		},

		runCounter: function( counterElement,counterElementComma ){
			if( counterElementComma == true ) {
				counterElement.find('span').countTo({
					formatter: function (value, options) {
						value = value.toFixed(options.decimals);
						value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
						return value;
					}
				});
			} else {
				counterElement.find('span').countTo();
			}
		},

		roundedSkill: function(){
			var $roundedSkillEl = $('.rounded-skill');
			if( $roundedSkillEl.length > 0 ){
				$roundedSkillEl.each(function(){
					var element = $(this);

					var roundSkillSize = element.attr('data-size');
					var roundSkillSpeed = element.attr('data-speed');
					var roundSkillWidth = element.attr('data-width');
					var roundSkillColor = element.attr('data-color');
					var roundSkillTrackColor = element.attr('data-trackcolor');

					if( !roundSkillSize ) { roundSkillSize = 140; }
					if( !roundSkillSpeed ) { roundSkillSpeed = 2000; }
					if( !roundSkillWidth ) { roundSkillWidth = 8; }
					if( !roundSkillColor ) { roundSkillColor = '#0093BF'; }
					if( !roundSkillTrackColor ) { roundSkillTrackColor = 'rgba(0,0,0,0.04)'; }

					var properties = {roundSkillSize:roundSkillSize, roundSkillSpeed:roundSkillSpeed, roundSkillWidth:roundSkillWidth, roundSkillColor:roundSkillColor, roundSkillTrackColor:roundSkillTrackColor};

					if( $body.hasClass('device-lg') || $body.hasClass('device-md') ){
						element.css({'width':roundSkillSize+'px','height':roundSkillSize+'px','line-height':roundSkillSize+'px'}).animate({opacity:0}, 10);
						element.appear( function(){
							if (!element.hasClass('skills-animated')) {
								var t = setTimeout( function(){ element.css({opacity: 1}); }, 100 );
								eBiz.widget.runRoundedSkills( element, properties );
								element.addClass('skills-animated');
							}
						},{accX: 0, accY: -120},'easeInCubic');
					} else {
						eBiz.widget.runRoundedSkills( element, properties );
					}
				});
			}
		},

		runRoundedSkills: function( element, properties ){
			element.easyPieChart({
				size: Number(properties.roundSkillSize),
				animate: Number(properties.roundSkillSpeed),
				scaleColor: false,
				trackColor: properties.roundSkillTrackColor,
				lineWidth: Number(properties.roundSkillWidth),
				lineCap: 'square',
				barColor: properties.roundSkillColor
			});
		},

		progress: function(){
			var $progressEl = $('.progress');
			if( $progressEl.length > 0 ){
				$progressEl.each(function(){
					var element = $(this),
						skillsBar = element.parent('li'),
						skillValue = skillsBar.attr('data-percent');

					if( $body.hasClass('device-lg') || $body.hasClass('device-md') ){
						element.appear( function(){
							if (!skillsBar.hasClass('skills-animated')) {
								element.find('.counter-instant span').countTo();
								skillsBar.find('.progress').css({width: skillValue + "%"}).addClass('skills-animated');
							}
						},{accX: 0, accY: -120},'easeInCubic');
					} else {
						element.find('.counter-instant span').countTo();
						skillsBar.find('.progress').css({width: skillValue + "%"});
					}
				});
			}
		},

		twitterFeed: function(){
			var $twitterFeedEl = $('.twitter-feed');
			if( $twitterFeedEl.length > 0 ){
				$twitterFeedEl.each(function() {
					var element = $(this),
						twitterFeedUser = element.attr('data-username'),
						twitterFeedCount = element.attr('data-count');

					if( !twitterFeedUser ) { twitterFeedUser = 'twitter' }
					if( !twitterFeedCount ) { twitterFeedCount = 3 }

					$.getJSON('include/twitter/tweets.php?username='+ twitterFeedUser +'&count='+ twitterFeedCount, function(tweets){
						if( element.hasClass('fslider') ) {
							element.find(".slider-wrap").html(sm_format_twitter3(tweets)).promise().done(function(){
								var timer = setInterval(function(){
									if( element.find('.slide').length > 1 ) {
										element.removeClass('customjs');
										var t = setTimeout( function(){ eBiz.widget.loadFlexSlider(); }, 500);
										clearInterval(timer);
									}
								},500);
							});
						} else {
							element.html(sm_format_twitter(tweets));
						}
					});
				});
			}
		},

		flickrFeed: function(){
			var $flickrFeedEl = $('.flickr-feed');
			if( $flickrFeedEl.length > 0 ){
				$flickrFeedEl.each(function() {
					var element = $(this),
						flickrFeedID = element.attr('data-id'),
						flickrFeedCount = element.attr('data-count'),
						flickrFeedType = element.attr('data-type'),
						flickrFeedTypeGet = 'photos_public.gne';

					if( flickrFeedType == 'group' ) { flickrFeedTypeGet = 'groups_pool.gne'; }
					if( !flickrFeedCount ) { flickrFeedCount = 9; }

					element.jflickrfeed({
						feedapi: flickrFeedTypeGet,
						limit: Number(flickrFeedCount),
						qstrings: {
							id: flickrFeedID
						},
						itemTemplate: '<a href="{{image_b}}" title="{{title}}" data-lightbox="gallery-item">' +
											'<img src="{{image_s}}" alt="{{title}}" />' +
									  '</a>'
					}, function(data) {
						eBiz.initialize.lightbox();
					});
				});
			}
		},

		instagramPhotos: function( c_accessToken, c_clientID ){
			var $instagramPhotosEl = $('.instagram-photos');
			if( $instagramPhotosEl.length > 0 ){

				$instagramPhotosEl.each(function() {
					var element = $(this),
						instaGramTarget = element.attr('id'),
						instaGramUserId = element.attr('data-user'),
						instaGramTag = element.attr('data-tag'),
						instaGramLocation = element.attr('data-location'),
						instaGramCount = element.attr('data-count'),
						instaGramType = element.attr('data-type'),
						instaGramSortBy = element.attr('data-sortBy'),
						instaGramRes = element.attr('data-resolution');

					if( !instaGramCount ) { instaGramCount = 9; }
					if( !instaGramSortBy ) { instaGramSortBy = 'none'; }
					if( !instaGramRes ) { instaGramRes = 'thumbnail'; }

					if( instaGramType == 'user' ) {

						var feed = new Instafeed({
							target: instaGramTarget,
							get: instaGramType,
							userId: Number(instaGramUserId),
							limit: Number(instaGramCount),
							sortBy: instaGramSortBy,
							resolution: instaGramRes,
							accessToken: c_accessToken,
							clientId: c_clientID
						});

					} else if( instaGramType == 'tagged' ) {

						var feed = new Instafeed({
							target: instaGramTarget,
							get: instaGramType,
							tagName: instaGramTag,
							limit: Number(instaGramCount),
							sortBy: instaGramSortBy,
							resolution: instaGramRes,
							clientId: c_clientID
						});

					} else if( instaGramType == 'location' ) {

						var feed = new Instafeed({
							target: instaGramTarget,
							get: instaGramType,
							locationId: Number(instaGramUserId),
							limit: Number(instaGramCount),
							sortBy: instaGramSortBy,
							resolution: instaGramRes,
							clientId: c_clientID
						});

					} else {

						var feed = new Instafeed({
							target: instaGramTarget,
							get: 'popular',
							limit: Number(instaGramCount),
							sortBy: instaGramSortBy,
							resolution: instaGramRes,
							clientId: c_clientID
						});

					}

					feed.run();
				});
			}
		},

		dribbbleShots: function(){
			var $dribbbleShotsEl = $('.dribbble-shots');
			if( $dribbbleShotsEl.length > 0 ){
				$dribbbleShotsEl.each(function() {
					var element = $(this),
						dribbbleUsername = element.attr('data-user'),
						dribbbleCount = element.attr('data-count'),
						dribbbleList = element.attr('data-list'),
						dribbbleType = element.attr('data-type');

					if( !dribbbleCount ) { dribbbleCount = 9; }

					if( dribbbleType == 'follows' ) {
						$.jribbble.getShotsThatPlayerFollows( dribbbleUsername , function (followedShots) {
							var html = [];
							$.each(followedShots.shots, function (i, shot) {
								html.push('<a href="' + shot.url + '" target="_blank">');
								html.push('<img src="' + shot.image_teaser_url + '" ');
								html.push('alt="' + shot.title + '"></a>');
							});
							element.html(html.join(''));
						}, {page: 1, per_page: Number(dribbbleCount)});
					} else if( dribbbleType == 'user' ) {
						$.jribbble.getShotsByPlayerId( dribbbleUsername , function (playerShots) {
							var html = [];
							$.each(playerShots.shots, function (i, shot) {
								html.push('<a href="' + shot.url + '" target="_blank">');
								html.push('<img src="' + shot.image_teaser_url + '" ');
								html.push('alt="' + shot.title + '"></a>');
							});
							element.html(html.join(''));
						}, {page: 1, per_page: Number(dribbbleCount)});
					} else if( dribbbleType == 'list' ) {
						$.jribbble.getShotsByList( dribbbleList , function (listDetails) {
							var html = [];
							$.each(listDetails.shots, function (i, shot) {
								html.push('<a href="' + shot.url + '" target="_blank">');
								html.push('<img src="' + shot.image_teaser_url + '" ');
								html.push('alt="' + shot.title + '"></a>');
							});
							element.html(html.join(''));
						}, {page: 1, per_page: Number(dribbbleCount)});
					}
				});
			}
		},

		navTree: function(){
			var $navTreeEl = $('.nav-tree');
			if( $navTreeEl.length > 0 ){
				$navTreeEl.each( function(){
					var element = $(this),
						elementSpeed = element.attr('data-speed'),
						elementEasing = element.attr('data-easing');

					if( !elementSpeed ) { elementSpeed = 250; }
					if( !elementEasing ) { elementEasing = 'swing'; }

					element.find( 'ul li:has(ul)' ).addClass('sub-menu');
					element.find( 'ul li:has(ul) > a' ).append( ' <i class="icon-angle-down"></i>' );

					if( element.hasClass('on-hover') ){
						element.find( 'ul li:has(ul):not(.active)' ).hover( function(e){
							$(this).children('ul').stop(true, true).slideDown( Number(elementSpeed), elementEasing);
						}, function(){
							$(this).children('ul').delay(250).slideUp( Number(elementSpeed), elementEasing);
						});
					} else {
						element.find( 'ul li:has(ul) > a' ).click( function(e){
							var childElement = $(this);
							element.find( 'ul li' ).not(childElement.parents()).removeClass('active');
							childElement.parent().children('ul').slideToggle( Number(elementSpeed), elementEasing, function(){
								$(this).find('ul').hide();
								$(this).find('li.active').removeClass('active');
							});
							element.find( 'ul li > ul' ).not(childElement.parent().children('ul')).not(childElement.parents('ul')).slideUp( Number(elementSpeed), elementEasing );
							childElement.parent('li:has(ul)').toggleClass('active');
							e.preventDefault();
						});
					}
				});
			}
		},

		masonryThumbs: function(){
			var $masonryThumbsEl = $('.masonry-thumbs');
			if( $masonryThumbsEl.length > 0 ){
				$masonryThumbsEl.each( function(){
					var masonryItemContainer = $(this);
					eBiz.widget.masonryThumbsArrange( masonryItemContainer );
				});
			}
		},

		masonryThumbsArrange: function( element ){
			eBiz.initialize.setFullColumnWidth( element );
			element.isotope('layout');
		},

		notifications: function( element ){
			toastr.clear();
			var notifyElement = $(element),
				notifyPosition = notifyElement.attr('data-notify-position'),
				notifyType = notifyElement.attr('data-notify-type'),
				notifyMsg = notifyElement.attr('data-notify-msg'),
				notifyCloseButton = notifyElement.attr('data-notify-close');

			if( !notifyPosition ) { notifyPosition = 'toast-top-right'; } else { notifyPosition = 'toast-' + notifyElement.attr('data-notify-position'); }
			if( !notifyMsg ) { notifyMsg = 'Please set a message!'; }
			if( notifyCloseButton == 'true' ) { notifyCloseButton = true; } else { notifyCloseButton = false; }

			toastr.options.positionClass = notifyPosition;
			toastr.options.closeButton = notifyCloseButton;
			toastr.options.closeHtml = '<button><i class="icon-remove"></i></button>';

			if( notifyType == 'warning' ) {
				toastr.warning(notifyMsg);
			} else if( notifyType == 'error' ) {
				toastr.error(notifyMsg);
			} else if( notifyType == 'success' ) {
				toastr.success(notifyMsg);
			} else {
				toastr.info(notifyMsg);
			}

			return false;
		},

		textRotater: function(){
			if( $textRotaterEl.length > 0 ){
				$textRotaterEl.each(function(){
					var element = $(this),
						trRotate = $(this).attr('data-rotate'),
						trSpeed = $(this).attr('data-speed'),
						trSeparator = $(this).attr('data-separator');

					if( !trRotate ) { trRotate = "fade"; }
					if( !trSpeed ) { trSpeed = 1200; }
					if( !trSeparator ) { trSeparator = ","; }

					var tRotater = $(this).find('.t-rotate');

					tRotater.Morphext({
						animation: trRotate,
						separator: trSeparator,
						speed: Number(trSpeed)
					});
				});
			}
		},

		linkScroll: function(){
			$("a[data-scrollto]").click(function(){
				var element = $(this),
					divScrollToAnchor = element.attr('data-scrollto'),
					divScrollSpeed = element.attr('data-speed'),
					divScrollOffset = element.attr('data-offset'),
					divScrollEasing = element.attr('data-easing'),
					divScrollHighlight = element.attr('data-highlight');

					if( !divScrollSpeed ) { divScrollSpeed = 750; }
					if( !divScrollOffset ) { divScrollOffset = eBiz.initialize.topScrollOffset(); }
					if( !divScrollEasing ) { divScrollEasing = 'easeOutQuad'; }

				$('html,body').stop(true).animate({
					'scrollTop': $( divScrollToAnchor ).offset().top - Number(divScrollOffset)
				}, Number(divScrollSpeed), divScrollEasing, function(){
					if( divScrollHighlight != '' ) {
						if( $(divScrollToAnchor).find('.highlight-me').length > 0 ) {
							$(divScrollToAnchor).find('.highlight-me').animate({'backgroundColor': divScrollHighlight}, 300);
							var t = setTimeout( function(){ $(divScrollToAnchor).find('.highlight-me').animate({'backgroundColor': 'transparent'}, 300); }, 500 );
						} else {
							$(divScrollToAnchor).animate({'backgroundColor': divScrollHighlight}, 300);
							var t = setTimeout( function(){ $(divScrollToAnchor).animate({'backgroundColor': 'transparent'}, 300); }, 500 );
						}
					}
				});

				return false;
			});
		},

		cookieNotify: function(){
			if( $cookieNotification.length > 0 ) {
				var cookieNotificationHeight = $cookieNotification.outerHeight();

				$cookieNotification.css({ bottom: -cookieNotificationHeight });

				if( $.cookie('websiteUsesCookies') != 'yesConfirmed' ) {
					$cookieNotification.css({ bottom: 0 });
				}

				$('.cookie-accept').click( function(){
					$cookieNotification.css({ bottom: -cookieNotificationHeight });
					$.cookie('websiteUsesCookies', 'yesConfirmed', { expires: 30 });
					return false;
				});
			}
		},

		extras: function(){
			$('[data-toggle="tooltip"]').tooltip({container: 'body'});
			$('#primary-menu-trigger,#overlay-menu-close').click(function() {
				$( '#primary-menu > ul, #primary-menu > div > ul' ).toggleClass("show");
				return false;
			});
			$('#page-submenu-trigger').click(function() {
				$body.toggleClass('top-search-open', false);
				$pagemenu.toggleClass("pagemenu-active");
				return false;
			});
			$pagemenu.find('nav').click(function(e){
				$body.toggleClass('top-search-open', false);
				$topCart.toggleClass('top-cart-open', false);
			});
			if( eBiz.isMobile.any() ){
				$body.addClass('device-touch');
			}
			// var el = {
			//     darkLogo : $("<img>", {src: defaultDarkLogo}),
			//     darkRetinaLogo : $("<img>", {src: retinaDarkLogo})
			// };
			// el.darkLogo.prependTo("body");
			// el.darkRetinaLogo.prependTo("body");
			// el.darkLogo.css({'position':'absolute','z-index':'-100'});
			// el.darkRetinaLogo.css({'position':'absolute','z-index':'-100'});
		}

	};

	eBiz.isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
		BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
		iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
		Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
		Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
		any: function() {
			return (eBiz.isMobile.Android() || eBiz.isMobile.BlackBerry() || eBiz.isMobile.iOS() || eBiz.isMobile.Opera() || eBiz.isMobile.Windows());
		}
	};

	eBiz.documentOnResize = {

		init: function(){

			var t = setTimeout( function(){
				eBiz.header.topsocial();
				eBiz.header.fullWidthMenu();
				eBiz.header.overlayMenu();
				eBiz.initialize.fullScreen();
				eBiz.initialize.verticalMiddle();
				eBiz.initialize.maxHeight();
				eBiz.initialize.testimonialsGrid();
				eBiz.initialize.stickyFooter();
				eBiz.slider.captionPosition();
				eBiz.portfolio.arrange();
				eBiz.portfolio.portfolioDescMargin();
				eBiz.widget.tabsJustify();
				eBiz.widget.tabsJustifyResponsive();				
				eBiz.widget.html5Video();
				eBiz.widget.masonryThumbs();
				eBiz.initialize.dataResponsiveClasses();
				eBiz.initialize.dataResponsiveHeights();
			}, 500 );

		}

	};

	eBiz.documentOnReady = {

		init: function(){
			eBiz.initialize.init();
			eBiz.header.init();
			if( $slider.length > 0 ) { eBiz.slider.init(); }
			if( $portfolio.length > 0 ) { eBiz.portfolio.init(); }
			eBiz.widget.init();
			eBiz.documentOnReady.windowscroll();
		},

		windowscroll: function(){

			var headerOffset = 0,
				headerWrapOffset = 0,
				pageMenuOffset = 0;

			if( $header.length > 0 ) { headerOffset = $header.offset().top; }
			if( $header.length > 0 ) { headerWrapOffset = $headerWrap.offset().top; }
			if( $pagemenu.length > 0 ) {
				if( $header.length > 0 && !$header.hasClass('no-sticky') ) {
					pageMenuOffset = $pagemenu.offset().top - $header.outerHeight();
				} else {
					pageMenuOffset = $pagemenu.offset().top;
				}
			}

			var headerDefinedOffset = $header.attr('data-sticky-offset');
			if( typeof headerDefinedOffset !== 'undefined' ) {
				if( headerDefinedOffset == 'full' ) {
					headerWrapOffset = $window.height();
					var headerOffsetNegative = $header.attr('data-sticky-offset-negative');
					if( typeof headerOffsetNegative !== 'undefined' ) { headerWrapOffset = headerWrapOffset - headerOffsetNegative - 1; }
				} else {
					headerWrapOffset = Number(headerDefinedOffset);
				}
			}

			$window.on( 'scroll', function(){

				eBiz.initialize.goToTopScroll();
				$('body.open-header.close-header-on-scroll').removeClass("side-header-open");
				eBiz.header.stickyMenu( headerWrapOffset );
				eBiz.header.stickyPageMenu( pageMenuOffset );
				eBiz.header.logo();

			});

			window.addEventListener('scroll', onScrollSliderParallax, false);

			if( $onePageMenuEl.length > 0 ){
				$window.scrolled(function() {
					eBiz.header.onepageScroller();
				});
			}
		}

	};

	eBiz.documentOnLoad = {

		init: function(){
			eBiz.slider.captionPosition();
			eBiz.slider.swiperSliderMenu(true);
			eBiz.slider.revolutionSliderMenu(true);
			eBiz.initialize.maxHeight();
			eBiz.initialize.testimonialsGrid();
			eBiz.initialize.verticalMiddle();
			eBiz.initialize.stickFooterOnSmall();
			eBiz.initialize.stickyFooter();
			eBiz.portfolio.portfolioDescMargin();
			eBiz.portfolio.arrange();
			eBiz.widget.parallax();
			eBiz.widget.loadFlexSlider();
			eBiz.widget.html5Video();
			eBiz.widget.masonryThumbs();
			eBiz.slider.owlCaptionInit();
			eBiz.header.topsocial();
			eBiz.header.responsiveMenuClass();
			eBiz.initialize.modal();
		}

	};

	var $window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$headerWrap = $('#header-wrap'),
		$content = $('#content'),
		$footer = $('#footer'),
		oldHeaderClasses = $header.attr('class'),
		oldHeaderWrapClasses = $headerWrap.attr('class'),
		stickyMenuClasses = $header.attr('data-sticky-class'),
		responsiveMenuClasses = $header.attr('data-responsive-class'),
		defaultLogo = $('#logo').find('.standard-logo'),
		defaultLogoWidth = defaultLogo.find('img').outerWidth(),
		retinaLogo = $('#logo').find('.retina-logo'),
		defaultLogoImg = defaultLogo.find('img').attr('src'),
		retinaLogoImg = retinaLogo.find('img').attr('src'),
		defaultDarkLogo = defaultLogo.attr('data-dark-logo'),
		retinaDarkLogo = retinaLogo.attr('data-dark-logo'),
		defaultStickyLogo = defaultLogo.attr('data-sticky-logo'),
		retinaStickyLogo = retinaLogo.attr('data-sticky-logo'),
		defaultMobileLogo = defaultLogo.attr('data-mobile-logo'),
		retinaMobileLogo = retinaLogo.attr('data-mobile-logo'),
		$pagemenu = $('#page-menu'),
		$onePageMenuEl = $('.one-page-menu'),
		onePageGlobalOffset = 0,
		$portfolio = $('#portfolio'),
		$slider = $('#slider'),
		$sliderParallaxEl = $('.slider-parallax'),
		$pageTitle = $('#page-title'),
		$portfolioItems = $('.portfolio-ajax').find('.portfolio-item'),
		$portfolioDetails = $('#portfolio-ajax-wrap'),
		$portfolioDetailsContainer = $('#portfolio-ajax-container'),
		$portfolioAjaxLoader = $('#portfolio-ajax-loader'),
		prevPostPortId = '',
		$topSearch = $('#top-search'),
		$topCart = $('#top-cart'),
		$verticalMiddleEl = $('.vertical-middle'),
		$topSocialEl = $('#top-social').find('li'),
		$siStickyEl = $('.si-sticky'),
		$dotsMenuEl = $('.dots-menu'),
		$goToTopEl = $('#gotoTop'),
		$fullScreenEl = $('.full-screen'),
		$commonHeightEl = $('.common-height'),
		$testimonialsGridEl = $('.testimonials-grid'),
		$pageSectionEl = $('.page-section'),
		$owlCarouselEl = $('.owl-carousel'),
		$parallaxEl = $('.parallax'),
		$parallaxPageTitleEl = $('.page-title-parallax'),
		$parallaxPortfolioEl = $('.portfolio-parallax').find('.portfolio-image'),
		$youtubeBgPlayerEl = $('.yt-bg-player'),
		$textRotaterEl = $('.text-rotater'),
		$cookieNotification = $('#cookie-notification');

	$(document).ready( eBiz.documentOnReady.init );
	$window.load( eBiz.documentOnLoad.init );
	$window.on( 'resize', eBiz.documentOnResize.init );

})(jQuery);


 function flashLoader(e, t, a, n, r, i, o, c, s) { var l = "", d = ""; if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i)) "Footer" == c && -1 != e.indexOf("ebiz_footer_logo") && document.write('<div style="font: italic bold 10px Arial; margin-top: 2px;">eBizAutos</div>'); else { if (-1 != t.indexOf("ssl=true") || -1 != e.indexOf("https://") ? (d = "https://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0", l = "https://www.macromedia.com/go/getflashplayer") : (d = "http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0", l = "http://www.macromedia.com/go/getflashplayer"), document.write('<object type="application/x-shockwave-flash" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="' + d + '" width="' + n + '" height="' + a + '" id="' + c + '" align="' + r + '">'), document.write('<param name="flashvars" value="' + t + '">'), document.write('<param name="movie" value="' + e + '">'), document.write('<param name="quality" value="' + i + '">'), null == s) var s = "", h = ""; else { document.write('<param name="scale" value="' + s + '">'); var h = ' scale="' + s + '"' } document.write('<param name="bgcolor" value="' + o + '">'), document.write('<param name="wmode" value="transparent">'), document.write('<param name="allowscriptaccess" value="always">'), document.write('<embed src="' + e + '" quality="' + i + '"' + h + ' bgcolor="' + o + '"  width="' + n + '" height="' + a + '" name="' + c + '" align="' + r + '" TYPE="application/x-shockwave-flash" pluginspage="' + l + '" flashvars="' + t + '" wmode="transparent" allowscriptaccess="always"></embed>'), document.write("</object>") } } function getValue(e) { return null == e ? "" : e } function isTouchDevice() { return !!("ontouchstart" in window) } function OpenWindow(e, t, a, n) { "undefined" != typeof wl_bj_pre && (e = wl_bj_pre + e), window.open(e, t, "width=" + a + ",height=" + n) } function OpenWindowResizable(e, t, a, n) { "undefined" != typeof wl_bj_pre && (e = wl_bj_pre + e), window.open(e, t, "width=" + a + ",height=" + n + ",resizable=1") } function OpenWindowCenter(e, t, a, n, r, i, o) { null != _popupObject && _popupObject.close(); var c = ""; r && (c += "scrollbars=yes, ", a += 16); var s = document.all ? window.screenLeft : window.screen.left, l = s + (window.screen.width - a) / 2, d = (window.screen.height - n) / 2; c += "width=" + a + ", height=" + n, c += ", top=" + d + ", left=" + l, "undefined" != typeof wl_bj_pre && (e = wl_bj_pre + e), popupWin = OpenWindowGADecorated(e, t, c), null != popupWin && popupWin.focus() } function OpenWindowCenterFrameOnly(e, t, a, n, r) { var i = 10; if (null != _popupObject && _popupObject.close(), -1 == e.indexOf("embedded=true")) { var o = ""; r && (o += "scrollbars=yes, ", a += 16); var c = document.all ? window.screenLeft : window.screen.left, s = c + (window.screen.width - a) / 2, l = (window.screen.height - n) / 2; o += "width=" + a + ", height=" + n, o += ", top=" + l + ", left=" + s, "undefined" != typeof wl_bj_pre && (e = wl_bj_pre + e), popupWin = OpenWindowGADecorated(e, t, o), null != popupWin && popupWin.focus() } else { _width = a, _height = n, _openedUrl = e; var d = '<div class="ClosePopupBtn" onmouseover="this.className=\'ClosePopupBtn_hover\'" onmouseout="this.className=\'ClosePopupBtn\'"><b></b></div><iframe src="" frameborder="0" scrolling="no" width="' + _width + '" height="' + _height + '"></iframe>', s = ""; (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i)) && (s = (window.innerWidth - a) / 2), IsIEQuirksMode() && (s = (document.body.clientWidth - a) / 2), _popupObject = $('<div id="popUpContent"></div>').modal({ zIndex: 2e4, close: !0, fixed: !1, containerCss: { width: _width, height: _height }, containerId: "PopupLoaderContainer", position: [i, s] }), $("#popUpContent").html(d), OpeniFrameGADecorated("#popUpContent iframe", e), $("#simplemodal-overlay, .ClosePopupBtn").bind("click.simplemodal", function (e) { e.preventDefault(), null != document.getElementById("_extIntViewContainer") && (document.getElementById("_extIntViewContainer").style.visibility = "visible"), _popupObject.close() }) } } function ReplaceLiterals(e) { return e ? e.replace(/\\/g, "\\\\").replace(/\'/g, "\\'") : "" } function closeSelf() { window.open("", "_parent", ""), window.opener = top, window.close() } function checkEmail(e) { var t = e.value; return checkEmailStr(t) } function checkEmailStr(e) { return /^[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.(([0-9]{1,3})|([a-zA-Z]{2,3})|(aero|coop|info|museum|name))$/.test(trim(e)) ? !0 : !1 } function checkEmpty(e) { return e.value.length > 0 ? !0 : !1 } function checkAllowedChars(e) { return null != e ? !metaCharacters.test(e.value) : !1 } function checkDate(e) { var t; return t = null != e.value ? e.value : null != e.val() ? e.val() : e, /^([1-9]|0[1-9]|1[012]|)[- \/.]([1-9]|0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d$/.test(t) ? !0 : !1 } function trim(e) { var t, a; for (t = 0, a = e.length - 1, e = e.split("") ; t < e.length && " " == e[t];) e[t] = "", t++; for (; a > 0 && " " == e[a];) e[a] = "", a--; return e.join("") } function IEVersionDetector() { if (-1 != navigator.userAgent.indexOf("MSIE 7.0") && -1 == navigator.userAgent.indexOf("Trident")) return 7; if (-1 != navigator.userAgent.indexOf("MSIE 8.0") || -1 != navigator.userAgent.indexOf("Trident/4.0")) return 8; if (-1 != navigator.userAgent.indexOf("MSIE 9.0") || -1 != navigator.userAgent.indexOf("Trident/5.0")) return 9; if (-1 != navigator.userAgent.indexOf("MSIE 10.0") || -1 != navigator.userAgent.indexOf("Trident/6.0")) return 10; if ("Netscape" == navigator.appName) { var e = -1, t = navigator.userAgent, a = new RegExp("Trident/.*rv:([0-9]{1,}[.0-9]{0,})"); if (null != a.exec(t) && (e = parseInt(RegExp.$1)), -1 != e) return 11 } return 0 } function IsIEQuirksMode() { return IEVersionDetector() > 0 && "BackCompat" == document.compatMode } function googleMapSubmit() { s0 = document.getElementById("tmpAddr"), s1 = document.getElementById("tmpAddr1"), s2 = document.getElementById("tmpAddr2"), s0.value = s1.value + ", " + s2.value } function isIE6() { var e = 0; if (-1 != navigator.appVersion.indexOf("MSIE")) { var t = navigator.appVersion.split("MSIE"); e = parseFloat(t[1]) } return 6 == e ? !0 : !1 } function IsEmpty(e) { return null == e ? !1 : 0 == e.value.length } function OpenPrintModal() { var e, t = ""; IsIEQuirksMode() && (t = (document.body.clientWidth - $("#PrintModalContent").width()) / 2), e = $("#PrintModalContent").modal({ zIndex: 2e4, close: !0, fixed: !1, position: [20, t] }), $("#simplemodal-overlay, .ClosePopup").bind("click.simplemodal", function (t) { t.preventDefault(), e.close() }) } function hideLinksPopup() { isActive || isActiveLinks ? timeId = setTimeout(hideLinksPopup, 200) : ($(".SocialLinksPopup").hide(), hasSocialRoundedButtons ? $(".SocialLinksIcons").css("background", "url(http://images.ebizautos.com/gallery/bookmarking_new/plus.png)") : $(".SocialLinksIcons").css("background", "url(http://images.ebizautos.com/gallery/bookmarking_square/plus.png)")) } function showLinksPopup(e) { $(".SocialLinksPopup", e).show(), hasSocialRoundedButtons ? $(e).css("background", "url(http://images.ebizautos.com/gallery/bookmarking_new/minus.png)") : $(e).css("background", "url(http://images.ebizautos.com/gallery/bookmarking_square/minus.png)") } function on_mouseoverSocialBookmarking(e, t) { isActive || (isActive = !0, "True" == e && (hasSocialRoundedButtons = !0), showLinksPopup(t)), clearTimeout(timeId), timeId = setTimeout(hideLinksPopup, 200) } function on_mouseoverLinks(e, t) { isActiveLinks || (isActiveLinks = !0, "True" == e && (hasSocialRoundedButtons = !0), showLinksPopup($(t).parent())), clearTimeout(timeId), timeId = setTimeout(hideLinksPopup, 200) } function on_mouseoutLinks() { isActiveLinks = !1, isActive = !1 } function ToggleNormal(e) { var t = e.className.indexOf("Hover"); t > 0 && (e.className = e.className.substr(0, t)) } function ToggleHover(e) { e.className = e.className + "Hover" } function ToggleHoverOrNormal(e) { var t = e.className.indexOf("Hover"); t > 0 ? e.className = e.className.substr(0, t) : e.className = e.className + "Hover" } function ToggleHoverOnMouseOut(e, t) { $.browser.msie ? isEqualOnMouseOut(e, t) && ToggleNormal(e) : ToggleNormal(e) } function isEqualOnMouseOut(e, t) { return e.parentNode == t.toElement || e.parentNode == t.toElement.parentNode || e.parentNode == t.toElement.childNodes[1] ? !0 : !1 } function OnMouseOverImg(e, t) { var a = document.getElementById(e), n = document.getElementById(e + "hover"); t ? (a.style.display = "none", n.style.display = "inline") : (a.style.display = "inline", n.style.display = "none") } function OnMouseOverSection(e, t, a) { var n = document.getElementById(e + "Body"); OnMouseOverImg(e + ("none" != n.style.display ? "Close" : "Open"), t), t ? "none" == n.style.display && (null != document.getElementById(e + "Hdr") && (document.getElementById(e + "Hdr").style.color = a), null != document.getElementById(e + "Text") && (document.getElementById(e + "Text").style.color = a)) : "none" == n.style.display && (null != document.getElementById(e + "Hdr") && (document.getElementById(e + "Hdr").style.color = ""), null != document.getElementById(e + "Text") && (document.getElementById(e + "Text").style.color = "")) } function onfocus_input(e, t, a) { var n = document.getElementById(t); a && (n.className = a), n.value == e && (n.value = "") } function onblur_input(e, t, a) { var n = document.getElementById(t); "" == n.value && (a && (n.className = a), n.value = e) } function select(e) { e.focus(), e.select() } function SwitchToLease(e) { var t = document.getElementById("_loanCalculator" + e); t.style.display = "none", t = document.getElementById("_leaseCalculator" + e), t.style.display = "block" } function SwitchToLoan(e) { var t = document.getElementById("_loanCalculator" + e); t.style.display = "block", t = document.getElementById("_leaseCalculator" + e), t.style.display = "none" } function onQQinput_focus(e, t) { (e.value == ConstErrorString || e.value == ConstRequiredString || e.value == ConstZipCodeErrorString || void 0 != t && e.value == t) && (e.value = ""), e.style.color = "" } function ShowHideSection(e, t, a) { var n = document.getElementById(a + e + "Body"); if (n) { null == t && (t = "none" == n.style.display); var r = "inline" == document.getElementById(a + e + "Closehover").style.display || "inline" == document.getElementById(a + e + "Openhover").style.display; t ? (n.style.display = "block", r ? (document.getElementById(a + e + "Closehover").style.display = "inline", document.getElementById(a + e + "Openhover").style.display = "none", document.getElementById(a + e + "Close").style.display = "none", document.getElementById(a + e + "Open").style.display = "none") : (document.getElementById(a + e + "Closehover").style.display = "none", document.getElementById(a + e + "Openhover").style.display = "none", document.getElementById(a + e + "Close").style.display = "inline", document.getElementById(a + e + "Open").style.display = "none")) : (n.style.display = "none", r ? (document.getElementById(a + e + "Closehover").style.display = "none", document.getElementById(a + e + "Openhover").style.display = "none", document.getElementById(a + e + "Close").style.display = "none", document.getElementById(a + e + "Open").style.display = "inline") : (document.getElementById(a + e + "Closehover").style.display = "none", document.getElementById(a + e + "Openhover").style.display = "none", document.getElementById(a + e + "Close").style.display = "none", document.getElementById(a + e + "Open").style.display = "inline")) } } function SwitchSection(e, t, a) { if ("none" == document.getElementById(a + e + "Body").style.display) for (i = 1; i <= t; i++) ShowHideSection(i, i == e, a); else ShowHideSection(e, !1, a) } function setDisableBtn(e) { $(e).css({ opacity: .5 }) } function setEnableBtn(e) { $(e).css("opacity", "") } function isDisableBtn(e) { return .5 == $(e).css("opacity") ? !0 : !1 } function isValidEmail(e) { return $("#EmailMessageContainer").empty(), checkEmailStr(e) && 0 != e.length ? !0 : (0 == e.length ? $("#EmailMessageContainer").append("<br />* Please fill out Email Address.") : checkEmailStr(e) || $("#EmailMessageContainer").append("<br />* Email address has wrong format."), $("#ErrorMessageBox").show(), !1) } function IsValueValid(e) { var t = /^[^<>\\]*$/; return t.test(e) } function IsYearValid(e) { var t = /^[^<>]*$/; return t.test(e) } function isNullOrEmpty(e) { return null == e || "" == e ? !0 : !1 } function checkOfferPrice(e) { var t = e.value; return /^(\$)?([0-9]+|[0-9]{1,3}(,[0-9]{3})*)$/.test(t) ? !0 : !1 } function clearDefaultText(e) { $.each(e, function () { var e = $("#" + this); e.length > 0 && e.val() == e.attr("title") && e.val("") }) } function repopulateDefaultText(e) { $.each(e, function () { var e = $("#" + this); e.length > 0 && 0 == e.val().length && e.val(e.attr("title")) }) } function RightHandPageWrapperHeigth() { $("#LeftHandPageWrapperBox").height() > $("#RightHandPageWrapperBox").height() ? $("#RightHandPageWrapperBox").height($("#LeftHandPageWrapperBox").height()) : $("#LeftHandPageWrapperBox").height($("#RightHandPageWrapperBox").height()) } function SwitchBodyStyleTab(e, t, a) { $("#NewVehicleMainTabContent .BodyStyle").hide(), 1 == e ? $("#NewVehicleMainTabContent .BodyStyle").show() : $("#NewVehicleMainTabContent .BodyStyle" + e).show() } function ValidatefirstOrLastName(e, t) { var a = e.val(); if (a = $.trim(a), e.hasClass("requiredInput") && 0 == a.length) return AddErrorHint(t), !1; if (!e.hasClass("requiredInput") && 0 == a.length) return RemoveErrorHint(t), RemoveValidHint(t), !0; if (a.length > 0) { if (!metaCharacters.test(e.val())) return AddValidHint(t), !0; AddErrorHint(t) } else AddErrorHint(t); return !1 } function ValidateText(e, t) { var a = e.val(); if (a = $.trim(a), e.hasClass("requiredInput") && 0 == a.length) return AddErrorHint(t), !1; if (!e.hasClass("requiredInput") && 0 == a.length) return RemoveErrorHint(t), RemoveValidHint(t), !0; if (a.length > 0) { if (!metaCharacters.test(e.val())) return RemoveErrorHint(t), AddValidHint(t), !0; AddErrorHint(t) } else AddErrorHint(t); return !1 } function ValidateEmail(e, t) { var a = e.val(); if (a = $.trim(a), a.length > 0) { if (checkEmailStr(a)) return AddValidHint(t), !0; AddErrorHint(t) } else AddErrorHint(t); return !1 } function ValidatePhone(e, t) { var a = ""; if (null != e.val() && (a = e.val().replace(/ /g, "").replace(/-/g, "").replace(/\(/g, "").replace(/\)/g, "")), e.hasClass("requiredInput") && 0 == a.length) return AddErrorHint(t), !1; if (!e.hasClass("requiredInput") && 0 == a.length) return RemoveErrorHint(t), RemoveValidHint(t), !0; if (a.length >= 8) { if (IsPhoneNumberValid(a) && !metaCharacters.test(a)) return AddValidHint(t), !0; AddErrorHint(t) } else AddErrorHint(t); return !1 } function ValidateVIN(e, t) { var a = e, n = /\w{17}/, r = ""; if (null != e.val() && (r = e.val().replace(/ /g, "").replace(/-/g, "").replace(/\(/g, "").replace(/\)/g, "")), e.hasClass("requiredInput") && 0 == r.length) return AddErrorHint(t), !1; if (!e.hasClass("requiredInput") && 0 == r.length) return RemoveErrorHint(t), RemoveValidHint(t), !0; if (0 == r.length || 17 == r.length) { if (n.test(a.val()) && !metaCharacters.test(r)) return AddValidHint(t), !0; AddErrorHint(t) } else AddErrorHint(t); return !1 } function ValidateYear(e, t) { var a = ""; if (null != e.val() && (a = e.val().replace(/ /g, "").replace(/-/g, "").replace(/\(/g, "").replace(/\)/g, "")), e.hasClass("requiredInput") && 0 == a.length) return AddErrorHint(t), !1; if (!e.hasClass("requiredInput") && 0 == a.length) return RemoveErrorHint(t), RemoveValidHint(t), !0; if (0 == a.length || 4 == a.length) { if (/^[-+]?\d{1,14}(\.\d{1,4})?$/.test(a) && !metaCharacters.test(a)) return AddValidHint(t), !0; AddErrorHint(t) } else AddErrorHint(t); return !1 } function ValidateMileage(e, t) { var a = ""; if (null != e.val() && (a = e.val().replace(/ /g, "").replace(/-/g, "").replace(/\(/g, "").replace(/\)/g, "")), e.hasClass("requiredInput") && 0 == a.length) return AddErrorHint(t), !1; if (!e.hasClass("requiredInput") && 0 == a.length) return RemoveErrorHint(t), RemoveValidHint(t), !0; if (a.length > 0 && a.length < 64) { if (/^[-+]?\d{1,14}(\.\d{1,4})?$/.test(a) && !metaCharacters.test(a)) return AddValidHint(t), !0; AddErrorHint(t) } else AddErrorHint(t); return !1 } function ValidatePayOffBalance(e, t) { var a = ""; if (null != e.val() && (a = e.val().replace(/ /g, "").replace(/-/g, "").replace(/\(/g, "").replace(/\)/g, "")), e.hasClass("requiredInput") && 0 == a.length) return AddErrorHint(t), !1; if (!e.hasClass("requiredInput") && 0 == a.length) return RemoveErrorHint(t), RemoveValidHint(t), !0; if (0 == a.length || a.length < 64) { if (/^\d+$/.test(a) && !metaCharacters.test(a)) return AddValidHint(t), !0; AddErrorHint(t) } else AddErrorHint(t); return !1 } function isValidZipCode(e) { return zipCodePattern[country].test(e) } function ValidateZip(e, t) { var a = ""; return null != e.val() && (a = e.val()), e.hasClass("requiredInput") && 0 == a.length ? (AddErrorHint(t), !1) : e.hasClass("requiredInput") || 0 != a.length ? zipCodePattern[country].test(a) && !metaCharacters.test(a) ? (AddValidHint(t), !0) : (AddErrorHint(t), !1) : (RemoveErrorHint(t), RemoveValidHint(t), !0) } function AddErrorHint(e) { e.removeClass("info"), e.removeClass("valid"), e.addClass("error"), e.addClass("errorClass"), e.removeClass("infoImg"), e.addClass("errorImg") } function AddValidHint(e) { e.removeClass("info"), e.removeClass("error"), e.removeClass("errorClass"), e.removeClass("infoImg"), e.removeClass("errorImg"), e.addClass("valid") } function RemoveErrorHint(e) { e.removeClass("error"), e.removeClass("errorClass"), e.removeClass("errorImg") } function RemoveValidHint(e) { e.removeClass("valid") } function pause(e) { for (var t = new Date; new Date - t <= e;); } function showTranslatePopup() { isOpenedTranslatePopup ? ($("#translatePopup").hide(), isOpenedTranslatePopup = !1) : ($("#translatePopup").show(), isOpenedTranslatePopup = !0) } function openWindowCenterForNids2(e, t, a, n) { _width = a, _height = n; var r = "", i = a - 23; (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i)) && (r = (window.innerWidth - a) / 2); var o = '<div class="ClosePopupBtnNids2" style="left:' + i + 'px" onmouseover="this.className=\'ClosePopupBtnNids2_hover\'" onmouseout="this.className=\'ClosePopupBtnNids2\'"><b></b></div><iframe src="" frameborder="0" scrolling="no" width="' + a + '" height="' + n + '"></iframe>'; _popupObject = $('<div id="PopUpContainer"></div>').modal({ zIndex: 2e4, close: !0, fixed: !1, containerCss: { width: _width, height: _height }, containerId: "PopupLoaderContainer", autoPosition: !0, position: [, r] }), $("#PopUpContainer").html(o), OpeniFrameGADecorated("#PopUpContainer iframe", e), $("#simplemodal-overlay, #PopUpContainer .ClosePopupBtnNids2").bind("click.simplemodal", function (e) { e.preventDefault(), _popupObject.close() }) } function OpenMediaViewerNIDS2(e) { TrackEvent("onLoad", 23, ""); var t = "true" == $.urlParam("plugin", _mediaViewerUrl); _mediaViewerUrl += (-1 != _mediaViewerUrl.indexOf("?") ? "&" : "?") + "tab=" + e; try { t ? mv2DetailStopSisterVideo(!1) : mv2DetailStopSisterVideo(!0), $(".mv2FlashVideoDiv").is("*") ? mv2DetailStopFlashVideo() : mv2DetailVideoPlayer.pause() } catch (a) { } if (t) return void window.open(_mediaViewerUrl, "_blank"); var n = 0, r = ""; (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i)) && (n = 1, r = window.innerWidth ? window.innerWidth : document.all ? document.body.offsetWidth : null), _popupObject = $('<div id="mv2Container"><div class="mv2ClosePopupBtnOuter"><div class="mv2ClosePopupBtn" onmouseover="ToggleHover(this)" onmouseout="ToggleNormal(this)"><b></b><div class="cleaner"></div></div></div><div class="mv2ContainerInner"></div></div>').modal({ zIndex: 31e3, close: !0, fixed: !0, containerCss: { width: r }, containerId: "mv2PopupLoaderContainer", position: [1, n], opacity: 85, onClose: function () { window.onresize = null, $("#SisterVideoContainer iframe:visible").length > 0 && last_played_sister_video_src.length > 0 && $("#SisterVideoContainer iframe:visible").attr("src", last_played_sister_video_src), $("#mv2ContentVideo").attr("src", ""), _popupObject.close() } }), $("#simplemodal-overlay, #mv2Container .mv2ClosePopupBtn").bind("click.simplemodal", function (e) { e.preventDefault(), _popupObject.close() }), $.ajax({ type: "POST", url: _mediaViewerUrl + "&popup=true", success: function (e) { var t = e.substring(e.indexOf("<body>") + 6, e.indexOf("</body>")); $("#mv2Container .mv2ContainerInner").html(t), MV2ResizeWindow(), window.onresize = function () { MV2ResizeWindow() } }, error: function (e, t) { $("#mv2Container .mv2ContainerInner").html('<div style="height:200px">Error occured while loading content.</div>') } }) } function makeUnselectableIERecursive(e) { 1 == e.nodeType && e.setAttribute("unselectable", "on"); for (var t = e.firstChild; t;) makeUnselectableIERecursive(t), t = t.nextSibling } function openDropDown(e) { var t = document.getElementById("hdnSizeY" + e).value, a = document.getElementById("hdnMaxDropDownheight" + e).value, n = parseInt(document.getElementById("hdnDdCount" + e).value), r = document.getElementById("hdnRowSize" + e).value * (n > 0 ? n : 1); "dropDownClosed" == document.getElementById(e).className ? (CloseAllDropDowns(), document.getElementById(e).className = "dropDownOpened", document.getElementById(e).style.height = a + "px", document.getElementById("dropDownInnerText" + e).style.height = a + "px", document.getElementById("leftBg" + e).style.height = r + "px", document.getElementById("rightBg" + e).style.height = r + "px", document.getElementById("initialArrow" + e).style.display = "none", document.getElementById("inlineArrow" + e).style.display = "block", document.getElementById("hiddenArrow" + e).style.display = "inline", document.getElementById("dropDownValuesList" + e).style.display = "block", document.getElementById("dropDownValuesList" + e).style.top = "-3px", document.getElementById(e).parentNode.parentNode.style.zIndex = "20000", document.getElementById("initialLabel" + e).style.display = "none", r - a > 0 && (document.getElementById("scrollContainer" + e).style.top = document.getElementById("inlineArrow" + e).offsetTop + parseInt(t) + 6 + "px", document.getElementById("scrollContainer" + e).style.left = document.getElementById("inlineArrow" + e).offsetLeft - 3 + "px"), InitDropDownScroller(e), $("#hdnDdMouseOverFlag" + e).val(!0)) : CloseDropDown(e), $("div", ".dropDownClass").addClass("unselectable") } function CloseDropDown(e) { SetSrrollerToDefaultPosition(e), clearTimeout(closeTimeOutID), $("#hdnDdMouseOverFlag" + e).val(!1); var t = document.getElementById("hdnSizeY" + e).value; document.getElementById(e).className = "dropDownClosed", document.getElementById(e).style.height = t + "px", document.getElementById("dropDownInnerText" + e).style.height = t + "px", document.getElementById("leftBg" + e).style.height = t + "px", document.getElementById("rightBg" + e).style.height = t + "px", document.getElementById("inlineArrow" + e).style.display = "none", document.getElementById("initialArrow" + e).style.display = "block", document.getElementById("hiddenArrow" + e).style.display = "none", document.getElementById("dropDownValuesList" + e).style.display = "none", document.getElementById("initialLabel" + e).style.display = "block", document.getElementById("initialLabel" + e).style.backgroundColor = constClosedBgColor, document.getElementById("initialLabel" + e).style.color = constClosedTextColor, document.getElementById(e).parentNode.parentNode.style.zIndex = "0", void 0 != selectedValue && -1 != selectedValue.indexOf(e) ? document.getElementById("initialLabel" + e).childNodes[0].data = document.getElementById(selectedValue).childNodes[0].data : null != $(".selected" + e).html() && (document.getElementById("initialLabel" + e).childNodes[0].data = $(".selected" + e).html()), moveState = !1, $("div", ".dropDownClass").removeClass("unselectable") } function OnClickDdValue(e, t) { var a = "initialLabel" + t, n = e; e.split("|"); if ("True" == document.getElementById("hdnIsAppleDevice").value) document.getElementById("ddSelected" + t).value = "[" + e + "]:[" + document.getElementById(n).childNodes[0].textContent + "]"; else { document.getElementById("hdnSizeY" + t).value; void 0 != selectedValue && -1 != e.indexOf(ddSelected) && (document.getElementById(selectedValue).style.backgroundColor = constClosedBgColor, document.getElementById(selectedValue).style.color = constClosedTextColor, document.getElementById(selectedValue).className = document.getElementById(selectedValue).className.replace(" selected" + t, "")), $(".selected" + t).css("background-color", constClosedBgColor), $(".selected" + t).css("color", constClosedTextColor), document.getElementById(e).style.backgroundColor = constOpenedBgColor, document.getElementById(e).style.color = constOpenedTextColor, document.getElementById(e).className += " selected" + t, selectedValue = e, ddSelected = t, document.getElementById("ddSelected" + t).value = "[" + e + "]:[" + document.getElementById(n).childNodes[0].textContent + "]", document.getElementById(a).childNodes[0].data = document.getElementById(n).childNodes[0].data, CloseDropDown(t) } } function InitDropDownScroller(e) { var t = parseInt($("#hdnMaxValuesInDropDown" + e).val()), a = $("#dropDownValuesList" + e).children(":visible").length; if (HasBeenScrollInitialized(e)) return void (t > a && DropDownScrollerDestroy(e)); if (a > t) { var n = a - t; $("#scrollBox" + e).slider({ range: "min", value: n, min: 0, max: n, orientation: "vertical", step: 1, slide: function (t, a) { MoveDropDownList(e, a.value) } }), $("#dropDownValuesList" + e).mousewheel(function (t, a) { HasBeenScrollInitialized(e) && (t.preventDefault(), 0 > a ? DdScrollDown(e) : DdScrollUp(e)) }) } } function DropDownScrollerDestroy(e) { HasBeenScrollInitialized(e) && $("#scrollBox" + e).slider("destroy") } function HasBeenScrollInitialized(e) { return $("#" + e + " .ui-slider-handle").length > 0 } function SetSrrollerToDefaultPosition(e) { if (HasBeenScrollInitialized(e)) { var t = $("#scrollBox" + e).slider("option", "max"); $("#dropDownValuesList" + e).css("top", "-3px"), $("#scrollBox" + e).slider("value", t) } } function DdScrollDown(e) { if (HasBeenScrollInitialized(e)) { var t = $("#scrollBox" + e).slider("value"), a = $("#scrollBox" + e).slider("option", "min"); t > a && ($("#scrollBox" + e).slider("value", t - 1), MoveDropDownList(e)) } } function DdScrollUp(e) { if (HasBeenScrollInitialized(e)) { var t = $("#scrollBox" + e).slider("value"), a = $("#scrollBox" + e).slider("option", "max"); a > t && ($("#scrollBox" + e).slider("value", t + 1), MoveDropDownList(e)) } } function MoveDropDownList(e, t) { var a = parseInt($("#hdnRowSize" + e).val()), n = parseInt($("#scrollBox" + e).slider("value")), r = $("#scrollBox" + e).slider("option", "max"); void 0 != t && (n = t), $("#dropDownValuesList" + e).css("top", -3 - (r - n) * a) } function CloseAllDropDowns() { var e = $(".dropDownOpened"); e.each(function () { CloseDropDown($(this).attr("id")) }) } function MouseOutDropDown(e) { $("#" + e).hasClass("dropDownOpened") && ($("#hdnDdMouseOverFlag" + e).val(!1), clearTimeout(closeTimeOutID), closeTimeOutID = setTimeout(function () { "true" != $("#hdnDdMouseOverFlag" + e).val() && CloseDropDown(e) }, hideTimeDelay)) } function MouseOverDropDown(e) { $("#" + e).hasClass("dropDownOpened") && $("#hdnDdMouseOverFlag" + e).val(!0) } function OnHoverDdValue(e) { ("rgb(255, 255, 255)" == document.getElementById(e).style.backgroundColor || "" == document.getElementById(e).style.backgroundColor || document.getElementById(e).style.backgroundColor == constOnMouseOutBgColor.toLowerCase()) && (document.getElementById(e).style.backgroundColor = constOnHoverBgColor) } function OnMouseOutDdValue(e) { ("rgb(204, 204, 204)" == document.getElementById(e).style.backgroundColor || document.getElementById(e).style.backgroundColor == constOnHoverBgColor.toLowerCase()) && (document.getElementById(e).style.backgroundColor = constOnMouseOutBgColor) } function ReinitializeDropDown(e, t, a, n) { var r, i = [], o = document.getElementById("hdnFontSize" + e).value, c = document.getElementById("hdnSizeY" + e).value, s = document.getElementById("hdnOnClick" + e).value, l = document.getElementById("hdnInnerHtml" + e).value; if ("" != t && (i = t.split(a)), "True" == document.getElementById("hdnIsAppleDevice").value) { var d = '<option id="defaultValue' + e + '" value="' + l + '">' + l + "</option> "; if ("" != t) for (var h = 0; h < i.length; h++) r = i[h].split(n), d += '<option id="' + r[1].replace("&apos;", "").replace("'", "") + "|" + r[0] + "|" + e + '">' + r[1] + "</option> "; document.getElementById("dropDownValuesList" + e).innerHTML = d } else { DropDownScrollerDestroy(e); var d = '<div class="dropDownValue" style="font-size:' + o + '" id="defaultValue' + e + '" onmouseover="OnHoverDdValue(\'defaultValue' + e + "')\" onmouseout=\"OnMouseOutDdValue('defaultValue" + e + "')\" onmouseup=\"OnClickDdValue('defaultValue" + e + "','" + e + '\')" onclick="' + s + '">' + l + "</div> "; if ("" != t) for (var h = 0; h < i.length; h++) r = i[h].split(n), d += '<div class="dropDownValue" style="font-size:' + o + '" id="' + r[1].replace("&apos;", "").replace("'", "") + "|" + r[0] + "|" + e + '" onmouseover="OnHoverDdValue(\'' + r[1].replace("&apos;", "").replace("'", "") + "|" + r[0] + "|" + e + "')\" onmouseout=\"OnMouseOutDdValue('" + r[1].replace("&apos;", "").replace("'", "") + "|" + r[0] + "|" + e + "')\" onmouseup=\"OnClickDdValue('" + r[1].replace("&apos;", "").replace("'", "") + "|" + r[0] + "|" + e + "','" + e + '\')" onclick="' + s + '">' + r[1] + "</div> "; document.getElementById("dropDownValuesList" + e).innerHTML = d, document.getElementById("hdnDdCount" + e).value = i.length + 1, document.getElementById("hdnHiddenValues" + e).value = parseInt(document.getElementById("hdnDdCount" + e).value) - parseInt(document.getElementById("hdnMaxValuesInDropDown" + e).value), document.getElementById("hdnHiddenValues" + e).value < 1 ? document.getElementById("hdnMaxDropDownheight" + e).value = document.getElementById("hdnRowSize" + e).value * parseInt(document.getElementById("hdnDdCount" + e).value) : document.getElementById("hdnMaxDropDownheight" + e).value = parseInt(document.getElementById("hdnMaxValuesInDropDown" + e).value) * document.getElementById("hdnRowSize" + e).value, document.getElementById("hiddenArrow" + e).style.marginTop = parseInt(document.getElementById("hdnMaxDropDownheight" + e).value) - (parseInt(c) - parseInt(document.getElementById("hdnCornerSize" + e).value)) + "px" } } function SetDropDownToDefualtValue(e) { var t = $("#defaultValue" + e).html(); $("#initialLabel" + e).html(t), $("#ddSelected" + e).val("") } function getDropDownValue(e) { return "" == e || e.indexOf("[id]:[value]") >= 0 || e.indexOf("default") >= 0 ? e = "" : e.split("]:[")[1].replace("]", "") } function getDropDownIntValue(e) { if ("" == e || e.indexOf("[id]:[value]") >= 0 || e.indexOf("default") >= 0) return e = ""; var t = e.substring(1, e.indexOf("]")).split("|"); return void 0 != t[1] && t[1] > 0 ? t[1] : e = "" } function getConditionDropDownIntValue(e) { if ("" == e || e.indexOf("[id]:[value]") >= 0 || e.indexOf("default") >= 0) return e = 0; var t = e.substring(1, e.indexOf("]")).split("|"); return void 0 != t[1] && t[1] > 0 ? t[1] : e = 0 } function getDropDownID(e) { if ("" == e || e.indexOf("[id]:[value]") >= 0 || e.indexOf("default") >= 0) return e = ""; var t = e.substring(1, e.indexOf("]")).split("|"); return void 0 != t[1] && t[1] > 0 ? t[1] : 0; var t } function isDropDownSelectedDefaultValue(e) { return $("#initialLabel" + e).html() == $("#defaultValue" + e).html() } function OnChangeDD(e, t) { var a = $("#" + e + " option:selected").attr("id"); OnClickDdValue(a, t) } function GetDefaultLabel(e, t) { var a = $("#required_" + e).val(); return null != a && "true" == a ? t + "*" : t } function eBizInputTextCheckDefault(e, t, a) { if (a) { var n = $.trim($("textarea#" + e).val()); "" == n || n == t ? ($("#" + e).css("color", "#666666"), $("textarea#" + e).val(t), $("#hidden_" + e).val("")) : $("#hidden_" + e).val(n) } else { var n = $.trim($("#" + e).val()); "" == n || n == t ? ($("#" + e).css("color", "#666666"), $("#" + e).val(t), $("#hidden_" + e).val("")) : $("#hidden_" + e).val(n) } } function renderTweet(e) { $(".tweetdiv").html('<a href="https://twitter.com/share" class="twitter-share-button" data-count="none" data-text=" "></a>'), ExecuteTwitterCode(e) } function ExecuteTwitterCode(e) { window.twttr = function (e, t, a) { var n, r, i = e.getElementsByTagName(t)[0]; if (!e.getElementById(a)) return r = e.createElement(t), r.id = a, r.src = "https://platform.twitter.com/widgets.js", i.parentNode.insertBefore(r, i), window.twttr || (n = { _e: [], ready: function (e) { n._e.push(e) } }) }(document, "script", "twitter-wjs-1"), twttr.ready(function (t) { t.events.bind("click", function () { TrackEvent("onClick", e, "") }) }) } function renderFbLike(e, t, a) { renderFbRoot(e, a), $(".fblikediv").html('<fb:like href="' + t + '" send="false" layout="button_count" show_faces="false" font="arial"></fb:like>'), parseFbButtons("fblikediv") } function parseFbButtons(e) { try { FB.XFBML.parse(document.getElementsByClassName(e)[0]) } catch (t) { } } function renderFbRoot(e, t) { 0 == $("#fb-root").length && ($("body").prepend('<div id="fb-root"></div>'), ExecuteFacebookCode(e, t)) } function ExecuteFacebookCode(e, t) { jQuery.getScript(e, function () { FB.init({ appId: "269706819708446", status: !0, cookie: !0, xfbml: !0 }), FB.Event.subscribe("edge.create", function (e) { TrackEvent("onClick", t, "") }) }) } function renderGplus(e, t) { $(".gplusdiv").html('<g:plusone annotation="none" callback="GooglePlusOneClicked"></g:plusone>'), ExecuteGooglePlusCode(e, t) } function ExecuteGooglePlusCode(e, t) { _googlePlusOneLinkTypeEnum = t, jQuery.getScript(e) } function GooglePlusOneClicked(e) { TrackEvent("onClick", _googlePlusOneLinkTypeEnum, "") } function renderPinItButton(e, t) { $(".pinitdiv").html('<a href="//www.pinterest.com/pin/create/button/" data-pin-do="buttonBookmark" data-pin-color="red"><img src="//assets.pinterest.com/images/pidgets/pinit_fg_en_rect_red_20.png" /></a>'), ExecutePinItCode(e, t) } function ExecutePinItCode(e, t) { $(".pinitdiv").bind("click", function () { TrackEvent("onClick", t, "") }), jQuery.getScript(e) } function ChangePreferredContactBySelect(e, t, a) { var n = e; n.length > 0 && n.change(function () { switch (n.val()) { case "1": t.show(), a.hide(); break; case "2": t.hide(), a.show() } }) } function ChangePreferredContactWithImageBySelect(e, t, a, n, r) {
    var i = e; i.length > 0 && i.change(function () {
        switch (i.val()) {
            case "1": t.show(), a.hide(), n.addClass("infoImg"), r.removeClass("infoImg"), ValidatePhoneWithPreferredContact(e, r); break; case "2": t.hide(), a.show(), n.removeClass("infoImg"), r.addClass("infoImg"), ValidateEmailWithPreferredContact(e, n);
        }
    })
}


// Loan section
var salesPriceLoan = 0.00;
var salesTaxLoan = 0.00;
var loanTermLoan = 0.00;
var interestRateLoan = 0.00;
var downPaymentLoan = 0.00;
var tradeInValueLoan = 0.00;
var rebatesLoan = 0.00;

// Lease section
var salesPriceLease = 0.00;
var salesTaxLease = 0.00;
var loanTermLease = 0.00;
var interestRateLease = 0.00;
var residualValueLease = 0.00;
var downPaymentLease = 0.00;
var tradeInValueLease = 0.00;
var rebatesLease = 0.00;

function doFieldValidation(field, isEmptyAllowed) {
		if(field == null) {
			return false;
		}
		var value = "";
		
		if (!isEmptyAllowed && IsEmpty(field)) {
			select(field);
			return false;
		} else if (isEmptyAllowed && IsEmpty(field))
			return false;

		value = parseFloat(field.value, 10);

		if (isNaN(value) || (value != field.value)) {
			alert(field.name + " must be a number.");
			select(field);
			return false;
		}

		return true;
}

$(document).ready(function () {
	var inputClickedcalculatePayment = false;
	var inputClickedaffordabilityCalculator = false;

	$('input', '.calculatePayment .calculatorMiddle').keyup(function () {
		if(!inputClickedcalculatePayment) {
			inputClickedcalculatePayment = true;
		}
	})

	$('input', '.affordabilityCalculator .calculatorMiddle').keyup(function () {
		if(!inputClickedaffordabilityCalculator) {
			inputClickedaffordabilityCalculator = true;
		}
	})
});

function PaymentCalculator() {
	var desiredPrice = document.getElementById('desiredPrice');
	var salesTaxApr = document.getElementById('salesTax1');
	var term = document.getElementById('term1');
	var rateApr = document.getElementById('rate1');
	var downPayment = document.getElementById('downPayment1');
	var result = '$';
	
	var rate = rateApr.value.replace(/%/gi, '');
	var salesTax = salesTaxApr.value.replace(/%/gi, '');
	if (doFieldValidation(desiredPrice, false) && doFieldValidation2(salesTaxApr, true, salesTaxApr) && doFieldValidation(term, false)
		 && doFieldValidation2(rateApr, false, rateApr) && doFieldValidation(downPayment, true)) {
		if (rate > 0) {
			var tmpRate = rate / 100 / 12;
			var tmpSalesTax = salesTax / 100;
			var loanAmt = (desiredPrice.value * (1 + tmpSalesTax)) - downPayment.value;
			if (term.value > 0){
				result = loanAmt * (tmpRate * Math.pow(1 + tmpRate, term.value)) / (Math.pow(1 + tmpRate, term.value) - 1);
			} else {
				result = 0;
			}
		} else {
			var tmpSalesTax = salesTax / 100;
			if (term.value > 0){
				result = (desiredPrice.value * (1 + tmpSalesTax) - downPayment.value)/term.value;
			} else {
				result = 0;
			}
		}
	}
	
	if (result == '$' || result < 0 || isNaN(result)) {
		$('#monthlyPayment').html('$0.00');
	} else {
		$('#monthlyPayment').html('$' + NumericDGroup(result.toFixed(2)));
	}
}

function AffordabilityCalculator() {
	var desiredPayment = document.getElementById('desiredPayment');
	var salesTaxApr = document.getElementById('salesTax2');
	var term = document.getElementById('term2');
	var rateApr = document.getElementById('rate2');
	var downPayment = document.getElementById('downPayment2');
	var result = '$';
	
	var rate = rateApr.value.replace(/%/gi, '');
	var salesTax = salesTaxApr.value.replace(/%/gi, '');
	if (doFieldValidation(desiredPayment, false) && doFieldValidation2(salesTaxApr, true, salesTaxApr) && doFieldValidation(term, false)
		 && doFieldValidation2(rateApr, false, rateApr) && doFieldValidation(downPayment, true)) {
		if (rate > 0) {
			var tmpRate = rate / 100 / 12;
			var tmpSalesTax = salesTax / 100;
			result = ((desiredPayment.value * (Math.pow(1 + tmpRate,term.value) - 1)) / (tmpRate * Math.pow(1 + tmpRate,term.value)) / (1 + tmpSalesTax)) + downPayment.value * 1;
		} else {
			var tmpSalesTax = salesTax / 100;
			result = ((desiredPayment.value * term.value) / (1 + tmpSalesTax)) + downPayment.value * 1;
		}
	}
	
	if (result == '$' || result < 0 || isNaN(result)) {
		$('#estimatedPrice').html('$0.00');
	} else {
		$('#estimatedPrice').html('$' + NumericDGroup(result.toFixed(2)));
	}
}

function doFieldValidation2(field, isEmptyAllowed, fieldBack ) {
	var input = "";
	if (!isEmptyAllowed && IsEmpty(field)) {
		select(fieldBack);
		return false;
	} else if (isEmptyAllowed && IsEmpty(field))
		return false;

	input = parseFloat(field.value.replace(/%/gi, '').replace(/,/gi,''), 10);

	if (isNaN(input) || (input != field.value.replace(/%/gi, '').replace(/,/gi,''))) {
		alert(fieldBack.name + " must be a number.");
		select(fieldBack);
		return false;
	}

	return true;
}

function NumericDGroup(input) {
	var s = '';
	var result = '';
	var pointPosition = input.indexOf('.');
	
	if (pointPosition < 0) pointPosition = input.length;
	else result = input.substring(pointPosition,input.length);
	
	for (i = pointPosition; i > 0; i = i - 3) {
		if (i < 4) {
			s = input.slice(0, i);
			result = s + result;
		} else {
			s = input.slice(i - 3, i);
			result = ',' + s + result;
		}
	}
	return result;
}

function SearchCarsFromCalculator(id, isAffordability, url) {
	var price = "";
	if(isAffordability) {
		price = $('#' + id).html();
		price = price.substring(1,price.length - 3);
		price = price.replace(',','');
	} else {
		price = $('#'+id).val();
	}
	
	if (isAffordability && price == 0)
		alert('Please provide your Desired Monthly Payment in order to continue your search.');
	else if (!isAffordability && price == "")
		alert('Please provide your Desired Vehicle Price in order to continue your search.');
	else {
		url = url.replace("{price}",price);
		window.location = url;
	}
}

function AddPercentToNumeric(obj) {
	if (obj.value.indexOf('%') == obj.value.length - 1) {
		obj.value = obj.value.substr(0, obj.value.length - 1);
	} else {
		obj.value = obj.value + '%';
	}
}

function CalculatorClearField(obj, defaultValue) {
	if (obj.value == defaultValue) {
		obj.value = '';
	}
}

function CalculatorPopulateField(obj, defaultValue) {
	if (obj.value.length == 0) {
		obj.value = defaultValue;
	}
}

// CUSTOM TEMPLATE FUNCTIONS UNTIL VERSION 1 DROPS
(function($){

	// SEARCH FLYOUT
	$('#search-flyout-toggle').click(function() {
		$('body').toggleClass('search-flyout-is-open');
	});	
	
	$('#search-flyout-close').click(function() {
		$('body').toggleClass('search-flyout-is-open');
	});	
	
	// ESC KEY
	$(document).keyup(function(e) {
		if (e.keyCode == 27) {
			if ($('body').hasClass('search-flyout-is-open')) {
				$('body').toggleClass('search-flyout-is-open');
			}
		}
	});
	
	// BMW SEARCH
	$(document).on('click', function(event) {
		if (!$(event.target).closest('#header-search-dropdown').length) { $body.toggleClass('header-search-dropdown-open', false); }
	});

	var $headerSearchDropdown = $('#header-search-dropdown'),
		$body = $('body');
		
	$("#header-search-dropdown-trigger").click(function(e){
		$body.toggleClass('header-search-dropdown-open');				
		if ($body.hasClass('header-search-dropdown-open')){
			$headerSearchDropdown.find('input').focus();
		}
		e.stopPropagation();
		e.preventDefault();
	});
		
        // BS MODAL iOS FIX
        if( navigator.userAgent.match(/iPhone|iPad|iPod/i) ) {
            $('.modal').on('show.bs.modal', function() {
                // Position modal absolute and bump it down to the scrollPosition
                $(this)
			.css({
				position: 'absolute',
				marginTop: $(window).scrollTop() + 'px',
				bottom: 'auto'
			});
                // Position backdrop absolute and make it span the entire page
                //
                setTimeout( function() {
			$('.modal-backdrop').css({
				position: 'absolute', 
				top: 0, 
				left: 0,
				width: '100%',
				height: Math.max(
					document.body.scrollHeight, document.documentElement.scrollHeight,
					document.body.offsetHeight, document.documentElement.offsetHeight,
					document.body.clientHeight, document.documentElement.clientHeight
				) + 'px'
			});
                }, 0);
            });
        }
})(jQuery);
