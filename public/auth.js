var provider = new firebase.auth.GoogleAuthProvider();

function signIn() {
   firebase.auth()
   
   .signInWithPopup(provider).then(function(result) {
      var token = result.credential.accessToken;
      var user = result.user;
      
      // Testing different outputs to see what to use in database
      console.log(token);
      console.log(user);

      console.log(user.displayName);
      console.log(user.uid);
      // end test

      window.location = 'home.html'

   }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      
      console.log(error.code)
      console.log(error.message)
   });
}