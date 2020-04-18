//Make connection
var socket = io.connect('http://localhost:3000');


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
          videoId: '25tGPblFqQI',
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
        myTimer = setInterval(function(){ 
          var time;
          currentTime = formatTime(player.getCurrentTime());
          totalTime = formatTime(player.getDuration());
          timer.innerHTML = currentTime + "/" + totalTime;
        }, 100);
        if (event.data == YT.PlayerState.ENDED)
        {
          clearTimeout(timeout_setter);
        }
      }
      function stopVideo() {
        player.stopVideo();
      }
      function timeLoop(){
        progress.value = player.getCurrentTime();
        timeout_setter = setTimeout(timeLoop, 1000);
      }

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
  socket.emit('play', 'play');
});

document.getElementById("pauseBtn").addEventListener('click', function(){
  socket.emit('pause', 'pause');
});

document.getElementById("goback").addEventListener('click', function() {
        var newTime = player.getCurrentTime() - 10;
        socket.emit('goback', newTime);
});
document.getElementById("goforward").addEventListener('click', function() {
        var newTime = player.getCurrentTime() + 10;
        socket.emit('goforward', newTime);
});

btn.addEventListener('click', function(){
  socket.emit('chat', {
    message: message.value,
    handle: handle.value
  });
});

message.addEventListener('keypress', function(){
  socket.emit('typing', handle.value);
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

progress.addEventListener('mouseup', function(e) {
  socket.emit('progress', e.target.value);
});

//Listen for events
socket.on('play', function(data){
  player.playVideo();
});

socket.on('pause', function(data){
  player.pauseVideo();
});

socket.on('goback', function(data){
  player.seekTo(data);
  progress.value = (player.getCurrentTime()/player.getDuration() - 10);
});
socket.on('goforward', function(data){
  player.seekTo(data);
  progress.value = (player.getCurrentTime()/player.getDuration() + 10);
});
socket.on('chat', function(data){
  feedback.innerHTML = "";
  output.innerHTML += '<p><strong>' + data.handle + ':</strong>' + data.message + '</p>';
});
socket.on('typing', function(data){
  feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
})
socket.on('progress', function(data){
  player.seekTo(data);
  progress.value = data;
  timer.innerHTML = formatTime(data) + "/" + formatTime(player.getDuration());
})