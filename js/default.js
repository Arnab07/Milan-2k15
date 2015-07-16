       
//          .-j/'.;  ;""""  / .'\"-.        
//        .' /:`. "-.:     .-" .';  `.      
//     .-"  / ;  "-. "-..-" .-"  :    "-.   
//  .+"-.  : :      "-.__.-"      ;-._   \  
//  ; \  `.; ;                    : : "+. ; 
//  :  ;   ; ;                    : ;  : \: 
//  ;  :   ; :                    ;:   ;  : 
// : \  ;  :  ;                  : ;  /  :: 
// ;  ; :   ; :                  ;   :   ;: 
// :  :  ;  :  ;                : :  ;  : ; 
// ;\    :   ; :                ; ;     ; ; 
// : `."-;   :  ;              :  ;    /  ; 
//  ;    -:   ; :              ;  : .-"   : 
//  :\     \  :  ;            : \.-"      : 
//   ;`.    \  ; :            ;.'_..-=  / ; 
//   :  "-.  "-:  ;          :/."      .'  :
//    \         \ :          ;/  __        :
//     \       .-`.\        /t-""  ":-+.   :
//      `.  .-"    `l    __/ /`. :  ; ; \  ;
//        \   .-" .-"-.-"  .' .'j \  /   ;/ 
//         \ / .-"   /.     .'.' ;_:'    ;  
//          :-""-.`./-.'     /    `.___.'   
//                \ `t  ._  /               
//                 "-.t-._:'          


var w = 1000;
var h = 600;

var currentSlide = 'home';

var loader = null;

var trailer = null;
var vtrailer = null;

var progeria = null;
var vprogeria = null;
var progeria_ready = false;

$(document).ready(function(){

	w = $(window).width();
	h = $(window).height();

	initNavigate();
	initGallery();
	changeResolution();

	$('#selector-btn').click(function (event) {
		event.preventDefault();
		$('#topmenu').toggle('slow');
	});
	if ($(window).width() <= 1024){
		$('#topmenu').hide('slow');
	}


	$('#Proshow div.arrows div.arrow').click(function(event){
		rel = $(this).attr('rel');
		if(rel != null && rel != ''){
			relul = '#'+rel+" ul.screenings";
			if($(this).hasClass('lft-arrow')){
				if($(relul).position().left < 0){
					$(relul).animate({left:"+=960"}, 'slow', 'easeInOutCubic', function(){})
				}
			} else {
				if($(relul).width() + $(relul).position().left > 960){
					$(relul).animate({left:"-=960"}, 'slow', 'easeInOutCubic', function(){})
				}
			}
		}
	});

	$('#Proshow ul.screenings').each(function(index){
		h = 100;
		$(this).children('li').each(function(index){
			if($(this).height() > h){
				h = $(this).height();
			}
		})
		$(this).parent().css('height', h+10);
	});

	initAll();


	trailer = $('#trailer-vimeo')[0];
	vtrailer = $f(trailer);
	vtrailer.addEvent('ready', function() {
		//console.log('ready');
		//vtrailer.addEvent('pause', function(id){});
		vtrailer.addEvent('finish', function(id){SWFAddress.setValue("/home/");});
		//vtrailer.addEvent('playProgress', function(data, id){});
	});

	progeria = $('#progeria-vimeo')[0];
	vprogeria = $f(progeria);
	vprogeria.addEvent('ready', function() {
		progeria_ready = true;
		//console.log('ready');
		//vtrailer.addEvent('pause', function(id){});
		vprogeria.addEvent('finish', function(id){$('#progvimeo').animate({opacity:0}, 2000, 'linear', function(){$('#progvimeo').hide();})});
		//vtrailer.addEvent('playProgress', function(data, id){});
	});

	$('#progvimeo').hide();
	$('.progeria-close').hide();
	$('p.wip-play > a').click(function(event){
		event.preventDefault();
		$('#progvimeo').css({opacity:0}).show().animate({opacity:1}, 'slow', 'linear', function(){});
		$('.progeria-close').show().animate({opacity:1}, 'slow', 'linear', function(){vprogeria.api('play')});
	});


	//$('#wall').draggable();
});




