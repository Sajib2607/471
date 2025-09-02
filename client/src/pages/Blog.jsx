import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { assets, blog_data, comments_data } from '../assets/assets'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Moment from 'moment'

import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Blog = () => {
  const { id } = useParams()
  const {axios} = useAppContext()

  const [data, setData] = useState(null)
  const [comments, setComments] = useState([])
  const [name, setName] = useState('')
  const [content, setContent] = useState('')

  const fetchBlogData = async () => {
    try {
      const {data} = await axios.get(`/api/blog/${id}`)
      data.success ? setData(data.blog) : toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const fetchComments = async () => {
    try {
      const {data} = await axios.post(`/api/blog/comments`, { blogId: id })
      if (data.success) {
        setComments(data.comments)
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const addComment = async (e) => {
    e.preventDefault();
    try {
      const {data} = await axios.post('/api/blog/add-comment', {
        blog: id, 
        name, 
        comment: content // <-- corrected: send as 'comment'
      });
      if (data.success) {
        toast.success(data.message)
        setName('')
        setContent('')
        fetchComments(); // Refresh comments after adding
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    fetchBlogData()
    fetchComments()
    // Polling mechanism to auto-refresh comments every 5 seconds
    const interval = setInterval(fetchComments, 5000)
    return () => clearInterval(interval)
    // eslint-disable-next-line
  }, [])

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      <img
        src={assets.gradientBackground}
        alt=""
        className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-auto max-w-full h-auto"
      />
      <Navbar />

      {/* HEADER (unchanged) */}
      <div className="flex flex-col items-center justify-center text-center mt-20 text-gray-600 w-full">
        <p className="text-primary py-4 font-medium">
          Published on {Moment(data.createdAt).format('MMM Do YYYY')}
        </p>
        <h1 className="text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto text-gray-800">
          {data.title}
        </h1>
        <h2 className="my-5 max-w-lg truncate mx-auto">{data.subTitle} </h2>
        <p className="inline-block py-1 px-4 rounded-full mb-6 border text-sm border-primary/35 bg-primary/5 font-medium text-primary">
          
        </p>
      </div>

      {/* IMAGE + DESCRIPTION */}
      <div className="mx-5 max-w-5xl md:mx-auto my-10 mt-6">
        <img src={data.image} alt="" className="rounded-3xl mb-5" />
        <div
          className="rich-text max-w-5xl"
          style={{ textAlign: "left" }}
          dangerouslySetInnerHTML={{ __html: data.description }}
        ></div>
      </div>

      {/* COMMENT FORM - WIDER + ALIGNED */}
      <div className="max-w-5xl mx-auto mb-10 px-5">
        <p className="font-semibold mb-4 text-left">Add your comment</p>
        <form
          onSubmit={addComment}
          className="flex flex-col gap-4 w-full"
        >
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded outline-none"
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded outline-none h-32"
            required
          ></textarea>
          <button
            type="submit"
            className="bg-primary text-white rounded px-8 py-3 hover:scale-105 transition-all cursor-pointer w-full sm:w-auto"
          >
            Submit
          </button>
        </form>
      </div>

      {/* COMMENTS LIST */}
      <div className="mt-8 mb-10 max-w-5xl mx-auto px-5">
        <p className="font-semibold mb-4 text-left">Comments ({comments.length})</p>
        <div className="flex flex-col gap-4">
          {comments.map((item, index) => (
            <div
              key={index}
              className="relative bg-primary/2 border border-primary/5 max-w-3xl p-4 rounded text-gray-600"
            >
              <div className="flex items-center gap-4 mb-2">
                <img src={assets.user_icon} alt="" className="w-6" />
                <p className="font-medium">{item.name}</p>
              </div>
              <p className="text-sm max-w-md ml-8 mb-2">{item.content}</p>
              <div className="ml-8 flex items-center gap-2 text-xs text-gray-400">
                {Moment(item.createdAt).fromNow()}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Blog