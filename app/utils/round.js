const round = num => {
    return Math.ceil(num * 10000) / 10000;
}

module.exports = round;