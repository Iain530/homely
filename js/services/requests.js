export const get = (url, callback, error = () => {}) => {
    const request = new XMLHttpRequest();
    request.open('GET', url.toString(), true);
    request.onreadystatechange = () => {
        if (request.readyState === 4) {
            if (request.status === 200) {
                callback(request);
            } else {
                error(request);
            }
        }
    };
    request.send();
};
