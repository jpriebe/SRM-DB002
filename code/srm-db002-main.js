autowatch = 1
outlets = 2

post("[SRM-DB002] loading...\n")

var { generate } = require('./code/srm-db002-generator.js')
var { js_to_dict, dict_to_js, debounce } = require('./srm-db002-utilities.js')

var _context = {}
var _initialized = false

var _skip_next_recalculate = false

var object_initial_values_set = {}
var num_object_initial_values_to_set = 0
var num_object_initial_values_set = 0

var _cfg = {
    density: 35,
    bounce: 75,
    generators: {
        'kick': {
            enabled: true,
            locked: false,
        },
        'clap': {
            enabled: true,
            locked: false,
        },
        'snare': {
            enabled: true,
            locked: false,
        },
        'chh': {
            enabled: true,
            locked: false,
        },
        'ohh': {
            enabled: true,
            locked: false,
        },
        'perc1': {
            enabled: true,
            locked: false,
        },
        'perc2': {
            enabled: true,
            locked: false,
        },
        'pgrp': {
            enabled: true,
            locked: false,
        },
    },
    drums: {
        'kick': {
            pitch: 36,
            min_vel: 127,
            max_vel: 127,
        },
        'clap': {
            pitch:39,
            min_vel: 127,
            max_vel: 127,
        },
        'snare': {
            pitch: 37,
            min_vel: 32,
            max_vel: 96,
        },
        'chh': {
            pitch: 44,
            min_vel: 32,
            max_vel: 64,
        },
        'ohh': {
            pitch: 45,
            min_vel: 127,
            max_vel: 127,
        },
        'perc1': {
            pitch: 38,
            min_vel: 64,
            max_vel: 127,
        },
        'perc2': {
            pitch: 47,
            min_vel: 64,
            max_vel: 127,
        },
        'pgrp1': {
            enabled: true,
            pitch: 40,
            min_vel: 127,
            max_vel: 127,
        },
        'pgrp2': {
            enabled: true,
            pitch: 41,
            min_vel: 127,
            max_vel: 127,
        },
        'pgrp3': {
            enabled: true,
            pitch: 42,
            min_vel: 127,
            max_vel: 127,
        },
    }
}

function set_context(dummy, dictName) {
    post("[set_context]\n")
    _context = dict_to_js(dictName)
}

function initialize() {
    post("[initialize] setting up bookkeeping...\n")

    object_initial_values_set["density"] = false
    object_initial_values_set["bounce"] = false

    var k
    for(k in _cfg.drums) {
        object_initial_values_set["drum-note-" + k] = false
    }
    for(k in _cfg.generators) {
        object_initial_values_set["generator-enabled-" + k] = false
        object_initial_values_set["generator-locked-" + k] = false
    }

    // count number of objects that will be initialized
    for(var k in object_initial_values_set) {
        num_object_initial_values_to_set++
    }
}

function complete_initialization() {
    post("[complete_initialize] loading settings...\n")
    load_settings()

    post("[complete_initialize] initialized.\n")
    _initialized = true
}

function change() {
    if (ready) {
        outlet(1, 'bang')
    }
}

function load_settings() {
    var path = this.patcher.filepath + ".json"

    var d = new Dict()
    d.import_json(path)

    var keys = d.getkeys()
    if (keys == null) {
		post("[load_settings] file '" + path + "' does not exist or could not be opened; using default settings...\n")
        return
    }

    post("[load_settings] read dict from '" + path + "':\n")

    // Translate to js object
    var new_cfg = JSON.parse( d.stringify() )
    post( JSON.stringify(new_cfg),"\n")

    _cfg = new_cfg

    var o
    o = this.patcher.getnamed("density");
    o.set(_cfg["density"])
    o = this.patcher.getnamed("bounce");
    o.set(_cfg["bounce"])

    var k
    var oname
    for(k in _cfg.generators) {
        oname = "gen-enable-" + k
        o = this.patcher.getnamed(oname);
        o.set(_cfg.generators[k].enabled)

        // I don't think we should restore lock status -- the lock status is a kind of transient thing
        // that you use during an interactive session to dial in the generated beats
        //oname = "gen-lock-" + k
        //o = this.patcher.getnamed(oname);
        //o.set(_cfg.generators[k].locked)
    }
    for(k in _cfg.drums) {
        oname = "drum-note-" + k
        o = this.patcher.getnamed(oname);
        o.set(_cfg.drums[k].pitch)
    }
}

