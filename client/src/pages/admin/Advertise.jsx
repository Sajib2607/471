import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const Advertise = () => {
  const { axios } = useAppContext()
  const [heading, setHeading] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [adverts, setAdverts] = useState([])
  const [editingId, setEditingId] = useState(null)

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!heading || !imageFile) return toast.error('Heading and image are required')
    try {
      setSubmitting(true)
      const formData = new FormData()
      formData.append('heading', heading)
      formData.append('image', imageFile)
      const { data } = await axios.post('/api/admin/advert', formData)
      if (data.success) {
        toast.success('Advertisement created')
        setHeading('')
        setImageFile(null)
        fetchAdverts()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const fetchAdverts = async () => {
    try {
      const { data } = await axios.get('/api/admin/advert')
      if (data.success) setAdverts(data.adverts)
    } catch (error) {
      // ignore
    }
  }

  const onDelete = async (id) => {
    if (!confirm('Delete this advertisement?')) return
    try {
      const { data } = await axios.delete(`/api/admin/advert/${id}`)
      if (data.success) {
        toast.success('Deleted')
        fetchAdverts()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const startEdit = (ad) => {
    setEditingId(ad._id)
    setHeading(ad.heading)
    setImageFile(null)
  }

  const onUpdate = async (e) => {
    e.preventDefault()
    if (!editingId) return
    if (!heading && !imageFile) return toast.error('Nothing to update')
    try {
      setSubmitting(true)
      const formData = new FormData()
      if (heading) formData.append('heading', heading)
      if (imageFile) formData.append('image', imageFile)
      const { data } = await axios.put(`/api/admin/advert/${editingId}`, formData)
      if (data.success) {
        toast.success('Advertisement updated')
        setEditingId(null)
        setHeading('')
        setImageFile(null)
        fetchAdverts()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    fetchAdverts()
  }, [])

  return (
    <div className='flex-1 p-4 md:p-10 bg-blue-50/50'>
      <div className='bg-white rounded shadow p-6 max-w-xl'>
        <h2 className='text-lg font-semibold text-gray-700 mb-4'>Create Advertisement</h2>
        <form onSubmit={editingId ? onUpdate : onSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm text-gray-600 mb-1'>Heading</label>
            <input
              type='text'
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              className='w-full border rounded px-3 py-2 outline-none focus:ring'
              placeholder='Short catchy headline'
            />
          </div>
          <div>
            <label className='block text-sm text-gray-600 mb-1'>Image</label>
            <div
              className={`border-2 border-dashed rounded p-4 text-center cursor-pointer ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}`}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files?.[0]) setImageFile(e.dataTransfer.files[0]) }}
              onClick={() => document.getElementById('advert-image-input').click()}
            >
              <p className='text-sm text-gray-500'>Drag & drop an image here, or <span className='text-primary underline'>browse</span></p>
              {imageFile && (
                <div className='mt-3 flex items-center justify-center'>
                  <img src={URL.createObjectURL(imageFile)} alt='preview' className='h-24 rounded shadow' />
                </div>
              )}
            </div>
            <input id='advert-image-input' type='file' accept='image/*' className='hidden' onChange={(e) => setImageFile(e.target.files[0])} />
          </div>
          <button
            type='submit'
            disabled={submitting}
            className='bg-primary text-white px-4 py-2 rounded disabled:opacity-60'
          >
            {submitting ? 'Submitting...' : editingId ? 'Update' : 'Publish'}
          </button>
          {editingId && (
            <button
              type='button'
              className='ml-3 px-4 py-2 rounded border'
              onClick={() => { setEditingId(null); setHeading(''); setImageFile(null) }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className='bg-white rounded shadow p-6 mt-6'>
        <h3 className='text-md font-semibold text-gray-700 mb-4'>Advertisements</h3>
        {adverts.length === 0 ? (
          <p className='text-gray-500 text-sm'>No advertisements yet.</p>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full text-sm text-gray-600'>
              <thead className='text-left text-xs uppercase'>
                <tr>
                  <th className='px-2 py-2'>Image</th>
                  <th className='px-2 py-2'>Heading</th>
                  <th className='px-2 py-2'>Created</th>
                  <th className='px-2 py-2'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {adverts.map(ad => (
                  <tr key={ad._id} className='border-t'>
                    <td className='px-2 py-2'>
                      <img src={ad.image} alt={ad.heading} className='w-20 h-12 object-cover rounded' />
                    </td>
                    <td className='px-2 py-2'>{ad.heading}</td>
                    <td className='px-2 py-2'>{new Date(ad.createdAt).toLocaleDateString()}</td>
                    <td className='px-2 py-2'>
                      <button className='text-primary mr-3' onClick={() => startEdit(ad)}>Edit</button>
                      <button className='text-red-500' onClick={() => onDelete(ad._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Advertise


