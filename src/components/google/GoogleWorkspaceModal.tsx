import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Calendar,
  ShieldCheck,
  Send,
  Plus,
  RefreshCw,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Lock,
  LogOut,
  Sparkles,
  Check,
  Copy,
  Key
} from 'lucide-react';
import {
  auth,
  SCOPES,
  initAuth,
  googleSignIn,
  logout,
  getAccessToken,
  sendGmailEmail,
  fetchRecentGmailMessages,
  fetchUpcomingCalendarEvents,
  createCalendarEvent,
  connectDirectWorkspaceAccount,
  getConnectedWorkspaceUser,
  GmailMessageSummary,
  CalendarEventSummary
} from '../../services/googleWorkspace';
import { User } from 'firebase/auth';
import { useApp } from '../../context/AppContext';

interface GoogleWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'gmail' | 'calendar' | 'audit';
  defaultRecipient?: string;
  defaultCustomerName?: string;
  defaultEventTitle?: string;
  defaultEventLocation?: string;
}

export const GoogleWorkspaceModal: React.FC<GoogleWorkspaceModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'gmail',
  defaultRecipient = '',
  defaultCustomerName = '',
  defaultEventTitle = '',
  defaultEventLocation = ''
}) => {
  const { currentUser: appUser, connectedDomain } = useApp();
  const [activeTab, setActiveTab] = useState<'gmail' | 'calendar' | 'audit'>(initialTab);
  const [currentUser, setCurrentUser] = useState<any>(() => getConnectedWorkspaceUser() || auth.currentUser);
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isUnauthorizedDomain, setIsUnauthorizedDomain] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customToken, setCustomToken] = useState('');
  const [showAdvancedAuth, setShowAdvancedAuth] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState(false);

  // Gmail state
  const [emailTo, setEmailTo] = useState(defaultRecipient);
  const [emailCustomerName, setEmailCustomerName] = useState(defaultCustomerName);
  const [emailSubject, setEmailSubject] = useState(
    defaultCustomerName
      ? `Apex Solar - System Specification & Proposal for ${defaultCustomerName}`
      : 'Apex Solar - Quotation & System Assessment'
  );
  const [selectedTemplate, setSelectedTemplate] = useState('proposal');
  const [emailBody, setEmailBody] = useState(
    `Dear ${defaultCustomerName || 'Valued Client'},\n\nThank you for choosing Apex Solar for your residential clean energy transition. Attached is your tailored Clean Energy Council (CEC) approved solar design proposal.\n\nKey Highlights:\n• Tier-1 N-Type TOPCon Solar PV Modules\n• High-Efficiency Hybrid Inverter\n• Federal Small-scale Technology Certificate (STC) Point-of-Sale Rebate Applied\n• 25-Year Linear Performance Warranty\n\nPlease let us know if you would like to proceed with the site assessment.\n\nWarm regards,\nApex Solar Operations Team`
  );
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSendSuccess, setEmailSendSuccess] = useState<string | null>(null);
  const [emailSendError, setEmailSendError] = useState<string | null>(null);
  const [gmailMessages, setGmailMessages] = useState<GmailMessageSummary[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Calendar state
  const [eventTitle, setEventTitle] = useState(
    defaultEventTitle || (defaultCustomerName ? `Solar Site Assessment: ${defaultCustomerName}` : 'Solar Site Assessment')
  );
  const [eventLocation, setEventLocation] = useState(
    defaultEventLocation || 'Sydney NSW 2000, Australia'
  );
  const [eventDate, setEventDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [eventStartTime, setEventStartTime] = useState('10:00');
  const [eventEndTime, setEventEndTime] = useState('11:30');
  const [eventAttendees, setEventAttendees] = useState(defaultRecipient);
  const [eventDescription, setEventDescription] = useState(
    'Comprehensive pre-installation site assessment: Switchboard capacity inspection, roof pitch & shading analysis, and cable run verification for CEC installation.'
  );
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [calendarCreateSuccess, setCalendarCreateSuccess] = useState<string | null>(null);
  const [calendarCreateError, setCalendarCreateError] = useState<string | null>(null);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEventSummary[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);

  // Mandatory confirmation dialogs for mutating operations
  const [confirmSendEmailOpen, setConfirmSendEmailOpen] = useState(false);
  const [confirmCreateEventOpen, setConfirmCreateEventOpen] = useState(false);

  // Sync initial props if changed
  useEffect(() => {
    if (defaultRecipient) {
      setEmailTo(defaultRecipient);
      setEventAttendees(defaultRecipient);
    }
    if (defaultCustomerName) {
      setEmailCustomerName(defaultCustomerName);
      setEmailSubject(`Apex Solar - System Specification & Proposal for ${defaultCustomerName}`);
      setEventTitle(`Solar Site Assessment: ${defaultCustomerName}`);
    }
    if (defaultEventLocation) {
      setEventLocation(defaultEventLocation);
    }
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [defaultRecipient, defaultCustomerName, defaultEventLocation, initialTab]);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setHasToken(!!token);
      },
      () => {
        setCurrentUser(auth.currentUser);
        getAccessToken().then(token => setHasToken(!!token));
      }
    );
    return () => unsubscribe();
  }, []);

  // Check token and saved user on modal open
  useEffect(() => {
    if (isOpen) {
      const savedUser = getConnectedWorkspaceUser();
      if (savedUser?.isConnected) {
        setCurrentUser(savedUser);
        setHasToken(true);
      }
      getAccessToken().then(tok => {
        if (tok) {
          setHasToken(true);
          loadRecentEmails();
          loadUpcomingEvents();
        }
      });
    }
  }, [isOpen]);

  const handleSignIn = async (promptType?: 'select_account' | 'consent') => {
    setIsAuthenticating(true);
    setAuthError(null);
    setIsUnauthorizedDomain(false);
    try {
      const result = await googleSignIn({ prompt: promptType || 'consent' });
      if (result) {
        setCurrentUser(result.user);
        setHasToken(true);
        setIsUnauthorizedDomain(false);
        loadRecentEmails();
        loadUpcomingEvents();
      }
    } catch (err: any) {
      const isUnauth =
        err?.code === 'auth/unauthorized-domain' ||
        err?.message?.includes('unauthorized-domain');
      setIsUnauthorizedDomain(isUnauth);
      setAuthError(err.message || 'Google Workspace sign-in failed.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleDirectConnect = (targetEmail?: string) => {
    try {
      const email = targetEmail || customEmail.trim() || appUser.email || `admin@${connectedDomain}`;
      const res = connectDirectWorkspaceAccount({
        email,
        accessToken: customToken.trim() || undefined
      });
      setCurrentUser(res.user);
      setHasToken(true);
      setAuthError(null);
      setIsUnauthorizedDomain(false);
      loadRecentEmails();
      loadUpcomingEvents();
    } catch (err: any) {
      setAuthError(err.message || 'Failed to connect workspace account.');
    }
  };

  const handleCopyDomain = () => {
    navigator.clipboard.writeText(window.location.hostname);
    setCopiedDomain(true);
    setTimeout(() => setCopiedDomain(false), 3000);
  };

  const handleSignOut = async () => {
    await logout();
    setCurrentUser(null);
    setHasToken(false);
    setGmailMessages([]);
    setCalendarEvents([]);
    setAuthError(null);
    setIsUnauthorizedDomain(false);
  };

  const handleTemplateChange = (tmpl: string) => {
    setSelectedTemplate(tmpl);
    const client = emailCustomerName || 'Valued Client';
    if (tmpl === 'proposal') {
      setEmailSubject(`Apex Solar - System Specification & Proposal for ${client}`);
      setEmailBody(
        `Dear ${client},\n\nThank you for choosing Apex Solar for your clean energy installation. Attached is your tailored Clean Energy Council (CEC) approved solar design proposal.\n\nKey Highlights:\n• Tier-1 N-Type TOPCon Solar PV Modules\n• High-Efficiency Hybrid Inverter\n• Federal Small-scale Technology Certificate (STC) Point-of-Sale Rebate Applied\n• 25-Year Linear Performance Warranty\n\nPlease let us know if you would like to proceed with the site assessment.\n\nWarm regards,\nApex Solar Operations Team`
      );
    } else if (tmpl === 'inspection') {
      setEmailSubject(`Apex Solar - Site Inspection Confirmation for ${client}`);
      setEmailBody(
        `Dear ${client},\n\nWe have scheduled your on-site solar inspection for your property. Our accredited Clean Energy Council solar designer and licensed electrician will review your switchboard, roof structure, and conduit pathways.\n\nPlease ensure clear access to the main switchboard and carport during this time.\n\nWarm regards,\nApex Solar Operations Team`
      );
    } else if (tmpl === 'workorder') {
      setEmailSubject(`Apex Solar - Installation Work Order & STC Sign-off for ${client}`);
      setEmailBody(
        `Dear ${client},\n\nYour solar installation package has been finalized. Our certified installation team will arrive on site on the scheduled installation date.\n\nFollowing installation, our team will assist you in signing off the statutory Small-scale Technology Certificate (STC) assignment documentation for your immediate point-of-sale discount.\n\nWarm regards,\nApex Solar Operations Team`
      );
    } else if (tmpl === 'warranty') {
      setEmailSubject(`Apex Solar - Commissioning Pack & Warranty Certificates for ${client}`);
      setEmailBody(
        `Dear ${client},\n\nCongratulations on commissioning your new solar power system! Attached is your official compliance package including:\n• Certificate of Electrical Safety (CES)\n• Inverter & Battery manufacturer warranty documentation\n• Solar inverter Wi-Fi monitoring setup guide\n\nWarm regards,\nApex Solar Operations Team`
      );
    }
  };

  // -------------------------------------------------------------
  // GMAIL METHODS
  // -------------------------------------------------------------
  const loadRecentEmails = async () => {
    setIsLoadingMessages(true);
    try {
      const msgs = await fetchRecentGmailMessages(5);
      setGmailMessages(msgs);
    } catch (e) {
      console.warn('Could not fetch recent Gmail messages:', e);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleTriggerSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailTo.trim() || !emailSubject.trim() || !emailBody.trim()) return;
    // Open mandatory confirmation dialog
    setConfirmSendEmailOpen(true);
  };

  const executeSendEmail = async () => {
    setConfirmSendEmailOpen(false);
    setIsSendingEmail(true);
    setEmailSendSuccess(null);
    setEmailSendError(null);

    try {
      const htmlBody = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1f2937; line-height: 1.6; border: 1px solid #e5e7eb; border-radius: 12px;">
          <div style="border-bottom: 2px solid #bef264; padding-bottom: 12px; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #111827; font-size: 20px; font-weight: 800;">Apex Solar Energy Systems</h2>
            <span style="font-size: 11px; color: #4b5563; font-weight: 600;">Clean Energy Council Accredited Retailer &amp; Commercial Solar</span>
          </div>
          <div style="font-size: 14px; white-space: pre-line; color: #374151;">
            ${emailBody.replace(/\n/g, '<br/>')}
          </div>
          <div style="margin-top: 28px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #6b7280;">
            <p style="margin: 0 0 4px 0;"><strong>Apex Solar Australia Pty Ltd</strong> | ABN: 74 123 456 789</p>
            <p style="margin: 0;">Automated notification sent securely via integrated Google Workspace API.</p>
          </div>
        </div>
      `;

      const result = await sendGmailEmail({
        to: emailTo.trim(),
        subject: emailSubject.trim(),
        bodyHtml: htmlBody,
        senderName: currentUser?.displayName || 'Apex Solar Operations'
      });

      setEmailSendSuccess(`Email successfully dispatched via Gmail API! Message ID: ${result.id}`);
      setTimeout(() => {
        setEmailSendSuccess(null);
        loadRecentEmails();
      }, 5000);
    } catch (err: any) {
      setEmailSendError(err.message || 'Failed to send email via Gmail API.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  // -------------------------------------------------------------
  // CALENDAR METHODS
  // -------------------------------------------------------------
  const loadUpcomingEvents = async () => {
    setIsLoadingEvents(true);
    try {
      const events = await fetchUpcomingCalendarEvents(10);
      setCalendarEvents(events);
    } catch (e) {
      console.warn('Could not fetch Calendar events:', e);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  const handleTriggerCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim() || !eventDate || !eventStartTime || !eventEndTime) return;
    // Open mandatory confirmation dialog
    setConfirmCreateEventOpen(true);
  };

  const executeCreateEvent = async () => {
    setConfirmCreateEventOpen(false);
    setIsCreatingEvent(true);
    setCalendarCreateSuccess(null);
    setCalendarCreateError(null);

    try {
      const startIso = new Date(`${eventDate}T${eventStartTime}:00`).toISOString();
      const endIso = new Date(`${eventDate}T${eventEndTime}:00`).toISOString();
      const attendeeList = eventAttendees
        .split(',')
        .map(e => e.trim())
        .filter(e => e.length > 0 && e.includes('@'));

      const result = await createCalendarEvent({
        summary: eventTitle.trim(),
        location: eventLocation.trim(),
        description: eventDescription.trim(),
        startIso,
        endIso,
        attendeeEmails: attendeeList
      });

      setCalendarCreateSuccess(`Calendar appointment '${result.summary}' successfully scheduled!`);
      setTimeout(() => {
        setCalendarCreateSuccess(null);
        loadUpcomingEvents();
      }, 5000);
    } catch (err: any) {
      setCalendarCreateError(err.message || 'Failed to schedule event on Google Calendar.');
    } finally {
      setIsCreatingEvent(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-[#141414] border border-[#2d2d2d] w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-gray-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#262626] flex items-center justify-between bg-[#181818]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                  Google Workspace Suite
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Gmail &amp; Google Calendar
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Official Google REST API synchronization for customer emails, proposals, and solar site scheduling
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#262626] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth status bar & Google Sign In Button */}
        <div className="px-5 py-3 bg-[#111111] border-b border-[#262626] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {currentUser && hasToken ? (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-300 font-bold text-xs uppercase overflow-hidden">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt="Google User"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    (currentUser.displayName || currentUser.email || 'G')[0]
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">
                      {currentUser.displayName || 'Authorized Google User'}
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.2 rounded-full border border-emerald-500/20">
                      <Check className="w-2.5 h-2.5" /> Connected
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400 font-mono">
                    {currentUser.email || appUser.email || `admin@${connectedDomain}`}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                <span className="text-xs text-gray-300 font-medium">
                  Google Workspace not connected. Sign in with Google to enable live Gmail &amp; Calendar APIs.
                </span>
              </div>
            )}
          </div>

          <div>
            {currentUser && hasToken ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSignIn('select_account')}
                  disabled={isAuthenticating}
                  className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="Switch to another Google Account"
                >
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  <span>{isAuthenticating ? 'Opening...' : 'Switch Account'}</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="px-3 py-1.5 rounded-lg bg-[#222222] hover:bg-[#2d2d2d] border border-[#333333] text-gray-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 text-gray-400" />
                  <span>Disconnect</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => handleDirectConnect(appUser.email || `admin@${connectedDomain}`)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-lg shadow-sm transition-colors"
                  title={`Authorize as ${appUser.email || `admin@${connectedDomain}`}`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Connect as {appUser.email || `admin@${connectedDomain}`}</span>
                </button>
                <button
                  onClick={() => handleSignIn()}
                  disabled={isAuthenticating}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-800 text-xs font-semibold rounded-lg shadow-sm border border-gray-300 transition-colors disabled:opacity-50"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>{isAuthenticating ? 'Authorizing...' : 'Google Popup'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Domain Authorization Notice & Quick Connect Resolution */}
        {(authError || isUnauthorizedDomain || (!currentUser && showAdvancedAuth)) && (
          <div className="px-5 py-3.5 bg-amber-500/10 border-b border-amber-500/30 text-xs space-y-3">
            <div className="flex items-start justify-between gap-3 flex-wrap sm:flex-nowrap">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-200">
                    {isUnauthorizedDomain
                      ? 'Domain Authorization Notice (Firebase Auth)'
                      : 'Google Workspace Connection Assistance'}
                  </h4>
                  <p className="text-amber-300/80 text-[11px] mt-0.5 leading-relaxed">
                    Firebase requires the preview host (
                    <code className="px-1.5 py-0.5 bg-black/40 rounded text-amber-200 font-mono text-[10px]">
                      {typeof window !== 'undefined' ? window.location.hostname : 'preview-host'}
                    </code>
                    ) to be in Firebase Console Authorized Domains for popups. You can connect your Google account instantly below:
                  </p>
                </div>
              </div>

              <button
                onClick={handleCopyDomain}
                className="px-2.5 py-1.5 rounded-lg bg-black/40 hover:bg-black/60 border border-amber-500/40 text-amber-200 text-[11px] font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
                title="Copy host domain to whitelist in Firebase Console"
              >
                {copiedDomain ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedDomain ? 'Domain Copied!' : 'Copy Host Domain'}</span>
              </button>
            </div>

            <div className="bg-[#181818] p-3 rounded-xl border border-amber-500/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleDirectConnect(appUser.email || `admin@${connectedDomain}`)}
                  className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Connect {appUser.email || `admin@${connectedDomain}`}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdvancedAuth(!showAdvancedAuth)}
                  className="px-3 py-2 bg-[#222] hover:bg-[#2c2c2c] text-gray-300 hover:text-white border border-[#383838] text-xs font-semibold rounded-lg transition-colors"
                >
                  {showAdvancedAuth ? 'Hide Custom Options' : 'Custom Corporate Email / Token'}
                </button>
              </div>

              <span className="text-[10px] text-gray-400 italic">
                Unlocks Gmail composer, proposal dispatches, and Calendar events
              </span>
            </div>

            {showAdvancedAuth && (
              <div className="bg-[#121212] p-3 rounded-xl border border-[#333] space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-400 mb-1">
                      Corporate Google Workspace Email:
                    </label>
                    <input
                      type="email"
                      value={customEmail}
                      onChange={e => setCustomEmail(e.target.value)}
                      placeholder={`e.g. ${appUser.email || `user@${connectedDomain}`}`}
                      className="w-full text-xs bg-[#1a1a1a] border border-[#333] rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-400 mb-1">
                      Google OAuth 2.0 Access Token (Optional):
                    </label>
                    <input
                      type="password"
                      value={customToken}
                      onChange={e => setCustomToken(e.target.value)}
                      placeholder="ya29.a0A..."
                      className="w-full text-xs bg-[#1a1a1a] border border-[#333] rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => handleDirectConnect()}
                    className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-lg transition-colors"
                  >
                    Authorize Account
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-[#262626] bg-[#161616] px-5">
          <button
            onClick={() => setActiveTab('gmail')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'gmail'
                ? 'border-red-500 text-white bg-red-500/5'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Mail className="w-4 h-4 text-red-400" />
            <span>Gmail Communications</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-sm bg-[#222222] text-gray-400">
              API
            </span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'calendar'
                ? 'border-blue-500 text-white bg-blue-500/5'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Calendar className="w-4 h-4 text-blue-400" />
            <span>Google Calendar Scheduling</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-sm bg-[#222222] text-gray-400">
              API
            </span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'audit'
                ? 'border-emerald-500 text-white bg-emerald-500/5'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>OAuth &amp; Permissions Audit</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* TAB 1: GMAIL */}
          {activeTab === 'gmail' && (
            <div className="space-y-6">
              {emailSendSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{emailSendSuccess}</span>
                </div>
              )}

              {emailSendError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300 font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{emailSendError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Compose Form */}
                <form
                  onSubmit={handleTriggerSendEmail}
                  className="lg:col-span-7 bg-[#1a1a1a] p-4 sm:p-5 rounded-xl border border-[#2d2d2d] space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                      <Send className="w-3.5 h-3.5 text-red-400" />
                      <span>Compose Solar Client Email</span>
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] text-gray-400">
                      <span>Template:</span>
                      <select
                        value={selectedTemplate}
                        onChange={e => handleTemplateChange(e.target.value)}
                        className="bg-[#121212] border border-[#2d2d2d] text-gray-200 text-xs rounded-md px-2 py-1 outline-none focus:border-red-400"
                      >
                        <option value="proposal">Solar Proposal Pack</option>
                        <option value="inspection">Site Inspection Booking</option>
                        <option value="workorder">Installation Work Order</option>
                        <option value="warranty">Commissioning &amp; Warranty</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                        Recipient Email:
                      </label>
                      <input
                        type="email"
                        value={emailTo}
                        onChange={e => setEmailTo(e.target.value)}
                        placeholder="client@gmail.com"
                        className="w-full text-xs bg-[#121212] border border-[#2d2d2d] rounded-lg px-3 py-2 text-white placeholder:text-gray-600 outline-none focus:border-red-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                        Client / Contact Name:
                      </label>
                      <input
                        type="text"
                        value={emailCustomerName}
                        onChange={e => setEmailCustomerName(e.target.value)}
                        placeholder="Harrison Davies"
                        className="w-full text-xs bg-[#121212] border border-[#2d2d2d] rounded-lg px-3 py-2 text-white placeholder:text-gray-600 outline-none focus:border-red-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                      Subject Line:
                    </label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={e => setEmailSubject(e.target.value)}
                      className="w-full text-xs bg-[#121212] border border-[#2d2d2d] rounded-lg px-3 py-2 text-white outline-none focus:border-red-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                      Email Body (Plain Text &amp; HTML Formatted):
                    </label>
                    <textarea
                      rows={7}
                      value={emailBody}
                      onChange={e => setEmailBody(e.target.value)}
                      className="w-full text-xs font-mono bg-[#121212] border border-[#2d2d2d] rounded-lg p-3 text-gray-200 outline-none focus:border-red-400 resize-none leading-relaxed"
                      required
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-[#262626]">
                    <span className="text-[11px] text-gray-400">
                      Dispatched securely from <strong className="text-gray-300">{currentUser?.email || 'Authorized Workspace User'}</strong>
                    </span>
                    <button
                      type="submit"
                      disabled={isSendingEmail || !hasToken}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSendingEmail ? 'Dispatching...' : 'Send via Gmail API'}</span>
                    </button>
                  </div>
                </form>

                {/* Right: Recent Emails */}
                <div className="lg:col-span-5 bg-[#1a1a1a] p-4 sm:p-5 rounded-xl border border-[#2d2d2d] flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-red-400" />
                        <span>Recent Client Correspondence</span>
                      </h3>
                      <button
                        onClick={loadRecentEmails}
                        disabled={isLoadingMessages || !hasToken}
                        className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors disabled:opacity-40"
                      >
                        <RefreshCw className={`w-3 h-3 ${isLoadingMessages ? 'animate-spin' : ''}`} />
                        <span>Refresh</span>
                      </button>
                    </div>

                    {!hasToken ? (
                      <div className="p-6 text-center bg-[#141414] rounded-xl border border-dashed border-[#2d2d2d] space-y-2">
                        <Lock className="w-6 h-6 text-gray-500 mx-auto" />
                        <p className="text-xs text-gray-400">
                          Sign in with Google above to view your recent Gmail conversations.
                        </p>
                      </div>
                    ) : gmailMessages.length === 0 ? (
                      <div className="p-6 text-center bg-[#141414] rounded-xl border border-dashed border-[#2d2d2d] space-y-2">
                        <Mail className="w-6 h-6 text-gray-500 mx-auto" />
                        <p className="text-xs text-gray-400">
                          No recent solar messages found in your mailbox. Click Refresh to query Gmail API.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                        {gmailMessages.map(msg => (
                          <div
                            key={msg.id}
                            className="p-3 bg-[#141414] hover:bg-[#202020] rounded-xl border border-[#262626] transition-colors space-y-1"
                          >
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-white truncate max-w-[170px]">
                                {msg.from}
                              </span>
                              <span className="text-[10px] text-gray-500 shrink-0 font-mono">
                                {msg.date ? new Date(msg.date).toLocaleDateString() : 'Recent'}
                              </span>
                            </div>
                            <div className="text-xs font-semibold text-gray-200 truncate">
                              {msg.subject}
                            </div>
                            <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                              {msg.snippet}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#262626] flex items-center justify-between text-[11px] text-gray-400">
                    <span>Scope: <strong className="text-gray-300 font-mono">gmail.send, gmail.readonly</strong></span>
                    <a
                      href="https://mail.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold"
                    >
                      <span>Open Gmail Web</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GOOGLE CALENDAR */}
          {activeTab === 'calendar' && (
            <div className="space-y-6">
              {calendarCreateSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{calendarCreateSuccess}</span>
                </div>
              )}

              {calendarCreateError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300 font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{calendarCreateError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Schedule Event Form */}
                <form
                  onSubmit={handleTriggerCreateEvent}
                  className="lg:col-span-7 bg-[#1a1a1a] p-4 sm:p-5 rounded-xl border border-[#2d2d2d] space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      <span>Schedule Solar Appointment on Google Calendar</span>
                    </h3>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                      Event Summary / Title:
                    </label>
                    <input
                      type="text"
                      value={eventTitle}
                      onChange={e => setEventTitle(e.target.value)}
                      className="w-full text-xs bg-[#121212] border border-[#2d2d2d] rounded-lg px-3 py-2 text-white outline-none focus:border-blue-400"
                      placeholder="e.g. Solar Site Inspection - 14 King St, Manly"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                      Site Address / Location:
                    </label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={eventLocation}
                        onChange={e => setEventLocation(e.target.value)}
                        className="w-full text-xs pl-9 pr-3 py-2 bg-[#121212] border border-[#2d2d2d] rounded-lg text-white outline-none focus:border-blue-400"
                        placeholder="72 Pacific Highway, Sydney NSW 2000"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                        Date:
                      </label>
                      <input
                        type="date"
                        value={eventDate}
                        onChange={e => setEventDate(e.target.value)}
                        className="w-full text-xs bg-[#121212] border border-[#2d2d2d] rounded-lg px-3 py-2 text-white outline-none focus:border-blue-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                        Start Time:
                      </label>
                      <input
                        type="time"
                        value={eventStartTime}
                        onChange={e => setEventStartTime(e.target.value)}
                        className="w-full text-xs bg-[#121212] border border-[#2d2d2d] rounded-lg px-3 py-2 text-white outline-none focus:border-blue-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                        End Time:
                      </label>
                      <input
                        type="time"
                        value={eventEndTime}
                        onChange={e => setEventEndTime(e.target.value)}
                        className="w-full text-xs bg-[#121212] border border-[#2d2d2d] rounded-lg px-3 py-2 text-white outline-none focus:border-blue-400"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                      Invitee / Client Attendees (Comma-separated emails):
                    </label>
                    <div className="relative">
                      <Users className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={eventAttendees}
                        onChange={e => setEventAttendees(e.target.value)}
                        placeholder="client@gmail.com, subbie.electrician@gmail.com"
                        className="w-full text-xs pl-9 pr-3 py-2 bg-[#121212] border border-[#2d2d2d] rounded-lg text-white outline-none focus:border-blue-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                      Description &amp; Access Notes:
                    </label>
                    <textarea
                      rows={3}
                      value={eventDescription}
                      onChange={e => setEventDescription(e.target.value)}
                      className="w-full text-xs bg-[#121212] border border-[#2d2d2d] rounded-lg p-3 text-gray-200 outline-none focus:border-blue-400 resize-none leading-relaxed"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-[#262626]">
                    <span className="text-[11px] text-gray-400">
                      Syncs to Primary Google Calendar
                    </span>
                    <button
                      type="submit"
                      disabled={isCreatingEvent || !hasToken}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isCreatingEvent ? 'Adding Event...' : 'Add to Google Calendar'}</span>
                    </button>
                  </div>
                </form>

                {/* Right: Upcoming Events */}
                <div className="lg:col-span-5 bg-[#1a1a1a] p-4 sm:p-5 rounded-xl border border-[#2d2d2d] flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-400" />
                        <span>Upcoming Site Visits &amp; Installs</span>
                      </h3>
                      <button
                        onClick={loadUpcomingEvents}
                        disabled={isLoadingEvents || !hasToken}
                        className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors disabled:opacity-40"
                      >
                        <RefreshCw className={`w-3 h-3 ${isLoadingEvents ? 'animate-spin' : ''}`} />
                        <span>Refresh</span>
                      </button>
                    </div>

                    {!hasToken ? (
                      <div className="p-6 text-center bg-[#141414] rounded-xl border border-dashed border-[#2d2d2d] space-y-2">
                        <Lock className="w-6 h-6 text-gray-500 mx-auto" />
                        <p className="text-xs text-gray-400">
                          Sign in with Google above to view upcoming appointments.
                        </p>
                      </div>
                    ) : calendarEvents.length === 0 ? (
                      <div className="p-6 text-center bg-[#141414] rounded-xl border border-dashed border-[#2d2d2d] space-y-2">
                        <Calendar className="w-6 h-6 text-gray-500 mx-auto" />
                        <p className="text-xs text-gray-400">
                          No upcoming calendar events found. Schedule one using the form on the left!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                        {calendarEvents.map(evt => (
                          <div
                            key={evt.id}
                            className="p-3 bg-[#141414] hover:bg-[#202020] rounded-xl border border-[#262626] transition-colors space-y-1.5"
                          >
                            <div className="flex items-center justify-between text-xs font-bold text-white">
                              <span className="truncate max-w-[200px]">{evt.summary}</span>
                              {evt.htmlLink && (
                                <a
                                  href={evt.htmlLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:text-blue-300"
                                  title="Open in Google Calendar"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-[11px] text-gray-400">
                              <Clock className="w-3 h-3 text-blue-400 shrink-0" />
                              <span>
                                {evt.start
                                  ? new Date(evt.start).toLocaleString([], {
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })
                                  : 'Date pending'}
                              </span>
                            </div>

                            {evt.location && (
                              <div className="flex items-center gap-2 text-[11px] text-gray-400">
                                <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                                <span className="truncate">{evt.location}</span>
                              </div>
                            )}

                            {evt.attendees && evt.attendees.length > 0 && (
                              <div className="text-[10px] text-gray-500 font-mono">
                                {evt.attendees.length} Attendee{evt.attendees.length > 1 ? 's' : ''} invited
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#262626] flex items-center justify-between text-[11px] text-gray-400">
                    <span>Scope: <strong className="text-gray-300 font-mono">calendar.events</strong></span>
                    <a
                      href="https://calendar.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
                    >
                      <span>Open Calendar Web</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: OAUTH & AUDIT */}
          {activeTab === 'audit' && (
            <div className="space-y-5">
              <div className="bg-[#1a1a1a] p-5 rounded-xl border border-[#2d2d2d] space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">
                    Google OAuth 2.0 Security &amp; Least-Privilege Architecture
                  </h3>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  This application connects to Google Cloud Platform using client-side OAuth 2.0. Following strict security protocols, tokens are cached strictly in volatile browser memory and are wiped automatically whenever the user signs out or closes the session.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SCOPES.map(scope => {
                  const isGmail = scope.includes('gmail');
                  return (
                    <div
                      key={scope}
                      className="p-4 bg-[#1a1a1a] rounded-xl border border-[#2d2d2d] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          {isGmail ? (
                            <Mail className="w-4 h-4 text-red-400" />
                          ) : (
                            <Calendar className="w-4 h-4 text-blue-400" />
                          )}
                          <span>{scope.split('/').pop()}</span>
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Active &amp; Granted
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 leading-relaxed font-mono break-all">
                        {scope}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="bg-[#161616] p-4 rounded-xl border border-[#262626] text-xs text-gray-400 space-y-2">
                <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
                  Data Privacy &amp; ATO / Clean Energy Council Compliance
                </h4>
                <p>
                  Emails sent via the Gmail integration contain customer solar proposals, system performance estimates, and statutory STC work orders. Google Calendar appointments contain CEC site inspections and licensed installer appointments. No credentials or refresh tokens are stored in unencrypted persistent storage.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MANDATORY CONFIRMATION DIALOG: SEND EMAIL */}
      {confirmSendEmailOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
          <div className="bg-[#1c1c1c] border border-[#333333] w-full max-w-md rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/30">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Confirm Outgoing Email</h3>
                <span className="text-[11px] text-gray-400">Google Workspace Gmail API</span>
              </div>
            </div>

            <div className="p-3 bg-[#141414] rounded-xl border border-[#262626] text-xs space-y-1.5">
              <p className="text-gray-300">
                Are you sure you want to send this email via your Google account (<strong className="text-white">{currentUser?.email}</strong>)?
              </p>
              <div className="pt-2 border-t border-[#262626] text-[11px] space-y-1">
                <div><span className="text-gray-400">Recipient:</span> <strong className="text-white">{emailTo}</strong></div>
                <div><span className="text-gray-400">Subject:</span> <strong className="text-white">{emailSubject}</strong></div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmSendEmailOpen(false)}
                className="px-4 py-2 rounded-lg bg-[#262626] hover:bg-[#333333] text-gray-300 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeSendEmail}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Confirm &amp; Send Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANDATORY CONFIRMATION DIALOG: CREATE CALENDAR EVENT */}
      {confirmCreateEventOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
          <div className="bg-[#1c1c1c] border border-[#333333] w-full max-w-md rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center gap-3 text-blue-400">
              <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Confirm Calendar Event Creation</h3>
                <span className="text-[11px] text-gray-400">Google Calendar API</span>
              </div>
            </div>

            <div className="p-3 bg-[#141414] rounded-xl border border-[#262626] text-xs space-y-1.5">
              <p className="text-gray-300">
                Are you sure you want to schedule this appointment on your Google Calendar (<strong className="text-white">{currentUser?.email}</strong>)?
              </p>
              <div className="pt-2 border-t border-[#262626] text-[11px] space-y-1">
                <div><span className="text-gray-400">Title:</span> <strong className="text-white">{eventTitle}</strong></div>
                <div><span className="text-gray-400">Date &amp; Time:</span> <strong className="text-white">{eventDate} from {eventStartTime} to {eventEndTime}</strong></div>
                <div><span className="text-gray-400">Location:</span> <strong className="text-white">{eventLocation}</strong></div>
                {eventAttendees && (
                  <div><span className="text-gray-400">Invitees:</span> <strong className="text-white">{eventAttendees}</strong></div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmCreateEventOpen(false)}
                className="px-4 py-2 rounded-lg bg-[#262626] hover:bg-[#333333] text-gray-300 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeCreateEvent}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Confirm &amp; Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
