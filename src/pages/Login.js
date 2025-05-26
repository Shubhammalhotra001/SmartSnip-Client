import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from './AuthForm';

export default function Login() {
  const navigate = useNavigate();

  const handleSubmit = async (email, password, setErrors, setMessage, setIsLoading) => {
    const newErrors = {};
    if (!email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      newErrors.email = 'Invalid email address';
    }
    if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return false;

    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        setMessage('Login successful');
        setTimeout(() => navigate('/dashboard'), 1000);
        return true;
      } else {
        setMessage(data.message || 'Login failed');
        return false;
      }
    } catch (err) {
      setMessage('Server error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      title="Login to SmartSnip"
      submitText="Login"
      onSubmit={handleSubmit}
      linkText="Don't have an account?"
      linkTo="/register"
      linkLabel="Sign up"
    />
  );
}