function initNavArrows() {
	$('.nav-arrow').click(function(event){
		if($('#full-list').css('display') == 'none'){
			
			newSlide = null;
			slide = $("#"+currentSlide);
			x = $(slide).attr('data-posx');
			y = $(slide).attr('data-posy');
			switch($(this).attr('rel')){
				case 'top': newSlide = getSlide(parseInt(x), parseInt(y)-1); break;
				case 'left': newSlide = getSlide(parseInt(x)+1, parseInt(y)); break;
				case 'bottom': newSlide = getSlide(parseInt(x), parseInt(y)+1); break;
				case 'right': newSlide = getSlide(parseInt(x)-1, parseInt(y)); break;
			}
			console.log(newSlide);
			if(newSlide != null && newSlide != currentSlide){
				currentSlide = newSlide;
				$('#topmenu > ul > li').removeClass('active');
				$('#topmenu > ul > li > a').each(function (index){
					if($(this).attr('rel') == newSlide){
						$(this).parent().addClass('active');
						return false;
					}
				});
				SWFAddress.setValue("/" + currentSlide + "/");
			}
		} else {
			newPhoto = photoIndex;
			switch($(this).attr('rel')){
				case 'top': newPhoto -=4; break;
				case 'left': newPhoto ++; break;
				case 'bottom': newPhoto +=4; break;
				case 'right': newPhoto --; break;
			}

			if(newPhoto == -1){
				newPhoto = 11;
			} else if(newPhoto == 12){
				newPhoto = 0;
			} else if(newPhoto < 0){
				newPhoto += 12;
			} else if(newPhoto > 11) {
				newPhoto -= 12;
			}
			openPhoto(newPhoto);
		}
	});
}

function initKeyGet() {
	$(document).keydown(function(e){
		slide = $("#"+currentSlide);
		x = $(slide).attr('data-posx');
		y = $(slide).attr('data-posy');

		newSlide = '';
		newPhoto = photoIndex;

		exitt = false;

		if (e.keyCode == 37) { // alert( "left pressed" );
			newSlide = getSlide(parseInt(x)-1, parseInt(y));
			newPhoto --;
		} else if (e.keyCode == 38) { // alert( "up pressed" );
			newPhoto -=4;
			newSlide = getSlide(parseInt(x), parseInt(y)-1);
		} else if (e.keyCode == 39) { // alert( "right pressed" );
			newSlide = getSlide(parseInt(x)+1, parseInt(y));
			newPhoto ++;
		} else if (e.keyCode == 40) { // alert( "down pressed" );
			newPhoto +=4;
			newSlide = getSlide(parseInt(x), parseInt(y)+1);
		} else if (e.keyCode == 27) {
			exitt = true;
		}

		if(!exitt) {
			if($('#full-list').css('display') != 'block'){
				if(newSlide != null && newSlide != currentSlide){
					currentSlide = newSlide;
					currentSlide = slide;
					$('#topmenu > ul > li').removeClass('active');
					$('#topmenu > ul > li > a').each(function (index){
						if($(this).attr('rel') == slide){
							$(this).parent().addClass('active');
							return false;
						}
					});
					SWFAddress.setValue("/" + currentSlide + "/");
				}
			} else {
				if(newPhoto == -1){
					newPhoto = 11;
				} else if(newPhoto == 12){
					newPhoto = 0;
				} else if(newPhoto < 0){
					newPhoto += 12;
				} else if(newPhoto > 11) {
					newPhoto -= 12;
				}
				openPhoto(newPhoto);
			}
		} else {
			exitt = false;
			$('#full-list').animate({opacity:0}, 'slow', function(){$(this).hide()});
			$('ul#nav').hide();
			$('.gallery-close').animate({opacity:0}, 'slow', function(){$(this).hide()});
		}
		return false;
	});
}

