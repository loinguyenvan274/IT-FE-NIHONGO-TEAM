const DEFAULT_API_BASE_URL = '';

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

async function request(path, options = {}) {
  const apiBaseUrl = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);
  const requestUrl = apiBaseUrl ? `${apiBaseUrl}${path}` : path;
  const response = await fetch(requestUrl, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

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

export { buildQueryString, request };
