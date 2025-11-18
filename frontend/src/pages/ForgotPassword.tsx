import axios from 'axios';
import React, { useState } from 'react';

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
    margin: '0 0 15px 0',
    color: '#333',
    fontSize: '28px',
  },
  instructions: {
    textAlign: 'center',
    margin: '0 0 30px 0',
    color: '#555',
    fontSize: '15px',
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

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, { companyEmail: email }, { withCredentials: true });
      setMsg(res.data.message); // This will be the "If there is a user..." message
    } catch (err: any) {
      setMsg(err.response?.data?.message || 'Error');
    }
  };

  // Helper function to style the message
  const getMessageStyle = (): React.CSSProperties => {
    if (!msg) return { display: 'none' };
    
    // The default message is a success/info message
    return {
      textAlign: 'center',
      marginTop: '16px',
      fontSize: '14px',
      padding: '12px',
      borderRadius: '6px',
      color: '#00529B', // Dark blue
      backgroundColor: '#BDE5F8', // Light blue
    };
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.formCard}>
        <h2 style={styles.title}>Forgot Password</h2>
        <p style={styles.instructions}>Enter your company email and we'll send you a link to reset your password.</p>
        
        <form onSubmit={submit} style={styles.form}>
          
          <div style={styles.inputGroup}>
            <label htmlFor="companyEmail" style={styles.label}>Company Email</label>
            <input
              id="companyEmail"
              style={styles.input}
              placeholder="you@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div style={getMessageStyle()}>{msg}</div>

          <button 
            type="submit" 
            style={styles.button}
            onMouseOver={e => (e.currentTarget.style.backgroundColor = '#0056b3')}
            onMouseOut={e => (e.currentTarget.style.backgroundColor = '#007bff')}
          >
            Send Reset Link
          </button>
        </form>

        <div style={styles.loginLink}>
          Remembered your password?{' '}
          {/* If using react-router-dom, use <Link to="/login" ...> */}
          <a href="/login" style={styles.link}>
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}