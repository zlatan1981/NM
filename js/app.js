var map;

// variable to hold img options for map marker
var markerimg = {
    url: 'img/marker.png'
};

// variable to hold shape options for map marker 
var markershape = {
    coords: [1, 1, 1, 20, 18, 20, 18, 1],
    type: 'poly'
};


// the view model 
var mapVM = {
    searchin: ko.observable(' ')

    // add search filtering to the scroll bar


};

/*
mapVM.spots = ko.computed(function() {
    var self = this;
    var keyword = self.searchin().toLowerCase();
    return ko.utils.arrayFilter(spots, function(spot) {
        if (spot.name.toLowerCase().indexOf(keyword) >= 0) {
            spot.showmarker = true;
            return spot.visible(true);
        } else {
            spot.showmarker = false;
            resetmarkers();
            return spot.visible(false);
        }
    });




}, this);
*/




ko.applyBindings(mapVM);

function initMap() {
    // Create a map object and specify the DOM element for display.
    map = new google.maps.Map(document.getElementById('mainmap'), {
        // map options
        center: { lat: 32.8811507, lng: -117.2396384 },
        scrollwheel: false,
        zoom: 12,
        // disableDefaultUI: true
    });

    setmarkers(spots);
    setsearchlistener();
    addflickrlistener();
}


function setmarkers(locations) {

    for (var i = 0; i < locations.length; i++) {
        locations[i].marker = createmarker(locations[i]);
        createinfowindow(locations[i]);
    }
}

// function to create marker for each interest spot



function createmarker(location) {

    var marker = new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: map,
        title: location.name,
        animation: google.maps.Animation.DROP,
        icon: markerimg,
        shape: markershape
    });

    marker.setMap(map);
    return marker;

}

// create windowinfo and click listenrer for each marker
function createinfowindow(location) {
    location.contentString = '<img src=' + location.imgsrc +
        ' alt="Street View Image of ' + location.name + '"><br>' + '<em>' +
        location.name + '</em><br><p>' +
        location.add + '<br>' +
        '<br></p><a class="sitelink" href= "http://' + location.url +
        '" target="_blank">' + location.url + '</a>';

    var infowindow = new google.maps.InfoWindow({
        content: location.contentString
    });

    // add event listener to the marker and the search bar item
    location.marker.addListener('click', (function(marker) {
        return function() {
            //  console.log("marker clicked");
            infowindow.setContent(location.contentString);
            infowindow.open(map, marker);
            map.setZoom(15);
            map.setCenter(marker.getPosition());
            flickrhelper(location.name);
        }

    })(location.marker));

    document.getElementById(location.id).addEventListener("click", (function(marker) {

        return function() {
            console.log("clicked");
            infowindow.setContent(location.contentString);
            infowindow.open(map, marker);
            map.setZoom(15);
            map.setCenter(marker.getPosition());
            flickrhelper(location.name);
        }

    })(location.marker));





}


function setsearchlistener() {

    document.getElementById('search-input').addEventListener("input", (function() {

        return function() {
            var keyword = mapVM.searchin().toLowerCase();
            console.log(keyword);

            for (var k = 0; k < spots.length; ++k) {
                if (spots[k].name.toLowerCase().indexOf(keyword) >= 0) {
                    spots[k].showmarker = true;
                    spots[k].visible(true);
                } else {
                    spots[k].showmarker = false;
                    spots[k].visible(false);
                }
            }

            resetmarkers();
        };

    })());
}

/* reset makers of the map */

function resetmarkers() {
    for (var j = 0; j < spots.length; j++) {
        if (spots[j].showmarker === true) {
            spots[j].marker.setMap(map);
        } else {
            spots[j].marker.setMap(null);
        }
    }
}




/* functions related to flickr ajax handling*/

function addflickrlistener() {

    document.getElementById('flickrimg').addEventListener("click", function() {


        var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
        //  var flickerAPI = "https://api.flickr.com/services/rest/?method=flickr.photos.search";
        $.getJSON(flickerAPI, {
                tags: "San Diego california",
                tagmode: "all",
                format: "json",
                accuracy: 13
            })
            .done(function(data) {
                $.each(data.items, function(i, item) {
                    $("<img>").attr("src", item.media.m).appendTo("#images");
                    if (i === 20) {
                        return false;
                    }
                });
            });

    });
}

function flickrhelper(locationname) {

    var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";

    var node = document.getElementById("image-container")
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
    $("#image-container").append('<div id = "images"></div>');


    //  var flickerAPI = "https://api.flickr.com/services/rest/?method=flickr.photos.search";
    $.getJSON(flickerAPI, {
            tags: locationname,
            tagmode: "all",
            format: "json",
            accuracy: 13
        })
        .done(function(data) {

            $.each(data.items, function(i, item) {
                $("<img>").attr("src", item.media.m).appendTo("#images");
                if (i === 20) {
                    return false;
                }
            });
        });

}
