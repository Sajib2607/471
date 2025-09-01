import React, { useRef, useState } from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import LoginModal from './LoginModal'

const Header = () => {
    const {setInput, input, token, setToken, navigate} = useAppContext()
    const inputRef = useRef()
    const [showLoginModal, setShowLoginModal] = useState(false)

    const onSubmitHandler = async (e)=> {
        e.preventDefault();
        setInput(inputRef.current.value)
    }

    const onClear = () => {
        setInput("")
        inputRef.current.value = ""
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('userType')
        setToken(null)
        navigate('/')
    }

    const handleLogin = () => {
        setShowLoginModal(true)
    }

    const handleDashboard = () => {
        const userType = localStorage.getItem('userType')
        if (userType === 'admin') {
            navigate('/admin')
        } else {
            navigate('/user')
        }
    }

  return (
    <div className='mx-8 sm:mx-16 xl:mx-24 relative'>
        {/* Navigation Bar */}
        <div className='flex justify-between items-center py-4'>
            <img src={assets.logo} alt="" className='w-32 sm:w-30 cursor-pointer' onClick={() => navigate('/')}/>
            <div className='flex items-center gap-4'>
                {token ? (
                    <>
                        <button 
                            onClick={handleDashboard}
                            className='text-sm px-4 py-2 bg-primary text-white rounded-full cursor-pointer hover:bg-primary/90'
                        >
                            Dashboard
                        </button>
                        <button 
                            onClick={handleLogout}
                            className='text-sm px-4 py-2 border border-gray-300 text-gray-700 rounded-full cursor-pointer hover:bg-gray-50'
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <button 
                        onClick={handleLogin}
                        className='text-sm px-6 py-2 bg-primary text-white rounded-full cursor-pointer hover:bg-primary/90'
                    >
                        Login
                    </button>
                )}
            </div>
        </div>

        <div className='text-center mt-20 mb-8'> 

            <div className='inline-flex items-center justify-center
            gap-4 px-6 py-1.5 mb-4 border border-primary/40 bg-primary/10
            rounded-full text-sm text-primary'>
                <p>New: AI feature intergrated</p>
                <img src={assets.star_icon} className='w-2.5' alt=""/>
            </div>
            <h1 className='text-3xl sm:text-6xl font-semibold 
            sm:leading-16 text-gray-700'>Your own <span className='text-primary'>blogging</span>  <br /> platform.</h1>

            <p className='my-6 sm:my-8 max-w-2xl m-auto max-sm:text-xs text-gray-500'>This is your space to think out loud, to share what matters,
                and to write without filters. Whether it's one word or a thousand, 
                your story starts right here.
            </p>
            <form onSubmit={onSubmitHandler} className='flex justify-between max-w-lg max-sm:scale-75 mx-auto
            border border-gray-300 bg-white rounded overflow-hidden'>
                <input ref={inputRef} type="text" placeholder='Search for blogs' required 
                className='w-full pl-4 outline-none'/>
                <button type="submit" className='bg-primary text-white px-8 py-2 m-1.5
                rounded hover:scale-105 transition-all cursor-pointer'>Search</button>

            </form>


        </div>

        <div className='text-center'>
            {
            input && <button onClick={onClear} className='border font-light text-xs py-1 px-3 rounded-sm
            shadow-custom-sm cursor-pointer'>Clear Search</button>
            }           
        </div>

        <img src={assets.gradientBackground} alt="" className='absolute -top-50 -z-1 opacity-50'/>
        
        {/* Login Modal */}
        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
            
    </div>
  )
}

export default Header
