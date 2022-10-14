import React, { useState, useEffect } from 'react'
import { Table, Form, Button, Row, Col } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { useAppDispatch, useAppSelector } from '../types/hooks'
import {updateUserProfile} from '../features/users/userSlice'
import {getMyOrders} from '../features/orders/orderSlice'

interface ProfileScreenProps {
  location: any,
  history: any
}
const ProfileScreen = ({ location, history }:ProfileScreenProps) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')

  const dispatch = useAppDispatch()


  const userInfo = useAppSelector((state) => state.users.userInfo)
  const updateStatus = useAppSelector((state) => state.users.profileUpdateStatus)

  const myOrders = useAppSelector((state) => state.orders.myOrders)
  const {status:ordersStatus, error:ordersError, orders} = myOrders

  useEffect(() => {
    dispatch(getMyOrders())
    if(!userInfo){
      history.push('/login')
    }else{
      setName(userInfo.name)
      setEmail(userInfo.email)
    }
  }, [dispatch, history, userInfo])

  const submitHandler = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password !== confirmPassword || password.length === 0) {
      setMessage('Passwords do not match or password was not provided')
    } else if(userInfo) {
      dispatch(updateUserProfile({ _id: userInfo._id, name, email, password, isAdmin:userInfo.isAdmin,token:userInfo.token }))
    }
  }

  return (
    <Row>
      <h2>Please provide your original password if you do not want to change your password</h2>
      <Col md={3}>
        <h2>User Profile</h2>
        {message && <Message variant='danger'>{message}</Message>}
        {updateStatus === "succeeded" && <Message variant='success'>Profile Updated</Message>}
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='name'
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='email'>
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='password'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Enter password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='confirmPassword'>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Confirm password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary'>
              Update
            </Button>
          </Form>
      </Col>
      <Col md={9}>
        <h2>My Orders</h2>
        {ordersStatus === "loading" ? (
          <Loader />
        ) : ordersStatus ==="failed" ? (
          <Message variant='danger'>{ordersError}</Message>
        ) : (
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders && orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.totalPrice}</td>
                  <td>
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <i className='fas fa-times' style={{ color: 'red' }}></i>
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <i className='fas fa-times' style={{ color: 'red' }}></i>
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button className='btn-sm' variant='light'>
                        Details
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  )
}

export default ProfileScreen