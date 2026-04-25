const DEFAULT_API_BASE_URL = '';
const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const ROLE_KEY = 'auth_user_role';

const FE_TO_BE_ROLE_MAP = {
  candidate: 'ung_vien',
  employer: 'cong_ty',
};

const BE_TO_FE_ROLE_MAP = {
  ung_vien: 'candidate',
  cong_ty: 'employer',
  admin: 'employer',
};

function normalizeBaseUrl(baseUrl) {
  const normalizedBaseUrl = baseUrl === undefined || baseUrl === null ? DEFAULT_API_BASE_URL : baseUrl;
  return String(normalizedBaseUrl).replace(/\/$/, '');
}

function buildQueryString(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    const normalizedValue = String(value).trim();
    if (normalizedValue) {
      searchParams.set(key, normalizedValue);
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

function getCandidateAuthToken() {
  const envToken = import.meta.env.VITE_CANDIDATE_API_TOKEN;
  if (envToken && String(envToken).trim()) {
    return String(envToken).trim();
  }

  if (typeof window !== 'undefined') {
    const localStorageToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
    if (localStorageToken && localStorageToken.trim()) {
      return localStorageToken.trim();
    }
  }

  return '';
}

function candidateRequestHeaders() {
  const authToken = getCandidateAuthToken();
  return authToken ? { Authorization: `Bearer ${authToken}` } : {};
}

function setAuthToken(token) {
  if (token && typeof window !== 'undefined') {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }
}

function setRefreshToken(token) {
  if (token && typeof window !== 'undefined') {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }
}

function setStoredUserRole(role) {
  if (typeof window !== 'undefined') {
    if (role) {
      window.localStorage.setItem(ROLE_KEY, role);
    } else {
      window.localStorage.removeItem(ROLE_KEY);
    }
  }
}

function getStoredUserRole() {
  if (typeof window === 'undefined') {
    return 'guest';
  }

  const role = window.localStorage.getItem(ROLE_KEY);
  return role || 'guest';
}

function getStoredRefreshToken() {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.localStorage.getItem(REFRESH_TOKEN_KEY) || '';
}

function clearAuthSession() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    window.localStorage.removeItem(ROLE_KEY);
  }
}

function mapFeRoleToBeRole(role) {
  return FE_TO_BE_ROLE_MAP[role] || FE_TO_BE_ROLE_MAP.candidate;
}

function mapBeRoleToFeRole(role) {
  return BE_TO_FE_ROLE_MAP[role] || 'guest';
}

function pickErrorMessage(payload) {
  if (!payload || typeof payload !== 'object') {
    return 'Yêu cầu không thành công.';
  }

  if (typeof payload.detail === 'string' && payload.detail.trim()) {
    return payload.detail.trim();
  }

  if (typeof payload.message === 'string' && payload.message.trim()) {
    return payload.message.trim();
  }

  const firstFieldWithErrors = Object.values(payload).find((value) => Array.isArray(value) && value.length > 0);
  if (firstFieldWithErrors) {
    return String(firstFieldWithErrors[0]);
  }

  return 'Yêu cầu không thành công.';
}

async function getTestToken() {
  try {
    const apiBaseUrl = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);
    const testTokenUrl = apiBaseUrl ? `${apiBaseUrl}/api/auth/test-token/` : '/api/auth/test-token/';
    
    const response = await fetch(testTokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn(`[TestToken] Failed to fetch test token: ${response.status}`);
      return null;
    }

    const data = await response.json();
    if (data?.access) {
      console.log('[TestToken] Successfully obtained test token');
      return data.access;
    }

    console.warn('[TestToken] No access token in response');
    return null;
  } catch (error) {
    console.warn('[TestToken] Error fetching test token:', error.message);
    return null;
  }
}

function normalizeCandidateFilters(filters = {}) {
  const availabilitySlots = Array.isArray(filters.availability_slots)
    ? filters.availability_slots.filter(Boolean)
    : [];

  return {
    page: filters.page ?? 1,
    limit: filters.limit ?? 20,
    sort: filters.sort || 'matching_desc',
    q: filters.q || '',
    location: filters.location || '',
    salary_min: filters.salary_min || '',
    salary_max: filters.salary_max || '',
    availability_slots: availabilitySlots.length ? JSON.stringify(availabilitySlots) : '',
  };
}

