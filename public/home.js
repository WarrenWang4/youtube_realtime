document.getElementById("error").style.visibility = "hidden";
//The following function determines if the inputted URL is a valid Youtube video URL. 
//If it is a valid Youtube video URL, the video id portion of the youtube video link is returned. If not, false is returned.
function isYoutube(getURL){
  var videoid = getURL.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
  if(videoid != null){
    return("video id = ",videoid[1]);
  } 
  else{ 
    return(false)
  }
}
//The following function determines if the inputted password is acceptable (between 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character).
//If the password is acceptable, true is returned. If not, false is returned.
function CheckPassword(inputtxt){ 
  var decimal=  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
  if(inputtxt.match(decimal)){
    return true;
  }
  else{ 
    return false;
  }
} 

let linksList = [];
//Below, an event listener for "click" is attached to the button element with ID "another". This button is clicked if the user wants to input another Youtube video link.
//The call-back function checks to see if the most recently inputted URL is indeed a valid Youtube video URL.
//If the URL is a valid Youtube video URL, the URL is pushed to the array called "linksList". If not, an error message becomes visible on the screen.
document.getElementById("another").addEventListener('click', function(){
  let newLink = String(document.getElementById("link").value);
  if (isYoutube(newLink) !== false){
    document.getElementById("error").style.visibility = "hidden";
    linksList.push(String(document.getElementById("link").value));
    document.getElementById("link").value = "";
  }
  else{
    document.getElementById("error").style.visibility = "visible";
  }
});
//Below, an event listener for "click" is attached to the button element with ID "submit1". This button is clicked if the user is ready to CREATE a group for watching their chosen Youtube videos.
//The call-back function determines if the user has met all of the requirements to create a group.
document.getElementById("submit1").addEventListener('click', async function(){
  //The last URL inputted by the user is stored inside "lastLink" and the group password inputted by the user is stored inside "pass".
  let lastLink = String(document.getElementById("link").value);
  let pass = String(document.getElementById("groupPass").value);
  //The following database query checks to see if the password inputted by the user already exists in the "groups" collection of the database. If it does, that means that the password inputted by the user has already been used and is non-unique.              
  db.collection('groups').where('groupPass', '==', pass).get().then(function(querySnapshot){
      if (!querySnapshot.empty){
        //Alert is thrown if group password entered by the user is non-unique.
        alert("It appears that there already exists a group with that password. Try again!");
      }
      else{
        //If group password entered by the user is indeed unique, the inputted group password is checked to see if it is acceptable.
        if (CheckPassword(pass)){
          //If the inputted group password is acceptable, the last URL inputted by the user is checked to see if it is a valid Youtube video URL.
          if (isYoutube(lastLink) !== false){
            //If the last URL inputted by the user is indeed a youtube video URL, then it is pushed to the "linksList" array.
            linksList.push(String(document.getElementById("link").value));
            //Since now, all of the URLs within "linksList" are valid URL video URLs, when they are all passed into the "isYoutube" function, the video ID's of the URLs are returned and stored inside the "idsList" array.
            let idsList = [];
            for (const link of linksList){
              idsList.push(isYoutube(link));
            }
            //A document is then added to the "groups" collection within the database containing the array of video ID's of the links inputted by the user and the group password created by the user.
            db.collection("groups").add({
              videoIds: idsList,
              groupPass: pass
            }).then(function(docRef){
              //Once the document is added to the collection, the list of video ID's is stored inside "idsList" within local storage. Because "idsList" is not sent to empty string, we will know later on that the user is creating a group. 
              localStorage.setItem("idsList", JSON.stringify(idsList));
              //And since "idsList2" in local storage is set to "", we will know that the user is not joining a group.
              localStorage.setItem("idsList2", JSON.stringify([""]));
              //The ID of the document that was just added to the collection then is set to "groupID" in local storage, which will be used as the group's security token.
              localStorage.setItem("groupID", docRef.id);
              //The window location then changes to the video-watching page so that the user can watch the videos that they just chose with rest of their group.
              window.location.href = './video.html';
            });
          }
          else{
            //If last inputted URL is not a valid Youtube video URL, an error message is displayed.
            document.getElementById("error").style.visibility = "visible";
          }
        }
        else{
          if (isYoutube(lastLink) !== false){
            document.getElementById("error").style.visibility = "hidden";
          }
          else{
            document.getElementById("error").style.visibility = "visible";
          }
          //If password is unacceptable, alert is thrown to user.
          alert("password must be between 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character.");
        }
      }
  });
});
////Below, an event listener for "click" is attached to the button element with ID "submit2". This button is clicked if the user is ready to JOIN a group for watching Youtube videos.
//The call-back function determines if the group password inputted by the user exists within the database collection.
//If the inputted-group password does exist, then the user is taken to the video-watching page (./video.html) so that they can watch Youtube videos with the rest of their group members.
document.getElementById("submit2").addEventListener('click', function(){
  //Inputted group password is stored inside "pass2".
  let pass2 = String(document.getElementById("groupPass2").value);
  //If the collection called "groups" within the database does not contain a document with the user-inputted group password, the user is alerted.
  db.collection('groups').where('groupPass', '==', pass2).get().then(function(querySnapshot){
    if (querySnapshot.empty){
      alert("It appears that there does not exist a group with the password you inputted. Try again!");
    }
    //If the user-inputted group password is within the collection, then the array of Youtube video ID's corresponding to the document with the group password inputted by the user are stored inside "idsList2".
    else{
      let promise2 = new Promise((resolve, reject) => {
        db.collection('groups').where('groupPass', '==', pass2).get().then((querySnapshot) => {
          querySnapshot.forEach(doc => {
            if (doc.exists){
              resolve(doc.data().videoIds);
            }
          });
        });
      });
      promise2.then((success) => {
        let idsList2 = success;
        //"idsList2" within local storage is then set to the list of video ID's corresponding to the group password inputted by the user, indicating that the user is JOINING a group.
        localStorage.setItem("idsList2", JSON.stringify(idsList2));
        //"idsList" within local storage is set to "", indicating that the user is NOT CREATING a group.
        localStorage.setItem("idsList", JSON.stringify([""]));
      });
      //The ID of the document corresponding to the group password inputted by the user is then set to "groupID2".
      let promise3 = new Promise((resolve, reject) => {
        db.collection('groups').where('groupPass', '==', pass2).get().then((querySnapshot) => {
          querySnapshot.forEach(doc => {
            if (doc.exists){
              resolve(doc.id);
            }
          });
        });
      });
      promise3.then((success) => {
        let groupID2 = success;
        //"groupID2" within local storage is then set to the ID of the document corresponding to the group password inputted by the user.
        localStorage.setItem("groupID2", groupID2);
        //The window location then changes to the video-watching page (./video.html) so that the user can watch the group's videos with the rest of the group.
        window.location.href = './video.html';
      });
    }
  });
});

