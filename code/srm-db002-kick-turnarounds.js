var { defs } = require('./srm-db002-generator-defs.js')

exports.get_turnarounds = function (min_vel, max_vel) {
    var turnarounds = [
        {
            duration: 1,
            notes: [
                { s: defs.NOTE16 * 0, v: max_vel },
                { s: defs.NOTE16 * 1, v: max_vel },
                { s: defs.NOTE16 * 2, v: max_vel },
                { s: defs.NOTE16 * 3, v: max_vel },
            ]
        },
        {
            duration: 1,
            notes: [
                { s: defs.NOTE16 * 0, v: max_vel },
                { s: defs.NOTE16 * 3, v: max_vel },
            ]
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
            duration: 1,
            notes: [
                { s: defs.NOTE16 * 0, v: max_vel },
                { s: defs.NOTE16 * 1, v: max_vel },
                { s: defs.NOTE16 * 3, v: max_vel },
            ]
        },
        {
            duration: 2,
            notes: [
                { s: defs.NOTE16 * 0, v: max_vel },
                { s: defs.NOTE16 * 1, v: max_vel },
                { s: defs.NOTE16 * 2, v: max_vel },
                { s: defs.NOTE16 * 4, v: max_vel },
                { s: defs.NOTE16 * 5, v: max_vel },
                { s: defs.NOTE16 * 6, v: max_vel },
            ]
        },
    ]

    return turnarounds
}