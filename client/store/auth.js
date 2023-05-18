import React, { createContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import { publicFetch } from '../util/fetcher'

const AuthContext = createContext()
const { Provider } = AuthContext

const AuthProvider = ({ children }) => {
  const router = useRouter()
  const [authState, setAuthState] = useState()
  const [info, setInfoState] = useState()

  const [retrieveCode, setRetrieveCodeState] = useState(0)
  const [announce, setAnnounceState] = useState('')

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo')
    const ch = userInfo && JSON.parse(userInfo)
    var request = {
      params: {
        username: ch?.username || null
      }
    }
    const fetchUser = async () => {
      const { data } = await publicFetch.get(`/user/find`, request)
      if (!data.ban) {
        const token = localStorage.getItem('token')
        const expiresAt = localStorage.getItem('expiresAt')
        setAuthState({
          token,
          expiresAt,
          userInfo: userInfo ? JSON.parse(userInfo) : {}
        })
      } else {
        localStorage.removeItem('userInfo')
        localStorage.removeItem('token')
        localStorage.removeItem('expiresAt')
        setAuthState(null)
        setInfoState(null)
      }
    }
    fetchUser()
  }, [router])

  const setAuthInfo = ({ token, userInfo, expiresAt }) => {
    localStorage.setItem('token', token)
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
    localStorage.setItem('expiresAt', expiresAt)

    setAuthState({
      token,
      userInfo,
      expiresAt
    })
  }
  const setInfo = (userInfo) => {
    setInfoState({
      userInfo
    })
  }
  const setCode = (code) => {
    setRetrieveCodeState(code)
  }
  const setAnnounce = (announce) => {
    setAnnounceState(announce)
  }
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('expiresAt')
    setAuthState({})
    router.push('/')
  }

  const isAuthenticated = () => {
    if (!authState?.token || !authState?.expiresAt) {
      return false
    }
    return new Date().getTime() / 1000 < authState.expiresAt
  }

  const isAdmin = () => {
    return authState?.userInfo?.role === 'admin'
  }

  return (
    <Provider
      value={{
        authState,
        setAuthState: (authInfo) => setAuthInfo(authInfo),
        setInfoState: (info) => setInfo(info),
        info,
        setRetrieveCodeState: (code) => setCode(code),
        retrieveCode,
        setAnnounceState: (announc) => setAnnounce(announc),
        announce,
        logout,
        isAuthenticated,
        isAdmin
      }}
    >
      {children}
    </Provider>
  )
}

export { AuthContext, AuthProvider }
