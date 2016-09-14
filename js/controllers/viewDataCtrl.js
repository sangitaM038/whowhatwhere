WWWApp.controller("viewDataCtrl", function ($scope, $http, $routeParams, $window) {
    var markers = [];
    var itemName = $routeParams.menuName;
    $scope.fetchData = [];
    var location;
    angular.element('#input1').val('sydney');
    $scope.buttonClick = function (event) {
        var inputText = angular.element('#input1').val();
        if (inputText == '') {
            alert('Please Enter City Name');
        } else {
            location = inputText;
            $http({
                method: 'GET',
                url: '/search?location=' + location + '&term=' + itemName + ''
            }).then(function successCallback(response) {
                var data = response.data;
                $scope.fetchData = data;

                loadGoogleMap();
            }, function errorCallback(response) {
                console.log('search data error', response);
            });
           loadGoogleMap();
        }
        $scope.gotoMarker = function (event) {
            var id = event.currentTarget.id;
            for (var i = 0; i < markers.length; i++) {
                var marker = markers[i];

                if (marker.id === id) {
                    angular.element(marker).click();
                }
            }
        };

        $scope.gotoBusiness = function (url) {
            $window.open(url, '_blank');
        }

        function loadGoogleMap() {
            var locations = $scope.fetchData;
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 10,
                center: new google.maps.LatLng(-33.92, 151.25),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });
            var infowindow = new google.maps.InfoWindow();
            var bounds = new google.maps.LatLngBounds();

            var marker, i;

            for (i = 0; i < locations.length; i++) {
                var coords = locations[i].cords;

                marker = new google.maps.Marker({
                    id: locations[i].id,
                    position: new google.maps.LatLng(coords.lat, coords.lon),
                    map: map
                });

                markers.push(marker);
                bounds.extend(marker.position);

                google.maps.event.addListener(marker, 'mouseover', (function (marker, i) {
                    return function () {
                        infowindow.setContent('<div><strong><span>' + (i + 1) + '</span>.' +
                            '<a href="' + locations[i].url + '"> ' + locations[i].name + '</a>' +
                            '</strong>' + '<br>' + locations[i].phone
                            + '<br>' + locations[i].address + '<br>' + locations[i].name + '</div>');

                        infowindow.open(map, marker);
                        angular.element('#' + marker.id).css('background-color', "#000");
                    }
                })(marker, i));
            }
            map.fitBounds(bounds);
        }
    }
});
