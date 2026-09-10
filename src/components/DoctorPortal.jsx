import React, { useState, useEffect, useCallback } from 'react';
import {
  Stethoscope,
  Search,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Clock,
  FileText,
  Leaf,
  Pill,
  Save,
  Printer,
  ArrowLeft,
  Activity,
  User,
  X,
  Plus
} from 'lucide-react';
import ThemeToggle from './ThemeToggle.jsx';
import {
  getClinicalRecords,
  updateClinicalRecord,
  subscribeToRecords,
  getTriageSummary,
} from '../services/clinicalRecordsService.js';
import { changeDoctorPassword } from '../services/doctorAuthService.js';
import nidanLogo from '../assets/NIDAN_logo.png';
import './DoctorPortal.css';

const TRIAGE_ICONS = {
  RED_FLAG: <AlertOctagon size={12} />,
  URGENT: <AlertTriangle size={12} />,
  ROUTINE: <CheckCircle2 size={12} />,
};

const TRIAGE_CLASSES = {
  RED_FLAG: 'triage-red',
  URGENT: 'triage-urgent',
  ROUTINE: 'triage-routine',
};

const TRIAGE_LABELS = {
  RED_FLAG: 'Red Flag',
  URGENT: 'Urgent',
  ROUTINE: 'Routine',
};

const STATUS_LABELS = {
  pending: 'Pending',
  'in-consultation': 'In Consultation',
  completed: 'Completed',
};

