//Make connection
document.getElementById("previousVideo").style.visibility = "hidden";
var socket = io.connect('https://youtube-with-friends.herokuapp.com/'); // use http://localhost:5000/ or https://youtube-with-friends.herokuapp.com/
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
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
      const db = firebase.firestore();
      firebase.analytics();
       const auth = firebase.auth();
let user = firebase.auth().currentUser;
let userName2 = "";
let handle = "";
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log(user.displayName);
    handle = user.displayName;
    socket.emit('chat', {
    message: user.displayName + " has entered the chat",
    handle: user.displayName
  });
  } else {
  }
});

//let video = localStorage.getItem("link");
//console.log(video);
let videos = JSON.parse(localStorage.getItem("idsList"));
console.log(videos);
if (videos[0] == ""){
  videos = JSON.parse(localStorage.getItem("idsList2"));
}
let currentVideoId = 0;
if (videos.length == 1){
  document.getElementById("nextVideo").style.visibility = "hidden";
}
console.log(videos);
console.log(typeof videos);

console.log(videos[currentVideoId]);
console.log(typeof videos[currentVideoId]);
var tag = document.createElement('script');

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
      var player;
      let progress = document.getElementById("progress");
      let timer = document.getElementById("timer");
      function onYouTubeIframeAPIReady() {
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

      // when ready, wait for click
      function onPlayerReady(event) {
        timeLoop();
        progress.max = player.getDuration();
      }
      // 4. The API will call this function when the video player is ready.

      // 5. The API calls this function when the player's state changes.
      //    The function indicates that when playing a video (state=1),
      //    the player should play for six seconds and then stop.
      var done = false;
      function formatTime(seconds) {
        var minutes = Math.floor(seconds / 60);
        minutes = (minutes >= 10) ? minutes : minutes;
        var hours = Math.floor(minutes / 60);
        hours = (minutes >= 10) ? hours : hours;
        var seconds = Math.floor(seconds % 60);
        seconds = (seconds >= 10) ? seconds : seconds;
        return hours + ":" + minutes + ":" + seconds;
      }
      function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.ENDED){
           document.getElementById("playBtn").innerHTML = "Watch again";
           clearTimeout(timeout_setter);
        } else if (event.data == YT.PlayerState.PLAYING){
            myTimer = setInterval(function(){ 
            var time;
            currentTime = formatTime(player.getCurrentTime());
            totalTime = formatTime(player.getDuration());
            timer.innerHTML = currentTime + "/" + totalTime;
            }, 100);

            document.getElementById("playBtn").innerHTML = "Pause";
            if (currentVideoId >= 0){
                timeLoop();
                progress.max = player.getDuration();
            }

            if (currentVideoId == videos.length - 1){
              document.getElementById("nextVideo").style.visibility = "hidden";
            } else {
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
      function stopVideo() {
        player.stopVideo();
      }
      function timeLoop(){
        progress.value = player.getCurrentTime();
        timeout_setter = setTimeout(timeLoop, 1000);
      }
      document.getElementById("nextVideo").addEventListener('click', function(){
        socket.emit('nextVideo', 'nextVideo');
        //currentVideoId++;
          //  player.loadVideoById(videos[currentVideoId]);
      });
      document.getElementById("previousVideo").addEventListener('click', function(){
        socket.emit('previousVideo', 'previousVideo');
       // currentVideoId --;
        //  player.loadVideoById(videos[currentVideoId]);
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
//Emit events

document.getElementById("playBtn").addEventListener('click', function(){
  if (document.getElementById("playBtn").innerHTML == "Play"){
    socket.emit('play', 'play');
  }
  else if (document.getElementById("playBtn").innerHTML == "Pause"){
    socket.emit('pause', 'pause');
  }
  else{
    socket.emit('restart', 'restart');
  }
});
document.getElementById("goback").addEventListener('click', function() {
        var newTime = player.getCurrentTime() - 10;
        socket.emit('goback', newTime);
});
document.getElementById("goforward").addEventListener('click', function() {
        var newTime = player.getCurrentTime() + 10;
        if (newTime <= player.getDuration()){
          socket.emit('goforward', newTime);
        }
        else{
          socket.emit('goforward2', player.getDuration());
        }
});

btn.addEventListener('click', function(){
  socket.emit('chat', {
    message: message.value,
    handle: handle
  });
  message.value = "";
});

message.addEventListener('keypress', function(){
  socket.emit('typing', handle);
});

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

volinc.addEventListener('click', function(){
  if (player.getVolume() + 10 <= 100){
    player.setVolume(player.getVolume() + 10);
  }
});

voldec.addEventListener('click', function(){
  if (player.getVolume() - 10 >= 0){
    player.setVolume(player.getVolume() - 10);
  }
});
//document.getElementById("CC").addEventListener('click', function(){
  //if (document.getElementById("CC").innerHTML == "CC on"){
   //player.loadModule("captions");
    //player.loadModule("cc");
    //document.getElementById("CC").innerHTML = "CC off";
  //}
 //else{
    //player.unloadModule("captions");
    //player.unloadModule("cc");
    //document.getElementById("CC").innerHTML = "CC on";
  //}
//});


progress.addEventListener('mouseup', function(e) {
  socket.emit('progress', e.target.value);
});

//Listen for events
socket.on('play', function(data){
  player.playVideo();
  document.getElementById("playBtn").innerHTML = "Pause";
});

socket.on('pause', function(data){
  player.pauseVideo();
  document.getElementById("playBtn").innerHTML = "Play";
});

socket.on('restart', function(data){
  player.seekTo(0);
  timeLoop();
  document.getElementById("playBtn").innerHTML = "Pause";
});

socket.on('goback', function(data){
  player.seekTo(data);
  progress.value = (player.getCurrentTime()/player.getDuration() - 10);
});
socket.on('goforward', function(data){
  player.seekTo(data);
  progress.value = (player.getCurrentTime()/player.getDuration() + 10);
});
socket.on('goforward2', function(data){
  timer.innerHTML = data + "/" + data;
  player.seekTo(data);
  progress.value = data;
});
let numChats = 0;
function scrollToBottom() {
  $('#chat-window').stop().animate({
  scrollTop: $('#chat-window')[0].scrollHeight
}, 800);
}
socket.on('chat', function(data){
  feedback.innerHTML = "";
  output.innerHTML += '<p><strong>' + data.handle + ':</strong>' + ' ' + data.message + '</p>';
  numChats ++;
  if (numChats % 8 == 0){
    console.log("8");
    scrollToBottom();
  }
});
socket.on('typing', function(data){
  feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});
socket.on('progress', function(data){
  player.seekTo(data);
  progress.value = data;
  timer.innerHTML = formatTime(data) + "/" + formatTime(player.getDuration());
});
socket.on('nextVideo', function(data){
  currentVideoId++;
  player.loadVideoById(videos[currentVideoId]);
});
socket.on('previousVideo', function(data){
  currentVideoId --;
  player.loadVideoById(videos[currentVideoId]);
})
