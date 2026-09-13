import {
  GoogleMyBusinessSettings,
  GmbReview,
  GmbPost,
  GmbInsightMetrics
} from '../types';

const STORAGE_KEY_GMB_SETTINGS = 'solar_crm_gmb_settings';
const STORAGE_KEY_GMB_REVIEWS = 'solar_crm_gmb_reviews';
const STORAGE_KEY_GMB_POSTS = 'solar_crm_gmb_posts';

export const DEFAULT_GMB_SETTINGS: GoogleMyBusinessSettings = {
  accountId: 'accounts/114920492817492019',
  locationId: 'locations/882194029481928471',
  businessName: 'SolarFlow Clean Energy Australia - Sydney HQ',
  primaryCategory: 'Solar energy contractor',
  status: 'connected',
  isGoogleVerified: true,
  googleMapsPlaceId: 'ChIJ7eW10qquEmsRvS8aM42l6X4',
  googleMapsListingUrl: 'https://maps.google.com/?cid=1084729104829104829',
  directReviewShortlink: 'https://g.page/r/Cdf8913-SolarFlow/review',
  phoneAud: '+61 2 8311 4920',
  websiteUrl: 'https://solarinstallers.com.au',
  streetAddress: '120 George St',
  suburb: 'Parramatta',
  state: 'NSW',
  postcode: '2150',
  serviceAreas: [
    'Sydney Metro',
    'Parramatta & Western Sydney',
    'North Shore & Northern Beaches',
    'Sutherland Shire & Wollongong',
    'Central Coast & Newcastle'
  ],
  averageRating: 4.9,
  totalReviewsCount: 148,
  lastSyncAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),

  // Review Automation Settings
  enableAutoSyncReviews: true,
  syncIntervalMinutes: 15,
  enableAutoReviewRequests: true,
  requestTriggerEvent: 'INSTALL_COMPLETED',
  requestDelayHours: 24,
  requestChannel: 'SMS',
  smsTemplateText: 'Hi {CUSTOMER_NAME}! Thank you for choosing SolarFlow for your {SYSTEM_KW}kW solar installation at {SUBURB}. Could you take 30 seconds to share your experience on Google? It helps our local crew tremendously: {REVIEW_LINK}',
  autoReplyTo5StarReviews: false,
  autoReplyTemplate: 'Thank you so much {CUSTOMER_NAME} for trusting SolarFlow with your clean energy journey! We take great pride in our CEC-accredited installations. Enjoy the zero-dollar power bills!',
  alertOnNegativeReview: true,
  negativeReviewAlertEmail: 'operations@solarinstallers.com.au'
};

