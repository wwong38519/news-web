#!/bin/bash

curl --data 'title=test&link=http://www.google.com' http://localhost:3000/posts
#{"__v":0,"title":"test","link":"http://www.google.com","_id":"569ba45d90614ecb4cf50b83","comments":[],"upvotes":0}

curl http://localhost:3000/posts
#[{"_id":"569ba45d90614ecb4cf50b83","title":"test","link":"http://www.google.com","__v":0,"comments":[],"upvotes":0}]

curl http://localhost:3000/posts/569ba45d90614ecb4cf50b83
#{"_id":"569ba45d90614ecb4cf50b83","title":"test","link":"http://www.google.com","__v":0,"comments":[],"upvotes":0}

