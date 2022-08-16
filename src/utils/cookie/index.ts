export function writeCookie({ name, value, days = 730 /** 2 years */, domain, path = '/' }: IWriteCookieOptions) {
    let date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    let expires = `; expires=${date.toUTCString()}`;
    let cookieValue = `${name}=${value}${expires}; path=${path}`;
    if (domain) {
        cookieValue += `; domain=${domain}`;
    }

    if (typeof document !== 'undefined') {
        document.cookie = cookieValue;
    }
}

export function readCookie(name: string) {
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
}

export function removeCookie(name: string) {
    if (readCookie(name)) {
        writeCookie({ name, value: '', days: -1 });
    }
}

interface IWriteCookieOptions {
    name: string;
    value: string;
    days?: number;
    domain?: string;
    path?: string;
}
