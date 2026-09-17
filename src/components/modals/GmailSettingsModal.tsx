import React, { useState, useEffect } from 'react';
import {
  Mail,
  ShieldCheck,
  RefreshCw,
  Power,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Send,
  Inbox,
  Database,
  Radio,
  Copy,
  Check,
  Search,
  User,
  FolderGit2,
  Clock,
  HelpCircle,
  X,
  FileCode2,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import {
  GmailStatus,
  GmailSetupInfo,
  CrmEmail,
  getGmailLiveStatus,
  getGmailSetupInfo,
  toggleGmailSendEnabled,
  getSyncedCrmEmails,
  triggerGmailSyncNow,
  disconnectGmailAccount,
  sendGmailEmail
} from '../../services/gmailService';
import { connectGmailWithGoogle, disconnectGoogleAccount } from '../../lib/firebaseAuth';
import { useApp } from '../../context/AppContext';

interface GmailSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'feed' | 'compose' | 'pubsub' | 'setup';
}

export const GmailSettingsModal: React.FC<GmailSettingsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'feed'
}) => {
  const { contacts = [], projects = [], leads = [], themeMode } = useApp();
  const isLight = themeMode === 'corporate-slate';

  const [activeTab, setActiveTab] = useState<'feed' | 'compose' | 'pubsub' | 'setup'>(initialTab);
  const [liveStatus, setLiveStatus] = useState<GmailStatus | null>(null);
  const [setupInfo, setSetupInfo] = useState<GmailSetupInfo | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [isTogglingSend, setIsTogglingSend] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [emails, setEmails] = useState<CrmEmail[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<CrmEmail | null>(null);

  // Search and filter in email feed
  const [searchQuery, setSearchQuery] = useState('');
  const [directionFilter, setDirectionFilter] = useState<'all' | 'inbound' | 'outbound'>('all');

  // Quick compose form state
  const [composeTo, setComposeTo] = useState('');
  const [composeCc, setComposeCc] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [selectedContactId, setSelectedContactId] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [composeError, setComposeError] = useState<string | null>(null);
  const [composeSuccess, setComposeSuccess] = useState<string | null>(null);

  // UI Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`Copied to clipboard: ${key}`);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const loadStatus = async () => {
    setIsLoadingStatus(true);
    try {
      const [status, setup] = await Promise.all([
        getGmailLiveStatus(),
        getGmailSetupInfo().catch(() => null)
      ]);
      setLiveStatus(status);
      if (setup) setSetupInfo(setup);
    } catch (err: any) {
      console.error('Failed to load Gmail status:', err);
    } finally {
      setIsLoadingStatus(false);
    }
  };

  const loadEmails = async () => {
    try {
      const list = await getSyncedCrmEmails({
        search: searchQuery || undefined,
        direction: directionFilter === 'all' ? undefined : directionFilter
      });
      setEmails(list);
    } catch (err) {
      console.error('Failed to load emails:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadStatus();
      loadEmails();
    }
  }, [isOpen, searchQuery, directionFilter]);

  // Handle send toggle
  const handleToggleSend = async (newVal: boolean) => {
    setIsTogglingSend(true);
    try {
      const res = await toggleGmailSendEnabled(newVal);
      setLiveStatus(prev => (prev ? { ...prev, sendEnabled: res.sendEnabled } : prev));
      showToast(res.message);
    } catch (err: any) {
      showToast(`Failed to update sending setting: ${err.message}`);
    } finally {
      setIsTogglingSend(false);
    }
  };

  // Handle Sync Now
  const handleSyncNow = async () => {
    setIsSyncing(true);
    try {
      const res = await triggerGmailSyncNow();
      await loadEmails();
      await loadStatus();
      showToast(`Background sync completed: ${res.count} messages synced & linked to CRM entities.`);
    } catch (err: any) {
      showToast(`Sync failed: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  // Handle Connect with Google OAuth 2.0
  const handleConnectGmail = async () => {
    setIsConnecting(true);
    try {
      showToast('Opening Google sign-in popup...');
      const authResult = await connectGmailWithGoogle();
      
      if (!authResult) {
        showToast('Google sign-in popup was cancelled or closed.');
        return;
      }

      await loadStatus();
      await loadEmails();
      showToast(`Connected ${authResult.user.email} successfully! Mailbox synced.`);
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        showToast('Google sign-in popup was cancelled.');
      } else {
        console.warn('[Gmail OAuth] Sign in notice:', err?.message || err);
        showToast(`Connection error: ${err.message || err}`);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle Disconnect
  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect Gmail? This will drop the stored token credentials from Supabase.')) {
      return;
    }
    setIsDisconnecting(true);
    try {
      await disconnectGmailAccount();
      await disconnectGoogleAccount();
      await loadStatus();
      showToast('Gmail account disconnected and database record purged.');
    } catch (err: any) {
      showToast(`Disconnect failed: ${err.message}`);
    } finally {
      setIsDisconnecting(false);
    }
  };

  // Handle Compose & Send
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setComposeError(null);
    setComposeSuccess(null);

    if (!composeTo.trim()) {
      setComposeError('Recipient email address is required.');
      return;
    }

    setIsSending(true);
    try {
      const res = await sendGmailEmail({
        to: composeTo.split(',').map(s => s.trim()).filter(Boolean),
        cc: composeCc ? composeCc.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        subject: composeSubject || '(No Subject)',
        bodyText: composeBody,
        contactId: selectedContactId || undefined,
        projectId: selectedProjectId || undefined
      });

      setComposeSuccess(`Email successfully dispatched via Gmail API! Message ID: ${res.messageId}`);
      showToast('Email sent via Gmail API & logged to CRM.');
      // Refresh email list
      await loadEmails();
      // Reset form
      setComposeSubject('');
      setComposeBody('');
    } catch (err: any) {
      if (err.status === 403 || err.code === 'GMAIL_SEND_DISABLED') {
        setComposeError('403 Forbidden: Outbound sending is disabled in Supabase. Please enable "Allow CRM to Send Emails" above.');
      } else {
        setComposeError(err.message || 'Failed to dispatch email');
      }
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  const isConnected = Boolean(liveStatus?.connected && liveStatus?.emailAddress);
  const sendEnabled = Boolean(liveStatus?.sendEnabled);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-150">
      <div className={`w-full max-w-5xl rounded-2xl shadow-2xl border flex flex-col max-h-[94vh] overflow-hidden transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-100'
      }`}>
        
        {/* Toast alert */}
        {toastMessage && (
          <div className="bg-sky-600 text-white text-xs font-semibold px-4 py-2 text-center transition-all animate-fade-in flex items-center justify-center gap-2 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Modal Header */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between shrink-0 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${
              isLight ? 'bg-red-50 text-red-600 border-red-200' : 'bg-red-500/15 text-red-400 border-red-500/30'
            }`}>
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className={`text-base font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Gmail API OAuth 2.0 Integration
                </h2>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                  isLight ? 'bg-red-50 text-red-700 border-red-200' : 'bg-red-500/15 text-red-300 border-red-500/30'
                }`}>
                  Continuous Background Sync
                </span>
                {isConnected ? (
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border flex items-center gap-1 ${
                    isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Connected
                  </span>
                ) : (
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                    isLight ? 'bg-slate-100 text-slate-600 border-slate-300' : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    Not Connected
                  </span>
                )}
              </div>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Two-way email synchronization linked to Contacts, Projects & Leads with Supabase token storage and conditional outbound sending.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadStatus}
              disabled={isLoadingStatus}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border-slate-200'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
              }`}
              title="Refresh connection status"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingStatus ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 border-slate-200'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border-slate-700'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live OAuth & Sending Status Bar */}
        <div className={`p-3.5 sm:p-4 border-b flex flex-wrap items-center justify-between gap-3 shrink-0 ${
          isLight ? 'bg-slate-100/80 border-slate-200 text-slate-700' : 'bg-slate-900/90 border-slate-800 text-slate-300'
        }`}>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <div className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Connected Account:</div>
              <div className={`text-xs font-semibold px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
                isLight ? 'bg-white border-slate-300 text-slate-800 shadow-soft-xs' : 'bg-slate-800 border-slate-700 text-slate-200'
              }`}>
                <User className="w-3.5 h-3.5 text-red-500" />
                <span>{liveStatus?.emailAddress || 'No Account Connected'}</span>
              </div>
            </div>

            {isConnected && (
              <div className={`flex items-center gap-2 text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                <span>Storage:</span>
                <span className={`font-mono text-[11px] px-2 py-0.5 rounded border ${
                  isLight ? 'text-sky-800 bg-sky-50 border-sky-200 font-semibold' : 'text-sky-300 bg-sky-950/40 border-sky-800/40'
                }`}>
                  {liveStatus?.tokenStorage || 'Supabase Table: gmail_credentials'}
                </span>
              </div>
            )}
          </div>

          {/* Connection CTA or Disconnect */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isConnected ? (
              <>
                <button
                  onClick={handleSyncNow}
                  disabled={isSyncing}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isLight
                      ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-soft-xs'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-sky-500' : ''}`} />
                  <span>{isSyncing ? 'Syncing...' : 'Sync Mailbox Now'}</span>
                </button>
                <button
                  onClick={handleDisconnect}
                  disabled={isDisconnecting}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isLight
                      ? 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200'
                      : 'bg-red-950/40 hover:bg-red-900/50 text-red-300 border-red-800/50'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{isDisconnecting ? 'Disconnecting...' : 'Disconnect'}</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleConnectGmail}
                disabled={isConnecting}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-sm flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Connecting Gmail...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>Connect Gmail via OAuth 2.0</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Section 5: The "Allow CRM to Send Emails" Switch Banner */}
        <div className={`px-4 sm:px-5 py-3.5 border-b flex flex-wrap items-center justify-between gap-3 shrink-0 ${
          isLight ? 'bg-slate-50/90 border-slate-200' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="flex items-center gap-3 max-w-2xl">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
              sendEnabled
                ? (isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30')
                : (isLight ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-amber-500/15 text-amber-400 border-amber-500/30')
            }`}>
              <Send className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Allow CRM to Send Emails
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                  sendEnabled
                    ? (isLight ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30')
                    : (isLight ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-amber-500/20 text-amber-300 border-amber-500/30')
                }`}>
                  {sendEnabled ? 'Sending Enabled' : 'Sending Disabled'}
                </span>
              </div>
              <p className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                <strong className={isLight ? 'text-slate-800 font-semibold' : 'text-slate-200 font-semibold'}>
                  Continuous Inbound & Outbound Sync Guarantee:
                </strong> Inbound and outbound email synchronization to contacts and projects remains active regardless of this toggle's position. This toggle only controls the CRM's ability to dispatch new outbound emails.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleToggleSend(!sendEnabled)}
              disabled={isTogglingSend || !isConnected}
              className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                sendEnabled ? 'bg-emerald-500' : (isLight ? 'bg-slate-300' : 'bg-slate-700')
              } ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${sendEnabled ? 'translate-x-6' : 'translate-x-0'}`}
              />
            </button>
            <span className={`text-xs font-bold min-w-10 ${
              sendEnabled ? 'text-emerald-600' : (isLight ? 'text-slate-500' : 'text-slate-400')
            }`}>
              {sendEnabled ? 'ON' : 'OFF'}
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={`px-4 sm:px-5 border-b flex items-center justify-between shrink-0 overflow-x-auto ${
          isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-950/60 border-slate-800'
        }`}>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('feed')}
              className={`px-3 sm:px-4 py-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'feed'
                  ? (isLight ? 'border-red-600 text-red-600 bg-white/80' : 'border-red-500 text-red-400 bg-slate-900')
                  : (isLight ? 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/70' : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40')
              }`}
            >
              <Inbox className="w-4 h-4" />
              <span>Synced CRM Emails ({emails.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('compose')}
              className={`px-3 sm:px-4 py-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'compose'
                  ? (isLight ? 'border-red-600 text-red-600 bg-white/80' : 'border-red-500 text-red-400 bg-slate-900')
                  : (isLight ? 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/70' : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40')
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Outbound Dispatch & Send Test</span>
            </button>
            <button
              onClick={() => setActiveTab('pubsub')}
              className={`px-3 sm:px-4 py-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'pubsub'
                  ? (isLight ? 'border-red-600 text-red-600 bg-white/80' : 'border-red-500 text-red-400 bg-slate-900')
                  : (isLight ? 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/70' : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40')
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>Pub/Sub Webhook & History</span>
            </button>
            <button
              onClick={() => setActiveTab('setup')}
              className={`px-3 sm:px-4 py-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'setup'
                  ? (isLight ? 'border-red-600 text-red-600 bg-white/80' : 'border-red-500 text-red-400 bg-slate-900')
                  : (isLight ? 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/70' : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40')
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Supabase Schema & Credentials</span>
            </button>
          </div>

          <div className={`hidden md:block text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
            {liveStatus?.latestHistoryId ? `History ID: ${liveStatus.latestHistoryId}` : 'Watch: Initializing'}
          </div>
        </div>

        {/* Modal Body */}
        <div className={`flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 ${
          isLight ? 'bg-slate-100/50' : 'bg-slate-900'
        }`}>
          
          {/* TAB 1: SYNCED CRM EMAILS */}
          {activeTab === 'feed' && (
            <div className="space-y-4">
              {/* Search & Filter Bar */}
              <div className={`flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border ${
                isLight ? 'bg-white border-slate-200 shadow-soft-xs' : 'bg-slate-800/60 border-slate-700'
              }`}>
                <div className="relative flex-1 min-w-[240px]">
                  <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isLight ? 'text-slate-400' : 'text-slate-400'}`} />
                  <input
                    type="text"
                    placeholder="Search subject, sender, or email text..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className={`w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border focus:outline-hidden transition-colors ${
                      isLight
                        ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-red-500 focus:bg-white'
                        : 'bg-slate-950/70 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-red-400'
                    }`}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Direction:</span>
                  <div className={`inline-flex rounded-lg p-0.5 border ${
                    isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-800 border-slate-700'
                  }`}>
                    {(['all', 'inbound', 'outbound'] as const).map(dir => (
                      <button
                        key={dir}
                        onClick={() => setDirectionFilter(dir)}
                        className={`px-2.5 py-1 text-xs font-medium rounded-md capitalize transition-colors cursor-pointer ${
                          directionFilter === dir
                            ? (isLight ? 'bg-white text-slate-900 shadow-soft-xs font-semibold' : 'bg-slate-700 text-slate-100 shadow-xs font-semibold')
                            : (isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200')
                        }`}
                      >
                        {dir}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={loadEmails}
                    className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                      isLight
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                    title="Refresh feed"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Email list or selected view */}
              {selectedEmail ? (
                <div className={`border rounded-xl p-5 space-y-4 ${
                  isLight ? 'bg-white border-slate-200 shadow-soft-xs' : 'bg-slate-800/60 border-slate-700'
                }`}>
                  <div className={`flex items-center justify-between border-b pb-3 ${
                    isLight ? 'border-slate-200' : 'border-slate-700'
                  }`}>
                    <button
                      onClick={() => setSelectedEmail(null)}
                      className={`text-xs flex items-center gap-1 font-semibold cursor-pointer ${
                        isLight ? 'text-red-600 hover:text-red-700' : 'text-sky-400 hover:text-sky-300'
                      }`}
                    >
                      &larr; Back to all synced emails
                    </button>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase border ${
                        selectedEmail.direction === 'inbound'
                          ? (isLight ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-blue-500/20 text-blue-300 border-blue-500/30')
                          : (isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30')
                      }`}>
                        {selectedEmail.direction}
                      </span>
                      <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        {new Date(selectedEmail.received_at).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {selectedEmail.subject}
                    </h3>
                    <div className={`mt-2 text-xs space-y-1 p-3 rounded-lg border font-mono ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-950/60 border-slate-800 text-slate-300'
                    }`}>
                      <div><strong className={isLight ? 'text-slate-900 font-sans' : 'text-slate-400 font-sans'}>From:</strong> {selectedEmail.from_address}</div>
                      <div><strong className={isLight ? 'text-slate-900 font-sans' : 'text-slate-400 font-sans'}>To:</strong> {selectedEmail.to_addresses.join(', ')}</div>
                      {selectedEmail.cc_addresses && selectedEmail.cc_addresses.length > 0 && (
                        <div><strong className={isLight ? 'text-slate-900 font-sans' : 'text-slate-400 font-sans'}>Cc:</strong> {selectedEmail.cc_addresses.join(', ')}</div>
                      )}
                      {selectedEmail.contact_name && (
                        <div className={`font-sans pt-1 font-semibold ${isLight ? 'text-sky-700' : 'text-sky-400'}`}>
                          <strong>Matched CRM Entity:</strong> {selectedEmail.contact_name} (Contact ID: {selectedEmail.contact_id || 'Matched by email'})
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`border-t pt-4 ${isLight ? 'border-slate-200' : 'border-slate-700'}`}>
                    {selectedEmail.body_html ? (
                      <div
                        className={`text-xs p-4 rounded-lg overflow-x-auto border ${
                          isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-950/80 border-slate-800 text-slate-200'
                        }`}
                        dangerouslySetInnerHTML={{ __html: selectedEmail.body_html }}
                      />
                    ) : (
                      <pre className={`text-xs p-4 rounded-lg whitespace-pre-wrap font-sans border ${
                        isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-950/80 border-slate-800 text-slate-200'
                      }`}>
                        {selectedEmail.body_text || selectedEmail.snippet || '(No message content)'}
                      </pre>
                    )}
                  </div>
                </div>
              ) : emails.length === 0 ? (
                <div className={`border rounded-xl p-10 text-center space-y-3 ${
                  isLight ? 'bg-white border-slate-200 shadow-soft-xs' : 'bg-slate-800/40 border-slate-700'
                }`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
                    isLight ? 'bg-slate-100 text-slate-400' : 'bg-slate-800 text-slate-500'
                  }`}>
                    <Mail className="w-6 h-6" />
                  </div>
                  <h4 className={`text-sm font-semibold ${isLight ? 'text-slate-800' : 'text-white'}`}>No Emails Synced Yet</h4>
                  <p className={`text-xs max-w-md mx-auto ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {isConnected
                      ? 'Emails from your connected Gmail account will continuously appear here via background Pub/Sub synchronization, automatically linked to Contacts, Projects, and Leads.'
                      : 'Connect your Gmail account above to start syncing communications directly to your solar CRM records.'}
                  </p>
                  {isConnected && (
                    <button
                      onClick={handleSyncNow}
                      disabled={isSyncing}
                      className="mt-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white inline-flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>Sync Mailbox Now</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className={`divide-y rounded-xl border overflow-hidden ${
                  isLight ? 'bg-white border-slate-200 divide-slate-200 shadow-soft-xs' : 'bg-slate-800/40 border-slate-700 divide-slate-700'
                }`}>
                  {emails.map(email => (
                    <div
                      key={email.message_id}
                      onClick={() => setSelectedEmail(email)}
                      className={`p-4 cursor-pointer transition-colors flex items-start justify-between gap-4 ${
                        isLight ? 'hover:bg-slate-50/80' : 'hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wider border ${
                            email.direction === 'inbound'
                              ? (isLight ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-blue-500/20 text-blue-300 border-blue-500/30')
                              : (isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30')
                          }`}>
                            {email.direction}
                          </span>
                          <span className={`text-xs font-bold truncate max-w-[200px] ${
                            isLight ? 'text-slate-900' : 'text-white'
                          }`}>
                            {email.direction === 'inbound' ? email.from_address : `To: ${email.to_addresses[0] || 'Client'}`}
                          </span>
                          {email.contact_name && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium flex items-center gap-1 border ${
                              isLight ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                            }`}>
                              <User className="w-2.5 h-2.5" />
                              <span>{email.contact_name}</span>
                            </span>
                          )}
                          {email.project_id && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium flex items-center gap-1 border ${
                              isLight ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                            }`}>
                              <FolderGit2 className="w-2.5 h-2.5" />
                              <span>Project Linked</span>
                            </span>
                          )}
                        </div>

                        <h4 className={`text-xs font-semibold truncate ${
                          isLight ? 'text-slate-800' : 'text-slate-200'
                        }`}>
                          {email.subject}
                        </h4>
                        <p className={`text-[11px] line-clamp-1 ${
                          isLight ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                          {email.snippet || email.body_text?.slice(0, 100) || '(No preview)'}
                        </p>
                      </div>

                      <div className="text-right shrink-0 flex flex-col items-end gap-1">
                        <span className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-400'}`}>
                          {new Date(email.received_at).toLocaleDateString()} {new Date(email.received_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <ChevronRight className={`w-4 h-4 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: OUTBOUND DISPATCH & SEND TEST */}
          {activeTab === 'compose' && (
            <div className="space-y-4">
              {/* Conditional Sending Warning Banner */}
              {!sendEnabled && (
                <div className={`p-4 rounded-xl border flex items-start justify-between gap-3 ${
                  isLight ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-amber-950/40 border-amber-800/60 text-amber-200'
                }`}>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className={`text-xs font-bold ${isLight ? 'text-amber-900' : 'text-amber-200'}`}>
                        Outbound Sending is Disabled (403 Forbidden Gate Active)
                      </h4>
                      <p className={`text-xs mt-1 ${isLight ? 'text-amber-800' : 'text-amber-300/80'}`}>
                        As requested by system specifications, any request to <code>/api/gmail/send</code> will be rejected with a <code>403 Forbidden</code> error while the <strong>"Allow CRM to Send Emails"</strong> toggle is OFF.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleSend(true)}
                    disabled={isTogglingSend || !isConnected}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-600 hover:bg-amber-500 text-white shrink-0 shadow-xs cursor-pointer"
                  >
                    Enable Sending
                  </button>
                </div>
              )}

              {composeSuccess && (
                <div className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
                  isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                }`}>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{composeSuccess}</span>
                </div>
              )}

              {composeError && (
                <div className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
                  isLight ? 'bg-red-50 border-red-200 text-red-800' : 'bg-red-950/40 border-red-800/60 text-red-200'
                }`}>
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{composeError}</span>
                </div>
              )}

              <form onSubmit={handleSendEmail} className={`border rounded-xl p-5 space-y-4 ${
                isLight ? 'bg-white border-slate-200 shadow-soft-xs' : 'bg-slate-800/60 border-slate-700'
              }`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      Recipient Email (To) *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="customer@example.com"
                      value={composeTo}
                      onChange={e => setComposeTo(e.target.value)}
                      className={`w-full px-3 py-2 text-xs rounded-lg border focus:outline-hidden transition-colors ${
                        isLight
                          ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-red-500 focus:bg-white'
                          : 'bg-slate-950/70 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-red-400'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      Carbon Copy (Cc)
                    </label>
                    <input
                      type="text"
                      placeholder="installer@example.com, manager@mysolarcrm.com.au"
                      value={composeCc}
                      onChange={e => setComposeCc(e.target.value)}
                      className={`w-full px-3 py-2 text-xs rounded-lg border focus:outline-hidden transition-colors ${
                        isLight
                          ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-red-500 focus:bg-white'
                          : 'bg-slate-950/70 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-red-400'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      Link to CRM Contact (Optional)
                    </label>
                    <select
                      value={selectedContactId}
                      onChange={e => {
                        setSelectedContactId(e.target.value);
                        const c = contacts.find(item => item.id === e.target.value);
                        if (c?.email && !composeTo) {
                          setComposeTo(c.email);
                        }
                      }}
                      className={`w-full px-3 py-2 text-xs rounded-lg border focus:outline-hidden transition-colors ${
                        isLight
                          ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-red-500 focus:bg-white'
                          : 'bg-slate-950/70 border-slate-700 text-slate-100 focus:border-red-400'
                      }`}
                    >
                      <option value="">-- Select CRM Contact --</option>
                      {contacts.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.email || 'No email'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      Link to CRM Project (Optional)
                    </label>
                    <select
                      value={selectedProjectId}
                      onChange={e => setSelectedProjectId(e.target.value)}
                      className={`w-full px-3 py-2 text-xs rounded-lg border focus:outline-hidden transition-colors ${
                        isLight
                          ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-red-500 focus:bg-white'
                          : 'bg-slate-950/70 border-slate-700 text-slate-100 focus:border-red-400'
                      }`}
                    >
                      <option value="">-- Select Solar Project --</option>
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.projectCode} - {p.customerName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your Solar Installation Schedule & STC Documentation"
                    value={composeSubject}
                    onChange={e => setComposeSubject(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-lg border focus:outline-hidden transition-colors ${
                      isLight
                        ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-red-500 focus:bg-white'
                        : 'bg-slate-950/70 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-red-400'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Message Body (Plain Text or HTML) *
                  </label>
                  <textarea
                    rows={6}
                    required
                    placeholder="Dear Customer,\n\nWe are pleased to confirm that your solar system installation has been scheduled..."
                    value={composeBody}
                    onChange={e => setComposeBody(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-lg border focus:outline-hidden font-sans transition-colors ${
                      isLight
                        ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-red-500 focus:bg-white'
                        : 'bg-slate-950/70 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-red-400'
                    }`}
                  />
                </div>

                <div className={`flex flex-wrap items-center justify-between gap-3 pt-3 border-t ${
                  isLight ? 'border-slate-200' : 'border-slate-700'
                }`}>
                  <div className={`text-[11px] flex items-center gap-1.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>MIME RFC 2822 Base64URL formatted & dispatched via Google Gmail API</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSending || !isConnected}
                    className={`px-5 py-2 text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 transition-all cursor-pointer ${
                      sendEnabled
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : (isLight ? 'bg-slate-200 text-slate-600 hover:bg-slate-300 border border-slate-300' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700')
                    }`}
                  >
                    <Send className={`w-3.5 h-3.5 ${isSending ? 'animate-spin' : ''}`} />
                    <span>{isSending ? 'Dispatching...' : sendEnabled ? 'Send Outbound Email' : 'Test Dispatch (Blocked)'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: PUBSUB WEBHOOK & HISTORY */}
          {activeTab === 'pubsub' && (
            <div className="space-y-4">
              <div className={`border rounded-xl p-5 space-y-4 ${
                isLight ? 'bg-white border-slate-200 shadow-soft-xs' : 'bg-slate-800/60 border-slate-700'
              }`}>
                <div className={`flex items-center justify-between border-b pb-3 ${
                  isLight ? 'border-slate-200' : 'border-slate-700'
                }`}>
                  <div className="flex items-center gap-2">
                    <Radio className="w-5 h-5 text-red-500" />
                    <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Google Cloud Pub/Sub Push Watch
                    </h3>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                    isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  }`}>
                    Continuous Webhook Receiver Active
                  </span>
                </div>

                <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Google Cloud Pub/Sub delivers real-time notifications to your CRM server whenever a new email arrives or is sent from your mailbox.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl border space-y-2 ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/80 border-slate-800'
                  }`}>
                    <div className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                      Push Notification Webhook Endpoint
                    </div>
                    <div className={`flex items-center justify-between px-3 py-2 rounded border font-mono text-[11px] ${
                      isLight ? 'bg-white border-slate-200 text-sky-700' : 'bg-slate-950/80 border-slate-800 text-sky-400'
                    }`}>
                      <span className="truncate">/api/gmail/webhook</span>
                      <button
                        onClick={() => copyToClipboard(`${window.location.origin}/api/gmail/webhook`, 'webhook-url')}
                        className={`p-1 cursor-pointer transition-colors ${
                          isLight ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-white'
                        }`}
                        title="Copy webhook URL"
                      >
                        {copiedKey === 'webhook-url' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                      Configure your Google Cloud Pub/Sub Subscription push endpoint with this URL.
                    </p>
                  </div>

                  <div className={`p-4 rounded-xl border space-y-2 ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/80 border-slate-800'
                  }`}>
                    <div className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                      Configured Pub/Sub Topic
                    </div>
                    <div className={`px-3 py-2 rounded border font-mono text-[11px] truncate ${
                      isLight ? 'bg-white border-slate-200 text-amber-700 font-semibold' : 'bg-slate-950/80 border-slate-800 text-amber-300'
                    }`}>
                      {liveStatus?.pubSubTopic || setupInfo?.pubSubTopic || 'GOOGLE_PUBSUB_TOPIC not configured'}
                    </div>
                    <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                      Registered in Google Cloud Console: <code>projects/[PROJECT_ID]/topics/[TOPIC_NAME]</code>
                    </p>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border space-y-2 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/80 border-slate-800'
                }`}>
                  <div className={`text-xs font-bold flex items-center justify-between ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                    <span>Current Sync State & History ID</span>
                    <span className="font-mono text-emerald-600 text-xs font-semibold">
                      {liveStatus?.latestHistoryId || 'Awaiting first notification'}
                    </span>
                  </div>
                  <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    The <code>latest_history_id</code> column in <code>gmail_credentials</code> tracks the point-in-time synchronization checkpoint to guarantee that every inbound and outbound message is parsed, extracted (To, From, Cc, Subject), and linked to CRM records without duplication.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SUPABASE SCHEMA & CREDENTIALS */}
          {activeTab === 'setup' && (
            <div className="space-y-4">
              <div className={`border rounded-xl p-5 space-y-4 ${
                isLight ? 'bg-white border-slate-200 shadow-soft-xs' : 'bg-slate-800/60 border-slate-700'
              }`}>
                <div className={`flex flex-wrap items-center justify-between gap-3 border-b pb-3 ${
                  isLight ? 'border-slate-200' : 'border-slate-700'
                }`}>
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-emerald-500" />
                    <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Supabase Schema: gmail_credentials & emails
                    </h3>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`-- 1. Create gmail_credentials table
CREATE TABLE IF NOT EXISTS public.gmail_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  email_address TEXT NOT NULL UNIQUE,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  send_enabled BOOLEAN NOT NULL DEFAULT false,
  latest_history_id TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gmail_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service_role full access to gmail_credentials"
  ON public.gmail_credentials FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 2. Create emails table for continuous sync
CREATE TABLE IF NOT EXISTS public.emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id TEXT UNIQUE NOT NULL,
  thread_id TEXT,
  gmail_credentials_id UUID REFERENCES public.gmail_credentials(id) ON DELETE CASCADE,
  direction TEXT CHECK (direction IN ('inbound', 'outbound')) NOT NULL DEFAULT 'inbound',
  from_address TEXT NOT NULL,
  to_addresses TEXT[] NOT NULL DEFAULT '{}',
  cc_addresses TEXT[] DEFAULT '{}',
  subject TEXT DEFAULT '(No Subject)',
  snippet TEXT,
  body_html TEXT,
  body_text TEXT,
  contact_id TEXT,
  contact_name TEXT,
  company_id TEXT,
  project_id TEXT,
  ticket_id TEXT,
  lead_id TEXT,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service_role full access to emails"
  ON public.emails FOR ALL TO service_role USING (true) WITH CHECK (true);`, 'supabase-migration')}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy SQL Migration</span>
                  </button>
                </div>

                <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Run the SQL migration in your Supabase SQL Editor. Tokens and CRM linked emails are persisted with strict Row Level Security (RLS) policies.
                </p>

                {/* Environment Variables Checklist */}
                <div className={`p-4 rounded-xl border space-y-3 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/80 border-slate-800'
                }`}>
                  <h4 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Environment Variables Diagnostic Checklist
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    <div className={`flex items-center justify-between p-2.5 rounded-lg border ${
                      isLight ? 'bg-white border-slate-200 shadow-soft-xs' : 'bg-slate-950/60 border-slate-800'
                    }`}>
                      <span className={`font-mono font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>GMAIL_CLIENT_ID</span>
                      {setupInfo?.hasClientId ? (
                        <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Set
                        </span>
                      ) : (
                        <span className="text-red-500 font-bold flex items-center gap-1 text-[11px]">
                          <AlertTriangle className="w-3.5 h-3.5" /> Missing
                        </span>
                      )}
                    </div>

                    <div className={`flex items-center justify-between p-2.5 rounded-lg border ${
                      isLight ? 'bg-white border-slate-200 shadow-soft-xs' : 'bg-slate-950/60 border-slate-800'
                    }`}>
                      <span className={`font-mono font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>GMAIL_CLIENT_SECRET</span>
                      {setupInfo?.hasClientSecret ? (
                        <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Set
                        </span>
                      ) : (
                        <span className="text-red-500 font-bold flex items-center gap-1 text-[11px]">
                          <AlertTriangle className="w-3.5 h-3.5" /> Missing
                        </span>
                      )}
                    </div>

                    <div className={`flex items-center justify-between p-2.5 rounded-lg border ${
                      isLight ? 'bg-white border-slate-200 shadow-soft-xs' : 'bg-slate-950/60 border-slate-800'
                    }`}>
                      <span className={`font-mono font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>GMAIL_REDIRECT_URI</span>
                      <span className={`font-mono text-[11px] truncate max-w-[200px] font-semibold ${isLight ? 'text-sky-700' : 'text-sky-400'}`} title={setupInfo?.redirectUri}>
                        {setupInfo?.redirectUri || '/api/auth/gmail/callback'}
                      </span>
                    </div>

                    <div className={`flex items-center justify-between p-2.5 rounded-lg border ${
                      isLight ? 'bg-white border-slate-200 shadow-soft-xs' : 'bg-slate-950/60 border-slate-800'
                    }`}>
                      <span className={`font-mono font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>GOOGLE_PUBSUB_TOPIC</span>
                      {setupInfo?.hasPubSubTopic ? (
                        <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Configured
                        </span>
                      ) : (
                        <span className="text-amber-600 font-bold flex items-center gap-1 text-[11px]">
                          <AlertTriangle className="w-3.5 h-3.5" /> Optional
                        </span>
                      )}
                    </div>

                    <div className={`flex items-center justify-between p-2.5 rounded-lg border ${
                      isLight ? 'bg-white border-slate-200 shadow-soft-xs' : 'bg-slate-950/60 border-slate-800'
                    }`}>
                      <span className={`font-mono font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>SUPABASE_URL</span>
                      {setupInfo?.supabaseConfigured ? (
                        <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                        </span>
                      ) : (
                        <span className="text-amber-600 font-bold flex items-center gap-1 text-[11px]">
                          Fallback Enabled
                        </span>
                      )}
                    </div>

                    <div className={`flex items-center justify-between p-2.5 rounded-lg border ${
                      isLight ? 'bg-white border-slate-200 shadow-soft-xs' : 'bg-slate-950/60 border-slate-800'
                    }`}>
                      <span className={`font-mono font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>SUPABASE_SERVICE_ROLE_KEY</span>
                      {setupInfo?.supabaseConfigured ? (
                        <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Active
                        </span>
                      ) : (
                        <span className="text-amber-600 font-bold flex items-center gap-1 text-[11px]">
                          Fallback Enabled
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Authorized Redirect URI helper */}
                <div className={`p-4 rounded-xl border space-y-2 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/80 border-slate-800'
                }`}>
                  <div className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>Google Cloud Console Authorized Redirect URI</div>
                  <div className={`flex items-center justify-between px-3 py-2 rounded border font-mono text-[11px] ${
                    isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-950/80 border-slate-800 text-slate-200'
                  }`}>
                    <span className="truncate">{setupInfo?.redirectUri || `${window.location.origin}/api/auth/gmail/callback`}</span>
                    <button
                      onClick={() => copyToClipboard(setupInfo?.redirectUri || `${window.location.origin}/api/auth/gmail/callback`, 'redirect-uri')}
                      className={`p-1 cursor-pointer transition-colors ${
                        isLight ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-white'
                      }`}
                      title="Copy Redirect URI"
                    >
                      {copiedKey === 'redirect-uri' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                    Add this exact URI into <strong>Authorized redirect URIs</strong> in your Google Cloud Console OAuth 2.0 Client credentials.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className={`p-4 border-t flex items-center justify-between shrink-0 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800'
        }`}>
          <div className={`text-xs flex items-center gap-2 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Gmail API OAuth 2.0 & Pub/Sub Continuous Synchronization</span>
          </div>

          <button
            onClick={onClose}
            className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
