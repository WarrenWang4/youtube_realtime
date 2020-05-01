// Initialize Firebase Authenticator
var provider = new firebase.auth.GoogleAuthProvider();

function signIn() {
   firebase.auth()
   
   .signInWithPopup(provider).then(function(result) {
      var token = result.credential.accessToken;
      var user = result.user;
      
      window.location = 'home.html'

   }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      
      console.log(error.code)
      console.log(error.message)
   });
}
