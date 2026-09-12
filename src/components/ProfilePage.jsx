import React, { useState } from 'react';
import {
  ArrowLeft,
  User,
  ShieldCheck,
  QrCode,
  Globe,
  Accessibility,
  Zap,
  LogOut,
  Save,
  CheckCircle2,
  Sparkles,
  Phone,
  Calendar,
  CreditCard,
  Mail,
  Heart,
  Copy,
  Check,
  Download,
  MapPin,
  Lock,
  Building2
} from 'lucide-react';
import ThemeToggle from './ThemeToggle.jsx';
import { SUPPORTED_LANGUAGES, translations } from '../translations.js';
import {
  formatAbhaId,
  DEMO_PATIENT_PROFILE
} from '../services/patientProfileService.js';
import './ProfilePage.css';

export default function ProfilePage({
  patientProfile,
  onSaveProfile,
  onLogout,
  onBack,
  currentLanguage = 'en',
  onSelectLanguage,
  currentMode = 'modern',
  onSelectMode,
  currentTheme = 'light',
  onToggleTheme,
  onNotify,
}) {
  const [formData, setFormData] = useState(() => {
    if (patientProfile) {
      return {
        name: patientProfile.name || '',
        abhaId: patientProfile.abhaId || '',
        abhaAddress: patientProfile.abhaAddress || (patientProfile.name ? `${patientProfile.name.toLowerCase().replace(/\s+/g, '.')}@abdm` : ''),
        phone: patientProfile.phone || '',
        email: patientProfile.email || '',
        gender: patientProfile.gender || 'Male',
        age: patientProfile.age || '',
        bloodGroup: patientProfile.bloodGroup || 'B+',
        emergencyContact: patientProfile.emergencyContact || '',
        address: patientProfile.address || '',
        language: patientProfile.language || currentLanguage || 'en',
        mode: patientProfile.mode || currentMode || 'modern',
      };
    }
    return {
      name: '',
      abhaId: '',
      abhaAddress: '',
      phone: '',
      email: '',
      gender: 'Male',
      age: '',
      bloodGroup: 'B+',
      emergencyContact: '',
      address: '',
      language: currentLanguage || 'en',
      mode: currentMode || 'modern',
    };
  });

  const [copiedAbha, setCopiedAbha] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const t = translations[formData.language] || translations[currentLanguage] || translations.en;

  const handleAbhaChange = (e) => {
    const formatted = formatAbhaId(e.target.value);
    setFormData((prev) => ({
      ...prev,
      abhaId: formatted,
      abhaAddress: prev.name ? `${prev.name.toLowerCase().replace(/\s+/g, '.')}@abdm` : prev.abhaAddress,
    }));
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name: newName,
      abhaAddress: newName ? `${newName.toLowerCase().replace(/\s+/g, '.')}@abdm` : prev.abhaAddress,
    }));
  };

  const handleCopyAbha = () => {
    if (!formData.abhaId) return;
    navigator.clipboard?.writeText(formData.abhaId);
    setCopiedAbha(true);
    if (onNotify) onNotify('ABHA ID copied to clipboard.', 'info');
    setTimeout(() => setCopiedAbha(false), 2000);
  };

  const handleUseDemo = () => {
    setFormData({
      ...DEMO_PATIENT_PROFILE,
      language: formData.language,
      mode: formData.mode,
    });
    if (onNotify) onNotify('Loaded official ABDM sample patient profile.', 'info');
  };

  const handleDownloadCard = () => {
    if (onNotify) {
      onNotify('Downloading digital ABHA Health Card (PDF / QR)...', 'success');
    }
  };

  const handleModeChange = (mode) => {
    setFormData((prev) => ({ ...prev, mode }));
    if (onSelectMode) onSelectMode(mode);
  };

  const handleLanguageChange = (lang) => {
    setFormData((prev) => ({ ...prev, language: lang }));
    if (onSelectLanguage) onSelectLanguage(lang);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);

    if (onSaveProfile) {
      onSaveProfile(formData);
    }

    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }, 400);
  };

  const initials = formData.name
    ? formData.name
        .split(' ')
        .map((p) => p[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'AB';

  const isElderly = formData.mode === 'elderly';

  return (
    <div className={`profile-page-root ${isElderly ? 'is-elderly-theme' : 'is-modern-theme'} ${currentTheme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
      {/* ── Top Header Navigation ── */}
      <header className="profile-page-header">
        <div className="profile-header-container">
          <div className="profile-header-left">
            <button
              type="button"
              className="profile-back-btn"
              onClick={onBack}
              aria-label="Back to PreConsultation"
            >
              <ArrowLeft size={18} />
              <span>{isElderly ? 'वापस जाएं (Back to Intake)' : 'Back to Consultation'}</span>
            </button>

            <div className="profile-brand-lockup">
              <span className="profile-brand-title">PreConsult</span>
              <span className="profile-brand-badge">ABDM Official Portal</span>
            </div>
          </div>

          <div className="profile-header-actions">
            <ThemeToggle theme={currentTheme} onToggle={onToggleTheme} />
            <button
              type="button"
              className="profile-nav-logout-btn"
              onClick={onLogout}
              title="Log out from session"
            >
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Profile Body Container ── */}
      <main className="profile-page-main">
        <div className="profile-container">
          {/* Banner Title */}
          <div className="profile-hero-banner">
            <div className="profile-hero-badge">
              <ShieldCheck size={16} />
              <span>Ayushman Bharat Digital Mission (ABDM) • NHA</span>
            </div>
            <h1 className="profile-hero-title">
              {isElderly ? 'मरीज प्रोफाइल और आभा स्वास्थ्य कार्ड' : 'Patient Profile & ABHA Identity'}
            </h1>
            <p className="profile-hero-sub">
              {isElderly
                ? 'अपनी आभा आईडी, व्यक्तिगत जानकारी, भाषा और प्रदर्शन मोड यहां बदलें।'
                : 'Manage your verified 14-digit Ayushman Bharat Health Account (ABHA), demographic credentials, clinical language, and accessibility modes.'}
            </p>
          </div>

          {/* ── 2-Column Responsive Layout ── */}
          <div className="profile-layout-grid">
            {/* ── LEFT COLUMN: Digital ABHA Card & ABDM Status ── */}
            <aside className="profile-sidebar-column">
              {/* Digital ABHA Card */}
              <div className="profile-card abha-showcase-card">
                {/* Tricolor Government Ribbon */}
                <div className="abha-showcase-tricolor" />

                <div className="abha-showcase-head">
                  <div className="abha-emblem-group">
                    <Building2 size={24} className="abha-emblem-icon" />
                    <div>
                      <h4>National Health Authority</h4>
                      <span>Government of India • MoHFW</span>
                    </div>
                  </div>
                  <div className="abha-verified-chip">
                    <CheckCircle2 size={13} />
                    <span>Verified ABHA</span>
                  </div>
                </div>

                <div className="abha-showcase-content">
                  <div className="abha-avatar-circle">
                    <span>{initials}</span>
                    <span className="abha-avatar-shield" title="ABDM Linked">
                      <ShieldCheck size={12} />
                    </span>
                  </div>

                  <div className="abha-info-block">
                    <h3 className="abha-patient-heading">{formData.name || 'Patient Name'}</h3>
                    
                    <div className="abha-id-container">
                      <div className="abha-id-label">ABHA Number</div>
                      <div className="abha-id-value-row">
                        <span className="abha-id-value">{formData.abhaId || '91-XXXX-XXXX-XXXX'}</span>
                        <button
                          type="button"
                          className="abha-copy-btn"
                          onClick={handleCopyAbha}
                          title="Copy ABHA Number"
                          aria-label="Copy ABHA Number"
                        >
                          {copiedAbha ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                          <span>{copiedAbha ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="abha-meta-grid">
                      <div className="abha-meta-item">
                        <span className="meta-lbl">ABHA Address</span>
                        <strong className="meta-val">{formData.abhaAddress || 'user@abdm'}</strong>
                      </div>
                      <div className="abha-meta-item">
                        <span className="meta-lbl">Gender</span>
                        <strong className="meta-val">{formData.gender || '—'}</strong>
                      </div>
                      <div className="abha-meta-item">
                        <span className="meta-lbl">Age</span>
                        <strong className="meta-val">{formData.age ? `${formData.age} Yrs` : '—'}</strong>
                      </div>
                      <div className="abha-meta-item">
                        <span className="meta-lbl">Blood Group</span>
                        <strong className="meta-val meta-blood">{formData.bloodGroup || '—'}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="abha-qr-section">
                    <div className="abha-qr-box">
                      <QrCode size={56} />
                      <span>Scan ABHA</span>
                    </div>
                    <div className="abha-qr-desc">
                      <small>Official ABDM QR Code for fast OPD token generation and instant hospital record sharing.</small>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="abha-card-footer-actions">
                  <button
                    type="button"
                    className="abha-download-btn"
                    onClick={handleDownloadCard}
                  >
                    <Download size={15} />
                    <span>Download ABHA Card (PDF)</span>
                  </button>
                  <button
                    type="button"
                    className="abha-demo-fill-btn"
                    onClick={handleUseDemo}
                  >
                    <Sparkles size={14} />
                    <span>Auto-fill Sample ABHA</span>
                  </button>
                </div>
              </div>

              {/* ABDM Security & Consent Info Card */}
              <div className="profile-card abha-consent-card">
                <div className="consent-head">
                  <Lock size={16} className="consent-lock-icon" />
                  <h4>ABDM Health Locker & Security</h4>
                </div>
                <ul className="consent-features">
                  <li>
                    <Check size={14} className="consent-check" />
                    <span>256-bit AES End-to-End Encryption</span>
                  </li>
                  <li>
                    <Check size={14} className="consent-check" />
                    <span>Consented Data Sharing with PreConsult OPD Doctors</span>
                  </li>
                  <li>
                    <Check size={14} className="consent-check" />
                    <span>Ayush & Allopathic Unified Health Records (EHR)</span>
                  </li>
                </ul>
              </div>
            </aside>

            {/* ── RIGHT COLUMN: Full Edit Form & Settings ── */}
            <div className="profile-main-column">
              <form onSubmit={handleSubmit} className="profile-full-form">
                {/* ── Section 1: Demographics & ABHA Credentials ── */}
                <div className="profile-card form-section-card">
                  <div className="section-card-header">
                    <div className="section-icon-badge">
                      <User size={18} />
                    </div>
                    <div>
                      <h2 className="section-title">Demographic & Identification Details</h2>
                      <p className="section-subtitle">Official details linked to your Ayushman Bharat Health Account.</p>
                    </div>
                  </div>

                  <div className="form-fields-grid">
                    {/* Full Name */}
                    <div className="form-field-group span-full">
                      <label htmlFor="p-name" className="field-label">
                        Full Name (as per Aadhaar / ABHA) <span className="req">*</span>
                      </label>
                      <div className="field-input-wrap">
                        <User size={17} className="field-icon" />
                        <input
                          id="p-name"
                          type="text"
                          value={formData.name}
                          onChange={handleNameChange}
                          placeholder="e.g. Ramesh Kumar"
                          required
                        />
                      </div>
                    </div>

                    {/* ABHA Number */}
                    <div className="form-field-group">
                      <label htmlFor="p-abha" className="field-label">
                        14-Digit ABHA ID <span className="req">*</span>
                      </label>
                      <div className="field-input-wrap">
                        <CreditCard size={17} className="field-icon" />
                        <input
                          id="p-abha"
                          type="text"
                          value={formData.abhaId}
                          onChange={handleAbhaChange}
                          placeholder="91-XXXX-XXXX-XXXX"
                          maxLength={17}
                          required
                        />
                      </div>
                      <small className="field-help">Formats automatically into standard XX-XXXX-XXXX-XXXX</small>
                    </div>

                    {/* ABHA Address */}
                    <div className="form-field-group">
                      <label htmlFor="p-abha-addr" className="field-label">
                        ABHA Address (@abdm Handle)
                      </label>
                      <div className="field-input-wrap">
                        <ShieldCheck size={17} className="field-icon" />
                        <input
                          id="p-abha-addr"
                          type="text"
                          value={formData.abhaAddress}
                          onChange={(e) => setFormData({ ...formData, abhaAddress: e.target.value })}
                          placeholder="ramesh.kumar@abdm"
                        />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div className="form-field-group">
                      <label htmlFor="p-phone" className="field-label">
                        Mobile Number (+91)
                      </label>
                      <div className="field-input-wrap">
                        <Phone size={17} className="field-icon" />
                        <input
                          id="p-phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="form-field-group">
                      <label htmlFor="p-email" className="field-label">
                        Email Address
                      </label>
                      <div className="field-input-wrap">
                        <Mail size={17} className="field-icon" />
                        <input
                          id="p-email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="patient@example.com"
                        />
                      </div>
                    </div>

                    {/* Age & Gender */}
                    <div className="form-field-group">
                      <label htmlFor="p-age" className="field-label">
                        Age (Years)
                      </label>
                      <div className="field-input-wrap">
                        <Calendar size={17} className="field-icon" />
                        <input
                          id="p-age"
                          type="number"
                          min="1"
                          max="120"
                          value={formData.age}
                          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                          placeholder="58"
                        />
                      </div>
                    </div>

                    <div className="form-field-group">
                      <label htmlFor="p-gender" className="field-label">
                        Gender
                      </label>
                      <select
                        id="p-gender"
                        className="field-select"
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other / Non-Binary</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>

                    {/* Blood Group */}
                    <div className="form-field-group">
                      <label htmlFor="p-blood" className="field-label">
                        Blood Group
                      </label>
                      <select
                        id="p-blood"
                        className="field-select"
                        value={formData.bloodGroup}
                        onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                      >
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>

                    {/* Emergency Contact */}
                    <div className="form-field-group">
                      <label htmlFor="p-emergency" className="field-label">
                        Emergency Contact
                      </label>
                      <div className="field-input-wrap">
                        <Heart size={17} className="field-icon" />
                        <input
                          id="p-emergency"
                          type="text"
                          value={formData.emergencyContact}
                          onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                          placeholder="+91 98765 01234 (Relative)"
                        />
                      </div>
                    </div>

                    {/* Residential Address */}
                    <div className="form-field-group span-full">
                      <label htmlFor="p-address" className="field-label">
                        Residential Address & PIN Code
                      </label>
                      <div className="field-input-wrap">
                        <MapPin size={17} className="field-icon" />
                        <input
                          id="p-address"
                          type="text"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder="House / Street, Area, City, State & PIN"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Section 2: Viewing Mode Preference (Elderly vs Modern) ── */}
                <div className="profile-card form-section-card">
                  <div className="section-card-header">
                    <div className="section-icon-badge">
                      <Accessibility size={18} />
                    </div>
                    <div>
                      <h2 className="section-title">Viewing Mode Preference / इंटरफ़ेस मोड</h2>
                      <p className="section-subtitle">
                        Switch accessibility styles. Configured exclusively here in your profile.
                      </p>
                    </div>
                  </div>

                  <div className="profile-mode-selector-grid">
                    {/* Modern Mode */}
                    <button
                      type="button"
                      className={`profile-mode-card ${formData.mode === 'modern' ? 'is-selected' : ''}`}
                      onClick={() => handleModeChange('modern')}
                    >
                      <div className="mode-card-header">
                        <div className="mode-card-icon modern-icon">
                          <Zap size={22} />
                        </div>
                        {formData.mode === 'modern' && (
                          <span className="mode-selected-badge">
                            <CheckCircle2 size={16} /> Active
                          </span>
                        )}
                      </div>
                      <h3 className="mode-card-title">{t.modernLabel || 'Modern Clinical Mode'}</h3>
                      <p className="mode-card-desc">
                        {t.modernTagline || 'High-density clinical dashboard, standard typography, dynamic transitions, and multi-view protocol tools.'}
                      </p>
                      <div className="mode-features-list">
                        <span>• Standard layout</span>
                        <span>• Compact metrics</span>
                        <span>• Quick toggles</span>
                      </div>
                    </button>

                    {/* Elderly / Accessible Mode */}
                    <button
                      type="button"
                      className={`profile-mode-card ${formData.mode === 'elderly' ? 'is-selected' : ''}`}
                      onClick={() => handleModeChange('elderly')}
                    >
                      <div className="mode-card-header">
                        <div className="mode-card-icon elderly-icon">
                          <Accessibility size={22} />
                        </div>
                        {formData.mode === 'elderly' && (
                          <span className="mode-selected-badge">
                            <CheckCircle2 size={16} /> Active
                          </span>
                        )}
                      </div>
                      <h3 className="mode-card-title">{t.elderlyLabel || 'Elderly / Accessible Mode'}</h3>
                      <p className="mode-card-desc">
                        {t.elderlyTagline || 'High-contrast large touch targets (48px+), simplified language, magnified readable text, and voice-assisted prompts.'}
                      </p>
                      <div className="mode-features-list">
                        <span>• Magnified fonts</span>
                        <span>• High-contrast borders</span>
                        <span>• Extra large buttons</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* ── Section 3: Preferred Language ── */}
                <div className="profile-card form-section-card">
                  <div className="section-card-header">
                    <div className="section-icon-badge">
                      <Globe size={18} />
                    </div>
                    <div>
                      <h2 className="section-title">Preferred Language / प्राथमिक भाषा</h2>
                      <p className="section-subtitle">
                        Select your preferred language for voice intake, AI triage, and questionnaires.
                      </p>
                    </div>
                  </div>

                  <div className="profile-lang-chips-grid">
                    {SUPPORTED_LANGUAGES.map((lang) => {
                      const isSelected = formData.language === lang.id;
                      return (
                        <button
                          key={lang.id}
                          type="button"
                          className={`profile-lang-pill ${isSelected ? 'is-selected' : ''}`}
                          onClick={() => handleLanguageChange(lang.id)}
                        >
                          <span className="lang-native">{lang.nativeLabel}</span>
                          <span className="lang-en">({lang.label})</span>
                          {isSelected && <Check size={14} className="lang-check" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ── Section 4: Sticky / Bottom Save & Logout Actions ── */}
                <div className="profile-actions-footer">
                  <button
                    type="button"
                    className="profile-footer-logout"
                    onClick={onLogout}
                  >
                    <LogOut size={16} />
                    <span>Log Out of Session</span>
                  </button>

                  <div className="profile-footer-right">
                    <button
                      type="button"
                      className="profile-footer-cancel"
                      onClick={onBack}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className={`profile-footer-save ${saveSuccess ? 'is-success' : ''}`}
                      disabled={isSaving}
                    >
                      {saveSuccess ? (
                        <>
                          <CheckCircle2 size={18} />
                          <span>Saved Successfully!</span>
                        </>
                      ) : isSaving ? (
                        <span>Saving...</span>
                      ) : (
                        <>
                          <Save size={18} />
                          <span>Save All Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
