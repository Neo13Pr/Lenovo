// InfinityRT Navigation

var M_PI = 3.1415926535897932384626433832795028841968;

infinityrt_navigation = function (scene, w, h) {
    this._scene = scene;
    this._navMX = this._midx = w / 2;
    this._navMY = this._midy = h / 2;

    this._navEnabled = true;
    this._navMode = 0;
    this._navMinDolly = -100.0;
    this._navMaxDolly = 100.0;
    this._navSpeed = 5.0;
    this._navDecay = 0.25;

    this._navGotoPosFrames = 0;
    this._navGotoPosActive = false;
    this._navGotoPosQuatFrom = null;
    this._navGotoPosQuatTo = null;
    this._navGotoPosPanDelta = [0.0, 0.0];
    this._navGotoPosOnComplete = function () { };
    this._navGotoPosEnableSlowInOut = false;
    this._navDX = 0;
    this._navDY = 0;
    this._navXAng = 0;
    this._navYAng = 0;
    this._navDolly = 0.0;
    this._navMatLastView = null;
    this._navMatHierModel = null;
    this._navPan = [0.0, 0.0];
    this._navQuat = {};
    this.onSample = null;

    // Mode 2 Nav (Variables)
    this._navDXAng = 0;
    this._navDYAng = 0;
    this._navDPan = [0, 0];
    this._navDDolly = 0;
    this._navChange = false;
    // Mode 2 Nav (Parameters)
    this._navPanDolly = -15;        // Distance when pan changes to rotation
    this._navMode2DecayDown = 0.1;  // Mouse down decay
    this._navMode2DecayUp = 0.9;    // General decay
    this._navMode2Speed = 0.03;     // Navigation speed

    this._panMax = [8, 3];    //[left, bottom];
    this._panMin = [-5, -3];  //[right, top];
}

