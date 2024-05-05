autowatch = 1

// TODO:
// - more variation?  this module is pretty good
// - maybe allow for patterns that are 1/2 bar long or even a full bar?

var { defs } = require('./srm-db002-generator-defs.js')
var { get_random_int } = require('./srm-db002-utilities.js')

var _cfg = null

var _generated_notes = []

function create_one_beat_pattern() {
    var r = get_random_int(6)

    var pattern = {
        duration: 1,
        notes: []
    }

    switch(r) {
        case 0:
            post("[chh.generate] rhythm strategy: 1-2-3-4\n")
            pattern.notes = [
                { s: 0 },
                { s: defs.NOTE16 },
                { s: defs.NOTE16 * 2 },
                { s: defs.NOTE16 * 3 },
            ]
            break
        case 1:
            post("[chh.generate] rhythm strategy: x-2-3-4\n")
            pattern.notes = [
                { s: defs.NOTE16 },
                { s: defs.NOTE16 * 2 },
                { s: defs.NOTE16 * 3 },
            ]
            break
        case 2:
            post("[chh.generate] rhythm strategy: 1-x-3-4\n")
            pattern.notes = [
                { s: 0 },
                { s: defs.NOTE16 * 2 },
                { s: defs.NOTE16 * 3 },
            ]
            break
        case 3:
            post("[chh.generate] rhythm strategy: 1-2-x-4\n")
            pattern.notes = [
                { s: 0 },
                { s: defs.NOTE16 },
                { s: defs.NOTE16 * 3 },
            ]
            break
        case 4:
            post("[chh.generate] rhythm strategy: 1-2-3-x\n")
            pattern.notes = [
                { s: 0 },
                { s: defs.NOTE16 },
                { s: defs.NOTE16 * 2 },
            ]
            break
        case 5:
            post("[chh.generate] rhythm strategy: random\n")
            if(get_random_int(100) > 50) {
                pattern.notes.push({s: 0})
            }
            if(get_random_int(100) > 50) {
                pattern.notes.push({s: defs.NOTE16})
            }
            if(get_random_int(100) > 50) {
                pattern.notes.push({s: defs.NOTE16 * 2})
            }
            if(get_random_int(100) > 50) {
                pattern.notes.push({s: defs.NOTE16 * 3})
            }
            break
    }

    // now set velocities

    // calculate velocity levels between min/max 
    var vels = []
    var min_vel = _cfg.drums['chh'].min_vel
    var max_vel = _cfg.drums['chh'].max_vel
    for(i = 0; i < pattern.notes.length; i++){
        vels[i] = Math.round(min_vel + (max_vel - min_vel) * i / (pattern.notes.length - 1))
    }

    // decide how to assign velocity
    r = get_random_int(100)

    if (r < 33) {
        post("[chh.generate] velocity strategy: upward\n")
        for(i = 0; i < pattern.notes.length; i++){
            pattern.notes[i].v = vels[i]
        }
    }
    else if (r < 66) {
        post("[chh.generate] velocity strategy: downward\n")
        for(i = 0; i < pattern.notes.length; i++){
            pattern.notes[i].v = vels[pattern.notes.length - i]
        }
    }
    else {
        post("[chh.generate] velocity strategy: random\n")
        for(i = 0; i < pattern.notes.length; i++){
            r2 = get_random_int(vels.length)
            pattern.notes[i].v = vels[r2]
        }
    }

    return pattern
}

exports.generate = function(cfg) {
    _cfg = cfg
    _generated_notes = []

    var pattern = create_one_beat_pattern()
    // notes in midi generators start/duration are specified in quarter notes
    for (var t = 0; t < defs.LOOP_LEN; t += pattern.duration) {
        for(var i = 0; i < pattern.notes.length; i++) {
            var note = {
                pitch: _cfg.drums['chh'].pitch,
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
