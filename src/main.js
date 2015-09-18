
function main() {
    dlat.common.initSnap();

    // imports
    var box = dlat.box;
    var timing = dlat.timing;
    var ui = dlat.ui;

    // 
    var diagBB = new box.BoundingBox(10, 10, 1000, 800);
    var diag = new timing.Diagram(diagBB);
    
    diag.AddWaveform("Q'", "10H:2X:10L");
    diag.AddWaveform("Q", "10H:2X:10L");
    diag.AddWaveform("G", "10H:2X:10L");
    diag.AddWaveform("D", "10H:2X:10L");

    
    // GLOBAL UPDATE FUNCTION.  this is kind of nasty, But it's the
    // only global nastiness and replaces the need for a big loop.  In
    // the absense of a signaling system, it's not too bad. This
    // function is visible to all code, it updates the entire UI once.

    // Update functions MUST NOT contain a call to this function. That
    // would induce ill defined recursion and general malaise.
    dlat.GLOBAL_UPDATE = function() {
        diag.Update();
    };
}

main();
