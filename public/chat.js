document.getElementById("previousVideo").style.visibility = "hidden";
//Web socket connection is established between client and public server.
var socket = io.connect('https://youtube-with-friends.herokuapp.com/'); // use http://localhost:5000/ or https://youtube-with-friends.herokuapp.com/
//Firebase is configured.
var firebaseConfig = {
  apiKey: "AIzaSyAXz1hDMesciBYe-Hj5n_xHmatymT6PWGo",
  authDomain: "realtime-fbbc9.firebaseapp.com",
  databaseURL: "https://realtime-fbbc9.firebaseio.com",
  projectId: "realtime-fbbc9",
  storageBucket: "realtime-fbbc9.appspot.com",
  messagingSenderId: "868489312223",
  appId: "1:868489312223:web:e7c19ecd40567f72a4b66a",
  measurementId: "G-P2DKFZMLFR"
};
// Firebase is initialized.
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
firebase.analytics();
//Authentication is initialized.
const auth = firebase.auth();
//User is initialized.
let user = firebase.auth().currentUser;
let userName2 = "";
let handle = "";
//"videos" is assigned to the "idsList" array stored within local storage. "idsList" variable was set in "home.js".
let videos = JSON.parse(localStorage.getItem("idsList"));
let groupToken = "";
let didCreate = false;
if (videos[0] == ""){
  //if videos[0] == "", then the "idsList" array was set to "". This means that the "idsList2" variable must have been set in "home.js", indicating that the user is joining a group.
  videos = JSON.parse(localStorage.getItem("idsList2"));
  //"groupToken" is set to the group security token stored inside "groupID2". We know that "groupID2" was set in home.js because we know the user is joining a group.
  groupToken = localStorage.getItem("groupID2");
}
else{
  //if videos[0] != "", then we do not change the value of "videos". This means that the value of videos will be that of the "idsList" variable within local storage, which is good because we know that the user is creating a group.
  //"groupToken" is then set to the "groupID" variable stored within local storage. This is good because the "groupID" variable would have been set in "home.js" if the user is creating a group. And, that is the case if we have gotten to this else branch: the user is creating a group.
  groupToken = localStorage.getItem("groupID");
  //"didCreate" is set to true because we know that the user is creating a group.
  didCreate = true;
}
//If the user is currently signed in (which they will be upon entering the "video.html" page), an 'enterChat' message is sent to the server with a message. 
//The message includes a string saying the user has entered the chat and the group security token "groupToken" that will enable the user to join their group.
firebase.auth().onAuthStateChanged((user) => {
  if (user){
    handle = user.displayName;
    socket.emit('enterChat', {
      message: user.displayName + " has entered the chat",
      groupToken: groupToken
    });
  }
});
//If the user is creating a group, then a 'create' message is sent down the web socket to the server.
if (didCreate){
  socket.emit('create', groupToken);
}
//If the user is joining a group, then a 'join' message is sent down the web socket to the server.
else{
  socket.emit('join', groupToken);
}
//"currentVideoId" is set to 0 because we are assuming that the group wants to watch the videos in order in which they were inputted.
let currentVideoId = 0;
//If the length of the "videos" array (which includes either the video ID's of the URL's chosen by the user or the video ID's of the URL's chosen by the creator of the group) is 1, then the "nextVideo" button is hidden (there is no next video).
if (videos.length == 1){
  document.getElementById("nextVideo").style.visibility = "hidden";
}
//Youtube Player initialization
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
// This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
let progress = document.getElementById("progress");
let timer = document.getElementById("timer");
function onYouTubeIframeAPIReady(){
  player = new YT.Player('player', {
    height: '700',
    width: '1400',
    videoId: videos[currentVideoId],
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    },
    playerVars: {
      'controls':0,
      'disablekd':1,
      'modestbranding':1,
      'rel':0,
      'showinfo':0,
      'autohide':1
    }
  });
}
// The API will call this function when the video player is ready.
function onPlayerReady(event){
  timeLoop();
  progress.max = player.getDuration();
}


