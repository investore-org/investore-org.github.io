export function setAfterDecimalPoint(cutMe, howManyAfterPoint) {
    let delimiter = ".";
    let cutMeStr = "" + cutMe;
    if (cutMeStr.indexOf(delimiter) === -1) {
        return cutMe
    }
    let split = cutMeStr.split(delimiter);
    let decimal = split[0];
    let afterDecimal = split[1].substr(0, howManyAfterPoint)
    return decimal + delimiter + afterDecimal
}
