import React, { useEffect, useState } from 'react'
import { assets, dashboard_data } from '../../assets/assets'
import BlogTableItem from '../../components/admin/BlogTableItem'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast';

const Dashboard = () => {
   const [dashboardData, setDashboardData] = useState({
    blogs: 0,
    comments: 0,
    drafts: 0,
    totalUsers: 0,
    recentBlogs: []
   })

   const {axios, navigate} = useAppContext()

   const fetchDashboard = async ()=>{
    try {
      const {data} = await axios.get('/api/admin/dashboard')
      data.success ? setDashboardData(data.data) : toast.error(data.message)

      
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
        
        <div className='flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all'>
          <img src={assets.dashboard_icon_1} alt="" />
          <div>
            <p className='text-xl font-semibold ext-gray-600'>{dashboardData.blogs}</p>
            <p className='text-gray-400 font-light'>Blogs</p>
          </div>
        </div>

        <div className='flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all'>
          <img src={assets.dashboard_icon_2} alt="" />
          <div>
            <p className='text-xl font-semibold ext-gray-600'>{dashboardData.comments}</p>
            <p className='text-gray-400 font-light'>Comments</p>
          </div>
        </div>
      

        <div 
          onClick={() => navigate('/admin/drafts')}
          className='flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all'
        >
          <img src={assets.dashboard_icon_3} alt="" />
          <div>
            <p className='text-xl font-semibold ext-gray-600'>{dashboardData.drafts}</p>
            <p className='text-gray-400 font-light'>Drafts</p>
          </div>
        </div>

        

        <div className='flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all'>
          <img src={assets.user_icon} alt="" />
          <div>
            <p className='text-xl font-semibold ext-gray-600'>{dashboardData.totalUsers}</p>
            <p className='text-gray-400 font-light'>Total Users</p>
          </div>
        </div>
      </div>

      {/* Stats Graphs - Pie Chart */}
      <div className='bg-white mt-6 p-4 rounded shadow max-w-4xl'>
        <p className='text-gray-700 font-semibold mb-4'>Project Statistics</p>
        {(() => {
          const stats = [
            { key: 'Blogs', value: Number(dashboardData.blogs) || 0, color: '#6366F1' },
            { key: 'Comments', value: Number(dashboardData.comments) || 0, color: '#10B981' },
            { key: 'Drafts', value: Number(dashboardData.drafts) || 0, color: '#F59E0B' },
            { key: 'Users', value: Number(dashboardData.totalUsers) || 0, color: '#F43F5E' }
          ]
          const total = stats.reduce((acc, s) => acc + s.value, 0)

          // Build cumulative offsets for pie segments using stroke-dasharray on circles
          let cumulativePercent = 0

          const segments = (total === 0 ? stats.map(s => ({ ...s, percent: 25 })) : stats.map(s => {
            const percent = (s.value / total) * 100
            return { ...s, percent }
          }))

          return (
            <div className='w-full flex flex-col md:flex-row md:items-center gap-6'>
              <div className='flex items-center justify-center'>
                <svg viewBox='0 0 42 42' width='220' height='220' className='drop-shadow-sm'>
                  <circle cx='21' cy='21' r='15.915' fill='#ffffff' />
                  {segments.map((s, idx) => {
                    const circle = (
                      <circle
                        key={s.key}
                        cx='21'
                        cy='21'
                        r='15.915'
                        fill='transparent'
                        stroke={s.color}
                        strokeWidth='6'
                        strokeDasharray={`${s.percent} ${100 - s.percent}`}
                        strokeDashoffset={100 - cumulativePercent}
                      />
                    )
                    cumulativePercent += s.percent
                    return circle
                  })}
                  <circle cx='21' cy='21' r='12' fill='white' />
                  <text x='21' y='21' textAnchor='middle' dominantBaseline='central' fontSize='4' fill='#374151'>
                    {total}
                  </text>
                </svg>
              </div>

              <div className='flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3'>
                {stats.map((s) => (
                  <div key={s.key} className='flex items-center gap-2'>
                    <span className='inline-block w-3 h-3 rounded' style={{ backgroundColor: s.color }} />
                    <div className='text-xs text-gray-600'>
                      <div className='font-medium'>{s.key}</div>
                      <div className='text-[11px] text-gray-400'>{s.value}{total > 0 ? ` • ${Math.round((s.value / total) * 100)}%` : ''}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })()}
      </div>

      <div>
          <div className='flex items-center gap-3 m-4 mt-6 text-gray-600'>
            <img src={assets.dashboard_icon_4} alt="" />
            <p>Latest Blogs</p>
          </div>

          <div className='relative max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-white'>
            <table className='w-full text-sm text-gray-500'>
              <thead className='text-xs text-gray-600 text-left uppercase'>
                <tr>
                  <th scope='col' className='px-2 py-4 xl:px-6'> # </th>
                  <th scope='col' className='px-2 py-4'> Blog Title </th>
                  <th scope='col' className='px-2 py-4 max-sm:hidden'> Author </th>
                  <th scope='col' className='px-2 py-4 max-sm:hidden'> Date </th>
                  <th scope='col' className='px-2 py-4 max-sm:hidden'> Status </th>
                  <th scope='col' className='px-2 py-4'> Actions</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentBlogs.map((blog, index)=>{
                  return <BlogTableItem key={blog._id} blog={blog} fetchBlogs={fetchDashboard} index={index +1}/>
                })}
              </tbody>
            </table>

          </div>
      </div>

    </div>
  )
}

export default Dashboard