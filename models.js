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
    title: Sequelize.STRING(140),
    url: { type: Sequelize.STRING, allowNull: true},
    description: { type: Sequelize.TEXT, allowNull: true},
    votes: { type: Sequelize.INTEGER, defaultValue: 0}
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