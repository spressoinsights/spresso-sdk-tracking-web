export const writeCookie = function ({ name, value, days = 730 /** 2 years */, domain, path = '/' }) {
    let date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    let expires = `; expires=${date.toUTCString()}`;
    // let expires = '; expires=' + date.toUTCString();
    let cookieValue = `${name}=${value}${expires}; path=${path}`;
    // let cookieValue = name + '=' + value + expires + '; path=' + path;
    if (domain) {
        cookieValue += `; domain=${domain}`;
        // cookieValue += '; domain=' + domain;
    }

    if (typeof document !== 'undefined') {
        document.cookie = cookieValue;
    }
};

export const readCookie = function (name) {
    const allCookie = `${typeof document !== 'undefined' ? document.cookie : ''}`;
    const index = allCookie.indexOf(name);

    if (!name || name === '' || index === -1) {
        return null;
    }

    let ind1 = allCookie.indexOf(';', index);

    if (ind1 === -1) {
        // if there's only a single cookie
        ind1 = allCookie.length;
    }

    return allCookie.substring(index + name.length + 1, ind1);
};

export const removeCookie = function (name) {
    if (readCookie(name)) {
        writeCookie({ name, value: '', days: -1 });
    }
};
