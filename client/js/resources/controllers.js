app.controller('ResourcesController', function($scope, ResourceFactory){

  $scope.getTutorials = function(){
    ResourceFactory.get('/usertutorials/tutorials')
    .then(function(response){
      $scope.userTutorials = response.data;
    });
  };

  $scope.getTutorials();
  $scope.predicate = 'rating';
  $scope.reverse = true;
  $scope.orderTutorials = function(predicate){
     $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
      $scope.predicate = predicate;
  };

});
