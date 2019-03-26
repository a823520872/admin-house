export function downloadFile(filename, content) {
    return new Promise((resolve, reject) => {
        if (has('ie') === 10 || isIE11() || isEdge()) {
            let blob = new Blob([content], { type: 'image/jpeg' });
            navigator.msSaveBlob(blob, filename);
            resolve();
        } else {
            let blob = base64ToBlob(content);
            let aLink = document.createElement('a');
            aLink.download = filename;
            aLink.href = blob;

            aLink.addEventListener('click', resolve);
            document.body.appendChild(aLink);
            aLink.click();
            document.body.removeChild(aLink);
        }
    });
}

export function base64ToBlob(code) {
    if (window.Blob && window.URL && window.URL.createObjectURL) {
        const URL = window.URL || window.webkitURL || window.mozURL;

        let parts = code.split(';base64,');
        let contentType = parts[0].split(':')[1];
        let raw = window.atob(parts[1]);
        let rawLength = raw.length;

        let uInt8Array = new Uint8Array(rawLength);

        for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }

        let data = new Blob([uInt8Array], { type: contentType });
        return URL.createObjectURL(data);
    } else {
        return code;
    }
}

function has(browser) {
    const ua = navigator.userAgent;
    if (browser === 'ie') {
        const isIE = ua.indexOf('compatible') > -1 && ua.indexOf('MSIE') > -1;
        if (isIE) {
            const reIE = new RegExp('MSIE (\\d+\\.\\d+);');
            reIE.test(ua);
            return parseFloat(RegExp['$1']);
        } else {
            return false;
        }
    } else {
        return ua.indexOf(browser) > -1;
    }
}

function isIE11() {
    let iev = 0;
    const ieold = /MSIE (\d+\.\d+);/.test(navigator.userAgent);
    const trident = !!navigator.userAgent.match(/Trident\/7.0/);
    const rv = navigator.userAgent.indexOf('rv:11.0');

    if (ieold) {
        iev = Number(RegExp.$1);
    }
    if (navigator.appVersion.indexOf('MSIE 10') !== -1) {
        iev = 10;
    }
    if (trident && rv !== -1) {
        iev = 11;
    }

    return iev === 11;
}

function isEdge() {
    return /Edge/.test(navigator.userAgent);
}
