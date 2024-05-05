autowatch = 1

// TODO:
// - maybe provide the option for a turnaround at the end of the loop?
// - I don't think there's much else you want your kicks to do; if the user wants to 
//   drop the last bar or last beat, they can do that manually

var { defs } = require('./srm-db002-generator-defs.js')

var _generated_notes = []

exports.generate = function(cfg) {
    _generated_notes = []

    // notes in midi generators start/duration are specified in quarter notes
    for (var t = 0; t < defs.LOOP_LEN; t += defs.NOTE4) {
        var note = {
            pitch: cfg.drums['kick'].pitch,
            start_time: t,
            velocity: cfg.drums['kick'].max_vel,
            duration: defs.NOTE16
        }
        _generated_notes.push(note)
    }

    return _generated_notes
}

exports.get_generated_notes = function() {
    return _generated_notes
}
