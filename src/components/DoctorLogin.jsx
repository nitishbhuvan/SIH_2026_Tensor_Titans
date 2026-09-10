import React, { useState } from 'react';
import { Eye, EyeOff, LockKeyhole, UserRound } from 'lucide-react';
import { authenticateDoctor, registerDoctor } from '../services/doctorAuthService.js';
import nidanLogo from '../assets/NIDAN_logo.png';
import './DoctorLogin.css';

const DEMO_DOCTOR = {
  username: 'doctor01',
  password: 'doctor123',
  name: 'Dr. Ananya Rao',
  specialty: 'Ayurveda & General Medicine',
  registration: 'AYU-KA-20481',
};

export const DEMO_DOCTOR_PROFILE = DEMO_DOCTOR;

export default function DoctorLogin({ onLogin, onBack }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [registration, setRegistration] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Please enter your doctor credentials.');
      return;
    }

    if (isRegistering) {
      if (!name.trim() || !specialty.trim() || !registration.trim()) {
        setError('Please fill in all profile fields.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (isRegistering) {
        await registerDoctor({ username, password, name: name.trim(), specialty, registration });
        setIsRegistering(false);
        setPassword('');
        setConfirmPassword('');
        setError('Account created. Sign in with your new doctor ID.');
      } else if (username.trim() === DEMO_DOCTOR.username && password === DEMO_DOCTOR.password) {
        onLogin(DEMO_DOCTOR);
      } else {
        onLogin(await authenticateDoctor(username, password));
      }
    } catch (submitError) {
      setError(submitError.message || 'Unable to complete this request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="doctor-login-page">
      <section className="doctor-login-card" aria-labelledby="doctor-login-title">
        <div className="doctor-login-brand">
          <img src={nidanLogo} alt="NIDAN Logo" className="doctor-login-logo-img" />
          <div className="doctor-login-brand-copy">
            <span className="doctor-login-brand-title">NIDAN</span>
            <span className="doctor-login-brand-sub">Clinical Access • OPD Portal</span>
          </div>
        </div>
        <h1 id="doctor-login-title">{isRegistering ? 'Create Doctor Account' : 'Doctor Portal'}</h1>
        <p className="doctor-login-subtitle">
          {isRegistering ? 'Create a local encrypted profile for this demo.' : 'Sign in to manage your personalized clinical workspace.'}
        </p>

        <form onSubmit={handleSubmit} className="doctor-login-form">
          {!isRegistering && (
            <>
              <label htmlFor="doctor-username">Doctor ID</label>
              <div className="doctor-login-input-wrap">
                <UserRound size={17} aria-hidden="true" />
                <input
                  id="doctor-username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  autoComplete="username"
                  placeholder="Enter doctor ID"
                  required
                />
              </div>
            </>
          )}

          {isRegistering && (
            <>
              <label htmlFor="doctor-name">Full Name</label>
              <input id="doctor-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Dr. Your Name" required />
              <label htmlFor="doctor-username">Username</label>
              <div className="doctor-login-input-wrap">
                <UserRound size={17} aria-hidden="true" />
                <input
                  id="doctor-username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  autoComplete="username"
                  placeholder="Choose a username"
                  required
                />
              </div>
              <label htmlFor="doctor-specialty">Specialty</label>
              <input id="doctor-specialty" value={specialty} onChange={(event) => setSpecialty(event.target.value)} placeholder="General Medicine" required />
              <label htmlFor="doctor-registration">Registration Number</label>
              <input id="doctor-registration" value={registration} onChange={(event) => setRegistration(event.target.value)} placeholder="Medical registration ID" required />
            </>
          )}

          <label htmlFor="doctor-password">Password</label>
          <div className="doctor-login-input-wrap">
            <LockKeyhole size={17} aria-hidden="true" />
            <input
              id="doctor-password"
                type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="Enter password"
              required
            />
            <button
              type="button"
              className="doctor-password-toggle"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          {isRegistering && (
            <>
              <label htmlFor="doctor-confirm-password">Confirm Password</label>
              <div className="doctor-login-input-wrap">
                <LockKeyhole size={17} aria-hidden="true" />
                <input id="doctor-confirm-password" type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" placeholder="Repeat password" required />
                <button
                  type="button"
                  className="doctor-password-toggle"
                  onClick={() => setShowConfirmPassword((visible) => !visible)}
                  aria-label={showConfirmPassword ? 'Hide confirmation password' : 'Show confirmation password'}
                >
                  {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </>
          )}

          {error && <p className={`doctor-login-error ${error.startsWith('Account created') ? 'is-success' : ''}`} role="alert">{error}</p>}
          <button type="submit" className="doctor-login-submit" disabled={isSubmitting}>{isSubmitting ? 'Please wait…' : (isRegistering ? 'Create Account' : 'Sign In')}</button>
        </form>

        {!isRegistering && <p className="doctor-login-demo">Demo access: <strong>doctor01</strong> / <strong>doctor123</strong></p>}
        <button type="button" className="doctor-login-back" onClick={() => { setIsRegistering(!isRegistering); setError(''); }}>
          {isRegistering ? 'Back to sign in' : 'Create a new doctor account'}
        </button>
        <button type="button" className="doctor-login-back" onClick={onBack}>Back to role selection</button>
      </section>
    </main>
  );
}
