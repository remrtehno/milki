jQuery(window).load(function () {
    "use strict";
   	jQuery("#status").fadeOut();
	jQuery("#preloader").delay(350).fadeOut("slow");
});


$(document).ready(function(){
	// one page
	$.fn.single = function(options) {
		var opts = $.extend({}, $.fn.single.defaults, options);
		return this.each(function(){
			var element = $(this);
			changeCSS(element);
			changeIMG(opts);
			$(window).bind("resize", function(){  
				changeCSS(element);  
				changeIMG(opts);
			});
			$("[data-link]").bind("click", function(event){  
				event.preventDefault();
				goToSection(this, opts);  
			});
		});
	};
	
	
	// contact mail function
	$('#cont_msg').keypress(function (e) {
	 var key = e.which;
	 if(key == 13)  // the enter key code
	  {
		$('#contact_form_submit').click();
		return false;  
	  }
	});   
	
	$("#contact_form_submit").on("click", function() {
		var co_name = $("#cont_name").val();
		var co_email = $("#cont_email").val();
		var co_subject = $("#cont_subject").val();
		var co_message = $("#cont_msg").val();
		$.ajax({
			type: "POST",
			url: "contact_ajaxmail.php",
			data: {
				username: co_name,
				useremail: co_email,
				usersubject: co_subject,
				usermessage: co_message
			},
			success: function(contact) {
				var i = contact.split("#");
				if (i[0] == "1") {
					$("#cont_name").val("");
					$("#cont_email").val("");
					$("#cont_subject").val("");
					$("#cont_msg").val("");
					$("#contact_err").html(i[1]);
					
					$(".app_form_wrapper .apps_input").addClass('success');
					setTimeout(function (){
						$(".app_form_wrapper .apps_input").removeClass('success');
						$(".app_form_wrapper .apps_input").removeClass('error');
						$("#cont_email").parent().removeClass('error');
					},2500); 
				} else {
					$("#cont_name").val(co_name);
					$("#cont_email").val(co_email);
					$("#cont_subject").val(co_subject);
					$("#cont_msg").val(co_message);
					$("#contact_err").html(i[1]);
					
					
						
					
					$(".app_form_wrapper .apps_input input, .app_form_wrapper .apps_input textarea").each(function(){
						if( !$(this).val() ) {
							$(this).parent().addClass('error');
						}else{
							if( i[0] == 3 ) {
								$("#cont_email").parent().addClass('error');
							}
							else {
								$(this).parent().addClass('error');
							}
							$(this).parent().removeClass('error');
						}
					});
					
					
				}
			}
		})
	}); 
	
	$(".app_form_wrapper .apps_input input, .app_form_wrapper .apps_input textarea").keypress(function() {
		$(this).parent().removeClass('error');	
	});
	
	
	
	
	// function to resize all the "data-target" divs
	function changeCSS(element) {
		var windowWidth 	= "100%";
		var windowHeight	= "auto";
		var targetsSize		= $("[data-target]").size();
		$(element).css({
			"width" : windowWidth,
			"height": windowHeight
		});
		$(element).children("div[data-target]").each(function(){
			$(this).css({
				"width" : windowWidth,
				"height": windowHeight
			});
		});
	}

	// function to resize the images
	function changeIMG(opts) {
		windowWidth 	= $(window).width();
		$("img[data-img='true']").each(function(index, element){
			src			= $(element).attr('src');
			imgName		= "";
			imgFinal	= "";
			imgSplit	= {};
			imagePrefix	= checkResolution(windowWidth, opts);
			if ( src.match("/") ) { // Match if there's a full URL at the IMG src and cut it
				re 	= new RegExp(".*\/(.*)$");
				m 	= re.exec(src);    
				imgName = m[1];
			} else {
				// Just the img without an URL
				imgName = src;
			}
			if( imgName.match(/\-\w+/) ) {

				src = src.replace(/\-\w+/, imagePrefix);

			} else {
				imgSplit 	= imgName.split('.'); 
				imgFinal	= imgSplit[0] + imagePrefix + '.' + imgSplit[1];
				src 		= src.replace(imgName, imgFinal);
			}
			$(element).attr('src', src);
		});

	}

	// function to scroll the page to a section
	function goToSection(link, opts) {
		var goingTo 		= $(link).attr('data-link'); // get the data-link value
		var targetPosition 	= $('[data-target="'+goingTo+'"]').position().top; // get the position of the target
		$("html, body").animate({
			scrollTop: targetPosition
		}, {
			duration: opts.speed,
			easing: opts.animation
		});
	}

	// function to check the resolution and return the prefix for the image
	function checkResolution(windowWidth, opts) {
		if (windowWidth <= 480) {
			return opts.sufixes.smallest;
		} 
		if(windowWidth > 480 && windowWidth <= 767) {
			return opts.sufixes.small;
		} 
		if(windowWidth > 767 && windowWidth <= 979) {
			return opts.sufixes.medium;
		} 
		if(windowWidth > 979) {
			return opts.sufixes.normal;
		}
	}

	//easeing Plugin start
	$.fn.single.defaults = {
		speed: 2000,
		animation: "swing",
		sufixes: {
			smallest: "-smallest",
			small   : "-small",
			medium  : "-medium",
			normal  : "" // Leave blank for no prefix
		}
	};
	jQuery.easing['jswing'] = jQuery.easing['swing'];
	jQuery.extend( jQuery.easing,{
		def: 'easeOutQuad',
		swing: function (x, t, b, c, d) {
			//alert(jQuery.easing.default);
			return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
		},
		easeInQuad: function (x, t, b, c, d) {
			return c*(t/=d)*t + b;
		},
		easeOutQuad: function (x, t, b, c, d) {
			return -c *(t/=d)*(t-2) + b;
		},
		easeInOutQuad: function (x, t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t + b;
			return -c/2 * ((--t)*(t-2) - 1) + b;
		},
		easeInCubic: function (x, t, b, c, d) {
			return c*(t/=d)*t*t + b;
		},
		easeOutCubic: function (x, t, b, c, d) {
			return c*((t=t/d-1)*t*t + 1) + b;
		},
		easeInOutCubic: function (x, t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t*t + b;
			return c/2*((t-=2)*t*t + 2) + b;
		},
		easeInQuart: function (x, t, b, c, d) {
			return c*(t/=d)*t*t*t + b;
		},
		easeOutQuart: function (x, t, b, c, d) {
			return -c * ((t=t/d-1)*t*t*t - 1) + b;
		},
		easeInOutQuart: function (x, t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
			return -c/2 * ((t-=2)*t*t*t - 2) + b;
		},
		easeInQuint: function (x, t, b, c, d) {
			return c*(t/=d)*t*t*t*t + b;
		},
		easeOutQuint: function (x, t, b, c, d) {
			return c*((t=t/d-1)*t*t*t*t + 1) + b;
		},
		easeInOutQuint: function (x, t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
			return c/2*((t-=2)*t*t*t*t + 2) + b;
		},
		easeInSine: function (x, t, b, c, d) {
			return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
		},
		easeOutSine: function (x, t, b, c, d) {
			return c * Math.sin(t/d * (Math.PI/2)) + b;
		},
		easeInOutSine: function (x, t, b, c, d) {
			return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
		},
		easeInExpo: function (x, t, b, c, d) {
			return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
		},
		easeOutExpo: function (x, t, b, c, d) {
			return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
		},
		easeInOutExpo: function (x, t, b, c, d) {
			if (t==0) return b;
			if (t==d) return b+c;
			if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
			return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
		},
		easeInCirc: function (x, t, b, c, d) {
			return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
		},
		easeOutCirc: function (x, t, b, c, d) {
			return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
		},
		easeInOutCirc: function (x, t, b, c, d) {
			if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
			return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
		},
		easeInElastic: function (x, t, b, c, d) {
			var s=1.70158;var p=0;var a=c;
			if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
			if (a < Math.abs(c)) { a=c; var s=p/4; }
			else var s = p/(2*Math.PI) * Math.asin (c/a);
			return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		},
		easeOutElastic: function (x, t, b, c, d) {
			var s=1.70158;var p=0;var a=c;
			if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
			if (a < Math.abs(c)) { a=c; var s=p/4; }
			else var s = p/(2*Math.PI) * Math.asin (c/a);
			return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
		},
		easeInOutElastic: function (x, t, b, c, d) {
			var s=1.70158;var p=0;var a=c;
			if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
			if (a < Math.abs(c)) { a=c; var s=p/4; }
			else var s = p/(2*Math.PI) * Math.asin (c/a);
			if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
			return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
		},
		easeInBack: function (x, t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			return c*(t/=d)*t*((s+1)*t - s) + b;
		},
		easeOutBack: function (x, t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
		},
		easeInOutBack: function (x, t, b, c, d, s) {
			if (s == undefined) s = 1.70158; 
			if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
			return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
		},
		easeInBounce: function (x, t, b, c, d) {
			return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
		},
		easeOutBounce: function (x, t, b, c, d) {
			if ((t/=d) < (1/2.75)) {
				return c*(7.5625*t*t) + b;
			} else if (t < (2/2.75)) {
				return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
			} else if (t < (2.5/2.75)) {
				return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
			} else {
				return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
			}
		},
		easeInOutBounce: function (x, t, b, c, d) {
			if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
			return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
		}
	});
	//easeing Plugin end
	
	// main div single page slide javascript	
	$("#apps_main").single({
		speed: 1000
	});

	
	// Just a javascript alignment to the content
	function alignContent() {
		var windowHeight 	= "auto";
		
		$('.content-resizer').each(function(){
			contentHeight 	= $(this).height();
			$(this).css('top', (windowHeight/2) - (contentHeight/2));
		});

		$('.alt-img').html($("#img-example").attr('src'));
	}

	// Execute the function
	alignContent();

	
	// Bind the function to the window.onresize
	$(window).bind("resize", function(){  
		alignContent();  
	});
			

			
	/*********color change script*******/
	$('.colorchange').click(function(){
		var color_name=$(this).attr('id');
		var new_style='css/color/'+color_name+'.css';
		$('#theme-color').attr('href',new_style);
	});
	$("#style-switcher .bottom a.settings").click(function(e){
		e.preventDefault();
		var div = $("#style-switcher");
		if (div.css("left") === "-161px") {
			$("#style-switcher").animate({
				left: "0px"
			}); 
		} else {
			$("#style-switcher").animate({
				left: "-161px"
			});
		}
	});
	/******color change script end******/
	
	//App-star Template Features tab			
	$('.apps_template_feature_tab > ul').each(function(){
		var $active, $content, $links = $(this).find('a');
		$active = $($links.filter('[href="'+location.hash+'"]')[1] || $links[1]);
		$active.addClass('active');
		$content = $($active[0].hash);
		$links.not($active).each(function () {
		  $(this.hash).hide();
		});
		$(this).on('click', 'a', function(e){
			$active.removeClass('active');
			$content.hide();
			$active = $(this);
			$content = $(this.hash);
			$active.addClass('active');
			$content.fadeIn();
			e.preventDefault();
		});
	});

	
	$('.apps_template_feature_tab ul li').click(function() {
        $(this).siblings('li').removeClass('active');
        $(this).addClass('active');
    });	


	// fixed menu
	$(window).scroll(function(){
		var slider_hight = $(window).innerHeight();
		
		var window_top = $(window).scrollTop() + 1; 
		var div_top = $('#nav-anchor').offset().top + slider_hight;
            if (window_top > div_top) {
                $('.apps_header').addClass('fixed_menu');
            } else {
                $('.apps_header').removeClass('fixed_menu');
            }
	});


	// parallax effect
	$(function () {
		$.stellar({
			horizontalScrolling: false,
			verticalOffset: 1
		});
	});
				
	
	// responsive menu 
	$('.apps_menu ul li a').click(function(){
		$('.apps_menu').removeClass('in');
	});
			
			
	/* Portfolio */
	if ($.fn.mixitup) {
		$('#grid').mixitup( {
			filterSelector: '.filter-item'
		});
		$(".filter-item").click(function(e) {
			e.preventDefault();
			var to_which=$(this).attr('data-filter');
			$('.'+to_which+'_fb').attr('data-fancybox-group',to_which);
		})
	}
  	
	
	// club photo image popup
	$(".fancybox").fancybox({
		openEffect	: 'elastic',
		closeEffect	: 'elastic',
		enableAutosize: true,
		helpers : 
		{
			overlay: 
			{ 
				locked: false 
			} 
		}
	});	
	
	
	//active menu on scroll
	$(window).scroll(function() {
		var windscroll = $(window).scrollTop();
		if (windscroll >= 100) {
			$('.section').each(function(i) {
				if ($(this).position().top <= windscroll + 10 ) {
					$('.apps_menu ul li').removeClass('active');
					$('.apps_menu ul li').eq(i).addClass('active');
				}
			});
		} else {
	
			$('.apps_menu ul li').removeClass('active');
			$('.apps_menu ul li').addClass('active');
		}
	}).scroll();
			
	
	// Testimonials slider
	$("#testimonials_slider").owlCarousel({
		navigation : false, // Show next and prev buttons
		slideSpeed : 300,
		paginationSpeed : 400,
		singleItem:true,
		autoPlay : true
	}); 			

});