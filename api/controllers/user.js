const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.user_signup = (req, res, next) => {
    User.find({
            email: req.body.email
        })
        .exec()
        .then(user => {
            if (user.length > 1) {
                return res.status(409).json({
                    message: "user already exists"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {

                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: "Signup successfully",
                                    userDetails: {
                                        email: result.email,
                                        password: result.password,
                                        _id: result._id,
                                        request: {
                                            type: "GET",
                                            url: 'http://localhost:3000/users/' + result._id
                                        }
                                    }
                                })
                            }).catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.user_login = (req, res, next) => {
    User.find({
            email: req.body.email
        })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "User not exists"
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {

                    return res.status(401).json({
                        message: "Authentication failed"
                    })
                }
                if (result) {
                    const token = jwt.sign({
                            email: user[0].email,
                            _id: user[0]._id
                        },
                        "secret key", {
                            expiresIn: "1h"
                        }
                    )
                    return res.status(200).json({
                        message: "Authentication success",
                        token: token
                    })
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

exports.delete_user = (req, res, next) => {
    User.remove({
            _id: req.params.userId
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "User deleted successfully",
                request: {
                    type: "POST",
                    url: 'http://localhost:3000/user/signup',
                    body: {
                        email: "String",
                        password: "Number"
                    }
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}