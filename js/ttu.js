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




// $("#ttu-form").validate({
//   rules: {
//     // simple rule, converted to {required:true}
//     e-mail: "required",
//     message: "required"
//     // compound rule

//   }
// });

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
    $('#btn-text').removeClass('hidden');
    $('#success').removeClass("hidden").fadeIn("slow");

    setTimeout(revert, 5000);
    function revert() {
        $('#success').addClass("hidden").fadeOut("slow");
    }

}

$(document).ready(function() {


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