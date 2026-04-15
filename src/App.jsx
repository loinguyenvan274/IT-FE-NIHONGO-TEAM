import { BrowserRouter as Router, Navigate, Route, Routes, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Dangtintuyendung from './pages/Dangtintuyendung/Dangtintuyendung';
import Manhinhmatching from './pages/Manhinhmatching/Manhinhmatching';
import Timkiemcongviec from './pages/Timkiemcongviec/Timkiemcongviec';
import Danhsachtuyendung from './pages/Danhsachtuyendung/Danhsachtuyendung';
import Chitiettuyendung from './pages/Chitiettuyendung/Chitiettuyendung';
import Quanlyungvien from './pages/Quanlyungvien/Quanlyungvien';
import Chitiethosoungvien from './pages/Chitiethosoungvien/Chitiethosoungvien';
import InDevelopment from './pages/InDevelopment/InDevelopment';
import EditJob from './pages/Chinhsuatintuyendung/EditJob';
import Header from './components/Header';
import { getTestToken, setAuthToken } from './services/api';
import { LEGACY_ROUTES, ROUTES, buildCandidateDetailPath, buildInDevelopmentPath } from './constants/routes';
import './app.css';

function LegacyCandidateRedirect() {
  const { id } = useParams();
  return <Navigate to={buildCandidateDetailPath(id)} replace />;
}

function App() {
  const [role, setRole] = useState('guest');

  useEffect(() => {
    // Initialize test token on app startup for demo mode
    async function initializeTestToken() {
      const token = await getTestToken();
      if (token) {
        setAuthToken(token);
      }
    }

    initializeTestToken();
  }, []);

  const fallbackRoute = buildInDevelopmentPath('404');

  return (
    <Router>
      <div className="app-shell">
        <Header role={role} onRoleChange={setRole} />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Navigate to={ROUTES.HOME} replace />} />

            <Route path={ROUTES.JOB_POST} element={<Dangtintuyendung />} />
            <Route path={ROUTES.RECRUITMENT_LIST} element={<Danhsachtuyendung />} />
            <Route path={ROUTES.MATCHING} element={<Manhinhmatching />} />
            <Route path={ROUTES.JOB_SEARCH} element={<Timkiemcongviec />} />
            <Route path={ROUTES.CANDIDATES} element={<Quanlyungvien />} />
            <Route path={ROUTES.CANDIDATE_DETAIL} element={<Chitiethosoungvien />} />
            <Route path={ROUTES.JOB_DETAIL} element={<Chitiettuyendung />} />
            <Route path={ROUTES.IN_DEVELOPMENT} element={<InDevelopment />} />
            <Route path={ROUTES.JOB_EDIT} element={<EditJob />} />

            <Route path={LEGACY_ROUTES.JOB_POST} element={<Navigate to={ROUTES.JOB_POST} replace />} />
            <Route
              path={LEGACY_ROUTES.RECRUITMENT_LIST}
              element={<Navigate to={ROUTES.RECRUITMENT_LIST} replace />}
            />
            <Route path={LEGACY_ROUTES.MATCHING} element={<Navigate to={ROUTES.MATCHING} replace />} />
            <Route path={LEGACY_ROUTES.JOB_SEARCH} element={<Navigate to={ROUTES.JOB_SEARCH} replace />} />
            <Route path={LEGACY_ROUTES.CANDIDATES} element={<Navigate to={ROUTES.CANDIDATES} replace />} />
            <Route path={LEGACY_ROUTES.CANDIDATE_DETAIL} element={<LegacyCandidateRedirect />} />
            <Route path={LEGACY_ROUTES.JOB_DETAIL_TEMP} element={<Navigate to={ROUTES.JOB_DETAIL} replace />} />
            <Route path={LEGACY_ROUTES.JOB_DETAIL} element={<Navigate to={ROUTES.JOB_DETAIL} replace />} />

            <Route path="*" element={<Navigate to={fallbackRoute} replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
