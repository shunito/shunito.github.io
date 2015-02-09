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
    var pageNo;
    var maxPageNo = B.Package.Spine.itemrefs.length;
    
    function setLang(){
        var EPUBLang;
        
        if( typeof B.Package.Metadata.language !== 'undefined'){
            EPUBLang = B.Package.Metadata.language;
        }
        else{ msg.lang = 'en-US'; return; }
        
        if( EPUBLang === 'en' ) { msg.lang = 'en-US'; }
        else if( EPUBLang === 'jp' || EPUBLang === 'ja' ) { msg.lang = 'ja-JP'; }
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
    	var childNodes ,tagName;
    	var subText, i, l, c, str ,tmp;
    	
    	if( type === 1 ) { // Element Node
    	    //console.log( node );
    	    tagName = node.tagName.toUpperCase();
        	if( tagName === 'RT' || tagName === 'RP' || tagName === 'SCRIPT' ){
            	console.log('skip tag ->' ,tagName);
            	return;
        	}
        	if( tagName === 'IMG' ){
            	text = node.alt;
            	if( text.length > 0){
            	    speakList.push([node, text]);                	
            	}
            	return;
        	}
    	}

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
    					if( msg.lang === 'ja-JP' && c.match(/[\s,。、(「（]/) ){
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

    	if( typeof node.childNodes !== 'undefined' ){
    		childNodes = node.childNodes;
	    	for( n in childNodes ) {
	    		checkNode( childNodes[n] );
	    	}
    	}
    }

    function getDisplayType (element) {
        var cStyle = element.currentStyle || window.getComputedStyle(element, ""); 
        return cStyle.display;
    }

    function speak( num, page ){
    	var i =0, l = speakList.length;
    	var text , node , parent, span;
    	var st , displayType;
    	var pages;

    	if( num >= l ) {
            nextPage();            
            return true;
        }
    	if( !tts ) { return true; }

    	node = speakList[num][0];
    	text = speakList[num][1];
    	
    	parent = node.parentElement;
    	st = parent.style;
    	st.backgroundColor = highlightColor;
    	
    	// Scroll to Speaking Element
    	displayType = getDisplayType(parent)
    	if( displayType === 'block' || displayType === 'list-item' ){
        	R.focus({
            	Element: parent,
            	Item: page
        	});        	
    	}
    	
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

    		// Next Text
    		setTimeout(function(){
	    		speak( num + 1, page );
    		}, 500);
    	}

    	// Speak!
    	speechSynthesis.speak(msg);
	}
	
	function getPageBody(page){
        var item = R.Items[page];
        var doc = item.contentDocument || item.contentWindow.document;
        var body = doc.getElementsByTagName('body')[0];
    	return body;
	}
	
	function nextPage(){
	    var nextPageNo = pageNo + 1;
	    var body, page, span;
	    
	    if( nextPageNo >= maxPageNo ){
    	    O.log(2, "plugin TTS last page: ");
            span = document.getElementById('mnTTS');
            span.style.backgroundImage = "url(../plugin/icon/ic_volume_off_grey600_18dp.png)";
            tts = false;
            return;
	    }
	    
	    R.focus( nextPageNo );
	    O.log(2, "plugin TTS read next page: " + nextPageNo );
	    
	    setTimeout(function(){
    	    pageNo = nextPageNo;
    	    body = getPageBody(pageNo);

            speakList = [];
            checkNode(body);
            speak( 0, page );
        }, 500);
	}


    Bibi.plugin.bind("load", function(){

        // Settings
        msg.volume = 1;
        msg.rate = 1;
        msg.pitch = 2;
        msg.lang = 'en-US'; // default
        
        // iOSのみ倍速になるのを補正
        if( sML.OperatingSystem.iOS ){
            msg.rate = 0.5;
        }
    
        setLang();

        Bibi.plugin.addMenu({
            id: "mnTTS",
            label: "Text To Speech ",
            img: "../plugin/icon/ic_volume_up_grey600_18dp.png" },
            function(){
                var page = R.getCurrentPages();
                var body, span;
                
                pageNo = page.Start.Item.ItemIndex;
                body = getPageBody( pageNo );

                tts = !tts;
                if( speaking ){ speechSynthesis.cancel(msg); }
                
                if(tts){
                    span = document.getElementById('mnTTS');
                    span.style.backgroundImage = "url(../plugin/icon/ic_volume_off_grey600_18dp.png)";
                    
                    speakList = [];
                    checkNode(body);
                    speak( 0, page );
                }
                else{
                    span = document.getElementById('mnTTS');
                    span.style.backgroundImage = "url(../plugin/icon/ic_volume_up_grey600_18dp.png)";                    
                }
                C.Panel.toggle();
            });        
    });

    Bibi.plugin.bind("focus", function(){
        // focus
    });

}

// Init
Bibi.plugin.tts.init();