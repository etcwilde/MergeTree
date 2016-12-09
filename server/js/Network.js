/**
 * Extra Networking utilities
 */


/**
 * request
 *
 * Works the same as the function for AP.require in bitbucket
 *
 * req objects:
 *
 * success(resp): function that is called  with the response from the server
 * error(resp): function that is called when an error occurs in the request
 * url: The url to get the data from
 * mime: the mimetype for making the request
 */
var request = function(req) {
    if (req === undefined || req.url === undefined) return; // Nothing to get
    if (req.success === undefined && req.error === undefined) return; // Nothing to do
    var oReq = new XMLHttpRequest();
    oReq.open("GET", req.url, true);
    oReq.onload = function(e) {
        if (oReq.readyState === 4) {
            if (oReq.status === 200) req.success(JSON.parse(oReq.responseText));
            else req.error(oReq.status);
        }
    }

    oReq.onerror = function(e) {
        req.error(e);
    }
    oReq.send(null);
}
