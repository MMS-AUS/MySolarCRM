import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, Send, User, FolderKanban, CheckCheck, Clock } from 'lucide-react';

export const MessageMediaSMSModal: React.FC = () => {
  const { isQuickSmsOpen, setIsQuickSmsOpen, currentUser, contacts, projects, smsMessages, sendSMS } = useApp();
  const [selectedContactId, setSelectedContactId] = useState<string>(contacts[0]?.id || '');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [messageText, setMessageText] = useState('');
  const [activeSenderNumber, setActiveSenderNumber] = useState<string>(currentUser.voipLineNumber || '+61 2 8311 4920');

  if (!isQuickSmsOpen) return null;

  const currentContact = contacts.find(c => c.id === selectedContactId);
  const contactPhone = currentContact?.phone || '';

  // Filter messages for this contact or number
  const conversation = smsMessages.filter(
    m =>
      (m.contactId && m.contactId === selectedContactId) ||
      (m.recipientNumber === contactPhone || m.senderNumber === contactPhone)
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !contactPhone) return;

    sendSMS(contactPhone, messageText.trim(), selectedContactId, selectedProjectId || undefined);
    setMessageText('');
  };

  const insertSnippet = (text: string) => {
    setMessageText(prev => (prev ? `${prev} ${text}` : text));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl bg-[#1e1e1e] rounded-xl shadow-2xl border border-[#2d2d2d] overflow-hidden flex flex-col max-h-[85vh] text-[#e5e7eb]">
        {/* Header */}
        <div className="p-4 bg-[#161616] text-white flex items-center justify-between border-b border-[#262626]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#bef2641a] text-[#bef264] border border-[#bef26433]">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">MessageMedia (Sinch) 2-Way SMS</h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                  AU Direct Route
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Sender Number:{' '}
                <span className="text-[#bef264] font-mono">{activeSenderNumber}</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsQuickSmsOpen(false)}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#262626] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Sender Line & Linking options */}
        <div className="px-4 py-3 bg-[#161616] border-b border-[#262626] grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Select Contact
            </label>
            <select
              value={selectedContactId}
              onChange={e => setSelectedContactId(e.target.value)}
              className="w-full text-xs bg-[#121212] border border-[#262626] text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#bef264]"
            >
              {contacts.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone}) - {c.city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Link with Project
            </label>
            <select
              value={selectedProjectId}
              onChange={e => setSelectedProjectId(e.target.value)}
              className="w-full text-xs bg-[#121212] border border-[#262626] text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#bef264]"
            >
              <option value="">-- None / General Inquiry --</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.projectCode} - {p.customerName} ({p.status})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Outbound Sender Line
            </label>
            <select
              value={activeSenderNumber}
              onChange={e => setActiveSenderNumber(e.target.value)}
              className="w-full text-xs bg-[#121212] border border-[#262626] text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#bef264]"
            >
              <option value={currentUser.voipLineNumber || '+61 2 8311 4920'}>
                {currentUser.name} (Assigned: {currentUser.voipLineNumber || '+61 2 8311 4920'})
              </option>
              <option value="+61 2 8311 4920">+61 2 8311 4920 (Sydney NSW Head Office)</option>
              <option value="+61 7 3184 8921">+61 7 3184 8921 (Brisbane QLD Operations)</option>
            </select>
          </div>
        </div>

        {/* Message Thread History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#121212] min-h-[220px]">
          {conversation.length === 0 ? (
            <div className="text-center py-10 text-gray-500 text-xs">
              No previous SMS messages with this contact. Send a text below to initiate the thread.
            </div>
          ) : (
            conversation.map(msg => {
              const isMe = msg.direction === 'outbound';
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 shadow-xs text-xs ${
                      isMe
                        ? 'bg-[#bef264] text-black font-medium rounded-br-none'
                        : 'bg-[#1e1e1e] text-gray-200 border border-[#262626] rounded-bl-none'
                    }`}
                  >
                    <div className={`flex items-center justify-between gap-3 text-[10px] mb-1 ${isMe ? 'text-black/70' : 'text-gray-400'}`}>
                      <span>{isMe ? 'You via ' + msg.senderNumber : msg.senderNumber}</span>
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.messageText}</p>
                    {isMe && (
                      <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-black/70">
                        <span>Delivered</span>
                        <CheckCheck className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Snippets */}
        <div className="px-4 py-2 bg-[#161616] border-t border-[#262626] flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-gray-400 font-medium whitespace-nowrap">Snippets:</span>
          <button
            type="button"
            onClick={() => insertSnippet('Your solar installation has been scheduled for this week.')}
            className="px-2 py-0.5 rounded bg-[#1e1e1e] hover:bg-[#262626] text-gray-300 border border-[#262626] whitespace-nowrap transition-colors"
          >
            📅 Install Scheduled
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('Your BridgeSelect STC rebate has been verified and applied to your account.')}
            className="px-2 py-0.5 rounded bg-[#1e1e1e] hover:bg-[#262626] text-gray-300 border border-[#262626] whitespace-nowrap transition-colors"
          >
            ☀️ STC Verified
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('Reminder: Your 2-year solar system maintenance checkup is due.')}
            className="px-2 py-0.5 rounded bg-[#1e1e1e] hover:bg-[#262626] text-gray-300 border border-[#262626] whitespace-nowrap transition-colors"
          >
            🔧 2-Year Service
          </button>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-[#161616] border-t border-[#262626] flex items-center gap-2">
          <input
            type="text"
            value={messageText}
            onChange={e => setMessageText(e.target.value)}
            placeholder={`Message to ${contactPhone}...`}
            className="flex-1 text-sm bg-[#121212] border border-[#262626] text-white rounded-lg px-3 py-2 outline-none focus:border-[#bef264] placeholder:text-gray-500"
          />
          <button
            type="submit"
            disabled={!messageText.trim() || !contactPhone}
            className="px-4 py-2 rounded-lg bg-[#bef264] hover:bg-[#a3e635] disabled:opacity-40 text-black font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send SMS</span>
          </button>
        </form>
      </div>
    </div>
  );
};
