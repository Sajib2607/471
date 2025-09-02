import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalDrafts: 0,
    approvedBlogs: 0,
    recentDrafts: []
  })

  const { axios, navigate } = useAppContext()

  const fetchDashboard = async () => {
    try {
      const [draftsRes, approvedRes] = await Promise.all([
        axios.get('/api/user/drafts'),
        axios.get('/api/user/approved')
      ])

      if (!draftsRes.data.success) return toast.error(draftsRes.data.message)
      if (!approvedRes.data.success) return toast.error(approvedRes.data.message)

      const drafts = draftsRes.data.drafts
      const approvedCount = approvedRes.data.blogs?.length || 0

      setDashboardData({
        totalDrafts: drafts.length,
        approvedBlogs: approvedCount,
        recentDrafts: drafts.slice(0, 5)
      })
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  return (
    <div className='flex-1 p-4 md:p-10 bg-blue-50/50'>
      <div className='flex flex-wrap gap-4'>
        <div className='flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow'>
          <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center'>
            <img src={assets.dashboard_icon_3} alt="" className='w-5 h-5' />
          </div>
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashboardData.totalDrafts}</p>
            <p className='text-gray-400 font-light'>Total Drafts</p>
          </div>
        </div>

        

        <div onClick={() => navigate('/user/approved')} className='flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:shadow-md transition-shadow'>
          <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center'>
            <img src={assets.dashboard_icon_1} alt="" className='w-5 h-5' />
          </div>
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashboardData.approvedBlogs}</p>
            <p className='text-gray-400 font-light'>Approved Blogs</p>
          </div>
        </div>
      </div>

      <div>
        <div className='flex items-center gap-3 m-4 mt-6 text-gray-600'>
          <img src={assets.dashboard_icon_4} alt="" />
          <p>Recent Drafts</p>
        </div>

        <div className='relative max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-white'>
          <table className='w-full text-sm text-gray-500'>
            <thead className='text-xs text-gray-600 text-left uppercase'>
              <tr>
                <th scope='col' className='px-2 py-4 xl:px-6'> # </th>
                <th scope='col' className='px-2 py-4'> Blog Title </th>
                <th scope='col' className='px-2 py-4 max-sm:hidden'> Date </th>
                
                <th scope='col' className='px-2 py-4'> Actions</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.recentDrafts.map((draft, index) => (
                <tr key={draft._id} className='border-b border-gray-200'>
                  <td className='px-2 py-4 xl:px-6'>{index + 1}</td>
                  <td className='px-2 py-4'>{draft.title}</td>
                  <td className='px-2 py-4 max-sm:hidden'>
                    {new Date(draft.createdAt).toLocaleDateString()}
                  </td>
                  
                  <td className='px-2 py-4'>
                    <button className='text-primary hover:underline text-xs'>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 