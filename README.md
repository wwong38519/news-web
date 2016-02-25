### news-web

This is a practice on using MEAN following the tutorial on [Learn to Build Modern Web Apps with MEAN](https://thinkster.io/mean-stack-tutorial#beginning-node) to build a Reddit-like news/comment website.

##### command used
template with ejs engine
```
express --ejs news-web
```

build node_modules
```
npm install
```

fix node-gyp cannot rebuild when installing mongooes
```
sudo npm install -g node-gyp
```

'--save' to include it in package.json
```
npm install --save mongoose
```

start with angularjs
```
touch views/index.ejs
touch public/javascripts/angularApp.js

```

backend routes
```
touch routes/index.js
```

models for mongoose/mongodb
```
touch models/Posts.js
touch models/Comments.js
```

models for authentication
```
touch models/Users.js
```

using ctypto comes with nodejs to generate hash

install jsonwebtoken to generate tokens
```
npm install jsonwebtoken --save
```

install passport & passport-local for authentication strategies
```
npm install passport passport-local --save
```

config passport
```
touch config/passport.js
```

install express-jwt to associate posts/comments with users
```
npm install express-jwt --save
```
