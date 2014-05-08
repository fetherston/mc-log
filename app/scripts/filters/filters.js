'use strict';

/* Filters */

angular.module('myApp.filters', [])
   .filter('interpolate', ['version', function(version) {
      return function(text) {
         return String(text).replace(/\%VERSION\%/mg, version);
      }
   }])

   .filter('sumByKey', function() {
      return function(data, key) {
          if (typeof(data) === 'undefined' || typeof(key) === 'undefined') {
             return 0;
          }

          var sum = 0;
          for (var i = data.length - 1; i >= 0; i--) {
             sum += parseInt(data[i][key]) || 0;
          }
          return sum;
      }

    })

   .filter('reverse', function() {
      function toArray(list) {
         var k, out = [];
         if( list ) {
            if( angular.isArray(list) ) {
               out = list;
            }
            else if( typeof(list) === 'object' ) {
               for (k in list) {
                  if (list.hasOwnProperty(k)) { out.push(list[k]); }
               }
            }
         }
         return out;
      }
      return function(items) {
         return toArray(items).slice().reverse();
      };
   });