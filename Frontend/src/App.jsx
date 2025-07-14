import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Start from './pages/Start'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'
import CaptainLogin from './pages/CaptainLogin'
import CaptainSignup from './pages/CaptainSignup'
import Home from './pages/Home'
import UserProtectedWrapper from './pages/UserProtectedWrapper'
import UserLogout from './pages/UserLogout'
import CaptainHome from './pages/CaptainHome'
import CaptainProtectedWrapper from './pages/CaptainProtectedWrapper'
import CaptainLogout from './pages/CaptainLogout'
import Riding from './pages/Riding'
import CaptainRiding from './pages/CaptainRiding'
import UserContext from './context/userContext'
import CaptainContext from './context/CaptainContext'

const App = () => {
  return (
    <UserContext>
      <CaptainContext>
        <Routes>
          <Route path='/' element={<Start />} />
          <Route path='/login' element={<UserLogin />} />
          <Route path='/signup' element={<UserSignup />} />
          <Route path='/captain-login' element={<CaptainLogin />} />
          <Route path='/captain-signup' element={<CaptainSignup />} />
          <Route path='/home' element={
            <UserProtectedWrapper>
              <Home />
            </UserProtectedWrapper>
          } />
          <Route path='/user/logout' element={
            <UserProtectedWrapper>
              <UserLogout />
            </UserProtectedWrapper>
          } />
          <Route path='/captain-home' element={
            <CaptainProtectedWrapper>
              <CaptainHome />
            </CaptainProtectedWrapper>
          } />
          <Route path='/captain/logout' element={
            <CaptainProtectedWrapper>
              <CaptainLogout />
            </CaptainProtectedWrapper>
          } />
          <Route path='/riding' element={
            <UserProtectedWrapper>
              <Riding />
            </UserProtectedWrapper>
          } />
          <Route path='/captain-riding' element={
            <CaptainProtectedWrapper>
              <CaptainRiding />
            </CaptainProtectedWrapper>
          } />
        </Routes>
      </CaptainContext>
    </UserContext>
  )
}

export default App
