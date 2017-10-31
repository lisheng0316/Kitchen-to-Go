
$(document).ready(function() {
    'use strict';

    /**
     * Hero unit animation
     */
    $('.hero').addClass('hero-animate');

    /**
     * Cover carousel
     */
    $('.hero-carousel').owlCarousel({
        autoplay: true,
        items: 1,
        nav: true,
        navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>']
    });

    /**
     * Customizer
     */
    $('.customizer-title').on('click', function() {
        $('.customizer').toggleClass('open');
    });

    $('.customizer a').on('click', function(e) {
        e.preventDefault();

        var cssFile = $(this).attr('href');
        $('#css-primary').attr('href', cssFile);
    });

    /**
     * Image gallery
     */
    $('.gallery').owlCarousel({
        items: 1,
        nav: true,
        navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>']
    });


    if ($('#listing-position').length) {
        var map = L.map('listing-position', {
            zoom: 12,
            maxZoom: 20,
            center: [40.761077, -73.88]
        });

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            scrollWheelZoom: false,
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    }

    /**
     * Map Leaflet
     */
    if ($('#map-leaflet').length) {
        var map = L.map('map-leaflet', {
            zoom: 12,
            maxZoom: 20,
            center: [40.761077, -73.88]
        });

        var marker_cluster = L.markerClusterGroup();

        map.scrollWheelZoom.disable();

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            scrollWheelZoom: false,
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        $.ajax('assets/data/markers.json', {
            success: function(markers) {
                $.each(markers, function(index, value) {
                    var icon = L.divIcon({
                        html: value.icon,
                        iconSize:     [36, 36],
                        iconAnchor:   [36, 36],
                        popupAnchor:  [-20, -42]
                    });

                    var marker = L.marker(value.center, {
                        icon: icon
                    }).addTo(map);

                    marker.bindPopup(
                        '<div class="listing-window-image-wrapper">' +
                        '<a href="listing-detail.html">' +
                        '<div class="listing-window-image" style="background-image: url(' + value.image + ');"></div>' +
                        '<div class="listing-window-content">' +
                        '<div class="info">' +
                        '<h2>' + value.title + '</h2>' +
                        '<h3>' + value.price + '</h3>' +
                        '</div>' +
                        '</div>' +
                        '</a>' +
                        '</div>'
                    );

                    marker_cluster.addLayer(marker);
                });

                map.addLayer(marker_cluster);
            }
        });
    }


    // Checkbox
    $('input[type=checkbox]').wrap('<div class="checkbox-wrapper"></div>');
    $('input[type=checkbox]').each(function() {
        if (this.checked) {
            $(this).closest('.checkbox-wrapper').addClass('checked');
        }
    });

    $('input[type=checkbox]').change(function() {
        if (this.checked) {
            $(this).closest('.checkbox-wrapper').addClass('checked');
        } else {
            $(this).closest('.checkbox-wrapper').removeClass('checked');
        }
    });

    // Radio
    $('input[type=radio]').wrap('<div class="radio-wrapper"></div>');
    $('input[type=radio]').each(function() {
        if ($(this).is(':checked')) {
            $(this).closest('.radio-wrapper').addClass('checked');
        }
    });

    $('input[type=radio]').change(function() {
        $('input[type=radio]').each(function() {
            if ($(this).is(':checked')) {
                $(this).closest('.radio-wrapper').addClass('checked');
            } else {
                console.log('b');
                $(this).closest('.radio-wrapper').removeClass('checked');
            }
        });
    });
});