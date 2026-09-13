import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Send,
  Sliders,
  ShieldCheck,
  Phone,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Zap,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  getMessageMediaSettings,
  saveMessageMediaSettings,
  getMessageMediaLogs,
  saveMessageMediaLogs,
  pingMessageMediaGateway,
  sendTestSMSMessageMedia,
  MessageMediaPingResult
} from '../../services/messageMediaService';
import { MessageMediaIntegrationSettings, MessageMediaSMSLogItem } from '../../types';

interface MessageMediaSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'settings' | 'triggers' | 'compliance' | 'test';
}

export const MessageMediaSettingsModal: React.FC<MessageMediaSettingsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'settings'
}) => {
  const { currentUser, contacts, setIsQuickSmsOpen } = useApp();
  const [activeTab, setActiveTab] = useState<'settings' | 'triggers' | 'compliance' | 'test'>(initialTab);

  const [settings, setSettings] = useState<MessageMediaIntegrationSettings>(getMessageMediaSettings);
  const [logs, setLogs] = useState<MessageMediaSMSLogItem[]>(getMessageMediaLogs);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Ping test
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<MessageMediaPingResult | null>(null);

  // Send Test SMS state
  const [testRecipient, setTestRecipient] = useState('+61 411 234 567');
  const [testMessage, setTestMessage] = useState('Hi Harrison, your 13.2kW solar system with Tesla Powerwall 3 is generating 48.2 kWh today! Team SolarFlow.');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [sendTestResult, setSendTestResult] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSettings(getMessageMediaSettings());
      setLogs(getMessageMediaLogs());
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveMessageMediaSettings(settings);
    setSettings(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleTestPing = async () => {
    setIsPinging(true);
    setPingResult(null);
    try {
      const res = await pingMessageMediaGateway();
      setPingResult(res);
      if (res.success) {
        setSettings(prev => ({ ...prev, remainingCredits: res.creditsRemaining }));
      }
    } finally {
      setIsPinging(false);
    }
  };

  const handleSendTestSMS = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testRecipient || !testMessage) return;

    setIsSendingTest(true);
    setSendTestResult(null);
    try {
      const res = await sendTestSMSMessageMedia(testRecipient, testMessage);
      setSendTestResult(res.message);
      setLogs(getMessageMediaLogs());
      setSettings(getMessageMediaSettings());
    } finally {
      setIsSendingTest(false);
    }
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 3000);
  };

  // Character calculation
  const charCount = testMessage.length;
  const smsSegments = Math.ceil(charCount / 160) || 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-4">
      <div className="w-full max-w-4xl bg-[#1e1e1e] rounded-xl shadow-2xl border border-[#2d2d2d] overflow-hidden flex flex-col max-h-[92vh] text-[#e5e7eb]">
        {/* Header */}
        <div className="p-4 bg-[#161616] text-white flex items-center justify-between border-b border-[#262626]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-white tracking-tight">
                  MessageMedia (Sinch) Australian SMS Gateway
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Telstra &amp; Optus Tier-1 Direct
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Account: <span className="font-mono text-white font-semibold">{settings.accountNumber}</span> | Virtual Number:{' '}
                <span className="font-mono text-indigo-300">{settings.dedicatedVirtualNumber}</span> | Balance:{' '}
                <strong className="text-emerald-400">{settings.remainingCredits.toLocaleString()} SMS Credits</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-[#262626] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-4 bg-[#141414] border-b border-[#262626] overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-indigo-400 text-indigo-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>API &amp; Numbers</span>
          </button>
          <button
            onClick={() => setActiveTab('triggers')}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'triggers'
                ? 'border-indigo-400 text-indigo-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Automated Triggers</span>
          </button>
          <button
            onClick={() => setActiveTab('compliance')}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'compliance'
                ? 'border-indigo-400 text-indigo-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Spam Act &amp; Webhooks</span>
          </button>
          <button
            onClick={() => setActiveTab('test')}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'test'
                ? 'border-indigo-400 text-indigo-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Live Test &amp; SMS Logs</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {savedSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>MessageMedia configuration successfully saved!</span>
            </div>
          )}

          {/* TAB 1: API & Numbers */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSave} className="space-y-5">
              <div className="p-4 bg-[#161616] border border-[#262626] rounded-xl flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Phone className="w-4 h-4 text-indigo-400" />
                    Australian Carrier Connectivity
                  </h4>
                  <p className="text-xs text-gray-400">
                    Direct SMS connection via MessageMedia's high-throughput Sydney/Melbourne telecommunications hub, providing guaranteed 2-way delivery to Telstra, Optus, and Vodafone mobiles.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleTestPing}
                  disabled={isPinging}
                  className="px-3 py-1.5 rounded-lg bg-[#262626] hover:bg-[#333] text-gray-200 border border-[#333] text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${isPinging ? 'animate-spin' : ''}`} />
                  <span>{isPinging ? 'Connecting...' : 'Ping Gateway'}</span>
                </button>
              </div>

              {pingResult && (
                <div
                  className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                    pingResult.success
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-red-500/10 border-red-500/30 text-red-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5">
                      {pingResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-red-400" />}
                      {pingResult.message}
                    </span>
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-black/30 font-semibold">
                      {pingResult.latencyMs}ms Latency
                    </span>
                  </div>
                  {pingResult.success && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] pt-1 text-gray-300 border-t border-emerald-500/20">
                      <div>Carrier Route: <strong>{pingResult.routeTier}</strong></div>
                      <div>Credits: <strong>{pingResult.creditsRemaining.toLocaleString()}</strong></div>
                      <div>Sender Mobile: <strong>{pingResult.virtualNumber}</strong></div>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    MessageMedia API Key <span className="text-indigo-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={settings.apiKey}
                    onChange={e => setSettings({ ...settings, apiKey: e.target.value })}
                    className="w-full text-xs font-mono bg-[#121212] border border-[#2d2d2d] rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-400"
                    placeholder="mm_live_ak_..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    HMAC API Secret <span className="text-indigo-400">*</span>
                  </label>
                  <input
                    type="password"
                    value={settings.apiSecret}
                    onChange={e => setSettings({ ...settings, apiSecret: e.target.value })}
                    className="w-full text-xs font-mono bg-[#121212] border border-[#2d2d2d] rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-400"
                    placeholder="mm_sec_..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Account / Customer Number
                  </label>
                  <input
                    type="text"
                    value={settings.accountNumber}
                    onChange={e => setSettings({ ...settings, accountNumber: e.target.value })}
                    className="w-full text-xs font-mono bg-[#121212] border border-[#2d2d2d] rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-400"
                    placeholder="MM-AU-781920"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Dedicated Australian Virtual Mobile (+61 4xx)
                  </label>
                  <input
                    type="text"
                    value={settings.dedicatedVirtualNumber}
                    onChange={e => setSettings({ ...settings, dedicatedVirtualNumber: e.target.value, senderId: e.target.value })}
                    className="w-full text-xs font-mono bg-[#121212] border border-[#2d2d2d] rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-400"
                    placeholder="+61 488 842 910"
                    required
                  />
                  <p className="text-[11px] text-gray-500 mt-1">Allows direct two-way replies into customer CRM timelines</p>
                </div>
              </div>

              <div className="flex items-center justify-end pt-4 border-t border-[#262626]">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-lg text-xs shadow-md transition-colors"
                >
                  Save MessageMedia Settings
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Automated Triggers */}
          {activeTab === 'triggers' && (
            <div className="space-y-5">
              <div className="p-4 bg-[#161616] border border-[#262626] rounded-xl space-y-1">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-indigo-400" />
                  Lifecycle Solar Milestone SMS Notifications
                </h4>
                <p className="text-xs text-gray-400">
                  Trigger automated real-time text messages as projects progress across critical engineering, DNSP approval, and installation milestones.
                </p>
              </div>

              <div className="space-y-3">
                <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[#161616] border border-[#262626] cursor-pointer hover:border-[#333]">
                  <input
                    type="checkbox"
                    checked={settings.autoSendOnSurveyBooked}
                    onChange={e => {
                      const updated = { ...settings, autoSendOnSurveyBooked: e.target.checked };
                      setSettings(updated);
                      saveMessageMediaSettings(updated);
                    }}
                    className="mt-1 rounded bg-[#121212] border-gray-600 text-indigo-500 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Site Survey Assessment Booking SMS
                    </span>
                    <span className="text-[11px] text-gray-400 block mt-0.5">
                      Sends immediate confirmation when a solar assessment survey is scheduled with date, technician name, and safety requirements.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[#161616] border border-[#262626] cursor-pointer hover:border-[#333]">
                  <input
                    type="checkbox"
                    checked={settings.autoSendOnInstallEnRoute}
                    onChange={e => {
                      const updated = { ...settings, autoSendOnInstallEnRoute: e.target.checked };
                      setSettings(updated);
                      saveMessageMediaSettings(updated);
                    }}
                    className="mt-1 rounded bg-[#121212] border-gray-600 text-indigo-500 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Installation Crew "En Route" Alert
                    </span>
                    <span className="text-[11px] text-gray-400 block mt-0.5">
                      Notifies customer on install morning: "Our CEC electrician crew is en route to your property with your solar panels &amp; inverter."
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[#161616] border border-[#262626] cursor-pointer hover:border-[#333]">
                  <input
                    type="checkbox"
                    checked={settings.autoSendOnDnspApproval}
                    onChange={e => {
                      const updated = { ...settings, autoSendOnDnspApproval: e.target.checked };
                      setSettings(updated);
                      saveMessageMediaSettings(updated);
                    }}
                    className="mt-1 rounded bg-[#121212] border-gray-600 text-indigo-500 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      DNSP Grid Connection Permission Notification
                    </span>
                    <span className="text-[11px] text-gray-400 block mt-0.5">
                      Alerts customer as soon as Ausgrid, Endeavour, Essential, or Energex issues grid permission to export solar power.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[#161616] border border-[#262626] cursor-pointer hover:border-[#333]">
                  <input
                    type="checkbox"
                    checked={settings.autoSendOnMaintenanceDue}
                    onChange={e => {
                      const updated = { ...settings, autoSendOnMaintenanceDue: e.target.checked };
                      setSettings(updated);
                      saveMessageMediaSettings(updated);
                    }}
                    className="mt-1 rounded bg-[#121212] border-gray-600 text-indigo-500 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      24-Month CEC Periodic Maintenance Due Reminder
                    </span>
                    <span className="text-[11px] text-gray-400 block mt-0.5">
                      Sends automated safety inspection reminder 2 years post-commissioning with quick booking SMS link.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[#161616] border border-[#262626] cursor-pointer hover:border-[#333]">
                  <input
                    type="checkbox"
                    checked={settings.matchStaffSenderLine}
                    onChange={e => {
                      const updated = { ...settings, matchStaffSenderLine: e.target.checked };
                      setSettings(updated);
                      saveMessageMediaSettings(updated);
                    }}
                    className="mt-1 rounded bg-[#121212] border-gray-600 text-indigo-500 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Dynamic Staff Line Matching (VoIP / SMS Sync)
                    </span>
                    <span className="text-[11px] text-gray-400 block mt-0.5">
                      Routes outgoing text messages using the assigned sales representative's specific geographic mobile line.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* TAB 3: Spam Act & Webhooks */}
          {activeTab === 'compliance' && (
            <div className="space-y-5">
              <div className="p-4 bg-[#161616] border border-[#262626] rounded-xl space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  Australian Spam Act 2003 Compliance Guardrails
                </h4>
                <p className="text-xs text-gray-400">
                  Ensure full compliance with the Australian Communications and Media Authority (ACMA). Commercial SMS messages must include accurate sender identification and a functional unsubscribe facility.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#161616] border border-[#262626] space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.appendSpamActOptOut}
                    onChange={e => {
                      const updated = { ...settings, appendSpamActOptOut: e.target.checked };
                      setSettings(updated);
                      saveMessageMediaSettings(updated);
                    }}
                    className="mt-1 rounded bg-[#121212] border-gray-600 text-indigo-500 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Enforce Automatic "Reply STOP to opt out" Suffix
                    </span>
                    <span className="text-[11px] text-gray-400 block mt-0.5">
                      Automatically appends an ACMA-compliant opt-out suffix to marketing and promotional texts. When a customer replies STOP, our gateway automatically blocks future promotional dispatches.
                    </span>
                  </div>
                </label>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Inbound 2-Way SMS Webhook URL (MessageMedia Portal)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={settings.inboundWebhookUrl}
                      className="w-full text-xs font-mono bg-[#121212] border border-[#2d2d2d] rounded-lg p-2.5 text-white"
                    />
                    <button
                      type="button"
                      onClick={() => copyToClipboard(settings.inboundWebhookUrl, 'inbound')}
                      className="px-3.5 py-2.5 bg-[#262626] hover:bg-[#333] text-gray-200 border border-[#333] rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
                    >
                      {copiedField === 'inbound' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'inbound' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Delivery Receipt (DLR) Status Callback URL
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={settings.dlrWebhookUrl}
                      className="w-full text-xs font-mono bg-[#121212] border border-[#2d2d2d] rounded-lg p-2.5 text-white"
                    />
                    <button
                      type="button"
                      onClick={() => copyToClipboard(settings.dlrWebhookUrl, 'dlr')}
                      className="px-3.5 py-2.5 bg-[#262626] hover:bg-[#333] text-gray-200 border border-[#333] rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
                    >
                      {copiedField === 'dlr' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'dlr' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Live Test & SMS Logs */}
          {activeTab === 'test' && (
            <div className="space-y-6">
              {/* Test SMS dispatch box */}
              <form onSubmit={handleSendTestSMS} className="p-4 bg-[#161616] border border-[#262626] rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Send className="w-4 h-4 text-indigo-400" />
                    Dispatch Immediate Test SMS
                  </h4>
                  <span className="text-[11px] text-gray-400">
                    Dedicated Sender: <strong className="font-mono text-indigo-300">{settings.dedicatedVirtualNumber}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                      Recipient Mobile (+61)
                    </label>
                    <input
                      type="text"
                      value={testRecipient}
                      onChange={e => setTestRecipient(e.target.value)}
                      className="w-full text-xs font-mono bg-[#121212] border border-[#2d2d2d] rounded-lg p-2 text-white focus:outline-none focus:border-indigo-400"
                      placeholder="+61 4xx xxx xxx"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-gray-300">
                        SMS Message Text
                      </label>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {charCount} / 160 chars ({smsSegments} segment{smsSegments > 1 ? 's' : ''})
                      </span>
                    </div>
                    <textarea
                      value={testMessage}
                      onChange={e => setTestMessage(e.target.value)}
                      rows={2}
                      className="w-full text-xs bg-[#121212] border border-[#2d2d2d] rounded-lg p-2 text-white focus:outline-none focus:border-indigo-400 resize-none"
                      required
                    />
                  </div>
                </div>

                {sendTestResult && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{sendTestResult}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setIsQuickSmsOpen(true)}
                    className="text-xs font-semibold text-indigo-400 hover:text-white flex items-center gap-1"
                  >
                    <span>Launch Full 2-Way Chat Modal</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    type="submit"
                    disabled={isSendingTest}
                    className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Send className={`w-3.5 h-3.5 ${isSendingTest ? 'animate-bounce' : ''}`} />
                    <span>{isSendingTest ? 'Dispatching...' : 'Send Live Test SMS'}</span>
                  </button>
                </div>
              </form>

              {/* Delivery History */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">Recent Gateway Message Logs</h4>
                  <span className="text-xs text-gray-400">{logs.length} messages recorded</span>
                </div>

                <div className="space-y-2">
                  {logs.map(log => (
                    <div
                      key={log.id}
                      className="p-3 bg-[#161616] border border-[#262626] rounded-xl text-xs space-y-1.5 hover:border-indigo-500/30 transition-colors"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              log.direction === 'outbound'
                                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {log.direction.toUpperCase()}
                          </span>
                          <span className="font-bold text-white">
                            {log.contactName || log.recipientNumber}
                          </span>
                          <span className="text-[11px] font-mono text-gray-400">
                            ({log.direction === 'outbound' ? `To ${log.recipientNumber}` : `From ${log.senderNumber}`})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[#262626] font-mono text-emerald-400 font-semibold">
                            {log.status}
                          </span>
                          {log.deliveryLatencyMs && (
                            <span className="text-[10px] text-gray-500 font-mono">
                              {log.deliveryLatencyMs}ms
                            </span>
                          )}
                          <span className="text-[10px] text-gray-500">
                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-300 text-[11px] leading-relaxed pl-1 border-l-2 border-[#2d2d2d]">
                        {log.messageText}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
