import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";
import Meta from "../components/Meta";
import {
  getAllProducts,
} from "../features/products/productSlice";
import { useAppDispatch, useAppSelector } from "../types/hooks";

interface HomeScreenProps {
  match:any
}
const HomeScreen = ({ match }:HomeScreenProps) => {
  const keyword = match.params.keyword || "";

  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useAppDispatch();

  const productList = useAppSelector((state) => state.products.productList)
  const {status, error, page, pages, products} = productList

  useEffect(() => {
    dispatch(getAllProducts({ keyword, pageNumber }));
  }, [dispatch, keyword, pageNumber]);
  return (
    <>
      <Meta />
      {!keyword.length ? (
        <ProductCarousel />
      ) : (
        <Link to="/" className="btn btn-light">
          Go Back
        </Link>
      )}
      <h1>Latest Products</h1>
      {status == "loading" ? (
        <Loader />
      ) : status == "error" ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product id = {product._id} image ={product.image} name = {product.name} rating = {product.rating} numReviews = {product.numReviews} price = {product.price} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ""}
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;