infinityrt_navigation.prototype.MatrixRotationAxis = function (fAngle, fX, fY, fZ) {
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

infinityrt_navigation.prototype.MatrixTranslation = function (fX, fY, fZ) {
    var mOut = Array();
    mOut[0] = 1.0; mOut[4] = 0.0; mOut[8] = 0.0; mOut[12] = fX;
    mOut[1] = 0.0; mOut[5] = 1.0; mOut[9] = 0.0; mOut[13] = fY;
    mOut[2] = 0.0; mOut[6] = 0.0; mOut[10] = 1.0; mOut[14] = fZ;
    mOut[3] = 0.0; mOut[7] = 0.0; mOut[11] = 0.0; mOut[15] = 1.0;
    return mOut;
}

infinityrt_navigation.prototype.MatrixInvert = function (m) {
    var r = new Array();
    var det = m[3] * m[6] * m[9] * m[12] - m[2] * m[7] * m[9] * m[12] - m[3] * m[5] * m[10] * m[12] + m[1] * m[7] * m[10] * m[12] +
		m[2] * m[5] * m[11] * m[12] - m[1] * m[6] * m[11] * m[12] - m[3] * m[6] * m[8] * m[13] + m[2] * m[7] * m[8] * m[13] +
		m[3] * m[4] * m[10] * m[13] - m[0] * m[7] * m[10] * m[13] - m[2] * m[4] * m[11] * m[13] + m[0] * m[6] * m[11] * m[13] +
		m[3] * m[5] * m[8] * m[14] - m[1] * m[7] * m[8] * m[14] - m[3] * m[4] * m[9] * m[14] + m[0] * m[7] * m[9] * m[14] +
		m[1] * m[4] * m[11] * m[14] - m[0] * m[5] * m[11] * m[14] - m[2] * m[5] * m[8] * m[15] + m[1] * m[6] * m[8] * m[15] +
		m[2] * m[4] * m[9] * m[15] - m[0] * m[6] * m[9] * m[15] - m[1] * m[4] * m[10] * m[15] + m[0] * m[5] * m[10] * m[15];
    if (det != 0) {
        var invdet = 1.0 / (det);
        (r)[0] = (m[6] * m[11] * m[13] - m[7] * m[10] * m[13] + m[7] * m[9] * m[14] - m[5] * m[11] * m[14] - m[6] * m[9] * m[15] + m[5] * m[10] * m[15]) * invdet;
        (r)[1] = (m[3] * m[10] * m[13] - m[2] * m[11] * m[13] - m[3] * m[9] * m[14] + m[1] * m[11] * m[14] + m[2] * m[9] * m[15] - m[1] * m[10] * m[15]) * invdet;
        (r)[2] = (m[2] * m[7] * m[13] - m[3] * m[6] * m[13] + m[3] * m[5] * m[14] - m[1] * m[7] * m[14] - m[2] * m[5] * m[15] + m[1] * m[6] * m[15]) * invdet;
        (r)[3] = (m[3] * m[6] * m[9] - m[2] * m[7] * m[9] - m[3] * m[5] * m[10] + m[1] * m[7] * m[10] + m[2] * m[5] * m[11] - m[1] * m[6] * m[11]) * invdet;
        (r)[4] = (m[7] * m[10] * m[12] - m[6] * m[11] * m[12] - m[7] * m[8] * m[14] + m[4] * m[11] * m[14] + m[6] * m[8] * m[15] - m[4] * m[10] * m[15]) * invdet;
        (r)[5] = (m[2] * m[11] * m[12] - m[3] * m[10] * m[12] + m[3] * m[8] * m[14] - m[0] * m[11] * m[14] - m[2] * m[8] * m[15] + m[0] * m[10] * m[15]) * invdet;
        (r)[6] = (m[3] * m[6] * m[12] - m[2] * m[7] * m[12] - m[3] * m[4] * m[14] + m[0] * m[7] * m[14] + m[2] * m[4] * m[15] - m[0] * m[6] * m[15]) * invdet;
        (r)[7] = (m[2] * m[7] * m[8] - m[3] * m[6] * m[8] + m[3] * m[4] * m[10] - m[0] * m[7] * m[10] - m[2] * m[4] * m[11] + m[0] * m[6] * m[11]) * invdet;
        (r)[8] = (m[5] * m[11] * m[12] - m[7] * m[9] * m[12] + m[7] * m[8] * m[13] - m[4] * m[11] * m[13] - m[5] * m[8] * m[15] + m[4] * m[9] * m[15]) * invdet;
        (r)[9] = (m[3] * m[9] * m[12] - m[1] * m[11] * m[12] - m[3] * m[8] * m[13] + m[0] * m[11] * m[13] + m[1] * m[8] * m[15] - m[0] * m[9] * m[15]) * invdet;
        (r)[10] = (m[1] * m[7] * m[12] - m[3] * m[5] * m[12] + m[3] * m[4] * m[13] - m[0] * m[7] * m[13] - m[1] * m[4] * m[15] + m[0] * m[5] * m[15]) * invdet;
        (r)[11] = (m[3] * m[5] * m[8] - m[1] * m[7] * m[8] - m[3] * m[4] * m[9] + m[0] * m[7] * m[9] + m[1] * m[4] * m[11] - m[0] * m[5] * m[11]) * invdet;
        (r)[12] = (m[6] * m[9] * m[12] - m[5] * m[10] * m[12] - m[6] * m[8] * m[13] + m[4] * m[10] * m[13] + m[5] * m[8] * m[14] - m[4] * m[9] * m[14]) * invdet;
        (r)[13] = (m[1] * m[10] * m[12] - m[2] * m[9] * m[12] + m[2] * m[8] * m[13] - m[0] * m[10] * m[13] - m[1] * m[8] * m[14] + m[0] * m[9] * m[14]) * invdet;
        (r)[14] = (m[2] * m[5] * m[12] - m[1] * m[6] * m[12] - m[2] * m[4] * m[13] + m[0] * m[6] * m[13] + m[1] * m[4] * m[14] - m[0] * m[5] * m[14]) * invdet;
        (r)[15] = (m[1] * m[6] * m[8] - m[2] * m[5] * m[8] + m[2] * m[4] * m[9] - m[0] * m[6] * m[9] - m[1] * m[4] * m[10] + m[0] * m[5] * m[10]) * invdet;
    }
    return r;
}

infinityrt_navigation.prototype.QuaternionFromRotationMatrix = function (m) {
    var m11 = m[0], m12 = m[4], m13 = m[8],
		m21 = m[1], m22 = m[5], m23 = m[9],
		m31 = m[2], m32 = m[6], m33 = m[10],
		trace = m11 + m22 + m33, s;
    if (trace > 0) {
        s = 0.5 / Math.sqrt(trace + 1.0);
        this._navQuat.w = 0.25 / s;
        this._navQuat.x = (m32 - m23) * s;
        this._navQuat.y = (m13 - m31) * s;
        this._navQuat.z = (m21 - m12) * s;
    } else if (m11 > m22 && m11 > m33) {
        s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);
        this._navQuat.w = (m32 - m23) / s;
        this._navQuat.x = 0.25 * s;
        this._navQuat.y = (m12 + m21) / s;
        this._navQuat.z = (m13 + m31) / s;
    } else if (m22 > m33) {
        s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);
        this._navQuat.w = (m13 - m31) / s;
        this._navQuat.x = (m12 + m21) / s;
        this._navQuat.y = 0.25 * s;
        this._navQuat.z = (m23 + m32) / s;
    } else {
        s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);
        this._navQuat.w = (m21 - m12) / s;
        this._navQuat.x = (m13 + m31) / s;
        this._navQuat.y = (m23 + m32) / s;
        this._navQuat.z = 0.25 * s;
    }
}

