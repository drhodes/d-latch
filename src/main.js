
function main() {
    dlat.common.initSnap();
    
    var diagBB = new dlat.BoundingBox(10, 10, 1000, 500);
    var diag = new dlat.timing.Diagram(diagBB);
    //diag.AddWaveform("Clock", "10H:2X:10L");

    
    var seg = new dlat.timing.SegmentUI();
    
    seg.MoveTo(10, 10);
    seg.MoveTo(10, 10);
    seg.MoveTo(100, 10);

    // var bb = new dlat.BoundingBox(20, 20, 900, 50);
    // log(bb);
    // var wf = new dlat.timing.Waveform("Clock", "10H:2X:10L", bb);
    diag.AddWaveform("Clock", "10H:2X:10L");
    diag.AddWaveform("G", "10H:2X:10L");
    diag.AddWaveform("C", "10H:2X:10L");
    diag.Update(1);
}

main();
