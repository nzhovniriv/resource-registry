/**
 * Created by LenovoGRB on 22.10.2015.
 */
(function() {
    'use strict';
    angular.module('restApp')
            .filter('newLine', function() {
                return function (input) {
                    input = input || '';
                    var out=' ';
                    input.split('|')
                        .forEach(function(ch) {
                            out+= ch+'\n';
                        });
                    return out;
                };
            });
     angular.module('restApp')
            .filter('hectare', function ($filter) {
                 return function (input) {
                     return (input / 10000).toFixed(5);
                 };

            });
})();