// Use Audio context
(function() {
    var sourceList = [];
    var fileList = [];
    var bufferLoader;
    var context;
    var timer, count = 0;

    var tempo = 140; // BPM (beats per minute)
    var eighthNoteTime = (60 / tempo) / 2;

    var codeList = ["C3", "D3", "E3", "F3", "G3", "A3", "B3", "C4"];
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
    }

    // ***********************************
    // Running
    // ***********************************

    var braille = [1,1,1,1,1,1];
    bufferLoader = new BufferLoader(context, fileList, createBuffers);
    bufferLoader.load();

    // check Loading
    timer = setInterval(function() {
        if (fileList.length === sourceList.length) {
            log("sound loaded : " + sourceList.length);
            clearInterval(timer);
            
            log( "set event");
            $("#stage").on("click",function(){
                play(braille);
                log( "play " + braille);
            });
            
        }
        count++;
        if (count > 600) {
            clearInterval(timer);
            alert("Error sound loading");
        }
    }, 100);

}());