var nil = null; // "an elegent weapon for a more civilized age" -obi wan

function isUndefined(ref) {
    return typeof ref == 'undefined' || ref == nil;
}

function log(x) { console.log(x); }

function contains(seq, item) {
    return seq.indexOf(item) != -1;
}

function replicate(n, val) {
    var xs = [];
    for (var i=0; i<n; i++) {
        xs.push(val);
    }
    return xs;
}
function replicateString(n, val) {
    var xs = "";
    for (var i=0; i<n; i++) {
        xs = xs + val;
    }
    return xs;
}