infinityrt_navigation.prototype.QuatSlerp = function (qa, qb, qm, t) {
    var cosHalfTheta = qa.w * qb.w + qa.x * qb.x + qa.y * qb.y + qa.z * qb.z;
    if (cosHalfTheta < 0) {
        qm.w = -qb.w;
        qm.x = -qb.x;
        qm.y = -qb.y;
        qm.z = -qb.z;
        cosHalfTheta = -cosHalfTheta;
    } else {
        qm.w = qb.w;
        qm.x = qb.x;
        qm.y = qb.y;
        qm.z = qb.z;
    }
    if (Math.abs(cosHalfTheta) >= 1.0) {
        qm.w = qa.w;
        qm.x = qa.x;
        qm.y = qa.y;
        qm.z = qa.z;
        return qm;
    }
    var halfTheta = Math.acos(cosHalfTheta);
    var sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);
    if (Math.abs(sinHalfTheta) < 0.001) {
        qm.w = 0.5 * (qa.w + qm.w);
        qm.x = 0.5 * (qa.x + qm.x);
        qm.y = 0.5 * (qa.y + qm.y);
        qm.z = 0.5 * (qa.z + qm.z);
        return qm;
    }
    var ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
    var ratioB = Math.sin(t * halfTheta) / sinHalfTheta;
    qm.w = (qa.w * ratioA + qm.w * ratioB);
    qm.x = (qa.x * ratioA + qm.x * ratioB);
    qm.y = (qa.y * ratioA + qm.y * ratioB);
    qm.z = (qa.z * ratioA + qm.z * ratioB);
    return qm;
}

