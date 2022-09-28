import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";
import Meta from "../components/Meta";
import {
  getProductsStatus,
  getProductsError,
  getAllProducts,
} from "../features/products/productSlice";
import { RootState } from "../store";


type HomeScreenProps = {
  match:any
}
const HomeScreen = ({ match }:HomeScreenProps) => {
  const keyword = match.params.keyword || "";

  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch();

  const products = useSelector((state:RootState) => state.products.productList);
  const status = useSelector(getProductsStatus);
  const error = useSelector(getProductsError);
  const page = useSelector((state:RootState) => state.products.page);
  const pages = useSelector((state:RootState) => state.products.pages);

  const searchInfo = {
    keyword,
    pageNumber,
  };
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
                <Product product={product} />
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
