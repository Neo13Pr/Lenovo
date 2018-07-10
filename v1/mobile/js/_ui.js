var blaze3d_normalize = function(pt)
{
	var d = Math.sqrt((pt[0]*pt[0])+(pt[1]*pt[1])+(pt[2]*pt[2]));
	if (d == 0) return [0,0,0];
	return [pt[0]/d,pt[1]/d,pt[2]/d];
}

var blaze3d_dp = function(v1,v2)
{
	return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
}

function MatrixGetX(m)
{
    return [ m[0], m[1], m[2] ];
}

function MatrixGetY(m)
{
    return [ m[4], m[5], m[6] ];
}

function MatrixGetZ(m)
{
    return blaze3d_normalize([ 0-m[0], 0-m[1], 0-m[2] ]);
}

function MatrixGetPos(m)
{
    return [ m[0], m[1], m[2] ];
}

function MatrixRotationAxis(fAngle, fX, fY, fZ) 
{
	var s = Math.sin(fAngle);
	var c = Math.cos(fAngle);	
	var x = fX;
	var y = fY;
	var z = fZ;
	
	var mOut = Array();
	mOut[ 0] = x * x * (1 - c) + c;
	mOut[ 4] = x * y * (1 - c) - (z * s);
	mOut[ 8] = x * z * (1 - c) + (y * s);
	mOut[12] = 0;
	
	mOut[ 1] = y * x * (1 - c) + (z * s);
	mOut[ 5] = y * y * (1 - c) + c;
	mOut[ 9] = y * z * (1 - c) - (x * s);
	mOut[13] = 0;
	
	mOut[ 2] = z * x * (1 - c) - (y * s);
	mOut[ 6] = z * y * (1 - c) + (x * s);
	mOut[10] = z * z * (1 - c) + c;
	mOut[14] = 0.0;
	
	mOut[ 3] = 0.0;
	mOut[ 7] = 0.0;
	mOut[11] = 0.0;
	mOut[15] = 1.0;
	return mOut;
}

function MatrixMultiply(mA, mB)
{
	var mRet = Array();
	// Perform calculation on a dummy matrix (mRet)
	mRet[ 0] = mA[ 0]*mB[ 0] + mA[ 1]*mB[ 4] + mA[ 2]*mB[ 8] + mA[ 3]*mB[12];
	mRet[ 1] = mA[ 0]*mB[ 1] + mA[ 1]*mB[ 5] + mA[ 2]*mB[ 9] + mA[ 3]*mB[13];
	mRet[ 2] = mA[ 0]*mB[ 2] + mA[ 1]*mB[ 6] + mA[ 2]*mB[10] + mA[ 3]*mB[14];
	mRet[ 3] = mA[ 0]*mB[ 3] + mA[ 1]*mB[ 7] + mA[ 2]*mB[11] + mA[ 3]*mB[15];
	//
	mRet[ 4] = mA[ 4]*mB[ 0] + mA[ 5]*mB[ 4] + mA[ 6]*mB[ 8] + mA[ 7]*mB[12];
	mRet[ 5] = mA[ 4]*mB[ 1] + mA[ 5]*mB[ 5] + mA[ 6]*mB[ 9] + mA[ 7]*mB[13];
	mRet[ 6] = mA[ 4]*mB[ 2] + mA[ 5]*mB[ 6] + mA[ 6]*mB[10] + mA[ 7]*mB[14];
	mRet[ 7] = mA[ 4]*mB[ 3] + mA[ 5]*mB[ 7] + mA[ 6]*mB[11] + mA[ 7]*mB[15];
	//
	mRet[ 8] = mA[ 8]*mB[ 0] + mA[ 9]*mB[ 4] + mA[10]*mB[ 8] + mA[11]*mB[12];
	mRet[ 9] = mA[ 8]*mB[ 1] + mA[ 9]*mB[ 5] + mA[10]*mB[ 9] + mA[11]*mB[13];
	mRet[10] = mA[ 8]*mB[ 2] + mA[ 9]*mB[ 6] + mA[10]*mB[10] + mA[11]*mB[14];
	mRet[11] = mA[ 8]*mB[ 3] + mA[ 9]*mB[ 7] + mA[10]*mB[11] + mA[11]*mB[15];
	//
	mRet[12] = mA[12]*mB[ 0] + mA[13]*mB[ 4] + mA[14]*mB[ 8] + mA[15]*mB[12];
	mRet[13] = mA[12]*mB[ 1] + mA[13]*mB[ 5] + mA[14]*mB[ 9] + mA[15]*mB[13];
	mRet[14] = mA[12]*mB[ 2] + mA[13]*mB[ 6] + mA[14]*mB[10] + mA[15]*mB[14];
	mRet[15] = mA[12]*mB[ 3] + mA[13]*mB[ 7] + mA[14]*mB[11] + mA[15]*mB[15];	
	return mRet
}

