/*
 * BiB/i Plugin 
 * Bulk develop EPUBCFI
 */

Bibi.plugin.epubcfi = {
  name : "EPUBCFI-dev",
  discription: "Bulk develop EPUBCFI",
  author      : "Shunsuke Ito",
  version     : "0.0",
  Build       : "2015-01-30"
};

Bibi.plugin.epubcfi.init = function(){
    O.log(2, "plugin " + this.name + " loaded");

	/////////////////////////////////////////////////////////////////
	// Bib/i 設置URL
	var BiBiBaseURL = 'http://shunito.github.io/bib/i/';
//	var BiBiTweetTags = 'bibidev,EPUBCFI';

	/////////////////////////////////////////////////////////////////
	
	Bibi.plugin.epubcfi.EPUBCFI = '';
    Bibi.plugin.epubcfi.targetText ='';

  window.fbAsyncInit = function() {
    FB.init({
      appId      : '344290689105657',
      xfbml      : true,
      version    : 'v2.2'
    });
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/ja_JP/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));




    function makeRangePath( anchorPath, focusPath ){
        var i,l ,count =0, path = [];
        var anc = anchorPath.split('/'),
            foc = focusPath.split('/');

        for(i=0; l=anc.length , i<l; i++){
            if( anc[i] === foc[i] ){
                count++;
                path.push( anc[i] );
            }
            else{
                break;
            }
        }
        anc.splice(0,count);
        foc.splice(0,count);

        return {
            parent: '/' + path.join('/'),
            start : '/' + anc.join('/'),
            end   : '/' + foc.join('/')
        };
    }

    function objtoCFIpath(obj){
        var o = obj,
            p = o.parentNode,
            txtNodeCount = 0,
            c, i ,count ,str;
        var list = [];

        c = p.childNodes;
        i = 0;
        while( c[i] && c[i] != o ){
            if( c[i].nodeType === 3 ){ txtNodeCount++; } // 3 = TEXT_NODE
            i++;
        }

        // 奇数カウント
        list.push( (txtNodeCount *2) +1 );

        while ( p.nodeName !== '#document' ) {
            if( typeof p.childNodes === 'undefined') { break; }
            c = p.childNodes;
            i = count = 0;

            while( c[i] ){
                if( c[i].nodeType === 1){ count++; } // 1 = ELEMENT_NODE
                if( c[i] == o ){
                    // テキストノードのみ
                    if( count === 0 ){ break; }
                    if( typeof c[i].id !== undefined && c[i].id ){
                        str = [ count*2, '[' , c[i].id ,']' ].join('');  
                    }
                    else {
                        str = count *2;
                    }
                    list.push( str );
                    break;
                }
                i++;
            }
            o = p;
            p = p.parentNode;
        }
      
        list.reverse();
        return list.join('/');
    }

    function copyEPUBCFI( cfi ){
      var url = BiBiBaseURL;
      var epubcfi ,target;
            
      target = O.getEPUBCFITarget( cfi );
      if( R.getTarget(target) ){
        epubcfi = [ 'epubcfi(', cfi, ')' ].join('');
        url += [ '?book=', B.Name, '#' , epubcfi ].join('');
        
        Bibi.plugin.epubcfi.EPUBCFI = url;
      }
      else{
        O.log(2, "plugin Error - EPUBCFI:" + cfi );
      }
    }

    Bibi.plugin.bind("load", function(){

        var contents = document.getElementById('epub-contents');
        var iframes = contents.getElementsByTagName('iframe');
        
        var spine = B.Package.Spine;
        var items = B.Package.Manifest.items;
        
        var page , win, doc;
        var i,l = iframes.length;

        for(i=0;i<l;i++){
          page = iframes[i];

          if (page.contentWindow && page.className ==='item') {
            win = page.contentWindow;
            doc = page.contentDocument || page.contentWindow.document;

            var rangeer = ( function(){
                var inDoc = doc;
                var inWin = win;
                var id = page.id;
                return function(){
                    var range = inWin.getSelection();
                    var pageId = id;
                    var dom, anchorPath, focusPath, path;
                    var tm , spineNo = 0, itemNo = 0;
                    var itemref, itemId, idref ,item ,j;
                    var epubcfi = '/';

                    if( range.type === 'None' ){ return null; }
                    dom = range.getRangeAt(0).cloneContents();
                    if( dom.textContent === '' ){ return null; }

                    Bibi.plugin.epubcfi.targetText = dom.textContent;
                    //console.log( pageId, dom.textContent );
                    
                    tm = pageId.split('-');
                    spineNo = parseInt(tm[1]);
                    itemref = spine.itemrefs[ spineNo ];
                    itemId = itemref.id;
                    idref = itemref.idref;
                    
                    for( j in items ){
                      item = items[j];
                      if( idref === item.id ){
                        break;
                      }
                      itemNo++;
                    }
                    
                    anchorPath = objtoCFIpath( range.anchorNode ) +':'+ range.anchorOffset;
                    focusPath  = objtoCFIpath( range.focusNode )  +':'+ range.focusOffset;
                    path = makeRangePath( anchorPath, focusPath );

                    epubcfi += [ (itemNo+1)*2,'/',(spineNo+1)*2 ].join('');
                    if( typeof itemref.id !== undefined && itemref.id ){
                      tm = itemref.id;
                      epubcfi += [ '[',itemref.id,']' ].join('');
                    }
                    epubcfi += '!';
                    
                    // Range Path
                    //epubcfi +=[ path.parent,',', path.start,',',path.end ].join('');
                    
                    // Single Path
                    epubcfi += path.parent + path.start;

                    copyEPUBCFI( epubcfi );
                    return epubcfi;
                };
            })();
            
            doc.addEventListener('mouseup', rangeer , true);
        }
    }

    Bibi.plugin.addMenu(
      { id: "FB_share",
        label: "share EPUBCFI",
        img: "../plugin/icon/ic_facebook_20.png" },
        function(){
            var url = Bibi.plugin.epubcfi.EPUBCFI;
            var title = B.Package.Metadata['title'] || '';
            var disc =  '「' + Bibi.plugin.epubcfi.targetText +'」';
            var cover = BiBiBaseURL.slice(0,-2) + 'bookshelf/' + B.Name + '/';

            if( typeof B.Package.Manifest['cover-image'].Path !== 'undefined' ){
                cover += B.Package.Manifest['cover-image'].Path;
            }
            else { cover = '' }

            FB.ui({
                    method: 'feed',
                    message: 'BiB/i EPUBCFI pluginからシェア',
                    name: title,
                    caption: 'share from BiB/i',
                    description: disc,
                    link   : url,
                    picture: cover
                },
                function (response) {
                    // If response is null the user canceled the dialog
                    if (response != null) {
                        logResponse(response);
                    }
                }
            );          

          C.Panel.toggle();
        });
    });

}

// Init
Bibi.plugin.epubcfi.init();