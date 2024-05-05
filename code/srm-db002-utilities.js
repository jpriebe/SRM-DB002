autowatch = 1

var { defs } = require('./srm-db002-generator-defs.js')

exports.js_to_dict = function (json_representation) {
    var dict = new Dict()
    dict.parse(JSON.stringify(json_representation))
    return dict
}

exports.dict_to_js = function (dictionary_name) {
    var dict = new Dict(dictionary_name)
    var string_representation = dict.stringify()
    return JSON.parse(string_representation)
}

exports.deep_copy = function (obj) {
    return JSON.parse(JSON.stringify(obj))
}

exports.uc_first = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function debounce(callback, delay) {
    var task = new Task(callback)
    return function () {
        //post("[debounce] cancelling task...\n")
        task.cancel()
        //post("[debounce] scheduling task for " + delay + "ms...\n")
        task.schedule(delay)
    }
}

exports.debounce = debounce

// get value from 0 to max - 1
function get_random_int (max) {
    return Math.floor(Math.random() * max);
}

exports.get_random_int = get_random_int

function is_even(n) {
    return n % 2 == 0
}

exports.is_even = is_even

exports.post_pattern = function (p) {
    var str = ""
    var t = 0;
    for(var i = 0; i < p.notes.length; i++) {
        var t1 = p.notes[i].s
        for (var j = 0; j < Math.round((t1 - t) / defs.NOTE16); j++) {
            str += " "
        }
        str += "o"
    }

    post(str + "\n")
}


function concat_patterns (patterns) {
    var pattern = {
        duration: 0,
        notes: []
    }

    var offset = 0
    //post("[concat_patterns] concatenating " + patterns.length + " patterns...\n")
    for(var i = 0; i < patterns.length; i++) {
        //post("[concat_patterns] pattern " + i + "; " + patterns[i].notes.length + "notes...\n")
        for(var j = 0; j < patterns[i].notes.length; j++) {
            var norig = patterns[i].notes[j]
            var n = {}
            for (var property in norig) {
                n[property] = norig[property]
            }
            //var n = Object.assign({}, patterns[i].notes[j])
            n.s += offset 
            pattern.notes.push(n)
        }
        offset += patterns[i].duration
    }

    pattern.duration = offset

    return pattern
}

exports.concat_patterns = concat_patterns

exports.create_eight_bar_pattern = function(density, bounce) {
    var p1 = create_one_bar_pattern(density, bounce)
    var p2 = create_one_bar_pattern(density, bounce)
    var px = {
        duration: 4,
        notes: []
    }

    var r = get_random_int(12)

    var pattern = null
    switch (r) {
        case 0:
            pattern = concat_patterns([p1, p1, p1, p1, p1, p1, p1, p1])
            break
        case 1:
            pattern = concat_patterns([p1, p1, p1, p1, p1, p1, p1, p2])
            break
        case 2:
            pattern = concat_patterns([p1, p1, p1, p2, p1, p1, p1, p2])
            break
        case 3:
            pattern = concat_patterns([p1, p1, p2, p1, p1, p1, p2, p1])
            break
        case 4:
            pattern = concat_patterns([p1, p2, p1, p2, p1, p2, p1, p2])
            break
        case 5:
            pattern = concat_patterns([p1, px, p2, px, p1, px, p2, px])
            break
        case 6:
            pattern = concat_patterns([px, p1, px, p2, px, p1, px, p2])
            break
        case 7:
            pattern = concat_patterns([p1, p2, px, px, p1, p2, px, px])
            break
        case 8:
            pattern = concat_patterns([px, px, p1, p2, px, px, p1, p2])
            break
        case 9:
            pattern = concat_patterns([px, px, px, px, px, px, p1, p2])
            break
        case 10:
            pattern = concat_patterns([px, px, px, px, px, px, px, p1])
            break
        case 11:
            pattern = concat_patterns([px, px, px, p1, px, px, px, p2])
            break
    }

    return pattern
}


function create_one_bar_pattern(density, bounce) {
    var pattern = {
        duration: 4,
        notes: []
    }

    var i = -1
    for(t = 0; t < pattern.duration; t += defs.NOTE16) {
        i++
        var r = get_random_int(100)
        if(is_even(i)) {
            if (r < bounce) {
                continue
            }
        }
        else {
            // bouncy
            if (r < 100 - bounce) {
                continue
            }
        }

        //post("[chh.create_one_bar_pattern] t: " + t + ", density: " + density + "\n")
        r = get_random_int(100)
        if(r < density) {
            pattern.notes.push({
                s: t,
            })
        }
    }

    return pattern
}

exports.create_one_bar_pattern = this.create_one_bar_pattern