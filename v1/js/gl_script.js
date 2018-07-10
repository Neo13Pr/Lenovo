// --------------------------------------------------------START----------------------------------------------------------//
// --------------------------------------------------------do not edit or remove----------------------------------------------------------//


Vector3 = function(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
};
Vector3.prototype = {
    constructor: Vector3,
    set: function(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    },
    setX: function(x) {
        this.x = x;
        return this;
    },
    setY: function(y) {
        this.y = y;
        return this;
    },
    setZ: function(z) {
        this.z = z;
        return this;
    },
    setComponent: function(index, value) {
        switch (index) {
            case 0:
                this.x = value;
                break;
            case 1:
                this.y = value;
                break;
            case 2:
                this.z = value;
                break;
            default:
                throw new Error('index is out of range: ' + index);
        }
    },
    getComponent: function(index) {
        switch (index) {
            case 0:
                return this.x;
            case 1:
                return this.y;
            case 2:
                return this.z;
            default:
                throw new Error('index is out of range: ' + index);
        }
    },
    copy: function(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    },
    add: function(v, w) {
        if (w !== undefined) {
            console.warn('Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead.');
            return this.addVectors(v, w);
        }
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    },
    addScalar: function(s) {
        this.x += s;
        this.y += s;
        this.z += s;
        return this;
    },
    addVectors: function(a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        return this;
    },
    sub: function(v, w) {
        if (w !== undefined) {
            console.warn('Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.');
            return this.subVectors(v, w);
        }
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    },
    subVectors: function(a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        return this;
    },
    multiply: function(v, w) {
        if (w !== undefined) {
            console.warn('Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead.');
            return this.multiplyVectors(v, w);
        }
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
        return this;
    },
    multiplyScalar: function(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;
    },
    multiplyVectors: function(a, b) {
        this.x = a.x * b.x;
        this.y = a.y * b.y;
        this.z = a.z * b.z;
        return this;
    },
    applyEuler: function() {
        var quaternion;
        return function(euler) {
            if (euler instanceof Euler === false) {
                console.error('Vector3: .applyEuler() now expects a Euler rotation rather than a Vector3 and order.');
            }
            if (quaternion === undefined) quaternion = new Quaternion();
            this.applyQuaternion(quaternion.setFromEuler(euler));
            return this;
        };
    }(),
    applyAxisAngle: function() {
        var quaternion;
        return function(axis, angle) {
            if (quaternion === undefined) quaternion = new Quaternion();
            this.applyQuaternion(quaternion.setFromAxisAngle(axis, angle));
            return this;
        };
    }(),
    applyMatrix3: function(m) {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var e = m.elements;
        this.x = e[0] * x + e[3] * y + e[6] * z;
        this.y = e[1] * x + e[4] * y + e[7] * z;
        this.z = e[2] * x + e[5] * y + e[8] * z;
        return this;
    },
    applyMatrix4: function(m) {
        // input: Matrix4 affine matrix
        var x = this.x,
            y = this.y,
            z = this.z;
        var e = m.elements;
        this.x = e[0] * x + e[4] * y + e[8] * z + e[12];
        this.y = e[1] * x + e[5] * y + e[9] * z + e[13];
        this.z = e[2] * x + e[6] * y + e[10] * z + e[14];
        return this;
    },
    applyProjection: function(m) {
        // input: Matrix4 projection matrix
        var x = this.x,
            y = this.y,
            z = this.z;
        var e = m.elements;
        var d = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]); // perspective divide
        this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * d;
        this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * d;
        this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * d;
        return this;
    },
    applyQuaternion: function(q) {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var qx = q.x;
        var qy = q.y;
        var qz = q.z;
        var qw = q.w;
        // calculate quat * vector
        var ix = qw * x + qy * z - qz * y;
        var iy = qw * y + qz * x - qx * z;
        var iz = qw * z + qx * y - qy * x;
        var iw = -qx * x - qy * y - qz * z;
        // calculate result * inverse quat
        this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
        this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
        this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
        return this;
    },
    transformDirection: function(m) {
        // input: Matrix4 affine matrix
        // vector interpreted as a direction
        var x = this.x,
            y = this.y,
            z = this.z;
        var e = m.elements;
        this.x = e[0] * x + e[4] * y + e[8] * z;
        this.y = e[1] * x + e[5] * y + e[9] * z;
        this.z = e[2] * x + e[6] * y + e[10] * z;
        this.normalize();
        return this;
    },
    divide: function(v) {
        this.x /= v.x;
        this.y /= v.y;
        this.z /= v.z;
        return this;
    },
    divideScalar: function(scalar) {
        if (scalar !== 0) {
            var invScalar = 1 / scalar;
            this.x *= invScalar;
            this.y *= invScalar;
            this.z *= invScalar;
        } else {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        }
        return this;
    },
    min: function(v) {
        if (this.x > v.x) {
            this.x = v.x;
        }
        if (this.y > v.y) {
            this.y = v.y;
        }
        if (this.z > v.z) {
            this.z = v.z;
        }
        return this;
    },
    max: function(v) {
        if (this.x < v.x) {
            this.x = v.x;
        }
        if (this.y < v.y) {
            this.y = v.y;
        }
        if (this.z < v.z) {
            this.z = v.z;
        }
        return this;
    },
    clamp: function(min, max) {
        // This function assumes min < max, if this assumption isn't true it will not operate correctly
        if (this.x < min.x) {
            this.x = min.x;
        } else if (this.x > max.x) {
            this.x = max.x;
        }
        if (this.y < min.y) {
            this.y = min.y;
        } else if (this.y > max.y) {
            this.y = max.y;
        }
        if (this.z < min.z) {
            this.z = min.z;
        } else if (this.z > max.z) {
            this.z = max.z;
        }
        return this;
    },
    clampScalar: (function() {
        var min, max;
        return function(minVal, maxVal) {
            if (min === undefined) {
                min = new Vector3();
                max = new Vector3();
            }
            min.set(minVal, minVal, minVal);
            max.set(maxVal, maxVal, maxVal);
            return this.clamp(min, max);
        };
    })(),
    floor: function() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        this.z = Math.floor(this.z);
        return this;
    },
    ceil: function() {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        this.z = Math.ceil(this.z);
        return this;
    },
    round: function() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        this.z = Math.round(this.z);
        return this;
    },
    roundToZero: function() {
        this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
        this.y = (this.y < 0) ? Math.ceil(this.y) : Math.floor(this.y);
        this.z = (this.z < 0) ? Math.ceil(this.z) : Math.floor(this.z);
        return this;
    },
    negate: function() {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    },
    dot: function(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    },
    lengthSq: function() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    },
    length: function() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    },
    lengthManhattan: function() {
        return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
    },
    normalize: function() {
        return this.divideScalar(this.length());
    },
    setLength: function(l) {
        var oldLength = this.length();
        if (oldLength !== 0 && l !== oldLength) {
            this.multiplyScalar(l / oldLength);
        }
        return this;
    },
    lerp: function(v, alpha) {
        this.x += (v.x - this.x) * alpha;
        this.y += (v.y - this.y) * alpha;
        this.z += (v.z - this.z) * alpha;
        return this;
    },
    cross: function(v, w) {
        if (w !== undefined) {
            console.warn('Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead.');
            return this.crossVectors(v, w);
        }
        var x = this.x,
            y = this.y,
            z = this.z;
        this.x = y * v.z - z * v.y;
        this.y = z * v.x - x * v.z;
        this.z = x * v.y - y * v.x;
        return this;
    },
    crossVectors: function(a, b) {
        var ax = a.x,
            ay = a.y,
            az = a.z;
        var bx = b.x,
            by = b.y,
            bz = b.z;
        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;
        return this;
    },
    projectOnVector: function() {
        var v1, dot;
        return function(vector) {
            if (v1 === undefined) v1 = new Vector3();
            v1.copy(vector).normalize();
            dot = this.dot(v1);
            return this.copy(v1).multiplyScalar(dot);
        };
    }(),
    projectOnPlane: function() {
        var v1;
        return function(planeNormal) {
            if (v1 === undefined) v1 = new Vector3();
            v1.copy(this).projectOnVector(planeNormal);
            return this.sub(v1);
        }
    }(),
    reflect: function() {
        // reflect incident vector off plane orthogonal to normal
        // normal is assumed to have unit length
        var v1;
        return function(normal) {
            if (v1 === undefined) v1 = new Vector3();
            return this.sub(v1.copy(normal).multiplyScalar(2 * this.dot(normal)));
        }
    }(),
    angleTo: function(v) {
        var theta = this.dot(v) / (this.length() * v.length());
        // clamp, to handle numerical problems
        return Math.acos(Math.clamp(theta, -1, 1));
    },
    distanceTo: function(v) {
        return Math.sqrt(this.distanceToSquared(v));
    },
    distanceToSquared: function(v) {
        var dx = this.x - v.x;
        var dy = this.y - v.y;
        var dz = this.z - v.z;
        return dx * dx + dy * dy + dz * dz;
    },
    setEulerFromRotationMatrix: function(m, order) {
        console.error('Vector3: .setEulerFromRotationMatrix() has been removed. Use Euler.setFromRotationMatrix() instead.');
    },
    setEulerFromQuaternion: function(q, order) {
        console.error('Vector3: .setEulerFromQuaternion() has been removed. Use Euler.setFromQuaternion() instead.');
    },
    getPositionFromMatrix: function(m) {
        console.warn('Vector3: .getPositionFromMatrix() has been renamed to .setFromMatrixPosition().');
        return this.setFromMatrixPosition(m);
    },
    getScaleFromMatrix: function(m) {
        console.warn('Vector3: .getScaleFromMatrix() has been renamed to .setFromMatrixScale().');
        return this.setFromMatrixScale(m);
    },
    getColumnFromMatrix: function(index, matrix) {
        console.warn('Vector3: .getColumnFromMatrix() has been renamed to .setFromMatrixColumn().');
        return this.setFromMatrixColumn(index, matrix);
    },
    setFromMatrixPosition: function(m) {
        this.x = m.elements[12];
        this.y = m.elements[13];
        this.z = m.elements[14];
        return this;
    },
    setFromMatrixScale: function(m) {
        var sx = this.set(m.elements[0], m.elements[1], m.elements[2]).length();
        var sy = this.set(m.elements[4], m.elements[5], m.elements[6]).length();
        var sz = this.set(m.elements[8], m.elements[9], m.elements[10]).length();
        this.x = sx;
        this.y = sy;
        this.z = sz;
        return this;
    },
    setFromMatrixColumn: function(index, matrix) {
        var offset = index * 4;
        var me = matrix.elements;
        this.x = me[offset];
        this.y = me[offset + 1];
        this.z = me[offset + 2];
        return this;
    },
    equals: function(v) {
        return ((v.x === this.x) && (v.y === this.y) && (v.z === this.z));
    },
    fromArray: function(array) {
        this.x = array[0];
        this.y = array[1];
        this.z = array[2];
        return this;
    },
    toArray: function() {
        return [this.x, this.y, this.z];
    },
    clone: function() {
        return new Vector3(this.x, this.y, this.z);
    }
};
// --------------------------------------------------------do not edit or remove----------------------------------------------------------//
// --------------------------------------------------------END----------------------------------------------------------//
var first = false;
var second = false;
var third = false;
var fourth = false;
var cat4 = false;
var cat5 = false;
var fourth = false;
var onComplete = true;
var currneAnim;

var preLoadImage1 = new Image();
var preLoadImage2 = new Image();
var preLoadImage3 = new Image();

var preLoadImage4 = new Image();
var preLoadImage5 = new Image();
var preLoadImage6 = new Image();
var preLoadImage7 = new Image();
var preLoadImage8 = new Image();

function load_img(){
      preLoadImage1.src='images_gl/loaderblock.jpg';
      preLoadImage2.src='images_gl/loader_011.png';
      preLoadImage3.src='images_gl/loaderbar.png';
	   
      preLoadImage3.onload = afterLoad;
}
  
function afterLoad(){
    $('#transPatch').css('display','block');
    $('#reset,.fullScreenBox,#close_btn,#logoAdidas,#logoPredator').css('visibility','visible');
	  
}

 $(document).ready(function() {
             load_img(); 
     
     $(document).on('click', '.playAll', autoPlayAllAnimations)
     $(document).on('click', '.pauseAll', autoPauseAllAnimations)
});

$(window).load(function(){
     // load_img(); 
});

$(function(){
    resizePage(window.innerWidth,window.innerHeight);
    resizePage(window.document.documentElement.clientWidth,window.document.documentElement.clientHeight);
  if ((navigator.userAgent.indexOf('iPad') != -1) || (navigator.userAgent.indexOf('MSIE')!==-1 || navigator.appVersion.indexOf('Trident/') > 0)) {
     // console.log("ie1")
      $("#close").css('display', 'none');
            $("#fullScreen").css('display', 'none');
        } else {
            $("#fullScreen").css('display', 'block');
        }
    
//    if ((navigator.userAgent.indexOf('MSIE')!==-1 || navigator.appVersion.indexOf('Trident/') > 0)) {
//                           console.log("onlyie")
//                           $(".menuitems, .menuitems1").css("background-color","#4a4a4b");
//                                       $(".menuitems, .menuitems1").addClass("iespe");
//
//                           }
})
function closeOption(){
		for(i=1;i<=17;i++){
				$("#colors"+i).css("display","none");
				$("#forselectcolor"+i).css("display","none");
		}
		$("#colorTextforcat5").css("display","none");
}