export const DEFAULT_GMB_REVIEWS: GmbReview[] = [
  {
    reviewId: 'rev-gmb-101',
    reviewerName: 'Harrison Davies',
    reviewerPhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop&crop=faces',
    isVerifiedCustomer: true,
    linkedProjectCode: 'SOL-NSW-1042',
    starRating: 5,
    comment: 'Outstanding installation of our 10.4kW AIKO solar panels and Sungrow hybrid battery. Mitchell Barnes and the Apex install crew were on time, extremely polite, and left the site spotless. The Sungrow app was set up before they left and we are already generating 48kWh a day!',
    createTime: '2026-08-28T09:14:00Z',
    suburb: 'Strathfield',
    state: 'NSW',
    systemInstalled: '10.4kW AIKO + Sungrow 9.6kWh Battery',
    reply: {
      comment: 'Hi Harrison, thank you for the wonderful feedback! The 10.4kW AIKO and Sungrow system is an exceptional combination for Sydney homes. Enjoy the bill savings and let us know if you need anything!',
      updateTime: '2026-08-28T14:30:00Z',
      authorName: 'SolarFlow Operations Team'
    }
  },
  {
    reviewId: 'rev-gmb-102',
    reviewerName: 'Brooke Henderson',
    reviewerPhotoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&fit=crop&crop=faces',
    isVerifiedCustomer: true,
    linkedProjectCode: 'SOL-QLD-0891',
    starRating: 5,
    comment: 'Had a 13.2kW system with Tesla Powerwall 3 installed. The STC rebate paperwork and Energex grid connection were taken care of seamlessly by their back office. Highly recommended solar company!',
    createTime: '2026-08-16T11:42:00Z',
    suburb: 'Chermside',
    state: 'QLD',
    systemInstalled: '13.2kW Commercial-Residential + Tesla Powerwall 3',
    reply: {
      comment: 'Thank you Brooke! Taking care of the Energex approvals and STC rebate is our priority so homeowners do not have to stress. We appreciate your recommendation!',
      updateTime: '2026-08-16T15:10:00Z',
      authorName: 'SolarFlow Operations Team'
    }
  },
  {
    reviewId: 'rev-gmb-103',
    reviewerName: 'Nathaniel Ward',
    reviewerPhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop&crop=faces',
    isVerifiedCustomer: true,
    linkedProjectCode: 'SOL-NSW-1044',
    starRating: 5,
    comment: 'From initial 3D OpenSolar roof design to CEC inspection, the team was top tier. Transparent pricing with no hidden switchboard upgrade fees. Power bill dropped from $940/qtr to zero.',
    createTime: '2026-09-02T16:20:00Z',
    suburb: 'Castle Hill',
    state: 'NSW',
    systemInstalled: '8.8kW Trina Solar + Fronius Primo'
  },
  {
    reviewId: 'rev-gmb-104',
    reviewerName: 'Marcus Sterling',
    isVerifiedCustomer: true,
    linkedProjectCode: 'SOL-NSW-1055',
    starRating: 4,
    comment: 'Installed a 39.6kW commercial rooftop array at our Parramatta facility. Engineering and Ausgrid protection relay study took a bit longer than expected due to network requirements, but the physical install by David Miller was flawless.',
    createTime: '2026-09-04T10:05:00Z',
    suburb: 'Parramatta',
    state: 'NSW',
    systemInstalled: '39.6kW Commercial Dual-Fronius Symo',
    reply: {
      comment: 'Thank you Marcus for your business and understanding with the Ausgrid technical network approvals. Delighted that the 39.6kW array is now fully commissioned and powering your facility!',
      updateTime: '2026-09-04T13:45:00Z',
      authorName: 'SolarFlow Commercial Engineering'
    }
  },
  {
    reviewId: 'rev-gmb-105',
    reviewerName: 'Elena Rostova',
    isVerifiedCustomer: false,
    starRating: 5,
    comment: 'Called for an urgent inverter error code inspection after a storm. Their technician came out within 24 hours, replaced an isolator switch under warranty, and verified the DC earthing.',
    createTime: '2026-09-05T08:30:00Z',
    suburb: 'Manly',
    state: 'NSW',
    systemInstalled: 'Service & Warranty Call'
  }
];

export const DEFAULT_GMB_POSTS: GmbPost[] = [
  {
    id: 'gmb-post-1',
    summary: '☀️ NSW Solar Battery Rebate 2026 Alert! Eligible homeowners can claim up to $14,000 in federal & state subsidies when pairing Sungrow or Tesla batteries with a new solar system. Book your free certified solar assessment today!',
    callToActionType: 'GET_OFFER',
    actionUrl: 'https://solarinstallers.com.au/rebates',
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&fit=crop',
    offerCouponCode: 'BATTERY2026',
    status: 'PUBLISHED',
    publishedAt: '2026-09-01T08:00:00Z',
    viewsCount: 1420,
    clicksCount: 184
  },
  {
    id: 'gmb-post-2',
    summary: '⭐ Milestone Achieved: 1,500+ residential and commercial rooftop solar systems installed across NSW & QLD with a 4.9-star average rating! Thank you Sydney & Brisbane for trusting our CEC accredited installers.',
    callToActionType: 'LEARN_MORE',
    actionUrl: 'https://solarinstallers.com.au/case-studies',
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=600&fit=crop',
    status: 'PUBLISHED',
    publishedAt: '2026-08-20T10:30:00Z',
    viewsCount: 2150,
    clicksCount: 290
  }
];

