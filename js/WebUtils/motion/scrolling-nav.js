/* Simple Scrolling for Navigation */

// jQuery to collapse the navbar on scroll
$(window).scroll(function() {
    if ($(".navbar").offset().top > 50) {
        $(".nav-container").addClass("nav-collapse");
        $(".nav-content").addClass("nav-content-collapse");
        $(".nav-heading").addClass("nav-move");
        $(".nav-blurb").addClass("nav-hide");
    } else {
        $(".nav-container").removeClass("nav-collapse");
        $(".nav-content").removeClass("nav-content-collapse");
        $(".nav-heading").removeClass("nav-move");
        $(".nav-blurb").removeClass("nav-hide");
    }
});

// jQuery for page scrolling feature - requires jQuery Easing plugin (for now)
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});
