// --------------------------------------------------------START----------------------------------------------------------//
// --------------------------------------------------------do not edit or remove----------------------------------------------------------//
var blaze3d_normalize = function(pt) {
    var d = Math.sqrt((pt[0] * pt[0]) + (pt[1] * pt[1]) + (pt[2] * pt[2]));
    if (d == 0) return [0, 0, 0];
    return [pt[0] / d, pt[1] / d, pt[2] / d];
}
var blaze3d_dp = function(v1, v2) {
    return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
}

function MatrixGetX(m) {
    return [m[0], m[1], m[2]];
}

function MatrixGetY(m) {
    return [m[4], m[5], m[6]];
}

function MatrixGetZ(m) {
    return blaze3d_normalize([0 - m[0], 0 - m[1], 0 - m[2]]);
}

function MatrixGetPos(m) {
    return [m[0], m[1], m[2]];
}

function MatrixRotationAxis(fAngle, fX, fY, fZ) {
    var s = Math.sin(fAngle);
    var c = Math.cos(fAngle);
    var x = fX;
    var y = fY;
    var z = fZ;
    var mOut = Array();
    mOut[0] = x * x * (1 - c) + c;
    mOut[4] = x * y * (1 - c) - (z * s);
    mOut[8] = x * z * (1 - c) + (y * s);
    mOut[12] = 0;
    mOut[1] = y * x * (1 - c) + (z * s);
    mOut[5] = y * y * (1 - c) + c;
    mOut[9] = y * z * (1 - c) - (x * s);
    mOut[13] = 0;
    mOut[2] = z * x * (1 - c) - (y * s);
    mOut[6] = z * y * (1 - c) + (x * s);
    mOut[10] = z * z * (1 - c) + c;
    mOut[14] = 0.0;
    mOut[3] = 0.0;
    mOut[7] = 0.0;
    mOut[11] = 0.0;
    mOut[15] = 1.0;
    return mOut;
}


//final changes done. github uploaded// changes by Dharmendra
function MatrixMultiply(mA, mB) {
        var mRet = Array();
        // Perform calculation on a dummy matrix (mRet)
        mRet[0] = mA[0] * mB[0] + mA[1] * mB[4] + mA[2] * mB[8] + mA[3] * mB[12];
        mRet[1] = mA[0] * mB[1] + mA[1] * mB[5] + mA[2] * mB[9] + mA[3] * mB[13];
        mRet[2] = mA[0] * mB[2] + mA[1] * mB[6] + mA[2] * mB[10] + mA[3] * mB[14];
        mRet[3] = mA[0] * mB[3] + mA[1] * mB[7] + mA[2] * mB[11] + mA[3] * mB[15];
        //
        mRet[4] = mA[4] * mB[0] + mA[5] * mB[4] + mA[6] * mB[8] + mA[7] * mB[12];
        mRet[5] = mA[4] * mB[1] + mA[5] * mB[5] + mA[6] * mB[9] + mA[7] * mB[13];
        mRet[6] = mA[4] * mB[2] + mA[5] * mB[6] + mA[6] * mB[10] + mA[7] * mB[14];
        mRet[7] = mA[4] * mB[3] + mA[5] * mB[7] + mA[6] * mB[11] + mA[7] * mB[15];
        //
        mRet[8] = mA[8] * mB[0] + mA[9] * mB[4] + mA[10] * mB[8] + mA[11] * mB[12];
        mRet[9] = mA[8] * mB[1] + mA[9] * mB[5] + mA[10] * mB[9] + mA[11] * mB[13];
        mRet[10] = mA[8] * mB[2] + mA[9] * mB[6] + mA[10] * mB[10] + mA[11] * mB[14];
        mRet[11] = mA[8] * mB[3] + mA[9] * mB[7] + mA[10] * mB[11] + mA[11] * mB[15];
        //
        mRet[12] = mA[12] * mB[0] + mA[13] * mB[4] + mA[14] * mB[8] + mA[15] * mB[12];
        mRet[13] = mA[12] * mB[1] + mA[13] * mB[5] + mA[14] * mB[9] + mA[15] * mB[13];
        mRet[14] = mA[12] * mB[2] + mA[13] * mB[6] + mA[14] * mB[10] + mA[15] * mB[14];
        mRet[15] = mA[12] * mB[3] + mA[13] * mB[7] + mA[14] * mB[11] + mA[15] * mB[15];
        return mRet
    }

