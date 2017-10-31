/**
 * Created by Sheng on 10/30/17.
 */
angular.module('starter', ['ionic', 'ionicNumberPicker'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })

    .controller('controller', function ($scope) {
        $scope.test = {};
        $scope.test.count = 1;
        $scope.onNumberChanged = function(){
            console.log($scope.test.count);
        }

    });
