







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



//Top navigation fadeIn-Out effect


$(window).scroll(function() {
    if ($(".navbar").offset().top > 50) {

        $('#custom-nav').addClass('affix');
        $(".navbar-fixed-top").addClass("top-nav-collapse");

    } else {
        $('#custom-nav').removeClass('affix');
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }   
});



//Sidebar navigation on mobile.

/* Set the width of the side navigation to 250px */
function openNav() {
    slide = document.getElementById("mySidenav")
    slide.style.width = "250px";
    $( "#custom-nav" ).hide();
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    $( "#custom-nav" ).show();
}




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





//Handle success and error views.

function errorView() {
    
    $('#btn-text').removeClass('hidden');
    document.getElementById("ttu-form").reset();
    $('.loader').addClass("hidden");
    $('#error').removeClass("hidden").fadeIn("slow");

}


function successView() {
    $('#error').addClass("hidden");
    document.getElementById("ttu-form").reset();
    $('.loader').addClass("hidden");

    $('#success').removeClass("hidden").fadeIn("slow");
    $('#submit').addClass("hidden");


    setTimeout(revert, 5000);
    function revert() {
        $('#success').addClass("hidden").fadeOut("slow");
        $('#btn-text').removeClass('hidden');
        $('#submit').removeClass("hidden");
    }

}


//Formspree submission with ajax


$(document).ready(function() {

    setTimeout(endLoad, 1000);
    function endLoad() {
       $(".page-loader").fadeOut("300");;
    }

    

    $('#ttu-form').on('submit', function(e) {
        e.preventDefault();
        $('#btn-text').addClass('hidden');
        $('#submit').addClass('disabled');
        $('.loader').removeClass('hidden');
        
        //get the name field value
        var email = $('#email').val();
        
        //get the message
        var message = $('#message').val();
                    
        //pretend we don't need validation
        
        //send to formspree
        $.ajax({
            url:'https://formspree.io/info@ttukorvpallikool.ee',
            method:'POST',
            data:{
                 email:email,
                message:message,
                _subject:'Kiri kodulehelt - TTÜ Korvpallikool',
            },
            dataType:"json",
            success:function() {
                console.log('success'); 
                successView()
            },  
            error: function() {
                console.log("error")
                errorView()
                
            } 

        });     
        
    });

});



