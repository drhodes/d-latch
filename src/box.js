// Module for box objects
dlat.box = function() {
    var mod = {};

    // imports
    var snap = dlat.common.snap;

    // -----------------------------------------------------------------------------
    // BoundingBox is for layout positioning and sizing.
    // screen coords, top, left is 0,0
    mod.BoundingBox = function(top, left, width, height) {
        this.top = top;
        this.left = left;
        this.width = width;
        this.height = height;
    };

    mod.BoundingBox.prototype = {
        // ------------------------------------------------------------------
        Bottom: function() { return this.top + this.height; },
        Right: function() { return this.left + this.width; },
        Top: function() { return this.top; },
        Left: function() { return this.left; },
        Width: function() { return this.width; },
        Height: function() { return this.height; },
        Clone: function() {
            return new mod.BoundingBox( this.top, this.left,
                                         this.width, this.height);
        },
        Shrink: function(n) {
            return new mod.BoundingBox( this.top+n, this.left+n,
                                         this.width-2*n, this.height-2*n);
        },
        MoveLeft: function(dx) {
            var bb = this.Clone();
            bb.left -= dx;
            return bb;
        },
        MoveRight: function(dx) {
            var bb = this.Clone();
            bb.left += dx;
            return bb;
        },

        MoveDown: function(dy) {
            var bb = this.Clone();
            bb.top += dy;
            return bb;
        },
        
        ReduceWidth: function(dw) {
            var bb = this.Clone();
            bb.width -= dw;
            return bb;
        },

        SetHeight: function(h) {
            var bb = this.Clone();
            bb.height = h;
            return bb;
        },
        SetWidth: function(w) {
            var bb = this.Clone();
            bb.width = w;
            return bb;
        },
        
        Print: function() {
            log(this); // hrm.
        }
    };

    // HollowBox class.
    mod.HollowBox = function(bb, fill, stroke) {
        this.boundingBox = bb;
        this.rect = snap.rect(bb.Left(), bb.Top(), bb.Width(), bb.Height());
        this.rect.attr({
            strokeWidth: '.5px',
            fill: fill,
            stroke: stroke
        });
    };
    
    mod.HollowBox.prototype = {
        AddEvent: function(event, f) {
            this.rect[event](f);
        },

        Foo: function() {
            log("Foo was called on HollowBox");
        },

        Attr: function(attr) {
            this.rect.attr(attr);
        }
    };


    // -----------------------------------------------------------------------------
    // BackgroundBox is a colored box

    mod.BackgroundBox = function(bb, color) {
        this.boundingBox = bb;
        this.rect = snap.rect(bb.Left(), bb.Top(), bb.Width(), bb.Height());
        this.rect.attr({
            fill: color,
            stroke: "#AAA",
            strokeWidth: '.5px'
        });
    };


    mod.BackgroundBox.prototype = {
        Attr: function(attr) {
            this.rect.attr(attr);
        }
    };

    return mod;
}();






