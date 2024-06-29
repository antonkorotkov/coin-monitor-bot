const round = num => {
    return Math.ceil(num * 1000000) / 1000000;
}

module.exports = round;