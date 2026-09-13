import React, { useState } from 'react';
import {
  ArrowLeft,
  Stethoscope,
  ShieldCheck,
  QrCode,
  Lock,
  Save,
  Check,
  Copy,
  Download,
  Building2,
  Clock,
  Mail,
  Phone,
  Award,
  Sparkles,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  LogOut,
  UserCheck,
  FileCheck,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';
import ThemeToggle from './ThemeToggle.jsx';
import {
  DEFAULT_DOCTOR_PROFILE,
  formatHprId,
  saveDoctorProfile,
  changeDoctorPassword
} from '../services/doctorAuthService.js';
import { getTriageSummary } from '../services/clinicalRecordsService.js';
import './DoctorProfile.css';

export default function DoctorProfile({
  doctorProfile,
  onSaveProfile,
  onLogout,
  onBack,
  onSwitchRole,
  currentTheme = 'light',
  onToggleTheme,
  onNotify,
}) {
  const [formData, setFormData] = useState(() => {
    const base = doctorProfile || DEFAULT_DOCTOR_PROFILE;
    return {
      username: base.username || 'doctor01',
      name: base.name || 'Dr. Ananya Rao',
      specialty: base.specialty || 'Ayurveda & General Medicine',
      registration: base.registration || 'AYU-KA-20481',
      council: base.council || 'Karnataka Ayurvedic and Unani Practitioners Board (KAUPB)',
      qualification: base.qualification || 'BAMS, MD (Ayurveda Panchakarma)',
      experience: base.experience || '12 Years Clinical Practice',
      hprId: base.hprId || '91-2048-1928-3746',
      hprAddress: base.hprAddress || 'dr.ananya.rao@hpr.abdm',
      email: base.email || 'dr.ananya.rao@ayush.gov.in',
      phone: base.phone || '+91 98450 12345',
      hospital: base.hospital || 'District Government AYUSH Hospital & Research Centre',
      department: base.department || 'Ayurvedic Outpatient Department (OPD Chamber 4)',
      opdRoom: base.opdRoom || 'Chamber 104 (1st Floor, OPD Block A)',
      opdTimings: base.opdTimings || 'Mon–Sat: 09:00 AM – 02:00 PM',
      signatureStatus: base.signatureStatus || 'Verified Digital Signatory (eSign ABDM)',
      emergencyDuty: base.emergencyDuty || 'On-Call (Emergency Triage)',
      bio: base.bio || 'Senior Ayurvedic Medical Officer specializing in integrative clinical triage, chronic metabolic disorders, and Panchakarma therapies with ABDM digital health records integration.',
    };
  });

  const [activeTab, setActiveTab] = useState('credentials');
  const [summary] = useState(() => {
    try {
      return getTriageSummary();
    } catch {
      return { total: 0, red_flag: 0, urgent: 0, routine: 0, completed: 0, pending: 0 };
    }
  });

  const [copiedHpr, setCopiedHpr] = useState(false);
  const [copiedReg, setCopiedReg] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ text: '', type: '' });

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'name') {
        const clean = value.toLowerCase().replace(/^(dr\.?|vaidya|doctor)\s*/i, '').replace(/[^a-z0-9]/g, '.');
        updated.hprAddress = clean ? `dr.${clean}@hpr.abdm` : prev.hprAddress;
      }
      return updated;
    });
  };

  const handleHprChange = (e) => {
    const formatted = formatHprId(e.target.value);
    setFormData((prev) => ({ ...prev, hprId: formatted }));
  };

  const handleCopyHpr = () => {
    if (!formData.hprId) return;
    navigator.clipboard?.writeText(formData.hprId);
    setCopiedHpr(true);
    if (onNotify) onNotify('Doctor ABDM HPR ID copied to clipboard.', 'info');
    setTimeout(() => setCopiedHpr(false), 2000);
  };

  const handleCopyReg = () => {
    if (!formData.registration) return;
    navigator.clipboard?.writeText(formData.registration);
    setCopiedReg(true);
    if (onNotify) onNotify('Medical Council Registration copied to clipboard.', 'info');
    setTimeout(() => setCopiedReg(false), 2000);
  };

  const handleLoadSample = () => {
    setFormData(DEFAULT_DOCTOR_PROFILE);
    if (onNotify) onNotify('Loaded default ABDM verified doctor credentials.', 'info');
  };

  const handleDownloadCard = () => {
    if (onNotify) {
      onNotify('Downloading Digital Healthcare Professional Registry (HPR) Card...', 'success');
    }
  };

  const handleSubmitProfile = (e) => {
    e.preventDefault();
    setIsSaving(true);

    const saved = saveDoctorProfile(formData);
    if (onSaveProfile) {
      onSaveProfile(saved);
    }

    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      if (onNotify) onNotify('Doctor Profile & ABDM credentials saved successfully.', 'success');
      setTimeout(() => setSaveSuccess(false), 2500);
    }, 400);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage({ text: '', type: '' });

    if (!currentPassword) {
      setPasswordMessage({ text: 'Please enter your current password.', type: 'error' });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMessage({ text: 'New password must contain at least 8 characters.', type: 'error' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ text: 'New passwords do not match.', type: 'error' });
      return;
    }

    setPasswordLoading(true);
    try {
      await changeDoctorPassword(formData.username, currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordMessage({ text: 'Doctor password updated successfully.', type: 'success' });
      if (onNotify) onNotify('Doctor account password updated securely.', 'success');
    } catch (err) {
      setPasswordMessage({ text: err.message || 'Failed to update password.', type: 'error' });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="doc-profile-root">
      {/* ── Top Header Navigation ── */}
      <header className="doc-profile-header">
        <div className="doc-header-container">
          <div className="doc-header-left">
            <button
              type="button"
              className="doc-back-btn"
              onClick={onBack}
              aria-label="Back to OPD Portal"
            >
              <ArrowLeft size={16} />
              <span>Back to OPD Portal</span>
            </button>
            <div className="doc-brand-lockup">
              <div className="doc-brand-icon">
                <Stethoscope size={18} />
              </div>
              <span className="doc-brand-title">Doctor Profile</span>
              <span className="doc-brand-badge">ABDM Verified HPR</span>
            </div>
          </div>

          <div className="doc-header-actions">
            {onSwitchRole && (
              <button
                type="button"
                className="doc-switch-role-btn"
                onClick={() => onSwitchRole('intro')}
              >
                Exit / Switch Role
              </button>
            )}
            <ThemeToggle theme={currentTheme} onToggle={onToggleTheme} />
            <button
              type="button"
              className="doc-logout-btn"
              onClick={onLogout}
              aria-label="Log Out Doctor Session"
            >
              <LogOut size={15} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Profile Container ── */}
      <main className="doc-profile-main">
        <div className="doc-profile-container">
          {/* Top Banner / Hero */}
          <section className="doc-hero-section">
            <div className="doc-hero-avatar-wrap">
              <div className="doc-hero-avatar">
                {formData.name.replace(/^(dr\.?|vaidya)\s*/i, '').charAt(0) || 'D'}
              </div>
              <div className="doc-verified-seal" title="Verified Practitioner">
                <ShieldCheck size={14} />
              </div>
            </div>

            <div className="doc-hero-details">
              <div className="doc-hero-title-row">
                <h1>{formData.name || 'Doctor'}</h1>
                <span className="doc-status-badge">
                  <span className="doc-pulse-dot" /> Verified Clinician
                </span>
              </div>
              <p className="doc-hero-specialty">
                <strong>{formData.specialty}</strong> • {formData.qualification}
              </p>
              <div className="doc-hero-meta-row">
                <span><Building2 size={13} /> {formData.hospital}</span>
                <span><Clock size={13} /> {formData.opdTimings}</span>
                <span><Award size={13} /> Reg: {formData.registration}</span>
              </div>
            </div>

            <div className="doc-hero-quick-actions">
              <button
                type="button"
                className="doc-btn-secondary"
                onClick={handleLoadSample}
              >
                <Sparkles size={14} />
                <span>Load Sample Profile</span>
              </button>
              <button
                type="button"
                className="doc-btn-primary"
                onClick={handleSubmitProfile}
                disabled={isSaving}
              >
                <Save size={15} />
                <span>{isSaving ? 'Saving…' : 'Save Changes'}</span>
              </button>
            </div>
          </section>

          {/* ── ABDM Digital HPR Smart Card & Practice Metrics Grid ── */}
          <div className="doc-cards-grid">
            {/* 1. ABDM HPR Doctor Card */}
            <div className="doc-hpr-card" aria-label="ABDM Healthcare Professional Card">
              <div className="doc-hpr-header">
                <div className="doc-hpr-gov">
                  <span className="doc-hpr-emblem">🇮🇳</span>
                  <div>
                    <strong>NATIONAL HEALTH AUTHORITY</strong>
                    <small>Ayushman Bharat Digital Mission • HPR</small>
                  </div>
                </div>
                <span className="doc-hpr-chip">SMART HPR</span>
              </div>

              <div className="doc-hpr-body">
                <div className="doc-hpr-photo-box">
                  <div className="doc-hpr-photo-initial">
                    {formData.name.replace(/^(dr\.?|vaidya)\s*/i, '').charAt(0) || 'D'}
                  </div>
                  <span className="doc-hpr-doc-tag">CLINICIAN</span>
                </div>

                <div className="doc-hpr-info">
                  <div className="doc-hpr-name">{formData.name}</div>
                  <div className="doc-hpr-spec">{formData.qualification} — {formData.specialty}</div>
                  <div className="doc-hpr-council">{formData.council}</div>
                  
                  <div className="doc-hpr-id-pill" onClick={handleCopyHpr} title="Click to copy HPR ID">
                    <span className="doc-hpr-id-label">HPR ID:</span>
                    <span className="doc-hpr-id-num">{formData.hprId || '91-2048-1928-3746'}</span>
                    <button type="button" className="doc-hpr-copy-icon" aria-label="Copy HPR ID">
                      {copiedHpr ? <Check size={12} color="var(--accent-success)" /> : <Copy size={12} />}
                    </button>
                  </div>
                </div>

                <div className="doc-hpr-qr-wrap" title="Digital verification QR">
                  <div className="doc-hpr-qr-box">
                    <QrCode size={52} strokeWidth={1.5} />
                  </div>
                  <span className="doc-hpr-qr-label">Scan to Verify</span>
                </div>
              </div>

              <div className="doc-hpr-footer">
                <div className="doc-hpr-reg-text">
                  <span>Registration No: <strong>{formData.registration}</strong></span>
                  <span> • ABDM Address: <strong>{formData.hprAddress}</strong></span>
                </div>
                <button
                  type="button"
                  className="doc-hpr-download-btn"
                  onClick={handleDownloadCard}
                  title="Download digital HPR card"
                >
                  <Download size={13} />
                  <span>Card PDF</span>
                </button>
              </div>
            </div>

            {/* 2. Live Clinical Practice Stats */}
            <div className="doc-stats-card">
              <div className="doc-stats-header">
                <div className="doc-stats-title">
                  <UserCheck size={16} />
                  <strong>Live OPD Consultation Metrics</strong>
                </div>
                <span className="doc-stats-live-pill">
                  <span className="doc-pulse-dot" /> Active Session
                </span>
              </div>

              <div className="doc-metrics-grid">
                <div className="doc-metric-box metric-total">
                  <span className="doc-metric-num">{summary.total}</span>
                  <span className="doc-metric-label">Total Patients</span>
                </div>
                <div className="doc-metric-box metric-redflag">
                  <div className="doc-metric-top">
                    <AlertOctagon size={14} />
                    <span className="doc-metric-num">{summary.red_flag}</span>
                  </div>
                  <span className="doc-metric-label">Red Flag Alerts</span>
                </div>
                <div className="doc-metric-box metric-urgent">
                  <div className="doc-metric-top">
                    <AlertTriangle size={14} />
                    <span className="doc-metric-num">{summary.urgent}</span>
                  </div>
                  <span className="doc-metric-label">Urgent Cases</span>
                </div>
                <div className="doc-metric-box metric-routine">
                  <div className="doc-metric-top">
                    <CheckCircle2 size={14} />
                    <span className="doc-metric-num">{summary.routine}</span>
                  </div>
                  <span className="doc-metric-label">Routine Triage</span>
                </div>
                <div className="doc-metric-box metric-completed">
                  <span className="doc-metric-num">{summary.completed}</span>
                  <span className="doc-metric-label">Completed Consults</span>
                </div>
                <div className="doc-metric-box metric-pending">
                  <span className="doc-metric-num">{summary.pending}</span>
                  <span className="doc-metric-label">In Waiting Queue</span>
                </div>
              </div>

              <div className="doc-stats-footer">
                <span>⚡ Triage protocol: <strong>Urgency-First (Ayush + Clinical Triage)</strong></span>
              </div>
            </div>
          </div>

          {/* ── Form Navigation Tabs ── */}
          <div className="doc-tabs-nav" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'credentials'}
              className={`doc-tab-btn ${activeTab === 'credentials' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('credentials')}
            >
              <Award size={15} />
              <span>Professional Credentials</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'opd'}
              className={`doc-tab-btn ${activeTab === 'opd' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('opd')}
            >
              <Building2 size={15} />
              <span>Hospital &amp; OPD Chamber</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'contact'}
              className={`doc-tab-btn ${activeTab === 'contact' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('contact')}
            >
              <FileCheck size={15} />
              <span>Contact &amp; Digital Identity</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'security'}
              className={`doc-tab-btn ${activeTab === 'security' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <KeyRound size={15} />
              <span>Security &amp; Password</span>
            </button>
          </div>

          {/* ── Form Panels ── */}
          <form onSubmit={handleSubmitProfile} className="doc-form-container">
            {/* Tab 1: Professional & Council Credentials */}
            {activeTab === 'credentials' && (
              <section className="doc-section-card">
                <div className="doc-section-header">
                  <Award size={18} className="doc-section-icon" />
                  <div>
                    <h2>Professional Credentials &amp; Medical Registration</h2>
                    <p>Verified doctor credentials issued by National/State Medical &amp; AYUSH Councils.</p>
                  </div>
                </div>

                <div className="doc-form-grid">
                  <div className="doc-field">
                    <label htmlFor="doc-name">Full Practitioner Name *</label>
                    <input
                      id="doc-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g. Dr. Ananya Rao"
                      required
                    />
                  </div>

                  <div className="doc-field">
                    <label htmlFor="doc-reg">
                      Medical Registration Number *
                      {formData.registration && (
                        <button type="button" className="doc-copy-tag" onClick={handleCopyReg}>
                          {copiedReg ? '✓ Copied' : 'Copy'}
                        </button>
                      )}
                    </label>
                    <input
                      id="doc-reg"
                      type="text"
                      value={formData.registration}
                      onChange={(e) => handleInputChange('registration', e.target.value)}
                      placeholder="e.g. AYU-KA-20481"
                      required
                    />
                  </div>

                  <div className="doc-field full-width">
                    <label htmlFor="doc-council">State / National Medical Council Board *</label>
                    <input
                      id="doc-council"
                      type="text"
                      value={formData.council}
                      onChange={(e) => handleInputChange('council', e.target.value)}
                      placeholder="e.g. Karnataka Ayurvedic and Unani Practitioners Board"
                      required
                    />
                  </div>

                  <div className="doc-field">
                    <label htmlFor="doc-qual">Medical Qualifications / Degrees *</label>
                    <input
                      id="doc-qual"
                      type="text"
                      value={formData.qualification}
                      onChange={(e) => handleInputChange('qualification', e.target.value)}
                      placeholder="e.g. BAMS, MD (Ayurveda), MS, MBBS"
                      required
                    />
                  </div>

                  <div className="doc-field">
                    <label htmlFor="doc-spec">Primary Clinical Specialty *</label>
                    <input
                      id="doc-spec"
                      type="text"
                      value={formData.specialty}
                      onChange={(e) => handleInputChange('specialty', e.target.value)}
                      placeholder="e.g. Ayurveda & General Medicine"
                      required
                    />
                  </div>

                  <div className="doc-field">
                    <label htmlFor="doc-hpr">ABDM Healthcare Professional Registry (HPR) ID</label>
                    <input
                      id="doc-hpr"
                      type="text"
                      value={formData.hprId}
                      onChange={handleHprChange}
                      placeholder="XX-XXXX-XXXX-XXXX"
                      maxLength={17}
                    />
                    <small className="doc-hint">14-digit National Health Authority HPR credential identifier.</small>
                  </div>

                  <div className="doc-field">
                    <label htmlFor="doc-exp">Clinical Experience</label>
                    <input
                      id="doc-exp"
                      type="text"
                      value={formData.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      placeholder="e.g. 12 Years Clinical Practice"
                    />
                  </div>
                </div>
              </section>
            )}

            {/* Tab 2: Hospital & OPD Chamber */}
            {activeTab === 'opd' && (
              <section className="doc-section-card">
                <div className="doc-section-header">
                  <Building2 size={18} className="doc-section-icon" />
                  <div>
                    <h2>Hospital &amp; OPD Consultation Practice</h2>
                    <p>Clinical location, chamber details, and outpatient consultation schedule.</p>
                  </div>
                </div>

                <div className="doc-form-grid">
                  <div className="doc-field full-width">
                    <label htmlFor="doc-hospital">Hospital / Healthcare Facility Affiliation *</label>
                    <input
                      id="doc-hospital"
                      type="text"
                      value={formData.hospital}
                      onChange={(e) => handleInputChange('hospital', e.target.value)}
                      placeholder="e.g. District Government AYUSH Hospital & Research Centre"
                      required
                    />
                  </div>

                  <div className="doc-field">
                    <label htmlFor="doc-dept">Clinical Department / Unit *</label>
                    <input
                      id="doc-dept"
                      type="text"
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      placeholder="e.g. Ayurvedic Outpatient Department (OPD-4)"
                      required
                    />
                  </div>

                  <div className="doc-field">
                    <label htmlFor="doc-room">OPD Chamber / Room Number</label>
                    <input
                      id="doc-room"
                      type="text"
                      value={formData.opdRoom}
                      onChange={(e) => handleInputChange('opdRoom', e.target.value)}
                      placeholder="e.g. Chamber 104 (Block A)"
                    />
                  </div>

                  <div className="doc-field">
                    <label htmlFor="doc-timings">Consultation Hours / Timings *</label>
                    <input
                      id="doc-timings"
                      type="text"
                      value={formData.opdTimings}
                      onChange={(e) => handleInputChange('opdTimings', e.target.value)}
                      placeholder="e.g. Mon–Sat: 09:00 AM – 02:00 PM"
                      required
                    />
                  </div>

                  <div className="doc-field">
                    <label htmlFor="doc-emergency">Emergency Duty Status</label>
                    <input
                      id="doc-emergency"
                      type="text"
                      value={formData.emergencyDuty}
                      onChange={(e) => handleInputChange('emergencyDuty', e.target.value)}
                      placeholder="e.g. On-Call (Emergency Triage)"
                    />
                  </div>
                </div>
              </section>
            )}

            {/* Tab 3: Contact & Identity */}
            {activeTab === 'contact' && (
              <section className="doc-section-card">
                <div className="doc-section-header">
                  <FileCheck size={18} className="doc-section-icon" />
                  <div>
                    <h2>Contact &amp; Digital Healthcare Identity</h2>
                    <p>Verified communication channels, digital eSign status, and clinical statement.</p>
                  </div>
                </div>

                <div className="doc-form-grid">
                  <div className="doc-field">
                    <label htmlFor="doc-email">Official / Institutional Email *</label>
                    <div className="doc-input-wrap">
                      <Mail size={16} />
                      <input
                        id="doc-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="doctor@ayush.gov.in"
                        required
                      />
                    </div>
                  </div>

                  <div className="doc-field">
                    <label htmlFor="doc-phone">Contact Phone / Extension</label>
                    <div className="doc-input-wrap">
                      <Phone size={16} />
                      <input
                        id="doc-phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+91 98450 12345"
                      />
                    </div>
                  </div>

                  <div className="doc-field full-width">
                    <label htmlFor="doc-sig">Digital Signature &amp; ABDM eSign Status</label>
                    <input
                      id="doc-sig"
                      type="text"
                      value={formData.signatureStatus}
                      onChange={(e) => handleInputChange('signatureStatus', e.target.value)}
                      placeholder="Verified Digital Signatory (eSign ABDM)"
                    />
                  </div>

                  <div className="doc-field full-width">
                    <label htmlFor="doc-bio">Doctor Statement / Clinical Bio</label>
                    <textarea
                      id="doc-bio"
                      rows={3}
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Enter clinical focus, subspecialty interests, and triage practices..."
                    />
                  </div>
                </div>
              </section>
            )}

            {/* Tab 4: Security & Password Changing Feature */}
            {activeTab === 'security' && (
              <section className="doc-section-card">
                <div className="doc-section-header">
                  <KeyRound size={18} className="doc-section-icon" />
                  <div>
                    <h2>Security &amp; Password Management</h2>
                    <p>Change your clinical login password and manage encrypted session security.</p>
                  </div>
                </div>

                <div className="doc-security-box">
                  <div className="doc-security-status">
                    <div className="doc-sec-icon">
                      <Lock size={20} />
                    </div>
                    <div>
                      <strong>Doctor ID: {formData.username}</strong>
                      <p>Encrypted using PBKDF2 with SHA-256 and AES-GCM 256-bit cryptography.</p>
                    </div>
                    <span className="doc-sec-badge">AES-256 Active</span>
                  </div>

                  <div className="doc-password-change-card">
                    <h3>Change Doctor Password</h3>
                    <div className="doc-pw-grid">
                      <div className="doc-field">
                        <label htmlFor="current-pw">Current Password *</label>
                        <div className="doc-input-wrap">
                          <input
                            id="current-pw"
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            className="doc-pw-toggle"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            aria-label="Toggle current password visibility"
                          >
                            {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <div className="doc-field">
                        <label htmlFor="new-pw">New Password (8+ characters) *</label>
                        <div className="doc-input-wrap">
                          <input
                            id="new-pw"
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new strong password"
                          />
                          <button
                            type="button"
                            className="doc-pw-toggle"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            aria-label="Toggle new password visibility"
                          >
                            {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <div className="doc-field">
                        <label htmlFor="confirm-pw">Confirm New Password *</label>
                        <div className="doc-input-wrap">
                          <input
                            id="confirm-pw"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                          />
                        </div>
                      </div>
                    </div>

                    {passwordMessage.text && (
                      <div className={`doc-pw-alert ${passwordMessage.type === 'error' ? 'is-error' : 'is-success'}`}>
                        {passwordMessage.type === 'error' ? <AlertTriangle size={15} /> : <CheckCircle2 size={15} />}
                        <span>{passwordMessage.text}</span>
                      </div>
                    )}

                    <div className="doc-pw-action-row">
                      <button
                        type="button"
                        className="doc-btn-save-pw"
                        onClick={handleChangePassword}
                        disabled={passwordLoading || !currentPassword || !newPassword}
                      >
                        <KeyRound size={14} />
                        <span>{passwordLoading ? 'Updating Password…' : 'Update Doctor Password'}</span>
                      </button>
                      <small className="doc-pw-note">Demo account default password is <code>doctor123</code></small>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Bottom Floating/Sticky Action Bar */}
            <div className="doc-form-actions-bar">
              <button
                type="button"
                className="doc-btn-secondary"
                onClick={onBack}
              >
                <ArrowLeft size={14} />
                <span>Return to OPD Queue</span>
              </button>

              <div className="doc-form-actions-right">
                {saveSuccess && (
                  <span className="doc-save-badge">
                    <CheckCircle2 size={14} /> Saved Successfully
                  </span>
                )}
                <button
                  type="submit"
                  className="doc-btn-primary"
                  disabled={isSaving}
                >
                  <Save size={15} />
                  <span>{isSaving ? 'Saving…' : 'Save Doctor Profile'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
