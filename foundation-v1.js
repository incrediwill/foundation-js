	/* ------------------
		Search Flyout
	------------------------------------------------------------ */

	$('#search-flyout-toggle').click(function() {
		$('body').toggleClass('search-flyout-is-open');
	});	

	$('#search-flyout-close').click(function() {
		$('body').toggleClass('search-flyout-is-open');
	});	

	// Esc Key
	$(document).keyup(function(e) {
	     if (e.keyCode == 27) {
			if ($('body').hasClass('search-flyout-is-open')) {
				$('body').toggleClass('search-flyout-is-open');
			}
	    }
	});
