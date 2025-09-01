// import React from 'react'

// const Newsletter = () => {
//   return (
//     <div className='flex flex-col items-center justify-center text-center space-y-2
//     my-32'>
//         <h1 className='md:text-4xl text-2xl font-semibold'>Never Miss a Blog!</h1>
//         <p className='md:text-lg text-gray-500/70 pb-8'>Subcribe to get the latest blog, new tech, and exclusive news.</p>
//         <form className='flex items-center justify-between max-w-2xl w-full md:h-13
//         h-12'>
//             <input className='border border-gray-300 rounded-md h-full border-r-0
//             outline-none w-full rounded-r-none px-3 text-gray-500' type="text" placeholder='Enter your email id' required/>
//             <button type='s' className='md:px-12 px-8 h-full text-white bg-primary/80
//             hover:bg-primary transition-all cursor-pointer rounded-md
//             rounded-l-none'>Subcribe</button>
//         </form>
      
//     </div>
//   )
// }

// export default Newsletter



import React, { useState } from 'react';
import axios from 'axios';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to your backend API with the email
      const response = await axios.post('api/admin/notification', { email });

      // Handle success message
      if (response.data.success) {
        setMessage('Thank you for subscribing! A confirmation email has been sent.');
      } else {
        setMessage('There was an issue with your subscription. Please try again.');
      }

      // Clear the email input
      setEmail('');
    } catch (error) {
      setMessage('There was an error. Please try again later.');
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-2 my-32">
      <h1 className="md:text-4xl text-2xl font-semibold">Never Miss a Blog!</h1>
      <p className="md:text-lg text-gray-500/70 pb-8">Subscribe to get the latest blog, new tech, and exclusive news.</p>
      <form className="flex items-center justify-between max-w-2xl w-full md:h-13 h-12" onSubmit={handleSubmit}>
        <input
          className="border border-gray-300 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-500"
          type="email"
          placeholder="Enter your email id"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="md:px-12 px-8 h-full text-white bg-primary/80 hover:bg-primary transition-all cursor-pointer rounded-md rounded-l-none"
        >
          Subscribe
        </button>
      </form>

      {/* Display the response message */}
      {message && (
        <div className="mt-4 text-lg font-semibold text-green-600">
          {message}
        </div>
      )}
    </div>
  );
};

export default Newsletter;