function updateVCenter() {
	h = $(window).height();
	$('.vcenter').each(function(index){
		oh = $(this).children('.content').height();
		if(h-50 > oh) {
			mov = Math.ceil((h-oh-50)/2)+50;
			$(this).css('margin-top', mov+'px');
			$(this).css('padding', '');
			$(this).css('height', '');
			$(this).css('overflow-y', '');
		} else {
			$(this).css('margin-top', '50px');
			if($(this).attr('rel') == 'nopaddingbottom') {
				$(this).css('padding', '20px 0 0');
				$(this).css('height', (h-70) + 'px');
			} else {
				$(this).css('padding', '20px 0');
				$(this).css('height', (h-90) + 'px');
			}
			$(this).css('overflow-y', 'scroll');
		}
	});
}
function updateVCenter1() {
	h = $(window).height();
	$('.vcenter1').each(function(index){
		oh = $(this).children('.lcontent').height();
		if(h-50 > oh) {
			mov = Math.ceil((h-oh-50)/2)+50;
			$(this).css('margin-top', mov+'px');
			$(this).css('padding', '');
			$(this).css('height', '');
			$(this).css('overflow-y', '');
		} else {
			$(this).css('margin-top', '50px');
			if($(this).attr('rel') == 'nopaddingbottom') {
				$(this).css('padding', '20px 0 0');
				$(this).css('height', (h-70) + 'px');
			} else {
				$(this).css('padding', '20px 0');
				$(this).css('height', (h-90) + 'px');
			}
			$(this).css('overflow-y', 'scroll');
		}
	});
}

function initQuestions(){
	$('ul.qa-nav a').click(function(event){
		$('ul.qa-nav li').removeClass('active');
		$(this).parent().addClass('active');
		event.preventDefault();
		idx = $(this).attr('data-index');
		setQuestion(idx);
	});
}

function setQuestion(idx){

	max = 0;

	h = $('ul.qas li:first-child').height();

	$('ul.qas li').each(function(index){
		if(idx == index){
			$(this).show().animate({opacity:1}, 'slow');
			$('ul.qa-nav').css('opacity', 0).animate({opacity:1}, 'slow');
			/*max = h - $(this).height();*/
		} else {
			$(this).css('opacity', 0).hide();
		}
	});

	$('ul.qa-nav li').css('padding-top', (max+40)+'px');

	$('div.about > img').each(function(index){
		if(idx%3 == index){
			$(this).show().animate({opacity:1}, 'slow');
		} else {
			$(this).css('opacity', 0).hide();
		}
	});
}

function initTrailerCross() {
	$('.trailer-close').click(function(index) {
		rel = $(this).attr('data-related');
		if(rel != '' && rel != null){
			rel = "*[rel=" + rel + "]";
			if($(rel).css('opacity') != 0){
				$(rel).animate({opacity:0}, 'slow', 'linear', function(){$(this).hide()});
				$(this).css({opacity:0}).hide();
				vtrailer.api('pause');
			}
		}
		SWFAddress.setValue("/home/");
	});

	$('.progeria-close').click(function(index) {
		rel = $(this).attr('data-related');
		if(rel != '' && rel != null){
			rel = "*[rel=" + rel + "]";
			if($(rel).css('opacity') != 0){
				$(rel).animate({opacity:0}, 'slow', 'linear', function(){$(this).hide()});
				$(this).css({opacity:0}).hide();
				vprogeria.api('pause');
			}
		}
	});
}


function initCloseCross() {
	$('.close-cross').click(function(index) {
		rel = $(this).attr('data-related');
		if(rel != '' && rel != null){
			rel = "*[rel=" + rel + "]";
			if($(rel).css('opacity') != 0){
				$(rel).animate({opacity:0});
			} else {
				$(rel).animate({opacity:1});
			}
		}
	});
}

