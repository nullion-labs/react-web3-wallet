export function toWei(amount, dec = 18) {
    let stringf = '';
    for (var i = 0; i < dec; i++) {
        stringf = stringf + '0';
    }
    return amount + stringf;
}
export function fromWei(wei, dec = 18) {
    var s1 = wei.substr(0, wei.length - dec);
    var s2 = wei.substr(wei.length - dec);
    return s1 + '.' + s2;
}
