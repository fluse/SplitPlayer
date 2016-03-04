# app js
browserify -t [ babelify --presets [ es2015 react ] ] ./../src/player.js -o ./../public/dist/splitplayer.js
