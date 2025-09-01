import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const Profile = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [image, setImage] = useState(null)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    dateOfBirth: '',
    gender: '',
    occupation: '',
    bio: '',
    phone: '',
    address: '',
    website: '',
    socialLinks: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: ''
    }
  })

  const { axios } = useAppContext()

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/user/profile')
      if (data.success) {
        setUser(data.user)
        setFormData({
          name: data.user.name || '',
          email: data.user.email || '',
          password: '',
          dateOfBirth: data.user.dateOfBirth ? new Date(data.user.dateOfBirth).toISOString().split('T')[0] : '',
          gender: data.user.gender || '',
          occupation: data.user.occupation || '',
          bio: data.user.bio || '',
          phone: data.user.phone || '',
          address: data.user.address || '',
          website: data.user.website || '',
          socialLinks: {
            facebook: data.user.socialLinks?.facebook || '',
            twitter: data.user.socialLinks?.twitter || '',
            linkedin: data.user.socialLinks?.linkedin || '',
            instagram: data.user.socialLinks?.instagram || ''
          }
        })
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setUpdating(true)
      
      const submitData = new FormData()
      
      // Add all form data
      Object.keys(formData).forEach(key => {
        if (key === 'socialLinks') {
          submitData.append(key, JSON.stringify(formData[key]))
        } else if (formData[key] !== '') {
          submitData.append(key, formData[key])
        }
      })
      
      // Add image if selected
      if (image) {
        submitData.append('profileImage', image)
      }

      const { data } = await axios.put('/api/user/profile', submitData)
      
      if (data.success) {
        setUser(data.user)
        toast.success('Profile updated successfully')
        setImage(null)
        // Clear password field
        setFormData(prev => ({ ...prev, password: '' }))
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setUpdating(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  useEffect(() => {
    fetchProfile()
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
      <div className='bg-white rounded-lg shadow p-6 max-w-4xl mx-auto'>
        <h2 className='text-2xl font-semibold text-gray-800 mb-6'>Profile Settings</h2>
        
        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Profile Image */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Profile Image
            </label>
            <div className='flex items-center gap-4'>
              <img 
                src={
                  image 
                    ? URL.createObjectURL(image) 
                    : user?.profileImage 
                      ? user.profileImage 
                      : assets.user_icon
                } 
                alt="Profile" 
                className='w-20 h-20 rounded-full object-cover border-2 border-gray-200'
              />
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                accept="image/*"
                className='text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90'
              />
            </div>
          </div>

          {/* Basic Information */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
                required
              />
            </div>
            
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                New Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
                placeholder="Leave blank to keep current password"
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Occupation
              </label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleInputChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows="3"
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Contact Information */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows="2"
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
            />
          </div>

          {/* Social Links */}
          <div>
            <h3 className='text-lg font-medium text-gray-800 mb-3'>Social Links</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Facebook
                </label>
                <input
                  type="url"
                  name="socialLinks.facebook"
                  value={formData.socialLinks.facebook}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Twitter
                </label>
                <input
                  type="url"
                  name="socialLinks.twitter"
                  value={formData.socialLinks.twitter}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  LinkedIn
                </label>
                <input
                  type="url"
                  name="socialLinks.linkedin"
                  value={formData.socialLinks.linkedin}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Instagram
                </label>
                <input
                  type="url"
                  name="socialLinks.instagram"
                  value={formData.socialLinks.instagram}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className='flex justify-end'>
            <button
              type="submit"
              disabled={updating}
              className='bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50'
            >
              {updating ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Profile 