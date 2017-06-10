/*
 * BiB/i Plugin 
 * Google Analytics for Bib/i
 */

Bibi.plugin.ga = {
	name        : "Google Analytics",
	discription : "Google Analytics Plugin for Bib/i",
	author      : "Shunsuke Ito",
	version     : "0.2",
	Build       : "2015-01-25"
};

Bibi.plugin.ga.init = function(){
	O.log(2, "plugin " + this.name + " loaded");
	
	/////////////////////////////////////////////////////////////////
	// トラッキングコード設定
	var GAtrackingCode = 'UA-58887552-1';

	// ログインしている user_id を使用してトラッキングします。
	// var user_id = 'Shun10001';
	var userTracking = false;
	/////////////////////////////////////////////////////////////////
	
	// GA トラッキングコード
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

	ga('create', GAtrackingCode , 'auto');
	if( userTracking && typeof user_id != "undefined" ){ ga('set','&uid', user_id ); }
	ga('send', 'pageview');

	Bibi.plugin.bind("load", function(){
		ga('send', 'event', B.Name , 'open', B.Name , 1);

		var CurrentPages = R.getCurrentPages();
		var page = CurrentPages.Start.PageIndex +1;
		var vPage = '/' + [ 'bibi' ,B.Name , page ].join("/");
		ga('send', 'event', B.Name, 'page', {'page': vPage });
	});

	Bibi.plugin.bind("back", function(){
		ga('send', 'event', B.Name , 'navi', 'back' ,1);
	});

	Bibi.plugin.bind("forward", function(){
		ga('send', 'event', B.Name , 'navi', 'forward', 1);
	});

	Bibi.plugin.bind("focus", function(){
		var CurrentPages = R.getCurrentPages();
		var page = CurrentPages.Start.PageIndex +1;
		var vPage = '/' + [ 'bibi' ,B.Name , page ].join("/");
		ga('send', 'event', B.Name, 'page', {'page': vPage });
	});

	Bibi.plugin.bind("openPanel", function(){
		ga('send', 'event', B.Name , 'menu', 'open' ,1);
	});

	Bibi.plugin.bind("laidOut", function(){
	  var layout = [ S["book-display-mode"], S["spread-layout-axis"],S["page-size-format"] ].join("-");
	  ga('send', 'event', B.Name , 'layout fixed', layout);
	});
}

// Init
Bibi.plugin.ga.init();