
(function() {
    
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
    }
    
    function playSound( key ){
        var obj = audioObjList[ key ];
        
        if( obj.paused ){
            obj.play();
        }    
    }
    
    function stopSound( key ){
        var obj = audioObjList[ key ];
        var timer;
        
        timer = setInterval(function(){
            if( obj.volume - 0.1 > 0 ){
                obj.volume -= 0.1;
            }
            else {
                obj.volume = 0.0;
                clearInterval(timer);
                obj.pause();
                obj.load();
                obj.volume = 1.0;
            }
        },10);    
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

}());



