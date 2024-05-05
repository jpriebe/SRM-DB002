autowatch = 1

// TODO:
// - treat perc drums as a group; build a pattern and then slice it across the
//   drums in the group so you can get a sort of call-and-response
// - user should be able to toggle individual perc drums on and off; sometimes you
//   might want a simpler perc pattern with only 1 or 2 of the drums

var { defs } = require('./srm-db002-generator-defs.js')
var { get_random_int, create_eight_bar_pattern, concat_patterns } = require('./srm-db002-utilities.js')

var _cfg = null
var _generated_notes = []

function assign_drums(pattern) {
    var subpattern_duration = 4
    r = get_random_int(10)
    if (r < 5) {
        subpattern_duration = 8
    }

    var subpatterns = []
    var num_subpatterns = defs.LOOP_LEN / subpattern_duration
    for(var i = 0; i < num_subpatterns; i++) {
        subpatterns[i] = {
            duration: subpattern_duration,
            notes: []
        }
    }

    // break the pattern into subpatterns
    for(var i = 0; i < pattern.notes.length; i++) {
        var subpat_idx = Math.floor(pattern.notes[i].s / subpattern_duration)
        var offset = subpattern_duration * subpat_idx
        //post("[assign_drums] note " + i + ", start = " + pattern.notes[i].s + ", subpattern: " + subpat_idx + "\n")
        pattern.notes[i].s -= offset
        subpatterns[subpat_idx].notes.push(pattern.notes[i])
    }

    // come up with a sequence of drum assignments
    var drum_assignments = []
    for(var i = 0; i < subpattern_duration * 4; i++) {
        var r = get_random_int(3)
        drum_assignments.push(r)
    }

    // for each subpattern, assign notes
    for(var i = 0; i < num_subpatterns; i++) {
        //post("[assign_drums] processing subpattern " + i + "...\n")
        for(var j = 0; j < subpatterns[i].notes.length; j++) {
            //post("[assign_drums]   note " + j + ":")
            switch(drum_assignments[j]) {
                case 0:
                    //post("pgrp1\n")
                    subpatterns[i].notes[j].p = _cfg.drums['pgrp1'].pitch
                    break
                case 1:
                    //post("pgrp2\n")
                    subpatterns[i].notes[j].p = _cfg.drums['pgrp2'].pitch
                    break
                case 2:
                    //post("pgrp3\n")
                    subpatterns[i].notes[j].p = _cfg.drums['pgrp3'].pitch
                    break
            }

        }
    }

    return concat_patterns(subpatterns)
}

exports.generate = function(cfg) {
    _cfg = cfg
    _generated_notes = []

    var pattern = create_eight_bar_pattern(_cfg.density, _cfg.bounce)
    //post("[generate] eight bar pattern: " + pattern.notes.length + " notes...\n")
    pattern = assign_drums(pattern)
    //post("[generate] pattern after drum assignment: " + pattern.notes.length + " notes...\n")

    // notes in midi generators start/duration are specified in quarter notes
    for (var t = 0; t < defs.LOOP_LEN; t += pattern.duration) {
        for(var i = 0; i < pattern.notes.length; i++) {
            var note = {
                pitch: pattern.notes[i].p,
                start_time: t + pattern.notes[i].s,
                velocity: pattern.notes[i].v,
                duration: defs.NOTE16
            }
            _generated_notes.push(note)
        }
    }

    return _generated_notes
}

exports.get_generated_notes = function() {
    return _generated_notes
}

