# convert jsx to js and es6 to es5
sh browserify.sh
# minify js file
sh uglify.sh
# compile & minify css & set assets banner
grunt deploy
