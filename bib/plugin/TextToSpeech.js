/*
 * BiB/i Plugin 
 * Bulk develop TTS
 */

Bibi.plugin.tts = {
    name : "Text To Speech",
    discription: "TTS for BiB/i",
    author      : "Shunsuke Ito",
    version     : "0.0",
    Build       : "2015-02-06"
};

Bibi.plugin.tts.init = function(){
    O.log(2, "plugin " + this.name + " loaded");

    // unsupported.
    if (!'SpeechSynthesisUtterance' in window) {
        O.log(2, "plugin Error - TTS Plugin:" + 'Web Speech API is disabled' );
        return;
    }

	var tts = false;
    var speaking = false;
    var MAX_TEXT = 40;
    var speakList = [];
    var highlightColor = '#FFD700';
    var msg = new SpeechSynthesisUtterance();
    var pageBody;
    
    function setLang(){
        var EPUBLang;
        
        if( typeof B.Package.Metadata.language !== 'undefined'){
            EPUBLang = B.Package.Metadata.language;
        }
        else{ EPUBLang = 'en-US'; }
        
        if( EPUBLang === 'en' ) { msg.lang = 'en-US'; }
        else if( EPUBLang === 'jp' ) { msg.lang = 'ja-JP'; }
        else if( EPUBLang === 'de' ) { msg.lang = 'de-DE'; }
        else if( EPUBLang === 'es' ) { msg.lang = 'es-ES'; }
        else if( EPUBLang === 'fr' ) { msg.lang = 'fr-FR'; }
        else{
            msg.lang = EPUBLang;
        }
    }

    function checkNode( node ){
    	var text = '';
    	var type = node.nodeType;
    	var name = node.nodeName;
    	var childNodes;
    	var subText, i, l, c, str ,tmp;

    	if( type === 3 ) { // TEXT Node
    		text = node.nodeValue;
    		if( text.trim().length > 0 ){
    			if( text.length < MAX_TEXT ){
	    			speakList.push([node, text]);
    			}
    			else{
    				i=0; l= text.length;
    				str = '';
    				subText = [];
    				for(i=0; i<l; i++){
    					c = text.charAt(i);
    					if( msg.lang === 'jp' && c.match(/[\s,。、(「（]/) ){
    						//console.log( 'sub', str + c );
    						subText.push(str + c);
    						str = '';
    					}
    					else if( c.match(/[“".,(]/) ){
    						subText.push(str + c);
    						str = '';        					
    					}
    					else{
	    					str += c;
    					}
    				}
    				subText.push(str);

    				l = subText.length;
    				str = tmp ='';
    				for( i=0;i<l; i++){
    				    if( subText[i].trim() ==='' ){ continue; }
    					tmp = str + subText[i].trim();
    					if( tmp.length > MAX_TEXT ){
    					    if( str.length > 0){
        						speakList.push([node, str.trim()]);        					    
    					    } 
    						str = subText[i];
    					}
    					else{
    						str = tmp;
    					}
    				}
    				if( str.length > 0 ){
	    				speakList.push([node, str.trim()]);
    				}
    			}
    		}
    		return;
    	}

    	if( name && name.toUpperCase() ==='SCRIPT'){
    		return;
    	}

    	if( typeof node.childNodes !== 'undefined' ){
    		childNodes = node.childNodes;
	    	for( n in childNodes ) {
	    		checkNode( childNodes[n] );
	    	}
    	}
    }

    function speak( num ){
    	var i =0, l = speakList.length;
    	var text , node , parent;
    	var st;

    	if( num >= l ) { return true; }
    	if( !tts ) { return true; }

    	node = speakList[num][0];
    	text = speakList[num][1];
    	
    	parent = node.parentElement;
    	st = parent.style;
    	st.backgroundColor = highlightColor;

    	msg.text = text;
    	msg.onerror = function(event){
    	    O.log(2, "plugin Error - TTS Plugin:" + event );
    	    return false;
    	}
    	msg.onstart = function(event){
    		speaking = true;
    	    O.log(2, "plugin TTS speak: " + text );
    	}
    	msg.onend = function (event) {
    		speaking = false;
    		st.backgroundColor = '';
    	    O.log(2, "plugin TTS speak end: " + event.elapsedTime + 's' );

    		// Next Text
    		setTimeout(function(){
	    		speak( num + 1 );
    		}, 500);
    	}

    	// Speak!
    	speechSynthesis.speak(msg);
	}
	
	function getPageBody(){
        var page = R.getCurrentPages();
        var startPage = page.Start.Item;
        var doc = startPage.contentDocument || startPage.contentWindow.document;
        var body = doc.getElementsByTagName('body')[0];
    	return body;
	}


    Bibi.plugin.bind("load", function(){

        // Settings
        msg.volume = 1;
        msg.rate = 1;
        msg.pitch = 2;
        msg.lang = 'en-US'; // default
    
        setLang();

        Bibi.plugin.addMenu({
            id: "mnTTS",
            label: "Text To Speech ",
            img: "../plugin/icon/ic_volume_up_grey600_18dp.png" },
            function(){
                var body = getPageBody();
                var page = R.getCurrentPages();
                var span;
                
                pageNo = page.Start.PageIndex;
                tts = !tts;
                if( speaking ){ speechSynthesis.cancel(msg); }
                
                if(tts){
                    span = document.getElementById('mnTTS');
                    span.style.backgroundImage = "url(../plugin/icon/ic_volume_off_grey600_18dp.png)";
                    
                    speakList = [];
                    checkNode(body);
                    speak( 0 );
                }
                else{
                    span = document.getElementById('mnTTS');
                    span.style.backgroundImage = "url(../plugin/icon/ic_volume_up_grey600_18dp.png)";                    
                }
                C.Panel.toggle();
            });        
    });

    Bibi.plugin.bind("focus", function(){
        var body = getPageBody();
        var page = R.getCurrentPages();
    });

}

// Init
Bibi.plugin.tts.init();