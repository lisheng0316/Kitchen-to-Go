/**
 * Created by Sheng on 10/12/17.
 */
/*global google*/
var map, infoWindow;

    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: -34.397, lng: 150.644},
            zoom: 6
        });
        infoWindow = new google.maps.InfoWindow;

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                infoWindow.setPosition(pos);
                infoWindow.setContent('Location found.');
                infoWindow.open(map);
                map.setCenter(pos);
            }, function () {
                handleLocationError(true, infoWindow, map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }
    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
    }


$.getJSON('/simplepie/round/alltables.json', function (data) {
    var o = null;
    var myArray = new Array();
    document.open();
    for( var i = 0; i < data.length; i++ )
    {
        o = data[i];
        myArray.push('<li>' + o.title + '</li>');
        //document.write(o.source + " <br>" + o.description + "<br>") ;
        myArray.push(o.source);
        makeUL(o.source);
    }

//document.close();
// document.write('Latitude: ' + data.id + '\nLongitude: ' + data.title + '\nCountry: ' + data.description);

    function makeUL(array) {
        var list = document.createElement('ul');
        for(var i = 0; i < array.length; i++) {
            var item = document.createElement('li');
            item.appendChild(document.createTextNode(array[i]));
            list.appendChild(item);
        }


        return list;
    }

});