function updateFullElements() {
	w = $(window).width();
	h = $(window).height();
	$('img.full, div.full').each(function(index){
		if(h/w >= 735/1200){
			$(this).css('height', Math.ceil( h ));
			$(this).css('width', Math.ceil( h * 1200/735 ));

			dif = Math.round((w - parseInt($(this).width())) * parseFloat($(this).attr('data-position-x')) );

			$(this).css('margin-left', dif + "px");
			$(this).css('margin-top', "0px");
		} else {
			$(this).css('width', Math.ceil( w ));
			$(this).css('height', Math.ceil( w * 735/1200 ));

			dif = Math.round((h - parseInt($(this).height())) * parseFloat($(this).attr('data-position-y')) );

			$(this).css('margin-top', dif + "px");
			$(this).css('margin-left', "0px");
		}
	});

	$('div.vimeo').each(function(index){
		$(this).css('height', Math.ceil( h ));
		$(this).css('width', Math.ceil( w ));
	});

	$('video.full').each(function(index){
		vw = $(this).attr('data-width');
		vh = $(this).attr('data-height');

		if(h/w >= vh/vw){
			$(this).css('height', Math.ceil( h ));
			$(this).css('width', Math.ceil( h * vw/vh ));

			dif = Math.round((w - parseInt($(this).width())) * parseFloat($(this).attr('data-position-x')) );

			$(this).css('margin-left', dif + "px");
			$(this).css('margin-top', "0px");
		} else {
			$(this).css('width', Math.ceil( w ));
			$(this).css('height', Math.ceil( w * vh/vw ));

			dif = Math.round((h - parseInt($(this).height())) * parseFloat($(this).attr('data-position-y')) );

			$(this).css('margin-top', dif + "px");
			$(this).css('margin-left', "0px");
		}
	});


	$('.credits').css('height', '');
	if(h > $('#sponsers .content').height()){
		$('.credits').css('height', h - $('#sponsers .content').height());
	}

	if(w > 1024){
		$('.vport ul').each(function(index){
			$(this).css('width', $(this).children('li').length * 196);
		})
	} else {
		$('.vport ul').css('width', '');
	}
}

function showArrows() {
	slide = $("#"+currentSlide);

	if(slide != null){
		x = $(slide).attr('data-posx');
		y = $(slide).attr('data-posy');
		at = getSlide(parseInt(x), parseInt(y)-1);
		ar = getSlide(parseInt(x)-1, parseInt(y));
		ab = getSlide(parseInt(x), parseInt(y)+1);
		al = getSlide(parseInt(x)+1, parseInt(y));

		if(at == null) {
			$('.top-arrow').css('display', 'none');
		} else {
			$('.top-arrow').css('display', 'block');
		}

		if(ar == null) {
			$('.right-arrow').css('display', 'none');
		} else {
			$('.right-arrow').css('display', 'block');
		}

		if(ab == null) {
			$('.bottom-arrow').css('display', 'none');
		} else {
			$('.bottom-arrow').css('display', 'block');
		}

		if(al == null) {
			$('.left-arrow').css('display', 'none');
		} else {
			$('.left-arrow').css('display', 'block');
		}
	}
}

function getSlide(x, y) {
	slide = null;
	$('.slide').each(function (index){
		if($(this).attr('data-posx') == x && $(this).attr('data-posy') == y){
			slide = $(this).attr('id');
			return false;
		}
	});
	return slide;
}


$(window).resize(function() {
	changeResolution();
});