//////////////

function onResetCameraClick()
{
	if(!clickEventActive) return;
	//console.log("reseting g_navEnabled is "+g_navEnabled);
	//if(g_navEnabled == false) return;
		
	$("#feature").fadeOut();
	clearCurrentOverlay();
	scene.gotoPos(0.0, 0.0, 0.0, 0.0, -10, 20);
	$("#zoom_slider").slider( "option", "value", 0);
	if (_viewFinderOn != true)
	{
		scene.animPlay("vf", 0, 15);
		_viewFinderOn = true;
	}
	if (_flashOn != true)
	{
		scene.animPlay("flash1", 0, 10);
		scene.animPlay("flash2", 0, 10);
		_flashOn = true;
	}
	if (_screenOn != true)
	{
		scene.animPlay("screen_group1", 0, 15);
		scene.animPlay("screen_group2", 0, 15);
		_screenOn = true;
	}
	$("#zoom_slider").slider( "option", "value", 0 );
	$("#screen_slider").slider( "option", "value", 0 );
	//allowClick = false;
	//allowScreenAnim = false;
	scene.clearRefine();
	//g_navEnabled = true; // this unlocks the navigation , can be found in SuperBlaze Navigation 
	//check for IE8 or less
	if($.browser.msie && parseFloat($.browser.version)<8)
	{
		//alert('IE8');
		//console.log("IE8"); 
	}
	if (jQuery.browser.msie == true)
	{
		
	scene.imageSet(resetBtn, "alpha", 0);
	scene.imageSet(resetDownBtn, "alpha", 1);	
	
	setTimeout(function()
	{
		scene.imageSet(resetBtn, "alpha", 1);
		scene.imageSet(resetDownBtn, "alpha", 0);
	}, 1000); 
		
	scene.reset();
	}
	
	
	
}


function on360(){
	clearCurrentOverlay();
	g_navEnabled = true;
	//_normalAnim = false;
	scene.instanceSet("polySurface402_second", "visible", false);
	scene.instanceSet("polySussce402_third", "visible", false);
	scene.instanceSet("polySusscren402_forth", "visible", false);
	scene.gotoPos(0.0, 0.0, 0.0, 0.0, 0.0, 20);
	scene.animPlay("screen_inner",0, 20);
	scene.animPlay("gap_fill_one",0, 20);
	scene.animPlay("gap_fill_two",0, 20);
	scene.animPlay("gap_fill_three",0, 20);
	scene.animPlay("gap_fill_four",0, 20);
	scene.animPlay("screen",0, 20);
	scene.animPlay("body",0, 20);
	//allowScreenAnim = false;
	scene.clearRefine();
} 

function fullScreenPressed()
{
	scene.toggleFullScreen();
}


function _initFlash()
{
	scene=document.getElementById('superblazeFlash');
	//console.log("_initFlash"+scene);
}

function coordsToCentered($x, $y)
{
	var x = (($x / 900) *2) -1;
	var y = ((-$y / 506) *2) +1;
	
	return [x, y];
}



//var sld;
//var sld2;
// Fixed SuperBlaze Function triggered once
var panOffButton;
var panOnButton;
var panLabel ;
var rotateLabel;
var allowScreenAnim = true;

//
//-----------var overlay0;
//-----------var overlayimage0;

//-----------var overlay1;
//-----------var overlayimage1;

//-----------var overlay2;
//-----------var overlayimage2;

//-----------var overlay3;
//-----------var overlayimage3;

//-----------var overlay4;
//-----------var overlayimage4;

//-----------var overlay5;
//-----------var overlayimage5;

//-----------var overlays;

/*var power;
var powerBtn;*/
var viewFinder;
var viewFinderBtn;
var backscreen;
var screenBtn;
var flash;
var flashBtn;
var currentColour = "black";

