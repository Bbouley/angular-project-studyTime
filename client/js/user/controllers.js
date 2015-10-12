var converter = new showdown.Converter();

app.controller('UserController', function($scope, $sce, UserFactory){

  $scope.userid = getUserId();

  $scope.note = {};

  $scope.getUserData = function(){
    var url = '/users/' + $scope.userid;
    UserFactory.get(url)
    .then(function(response){
      $scope.user = response.data;
      var url2 = '/users/' + $scope.userid + '/all';
      UserFactory.get(url2)
      .then(function(response){
        $scope.userNotes = response.data.notes;
        $scope.userTutorials = response.data.tutorials;
      });
    });
  };


  $scope.getUserData();

  $scope.submitTutorial = function(){
    parsedRating = parseInt($scope.tutorial.rating);
    var payload = {
      link : $scope.tutorial.link,
      tags : [$scope.tutorial.tags],
      rating : parsedRating,
      review : $scope.tutorial.review,
    };
    var url = '/users/' + $scope.userid + '/tutorials';
    UserFactory.post(url, payload)
    .then(function(response){
      $scope.tutorial = {};
      UserFactory.get(url)
      .then(function(response){
        $scope.userTutorials = response.data;
      });
    });
  };

  $scope.submitNote = function(){
    var payload = {
      title : $scope.note.title,
      date : Date.now(),
      tags : [$scope.note.tags],
      content: $scope.noteTextInput,
    };
    console.log('submit payload', payload);
    var url = '/users/' + $scope.userid + '/notes';
    UserFactory.post(url, payload)
    .then(function(response){
      $scope.note = {};
      $scope.noteTextInput = '';
      UserFactory.get(url)
      .then(function(response){
        $scope.userNotes = response.data;
      });
    });
  };

  $scope.showEditUserTutorial = function(id){
    UserFactory.get('/usertutorials/tutorial/' + id)
    .then(function(response){
      $scope.tutorial = response.data;
    });
  };

  $scope.submitEditedTutorial = function(id){
    var url = '/userTutorials/tutorial/' + id;
    var payload = $scope.tutorial;
    UserFactory.put(url, payload)
    .then(function(response){
      $scope.tutorial = {};
      UserFactory.get('/users/' + $scope.userid + '/tutorials')
      .then(function(response){
        $scope.userTutorials = response.data;
      });
    });
  };

  $scope.showEditUserNote = function(id){
    UserFactory.get('/usernotes/note/' + id)
    .then(function(response){
      $scope.note = response.data;
    });
  };

  $scope.submitEditedNote = function(id){
    var url = '/usernotes/note/' + id;
    var payload = $scope.note;
    UserFactory.put(url, payload)
    .then(function(response){
      $scope.note = {};
      UserFactory.get('/users/' + $scope.userid + '/notes')
      .then(function(response){
        $scope.userNotes = response.data;
      });
    });
  };

  $scope.deleteTutorial = function(id){
    UserFactory.delete('/usertutorials/tutorial/' + id)
    .then(function(response){
      UserFactory.get('/users/' + $scope.userid + '/tutorials')
      .then(function(response){
        $scope.userTutorials = response.data;
      });
    });
  };

  $scope.deleteNote = function(id){
    UserFactory.delete('/usernotes/note/' + id)
    .then(function(response){
      UserFactory.get('/users/' + $scope.userid + '/notes')
      .then(function(response){
        $scope.userNotes = response.data;
      });
    });
  };


  $scope.$watch('noteTextInput', function(newVal, oldVal, scope){
      html = converter.makeHtml(newVal);
      $scope.textOutput = html;
      $scope.trustOutput = function(){
        return $sce.trustAsHtml($scope.textOutput);
      };
  });

  $scope.showNote = function(content){
    console.log(content);
    html = converter.makeHtml(content);
    $scope.clickedNote = html;
      $scope.trustOutput2 = function(){
        return $sce.trustAsHtml($scope.clickedNote);
      };
  };

});


function getUserId(){
  var url = window.location.href;
  var id = url.substr(url.lastIndexOf('/') + 1);
  return(id);
}
