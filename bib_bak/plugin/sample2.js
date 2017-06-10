/*
 * BiB/i Plugin 
 * Sample 2
 */

Bibi.plugin.sample2 = {
	name : "sample2",
	discription: "sample plugin 2"
};

Bibi.plugin.sample2.init = function(){
	O.log(2, "plugin " + this.name + " loaded");

	Bibi.plugin.bind("load", function(){
		console.log("Plugin call:: sample2 loadEPUB");
	});

	Bibi.plugin.bind("forward", function(){
		console.log("Plugin call:: sample2 beforeForward 1");
	});

	Bibi.plugin.bind("back", function(){
		console.log("Plugin call:: sample2 beforeBack 2");
	});

	Bibi.plugin.bind("closePanel", function(){
		console.log("Plugin call:: sample2 closePanel");
	});

	Bibi.plugin.bind("laidOut", function(){
		console.log("Plugin call:: sample2 laidOut");
	});

	Bibi.plugin.bind("focus", function(){
		console.log("Plugin call:: sample2 focusPage");
	});

}

// Init
Bibi.plugin.sample2.init();