//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
//The following function takes the inputted number of seconds and returns the equivalent normal time display (hh:mm:ss) so that the time remaining in the video can be displayed to the user.
function formatTime(seconds){
  var minutes = Math.floor(seconds / 60);
  minutes = (minutes >= 10) ? minutes : minutes;
  var hours = Math.floor(minutes / 60);
  hours = (minutes >= 10) ? hours : hours;
  var seconds = Math.floor(seconds % 60);
  seconds = (seconds >= 10) ? seconds : seconds;
  return hours + ":" + minutes + ":" + seconds;
}
// The API calls this function when the player's state changes (such as from PLAYING to ENDED).
function onPlayerStateChange(event){
  //If the player's current state is now ENDED (meaning the video is over), then play button turns into a "Watch Again" button for the user so the user has the option to watch the video again.
  if (event.data == YT.PlayerState.ENDED){
    document.getElementById("playBtn").innerHTML = "Watch again";
    //"timeout_setter" is cleared to 00:00:00 because either the next video is going to be starting (if there is a next video) or the video is going to restart.
    clearTimeout(timeout_setter);
  }
  else if (event.data == YT.PlayerState.PLAYING){
    //if the player's current state is now PLAYING, the (changing) time of the video is displayed to the user.
    myTimer = setInterval(function(){
      var time;
      currentTime = formatTime(player.getCurrentTime());
      totalTime = formatTime(player.getDuration());
      timer.innerHTML = currentTime + "/" + totalTime;
    }, 100);
    document.getElementById("playBtn").innerHTML = "Pause";
    //If there is a video currently being played, then the "timeLoop" function is called so that the progress bar knob moves forward corresponding with the current time in the video.
    //The max value of the progress bar is also set to the duration of the currently playing video.
    if (currentVideoId >= 0){
      timeLoop();
      progress.max = player.getDuration();
    }
    if (currentVideoId == videos.length - 1){
      document.getElementById("nextVideo").style.visibility = "hidden";
    } 
    else{
      document.getElementById("nextVideo").style.visibility = "visible";
    }
    if (currentVideoId >= 1){

      document.getElementById("previousVideo").style.visibility = "visible";
    }
    else if (currentVideoId == 0){
      document.getElementById("previousVideo").style.visibility = "hidden";
      document.getElementById("nextVideo").style.visibility = "visible";
    }
  }
}
//The function below dynamically sets the current value of the progress bar to match the current time of the video. "timeout_setter" is also initialized.
function timeLoop(){
  progress.value = player.getCurrentTime();
  timeout_setter = setTimeout(timeLoop, 1000);
}
//An event listener for "click" is added to the "nextVideo" button.
//If the user clicks it, then a 'nextVideo' message is sent down the socket to the server, along with the "groupToken" so that the server knows which group the "next video" request is coming from.
//This is important because the server needs to know which sockets to send the 'nextVideo' message to.
document.getElementById("nextVideo").addEventListener('click', function(){
  socket.emit('nextVideo', groupToken);
});
//Same thing as what occurs if the "nextVideo" button's "click" event listener hears a click occurs here, except in this case the request is to go to the previous video in the playlist.
document.getElementById("previousVideo").addEventListener('click', function(){
  socket.emit('previousVideo', groupToken);
});

//Query DOM
var message = document.getElementById('message');
    handle = document.getElementById('handle'),
    btn = document.getElementById('send'),
    output = document.getElementById('output'),
    feedback = document.getElementById('feedback'),
    mute = document.getElementById('mute'),
    volinc = document.getElementById('volinc'),
    vocdec = document.getElementById('voldec');
//Event listener for "click" is added to "playBtn" button.
//If event occurs and the current innerHTML of the button equals "Play", then a play request is sent to the server.
//If current innerHTML is "Pause", a pause request is sent to the server, and otherwise a "restart" request is sent to the server (because the innerHTML must be "Watch Again").
document.getElementById("playBtn").addEventListener('click', function(){
  if (document.getElementById("playBtn").innerHTML == "Play"){
    socket.emit('play', groupToken);
  }
  else if (document.getElementById("playBtn").innerHTML == "Pause"){
    socket.emit('pause', groupToken);
  }
  else{
    socket.emit('restart', groupToken);
  }
});
//Event listener for "click" is added to "goback" button.
//If event occurs, the new time of the video ("newTime") should be ten seconds before the current time of the video (since the user wants to go backwards in time in the video).
//A 'goback' request is then sent to the server, with an object  "goBackObj" containing the new time the user wants to go to in the video (current time minus 10 seconds) and the group Token so that the server knows which group the request is for.
document.getElementById("goback").addEventListener('click', function(){
  var newTime = player.getCurrentTime() - 10;
  let goBackObj = {
    groupToken: groupToken,
    newTime: newTime
  }
  socket.emit('goback', goBackObj);
});
//Same thing that occurs if the "goback" button's event listener hears a click occurs here, except this time a "go forward" request is sent to the server so that the group can skip forward ten seconds in the video.
document.getElementById("goforward").addEventListener('click', function(){
  var newTime = player.getCurrentTime() + 10;
  let goForwardObj = {
    groupToken: groupToken,
    newTime: newTime
  }
  //Different "go forward" messages are sent down the socket depending on if the current time plus ten seconds would be within the duration of the video.
  if (newTime <= player.getDuration()){
    socket.emit('goforward', goForwardObj);
  }
  else{
    newTime = player.getDuration();
    socket.emit('goforward2', goForwardObj);
  }
});
//Event listener for "click" is added to "btn", which is the "send" button for a chat message.
//When "click" event occurs, a "chat" message is sent down the socket to the server containing the value contained within the "message" input field, the "handle" (current user's name acquired from Google Auth), and the group Token (which again is necessary for server to know which group the message is coming from).
btn.addEventListener('click', function(){
  socket.emit('chat', {
    message: message.value,
    handle: handle,
    groupToken: groupToken
  });
  message.value = "";
});
//Event listener for "keypress" is added to the "message" input field.
//Now, when the user is in the process of typing a chat message, a "typing" message is sent to the server so that everyone else in the group can know that the user is currently typing a chat message.
//The handle is included so the other group members know where the message is coming from, along with the group token so the server knows which sockets to relay the "typing" message to.
message.addEventListener('keypress', function(){
  socket.emit('typing', {
    handle: handle,
    groupToken: groupToken
    });
});
//Event listener for "click" is added to the "mute" button.
//Now, when the "mute" button is clicked, the video mutes (or unmutes) for the user depending on the innerHTML of the button.
mute.addEventListener('click', function(){
  if (mute.innerHTML == "Mute"){
    player.mute();
    mute.innerHTML = "Unmute";
  }
  else{
    player.unMute();
    mute.innerHTML = "Mute";
  }
});
//Event listener for "click" is added to "volinc", which is the "volume increase" button.
//When clicked, the volume of the video will be increased for the user.
volinc.addEventListener('click', function(){
  if (player.getVolume() + 10 <= 100){
    player.setVolume(player.getVolume() + 10);
  }
});
//Same thing that occurs when user clicks "volinc" button occurs when user clicks "voldec" button, except instead, the volume of the video decreases for the user.
voldec.addEventListener('click', function(){
  if (player.getVolume() - 10 >= 0){
    player.setVolume(player.getVolume() - 10);
  }
});