infinityrt_navigation.prototype.NavStartGotoPos = function (yang, xang, xpan, ypan, dolly, numFrames, onComplete, onSample) {
    if (this._navMode == 1)
        return; // Not Supported, use NavStartGotoPosQuat
    if (onComplete !== undefined)
        this._navGotoPosOnComplete = onComplete;
    this.onSample = (onSample != undefined) ? onSample : null;

    while (yang < -M_PI) yang += 2 * M_PI;
    while (yang > M_PI) yang -= 2 * M_PI;

    this._navGotoPosActive = true;
    this._navGotoPosFrames = (numFrames == 0) ? 1 : numFrames;
    this._navGotoPosTimeSt = undefined;
    var gotoposDelta = 1.0 / this._navGotoPosFrames;

    this._navGotoPosDelta = {};
    if (this._navGotoPosEnableSlowInOut || this.onSample != null) {
        this._navGotoPosDelta.currentframesRatio = 0;
        this._navGotoPosDelta.framesRatio = gotoposDelta;
        // Rotation
        this._navGotoPosDelta.navXAng = { t0: this._navXAng, td: (xang - this._navXAng) };
        var yangDiff1 = yang - this._navYAng;
        var yangDiff2 = (2 * M_PI + yang) - this._navYAng;
        if (Math.abs(yangDiff1) < Math.abs(yangDiff2))
            this._navGotoPosDelta.navYAng = { t0: this._navYAng, td: yangDiff1 };
        else
            this._navGotoPosDelta.navYAng = { t0: this._navYAng, td: yangDiff2 };
        // Pan
        if (isNaN(xpan))
            this._navGotoPosDelta.navXPan = { t0: this._navPan[0], td: 0 };
        else
            this._navGotoPosDelta.navXPan = { t0: this._navPan[0], td: (xpan - this._navPan[0]) };
        if (isNaN(ypan))
            this._navGotoPosDelta.navYPan = { t0: this._navPan[1], td: 0 };
        else
            this._navGotoPosDelta.navYPan = { t0: this._navPan[1], td: (ypan - this._navPan[1]) };
        // Zoom
        this._navGotoPosDelta.navDolly = { t0: this._navDolly, td: (dolly - this._navDolly) };
    } else {
        // Rotation
        this._navGotoPosDelta.navXAng = gotoposDelta * (xang - this._navXAng);
        var yangDiff1 = yang - this._navYAng;
        var yangDiff2 = (2 * M_PI + yang) - this._navYAng;
        if (Math.abs(yangDiff1) < Math.abs(yangDiff2))
            this._navGotoPosDelta.navYAng = gotoposDelta * yangDiff1;
        else
            this._navGotoPosDelta.navYAng = gotoposDelta * yangDiff2;
        // Pan
        if (isNaN(xpan))
            this._navGotoPosDelta.navXPan = 0.0;
        else
            this._navGotoPosDelta.navXPan = gotoposDelta * (xpan - this._navPan[0]);
        if (isNaN(ypan))
            this._navGotoPosDelta.navYPan = 0.0;
        else
            this._navGotoPosDelta.navYPan = gotoposDelta * (ypan - this._navPan[1]);
        // Zoom
        this._navGotoPosDelta.navDolly = gotoposDelta * (dolly - this._navDolly);
    }
}

infinityrt_navigation.prototype.NavStartGotoPosInTime = function (yang, xang, xpan, ypan, dolly, durationInMS, onComplete, onSample) {
    if (this._navMode == 1)
        return; // Not Supported, use NavStartGotoPosQuatInTime
    if (onComplete !== undefined)
        this._navGotoPosOnComplete = onComplete;
    this.onSample = (onSample != undefined) ? onSample : null;

    while (yang < -M_PI) yang += 2 * M_PI;
    while (yang > M_PI) yang -= 2 * M_PI;

    this._navGotoPosActive = true;
    this._navGotoPosTimeSt = now();
    this._navGotoPosTimeDur = durationInMS;

    this._navGotoPosDelta = {};
    // Rotation
    this._navGotoPosDelta.navXAng = { t0: this._navXAng, td: (xang - this._navXAng) };
    var yangDiff1 = yang - this._navYAng;
    var yangDiff2 = (2 * M_PI + yang) - this._navYAng;
    if (Math.abs(yangDiff1) < Math.abs(yangDiff2))
        this._navGotoPosDelta.navYAng = { t0: this._navYAng, td: yangDiff1 };
    else
        this._navGotoPosDelta.navYAng = { t0: this._navYAng, td: yangDiff2 };
    // Pan
    if (isNaN(xpan))
        this._navGotoPosDelta.navXPan = { t0: this._navPan[0], td: 0 };
    else
        this._navGotoPosDelta.navXPan = { t0: this._navPan[0], td: (xpan - this._navPan[0]) };
    if (isNaN(ypan))
        this._navGotoPosDelta.navYPan = { t0: this._navPan[1], td: 0 };
    else
        this._navGotoPosDelta.navYPan = { t0: this._navPan[1], td: (ypan - this._navPan[1]) };
    // Zoom
    this._navGotoPosDelta.navDolly = { t0: this._navDolly, td: (dolly - this._navDolly) };
}