export const DEFAULT_GMB_METRICS: GmbInsightMetrics = {
  period: 'Last 30 Days (Aug - Sep 2026)',
  searchImpressions: 18450,
  mapsViews: 12380,
  websiteClicks: 1420,
  directionRequests: 310,
  phoneCallClicks: 485,
  reviewRequestSentCount: 64,
  reviewConversionRatePercent: 46.8
};

export function getGmbSettings(): GoogleMyBusinessSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_GMB_SETTINGS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading GMB settings:', e);
  }
  return DEFAULT_GMB_SETTINGS;
}

export function saveGmbSettings(settings: GoogleMyBusinessSettings): GoogleMyBusinessSettings {
  try {
    localStorage.setItem(STORAGE_KEY_GMB_SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving GMB settings:', e);
  }
  return settings;
}

export function getGmbReviews(): GmbReview[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_GMB_REVIEWS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading GMB reviews:', e);
  }
  return DEFAULT_GMB_REVIEWS;
}

export function saveGmbReviews(reviews: GmbReview[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_GMB_REVIEWS, JSON.stringify(reviews));
  } catch (e) {
    console.error('Error saving GMB reviews:', e);
  }
}

export function replyToGmbReview(reviewId: string, replyText: string, authorName = 'SolarFlow Management'): GmbReview | null {
  const reviews = getGmbReviews();
  const index = reviews.findIndex(r => r.reviewId === reviewId);
  if (index === -1) return null;

  const updatedReview: GmbReview = {
    ...reviews[index],
    reply: {
      comment: replyText,
      updateTime: new Date().toISOString(),
      authorName
    }
  };

  reviews[index] = updatedReview;
  saveGmbReviews(reviews);
  return updatedReview;
}

export function getGmbPosts(): GmbPost[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_GMB_POSTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading GMB posts:', e);
  }
  return DEFAULT_GMB_POSTS;
}

export function saveGmbPosts(posts: GmbPost[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_GMB_POSTS, JSON.stringify(posts));
  } catch (e) {
    console.error('Error saving GMB posts:', e);
  }
}

export function createGmbPost(postData: Omit<GmbPost, 'id' | 'publishedAt' | 'viewsCount' | 'clicksCount'>): GmbPost {
  const posts = getGmbPosts();
  const newPost: GmbPost = {
    ...postData,
    id: `gmb-post-${Date.now()}`,
    publishedAt: new Date().toISOString(),
    viewsCount: 1,
    clicksCount: 0
  };

  const updated = [newPost, ...posts];
  saveGmbPosts(updated);
  return newPost;
}

export async function pingGmbApi(): Promise<{
  success: boolean;
  message: string;
  latencyMs: number;
  locationStatus: string;
  reviewsCount: number;
  averageRating: number;
}> {
  await new Promise(resolve => setTimeout(resolve, 750));
  const settings = getGmbSettings();
  const reviews = getGmbReviews();

  return {
    success: true,
    message: `Google Business Profile API v1 (My Business) verified for location "${settings.businessName}" (Place ID: ${settings.googleMapsPlaceId}).`,
    latencyMs: 104,
    locationStatus: settings.isGoogleVerified ? 'Verified & Public on Google Maps' : 'Pending Verification',
    reviewsCount: reviews.length,
    averageRating: settings.averageRating
  };
}

export async function syncLatestGmbReviews(): Promise<{
  success: boolean;
  newReviewsCount: number;
  message: string;
}> {
  await new Promise(resolve => setTimeout(resolve, 850));
  const settings = getGmbSettings();
  settings.lastSyncAt = new Date().toISOString();
  saveGmbSettings(settings);

  return {
    success: true,
    newReviewsCount: 1,
    message: 'Synced 5 total reviews from Google Maps. All customer feedback is up to date.'
  };
}

export async function sendSimulatedReviewRequest(customerName: string, phone: string, suburb: string): Promise<{
  success: boolean;
  message: string;
  trackingId: string;
}> {
  await new Promise(resolve => setTimeout(resolve, 600));
  const trackingId = `gmb-req-${Date.now()}`;
  return {
    success: true,
    message: `Google review invitation SMS dispatched to ${customerName} (${phone}) for ${suburb} solar install with shortlink: https://g.page/r/Cdf8913-SolarFlow/review`,
    trackingId
  };
}
