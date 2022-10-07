import React, { useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Paginate from "../components/Paginate";
import {
  deleteProduct,
  getAllProducts,
  createProduct,
} from "../features/products/productSlice";
import { getUserInfo } from "../features/users/userSlice";
import {useAppDispatch, useAppSelector} from '../types/hooks'

interface ProductListScreenProps {
  history:any,
  match:any
}
const ProductListScreen = ({ history, match }:ProductListScreenProps) => {
  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useAppDispatch();

  const productList = useAppSelector((state) => state.products.productList)
  const {status, error, page, pages, products} = productList


  const [successDelete, setSuccessDelete] = useState(false);

  const productCreate = useAppSelector((state) => state.products.productCreate)
  const {status:createStatus, error:createError, product: createdProduct} = productCreate

  const productDelete = useAppSelector((state) => state.products.productDelete)
  const {status: deleteStatus, error: deleteError} = productDelete

  const userInfo = useSelector(getUserInfo);

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      history.push("/login");
    }
    if (createStatus === "succeeded" && createdProduct) {
      history.push(`/admin/product/${createdProduct._id}/edit`)
    } else {
      dispatch(getAllProducts({keyword : "", pageNumber}));
    }
    setSuccessDelete(false);
  }, [dispatch, history, userInfo, createStatus, pageNumber, successDelete]);

  const deleteHandler = (id:string) => {
    if (window.confirm("Are you sure")) {
      dispatch(deleteProduct(id));
      setSuccessDelete(true);
    }
  };

  const createProductHandler = () => {
    dispatch(createProduct());
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-right">
          <Button className="my-3" onClick={createProductHandler}>
            <i className="fas fa-plus"></i> Create Product
          </Button>
        </Col>
      </Row>
      {deleteStatus==="loading" && <Loader />}
      {deleteStatus ==="failed" && <Message variant='danger'>{deleteError}</Message>}
      {createStatus ==="loading" && <Loader />}
      {createStatus ==="failed" && <Message variant='danger'>{createError}</Message>}
      {status === "loading" ? (
        <Loader />
      ) : status == "error" ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant="light" className="btn-sm">
                        <i className="fas fa-edit"></i>
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(product._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate keyword = "" pages={pages} page={page} isAdmin={true} />
        </>
      )}
    </>
  );
};

export default ProductListScreen;
