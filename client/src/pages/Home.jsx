import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import BlogList from '../components/BlogList'
import Newsletter from '../components/Newsletter'
import Footer from '../components/Footer'
import { useAppContext } from '../context/AppContext'

const Home = () => {
  const { axios } = useAppContext()
  const [advert, setAdvert] = useState(null)

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
      <BlogList/>
      <Newsletter/>
      <Footer/>
    </>
  )
}

export default Home
