export const formatFilter = (object) => {
    let result = ""
    var size = Object.keys(object).length;
    let i = 0;
    for (let variable in object) {
        i++;
        result += `${variable}=${object[variable]}`
        if (i < size) result += "&"
    }
    return result;
}