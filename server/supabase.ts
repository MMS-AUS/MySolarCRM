import { createClient, SupabaseClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

export interface StoredXeroCredentials {
  id?: string;
  access_token: string;
  refresh_token: string;
  expires_at: string;
  tenant_id: string;
  tenant_name?: string;
  updated_at?: string;
}

const FALLBACK_CACHE_DIR = path.join(process.cwd(), '.xero_cache');
const FALLBACK_CACHE_FILE = path.join(FALLBACK_CACHE_DIR, 'credentials.json');

function getSupabaseUrl(): string | undefined {
  return process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
}

function getSupabaseKey(): string | undefined {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseKey());
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const url = getSupabaseUrl();
  const key = getSupabaseKey();

  if (!url || !key) {
    return null;
  }

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, key, {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      });
    } catch (err) {
      console.error('[Supabase] Failed to initialize Supabase client:', err);
      return null;
    }
  }

  return supabaseInstance;
}

/**
 * Fallback local file store to preserve tokens if Supabase is pending setup
 */
function readFallbackCache(): StoredXeroCredentials | null {
  try {
    if (fs.existsSync(FALLBACK_CACHE_FILE)) {
      const data = fs.readFileSync(FALLBACK_CACHE_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn('[Xero] Could not read fallback cache:', err);
  }
  return null;
}

function writeFallbackCache(creds: StoredXeroCredentials): void {
  try {
    if (!fs.existsSync(FALLBACK_CACHE_DIR)) {
      fs.mkdirSync(FALLBACK_CACHE_DIR, { recursive: true });
    }
    fs.writeFileSync(FALLBACK_CACHE_FILE, JSON.stringify(creds, null, 2), 'utf8');
  } catch (err) {
    console.warn('[Xero] Could not write fallback cache:', err);
  }
}

function clearFallbackCache(): void {
  try {
    if (fs.existsSync(FALLBACK_CACHE_FILE)) {
      fs.unlinkSync(FALLBACK_CACHE_FILE);
    }
  } catch (err) {
    console.warn('[Xero] Could not clear fallback cache:', err);
  }
}

/**
 * Retrieves stored Xero credentials from Supabase (or fallback cache)
 */
export async function getStoredXeroCredentials(): Promise<StoredXeroCredentials | null> {
  const supabase = getSupabase();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('xero_credentials')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          expires_at: data.expires_at,
          tenant_id: data.tenant_id,
          tenant_name: data.tenant_name,
          updated_at: data.updated_at
        };
      }
      if (error) {
        console.warn('[Supabase] Error reading xero_credentials table:', error.message);
      }
    } catch (err) {
      console.error('[Supabase] Exception querying xero_credentials:', err);
    }
  }

  // Fallback if Supabase not configured or temporary issue
  return readFallbackCache();
}

/**
 * Saves or updates Xero credentials in Supabase xero_credentials table
 */
