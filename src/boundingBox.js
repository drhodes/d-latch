// -----------------------------------------------------------------------------
// BoundingBox is for layout positioning and sizing.
// screen coords, top, left is 0,0

dlat.BoundingBox = function(top, left, width, height) {
    this.top = top;
    this.left = left;
    this.width = width;
    this.height = height;
};

dlat.BoundingBox.prototype = {
    // ------------------------------------------------------------------
    Bottom: function() { return this.top + this.height; },
    Right: function() { return this.left + this.width; },
    Top: function() { return this.top; },
    Left: function() { return this.left; },
    Width: function() { return this.width; },
    Height: function() { return this.height; },
    Clone: function() {
        return new dlat.BoundingBox( this.top, this.left,
                                     this.width, this.height);
    },
    Shrink: function(n) {
        return new dlat.BoundingBox( this.top+n, this.left+n,
                                     this.width-2*n, this.height-2*n);
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



