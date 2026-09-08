///Jquery easing


// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        if (!this.hash || this.pathname !== location.pathname || this.origin !== location.origin) return;
        var target = document.getElementById(decodeURIComponent(this.hash.slice(1)));
        if (!target) return;
        $('html, body').stop().animate({
            scrollTop: $(target).offset().top
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



// Floating labels. Text inputs handle the empty state in CSS via
// :placeholder-shown; a select has no equivalent, so its wrapper is flagged
// here whenever it holds a real value.
/* Localised validation messages. They live in data-msg rather than an inline
   oninvalid handler because the copy is CMS-editable: an apostrophe inside a
   JS string literal is a syntax error, which silently cost the English age
   and gender fields their messages. */
(function () {
    var fields = document.querySelectorAll('#ttu-form [data-msg]');
    Array.prototype.forEach.call(fields, function (el) {
        el.addEventListener('invalid', function () {
            el.setCustomValidity(el.getAttribute('data-msg'));
        });
        var clear = function () { el.setCustomValidity(''); };
        el.addEventListener('input', clear);
        el.addEventListener('change', clear);
    });
})();

(function () {
    var selects = document.querySelectorAll('.field select.field-control');

    function sync(select) {
        var field = select.closest('.field');
        if (field) field.classList.toggle('is-filled', !!select.value);
    }

    Array.prototype.forEach.call(selects, function (select) {
        sync(select);
        select.addEventListener('change', function () { sync(select); });
    });
})();


// Instagram feed. Fetched in the browser from Behold's public JSON endpoint
// so the section is always current without a rebuild. The section is hidden
// until posts render, so a failed request leaves no empty heading behind.
(function () {
    var section = document.getElementById('instagram');
    if (!section) return;

    var grid = document.getElementById('instagram-grid');
    var feedId = section.getAttribute('data-feed');
    var count = parseInt(section.getAttribute('data-count'), 10) || 3;
    if (!grid || !feedId) return;

    function firstLine(text) {
        var line = String(text || '').split('\n')[0].trim();
        return line.length > 80 ? line.slice(0, 77) + '...' : line;
    }

    // Only ever follow https URLs that Behold itself returned.
    function safeUrl(value) {
        return /^https:\/\//.test(value || '') ? value : null;
    }

    function render(posts) {
        var made = 0;

        posts.slice(0, count).forEach(function (post) {
            var sizes = post.sizes || {};
            var image = safeUrl((sizes.medium || sizes.large || sizes.small || {}).mediaUrl) ||
                        safeUrl(post.thumbnailUrl) ||
                        safeUrl(post.mediaUrl);
            var link = safeUrl(post.permalink);
            if (!image) return;

            var tile = document.createElement('a');
            tile.className = 'instagram-item';
            tile.href = link || 'https://www.instagram.com/taltechbasketballschool/';
            tile.target = '_blank';
            tile.rel = 'noopener';

            var img = document.createElement('img');
            img.src = image;
            img.loading = 'lazy';
            img.width = 700;
            img.height = 700;
            // Instagram rarely supplies altText. Where it does not, the alt stays
            // empty on purpose: the caption sits in the same link and would
            // otherwise be announced twice.
            img.alt = post.altText ? String(post.altText) : '';
            tile.appendChild(img);

            var caption = firstLine(post.prunedCaption || post.caption);
            if (caption) {
                var span = document.createElement('span');
                span.className = 'instagram-caption';
                span.textContent = caption;      // textContent, never innerHTML
                tile.appendChild(span);
            }

            grid.appendChild(tile);
            made++;
        });

        if (made) section.classList.remove('is-loading');
    }

    fetch('https://feeds.behold.so/' + encodeURIComponent(feedId))
        .then(function (r) {
            if (!r.ok) throw new Error('HTTP ' + r.status);
            return r.json();
        })
        .then(function (data) {
            render(Array.isArray(data) ? data : (data.posts || []));
        })
        .catch(function () {
            // Leave the section hidden. A missing feed is not worth an error state.
        });
})();


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
    var slide = document.getElementById("mySidenav");
    slide.inert = false;
    document.querySelector(".navbar-toggle").setAttribute("aria-expanded", "true");
    slide.style.width = "250px";
    $( "#custom-nav" ).hide();
    document.getElementById("sidenavOverlay").classList.add("active");
    slide.querySelector(".closebtn").focus();
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("mySidenav").inert = true;
    document.querySelector(".navbar-toggle").setAttribute("aria-expanded", "false");
    $( "#custom-nav" ).show();
    document.getElementById("sidenavOverlay").classList.remove("active");
    document.querySelector(".navbar-toggle").focus();
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


    
    


    

    $('#ttu-form').on('submit', function(e) {
        e.preventDefault();
        $('#btn-text').addClass('hidden');
        $('#submit').addClass('disabled');
        $('.loader').removeClass('hidden');
        
        var name = $('#name').val();

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
                name:name,
                email:email,
                message:message,
                location:location,
                gender: sex,
                age: age,
                _subject:'Kiri kodulehelt - ' + name + " " + location + " " + age + " " + "(" + sex + ")",
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
                        video.addEventListener('playing', function () { video.classList.add('is-playing'); }, { once: true });
                        video.poster = video.getAttribute('data-poster');
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









// Keep the YouTube link as a fallback; load the player only inside an open lightbox.
(function () {
    var dialog = document.getElementById('video-lightbox');
    if (!dialog || typeof dialog.showModal !== 'function') return;
    var player = dialog.querySelector('.video-lightbox-player');
    var opener;

    document.querySelectorAll('.video-play').forEach(function (link) {
        link.setAttribute('aria-haspopup', 'dialog');
        link.setAttribute('aria-controls', 'video-lightbox');
        link.addEventListener('click', function (event) {
            event.preventDefault();
            if (dialog.open) return;
            opener = link;
            var iframe = document.createElement('iframe');
            iframe.src = 'https://www.youtube-nocookie.com/embed/' + link.closest('.video-preview').getAttribute('data-video') + '?autoplay=1';
            iframe.title = link.getAttribute('aria-label');
            iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
            iframe.allowFullscreen = true;
            player.replaceChildren(iframe);
            document.documentElement.classList.add('has-video-lightbox');
            dialog.showModal();
        });
    });
    dialog.querySelector('.video-lightbox-close').addEventListener('click', function () { dialog.close(); });
    // The backdrop targets the dialog itself. Ignore clicks within its bounds.
    dialog.addEventListener('click', function (event) {
        var rect = dialog.getBoundingClientRect();
        if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
    });
    // Also runs after the native Escape/cancel action. Removing the iframe stops playback.
    dialog.addEventListener('close', function () {
        player.replaceChildren();
        document.documentElement.classList.remove('has-video-lightbox');
        if (opener) opener.focus({ preventScroll: true });
    });
})();
document.addEventListener('keydown', function (event) {
    var toggle = document.querySelector('.navbar-toggle');
    if (!toggle || toggle.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') closeNav();
    if (event.key === 'Tab') {
        var controls = document.querySelectorAll('#mySidenav button, #mySidenav a[href]');
        var first = controls[0], last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault(); last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault(); first.focus();
        }
    }
});
