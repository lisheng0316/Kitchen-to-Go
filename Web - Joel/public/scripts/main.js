/*
	Forty by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	skel.breakpoints({
		xlarge: '(max-width: 1680px)',
		large: '(max-width: 1280px)',
		medium: '(max-width: 980px)',
		small: '(max-width: 736px)',
		xsmall: '(max-width: 480px)',
		xxsmall: '(max-width: 360px)'
	});

	/**
	 * Applies parallax scrolling to an element's background image.
	 * @return {jQuery} jQuery object.
	 */
	// $.fn._parallax = (skel.vars.browser == 'ie' || skel.vars.browser == 'edge' || skel.vars.mobile) ? function() { return $(this) } : function(intensity) {

	// 	var	$window = $(window),
	// 		$this = $(this);

	// 	if (this.length == 0 || intensity === 0)
	// 		return $this;

	// 	if (this.length > 1) {

	// 		for (var i=0; i < this.length; i++)
	// 			$(this[i])._parallax(intensity);

	// 		return $this;

	// 	}

	// 	if (!intensity)
	// 		intensity = 0.25;

	// 	$this.each(function() {

	// 		var $t = $(this),
	// 			on, off;

	// 		on = function() {

	// 			$t.css('background-position', 'center 100%, center 100%, center 0px');

	// 			$window
	// 				.on('scroll._parallax', function() {

	// 					var pos = parseInt($window.scrollTop()) - parseInt($t.position().top);

	// 					$t.css('background-position', 'center ' + (pos * (-1 * intensity)) + 'px');

	// 				});

	// 		};

	// 		off = function() {

	// 			$t
	// 				.css('background-position', '');

	// 			$window
	// 				.off('scroll._parallax');

	// 		};

	// 		skel.on('change', function() {

	// 			if (skel.breakpoint('medium').active)
	// 				(off)();
	// 			else
	// 				(on)();

	// 		});

	// 	});

	// 	$window
	// 		.off('load._parallax resize._parallax')
	// 		.on('load._parallax resize._parallax', function() {
	// 			$window.trigger('scroll');
	// 		});

	// 	return $(this);

	// };

	$(function() {

		var	$window = $(window),
			$body = $('body'),
			$wrapper = $('#wrapper'),
			$header = $('#header'),
			$banner = $('#banner');

		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load pageshow', function() {
				window.setTimeout(function() {
					$body.removeClass('is-loading');
				}, 100);
			});

		// Clear transitioning state on unload/hide.
			$window.on('unload pagehide', function() {
				window.setTimeout(function() {
					$('.is-transitioning').removeClass('is-transitioning');
				}, 250);
			});

		// Fix: Enable IE-only tweaks.
			if (skel.vars.browser == 'ie' || skel.vars.browser == 'edge')
				$body.addClass('is-ie');

		// Fix: Placeholder polyfill.
			$('form').placeholder();

		// Prioritize "important" elements on medium.
			skel.on('+medium -medium', function() {
				$.prioritize(
					'.important\\28 medium\\29',
					skel.breakpoint('medium').active
				);
			});

		// Scrolly.
			$('.scrolly').scrolly({
				offset: function() {
					return $header.height() - 2;
				}
			});

		// Tiles.
		// 	var $tiles = $('.tiles > article');

		// 	$tiles.each(function() {

		// 		var $this = $(this),
		// 			$image = $this.find('.image'), $img = $image.find('img'),
		// 			$link = $this.find('.link'),
		// 			x;

		// 		// Image.

		// 			// Set image.
		// 				$this.css('background-image', 'url(' + $img.attr('src') + ')');

		// 			// Set position.
		// 				if (x = $img.data('position'))
		// 					$image.css('background-position', x);

		// 			// Hide original.
		// 				$image.hide();

		// 		// Link.
		// 			if ($link.length > 0) {

		// 				$x = $link.clone()
		// 					.text('')
		// 					.addClass('primary')
		// 					.appendTo($this);

		// 				$link = $link.add($x);

		// 				$link.on('click', function(event) {

		// 					var href = $link.attr('href');

		// 					// Prevent default.
		// 						event.stopPropagation();
		// 						event.preventDefault();

		// 					// Start transitioning.
		// 						$this.addClass('is-transitioning');
		// 						$wrapper.addClass('is-transitioning');

		// 					// Redirect.
		// 						window.setTimeout(function() {

		// 							if ($link.attr('target') == '_blank')
		// 								window.open(href);
		// 							else
		// 								location.href = href;

		// 						}, 500);

		// 				});

		// 			}

		// 	});

		// // Header.
		// 	if (skel.vars.IEVersion < 9)
		// 		$header.removeClass('alt');

		// 	if ($banner.length > 0
		// 	&&	$header.hasClass('alt')) {

		// 		$window.on('resize', function() {
		// 			$window.trigger('scroll');
		// 		});

		// 		$window.on('load', function() {

		// 			$banner.scrollex({
		// 				bottom:		$header.height() + 10,
		// 				terminate:	function() { $header.removeClass('alt'); },
		// 				enter:		function() { $header.addClass('alt'); },
		// 				leave:		function() { $header.removeClass('alt'); $header.addClass('reveal'); }
		// 			});

		// 			window.setTimeout(function() {
		// 				$window.triggerHandler('scroll');
		// 			}, 100);

		// 		});

		// 	}

		// Banner.
			// $banner.each(function() {

			// 	var $this = $(this),
			// 		$image = $this.find('.image'), $img = $image.find('img');

			// 	// Parallax.
			// 		$this._parallax(0.275);

			// 	// Image.
			// 		if ($image.length > 0) {

			// 			// Set image.
			// 				$this.css('background-image', 'url(' + $img.attr('src') + ')');

			// 			// Hide original.
			// 				$image.hide();

			// 		}

			// });

		// Menu.
			// var $menu = $('#menu'),
			// 	$menuInner;

			// $menu.wrapInner('<div class="inner"></div>');
			// $menuInner = $menu.children('.inner');
			// $menu._locked = false;

			// $menu._lock = function() {

			// 	if ($menu._locked)
			// 		return false;

			// 	$menu._locked = true;

			// 	window.setTimeout(function() {
			// 		$menu._locked = false;
			// 	}, 350);

			// 	return true;

			// };

			// $menu._show = function() {

			// 	if ($menu._lock())
			// 		$body.addClass('is-menu-visible');

			// };

			// $menu._hide = function() {

			// 	if ($menu._lock())
			// 		$body.removeClass('is-menu-visible');

			// };

			// $menu._toggle = function() {

			// 	if ($menu._lock())
			// 		$body.toggleClass('is-menu-visible');

			// };

			// $menuInner
			// 	.on('click', function(event) {
			// 		event.stopPropagation();
			// 	})
			// 	.on('click', 'a', function(event) {

			// 		var href = $(this).attr('href');

			// 		event.preventDefault();
			// 		event.stopPropagation();

			// 		// Hide.
			// 			$menu._hide();

			// 		// Redirect.
			// 			window.setTimeout(function() {
			// 				window.location.href = href;
			// 			}, 250);

			// 	});

			// $menu
			// 	.appendTo($body)
			// 	.on('click', function(event) {

			// 		event.stopPropagation();
			// 		event.preventDefault();

			// 		$body.removeClass('is-menu-visible');

			// 	})
			// 	.append('<a class="close" href="#menu">Close</a>');

			// $body
			// 	.on('click', 'a[href="#menu"]', function(event) {

			// 		event.stopPropagation();
			// 		event.preventDefault();

			// 		// Toggle.
			// 			$menu._toggle();

			// 	})
			// 	.on('click', function(event) {

			// 		// Hide.
			// 			$menu._hide();

			// 	})
			// 	.on('keydown', function(event) {

			// 		// Hide on escape.
			// 			if (event.keyCode == 27)
			// 				$menu._hide();

			// 	});


		jQuery(document).ready(function($){
			var $form_modal = $('.cd-user-modal'),
				$form_login = $form_modal.find('#cd-login'),
				$form_signup = $form_modal.find('#cd-signup'),
				$form_forgot_password = $form_modal.find('#cd-reset-password'),
				$form_modal_tab = $('.cd-switcher'),
				$tab_login = $form_modal_tab.children('li').eq(0).children('a'),
				$tab_signup = $form_modal_tab.children('li').eq(1).children('a'),
				$forgot_password_link = $form_login.find('.cd-form-bottom-message a'),
				$back_to_login_link = $form_forgot_password.find('.cd-form-bottom-message a'),
				$main_nav = $('.main-nav');

		//open modal
		$main_nav.on('click', function(event){

			if( $(event.target).is($main_nav) ) {
				// on mobile open the submenu
				$(this).children('ul').toggleClass('is-visible');
			} else {
				// on mobile close submenu
				$main_nav.children('ul').removeClass('is-visible');
				//show modal layer
				$form_modal.addClass('is-visible');	
				//show the selected form
				( $(event.target).is('.cd-signup') ) ? signup_selected() : login_selected();
			}

		});

		//close modal
		$('.cd-user-modal').on('click', function(event){
			if( $(event.target).is($form_modal) || $(event.target).is('.cd-close-form') ) {
				$form_modal.removeClass('is-visible');
			}	
		});
	//close modal when clicking the esc keyboard button
	$(document).keyup(function(event){
    	if(event.which=='27'){
    		$form_modal.removeClass('is-visible');
	    }
    });

	//switch from a tab to another
	$form_modal_tab.on('click', function(event) {
		event.preventDefault();
		( $(event.target).is( $tab_login ) ) ? login_selected() : signup_selected();
	});

	//hide or show password
	$('.hide-password').on('click', function(){
		var $this= $(this),
			$password_field = $this.prev('input');
		
		( 'password' == $password_field.attr('type') ) ? $password_field.attr('type', 'text') : $password_field.attr('type', 'password');
		( 'Hide' == $this.text() ) ? $this.text('Show') : $this.text('Hide');
		//focus and move cursor to the end of input field
		$password_field.putCursorAtEnd();
	});

	//show forgot-password form 
	$forgot_password_link.on('click', function(event){
		event.preventDefault();
		forgot_password_selected();
	});

	//back to login from the forgot-password form
	$back_to_login_link.on('click', function(event){
		event.preventDefault();
		login_selected();
	});

	function login_selected(){
		$form_login.addClass('is-selected');
		$form_signup.removeClass('is-selected');
		$form_forgot_password.removeClass('is-selected');
		$tab_login.addClass('selected');
		$tab_signup.removeClass('selected');
	}

	function signup_selected(){
		$form_login.removeClass('is-selected');
		$form_signup.addClass('is-selected');
		$form_forgot_password.removeClass('is-selected');
		$tab_login.removeClass('selected');
		$tab_signup.addClass('selected');
	}

	function forgot_password_selected(){
		$form_login.removeClass('is-selected');
		$form_signup.removeClass('is-selected');
		$form_forgot_password.addClass('is-selected');
	}

	//REMOVE THIS - it's just to show error messages 
	$form_login.find('input[type="submit"]').on('click', function(event){
		event.preventDefault();
		$form_login.find('input[type="email"]').toggleClass('has-error').next('span').toggleClass('is-visible');
	});
	$form_signup.find('input[type="submit"]').on('click', function(event){
		event.preventDefault();
		$form_signup.find('input[type="email"]').toggleClass('has-error').next('span').toggleClass('is-visible');
	});


	//IE9 placeholder fallback
	//credits http://www.hagenburger.net/BLOG/HTML5-Input-Placeholder-Fix-With-jQuery.html
	if(!Modernizr.input.placeholder){
		$('[placeholder]').focus(function() {
			var input = $(this);
			if (input.val() == input.attr('placeholder')) {
				input.val('');
		  	}
		}).blur(function() {
		 	var input = $(this);
		  	if (input.val() == '' || input.val() == input.attr('placeholder')) {
				input.val(input.attr('placeholder'));
		  	}
		}).blur();
		$('[placeholder]').parents('form').submit(function() {
		  	$(this).find('[placeholder]').each(function() {
				var input = $(this);
				if (input.val() == input.attr('placeholder')) {
			 		input.val('');
				}
		  	})
		});
	}

});

	});

})(jQuery);