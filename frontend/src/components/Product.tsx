import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'
import Rating from './Rating'
import {IProduct} from '../types/utils'

interface ProductProps {
  id: string,
  image: string,
  name: string,
  rating: number,
  numReviews: number,
  price: number
}
const Product = ({id, image, name, rating, numReviews,price}:ProductProps) => {

  return (
    <>
      <Card className='my-3 p-3 rounded'>
      <Link to={`/product/${id}`}>
        <Card.Img src={image} variant='top' />
      </Link>

      <Card.Body>
        <Link to={`/product/${id}`}>
          <Card.Title as='div'>
            <strong>{name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as='div'>
          <Rating
            value={rating || 0}
            text={`${numReviews} reviews`}
          />
        </Card.Text>

        <Card.Text as='h3'>${price}</Card.Text>
      </Card.Body>
    </Card>
    </>
  )
}

export default Product
