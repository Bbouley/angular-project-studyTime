app.controller('ResourcesController', function($scope, ResourceFactory){

  $scope.getTutorials = function(){
    ResourceFactory.get('/usertutorials/tutorials')
    .then(function(response){
      $scope.userTutorials = response.data;
    });
  };

  $scope.getTutorials();

});
