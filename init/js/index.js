var screenWidth,
    screenHeight;

function start () {

    resize();
    window.addEventListener('resize', resize);

     var tlLoader    = setTimelineLoader(),
        tlContent    = setTimelineContent(),
        tlGlobal     = new TimelineMax();

    tlGlobal.set(document.querySelector('.content'), {alpha: 0});
    tlGlobal.add(tlLoader);
    tlGlobal.set(document.querySelector('.content'), {alpha: 1});
    tlGlobal.add(tlContent);
    tlGlobal.play();
    document.body.style.display = 'block';
};

function resize () {
    screenWidth  = document.documentElement.clientWidth,
    screenHeight = document.documentElement.clientHeight;
};

function setTimelineLoader () {
    var first            = document.querySelector('.line.first'),
        maskTop          = document.querySelector('.mask.top'),
        maskBottom       = document.querySelector('.mask.bottom');

    var second           = document.querySelector('.line.second'),
        maskLeft         = document.querySelector('.mask.left'),
        maskRight        = document.querySelector('.mask.right');

    var third            = document.querySelector('.line.third'),
        maskBottomLeft   = document.querySelector('.mask.bottom-left'),
        maskTopRight     = document.querySelector('.mask.top-right');
    maskTopRight.style.borderWidth    = '0 '+ (screenWidth-1) + 'px '+ (screenHeight-1) +'px 0';
    maskBottomLeft.style.borderWidth  = ''+ (screenHeight-1) +'px 0 0 '+ (screenWidth-1) +'px';

    var fourth            = document.querySelector('.line.fourth'),
        maskTopLeft       = document.querySelector('.mask.top-left'),
        maskBottomRight   = document.querySelector('.mask.bottom-right');
    maskTopLeft.style.borderWidth     = (screenHeight-1) + 'px '+ (screenWidth-1) +'px 0 0';
    maskBottomRight.style.borderWidth = '0 0 '+ (screenHeight-1) +'px '+ (screenWidth-1) +'px';

    TweenMax.set(document.querySelector('.loader.second'), {alpha: 0});
    TweenMax.set(document.querySelector('.loader.third'), {alpha: 0});
    TweenMax.set(document.querySelector('.loader.fourth'), {alpha: 0});

    var tl = new TimelineMax();

    tl.fromTo(first, 0.4, {x: screenWidth}, {x: 0, ease: Circ.easeIn}, 0);
    tl.fromTo(maskTop, 0.4, {y: 0}, {y: -screenHeight/2, ease: Expo.easeOut, delay: 0.01}, 0.4);
    tl.fromTo(maskBottom, 0.4, {y: 0}, {y: screenHeight/2, ease: Expo.easeOut, delay: 0.01}, 0.4);
    tl.set(document.querySelector('.loader.first'), {alpha: 0});

    tl.set(document.querySelector('.loader.second'), {alpha: 1});
    tl.fromTo(second, 0.4, {y: -screenHeight}, {y: 0, ease: Circ.easeIn});
    tl.fromTo(maskRight, 0.4, {x: 0}, {x: screenWidth/2, ease: Expo.easeOut, delay: 0.01}, 1.2); // 2.5
    tl.fromTo(maskLeft, 0.4, {x: 0}, {x: -screenWidth/2, ease: Expo.easeOut, delay: 0.01}, 1.2);
    tl.set(document.querySelector('.loader.second'), {alpha: 0});

    tl.set(document.querySelector('.loader.third'), {alpha: 1});
    tl.fromTo(third, 0.4, {x: screenWidth}, {x: 0, ease: Circ.easeIn});
    tl.fromTo(maskTopRight, 0.4, {y: 0}, {y: -screenHeight, ease: Circ.easeOut, delay: 0.01}, 2);
    tl.fromTo(maskBottomLeft, 0.4, {y: 0}, {y: screenHeight, ease: Circ.easeOut, delay: 0.01}, 2);

    tl.set(document.querySelector('.loader.fourth'), {alpha: 1});
    tl.fromTo(fourth, 0.4, {y: -screenHeight}, {y: 0, ease: Circ.easeIn});
    tl.fromTo(maskTopLeft, 0.4, {x: 0}, {x: -screenWidth, ease: Circ.easeOut, delay: 0.01}, 2.8);
    tl.fromTo(maskBottomRight, 0.4, {x: 0}, {x: screenWidth, ease: Circ.easeOut, delay: 0.01}, 2.8);

    return tl;
};

function setTimelineContent () {
    var tl = new TimelineMax();
    tl.set(document.querySelector('.underline'), {width: 0});
    tl.staggerFromTo(document.querySelectorAll('.letter'), 0.9, {'font-size': 0, alpha: 0}, {'font-size': '50px', alpha: 1, ease: Expo.easeInOut}, 0.08);
    tl.fromTo(document.querySelector('.underline'), 0.4, {width: 0, alpha: 0}, {width: 160, alpha: 1, ease: Sine.easeOut});

    setTimeout(function() {
        location.href = "app://ol/loader/index.html"
        //location.reload();
    }, 5000);

    return tl;
}

start();






