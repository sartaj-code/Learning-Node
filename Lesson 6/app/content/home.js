$(function(){

    let tmpl,   // Main template HTML
        tdata = {};  // JSON data object that feeds the template

    // Initialise page
    const initPage = function() {

        // Load the HTML template
        $.get("/templates/home.html", function(d){
            tmpl = d;
        });

        // Retrieve the server data and then initialise the page
        $.getJSON("/albums.json", function (d) {
            $.extend(tdata, d.data);
        });

        // When AJAX calls are complete parse the template
        // replacing mustache tags with vars
        $(document).ajaxStop(function () {
            const final_data = massage_album_list(tdata);
            const renderedPage = Mustache.to_html( tmpl, final_data );
            $("body").html( renderedPage );
        })
    }();
});

function massage_album_list(data) {
    if (data.albums && data.albums.length > 0) {
        data.have_albums = true;
    } else {
        data.have_albums = false;
    }

    return data;  // note: look what happens if we forgot this!!!
}