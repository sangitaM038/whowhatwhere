var WWWApp = angular.module("m3wApp", ['ngRoute']);
WWWApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html'
        }).when('/:menuName', {
        templateUrl: 'views/view-data.html',
        controller: 'viewDataCtrl'
    })
        .otherwise({redirectTo: '/'});
}]);
WWWApp.controller("w3MainCtrl", function ($scope, $location) {
    $scope.menuNames = [{name: "Fun"}, {name: "Food"}, {name: "Coffee"}, {name: "Shopping"}];

    $scope.data = {
        model: null,
        availableOptions: [
            {id: '0', name: 'Search item'},
            {id: '1', name: 'Fun'},
            {id: '2', name: 'Food'},
            {id: '3', name: 'Coffee'},
            {id: '4', name: 'Shopping'}
        ]
    };

    $scope.selectItems = function () {
        if ($scope.data.model != "Search item") {
            $location.path('/' + $scope.data.model);
        }
    }
});