function _save_settings() {
    var path = this.patcher.filepath + ".json"

    post("[save_settings] saving settings to " + path + "...\n")
    var fp = new File(path, "write", "TEXT")
    if (!fp.isopen) {
        post("[save_settings] ERROR: could not create json file: " + path + "\n")
        return
    }
    fp.eof = 0;
    fp.writeline(JSON.stringify(_cfg, null, "\t"))
    fp.close()
    post("[save_settings] saved settings.\n")
}

var save_settings = debounce(_save_settings, 500)

function check_initialized(object_label) {
    if (_initialized) {
        return true
    }

    // Max for Live seems to send initial values to every object, even if
    // "Initial Enable" is not checked.  And when these values are set, it behaves
    // just as if the user had entered a value.
    // So we ignore the first time the value is set for each object; we don't want to
    // trigger all the generation of notes and save the settings, etc.
    if (!object_initial_values_set[object_label]) {
        //post("[check_initialized] skipping initial value set for " + object_label + "...\n")
        object_initial_values_set[object_label] = true
        num_object_initial_values_set++

        if (num_object_initial_values_set == num_object_initial_values_to_set) {
            post("[check_initialized] all objects initial values set, completing initialization...\n")
            complete_initialization()
        }

        return false
    }

    // should only get here while we are loading in the settings
    return false
}

function set_generator_enabled(generator, value) {
    if (!check_initialized("generator-enabled-" + generator)) {
        return
    }
    var bool_val = (value == 1)
    post("[set_generator_enabled] setting generator '" + generator + "' enabled = " + bool_val + "\n")
    _cfg.generators[generator].enabled = bool_val

    save_settings()

    _skip_next_recalculate = true
    send_bang()
}

function set_drum_note(drum, value) {
    if (!check_initialized("drum-note-" + drum)) {
        return
    }
    post("[set_drum_note] setting drum note '" + drum + "' to " + value + "\n")
    _cfg.drums[drum].pitch = value

    save_settings()

    _skip_next_recalculate = true
    send_bang()
}

function set_density(density) {
    if (!check_initialized("density")) {
        return
    }

    post("[set_density] setting density to " + density + "\n")
    _cfg.density = density
    save_settings()
    send_bang()
}

function set_bounce(bounce) {
    if (!check_initialized("bounce")) {
        return
    }

    post("[set_bounce] setting bounce to " + bounce + "\n")
    _cfg.bounce = bounce
    save_settings()
    send_bang()
}

function set_generator_locked(generator, value) {
    if (!check_initialized("generator-locked-" + generator)) {
        return
    }

    var bool_val = (value == 1)
    post("[set_generator_locked] setting generator '" + generator + "' lock to " + bool_val + "\n")
    _cfg.generators[generator].locked = bool_val
    
    save_settings()
}

function bang() {
    var outputDictionary = {
        notes: []
    }

    if (!_initialized) {
        outlet(0, 'dictionary', js_to_dict(outputDictionary).name)
        return
    }
    post("generating notes...\n")

    var notes = generate(_cfg, _skip_next_recalculate)
    _skip_next_recalculate = false

    post("clipping notes to selected range...\n")

    clipped_notes = []
    for (i = 0; i < notes.length; i++) {
        var note = notes[i]
        //post("Comparing start time (" + note.start_time + ") against clip selection start/stop (" + _context.clip.time_selection_start + "/" + _context.clip.time_selection_end + ")\n")
        if(note.start_time >= _context.clip.time_selection_start && note.start_time < _context.clip.time_selection_end) {
            //post("CLIPPED NOTE " + notes[i].pitch + " " + notes[i].start_time + "\n")
            clipped_notes.push(note)
        }
    }

    outputDictionary.notes = clipped_notes

    post("outputting dictionary...\n")

    outlet(0, 'dictionary', js_to_dict(outputDictionary).name)
}

function _send_bang() {
    post("[send_bang] sending bang...\n")
    outlet(1, 'bang')
}

var send_bang = debounce(_send_bang, 50)