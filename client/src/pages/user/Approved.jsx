import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const Approved = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const { axios, navigate } = useAppContext()

  const fetchApproved = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/user/approved')
      if (data.success) {
        setBlogs(data.blogs)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApproved()
  }, [])

  if (loading) {
    return (
      <div className='flex-1 p-4 md:p-10 bg-blue-50/50 flex items-center justify-center'>
        <div className='w-8 h-8 rounded-full border-2 border-t-primary animate-spin'></div>
      </div>
    )
  }

  return (
    <div className='flex-1 p-4 md:p-10 bg-blue-50/50'>
      <div className='flex items-center gap-3 mb-6 text-gray-600'>
        <img src={assets.dashboard_icon_1} alt="" />
        <p className='text-xl font-semibold'>My Approved Blogs ({blogs.length})</p>
      </div>

      {blogs.length === 0 ? (
        <div className='bg-white rounded-lg shadow p-8 text-center'>
          <p className='text-gray-500 text-lg'>No approved blogs yet</p>
          <p className='text-gray-400 mt-2'>Once approved by admin, your blogs will appear here</p>
        </div>
      ) : (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {blogs.map((blog) => (
            <div key={blog._id} className='bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow'>
              <div className='h-48 overflow-hidden'>
                <img 
                  src={blog.image} 
                  alt={blog.title} 
                  className='w-full h-full object-cover'
                />
              </div>
              <div className='p-4'>
                <h3 className='font-semibold text-gray-800 mb-2 line-clamp-2'>{blog.title}</h3>
                {blog.subTitle && (
                  <p className='text-gray-600 text-sm mb-3 line-clamp-2'>{blog.subTitle}</p>
                )}
                <div className='flex items-center justify-between text-xs text-gray-500 mb-3'>
                  <span className='bg-gray-100 px-2 py-1 rounded'>{blog.category}</span>
                  <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
                <div className='flex items-center gap-2 text-xs text-gray-500 mb-3'>
                  <span className='bg-blue-100 px-2 py-1 rounded'>Tone: {blog.aiTone || 'informative'}</span>
                  <span className='bg-green-100 px-2 py-1 rounded'>Style: {blog.writingStyle || 'article'}</span>
                </div>
                <div className='flex gap-2'>
                  <button
                    onClick={() => navigate(`/blog/${blog._id}`)}
                    className='flex-1 bg-primary text-white py-2 px-3 rounded text-sm hover:bg-primary/90 transition-colors'
                  >
                    View Live
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Approved


