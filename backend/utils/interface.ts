import {Document} from 'mongoose'
import {Types} from 'mongoose'
import {Request} from 'express'

declare global {
    namespace Express {
      interface Request {
        user: IUser
      }
    }
  }

interface orderItems{
    name: string,
    qty: number,
    image: string,
    price: number,
    products: Types.ObjectId
}
interface shippingAddress{
    address: string,
    city: string,
    postalCode: string,
    country: string
}
interface paymentResult{
    id: string,
    status: string,
    update_time: string,
    email_address: string
}
interface review {
    name: string,
    rating: number,
    comment: string,
    user: Types.ObjectId
}

export interface IOrder extends Document{
    user: IUser,
    orderItems: Array<orderItems>,
    shippingAddress: shippingAddress,
    paymentMethod: string,
    paymentResult: paymentResult,
    taxPrice: number,
    shippingPrice: number,
    totalPrice: number,
    isPaid: boolean,
    paidAt: Date,
    isDelivered: boolean,
    deliveredAt: Date
}

export interface IProduct extends Document{
    user: Types.ObjectId,
    name: string,
    image: string,
    brand: string,
    category: string,
    description: string,
    reviews: Array<review> ,
    rating: number,
    numReviews: number,
    price: number,
    countInStock: number
}

export interface IUser extends Document {
    name: string,
    email:string,
    password: string,
    isAdmin: boolean
}
