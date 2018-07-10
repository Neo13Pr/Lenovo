//add changes

var mob = (navigator.userAgent.indexOf("iPhone") != -1) || ((navigator.userAgent.indexOf("Android") != -1) || (navigator.userAgent.indexOf("Mobile") != -1)) || (navigator.userAgent.indexOf('iPad') != -1) || (navigator.userAgent.indexOf('iPod') != -1);
if (document.addEventListener) {
 window.addEventListener('load', isWebGlSupported);
}else if(document.attachEvent){

    window.attachEvent('onload', isWebGlSupported);
}

function isWebGlSupported() {
    // console.log("ipad......");
    var canvasSupported = !!window.HTMLCanvasElement;
    var context = null;
    var ua = navigator.userAgent.toLowerCase();
    var isAtLeastIE10 = (ua.match(/Trident\/[6]/i)); //test IE10;
    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) { //test for MSIE x.x;
        var ieversion = new Number(RegExp.$1) // capture x.x portion and store as a number
       // if (ieversion >= 9 || ieversion >= 8) var IeUser = true;
    }
    if (ieversion >= 5 || ieversion >= 6 || ieversion >= 7 || ieversion >= 8 || ieversion >= 9 || isAtLeastIE10) {
        canvasSupported = false;
    }
    if (canvasSupported) {
        var canvas = document.getElementById("superblaze-canvas");
        var names = ["webgl2", "webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
        for (var ii = 0; ii < names.length; ++ii) {
            try {
                context = canvas.getContext(names[ii], {
                    antialias: true,
                    depth: true
                });
            } catch (e) {}
            if (context) {
                break;
            }
        }
        canvasSupported = !!(window.WebGLRenderingContext && context);
    }
    if (canvasSupported) {
         
        addLoader();
        SuperblazeStart(context);
       
//        if ((navigator.userAgent.indexOf("iPhone") != -1) || ((navigator.userAgent.indexOf("Android") != -1) || (navigator.userAgent.indexOf("Mobile") != -1)) || (navigator.userAgent.indexOf('iPad') != -1) || (navigator.userAgent.indexOf('iPod') != -1)) {
//           
//            $("#zoomSliderContainer").css("display", "none");
//            if ((navigator.userAgent.indexOf("iPhone") != -1) || (navigator.userAgent.indexOf("Android") != -1) || (navigator.userAgent.indexOf('iPod') != -1)) {
//                
//                document.location = "mobile/index.html"
//            }
//        } else {
//           // $("body").css('overflow', 'hidden');
//           //scene.forceAA(true);
//            
//        }
    } 
}

function addLoader() {
  parseXml();
  $('#loader').css('display', 'block');
  $('#transPatch').css('display','block');
  $('#loader1').css('display','block');
  $('#loader2').css('display','block');
}

var dragCursor;
var curBrowser = BrowserDetect.browser;
// IE doesn't support co-ordinates
var cursCoords = (curBrowser == "Explorer") ? "" : " 4 4";

function initDragCursorSpin() {
    handOpenSpin();
    $('#sliderframe').mousedown(function() {
        handClosedSpin();
    });
    $('body').mouseup(function() {
        handOpenSpin();
    });
}

function handClosedSpin() {
    dragCursor = (curBrowser == "Firefox") ? "-moz-grabbing" : "url(images_gl/closedhand.cur)" + cursCoords + ", move";
    // Opera doesn't support url cursors and doesn't fall back well...
    if (curBrowser == "Opera") dragCursor = "move";
    $('#sliderframe').css("cursor", dragCursor);
}

function handOpenSpin() {
    dragCursor = (curBrowser == "Firefox") ? "-moz-grab" : "url(images_gl/openhand.cur)" + cursCoords + ", move";
    $('#sliderframe').css("cursor", dragCursor);
}

function getCanvasSupported() {
    return canvasSupported;
}