var swaps = [
{type:"materialSwap",
black:"BL_button_black_mat_top_button_black_mat",
grey:"SL_button_black_mat_dummy031"},
{type:"materialSwap",
black:"BL_screen_body_mat_battery_cap_mat",
grey:"SL_battery_cap_mat_dummy030"},
{type:"materialSwap",
black:"BL_front_base_env_front_button_base_mat",
grey:"SL_front_button_base_mat_dummy029"},
{type:"materialSwap",
black:"BL_anastropy_env_anastropy_mat",
grey:"SL_anastropy_env_dummy07"},
{type:"materialSwap",
black:"BL_lense_body_mat",
grey:"SL_lense_body_mat"},
{type:"materialSwap",
black:"BL_top_panasonic_alpha_env_top_panasonic_alpha_mat",
grey:"SL_top_panasonic_alpha_mat_dummy09"},
{type:"materialSwap",
black:"BL_alpha_mat_back_dull_alpha_mat",
grey:"SL_top_cam_alpha_mat_dummy014"},  
{type:"materialSwap",
black:"BL_alpha_mat_top_cam_alpha_mat",
grey:"SL_top_cam_alpha_mat_dummy020"},
{type:"materialSwap",
black:"BL_lense_grip_mat_lense_grip_mat",
grey:"SL_ense_grip_mat_dummy025"},
{type:"materialSwap",
black:"BL_bump_mat_bump_map_mat",
grey:"SL_bump_map_mat_dummy024"},
{type:"materialSwap",
black:"BL_bump_env_front_bump_mat",
grey:"SL_front_bump_mat_dummy05"},
{type:"materialSwap",
black:"BL_alpha_mat_top_button_alpha_mat",
grey:"SL_top_button_alpha_mat_dummy010"},
{type:"materialSwap",
black:"BL_alpha_mat_top_panasonic_alpha_mat",
grey:"SL_top_panasonic_alpha_mat_dummy09"},
{type:"materialSwap",
black:"BL_body_black_mat_body_black_mat",
grey:"SL_body_black_mat_dummy023"},
{type:"materialSwap",
black:"BL_top_button_alpha_env_top_button_alpha_mat",
grey:"SL_top_button_alpha_mat_dummy010"},
{type:"materialSwap",
black:"lense_hd_env_lense_hd_mat",
grey:"SL_lense_hd_env_dummy028"},
{type:"materialSwap",
black:"chrome_env_chrome_top_mat",
grey:"SL_top_chrome_env_dummy018"}
];

function changeToBlack()
{
	$("#blackColourButton").css('display','none');
	$("#greyColourButton").css('display','block');
	if (jQuery.browser.msie == true)
			{
				scene.imageSet(blackColourBtn, "alpha", 0);
				scene.imageSet(blackColourDownBtn, "alpha", 1);
			setTimeout(function()
			{
				scene.imageSet(blackColourBtn, "alpha", 1);
				scene.imageSet(blackColourDownBtn, "alpha", 0);
			}, 400); 
			}
	changeColour("black");
	scene.instanceSet("glow_hide", "visible", false);
}
function changeToGrey()
{
	$("#blackColourButton").css('display','block');
	$("#greyColourButton").css('display','none');
	if (jQuery.browser.msie == true)
			{
				scene.imageSet(greyColourBtn, "alpha", 0);
				scene.imageSet(greyColourDownBtn, "alpha", 1);
			setTimeout(function()
			{
				scene.imageSet(greyColourBtn, "alpha", 1);
				scene.imageSet(greyColourDownBtn, "alpha", 0);
			}, 400); 
			}
	changeColour("grey");
	scene.instanceSet("glow_hide", "visible", true);
}

function changeColour(newColour)
{
	if (newColour != currentColour)
	{
		for (var i=0; i < swaps.length; i++)
		{
			if (swaps[i].type == "materialSwap")
			{
				if(swaps[i][currentColour] != swaps[i][newColour]){
					//setTimeout(function(){scene.materialReplace(swaps[i][currentColour], swaps[i][newColour]);},i*10);//stagger the swaps
					scene.materialReplace(swaps[i][currentColour], swaps[i][newColour]);
				}
			}

			else if (swaps[i].type == "visible")
			{
				scene.instanceSet(swaps[i].name, "visible", swaps[i][newColour]);
			}

		}
		currentColour  = newColour;
	}

	scene.clearRefine();
}

