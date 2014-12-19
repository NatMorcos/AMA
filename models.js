/**
 * Module Dependencies
 */

var path = require('path')
  , Sequelize = require('sequelize');

/**
 * Expose Models
 */
exports = module.exports = Models;

/**
 * Constructor for our models that sets up db connection and syncs tables.
 */
function Models(init) {
  /**
   * Set up database connection
   */
  var sequelize = new Sequelize("AMA_db", "root");

  /**
   * Define models for sequelize
   */
  this.Post = sequelize.define('Post', {
    id: { type: Sequelize.INTEGER, primaryKey: true },
    title: { type: Sequelize.STRING(140), allowNull: false},
    url: Sequelize.STRING,
    description: Sequelize.TEXT,
    votes: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0},
    voteWeight: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0}
  });

  /* gives us Post#setParent, Post#getParent */
  this.Post.hasOne(this.Post, {as: "Parent", foreignKey: "ParentId"}) //TODO: does this allow nulls?

  /**
   * Sync Database
   */
  sequelize.sync().success(function() {
    console.log('DB Sync Complete.');
    /* If callback provided then call it */
    if(init) init();
  }).error(function() {
    console.log('Error in DB Sync!!');
    process.exit(1);
  });
}

/**
 * Add a new post to database. Expects a validated options object.
 *
 * @param {String} blogName
 */
Models.prototype.addPost = function(options) {
  return this.Post.create(options);
}

/**
 * Delete all posts.
 */
Models.prototype.clearPosts = function() {
  return this.Post.destroy();
};


// /**
//  * Update tracking info for each fetched post.
//  *
//  * @param blogName
//  * @param fetchedPost
//  */
// Models.prototype.trackPost = function(blogName, fetchedPost) {
//   var self = this;

//   this.Posts.find(fetchedPost.id).success(function(post) {
//     if (!post) {
//       /* Post doesn't exist, build it */
//       post = self.Posts.build({
//         id: fetchedPost.id,
//         likedBy: blogName,
//         url: fetchedPost.post_url,
//         date: new Date(fetchedPost.date),
//         type: fetchedPost.type,
//         last_track: new Date(),
//         last_count: fetchedPost.note_count,
//         increment: 0,
//         sequence: 0,
  //         tracking: '[]'
//       });

//       switch(post.type) {
//         case 'text':
//         case 'chat':
//           post.text = fetchedPost.title ? scrapeText(fetchedPost.title) + '\n' : '';
//           post.text += scrapeText(fetchedPost.body);
//           break;
//     }

//     /* Update tracking */
//     post.sequence += 1;
//     post.last_track = new Date();
//     post.increment = fetchedPost.note_count - post.last_count;
//     post.last_count = fetchedPost.note_count;

//     var tracking = JSON.parse(scrapeText(post.tracking));
//     tracking.unshift({
//       timestamp: post.last_track,
//       sequence: post.sequence,
//       increment: post.increment,
//       count: post.last_count
//     });
//     post.tracking = JSON.stringify(tracking);

//     /* Save to db */
//     post.save().error(function(error) {
//       console.log(error);
//     })
//   });
// };

// /**
//  * Returns trending posts in the specified order
//  *
//  * @param {String} blog the blog hostname
//  * @param {String} order
//  * @param {Number} limit
//  */
// Models.prototype.getTrends = function(blog, order, limit){
//   var trending = (order == "trending"),
//       hourAgo = new Date(new Date() - 3600 * 1000),
//       longAgo = new Date(79,5,24);

//   var query = {
//       order: ['? DESC', trending ? 'increment' : 'date'],
//       where: ["last_track >= ? AND likedBy LIKE ?", (trending ? hourAgo : longAgo), (blog || "%")],
//       limit: limit
//     };
//   return this.Posts.findAll(query);
// };

// /**Checks for the blog blogName in the db
//  *
//  * @param {String} blogName
//  * @returns {*}
//  */
// Models.prototype.getBlog = function(blogName){
//     return this.Blog.find({where: {blogName: blogName} })
// };