import React from 'react'
import { assets } from '../../assets/assets'
import { Outlet } from 'react-router-dom'
import UserSidebar from '../../components/user/UserSidebar'
import { useAppContext } from '../../context/AppContext'

const Layout = () => {
    const { axios, setToken, navigate } = useAppContext()

    const logout = ()=>{
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      axios.defaults.headers.common['Authorization'] = null;
      setToken(null)
      navigate('/')
    }

  return (
    <>
      <div className='flex items-center justify-between py-4 h-[100px] px-4 sm:px-12 border-b boeder-gray-200' >
        <img src={assets.logo} alt="" className='w-32 sm:w-30 cursor-pointer' onClick={()=> navigate('/')}/>
        <button onClick={logout} className='text-sm px-12 py-2 bg-primary text-white rounded-full cursor-pointer'>Logout</button>
      </div>
      <div className='flex h-[calc(100vh-70px'>
        <UserSidebar />
        <Outlet />
      </div>
    </>
  )
}

export default Layout 