function onInitFlash()
{

	//console.log("init Flash");
	/*blackColour  = scene.createImage("blackColour", "images_gl/black_up.png");
	if (blackColour) blackColourBtn = scene.placeImage(blackColour, coordsToCentered(860, 219), 1, [0,0], "changeToBlack");
	blackColourDown  = scene.createImage("blackColourDown", "images_gl/black_down.png");
	if (blackColourDown) blackColourDownBtn = scene.placeImage(blackColourDown, coordsToCentered(860, 219), 1, [0,0], "changeToBlack");
	scene.imageSet(blackColourDownBtn, "alpha", 0);
	
	greyColour  = scene.createImage("greyColour", "images_gl/grey_up.png");
	if (greyColour) greyColourBtn = scene.placeImage(greyColour, coordsToCentered(860, 255), 1, [0,0], "changeToGrey");
	greyColourDown  = scene.createImage("greyColourDown", "images_gl/grey_down.png");
	if (greyColourDown) greyColourDownBtn = scene.placeImage(greyColourDown, coordsToCentered(860, 255), 1, [0,0], "changeToGrey");
	scene.imageSet(greyColourDownBtn, "alpha", 0);
	
	viewFinder  = scene.createImage("viewFinder", "images_gl/viewFinder_up.png");
	if (viewFinder) viewFinderBtn = scene.placeImage(viewFinder, coordsToCentered(860, 341), 1, [0,0], "viewFinderPressed");
	viewFinderDown  = scene.createImage("viewFinderDown", "images_gl/viewFinder_down.png");
	if (viewFinderDown) viewFinderDownBtn = scene.placeImage(viewFinderDown, coordsToCentered(860, 341), 1, [0,0], "viewFinderPressed");
	scene.imageSet(viewFinderDownBtn, "alpha", 0);
	
	backscreen  = scene.createImage("backscreen", "images_gl/screen_up.png");
	if (backscreen) screenBtn = scene.placeImage(backscreen, coordsToCentered(860, 384), 1, [0,0], "screenPressed");
	screenDown  = scene.createImage("screenDown", "images_gl/screen_down.png");
	if (screenDown) screenDownBtn = scene.placeImage(screenDown, coordsToCentered(860, 384), 1, [0,0], "screenPressed");
	scene.imageSet(screenDownBtn, "alpha", 0);
	
	flash  = scene.createImage("flash", "images_gl/flash_up.png");
	if (flash) flashBtn = scene.placeImage(flash, coordsToCentered(860, 427), 1, [0,0], "flashPressed");
	flashDown  = scene.createImage("flashDown", "images_gl/flash_down.png");
	if (flashDown) flashDownBtn = scene.placeImage(flashDown, coordsToCentered(860, 427), 1, [0,0], "flashPressed");
	scene.imageSet(flashDownBtn, "alpha", 0);*/
	
	reset  = scene.createImage("reset", "images_gl/reset_up.png");
	if (reset) resetBtn = scene.placeImage(reset, coordsToCentered(870, 475), 1, [0,0], "onResetCameraClick");
	resetDown  = scene.createImage("reset", "images_gl/reset_down.png");
	if (resetDown) resetDownBtn = scene.placeImage(resetDown, coordsToCentered(870, 475), 1, [0,0], "onResetCameraClick");
	scene.imageSet(resetDownBtn , "alpha", 0);
	
	scene.addZoomSlider(coordsToCentered(715, 480));
	
	_viewFinderOn = true;
	_flashOn = true;
	_screenOn = true;

}
var flash = false;
function _uiSetFlash()
{
	flash = true;
}

function onInit()
{	
	var curBrowser = BrowserDetect.browser;
	if (flash)
	{
		onInitFlash();
	}

	//scene.imageSet(resetDownBtn, "alpha", 0);
	scene.instanceSet("lense", "visible", true);
	scene.instanceSet("gp_lens", "visible", true);
	//scene.setParam("nav.mindist", 0.5);
	//scene.setParam("nav.maxdist", -1.0);
	scene.setParam("nav.mindistrotationrate", 0.035);
	scene.setParam("nav.maxdistrotationrate", 0.1);
	var allowZoomChange = true;
}
function showScene() {
	//console.log("showing scene");
	$("#scenediv").css("visibility","visible");
}

var panNav = false;
var debugMode = false; // always set this to false for the producton version !

var debugMenu = [
		{label:"Output Position",handler:"outputMatrixAndPan" , viewMatrix:"",viewPan:"",tip:"this is the tipitem1",tipx:0,tipy:0}
];
var initialised = 0;
function onEnterFrame()
{
	//console.log("hot_battery_closed: "+hot_battery_closed);
	_normalAnim = false;
	if (initialised == 0)
	{
		initialised = 1;
	}
}

// Fixed SuperBlaze Function triggered every frame
function onExitFrame()
{
}





var lastMatrix ; // matrix of 9 
var lastPan ; // array 
// handlers for clicks on the menu 



