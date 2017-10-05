// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 800, 'easeInOutExpo');
        event.preventDefault();
    });
});


$(window).scroll(function() {
    if ($(".navbar").offset().top > 50) {

        $('#custom-nav').addClass('affix');
        $(".navbar-fixed-top").addClass("top-nav-collapse");

    } else {
        $('#custom-nav').removeClass('affix');
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }   
});




// Highlight the top nav as scrolling occurs
// $('body').scrollspy({
//     target: '.navbar-fixed-top'
// })

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});

$('div.modal').on('show.bs.modal', function() {
	var modal = this;
	var hash = modal.id;
	window.location.hash = hash;
	window.onhashchange = function() {
		if (!location.hash){
			$(modal).modal('hide');
		}
	}
});





$(document).ready(function(){
    
        
        var imgNavSel = $('#imgNavSel');
        var spanNavSel = $('#lanNavSel');
        imgNavSel.attr("src", "../img/EE.svg");
        

        $( ".language" ).on( "click", function( event ) {
            var currentId = $(this).attr('id');

            if(currentId == "navEst") {
                spanNavSel.text("EST");
                imgNavSel.attr("src", "../img/EE.svg");
            } else if (currentId == "navEng") {
                spanNavSel.text("ENG");
                imgNavSel.attr("src", "../img/GB.svg");
           }

    
            
        });
});