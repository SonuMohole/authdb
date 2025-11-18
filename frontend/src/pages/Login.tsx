import axios from 'axios';
import React, { useState } from 'react';

// 1. IMPORT THE HOOK
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useNavigate } from 'react-router-dom';

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
  subtitle: {
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
  forgotPasswordLink: {
    textAlign: 'right',
    marginTop: '-10px',
    fontSize: '13px',
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: 'bold',
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
  registerLink: {
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

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  // 2. INITIALIZE THE HOOK
  const { executeRecaptcha } = useGoogleReCaptcha();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 3. CHECK IF HOOK IS READY
    if (!executeRecaptcha) {
      setMsg("reCAPTCHA not ready. Please try again.");
      return;
    }

    try {
      // 4. GET THE TOKEN
      const captchaToken = await executeRecaptcha('login'); // 'login' is an action name

      // 5. SEND ALL DATA TO THE BACKEND
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        { 
          companyEmail: email, 
          password,
          captchaToken // <-- Send the token
        },
        { withCredentials: true }
      );
      
      localStorage.setItem('accessToken', res.data.accessToken);
      setMsg('Logged in');

      navigate('/dashboard');

    } catch (err: any) {
      // Updated error handling
      const errorMsg = err.response?.data?.message || 'Error logging in';
      setMsg(errorMsg);
    }
  };

  const getMessageStyle = (): React.CSSProperties => {
    if (!msg) return { display: 'none' };

    // Updated error check
    const isError = msg.toLowerCase().includes('error') ||
      msg.toLowerCase().includes('invalid') ||
      msg.toLowerCase().includes('please') ||
      msg.toLowerCase().includes('failed') ||
      msg.toLowerCase().includes('required');

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
        <h2 style={styles.title}>Login to QStellar</h2>
        <p style={styles.subtitle}>For the best performance, log in here.</p>
        
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

          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
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

          <a href="/forgot-password" style={styles.forgotPasswordLink}>
            Forgot Password?
          </a>
          
          <div style={getMessageStyle()}>{msg}</div>

          {/* NO VISIBLE CAPTCHA COMPONENT IS NEEDED - It's invisible */}

          <button
            type="submit"
            style={styles.button}
            onMouseOver={e => (e.currentTarget.style.backgroundColor = '#0056b3')}
            onMouseOut={e => (e.currentTarget.style.backgroundColor = '#007bff')}
          >
            Login
          </button>
        </form>

        <div style={styles.registerLink}>
          Don't have an account?{' '}
          <a href="/register" style={styles.link}>
            Register here
          </a>
        </div>
      </div>
    </div>
  );
}