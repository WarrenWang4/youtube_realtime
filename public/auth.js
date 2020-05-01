// Initialize Firebase Authenticator
var provider = new firebase.auth.GoogleAuthProvider();

//firebase authentication function: signIn()
//Parameters: none
//Description: Has the user sign in with a google account
//Returns information into the firestore database about the user
//if promise catches, then sends a console log error.
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
