import React, { useEffect, useState } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { useAppDispatch, useAppSelector } from '../types/hooks'
import { getUserInfo, getUsersError, getUsersStatus, listUsers, deleteUser } from '../features/users/userSlice'
import { RootState } from '../store'


interface UserListScreenProps{
  history:any
}
const UserListScreen = ({ history }:UserListScreenProps) => {
  const dispatch = useAppDispatch()

  const users = useAppSelector((state) => state.users.userList)
  const status = useAppSelector((state) => state.users.userListStatus)
  const error = useAppSelector(getUsersError)

  const userInfo = useAppSelector(getUserInfo)

  const [successDelete, setSuccessDelete] = useState(false)

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listUsers())
      setSuccessDelete(false)
    } else {
      history.push('/login')
    }
  }, [dispatch, history, userInfo, successDelete])

  const deleteHandler = (id:string) => {
    if (window.confirm('Are you sure')) {
      dispatch(deleteUser(id))
      setSuccessDelete(true)
    }
  }

  return (
    <>
      <h1>Users</h1>
      {status === "loading" ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users && users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {user.isAdmin ? (
                    <i className='fas fa-check' style={{ color: 'green' }}></i>
                  ) : (
                    <i className='fas fa-times' style={{ color: 'red' }}></i>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/admin/user/${user._id}/edit`}>
                    <Button variant='light' className='btn-sm'>
                      <i className='fas fa-edit'></i>
                    </Button>
                  </LinkContainer>
                  <Button
                    variant='danger'
                    className='btn-sm'
                    onClick={() => deleteHandler(user._id)}
                  >
                    <i className='fas fa-trash'></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default UserListScreen
