(function (window, document) {
  'use strict';
  if (!window.indexedDB) {
      window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
  } else {
    if (window.Worker) {
      document.getElementById('app').innerHTML = "<div id='map' class='map-wrapper'></div>";
      
      var map = L.map("map", {
        zoom: 5,
        center: [-2.591888, 118.278808],
        minZoom: 4,
        maxZoom: 18,
        attributionControl: true
      });
      
      new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: 'Map Data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors.'
      }).addTo(map);
      
      /*
       *  API key bisa didapat dengan register (free) ke: https://cloud.maptiler.com/geocoding/
       * */
      var autocomplete = new kt.OsmNamesAutocomplete('search', 'https://geocoder.tilehosting.com/', '__API_KEY__');
      
      autocomplete.registerCallback(function(data) {
        /*
         * Struktur data (GeoJSON response):
         *
         * {
         *   "alternative_names": "__STRING__",
         *   "boundingbox": [
         *       [__NUMERIC__], -- min. Longitude
         *       [__NUMERIC__], -- min. Latitude
         *       [__NUMERIC__], -- max. Longitude
         *       [__NUMERIC__]  -- max. Latitude
         *     ],
         *   "display_name": "__STRING__",
         *   "lon": [__NUMERIC__],
         *   "lat": [__NUMERIC__],
         *   "name": "__STRING__",
         *   "name_suffix": "__STRING__",
         *   "type": "__STRING__"
         * }
         *
         * */

        var southEast = L.latLng(data.boundingbox[1], data.boundingbox[0]), 
          northWest = L.latLng(data.boundingbox[3], data.boundingbox[2]),
          bounds = L.latLngBounds(southEast, northWest), 
          zoomLevel = map.getBoundsZoom(bounds);
        /*
         * Pilih salah satu fungsi:
         * - map centering dengan acuan data.lat/lon, zoom level static:
         *    e.g.: map.setView([data.lat, data.lon], 15);
         * - map fitbounding berbasis data.boundingbox[]:
         *    e.g.: map.fitBounds([[data.boundingbox[1], data.boundingbox[0]],[data.boundingbox[3], data.boundingbox[2]]]);
         * - dynamic centering + fitbounding, dengan menggunakan variable sebagaimana tersebut di atas.
         *    e.g.: map.setView([data.lat, data.lon], zoomLevel);
         * */
        
        // map.setView([data.lat, data.lon], 15);
        map.fitBounds([[data.boundingbox[1], data.boundingbox[0]],[data.boundingbox[3], data.boundingbox[2]]]);
        // map.setView([data.lat, data.lon], zoomLevel);
      });
    } else {
      window.alert("Your browser doesn\'t support web workers.");
    }
  }
}(this, this.document));