// --------------------------------------------------------do not edit or remove----------------------------------------------------------//
// --------------------------------------------------------END----------------------------------------------------------//

function showScene() {
	 /*scene._slowinoutfac=.4;*/
   $("#scenediv").css("visibility", "visible");
   $("#zoom_slider").slider("option", "value", 120);
    for (var j = 1; j <= 10; j++) {translateOut(j);}
    $('#transparentPatch').css('display','none');
	$("#scenediv").css("visibility","visible");
 
              
        $('#transPatch').css('display','none');
        $("#loaderlogo").fadeIn(500);
        animComplete();
        scene.clearRefine();
  
       currneAnim = 1;
	
    $("#loaderlogo").fadeIn(500);

}

function onResetCameraClickGL() {    
    if (!animStoped || !clickEventActive) return;
	menu5wasClick=false;
   animStoped=false;
        currneAnim = 1;
        $(".menuitems").removeClass("active");
    clearSets();
        /*$("#menu2").addClass("active");*/
    /* $("#menu7").addClass("disabled");
    $("#menu8").addClass("disabled");*/
        autoPauseAllAnimations();
        $("#pointtext2").css("display","none");
        $("#pointtext5").css("display","none");
    	       objectHide();
    $(".fadingEffect").removeAttr("style");
     $("#firstSlideheadWrapper").css("display","block");
        $("#firstSlideWrapper").css("display","block");

        
    callbackChain();
	    scene.instanceSet("TD350", "visible", false);
        scene.instanceSet("gp_plane", "visible", false);
    	
//for (var j = 1; j <= 10; j++) {translateOut(j);}
//   scene.gotoPosInTime(-0.12393220699196306,-0.00942477796076938,11.463212601069428,1.973262264125228,6.371349243271649,1000, function () {
        animComplete();
//    });   
    scene.clearRefine();
}

