import { RouteComponentProps } from "react-router-dom";
interface Props extends RouteComponentProps {

}
interface OrderItems{
    name: string,
    qty: number,
    image: string,
    price: number,
    products: string
}

export interface IShippingAddress{
    address: string,
    city: string,
    postalCode: string,
    country: string
}
interface IPaymentResult{
    id: string,
    status: string,
    update_time: string,
    email_address: string
}
interface Review {
    _id: string,
    name: string,
    rating: number,
    comment: string,
    user: string,
    createdAt: string,
}

export interface IOrder{
    user: IUserInfo,
    orderItems: Array<OrderItems>,
    shippingAddress: IShippingAddress,
    paymentMethod: string,
    paymentResult: IPaymentResult,
    taxPrice: number,
    shippingPrice: number,
    totalPrice: number,
    isPaid: boolean,
    paidAt: Date,
    isDelivered: boolean,
    deliveredAt: Date
}


export interface IProduct{
    _id: string,
    name: string,
    image: string,
    brand: string,
    category: string,
    description: string,
    reviews?: Array<Review> ,
    rating?: number,
    numReviews?: number,
    price: number,
    countInStock: number,
}

export interface IProductDetails{

}

export interface IUserInfo {
    name: string,
    email:string,
    password: string,
    isAdmin: boolean,
    _id: string,
    token: string,
}

