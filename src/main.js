
function main() {
    dlat.common.initSnap();

    // imports
    var box = dlat.box;
    var timing = dlat.timing;

    //
    var diagBB = new box.BoundingBox(10, 10, 1000, 500);
    var diag = new timing.Diagram(diagBB);    
    var seg = new timing.SegmentUI();

    seg.MoveTo(10, 10);
    seg.MoveTo(10, 10);
    seg.MoveTo(100, 10);

    diag.AddWaveform("Q'", "10H:2X:10L");
    diag.AddWaveform("Q", "10H:2X:10L");
    diag.AddWaveform("G", "10H:2X:10L");
    diag.AddWaveform("D", "10H:2X:10L");
    
    diag.Update(1);
}

main();
