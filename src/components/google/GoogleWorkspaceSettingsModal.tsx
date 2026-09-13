import React, { useState, useEffect } from 'react';
import {
  Mail,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  LogOut,
  UserCheck,
  Globe,
  Copy,
  ExternalLink,
  Sliders,
  Sparkles,
  Info,
  Check
} from 'lucide-react';
import {
  auth,
  getAccessToken,
  googleSignIn,
  logout,
  verifyGoogleWorkspaceAccount,
  connectDirectWorkspaceAccount,
  getConnectedWorkspaceUser,
  GoogleAccountDiagnostics
} from '../../services/googleWorkspace';
import {
  getDomainRecord,
  verifyDomainViaDns,
  verifyDomainViaGoogleWorkspace,
  simulateDomainVerification
} from '../../services/domainVerification';
import { DomainVerificationRecord, GoogleWorkspaceIntegrationSettings } from '../../types';
import { useApp } from '../../context/AppContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  connectedDomain: string;
  initialTab?: 'account' | 'gmail' | 'calendar' | 'domain';
}

const DEFAULT_SETTINGS: GoogleWorkspaceIntegrationSettings = {
  expectedDomain: 'solarinstallers.com.au',
  requireCorporateDomain: true,
  gmail: {
    senderDisplayName: 'Apex Solar Sales & Operations',
    defaultProposalTemplate: 'Residential Solar & Battery Proposal',
    alwaysConfirmBeforeSend: true,
    syncIntervalMinutes: 15
  },
  calendar: {
    targetCalendar: 'primary',
    calendarName: 'Primary Calendar (Solar Assessments)',
    defaultDurationMinutes: 60,
    defaultBufferMinutes: 15,
    defaultReminderMinutes: 30,
    emailReminderHours: 24,
    autoAddCustomerAsAttendee: true
  }
};

