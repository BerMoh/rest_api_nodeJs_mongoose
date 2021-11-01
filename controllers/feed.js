const { validationResult } = require('express-validator/check');
const Post = require('../models/post');
const fs = require('fs');
const path = require('path');

exports.getPosts = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const itemPerPage = 2;
    let totalItems = 0;
    Post.find().countDocuments()
    .then(count => {
        totalItems = count;
        return Post.find()
        .skip((currentPage - 1) * itemPerPage)
        .limit(itemPerPage)
    })
    .then(posts =>{
        res.status(200).json({
            message : 'Fetched posts successfully.', 
            posts : posts,
            totalItems : totalItems
        });
    })
    .catch(err =>{
        throwError(err)
    });
}

exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation failed, entereddata is incorrect.');
        error.statusCode = 422;
        
        throw error;
    }
    if(!req.file) {
        const error = new Error('No image provided');
        error.statusCode = 422;
        
        throw error;
    }
    const imageUrl = req.file.path;
    const post  = new Post({
        title : req.body.title,
        content : req.body.content,
        imageUrl : imageUrl,
        creator : { name : 'Berchane' }
    });

    post.save().then(result => {
        res.status(201).json({
            message : 'Post created successfully',
            post :result
        });
    })
    .catch(err => { 
        throwError(err);
    });
}

exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
    .then(post => {
        if(!post) {
            const error = new Error('Could not find post.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ message : 'Post fetched.', post : post });
    })
    .catch(err => { 
        throwError(err);
    })
}

exports.updatePost = (req, res, next) => {
    const postId = req.params.postId;
    const title = req.body.title;
    const content = req.body.content;
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const error = new Error('Validation failed, entereddata is incorrect.');
        error.statusCode = 422;
        
        throw error;
    }

    if(req.file){
        imageUrl = req.file.path;
    }

    if(!imageUrl){
        const error = new Error('no file picked.');
        error.statusCode = 402;
        throw error;
    }

    Post.findById(postId)
    .then(post => {
        if(!post) {
            const error = new Error('Could not find post.');
            error.statusCode = 404;
            throw error;
        }

        if(imageUrl !== post.image){
            clearImage(post.imageUrl);
        }

        post.title = title;
        post.content = content;
        post.imageUrl = imageUrl;

        return post.save();
    })
    .then(result => {
        res.status(200).json({ message : 'Post updated.', post : result });
    })
    .catch(err => { 
        throwError(err);
    })
}


exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const error = new Error('Validation failed, entereddata is incorrect.');
        error.statusCode = 422;
        throw error;
    }

    Post.findById(postId)
    .then(post => {
        if(!post) {
            const error = new Error('Could not find post.');
            error.statusCode = 404;
            throw error;
        }
        clearImage(post.imageUrl);
        return Post.findByIdAndRemove(postId);
    })
    .then(result => {
        res.status(200).json({ message : 'Post deleted.', post : result });
    })
    .catch(err => { 
        throwError(err);
    })
}

function throwError(err) {
    if(!err.statusCode){
        err.statusCode = 500;
    }    
    next(err);
}

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    console.log(filePath);
    fs.unlink(filePath, err => console.log(err));
}