infinityrt_navigation.prototype.NavStartGotoPosQuat = function (qw, qx, qy, qz, xpan, ypan, dolly, numFrames, onComplete, onSample) {
    if (this._navMode == 0)
        return; // Not Supported, use NavStartGotoPos
    if (onComplete !== undefined)
        this._navGotoPosOnComplete = onComplete;
    this.onSample = (onSample != undefined) ? onSample : null;

    this._navGotoPosActive = true;
    this._navGotoPosFrames = numFrames;
    this._navGotoPosTimeSt = undefined;

    this._navGotoPosDelta = {};
    this._navGotoPosDelta.fraction = 1.0 / this._navGotoPosFrames;
    this._navGotoPosDelta.framesSoFar = 0;
    // Rotation
    this._navGotoPosDelta.qb = {};
    this._navGotoPosDelta.qb.x = qx;
    this._navGotoPosDelta.qb.y = qy;
    this._navGotoPosDelta.qb.z = qz;
    this._navGotoPosDelta.qb.w = qw;
    this._navGotoPosDelta.qm = {};
    // Pan
    if (isNaN(xpan))
        this._navGotoPosDelta.navXPan = 0.0;
    else
        this._navGotoPosDelta.navXPan = (xpan - this._navPan[0]);
    this._navGotoPosDelta.prevXPan = this._navPan[0];
    if (isNaN(ypan))
        this._navGotoPosDelta.navYPan = 0.0;
    else
        this._navGotoPosDelta.navYPan = (ypan - this._navPan[1]);
    this._navGotoPosDelta.prevYPan = this._navPan[1];
    // Zoom
    this._navGotoPosDelta.navDolly = (dolly - this._navDolly);
    this._navGotoPosDelta.prevDolly = this._navDolly;
}