export async function upsertXeroCredentials(creds: {
  access_token: string;
  refresh_token: string;
  expires_at: string;
  tenant_id: string;
  tenant_name?: string;
}): Promise<{ success: boolean; id?: string; source: 'supabase' | 'fallback'; error?: string }> {
  const payload = {
    access_token: creds.access_token,
    refresh_token: creds.refresh_token,
    expires_at: creds.expires_at,
    tenant_id: creds.tenant_id,
    tenant_name: creds.tenant_name || 'Active Xero Organization',
    updated_at: new Date().toISOString()
  };

  // Always keep fallback cache updated
  writeFallbackCache(payload);

  const supabase = getSupabase();
  if (supabase) {
    try {
      // Check if existing record exists for this tenant
      const { data: existing } = await supabase
        .from('xero_credentials')
        .select('id')
        .eq('tenant_id', creds.tenant_id)
        .maybeSingle();

      let resultId: string | undefined;

      if (existing?.id) {
        const { error: updateError } = await supabase
          .from('xero_credentials')
          .update({
            access_token: creds.access_token,
            refresh_token: creds.refresh_token,
            expires_at: creds.expires_at,
            tenant_name: creds.tenant_name || 'Active Xero Organization',
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);

        if (updateError) throw updateError;
        resultId = existing.id;
      } else {
        const { data: inserted, error: insertError } = await supabase
          .from('xero_credentials')
          .insert([payload])
          .select('id')
          .single();

        if (insertError) throw insertError;
        resultId = inserted?.id;
      }

      return { success: true, id: resultId, source: 'supabase' };
    } catch (err: any) {
      console.error('[Supabase] Failed to upsert xero_credentials in Supabase:', err.message || err);
      return { success: true, source: 'fallback', error: err.message || 'Supabase write error; saved to fallback store' };
    }
  }

  return { success: true, source: 'fallback' };
}

/**
 * Removes Xero credentials from Supabase and fallback cache
 */
export async function deleteXeroCredentials(tenantId?: string): Promise<{ success: boolean; error?: string }> {
  clearFallbackCache();

  const supabase = getSupabase();
  if (supabase) {
    try {
      let query = supabase.from('xero_credentials').delete();
      if (tenantId) {
        query = query.eq('tenant_id', tenantId);
      } else {
        query = query.neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows
      }

      const { error } = await query;
      if (error) {
        console.error('[Supabase] Error deleting xero_credentials:', error.message);
        return { success: false, error: error.message };
      }
    } catch (err: any) {
      console.error('[Supabase] Exception deleting credentials:', err);
      return { success: false, error: err.message };
    }
  }

  return { success: true };
}

// ==============================================================================
// GMAIL INTEGRATION: CREDENTIALS & CONTINUOUS SYNC STORAGE
// ==============================================================================

export interface StoredGmailCredentials {
  id?: string;
  user_id?: string;
  email_address: string;
  access_token: string;
  refresh_token: string;
  expires_at: string;
  send_enabled: boolean;
  latest_history_id?: string;
  updated_at?: string;
}

export interface StoredCrmEmail {
  id?: string;
  message_id: string;
  thread_id?: string;
  gmail_credentials_id?: string;
  direction: 'inbound' | 'outbound';
  from_address: string;
  to_addresses: string[];
  cc_addresses?: string[];
  subject: string;
  snippet?: string;
  body_html?: string;
  body_text?: string;
  contact_id?: string;
  contact_name?: string;
  company_id?: string;
  project_id?: string;
  ticket_id?: string;
  lead_id?: string;
  received_at: string;
  created_at?: string;
}

const GMAIL_CACHE_DIR = path.join(process.cwd(), '.gmail_cache');
const GMAIL_CREDS_FILE = path.join(GMAIL_CACHE_DIR, 'credentials.json');
const GMAIL_EMAILS_FILE = path.join(GMAIL_CACHE_DIR, 'emails.json');

function readGmailFallbackCache(): StoredGmailCredentials | null {
  try {
    if (fs.existsSync(GMAIL_CREDS_FILE)) {
      const data = fs.readFileSync(GMAIL_CREDS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn('[Gmail] Failed to read fallback cache:', err);
  }
  return null;
}

function writeGmailFallbackCache(creds: StoredGmailCredentials): void {
  try {
    if (!fs.existsSync(GMAIL_CACHE_DIR)) {
      fs.mkdirSync(GMAIL_CACHE_DIR, { recursive: true });
    }
    fs.writeFileSync(GMAIL_CREDS_FILE, JSON.stringify(creds, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[Gmail] Failed to write fallback cache:', err);
  }
}

function clearGmailFallbackCache(): void {
  try {
    if (fs.existsSync(GMAIL_CREDS_FILE)) {
      fs.unlinkSync(GMAIL_CREDS_FILE);
    }
  } catch (err) {
    console.warn('[Gmail] Failed to clear fallback cache:', err);
  }
}

function readGmailEmailsFallback(): StoredCrmEmail[] {
  try {
    if (fs.existsSync(GMAIL_EMAILS_FILE)) {
      const data = fs.readFileSync(GMAIL_EMAILS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn('[Gmail] Failed to read fallback emails:', err);
  }
  return [];
}

function writeGmailEmailsFallback(emails: StoredCrmEmail[]): void {
  try {
    if (!fs.existsSync(GMAIL_CACHE_DIR)) {
      fs.mkdirSync(GMAIL_CACHE_DIR, { recursive: true });
    }
    fs.writeFileSync(GMAIL_EMAILS_FILE, JSON.stringify(emails, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[Gmail] Failed to write fallback emails:', err);
  }
}

/**
 * Retrieves Gmail credentials from Supabase or fallback cache
 */
export async function getStoredGmailCredentials(emailAddress?: string): Promise<StoredGmailCredentials | null> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      let query = supabase.from('gmail_credentials').select('*');
      if (emailAddress) {
        query = query.eq('email_address', emailAddress);
      }
      const { data, error } = await query.order('updated_at', { ascending: false }).limit(1).maybeSingle();
      if (!error && data) {
        return {
          id: data.id,
          user_id: data.user_id,
          email_address: data.email_address,
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          expires_at: data.expires_at,
          send_enabled: Boolean(data.send_enabled),
          latest_history_id: data.latest_history_id,
          updated_at: data.updated_at
        };
      }
    } catch (err: any) {
      console.warn('[Supabase] Warning reading gmail_credentials from Supabase:', err.message || err);
    }
  }

  // Fallback to local file store
  return readGmailFallbackCache();
}

/**
 * Persists or updates Gmail credentials in Supabase and fallback cache
 */
export async function upsertGmailCredentials(
  creds: StoredGmailCredentials
): Promise<{ success: boolean; id?: string; source: 'supabase' | 'fallback'; error?: string }> {
  const payload: StoredGmailCredentials = {
    ...creds,
    send_enabled: creds.send_enabled ?? false,
    updated_at: new Date().toISOString()
  };

  writeGmailFallbackCache(payload);

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data: existing } = await supabase
        .from('gmail_credentials')
        .select('id, send_enabled')
        .eq('email_address', creds.email_address)
        .maybeSingle();

      let resultId: string | undefined;

      if (existing?.id) {
        const { error: updateError } = await supabase
          .from('gmail_credentials')
          .update({
            access_token: creds.access_token,
            refresh_token: creds.refresh_token,
            expires_at: creds.expires_at,
            latest_history_id: creds.latest_history_id || undefined,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);

        if (updateError) throw updateError;
        resultId = existing.id;
      } else {
        const { data: inserted, error: insertError } = await supabase
          .from('gmail_credentials')
          .insert([{
            email_address: creds.email_address,
            access_token: creds.access_token,
            refresh_token: creds.refresh_token,
            expires_at: creds.expires_at,
            send_enabled: creds.send_enabled ?? false,
            latest_history_id: creds.latest_history_id,
            user_id: creds.user_id,
            updated_at: new Date().toISOString()
          }])
          .select('id')
          .single();

        if (insertError) throw insertError;
        resultId = inserted?.id;
      }

      return { success: true, id: resultId, source: 'supabase' };
    } catch (err: any) {
      console.error('[Supabase] Failed to upsert gmail_credentials in Supabase:', err.message || err);
      return { success: true, source: 'fallback', error: err.message || 'Supabase write error' };
    }
  }

  return { success: true, source: 'fallback' };
}

/**
 * Updates the user-controlled send_enabled toggle in Supabase
 */
export async function updateGmailSendEnabled(
  emailAddress: string | undefined,
  sendEnabled: boolean
): Promise<{ success: boolean; error?: string }> {
  // Update fallback cache
  const cached = readGmailFallbackCache();
  if (cached && (!emailAddress || cached.email_address === emailAddress)) {
    cached.send_enabled = sendEnabled;
    cached.updated_at = new Date().toISOString();
    writeGmailFallbackCache(cached);
  }

  const supabase = getSupabase();
  if (supabase) {
    try {
      let query = supabase.from('gmail_credentials').update({
        send_enabled: sendEnabled,
        updated_at: new Date().toISOString()
      });

      if (emailAddress) {
        query = query.eq('email_address', emailAddress);
      } else {
        query = query.neq('id', '00000000-0000-0000-0000-000000000000');
      }

      const { error } = await query;
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      console.error('[Supabase] Error updating send_enabled:', err.message || err);
      return { success: false, error: err.message };
    }
  }

  return { success: true };
}

/**
 * Updates the latest_history_id in Supabase
 */
export async function updateGmailLatestHistoryId(
  emailAddress: string,
  historyId: string
): Promise<{ success: boolean; error?: string }> {
  const cached = readGmailFallbackCache();
  if (cached && cached.email_address === emailAddress) {
    cached.latest_history_id = historyId;
    cached.updated_at = new Date().toISOString();
    writeGmailFallbackCache(cached);
  }

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase
        .from('gmail_credentials')
        .update({
          latest_history_id: historyId,
          updated_at: new Date().toISOString()
        })
        .eq('email_address', emailAddress);

      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      console.warn('[Supabase] Error updating latest_history_id:', err.message || err);
      return { success: false, error: err.message };
    }
  }

  return { success: true };
}

/**
 * Deletes Gmail credentials row
 */
export async function deleteGmailCredentials(emailAddress?: string): Promise<{ success: boolean; error?: string }> {
  clearGmailFallbackCache();

  const supabase = getSupabase();
  if (supabase) {
    try {
      let query = supabase.from('gmail_credentials').delete();
      if (emailAddress) {
        query = query.eq('email_address', emailAddress);
      } else {
        query = query.neq('id', '00000000-0000-0000-0000-000000000000');
      }
      const { error } = await query;
      if (error) throw error;
    } catch (err: any) {
      console.error('[Supabase] Error deleting gmail_credentials:', err.message || err);
      return { success: false, error: err.message };
    }
  }

  return { success: true };
}

/**
 * Saves or updates a synchronized CRM email in Supabase & fallback cache
 */
export async function upsertCrmEmail(
  email: StoredCrmEmail
): Promise<{ success: boolean; id?: string }> {
  // Update fallback list
  const fallbackList = readGmailEmailsFallback();
  const existingIdx = fallbackList.findIndex(e => e.message_id === email.message_id);
  if (existingIdx >= 0) {
    fallbackList[existingIdx] = { ...fallbackList[existingIdx], ...email };
  } else {
    fallbackList.unshift({
      ...email,
      id: email.id || `email-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      created_at: new Date().toISOString()
    });
  }
  // Cap at 200 items in fallback
  if (fallbackList.length > 200) fallbackList.length = 200;
  writeGmailEmailsFallback(fallbackList);

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data: existing } = await supabase
        .from('emails')
        .select('id')
        .eq('message_id', email.message_id)
        .maybeSingle();

      if (existing?.id) {
        await supabase
          .from('emails')
          .update({
            snippet: email.snippet,
            body_html: email.body_html,
            body_text: email.body_text,
            contact_id: email.contact_id,
            contact_name: email.contact_name,
            company_id: email.company_id,
            project_id: email.project_id,
            ticket_id: email.ticket_id,
            lead_id: email.lead_id
          })
          .eq('id', existing.id);
        return { success: true, id: existing.id };
      } else {
        const { data: inserted, error: insertErr } = await supabase
          .from('emails')
          .insert([{
            message_id: email.message_id,
            thread_id: email.thread_id,
            gmail_credentials_id: email.gmail_credentials_id,
            direction: email.direction,
            from_address: email.from_address,
            to_addresses: email.to_addresses,
            cc_addresses: email.cc_addresses || [],
            subject: email.subject,
            snippet: email.snippet,
            body_html: email.body_html,
            body_text: email.body_text,
            contact_id: email.contact_id,
            contact_name: email.contact_name,
            company_id: email.company_id,
            project_id: email.project_id,
            ticket_id: email.ticket_id,
            lead_id: email.lead_id,
            received_at: email.received_at || new Date().toISOString(),
            created_at: new Date().toISOString()
          }])
          .select('id')
          .single();

        if (insertErr) throw insertErr;
        return { success: true, id: inserted?.id };
      }
    } catch (err: any) {
      console.warn('[Supabase] Warning writing email to Supabase:', err.message || err);
    }
  }

  return { success: true };
}

/**
 * Queries synchronized emails from Supabase or fallback cache
 */
export async function getCrmEmails(
  filter?: { contactId?: string; projectId?: string; leadId?: string; direction?: string; search?: string; limit?: number }
): Promise<StoredCrmEmail[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      let query = supabase.from('emails').select('*').order('received_at', { ascending: false });

      if (filter?.contactId) query = query.eq('contact_id', filter.contactId);
      if (filter?.projectId) query = query.eq('project_id', filter.projectId);
      if (filter?.leadId) query = query.eq('lead_id', filter.leadId);
      if (filter?.direction) query = query.eq('direction', filter.direction);
      if (filter?.limit) query = query.limit(filter.limit);
      else query = query.limit(50);

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          message_id: d.message_id,
          thread_id: d.thread_id,
          gmail_credentials_id: d.gmail_credentials_id,
          direction: d.direction,
          from_address: d.from_address,
          to_addresses: Array.isArray(d.to_addresses) ? d.to_addresses : [d.to_addresses],
          cc_addresses: Array.isArray(d.cc_addresses) ? d.cc_addresses : [],
          subject: d.subject || '(No Subject)',
          snippet: d.snippet,
          body_html: d.body_html,
          body_text: d.body_text,
          contact_id: d.contact_id,
          contact_name: d.contact_name,
          company_id: d.company_id,
          project_id: d.project_id,
          ticket_id: d.ticket_id,
          lead_id: d.lead_id,
          received_at: d.received_at,
          created_at: d.created_at
        }));
      }
    } catch (err: any) {
      console.warn('[Supabase] Error reading emails from Supabase:', err.message || err);
    }
  }

  let list = readGmailEmailsFallback();
  if (filter?.contactId) list = list.filter(e => e.contact_id === filter.contactId);
  if (filter?.projectId) list = list.filter(e => e.project_id === filter.projectId);
  if (filter?.leadId) list = list.filter(e => e.lead_id === filter.leadId);
  if (filter?.direction) list = list.filter(e => e.direction === filter.direction);
  if (filter?.search) {
    const s = filter.search.toLowerCase();
    list = list.filter(e =>
      e.subject.toLowerCase().includes(s) ||
      e.from_address.toLowerCase().includes(s) ||
      (e.snippet && e.snippet.toLowerCase().includes(s))
    );
  }
  return list.slice(0, filter?.limit || 50);
}
