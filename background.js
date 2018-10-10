var defaultRgx =  ["http://*/*", "https://*/*"].join('\n')
var regexpesarray = [];
function updateRegexpes(save)
{
   browser.storage.local.get("regstr", function(res) {
      var  regstr = (res.regstr || defaultRgx);

    regexpesarray = [];
    var regexpesarray = regstr.split("\n")
    console.log(regexpesarray)

    browser.webRequest.onHeadersReceived.removeListener(setHeader)
    browser.webRequest.onHeadersReceived.addListener(setHeader,
      {urls : regexpesarray},
      ["blocking", "responseHeaders"]
      );
  });
}
function setHeader(e) {
  for (var header of e.responseHeaders) {
    if (header.name.toLowerCase() === "set-cookie") {
      header.value = header.value.replace(/;[\t ]*(secure|httponly)/gi,"");
    }
  }
  return {responseHeaders: e.responseHeaders};
}
// Listen for onHeaderReceived for the target page.
// Set "blocking" and "responseHeaders".
updateRegexpes();
console.log("Loaded Set Cookie: No secure - No HttpOnly")
var portFromCS;
function connected(p) {
  portFromCS = p;
  //portFromCS.postMessage({greeting: "hi there content script!"});
  portFromCS.onMessage.addListener(function(m) {
    if(m.updateRegexpes)
    {

      browser.storage.local.set({"regstr":m.updateRegexpes}, function(res) {
        updateRegexpes();
      });


  }
});
}
browser.runtime.onConnect.addListener(connected);
