// -----------------------------------------------------------------------------
// BackgroundBox is for layout positioning and sizing.
// screen coords, top, left is 0,0


dlat.BackgroundBox = function(bb, color) {
    this.boundingBox = bb;
    this.rect = dlat.snap.rect(bb.Left(), bb.Top(), bb.Width(), bb.Height());
    this.rect.attr({
        fill: color,
        stroke: "#AAA",
        strokeWidth: '.5px'
    });
};


dlat.BackgroundBox.prototype = {
};





