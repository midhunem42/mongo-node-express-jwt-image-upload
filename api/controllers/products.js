const Product = require('../models/Product');
const mongoose = require('mongoose');

exports.get_all_products = (req, res, next) => {
    Product.find()
        .select('name price _id productImage')
        .exec()
        .then(elements => {
            const response = {
                count: elements.length,
                products: elements.map(element => {
                    return {
                        name: element.name,
                        price: element.price,
                        _id: element._id,
                        productImage: element.productImage,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + element._id
                        }
                    }
                })
            }
            if (elements.length > 0) {
                res.status(200).json(response);
            } else {
                res.status(404).json({
                    message: "No entries found"
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

exports.create_new_product = (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });

    product.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: "Created product successfully",
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                productImage: result.productImage,
                request: {
                    type: "GET",
                    url: 'http://localhost:3000/products/' + result._id
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

exports.get_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(doc => {
            console.log("From Database " + doc);
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: "GET",
                        url: 'http://localhost:3000/products/' + doc._id
                    }
                });
            } else {
                res.status(404).json({
                    message: "No valid entry found for productId"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
}

exports.update_product = (req, res, next) => {
    const id = req.params.productId;
    Product.update({
            _id: id
        }, {
            $set: {
                name: req.body.newName,
                price: req.body.newPrice
            }
        })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "Product Updated successfully",
                request: {
                    type: "GET",
                    url: 'http://localhost:3000/products/' + result._id
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        })
}

exports.remove_product = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({
            _id: id
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Product deleted",
                request: {
                    type: "POST",
                    url: 'http://localhost:3000/products',
                    body: {
                        name: "String",
                        price: "Number"
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