async function request(path, options = {}) {
  const apiBaseUrl = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);
  const requestUrl = apiBaseUrl ? `${apiBaseUrl}${path}` : path;

  let response;
  try {
    response = await fetch(requestUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
  } catch (error) {
    const networkError = new Error(error?.message || 'Lỗi kết nối API. Vui lòng kiểm tra mạng.');
    networkError.status = 0;
    throw networkError;
  }

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const errorMessage =
      typeof payload === 'object' && payload !== null ? pickErrorMessage(payload) : 'Yêu cầu không thành công.';
    const error = new Error(errorMessage);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

export async function registerUser({ email, password, role }) {
  return request('/api/auth/register/', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      vai_tro: mapFeRoleToBeRole(role),
    }),
  });
}

export async function loginUser({ email, password }) {
  const payload = await request('/api/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (payload?.access) {
    setAuthToken(payload.access);
  }

  if (payload?.refresh) {
    setRefreshToken(payload.refresh);
  }

  return payload;
}

export async function refreshAccessToken() {
  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) {
    throw new Error('Không tìm thấy refresh token.');
  }

  const payload = await request('/api/auth/token/refresh/', {
    method: 'POST',
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (payload?.access) {
    setAuthToken(payload.access);
  }

  if (payload?.refresh) {
    setRefreshToken(payload.refresh);
  }

  return payload;
}

export async function fetchCurrentUser() {
  return request('/api/auth/me/', {
    headers: candidateRequestHeaders(),
  });
}

export async function logoutUser() {
  const refreshToken = getStoredRefreshToken();

  if (!refreshToken) {
    clearAuthSession();
    return;
  }

  try {
    await request('/api/auth/logout/', {
      method: 'POST',
      headers: candidateRequestHeaders(),
      body: JSON.stringify({ refresh: refreshToken }),
    });
  } finally {
    clearAuthSession();
  }
}

export async function createCandidateProfile(profileData) {
  return request('/api/profiles/candidate/', {
    method: 'POST',
    headers: candidateRequestHeaders(),
    body: JSON.stringify(profileData),
  });
}

export async function createCompanyProfile(profileData) {
  return request('/api/profiles/company/', {
    method: 'POST',
    headers: candidateRequestHeaders(),
    body: JSON.stringify(profileData),
  });
}

export async function fetchJobPosts(filters = {}) {
  const queryString = buildQueryString(filters);
  const payload = await request(`/api/jobs/posts/${queryString}`);

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  return [];
}

export async function createJobPost(jobData = {}) {
  return request('/api/jobs/posts/', {
    method: 'POST',
    body: JSON.stringify(jobData),
  });
}

export async function fetchCandidates(filters = {}) {
  const candidateFilters = normalizeCandidateFilters(filters);
  const queryString = buildQueryString(candidateFilters);
  return request(`/api/v1/candidates/${queryString}`, {
    headers: candidateRequestHeaders(),
  });
}

export async function fetchMatchedCandidates(jobId, filters = {}) {
  const candidateFilters = normalizeCandidateFilters(filters);
  const queryString = buildQueryString(candidateFilters);
  return request(`/api/v1/jobs/${jobId}/matched-candidates/${queryString}`, {
    headers: candidateRequestHeaders(),
  });
}

export async function fetchCandidateDetail(candidateId) {
  return request(`/api/v1/candidates/${candidateId}/`, {
    headers: candidateRequestHeaders(),
  });
}

export async function fetchChatConversations(filters = {}) {
  const queryString = buildQueryString(filters);
  return request(`/api/v1/chats/conversations/${queryString}`, {
    headers: candidateRequestHeaders(),
  });
}

export async function fetchChatMessages(peerUserId, filters = {}) {
  const queryString = buildQueryString({ ...filters, peer_user_id: peerUserId });
  return request(`/api/v1/chats/messages/${queryString}`, {
    headers: candidateRequestHeaders(),
  });
}

export async function sendChatMessage(payload = {}) {
  return request('/api/v1/chats/messages/', {
    method: 'POST',
    headers: candidateRequestHeaders(),
    body: JSON.stringify(payload),
  });
}

// Lấy chi tiết công việc để đổ vào Form
export async function fetchJobDetail(id) {
  return request(`/api/jobs/posts/${id}/`); 
}

// Cập nhật công việc (PATCH)
export async function updateJobPost(id, updateData) {
  return request(`/api/jobs/posts/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(updateData),
  });
}

export {
  buildQueryString,
  request,
  normalizeCandidateFilters,
  getTestToken,
  setAuthToken,
  setStoredUserRole,
  getStoredUserRole,
  clearAuthSession,
  mapBeRoleToFeRole,
};
