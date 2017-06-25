/*!
 *
 * # BiB/i Extension: OverReflow
 *
 * - "Overlays Reflowable Content Layers on Pre-Paginated Book"
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 */
Bibi.x({name:"Text To Speech",description:"text to speech for BiB/i",version:"0.1.0",build:20170611.0001})(function(){function e(){var e=this,n=e.Rate;p.rate=X.TTS.Rate=n,S["use-cookie"]&&O.Cookie.eat(O.RootPath,{TTS:{Rate:n}})}function t(){var e=I.Menu.TTS.Speech.ButtonGroup.Buttons;speechSynthesis.cancel(p),X.TTS.isSpeeking=!1,I.setUIState(e[0],"default")}function a(){var e=R.Current.Pages.EndPage!=R.Pages[R.Pages.length-1]||100!=R.Current.Pages.EndPageRatio,n=(R.Current.Pages.EndPage,R.getCurrent()),a=n.Page.PageIndex;c=[],c.length=0,console.log("-- Current Page --"),console.log(n.Page.PageIndex),console.log(n.Page),console.log("-- Next --"),console.log(a,e),e?(R.focusOn(a),setTimeout(i,1e3)):t()}function o(e,n){var t,s,i,l,r=c.length;return e>=r?(a(),!0):void(X.TTS.isSpeeking&&(s=c[e][0],t=c[e][1],i=s.parentElement,l=i.style,l.backgroundColor=u,R.focusOn({Destination:{Element:i,Page:n.Page}}),console.log("speak: ",t),p.text=t,p.onerror=function(e){return!1},p.onstart=function(e){speaking=!0},p.onend=function(t){speaking=!1,l.backgroundColor="",setTimeout(function(){o(e+1,n)},10)},speechSynthesis.speak(p)))}function s(e){var t,a,o,i,u,r,T,g,d,S="",h=e.nodeType;e.nodeName;if(1===h){if(d=e.attributes,d["ssml:ph"])return S=d["ssml:ph"].value,void c.push([e,S]);if(a=e.tagName.toUpperCase(),"SCRIPT"===a||"RP"===a)return void console.log("skip tag ->",a);if("RT"===a&&"TEXT"===X.TTS.Type)return void console.log("skip tag ->",a);if("IMG"===a)return S=e.alt,void(S.length>0&&c.push([e,S]))}if(3!==h){if("undefined"!=typeof e.childNodes){t=e.childNodes;for(n in t)s(t[n])}}else if(S=e.nodeValue,S.trim().length>0)if(S.length<l)c.push([e,S]);else{for(i=0,u=S.length,T="",o=[],i=0;i<u;i++)r=S.charAt(i),"ja-JP"===p.lang&&r.match(/[\s,。、(「（]/)?(o.push(T+r),T=""):r.match(/[“".,(]/)?(o.push(T+r),T=""):T+=r;for(o.push(T),u=o.length,T=g="",i=0;i<u;i++)""!==o[i].trim()&&(g=T+o[i].trim(),g.length>l?(T.length>0&&c.push([e,T.trim()]),T=o[i]):T=g);T.length>0&&c.push([e,T.trim()])}}function i(){var e,n=R.getCurrent(),t=(R.getCurrentPages(),n.Pages);console.log("currentPage::",n),console.log("currentPages::",t),console.log("start tts::",n.Page.PageIndex),c=[],c.length=0,e=t.length,console.log("page no ",e),s(n.Page.Item.Body),console.log("start speak list--"),console.log(c.length),console.table(c),o(0,n)}var l=40,c=[],u="#FFD700",p=new SpeechSynthesisUtterance;if(X.TTS={},X.TTS.isSpeeking=!1,X.TTS.Type="TEXT",X.TTS.Rate=1.5,p.volume=1,p.rate=1.5,p.pitch=1,p.lang="ja-JP",O.appendStyleSheetLink({className:"bibi-extension-stylesheet",id:"bibi-extension-stylesheet_TTS",href:O.RootPath+"extensions/tts/tts.css"}),!1 in window)return void O.log(2,"plugin Error - TTS Plugin:Web Speech API is disabled");if(S["use-cookie"]){var r=O.Cookie.remember(O.RootPath);r&&r.TTS&&void 0!=r.TTS.Rate&&(p.rate=X.TTS.Rate=1*r.TTS.Rate)}("number"!=typeof X.TTS.Rate||X.TTS.Rate<.5||X.TTS.Rate>10)&&(p.rate=X.TTS.Rate=1.5),I.Menu.TTS={};var T=I.createButtonGroup({Area:I.Menu.R,Sticky:!0}),g=T.addButton({Type:"toggle",Labels:{"default":{"default":"TTS",ja:"読み上げ"},active:{"default":"Close Share-Menu",ja:"読み上げメニューを閉じる"}},Help:!0,Icon:'<span class="bibi-icon bibi-icon-speech"></span>'}),d=I.createSubPanel({Opener:g,id:"bibi-subpanel_tts",open:function(){console.log("open tts sub panel")}});I.Menu.TTS.Speech=d.addSection({Labels:{"default":{"default":"Text To Speech",ja:"読み上げ"}},ButtonGroup:{Tiled:!1,Buttons:[{Type:"toggle",Labels:{"default":{"default":"Start Speech",ja:"読み上げを開始"},active:{"default":"Stop Speech",ja:"読み上げを停止"}},Icon:'<span class="bibi-icon bibi-icon-speech-on"></span>',action:function(){X.TTS.isSpeeking=!X.TTS.isSpeeking,d.close(),X.TTS.isSpeeking?i():speechSynthesis.cancel(p)},on:{click:function(){return!1}}},{Type:"toggle",Labels:{"default":{"default":"Onry text",ja:"ルビは読み上げない"},active:{"default":"Speech Ruby",ja:"ルビも読み上げる"}},Icon:'<span class="bibi-icon bibi-icon-speech-on"></span>',action:function(){speechSynthesis.cancel(p),"TEXT"===X.TTS.Type?X.TTS.Type="RUBY":X.TTS.Type="TEXT",X.TTS.isSpeeking&&i()},on:{click:function(){return!1}}}]}}),I.Menu.TTS.Rate=d.addSection({Labels:{"default":{"default":"Speech Rate",ja:"読み上げ速度"}},ButtonGroup:{Tiled:!0,Buttons:[{Type:"radio",Labels:{"default":{"default":'<span class="non-visual-in-label">Speech Rate:</span> Normal',ja:'<span class="non-visual-in-label">読み上げ速度：</span>標準'}},Icon:"",Rate:1,action:e},{Type:"radio",Labels:{"default":{"default":'<span class="non-visual-in-label">Speech Rate:</span> 1.5 speed',ja:'<span class="non-visual-in-label">読み上げ速度：</span>1.5倍速'}},Icon:"",Rate:1.5,action:e},{Type:"radio",Labels:{"default":{"default":'<span class="non-visual-in-label">Speech Rate:</span> 2 speed',ja:'<span class="non-visual-in-label">読み上げ速度：</span>2倍速'}},Icon:"",Rate:2,action:e},{Type:"radio",Labels:{"default":{"default":'<span class="non-visual-in-label">Speech Rate:</span> 3 speed',ja:'<span class="non-visual-in-label">読み上げ速度：</span>3倍速'}},Icon:"",Rate:3,action:e}]}}),I.Menu.TTS.Rate.ButtonGroup.Buttons.forEach(function(e){e.Rate==X.TTS.Rate&&I.setUIState(e,"active")}),E.bind("bibi:commands:move-by",function(){console.log("moved"),t()})});