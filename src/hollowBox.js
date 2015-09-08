dlat.HollowBox = function(bb, color) {
    this.boundingBox = bb;
    this.rect = dlat.snap.rect(bb.Left(), bb.Top(), bb.Width(), bb.Height());
    this.rect.attr({
        strokeWidth: '.5px',
        fill: "#EEE",
        stroke: "#AAA"
    });
};

dlat.HollowBox.prototype = {
};
