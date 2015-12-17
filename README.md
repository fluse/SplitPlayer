# SplitPlayer

SplitPlayer is a high flexible extendable Video Player, that keeps multiple youtube videos in sync.

you can see an productive integration on http://splitplay.tv

## Installation and Usage

```shell
npm install splitplayer
```

include the splitplayer javascript. you can choice between

- unpacked
- minified
- standalone (included underscoreJS and jQuery)

```html
<script src="/dist/splitplayer.js"></script>
<script src="/dist/splitplayer.min.js"></script>
<script src="/dist/splitplayer.standalone.js"></script>
```

## create player

```javascript
var player = new SplitPlayer(options);
```

### player options

```javascript
var options = {
    videos: [],
    area: null,
    maxVideos: 4,
    volume: 100,
    template: '<div id="SplitPlayer"></div>'
};
```

### add videos on player creation

```javascript

var videoList = [{options}, {options}, {options}];

var player = new SplitPlayer(options, videoList);

```

### add single video

```javascript
// create new player
var player = new SplitPlayer(options);

// add video
player.addVideo({object});
```

### video options
```javascript

var video = {
    hoster: 'youtube',
    videoId: String,
    startSeconds: Number, // 1.2 float support
    isMuted: Boolean
}

```

#### add plugin

```javascript
var player = new SplitPlayer(options);

var playerTimeManager = player.addPlugin(SplitPlayerTimeManager);

```

#### add plugin and extend plugin with modules

maybe you want to add a new behavior to your playerTime, like an on hover show time

```javascript

var player = new SplitPlayer(options);

var playerTimeManager = player.addPlugin(SplitPlayerTimeManager);

playerTimeManager.extend(SplitPlayerTimePicker);

```

#### available time Plugins

- TimeManager
 - TimeLine
 - TimePicker
 - TimeDisplay

#### playerStates

```javascript
// player state constants
const playerState = {
    unstarted: -1,
    ended: 0,
    playing: 1,
    pause: 2,
    buffering: 3,
    loading: 6
};
```

#### player hooks

hooks are used to connect plugins to player behavior

- onReady
- onPlay
- onPause
- onStop
- onUpdate

### Public Methods

#### play()

play all videos if videos ready

```javascript
player.play();
```

#### pause()

pause all videos

```javascript
player.pause();
```

#### toggle()

Toggle Video from play to pause vice versa

```javascript
player.toggle();
```

#### stop()

stop all videos. The played time will be set to 0 + startSeconds

```javascript
player.stop();
```

#### removeVideo()

remove a video from Player by calling following methods with argument videoId;

```javascript
player.removeVideo(videoId);
```

#### timeTo()

setTime for all Videos

```javascript
player.timeTo(Number); // float number supported
```

#### volumeTo()

set Volume for non muted videos to given number

```javascript
player.volumeTo(Number); // 0-100
```

#### getPlayedTime()

get current played time in seconds

```javascript
return seconds = player.getPlayedTime();
```

## restriction and licence

you can use this player only for non commercial products and websites.

#### Supported Hoster
- Youtube
- Vimeo (planned)
- Native (planned)

## dependencies
- jQuery > 1.8
- underscoreJS
