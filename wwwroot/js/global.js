function getRgbStyle( values )
{
    return `rgb(${values.r}, ${values.g}, ${values.b})`;
}
function Delay(x) {
    return new Promise((resolve, reject) => {setTimeout(() => resolve(), x)});
}