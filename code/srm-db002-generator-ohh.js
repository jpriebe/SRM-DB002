autowatch = 1

// TODO:
// - ghost notes? https://forum.ableton.com/viewtopic.php?t=176601

var { defs } = require('./srm-db002-generator-defs.js')

var _generated_notes = []

exports.generate = function(cfg) {
    _generated_notes = []

    // notes in midi generators start/duration are specified in quarter notes
    for (var t = defs.NOTE8; t < defs.LOOP_LEN; t += defs.NOTE4) {
        var note = {
            pitch: cfg.drums['ohh'].pitch,
            start_time: t,
            velocity: cfg.drums['ohh'].max_vel,
            duration: defs.NOTE16
        }
        _generated_notes.push(note)
    }

    return _generated_notes
}

exports.get_generated_notes = function() {
    return _generated_notes
}