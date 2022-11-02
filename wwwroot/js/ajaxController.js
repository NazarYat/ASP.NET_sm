function SendPOSTRequest(mess, succesfulCallBack, failCallBack, uri = window.location.href, headerKeys = [], headerValues = []) {
    var httpRequest = false;

    if (window.XMLHttpRequest) {
        httpRequest = new XMLHttpRequest();
        if (httpRequest.overrideMimeType) {
            httpRequest.overrideMimeType('text/xml');
        }
    } else if (window.ActiveXObject) {
        try {
            httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {}
        }
    }

    if (!httpRequest) {
        return false;
    }
    httpRequest.onreadystatechange = function() { alertContents( httpRequest, succesfulCallBack, failCallBack ); };
    httpRequest.open('POST', uri, true);
    try {
        for (let i = 0;i < headerKeys.length;i++) {
            httpRequest.setRequestHeader(headerKeys[i], headerValues[i]);
        }
    }
    catch {}
    httpRequest.send(mess);
}

function alertContents( httpRequest, succesfulCallBack, failCallBack ) {

    if (httpRequest.readyState == 4) {
        if ( ( httpRequest.status / 200) >= 1 && (httpRequest.status / 200) < 1.5 ) {
            succesfulCallBack( httpRequest.responseText, httpRequest.status );
        } else {
            failCallBack( httpRequest.responseText, httpRequest.status );
        }
    }

}