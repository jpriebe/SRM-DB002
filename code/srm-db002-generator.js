autowatch = 1

var _generators = {
    'kick': require('./srm-db002-generator-kick.js'),
    'clap': require('./srm-db002-generator-clap.js'),
    'snare': require('./srm-db002-generator-snare.js'),
    'chh': require('./srm-db002-generator-chh.js'),
    'ohh': require('./srm-db002-generator-ohh.js'),
    'perc1': require('./srm-db002-generator-perc1.js'),
    'perc2': require('./srm-db002-generator-perc2.js'),
    'pgrp': require('./srm-db002-generator-perc-group.js'),
}

var _cfg = null

var _notes = {}

exports.generate = function (cfg, skip_recalculate) {
    _cfg = cfg
    var all_notes = []

    post("[generate] - density: " + _cfg.density + "\n")
    post("[generate] - bounce: " + _cfg.bounce + "\n")
    for(k in _generators) {
        if(_generators[k] == null) {
            continue
        }
        if(_cfg.generators[k].enabled == false) {
            post("[generate] - skipping " + k + "...\n")
            continue
        }
        if(_cfg.generators[k].locked || skip_recalculate) {
            post("[generate] - retrieving last pattern for " + k + "...\n")
            _notes[k] = _generators[k].get_generated_notes()
        }
        else {
            post("[generate] - generating " + k + "...\n")
            _notes[k] = _generators[k].generate(_cfg)
            post("[generate] - got " + _notes[k].length + " notes\n")
        }
        all_notes = all_notes.concat(_notes[k])
    }

    /*
    for(i = 0; i < all_notes.length; i++) {
        post("NOTE " + all_notes[i].pitch + " " + all_notes[i].start_time + "\n")
    }
    */

    return all_notes
}