function formatTime(ts) {
  if (!ts) return '—';
  const d = new Date(ts);
  const now = new Date();
  const diffMin = Math.round((now - d) / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default function DoctorPortal({ theme, onToggleTheme, onSwitchRole, doctorProfile, onLogout }) {
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({ total: 0, red_flag: 0, urgent: 0, routine: 0, completed: 0, pending: 0 });
  const [selectedId, setSelectedId] = useState(null);
  const [filterTab, setFilterTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Editable doctor workspace state
  const [doctorNote, setDoctorNote] = useState('');
  const [activeStatus, setActiveStatus] = useState('pending');
  const [rxItems, setRxItems] = useState([]);
  const [rxMed, setRxMed] = useState('');
  const [rxDose, setRxDose] = useState('');
  const [rxFreq, setRxFreq] = useState('');
  const [showPasswordPanel, setShowPasswordPanel] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  // Load records
  const refreshRecords = useCallback(() => {
    const recs = getClinicalRecords();
    setRecords(recs);
    setSummary(getTriageSummary());
  }, []);

  useEffect(() => {
    refreshRecords();
    const unsub = subscribeToRecords((updated) => {
      const sorted = [...updated].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setRecords(sorted);
      setSummary(getTriageSummary());
    });
    return unsub;
  }, [refreshRecords]);

  // Sync workspace state when selected record changes
  useEffect(() => {
    if (!selectedId) return;
    const rec = records.find((r) => r.id === selectedId);
    if (!rec) return;
    setDoctorNote(rec.doctorNote || '');
    setActiveStatus(rec.status || 'pending');
    setRxItems(rec.prescription || []);
  }, [selectedId, records]);

  const selectedRecord = records.find((r) => r.id === selectedId) || null;

  // ── Filter & Search ──────────────────────────────────────────────────────
  const filteredRecords = records.filter((r) => {
    const matchesFilter =
      filterTab === 'all' ||
      (filterTab === 'redflag' && r.intake?.triage_urgency === 'RED_FLAG' && r.status !== 'completed') ||
      (filterTab === 'urgent' && r.intake?.triage_urgency === 'URGENT' && r.status !== 'completed') ||
      (filterTab === 'routine' && r.intake?.triage_urgency === 'ROUTINE' && r.status !== 'completed') ||
      (filterTab === 'completed' && r.status === 'completed');

    if (!searchQuery) return matchesFilter;
    const q = searchQuery.toLowerCase();
    return (
      matchesFilter &&
      (
        r.patientInfo?.name?.toLowerCase().includes(q) ||
        r.id?.toLowerCase().includes(q) ||
        r.intake?.chief_complaint?.toLowerCase().includes(q)
      )
    );
  });

  // ── Save Consultation ────────────────────────────────────────────────────
  const handleSave = () => {
    if (!selectedId) return;
    updateClinicalRecord(selectedId, {
      status: activeStatus,
      doctorNote,
      prescription: rxItems,
    });
    refreshRecords();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // ── Add Rx ───────────────────────────────────────────────────────────────
  const handleAddRx = () => {
    if (!rxMed.trim()) return;
    setRxItems((prev) => [...prev, {
      medicine: rxMed.trim(),
      dosage: rxDose.trim() || '—',
      frequency: rxFreq.trim() || '—',
    }]);
    setRxMed('');
    setRxDose('');
    setRxFreq('');
  };

  // ── Print Summary ────────────────────────────────────────────────────────
  const handlePrint = () => {
    window.print();
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setPasswordMessage('');
    if (newPassword.length < 8) {
      setPasswordMessage('New password must contain at least 8 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordMessage('New passwords do not match.');
      return;
    }
    try {
      await changeDoctorPassword(doctorProfile.username, currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setPasswordMessage('Password changed successfully.');
    } catch (error) {
      setPasswordMessage(error.message);
    }
  };

  return (
    <div className="doctor-portal">
      {/* ── Header ── */}
      <header className="dp-header">
        <div className="dp-header-inner">
          <div className="dp-header-left">
            <img src={nidanLogo} alt="NIDAN Logo" className="dp-header-logo-img" />
            <div className="dp-header-title">
              <h1>Hi, {doctorProfile?.name || 'Doctor'}</h1>
              <span>{doctorProfile?.specialty || 'Clinical Practice'} • NIDAN OPD</span>
            </div>
          </div>
          <div className="dp-header-actions">
            <button
              type="button"
              className="dp-switch-role-btn"
              onClick={() => onSwitchRole('role-select')}
            >
              <ArrowLeft size={14} />
              Switch Role
            </button>
            <div className="dp-doctor-profile" aria-label="Signed-in doctor profile">
              <span className="dp-doctor-avatar">{doctorProfile?.name?.replace('Dr. ', '').charAt(0) || 'D'}</span>
              <span className="dp-doctor-profile-copy">
                <strong>{doctorProfile?.name || 'Doctor'}</strong>
                <small>{doctorProfile?.registration || 'Verified clinician'}</small>
              </span>
            </div>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>
        </div>
      </header>

      <div className="dp-account-actions">
        <span>Account settings</span>
        <button type="button" className="dp-account-btn" onClick={() => setShowPasswordPanel((visible) => !visible)}>
          Change Password
        </button>
        <button type="button" className="dp-account-btn dp-logout-btn" onClick={onLogout}>
          Log Out
        </button>
      </div>

      {showPasswordPanel && (
        <form className="dp-password-panel" onSubmit={handleChangePassword}>
          <strong>Change Password</strong>
          <input type="password" placeholder="Current password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required />
          <input type="password" placeholder="New password (8+ characters)" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required />
          <input type="password" placeholder="Confirm new password" value={confirmNewPassword} onChange={(event) => setConfirmNewPassword(event.target.value)} required />
          <button type="submit" className="dp-btn-save">Update Password</button>
          {passwordMessage && <span className="dp-password-message">{passwordMessage}</span>}
        </form>
      )}

      {/* ── Triage Metrics Bar ── */}
      <div className="dp-metrics-bar" role="status" aria-label="OPD triage summary">
        <div className="dp-metric metric-total">
          <span className="dp-metric-value">{summary.total}</span>
          <span className="dp-metric-label">Total</span>
        </div>
        <div className="dp-metrics-divider" />
        <div className="dp-metric metric-redflag">
          <AlertOctagon size={14} />
          <span className="dp-metric-value">{summary.red_flag}</span>
          <span className="dp-metric-label">Red Flag</span>
        </div>
        <div className="dp-metric metric-urgent">
          <AlertTriangle size={14} />
          <span className="dp-metric-value">{summary.urgent}</span>
          <span className="dp-metric-label">Urgent</span>
        </div>
        <div className="dp-metric metric-routine">
          <CheckCircle2 size={14} />
          <span className="dp-metric-value">{summary.routine}</span>
          <span className="dp-metric-label">Routine</span>
        </div>
        <div className="dp-metrics-divider" />
        <div className="dp-metric metric-completed">
          <span className="dp-metric-value">{summary.completed}</span>
          <span className="dp-metric-label">Completed</span>
        </div>
        <div className="dp-live-badge">
          <span className="dp-live-dot" />
          Live Sync
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="dp-main">
        {/* ── Left: Triage Queue ── */}
        <aside className="dp-queue-panel">
          <div className="dp-queue-header">
            <span className="dp-queue-title">OPD Triage Queue</span>

            {/* Search */}
            <div className="dp-search-wrap">
              <Search size={14} color="var(--text-muted)" />
              <input
                type="search"
                placeholder="Patient name or complaint…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search patients"
              />
            </div>

            {/* Filter Tabs */}
            <div className="dp-filter-tabs" role="tablist">
              {[
                { id: 'all', label: `All (${records.length})` },
                { id: 'redflag', label: '🔴 Red Flag', cls: 'tab-redflag' },
                { id: 'urgent', label: '🟡 Urgent', cls: 'tab-urgent' },
                { id: 'routine', label: '🟢 Routine', cls: 'tab-routine' },
                { id: 'completed', label: '✓ Done' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={filterTab === tab.id}
                  className={`dp-filter-tab ${tab.cls || ''} ${filterTab === tab.id ? 'is-active' : ''}`}
                  onClick={() => setFilterTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Queue List */}
          <div className="dp-queue-list">
            {filteredRecords.length === 0 && (
              <div className="dp-queue-empty">
                No patients match this filter.
              </div>
            )}
            {filteredRecords.map((rec) => (
              <button
                key={rec.id}
                type="button"
                className={`dp-queue-item ${selectedId === rec.id ? 'is-selected' : ''}`}
                onClick={() => setSelectedId(rec.id)}
              >
                <div className="dp-queue-item-top">
                  <div>
                    <div className="dp-queue-item-name">
                      {rec.patientInfo?.name || 'Anonymous Patient'}
                      {rec.patientInfo?.isElderly && (
                        <span className="dp-elderly-badge" style={{ marginLeft: '0.4rem' }}>🧓 Senior</span>
                      )}
                    </div>
                    <div className="dp-queue-item-meta">
                      {rec.patientInfo?.age && `${rec.patientInfo.age}yr `}
                      {rec.patientInfo?.gender} •{' '}
                      {rec.patientInfo?.languageLabel || rec.patientInfo?.language}
                    </div>
                    <div className="dp-queue-time">{formatTime(rec.timestamp)}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'flex-end' }}>
                    <span className={`dp-triage-pill ${TRIAGE_CLASSES[rec.intake?.triage_urgency] || 'triage-routine'}`}>
                      {TRIAGE_ICONS[rec.intake?.triage_urgency]}
                      {TRIAGE_LABELS[rec.intake?.triage_urgency] || rec.intake?.triage_urgency}
                    </span>
                    <span className={`dp-status-pill status-${rec.status}`}>
                      {STATUS_LABELS[rec.status] || rec.status}
                    </span>
                  </div>
                </div>
                <div className="dp-queue-item-complaint">
                  {rec.intake?.chief_complaint || '—'}
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* ── Right: Clinical Workspace ── */}
        <section className="dp-workspace">
          {!selectedRecord ? (
            <div className="dp-workspace-empty">
              <FileText size={48} />
              <p>Select a patient from the queue to view their clinical record.</p>
            </div>
          ) : (
            <>
              {/* Patient Summary Bar */}
              <div className="dp-patient-bar">
                <div className="dp-patient-info-group">
                  <span className="dp-patient-name">
                    <User size={14} style={{ display: 'inline', marginRight: '0.35rem', verticalAlign: 'middle' }} />
                    {selectedRecord.patientInfo?.name || 'Anonymous Patient'}
                    {selectedRecord.patientInfo?.isElderly && ' 🧓'}
                  </span>
                  <span className="dp-patient-details">
                    {selectedRecord.patientInfo?.age && `${selectedRecord.patientInfo.age} yr`}
                    {selectedRecord.patientInfo?.gender && ` • ${selectedRecord.patientInfo.gender}`}
                  </span>
                  <span className="dp-patient-lang-badge">
                    🌐 {selectedRecord.patientInfo?.languageLabel || selectedRecord.patientInfo?.language || 'Unknown'}
                  </span>
                  <span className={`dp-triage-pill ${TRIAGE_CLASSES[selectedRecord.intake?.triage_urgency] || ''}`} style={{ fontSize: '0.78rem', padding: '0.25rem 0.6rem' }}>
                    {TRIAGE_ICONS[selectedRecord.intake?.triage_urgency]}
                    {TRIAGE_LABELS[selectedRecord.intake?.triage_urgency]}
                  </span>
                </div>
                <span className="dp-visit-time">
                  <Clock size={12} style={{ display: 'inline', marginRight: '0.25rem', verticalAlign: 'middle' }} />
                  {formatTime(selectedRecord.timestamp)}
                  {' • '}{selectedRecord.id}
                </span>
              </div>

              <div className="dp-workspace-content">
                {/* ── Section 1: Triage Reason ── */}
                {selectedRecord.intake?.triage_reason && (
                  <div className="dp-section-card">
                    <div className="dp-section-header" style={{ background: selectedRecord.intake?.triage_urgency === 'RED_FLAG' ? 'var(--accent-emergency-bg)' : undefined }}>
                      <span className="dp-section-icon">
                        {TRIAGE_ICONS[selectedRecord.intake?.triage_urgency]}
                      </span>
                      <span className="dp-section-title">
                        Triage Alert — {TRIAGE_LABELS[selectedRecord.intake?.triage_urgency]}
                      </span>
                    </div>
                    <div className="dp-section-body">
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                        {selectedRecord.intake.triage_reason}
                      </p>
                    </div>
                  </div>
                )}

                {/* ── Section 2: Patient Voice Transcript ── */}
                <div className="dp-section-card">
                  <div className="dp-section-header">
                    <Activity size={15} className="dp-section-icon" />
                    <span className="dp-section-title">Voice Transcript</span>
                    <span style={{ marginLeft: 'auto', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      Detected: {selectedRecord.intake?.detected_language || '—'}
                    </span>
                  </div>
                  <div className="dp-section-body">
                    <div className="dp-transcript-grid">
                      <div className="dp-transcript-box">
                        <div className="dp-transcript-label">🗣 Patient (Native Script)</div>
                        <p className="dp-transcript-text">{selectedRecord.intake?.original_transcript || '—'}</p>
                      </div>
                      <div className="dp-transcript-box">
                        <div className="dp-transcript-label">📄 Clinical English (AI Translated)</div>
                        <p className="dp-transcript-text">{selectedRecord.intake?.translated_clinical_english || '—'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Section 3: Structured SOAP Data ── */}
                <div className="dp-section-card">
                  <div className="dp-section-header">
                    <FileText size={15} className="dp-section-icon" />
                    <span className="dp-section-title">Clinical Intake — SOAP</span>
                  </div>
                  <div className="dp-section-body">
                    <div className="dp-section-body-field">
                      <div className="dp-soap-label">Chief Complaint</div>
                      <div className="dp-soap-value" style={{ fontWeight: 600 }}>{selectedRecord.intake?.chief_complaint || '—'}</div>
                    </div>
                    <div className="dp-section-body-field">
                      <div className="dp-soap-label">Duration</div>
                      <div className="dp-soap-value">{selectedRecord.intake?.duration || '—'}</div>
                    </div>
                    {selectedRecord.intake?.associated_symptoms?.length > 0 && (
                      <div className="dp-section-body-field">
                        <div className="dp-soap-label">Associated Symptoms</div>
                        <div className="dp-tag-list">
                          {selectedRecord.intake.associated_symptoms.map((s, i) => (
                            <span key={i} className="dp-tag tag-symptom">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedRecord.intake?.medications_mentioned?.length > 0 && (
                      <div className="dp-section-body-field" style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
                        <div className="dp-soap-label">Medications Reported</div>
                        <div className="dp-tag-list">
                          {selectedRecord.intake.medications_mentioned.map((m, i) => (
                            <span key={i} className="dp-tag tag-med">
                              <Pill size={10} style={{ display: 'inline', marginRight: '0.25rem' }} />
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Section 4: Ayurvedic & AYUSH Factors ── */}
                {selectedRecord.intake?.ayurvedic_factors && (
                  <div className="dp-section-card">
                    <div className="dp-section-header">
                      <Leaf size={15} className="dp-section-icon" style={{ color: 'var(--accent-success)' }} />
                      <span className="dp-section-title">Ayurvedic &amp; AYUSH Factors</span>
                    </div>
                    <div className="dp-section-body">
                      <div className="dp-ayur-grid">
                        <div className="dp-ayur-field">
                          <label>Dosha Imbalance</label>
                          <span>{selectedRecord.intake.ayurvedic_factors.dosha_imbalance || 'Not detected'}</span>
                        </div>
                        <div className="dp-ayur-field">
                          <label>Agni (Digestive Fire)</label>
                          <span>{selectedRecord.intake.ayurvedic_factors.agni_status || 'Not detected'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Section 5: Doctor Action Pad ── */}
                <div className="dp-action-pad">
                  <div className="dp-action-pad-title">
                    <Stethoscope size={15} />
                    Clinical Workspace — Doctor Actions
                  </div>

                  {/* Status switcher */}
                  <div>
                    <div className="dp-soap-label" style={{ marginBottom: '0.45rem' }}>Consultation Status</div>
                    <div className="dp-status-switcher">
                      {[
                        { value: 'pending', label: 'Pending' },
                        { value: 'in-consultation', label: 'In Consultation' },
                        { value: 'completed', label: '✓ Completed' },
                      ].map((s) => (
                        <button
                          key={s.value}
                          type="button"
                          className={`dp-status-btn ${activeStatus === s.value ? `is-active-${s.value.replace('-', '')}` : ''}`}
                          onClick={() => setActiveStatus(s.value)}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Doctor note */}
                  <div>
                    <div className="dp-soap-label" style={{ marginBottom: '0.45rem' }}>Clinical Impression &amp; Doctor Notes</div>
                    <textarea
                      className="dp-doctor-note"
                      value={doctorNote}
                      onChange={(e) => setDoctorNote(e.target.value)}
                      placeholder="Enter clinical impression, differential diagnoses, examination findings, management plan…"
                    />
                  </div>

                  {/* Prescription builder */}
                  <div className="dp-rx-builder">
                    <div className="dp-rx-label">Prescription / Rx Builder</div>
                    <div className="dp-rx-row">
                      <input
                        className="dp-rx-input"
                        type="text"
                        placeholder="Medicine / Formulation"
                        value={rxMed}
                        onChange={(e) => setRxMed(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddRx()}
                      />
                      <input
                        className="dp-rx-input"
                        type="text"
                        placeholder="Dose (e.g. 500mg)"
                        value={rxDose}
                        onChange={(e) => setRxDose(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddRx()}
                      />
                      <input
                        className="dp-rx-input"
                        type="text"
                        placeholder="Frequency"
                        value={rxFreq}
                        onChange={(e) => setRxFreq(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddRx()}
                      />
                      <button type="button" className="dp-rx-add-btn" onClick={handleAddRx}>
                        <Plus size={14} /> Add
                      </button>
                    </div>
                    {rxItems.length > 0 && (
                      <div className="dp-rx-list">
                        {rxItems.map((rx, i) => (
                          <div key={i} className="dp-rx-item">
                            <span className="dp-rx-item-text">
                              <strong>{rx.medicine}</strong>
                              {rx.dosage !== '—' && ` — ${rx.dosage}`}
                              {rx.frequency !== '—' && ` • ${rx.frequency}`}
                              {rx.duration && ` • ${rx.duration}`}
                            </span>
                            <button
                              type="button"
                              className="dp-rx-remove-btn"
                              onClick={() => setRxItems((prev) => prev.filter((_, j) => j !== i))}
                              aria-label="Remove prescription item"
                            >
                              <X size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="dp-action-btns">
                    <button type="button" className="dp-btn-save" onClick={handleSave}>
                      <Save size={15} />
                      Save Consultation &amp; Issue Rx
                    </button>
                    <button type="button" className="dp-btn-print" onClick={handlePrint}>
                      <Printer size={15} />
                      Print Summary
                    </button>
                  </div>

                  {saveSuccess && (
                    <div className="dp-save-toast">
                      ✓ Consultation saved successfully.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