//Event listener for "mouseup" is added to the progress bar.
//Now, right at the moment when the user lets go of the progress bar knob after dragging it to a different time in the video, a "progress" message is sent down the socket to the server including the new time that the video will play at for all of the members of the group and the group token.
progress.addEventListener('mouseup', function(e) {
  socket.emit('progress', {newProgress: e.target.value, groupToken: groupToken});
});

//Listen for messages from server
//When the event occurs in which the client receives a "play" message from the server, the video will play for the client.
socket.on('play', function(data){
  player.playVideo();
  document.getElementById("playBtn").innerHTML = "Pause";
});
//When the event occurs in which the client receives a "pause" message from the server, the video will pause for the client.
socket.on('pause', function(data){
  player.pauseVideo();
  document.getElementById("playBtn").innerHTML = "Play";
});
//When the event occurs in which the client receives a "restart" message from the server, the video will restart for the client.
socket.on('restart', function(data){
  player.seekTo(0);
  timeLoop();
  document.getElementById("playBtn").innerHTML = "Pause";
});
//When client receives "go back" message from server, the video will go back ten seconds in time for the client using the player's "seekTo" function. The progress bar for the client is also adjusted accordingly.
socket.on('goback', function(data){
  player.seekTo(data);
  progress.value = (player.getCurrentTime()/player.getDuration() - 10);
});
//Same thing that occurs when client receives a "go back" message from the server occurs below, except this time the client's video player skips forward ten seconds in the video. 
socket.on('goforward', function(data){
  player.seekTo(data);
  progress.value = (player.getCurrentTime()/player.getDuration() + 10);
});
//If client receives a "goforward2" message from the server, that means that the person who skipped forward in the video skipped to a time outside the duration of the video.
//As a result, the timer displays that the video is complete, and the progress bar knob is set to the end of the video.
socket.on('goforward2', function(data){
  timer.innerHTML = data + "/" + data;
  player.seekTo(data);
  progress.value = data;
});
//If event occurs where socket receives a "chat" message, the innerHTML of the "feedback" div saying "so and so is typing" is set to "" (because the message has already been sent).
//Additionally, chat message sent by the server to the client is added to the innerHTML of the output div, so that the client can see the new chat message that someone in the group has sent.
socket.on('chat', function(data){
  feedback.innerHTML = "";
  output.innerHTML += '<p><strong>' + data.handle + ':</strong>' + ' ' + data.message + '</p>';
});
//If event occurs where socket receives an "enterChat" message, then the client will see a message in the chat window saying that someone has entered the chat.
socket.on('enterChat', function(data){
  output.innerHTML += '<p>' + data + '</p>';
});
//If client receives "typing" message from server, then the message "so and so is typing a message" is added to the innerHTML of the "feedback" div on the client's page.
//This enables the client to see that someone in the group is currently typing a message.
socket.on('typing', function(data){
  feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});
//If client receives a "progress" message from server, then the progress bar of the client's video-watching page is set to whatever value was sent by the server.
//The value sent by the server is a time value, so the client's progress bar will be set to whatever time was sent to it by the server. The client's timer will update accordingly as well.
socket.on('progress', function(data){
  player.seekTo(data);
  progress.value = data;
  timer.innerHTML = formatTime(data) + "/" + formatTime(player.getDuration());
});
//In the event that the client receives a "next video" message from the server, the client's video player will go to to the next video in the group's playlist.
socket.on('nextVideo', function(data){
  currentVideoId++;
  player.loadVideoById(videos[currentVideoId]);
});
//Same thing that occurs when client receives a "next video" message from the server occurs here, except the client's video player will go to the previous video in the group's playlist.
socket.on('previousVideo', function(data){
  currentVideoId --;
  player.loadVideoById(videos[currentVideoId]);
});
