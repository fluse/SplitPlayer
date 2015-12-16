# SplitPlayer

SplitPlayer is a high flexible extendable Video Player, that keeps multiple videos in sync.

you can see an productive integration on http://splitplay.tv

## restriction and licence

you can use this player only for non commercial products and websites.

#### Supported Hoster

- Youtube

## dependencies

- jQuery > 1.8
- underscoreJS

## create player

```javascript
var player = new SplitPlayer(options);
```

### player options

```javascript
var options = {
    hoster: 'youtube',
    videos: [],
    area: null,
    maxVideos: 4
}
```

#### add video

```javascript
// create new player
var player = new SplitPlayer(options);

// add video
player.addVideo({
    videoId: String,
    startSeconds: Number, // 1.2 float support
    isMuted: Boolean
});
```

#### add plugin

```javascript
var player = new SplitPlayer(options);

var playerTimeManager = player.addPlugin(SplitPlayerTimeManager);
};
```

#### add plugin and extend plugin with modules

maybe you want to add a new behavior to your playerTime, like an on hover show time

```javascript

    var player = new SplitPlayer(options);

    var playerTimeManager = player.addPlugin(SplitPlayerTimeManager);

    playerTimeManager.extend(SplitPlayerTimePicker);

};
```

#### available time Plugins

- Timeline
- Timepicker
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

#### play videos

play all videos if videos ready

```javascript
player.play();
```

#### pause videos

pause all videos

```javascript
player.pause();
```

#### toggle videos

Toggle Video from play to pause vice versa

```javascript
player.toggle();
```

#### stop videos

stop all videos. The played time will be set to 0 + startSeconds

```javascript
player.stop();
```

#### removeVideo

remove a video from Player by calling following methods with argument videoId;

```javascript
player.removeVideo(videoId);
```

#### timeTo

setTime for all Videos

```javascript
player.timeTo(Number); // float number supported
```