infinityrt_navigation.prototype.NavCreateViewMatrix = function (initialViewMatrix) {
    this._navMatLastView = initialViewMatrix;
    if (this._navMode == 0 || this._navMode == 2) {
        if (this._navMode == 2) {
            var decay = (mdown || this._navChange) ? this._navMode2DecayDown : this._navMode2DecayUp;
            this._navChange = false;
            this._navDXAng *= decay;
            this._navDYAng *= decay;
            this._navDPan[0] *= decay;
            this._navDPan[1] *= decay;
            this._navDDolly *= decay;
            if (Math.abs(this._navDXAng) < 0.001) this._navDXAng = 0;
            if (Math.abs(this._navDYAng) < 0.001) this._navDYAng = 0;
            if (Math.abs(this._navDPan[0]) < 0.001) this._navDPan[0] = 0;
            if (Math.abs(this._navDPan[1]) < 0.001) this._navDPan[1] = 0;
            if (Math.abs(this._navDDolly) < 0.001) this._navDDolly = 0;
            if (this._navDXAng != 0.0 || this._navDYAng != 0.0 || this._navDPan[0] != 0.0 || this._navDPan[1] != 0.0 || this._navDDolly != 0.0) {
                // Rotation
                this._navXAng += this._navDXAng;
                this._navYAng += this._navDYAng;
                var fRotLimit = M_PI * 0.48;
                var fRotMinLimit = -M_PI * 0.48;
                if (this._navXAng > fRotLimit)
                    this._navXAng = fRotLimit;
                else if (this._navXAng < fRotMinLimit)
                    this._navXAng = fRotMinLimit;
                while (this._navYAng < 0.0) this._navYAng += 2 * M_PI;
                while (this._navYAng > 2 * M_PI) this._navYAng -= 2 * M_PI;
                // Pan
                this._navPan[0] += this._navDPan[0];
                this._navPan[1] += this._navDPan[1];
                if (this._navPan[0] > this._panMax[0]) this._navPan[0] = this._panMax[0];
                if (this._navPan[1] > this._panMax[1]) this._navPan[1] = this._panMax[1];
                if (this._navPan[0] < this._panMin[0]) this._navPan[0] = this._panMin[0];
                if (this._navPan[1] < this._panMin[1]) this._navPan[1] = this._panMin[1];
                // Dolly
                this._navDolly += this._navDDolly;
                if (this._navDolly < this._navMinDolly)
                    this._navDolly = this._navMinDolly;
                else if (this._navDolly > this._navMaxDolly)
                    this._navDolly = this._navMaxDolly;
                //
                this._scene.clearRefine();
            }
        }
        if (this._navGotoPosActive) {
            var s0, animcomplete = false;
            if (this._navGotoPosFrames < 1)
                this._navGotoPosFrames = 1;

            if (typeof (this._navGotoPosTimeSt) != "undefined") {
                s0 = (now() - this._navGotoPosTimeSt) / this._navGotoPosTimeDur;
                if (s0 >= 1.0) {
                    animcomplete = true;
                    s0 = 1.0;
                }
                if (this.onSample != null)
                    s0 = this.onSample(s0);
                else if (this._navGotoPosEnableSlowInOut)
                    s0 = slowinout(s0, this._scene._slowinoutfac);
                this._navXAng = this._navGotoPosDelta.navXAng.t0 + s0 * this._navGotoPosDelta.navXAng.td;
                this._navYAng = this._navGotoPosDelta.navYAng.t0 + s0 * this._navGotoPosDelta.navYAng.td;
                this._navPan[0] = this._navGotoPosDelta.navXPan.t0 + s0 * this._navGotoPosDelta.navXPan.td;
                this._navPan[1] = this._navGotoPosDelta.navYPan.t0 + s0 * this._navGotoPosDelta.navYPan.td;
                this._navDolly = this._navGotoPosDelta.navDolly.t0 + s0 * this._navGotoPosDelta.navDolly.td;
            } else if (this._navGotoPosEnableSlowInOut || this.onSample != null) {
                this._navGotoPosDelta.currentframesRatio += this._navGotoPosDelta.framesRatio;
                if (this.onSample != null)
                    s0 = this.onSample(this._navGotoPosDelta.currentframesRatio);
                else 
                    s0 = slowinout(this._navGotoPosDelta.currentframesRatio, this._scene._slowinoutfac);
                this._navXAng = this._navGotoPosDelta.navXAng.t0 + s0 * this._navGotoPosDelta.navXAng.td;
                this._navYAng = this._navGotoPosDelta.navYAng.t0 + s0 * this._navGotoPosDelta.navYAng.td;
                this._navPan[0] = this._navGotoPosDelta.navXPan.t0 + s0 * this._navGotoPosDelta.navXPan.td;
                this._navPan[1] = this._navGotoPosDelta.navYPan.t0 + s0 * this._navGotoPosDelta.navYPan.td;
                this._navDolly = this._navGotoPosDelta.navDolly.t0 + s0 * this._navGotoPosDelta.navDolly.td;
            } else {
                this._navXAng += this._navGotoPosDelta.navXAng;
                this._navYAng += this._navGotoPosDelta.navYAng;
                this._navPan[0] += this._navGotoPosDelta.navXPan;
                this._navPan[1] += this._navGotoPosDelta.navYPan;
                this._navDolly += this._navGotoPosDelta.navDolly;
            }

            // Rotation
            mTmp = MatrixRotationAxis(this._navYAng, 0.0, 1.0, 0.0);
            this._navMatLastView = MatrixMultiply(this._navMatLastView, mTmp);
            mTmp = MatrixRotationAxis(-this._navXAng, this._navMatLastView[0], this._navMatLastView[1], this._navMatLastView[2]);
            this._navMatLastView = MatrixMultiply(this._navMatLastView, mTmp);
            // Zoom
            mTmp = MatrixTranslation(this._navMatLastView[8] * this._navDolly, this._navMatLastView[9] * this._navDolly, this._navMatLastView[10] * this._navDolly);
            this._navMatLastView = MatrixMultiply(this._navMatLastView, mTmp);

            if (typeof (this._navGotoPosTimeSt) == "undefined") {
                this._navGotoPosFrames -= 1;
                animcomplete = (this._navGotoPosFrames == 0);
            }

            if (animcomplete) {
                var navobject = this;
                setTimeout(function () {
                    navobject._navGotoPosDelta = null;
                    navobject._navGotoPosActive = false;
                    navobject._navGotoPosOnComplete();
                    navobject._navGotoPosOnComplete = function () { };
                    if (typeof (NavOnDoneAnim) != "undefined")
                        NavOnDoneAnim();
                }, 50);
            }
        } else {
            // Rotation
            mTmp = MatrixRotationAxis(this._navYAng, 0.0, 1.0, 0.0);
            this._navMatLastView = MatrixMultiply(this._navMatLastView, mTmp);
            mTmp = MatrixRotationAxis(-this._navXAng, this._navMatLastView[0], this._navMatLastView[1], this._navMatLastView[2]);
            this._navMatLastView = MatrixMultiply(this._navMatLastView, mTmp);
            // Zoom
            mTmp = MatrixTranslation(this._navMatLastView[8] * this._navDolly, this._navMatLastView[9] * this._navDolly, this._navMatLastView[10] * this._navDolly);
            this._navMatLastView = MatrixMultiply(this._navMatLastView, mTmp);
        }
    } else {
        // Zoom
        mTmp = MatrixTranslation(this._navMatLastView[8] * this._navDolly, this._navMatLastView[9] * this._navDolly, this._navMatLastView[10] * this._navDolly);
        this._navMatLastView = MatrixMultiply(this._navMatLastView, mTmp);

        if (this._navGotoPosActive) {
            if (this._navGotoPosFrames == 1) {
                if (typeof (NavOnDoneAnim) != "undefined")
                    NavOnDoneAnim();
            }
        }
    }
    return this._navMatLastView;
}

