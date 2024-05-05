autowatch = 1

// TODO:
// - add some random variation at 4 or 8 bars (small fill?)
// - low percentage: add an early hit in place of a standard hit?

var { defs } = require('./srm-db002-generator-defs.js')

var _generated_notes = []

exports.generate = function(cfg) {
    _generated_notes = []

    // notes in midi generators start/duration are specified in quarter notes
    for (var t = defs.NOTE4; t < defs.LOOP_LEN; t += 2 * defs.NOTE4) {
        var note = {
            pitch: cfg.drums['clap'].pitch,
            start_time: t,
            velocity: cfg.drums['clap'].max_vel,
            duration: defs.NOTE16
        }
        _generated_notes.push(note)
    }

    return _generated_notes
}

exports.get_generated_notes = function() {
    return _generated_notes
}
