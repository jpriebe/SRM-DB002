autowatch = 1

var { defs } = require('./srm-db002-generator-defs.js')
var { get_random_int, create_eight_bar_pattern } = require('./srm-db002-utilities.js')

var _cfg = null
var _generated_notes = []

exports.generate = function(cfg) {
    _cfg = cfg
    _generated_notes = []

    var pattern = create_eight_bar_pattern(_cfg.density, _cfg.bounce)

    // notes in midi generators start/duration are specified in quarter notes
    for (var t = 0; t < defs.LOOP_LEN; t += pattern.duration) {
        for(var i = 0; i < pattern.notes.length; i++) {
            var note = {
                pitch: _cfg.drums['perc1'].pitch,
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

