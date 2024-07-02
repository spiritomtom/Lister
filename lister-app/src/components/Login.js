import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link from react-router-dom
import { login } from '../api';
import './Auth.css';

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login({ email, password, rememberMe });
      alert("Login successful! Redirecting to home...");
      setIsAuthenticated(true);
      localStorage.setItem('token', 'example-token');
      navigate('/'); 
    } catch (err) {
      setError("Invalid login attempt. Please try again.");
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember Me
          </label>
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="auth-button">Login</button>
      </form>
      <p>
        Click here if you are new: <Link to="/register">Register</Link>
      </p> {}
    </div>
  );
};

export default Login;