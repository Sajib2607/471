import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const PendingReviews = () => {
  const [pendingBlogs, setPendingBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const { axios } = useAppContext()

  const fetchPendingReviews = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/admin/pending-reviews')
      if (data.success) {
        setPendingBlogs(data.pendingBlogs)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id) => {
    try {
      const { data } = await axios.post('/api/admin/approve-blog', { id })
      if (data.success) {
        toast.success('Blog approved and published successfully')
        fetchPendingReviews()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleReject = async (id) => {
    if (window.confirm('Are you sure you want to reject this blog?')) {
      try {
        const { data } = await axios.post('/api/admin/reject-blog', { id })
        if (data.success) {
          toast.success('Blog rejected successfully')
          fetchPendingReviews()
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        const { data } = await axios.post('/api/blog/delete', { id })
        if (data.success) {
          toast.success('Blog deleted successfully')
          fetchPendingReviews()
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }
  }

  useEffect(() => {
    fetchPendingReviews()
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
        <img src={assets.dashboard_icon_4} alt="" />
        <p className='text-xl font-semibold'>Pending Reviews ({pendingBlogs.length})</p>
      </div>

      {pendingBlogs.length === 0 ? (
        <div className='bg-white rounded-lg shadow p-8 text-center'>
          <p className='text-gray-500 text-lg'>No pending reviews</p>
          <p className='text-gray-400 mt-2'>All submitted blogs have been reviewed</p>
        </div>
      ) : (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {pendingBlogs.map((blog) => (
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
                <div className='mb-3'>
                  <p className='text-xs text-gray-600 mb-1'>Author: {blog.author?.name || 'Unknown'}</p>
                  <p className='text-xs text-gray-600'>Email: {blog.author?.email || 'Unknown'}</p>
                </div>
                <div className='flex items-center gap-2 text-xs text-gray-500 mb-3'>
                  <span className='bg-blue-100 px-2 py-1 rounded'>Tone: {blog.aiTone || 'informative'}</span>
                  <span className='bg-green-100 px-2 py-1 rounded'>Style: {blog.writingStyle || 'article'}</span>
                </div>
                <div className='flex gap-2'>
                  <button
                    onClick={() => handleApprove(blog._id)}
                    className='flex-1 bg-green-500 text-white py-2 px-3 rounded text-sm hover:bg-green-600 transition-colors'
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(blog._id)}
                    className='flex-1 bg-yellow-500 text-white py-2 px-3 rounded text-sm hover:bg-yellow-600 transition-colors'
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className='bg-red-500 text-white py-2 px-3 rounded text-sm hover:bg-red-600 transition-colors'
                  >
                    Delete
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

export default PendingReviews 