import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import Start from './pages/Start'
import UserLogin from './pages/UserLogin'
import Home from './pages/Home'
import UserSignup from './pages/UserSignup'
import CaptainLogin from './pages/CaptainLogin'
import CaptainSignup from './pages/CaptainSignup'
import  { UserDataContext } from './context/userContext'
import UserProtectedWrapper from './pages/UserProtectedWrapper'
import UserLogout from './pages/UserLogout'
import CaptainHome from './pages/CaptainHome'
import CaptainProtectedWrapper from './pages/CaptainProtectedWrapper'
import CaptainLogout from './pages/CaptainLogout'
import Riding from './pages/Riding'
import CaptainRiding from './pages/CaptainRiding'

const App = () => {
  const ans = useContext(UserDataContext)
  
  return (
    <div>
     <Routes>
      <Route path='/' element = {<Start/>}/>
      <Route path='/login' element = {<UserLogin/>}/>
      <Route path='/riding' element = {<Riding/>}/>

      <Route path='/signup' element = {<UserSignup/>}/>
      <Route path='/captain-login' element = {<CaptainLogin/>}/>
      <Route path='/captain-signup' element = {<CaptainSignup/>}/>
      <Route path='/captain-riding' element = {<CaptainRiding/>}/>

      <Route path='/home' element = {

        <UserProtectedWrapper>
          <Home/>
        </UserProtectedWrapper>
      }/>

      <Route path='/user/logout' 
      element = {
          <UserProtectedWrapper>
            <UserLogout/>
          </UserProtectedWrapper>
      
      }/>

        <Route path='/captains/logout' 
      element = {
        <CaptainProtectedWrapper>
          <CaptainLogout/>
        </CaptainProtectedWrapper>
      }/>

      <Route path='/captain-home' element = {
        <CaptainProtectedWrapper>
          <CaptainHome/>
        </CaptainProtectedWrapper>
      }/>
     </Routes>


    </div>
  )
}

export default App
