var nil = null; // "an elegent weapon for a more civilized age" -obi wan

function isUndefined(ref) {
    return typeof ref == 'undefined' || ref == nil;
}

function log(x) { console.log(x); }


function api(o) {
    log(o.prototype);
}

function contains(seq, item) {
    return seq.indexOf(item) != -1;
}
