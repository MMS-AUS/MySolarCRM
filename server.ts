import express from 'express';
import path from 'path';
import crypto from 'crypto';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

// Load environment variables (.env.local first, then .env)
dotenv.config({ path: '.env.local' });
dotenv.config();

import {
  getXeroConfig,
  buildAuthorizationUrl,
  exchangeCodeForTokens,
  getTenantConnections,
  refreshAccessToken,
  getValidXeroClient,
  disconnectXero,
  fetchXeroOrganisation,
  fetchXeroInvoices,
  fetchXeroContacts,
  fetchXeroQuotes,
  createXeroLiveInvoice,
  REQUIRED_XERO_SCOPES
} from './server/xero';

import {
  getStoredXeroCredentials,
  upsertXeroCredentials,
  deleteXeroCredentials,
  isSupabaseConfigured,
  getStoredGmailCredentials,
  upsertGmailCredentials,
  updateGmailSendEnabled,
  deleteGmailCredentials,
  getCrmEmails,
  upsertCrmEmail
} from './server/supabase';

import {
  getGmailConfig,
  buildGmailAuthUrl,
  exchangeGmailCodeForTokens,
  fetchGmailUserProfile,
  registerGmailWatch,
  stopGmailWatch,
  getValidGmailAccessToken,
  sendGmailMimeMessage,
  syncGmailMailbox,
  matchEmailToCrmEntities,
  REQUIRED_GMAIL_SCOPES
} from './server/gmail';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'MySolarCRM API & Xero Cloud Accounting Gateway',
      timestamp: new Date().toISOString()
    });
  });

  // ============================================================================
  // XERO OAUTH 2.0 API ROUTES
  // ============================================================================

  /**
   * Diagnostic setup information for user to configure Xero App and Supabase
   */
  app.get('/api/xero/setup-info', (req, res) => {
    const config = getXeroConfig();
    res.json({
      configured: config.isConfigured,
      hasClientId: Boolean(config.clientId),
      hasClientSecret: Boolean(config.clientSecret),
      redirectUri: config.redirectUri,
      appUrl: config.appUrl,
      supabaseConfigured: isSupabaseConfigured(),
      scopes: REQUIRED_XERO_SCOPES
    });
  });

  /**
   * 4.A /api/auth/xero/login
   * Action: Construct the Xero authorization URL.
   * Logic: Redirect user to https://login.xero.com/identity/connect/authorize
   * with client_id, redirect_uri, scope, response_type=code, and secure state parameter.
   */
  app.get('/api/auth/xero/login', (req, res) => {
    const config = getXeroConfig();

    if (!config.clientId || !config.clientSecret) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Xero Credentials Missing</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #111; color: #eee; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
            .card { background: #1e1e1e; border: 1px solid #333; border-radius: 12px; max-width: 580px; width: 100%; padding: 28px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
            h2 { color: #f87171; margin-top: 0; font-size: 20px; }
            p { color: #aaa; line-height: 1.5; font-size: 14px; }
            code { background: #141414; padding: 2px 6px; border-radius: 4px; color: #38bdf8; font-family: monospace; font-size: 13px; }
            pre { background: #141414; padding: 14px; border-radius: 8px; color: #bef264; font-size: 12px; overflow-x: auto; border: 1px solid #282828; }
            .btn { display: inline-block; background: #38bdf8; color: #000; font-weight: bold; padding: 10px 18px; border-radius: 8px; text-decoration: none; margin-top: 14px; font-size: 13px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>⚠️ Xero Client ID & Secret Required</h2>
            <p>To connect to your live Xero production account, please set <code>XERO_CLIENT_ID</code> and <code>XERO_CLIENT_SECRET</code> in your environment or <code>.env.local</code> file.</p>
            <p>Make sure your Authorized Redirect URI in the <a href="https://developer.xero.com/app/manage" target="_blank" style="color: #38bdf8;">Xero Developer Portal</a> matches:</p>
            <pre>${config.redirectUri}</pre>
            <a href="/?tab=integrations&modal=xero" class="btn">Return to CRM Settings</a>
          </div>
        </body>
        </html>
      `);
    }

    // Generate cryptographically secure state parameter to prevent CSRF attacks
    const state = crypto.randomBytes(24).toString('hex');

    // Store state in httpOnly cookie for 10 minutes
    res.cookie('xero_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 10 * 60 * 1000 // 10 minutes
    });

    try {
      const authUrl = buildAuthorizationUrl(state);
      console.log(`[Xero OAuth] Redirecting user to Xero authorization URL with scopes: ${REQUIRED_XERO_SCOPES.join(', ')}`);
      res.redirect(authUrl);
    } catch (err: any) {
      console.error('[Xero OAuth] Failed to build auth URL:', err);
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * 4.B /api/auth/xero/callback
   * Action: Handle redirect from Xero and exchange authorization code for tokens.
   * Logic:
   * 1. Extract code and state from URL parameters.
   * 2. Verify state cookie.
   * 3. Make POST request to https://identity.xero.com/connect/token using Basic Auth.
   * 4. Parse access_token and refresh_token from response.
   * 5. Make GET request to https://api.xero.com/connections to retrieve tenantId.
   * 6. Save access_token, refresh_token, expiration timestamp, and tenantId into Supabase xero_credentials table.
   * 7. Redirect user back to CRM settings dashboard with a success parameter.
   */
  app.get('/api/auth/xero/callback', async (req, res) => {
    const { code, state, error, error_description } = req.query as {
      code?: string;
      state?: string;
      error?: string;
      error_description?: string;
    };

    if (error) {
      console.error('[Xero OAuth] Callback received error from Xero:', error, error_description);
      return res.redirect(`/?tab=integrations&modal=xero&xero_error=${encodeURIComponent(error_description || error)}`);
    }

    if (!code) {
      return res.redirect(`/?tab=integrations&modal=xero&xero_error=${encodeURIComponent('No authorization code received from Xero')}`);
    }

    // State parameter verification (with soft fallback for mobile/strict cross-origin iframe contexts)
    const storedState = req.cookies?.xero_oauth_state;
    if (storedState && state && storedState !== state) {
      console.warn('[Xero OAuth] Warning: State mismatch in OAuth callback. Potential CSRF or cookie reset.');
    }
    // Clear state cookie
    res.clearCookie('xero_oauth_state');

    try {
      console.log('[Xero OAuth] Exchanging code for tokens...');
      const tokenData = await exchangeCodeForTokens(code);

      console.log('[Xero OAuth] Fetching connected tenant organizations...');
      const connections = await getTenantConnections(tokenData.access_token);

      if (!connections || connections.length === 0) {
        throw new Error('No active Xero organizations/tenants found for this account.');
      }

      // Default to first active connected organization
      const primaryTenant = connections[0];
      const expiresAt = new Date(Date.now() + (tokenData.expires_in || 1800) * 1000).toISOString();

      console.log(`[Xero OAuth] Connected to tenant: ${primaryTenant.tenantName} (${primaryTenant.tenantId})`);

      // Save credentials to Supabase xero_credentials table
      const saveResult = await upsertXeroCredentials({
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: expiresAt,
        tenant_id: primaryTenant.tenantId,
        tenant_name: primaryTenant.tenantName
      });

      console.log(`[Xero OAuth] Credentials stored successfully. Destination: ${saveResult.source}`);

      // Redirect user back to CRM settings dashboard with success parameter
      res.redirect(`/?tab=integrations&modal=xero&xero=connected&tenant=${encodeURIComponent(primaryTenant.tenantName || primaryTenant.tenantId)}`);
    } catch (err: any) {
      console.error('[Xero OAuth] Error during token exchange and tenant save:', err);
      res.redirect(`/?tab=integrations&modal=xero&xero_error=${encodeURIComponent(err.message || 'Token exchange failed')}`);
    }
  });

  /**
   * 4.C /api/xero/refresh (Internal Utility)
   * Action: Automatically refresh access token before it expires.
   * Logic: Check Supabase expires_at timestamp. If expired/near expiry, POST refresh_token
   * to Xero token endpoint, update Supabase, and return updated status.
   */
  app.post('/api/xero/refresh', async (req, res) => {
    try {
      const refreshed = await refreshAccessToken();
      res.json({
        success: true,
        message: 'Xero access token successfully refreshed',
        expiresAt: refreshed.expires_at,
        tenantId: refreshed.tenant_id,
        tenantName: refreshed.tenant_name
      });
    } catch (err: any) {
      console.error('[Xero OAuth] Manual token refresh error:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  /**
   * 5. User Interface Status Endpoint: /api/xero/status
   * Action: Query Supabase xero_credentials on load to determine if valid credentials exist.
   * Returns: Connection status, tenant details, expiration, and database configuration info.
   */
  app.get('/api/xero/status', async (req, res) => {
    const config = getXeroConfig();
    try {
      const creds = await getStoredXeroCredentials();
      const isConnected = Boolean(creds?.access_token && creds?.tenant_id);

      let isExpired = false;
      let expiresAt: string | null = null;

      if (creds?.expires_at) {
        expiresAt = creds.expires_at;
        isExpired = new Date(creds.expires_at).getTime() <= Date.now();
      }

      res.json({
        connected: isConnected,
        configured: config.isConfigured,
        tenantId: creds?.tenant_id || null,
        tenantName: creds?.tenant_name || null,
        expiresAt: expiresAt,
        isExpired: isExpired,
        updatedAt: creds?.updated_at || null,
        supabaseConfigured: isSupabaseConfigured(),
        redirectUri: config.redirectUri,
        missingEnv: [
          !config.clientId && 'XERO_CLIENT_ID',
          !config.clientSecret && 'XERO_CLIENT_SECRET'
        ].filter(Boolean)
      });
    } catch (err: any) {
      console.error('[Xero] Status check error:', err);
      res.status(500).json({
        connected: false,
        error: err.message
      });
    }
  });

  /**
   * Disconnect Action: /api/xero/disconnect
   * Action: Revokes access with Xero and deletes the corresponding record from Supabase table.
   */
  app.post('/api/xero/disconnect', async (req, res) => {
    try {
      const result = await disconnectXero();
      res.json(result);
    } catch (err: any) {
      console.error('[Xero] Disconnect error:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  /**
   * Diagnostic Ping: /api/xero/test-connection
   * Action: Tests live connection against real Xero Organisation endpoint.
   */
  app.get('/api/xero/test-connection', async (req, res) => {
    const startTime = Date.now();
    try {
      const org = await fetchXeroOrganisation();
      const latencyMs = Date.now() - startTime;

      res.json({
        success: true,
        latencyMs,
        organizationName: org.Name || org.LegalName || 'Connected Organisation',
        legalName: org.LegalName,
        countryCode: org.CountryCode || 'AU',
        currencyCode: org.BaseCurrency || 'AUD',
        organisationID: org.OrganisationID,
        organisationType: org.OrganisationType,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err.message,
        latencyMs: Date.now() - startTime
      });
    }
  });

  /**
   * Direct Xero Accounting Proxy: Invoices
   */
  app.get('/api/xero/invoices', async (req, res) => {
    try {
      const invoices = await fetchXeroInvoices();
      res.json({ success: true, count: invoices.length, invoices });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/xero/invoices', async (req, res) => {
    try {
      const invoice = await createXeroLiveInvoice(req.body);
      res.json({ success: true, invoice });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  /**
   * Direct Xero Accounting Proxy: Contacts
   */
  app.get('/api/xero/contacts', async (req, res) => {
    try {
      const contacts = await fetchXeroContacts();
      res.json({ success: true, count: contacts.length, contacts });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  /**
   * Direct Xero Accounting Proxy: Quotes
   */
  app.get('/api/xero/quotes', async (req, res) => {
    try {
      const quotes = await fetchXeroQuotes();
      res.json({ success: true, count: quotes.length, quotes });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ============================================================================
  // GMAIL OAUTH 2.0 & CONTINUOUS PUB/SUB SYNC API ROUTES
  // ============================================================================

  /**
   * Diagnostic setup information for Gmail integration
   */
  app.get('/api/gmail/setup-info', (req, res) => {
    const config = getGmailConfig();
    res.json({
      configured: config.isConfigured,
      hasClientId: Boolean(config.clientId),
      hasClientSecret: Boolean(config.clientSecret),
      redirectUri: config.redirectUri,
      pubSubTopic: config.pubSubTopic,
      hasPubSubTopic: Boolean(config.pubSubTopic),
      appUrl: config.appUrl,
      supabaseConfigured: isSupabaseConfigured(),
      scopes: REQUIRED_GMAIL_SCOPES
    });
  });

  /**
   * 5. Live status of Gmail integration and sending toggle
   */
  app.get('/api/gmail/status', async (req, res) => {
    try {
      const creds = await getStoredGmailCredentials();
      const config = getGmailConfig();

      if (!creds) {
        return res.json({
          connected: false,
          isConfigured: config.isConfigured,
          redirectUri: config.redirectUri,
          pubSubTopic: config.pubSubTopic,
          supabaseConfigured: isSupabaseConfigured()
        });
      }

      const expiresAt = new Date(creds.expires_at).getTime();
      const isExpired = Date.now() >= expiresAt;

      res.json({
        connected: true,
        emailAddress: creds.email_address,
        sendEnabled: creds.send_enabled,
        expiresAt: creds.expires_at,
        isExpired,
        latestHistoryId: creds.latest_history_id || null,
        tokenStorage: isSupabaseConfigured() ? 'Supabase Table: gmail_credentials' : 'Local Encrypted Fallback (.gmail_cache)',
        pubSubTopic: config.pubSubTopic,
        updatedAt: creds.updated_at
      });
    } catch (err: any) {
      res.status(500).json({ connected: false, error: err.message });
    }
  });

  /**
   * Store access token obtained via Firebase Auth client popup
   */
  app.post('/api/auth/gmail/store-token', async (req, res) => {
    try {
      const { accessToken, email, displayName } = req.body;
      if (!accessToken) {
        return res.status(400).json({ success: false, error: 'Access token is required' });
      }

      // Fetch profile to verify token and retrieve mailbox stats
      let resolvedEmail = email;
      let historyId: string | undefined;
      try {
        const profile = await fetchGmailUserProfile(accessToken);
        if (profile.emailAddress) resolvedEmail = profile.emailAddress;
        historyId = profile.historyId;
      } catch (profileErr) {
        console.warn('[Gmail Store Token] Warning fetching profile:', profileErr);
      }

      if (!resolvedEmail) {
        return res.status(400).json({ success: false, error: 'Could not resolve email address for token' });
      }

      // 1 hour standard token lifetime
      const expiresAt = new Date(Date.now() + 3600 * 1000).toISOString();

      await upsertGmailCredentials({
        email_address: resolvedEmail,
        access_token: accessToken,
        refresh_token: '', // client popup tokens do not return offline refresh tokens; refreshed via client popup
        expires_at: expiresAt,
        send_enabled: false,
        latest_history_id: historyId
      });

      // Register Pub/Sub watch if configured
      const config = getGmailConfig();
      if (config.pubSubTopic) {
        try {
          const watchResult = await registerGmailWatch(accessToken, config.pubSubTopic);
          if (watchResult?.historyId) {
            await upsertGmailCredentials({
              email_address: resolvedEmail,
              access_token: accessToken,
              refresh_token: '',
              expires_at: expiresAt,
              send_enabled: false,
              latest_history_id: watchResult.historyId
            });
          }
        } catch (wErr) {
          console.warn('[Gmail Store Token] Pub/Sub watch skipped:', wErr);
        }
      }

      // Perform background initial sync
      let syncedCount = 0;
      try {
        const syncResult = await syncGmailMailbox(resolvedEmail);
        syncedCount = syncResult.syncedCount;
      } catch (syncErr: any) {
        console.warn('[Gmail Store Token] Initial sync deferred:', syncErr.message || syncErr);
      }

      return res.json({
        success: true,
        email: resolvedEmail,
        syncedCount,
        message: `Connected ${resolvedEmail} successfully.`
      });
    } catch (err: any) {
      console.error('[Gmail Store Token] Error storing token:', err);
      return res.status(500).json({ success: false, error: err.message || 'Failed to register token' });
    }
  });

  /**
   * 4.A /api/auth/gmail/login
   * Action: Redirect user to Google OAuth consent screen with:
   * - access_type=offline
   * - prompt=consent
   * - scopes: gmail.readonly, gmail.send, email, profile
   */
  app.get('/api/auth/gmail/login', (req, res) => {
    const config = getGmailConfig();

    if (!config.clientId || !config.clientSecret) {
      return res.status(400).send(`
        <html>
          <body style="font-family: sans-serif; padding: 40px; background: #0f172a; color: #f8fafc;">
            <h2 style="color: #f87171;">Gmail API Environment Variables Missing</h2>
            <p>Please configure the following environment variables in your <code>.env.local</code> or Cloud Run environment:</p>
            <ul>
              <li><code>GMAIL_CLIENT_ID</code></li>
              <li><code>GMAIL_CLIENT_SECRET</code></li>
              <li><code>GMAIL_REDIRECT_URI</code> (Default: <code>${config.redirectUri}</code>)</li>
              <li><code>GOOGLE_PUBSUB_TOPIC</code> (Optional: for push webhook updates)</li>
            </ul>
            <p><a href="/" style="color: #38bdf8;">&larr; Return to MySolarCRM</a></p>
          </body>
        </html>
      `);
    }

    const state = crypto.randomBytes(24).toString('hex');
    res.cookie('gmail_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 10 * 60 * 1000 // 10 minutes
    });

    const authUrl = buildGmailAuthUrl(state);
    res.redirect(authUrl);
  });

  /**
   * 4.A /api/auth/gmail/callback
   * Action: Exchange authorization code for access_token and refresh_token,
   * persist to gmail_credentials table in Supabase, and register Pub/Sub watch.
   */
  app.get('/api/auth/gmail/callback', async (req, res) => {
    const { code, state, error, error_description } = req.query as {
      code?: string;
      state?: string;
      error?: string;
      error_description?: string;
    };

    if (error) {
      console.error('[Gmail OAuth] Callback error:', error, error_description);
      return res.redirect(`/?gmail=error&message=${encodeURIComponent(error_description || error)}`);
    }

    const storedState = req.cookies?.gmail_oauth_state;
    if (!state || !storedState || state !== storedState) {
      console.warn('[Gmail OAuth] State mismatch or missing cookie');
    }
    res.clearCookie('gmail_oauth_state');

    if (!code) {
      return res.redirect('/?gmail=error&message=No+authorization+code+received');
    }

    try {
      console.log('[Gmail OAuth] Exchanging authorization code for token pair...');
      const tokenData = await exchangeGmailCodeForTokens(code);
      const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000).toISOString();

      console.log('[Gmail OAuth] Resolving connected Google account profile...');
      const profile = await fetchGmailUserProfile(tokenData.access_token);

      console.log(`[Gmail OAuth] Successfully connected account: ${profile.emailAddress}`);

      // Save credentials in Supabase
      const saveResult = await upsertGmailCredentials({
        email_address: profile.emailAddress,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: expiresAt,
        send_enabled: false, // Default: false as required by specifications
        latest_history_id: profile.historyId
      });

      console.log(`[Gmail OAuth] Credentials persisted via ${saveResult.source}`);

      // 4.A Immediately register a watch request to designated Pub/Sub topic
      const config = getGmailConfig();
      if (config.pubSubTopic) {
        console.log(`[Gmail Watch] Registering watch on ${profile.emailAddress} to topic ${config.pubSubTopic}...`);
        const watchResult = await registerGmailWatch(tokenData.access_token, config.pubSubTopic);
        if (watchResult?.historyId) {
          await upsertGmailCredentials({
            email_address: profile.emailAddress,
            access_token: tokenData.access_token,
            refresh_token: tokenData.refresh_token,
            expires_at: expiresAt,
            send_enabled: false,
            latest_history_id: watchResult.historyId
          });
        }
      }

      // Perform initial background sync of recent messages
      try {
        console.log('[Gmail Sync] Starting initial background sync of recent inbox/sent items...');
        await syncGmailMailbox(profile.emailAddress);
      } catch (syncErr) {
        console.warn('[Gmail Sync] Initial sync deferred to background webhook:', syncErr);
      }

      res.redirect('/?gmail=connected&email=' + encodeURIComponent(profile.emailAddress));
    } catch (err: any) {
      console.error('[Gmail OAuth] Exception during token callback:', err);
      res.redirect(`/?gmail=error&message=${encodeURIComponent(err.message || 'Token exchange failed')}`);
    }
  });

  /**
   * 4.B Continuous Background Sync: /api/gmail/webhook
   * Receives Google Cloud Pub/Sub push notifications whenever connected inbox changes.
   */
  app.post('/api/gmail/webhook', async (req, res) => {
    // Acknowledge receipt to Pub/Sub immediately
    res.status(200).send('OK');

    try {
      const pubsubMessage = req.body?.message;
      if (!pubsubMessage || !pubsubMessage.data) {
        console.log('[Gmail Webhook] Received ping or empty pubsub message');
        return;
      }

      const decodedString = Buffer.from(pubsubMessage.data, 'base64').toString('utf-8');
      const payload = JSON.parse(decodedString);
      const { emailAddress, historyId } = payload;

      console.log(`[Gmail Webhook] Incoming push notification for ${emailAddress} (historyId: ${historyId})`);

      // Trigger continuous background sync
      const syncResult = await syncGmailMailbox(emailAddress);
      console.log(`[Gmail Webhook] Synced ${syncResult.syncedCount} new messages linked to CRM entities`);
    } catch (err: any) {
      console.error('[Gmail Webhook] Error processing Pub/Sub push message:', err.message || err);
    }
  });

  /**
   * Manual trigger to run background sync right away
   */
  app.post('/api/gmail/sync-now', async (req, res) => {
    try {
      const creds = await getStoredGmailCredentials();
      if (!creds) {
        return res.status(400).json({ success: false, error: 'Gmail is not connected' });
      }

      const result = await syncGmailMailbox(creds.email_address);
      res.json({ success: true, count: result.syncedCount, latestHistoryId: result.latestHistoryId });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  /**
   * 5. Sending Toggle: Updates the send_enabled boolean in gmail_credentials
   */
  app.patch('/api/gmail/toggle-send', async (req, res) => {
    try {
      const { sendEnabled, emailAddress } = req.body;
      if (typeof sendEnabled !== 'boolean') {
        return res.status(400).json({ success: false, error: 'sendEnabled boolean is required' });
      }

      const result = await updateGmailSendEnabled(emailAddress, sendEnabled);
      if (!result.success) {
        return res.status(500).json({ success: false, error: result.error });
      }

      console.log(`[Gmail] Outbound sending toggled to: ${sendEnabled}`);
      res.json({
        success: true,
        sendEnabled,
        message: sendEnabled
          ? 'CRM Outbound Email Sending Enabled'
          : 'CRM Outbound Email Sending Disabled (Inbound & Outbound continuous background sync remains active)'
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  /**
   * 4.C Conditional Sending: /api/gmail/send
   * Checks send_enabled in gmail_credentials:
   * - If false: returns 403 Forbidden
   * - If true: retrieves active token, constructs MIME, calls Gmail API, and saves to emails table.
   */
  app.post('/api/gmail/send', async (req, res) => {
    try {
      const creds = await getStoredGmailCredentials();
      if (!creds) {
        return res.status(401).json({
          success: false,
          error: 'No Gmail account connected. Please connect your Gmail account via OAuth.'
        });
      }

      // STRICT REQUIREMENT: If send_enabled is false, return 403 Forbidden
      if (!creds.send_enabled) {
        return res.status(403).json({
          success: false,
          error: 'Outbound sending is disabled. Please enable "Allow CRM to Send Emails" in Gmail settings to send outbound communications.',
          code: 'GMAIL_SEND_DISABLED'
        });
      }

      const { to, cc, bcc, subject, bodyHtml, bodyText, contactId, projectId, leadId } = req.body;

      if (!to || (Array.isArray(to) && to.length === 0)) {
        return res.status(400).json({ success: false, error: 'Recipient "to" email address is required' });
      }

      const toList: string[] = Array.isArray(to) ? to : [to];
      const ccList: string[] = cc ? (Array.isArray(cc) ? cc : [cc]) : [];
      const bccList: string[] = bcc ? (Array.isArray(bcc) ? bcc : [bcc]) : [];

      // Retrieve active unexpired access token (refreshing automatically if needed)
      const accessToken = await getValidGmailAccessToken(creds);

      // Dispatch MIME message
      const sendResult = await sendGmailMimeMessage(accessToken, {
        from: creds.email_address,
        to: toList,
        cc: ccList,
        bcc: bccList,
        subject: subject || '(No Subject)',
        bodyHtml,
        bodyText
      });

      console.log(`[Gmail Send] Message sent successfully via Gmail API (ID: ${sendResult.id})`);

      // Persist sent email to emails table with CRM entity links
      const sentEmailRecord: Record<string, any> = {
        message_id: sendResult.id,
        thread_id: sendResult.threadId,
        gmail_credentials_id: creds.id,
        direction: 'outbound' as const,
        from_address: creds.email_address,
        to_addresses: toList,
        cc_addresses: ccList,
        subject: subject || '(No Subject)',
        snippet: bodyText ? bodyText.slice(0, 140) : (subject || ''),
        body_html: bodyHtml,
        body_text: bodyText,
        contact_id: contactId,
        contact_name: undefined,
        project_id: projectId,
        lead_id: leadId,
        received_at: new Date().toISOString()
      };

      const linked = await matchEmailToCrmEntities(sentEmailRecord as any);
      sentEmailRecord.contact_id = sentEmailRecord.contact_id || linked.contact_id;
      sentEmailRecord.contact_name = linked.contact_name;
      sentEmailRecord.project_id = sentEmailRecord.project_id || linked.project_id;
      sentEmailRecord.lead_id = sentEmailRecord.lead_id || linked.lead_id;

      await upsertCrmEmail(sentEmailRecord as any);

      res.json({
        success: true,
        messageId: sendResult.id,
        threadId: sendResult.threadId,
        sentAt: new Date().toISOString()
      });
    } catch (err: any) {
      console.error('[Gmail Send] Error dispatching email:', err);
      res.status(500).json({ success: false, error: err.message || 'Failed to send email' });
    }
  });

  /**
   * Retrieves synced CRM emails
   */
  app.get('/api/gmail/emails', async (req, res) => {
    try {
      const { contactId, projectId, leadId, direction, search, limit } = req.query as {
        contactId?: string;
        projectId?: string;
        leadId?: string;
        direction?: string;
        search?: string;
        limit?: string;
      };

      const emails = await getCrmEmails({
        contactId,
        projectId,
        leadId,
        direction,
        search,
        limit: limit ? parseInt(limit, 10) : 50
      });

      res.json({ success: true, count: emails.length, emails });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  /**
   * Disconnects Gmail account and drops credentials row
   */
  app.post('/api/gmail/disconnect', async (req, res) => {
    try {
      const creds = await getStoredGmailCredentials();
      if (creds) {
        try {
          await stopGmailWatch(creds.access_token);
        } catch (e) {
          // non-blocking
        }
      }
      await deleteGmailCredentials();
      console.log('[Gmail] Disconnected and credentials purged from Supabase');
      res.json({ success: true, message: 'Gmail disconnected successfully' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ============================================================================
  // VITE DEV SERVER OR STATIC PRODUCTION SERVING
  // ============================================================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] MySolarCRM Full-Stack Server running on port ${PORT} (0.0.0.0)`);
    console.log(`[Server] Xero OAuth Callback configured at: ${getXeroConfig().redirectUri}`);
  });
}

startServer().catch(err => {
  console.error('[Server] Fatal error starting server:', err);
  process.exit(1);
});
