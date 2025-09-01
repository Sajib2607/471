import React, { useEffect, useState, useRef } from 'react'
import { assets, blogCategories } from '../../assets/assets';
import Quill from 'quill';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { parse } from 'marked';
import jsPDF from 'jspdf';
import { useLocation } from 'react-router-dom';

const AddBlog = () => {
  const { axios } = useAppContext()
  const location = useLocation()
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [draftId, setDraftId] = useState(null)

  const editorRef = useRef(null);
  const quillRef = useRef(null);
  
  const [image, setImage] = useState(null); // Default to null for file
  const [title, setTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [category, setCategory] = useState('Startup');
  const [isPublished, setIsPublished] = useState(false);
  const [aiTone, setAiTone] = useState('informative');
  const [writingStyle, setWritingStyle] = useState('article');

  // AI Tone options
  const toneOptions = [
    { value: 'formal', label: 'Formal' },
    { value: 'casual', label: 'Casual' },
    { value: 'informative', label: 'Informative' },
    { value: 'academic', label: 'Academic' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'professional', label: 'Professional' },
    { value: 'conversational', label: 'Conversational' },
    { value: 'technical', label: 'Technical' }
  ];

  // Writing Style options
  const styleOptions = [
    { value: 'article', label: 'Article' },
    { value: 'blog-post', label: 'Blog Post' },
    { value: 'tutorial', label: 'Tutorial' },
    { value: 'review', label: 'Review' },
    { value: 'news', label: 'News' },
    { value: 'story', label: 'Story' },
    { value: 'guide', label: 'Guide' },
    { value: 'analysis', label: 'Analysis' }
  ];

  // Check if we're editing a draft
  useEffect(() => {
    if (location.state?.draft) {
      const draft = location.state.draft;
      setIsEditing(true);
      setDraftId(draft._id);
      setTitle(draft.title);
      setSubTitle(draft.subTitle || '');
      setCategory(draft.category);
      setIsPublished(draft.isPublished);
      setAiTone(draft.aiTone || 'informative');
      setWritingStyle(draft.writingStyle || 'article');
      
      // Set the content in the editor after it's initialized
      setTimeout(() => {
        if (quillRef.current) {
          quillRef.current.root.innerHTML = draft.description;
        }
      }, 100);
    }
  }, [location.state]);

  const generateContent = async () => {
    if (!title) return toast.error("Please enter a title first")

    try {
      setLoading(true);
      const { data } = await axios.post('/api/blog/generate', { 
        prompt: title,
        tone: aiTone,
        style: writingStyle
      })
      if (data.success) {
        quillRef.current.root.innerHTML = parse(data.content)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Set font and add content
    doc.setFontSize(16);
    doc.text('Blog Title:', 10, 10);
    doc.setFontSize(12);
    doc.text(title || 'No Title Provided', 10, 20);

    doc.setFontSize(16);
    doc.text('Blog Subtitle:', 10, 30);
    doc.setFontSize(12);
    doc.text(subTitle || 'No Subtitle Provided', 10, 40);

    doc.setFontSize(16);
    doc.text('Blog Description:', 10, 50);
    doc.setFontSize(12);
    
    // Split description text to fit within page width
    const description = quillRef.current ? quillRef.current.root.innerText : 'No Description Provided';
    const splitText = doc.splitTextToSize(description, 190); // 190mm width
    doc.text(splitText, 10, 60);

    // Save the PDF
    doc.save('blog_export.pdf');
  };

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      setIsAdding(true)

      const blog = {
        title, subTitle,
        description: quillRef.current.root.innerHTML,
        category, isPublished: false, // Users can't publish directly
        aiTone, writingStyle
      }

      const formData = new FormData();
      formData.append('blog', JSON.stringify(blog));
      if (image) {
        formData.append('image', image)
      }

      let response;
      if (isEditing) {
        // Update existing blog
        response = await axios.put(`/api/blog/${draftId}`, formData);
      } else {
        // Create new blog
        response = await axios.post('/api/blog/add', formData);
      }

      const { data } = response;

      if (data.success) {
        toast.success(data.message);
        if (!isEditing) {
          // Only reset form if creating new blog
          setImage(null)
          setTitle('')
          setSubTitle('')
          quillRef.current.root.innerHTML = ''
          setCategory('Startup')
          setIsPublished(false)
          setAiTone('informative')
          setWritingStyle('article')
        }
        // Reset editing state
        setIsEditing(false)
        setDraftId(null)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsAdding(false)
    }
  }

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: 'snow' });
    }
  }, []);

  return (
    <form onSubmit={onSubmitHandler} className='flex-1 bg-blue-50/50 text-gray-600 w-full overflow-scroll'>
      <div className='bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-2xl font-semibold text-gray-800'>
            {isEditing ? 'Edit Draft' : 'Create New Blog'}
          </h2>
          {isEditing && (
            <button
              type='button'
              onClick={() => {
                setIsEditing(false)
                setDraftId(null)
                setImage(null)
                setTitle('')
                setSubTitle('')
                quillRef.current.root.innerHTML = ''
                setCategory('Startup')
                setIsPublished(false)
                setAiTone('informative')
                setWritingStyle('article')
              }}
              className='text-sm px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors'
            >
              New Blog
            </button>
          )}
        </div>

        <p>Upload Thumbnail</p>
        <label htmlFor='image'>
          <img 
            src={
              image 
                ? URL.createObjectURL(image) 
                : (isEditing && !image) 
                  ? 'https://via.placeholder.com/150x150?text=Current+Image' 
                  : assets.upload_area
            } 
            alt='' 
            className='mt-2 h-16 rounded cursor-pointer'
          />
          <input onChange={(e) => setImage(e.target.files[0])} type='file' id='image' hidden required={!isEditing}/>
        </label>
        <p className='mt-4'>Blog title</p>
        <input type='text' placeholder='Type here' required className='w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded' onChange={(e) => setTitle(e.target.value)} value={title}/>      

        <p className='mt-4'>Blog subtitle</p>
        <input type='text' placeholder='Type here' required className='w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded' onChange={(e) => setSubTitle(e.target.value)} value={subTitle}/>     
        
        <p className='mt-4'>Blog Description</p>
        <div className='max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative'>
          <div ref={editorRef}></div>

          {loading && ( 
            <div className='absolute right-0 top-0 left-0 bottom-0 flex items-center justify-center bg-black/10 mt-2'>
              <div className='w-8 h-8 rounded-full border-2 border-t-white animate-spin'></div>
            </div>
          )}
          <div className='absolute bottom-1 right-2 flex gap-2'>
            <button 
              disabled={loading} 
              type='button' 
              onClick={generateContent} 
              className='text-xs text-white bg-black/70 px-4 py-1.5 rounded hover:underline cursor-pointer'
            >
              Generate with AI
            </button>
            <button 
              type='button' 
              onClick={exportToPDF} 
              className='text-xs text-white bg-blue-600 px-4 py-1.5 rounded hover:underline cursor-pointer'
            >
              Export as PDF
            </button>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
          <div>
            <p>Blog Category</p>
            <select onChange={e => setCategory(e.target.value)} name='category' className='mt-2 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded w-full'>
              <option value=''>Select Category</option>
              {blogCategories.map((item, index) => (
                <option key={index} value={item}>{item}</option>
              ))}
            </select>
          </div>

          <div>
            <p>AI Tone</p>
            <p className='text-xs text-gray-500 mb-1'>Choose the tone for AI content generation</p>
            <select onChange={e => setAiTone(e.target.value)} name='aiTone' className='mt-1 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded w-full'>
              {toneOptions.map((tone) => (
                <option key={tone.value} value={tone.value}>{tone.label}</option>
              ))}
            </select>
          </div>

          <div>
            <p>Writing Style</p>
            <p className='text-xs text-gray-500 mb-1'>Choose the writing style for AI content generation</p>
            <select onChange={e => setWritingStyle(e.target.value)} name='writingStyle' className='mt-1 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded w-full'>
              {styleOptions.map((style) => (
                <option key={style.value} value={style.value}>{style.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className='mt-6 p-4 bg-blue-50 rounded-lg'>
          <p className='text-sm text-blue-800 mb-2'>
            <strong>Note:</strong> Your blog will be saved as a draft. You can submit it for review when you're ready to publish.
          </p>
        </div>

        <button disabled={isAdding} type='submit' className='mt-4 w-40 h-10 bg-primary text-white rounded cursor-pointer text-sm'>
          {isAdding ? (isEditing ? "Updating..." : "Saving...") : (isEditing ? "Update Draft" : "Save as Draft")}
        </button>
      </div>
    </form>
  )
}

export default AddBlog 