$(window).load(function() {
				resizePage(window.document.documentElement.clientWidth,window.document.documentElement.clientHeight);    
				$(window).live('resize',function(){
                 resizePage(window.innerWidth,window.innerHeight);
        });
        window.onresize = function (event) {
             resizePage(window.innerWidth,window.innerHeight);
        }
       
});
  

function onReset() {
    onResetCameraClickGL(); //in _ui.js
}
	
function onZoomSlide(event, ui) {
    var val = -20 * (ui.value / 100) + 10;
    NavSetDolly(val);
    updateZoomBar(val);
    scene.clearRefine();
}
	
$(function() {
    // Slider
    //range: 'min',
    $('#zoom_slider').slider({
        orientation: "vertical",
        value: 155,
        min: 0,
        max: 205,
        slide: onZoomSlide
    });
    $('nodrag').on('dragstart', function(event) {
        event.preventDefault();
    });
    $('.nodrag').mousedown(function() {
        return false
    });

});

function buttonsZoom(value) {
    var delta = value;
    var deltaScene = (delta * 0.03) * (0.3);
    deltaScene = -deltaScene;
    if (NavSetDolly(g_navDolly + deltaScene)) {
        scene.clearRefine();
        updateZoomBar(g_navDolly-10);
    }
}
var updateEnabled = true;
var canvas = null,
    canvas2 = null;
var scene = null,
    scene2 = null;
var _scenePollInterval;
var outstandingJobs;
var totalJobs;
var firstTime = true;
var tempW = 5;
var animationLoading;
var autoplayAnim = false;



function isSuperblazeReady() {   
     if (scene) {
                //totalJobs = 230;
                scene.start();
                outstandingJobs = scene.getOutstandingJobs();
               if (!(scene._projectparsed /*&& scene._started*/)) {
                        if(firstTime){
                             
                            firstTime=false;
                            animationLoading = setInterval(function() {  
                                // console.log("loaderbar>>")
                                tempW = tempW + 1;
                                if (tempW > 30) tempW = 30;
                               
                            }, 10);
                            
                        }
                } else if (outstandingJobs <= 0 && scene._prepared) {
                    onSuperBlazeReady();
                    clearInterval(_scenePollInterval);
                } else if (scene._projectparsed /*&& scene._started*/) {
                     clearInterval(animationLoading);
                     updateProgressBar();
                }
            }
	
}

function updateProgressBar() {
    totalJobs = scene.getTotalJobs();
    outstandingJobs = scene.getOutstandingJobs();
    var perc = 100 - Math.round(outstandingJobs / totalJobs * 100);
    // var newwidth = 170-(170 * (outstandingJobs / totalJobs))+20;
    var newwidth = 50 + 141*perc/100;
    if(newwidth<30) newwidth=30;
    //console.log("updateProgressBar -- loaderbar "+newwidth+"px perc "+perc+" jobs "+outstandingJobs+"/"+totalJobs);
    $("#loaderbar", window.parent.document).css("width", newwidth + "px");
}

function fadingEffect (selector){
    var width = $("#"+selector).width();
    console.log("width", width);
for(i= 100 ; i> 0;i--){
 $("#"+selector).animate({width: i+"%"},0.5);
}
}
var set1_1;
var set1_2;
var set1_3;
var set1_4;
var set1_5;
var set1_6;
    
function clearSets(){
        clearTimeout(set1_1);
        clearTimeout(set1_2);
        clearTimeout(set1_3);
        clearTimeout(set1_4);
        clearTimeout(set1_5);
        clearTimeout(set1_6);

}


 function function1(callback) {
    console.log("1")
    $("#textFadeClass_01").css("display","block");
    fadingEffect("txtfadeEffetCls_01");
     set1_1 = setTimeout(function() {
        callback();
    }, 2500);
}

function function2(callback2) {
    console.log("2")
    $("#textFadeClass_02").css("display","block");
    fadingEffect("txtfadeEffetCls_02");
        set1_2 = setTimeout(function() {
        callback2();
    }, 2500);

}

function function3(callback3) {
    console.log("3")
     $("#textFadeClass_03").css("display","block");
    fadingEffect("txtfadeEffetCls_03");
	   set1_3 = setTimeout(function() {
        callback3();
    }, 2500);
}

function function4(callback4) {
    console.log("4")
     $("#textFadeClass_04").css("display","block");
    fadingEffect("txtfadeEffetCls_04");
       set1_4 = setTimeout(function() {
        callback4();
    }, 2500);

}
function function5() {
    console.log("5")
     $("#textFadeClass_05").css("display","block");
    fadingEffect("txtfadeEffetCls_05");
    set1_5 = setTimeout(function() {

    }, 2500);

}

function callbackChain(){
function1(function() {
    function2(function() {
        function3(function() {
            function4(function() {
                function5(); 
            }); 
        });
    });
});  
}
function onSuperBlazeReady() {
   
   
   
				scene._jitRadius = 4;
				scene._zNearMin = 5.0;
				if(mob) scene._bDoF=false;
				window.addEventListener('focus', onWindowFocus, false);
				window.addEventListener('blur', onWindowBlur, false);
                scene.instanceSet("Lenovo_ThinkServer_TD350_scale_HD_70", "visible", false);
//    scene.gotoPosInTime(6.159253100187623,-0.00942477796076938,11.463212601069428,1.973262264125228,6.371349243271649,0);
//        scene.gotoPosInTime(5.772412563661337,-0.06570206646187725,0,0,0, 1000);
        end = new Date().getTime();
        var time = end - start;
        if(time<60000){
            RT_RecordTiming("Load", time, "ThinkSystem TD350 demo");
        }
        console.log('End time: ' + time);
        callbackChain();
        setTimeout(function() {
						showScene();
						$("#reset").css("visibility", "visible");
						$("#transPatch2").css("display", "none");
						$("#loader,#loader1,#loader2,#transPatch").css("display", "none"); 
						$("#canvasContainer").css("visibility", "visible");
						$("#superblazeWrapper", window.parent.document).css('display', 'block');
						$("#superblaze").css('display', 'block');
                    $("#pointtext1 div, #pointtext1 ul").css("display", "none");
//            			$("#transPatch5").css('display', 'block');
                        
                        
                            
                                               

     

            
                        
						if ((navigator.userAgent.indexOf('iPad') != -1) || (navigator.userAgent.indexOf('MSIE')!==-1 || navigator.appVersion.indexOf('Trident/') > 0)) {
						//console.log("ie")
							$("#fullScreen").css('display', 'none');
                            $("#loader,#loader1,#loader2,#transPatch").css("display", "none"); 
						} else {
								$("#fullScreen").css('display', 'block');
						}
        }, 500);

    UiLoader();
}


function UiLoader(){
    // console.log("UI Loaded..")
    var newStyle = document.createElement('style');
    newStyle.appendChild(document.createTextNode("\
    @font-face {\
    font-family: 'Gotham-Book';\
    src: url('css/fonts/gotham_book/Gotham-Book.eot.eot');\
    src: url('css/fonts/gotham_book/Gotham-Book.eot') format('embedded-opentype'),\
         url('css/fonts/gotham_book/Gotham-Book.woff') format('woff'),\
         url('css/fonts/gotham_book/Gotham-Book.woff2') format('woff2'),\
         url('css/fonts/gotham_book/Gotham-Book.ttf') format('truetype'),\
         url('css/fonts/gotham_book/Gotham-Book.svg#MyriadProLight') format('svg');\
    }\
    "));

	document.head.appendChild(newStyle);
	
    // $(".for-ford img").attr("src", "images_gl/Ford_Logo.png");
	//$(".productName img").attr("src", "./images_gl/ThinkSystem_Logo.svg");
    $("#hamb img").attr("src", "./images_gl/hamburger.png");
	$("#resetBtn img").attr("src", "./images_gl/reset.svg");
	$("#lenovo_logo img").attr("src", "./images_gl/Lenovo.svg");
	$("#fullScreen img").attr("src", "./images_gl/Fullscreen_01.png");
    $("#rightAnim img").attr("src", "./images_gl/right_popup.svg");   
	
	
	$("#pauseplayImg img").attr("src", "./images_gl/Play.svg");
    $("#fullScreenOff img").attr("src", "./images_gl/white_close.png");
   
	
	 var img = new Image();
//    img.src ="./images_gl/brown_up.png";
    img.onload = function(){
        // $(".overlayPopupDivfooter, .overlayPopupDivright").css("display","none");
    }
}

function SuperblazeStart(gl) {
    try {
        parent.document;
        resizePage(window.parent.document.documentElement.clientWidth, window.parent.document.documentElement.clientHeight);
        $(window.parent).resize(function() {
            resizePage(window.parent.document.documentElement.clientWidth, window.parent.document.documentElement.clientHeight);

        });
       
    } catch (e) {
        resizePage(document.documentElement.clientWidth, document.documentElement.clientHeight);
        $(window).resize(function() {
            resizePage(document.documentElement.clientWidth, document.documentElement.clientHeight);

        });
        
    }
    canvas = document.getElementById("superblaze-canvas");
    var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

    if ((navigator.userAgent.indexOf("iPhone") != -1) || ((navigator.userAgent.indexOf("Android") != -1) || (navigator.userAgent.indexOf("Mobile") != -1)) || (navigator.userAgent.indexOf('iPod') != -1)) {
        
        scene = new infinityrt_scene(gl, "model_gl/", canvas.width, canvas.height);
        //console.log("mob");
    } else {

        scene = new infinityrt_scene(gl, "model_gl/", canvas.width, canvas.height);
        //console.log("desk");
    }
     scene.fnLoadProgress = updateProgressBar;
    scene.start();
    scene._nav = new infinityrt_navigation(scene, canvas.width, canvas.height);
    _scenePollInterval = setInterval("isSuperblazeReady()", 100);
     start = new Date().getTime();
//    NavInit(canvas.width, canvas.height);
    var canvasDummy = document.getElementById("dummy-canvas");
    addMouseListeners(canvasDummy);
   /* scene._slowinoutfac = 0.9;*/
    if (scene != null) {

    
        window.requestAnimationFrame(frameUpdate);
        $(this).bind("contextmenu", onRightClick); //prevents a right click     
        document.body.oncontextmenu = onRightClick;
        //window.addEventListener('oncontextmenu',onRightClick,false);
        //if (typeof(onInit()) != 'undefined') onInit();
    }
    initDragCursor();
}
var mob = (navigator.userAgent.indexOf("iPhone") != -1) || ((navigator.userAgent.indexOf("Android") != -1) || (navigator.userAgent.indexOf("Mobile") != -1)) || (navigator.userAgent.indexOf('iPod') != -1);

var FullscreenOff = false;

