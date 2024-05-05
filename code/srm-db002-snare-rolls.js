var { defs } = require('./srm-db002-generator-defs.js')

function generate_roll16_notes(duration, min_vel, max_vel) {
    var notes = []
    var t = 0
    var i = 0;
    var intervals = Math.floor((duration / defs.NOTE16) - 1)
    for (var t = 0; t < duration; t += defs.NOTE16) {
        notes.push({
            s: defs.NOTE16 * i,
            v: Math.floor(min_vel + (max_vel - min_vel) * i / intervals)
        })
        i++
    }

    return notes

}

exports.get_rolls = function (min_vel, max_vel) {
    var rolls = [
        {
            duration: 1,
            notes: generate_roll16_notes(1, min_vel, max_vel)
        },
        {
            duration: 2,
            notes: generate_roll16_notes(2, min_vel, max_vel)
        },
        {
            duration: 3,
            notes: generate_roll16_notes(3, min_vel, max_vel)
        },
        {
            duration: 4,
            notes: generate_roll16_notes(4, min_vel, max_vel)
        },
        {
            duration: 1,
            notes: [
                { s: defs.NOTE16 * 0, v: max_vel },
                { s: defs.NOTE16 * 2, v: max_vel },
                { s: defs.NOTE16 * 3, v: max_vel },
            ]
        },
        {
            duration: 2,
            notes: [
                { s: defs.NOTE16 * 1, v: max_vel },
                { s: defs.NOTE16 * 4, v: max_vel },
                { s: defs.NOTE16 * 6, v: max_vel },
                { s: defs.NOTE16 * 7, v: max_vel },
            ]
        },
        {
            duration: 4,
            notes: [
                { s: defs.NOTE16 * 4, v: max_vel },
                { s: defs.NOTE16 * 8, v: max_vel },
                { s: defs.NOTE16 * 9, v: max_vel },
                { s: defs.NOTE16 * 10, v: max_vel },
                { s: defs.NOTE16 * 12, v: max_vel },
                { s: defs.NOTE16 * 14, v: max_vel },
                { s: defs.NOTE16 * 15, v: max_vel },
            ]
        },
        {
            duration: 4,
            notes: [
                { s: defs.NOTE16 * 4, v: max_vel },
                { s: defs.NOTE16 * 8, v: max_vel },
                { s: defs.NOTE16 * 9, v: max_vel },
                { s: defs.NOTE16 * 10, v: max_vel },
                { s: defs.NOTE16 * 12, v: max_vel },
                { s: defs.NOTE16 * 14, v: max_vel },
            ]
        },
        {
            duration: 4,
            notes: [
                { s: defs.NOTE16 * 4, v: max_vel },
                { s: defs.NOTE16 * 8, v: max_vel },
                { s: defs.NOTE16 * 10, v: max_vel },
                { s: defs.NOTE16 * 12, v: max_vel },
                { s: defs.NOTE16 * 14, v: max_vel },
                { s: defs.NOTE16 * 15, v: max_vel },
            ]
        },
        {
            duration: 12,
            notes: [
                { s: defs.NOTE16 * 0, v: max_vel },
                { s: defs.NOTE16 * 4, v: max_vel },
                { s: defs.NOTE16 * 8, v: max_vel },
                { s: defs.NOTE16 * 12, v: max_vel },
                { s: defs.NOTE16 * 16, v: max_vel },
                { s: defs.NOTE16 * 18, v: max_vel },
                { s: defs.NOTE16 * 20, v: max_vel },
                { s: defs.NOTE16 * 22, v: max_vel },
                { s: defs.NOTE16 * 24, v: max_vel },
                { s: defs.NOTE16 * 26, v: max_vel },
                { s: defs.NOTE16 * 28, v: max_vel },
                { s: defs.NOTE16 * 30, v: max_vel },
                { s: defs.NOTE16 * 32, v: max_vel },
                { s: defs.NOTE16 * 33, v: max_vel },
                { s: defs.NOTE16 * 34, v: max_vel },
                { s: defs.NOTE16 * 35, v: max_vel },
                { s: defs.NOTE16 * 36, v: max_vel },
                { s: defs.NOTE16 * 37, v: max_vel },
                { s: defs.NOTE16 * 38, v: max_vel },
                { s: defs.NOTE16 * 39, v: max_vel },
                { s: defs.NOTE16 * 40, v: max_vel },
                { s: defs.NOTE16 * 41, v: max_vel },
                { s: defs.NOTE16 * 42, v: max_vel },
                { s: defs.NOTE16 * 43, v: max_vel },
                { s: defs.NOTE16 * 44, v: max_vel },
                { s: defs.NOTE16 * 45, v: max_vel },
                { s: defs.NOTE16 * 46, v: max_vel },
                { s: defs.NOTE16 * 47, v: max_vel },
            ]
        }
    ]

    return rolls
}