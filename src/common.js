
// global namespace for d-latch
var dlat = {};

// common types and goodies found throughout the project.
dlat.common = function() {
    var mod = {};
    
    mod.initSnap = function() {
        mod.snap = Snap("#snapCanvas");
        // do some error checking here.
        if (isUndefined(mod.snap)) {
            throw "mod.snap is undefined";
        }

        //var bigCircle = mod.snap.circle(150, 150, 100);
        // By default its black, lets change its attributes
    };

    mod.initSnap();
    dlat.snap = mod.snap;
    return mod;
}();

