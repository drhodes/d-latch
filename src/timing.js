// -*- js2 -*-

// the timing diagram module
dlat.timing = function() {
    var snap = dlat.common.snap;    
    var mod = {}; // the module
    const WAVEFORM_HEIGHT = 100;
    const DEFAULT_NUM_PIXELS_PER_NS = 100;
    
    // SegmentUI Class
    {
        // ------------------------------------------------------------------
        // A segment is a piece of the waveform that is associated with a
        // time delta and two volt-time points
        mod.SegmentUI = function() {
            this.line = snap.line(0,0, 10,0); // arbitrary poisition
            this.line.attr({
                stroke: '#333',
                strokeWidth: '1px'
            });            
        };
        
        mod.SegmentUI.prototype = {
            MoveTo: function(x, y) {
                m = new Snap.Matrix().translate(x, y);
                this.line.transform(m);
            }
        };
        
    }

    // Waveform Class
    {
        // ------------------------------------------------------------------
        // Waveform takes a boundingBox that defines the dimensions and
        // location of the single plot, one row in the larger diagram.
        // This plot represents the voltage found on one wire of a
        // circuit.
        
        mod.Waveform = function(name, data, bb) {
            this.name = name;
            this.curSignal = 0; // value from [0 -> 1]
            
            var parser = new mod.WaveformParser(data);
            this.voltPoints = parser.GetVoltPoints();
            this.bb = bb;
            
            var padding = 3;
            var roomForName = 60; // make room for the name
            
            this.innerBox = bb.
                Shrink(padding).
                MoveRight(roomForName).
                ReduceWidth(roomForName);
           
            this.background = new dlat.BackgroundBox(bb, "#EEE");
            this.innerBackground = new dlat.BackgroundBox(this.innerBox, "#DDD");

            var fontSize = 20;
            var textX = bb.Left() + padding;
            var textY = bb.Top() + bb.Height()/2 + fontSize/4;
            
            this.text = snap.text(textX, textY, name).attr({
                font: fontSize + "px source-sans-pro, Source Sans Pro",
                textAnchor: "center"
            });
        };
        
        mod.Waveform.prototype = {
            Update: function(t) {
                log("updating waveform: " + this.name + ", time: " + t);
            },
            
            ShiftLeft: function() {
            },

            Zoom: function() {
            },

            parseSegments() {
            },

            // which part of the canvas is occupied
            BoundingBox() {
                return this.bb;
            },
        };
    }

    // Waveform Parser
    {
        // Valid segment types, are:
        //  L for Low
        //  X is for Transitioning
        //  H is for High        
        const VALID_SEG_TYPES = "LXH";
        
        mod.WaveformParser = function(data) {
            this.voltPoints = this.parseData(data);
            
        };        
        mod.WaveformParser.prototype = {
            // -------------------------------------------------------
            validSegType: function(c) {
                return contains(VALID_SEG_TYPES, c);
            },
            
            // return a list of points (v, t), where t is time in nano
            // seconds and v from [0, 1]
            parseData: function(data) {
                var segs = data.split(":");
                var lex = [];
                
                for (var i in segs) {
                    var seg = segs[i];
                    var segType = seg.slice(-1);
                    
                    // as a convention data can't start with a transition (X)
                    if (i == 0 && segType == "X") {
                        throw "data can't start with a segment with type 'X'";
                    }                    
                    if (this.validSegType(segType)) {
                        var segLen = parseInt(seg.slice(0, -1));
                        lex.push({len: segLen, type: segType});                    
                    } else {
                        throw "unknown segment type found: " + segType;
                    }                
                }
                return this.renderSegments(lex);
            },
            
            // <3p
            renderSegments: function(segs) {
                // a list of voltages, each a nanosecond wide, as convention.
                var voltPoints = [];
                var lastVoltPoint = function() {
                    if (voltPoints.length == 0) {
                        return 0;
                    }
                    return voltPoints.slice(-1)[0];
                };
                
                var handleL = function(n, L) {
                    for (var i=0; i<n; i++) {
                        voltPoints.push(0);
                    }
                };
                
                var handleH = function(n, H) {
                    for (var i=0; i<n; i++) {
                        voltPoints.push(1);
                    }
                };
                
                var handleX = function(n, X) {
                    var slope = 1.0 / (n+1);

                    // there are two cases
                    if (lastVoltPoint() == 1) { 
                        // if the last value is high, then transition lower.
                        for (var i=1; i<(n+1); i++) {
                            voltPoints.push(1 - i*slope);
                        }
                    } else {                    
                        // if the last value is low, then transition higher.
                        for (var i=1; i<n+1; i++) {
                            voltPoints.push(0 + i*slope);
                        }
                    }
                };
                
                var handleSeg = function(seg) {
                    var numNanoSecs = seg.len;
                    var getType = seg.type;
                    if (getType == "L") {
                        handleL(numNanoSecs, getType);
                    }
                    if (getType == "H") {
                        handleH(numNanoSecs, getType);
                    }
                    if (getType == "X") {
                        handleX(numNanoSecs, getType);
                    }
                };
                
                for (var i in segs) {
                    var seg = segs[i];
                    handleSeg(seg);
                    log(seg);
                }
                log(voltPoints);
            },


            GetVoltPoints: function() {
                return self.voltPoints;
            }
        };
    }
       
    // Diagram Class
    {
        // ------------------------------------------------------------------
        // Manage the waveforms, will need a time line and a sweep bar.  Also
        // need a master wall clock and zoom buttons.
        //
        mod.Diagram = function(boundingBox) {
            this.boundingBox = boundingBox;
            this.curTime = 0; // in nanoseconds.
            this.timeLine = nil;
            this.sweepBar = nil; // this is aligned with the current time.
            this.waveforms = [];
        };
        
        mod.Diagram.prototype = {
            // waveforms need to shift right T nano seconds. Keep the sweep
            // bar in the middle of the scroll region, so the important
            // bits are always at the center.
            Update: function(curTime) {
                this.waveforms.forEach(function(wf) {
                    wf.Update(curTime);
                });
            },

            // Add a waveform to the diagram.  name the waveform and pass in the
            // data.  the data, what is it?  It looks like this:
            // "5L:4X:3H", which represents 5 ns worth of low voltage,
            // rising edge for 4 ns, and 3 nanoseconds worth of high.
            AddWaveform: function(name, data) {
                var wfbb = this.boundingBox.
                        Clone().
                        SetHeight(WAVEFORM_HEIGHT).
                        MoveDown(this.heightOfAllWaveforms());
                
                var waveform = new mod.Waveform(name, data, wfbb);
                
                if (this.RoomForWaveform(waveform)) { 
                    this.waveforms.push(waveform);
                    log(waveform);
                } else {
                    throw "AddWaveform can't add: " + name +
                        ", not enough pixels. " +
                        "The Diagram object needs a bigger BoundingBox to start with.";
                }
            },
            
            heightOfAllWaveforms: function() {
                var totalHeight = 0;
                this.waveforms.forEach(function(wf) {
                    totalHeight += wf.BoundingBox().Height();
                });
                return totalHeight;
            },
            
            RoomForWaveform: function(waveform) {
                var dh = waveform.BoundingBox().Height();
                return this.heightOfAllWaveforms() + dh < this.boundingBox.Height();
            },
            
            // zoom all the waveforms in time.
            Zoom: function() {
            }
        };
    }
    
    return mod;
}();

