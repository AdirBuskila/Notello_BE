module.exports = {
    makeId,
    capitalizeFirstLetter,
    getTime
}


function makeId(length = 5) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getTime(timeInMilis) {
    const timeDate = new Date(timeInMilis)
    const date = timeDate.toLocaleDateString('en-GB')
    const time = timeDate.toLocaleTimeString()
    const timeBeautified = date + ' ' + time;
    return timeBeautified
}