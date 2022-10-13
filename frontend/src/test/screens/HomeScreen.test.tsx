import React from 'react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { fireEvent, screen } from '@testing-library/react'
// We're using our own custom render function and not RTL's render.
import { renderWithProviders } from '../../types/test-utils'
import HomeScreen from '../../screens/HomeScreen'
import product from '../../../../backend/data/products'
import store from '../../store'
import { getAllProducts } from '../../features/products/productSlice'
// We use msw to intercept the network request during the test,
// and return the response 'John Smith' after 150ms
// when receiving a get request to the `/api/user` endpoint

export const handlers = [
  rest.get('/api/', (req, res, ctx) => {
    return res(ctx.json(product), ctx.delay(150))
  })
]

const server = setupServer(...handlers)

// Enable API mocking before tests.
beforeAll(() => server.listen())

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers())

// Disable API mocking after the tests are done.
afterAll(() => server.close())

const matchProps = {
  params:{
    keyword: ""
  }
}

test('fetches & receives a user after clicking the fetch user button', async () => {
  renderWithProviders(<HomeScreen match = {matchProps}/>, {
    preloadedState:{
      products: product as any
    }
  })


  store.dispatch(getAllProducts({keyword:"", pageNumber:1}))
  // expect(screen.getByText("Latest Products")).toBeInTheDocument()
  expect(<HomeScreen match = {matchProps}/>).toMatchSnapshot()
})