function outputMatrixAndPan() {
	// this function is only used in test mode to aquire panning info , should be copy pasted into the array above
	//console.log('{label:"xxx",handler:"menuItemClicked" , viewMatrix:"'+scene.getViewMatrix()+'",viewPan:"'+[g_navPan[0],g_navPan[1]]+'",tip:"xxxx",tipx:0,tipy:0}');	
}



function onHideMenu() {
	//console.log("Menu hiding");
	if(g_navEnabled) toggleControls(true); // dont toggle 
}

function onShowMenu(){
	//console.log("Menu showing");
	// happens 
	toggleControls(false);
}

function onInitMenu() {
	//console.log("Menu onInit");
}

function toggleControls(on) {
	if(on){
		//console.log("fade in controls");
		$("#zoomSliderContainer").fadeTo(1,1);
		//have to do it twice due to a bug in jquery
		
		$("#zoom_slider").slider( "option", "disabled", false );
		//$("#zoom_slider").disable();
		$("#screenSliderContainer").fadeTo(1,1);
		
		$("#screen_slider").slider( "option", "disabled", false );

		//$("#resetbutton").fadeTo(1,1);
		$("#infobut").fadeTo(1,1);
		
	}else{
		//console.log("fade out controls");
		$("#zoomSliderContainer").fadeTo(1,0.5);
        $("#zoom_slider").slider( "option", "disabled", true );
	
		//$("#zoom_slider").disable();
		$("#screenSliderContainer").fadeTo(1,0.5);

        $("#screen_slider").slider( "option", "disabled", true );
		
		//$("#screen_slider").disable();
		//$("#resetbutton").fadeTo(1,0.5);
		$("#infobut").fadeTo(1,0.5);
	}
}

function toggleUiVisible(on) {
	if(on){
		$("#slider").show();
		$("#slider2").show();
		$("#panTog").show();
	}else{
		$("#slider").hide();
		$("#slider2").hide();
		$("#panTog").hide();
	}

}




function NavOnDoneAnim(){
//scene.imageSet(overlayimage4, "alpha", 0);
	if(showTip){
		//a first endpoint 
		showOverlay(); 
		showTip = false;
		if(twoStageAnim == false){
			
			allowClick = true;
		}
	}else if(twoStageAnim == false){
		// final position but this is not a two stage
		clearCurrentOverlay();
		g_navEnabled = true; // this unlocks the navigation , can be found in ../SuperBlaze_Navigation.js 
		//ddMenu('one',-1); // ddropdown roll up
		//clearMenuHighlight();
		allowClick = true;
		toggleControls(true);
	}else{
		//this is sat in a final position of a two stage
		allowClick = true;
		twoStageAnim = false;
	}
		
	//console.log("heard anim finish aloowing click");
	//fade("feature");	
}; // defined in the ui javascript 

var menuItem;
var showTip = false;

function menuItemClicked ( index) {
	//console.log("pressed menu item" + index);
	menuItem = menuData[index];
	if(menuItem){
		switch(index){
			case 1 :
				scene.animPlay("screen",0.5, 20) // halfway position
				break;
			case 10:
				scene.animPlay("screen", 1, 20) // close position
				break;
			default:
				scene.animPlay("screen", 0, 20) // the default open position 
		}
		/*
		if(index == 1){
			scene.animPlay("screen",0.5, 20);
		}else{
			scene.animPlay("screen", 0, 20);
		}*/
		var nmatrix = menuItem.viewMatrix.split(",");
		var npan = menuItem.viewPan.split(",");
		scene.gotoPos(nmatrix,30);
		NavPanTo(npan,30);
		if(menuItem.tip){
			showTip = true;
		}
		$("#feature").fadeOut();
		if(!debugMode) g_navEnabled = false; // this locks the navigation found in Superblaze_Navigation.js
	}
	//clear the other backgrounds

	var i = 0;
	while(i < menuData.length){	
		var selector = "a#menu_item_"+i;
		if(i == index){
			$(selector).addClass("highlight");
		}else{
			$(selector).removeClass("highlight");
		}
		i++;
	}
}
var overlayindex = -1; // the overlay that is shown

function clearCurrentOverlay () {
	if(overlayindex != -1 && overlays[overlayindex]){
		scene.imageSet(overlays[overlayindex], "alpha", 0);
	}
}
function showOverlay () {
	if(overlayindex != -1){
		scene.imageSet(overlays[overlayindex], "alpha", 1);
	}
} 



var allowClick = true;

function preclick () {
	allowClick = false;
	//console.log("locked click");
	clearCurrentOverlay();
	showTip = true;
	g_navEnabled = false;
}

var twoStageAnim = false;