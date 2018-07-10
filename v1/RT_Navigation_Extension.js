// this is an extension of RT navigation with some functions needed by hmx

var navMinDolly = this._navMinDolly;
var navMaxDolly = this._navMaxDolly;

function NavSetDolly(newval)
{
	//console.log("newval "+newval+" max: "+navMaxDolly+" min: "+navMinDolly);
	if (!g_navEnabled)
		return false;

	if (newval < navMinDolly){ 
        newval = navMinDolly;
	}else if (newval > navMaxDolly){ 
        newval = navMaxDolly;
	}
	
	g_navDolly = newval;
    return true;
}

function setPan(newpan) {
	g_navPan[0] = newpan[0];
	g_navPan[1] = newpan[1];
}

function NavPanTo(panCord,frames){
	g_navGotoPosFrames = frames;
    gotoposTime = 0.0;
    gotoposDelta = 1.0 / g_navGotoPosFrames;
    g_navGotoPosPanDelta = [ (g_navPan[0]-panCord[0])/g_navGotoPosFrames,(g_navPan[1]-panCord[1])/g_navGotoPosFrames ];
    g_navGotoPosActive = true;	
}