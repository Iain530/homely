export const get = (url, callback, error = null) => {
    const request = new XMLHttpRequest();
    request.open('GET', url.toString(), true);
    request.onreadystatechange = () => {
        if (request.readyState === 4) {
            if (request.status === 200) {
                callback(request);
            } else {
                // eslint-disable-next-line no-console
                console.log(`${request.status}: Error calling ${url.toString()}`);
                if (error)
                    error(request);
            }
        }
    };
    request.send();
};
