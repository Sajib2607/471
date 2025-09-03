import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import BlogList from '../components/BlogList'
import Newsletter from '../components/Newsletter'
import Footer from '../components/Footer'
import { useAppContext } from '../context/AppContext'

const Home = () => {
  const { axios } = useAppContext()
  const [advert, setAdvert] = useState(null)
  const [totalBlogs, setTotalBlogs] = useState(0)

  useEffect(() => {
    const fetchAdvert = async () => {
      try {
        const { data } = await axios.get('/api/user/advert/latest')
        if (data.success) setAdvert(data.advert)
      } catch (e) {
        // ignore
      }
    }
    fetchAdvert()
  }, [])
  return (
    <>
      <Header/>
      {advert && (
        <div className='max-w-5xl mx-auto px-4'>
          <a href='#' className='block group'>
            <div className='relative overflow-hidden rounded-lg shadow mb-6'>
              <img src={advert.image} alt={advert.heading} className='w-full h-48 md:h-64 object-cover group-hover:scale-[1.02] transition-transform' />
              <div className='absolute inset-0 bg-black/20 flex items-end'>
                <div className='p-4 md:p-6'>
                  <h3 className='text-white text-lg md:text-2xl font-semibold drop-shadow'>{advert.heading}</h3>
                </div>
              </div>
            </div>
          </a>
        </div>
      )}
      
      {/* Blog Count Section */}
      <div className='max-w-5xl mx-auto px-4 mb-8'>
        <div className='bg-white rounded-lg shadow p-6 text-center'>
          <h1 className='text-3xl md:text-4xl font-semibold text-gray-800 mb-4'>Welcome to Our Blog</h1>
          <p className='text-lg text-gray-600 mb-6'>Discover amazing stories and insights</p>
          <div className='bg-gray-100 rounded-lg p-4 inline-block'>
            <div className='text-4xl md:text-5xl font-bold text-gray-800 mb-2'>{totalBlogs}</div>
            <div className='text-lg text-gray-600'>Total Articles</div>
          </div>
        </div>
      </div>
      
      <BlogList/>
      <Newsletter/>
      <Footer/>
    </>
  )
}

export default Home
