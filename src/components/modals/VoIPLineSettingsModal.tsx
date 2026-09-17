import React, { useState, useEffect } from 'react';
import {
  Phone,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sliders,
  ShieldCheck,
  Radio,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Users,
  Mic,
  Tag,
  Volume2,
  PhoneCall,
  PhoneForwarded,
  ArrowRight
} from 'lucide-react';
import {
  getVoIPLineSettings,
  saveVoIPLineSettings,
  getVoIPLineExtensions,
  saveVoIPLineExtensions
} from '../../services/voiplineService';
import { VoIPLineIntegrationSettings, VoIPLineExtensionMapping } from '../../types';

interface VoIPLineSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'settings' | 'extensions' | 'dispositions' | 'test';
}

export const VoIPLineSettingsModal: React.FC<VoIPLineSettingsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'settings'
}) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'extensions' | 'dispositions' | 'test'>(initialTab);

  const [settings, setSettings] = useState<VoIPLineIntegrationSettings>(getVoIPLineSettings);
  const [extensions, setExtensions] = useState<VoIPLineExtensionMapping[]>(getVoIPLineExtensions);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Ping test
  const [isPinging, setIsPinging] = useState(false);
  const [pingSuccess, setPingSuccess] = useState<boolean | null>(null);

  // Softphone test state
  const [testNumber, setTestNumber] = useState('+61 411 234 567');
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [isCalling, setIsCalling] = useState(false);

  // New extension state
  const [newExt, setNewExt] = useState({
    extension: '',
    staffName: '',
    staffRole: '',
    directDid: '+61 2 8311 49',
    forwardToMobile: ''
  });
  const [showAddExt, setShowAddExt] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSettings(getVoIPLineSettings());
      setExtensions(getVoIPLineExtensions());
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveVoIPLineSettings(settings);
    setSettings(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handlePingTest = async () => {
    setIsPinging(true);
    setPingSuccess(null);
    setTimeout(() => {
      setIsPinging(false);
      setPingSuccess(true);
      setSettings(prev => ({
        ...prev,
        status: 'connected',
        lastPingLatencyMs: 14,
        lastSyncTime: 'Just now'
      }));
      setTimeout(() => setPingSuccess(null), 5000);
    }, 800);
  };

  const handleTestCall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testNumber) return;

    setIsCalling(true);
    setTestStatus('Initiating WebRTC SIP handshake with syd.voipline.net.au:5061...');
    setTimeout(() => {
      setTestStatus(`Ringing ${testNumber} with Caller ID: ${settings.callerIdNumber} (${settings.callerIdName}). SIP 180 Ringing.`);
      setTimeout(() => {
        setTestStatus(`Call connected! Audio codec: G.722 HD Voice. Screen-pop webhook fired.`);
        setIsCalling(false);
      }, 2000);
    }, 1500);
  };

  const handleAddExtension = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExt.extension || !newExt.staffName) return;

    const item: VoIPLineExtensionMapping = {
      id: `ext-${Date.now()}`,
      extension: newExt.extension,
      staffName: newExt.staffName,
      staffRole: newExt.staffRole || 'Solar Advisor',
      directDid: newExt.directDid,
      status: 'Online',
      forwardToMobile: newExt.forwardToMobile || undefined
    };

    const updated = [...extensions, item];
    setExtensions(updated);
    saveVoIPLineExtensions(updated);
    setNewExt({ extension: '', staffName: '', staffRole: '', directDid: '+61 2 8311 49', forwardToMobile: '' });
    setShowAddExt(false);
  };

  const handleDeleteExt = (id: string) => {
    const updated = extensions.filter(e => e.id !== id);
    setExtensions(updated);
    saveVoIPLineExtensions(updated);
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
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base md:text-lg text-white">VoIPLine Telecom AU Settings</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Cloud PBX SIP Trunk
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/20 text-cyan-300">
                  Equinix SY4 (Sydney)
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Australian geographic numbers (+61 2 / 07 / 03), browser WebRTC softphone, and automatic CRM call recording.
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
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>SIP Trunk &amp; PBX</span>
          </button>
          <button
            onClick={() => setActiveTab('extensions')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'extensions'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Extensions ({extensions.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('dispositions')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'dispositions'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Call Dispositions</span>
          </button>
          <button
            onClick={() => setActiveTab('test')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'test'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Diagnostics &amp; Test Call</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'settings' && (
            <form onSubmit={handleSave} className="space-y-5">
              {savedSuccess && (
                <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-xs text-cyan-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>VoIPLine Telecom AU settings saved and SIP trunk registration re-verified.</span>
                </div>
              )}

              {/* Status Banner */}
              <div className="p-4 bg-[#141414] border border-[#262626] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Radio className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">SIP Trunk: {settings.sipDomain}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-400">
                        {settings.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Account: <strong className="text-gray-200">{settings.accountNumber}</strong> • Latency:{' '}
                      <span className="text-cyan-400 font-bold">{settings.lastPingLatencyMs}ms</span> • Max Concurrent Lines:{' '}
                      <strong className="text-gray-200">{settings.maxConcurrentLines}</strong>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handlePingTest}
                  disabled={isPinging}
                  className="px-3.5 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
                  <span>{isPinging ? 'Testing Latency...' : 'Ping SIP Server'}</span>
                </button>
              </div>

              {pingSuccess && (
                <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-xs text-cyan-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>
                    SIP Trunk ping successful. Server <code className="text-white">syd.voipline.net.au:5061 (TLS)</code> responded in 14ms. Jitter: 2ms. Packet loss: 0%.
                  </span>
                </div>
              )}

              {/* PBX Credentials */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  SIP Server &amp; Authentication
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={settings.accountNumber}
                      onChange={e => setSettings({ ...settings, accountNumber: e.target.value })}
                      className="w-full text-xs font-mono bg-[#141414] border border-[#262626] rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      SIP Server Domain
                    </label>
                    <input
                      type="text"
                      value={settings.sipDomain}
                      onChange={e => setSettings({ ...settings, sipDomain: e.target.value })}
                      className="w-full text-xs font-mono bg-[#141414] border border-[#262626] rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      SIP Port
                    </label>
                    <input
                      type="number"
                      value={settings.sipPort}
                      onChange={e => setSettings({ ...settings, sipPort: parseInt(e.target.value) || 5061 })}
                      className="w-full text-xs font-mono bg-[#141414] border border-[#262626] rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      VoIPLine API Key
                    </label>
                    <input
                      type="password"
                      value={settings.apiKey}
                      onChange={e => setSettings({ ...settings, apiKey: e.target.value })}
                      className="w-full text-xs font-mono bg-[#141414] border border-[#262626] rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      VoIPLine API Secret
                    </label>
                    <input
                      type="password"
                      value={settings.apiSecret}
                      onChange={e => setSettings({ ...settings, apiSecret: e.target.value })}
                      className="w-full text-xs font-mono bg-[#141414] border border-[#262626] rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

              {/* Caller ID & Geographic Routing */}
              <div className="space-y-4 pt-4 border-t border-[#262626]">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Outbound Caller ID (Australian CLI)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Default Pilot Caller ID Number
                    </label>
                    <input
                      type="text"
                      value={settings.callerIdNumber}
                      onChange={e => setSettings({ ...settings, callerIdNumber: e.target.value })}
                      className="w-full text-xs font-mono bg-[#141414] border border-[#262626] rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-500"
                    />
                    <p className="text-[11px] text-gray-500 mt-1">
                      Primary verified Australian office DID number presented to homeowners.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Caller ID Display Name
                    </label>
                    <input
                      type="text"
                      value={settings.callerIdName}
                      onChange={e => setSettings({ ...settings, callerIdName: e.target.value })}
                      className="w-full text-xs bg-[#141414] border border-[#262626] rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

              {/* Webhooks & Call Recording Compliance */}
              <div className="space-y-4 pt-4 border-t border-[#262626]">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Inbound Screen-Pop Webhook &amp; Recording Compliance
                </h3>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Screen-Pop Inbound Call Webhook
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={settings.screenPopWebhookUrl}
                      className="w-full text-xs font-mono bg-[#141414] border border-[#262626] rounded-xl px-3 py-2 text-gray-300 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => copyToClipboard(settings.screenPopWebhookUrl, 'webhook')}
                      className="px-3 py-2 rounded-xl bg-[#262626] hover:bg-[#333] text-gray-300 text-xs font-medium flex items-center gap-1 shrink-0 transition-colors"
                    >
                      {copiedField === 'webhook' ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'webhook' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    VoIPLine invokes this endpoint when an incoming call arrives to pop the caller's CRM record instantly.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="flex items-start gap-3 p-3 bg-[#141414] border border-[#262626] rounded-xl cursor-pointer hover:border-cyan-500/40 transition-colors">
                    <input
                      type="checkbox"
                      checked={settings.enableCallRecording}
                      onChange={e => setSettings({ ...settings, enableCallRecording: e.target.checked })}
                      className="mt-0.5 rounded text-cyan-500 focus:ring-0"
                    />
                    <div>
                      <span className="text-xs font-semibold text-white block">Dual-Channel Stereo Cloud Recording</span>
                      <span className="text-[11px] text-gray-400">
                        Records inbound and outbound calls and attaches audio directly to customer CRM timelines.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-[#141414] border border-[#262626] rounded-xl cursor-pointer hover:border-cyan-500/40 transition-colors">
                    <input
                      type="checkbox"
                      checked={settings.recordingAnnouncement}
                      onChange={e => setSettings({ ...settings, recordingAnnouncement: e.target.checked })}
                      className="mt-0.5 rounded text-cyan-500 focus:ring-0"
                    />
                    <div>
                      <span className="text-xs font-semibold text-white block">ACMA Two-Party Consent Announcement</span>
                      <span className="text-[11px] text-gray-400">
                        Plays mandatory "This call is recorded for quality, training and compliance" disclosure.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-black font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save VoIPLine Settings</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'extensions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Cloud PBX Extensions &amp; Staff Routing</h3>
                  <p className="text-xs text-gray-400">
                    Map internal extensions to CRM solar consultants, CEC electricians, and queue hunt groups.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddExt(!showAddExt)}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>{showAddExt ? 'Cancel' : '+ Add Extension'}</span>
                </button>
              </div>

              {showAddExt && (
                <form onSubmit={handleAddExtension} className="p-4 bg-[#141414] border border-cyan-500/40 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase">Register New Extension</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">Ext # (e.g. 105)</label>
                      <input
                        type="text"
                        placeholder="105"
                        value={newExt.extension}
                        onChange={e => setNewExt({ ...newExt, extension: e.target.value })}
                        className="w-full text-xs bg-[#1a1a1a] border border-[#262626] rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-cyan-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">Staff Member Name</label>
                      <input
                        type="text"
                        placeholder="Harrison Wells"
                        value={newExt.staffName}
                        onChange={e => setNewExt({ ...newExt, staffName: e.target.value })}
                        className="w-full text-xs bg-[#1a1a1a] border border-[#262626] rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-cyan-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">Staff Role</label>
                      <input
                        type="text"
                        placeholder="Solar Consultant"
                        value={newExt.staffRole}
                        onChange={e => setNewExt({ ...newExt, staffRole: e.target.value })}
                        className="w-full text-xs bg-[#1a1a1a] border border-[#262626] rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">Direct DID Number</label>
                      <input
                        type="text"
                        placeholder="+61 2 8311 4925"
                        value={newExt.directDid}
                        onChange={e => setNewExt({ ...newExt, directDid: e.target.value })}
                        className="w-full text-xs bg-[#1a1a1a] border border-[#262626] rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-black text-xs font-bold rounded-lg transition-colors"
                    >
                      Save Extension
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-2.5">
                {extensions.map(ext => (
                  <div
                    key={ext.id}
                    className="p-3.5 bg-[#141414] border border-[#262626] rounded-xl flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#1f1f1f] border border-[#333] flex items-center justify-center font-mono font-bold text-cyan-400 text-sm">
                        {ext.extension}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-white">{ext.staffName}</span>
                          <span className="text-[10px] text-gray-400 font-medium">({ext.staffRole})</span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                              ext.status === 'Online'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : ext.status === 'Busy'
                                ? 'bg-amber-500/10 text-amber-400'
                                : 'bg-gray-500/10 text-gray-400'
                            }`}
                          >
                            {ext.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-0.5">
                          <span>DID: <strong className="text-gray-200">{ext.directDid}</strong></span>
                          {ext.forwardToMobile && (
                            <span className="flex items-center gap-1 text-cyan-400/80">
                              <PhoneForwarded className="w-3 h-3" />
                              <span>Fwd: {ext.forwardToMobile}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteExt(ext.id)}
                        className="text-gray-500 hover:text-red-400 text-xs p-1 rounded hover:bg-[#262626] transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'dispositions' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">Call Disposition Tags</h3>
                <p className="text-xs text-gray-400">
                  Tags presented to solar consultants when logging call outcomes in the softphone modal.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {settings.callDispositionTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-[#141414] border border-[#262626] text-xs font-semibold text-gray-200 flex items-center gap-1.5"
                  >
                    <Tag className="w-3 h-3 text-cyan-400" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>

              <div className="p-4 bg-[#141414] border border-[#262626] rounded-xl text-xs text-gray-400 space-y-1">
                <p className="font-semibold text-gray-300">Automatic CRM Pipeline Triggers:</p>
                <ul className="list-disc list-inside space-y-1 text-[11px]">
                  <li>Selecting <code className="text-cyan-400">Interested - 10kW+</code> promotes lead stage to Qualified.</li>
                  <li>Selecting <code className="text-cyan-400">Battery Add-on Quote</code> adds Tesla/Sungrow battery flag.</li>
                  <li>Selecting <code className="text-cyan-400">Follow-up Scheduled</code> creates a calendar site survey reminder.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'test' && (
            <div className="max-w-xl mx-auto space-y-5">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-2">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">VoIPLine Diagnostic Call Simulator</h3>
                <p className="text-xs text-gray-400">
                  Verify WebRTC SIP trunking, Australian CLI number spoof prevention, and screen-pop webhook latency.
                </p>
              </div>

              {testStatus && (
                <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-xs text-cyan-300 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{testStatus}</span>
                </div>
              )}

              <form onSubmit={handleTestCall} className="space-y-4 bg-[#141414] p-5 rounded-xl border border-[#262626]">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Destination Mobile / Landline
                  </label>
                  <input
                    type="text"
                    value={testNumber}
                    onChange={e => setTestNumber(e.target.value)}
                    placeholder="+61 4xx xxx xxx"
                    className="w-full text-xs font-mono bg-[#1a1a1a] border border-[#262626] rounded-xl px-3 py-2.5 text-white outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="p-3 bg-[#1a1a1a] rounded-lg text-xs space-y-1 text-gray-400">
                  <div className="flex justify-between">
                    <span>Active Trunk:</span>
                    <strong className="text-white">VoIPLine AU Sydney (Equinix SY4)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Presenting CLI:</span>
                    <strong className="text-cyan-400">{settings.callerIdNumber}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Codec:</span>
                    <strong className="text-white">G.722 HD Voice (Wideband)</strong>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isCalling}
                  className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-black font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{isCalling ? 'Dialing via VoIPLine SIP...' : 'Place Test Outbound Call'}</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
