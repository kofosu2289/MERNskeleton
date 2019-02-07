import Post from '../models/post.model'
import _ from 'lodash'
import errorHandler from './../helpers/dbErrorHandler'
import formidable from 'formidable'
import fs from 'fs'

const create = (req, res, mext) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            })
        }
        let post = new Post(fields)
        post.postedBy = req.profile
        if(files.photo) {
            post.photo.data = fs.readFileSync(files.photo.path)
            post.photo.contentType = files.photo.type
        }
        post.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler.getErrorMessage(err)
                })
            }
            res.json(result)
        })
    })
}

const postByID = (req, res, next, id) => {
    Post.findById(id).exec((err, post) => {
        if(err || !post)
            return res.status('400').json({
                error: "Post not found"
            })
        req.post = post
        next()
    })
}

const listByUser = (req, res) => {
    Post.find({postedBy: req.profile._id})
    .populate('comments', 'text created')
    .populate('comments.postedBy', '_id name')
    .populate('postedBy', '_id name')
    .sort('-created')
    .exec((err, posts) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        }
        res.json(posts)
    })
}

const listNewsFeed = (req, res) => {
    let following = req.profile.following
    follwoing.push(req.profile._id)
    Post.find({postedBy: { $in: req.profile.following } })
    .populate('comments', 'text created')
    .populate('comments.postedBy', '_id name')
    .populate('postedBy', '_id name')
    .sort('-created')
    .exec((err, posts) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        }
        res.json(posts)
    })
}

const remove = (req, res) => {
    let post = req.post
    post.remove((err, deletedPost) => {
        if (err) {
            res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        }
        res.json(deletedPost)
    })
}

const photo = (req, res, next) => {
    res.set("Content-Type", req.post.photo.contentType)
    return res.send(req.post.photo.data)
}
export default {listByUser, listNewsFeed, create, postByID, remove, photo}