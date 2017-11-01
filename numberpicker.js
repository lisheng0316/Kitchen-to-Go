var demo = angular.module('demo', [window.ngNumberPicker]);

demo.controller('DemoController', ['$scope', function($scope) {

    $scope.input = {
        num: 3
    };

    $scope.getNumber = function() {
        alert('The number is: [' + $scope.input.num + ']');
    };

    $scope.onChanged = function(){
        console.log('The number is Changed ', $scope.input.num);
    };

}]);