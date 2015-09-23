
function main() {
    dlat.common.initSnap();

    // imports
    var box = dlat.box;
    var timing = dlat.timing;
    var ui = dlat.ui;
    var scm = dlat.schematic;

    var diagBB = new box.BoundingBox(10, 300, 1000, 1000);
    var diag = new timing.Diagram(diagBB);
    
    diag.AddWaveform("Q'", "10H:2X:10L").Lock();
    diag.AddWaveform("Q", "10H:2X:10L");
    diag.AddWaveform("G", "10H:10L");
    diag.AddWaveform("D", "10H:2X:10L");

    var muxTpd = 6; // ns
    // diag.Signal("Q'").Delay("Q", Tpd);
    
    const firstClockVal = 0; // the clock starts a digital low.
    const clockPeriod = 10; // ns

    // schematic
    var schema = new scm.Schematic();

    // REGISTER GLOBAL UPDATE FUNCTION.  this is kind of nasty, But
    // it's the only global nastiness and replaces the need for a big
    // loop.  In the absense of a signaling system, it's not too
    // bad. This function is visible to all code, it updates the
    // entire UI once.

    // Update functions MUST NOT contain a call to this function. That
    // might induce ill defined recursion and general malaise.
    dlat.GLOBAL_UPDATE = function() {
        diag.Update();
    };
}

main();
