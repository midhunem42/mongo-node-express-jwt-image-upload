const Orders = require('../models/Order');
const Product = require('../models/Product');
const mongoose = require('mongoose');

exports.get_all_orders = (req, res, next) => {
    Orders.find()
        .select('quantity _id product')
        .exec()
        .then(elements => {
            const response = {
                count: elements.length,
                orders: elements.map(element => {
                    return {
                        quantity: element.quantity,
                        productid: element.product,
                        _id: element._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + element._id
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

exports.create_order = (req, res, next) => {
    Product.findById(req.body.productid)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: "Product Not found"
                });
            }
            const order = new Orders({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productid

            });
            return order.save();
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Order created successfully",
                createdOrder: {
                    _id: result._id,
                    quantity: result.quantity,
                    product: result.product
                },
                request: {
                    type: "GET",
                    url: 'http://localhost:3000/orders/' + result._id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.get_order = (req, res, next) => {
    const id = req.params.orderId;
    Orders.findById(id)
        .select('quantity _id product')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    order: doc,
                    request: {
                        type: "GET",
                        url: 'http://localhost:3000/orders/' + doc._id
                    }
                })
            } else {
                res.status(404).json({
                    message: "Order not found"
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
}

exports.update_order = (req, res, next) => {
    const id = req.params.orderId;
    Orders.update({
            _id: id
        }, {
            $set: {
                quantity: req.body.quantity,
                product: req.body.productid
            }
        })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "Order Updated successfully",
                request: {
                    type: "GET",
                    url: 'http://localhost:3000/orders/' + result._id
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        })
}

exports.remove_order = (req, res, next) => {
    const id = req.params.orderId;
    Orders.remove({
            _id: id
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Order deleted",
                request: {
                    type: "POST",
                    url: 'http://localhost:3000/products',
                    body: {
                        quantity: "String",
                        productid: "ID"
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