infinityrt_navigation.prototype.NavCreateModelMatrix = function (initialViewMatrix) {
    if (this._navMatHierModel == null)
        this._navMatHierModel = infinityrt_identity.slice(0);
    if (this._navMode == 1) {
        if (this._navGotoPosActive) {
            if (this._navGotoPosFrames < 1)
                this._navGotoPosFrames = 1;
            this._navGotoPosDelta.framesSoFar++;

            var t = this._navGotoPosDelta.fraction * this._navGotoPosDelta.framesSoFar;
            var thefraction = Math.sin(t * 3.14159 * 0.5);
            this._navPan[0] = this._navGotoPosDelta.prevXPan + thefraction * this._navGotoPosDelta.navXPan;
            this._navPan[1] = this._navGotoPosDelta.prevYPan + thefraction * this._navGotoPosDelta.navYPan;
            this._navDolly = this._navGotoPosDelta.prevDolly + thefraction * this._navGotoPosDelta.navDolly;

            this.QuatSlerp(this._navQuat, this._navGotoPosDelta.qb, this._navGotoPosDelta.qm, t);
            this._navQuat.w = this._navGotoPosDelta.qm.w;
            this._navQuat.x = this._navGotoPosDelta.qm.x;
            this._navQuat.y = this._navGotoPosDelta.qm.y;
            this._navQuat.z = this._navGotoPosDelta.qm.z;

            var x = this._navQuat.x, y = this._navQuat.y, z = this._navQuat.z, w = this._navQuat.w;
            var x2 = x + x, y2 = y + y, z2 = z + z;
            var xx = x * x2, xy = x * y2, xz = x * z2;
            var yy = y * y2, yz = y * z2, zz = z * z2;
            var wx = w * x2, wy = w * y2, wz = w * z2;

            this._navMatHierModel[0] = 1 - (yy + zz);
            this._navMatHierModel[4] = xy - wz;
            this._navMatHierModel[8] = xz + wy;

            this._navMatHierModel[1] = xy + wz;
            this._navMatHierModel[5] = 1 - (xx + zz);
            this._navMatHierModel[9] = yz - wx;

            this._navMatHierModel[2] = xz - wy;
            this._navMatHierModel[6] = yz + wx;
            this._navMatHierModel[10] = 1 - (xx + yy);

            this._navGotoPosFrames -= 1;
            if (this._navGotoPosFrames == 0) {
                this._navGotoPosDelta = null;
                this._navGotoPosActive = false;
                this._navGotoPosOnComplete();
                this._navGotoPosOnComplete = function() { };
            }
        } else {
            var coffx = (this._navMX - this._midx);
            var coffy = (this._navMY - this._midy);
            var mouserad = Math.sqrt(coffx * coffx + coffy * coffy);
            var mousespeed = Math.sqrt(this._navDX * this._navDX + this._navDY * this._navDY);

            if (mousespeed < 0.001)
                mousespeed = 0.001;

            // find radial and circumferential components
            var radx = (this._navMX - this._midx) / (mouserad + 1.0);
            var rady = (this._navMY - this._midy) / (mouserad + 1.0);
            var cirx = rady;
            var ciry = -radx;
            var circum = this._navDX * cirx + this._navDY * ciry * 0.1; //circumferential component of velocity
            var radial = this._navDX * radx + this._navDY * rady; //radial component of velocity
            if (radial < 0.0)
                radial = -radial;
            radial *= this._navSpeed;
            radial /= (180.0 * M_PI);
            circum *= this._navSpeed;
            circum /= (180.0 * M_PI);
            if (radial > 0 || circum > 0) {
                var mouseMoveInX = this._navDX / mousespeed;
                var mouseMoveInY = this._navDY / mousespeed;
                var zAngle = Math.acos(mouseMoveInY);
                if (mouseMoveInX < 0.0)
                    zAngle = (M_PI * 2.0) - zAngle;
                // apply radial and circumferential components to root hierarchical matrix
                var mTmp = MatrixRotationAxis(-zAngle, initialViewMatrix[8], initialViewMatrix[9], initialViewMatrix[10]);
                this._navMatHierModel = MatrixMultiply(this._navMatHierModel, mTmp);
                mTmp = MatrixRotationAxis(radial, initialViewMatrix[0], initialViewMatrix[1], initialViewMatrix[2]);
                this._navMatHierModel = MatrixMultiply(this._navMatHierModel, mTmp);
                mTmp = MatrixRotationAxis(zAngle, initialViewMatrix[8], initialViewMatrix[9], initialViewMatrix[10]);
                this._navMatHierModel = MatrixMultiply(this._navMatHierModel, mTmp);
                mTmp = MatrixRotationAxis(circum, initialViewMatrix[8], initialViewMatrix[9], initialViewMatrix[10]);
                this._navMatHierModel = MatrixMultiply(this._navMatHierModel, mTmp);
                // Update Quaternion values
                this.QuaternionFromRotationMatrix(this._navMatHierModel);
                this._scene.clearRefine();
            }
            // (Momentum) decay cursor delta
            this._navDX *= this._navDecay;
            this._navDY *= this._navDecay;
            if (Math.abs(this._navDX) < 1.0 && Math.abs(this._navDY) < 1.0) {
                this._navDX = this._navDY = 0;  // clear cursor delta
            }
        }
    }
    return this._navMatHierModel;
}

