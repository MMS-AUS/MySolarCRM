import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Star,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Send,
  Sliders,
  ShieldCheck,
  Globe,
  Phone,
  ExternalLink,
  Copy,
  Check,
  MessageSquare,
  Sparkles,
  Zap,
  BarChart3,
  Calendar,
  Share2,
  Tag,
  ArrowRight,
  QrCode,
  Search,
  Eye,
  MousePointerClick,
  UserCheck,
  CornerDownRight,
  Plus
} from 'lucide-react';
import {
  getGmbSettings,
  saveGmbSettings,
  getGmbReviews,
  replyToGmbReview,
  getGmbPosts,
  createGmbPost,
  pingGmbApi,
  syncLatestGmbReviews,
  sendSimulatedReviewRequest,
  DEFAULT_GMB_METRICS
} from '../../services/googleMyBusinessService';
import { GoogleMyBusinessSettings, GmbReview, GmbPost } from '../../types';

interface GoogleMyBusinessSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'settings' | 'reviews' | 'automation' | 'posts' | 'diagnostics';
}

export const GoogleMyBusinessSettingsModal: React.FC<GoogleMyBusinessSettingsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'settings'
}) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'reviews' | 'automation' | 'posts' | 'diagnostics'>(initialTab);

  const [settings, setSettings] = useState<GoogleMyBusinessSettings>(getGmbSettings);
  const [reviews, setReviews] = useState<GmbReview[]>(getGmbReviews);
  const [posts, setPosts] = useState<GmbPost[]>(getGmbPosts);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Review Filter & Reply states
  const [selectedStarFilter, setSelectedStarFilter] = useState<number | 'all' | 'needs_reply'>('all');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [isSyncingReviews, setIsSyncingReviews] = useState(false);
  const [syncReviewsResult, setSyncReviewsResult] = useState<string | null>(null);

  // Review request test simulator
  const [testCustomerName, setTestCustomerName] = useState('Harrison Davies');
  const [testCustomerPhone, setTestCustomerPhone] = useState('+61 411 234 567');
  const [testCustomerSuburb, setTestCustomerSuburb] = useState('Strathfield');
  const [isSendingInvite, setIsSendingInvite] = useState(false);
  const [inviteResult, setInviteResult] = useState<string | null>(null);

  // New Post Form
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPostSummary, setNewPostSummary] = useState('');
  const [newPostCta, setNewPostCta] = useState<'LEARN_MORE' | 'CALL' | 'BOOK' | 'GET_OFFER'>('GET_OFFER');
  const [newPostUrl, setNewPostUrl] = useState('https://solarinstallers.com.au/rebates');
  const [newPostCoupon, setNewPostCoupon] = useState('');

  // Diagnostic Ping state
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<{
    success: boolean;
    message: string;
    latencyMs: number;
    locationStatus: string;
    reviewsCount: number;
    averageRating: number;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSettings(getGmbSettings());
      setReviews(getGmbReviews());
      setPosts(getGmbPosts());
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveGmbSettings(settings);
    setSettings(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSyncReviews = async () => {
    setIsSyncingReviews(true);
    setSyncReviewsResult(null);
    try {
      const res = await syncLatestGmbReviews();
      setSyncReviewsResult(res.message);
      setReviews(getGmbReviews());
      setSettings(getGmbSettings());
    } finally {
      setIsSyncingReviews(false);
    }
  };

  const handleSubmitReply = (reviewId: string) => {
    if (!replyText.trim()) return;
    setIsReplying(true);
    try {
      replyToGmbReview(reviewId, replyText.trim(), 'SolarFlow Management');
      setReviews(getGmbReviews());
      setReplyingToId(null);
      setReplyText('');
    } finally {
      setIsReplying(false);
    }
  };

  const handleSendTestInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingInvite(true);
    setInviteResult(null);
    try {
      const res = await sendSimulatedReviewRequest(testCustomerName, testCustomerPhone, testCustomerSuburb);
      setInviteResult(res.message);
    } finally {
      setIsSendingInvite(false);
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostSummary.trim()) return;
    createGmbPost({
      summary: newPostSummary.trim(),
      callToActionType: newPostCta,
      actionUrl: newPostUrl,
      offerCouponCode: newPostCoupon.trim() || undefined,
      status: 'PUBLISHED'
    });
    setPosts(getGmbPosts());
    setNewPostSummary('');
    setShowNewPostForm(false);
  };

  const handlePing = async () => {
    setIsPinging(true);
    setPingResult(null);
    try {
      const res = await pingGmbApi();
      setPingResult(res);
    } finally {
      setIsPinging(false);
    }
  };

  // Filter reviews
  const filteredReviews = reviews.filter(r => {
    if (selectedStarFilter === 'all') return true;
    if (selectedStarFilter === 'needs_reply') return !r.reply;
    return r.starRating === selectedStarFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-[#181818] border border-[#2d2d2d] rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#262626] flex items-center justify-between bg-[#1f1f1f]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">Google My Business & Reviews</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Profile
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Google Business Profile API • Live Maps Reviews • Auto-Review SMS Invites • Google Posts
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#262626] hover:bg-[#333] text-gray-400 hover:text-white flex items-center justify-center transition-colors text-lg"
          >
            ×
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 border-b border-[#262626] bg-[#1a1a1a]">
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'settings'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Profile & Credentials</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'reviews'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Customer Reviews</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-300 font-bold">
              {reviews.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('automation')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'automation'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Review Request Automations</span>
          </button>

          <button
            onClick={() => setActiveTab('posts')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'posts'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Google Posts</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#333] text-gray-300 font-medium">
              {posts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'diagnostics'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Search Insights & Ping</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-gray-200 text-sm">
          {savedSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Google My Business settings saved and synchronized successfully.</span>
            </div>
          )}

          {/* TAB 1: PROFILE & CREDENTIALS SETTINGS */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-6">
              {/* Profile Header Summary */}
              <div className="p-4 rounded-xl bg-[#202020] border border-[#2d2d2d] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-base">{settings.businessName}</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                        Google Verified
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                      <div className="flex items-center text-amber-400 gap-1 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{settings.averageRating}</span>
                      </div>
                      <span>•</span>
                      <span>{settings.totalReviewsCount} verified Google reviews</span>
                      <span>•</span>
                      <span>{settings.primaryCategory}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={settings.googleMapsListingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-[#282828] hover:bg-[#333] text-gray-200 text-xs font-semibold flex items-center gap-1.5 border border-[#383838] transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                    <span>View on Google Maps</span>
                  </a>
                </div>
              </div>

              {/* API Location IDs */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Google Business Profile API Identity
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Account Resource ID
                    </label>
                    <input
                      type="text"
                      value={settings.accountId}
                      onChange={e => setSettings({ ...settings, accountId: e.target.value })}
                      className="w-full px-3 py-2 bg-[#141414] border border-[#2d2d2d] rounded-lg text-xs text-white focus:outline-hidden focus:border-amber-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Location Resource ID
                    </label>
                    <input
                      type="text"
                      value={settings.locationId}
                      onChange={e => setSettings({ ...settings, locationId: e.target.value })}
                      className="w-full px-3 py-2 bg-[#141414] border border-[#2d2d2d] rounded-lg text-xs text-white focus:outline-hidden focus:border-amber-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Google Maps Place ID
                    </label>
                    <input
                      type="text"
                      value={settings.googleMapsPlaceId}
                      onChange={e => setSettings({ ...settings, googleMapsPlaceId: e.target.value })}
                      className="w-full px-3 py-2 bg-[#141414] border border-[#2d2d2d] rounded-lg text-xs text-white focus:outline-hidden focus:border-amber-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Direct Review Shortlink
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={settings.directReviewShortlink}
                        onChange={e => setSettings({ ...settings, directReviewShortlink: e.target.value })}
                        className="w-full px-3 py-2 bg-[#141414] border border-[#2d2d2d] rounded-lg text-xs text-white focus:outline-hidden focus:border-amber-400 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => handleCopy(settings.directReviewShortlink, 'shortlink')}
                        className="px-3 py-2 bg-[#262626] hover:bg-[#333] text-gray-300 rounded-lg text-xs transition-colors shrink-0 flex items-center gap-1"
                      >
                        {copiedField === 'shortlink' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Physical Address & Contact */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Verified Physical Location & Contact
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-300 mb-1">Street Address</label>
                    <input
                      type="text"
                      value={settings.streetAddress}
                      onChange={e => setSettings({ ...settings, streetAddress: e.target.value })}
                      className="w-full px-3 py-2 bg-[#141414] border border-[#2d2d2d] rounded-lg text-xs text-white focus:outline-hidden focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Suburb</label>
                    <input
                      type="text"
                      value={settings.suburb}
                      onChange={e => setSettings({ ...settings, suburb: e.target.value })}
                      className="w-full px-3 py-2 bg-[#141414] border border-[#2d2d2d] rounded-lg text-xs text-white focus:outline-hidden focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">State</label>
                    <select
                      value={settings.state}
                      onChange={e => setSettings({ ...settings, state: e.target.value })}
                      className="w-full px-3 py-2 bg-[#141414] border border-[#2d2d2d] rounded-lg text-xs text-white focus:outline-hidden focus:border-amber-400"
                    >
                      <option value="NSW">NSW (New South Wales)</option>
                      <option value="QLD">QLD (Queensland)</option>
                      <option value="VIC">VIC (Victoria)</option>
                      <option value="SA">SA (South Australia)</option>
                      <option value="WA">WA (Western Australia)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Postcode</label>
                    <input
                      type="text"
                      value={settings.postcode}
                      onChange={e => setSettings({ ...settings, postcode: e.target.value })}
                      className="w-full px-3 py-2 bg-[#141414] border border-[#2d2d2d] rounded-lg text-xs text-white focus:outline-hidden focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Australian Phone</label>
                    <input
                      type="text"
                      value={settings.phoneAud}
                      onChange={e => setSettings({ ...settings, phoneAud: e.target.value })}
                      className="w-full px-3 py-2 bg-[#141414] border border-[#2d2d2d] rounded-lg text-xs text-white focus:outline-hidden focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Service Areas */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-300">Registered CEC Solar Service Areas</label>
                <div className="flex flex-wrap gap-2 p-3 bg-[#141414] border border-[#2d2d2d] rounded-xl">
                  {settings.serviceAreas.map((area, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-[#222] border border-[#333] text-gray-200 text-xs flex items-center gap-1.5"
                    >
                      <MapPin className="w-3 h-3 text-amber-400" />
                      <span>{area}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4 border-t border-[#262626] flex items-center justify-between">
                <div className="text-xs text-gray-400">
                  Last API Sync: <strong className="text-gray-200">{new Date(settings.lastSyncAt).toLocaleString()}</strong>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save GMB Profile Settings</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: LIVE CUSTOMER REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-5">
              {/* Reviews Header Banner */}
              <div className="p-4 rounded-xl bg-[#202020] border border-[#2d2d2d] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-center px-4 py-2 bg-[#161616] rounded-xl border border-[#262626]">
                    <div className="text-3xl font-extrabold text-amber-400 leading-none">4.9</div>
                    <div className="flex items-center justify-center gap-0.5 text-amber-400 my-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-400">{reviews.length} reviews</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Google Maps Reviews Feed</h3>
                    <p className="text-xs text-gray-400">
                      Synchronized directly via Google Business Profile API. Reply as SolarFlow management directly from CRM.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSyncReviews}
                    disabled={isSyncingReviews}
                    className="px-3.5 py-2 rounded-xl bg-[#282828] hover:bg-[#333] text-gray-200 text-xs font-semibold flex items-center gap-1.5 border border-[#383838] transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isSyncingReviews ? 'animate-spin' : ''}`} />
                    <span>{isSyncingReviews ? 'Syncing...' : 'Sync Reviews Now'}</span>
                  </button>
                </div>
              </div>

              {syncReviewsResult && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{syncReviewsResult}</span>
                </div>
              )}

              {/* Filter Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-400 font-medium mr-1">Filter:</span>
                <button
                  onClick={() => setSelectedStarFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    selectedStarFilter === 'all'
                      ? 'bg-amber-400 text-black'
                      : 'bg-[#222] text-gray-300 hover:bg-[#2c2c2c]'
                  }`}
                >
                  All ({reviews.length})
                </button>
                <button
                  onClick={() => setSelectedStarFilter(5)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    selectedStarFilter === 5
                      ? 'bg-amber-400 text-black'
                      : 'bg-[#222] text-gray-300 hover:bg-[#2c2c2c]'
                  }`}
                >
                  5 Stars ({reviews.filter(r => r.starRating === 5).length})
                </button>
                <button
                  onClick={() => setSelectedStarFilter(4)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    selectedStarFilter === 4
                      ? 'bg-amber-400 text-black'
                      : 'bg-[#222] text-gray-300 hover:bg-[#2c2c2c]'
                  }`}
                >
                  4 Stars ({reviews.filter(r => r.starRating === 4).length})
                </button>
                <button
                  onClick={() => setSelectedStarFilter('needs_reply')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    selectedStarFilter === 'needs_reply'
                      ? 'bg-amber-400 text-black'
                      : 'bg-[#222] text-gray-300 hover:bg-[#2c2c2c]'
                  }`}
                >
                  Awaiting Reply ({reviews.filter(r => !r.reply).length})
                </button>
              </div>

              {/* Reviews List */}
              <div className="space-y-3">
                {filteredReviews.map(review => (
                  <div
                    key={review.reviewId}
                    className="p-4 rounded-xl bg-[#1c1c1c] border border-[#2d2d2d] space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {review.reviewerPhotoUrl ? (
                          <img
                            src={review.reviewerPhotoUrl}
                            alt={review.reviewerName}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-full object-cover border border-[#333]"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center border border-amber-500/30">
                            {review.reviewerName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white text-sm leading-none">{review.reviewerName}</h4>
                            {review.isVerifiedCustomer && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-0.5 font-semibold">
                                <UserCheck className="w-2.5 h-2.5" />
                                Verified CRM Client
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                            <div className="flex items-center text-amber-400">
                              {[...Array(review.starRating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-amber-400" />
                              ))}
                            </div>
                            <span>•</span>
                            <span>{new Date(review.createTime).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{review.suburb}, {review.state}</span>
                          </div>
                        </div>
                      </div>

                      {review.linkedProjectCode && (
                        <span className="px-2 py-1 rounded-lg bg-[#262626] text-gray-300 text-[11px] font-mono border border-[#333]">
                          {review.linkedProjectCode}
                        </span>
                      )}
                    </div>

                    {/* Installed solar system tag */}
                    {review.systemInstalled && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#242424] border border-[#333] text-[11px] text-amber-300">
                        <Zap className="w-3 h-3 text-amber-400" />
                        <span>{review.systemInstalled}</span>
                      </div>
                    )}

                    {/* Comment text */}
                    <p className="text-xs text-gray-300 leading-relaxed bg-[#161616] p-3 rounded-lg border border-[#242424]">
                      "{review.comment}"
                    </p>

                    {/* Existing Owner Reply */}
                    {review.reply && (
                      <div className="ml-4 p-3 rounded-lg bg-[#202020] border-l-2 border-amber-400 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-amber-300 flex items-center gap-1">
                            <CornerDownRight className="w-3 h-3" />
                            Response from {review.reply.authorName}
                          </span>
                          <span className="text-gray-400 text-[10px]">
                            {new Date(review.reply.updateTime).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-300 italic">{review.reply.comment}</p>
                      </div>
                    )}

                    {/* Inline Reply Composer */}
                    {replyingToId === review.reviewId ? (
                      <div className="p-3 bg-[#161616] border border-[#2d2d2d] rounded-xl space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-amber-300 flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5" />
                            Post Public Reply to Google Maps
                          </span>
                          <button
                            onClick={() => setReplyingToId(null)}
                            className="text-gray-400 hover:text-white text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                          placeholder={`Write a friendly CEC-accredited solar reply to ${review.reviewerName}...`}
                          className="w-full px-3 py-2 bg-[#1f1f1f] border border-[#333] rounded-lg text-xs text-white focus:outline-hidden focus:border-amber-400"
                        />
                        <div className="flex items-center justify-between">
                          {/* Quick response templates */}
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => setReplyText(`Hi ${review.reviewerName}, thank you for trusting SolarFlow with your clean energy installation! Delighted with your zero-dollar bills.`)}
                              className="px-2 py-0.5 rounded bg-[#252525] hover:bg-[#333] text-[10px] text-gray-300 border border-[#333]"
                            >
                              + Standard Thanks
                            </button>
                            <button
                              type="button"
                              onClick={() => setReplyText(`Thank you ${review.reviewerName}! Our CEC-accredited installers always aim for five-star quality. Enjoy your battery system!`)}
                              className="px-2 py-0.5 rounded bg-[#252525] hover:bg-[#333] text-[10px] text-gray-300 border border-[#333]"
                            >
                              + Battery Install Thanks
                            </button>
                          </div>
                          <button
                            onClick={() => handleSubmitReply(review.reviewId)}
                            disabled={isReplying || !replyText.trim()}
                            className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{isReplying ? 'Publishing...' : 'Publish to Google Maps'}</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      !review.reply && (
                        <div className="flex justify-end">
                          <button
                            onClick={() => {
                              setReplyingToId(review.reviewId);
                              setReplyText(`Hi ${review.reviewerName}, thank you for choosing SolarFlow for your solar installation in ${review.suburb}! We really appreciate your recommendation.`);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#242424] hover:bg-[#2e2e2e] text-amber-300 hover:text-amber-200 text-xs font-semibold border border-[#333] flex items-center gap-1.5 transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Reply to Review</span>
                          </button>
                        </div>
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: REVIEW REQUEST AUTOMATION */}
          {activeTab === 'automation' && (
            <div className="space-y-6">
              {/* Automatic Invite Rules */}
              <div className="p-4 rounded-xl bg-[#202020] border border-[#2d2d2d] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Zap className="w-5 h-5 text-amber-400" />
                    <div>
                      <h3 className="font-bold text-white text-sm">Automated Post-Install Review Invitation</h3>
                      <p className="text-xs text-gray-400">
                        Automatically trigger review invitation SMS & Email when a solar installation is finished.
                      </p>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.enableAutoReviewRequests}
                      onChange={e => setSettings({ ...settings, enableAutoReviewRequests: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-[#2d2d2d] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-[#121212] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-400"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-[#2a2a2a]">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">CRM Trigger Event</label>
                    <select
                      value={settings.requestTriggerEvent}
                      onChange={e => setSettings({ ...settings, requestTriggerEvent: e.target.value as any })}
                      className="w-full px-3 py-2 bg-[#141414] border border-[#2d2d2d] rounded-lg text-xs text-white focus:outline-hidden focus:border-amber-400"
                    >
                      <option value="INSTALL_COMPLETED">Installation Completed & Commissioned</option>
                      <option value="STC_SUBMITTED">STC Certificate Approved</option>
                      <option value="INVOICE_PAID">Final Invoice Marked Paid in Xero</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Dispatch Delay</label>
                    <select
                      value={settings.requestDelayHours}
                      onChange={e => setSettings({ ...settings, requestDelayHours: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-[#141414] border border-[#2d2d2d] rounded-lg text-xs text-white focus:outline-hidden focus:border-amber-400"
                    >
                      <option value={1}>1 Hour After Sign-off</option>
                      <option value={6}>6 Hours After Sign-off</option>
                      <option value={24}>24 Hours (Next Day Morning)</option>
                      <option value={48}>48 Hours After Commissioning</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Dispatch Channel</label>
                    <select
                      value={settings.requestChannel}
                      onChange={e => setSettings({ ...settings, requestChannel: e.target.value as any })}
                      className="w-full px-3 py-2 bg-[#141414] border border-[#2d2d2d] rounded-lg text-xs text-white focus:outline-hidden focus:border-amber-400"
                    >
                      <option value="SMS">Australian Mobile SMS (MessageMedia)</option>
                      <option value="EMAIL">Customer Email</option>
                      <option value="BOTH">SMS + Email Dual Send</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    SMS Review Invite Template
                  </label>
                  <textarea
                    rows={3}
                    value={settings.smsTemplateText}
                    onChange={e => setSettings({ ...settings, smsTemplateText: e.target.value })}
                    className="w-full px-3 py-2 bg-[#141414] border border-[#2d2d2d] rounded-lg text-xs text-white focus:outline-hidden focus:border-amber-400 leading-relaxed font-mono"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    Supported tags: <code className="text-amber-300">{'{CUSTOMER_NAME}'}</code>, <code className="text-amber-300">{'{SYSTEM_KW}'}</code>, <code className="text-amber-300">{'{SUBURB}'}</code>, <code className="text-amber-300">{'{REVIEW_LINK}'}</code>
                  </span>
                </div>
              </div>

              {/* Installer Handover QR Code Generator */}
              <div className="p-4 rounded-xl bg-[#202020] border border-[#2d2d2d] flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                    <QrCode className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">On-Site Inverter Handover QR Code</h4>
                    <p className="text-xs text-gray-400">
                      Print or display on installer iPads for instant 5-star Google review submissions while on site.
                    </p>
                    <span className="text-xs text-amber-300 font-mono mt-0.5 block">{settings.directReviewShortlink}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(settings.directReviewShortlink, 'qr_url')}
                  className="px-3 py-1.5 rounded-lg bg-[#282828] hover:bg-[#333] text-gray-200 text-xs font-semibold flex items-center gap-1.5 border border-[#383838] transition-colors"
                >
                  {copiedField === 'qr_url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy QR Link</span>
                </button>
              </div>

              {/* Instant Test Dispatch Simulator */}
              <div className="p-4 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] space-y-3">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                  Send Test Review Invite (Simulated Dispatch)
                </h4>
                <form onSubmit={handleSendTestInvite} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Customer Name</label>
                    <input
                      type="text"
                      value={testCustomerName}
                      onChange={e => setTestCustomerName(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-[#141414] border border-[#333] rounded-lg text-xs text-white focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Mobile Number</label>
                    <input
                      type="text"
                      value={testCustomerPhone}
                      onChange={e => setTestCustomerPhone(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-[#141414] border border-[#333] rounded-lg text-xs text-white focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Suburb</label>
                    <input
                      type="text"
                      value={testCustomerSuburb}
                      onChange={e => setTestCustomerSuburb(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-[#141414] border border-[#333] rounded-lg text-xs text-white focus:outline-hidden"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      disabled={isSendingInvite}
                      className="w-full py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Send className="w-3 h-3" />
                      <span>{isSendingInvite ? 'Sending...' : 'Send Test SMS'}</span>
                    </button>
                  </div>
                </form>

                {inviteResult && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{inviteResult}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: GOOGLE POSTS PUBLISHER */}
          {activeTab === 'posts' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm">Google Maps Posts & Promotions</h3>
                  <p className="text-xs text-gray-400">
                    Publish solar battery rebate updates, seasonal offers, and milestones directly to your Google Maps business profile.
                  </p>
                </div>
                <button
                  onClick={() => setShowNewPostForm(!showNewPostForm)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showNewPostForm ? 'Close Form' : 'New Google Post'}</span>
                </button>
              </div>

              {/* Create Post Form */}
              {showNewPostForm && (
                <form onSubmit={handleCreatePost} className="p-4 rounded-xl bg-[#202020] border border-[#333] space-y-4">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    Draft New Google Business Post
                  </h4>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Post Summary / Announcement</label>
                    <textarea
                      rows={3}
                      value={newPostSummary}
                      onChange={e => setNewPostSummary(e.target.value)}
                      placeholder="e.g. ☀️ Claim up to $14,000 in NSW Battery Rebates with SolarFlow's Sungrow Hybrid Package..."
                      className="w-full px-3 py-2 bg-[#141414] border border-[#333] rounded-lg text-xs text-white focus:outline-hidden focus:border-amber-400 leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Call to Action Button</label>
                      <select
                        value={newPostCta}
                        onChange={e => setNewPostCta(e.target.value as any)}
                        className="w-full px-3 py-2 bg-[#141414] border border-[#333] rounded-lg text-xs text-white focus:outline-hidden"
                      >
                        <option value="GET_OFFER">Get Offer</option>
                        <option value="LEARN_MORE">Learn More</option>
                        <option value="CALL">Call Now</option>
                        <option value="BOOK">Book Site Assessment</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Landing Page URL</label>
                      <input
                        type="text"
                        value={newPostUrl}
                        onChange={e => setNewPostUrl(e.target.value)}
                        className="w-full px-3 py-2 bg-[#141414] border border-[#333] rounded-lg text-xs text-white focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Offer / Coupon Code (Optional)</label>
                      <input
                        type="text"
                        value={newPostCoupon}
                        onChange={e => setNewPostCoupon(e.target.value)}
                        placeholder="e.g. BATTERY2026"
                        className="w-full px-3 py-2 bg-[#141414] border border-[#333] rounded-lg text-xs text-white focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowNewPostForm(false)}
                      className="px-3 py-1.5 bg-[#262626] text-gray-300 rounded-lg text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Publish to Google Maps</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Published Posts List */}
              <div className="space-y-4">
                {posts.map(post => (
                  <div
                    key={post.id}
                    className="p-4 rounded-xl bg-[#1c1c1c] border border-[#2d2d2d] flex flex-col md:flex-row gap-4 justify-between"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {post.status}
                        </span>
                        <span className="text-xs text-gray-400">
                          Published: {new Date(post.publishedAt).toLocaleDateString()}
                        </span>
                        {post.offerCouponCode && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                            Code: {post.offerCouponCode}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-200 leading-relaxed">{post.summary}</p>

                      <div className="flex items-center gap-4 text-xs text-gray-400 pt-1">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-gray-400" />
                          <strong className="text-white">{post.viewsCount.toLocaleString()}</strong> views
                        </span>
                        <span className="flex items-center gap-1">
                          <MousePointerClick className="w-3.5 h-3.5 text-amber-400" />
                          <strong className="text-amber-300">{post.clicksCount.toLocaleString()}</strong> clicks
                        </span>
                        <span className="text-[11px] text-gray-400">
                          CTA: <strong className="text-gray-200">{post.callToActionType.replace('_', ' ')}</strong>
                        </span>
                      </div>
                    </div>

                    {post.imageUrl && (
                      <div className="shrink-0 w-full md:w-32 h-24 rounded-lg overflow-hidden border border-[#333]">
                        <img
                          src={post.imageUrl}
                          alt="Post asset"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: LOCAL SEARCH INSIGHTS & API DIAGNOSTICS */}
          {activeTab === 'diagnostics' && (
            <div className="space-y-6">
              {/* Performance Metrics Cards */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Google Maps & Search Performance ({DEFAULT_GMB_METRICS.period})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 bg-[#202020] border border-[#2d2d2d] rounded-xl">
                    <div className="text-[11px] text-gray-400 flex items-center gap-1 mb-1">
                      <Search className="w-3.5 h-3.5 text-sky-400" />
                      <span>Search Impressions</span>
                    </div>
                    <div className="text-xl font-bold text-white">
                      {DEFAULT_GMB_METRICS.searchImpressions.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-emerald-400 font-semibold">+18.4% vs last month</span>
                  </div>

                  <div className="p-3 bg-[#202020] border border-[#2d2d2d] rounded-xl">
                    <div className="text-[11px] text-gray-400 flex items-center gap-1 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>Maps Views</span>
                    </div>
                    <div className="text-xl font-bold text-white">
                      {DEFAULT_GMB_METRICS.mapsViews.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-emerald-400 font-semibold">+12.1% local traffic</span>
                  </div>

                  <div className="p-3 bg-[#202020] border border-[#2d2d2d] rounded-xl">
                    <div className="text-[11px] text-gray-400 flex items-center gap-1 mb-1">
                      <Globe className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Website Clicks</span>
                    </div>
                    <div className="text-xl font-bold text-white">
                      {DEFAULT_GMB_METRICS.websiteClicks.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-indigo-300 font-semibold">11.4% CTR to quote form</span>
                  </div>

                  <div className="p-3 bg-[#202020] border border-[#2d2d2d] rounded-xl">
                    <div className="text-[11px] text-gray-400 flex items-center gap-1 mb-1">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Phone Calls</span>
                    </div>
                    <div className="text-xl font-bold text-white">
                      {DEFAULT_GMB_METRICS.phoneCallClicks.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-emerald-400 font-semibold">Direct click-to-call</span>
                  </div>
                </div>
              </div>

              {/* API Ping & Diagnostic Check */}
              <div className="p-4 rounded-xl bg-[#1c1c1c] border border-[#2d2d2d] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">Google Business Profile API Diagnostics</h4>
                    <p className="text-xs text-gray-400">
                      Verify connection to Google Cloud Business Profile API v1 endpoints and check latency.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handlePing}
                    disabled={isPinging}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
                    <span>{isPinging ? 'Testing API...' : 'Test Google API Ping'}</span>
                  </button>
                </div>

                {pingResult && (
                  <div className="p-4 rounded-xl bg-[#141414] border border-amber-500/30 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{pingResult.message}</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 text-xs">
                      <div className="p-2 bg-[#1f1f1f] rounded-lg">
                        <span className="text-[10px] text-gray-400 block">Round-trip Latency</span>
                        <strong className="text-white">{pingResult.latencyMs} ms</strong>
                      </div>
                      <div className="p-2 bg-[#1f1f1f] rounded-lg">
                        <span className="text-[10px] text-gray-400 block">Profile Status</span>
                        <strong className="text-emerald-400">{pingResult.locationStatus}</strong>
                      </div>
                      <div className="p-2 bg-[#1f1f1f] rounded-lg">
                        <span className="text-[10px] text-gray-400 block">Total Reviews</span>
                        <strong className="text-white">{pingResult.reviewsCount}</strong>
                      </div>
                      <div className="p-2 bg-[#1f1f1f] rounded-lg">
                        <span className="text-[10px] text-gray-400 block">Average Rating</span>
                        <strong className="text-amber-400">{pingResult.averageRating} ★</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#262626] bg-[#1a1a1a] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Google Business Profile API: <strong>Operational</strong></span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#262626] hover:bg-[#333] text-gray-200 hover:text-white text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
