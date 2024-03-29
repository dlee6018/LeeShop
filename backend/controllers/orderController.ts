import { IUser } from './../utils/interface';
import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel'
import { Request, RequestHandler, Response } from 'express'
import {IOrder} from '../utils/interface'

// @desc    Create new order
// @route   POST /api/orders
// @access  Private

const addOrderItems:RequestHandler = asyncHandler(async (req:Request, res: Response) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body

  const user: IUser = req.user as IUser

  if (orderItems && orderItems.length === 0) {
    res.status(400)
    throw new Error('No order items')
    return
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    })

    const createdOrder = await order.save()
    res.status(201).json(createdOrder)
  }
})

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private

const checkIfOrderExists = (order:any) => {
  if(!order){
    throw new Error('Order not found')
  }
}

const getOrderById = asyncHandler(async (req:Request, res:Response) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email id'
  )

 
  if(order){
    res.json(order)
  }else{
    throw new Error("Order not found")
  }
  
})

// @desc    Update order to paid
// @route   GET /api/orders/:id/pay
// @access  Private

const updateOrderToPaid = asyncHandler(async (req:Request, res: Response) => {
  const order = await Order.findById(req.params.id)

    if(order){
      order.isPaid = true
      order.paidAt = new Date(Date.now());
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
    }
  }else{
    throw new Error("Order not found")
  }
  const updatedOrder = await order.save()

  res.json(updatedOrder)
  
})

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req:Request, res: Response) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isDelivered = true
    order.deliveredAt = new Date(Date.now());

    const updatedOrder = await order.save()

    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req:Request, res: Response) => {
  const orders = await Order.find({ user: req.user._id })
  res.json(orders)
})

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req:Request, res: Response) => {
  const orders = await Order.find({}).populate('user', 'id name')
  res.json(orders)
})

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
}