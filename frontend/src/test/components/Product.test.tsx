import {shallow} from "enzyme"
import React from 'react'
import Product from "../../components/Product"
import products from '../../../../backend/data/products'

const product = products[0]
it("renders a Product Component", () => {
    const component = shallow(<Product id = {"1234"} name = {product.name} image = {product.image} rating={product.rating} numReviews = {product.numReviews} price = {product.price}/>)
    expect(component).toMatchSnapshot()
})
