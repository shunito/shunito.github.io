
(function() {

    // Brailpiano
    var str = "";
    var brStr = "";
    var brCode = [];
    var speaking = false;
    
    brCode['000000'] = '2800';
    brCode['100000'] = '2801';
    brCode['010000'] = '2802';
    brCode['110000'] = '2803';
    brCode['001000'] = '2804';
    brCode['101000'] = '2805';
    brCode['011000'] = '2806';
    brCode['111000'] = '2807';
    brCode['000100'] = '2808';
    brCode['100100'] = '2809';
    brCode['010100'] = '280a';
    brCode['110100'] = '280b';
    brCode['001100'] = '280c';
    brCode['101100'] = '280d';
    brCode['011100'] = '280e';
    brCode['111100'] = '280f';

    brCode['000010'] = '2810';
    brCode['100010'] = '2811';
    brCode['010010'] = '2812';
    brCode['110010'] = '2813';
    brCode['001010'] = '2814';
    brCode['101010'] = '2815';
    brCode['011010'] = '2816';
    brCode['111010'] = '2817';
    brCode['000110'] = '2818';
    brCode['100110'] = '2819';
    brCode['010110'] = '281a';
    brCode['110110'] = '281b';
    brCode['001110'] = '281c';
    brCode['101110'] = '281d';
    brCode['011110'] = '281e';
    brCode['111110'] = '281f';

    brCode['000001'] = '2820';
    brCode['100001'] = '2821';
    brCode['010001'] = '2822';
    brCode['110001'] = '2823';
    brCode['001001'] = '2824';
    brCode['101001'] = '2825';
    brCode['011001'] = '2826';
    brCode['111001'] = '2827';
    brCode['000101'] = '2828';
    brCode['100101'] = '2829';
    brCode['010101'] = '282a';
    brCode['110101'] = '282b';
    brCode['001101'] = '282c';
    brCode['101101'] = '282d';
    brCode['011101'] = '282e';
    brCode['111101'] = '282f';

    brCode['000011'] = '2830';
    brCode['100011'] = '2831';
    brCode['010011'] = '2832';
    brCode['110011'] = '2833';
    brCode['001011'] = '2834';
    brCode['101011'] = '2835';
    brCode['011011'] = '2836';
    brCode['111011'] = '2837';
    brCode['000111'] = '2838';
    brCode['100111'] = '2839';
    brCode['010111'] = '283a';
    brCode['110111'] = '283b';
    brCode['001111'] = '283c';
    brCode['101111'] = '283d';
    brCode['011111'] = '283e';
    brCode['111111'] = '283f';

    var sourceList = [];
    var fileList = [];
    var bufferLoader;
    var context;
    var timer, count = 0;

    var tempo = 140; // BPM (beats per minute)
    var eighthNoteTime = (60 / tempo) / 2;

    var codeList = ["C3", "D3", "E3", "F3", "G3", "A3", "B3", "C4", "BD", "DH", "S1", "S2"];
    var mInstruments = "piano";
    var ext = '.wav';

    // ***********************************
    // Settings
    // ***********************************

    function log(log) {
        if (typeof console === "undefined") {
            alert(log);
        } else if (typeof log === "object") {
            console.table(log);
        } else {
            console.log(log);
        }
    }

    // unbined touchmove Event
    document.body.addEventListener('touchmove', function(event) {
      event.preventDefault();
    }, false);

    // Get Audio Context
    window.AudioContext = window.AudioContext || window.webkitAudioContext || null;
    if (window.AudioContext === null) {
        return false;
    }
    context = new AudioContext();
    if((new Audio()).canPlayType('audio/ogg') == 'maybe') { ext = '.ogg'; }

    // Create a gain node.
    var gainNode = context.createGain();
    gainNode.connect(context.destination);
    gainNode.gain.value = 1.0;


    // check TTS Supporte
    var tts, msg;
    if (!'SpeechSynthesisUtterance' in window) {
        tts = false;
    }
    else{
        tts = true;
        msg = new SpeechSynthesisUtterance();

        // TTS Settings
        msg.volume = 1;
        msg.rate = 1;
        msg.pitch = 0.5;
        msg.lang = 'ja-JP';
    }
    
    function init(){
        var i,l = codeList.length;
        for(i=0;i<l;i++){
            fileList[i] = [mInstruments, '/', codeList[i], ext ].join("");
        }
    }
    
    init();
    log(context);

    // ***********************************
    // Loading Sound Files
    // ***********************************

    function BufferLoader(context, urlList, callback) {
        this.context = context;
        this.urlList = urlList;
        this.onload = callback;
        this.bufferList = new Array();
        this.loadCount = 0;
    }

    BufferLoader.prototype.loadBuffer = function(url, index) {
        // Load buffer asynchronously
        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";
        var loader = this;

        request.onload = function() {
            // Asynchronously decode the audio file data in request.response
            loader.context.createBufferSource().start(0);
            loader.context.decodeAudioData(
            request.response, function(buffer) {
                if (!buffer) {
                    log('error decoding file data: ' + url);
                    return;
                }
                loader.bufferList[index] = buffer;
                if (++loader.loadCount == loader.urlList.length) loader.onload(loader.bufferList);
            }, function(error) {
                log('decodeAudioData error ' + error);
            });
        }
        request.onerror = function() {
            log('BufferLoader: XHR error');
        }
        request.send();
    }
    BufferLoader.prototype.load = function() {
        for (var i = 0; i < this.urlList.length; ++i)
        this.loadBuffer(this.urlList[i], i);
    }

    function createBuffers(bufferList) {
        // Create two sources and play them both together.
        var i, l = bufferList.length;
        for (i = 0; i < l; i++) {
            sourceList[i] = context.createBufferSource();
            sourceList[i].buffer = bufferList[i];
            sourceList[i].connect(context.destination);
        }
    }

    // ***********************************
    // Play Sounds
    // ***********************************

    function playSound(buffer, time) {
        var source = context.createBufferSource();
        source.buffer = buffer;
        source.connect(context.destination);
        source.connect(gainNode);

        if( typeof source.noteOn === 'undefined'){
            source.start(time);
        }
        else{
            source.noteOn(time);
        }
        log(source);
    }

    function play(braille) {
        var startTime = context.currentTime + 0.100;        
        var buffer, waon = 0;
        var i,l = braille.length;
        
        for (var i = 0; i < l; i++) {
            if( braille[i] === 1 ){
                buffer = sourceList[i].buffer;
                playSound(buffer, startTime + waon * eighthNoteTime);
                waon++;
            }
        }
        
        if(waon ===0){
            playDrumHat();
        }
    }

    function playBassDrum( delay ){
        var buffer = sourceList[8].buffer;
        playSound(buffer, delay * eighthNoteTime);
    }

    function playDrumHat( delay ){
        var buffer = sourceList[9].buffer;
        playSound(buffer, delay * eighthNoteTime);
    }

    function playSystemSound( type , delay ){
        var buffer;
        if( type === 1 ){
            buffer = sourceList[10].buffer;
        }
        else{
            buffer = sourceList[11].buffer;            
        }
        playSound(buffer, delay * eighthNoteTime);
    }


    // ***********************************
    // Touch Piano
    // ***********************************

    function dot2braille( dots ){
        var result = dots.join("");
        return ( '&#x' + brCode[result]+ ';' );
    }

    var canvas = document.getElementById("ioCanvas");
    var ctx = canvas.getContext('2d');
    var canvas2 = document.getElementById("brCanvas");
    var ctx2 = canvas2.getContext('2d');
    var touches = [];
    var fingers = [];
    var temp = [];
    var funcFinger = [];
    var lineMode = 0;
    var playing = false;
    var speachText = "";
    var clearInput = false;
    var clearAll = false;

    var animationFrame = window.requestAnimationFrame
     || window.webkitRequestAnimationFrame
     || window.mozRequestAnimationFrame
     || window.setTimeout;

    var cvHeight = $("#ioCanvas").prop('clientHeight');
    var cvWidth  = $("#ioCanvas").prop('clientWidth');
    var fcWidth  = $("#func").prop('clientWidth');
    var touchTimer;

    $("#ioCanvas").prop('height', cvHeight);
    $("#ioCanvas").prop('width', cvWidth);

    $("#ioCanvas").bind("touchstart",function(e){
        e.preventDefault();
        touches = e.originalEvent.touches;
        checkFinger();        
    });

    $("#ioCanvas").bind("touchend",function(e){
        e.preventDefault();
        if( lineMode === 0) {
            if( fingers.length === 3){
                lineMode = 1;
            }
        }
        else{
            playBrailmuze();
        }
        
        setTimeout(function(){
            touches = [];
        }, 1000 );
    });


    $("#ioCanvas").bind("touchmove",function(e){
        e.preventDefault();
        //playBrailmuze();
        touches = e.originalEvent.touches;
    });

    var funcElm = document.getElementById('func');
    var mc = new Hammer(funcElm);
    
    mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    mc.on("panleft panright panup pandown panend tap press", function(ev) {

        if(ev.type === 'tap'){
            if( lineMode === 0) {
                fingers = [0,0,0];
                lineMode = 1;
                playDrumHat();
            }
            else{
                fingers[3] = 0; fingers[4] = 0;  fingers[5] = 0;
                lineMode = 1;
                playBrailmuze();
            }
        }

        // Text To Speach!!!
        if(ev.type === 'panright'){
            if( fingers.length === 6){
                lineMode = 0;
                result = dot2braille( fingers );
                brStr = brStr + result;

                $("#result").html( brStr );
                $("#text").html( Braille.toKana( brStr ) );
                speachText = Braille.toKana( brStr );
                fingers.length = 0;
                touch = [];
            }
        
            if( speaking ){ return; }

            if( tts ){
            	msg.onstart = function(event){
            		speaking = true;
            	}
            	msg.onend = function (event) {
            	    setTimeout(function(){
            	        speachText = Braille.toKana( brStr );
                		speaking = false;                	    
            	    }, 1000);
            	}
                msg.text = speachText;
                speechSynthesis.speak(msg);
                speachText = "";
            }
        }

        if(ev.type === 'panleft'){
            clearAll = true;
        }

        if(ev.type === 'panup'){
            clearInput = true;
        }

        if(ev.type === 'pandown'){
            if( fingers.length === 6){
                lineMode = 0;
                result = dot2braille( fingers );
                brStr = brStr + result;

                $("#result").html( brStr );
                $("#text").html( Braille.toKana( brStr ) );
                speachText = Braille.toKana( brStr );
                fingers.length = 0;
                touch = [];
            }
        }

        if(ev.type === 'panend'){
            if( clearInput || clearAll ){
                lineMode = 0;
                fingers.length = 0;
                touch = [];
            }
            if( clearInput ){
                playSystemSound(1, 0);                
            }
            else if( clearAll ){
                speachText = brStr = "";
                $("#result").html("&nbsp;");
                $("#text").html("&nbsp;");
                playSystemSound(2, 0);
            }
            clearInput = clearAll = false;
        }

        drawBraille();
    });

    function checkFinger(){
        var i, l = touches.length;
        var touch;
        var f1,f2;

        if(l === 0) return;

        // 3 finger
        if(l === 3){
            if(lineMode === 0){
                fingers[0] = 1; fingers[1] = 1;  fingers[2] = 1;
            }
            else{
                fingers[3] = 1; fingers[4] = 1;  fingers[5] = 1;
            }
        }

        // 2 finger
        if(l === 2){
            if( touches[0].pageX > touches[1].pageX ){
                f1 = touches[0]; f2 = touches[1];
            }
            else{
                f1 = touches[1]; f2 = touches[0];
            }

            if( f1.pageX - f2.pageX > 200 ){
                if(lineMode === 0){
                    fingers[0] = 1; fingers[1] = 0;  fingers[2] = 1;
                }
                else{
                    fingers[3] = 1; fingers[4] = 0;  fingers[5] = 1;
                }
            }
            else if( cvWidth - (f2.pageX - fcWidth) > (f1.pageX - fcWidth) ){
                if(lineMode === 0){
                    fingers[0] = 1; fingers[1] = 1;  fingers[2] = 0;
                }
                else{
                    fingers[3] = 1; fingers[4] = 1;  fingers[5] = 0;
                }
            }
            else{
                if(lineMode === 0){
                    fingers[0] = 0; fingers[1] = 1;  fingers[2] = 1;
                }
                else{
                    fingers[3] = 0; fingers[4] = 1;  fingers[5] = 1;
                }
            }
        }

        if(l === 1){
            f1 = touches[0];
            if( (f1.pageX - fcWidth) <  cvWidth/3 ){
                if(lineMode === 0){
                    fingers[0] = 1; fingers[1] = 0;  fingers[2] = 0;
                }
                else{
                    fingers[3] = 1; fingers[4] = 0;  fingers[5] = 0;
                }
            }
            else if( (f1.pageX - fcWidth) <  cvWidth/3*2 ){
                if(lineMode === 0){
                    fingers[0] = 0; fingers[1] = 1;  fingers[2] = 0;
                }
                else{
                    fingers[3] = 0; fingers[4] = 1;  fingers[5] = 0;
                }
            }
            else{
                if(lineMode === 0){
                    fingers[0] = 0; fingers[1] = 0;  fingers[2] = 1;
                }
                else{
                    fingers[3] = 0; fingers[4] = 0;  fingers[5] = 1;
                }
            }
        }
        temp = fingers;
    }

    function drawBraille(){
        var i,l = fingers.length;
        var x,y;
        
        ctx2.clearRect(0, 0, 100, 100);
        
        for(i=0;i<l;i++){
            if(i===0){ x = 20; y = 20; }
            if(i===1){ x = 20; y = 40; }
            if(i===2){ x = 20; y = 60; }
            if(i===3){ x = 40; y = 20; }
            if(i===4){ x = 40; y = 40; }
            if(i===5){ x = 40; y = 60; }
            if( fingers[i] === 1 ){
                ctx2.beginPath();
                ctx2.arc( x, y, 6, 0, 2*Math.PI, true);
                ctx2.fill();
                ctx2.stroke();
            }
            else{
                ctx2.beginPath();
                ctx2.arc( x, y, 6, 0, 2*Math.PI, true);
                ctx2.stroke();                
            }
        }
    }

    function drawFinger() {
        var i, l = touches.length;
        var touch;

        if(l === 0) return;
        for ( i = 0; i < l; i++) {
            var touch = touches[i];

            ctx.beginPath();
            ctx.arc(touch.pageX - fcWidth, touch.pageY , 40, 0, 2*Math.PI, true);
            ctx.fill();
            ctx.stroke();
          }
    }

    function clearCanvas(){
        ctx.clearRect(0, 0, cvWidth, cvHeight);
    }

    function playBrailmuze(){
        play(fingers);
    }

    function stopBrailmuze(){
        // stop
    }

    var animation = function() {
        clearCanvas();
        drawFinger();
        drawBraille();
        animationFrame(animation, 1000 / 24);
    };


    // ***********************************
    // Running
    // ***********************************

    bufferLoader = new BufferLoader(context, fileList, createBuffers);
    bufferLoader.load();

    // check Loading
    timer = setInterval(function() {
        if (fileList.length === sourceList.length) {
            log("sound loaded : " + sourceList.length);
            clearInterval(timer);
            
            $("#loading").hide();
            animation();
        }
        count++;
        if (count > 600) {
            clearInterval(timer);
            alert("Error sound loading");
        }
    }, 100);
    
}());



