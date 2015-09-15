// Module for the timing diagram

dlat.timing = function() {
    // the module
    var mod = {}; 
    
    // imports
    var snap = dlat.common.snap;
    var box = dlat.box;
    
    const WAVEFORM_HEIGHT = 80;
    const TRIGGERLINE_HEIGHT = 10;
    const TRIGGERLINE_BGCOLOR = "#AAA";
    const TRIGGERBOX_BGCOLOR = "#999";
    
    const NUM_TIME_STEPS = 100;    
    const NS_PER_TRIGGER_BOX = 10;
    
    // class TriggerBox
    {
        // ------------------------------------------------------------------
        // A trigger box defines a point on the trigger line, which is
        // a specific time in nano seconds offset from zero.  If the
        // trigger box is checked then the input is toggled
        
        // constructor
        mod.TriggerBox = function(boundingBox) {
            this.activated = false;
            this.boundingBox = boundingBox;
            this.hollowBox = new box.HollowBox( boundingBox,
                                                TRIGGERBOX_BGCOLOR,
                                                TRIGGERBOX_BGCOLOR);
            this.indicator = nil;
            this.setupIndicator();
            this.setupEventCallbacks();
        };
        mod.TriggerBox.prototype = {
            setupIndicator: function() {
                var bb = this.boundingBox;
                var t = bb.Top();
                var b = bb.Bottom();
                var l = bb.Left();
                var r = bb.Right();
                var m = (l+r)/2;

                this.indicator = snap.polyline(l, t,
                                               r, t,
                                               m, b,
                                               l, t);
                this.indicator.attr({
                    fill: TRIGGERBOX_BGCOLOR,
                    stroke: TRIGGERBOX_BGCOLOR,
                    strokeWidth: '.5px'
                });
                
                var self=this;
                this.indicator.mousedown(function() {
                    self.ToggleIndicator();
                });
            },

            // It may be necessary to lock out a range of trigger
            // boxes, this method locks one.
            Lock: function() {
                // remove the callbacks from this trigger box.
                // change the colors.
            },

            Clear: function() {
                if (this.activated) {
                    this.ToggleIndicator();
                }
            },
            
            ToggleIndicator: function() {
                var onColor = "#1F1";
                var offColor = TRIGGERBOX_BGCOLOR;
                this.activated = !this.activated;
                
                if (this.activated) {                    
                    this.indicator.attr({ fill: onColor });
                } else {
                    this.indicator.attr({ fill: offColor });
                }
            },
            
            // +m
            setupEventCallbacks: function() {
                var self = this;
                this.hollowBox.AddEvent( 'mousedown', function() {
                    self.ToggleIndicator();
                });
                this.hollowBox.AddEvent( 'mousemove', function() {
                    self.GlowIndicator(true);
                });
                this.hollowBox.AddEvent( 'mouseout', function() {
                    self.GlowIndicator(false);
                });
                this.indicator.mousemove(function() {
                    self.GlowIndicator(true);
                });
                this.indicator.mouseout(function() {
                    self.GlowIndicator(false);
                });
            },

            
            GlowIndicator: function(shouldGlow) {
                var glowColor = "#FFF";
                var noGlowColor = box.TRIGGERBOX_BGCOLOR;
                if (shouldGlow) {
                    this.indicator.attr({ stroke: glowColor,
                                          strokeWidth: 1
                                        });
                } else {
                    this.indicator.attr({ stroke: noGlowColor,
                                          strokeWidth: .5
                                        });
                }
            }
        };
    }
    
    // class TriggerLineClear
    {
        // ------------------------------------------------------------------
        // Clear out the trigger line
        
        // constructor
        mod.TriggerLineClear = function(boundingBox) {
            this.clearFlag = false;
            var spacer = 3;
            this.boundingBox = boundingBox
                .MoveLeft(TRIGGERLINE_HEIGHT + spacer - 1)
                .SetHeight(TRIGGERLINE_HEIGHT - 2)
                .SetWidth(TRIGGERLINE_HEIGHT - 2 )
                .MoveDown(1);
            
            var bb = this.boundingBox;    
            // make an x in the box.
            // draw a line from top left to bottom right
            this.line1 = snap.line(bb.Left(), bb.Top(), bb.Right(), bb.Bottom());
            this.line1.attr({
                stroke: "#000",
                strokeWidth: ".5px"
            });
            this.line2 = snap.line(bb.Right(), bb.Top(), bb.Left(), bb.Bottom());
            this.line2.attr({
                stroke: "#000",
                strokeWidth: ".5px"
            });

            this.hollowBox = new box.HollowBox( bb,
                                                TRIGGERBOX_BGCOLOR,
                                                TRIGGERBOX_BGCOLOR);
            this.hollowBox.Attr({opacity: 0.3});
            this.setupEventCallbacks();
        };
        
        mod.TriggerLineClear.prototype = {
            setupEventCallbacks: function() {
                var onColor = "#F11";
                var offColor = TRIGGERBOX_BGCOLOR;
                var self = this;
                // box events.
                this.hollowBox.AddEvent( 'mousedown', function() {
                    self.clearFlag = true;
                    self.hollowBox.Attr({fill:onColor});
                    dlat.GLOBAL_UPDATE();
                });
                this.hollowBox.AddEvent( 'mouseup', function() {
                    self.hollowBox.Attr({fill:offColor});
                });
                this.hollowBox.AddEvent( 'mouseover', function() {
                    self.hollowBox.Attr({ stroke:onColor, strokeWidth:"2px" });
                });
                this.hollowBox.AddEvent( 'mouseout', function() {
                    self.hollowBox.Attr({ stroke:offColor, strokeWidth:"2px" });
                });
            },
            
            NeedsToClear: function() {
                return this.clearFlag;
            },
            Reset: function() {
                this.clearFlag = false;
            }
        };

    }

    // class TriggerLine
    {
        // ------------------------------------------------------------------
        // This is the bar on top of the wave form that lets users
        // sequence a toggle on a particular input.
        // constructor
        mod.TriggerLine = function(boundingBox) {
            this.height = TRIGGERLINE_HEIGHT;
            this.boundingBox = boundingBox.SetHeight(TRIGGERLINE_HEIGHT);
            this.backgroundBox = new box.BackgroundBox( this.boundingBox,
                                                         TRIGGERLINE_BGCOLOR);
            this.triggerBoxes = [];
            this.SetupTriggerBoxes();
        };
        
        mod.TriggerLine.prototype = {
            SetupTriggerBoxes: function() {
                // split the bounding box into a number of bounding boxes,
                var widthPerBox = this.boundingBox.Width() / NUM_TIME_STEPS;
                var templateBox = this.boundingBox.SetWidth(widthPerBox);
                
                for (var i=0; i<NUM_TIME_STEPS; i++) {
                    var dx = i * widthPerBox;
                    var bb = templateBox.MoveRight(dx);
                    var tb = new mod.TriggerBox(bb);                    
                    this.triggerBoxes.push(tb);
                }
            },

            Clear: function() {
                for (var i=0; i<NUM_TIME_STEPS; i++) {
                    this.triggerBoxes[i].Clear();
                }
            },
            
            Height: function() {
                this.boundingBox.Height();
            },
            
            BoundingBox: function() {
                return this.boundingBox.Clone();
            }
        };
    }
    
    // class SegmentUI
    {
        // ------------------------------------------------------------------
        // A segment is a piece of the waveform that is associated with a
        // time delta and two volt-time points
        mod.SegmentUI = function() {
            this.line = snap.line(0,0, 10,0); // arbitrary position
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

    // class WavePlot
    {
        // constructor
        mod.WavePlot = function(boundingBox) {
            const padding = 3;
            const nudge = 1;
            this.boundingBox = boundingBox
                .MoveDown(padding)
                .SetHeight(boundingBox.Height() - 2*padding)
                .Shrink(nudge);
            this.bgBox = new box.BackgroundBox(this.boundingBox, "#FFF");
            this.bgBox.Attr({ strokeWidth: "0px"});
        };
        
        // methods
        mod.WavePlot.prototype = {
        };
    }

    
    // class Waveform
    {
        // ------------------------------------------------------------------
        // Waveform takes a boundingBox that defines the dimensions and
        // location of the single plot, one row in the larger diagram.
        // This plot represents the voltage found on one wire of a
        // circuit.

        // Waveform constructor
        mod.Waveform = function(name, data, bb) {
            this.name = name;
            this.curSignal = 0; // value from [0 -> 1]
            
            var parser = new mod.WaveformParser(data);
            this.voltPoints = parser.GetVoltPoints();
            this.bb = bb;

            var padding = 3; // visual space
            var roomForName = 60; // make room for the name
            
            var innerBox = bb.
                    Shrink(padding).
                    MoveRight(roomForName).
                    ReduceWidth(roomForName);

            // move the innerBox down to make room for the trigger line.
            this.innerBox = innerBox.
                MoveDown(TRIGGERLINE_HEIGHT).
                SetHeight(innerBox.Height() - TRIGGERLINE_HEIGHT);

            this.background = new box.BackgroundBox(bb, "#EEE");
            this.innerBackground = new box.BackgroundBox(this.innerBox, "#DDD");

            this.wavePlot = new mod.WavePlot(this.innerBox);
            
            var fontSize = 20;
            var textX = bb.Left() + padding;
            var textY = bb.Top() + bb.Height()/2 + fontSize/4;
            
            this.text = snap.text(textX, textY, name).attr({
                font: fontSize + "px source-sans-pro, Source Sans Pro",
                textAnchor: "center"
            });

            // a trigger line lives at the top of the wave form.  It
            // occupies the entire width of the inner box and some
            // small height of it.
            this.triggerLine = new mod.TriggerLine(innerBox);
            this.triggerLineClear = new mod.TriggerLineClear(innerBox);
            // 
            
            // experiment
            // var c = snap.image("gifs/indicator.gif", 400, 400, 288, 224);
        };
        
        mod.Waveform.prototype = {
            Update: function(t) {
                if (this.triggerLineClear.NeedsToClear()) {
                    this.triggerLine.Clear();
                    this.triggerLineClear.Reset();
                }                
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
            }
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
            
            // 
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
                }
            },

            GetVoltPoints: function() {
                return this.voltPoints;
            }
        };
    }
       
    // Diagram Class
    {
        // ------------------------------------------------------------------
        // Manage the waveforms, will need a time line and a scrubber.  Also
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
            Update: function() {
                this.waveforms.forEach(function(wf) {
                    wf.Update();
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
                } else {
                    throw "AddWaveform can't add: " + name +
                        ", not enough pixels. " +
                        "The Diagram object needs a bigger BoundingBox to start with.";
                    // can't justify building a layout framework for this yet. :)
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

