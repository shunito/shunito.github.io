
(function() {

    // Brailmuze
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



    // Sound
    var audioObjList = [];
    var codeList = ["C3", "D3", "E3", "F3", "G3", "A3", "B3", "C4"];
    var mInstruments = "piano";
    var ext = '.wav';

    var keyList = [];
    keyList['Z'] = 'C3';
    keyList['X'] = 'D3';
    keyList['C'] = 'E3';
    keyList['V'] = 'F3';
    keyList['B'] = 'G3';
    keyList['N'] = 'A3';
    keyList['M'] = 'B3';
    keyList[String.fromCharCode(188)] = 'C4';

    if((new Audio()).canPlayType('audio/ogg') == 'maybe') { ext = '.ogg'; }

    // TTS unsupported.
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
        // make Audio Object List
        for(var i=0; i< codeList.length; i++){
            var id = codeList[i];
            var ele = document.getElementById( id );
            var url = ['./', mInstruments, '/', id, ext].join('');

            audioObjList[ codeList[i] ] = new Audio(url);
            ele.addEventListener("click", function(){
                playSound( this.id );
            }, true);
        }
        $("#loading").hide();
    }

    function dot2braille( dots ){
        var result = dots.join("");
        return ( '&#x' + brCode[result]+ ';' );
    }

    function playSound( key ){
        var obj = audioObjList[ key ];

        if( obj.paused ){
            obj.play();
        }
    }

    function stopSound( key ){
        var obj = audioObjList[ key ];
        if( obj.paused ){ return; }
        obj.pause();
        obj.load();
    }

    // Event
    document.body.addEventListener('touchmove', function(event) {
      event.preventDefault();
    }, false);

    document.addEventListener("keydown", function(e){
        var key = String.fromCharCode(e.keyCode);
        var elm = document.getElementById( keyList[key] );
        elm.style.backgroundColor = "#CCC";
        playSound( keyList[key] );
    }, true);

    document.addEventListener("keyup", function(e){
        var key = String.fromCharCode(e.keyCode);
        var elm = document.getElementById( keyList[key] );
        elm.style.backgroundColor = "";
        stopSound( keyList[key] );
    }, true);

    // Run
    init();

//   ---------------------------------------------------------------  //

    var canvas = document.getElementById("ioCanvas");
    var ctx = canvas.getContext('2d');
    var canvas2 = document.getElementById("brCanvas");
    var ctx2 = canvas2.getContext('2d');
    var touches = [];
    var fingers = [];
    var temp = [];
    var funcFinger = [];
    var lineMode = 0;
    var playing = 0;

    var animationFrame = window.requestAnimationFrame
     || window.webkitRequestAnimationFrame
     || window.mozRequestAnimationFrame
     || window.setTimeout;

    var cvHeight = $("#ioCanvas").prop('clientHeight');
    var cvWidth  = $("#ioCanvas").prop('clientWidth');
    var fcWidth  = $("#func").prop('clientWidth');

    $("#ioCanvas").prop('height', cvHeight);
    $("#ioCanvas").prop('width', cvWidth);

    $("#ioCanvas").bind("touchstart",function(e){
        e.preventDefault();
        stopBrailmuze();
        clearCanvas();
    });

    $("#ioCanvas").bind("touchend",function(e){
        e.preventDefault();
        stopBrailmuze();
        
        if( lineMode === 0) {
            if( fingers.length === 3){
                lineMode = 1;
            }
        }
        
        setInterval(function(){
            touches = [];
        }, 1000 );
    });


    $("#ioCanvas").bind("touchmove",function(e){
        e.preventDefault();
        playBrailmuze();
        touches = e.originalEvent.touches;
    });

//   ---------------------------------------------------------------  //

    var funcElm = document.getElementById('func');
    var mc = new Hammer(funcElm);
    var speachText = "";
    mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    mc.on("panleft panright panup pandown tap press", function(ev) {

        if(ev.type === 'tap'){
            if( lineMode === 0) {
                fingers = [0,0,0];
                lineMode = 1;
            }
            else{
                fingers[3] = 0; fingers[4] = 0;  fingers[5] = 0;
                lineMode = 1;
            }
        }

        // Text To Speach!!!
        if(ev.type === 'panright'){
        
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
            lineMode = 0;
            brStr = "";
            $("#result").html("&nbsp;");
            $("#text").html("&nbsp;");
            fingers.length = 0;
            touch = [];            
        }

        if(ev.type === 'panup'){
            lineMode = 0;
            fingers.length = 0;
            touch = [];
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

    function checkPlaying(){
        var i,l,obj, count;
        for(var i=0; i< codeList.length; i++){
            obj = audioObjList[ codeList[i] ];
            if( obj.paused || obj.ended){ count++; }
        }
        playing = count;
    }

    function playBrailmuze(){
        var i,l = fingers.length;
        var code;
        
        checkPlaying();
        if( playing > 0 ){ return; }
        
        function play( code, delay ){
            var c = code;
            var d = delay * 500;
            setTimeout( function(){
                playSound( c );                
            }, d );            
        }

        for( i=0; i<l;i++){
            code = codeList[i];
            if( fingers[i] === 1){
                play(code, playing);
                playing += 1;
            }
            else{
                stopSound( code );
            }
        }
    }

    function stopBrailmuze(){
        var i,l = fingers.length;
        var code;
        for( i=0; i<l;i++){
            code = codeList[i];
            stopSound( code );
        }
    }

    var animation = function() {
        clearCanvas();
        checkFinger();
        drawFinger();
        drawBraille();
        animationFrame(animation, 1000 / 24);
    };

    animation();

}());



