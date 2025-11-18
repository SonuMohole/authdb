import axios from 'axios';
import React, { useState } from 'react';
// This hook is used to read the 'token' from the URL
import { Link, useSearchParams } from 'react-router-dom';

// Using the same styles as the Login page for consistency
const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    fontFamily: 'Arial, sans-serif',
  },
  formCard: {
    width: 420,
    padding: '40px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
  },
  title: {
    textAlign: 'center',
    margin: '0 0 30px 0',
    color: '#333',
    fontSize: '28px',
  },
  form: {
    display: 'grid',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '8px',
    color: '#555',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  input: {
    padding: '12px 15px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  button: {
    padding: '14px 15px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#007bff',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background-color 0.2s',
  },
  loginLink: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '14px',
    color: '#555',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // This hook lets us read the URL query parameters
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(false);

    if (!token) {
      setMsg('Invalid or missing token.');
      return;
    }
    if (password !== confirmPassword) {
      setMsg('Passwords do not match.');
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/reset-password`, 
        { token, password }, // Send token and new password
        { withCredentials: true }
      );
      setMsg(res.data.message); // "Password reset successful"
      setIsSuccess(true);
    } catch (err: any) {
      setMsg(err.response?.data?.message || 'Error resetting password');
    }
  };

  // Helper function to style the message
  const getMessageStyle = (): React.CSSProperties => {
    if (!msg) return { display: 'none' };
    
    // Use isSuccess state to determine color
    const isError = !isSuccess;

    return {
      textAlign: 'center',
      marginTop: '16px',
      fontSize: '14px',
      padding: '12px',
      borderRadius: '6px',
      color: isError ? '#D8000C' : '#4F8A10',
      backgroundColor: isError ? '#FFD2D2' : '#DFF2BF',
    };
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.formCard}>
        <h2 style={styles.title}>Set New Password</h2>
        
        <form onSubmit={submit} style={styles.form}>
          
          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>New Password</label>
            <input
              id="password"
              style={styles.input}
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="confirmPassword" style={styles.label}>Confirm New Password</label>
            <input
              id="confirmPassword"
              style={styles.input}
              placeholder="••••••••"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          <div style={getMessageStyle()}>{msg}</div>

          {/* Show button only if not yet successful */}
          {!isSuccess && (
            <button 
              type="submit" 
              style={styles.button}
              onMouseOver={e => (e.currentTarget.style.backgroundColor = '#0056b3')}
              onMouseOut={e => (e.currentTarget.style.backgroundColor = '#007bff')}
            >
              Reset Password
            </button>
          )}
        </form>

        <div style={styles.loginLink}>
          {isSuccess ? 'You can now log in with your new password.' : 'Remembered your password?'}
          {' '}
          {/* We use <Link> here instead of <a> for faster navigation */}
          <Link to="/login" style={styles.link}>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}