function launchFullscreen(element) {
    window.parent.fullScreen=true;
    resizePage(window.parent.document.documentElement.clientWidth,window.parent.document.documentElement.clientHeight);
    if(navigator.userAgent.indexOf('MSIE')!==-1 || navigator.appVersion.indexOf('Trident/') > 0){
        //console.log("IE 11");
        $("#fullScreenOff").css('display','none'); 
        $("#fullScreen").css('display','none');
        
    }else{
      //  console.log("Not IE 11");
        $("#fullScreenOff").css('display','block'); 
        $("#fullScreen").css('display','none');
    }
    
   // console.log(" full screen ");
    if(element.requestFullscreen) {
        element.requestFullscreen();
    } else if(element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if(element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if(element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
       //setTimeout(function(){resizePage(window.parent.document.documentElement.clientWidth,window.parent.document.documentElement.clientHeight);;}, 2000);
}

function exitFullscreen() {
   // console.log("Exit full screen");
    window.parent.fullScreen=false;
    $("#fullScreenOff").css('display','none'); 
    $("#fullScreen").css('display','block');  
    if (window.parent.document.exitFullscreen) {
        window.parent.document.exitFullscreen();
    } else if (window.parent.document.mozCancelFullScreen) {
        window.parent.document.mozCancelFullScreen();
    } else if (window.parent.document.webkitExitFullscreen) {
        window.parent.document.webkitExitFullscreen();
    }
    setTimeout(function() {
        resizePage(window.parent.document.documentElement.clientWidth, window.parent.document.documentElement.clientHeight);
    }, 40);

}

window.document.onkeyup = function (e){
   // console.log("ECS pressed IE1");
    if (e.keyCode == 27) { // escape key maps to keycode `27`
        // if(navigator.userAgent.indexOf('MSIE')!==-1 || navigator.appVersion.indexOf('Trident/') > 0){
        //    // console.log("ECS pressed IE");
        // }
       // console.log("ECS pressed"); 
        // exitFullscreen(window.parent.document.documentElement);
        var iE = 0;
        var _intervalEsc = setInterval(function () {
            if(iE < 5){
               // console.log("func"+iE);
                exitFullscreen(window.parent.document.documentElement);
                iE++;
            }else{
                clearInterval(_intervalEsc);
            }
        }, 10);
    }
}

var FullscreenOn = false;

function resizePage(width, height) { 
    if (scene != null) console.log(scene.fovy+" fov Y");
    // console.log("resize")
// alert("Resize page width: "+width+" height: "+height);
    if((navigator.userAgent.indexOf('iPad') != -1)){
        
        width=window.parent.document.documentElement.clientWidth;
        height=window.parent.document.documentElement.clientHeight;
       
    }
    
    if(mob){
            $("#fullScreen").css('display','none');
        }else if(navigator.userAgent.indexOf('MSIE')!==-1 || navigator.appVersion.indexOf('Trident/') > 0){
         // console.log("IE 11");
          $("#fullScreenOff").css('display','none'); 
          $("#fullScreen").css('display','none');
        }else{
            $("#fullScreenOff").css('display','none'); 
            $("#fullScreen").css('display','none');
        }
    
//    
       
      FullscreenOn=window.parent.fullScreen;
      //// console.log(" resize page flscreen "+width+" "+height);
        if(mob){
        jQuery("#dummy-canvas").detach().appendTo('#maincanvasContainer');
        jQuery("#superblaze-canvas").detach().appendTo('#canvasContainer');
        $("#superblaze-canvas").attr({
            width: '1024px',
            height: '512px'
        });
    }
    var s;
    if(FullscreenOn == true){
        if(navigator.userAgent.indexOf('MSIE')!==-1 || navigator.appVersion.indexOf('Trident/') > 0){
           // console.log("IE 11 FS on");
            $("#fullScreenOff").css('display','none'); 
            $("#fullScreen").css('display','none');
        }else{
           // console.log("Not IE 11");
            $("#fullScreenOff").css('display','block'); 
            $("#fullScreen").css('display','none');
        }
        // $("#fullScreenOff").css('display','block');
         // $("#fullScreen").css('display','none'); 
        if (width > 1920) {
            width = 1920;
        }
        if (height > 1080) {
            height = 1080;
        }
       
        
    }else{
        if(mob){
            $("#fullScreen").css('display','none');
        }else{
            
         $("#fullScreen").css('display','block');
         $("#fullScreenOff").css('display','none');
        } 

        if (width > 1286) {
            width = 1286;
        }
        if (height > 643) {
            height = 643;
        }
         
    }

    var w = eval(width / 1286);
    var h = eval(height / 643);

    if (w < h || (navigator.userAgent.indexOf('iPad') != -1)) {
       // console.log("Resize page2 width: "+width+" height: "+height);
          console.log(" width ...");
        s = w;
        sceneDivW=width;
        sceneDivH=960*width/1920;
        //if(s<0.815 || mob){
            $("#scenediv").css({'width':"1286px",'height':"643px"});
            $("#dummy-canvas").css({'width':"1286px",'height':"643px"});
        /*}else{
            $("#scenediv").css({'width':sceneDivW,'height':sceneDivH});
            $("#dummy-canvas").css({'width':sceneDivW,'height':sceneDivH});
        }*/
        var div = document.getElementById("scenediv");
        if (div.getBoundingClientRect) {
            var rect = div.getBoundingClientRect();
            new_w = rect.right - rect.left;
            new_h = rect.bottom - rect.top;
        }
        if((navigator.userAgent.indexOf('iPad') != -1)){
           // console.log("resizing ipad....."+mob);
            $('#superblaze').css({
                'margin-left': 0,
                'margin-top': 0
            });
            $('#canvasContainer').css({
                'margin-left': 0,
                'margin-top': 0
            });  
//            $("#menubar").removeClass("menuitems");
                        $("menuitems").hover(function(){
                    $(this).css("background-color", "yellow");
                    });
        }else if(mob){
           // console.log("resizing mob....."+mob);
            $('#superblaze').css({
                'margin-left': (($(window).width() - new_w) / 2),
                'margin-top': 0
            });
            $('#canvasContainer').css({
                'margin-left': (($(window).width() - new_w) / 2),
                'margin-top': 0
             });
        }else{
           // console.log("resizing else....."+mob);
            $('#superblaze').css({
                'margin-left': (($(window).width() - new_w) / 2),
                'margin-top': parseInt(window.innerHeight - new_h) / 2
            });
            $('#canvasContainer').css({
                'margin-left': (($(window).width() - new_w) / 2),
                'margin-top': parseInt(window.innerHeight - new_h) / 2
            });
        }
        
    } else {
        console.log("height 22...");
        s = h;
		sceneDivH=height;
		sceneDivW=1920*height/960;
		// if(s < 0.815 || mob){
            $("#scenediv").css({'width':"1286px",'height':"643px"});
            $("#dummy-canvas").css({'width':"1286px",'height':"643px"});
       /* }else{
            $("#scenediv").css({'width':sceneDivW,'height':sceneDivH});
            $("#dummy-canvas").css({'width':sceneDivW,'height':sceneDivH});
        }*/
		
        var div = document.getElementById("scenediv");
        if (div.getBoundingClientRect) {
            var rect = div.getBoundingClientRect();
            new_w = rect.right - rect.left;
            new_h = rect.bottom - rect.top;
        }
        if((navigator.userAgent.indexOf('iPad') != -1)){
           // console.log("resizing mob2....."+mob);
            $('#superblaze').css({
                'margin-left': 0,
                'margin-top': 0
            });
            $('#canvasContainer').css({
                'margin-left': 0,
                'margin-top': 0
            });
        }else{
           // console.log("resizing else2....."+mob);
            $('#superblaze').css({
                'margin-left': (($(window).width() - new_w) / 2),
                'margin-top': parseInt(window.innerHeight - new_h) / 2
            });
            $('#canvasContainer').css({
                'margin-left': (($(window).width() - new_w) / 2),
                'margin-top': parseInt(window.innerHeight - new_h) / 2
            });
        }
    }
//    if((navigator.userAgent.indexOf("iPhone") != -1) || ((navigator.userAgent.indexOf("Android") != -1) && (navigator.userAgent.indexOf("Mobile") != -1)) 
//    || (navigator.userAgent.indexOf('iPod') != -1)){
//        $("#close").css("display","block");
//    }else{
//      $("#close").css("display","done");
//    }
       if(mob){
            $("#close").css("display","none");
        }else{
            $("#zoomSliderContainer").css("display","block");
        }

        //// console.log("else ...");
        $("#superblaze").css({
            'transform': 'scale(' + s + ')',
            'transform-origin': '0% 0%',
            '-webkit-transform': 'scale(' + s + ')',
            '-webkit-transform-origin': '0% 0%',
            '-moz-transform': 'scale(' + s + ')',
            '-moz-transform-origin': '0% 0%',
            '-o-transform': 'scale(' + s + ')',
            '-o-transform-origin': '0% 0%',
            '-ms-transform': 'scale(' + s + ')',
            '-ms-transform-origin': '0% 0%',
        });
       
        
   
   
   if(FullscreenOn==true){
        var curH= $("#scenediv").css("height").replace("px","");
        var addAmt=height/s -curH;
        var scenedivH=parseInt(curH)+addAmt;
        $("#scenediv").css({
                height: scenedivH+'px'
            });
       
       
       // var ccs = 1;
        $('#canvasContainer').css({
                'margin-left': 0,
                'margin-top': 0
             });
        $('#superblaze').css({
                'margin-left':0,
                'margin-top': 0
            });
       
       var ccs = s / 1.493001;
        
    }else{
       var ccs = s / 1.493001;
    }
    if (mob) {
        ccs = s/0.79626;
    }
    $("#canvasContainer").css({
        'transform': 'scale(' + ccs + ')',
        'transform-origin': '0% 0%',

        '-webkit-transform': 'scale(' + ccs + ')',
        '-webkit-transform-origin': '0% 0%',

        '-moz-transform': 'scale(' + ccs + ')',
        '-moz-transform-origin': '0% 0%',

        '-o-transform': 'scale(' + ccs + ')',
        '-o-transform-origin': '0% 0%',

        '-ms-transform': 'scale(' + ccs + ')',
        '-ms-transform-origin': '0% 0%',
    });
    
    if(FullscreenOn==true){
        var curHcanvas= $("#superblaze-canvas").attr("height").replace("px","");
        console.log(curHcanvas+" curHcanvas "+height+" height "+ccs+" s");
        var addAmtcanvas=height/ccs -curHcanvas;
        console.log(addAmtcanvas+" addAmtcanvas ");
        var canvasH=parseInt(curHcanvas)+addAmtcanvas;
        console.log(canvasH+" canvasH ");
        $("#superblaze-canvas").attr({
                height: canvasH+'px'
            });
    
        //curHcanvas= $("#superblaze-canvas").attr("height").replace("px","");
              
        if (scene != null){
            console.log(scene.fovy+" fov Y before");
        origFov=scene.fovy;
         
        origYsize=curHcanvas; // what window height is now
        newYsize=canvasH; // new window height
    

        origFov/=180.0/3.14159265358; // degrees to radians                     
        var tanfov=Math.tan(origFov*0.5);
                          
        tanfov*=(newYsize/origYsize);
                            
        var newFov=2.0*Math.atan(tanfov);        
        newFov*=180.0/3.14159265358; // radians to degrees
        scene.fovy=newFov;
        console.log(scene.fovy+" fov Y after "+origYsize+" "+newYsize);
                          }
        if (scene != null) {
		        //scene._nav = new infinityrt_navigation(scene, width, height);
		        scene.resize(1920, 1080);
		    } 
        
    }else{
            
            var curHcanvas= $("#superblaze-canvas").attr("height").replace("px","");
            $("#superblaze-canvas").attr({
                height: '960px'
            });
     
    
         
              
        if (scene != null){
            console.log(scene.fovy+" fov Y before");
        origFov=scene.fovy;
         
        origYsize=curHcanvas; // what window height is now
        newYsize=960; // new window height
   

        origFov/=180.0/3.14159265358; // degrees to radians                     
        var tanfov=Math.tan(origFov*0.5);
                          
        tanfov*=(newYsize/origYsize);
                            
        var newFov=2.0*Math.atan(tanfov);        
        newFov*=180.0/3.14159265358; // radians to degrees
        scene.fovy=newFov;
        console.log(scene.fovy+" fov Y after");
                          }
        if (scene != null) {
		        //scene._nav = new infinityrt_navigation(scene, width, height);
		        scene.resize(1920, 960);
		    } 
    }
       
}


function addMouseListeners(canvas) {
    canvas.addEventListener('mousemove', mouseMove, false);
    canvas.addEventListener('mousedown', mouseDown, false);
    canvas.addEventListener('mouseup', mouseUp, false);
    canvas.addEventListener('mousewheel', mouseWheel, false);
    canvas.addEventListener('DOMMouseScroll', mouseWheel, false);
    canvas.addEventListener('mouseout', mouseOut, false);
    canvas.addEventListener('touchstart', touchStart, false);
    canvas.addEventListener('touchmove', touchMove, false);
    canvas.addEventListener('touchend', touchEndCan, false);
    document.getElementById('rightAnim').addEventListener('mousedown', rightAnimClick, false);
    document.getElementById('reset').addEventListener('mousedown', onReset, false);
    document.getElementById("reset").addEventListener("mouseover", mouseOverBtnDrag, false);
    document.getElementById('reset').addEventListener('mouseout', mouseOutBtnDrag, false);
}


var rightAnimToggle = true;

function rightAnimClick(){
	reversAll();
  if(rightAnimToggle){
			$("#rightAnim").animate({right: '0px'}, "slow");
			rightAnimToggle = false;
	}else{
			$("#rightAnim").animate({right: '-235px'}, "slow");
			rightAnimToggle = true;
	}
}

function menu2Click(){
    animStoped = false;
    for (var j = 1; j <= 10; j++) {translateOut(j);}
     console.log("menu2Click", animStoped);
//                   if(!animStoped) return;
                    
	    objectHide();
        animComplete();
        $("#pointtext1").css("display","block");
            $("#overviewImg_01").css("display","block");

    
    $("#Cp_text_01").slideDown("slow", function() {
        $("#overviewImg_02").slideDown("slow", function() {
            $("#Cp_text_10").slideDown("slow");
            $("#Cp_text_11").slideDown("slow");
            $("#Cp_text_12").slideDown("slow");

            $("#overviewImg_03").slideDown("slow", function() {
                $("#Cp_text_03").slideDown("slow", function() {
                    $("#Cp_text_05").slideDown("slow", function() {
                        $("#Cp_text_02").slideDown("slow", function() {

                            $("#Cp_text_02+.Cp_textul").slideDown("slow", function() {
                                $("#Cp_text_06").slideDown("slow", function() {
                                    $("#overviewImg_04").slideDown("slow");
                                    $("#networkSet").slideDown("slow");
                                    $("#networkSet div").slideDown("slow", function() {
                                        $("#Cp_text_04").slideDown("slow");
                                    });

                                });
                            });
                        });
                    });
                });
            });

        });

    });
       

        scene.instanceSet("TD350", "visible", false);
        scene.instanceSet("gp_plane", "visible", false);
            
    		if(autoplayAnim){
                animCompeteAuto();
            }else{
                autoPauseAllAnimations();
            }
		
}

function menu3Click(){
     console.log("menu3Click" , animStoped);
//                       if(!animStoped) return;
	animStoped = false;
	menu5wasClick=false;
	objectHide();
    animComplete();
    $("#point2text").css("display","block");
//for (var j = 1; j <= 10; j++) {translateOut(j);}
//    translateIn(2);
    
        scene.instanceSet("TD350", "visible", true);
        scene.instanceSet("gp_plane", "visible", true);
    	
    
           if(autoplayAnim){
                animCompeteAuto();
            }else{
                autoPauseAllAnimations();
            }
    	
}

function menu4Click(){
//                      if(!animStoped) return;
                    animStoped = false;
       console.log("menu4Click" , animStoped);
       objectHide();
//    isExpanded1 = true;
      for (var j = 1; j <= 10; j++) {translateOut(j);}
	$("#pointtext3").css("display","block");
        scene.instanceSet("TD350", "visible", false);
        scene.instanceSet("gp_plane", "visible", false);
        
         translateIn(3);
    animComplete();
            if(autoplayAnim){
                animCompeteAuto();
            }else{
                autoPauseAllAnimations();
            }
       
   
}

function menu5Click(){
//                       if(!animStoped) return;
	  animStoped = false;
        objectHide();
        scene.instanceSet("TD350", "visible", true);
        scene.instanceSet("gp_plane", "visible", true);
        reversehdd();
        reverseFrontCap();
        reverseServerCover();
        _OpenCloseOn = false;
        //$("#openCloseDiv").css('backgroundColor', 'transparent');//$("#openCloseDiv").css('color', '#EC3729');
      /*  $("#menu12 .menuText").html(btnOpen);*/
         scene.animPlayInTime("Heat_sink_1", 0, 0);
        scene.gotoPosInTime(4.062873000000002,0.0698542,-16.582416000388683,5.064970026628572,-49.382153864675836, 1200, function(){
			 $("#point4text").css('display','block');
            setTimeout(function() {
                translateIn(4);
            }, 500);
            scene.animPlayInTime("Smps_a", 1, 2000);
            scene.animPlayInTime("Smps_b", 1, 2000,function(){
                animComplete();
            });
            if(autoplayAnim){
                animCompeteAuto();
            }else{
                autoPauseAllAnimations();
            }
        });
}

function menu6Click(){
//                       if(!animStoped) return;
                    animStoped = false;
    
    console.log("menu6Click");
     objectHide();
    for (var j = 1; j <= 10; j++) {translateOut(j);}
 
        scene.instanceSet("TD350", "visible", true);
        scene.instanceSet("gp_plane", "visible", true);
        reversehdd();
        reverseFrontCap();
        reverseServerCover();
        _OpenCloseOn = false;
        //$("#openCloseDiv").css('backgroundColor', 'transparent');//$("#openCloseDiv").css('color', '#EC3729');
       /* $("#menu12 .menuText").html(btnOpen);*/
        smpsAndProcessors();
        scene.gotoPosInTime(2.966212482579988,-0.00942477796076938,7.2917366665724455,5.36746810873262,-38.66974678052785, 1200, function(){
			$("#point5text").css('display','block');
            setTimeout(function() {
                translateIn(5);
                animComplete();
            }, 500);
            if(autoplayAnim){
                animCompeteAuto();
            }else{
                autoPauseAllAnimations();
            }
    });
}

var _OpenCloseOn = false;
function menu7Click(){
    console.log("menu7Click");
	animStoped = false;
    objectHide();
    for (var j = 1; j <= 10; j++) {translateOut(j);}
     
   
        scene.decodeDeferredGeometry('FANS');
        scene.decodeDeferredGeometry('fan_bracket');
        scene.decodeDeferredGeometry('DVD_rom');
        scene.decodeDeferredGeometry('Board_2');
        scene.decodeDeferredGeometry('clips');
        scene.decodeDeferredGeometry('HDD_group');
        scene.decodeDeferredGeometry('dvd_chassy');
        scene.decodeDeferredGeometry('Mother_Board');
        scene.instanceSet("TD350", "visible", true);
        scene.instanceSet("gp_plane", "visible", true);
        if(_OpenCloseOn){
            scene.instanceSet("Left_side_cover", "visible", false);
        }
        reversehdd();
        reverseFrontCap();
        smpsAndProcessors();
        //$("#openCloseDiv").css('backgroundColor', '#EC3729');//$("#openCloseDiv").css('color', '#fff');
        /*$("#menu12 .menuText").html(btnClose);*/
        scene.gotoPosInTime(4.4200004119992045,0.013975222039230618,-8.040153807553098,3.225008391737051,18.984949880490213, 1200, function(){
			
            if(_OpenCloseOn){
                console.log("yes")
				$("#pointtext6").fadeIn(300);
                _OpenCloseOn = true;
                setTimeout(function() {
                translateIn(6);
            	}, 100);
				setTimeout(function() {
	    			animComplete();
	    		}, 300);
               
					
              
            }else {
				
                scene.animPlayInTime("Left_side_cover",1, 500, function(){
					$("#pointtext6").fadeIn(300);
                _OpenCloseOn = true;
                scene.instanceSet("Left_side_cover", "visible", false);
                setTimeout(function() {
                    translateIn(6);
                }, 100);
               	setTimeout(function() {
	    			animComplete();
	    		}, 300);
               
                 
               
                    });
            }
            
            if(autoplayAnim){
                animCompeteAuto();
            }else{
                autoPauseAllAnimations();
            }
        });
   
}

var menu5wasClick=false;
function menu8Click() {
	  animStoped = false;
    objectHide();
        $("#point7text").css('display','block');
        scene.decodeDeferredGeometry('FANS');
        scene.decodeDeferredGeometry('fan_bracket');
        scene.decodeDeferredGeometry('DVD_rom');
        scene.decodeDeferredGeometry('Board_2');
        scene.decodeDeferredGeometry('clips');
        scene.decodeDeferredGeometry('HDD_group');
        scene.decodeDeferredGeometry('dvd_chassy');
        scene.decodeDeferredGeometry('Mother_Board');
        scene.instanceSet("TD350", "visible", true);
        scene.instanceSet("gp_plane", "visible", true);
        if(_OpenCloseOn){
            scene.instanceSet("Left_side_cover", "visible", false);
        }
        reversehdd();
        reverseFrontCap();
      scene.animPlayInTime("Smps_a", 0, 0);
    		scene.animPlayInTime("Smps_b", 0, 0);
        scene.gotoPosInTime(4.900000000000012,0,-16.90969773464903,1.5513821612344278,-58.09458899765537, 1200, function(){
            console.log("_OpenCloseOn", _OpenCloseOn);
            setTimeout(function() {
                translateIn(7);
            }, 500);
            if(_OpenCloseOn){
                _OpenCloseOn = true;
                scene.animPlayInTime("Heat_sink_1", 1, 2000, function() {
                    scene.instanceSet("Heat_sink_1", "visible", false);
                    animComplete();
                });
            }else {
                   scene.animPlayInTime("Left_side_cover",1, 500, function(){
                    _OpenCloseOn = true;
                    scene.instanceSet("Left_side_cover", "visible", false);
                    scene.animPlayInTime("Heat_sink_1", 1, 2000, function() {
                        scene.instanceSet("Heat_sink_1", "visible", false);
                        animComplete();
                        });
                    });
            }
            if(autoplayAnim){
                animCompeteAuto();
            }else{
                autoPauseAllAnimations();
            }
        });
            // RT_RecordEvent("Hotspot", "HIGH PERFORMANCE INTEL XEON PROCESSORS", "Lenovo ThinkServer TD350");
    }
var _OpenCloseOn = false;
function menu9Click() {
	  animStoped = false;
	    objectHide();
        $("#point8text").css('display','block');
        scene.decodeDeferredGeometry('FANS');
        scene.decodeDeferredGeometry('fan_bracket');
        scene.decodeDeferredGeometry('DVD_rom');
        scene.decodeDeferredGeometry('Board_2');
        scene.decodeDeferredGeometry('clips');
        scene.decodeDeferredGeometry('HDD_group');
        scene.decodeDeferredGeometry('dvd_chassy');
        scene.decodeDeferredGeometry('Mother_Board');
        scene.instanceSet("TD350", "visible", true);
        scene.instanceSet("gp_plane", "visible", true);
        if(_OpenCloseOn){
            scene.instanceSet("Left_side_cover", "visible", false);
        }
        reversehdd();
        reverseFrontCap();
//        scene.animPlayInTime("Heat_sink_1", 0, 0);
        smpsAndProcessors();
        scene.gotoPosInTime(5.427184441546818,0.58296752053923,-16.942948085619644,3.2183933738961765,-26.140146258345645, 1200, function(){
            
            
            
            if(_OpenCloseOn){
				setTimeout(function() {
                translateIn(8);
				animComplete();
                }, 500);
                _OpenCloseOn = true;
                 
            }else {
                    scene.animPlayInTime("Left_side_cover",1, 500, function(){
                    _OpenCloseOn = true;
                    scene.instanceSet("Heat_sink_1", "visible", true);
                    scene.instanceSet("Left_side_cover", "visible", false);
					setTimeout(function() {
						translateIn(8);
						animComplete();
                	}, 500);	
                });
            }
           
            if(autoplayAnim){
                animCompeteAuto();
            }else{
                autoPauseAllAnimations();
            }
        });

    }

 function menu10Click() {
	   animStoped = false;
        objectHide();
        $("#point9text").css('display','block');
        scene.decodeDeferredGeometry('FANS');
        scene.decodeDeferredGeometry('fan_bracket');
        scene.decodeDeferredGeometry('DVD_rom');
        scene.decodeDeferredGeometry('Board_2');
        scene.decodeDeferredGeometry('clips');
        scene.decodeDeferredGeometry('HDD_group');
        scene.decodeDeferredGeometry('dvd_chassy');
        scene.decodeDeferredGeometry('Mother_Board');
        scene.instanceSet("TD350", "visible", true);
        scene.instanceSet("gp_plane", "visible", true);
        if(_OpenCloseOn){
            scene.instanceSet("Left_side_cover", "visible", false);
        }
                reversehdd();
                reverseFrontCap();
      scene.animPlayInTime("Heat_sink_1", 0, 0);
                    scene.gotoPosInTime(4.4299999999999935,-0.00942477796076938,12.592228790141856,-0.28399313299999995,-21.730000000000018, 1200, function(){
                        
                        if(_OpenCloseOn){
							setTimeout(function() {
                            translateIn(9);
								 animComplete();
                        }, 500);
                        _OpenCloseOn = true;
                       
                    }else {
                        scene.animPlayInTime("Left_side_cover",1, 500, function(){
                            _OpenCloseOn = true;
                            scene.instanceSet("Left_side_cover", "visible", false);
                            setTimeout(function() {
                            translateIn(9);
								 animComplete();
                        	}, 500);
                            });
                        }
                    if(autoplayAnim){   
                        animCompeteAuto();
                    }else{
                        autoPauseAllAnimations();
                    }
                 });
            // RT_RecordEvent("Hotspot", "AnyRAID Controller", "Lenovo ThinkServer TD350");
             }

var menu11wasclicked=false;

 function menu11Click() {
     console.log("clicked 11");
	   animStoped = false;
        $("#point10text").css('display','block');
        _OpenCloseOn = false;
        objectHide();
	    menu11wasclicked=true;
     	changeColour("close");
        changeColour1("homeScreen");
        scene.instanceSet("Left_side_cover", "visible", true);
        scene.animPlayInTime("Left_side_cover", 0, 0);
        scene.instanceSet("TD350", "visible", false);
        scene.instanceSet("gp_plane", "visible", false);
//     setTimeout(function(){
//         console.log("hide");
//         scene.instanceSet("TD350", "visible", false);
//        scene.instanceSet("gp_plane", "visible", false);
//     },3000)
        $('#transPatch').css({'display':'block','opacity':'0'});
        $('#transPatch').css('z-index', 1005);
         setTimeout(function() {
            translateIn(10);
        }, 100);
        $("#pont10Img1").fadeIn(500);
        setTimeout(function(){
            $("#pont10Img1").fadeOut();
            $("#pont10Img2").fadeIn(500);
        },5000);
        setTimeout(function(){
            $("#pont10Img2").fadeOut();
            $("#pont10Img3").fadeIn(500);
			 animComplete();
			if(autoplayAnim){ 
					   animCompeteAuto();
                }else{
                autoPauseAllAnimations();
                }
        },10000);
	   
	 /*	setTimeout(function(){
			animComplete();
        },5000);*/
                
            // RT_RecordEvent("Hotspot", "Lenovo XClarity", "Lenovo ThinkServer TD350");
    }

// Autp Play function

function autoPlayAllAnimations(){
	if(!animStoped || !clickEventActive)return;
$(".menuitems").removeClass('active');
	
        autoplayAnim = true;
            for (var j = 1; j <= 10; j++) {translateOut(j);}
        $("#autoPlays").removeClass('playAll').off('click.playAll').addClass("pauseAll");
        $("#autoPlays .menuText").html("Stop");
        $("#pauseplayImg").css("display","none");
        $("#pauseplayImg2").css("display","block");
        $("#pauseplayImg2 img").attr("src" ,"./images_gl/Pause.svg").css("height","13px");

        objectHide();
        reversAll();
//        tooltipCheckbtn();
        if(currneAnim< 11){
            currneAnim++;
            
            AutoPlayMenus(currneAnim);
        }else{
            currneAnim = 2;
            AutoPlayMenus(currneAnim); 
        }
    //console.log("play", currneAnim);
}


function autoPauseAllAnimations(){
    //console.log("pause");
    $("#autoPlays").removeClass('pauseAll').off('click.pauseAll').addClass("playAll");
    $("#autoPlays .menuText").html("Play All");
    $("#pauseplayImg2").css("display","none");
    $("#pauseplayImg").css("display","block");
    $("#pauseplayImg img").attr("src" ,"./images_gl/Play.svg").css("height","14px");
        $(".menuitems").css("background-color","").css("opacity","");;
     if(autoplayAnim){
                 setTimeout(function(){
            $("#menu"+currneAnim).addClass("active").css("background-color","#eb140a").css("opacity","1");
                    autoplayAnim = false;
                },50);

        }
        clearTimeout(autoPlayInt);
     // autoplayAnim = false;
//    animStoped = true;

}
var autoPlayInt
function animCompeteAuto(){
 autoPlayInt =    setTimeout(function(){           
          autoPlayAllAnimations();
        }, 8000);
}
function AutoPlayMenus(currneAnim){
    
    $(".menuitems").css("background-color","").css("opacity","");
    
    $("#menu"+currneAnim).css("background-color","#eb140a").css("opacity","1");
    						objectHide();
								       reversAll();
                    for (var j = 1; j <= 10; j++) {translateOut(j);}
     switch ("menu"+currneAnim) {
                            case "menu2":
                                menu2Click();
                                break;
                            case "menu3":
                                menu3Click();
                                break;
                            case "menu4":
                                menu4Click();
                                break;
                            case "menu5":
                                menu5Click();
                                break;
                            case "menu6":
                                menu6Click();
                                break;
                            case "menu7":
                                menu7Click();
                                break;
                            case "menu8":
                                menu8Click();
                                break;
                            case "menu9":
                                menu9Click();
                                break;
                            case "menu10":
                                menu10Click();
                                break;
                            case "menu11":
                                menu11Click();
                                break;
            }
}

function animComplete() {
    autoRotateState = true;
    animStoped = true;
    scene._navEnabled = true;
}

function reversAll(){
	clearInt();
	$("#Menu2text").css("display","none");
	$("#adhoc_meet_img").css("display","none");
	$("#schedule_meet_div").css("display","none");
}



function objectHide(){
//	changeColour("close");
//    changeColour1("homeScreen");
//    

	menu11wasclicked=false;
	        $("#firstSlideheadWrapper").css("display","none");
        $("#firstSlideWrapper").css("display","none");
    $("#pointtext1 div, #pointtext1 ul").css("display", "none");
	$("#pont10Img3").css('display','none');
	$("#pont10Img2").css('display','none');
	$("#pont10Img1").css('display','none');
	$("#pointtext1").css('display','none');
    $("#point2text").css('display','none');
	$("#pointtext3").css('display','none');
	$("#point4text").css('display','none');
	$("#point5text").css('display','none');
	$("#pointtext6").css('display','none');
    $("#point7text").css('display','none');
    $("#point8text").css('display','none');
    $("#point9text").css('display','none');
	
}


var imgInterval;

function waterAnimation(){
	$("#imageContainerimg").css("display","block");
   // console.log("image should change");
				counter=0;
				repeatCount=0;
				imgInterval=setInterval(function(){
//           console.log("counter "+counter);
					counter++; 
					$("#imageContainerimg").attr('src','images_gl/ring_animation/'+counter+'.png');
						if(counter==5){
								counter=0;
								repeatCount++;      
//							console.log("repeatCount "+repeatCount);
						}
				},100);
}

function clearInt() {
   clearInterval(imgInterval);
	// $("#imageContainerimg").attr('src','');
	$("#imageContainerimg").attr('src','images_gl/ring_animation/1.png');
	$("#imageContainerimg").css("display","none");
}

function close_window(){
   window.parent.close();
}

document.onselectstart = function() {
    return false;
};

var btnDrag = false;

function mouseOverBtnDrag() {
    btnDrag = true;
}

function mouseOutBtnDrag() {
    setTimeout(function() {
        btnDrag = false;
    }, 100);
}

var updateId = 0;

function onRightClick(event) {
    ////console.log("press right");
    //mdown = true;
    //panNav = true;
    return false; //surpress theright menu 
}
function onWindowFocus() {
    updateEnabled = true;
}

function onWindowBlur() {
    updateEnabled = false;
}

function debounce(func, wait, immediate, ev) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

function frameUpdate () {
   window.requestAnimationFrame(frameUpdate);
   if (scene._refineCount < 64) frameUpdateForScene(scene);
// console.log(scene._nav._navYAng+","+scene._nav._navXAng+","+scene._nav._navPan[0]+","+scene._nav._navPan[1]+","+scene._nav._navDolly);
//   
//     if (yPos < yEnd && mdown != true && yStarted) {
//					autoRotateState = true;
//					if (yPos > yEnd - 2) yPos = 0;
//						if(new_R){
//							autoRotateStop();
//						}else{
//							autoRotateRequest();
//						}
//     }else yStarted = false;
	
//		 if(rotating[0] != 0 || rotating[1] != 0){
//				if (rSpeed < 0){
//					rSpeed = 0;
//					rAcc = rAccelaration;
//					rotating = [0,0];
//				}
//				rSpeed = (rSpeed < rMaxSpeed || rAcc< 0) ? rSpeed+rAcc : rSpeed;
//				console.log(rSpeed);
//				scene._nav.NavRotation([0,0], [rotating[0]*rSpeed, rotating[1]*rSpeed]);
				//scene.clearRefine();
}

function frameUpdateForScene(scene) {
    var bgotoPosInTimeUpdate = scene._nav._navgotoPosInTimeActive;
    sceneViewMatrix = scene._nav.NavCreateViewMatrix(scene._initialNavMatrix);
    scene.setViewMatrix(sceneViewMatrix);
    scene.setModelMatrix(scene._nav.NavCreateModelMatrix(scene._initialNavMatrix));
    drawn = scene.draw();
    if (bgotoPosInTimeUpdate)
    scene.clearRefine();
	if (drawn) hotspotPosAsignment();
}

function getScene(ev) {
		    var s = scene;
		    if (scene2 != null && ev.currentTarget == canvas2)
		        s = scene2;
		    return s;
}

var hotspotPoint = true;
var hotspotOn;
var clockWise=true;
var antiClockWise=false;

function hotspotPosAsignment() {
	   var viewCameraZV = [sceneViewMatrix[8], sceneViewMatrix[9], sceneViewMatrix[10]];
     var hotspotopacityspeed = 3.0;
	
     var pos2Dpoint1 = [];
     var norm3Dpoint1 = scene.getObjectNormal("hotspot_Shape1-0");
     var hotspotopacity1 = infinityrt_dp(norm3Dpoint1, viewCameraZV) * hotspotopacityspeed-1.5;
     if(hotspotopacity1>0 && (hotspotOn == true )) hotspotopacity1=0;
     if (hotspotopacity1 < 0.0) hotspotopacity1 = 0.0;
     else if (hotspotopacity1 > 1.0) hotspotopacity1 = 1.0;
     if(hotspotopacity1==0)$(".point1text2Hotspot", window.document).css('visibility','hidden');
     else $(".point1text2Hotspot", window.document).css('visibility','visible');
     pos2Dpoint1 = scene.projectPoint(scene.getObjectLocation("hotspot_Shape1-0", true));
	
	
	   var pos2Dpoint2 = [];
     var norm3Dpoint2 = scene.getObjectNormal("hotspot_Shape2-0");
     var hotspotopacity2 = infinityrt_dp(norm3Dpoint2, viewCameraZV) * hotspotopacityspeed-2.5;
     if(hotspotopacity2>0 && (hotspotOn == true )) hotspotopacity2=0;
     if (hotspotopacity2 < 0.0) hotspotopacity2 = 0.0;
     else if (hotspotopacity2 > 1.0) hotspotopacity2 = 1.0;
     if(hotspotopacity2==0)$(".point1text4Hotspot", window.document).css('visibility','hidden');
     else $(".point1text4Hotspot", window.document).css('visibility','visible');
     pos2Dpoint2 = scene.projectPoint(scene.getObjectLocation("hotspot_Shape2-0", true));
	
	  var pos2Dpoint3 = [];
     var norm3Dpoint3 = scene.getObjectNormal("hotspot_Shape3-0");
     var hotspotopacity3 = infinityrt_dp(norm3Dpoint3, viewCameraZV) * hotspotopacityspeed-2.8;
     if(hotspotopacity3>0 && (hotspotOn == true )) hotspotopacity3=0;
     if (hotspotopacity3 < 0.0) hotspotopacity3 = 0.0;
     else if (hotspotopacity3 > 1.0) hotspotopacity3 = 1.0;
     if(hotspotopacity3==0)$(".point3text1Hotspot", window.document).css('display','none');
     else $(".point3text1Hotspot", window.document).css('display','block');
     pos2Dpoint3 = scene.projectPoint(scene.getObjectLocation("hotspot_Shape3-0", true));
	
	   var pos2Dpoint4 = [];
     var norm3Dpoint4 = scene.getObjectNormal("hotspot_Shape4-0");
     var hotspotopacity4 = infinityrt_dp(norm3Dpoint4, viewCameraZV) * hotspotopacityspeed-2.8;
     if(hotspotopacity4>0 && (hotspotOn == true )) hotspotopacity4=0;
     if (hotspotopacity4 < 0.0) hotspotopacity4 = 0.0;
     else if (hotspotopacity4 > 1.0) hotspotopacity4 = 1.0;
     if(hotspotopacity4==0)$(".point3text3Hotspot", window.document).css('display','none');
     else $(".point3text3Hotspot", window.document).css('display','block');
     pos2Dpoint4 = scene.projectPoint(scene.getObjectLocation("hotspot_Shape4-0", true));
	
	  var pos2Dpoint5 = [];
     var norm3Dpoint5 = scene.getObjectNormal("hotspot_Shape10-0");
     var hotspotopacity5 = infinityrt_dp(norm3Dpoint5, viewCameraZV) * hotspotopacityspeed-2.8;
     if(hotspotopacity5>0 && (hotspotOn == true )) hotspotopacity5=0;
     if (hotspotopacity5 < 0.0) hotspotopacity5 = 0.0;
     else if (hotspotopacity5 > 1.0) hotspotopacity5 = 1.0;
     if(hotspotopacity5==0)$(".point3text8Hotspot", window.document).css('display','none');
     else $(".point3text8Hotspot", window.document).css('display','block');
     pos2Dpoint5 = scene.projectPoint(scene.getObjectLocation("hotspot_Shape10-0", true));
	
	   var pos2Dpoint6 = [];
     var norm3Dpoint6 = scene.getObjectNormal("hotspot_Shape6-0");
     var hotspotopacity6 = infinityrt_dp(norm3Dpoint6, viewCameraZV) * hotspotopacityspeed-2.9;
     if(hotspotopacity6>0 && (hotspotOn == true )) hotspotopacity6=0;
     if (hotspotopacity6 < 0.0) hotspotopacity6 = 0.0;
     else if (hotspotopacity6 > 1.0) hotspotopacity6 = 1.0;
     if(hotspotopacity6==0)$(".point3text2Hotspot", window.document).css('display','none');
     else $(".point3text2Hotspot", window.document).css('display','block');
     pos2Dpoint6 = scene.projectPoint(scene.getObjectLocation("hotspot_Shape6-0", true));
	
	   var pos2Dpoint7 = [];
     var norm3Dpoint7 = scene.getObjectNormal("hotspot_Shape7-0");
     var hotspotopacity7 = infinityrt_dp(norm3Dpoint7, viewCameraZV) * hotspotopacityspeed-2.9;
     if(hotspotopacity7>0 && (hotspotOn == true )) hotspotopacity7=0;
     if (hotspotopacity7 < 0.0) hotspotopacity7 = 0.0;
     else if (hotspotopacity7 > 1.0) hotspotopacity7 = 1.0;
     if(hotspotopacity7==0)$(".point3text5Hotspot", window.document).css('display','none');
     else $(".point3text5Hotspot", window.document).css('display','block');
     pos2Dpoint7 = scene.projectPoint(scene.getObjectLocation("hotspot_Shape7-0", true));
	
	   var pos2Dpoint8 = [];
     var norm3Dpoint8 = scene.getObjectNormal("hotspot_Shape8-0");
     var hotspotopacity8 = infinityrt_dp(norm3Dpoint8, viewCameraZV) * hotspotopacityspeed-2.8;
     if(hotspotopacity8>0 && (hotspotOn == true )) hotspotopacity8=0;
     if (hotspotopacity8 < 0.0) hotspotopacity8 = 0.0;
     else if (hotspotopacity8 > 1.0) hotspotopacity8 = 1.0;
     if(hotspotopacity8==0)$(".point3text6Hotspot", window.document).css('display','none');
     else $(".point3text6Hotspot", window.document).css('display','block');
     pos2Dpoint8 = scene.projectPoint(scene.getObjectLocation("hotspot_Shape8-0", true));
	
	   var pos2Dpoint9 = [];
     var norm3Dpoint9 = scene.getObjectNormal("hotspot_Shape9-0");
     var hotspotopacity9 = infinityrt_dp(norm3Dpoint9, viewCameraZV) * hotspotopacityspeed-2.8;
     if(hotspotopacity9>0 && (hotspotOn == true )) hotspotopacity9=0;
     if (hotspotopacity9 < 0.0) hotspotopacity9 = 0.0;
     else if (hotspotopacity9 > 1.0) hotspotopacity9 = 1.0;
     if(hotspotopacity9==0)$(".point3text7Hotspot", window.document).css('display','none');
     else $(".point3text7Hotspot", window.document).css('display','block');
     pos2Dpoint9 = scene.projectPoint(scene.getObjectLocation("hotspot_Shape9-0", true));
	
	   var pos2Dpoint10 = [];
     var norm3Dpoint10 = scene.getObjectNormal("hotspot_Shape5-0");
     var hotspotopacity10 = infinityrt_dp(norm3Dpoint10, viewCameraZV) * hotspotopacityspeed-2.8;
     if(hotspotopacity10>0 && (hotspotOn == true )) hotspotopacity10=0;
     if (hotspotopacity10 < 0.0) hotspotopacity10 = 0.0;
     else if (hotspotopacity10 > 1.0) hotspotopacity10 = 1.0;
     if(hotspotopacity10==0)$(".point3text4Hotspot", window.document).css('display','none');
     else $(".point3text4Hotspot", window.document).css('display','block');
     pos2Dpoint10 = scene.projectPoint(scene.getObjectLocation("hotspot_Shape5-0", true));
	
	   var pos2Dpoint11 = [];
     var norm3Dpoint11 = scene.getObjectNormal("hotspot_Shape11-0");
     var hotspotopacity11 = infinityrt_dp(norm3Dpoint11, viewCameraZV) * hotspotopacityspeed-2.5;
     if(hotspotopacity11>0 && (hotspotOn == true )) hotspotopacity11=0;
     if (hotspotopacity11 < 0.0) hotspotopacity11 = 0.0;
     else if (hotspotopacity11 > 1.0) hotspotopacity11 = 1.0;
     if(hotspotopacity11==0)$(".point6text1Hotspot", window.document).css('display','none');
     else $(".point6text1Hotspot", window.document).css('display','block');
     pos2Dpoint11 = scene.projectPoint(scene.getObjectLocation("hotspot_Shape11-0", true));
	
	   var pos2Dpoint12 = [];
     var norm3Dpoint12 = scene.getObjectNormal("hotspot_Shape12-0");
     var hotspotopacity12 = infinityrt_dp(norm3Dpoint12, viewCameraZV) * hotspotopacityspeed-2.5;
     if(hotspotopacity12>0 && (hotspotOn == true )) hotspotopacity12=0;
     if (hotspotopacity12 < 0.0) hotspotopacity12 = 0.0;
     else if (hotspotopacity12 > 1.0) hotspotopacity12 = 1.0;
     if(hotspotopacity12==0)$(".point6text2Hotspot", window.document).css('display','none');
     else $(".point6text2Hotspot", window.document).css('display','block');
     pos2Dpoint12 = scene.projectPoint(scene.getObjectLocation("hotspot_Shape12-0", true));
	
	   var pos2Dpoint13 = [];
     var norm3Dpoint13 = scene.getObjectNormal("hotspot_Shape13-0");
     var hotspotopacity13 = infinityrt_dp(norm3Dpoint13, viewCameraZV) * hotspotopacityspeed-2.5;
     if(hotspotopacity13>0 && (hotspotOn == true )) hotspotopacity13=0;
     if (hotspotopacity13 < 0.0) hotspotopacity13 = 0.0;
     else if (hotspotopacity13 > 1.0) hotspotopacity13 = 1.0;
     if(hotspotopacity13==0)$(".point6text4Hotspot", window.document).css('display','none');
     else $(".point6text4Hotspot", window.document).css('display','block');
     pos2Dpoint13 = scene.projectPoint(scene.getObjectLocation("hotspot_Shape13-0", true));
	
	   var pos2Dpoint14 = [];
     var norm3Dpoint14 = scene.getObjectNormal("hotspot_14Shape-0");
     var hotspotopacity14 = infinityrt_dp(norm3Dpoint14, viewCameraZV) * hotspotopacityspeed-2.5;
     if(hotspotopacity14>0 && (hotspotOn == true )) hotspotopacity14=0;
     if (hotspotopacity14 < 0.0) hotspotopacity14 = 0.0;
     else if (hotspotopacity14 > 1.0) hotspotopacity14 = 1.0;
     if(hotspotopacity14==0)$(".point6text3Hotspot", window.document).css('display','none');
     else $(".point6text3Hotspot", window.document).css('display','block');
     pos2Dpoint14 = scene.projectPoint(scene.getObjectLocation("hotspot_14Shape-0", true));
	
	  
	 
	   var leftPosPoint1 = (pos2Dpoint1[0] * 50) + 35;
	   var leftPosPoint2 = (pos2Dpoint2[0] * 50) + 45;
       var leftPosPoint3 = (pos2Dpoint3[0] * 50) + 49;
	   var leftPosPoint4 = (pos2Dpoint4[0] * 50) + 65;
	   var leftPosPoint5 = (pos2Dpoint5[0] * 50) + 51;
	   var leftPosPoint6 = (pos2Dpoint6[0] * 50) + 42;
	   var leftPosPoint7 = (pos2Dpoint7[0] * 50) + 25;
	   var leftPosPoint8 = (pos2Dpoint8[0] * 50) + 23;
	   var leftPosPoint9 = (pos2Dpoint9[0] * 50) + 13;
	   var leftPosPoint10 = (pos2Dpoint10[0] * 50) + 8.5;
	   var leftPosPoint11 = (pos2Dpoint11[0] * 50) + 47;
	   var leftPosPoint12 = (pos2Dpoint12[0] * 50) + 38;
	   var leftPosPoint13 = (pos2Dpoint13[0] * 50) + 51;
	   var leftPosPoint14 = (pos2Dpoint14[0] * 50) + 81;
	
	
	
	   var toptPosPoint1 = -((pos2Dpoint1[1] * 50) - 50);
	   var toptPosPoint2 = -((pos2Dpoint2[1] * 50) - 50);
	   var toptPosPoint3 = -((pos2Dpoint3[1] * 50) - 50);
	   var toptPosPoint4 = -((pos2Dpoint4[1] * 50) - 50);
	   var toptPosPoint5 = -((pos2Dpoint5[1] * 50) - 50);
	   var toptPosPoint6 = -((pos2Dpoint6[1] * 50) - 50);
	   var toptPosPoint7 = -((pos2Dpoint7[1] * 50) - 50);
	   var toptPosPoint8 = -((pos2Dpoint8[1] * 50) - 50);
	   var toptPosPoint9 = -((pos2Dpoint9[1] * 50) - 50);
	   var toptPosPoint10 = -((pos2Dpoint10[1] * 50) - 50);
	   var toptPosPoint11 = -((pos2Dpoint11[1] * 50) - 50);
	   var toptPosPoint12 = -((pos2Dpoint12[1] * 50) - 50);
	   var toptPosPoint13 = -((pos2Dpoint13[1] * 50) - 50);
	   var toptPosPoint14 = -((pos2Dpoint14[1] * 50) - 50);
	  // console.log(pos2Dpoint1[1]);
	
	   $(".point1text2Hotspot").css('left', leftPosPoint1 + '%').css('top', toptPosPoint1 + '%');
	   $(".point1text4Hotspot").css('left', leftPosPoint2 + '%').css('top', toptPosPoint2 + '%');
	   $(".point3text1Hotspot").css('left', leftPosPoint3 + '%').css('top', toptPosPoint3 + '%');
	   $(".point3text3Hotspot").css('left', leftPosPoint4 + '%').css('top', toptPosPoint4 + '%');
	   $(".point3text8Hotspot").css('left', leftPosPoint5 + '%').css('top', toptPosPoint5 + '%');
	   $(".point3text2Hotspot").css('left', leftPosPoint6 + '%').css('top', toptPosPoint6 + '%');
	   $(".point3text5Hotspot").css('left', leftPosPoint7 + '%').css('top', toptPosPoint7 + '%');
	   $(".point3text6Hotspot").css('left', leftPosPoint8 + '%').css('top', toptPosPoint8 + '%');
	   $(".point3text7Hotspot").css('left', leftPosPoint9 + '%').css('top', toptPosPoint9 + '%');
	   $(".point3text4Hotspot").css('left', leftPosPoint10 + '%').css('top', toptPosPoint10 + '%');
	   $(".point6text1Hotspot").css('left', leftPosPoint11 + '%').css('top', toptPosPoint11 + '%');
	   $(".point6text2Hotspot").css('left', leftPosPoint12 + '%').css('top', toptPosPoint12 + '%');
	   $(".point6text4Hotspot").css('left', leftPosPoint13 + '%').css('top', toptPosPoint13 + '%');
	   $(".point6text3Hotspot").css('left', leftPosPoint14 + '%').css('top', toptPosPoint14 + '%');
	
	   if(Math.floor(sceneViewMatrix[5])==0){
				clockWise=false;
	 	 }else if(Math.floor(sceneViewMatrix[5])==-1){
				clockWise=true;
		 }
}

var mpos = [0, 0];
var mdown = false;
var panNav = false;

function mouseDown(ev){
	if(menu11wasclicked==true){
		
	} 
	else{
		for (var j = 1; j <= 9; j++) {translateOut(j);}
	}
//            hideAll(); 
    if (!animStoped) return;
   
   
    
          autoPauseAllAnimations();
		    var s = getScene(ev);
            if (ev.which == 3) {
              panNav = true;
             }
		    var mouseDownPos = [ev.clientX - canvas.offsetLeft, ev.clientY - canvas.offsetTop];
		    if (!s.onClick(mouseDownPos, ev.button))
		    {
			    mdown = true;
			    mpos = mouseDownPos;
			}
			reversAll();
}

function mouseUp(ev) {
    mdown = false;
    if (ev.which == 3 || panNav) panNav = false;
    handOpen();
}

function mouseOut(ev) {
    mdown = false;
    if (ev.which == 3 || panNav) panNav = false;
    handOpen();
}

	function mouseMove(ev) {
//        for (var j = 1; j <= 10; j++) {translateOut(j);}
//         var clearInt =setInterval(function(){
////         console.log(clickEventActive);
//            if(clickEventActive){
//                $(".btn2").css('pointer-events','all');
//                clearInterval(clearInt);
//            }else{
//                $(".btn2").css('pointer-events','none');
//            }
//            
//        },100);
        
        
    if (!mdown || !animStoped) return;
        
        
    var s = getScene(ev);
    var mousePos = [ev.clientX - canvas.offsetLeft, ev.clientY - canvas.offsetTop];
    var mdelta = [(mpos[0]-mousePos[0]),(mpos[1]-mousePos[1])];
    mpos = [mousePos[0],mousePos[1]];
    //pan nav is initialized and set in ui\_ui.js for now.
     if (!panNav) {
        if (s._nav.NavRotation(mpos, mdelta)) s.clearRefine();
    } else {
        var mdelta2 = [mdelta[0] * 3, mdelta[1] * 3];
        if (s._nav.NavPan(mdelta2)) s.clearRefine();
    }
}

function mouseWheel(ev){
    if (!animStoped) return;
	 if(menu11wasclicked==true){
		
	} 
	else{
		for (var j = 1; j <= 9; j++) {translateOut(j);}
	}
     hideAll(); 
     autoPauseAllAnimations();
   
	   
	$("#pointtext3").fadeOut(0);
	$("#pointtext6").fadeOut(0);
    $("#pointtext1").fadeOut(0);

	    reversAll();
      var s = getScene(ev);
      var delta = ev.wheelDelta ? ev.wheelDelta : (-ev.detail * 10.0);
      //var deltaScene = (delta*0.05)*(scene.sceneRadius*0.01);
      var deltaScene = delta * 0.035;
      if (s._nav.NavChangeDolly(deltaScene))
      s.clearRefine();
}

function hideAll() {
//	for (var i = 1; i <= 11; i++) {$("#point" + i + "btn").attr("src","images_gl/roll.png");$("#point"+i+"plus").attr('src','images_gl/plus.png');}
//    for (var j = 1; j <= 11; j++) {translateOut(j);}
//    $("#topheading").fadeOut(500);
//    $("#onloadCopy").fadeOut(500);
//    $("#wellcomeMessage").fadeOut(500);
}

function updateZoomBarBg(newval) {
    var scale = -(navMinDolly - navMaxDolly);
    var val = -newval + navMaxDolly;
    $("#zoom_slider_bg").css("height", (val / scale) * 100 + "%");
}


function updateZoomBar(newval) {
    var scale = -(navMinDolly - navMaxDolly);
    var val = -newval;
    $(".ui-slider-handle").css("bottom", (val / scale) * 100 + "%");
}

//var animStoped = true;

//function animComplete() {
////    animStoped = true;
//    g_navEnabled = true;
//}


var dragCursor;
var curBrowser = BrowserDetect.browser;
// IE doesn't support co-ordinates
var cursCoords = (curBrowser == "Explorer") ? "" : " 4 4";

function initDragCursor() {
    handOpen();
    $('#sliderBG').mousedown(function() {
        handClosed();
    });
    $('.ui-slider-handle').mousedown(function() {
        handClosed();
    });
    $('body').mouseup(function() {
        handOpen();
    });
    $('body').mouseup(function() {
        handOpen();
    });
}

function handClosed() {
    dragCursor = (curBrowser == "Firefox") ? "-moz-grabbing" : "url(images_gl/closedhand.cur)" + cursCoords + ", move";
    // Opera doesn't support url cursors and doesn't fall back well...
    if (curBrowser == "Opera") dragCursor = "move";
    $('.ui-slider-handle').css("cursor", dragCursor);
    $('#sliderBG').css("cursor", dragCursor);
    $('#dummy-canvas').css("cursor", dragCursor);
}

function handOpen() {
    dragCursor = (curBrowser == "Firefox") ? "-moz-grab" : "url(images_gl/openhand.cur)" + cursCoords + ", move";
    $('.ui-slider-handle').css("cursor", dragCursor);
    $('#sliderBG').css("cursor", dragCursor);
    $('#dummy-canvas').css("cursor", dragCursor);
}

var mouseIsDown = false;
var loopCtr = 0;
var touch = new Vector3();
var touches = [new Vector3(), new Vector3(), new Vector3()];
var prevTouches = [new Vector3(), new Vector3(), new Vector3()];
var prevDistance = null;

function touchStart(event) {
     if(menu11wasclicked==true){
		
	} 
	else{
		for (var j = 1; j <= 9; j++) {translateOut(j);}
	}
    if(!animStoped)return;
     autoPauseAllAnimations();
	reversAll();
            switch (event.touches.length) {
                case 1:
                    touches[0].set(event.touches[0].pageX, event.touches[0].pageY, 0);
                    touches[1].set(event.touches[0].pageX, event.touches[0].pageY, 0);
                    break;
                case 2:
                    touches[0].set(event.touches[0].pageX, event.touches[0].pageY, 0);
                    touches[1].set(event.touches[1].pageX, event.touches[1].pageY, 0);
                    prevDistance = touches[0].distanceTo(touches[1]);
                    break;
            }
            prevTouches[0].copy(touches[0]);
            prevTouches[1].copy(touches[1]);
        }

var doubleTouch = false;

 function touchMove(event) {
      if(menu11wasclicked==true){
		
	} 
	else{
		for (var j = 1; j <= 9; j++) {translateOut(j);}
	}
     if(!animStoped )return;
      autoPauseAllAnimations();
            var s = getScene(event);
            event.preventDefault();   
            event.stopPropagation();
            var getClosest = function(touch, touches) {
                var closest = touches[0];
                for (var i in touches) {
                    if (closest.distanceTo(touch) > touches[i].distanceTo(touch)) closest = touches[i];
                }
                return closest;
            }
            switch (event.touches.length) {
                case 1:
                    if (doubleTouch == false) {
                        touches[0].set(event.touches[0].pageX, event.touches[0].pageY, 0);
                        touches[1].set(event.touches[0].pageX, event.touches[0].pageY, 0);
                        if (s._nav.NavRotation([touches[0].x, touches[0].y], [(prevTouches[0].x - touches[0].x) * 1.2, (prevTouches[0].y - touches[0].y) * 1.2])) s.clearRefine();
                        //scope.rotate( touches[ 0 ].sub( getClosest( touches[ 0 ] ,prevTouches ) ).multiplyScalar( - 0.005 ) );
                    }
                    break;
                case 2:
					$("#pointtext3").fadeOut(0);
                    $("#pointtext6").fadeOut(0);
                    $("#pointtext1").fadeOut(0);
                    doubleTouch = true;
                    //alert("double");
                    touches[0].set(event.touches[0].pageX, event.touches[0].pageY, 0);
                    touches[1].set(event.touches[1].pageX, event.touches[1].pageY, 0);
                    distance = touches[0].distanceTo(touches[1]);
                    var deltaScene = -(prevDistance - distance);
                    if (s._nav.NavChangeDolly(deltaScene)) {
                        s.clearRefine();
                    }
                    //scope.zoom( new Vector3( 0, 0, prevDistance - distance ) );
                    prevDistance = distance;
                    var offset0 = touches[0].clone().sub(getClosest(touches[0], prevTouches));
                    var offset1 = touches[1].clone().sub(getClosest(touches[1], prevTouches));
                    offset0.x = -offset0.x;
                    offset1.x = -offset1.x;
                    var mdelta2 = [offset1.x * 7, -offset1.y * 7];
                    
                    if (s._nav.NavPan(mdelta2)) s.clearRefine();
                    //scope.pan( offset0.add( offset1 ).multiplyScalar( 0.5 ) );
                    break;
            }
            prevTouches[0].copy(touches[0]);
            prevTouches[1].copy(touches[1]);
           
        }

function touchEndCan(event) {

   setTimeout(function(){
        doubleTouch = false;
    },100);
}

function parseXml(){
//console.log("fn call in ");
 			$.ajax({
                url: 'text.xml', // name of file you want to parse
                dataType: "xml", // type of file you are trying to read
                success: function parse(document){
             $(document).find("loader").each(function(){
             	/*var loaderHeading = $(this).find('loaderHeading').text();
             	$('.loaderheading').append(loaderHeading);*/
             	var subheading = $(this).find('subheading').text();
             	$('.subheading').append(subheading);
             	var greyLeftTop = $(this).find('greyLeftTop').text();
             	$('.grey-left-top').append(greyLeftTop);
             	var greyLeftBottom = $(this).find('greyLeftBottom').text();
             	$('.grey-left-bottom').prepend(greyLeftBottom);
             	var greyRightTop = $(this).find('greyRightTop').text();
             	$('.grey-right-top').append(greyRightTop);
             	var greyRightBottom = $(this).find('greyRightBottom').text();
             	$('.grey-right-bottom').append(greyRightBottom);
             	var loaderOpen = $(this).find('loaderOpen').text();
             	$('.loader-open').append(loaderOpen);
             	var loaderZoom = $(this).find('loaderZoom').text();
             	$('.loader-zoom').append(loaderZoom);
             	var loaderRotate = $(this).find('loaderRotate').text();
             	$('.loader-rotate').append(loaderRotate);
             	var loaderMove = $(this).find('loaderMove').text();
             	$('.loader-move').append(loaderMove);
             	var leftMouse = $(this).find('leftMouse').text();
             	$('.left-mouse').prepend(leftMouse);
             	var rotateMouse = $(this).find('rotateMouse').text();
             	$('.rotate-mouse').append(rotateMouse);
             	var scrollMouse = $(this).find('scrollMouse').text();
             	$('.scroll-mouse').prepend(scrollMouse);
             	var zoomMouse = $(this).find('zoomMouse').text();
             	$('.zoom').append(zoomMouse);
             	var bothMouse = $(this).find('bothMouse').text();
             	$('.both-mouse').prepend(bothMouse);
             	var pan = $(this).find('pan').text();
             	$('.pan-mouse').append(pan);
             });   	
           
             
             $(document).find("message").each(function(){
             	var blackPatch = $(this).find('blackPatch').text();
             	$('.productName span').append(blackPatch);  
             	var cpText = $(this).find('cpText').text();
             	$('#cpText').append(cpText);
             	var cpHeading = $(this).find('cpHeading').text();
             	$('#cpHeading').append(cpHeading);
                 var cpSubHeading = $(this).find('cpSubHeading').text();
             	$('#cpSubHeading').append(cpSubHeading);
             	 var textFadeClass_01_1 = $(this).find('textFadeClass_01 firstChild').text();
				  $('#textFadeClass_01 .firstChild').append(textFadeClass_01_1);
				 var textFadeClass_01_2 = $(this).find('textFadeClass_01 secondchild').text();
				  $('#textFadeClass_01 .firstChild+p').append(textFadeClass_01_2);
				   
			      var textFadeClass_01_3 = $(this).find('textFadeClass_02 firstChild').text();
				  $('#textFadeClass_02 .firstChild').append(textFadeClass_01_3);
				  var textFadeClass_01_4 = $(this).find('textFadeClass_02 secondchild').text();
				  $('#textFadeClass_02 .firstChild+p').append(textFadeClass_01_4);
                 
                  var textFadeClass_01_5 = $(this).find('textFadeClass_03 firstChild').text();
				  $('#textFadeClass_03 .firstChild').append(textFadeClass_01_5);
				  var textFadeClass_01_6 = $(this).find('textFadeClass_03 secondchild').text();
				  $('#textFadeClass_03 .firstChild+p').append(textFadeClass_01_6);
                 
                  var textFadeClass_01_7 = $(this).find('textFadeClass_04 firstChild').text();
				  $('#textFadeClass_04 .firstChild').append(textFadeClass_01_7);
				  var textFadeClass_01_8 = $(this).find('textFadeClass_04 secondchild').text();
				  $('#textFadeClass_04 .firstChild+p').append(textFadeClass_01_8);
                 
                  var textFadeClass_01_9 = $(this).find('textFadeClass_05 firstChild').text();
				  $('#textFadeClass_05 .firstChild').append(textFadeClass_01_9);
				  var textFadeClass_01_10 = $(this).find('textFadeClass_05 secondchild').text();
				  $('#textFadeClass_05 .firstChild+p').append(textFadeClass_01_10);
                    
                 
             });

             $(document).find("buttons").each(function(){
             	var backText = $(this).find('backText').text();
        		$('#backText').append(backText);
             	var zoomText = $(this).find('zoomText').text();
             	$('#zoomText').append(zoomText);
             	var roatateText = $(this).find('roatateText').text();
             	$('#roatateText').append(roatateText);
             	var moveText = $(this).find('moveText').text();
             	$('#moveText').append(moveText);
             	btnOpen = $(this).find('divOpen').text();
             	$('#openCloseDiv').html(btnOpen);
             	btnClose = $(this).find('divClose').text();
             	//$('#openCloseDiv').append(btnClose);
             });
             $(document).find("pointtext1").each(function(){ 
             	var point1_1 = $(this).find('point1text1').text();
             	$('#pointtext1 #Cp_text_01').append(point1_1);
                var point1_2 = $(this).find('point1text2').text();
                $('#pointtext1 #Cp_text_02').append(point1_2);
                var point1_3 = $(this).find('point1text3').text();
                $('#pointtext1 #Cp_text_03').append(point1_3);
                 var point1_4 = $(this).find('point1text4').text();
                $('#pointtext1 #Cp_text_04').append(point1_4);
                 var point1_5 = $(this).find('point1text5').text();
                $('#pointtext1 #Cp_text_05').append(point1_5);
                 var point1_6 = $(this).find('point1text6').text();
                $('#pointtext1 #Cp_text_06').append(point1_6);
                 var point1_7 = $(this).find('point1text7').text();
                $('#pointtext1 #Cp_text_07').append(point1_7);
                 var point1_8 = $(this).find('point1text8').text();
                $('#pointtext1 #Cp_text_08').append(point1_8);
                 var point1_9 = $(this).find('point1text9').text();
                $('#pointtext1 #Cp_text_09').append(point1_9);
                 var point1_10 = $(this).find('point1text10').text();
                $('#pointtext1 #Cp_text_10').append(point1_10);
                 var point1_11 = $(this).find('point1text11').text();
                $('#pointtext1 #Cp_text_11').append(point1_11);
                 var point1_12 = $(this).find('point1text12').text();
                $('#pointtext1 #Cp_text_12').append(point1_12);
                 
             });

             $(document).find("point2text").each(function(){
             	var point2_1 = $(this).find('point2text1').text();
             	$('#point2text p:nth-child(1)').append(point2_1);
             	var point2_2 = $(this).find('point2text2').text();
             	$('#point2text p:nth-child(2)').append(point2_2);
             	var point2_3 = $(this).find('point2text3').text();
             	$('#point2text p:nth-child(3)').append(point2_3);
                 var point2_4 = $(this).find('point2text4').text();
             	$('#point2text p:nth-child(4)').append(point2_4);
                 var point2_5 = $(this).find('point2text5').text();
             	$('#point2text p:nth-child(5)').append(point2_5);
                 var point2_6 = $(this).find('point2text6').text();
             	$('#point2text p:nth-child(6)').append(point2_6);
                 var point2_7 = $(this).find('point2text7').text();
             	$('#point2text p:nth-child(7)').append(point2_7);
                 var point2_8 = $(this).find('point2text8').text();
             	$('#point2text p:nth-child(8)').append(point2_8);
                 var point2_9 = $(this).find('point2text9').text();
             	$('#point2text p:nth-child(9)').append(point2_9);
                  var point2_10 = $(this).find('point2text10').text();
             	$('#point2text p:nth-child(10)').append(point2_10);
                  var point2_11 = $(this).find('point2text11').text();
             	$('#point2text p:nth-child(11)').append(point2_11);
                  var point2_12 = $(this).find('point2text12').text();
             	$('#point2text p:nth-child(12)').append(point2_12);
                   var point2_13 = $(this).find('point2text13').text();
             	$('#cloudControlUL li:nth-child(1)').append(point2_13);
                  var point2_14 = $(this).find('point2text14').text();
             	$('#cloudControlUL li:nth-child(2)').append(point2_14);
                 
             });  

              $(document).find("pointtext3").each(function(){
             	var point3_1 = $(this).find('headingText').text();
             	$('#pointtext3 p:nth-child(1)').append(point3_1);
             	var point3_2 = $(this).find('point3text1').text();
             	$('.point3text1Hotspot .point3text1').html(point3_2);
             	var point3_3 = $(this).find('point3text2').text();
             	$('.point3text2Hotspot .point3text2').html(point3_3);
             	var point3_4 = $(this).find('point3text3').text();
             	$('.point3text3Hotspot .point3text3').html(point3_4);
             	var point3_5 = $(this).find('point3text4').text();
             	$('.point3text4Hotspot .point3text4').html(point3_5);
             	var point3_6 = $(this).find('point3text5').text();
             	$('.point3text5Hotspot .point3text5').html(point3_6);
             	var point3_7 = $(this).find('point3text6').text();
             	$('.point3text6Hotspot .point3text6').html(point3_7);
             	var point3_8 = $(this).find('point3text7').text();
             	$('.point3text7Hotspot .point3text7').html(point3_8);
             	var point3_9 = $(this).find('point3text8').text();
             	$('.point3text8Hotspot .point3text8').html(point3_9);
             });
                    
             $(document).find("point4text").each(function(){
             	var point4_1 = $(this).find('headingText').text();
             	$('#point4text p:nth-child(1)').append(point4_1);
             	var point4_2 = $(this).find('bodytext').text();
             	$('#point4text p:nth-child(2)').append(point4_2);
             });
                    
            $(document).find("point5text").each(function(){
             	var point5_1 = $(this).find('headingText').text();
             	$('#point5text p:nth-child(1)').append(point5_1);
             	var point5_2 = $(this).find('point5text1').text();
             	$('#point5text p:nth-child(2)').append(point5_2);
             });
					
					
             $(document).find("pointtext6").each(function(){
             	var point6_1 = $(this).find('headingText').text();
             	$('#pointtext6 p:nth-child(1)').append(point6_1);
             	var point6_2 = $(this).find('point6text1').text();
             	$('.point6text1Hotspot .point6text1').html(point6_2);
             	var point6_3 = $(this).find('point6text2').text();
             	$('.point6text2Hotspot .point6text2').html(point6_3);
             	var point6_4 = $(this).find('point6text3').text();
             	$('.point6text3Hotspot .point6text3').html(point6_4);
             	var point6_5 = $(this).find('point6text4').text();
             	$('.point6text4Hotspot .point6text4').html(point6_5);
            });
                    
                    $(document).find("point7text").each(function(){
             	var point7_1 = $(this).find('headingText').text();
             	$('#point7text p:nth-child(1)').append(point7_1);
             	var point7_2 = $(this).find('bodytext').text();
             	$('#point7text p:nth-child(2)').append(point7_2);
                var point7_3 = $(this).find('point7text1').text();
             	$('#point7text p:nth-child(4)').append(point7_3); 
             	
             }); 
              $(document).find("point8text").each(function(){
             	var point8_1 = $(this).find('headingText').text();
             	$('#point8text p:nth-child(1)').append(point8_1);
             	var point8_2 = $(this).find('bodytext').text();
             	$('#point8text p:nth-child(2)').append(point8_2);
             });
             $(document).find("point9text").each(function(){
             	var point9_1 = $(this).find('headingText').text();
             	$('#point9text p:nth-child(1)').append(point9_1);
             	var point9_2 = $(this).find('bodytext').text();
             	$('#point9text p:nth-child(2)').append(point9_2);
             });
             $(document).find("point10text").each(function(){
             	var Text10One = $(this).find('headingText').text();
             	$('#point10text p:nth-child(1)').append(Text10One);
				   
             	  var point10text1 = $(this).find('point10text1').text();
				  $('#point10text ul li:nth-child(1)').append(point10text1);
				   
				  var point10text2 = $(this).find('point10text2').text();
				  $('#point10text ul li:nth-child(2)').append(point10text2);
				   
				  var point10text3 = $(this).find('point10text3').text();
				  $('#point10text ul li:nth-child(3)').append(point10text3);
				   
				  var point10text4 = $(this).find('point10text4').text();
				  $('#point10text ul li:nth-child(4)').append(point10text4);
				   
				  var point10text5 = $(this).find('point10text5').text();
				  $('#point10text ul li:nth-child(5)').append(point10text5);
				   
				  var point10text6 = $(this).find('point10text6').text();
				  $('#point10text ul li:nth-child(6)').append(point10text6);
				   
				  var point10text7 = $(this).find('point10text7').text();
				  $('#point10text ul li:nth-child(7)').append(point10text7);
				   
				 var point10text8 = $(this).find('point10text8').text();
				  $('#point10text ul li:nth-child(8)').append(point10text8);

				  var point10text9 = $(this).find('point10text9').text();
				  $('#point10text ul li:nth-child(9)').append(point10text9);
             });
					
           
        }, // name of the function to call upon success
                error: function(){alert("Error: Something went wrong");}
        });
}
//function translateIn(no){}
//function translateOut(no){}

function translateIn(no){
	//$("#point"+no+"text").fadeIn("50");
	$("#point"+no+"text > p:eq(0)").css({
	"webkitTransform":"translate(0,-5px)",
	"MozTransform":"translate(0,-5px)",
	"msTransform":"translate(0,-5px)",
	"OTransform":"translate(0,-5px)",
	"transform":"translate(0,-5px)",
        "opacity":"1"
	});
    $("#point"+no+"text > p:gt(0)").css({
	"webkitTransform":"translate(0,-5px)",
	"MozTransform":"translate(0,-5px)",
	"msTransform":"translate(0,-5px)",
	"OTransform":"translate(0,-5px)",
	"transform":"translate(0,-5px)",
        "opacity":"1"
	});
	$("#point"+no+"text ul").css({
	"webkitTransform":"translate(0,-5px)",
	"MozTransform":"translate(0,-5px)",
	"msTransform":"translate(0,-5px)",
	"OTransform":"translate(0,-5px)",
	"transform":"translate(0,-5px)",
        "opacity":"1"
	});
    $("#point0image4").css({
	"webkitTransform":"translate(0,-5px)",
	"MozTransform":"translate(0,-5px)",
	"msTransform":"translate(0,-5px)",
	"OTransform":"translate(0,-5px)",
	"transform":"translate(0,-5px)",
        "opacity":"1"
	});
	$("#text1, #text2, #text3").css({
	"webkitTransform":"translate(0,-5px)",
	"MozTransform":"translate(0,-5px)",
	"msTransform":"translate(0,-5px)",
	"OTransform":"translate(0,-5px)",
	"transform":"translate(0,-5px)",
        "opacity":"0"
	});
	$(".headingText1").css('opacity','0');
	$(".headingText1").css({
		"webkitTransform":"translate(0,-5px)",
		"MozTransform":"translate(0,-5px)",
		"msTransform":"translate(0,-5px)",
		"OTransform":"translate(0,-5px)",
		"transform":"translate(0,-5px)"
	});
	$(".bodyText1").css('opacity','0');
	$(".bodyText1").css({
		"webkitTransform":"translate(0,-5px)",
		"MozTransform":"translate(0,-5px)",
		"msTransform":"translate(0,-5px)",
		"OTransform":"translate(0,-5px)",
		"transform":"translate(0,-5px)"
	});
//	$(".heading5Text, .body5Text, .heading6Text, .body6Text, .point6text6, .point6text7, .point6text8, .point6text9, .point6text10, .point6text11, .point6text12, .heading7Text, .body7Text, .point7text6, .point7text7, .point7text8, .point7text9, .point7text10, .point7text11, .point7text12").css('opacity','0');
//	$(".heading5Text, .body5Text, .point5text6, .point5text7, .point5text8, .point5text9, .point5text10, .point5text11, .point5text12, .heading6Text, .body6Text, .point6text6, .point6text7, .point6text8, .point6text9, .point6text10, .point6text11, .point6text12, .heading7Text, .body7Text, .point7text6, .point7text7, .point7text8, .point7text9, .point7text10, .point7text11, .point7text12, .point7text1, .point7text2, .point7text3, .point7text4").css({
//		"webkitTransform":"translate(0,0px)",
//		"MozTransform":"translate(0,0px)",
//		"msTransform":"translate(0,0px)",
//		"OTransform":"translate(0,0px)",
//		"transform":"translate(0,0px)"
//	});
}

function translateOut(no){
   
        //    $(".point1text1").fadeOut(500);
    
  
//	$("#point"+no+"text").fadeOut(500);
//	$("#image"+no).css({
//	"webkitTransform":"translate(0,0px)",
//	"MozTransform":"translate(0,0px)",
//	"msTransform":"translate(0,0px)",
//	"OTransform":"translate(0,0px)",
//	"transform":"translate(0,0px)",
//	"opacity":0
//	});
//	$("#point"+no+"text > p:eq(0)").css({
//	"webkitTransform":"translate(0,0px)",
//	"MozTransform":"translate(0,0px)",
//	"msTransform":"translate(0,0px)",
//	"OTransform":"translate(0,0px)",
//	"transform":"translate(0,0px)",
//	"opacity":0
//	});
//    $("#point"+no+"text > p:gt(0)").css({
//	"webkitTransform":"translate(0,0px)",
//	"MozTransform":"translate(0,0px)",
//	"msTransform":"translate(0,0px)",
//	"OTransform":"translate(0,0px)",
//	"transform":"translate(0,0px)",
//	"opacity":0
//	});
//	$("#point"+no+"text > ul").css({
//	"webkitTransform":"translate(0,0px)",
//	"MozTransform":"translate(0,0px)",
//	"msTransform":"translate(0,0px)",
//	"OTransform":"translate(0,0px)",
//	"transform":"translate(0,0px)",
//	"opacity":0
//	});
//	$(".menu").css({
//	"webkitTransform":"translate(0,0px)",
//	"MozTransform":"translate(0,0px)",
//	"msTransform":"translate(0,0px)",
//	"OTransform":"translate(0,0px)",
//	"transform":"translate(0,0px)",
//	"opacity":0
//	});
//	$(".headingText1").css('opacity','0');
//	$(".headingText1").css({
//		"webkitTransform":"translate(0,0px)",
//		"MozTransform":"translate(0,0px)",
//		"msTransform":"translate(0,0px)",
//		"OTransform":"translate(0,0px)",
//		"transform":"translate(0,0px)"
//	});
//	$(".bodyText1").css('opacity','0');
//	$(".bodyText1").css({
//		"webkitTransform":"translate(0,0px)",
//		"MozTransform":"translate(0,0px)",
//		"msTransform":"translate(0,0px)",
//		"OTransform":"translate(0,0px)",
//		"transform":"translate(0,0px)"
//	});	
//	$("#text1, #text2, #text3").css({
//	"webkitTransform":"translate(0,0px)",
//	"MozTransform":"translate(0,0px)",
//	"msTransform":"translate(0,0px)",
//	"OTransform":"translate(0,0px)",
//	"transform":"translate(0,0px)",
//	"opacity":0
//	});
//	$(".heading5Text, .body5Text, .point5text6, .point5text7, .point5text8, .point5text9, .point5text10, .point5text11, .point5text12, .heading6Text, .body6Text, .point6text6, .point6text7, .point6text8, .point6text9, .point6text10, .point6text11, .point6text12").css('opacity','0');
//	$(".heading5Text, .body5Text, .point5text6, .point5text7, .point5text8, .point5text9, .point5text10, .point5text11, .point5text12, .heading6Text, .body6Text, .point6text6, .point6text7, .point6text8, .point6text9, .point6text10, .point6text11, .point6text12").css({
//		"webkitTransform":"translate(0,0px)",
//		"MozTransform":"translate(0,0px)",
//		"msTransform":"translate(0,0px)",
//		"OTransform":"translate(0,0px)",
//		"transform":"translate(0,0px)"
//	});
//    $("#topheading").css({
//			"webkitTransform":"translate(0,0px)",
//            "MozTransform":"translate(0,0px)",
//            "msTransform":"translate(0,0px)",
//            "OTransform":"translate(0,0px)",
//            "transform":"translate(0,0px)",
//			"opacity":0
//	   });
//         $("#onloadCopy").css({
//			"webkitTransform":"translate(0,0px)",
//            "MozTransform":"translate(0,0px)",
//            "msTransform":"translate(0,0px)",
//            "OTransform":"translate(0,0px)",
//            "transform":"translate(0,0px)",
//			"opacity":0
//	   });
    

}