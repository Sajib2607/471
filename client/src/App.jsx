import React from 'react'
import { Route, Routes, useActionData } from 'react-router-dom'
import Home from './pages/Home'
import Blog from './pages/Blog'
import Layout from './pages/admin/Layout'
import Dashboard from './pages/admin/Dashboard'
import AddBlog from './pages/admin/AddBlog'
import ListBlog from './pages/admin/ListBlog'
import Drafts from './pages/admin/Drafts'
import PendingReviews from './pages/admin/PendingReviews'
import Comments from './pages/admin/Comments'
import Login from './components/admin/Login'
import UserLayout from './pages/user/Layout'
import UserDashboard from './pages/user/Dashboard'
import UserAddBlog from './pages/user/AddBlog'
import UserDrafts from './pages/user/Drafts'
import UserProfile from './pages/user/Profile'
import UserApproved from './pages/user/Approved'
import 'quill/dist/quill.snow.css'
import {Toaster} from 'react-hot-toast'
import { useAppContext } from './context/AppContext'


const App = () => {

  const {token} = useAppContext()


  return (
    <div>
      <Toaster/>
      <Routes>
        <Route path='/' element={<Home/>} /> 
        <Route path='/blog/:id' element={<Blog/>} /> 
        
        {/* Admin Routes */}
        <Route path='/admin' element={token ? <Layout/> :<Login/>}>
          <Route index element={<Dashboard/>}/>
          <Route path='addBlog' element={<AddBlog/>}/>
          <Route path='listBlog' element={<ListBlog/>}/>
          <Route path='drafts' element={<Drafts/>}/>
          <Route path='pending-reviews' element={<PendingReviews/>}/>
          <Route path='comments' element={<Comments/>}/>
        </Route>

        {/* User Routes */}
        <Route path='/user' element={token ? <UserLayout/> :<Login/>}>
          <Route index element={<UserDashboard/>}/>
          <Route path='addBlog' element={<UserAddBlog/>}/>
          <Route path='drafts' element={<UserDrafts/>}/>
          <Route path='approved' element={<UserApproved/>}/>
          <Route path='profile' element={<UserProfile/>}/>
        </Route>
      </Routes>
    </div>
  )
}

export default App

