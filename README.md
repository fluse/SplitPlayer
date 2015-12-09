# SplitPlayer

## dependencies

- jQuery >1.8
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

### add video

```javascript
// create new player
var player = new SplitPlayer(options);

// add video
player.addVideo({
    videoId: '',
    startSeconds: 1.2
});
```

### add plugin

```javascript
var player = new SplitPlayer(options);

var playerTimeline = player.addPlugin(SplitPlayerTimeline);
};
```

### extend plugin

maybe you want to add a new behavior to your playerTimeline, like an on hover show time

```javascript
var player = new SplitPlayer(options);

var playerTimeline = player.addPlugin(SplitPlayerTimeline);

playerTimeline.extend(SplitPlayerTimePicker);

};
```

### playerStates

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

### player hooks

hooks are used to connect plugins to player behavior

- onReady
- onPlay
- onPause
- onStop
- onUpdate
