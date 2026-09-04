///Jquery easing


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


/* $(window).scroll(function() {
    if ($(".navbar").offset().top > 50) {

        $('#custom-nav').addClass('affix');
        $(".navbar-fixed-top").addClass("top-nav-collapse");

    } else {
        $('#custom-nav').removeClass('affix');
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }   
}); */



// Clicking a location preselects that region in the enquiry form before
// the page-scroll handler takes the visitor down to it.
$(document).on('click', '.location-link', function() {
    var region = $(this).data('location');
    var select = document.getElementById('location-interest');
    if (select && region) {
        select.value = region;
        $(select).trigger('change');
    }
});


//Sidebar navigation on mobile.

/* Set the width of the side navigation to 250px */
function openNav() {
    slide = document.getElementById("mySidenav")
    slide.style.width = "250px";
    $( "#custom-nav" ).hide();
    document.getElementById("sidenavOverlay").classList.add("active");
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    $( "#custom-nav" ).show();
    document.getElementById("sidenavOverlay").classList.remove("active");
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


    
    
    endLoad();
    function endLoad() {
       $(".page-loader").fadeOut("300");
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

        var location = $('#location-interest').val();

        var sex = $('#sex').val();

        var age = $('#age').val();
                    
        //pretend we don't need validation
        
        //send to formspree
        $.ajax({
            url:'https://formspree.io/info@ttukorvpallikool.ee',
            method:'POST',
            data:{
                 email:email,
                message:message,
                location:location,
                gender: sex,
                age: age,
                _subject:'Kiri kodulehelt - ' + " " + location + " " + age + " " + "(" + sex + ")",
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

        $(document).ready(function() {

            // Load hero video only on desktop/non-touch devices to save mobile bandwidth
            function loadHeroVideoIfDesktop() {
                var isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
                if (window.innerWidth >= 768 && !isTouch) {
                    var video = document.getElementById('video');
                    if (video) {
                        var sources = video.querySelectorAll('source[data-src]');
                        Array.prototype.forEach.call(sources, function(s) { s.src = s.getAttribute('data-src'); });
                        try {
                            video.load();
                            var p = video.play();
                            if (p && typeof p.then === 'function') { p.catch(function(){}); }
                        } catch (err) {
                            // ignore play/load errors (autoplay restrictions)
                        }
                    }
                }
            }

            loadHeroVideoIfDesktop();

            endLoad();
        });
});





//           if (image.caption.text.length >= MAX_LENGTH) {
//             truncate = "..."

//           } else {

//             truncate = ""
//           }
        
//           if (image.caption && image.caption.text) {
//             image.short_caption = image.caption.text.slice(0, MAX_LENGTH) + truncate;
//           } else {
//             image.short_caption = "";
//           }

//           return true;
//         },
//         template: '<div class="instapic-box"><a target="_blank" href="{{link}}"><img class="instapic" src="{{image}}"/><div class="overlay"><div class="text">{{model.short_caption}}</div></div></div></a>',
//         resolution: "standard_resolution"
        
//     });
//     feed.run();








