import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
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
  ArrowRight,
  FileText,
  Image as ImageIcon,
  CheckCheck
} from 'lucide-react';
import {
  getWhatsAppSettings,
  saveWhatsAppSettings,
  getWhatsAppTemplates,
  saveWhatsAppTemplates,
  getWhatsAppLogs,
  saveWhatsAppLogs,
  pingWhatsAppApi,
  sendTestWhatsAppMessage,
  WhatsAppPingResult
} from '../../services/whatsappService';
import { WhatsAppIntegrationSettings, WhatsAppTemplate, WhatsAppMessageLog } from '../../types';

interface WhatsAppSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'settings' | 'templates' | 'test' | 'logs';
}

export const WhatsAppSettingsModal: React.FC<WhatsAppSettingsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'settings'
}) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'templates' | 'test' | 'logs'>(initialTab);

  const [settings, setSettings] = useState<WhatsAppIntegrationSettings>(getWhatsAppSettings);
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>(getWhatsAppTemplates);
  const [logs, setLogs] = useState<WhatsAppMessageLog[]>(getWhatsAppLogs);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Ping test
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<WhatsAppPingResult | null>(null);

  // Send Test state
  const [testRecipient, setTestRecipient] = useState('+61 412 884 910');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('crew_arriving_notice');
  const [customMessage, setCustomMessage] = useState('G\'day Harrison! Your SolarFlow install team is en route with your 13.2kW solar & battery system. See you in 20 minutes.');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [sendTestResult, setSendTestResult] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSettings(getWhatsAppSettings());
      setTemplates(getWhatsAppTemplates());
      setLogs(getWhatsAppLogs());
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveWhatsAppSettings(settings);
    setSettings(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handlePingTest = async () => {
    setIsPinging(true);
    setPingResult(null);
    try {
      const res = await pingWhatsAppApi();
      setPingResult(res);
      if (res.success) {
        setSettings(prev => ({ ...prev, status: 'connected', qualityRating: res.qualityRating }));
      }
    } finally {
      setIsPinging(false);
    }
  };

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testRecipient) return;

    setIsSendingTest(true);
    setSendTestResult(null);
    try {
      const res = await sendTestWhatsAppMessage(testRecipient, customMessage, selectedTemplate);
      setSendTestResult(res.message);
      setLogs(getWhatsAppLogs());
    } finally {
      setIsSendingTest(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 md:p-6 overflow-y-auto">
      <div className="w-full max-w-4xl bg-[#1a1a1a] rounded-2xl shadow-2xl border border-[#2d2d2d] overflow-hidden text-gray-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 md:p-5 bg-[#141414] border-b border-[#262626] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base md:text-lg text-white">WhatsApp Business API Settings</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Cloud API v20.0
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300">
                  Tier 1 (10K/Day)
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Direct Meta Graph API customer messaging, automated dispatch alerts, and switchboard photo ingestion.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#262626] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 md:px-6 bg-[#161616] border-b border-[#262626] shrink-0 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>API &amp; Account Config</span>
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'templates'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Message Templates ({templates.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('test')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'test'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Test Sender</span>
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'logs'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Chat &amp; Photo Logs ({logs.length})</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'settings' && (
            <form onSubmit={handleSave} className="space-y-5">
              {savedSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>WhatsApp Business API configuration saved successfully.</span>
                </div>
              )}

              {/* Status & Diagnostic Banner */}
              <div className="p-4 bg-[#141414] border border-[#262626] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{settings.verifiedName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                        {settings.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Phone Number: <strong className="text-gray-200">{settings.displayPhoneNumber}</strong> • Quality Rating:{' '}
                      <span className="text-emerald-400 font-bold">{settings.qualityRating}</span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handlePingTest}
                  disabled={isPinging}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
                  <span>{isPinging ? 'Pinging Meta API...' : 'Test Meta Connection'}</span>
                </button>
              </div>

              {pingResult && (
                <div className="p-3.5 bg-[#141414] border border-emerald-500/30 rounded-xl text-xs space-y-1">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{pingResult.message}</span>
                  </div>
                  <div className="text-gray-400 text-[11px] grid grid-cols-2 md:grid-cols-4 gap-2 pt-2">
                    <div>WABA: <strong className="text-white">{pingResult.wabaStatus}</strong></div>
                    <div>Phone: <strong className="text-white">{pingResult.phoneStatus}</strong></div>
                    <div>Quality: <strong className="text-emerald-400">{pingResult.qualityRating}</strong></div>
                    <div>Latency: <strong className="text-white">{pingResult.latencyMs}ms</strong></div>
                  </div>
                </div>
              )}

              {/* API Credentials */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Meta Graph API Credentials
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      WhatsApp Business Account ID (WABA ID)
                    </label>
                    <input
                      type="text"
                      value={settings.wabaId}
                      onChange={e => setSettings({ ...settings, wabaId: e.target.value })}
                      className="w-full text-xs font-mono bg-[#141414] border border-[#262626] rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Phone Number ID
                    </label>
                    <input
                      type="text"
                      value={settings.phoneNumberId}
                      onChange={e => setSettings({ ...settings, phoneNumberId: e.target.value })}
                      className="w-full text-xs font-mono bg-[#141414] border border-[#262626] rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Business Display Phone Number
                    </label>
                    <input
                      type="text"
                      value={settings.displayPhoneNumber}
                      onChange={e => setSettings({ ...settings, displayPhoneNumber: e.target.value })}
                      className="w-full text-xs bg-[#141414] border border-[#262626] rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Verified Business Display Name
                    </label>
                    <input
                      type="text"
                      value={settings.verifiedName}
                      onChange={e => setSettings({ ...settings, verifiedName: e.target.value })}
                      className="w-full text-xs bg-[#141414] border border-[#262626] rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    System User Permanent Access Token (Bearer)
                  </label>
                  <input
                    type="password"
                    value={settings.apiToken}
                    onChange={e => setSettings({ ...settings, apiToken: e.target.value })}
                    className="w-full text-xs font-mono bg-[#141414] border border-[#262626] rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    Generated from Meta Business Manager &gt; System Users with <code className="text-gray-300">whatsapp_business_messaging</code> permissions.
                  </p>
                </div>
              </div>

              {/* Webhook Settings */}
              <div className="space-y-4 pt-4 border-t border-[#262626]">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Webhook &amp; Inbound Ingestion Callbacks
                </h3>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Webhook Callback URL (Subscribe in Meta App Dashboard)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={settings.webhookCallbackUrl}
                      className="w-full text-xs font-mono bg-[#141414] border border-[#262626] rounded-xl px-3 py-2 text-gray-300 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => copyToClipboard(settings.webhookCallbackUrl, 'webhookUrl')}
                      className="px-3 py-2 rounded-xl bg-[#262626] hover:bg-[#333] text-gray-300 text-xs font-medium flex items-center gap-1 shrink-0 transition-colors"
                    >
                      {copiedField === 'webhookUrl' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'webhookUrl' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Webhook Verify Token
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={settings.webhookVerifyToken}
                      onChange={e => setSettings({ ...settings, webhookVerifyToken: e.target.value })}
                      className="w-full text-xs font-mono bg-[#141414] border border-[#262626] rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => copyToClipboard(settings.webhookVerifyToken, 'verifyToken')}
                      className="px-3 py-2 rounded-xl bg-[#262626] hover:bg-[#333] text-gray-300 text-xs font-medium flex items-center gap-1 shrink-0 transition-colors"
                    >
                      {copiedField === 'verifyToken' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'verifyToken' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Automation Rules */}
              <div className="space-y-3 pt-4 border-t border-[#262626]">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Automated Solar CRM Dispatch Triggers
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="flex items-start gap-3 p-3 bg-[#141414] border border-[#262626] rounded-xl cursor-pointer hover:border-emerald-500/40 transition-colors">
                    <input
                      type="checkbox"
                      checked={settings.autoSendQuoteNotification}
                      onChange={e => setSettings({ ...settings, autoSendQuoteNotification: e.target.checked })}
                      className="mt-0.5 rounded text-emerald-500 focus:ring-0"
                    />
                    <div>
                      <span className="text-xs font-semibold text-white block">Quote &amp; 3D Proposal Ready Alert</span>
                      <span className="text-[11px] text-gray-400">
                        Dispatches WhatsApp link with interactive 3D roof design once generated in OpenSolar.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-[#141414] border border-[#262626] rounded-xl cursor-pointer hover:border-emerald-500/40 transition-colors">
                    <input
                      type="checkbox"
                      checked={settings.autoSendInstallArrivalAlert}
                      onChange={e => setSettings({ ...settings, autoSendInstallArrivalAlert: e.target.checked })}
                      className="mt-0.5 rounded text-emerald-500 focus:ring-0"
                    />
                    <div>
                      <span className="text-xs font-semibold text-white block">Crew En Route Arrival Notice</span>
                      <span className="text-[11px] text-gray-400">
                        Sends electrician ETA and driveway clearance checklist on the morning of installation.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-[#141414] border border-[#262626] rounded-xl cursor-pointer hover:border-emerald-500/40 transition-colors">
                    <input
                      type="checkbox"
                      checked={settings.autoSendPhotoRequest}
                      onChange={e => setSettings({ ...settings, autoSendPhotoRequest: e.target.checked })}
                      className="mt-0.5 rounded text-emerald-500 focus:ring-0"
                    />
                    <div>
                      <span className="text-xs font-semibold text-white block">Switchboard Photo Request</span>
                      <span className="text-[11px] text-gray-400">
                        Asks new leads to snap their meter box to verify DNSP grid pre-approval requirements.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-[#141414] border border-[#262626] rounded-xl cursor-pointer hover:border-emerald-500/40 transition-colors">
                    <input
                      type="checkbox"
                      checked={settings.allowInboundPhotoIngestion}
                      onChange={e => setSettings({ ...settings, allowInboundPhotoIngestion: e.target.checked })}
                      className="mt-0.5 rounded text-emerald-500 focus:ring-0"
                    />
                    <div>
                      <span className="text-xs font-semibold text-white block">Inbound Photo CRM Auto-Ingest</span>
                      <span className="text-[11px] text-gray-400">
                        Automatically links customer uploaded roof &amp; meter photos directly to their CRM project timeline.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save WhatsApp Settings</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'templates' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Pre-Approved Meta Message Templates</h3>
                  <p className="text-xs text-gray-400">
                    Templates reviewed and approved by Meta for outbound customer communication outside the 24-hour service window.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                  {templates.filter(t => t.status === 'APPROVED').length} Approved
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map(tpl => (
                  <div
                    key={tpl.id}
                    className="p-4 bg-[#141414] border border-[#262626] rounded-xl flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-mono text-xs font-bold text-white">{tpl.name}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#262626] text-gray-300">
                            {tpl.category}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                            {tpl.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed bg-[#1a1a1a] p-3 rounded-lg border border-[#262626]/50">
                        {tpl.bodyText}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#262626] flex items-center justify-between text-[11px] text-gray-400">
                      <span>Parameters: {tpl.parameters.join(', ')}</span>
                      <button
                        onClick={() => {
                          setSelectedTemplate(tpl.name);
                          setCustomMessage(tpl.bodyText);
                          setActiveTab('test');
                        }}
                        className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                      >
                        <span>Test Send</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'test' && (
            <div className="max-w-xl mx-auto space-y-5">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                  <Send className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">Live WhatsApp Message Tester</h3>
                <p className="text-xs text-gray-400">
                  Simulate an outbound notification via the Meta WhatsApp Cloud API gateway to an Australian mobile.
                </p>
              </div>

              {sendTestResult && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{sendTestResult}</span>
                </div>
              )}

              <form onSubmit={handleSendTest} className="space-y-4 bg-[#141414] p-5 rounded-xl border border-[#262626]">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Australian Mobile Recipient Number
                  </label>
                  <input
                    type="text"
                    value={testRecipient}
                    onChange={e => setTestRecipient(e.target.value)}
                    placeholder="+61 4xx xxx xxx"
                    className="w-full text-xs font-mono bg-[#1a1a1a] border border-[#262626] rounded-xl px-3 py-2.5 text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Select Template
                  </label>
                  <select
                    value={selectedTemplate}
                    onChange={e => {
                      setSelectedTemplate(e.target.value);
                      const t = templates.find(item => item.name === e.target.value);
                      if (t) setCustomMessage(t.bodyText);
                    }}
                    className="w-full text-xs bg-[#1a1a1a] border border-[#262626] rounded-xl px-3 py-2.5 text-white outline-none focus:border-emerald-500"
                  >
                    {templates.map(t => (
                      <option key={t.id} value={t.name}>
                        {t.name} ({t.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Rendered Message Body
                  </label>
                  <textarea
                    rows={4}
                    value={customMessage}
                    onChange={e => setCustomMessage(e.target.value)}
                    className="w-full text-xs bg-[#1a1a1a] border border-[#262626] rounded-xl p-3 text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSendingTest}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSendingTest ? 'Dispatched via Meta Gateway...' : 'Send WhatsApp Message Now'}</span>
                </button>
              </form>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">WhatsApp Customer Chat &amp; Media Stream</h3>
                  <p className="text-xs text-gray-400">
                    Two-way conversation log including switchboard verification uploads and automated dispatch alerts.
                  </p>
                </div>
                <span className="text-xs text-gray-400">Showing {logs.length} messages</span>
              </div>

              <div className="space-y-3">
                {logs.map(log => {
                  const isInbound = log.direction === 'inbound';
                  return (
                    <div
                      key={log.id}
                      className={`p-4 rounded-xl border flex flex-col space-y-2 ${
                        isInbound
                          ? 'bg-[#141414] border-emerald-500/30 ml-0 mr-12'
                          : 'bg-[#1f1f1f] border-[#2d2d2d] mr-0 ml-12'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{log.customerName}</span>
                          <span className="text-gray-400 text-[11px] font-mono">{log.customerPhone}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isInbound
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-blue-500/20 text-blue-400'
                            }`}
                          >
                            {log.direction.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-gray-400">
                          <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                          {log.status === 'read' ? (
                            <CheckCheck className="w-3.5 h-3.5 text-emerald-400" title="Read" />
                          ) : (
                            <Check className="w-3.5 h-3.5 text-gray-400" title="Delivered" />
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-gray-200 leading-relaxed">{log.content}</p>

                      {log.mediaUrl && (
                        <div className="mt-2 pt-2 border-t border-[#262626]">
                          <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-semibold mb-1">
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>Attached Photo Evidence</span>
                          </div>
                          <img
                            src={log.mediaUrl}
                            alt="Switchboard photo upload"
                            className="w-48 h-32 object-cover rounded-lg border border-[#333]"
                            referrerPolicy="no-referrer"
                          />
                          {log.mediaCaption && (
                            <p className="text-[11px] text-gray-400 mt-1 italic">{log.mediaCaption}</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