var currentColour = "close";
var swaps = [
{
    type:"materialSwap",
    close:"AA_set_01_Bezel_Black_env_Closed",
    open_without_wire_:"AA_set_01_Bezel_Black_env_Open_without_wire"
},{
    type:"materialSwap",
    close:"BB_set_01_Dull_Black_env_Closed",
    open_without_wire_:"BB_set_01_Dull_Black_env_Open_without_wire"
},{
    type:"materialSwap",
    close:"CC_set_02_top_case_part_env_Closed",
    open_without_wire_:"CC_set_02_top_case_part_env_Open_without_wire"
},{
    type:"materialSwap",
    close:"DD_set_03_bottom_case_part_env_Closed",
    open_without_wire_:"DD_set_03_bottom_case_part_env_Open_without_wire"
},{
    type:"materialSwap",
    close:"EE_set_04_port_gate_case_part_env_Closed",
    open_without_wire_:"EE_set_04_port_gate_case_part_env_Open_without_wire"
},{
    type:"materialSwap",
    close:"FF_set_05_Plastic_Black_env_Closed",
    open_without_wire_:"FF_set_05_Plastic_Black_env_Open_without_wire"
},{
    type:"materialSwap",
    close:"GG_set_05_Plugs_env_Closed",
    open_without_wire_:"GG_set_05_Plugs_env_Open_without_wire"
},{
    type:"materialSwap",
    close:"HH_set_05_Screws_env_Closed",
    open_without_wire_:"HH_set_05_Screws_env_Open_without_wire"
},{
    type:"materialSwap",
    close:"JJ_set_05_Wires_env_Closed_Open_without_wire",
    open_without_wire_:"JJ_set_05_Wires_env_Closed_Open_without_wire"
},{
    type:"materialSwap",
    close:"KK_set_05__LED_env_Closed",
    open_without_wire_:"KK_set_05__LED_env_Open_without_wire"
},{
    type:"materialSwap",
    close:"LL_set_05_black_plastic_env_Closed_set_05_black_plastic_mat",
    open_without_wire_:"LL_set_05_black_plastic_env_Open_without_wire"
},{
    type:"materialSwap",
    close:"MM_set_05_black_rubber_env_Closed_set_05_black_rubber_mat",
    open_without_wire_:"MM_set_05_black_rubber_env_Open_without_wire"
},{
    type:"materialSwap",
    close:"NN_set_05_pin_chrome_env_Closed_set_05_pin_chrome_mat",
    open_without_wire_:"NN_set_05_pin_chrome_env_Open_without_wire"
},{
    type:"materialSwap",
    close:"OO_set_05_plastic_env_Closed",
    open_without_wire_:"OO_set_05_plastic_env_Open_without_wire"
},{
    type:"materialSwap",
    close:"PP_set_05_port_chrome_env_Closed_set_05_port_chrome_mat",
    open_without_wire_:"PP_set_05_port_chrome_env_Open_without_wire"
},{
    type:"materialSwap",
    close:"QQ_set_05_port_dull_env_Closed",
    open_without_wire_:"QQ_set_05_port_dull_env_Open_without_wire"
},{
    type:"materialSwap",
    close:"RR_set_05_port_plate_env_Closed",
    open_without_wire_:"RR_set_05_port_plate_env_Open_without_wire"
},{
    type:"materialSwap",
    close:"SS_set_04_hole_wall_env_Closed",
    open_without_wire_:"SS_set_04_hole_wall_env_Open_with_wire"
},{
    type:"materialSwap",
    close:"TT_set_01_screen_pole_env_Closed",
    open_without_wire_:"TT_set_01_screen_pole_env_Open_with_wire"
},{
    type:"materialSwap",
    close:"UU_set_03_hole_back_wall_env_Closed",
    open_without_wire_:"UU_set_03_hole_back_wall_env_Open_with_wire"
},{
    type:"materialSwap",
    close:"VV_set_05_led_green_env_Closed",
    open_without_wire_:"VV_set_05_led_green_env_Open_without_wire"
},{
    type:"materialSwap",
    close:"WW_set_05_usb_crome_env_Open_without_wire",
    open_without_wire_:"WW_set_05_usb_crome_env_Closed"
},{
    type:"materialSwap",
    close:"XX_set_05_usb_copper_env_Closed",
    open_without_wire_:"XX_set_05_usb_copper_env_Open_without_wire"
},{
    type:"materialSwap",
    close:"YY_set_05_black_plastic_usb_env_Closed",
    open_without_wire_:"YY_set_05_black_plastic_usb_env_Open_without_wire"
},{
    type:"materialSwap",
    close:"ZZ_screen_shadow_env",
    open_without_wire_:"ZZ_screen_shadow_env"
},
];

function changeColour(newColour)
{
//    console.log("desepticons");
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



var currentColour1 = "homeScreen";
var swaps1 = [
{
    type:"materialSwap",
    homeScreen:"FF_Screen_Home_env",
    adhocScreen:"FF_Screen_Adhoc_meeting_env"
}
];

function changeColour1(newColour1)
{
//    console.log("desepticons");
	if (newColour1 != currentColour1)
	{
		for (var i=0; i < swaps1.length; i++)
		{
			if (swaps1[i].type == "materialSwap")
			{
				if(swaps1[i][currentColour1] != swaps1[i][newColour1]){
					//setTimeout(function(){scene.materialReplace(swaps[i][currentColour], swaps[i][newColour]);},i*10);//stagger the swaps
					scene.materialReplace(swaps1[i][currentColour1], swaps1[i][newColour1]);
				}
			}

			else if (swaps1[i].type == "visible")
			{
				scene.instanceSet(swaps1[i].name, "visible", swaps1[i][newColour1]);
			}

		}
		currentColour1  = newColour1;
	}

	scene.clearRefine();
}