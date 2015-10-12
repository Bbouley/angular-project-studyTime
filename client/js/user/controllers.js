var converter = new showdown.Converter();

app.controller('UserController', function($scope, $sce, UserFactory, $timeout){

  $scope.userid = getUserId();

  $scope.note = {};

  $scope.message = '';
  $scope.success = false;

  function successMessage(){
    $scope.success = false;
  }

  $scope.showTutorialForm = false;
  $scope.tutorialSubmit = true;
  $scope.tutorialEdit = false;

  $scope.showTutorials = false;

  $scope.showTutorialsFunction = function(){
    if($scope.showTutorials === false){
      $scope.showTutorials = true;
    } else {
      $scope.showTutorials = false;
    }
  };

  $scope.showTutorialFormFunction = function(){
    if($scope.showTutorialForm === false){
      $scope.showTutorialForm = true;
    } else {
      $scope.showTutorialForm = false;
    }
  };

  $scope.showNoteForm = false;
  $scope.noteSubmit = true;
  $scope.noteEdit = false;

  $scope.showNotes = false;

  $scope.showNotesFunction = function(){
    if($scope.showNotes === false){
      $scope.showNotes = true;
    } else {
      $scope.showNotes = false;
    }
  };

  $scope.showNoteFormFunction = function(){
    if($scope.showNoteForm === false){
      $scope.showNoteForm = true;
    } else {
      $scope.showNoteForm = false;
    }
  };

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
        $scope.showTutorialForm = false;
        $scope.success = true;
        $scope.message = 'Tutorial Saved';
        $timeout(successMessage, 6000);
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
        $scope.showNoteForm = false;
        $scope.success = true;
        $scope.message = 'Note Saved';
        $timeout(successMessage, 6000);
      });
    });
  };

  $scope.showEditUserTutorial = function(id){
    $scope.tutorialEdit = true;
    $scope.tutorialSubmit = false;
    $scope.showTutorialForm = true;
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
        $scope.tutorialEdit = false;
        $scope.showTutorialForm = false;
        $scope.tutorialSubmit = true;
        $scope.success = true;
        $scope.message = 'Tutorial Edited';
        $timeout(successMessage, 6000);
      });
    });
  };

  $scope.showEditUserNote = function(id){
    $scope.noteEdit = true;
    $scope.noteSubmit = false;
    $scope.showNoteForm = true;
    UserFactory.get('/usernotes/note/' + id)
    .then(function(response){
      $scope.note = response.data;
      $scope.noteTextInput = response.data.content;
    });
  };

  $scope.submitEditedNote = function(id){
    var url = '/usernotes/note/' + id;
    var payload = {
      title : $scope.note.title,
      tags : $scope.note.tags,
      content : $scope.noteTextInput,
    };
    UserFactory.put(url, payload)
    .then(function(response){
      $scope.note = {};
      $scope.noteTextInput = '';
      UserFactory.get('/users/' + $scope.userid + '/notes')
      .then(function(response){
        $scope.userNotes = response.data;
        $scope.noteEdit = false;
        $scope.noteSubmit = true;
        $scope.showNoteForm = false;
        $scope.success = true;
        $scope.message = 'Note Edited';
        $timeout(successMessage, 6000);
      });
    });
  };

  $scope.deleteTutorial = function(id){
    UserFactory.delete('/usertutorials/tutorial/' + id)
    .then(function(response){
      UserFactory.get('/users/' + $scope.userid + '/tutorials')
      .then(function(response){
        $scope.userTutorials = response.data;
        $scope.success = true;
        $scope.message = 'Tutorial Deleted';
        $timeout(successMessage, 6000);
      });
    });
  };

  $scope.deleteNote = function(id){
    UserFactory.delete('/usernotes/note/' + id)
    .then(function(response){
      UserFactory.get('/users/' + $scope.userid + '/notes')
      .then(function(response){
        $scope.userNotes = response.data;
        $scope.success = true;
        $scope.message = 'Note Deleted';
        $timeout(successMessage, 6000);
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
