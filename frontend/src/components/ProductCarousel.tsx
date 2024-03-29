import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Carousel, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";
import Message from "./Message";
import { useAppDispatch, useAppSelector } from "../types/hooks";
import { getTopProducts } from "../features/products/productSlice";

const ProductCarousel = () => {
  const dispatch = useAppDispatch();

  const {status, error, products} = useAppSelector((state) => state.products.topProducts)

  useEffect(() => {
    dispatch(getTopProducts());
  }, [dispatch]);

  return status === "loading" ? (
    <Loader />
  ) : status === "failed" ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <Carousel pause="hover" className="bg-dark">
      {products.map((product) => (
        <Carousel.Item key={product._id}>
          <Link to={`/product/${product._id}`}>
            <Image src={product.image} alt={product.name} fluid />
            <Carousel.Caption className="carousel-caption">
              <h2>
                {product.name} (${product.price})
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;