var converter = new showdown.Converter();

app.controller('UserController', function($scope, $sce, UserFactory, $timeout, $filter){

  $scope.userid = getUserId();

  $scope.note = {};

  $scope.message = '';
  $scope.success = false;

  $scope.showTutorialsButton = true;
  $scope.showAddTutorialButton = true;
  $scope.showNotesButton = true;
  $scope.showAddNoteButton = true;

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
      $scope.showAddTutorialButton = false;
      $scope.showNotesButton = false;
      $scope.showAddNoteButton = false;
    } else {
      $scope.showTutorials = false;
      $scope.showAddTutorialButton = true;
      $scope.showNotesButton = true;
      $scope.showAddNoteButton = true;
    }
  };

  $scope.showTutorialFormFunction = function(){
    if($scope.showTutorialForm === false){
      $scope.showTutorialForm = true;
      $scope.showTutorialsButton = false;
      $scope.showNotesButton = false;
      $scope.showAddNoteButton = false;
    } else {
      $scope.showTutorialForm = false;
      $scope.showTutorialsButton = true;
      $scope.showNotesButton = true;
      $scope.showAddNoteButton = true;
    }
  };

  $scope.showNoteForm = false;
  $scope.noteSubmit = true;
  $scope.noteEdit = false;

  $scope.showNotes = false;

  $scope.showNotesFunction = function(){
    if($scope.showNotes === false){
      $scope.showNotes = true;
      $scope.showTutorialsButton = false;
      $scope.showAddTutorialButton = false;
      $scope.showAddNoteButton = false;
    } else {
      $scope.showNotes = false;
      $scope.showTutorialsButton = true;
      $scope.showAddTutorialButton = true;
      $scope.showAddNoteButton = true;
    }
  };

  $scope.showNoteFormFunction = function(){
    if($scope.showNoteForm === false){
      $scope.showNoteForm = true;
      $scope.showTutorialsButton = false;
      $scope.showAddTutorialButton = false;
      $scope.showNotesButton = false;
    } else {
      $scope.showNoteForm = false;
      $scope.showTutorialsButton = true;
      $scope.showAddTutorialButton = true;
      $scope.showNotesButton = true;
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
        var url = 'https://api.github.com/user?access_token=' + $scope.user.oauthID;
        UserFactory.get(url)
        .then(function(response){
        $scope.githubInfo = response.data;
    });
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
        $timeout(successMessage, 3000);
        $scope.showTutorialsButton = true;
        $scope.showAddTutorialButton = true;
        $scope.showNotesButton = true;
        $scope.showAddNoteButton = true;
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
        $timeout(successMessage, 3000);
        $scope.showTutorialsButton = true;
        $scope.showAddTutorialButton = true;
        $scope.showNotesButton = true;
        $scope.showAddNoteButton = true;
      });
    });
  };

  $scope.showEditUserTutorial = function(id){
    $scope.tutorialEdit = true;
    $scope.tutorialSubmit = false;
    $scope.showTutorialForm = true;
    $scope.showTutorials = false;
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
        $timeout(successMessage, 3000);
        $scope.showTutorialsButton = true;
        $scope.showAddTutorialButton = true;
        $scope.showNotesButton = true;
        $scope.showAddNoteButton = true;
      });
    });
  };

  $scope.showEditUserNote = function(id){
    $scope.noteEdit = true;
    $scope.noteSubmit = false;
    $scope.showNoteForm = true;
    $scope.showNotes = false;
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
        $timeout(successMessage, 3000);
        $scope.showTutorialsButton = true;
        $scope.showAddTutorialButton = true;
        $scope.showNotesButton = true;
        $scope.showAddNoteButton = true;
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
        $timeout(successMessage, 3000);
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
        $timeout(successMessage, 3000);
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
    html = converter.makeHtml(content);
    if($scope.clickedNote === html){
      $scope.clickedNote = '';
    } else {
      $scope.clickedNote = html;
      $scope.trustOutput2 = function(){
        return $sce.trustAsHtml($scope.clickedNote);
      };
    }
  };

  $scope.predicate = 'rating';
  $scope.reverse = true;
  $scope.orderTutorials = function(predicate){
     $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
      $scope.predicate = predicate;
  };

  $scope.notesPredicate = 'date';
  $scope.orderNotes = function(predicate){
     $scope.reverse = ($scope.notesPredicate === predicate) ? !$scope.reverse : false;
      $scope.notesPredicate = predicate;
  };


});


function getUserId(){
  var url = window.location.href;
  var id = url.substr(url.lastIndexOf('/') + 1);
  return(id);
}
