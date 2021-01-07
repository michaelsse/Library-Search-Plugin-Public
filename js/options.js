/*Google Analytics - not obligatory, you can delete this if you do not use it.

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-******-*']);
_gaq.push(['_trackPageview']);
(function () {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();

*/
/* Google Analytics 4 Tag */
  var gtag = document.createElement('script');
  gtag.type = 'text/javascript';
  gtag.async = 'true';
  gtag.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'www.googletagmanager.com/gtag/js?id=G-61RHNW4G0Y';
  document.getElementsByTagName('head')[0].appendChild(gtag);

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-61RHNW4G0Y');

//SEARCHBOX STUFF
$(document).ready(function () {
    //select library catalogue as default
    $("#library").prop("checked", true);
    //when clicking search, adapt the URL depending on selection made
    $('#btnOpenNewTab').click(function () {
        //Get the search term, and save it as a var
        var searchstring = $('input#searchInput').val();
        //Library Catalogue
        if (
            $('#library').is(":checked")) {
            //change this url to match your library's! Here is Leiden's URL as an example for ExLibris Primo users - Old UI! But the same logic applies for Primo NEW UI
            var newLibraryURL = 'https://col-westernsem.primo.exlibrisgroup.com/discovery/search?tab=Everything&search_scope=MyInst_and_CI&vid=01COL_WTS:WTS&lang=en&offset=0&query=any,contains,' + searchstring + '&source=LibrarySearchPluginPublic'; //you can modify &source to anything you like. This is useful to see how many users are coming to your catalogue via the plugin, in Google Analytics.
            // Create the new tab
            chrome.tabs.create({
                url: newLibraryURL
            });
        }
        //Worldcat
        if (
            $('#worldcat').is(":checked")) {
            //alert("WorldCat checked");
            var newWorldcatURL = 'https://westerntheolseminary.on.worldcat.org/search?&databaseList=143,233,2013,638,283&scope=0&clusterResults=false&se=nodgr&sd=desc&qt=sort_nodgr_desc&queryString=kw:' + searchstring;
            // Create the new tab
            chrome.tabs.create({
                url: newWorldcatURL
            });
        }
        //Google Scholar
        if (
            $('#scholar').is(":checked")) {
            //alert("Google Scholar checked");
            var newScholarURL = 'https://scholar.google.com/scholar?q=' + searchstring;
            // Create the new tab
            chrome.tabs.create({
                url: newScholarURL
            });
        }
    });
    $('#searchInput').keypress(function (e) {
        if (e.which == 13) { //Enter key pressed
            $('#btnOpenNewTab').click(); //Trigger search button click event
        }
    });
});
//CONTEXT STUFF
//Search definitions. %s is the variable that gets replaced by the search term.
var searches = [
    {
        title: "Search in the Library Catalogue", // Same as above: edit to match your library's url. Modify &soruce as well at the end. Remeber to keep '%s'
        url: "https://col-westernsem.primo.exlibrisgroup.com/discovery/search?tab=Everything&search_scope=MyInst_and_CI&vid=01COL_WTS:WTS&lang=en&offset=0&query=any,contains,%s&source=LibrarySearchPluginPublic"
  },
    {
        title: "Search in WorldCat",
        url: "https://westerntheolseminary.on.worldcat.org/search?&databaseList=143,233,2013,638,283&scope=0&clusterResults=false&se=nodgr&sd=desc&qt=sort_nodgr_desc&queryString=kw:%s"
  },
    {
        title: "Search in Google Scholar",
        url: "https://scholar.google.com/scholar?q=%s"
  }
];
// Create a parent item and two children.
var parent = chrome.contextMenus.create({
    "title": "Search with Library Search Plugin Public", // Change the name here too!
    "id": "0",
    "contexts": ["selection"]
});
searches.forEach(function (obj) {
    console.log("creating context menu item: " + JSON.stringify(obj));
    var contextMenuId = chrome.contextMenus.create({
        "title": obj.title,
        "parentId": parent,
        "contexts": ["selection"],
        "id": (searches.indexOf(obj) + 1).toString()
    });
});
// replace %s with highlighted text
chrome.contextMenus.onClicked.addListener(function (info, tab) {
    console.log(info.menuItemId);
    var searchObj = searches[info.menuItemId - 1];
    if (typeof searchObj === "undefined")
        return;
    chrome.tabs.create({
        "url": searchObj.url.replace("%s", encodeURIComponent(info.selectionText))
    });
});