function changeResolution() {
	w = $(window).width();
	h = $(window).height();

	$("#viewport").width(w);
	$("#viewport").height(h);

	$( ".slide" ).each(function( index ) {
		$(this).width(w);
		$(this).height(h);

		$(this).css('left', ($(this).attr('data-posx') * w) + "px");
		$(this).css('top', ($(this).attr('data-posy') * h) + "px");
	});

	$('section#gallery li.media').each(function (index) {
		$(this).css('width', Math.floor(w/4));
		$(this).css('height', Math.floor(h/3));
	});

	if(w <= 1024){
		$('#topmenu').hide('slow');
	}

	
	$('ul#thumb-list img').each(function (index) {
		if((h/3) / (w/4) >= 199/299){
			$(this).css('height', Math.ceil( h/3 ));
			$(this).css('width', Math.ceil( h/3 * 299/199 ));

			dif = Math.round((w/4 - parseInt($(this).width())) * parseFloat($(this).attr('data-position')) );

			$(this).css('margin-left', dif + "px");
		} else {
			$(this).css('width', Math.ceil( w/4 ));
			$(this).css('margin-left', "0px");
		}
	});


	$('ul#full-list').css('width', w*4);
	$('ul#full-list').css('height', w*3);
	$('ul#full-list li').each(function (index) {
		x = ((index%4) * w);
		y = (Math.floor(index/4) * h);
		$(this).css('top', y+'px');
		$(this).css('left', x+'px');
		$(this).css('width', Math.floor(w));
		$(this).css('height', Math.floor(h));
	});

	moveWall(1);
	updateFullElements();
	updateVCenter();
	updateVCenter1();
}


function initNavigate() {
	$('a.option').click(function(event){
		if($(this).attr('href') == '#'){
			event.preventDefault();
			if($(this).attr('rel') != 'share'){
				currentSlide = $(this).attr('rel');
				if ($(window).width() <= 1024){
					$('#topmenu').hide('slow');
				}
				$('#topmenu > ul > li').removeClass('active');
				$(this).parent().addClass('active');
				SWFAddress.setValue("/" + currentSlide + "/");
			}
		}
	});
}

function moveWall(time) {
	w = $(window).width();
	slide = $("#"+currentSlide);
	if($("#"+currentSlide+" .trans").length > 0 && time > 1 && w > 1024){
		$("#"+currentSlide+" .trans").css({opacity:0}).delay(time*2).animate({opacity:1}, 'slow');
		$("#"+currentSlide+" .trans").removeClass('trans');
	}

	if(currentSlide != 'what-is-progeria'){
		if(progeria_ready){
			vprogeria.api('pause');
		}
	}

	if(currentSlide != 'trailer'){
		$('.trailer-close').css({opacity:0}).hide();
		$('#trailer-video').animate({opacity:0},'slow', 'linear', function(){$(this).hide()});
	}

	if(currentSlide == 'trailer'){
		$('#trailer-video').show().animate({opacity:1}, 'slow');
		$('.trailer-close').show().animate({opacity:1}, 2000, 'linear', function(){vtrailer.api('play')});
	}

	t = "-"  + ($(slide).css('top'));
	l = "-"  + ($(slide).css('left'));
	$("#wall").animate({left: l, top: t}, time, "easeInOutCubic", function() {});
}

function initGallery() {
	$('a.fpl').click(function(event){
		event.preventDefault();
		idx = $(this).attr('data-index');
		if(idx != null){
			$('#full-list').show().animate({opacity:1}, 'slow');
			$('ul#nav').show();
			$('.gallery-close').show().animate({opacity:1}, 'slow');
			openPhoto(idx);
		}
	});
	$('.gallery-close').click(function(event){
		$('#full-list').animate({opacity:0}, 'slow', function(){$(this).hide()});
		$('ul#nav').hide();
		$('.gallery-close').animate({opacity:0}, 'slow', function(){$(this).hide()});
	});
}

var photoIndex = 0;

