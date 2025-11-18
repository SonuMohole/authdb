import axios from 'axios';
import React, { useState } from 'react';

// --- We define style objects here for a cleaner JSX ---
const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '40px 0',
    backgroundColor: '#f0f2f5',
    fontFamily: 'Arial, sans-serif',
  },
  formCard: {
    width: '100%',
    maxWidth: '700px',
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
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroupFull: {
    gridColumn: '1 / -1',
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
    boxSizing: 'border-box',
    height: '48.5px',
    backgroundColor: '#fff',
  },
  mobileInputContainer: {
    position: 'relative',
  },
  mobilePrefix: {
    position: 'absolute',
    left: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '16px',
    color: '#555',
    pointerEvents: 'none',
  },
  inputWithPrefix: {
    padding: '12px 15px 12px 50px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.2s',
    width: '100%',
    boxSizing: 'border-box',
  },
  button: {
    gridColumn: '1 / -1',
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
    gridColumn: '1 / -1',
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

// --- Component ---
export default function Register() {
  const [form, setForm] = useState({
    organisationName: '',
    organisationSize: '',
    organisationType: '', // ✅ Added new field
    representative: '',
    designation: '',
    companyEmail: '',
    password: '',
    confirmPassword: '',
    mobile: '',
  });
  const [msg, setMsg] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // --- Password Validation Function ---
  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long.';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter.';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter.';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number.';
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      return 'Password must contain at least one special character (e.g., @$!%*?&).';
    }
    return null;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const passwordError = validatePassword(form.password);
    if (passwordError) {
      setMsg(passwordError);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMsg('Passwords do not match');
      return;
    }

    setMsg('');
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        form,
        { withCredentials: true }
      );
      setMsg(res.data.message);
    } catch (err: any) {
      setMsg(err.response?.data?.message || 'Error');
    }
  };

  const getMessageStyle = (): React.CSSProperties => {
    if (!msg) return { display: 'none' };
    const isError =
      msg.toLowerCase().includes('error') ||
      msg.toLowerCase().includes('match') ||
      msg.toLowerCase().includes('registered') ||
      msg.toLowerCase().includes('password must');
    return {
      gridColumn: '1 / -1',
      textAlign: 'center',
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
        <h2 style={styles.title}>Register Organisation</h2>

        <form onSubmit={submit} style={styles.form}>
          {/* Row 1 */}
          <div style={styles.inputGroup}>
            <label htmlFor="organisationName" style={styles.label}>
              Name of Organisation
            </label>
            <input
              id="organisationName"
              name="organisationName"
              style={styles.input}
              value={form.organisationName}
              onChange={onChange}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="organisationSize" style={styles.label}>
              Size of Organisation
            </label>
            <select
              id="organisationSize"
              name="organisationSize"
              style={styles.input}
              value={form.organisationSize}
              onChange={onChange}
              required
            >
              <option value="" disabled>Select a size...</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="500+">500+ employees</option>
            </select>
          </div>

          {/* ✅ New Row - Type of Organisation */}
          <div style={styles.inputGroupFull}>
            <label htmlFor="organisationType" style={styles.label}>
              Type of Organisation
            </label>
            <select
              id="organisationType"
              name="organisationType"
              style={styles.input}
              value={form.organisationType}
              onChange={onChange}
              required
            >
              <option value="" disabled>Select type...</option>
              <option value="IT">Information Technology (IT)</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Education">Education</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              <option value="Retail">Retail</option>
              <option value="Construction">Construction</option>
              <option value="Hospitality">Hospitality</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Row 2 */}
          <div style={styles.inputGroup}>
            <label htmlFor="representative" style={styles.label}>
              Name of Representative
            </label>
            <input
              id="representative"
              name="representative"
              style={styles.input}
              value={form.representative}
              onChange={onChange}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="designation" style={styles.label}>
              Designation / Role
            </label>
            <input
              id="designation"
              name="designation"
              style={styles.input}
              value={form.designation}
              onChange={onChange}
              required
            />
          </div>

          {/* Row 3 - Full Width */}
          <div style={styles.inputGroupFull}>
            <label htmlFor="companyEmail" style={styles.label}>
              Company Email
            </label>
            <input
              id="companyEmail"
              name="companyEmail"
              type="email"
              style={styles.input}
              placeholder="you@company.com"
              value={form.companyEmail}
              onChange={onChange}
              required
            />
          </div>

          {/* Row 4 */}
          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              style={styles.input}
              placeholder="••••••••"
              value={form.password}
              onChange={onChange}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="confirmPassword" style={styles.label}>
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              style={styles.input}
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={onChange}
              required
            />
          </div>

          {/* Row 5 - Full Width */}
          <div style={styles.inputGroupFull}>
            <label htmlFor="mobile" style={styles.label}>
              Mobile Number
            </label>
            <div style={styles.mobileInputContainer}>
              <span style={styles.mobilePrefix}>+91</span>
              <input
                id="mobile"
                name="mobile"
                type="tel"
                style={styles.inputWithPrefix}
                value={form.mobile}
                onChange={onChange}
                required
                placeholder="98765 43210"
              />
            </div>
          </div>

          {/* Message Box */}
          <div style={getMessageStyle()}>{msg}</div>

          {/* Submit Button */}
          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = '#0056b3')
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = '#007bff')
            }
          >
            Register
          </button>

          {/* Login Link */}
          <div style={styles.loginLink}>
            Already have an account?{' '}
            <a href="/login" style={styles.link}>
              Login here
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
