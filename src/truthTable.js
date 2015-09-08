
dlat.TruthTable = function(name, labels, result) {
    this.name = name;
    this.labels = labels;
    this.result = result;
    this.Setup();
};

dlat.TruthTable.prototype = {
    // for instance TruthTable("AND", ['A', 'B'], [0, 0, 0, 1])
    // A B | Result
    // ----+-------
    // 0 0 | 0
    // 0 1 | 0
    // 1 0 | 0
    // 1 1 | 1
    Setup: function() {
        function genBinCode(n){
            var numRows = 1<<n;            
            for (var i=0; i<numRows; i++) {
                var row = replicate(n, 0); // create a list with n zeros.
                var rowIdx = 0; // to obviate fixup padding code, maintain an index.
                var x = i;
                
                // convert int to binary.
                while (x != 0) {
                    if (x%2 == 0) {
                        row[rowIdx] = 0;
                    } else {
                        row[rowIdx] = 1;
                    }
                    x = Math.floor(x / 2);
                    rowIdx++;
                }
                log(row);
            }
        }
        var bincode = genBinCode(this.labels.length);
    },
    
    AddRow: function(row) {
    }
    // Lookup: function() {
    // }
}
    
dlat.TruthTable.test = function() {
    function testAnd() {
        var tt = new dlat.TruthTable(function(a, b) {
            return a && b;
        });
    }
    testAnd();
};

if (dlat.TESTING) {
    new dlat.TruthTable("AND", ['A', 'B'], [0, 0, 0, 1]);
    //dlat.TruthTable.test();
}
