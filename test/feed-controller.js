const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const Post = require('../models/post');
const FeedController = require('../controllers/feed');

describe('Feed Controller', function(done) {
  before(function(done) {
    mongoose
      .connect(
        'mongodb+srv://MBE:itsamissdude2021@cluster0.5wnau.mongodb.net/test?retryWrites=true&w=majority'
      )
      .then(result => {
        const user = new User({
          email: 'test@test.com',
          password: 'tester',
          name: 'Test',
          posts: [],
          _id: '5c0f66b979af55031b34728a'
        });
        return user.save();
      })
      .then(() => {
        done();
      });
  });

  beforeEach(function() {});

  afterEach(function() {});

   

  it('should add a created post to the posts of the creator ', function() {
    const req = { 
        body: {
            title: 'Test post',
            content: 'a test content',
        },
        file: {
            path: 'filepath'
        },
        userId: '5c0f66b979af55031b34728a' 
    };

    const res = {
      statusCode: 200,
      userStatus: null,
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        this.userStatus = data.status;
      }
    };

    FeedController.createPost(req, res, () => {}).then((savedUser) => {
      expect(savedUser).to.have.property('posts');
      expect(savedUser.posts).to.have.length(1);
      done();
    });
  });

  after(function(done) {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});
