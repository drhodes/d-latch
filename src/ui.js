
dlat.ui = function() {
    // the module
    var mod = {}; 
    
    // imports
    var snap = dlat.common.snap;
    
    // class Segment
    {
        // ------------------------------------------------------------------
        // A segment is a piece of the waveform that is associated with a
        // time delta and two volt-time points
        mod.Segment = function() {
            this.x = 0;
            this.y = 0;
            this.line = snap.line(0,0, 10,0); // arbitrary position
            this.line.attr({
                stroke: '#00F',
                strokeWidth: '3px'
            });            
        };
        
        mod.Segment.prototype = {
            moveHome: function() {
                var m = new Snap.Matrix().translate(this.x, this.y);
                this.line.transform(m);
            }
            
            ,MoveTo: function(x, y) {
                this.x = x;
                this.y = y;
                this.moveHome();
            }
            
            ,MoveToY: function(y) {
                this.MoveTo(this.x, y);
            }
            
            ,MoveToX: function(x) {
                this.MoveTo(x, this.y);
            }
        };
    }
    
    return mod;
}();