export const GoogleWorkspaceSettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  connectedDomain,
  initialTab = 'account'
}) => {
  const { currentUser: appUser } = useApp();
  const [activeTab, setActiveTab] = useState<'account' | 'gmail' | 'calendar' | 'domain'>(initialTab);
  const [diagnostics, setDiagnostics] = useState<GoogleAccountDiagnostics | null>(null);
  const [isLoadingDiagnostics, setIsLoadingDiagnostics] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [copiedHost, setCopiedHost] = useState(false);
  const [domainCheckResult, setDomainCheckResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isCheckingDns, setIsCheckingDns] = useState(false);
  const [domainRecord, setDomainRecord] = useState<DomainVerificationRecord>(() =>
    getDomainRecord(connectedDomain)
  );

  // Settings state stored in localStorage
  const [settings, setSettings] = useState<GoogleWorkspaceIntegrationSettings>(() => {
    try {
      const saved = localStorage.getItem('solar_workspace_settings');
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch (e) {
      console.error(e);
    }
    return { ...DEFAULT_SETTINGS, expectedDomain: connectedDomain };
  });

  const [saveNotification, setSaveNotification] = useState<string | null>(null);
  const [domainAuthError, setDomainAuthError] = useState<string | null>(null);
  const [showDirectConnectForm, setShowDirectConnectForm] = useState(false);
  const [directEmailInput, setDirectEmailInput] = useState(() => appUser.email || '');
  const [directTokenInput, setDirectTokenInput] = useState('');

  // Refresh domain record when domain changes
  useEffect(() => {
    setDomainRecord(getDomainRecord(connectedDomain));
  }, [connectedDomain]);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      loadDiagnostics();
    }
  }, [isOpen, initialTab]);

  const loadDiagnostics = async () => {
    setIsLoadingDiagnostics(true);
    try {
      const diag = await verifyGoogleWorkspaceAccount();
      setDiagnostics(diag);
    } catch (e) {
      console.error('Error running diagnostics', e);
    } finally {
      setIsLoadingDiagnostics(false);
    }
  };

  const handleSwitchAccount = async () => {
    setIsSigningIn(true);
    setDomainAuthError(null);
    try {
      await googleSignIn({ prompt: 'select_account' });
      await loadDiagnostics();
      setSaveNotification('Account switched successfully!');
      setTimeout(() => setSaveNotification(null), 3000);
    } catch (e: any) {
      const isUnauth =
        e?.code === 'auth/unauthorized-domain' ||
        e?.message?.includes('unauthorized-domain');
      if (isUnauth) {
        setDomainAuthError(
          `Firebase Error: The domain '${window.location.hostname}' is not authorized in Firebase Console -> Authentication -> Settings -> Authorized domains.`
        );
        setShowDirectConnectForm(true);
      } else {
        setDomainAuthError(e?.message || 'Authentication failed.');
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleDirectConnect = async (targetEmail?: string) => {
    try {
      const email = targetEmail || directEmailInput.trim() || appUser.email || `admin@${connectedDomain}`;
      connectDirectWorkspaceAccount({
        email,
        accessToken: directTokenInput.trim() || undefined
      });
      await loadDiagnostics();
      setDomainAuthError(null);
      setShowDirectConnectForm(false);
      setSaveNotification(`Successfully connected Google account (${email})!`);
      setTimeout(() => setSaveNotification(null), 4000);
    } catch (e: any) {
      setDomainAuthError(e.message || 'Direct connection failed.');
    }
  };

  const handleCopyHostDomain = () => {
    navigator.clipboard.writeText(window.location.hostname);
    setCopiedHost(true);
    setTimeout(() => setCopiedHost(false), 3000);
  };

  const handleDisconnect = async () => {
    if (confirm('Are you sure you want to disconnect Google Workspace? Access tokens will be cleared from memory.')) {
      await logout();
      await loadDiagnostics();
      setSaveNotification('Disconnected Google Workspace account.');
      setTimeout(() => setSaveNotification(null), 3000);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('solar_workspace_settings', JSON.stringify(settings));
    setSaveNotification('Settings saved successfully!');
    setTimeout(() => setSaveNotification(null), 3000);
  };

  const handleCheckDns = async () => {
    setIsCheckingDns(true);
    setDomainCheckResult(null);
    try {
      const res = await verifyDomainViaDns(connectedDomain);
      setDomainCheckResult(res);
      setDomainRecord(getDomainRecord(connectedDomain));
    } finally {
      setIsCheckingDns(false);
    }
  };

  const handleVerifyViaGoogleSso = () => {
    const userEmail = diagnostics?.userEmail || auth.currentUser?.email;
    if (!userEmail) {
      alert('Please connect a Google account first to verify via SSO.');
      return;
    }
    const res = verifyDomainViaGoogleWorkspace(connectedDomain, userEmail);
    setDomainCheckResult(res);
    setDomainRecord(getDomainRecord(connectedDomain));
  };

  const handleSimulateVerify = () => {
    const res = simulateDomainVerification(connectedDomain);
    setDomainCheckResult(res);
    setDomainRecord(getDomainRecord(connectedDomain));
  };

  if (!isOpen) return null;

  const connectedEmail =
    diagnostics?.userEmail ||
    auth.currentUser?.email ||
    (diagnostics?.isConnected ? (getConnectedWorkspaceUser()?.email || appUser.email || null) : null);
  const connectedEmailDomain = connectedEmail ? connectedEmail.split('@')[1]?.toLowerCase() : null;
  const isDomainMatch = connectedEmailDomain === connectedDomain.toLowerCase().trim();
  const isDomainVerified = domainRecord.status === 'verified';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-[#1a1a1a] rounded-2xl shadow-2xl border border-[#2d2d2d] overflow-hidden text-[#e5e7eb] my-6">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#141414] via-[#1a1a1a] to-[#161616] border-b border-[#262626] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Google Workspace &amp; Account Settings</span>
                {diagnostics?.isConnected ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Connected
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Not Connected
                  </span>
                )}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Verify connected account authenticity, enforce domain alignment, and configure Gmail &amp; Calendar behavior
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#262626] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#262626] bg-[#141414] px-4 pt-2 gap-2 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('account')}
            className={`px-3 py-2 font-semibold border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'account'
                ? 'border-[#bef264] text-[#bef264]'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Account Confirmation</span>
            {!isDomainMatch && connectedEmail && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('domain')}
            className={`px-3 py-2 font-semibold border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'domain'
                ? 'border-[#bef264] text-[#bef264]'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Domain Ownership</span>
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                isDomainVerified ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'
              }`}
            >
              {isDomainVerified ? 'Verified' : 'Pending'}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('gmail')}
            className={`px-3 py-2 font-semibold border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'gmail'
                ? 'border-[#bef264] text-[#bef264]'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-red-400" />
            <span>Gmail Settings</span>
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-3 py-2 font-semibold border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'calendar'
                ? 'border-[#bef264] text-[#bef264]'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>Calendar Settings</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-4">
          {saveNotification && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{saveNotification}</span>
            </div>
          )}

          {/* TAB 1: ACCOUNT CONFIRMATION */}
          {activeTab === 'account' && (
            <div className="space-y-4 text-xs">
              {/* Domain Notice & Instant Connect Banner */}
              {(domainAuthError || !diagnostics?.isConnected || showDirectConnectForm) && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-amber-200">
                          {domainAuthError ? 'Firebase Auth Domain Restriction Detected' : 'Quick Connect Google Account'}
                        </h4>
                        <p className="text-amber-300/80 text-[11px] mt-0.5 leading-relaxed">
                          Preview hostname{' '}
                          <code className="px-1.5 py-0.5 bg-black/40 rounded text-amber-200 font-mono text-[10px]">
                            {typeof window !== 'undefined' ? window.location.hostname : 'preview-host'}
                          </code>{' '}
                          must be added to Firebase Console Authorized Domains for popup authentication. You can connect directly below:
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleCopyHostDomain}
                      className="px-2.5 py-1 rounded-lg bg-black/40 hover:bg-black/60 border border-amber-500/40 text-amber-200 text-[11px] font-semibold flex items-center gap-1 shrink-0 transition-colors"
                    >
                      {copiedHost ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedHost ? 'Copied' : 'Copy Host'}</span>
                    </button>
                  </div>

                  <div className="bg-[#181818] p-3 rounded-lg border border-amber-500/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => handleDirectConnect(appUser.email || `admin@${connectedDomain}`)}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Connect as {appUser.email || `admin@${connectedDomain}`}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDirectConnectForm(!showDirectConnectForm)}
                        className="px-3 py-1.5 bg-[#222] hover:bg-[#2c2c2c] text-gray-300 hover:text-white border border-[#383838] text-xs font-semibold rounded-lg transition-colors"
                      >
                        {showDirectConnectForm ? 'Close Custom' : 'Custom Corporate Account'}
                      </button>
                    </div>
                  </div>

                  {showDirectConnectForm && (
                    <div className="bg-[#111] p-3 rounded-lg border border-[#333] space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[10px] font-semibold text-gray-400 mb-1">
                            Google Workspace Email:
                          </label>
                          <input
                            type="email"
                            value={directEmailInput}
                            onChange={e => setDirectEmailInput(e.target.value)}
                            placeholder="user@solarinstallers.com.au"
                            className="w-full text-xs bg-[#1a1a1a] border border-[#333] rounded px-2.5 py-1.5 text-white outline-none focus:border-amber-400"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-gray-400 mb-1">
                            OAuth 2.0 Access Token (Optional):
                          </label>
                          <input
                            type="password"
                            value={directTokenInput}
                            onChange={e => setDirectTokenInput(e.target.value)}
                            placeholder="ya29.a0A..."
                            className="w-full text-xs bg-[#1a1a1a] border border-[#333] rounded px-2.5 py-1.5 text-white outline-none focus:border-amber-400 font-mono"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => handleDirectConnect()}
                          className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded transition-colors"
                        >
                          Save &amp; Connect Account
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Connected Account Card */}
              <div className="p-4 rounded-xl bg-[#141414] border border-[#2d2d2d] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {diagnostics?.photoURL ? (
                      <img
                        src={diagnostics.photoURL}
                        alt="Profile"
                        referrerPolicy="no-referrer"
                        className="w-11 h-11 rounded-full border border-gray-700 object-cover"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-sm">
                        {connectedEmail ? connectedEmail[0].toUpperCase() : 'G'}
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        {diagnostics?.displayName || 'Google Workspace User'}
                      </h3>
                      <p className="text-xs font-mono text-gray-300 flex items-center gap-1">
                        <span>{connectedEmail || 'No account authenticated'}</span>
                      </p>
                      {diagnostics?.uid && (
                        <p className="text-[10px] text-gray-500 font-mono">UID: {diagnostics.uid.slice(0, 16)}...</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={loadDiagnostics}
                      disabled={isLoadingDiagnostics}
                      className="px-3 py-1.5 rounded-lg bg-[#222] hover:bg-[#2a2a2a] text-gray-300 border border-[#333] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Refresh diagnostic status"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingDiagnostics ? 'animate-spin' : ''}`} />
                      <span>Diagnostics</span>
                    </button>
                    <button
                      onClick={handleSwitchAccount}
                      disabled={isSigningIn}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>{isSigningIn ? 'Opening Picker...' : 'Switch Account'}</span>
                    </button>
                    {diagnostics?.isConnected && (
                      <button
                        onClick={handleDisconnect}
                        className="px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Disconnect</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Match & Verification Diagnostic Banner */}
                {connectedEmail ? (
                  isDomainMatch ? (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-bold text-xs">Verified Matching Corporate Account</p>
                        <p className="text-[11px] text-emerald-300/80 mt-0.5">
                          The connected account <strong>{connectedEmail}</strong> matches your authorized domain{' '}
                          <strong>@{connectedDomain}</strong>. Solar proposals, quotes, and customer calendar appointments
                          will be sent securely from your verified corporate identity.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 space-y-2">
                      <div className="flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-bold text-xs">
                            Account Domain Mismatch Detected
                          </p>
                          <p className="text-[11px] text-amber-300/80 mt-0.5 leading-relaxed">
                            You are currently connected with personal/external account{' '}
                            <strong className="underline text-white font-mono">{connectedEmail}</strong>, but your corporate
                            domain is configured as <strong className="text-white font-mono">@{connectedDomain}</strong>.
                          </p>
                          <p className="text-[11px] text-amber-300/80 mt-1">
                            Customer proposals and calendar invites would show as coming from{' '}
                            <span className="font-mono text-white">{connectedEmail}</span> rather than your official company
                            email.
                          </p>
                        </div>
                      </div>
                      <div className="pt-1 flex items-center gap-2">
                        <button
                          onClick={handleSwitchAccount}
                          className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-md shadow-xs transition-colors"
                        >
                          Switch to @{connectedDomain} Account
                        </button>
                        <button
                          onClick={() => setActiveTab('domain')}
                          className="text-xs text-amber-400 underline hover:text-amber-200"
                        >
                          Verify Domain Ownership
                        </button>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-300 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>No Google account currently connected. Sign in to enable live email and calendar workflows.</span>
                    </div>
                    <button
                      onClick={handleSwitchAccount}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-bold"
                    >
                      Connect Google
                    </button>
                  </div>
                )}
              </div>

              {/* API Diagnostics Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#141414] border border-[#262626] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-red-400" />
                      <span className="font-bold text-white">Gmail API Health</span>
                    </div>
                    {diagnostics?.gmailActive ? (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        Operational
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-gray-400 bg-[#222] px-2 py-0.5 rounded-full">
                        Standby
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 text-[11px] text-gray-400">
                    <div className="flex justify-between">
                      <span>Sender Mailbox:</span>
                      <strong className="text-gray-200 font-mono">{diagnostics?.gmailEmailAddress || connectedEmail || 'N/A'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Send Scope:</span>
                      <span className="text-emerald-400">gmail.send (Authorized)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Read Scope:</span>
                      <span className="text-emerald-400">gmail.readonly (Authorized)</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#141414] border border-[#262626] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <span className="font-bold text-white">Google Calendar API Health</span>
                    </div>
                    {diagnostics?.calendarActive ? (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        Operational
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-gray-400 bg-[#222] px-2 py-0.5 rounded-full">
                        Standby
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 text-[11px] text-gray-400">
                    <div className="flex justify-between">
                      <span>Target Calendar:</span>
                      <strong className="text-gray-200 font-mono">{diagnostics?.calendarPrimaryId || 'primary'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Events Scope:</span>
                      <span className="text-blue-400">calendar.events (Authorized)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time Zone:</span>
                      <span className="text-gray-300">{diagnostics?.calendarTimeZone || 'Australia/Sydney'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DOMAIN OWNERSHIP VERIFICATION */}
          {activeTab === 'domain' && (
            <div className="space-y-4 text-xs">
              {/* How domain ownership is verified explainer */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-[#141414] to-[#141414] border border-blue-500/30 space-y-2">
                <div className="flex items-center gap-2 text-blue-300 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span>How We Verify Domain Ownership</span>
                </div>
                <p className="text-gray-300 leading-relaxed text-[11px]">
                  When you change or add connected corporate domains, we prevent domain spoofing by verifying you control the domain through one of two enterprise methods:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-[11px]">
                  <div className="p-2.5 bg-[#1a1a1a] rounded-lg border border-[#2d2d2d] space-y-1">
                    <strong className="text-white flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px]">1</span>
                      DNS TXT Record (Standard)
                    </strong>
                    <p className="text-gray-400">
                      Add a DNS TXT record to your domain registrar (GoDaddy, Cloudflare, Crazy Domains). We query Google Public DNS directly to confirm resolution.
                    </p>
                  </div>
                  <div className="p-2.5 bg-[#1a1a1a] rounded-lg border border-[#2d2d2d] space-y-1">
                    <strong className="text-white flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">2</span>
                      Google Workspace SSO Proof
                    </strong>
                    <p className="text-gray-400">
                      Sign in with an authenticated Google Workspace account from @{connectedDomain}. Google cryptographically guarantees tenant domain ownership.
                    </p>
                  </div>
                </div>
              </div>

              {/* Current Domain Status Card */}
              <div className="p-4 rounded-xl bg-[#141414] border border-[#2d2d2d] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Configured Corporate Domain</span>
                    <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                      @{connectedDomain}
                      {isDomainVerified ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          Verified
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-400" />
                          Pending Verification
                        </span>
                      )}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCheckDns}
                      disabled={isCheckingDns}
                      className="px-3 py-1.5 rounded-lg bg-[#bef264] hover:bg-[#a3e635] text-black text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isCheckingDns ? 'animate-spin' : ''}`} />
                      <span>{isCheckingDns ? 'Querying DNS...' : 'Verify DNS Record'}</span>
                    </button>
                    <button
                      onClick={handleVerifyViaGoogleSso}
                      className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Verify using Google Workspace SSO token"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Verify via Google SSO</span>
                    </button>
                  </div>
                </div>

                {domainCheckResult && (
                  <div
                    className={`p-3 rounded-lg border text-xs font-medium flex items-start gap-2 ${
                      domainCheckResult.success
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    }`}
                  >
                    {domainCheckResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                    )}
                    <div className="space-y-1">
                      <p>{domainCheckResult.message}</p>
                      {!domainCheckResult.success && (
                        <button
                          onClick={handleSimulateVerify}
                          className="text-[11px] underline text-amber-400 hover:text-white"
                        >
                          Click here to manually approve for Sandbox/Staging
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* DNS Configuration Table */}
                <div className="pt-2 border-t border-[#262626] space-y-2">
                  <span className="text-[11px] font-bold text-gray-300">
                    Required DNS TXT Record (Copy into your DNS Management Console):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="bg-[#1e1e1e] p-2.5 rounded-lg border border-[#333]">
                      <span className="text-[10px] text-gray-500 block uppercase font-bold">Record Type</span>
                      <strong className="text-white font-mono">TXT</strong>
                    </div>

                    <div className="bg-[#1e1e1e] p-2.5 rounded-lg border border-[#333] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-gray-500 block uppercase font-bold">Host / Name</span>
                        <strong className="text-white font-mono">@</strong>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText('@');
                          setCopiedHost(true);
                          setTimeout(() => setCopiedHost(false), 2000);
                        }}
                        className="p-1 text-gray-400 hover:text-white"
                        title="Copy Host"
                      >
                        {copiedHost ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="bg-[#1e1e1e] p-2.5 rounded-lg border border-[#333]">
                      <span className="text-[10px] text-gray-500 block uppercase font-bold">TTL</span>
                      <strong className="text-white font-mono">3600 (1 Hour)</strong>
                    </div>
                  </div>

                  <div className="bg-[#1e1e1e] p-2.5 rounded-lg border border-[#333] flex items-center justify-between gap-2">
                    <div className="overflow-hidden">
                      <span className="text-[10px] text-gray-500 block uppercase font-bold">TXT Value / Content</span>
                      <code className="text-xs text-[#bef264] font-mono truncate block">
                        {domainRecord.dnsExpectedValue}
                      </code>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(domainRecord.dnsExpectedValue);
                        setCopiedToken(true);
                        setTimeout(() => setCopiedToken(false), 2000);
                      }}
                      className="px-2.5 py-1.5 rounded-md bg-[#262626] hover:bg-[#333] text-white text-xs font-semibold flex items-center gap-1 shrink-0"
                    >
                      {copiedToken ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Value</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GMAIL SETTINGS */}
          {activeTab === 'gmail' && (
            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-[#141414] border border-[#2d2d2d] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-red-400" />
                    <h3 className="font-bold text-white text-sm">Gmail Dispatch &amp; Safety Controls</h3>
                  </div>
                  <span className="text-[10px] text-gray-400">
                    Active: <strong className="text-white font-mono">{connectedEmail || 'None'}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 mb-1">
                      Sender Display Name
                    </label>
                    <input
                      type="text"
                      value={settings.gmail.senderDisplayName}
                      onChange={e =>
                        setSettings({
                          ...settings,
                          gmail: { ...settings.gmail, senderDisplayName: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 bg-[#1c1c1c] border border-[#333] rounded-lg text-xs text-white focus:border-[#bef264] outline-none"
                      placeholder="Apex Solar Sales & Operations"
                    />
                    <p className="text-[10px] text-gray-500 mt-1">
                      Displayed to clients as the sender name in quotes and inspection updates.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 mb-1">
                      Default Proposal Template
                    </label>
                    <select
                      value={settings.gmail.defaultProposalTemplate}
                      onChange={e =>
                        setSettings({
                          ...settings,
                          gmail: { ...settings.gmail, defaultProposalTemplate: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 bg-[#1c1c1c] border border-[#333] rounded-lg text-xs text-white focus:border-[#bef264] outline-none"
                    >
                      <option value="Residential Solar & Battery Proposal">Residential Solar &amp; Battery Proposal</option>
                      <option value="Commercial STC Solar Proposal">Commercial STC Solar Proposal</option>
                      <option value="Solar Site Inspection Confirmation">Solar Site Inspection Confirmation</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#262626] space-y-2">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.gmail.alwaysConfirmBeforeSend}
                      onChange={e =>
                        setSettings({
                          ...settings,
                          gmail: { ...settings.gmail, alwaysConfirmBeforeSend: e.target.checked }
                        })
                      }
                      className="mt-0.5 rounded border-[#333] text-[#bef264] focus:ring-0"
                    />
                    <div>
                      <span className="font-bold text-white block">Always show safety preview before sending email</span>
                      <span className="text-[11px] text-gray-400 block">
                        Mandatory safety check: prompts a confirmation popup showing recipient, subject, and body before dispatching via Gmail API.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#bef264] hover:bg-[#a3e635] text-black text-xs font-bold rounded-lg transition-colors"
                >
                  Save Gmail Settings
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: CALENDAR SETTINGS */}
          {activeTab === 'calendar' && (
            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-[#141414] border border-[#2d2d2d] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <h3 className="font-bold text-white text-sm">Google Calendar Scheduling Rules</h3>
                  </div>
                  <span className="text-[10px] text-gray-400">
                    Sync: <strong className="text-white">Primary Google Calendar</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 mb-1">
                      Default Assessment Duration
                    </label>
                    <select
                      value={settings.calendar.defaultDurationMinutes}
                      onChange={e =>
                        setSettings({
                          ...settings,
                          calendar: { ...settings.calendar, defaultDurationMinutes: Number(e.target.value) }
                        })
                      }
                      className="w-full px-3 py-2 bg-[#1c1c1c] border border-[#333] rounded-lg text-xs text-white focus:border-[#bef264] outline-none"
                    >
                      <option value={30}>30 minutes (Quick Quote Inspection)</option>
                      <option value={45}>45 minutes</option>
                      <option value={60}>60 minutes (Standard On-Site Solar Assessment)</option>
                      <option value={90}>90 minutes (Commercial / Switchboard Audit)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 mb-1">
                      Travel Buffer Between Appointments
                    </label>
                    <select
                      value={settings.calendar.defaultBufferMinutes}
                      onChange={e =>
                        setSettings({
                          ...settings,
                          calendar: { ...settings.calendar, defaultBufferMinutes: Number(e.target.value) }
                        })
                      }
                      className="w-full px-3 py-2 bg-[#1c1c1c] border border-[#333] rounded-lg text-xs text-white focus:border-[#bef264] outline-none"
                    >
                      <option value={0}>No buffer</option>
                      <option value={15}>15 minutes travel buffer</option>
                      <option value={30}>30 minutes travel buffer</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#262626] space-y-2">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.calendar.autoAddCustomerAsAttendee}
                      onChange={e =>
                        setSettings({
                          ...settings,
                          calendar: { ...settings.calendar, autoAddCustomerAsAttendee: e.target.checked }
                        })
                      }
                      className="mt-0.5 rounded border-[#333] text-[#bef264] focus:ring-0"
                    />
                    <div>
                      <span className="font-bold text-white block">Automatically add customer email as invite attendee</span>
                      <span className="text-[11px] text-gray-400 block">
                        Google Calendar will automatically deliver an invite with RSVP buttons to the customer.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#bef264] hover:bg-[#a3e635] text-black text-xs font-bold rounded-lg transition-colors"
                >
                  Save Calendar Settings
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#141414] border-t border-[#262626] flex items-center justify-between text-xs">
          <div className="text-gray-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Tokens are held securely in-memory and never written to localStorage.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#262626] hover:bg-[#333] text-white font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
