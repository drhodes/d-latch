
dlat.schematic = function() {
    // the module
    var mod = {}; 
    
    // imports
    var snap = dlat.common.snap;
    var box = dlat.box;
    
    // class Schematic
    {
        mod.Schematic = function() {
            // show the svg.
            var left = 100;
            var top = 10;
            var height = 220;
            var width = 220;
            this.img = dlat.snap.image("./svgs/circuit-schematic.svg",
                                       left, top, height, width);
            this.boundingBox = new box.BoundingBox(left, top, height, width);
        };
        
        mod.Schematic.prototype = {
            
        };
    }
    
    return mod;
}();
