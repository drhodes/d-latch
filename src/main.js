
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

    
    // GLOBAL UPDATE FUNCTION.  this is kind of nasty, But it's the
    // only global nastiness and replaces the need for a big loop.
    // This function is visible to all code, it updates the entire UI
    // once.

    // Update functions must not contain a call to this function.
    dlat.GLOBAL_UPDATE = function() {
        diag.Update();
    };
}

main();
