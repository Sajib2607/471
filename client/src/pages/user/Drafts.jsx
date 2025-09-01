import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const Drafts = () => {
  const [drafts, setDrafts] = useState([])
  const [loading, setLoading] = useState(true)
  const { axios, navigate } = useAppContext()

  const fetchDrafts = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/user/drafts')
      if (data.success) {
        setDrafts(data.drafts)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEditDraft = (draft) => {
    // Navigate to AddBlog with draft data
    navigate('/user/addBlog', { state: { draft } })
  }

  const handleDeleteDraft = async (id) => {
    if (window.confirm('Are you sure you want to delete this draft?')) {
      try {
        const { data } = await axios.post('/api/blog/delete', { id })
        if (data.success) {
          toast.success('Draft deleted successfully')
          fetchDrafts()
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }
  }

  const handleSubmitForReview = async (id) => {
    try {
      const { data } = await axios.post('/api/user/submit-review', { blogId: id })
      if (data.success) {
        toast.success('Blog submitted for review successfully')
        fetchDrafts()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchDrafts()
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
        <img src={assets.dashboard_icon_3} alt="" />
        <p className='text-xl font-semibold'>My Drafts ({drafts.length})</p>
      </div>

      {drafts.length === 0 ? (
        <div className='bg-white rounded-lg shadow p-8 text-center'>
          <p className='text-gray-500 text-lg'>No drafts found</p>
          <p className='text-gray-400 mt-2'>Start creating a new blog to save drafts</p>
        </div>
      ) : (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {drafts.map((draft) => (
            <div key={draft._id} className='bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow'>
              <div className='h-48 overflow-hidden'>
                <img 
                  src={draft.image} 
                  alt={draft.title} 
                  className='w-full h-full object-cover'
                />
              </div>
              <div className='p-4'>
                <h3 className='font-semibold text-gray-800 mb-2 line-clamp-2'>{draft.title}</h3>
                {draft.subTitle && (
                  <p className='text-gray-600 text-sm mb-3 line-clamp-2'>{draft.subTitle}</p>
                )}
                <div className='flex items-center justify-between text-xs text-gray-500 mb-3'>
                  <span className='bg-gray-100 px-2 py-1 rounded'>{draft.category}</span>
                  <span>{new Date(draft.createdAt).toLocaleDateString()}</span>
                </div>
                <div className='flex items-center gap-2 text-xs text-gray-500 mb-3'>
                  <span className='bg-blue-100 px-2 py-1 rounded'>Tone: {draft.aiTone || 'informative'}</span>
                  <span className='bg-green-100 px-2 py-1 rounded'>Style: {draft.writingStyle || 'article'}</span>
                </div>
                <div className='mb-3'>
                  <span className={`px-2 py-1 rounded text-xs ${
                    draft.reviewStatus === 'pending' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : draft.reviewStatus === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : draft.reviewStatus === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {draft.reviewStatus || 'draft'}
                  </span>
                </div>
                <div className='flex gap-2'>
                  <button
                    onClick={() => handleEditDraft(draft)}
                    className='flex-1 bg-primary text-white py-2 px-3 rounded text-sm hover:bg-primary/90 transition-colors'
                  >
                    Edit Draft
                  </button>
                  {draft.reviewStatus !== 'pending' && draft.reviewStatus !== 'approved' && (
                    <button
                      onClick={() => handleSubmitForReview(draft._id)}
                      className='flex-1 bg-green-500 text-white py-2 px-3 rounded text-sm hover:bg-green-600 transition-colors'
                    >
                      Submit for Review
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteDraft(draft._id)}
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

export default Drafts 