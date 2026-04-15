const DEFAULT_API_BASE_URL = '';
const DEFAULT_CANDIDATE_API_TOKEN = 'mock-employer-access-token';

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
    const localStorageToken = window.localStorage.getItem('candidate_access_token');
    if (localStorageToken && localStorageToken.trim()) {
      return localStorageToken.trim();
    }
  }

  return DEFAULT_CANDIDATE_API_TOKEN;
}

function candidateRequestHeaders() {
  const authToken = getCandidateAuthToken();
  return authToken ? { Authorization: `Bearer ${authToken}` } : {};
}

function setAuthToken(token) {
  if (token && typeof window !== 'undefined') {
    window.localStorage.setItem('candidate_access_token', token);
  }
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
      typeof payload === 'object' && payload !== null
        ? payload.detail || payload.message || 'Yêu cầu không thành công.'
        : 'Yêu cầu không thành công.';
    const error = new Error(errorMessage);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
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

export { buildQueryString, request, normalizeCandidateFilters, getTestToken, setAuthToken };
