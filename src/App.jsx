import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import HomePage from './pages/Dangtintuyendung/Dangtintuyendung';
import Manhinhmatching from './pages/Manhinhmatching/Manhinhmatching';
import Timkiemcongviec from './pages/Timkiemcongviec/Timkiemcongviec';
import Danhsachtuyendung from './pages/Danhsachtuyendung/Danhsachtuyendung';
import Header from './components/Header';
import './app.css';

function App() {
  const [role, setRole] = useState('guest');

  return (
    <Router>
      <div className="app-shell">
        <Header role={role} onRoleChange={setRole} />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recruitments" element={<Danhsachtuyendung />} />
            <Route path="/matching" element={<Manhinhmatching />} />
            <Route path="/search" element={<Timkiemcongviec />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
