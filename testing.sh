#!/bin/bash

curl --data 'title=test&link=http://www.google.com' http://localhost:3000/posts
#{"__v":0,"title":"test","link":"http://www.google.com","_id":"569ba45d90614ecb4cf50b83","comments":[],"upvotes":0}

curl http://localhost:3000/posts
#[{"_id":"569ba45d90614ecb4cf50b83","title":"test","link":"http://www.google.com","__v":0,"comments":[],"upvotes":0}]

curl http://localhost:3000/posts/569ba45d90614ecb4cf50b83
#{"_id":"569ba45d90614ecb4cf50b83","title":"test","link":"http://www.google.com","__v":0,"comments":[],"upvotes":0}

curl -X PUT http://localhost:3000/posts/569ba45d90614ecb4cf50b83/upvote
#{"_id":"569ba45d90614ecb4cf50b83","title":"test","link":"http://www.google.com","__v":0,"comments":[],"upvotes":1}

curl --data "body=comment&author=somebody" http://localhost:3000/posts/569ba45d90614ecb4cf50b83/comments
#{"__v":0,"post":{"_id":"569ba45d90614ecb4cf50b83","title":"test","link":"http://www.google.com","__v":1,"comments":["569bb9241a65662e4d623e69"],"upvotes":1},"body":"comment","author":"somebody","_id":"569bb9241a65662e4d623e69","upvotes":0}

curl -X PUT http://localhost:3000/posts/569ba45d90614ecb4cf50b83/comments/569bb9241a65662e4d623e69/upvote
#{"_id":"569bb9241a65662e4d623e69","post":"569ba45d90614ecb4cf50b83","body":"comment","author":"somebody","__v":0,"upvotes":2}

curl http://localhost:3000/posts
#[{"_id":"569ba45d90614ecb4cf50b83","title":"test","link":"http://www.google.com","__v":1,"comments":["569bb9241a65662e4d623e69"],"upvotes":1}]

