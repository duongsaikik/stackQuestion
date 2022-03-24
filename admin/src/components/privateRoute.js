import React, { useContext } from 'react'
import { AuthContext } from '../context/auth'
import { Redirect, Route } from 'react-router-dom'

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = () => {
    if (!localStorage.token || !localStorage.expiresAt) {
      return false
    }
    return new Date().getTime() / 1000 < localStorage.expiresAt
  }
  // Add your own authentication on the below line.
  // const { isAuthenticated } = useContext(AuthContext)
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated() ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )
      }
    />
  )
}

export default PrivateRoute