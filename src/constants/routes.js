export const ROUTES = {
  HOME: '/tim-kiem-cong-viec',
  JOB_SEARCH: '/tim-kiem-cong-viec',
  AUTH_LOGIN: '/dang-nhap',
  AUTH_REGISTER: '/dang-ky',
  RECRUITMENT_LIST: '/danh-sach-tuyen-dung',
  JOB_DETAIL: '/chi-tiet-tuyen-dung',
  JOB_POST: '/dang-tin-tuyen-dung',
  JOB_EDIT: '/jobs/edit/:id', 
  MATCHING: '/man-hinh-matching',
  CANDIDATES: '/quan-ly-ung-vien',
  CANDIDATE_DETAIL: '/quan-ly-ung-vien/:id',
  CANDIDATE_PROFILE: '/ho-so-cua-toi',
  CANDIDATE_EDIT: '/chinh-sua-ho-so',
  CHAT: '/chat',
  IN_DEVELOPMENT: '/in-development',
  COMPANY_PROFILE: '/cong-ty/:id',
};

export const LEGACY_ROUTES = {
  JOB_POST: '/Dangtintuyendung',
  RECRUITMENT_LIST: '/recruitments',
  MATCHING: '/matching',
  JOB_SEARCH: '/search',
  CANDIDATES: '/candidates',
  CANDIDATE_DETAIL: '/candidates/:id',
  JOB_DETAIL_TEMP: '/Chitiettuyendung/temp',
  JOB_DETAIL: '/chitiettuyendung',
};

export const REGISTER_ROLES = {
  CANDIDATE: 'candidate',
  EMPLOYER: 'employer',
};

export function buildCandidateDetailPath(id) {
  return `${ROUTES.CANDIDATES}/${id}`;
}

export function buildJobEditPath(id) {
  return ROUTES.JOB_EDIT.replace(':id', id);
}

export function buildInDevelopmentPath(feature) {
  if (!feature) {
    return ROUTES.IN_DEVELOPMENT;
  }
  const query = new URLSearchParams({ feature });
  return `${ROUTES.IN_DEVELOPMENT}?${query.toString()}`;
}

export function buildCompanyProfilePath(id) {
  return ROUTES.COMPANY_PROFILE.replace(':id', id);
}

export function buildRegisterPath(role = REGISTER_ROLES.CANDIDATE) {
  const normalizedRole = role === REGISTER_ROLES.EMPLOYER ? REGISTER_ROLES.EMPLOYER : REGISTER_ROLES.CANDIDATE;
  const query = new URLSearchParams({ role: normalizedRole });
  return `${ROUTES.AUTH_REGISTER}?${query.toString()}`;
}