function openPhoto(idx){
	w = $(window).width();
	h = $(window).height();

	x = -((idx%4) * w);
	y = -(Math.floor(idx/4) * h);

	if($('ul#full-list').css('opacity') != 1){
		$('ul#full-list').css({top:y+"px", left:x+'px'});
	} else {
		$('ul#full-list').animate({top:y+"px", left:x+'px'}, 'slow');
	}

	console.log(idx);

	$('#gallery ul#nav li span').removeClass('active');
	$('#gallery ul#nav li span').each(function(index){
		if(idx == index){
			$(this).addClass('active');
			return false;
		}
	});

	photoIndex = idx;
}


function initloader() {
	loader = new PxLoader();

	$('img').each(function(index){
		loader.add(new PxLoaderImage($(this).attr('src')));
	});

	$('a.full-photo').each(function(index){
		loader.add(new PxLoaderImage($(this).attr('href')));
	});

	loader.addProgressListener(function(e) {
		opac = e.completedCount / e.totalCount;
		load = Math.ceil(256 * e.completedCount / e.totalCount);

		$('#status > div').css('width', load);
		$('#logo-loader').css('opacity', opac);
	});

	loader.addCompletionListener(function(e) {
		$('#logo-loader').animate({opacity:1}, 'fast', function(){
			$("#status").delay(1000).animate({opacity:0},'slow', function(){
				$('header').show('slow');
				$("#preloader").delay(1000).animate({opacity:0},'slow', function(){
					$(this).hide();
					$('div.nav-arrow').css('z-index', 6000);
					$('#home img.arrows').delay(5000).animate({opacity:0}, 'slow', 'linear', function(){$(this).hide()});
				});
			});
		});
		updateVCenter();
		updateVCenter1();
	});

	loader.start();
}


function initAll() {
	if($(window).width() > 1024){
		initloader();
		$('#home div.content').css('height', '535px');
	} else {
		updateVCenter();
		updateVCenter1();
		$('#preloader').hide();
		$('div.nav-arrow').css('z-index', 6000);
		$('#home div.content').css('height', '');
	}
	updateFullElements();
	updateVCenter();
	updateVCenter1();

	initNavArrows();
	initTrailerCross();
	initCloseCross();
	initQuestions();
	initKeyGet();

	showArrows();
}


//  ------------------------- SWFADDRESS - BEGIN -----------------------------
function toTitleCase(str) {
	return str.substr(0,1).toUpperCase() + str.substr(1).toLowerCase();
} 

function formatTitle(title) {
	return 'Milan\'15 ' + (title != '/' ? ' / ' + toTitleCase(title.substr(1, title.length - 2).replace(/\//g, ' / ')) : '');
}

function handleChange(event) {
	var index, rel, links = document.getElementsByTagName('a'), path = event.path;
	if (path.substr(path.length - 1) != '/') {
		path += '/';
	}
	for (var i = 0, l, link; link = links[i]; i++) {
		index = link.rel.indexOf('?');
		rel = (index > -1) ? link.rel.substr(0, index) : link.rel;
		link.className = (rel == path) ? 'selected' : '';
	}
	var parameters = '';
	for (var p in event.parameters) {
		parameters += '&' + p + '=' + event.parameters[p];
	}

	slide = event.path;
	slide = slide.replace("/", '');
	slide = slide.replace("/", '');


	if(currentSlide != slide) {
		currentSlide = slide;
		$('#topmenu > ul > li').removeClass('active');
		$('#topmenu > ul > li > a').each(function (index){
			if($(this).attr('rel') == slide){
				$(this).parent().addClass('active');
				return false;
			}
		});
	}

	moveWall(1000)
	SWFAddress.setTitle(formatTitle(event.path));
	showArrows();
}

SWFAddress.addEventListener(SWFAddressEvent.CHANGE, handleChange);

SWFAddress.addEventListener(SWFAddressEvent.INIT, function(){
	if(SWFAddress.getValue() == "/"){
		SWFAddress.setValue("/home/");
	}
});
//  ------------------------- SWFADDRESS - END -----------------------------


// http://matthewlein.com/experiments/easing.html