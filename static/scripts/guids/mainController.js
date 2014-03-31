var guidPattern = new RegExp("^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$", 'i');

function Guids($scope, $http) {
    $scope.error = "";
    $scope.validationError = "";
    $scope.message = "";
    $scope.count = guidCount || 0;
    $scope.guidToDonate = "";
    $scope.borrowedGuid = "";

    $scope.donate = function() {
        if ($scope.guidToDonate.match(guidPattern)) {
            $scope.validationError = "";
            $scope.loading = true;

            $http.post('/donate', {guid: $scope.guidToDonate}).success(
                function (data, status, headers, config) {
                    if (!data.error) {
                        $scope.message = data.message;
                        $scope.validationError = "";
                        $scope.error = "";
                        $scope.count = data.count;
                        $scope.guidToDonate = "";
                        $scope.borrowedGuid = "";
                    } else {
                        $scope.validationError = data.error;
                        $scope.message = "";
                    }
                    $scope.loading = false;
                }
            );
        } else {
            $scope.validationError = "Please enter a valid Guid.";
        }
    };

    $scope.borrow = function () {
        if (confirm("Are you sure that you want to take a Guid from the already dwindling reserve?")) {
            $scope.loading = true;

            $http.post('/borrow', null).success(
                function (data, status, headers, config) {
                    if (!data.error) {
                        $scope.error = "";
                        $scope.message = data.message;
                        $scope.borrowedGuid = data.guid;
                        $scope.count = data.count;
                    } else {
                        $scope.error = data.error || "Whoops, there was a problem.";
                        $scope.message = "";
                    }
                    $scope.loading = false;
                }
            );
        }
    };
}