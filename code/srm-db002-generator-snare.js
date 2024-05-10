autowatch = 1

// TODO:
// - develop some more useful rolls/fills

var { defs } = require('./srm-db002-generator-defs.js')
var { get_rolls } = require('./srm-db002-snare-rolls.js')
var { get_random_int, create_eight_bar_pattern } = require('./srm-db002-utilities.js')

var _cfg = null
var _generated_notes = []

function add_roll(pattern) {
    var rolls = get_rolls(_cfg.drums['snare'].min_vel, _cfg.drums['snare'].max_vel)

    var r = get_random_int(rolls.length)
    var roll = rolls[r]

    var pattern_with_roll = {
        duration: pattern.duration,
        notes: []
    }
    for(var i = 0; i < pattern.notes.length; i++) {
        var note = pattern.notes[i]
        if(note.s < pattern.duration - roll.duration) {
            pattern_with_roll.notes.push(note)
        }
    }
    var roll_start = pattern.duration - roll.duration
    for(i = 0 ; i < roll.notes.length; i++) {
        pattern_with_roll.notes.push({
            s: roll_start + roll.notes[i].s,
            v: roll.notes[i].v,
        })
    }

    return pattern_with_roll
}

function create_eight_bar_snare_pattern()  {
    var pattern = create_eight_bar_pattern(_cfg.density, _cfg.bounce)

    var r = get_random_int(5)
    if (r < 1) {
        post("[create_eight_bar_snare_pattern] adding roll...\n")
        pattern = add_roll(pattern)
    }

    return pattern
}


exports.generate = function(cfg) {
    _cfg = cfg
    _generated_notes = []

    var pattern = create_eight_bar_snare_pattern()

    // notes in midi generators start/duration are specified in quarter notes
    for (var t = 0; t < defs.LOOP_LEN; t += pattern.duration) {
        for(var i = 0; i < pattern.notes.length; i++) {
            var note = {
                pitch: _cfg.drums['snare'].pitch,
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

