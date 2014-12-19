/* DB population script. Warning: deletes all existing posts prior to running */



/**
 * Populate the Topic backend.
 */
var request = require('request');
apiUrl = 'http://localhost:8080';

/* The counter of currently active POST requests */
var postReqCounter = 0;

/* Population data */
var posts = [
    {
        id: 0,
        title:"I am Jack's Complete Lack of surprise. AMA.",
        url:'http://25.media.tumblr.com/tumblr_ligc5fecSK1qav29fo1_r1_500.gif',
        votes:20
    },
    {
        id: 1,
        title:'I am the nameless narrator.',
        votes:5,
        parentID: 0
    },
    {
        id: 2,
        title:'Jack or Tyler???!?!11',
        votes:0,
        parentID: 1
    },
    {
        id: 3,
        title:"I am Jack's smirking revenge.",
        votes:5,
        parentID: 0
    },
    {
        id: 4,
        title:'http://static.tumblr.com/eimlqnz/7gym85211/tumblr_lkotx0ojxa1qcnxvno1_500.gif',
        votes:0,
        parentID: 5
    },
    {
        id: 5,
        title:'+1',
        votes:1,
        parentID: 4
    },
    {
        id: 6,
        title:"bro there's a button for that.",
        votes:4,
        parentID: 5
    },
    {
        id: 7,
        title:'Breaking news: Jack has lost his surprise :(',
        url:'http://www.lostandfound.ca',
        votes:2,
    },
    {
        id: 8,
        title:"founddd it. It's been hiding out on blogspot since 2008:http://jackslackofsurprise.blogspot.ca/",
        votes:5,
        parentID: 7
    },
    {
        id: 9,
        title:'Excellent hiding place. No one would ever look there anyways. #teamWordpress',
        votes:10,
        parentID: 8
    },
    {
        id: 10,
        title:'AHEM. #teamTumblr',
        votes:7,
        parentID: 9
    },
    {
        id: 11,
        title:'tumblrrr',
        votes:7,
        parentID: 11
    },
    {
        id: 12,
        title:'as if there is a national lost and found site.',
        votes:1,
        parentID: 7
    }
];


/* Post a comment and all of the replies to that comment */
function postReply(reply, topicID, replyID) {
    incrementPostReqCounter();
    request.post(apiUrl + '/topic/' + topicID +'/reply' + (replyID ? '/' + replyID : ""), function(err, res, body){
        if(err) {
            throw err;
        }
        var json = JSON.parse(body);
        for(var i = 0; i < reply.votes; i++) {
            upvotePost(topicID, json.id)
        }
        reply.replies.forEach(function(comment) {
            postReply(comment, topicID, json.id);
        });
        decrementPostReqCounter();
    }).form({'text': reply.text, 'link': reply.link});
}

// /* Upvote a post */
// function upvotePost(topicID, replyID) {
//     incrementPostCounter();
//     request.post(apiUrl + '/topic/' + topicID + (replyID ? '/reply/' + replyID : "") + '/upvote', function(err, res, body){
//         if(err) {
//             throw err;
//         }
//         decrementPostCounter();
//     });
// }

/* increments the counter of currently processed POST requests */
function incrementPostReqCounter() {
    postReqCounter++;
};

/* decrements the counter of currently processed POST requests */
function decrementPostReqCounter() {
    postReqCounter--;
    if(postReqCounter == 0) {
        console.log("\n------------Finished Populating Data------------\n")
    }
};

/* Post a topic and all of the replies to that topic*/
function postTopic(topic) {
    incrementPostReqCounter();
 
    request.post(apiUrl + '/topic', function(err, res, body){
        if(err) {
            throw err;
        }
        //TODO: send the number once, instead of sending 1 lots of times
        for(var i = 0; i < topic.votes; i++) {
            upvotePost(json.id, null)
        }
        // topic.replies.forEach(function(reply) {
        //     postReply(reply, json.id, null);
        // });
        decrementPostReqCounter();
        console.log(". ");
    }).form(post);
}

/*** ====== MAIN ===== ***/

/* Clear Topics */
request.get(apiUrl + '/clear', function(err, response, body){
    if(err){
        throw err;
    }

    /* Populate Topics */
    posts.forEach(function(post) {
      postTopic(post);
  })

});


