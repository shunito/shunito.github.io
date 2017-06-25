// Licensed under the Apache License, Version 2.0 (the "License");
// http://www.apache.org/licenses/LICENSE-2.0

(function () {
    'use strict';

    // unsupported.
    if (!'SpeechSynthesisUtterance' in window) {
        console.log("Unsupported : Web Speech Synthesis API")
        return;
    }

    var rsWidth, rsHeight;
    var menuHeight;
    var speaking = false;
    var section, reading ,children;
    var list = [];

	var tts = false;
	var cancel = false;
    var highlightColor = '#FFD700';
    var msg = new SpeechSynthesisUtterance();

    // Speech Settings
    msg.lang = 'ja-JP';
    msg.volume = 1;
    msg.rate = 1;
    msg.pitch = 1;

    // span分割
    function splitSpan(){
        var sectionRoot = document.getElementById("c01");
        var dupNode = sectionRoot.cloneNode(true);
        var cNode, tagName, i,l;
        var str, strArr =[];

        if( dupNode.hasChildNodes()){
            cNode = dupNode.children;
            l = cNode.length;
            for(i=0;i<l;i++){
                if(cNode[i].nodeType === 1){
                    str = cNode[i].innerHTML;

                    strArr = str.split(/[。]/);
                    str = "<span>" + strArr.join("。</span><span>") + "</span>";
                    str = str.replace("<span></span>", "");

                    //console.log( str );
                    cNode[i].innerHTML = str;

                }
            }
        }

        //console.log( dupNode );
        $("#c01").replaceWith(dupNode);

        i = 0;
        $("#c01 span").each(function(){
            $(this).attr("id","sp"+ i);
            $(this).attr("class","mo");
            i++;
        })
    }


    // 読み上げリスト
    function getSpeakList(){
        var sectionRoot = document.getElementById("c01");
        var dupNode = sectionRoot.cloneNode(true);
        var cNode, tagName, i,l;
        var str;

        $("rp",dupNode).each(function(){
            $(this).remove();
        });

        $("rt",dupNode).each(function(){
            $(this).remove();
        });

        $("ruby",dupNode).each(function(){
            var text = $(this).text();
            $(this).replaceWith(text);
        });

        $("span", dupNode).each(function(){
            list.push(this);
        });

        //console.log( list );
    }

    function speak( list, num ){

        var span, id;
        var l = list.length;
        if( num > l) { return; }

        span = list[num];
        id = "#" + $(span).attr("id");

    	msg.text = $(span).text();
    	msg.onerror = function(event){
    	    return false;
    	}
    	msg.onstart = function(event){
    		speaking = true;
    		$( id ).css("backgroundColor",highlightColor);
    	}
    	msg.onend = function (event) {
    		speaking = false;
    		$( id ).css("backgroundColor","");
    		if( cancel ){ return; }
    		else{
        		speak( list, num + 1 );
        		reading = num + 1;
    		}
    	}
    	// Speak!
    	speechSynthesis.speak(msg);
    }

    function seekSpeech(){
        var l = list.length;

        if( reading === false ) {
            reading = 0;
        }

        if( reading > l ){
            console.log( "contents end... goto head: ");
            reading = 0;
        }
        speak( list, reading );
    }


    $(document).ready(function(){
        rsWidth  = $(document).find("body").innerWidth();
        rsHeight = $(document).find("body").innerHeight();
        menuHeight = Math.floor(rsHeight / 10);

        //console.log( rsHeight, rsWidth, menuHeight );

        $("#ttsIcon").height( menuHeight + "px");
        $("#ttsIcon").width( menuHeight + "px");

        splitSpan();
        getSpeakList();
        reading = false;

        // メニュー開閉
        $("#ttsIcon").on("click",function(){
            $("#ttsSubMenu").toggle();
        });

        $("#mSpeach").on("click",function(){
            speaking = !speaking;
            if( speaking ){
                $("#mSpeach").text("読み上げ停止");
                cancel = false;
                seekSpeech();
            }
            else{
                $("#mSpeach").text("読み上げ開始");
                cancel = true;
                speechSynthesis.cancel();
            }
        });

        $("#mBefore").on("click",function(){
            if( speaking ){
                cancel = true;
                speechSynthesis.cancel();
                $(".mo").css("backgroundColor","");

                reading = reading -1;
                if(reading < 0) { reading = 0; }

                setTimeout(function(){
                    cancel = false;
                    seekSpeech();
                },1000);
            }
        });

        $("#mAfter").on("click",function(){
            if( speaking ){
                cancel = true;
                speechSynthesis.cancel();
                $(".mo").css("backgroundColor","");

                reading = reading +1;
                if(reading > list.length ) { reading = 0; }

                setTimeout(function(){
                    cancel = false;
                    seekSpeech();
                },1000);
            }
        });

        $("#mTop").on("click",function(){
            if( speaking ){
                cancel = true;
                speechSynthesis.cancel();
                $(".mo").css("backgroundColor","");

                reading = 0;
                setTimeout(function(){
                    cancel = false;
                    seekSpeech();
                },1000);
            }
        });
    });





}());