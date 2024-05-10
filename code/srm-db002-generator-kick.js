autowatch = 1

// TODO:
// - maybe provide the option for a turnaround at the end of the loop?
// - I don't think there's much else you want your kicks to do; if the user wants to 
//   drop the last bar or last beat, they can do that manually

var { defs } = require('./srm-db002-generator-defs.js')
var { get_turnarounds } = require('./srm-db002-kick-turnarounds.js')
var { get_random_int, post_pattern } = require('./srm-db002-utilities.js')

var _cfg = null
var _generated_notes = []

function add_turnaround(pattern) {
    var turnarounds = get_turnarounds(_cfg.drums['kick'].min_vel, _cfg.drums['kick'].max_vel)

    var r = get_random_int(turnarounds.length)
    var turnaround = turnarounds[r]

    var pattern_with_turnaround = {
        duration: pattern.duration,
        notes: []
    }
    for(var i = 0; i < pattern.notes.length; i++) {
        var note = pattern.notes[i]
        if(note.s < pattern.duration - turnaround.duration) {
            pattern_with_turnaround.notes.push(note)
        }
    }
    var turnaround_start = pattern.duration - turnaround.duration
    for(i = 0 ; i < turnaround.notes.length; i++) {
        pattern_with_turnaround.notes.push({
            s: turnaround_start + turnaround.notes[i].s,
            v: turnaround.notes[i].v,
        })
    }

    return pattern_with_turnaround
}

function create_eight_bar_kick_pattern() {
    var pattern = {
        duration: defs.LOOP_LEN,
        notes: []
    }

    for (var t = 0; t < defs.LOOP_LEN; t += defs.NOTE4) {
        var note = {
            s: t,
            v: _cfg.drums['kick'].max_vel,
        }
        pattern.notes.push(note)
    }

    post("[create_eight_bar_kick_pattern] four on the floor:\n")
    post_pattern(pattern)

    var r = get_random_int(5)
    if (r < 1) {
        post("[create_eight_bar_kick_pattern] adding turnaround...\n")
        pattern = add_turnaround(pattern)
        post("[create_eight_bar_kick_pattern] with turnaround:\n")
        post_pattern(pattern)
    }


    return pattern
}

exports.generate = function(cfg) {
    _cfg = cfg
    _generated_notes = []

    var pattern = create_eight_bar_kick_pattern()

    // notes in midi generators start/duration are specified in quarter notes
    for (var t = 0; t < defs.LOOP_LEN; t += pattern.duration) {
        for(var i = 0; i < pattern.notes.length; i++) {
            var note = {
                pitch: _cfg.drums['kick'].pitch,
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
