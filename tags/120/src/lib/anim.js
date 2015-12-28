var canvas,canvasContext,gfx, rotation = 1, factor = 1, animTimer, loopTimer, animDelay = 10;
//initAnim();

function initAnim(){
	canvas = document.getElementById('canvas');
	canvasContext = canvas.getContext('2d');
}
function startAnimate(){
    stopAnimateLoop();
    if (localStorage["gc_animate_off"] == null ||
    localStorage["gc_animate_off"] == "false") {
        animTimer = setInterval("doAnimate()", animDelay);
        setTimeout("stopAnimate()", 2000);
        loopTimer = setTimeout("startAnimate()", 20000);
    }
}

function stopAnimate(){
    if (animTimer != null) clearTimeout(animTimer);
    if (unreadCount > 0) 
        setIcon(img_newSrc);
    else 
        setIcon(img_noNewSrc);
    rotation = 1;
    factor = 1;
}

function stopAnimateLoop(){
    if (loopTimer != null) clearTimeout(loopTimer);
    stopAnimate();
}

function doAnimate(){
    canvasContext.save();
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    canvasContext.translate(Math.ceil(canvas.width / 2), Math.ceil(canvas.height / 2));
    canvasContext.rotate(rotation * 2 * Math.PI);
    canvasContext.drawImage(gfx, -Math.ceil(canvas.width / 2), -Math.ceil(canvas.height / 2));
    canvasContext.restore();
    rotation += 0.01 * factor;
    if (rotation <= 0.9 && factor < 0) 
        factor = 1;
    else if (rotation >= 1.1 && factor > 0) factor = -1;
    chrome.browserAction.setIcon({
        imageData: canvasContext.getImageData(0, 0, canvas.width, canvas.height)
    });
}
