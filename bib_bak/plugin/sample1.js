/*
 * BiB/i Plugin 
 * Sample 1
 */

Bibi.plugin.sample1 = {
  name : "sample1",
  discription: "sample plugin 1"
};

Bibi.plugin.sample1.init = function(){
  O.log(2, "plugin " + this.name + " loaded");
  var b1,f1;

  Bibi.plugin.bind("load", function(){
    console.log("Plugin call:: sample1 loadEPUB");
    
    Bibi.plugin.addMenu(
      { id: "pluginbtn1",
        label: " Plugin Button 1",
        img: "../plugin/icon/info_24x24.png" },
        function(){
          console.log("Plugin menu button :: sample1");
          // イベントの unbind
          Bibi.plugin.unbind( b1 );
          Bibi.plugin.unbind( f1 );
          Bibi.plugin.unbind( 'openPanel' );
          alert("プラグインで追加したボタンをクリックしました");
          
          // delete this Menu
          Bibi.plugin.deleteMenu('pluginbtn1');
        });
  });

  b1 = Bibi.plugin.bind("back", function(){
    console.log("Plugin call:: sample1 beforeBack 1");
  });
  
  f1 = Bibi.plugin.bind("forward", function(){
    console.log("Plugin call:: sample1 beforeForward 1");
  });

  Bibi.plugin.bind("back", function(){
    console.log("Plugin call:: sample1 beforeBack 2");
  });

  Bibi.plugin.bind("forward", function(){
    console.log("Plugin call:: sample1 beforeForward 2");
  });

  Bibi.plugin.bind("openPanel", function(){
    console.log("Plugin call:: sample1 openPanel");
  });

  Bibi.plugin.bind("closePanel", function(){
    console.log("Plugin call:: sample1 closePanel");
  });
}

// Init
Bibi.plugin.sample1.init();