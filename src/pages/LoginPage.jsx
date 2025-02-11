import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function LoginPage() {
  const { login, signInWithGoogle, resetPassword } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const success = await login(formData);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  const handleGoogleSignIn = async () => {
    const success = await signInWithGoogle();
    if (success) {
      navigate('/dashboard');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const email = prompt('Enter your email address:');
    if (email) {
      try {
        const success = await resetPassword(email);
        if (success) {
          alert('Password reset email sent! Please check your inbox and spam folder.');
        } else {
          alert('Error sending reset email. Please try again.');
        }
      } catch (error) {
        alert('Error: ' + error.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl mb-4 text-center">Login</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Login
        </button>
        <button
          onClick={handleGoogleSignIn}
          className="w-full mt-4 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50 flex items-center justify-center gap-2"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          Continue with Google
        </button>
        <button
          onClick={handleResetPassword}
          type="button"
          className="mt-2 text-blue-500 hover:text-blue-700 text-sm block w-full text-center"
        >
          Forgot Password?
        </button>
        <p className="mt-4 text-center">
          Don't have an account? <Link to="/signup" className="text-blue-500">Sign up</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;