infinityrt_navigation.prototype.NavChangeDolly = function (delta) {
    if (!this._navEnabled)
        return false;

    if (this._navMode == 2) {
        this._navDDolly -= delta * this._navMode2Speed * 30;
        this._navChange = true;
    } else {
        this._navDolly -= delta;
        if (this._navDolly < this._navMinDolly)
            this._navDolly = this._navMinDolly;
        else if (this._navDolly > this._navMaxDolly)
            this._navDolly = this._navMaxDolly;
    }
    return true;
}

infinityrt_navigation.prototype.NavRotation = function (mpos, mdelta) {
    if (!this._navEnabled)
        return false;

    if (this._navMode == 2) {
        if (this._navDolly <= this._navPanDolly)
            return NavPan(mdelta);
        this._navDXAng -= mdelta[1] * this._navMode2Speed;
        this._navDYAng += mdelta[0] * this._navMode2Speed;
        this._navChange = true;
    }
    else if (this._navMode == 1) {
        this._navMX = mpos[0]; this._navMY = mpos[1];
        this._navDX = -mdelta[0]; this._navDY = -mdelta[1];
    }
    else {
        this._navXAng -= mdelta[1] / 30.0;
        this._navYAng += mdelta[0] / 30.0;
        var fRotLimit = M_PI * 0.48;
        var fRotMinLimit = -M_PI * 0.48;
        if (this._navXAng > fRotLimit)
            this._navXAng = fRotLimit;
        else if (this._navXAng < fRotMinLimit)
            this._navXAng = fRotMinLimit;
        while (this._navYAng < 0.0) this._navYAng += 2 * M_PI;
        while (this._navYAng > 2 * M_PI) this._navYAng -= 2 * M_PI;
    }
    return true;
}

infinityrt_navigation.prototype.NavPan = function (mdelta) {
    if (!this._navEnabled)
        return false;

    if (this._navMode == 2) {
        this._navDPan[0] += mdelta[0] * this._navMode2Speed;
        this._navDPan[1] -= mdelta[1] * this._navMode2Speed;
        this._navChange = true;
    }
    else {
        this._navPan[0] += mdelta[0] / 75.0;
        this._navPan[1] -= mdelta[1] / 75.0;

        if (this._navPan[0] > this._panMax[0]) this._navPan[0] = this._panMax[0];
        if (this._navPan[1] > this._panMax[1]) this._navPan[1] = this._panMax[1];
        if (this._navPan[0] < this._panMin[0]) this._navPan[0] = this._panMin[0];
        if (this._navPan[1] < this._panMin[1]) this._navPan[1] = this._panMin[1];
    }

    return true;
}