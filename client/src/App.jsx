import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout';
import Home from './pages/Home';
import Overview from './pages/Overview';
import Upcoming from './pages/Upcoming';
import Teams from './pages/Teams';
import AdminPanel from './pages/AdminPanel';
import CreateEvent from './pages/CreateEvent';
import EventDetails from './pages/EventDetails';
import TeamRegistration from './pages/TeamRegistration';
import Attendance from './pages/Attendance';
import Submission from './pages/Submission';
import JudgeDashboard from './pages/JudgeDashboard';

import { EventProvider } from './context/EventContext';

function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Home />} />
              <Route path="overview" element={<Overview />} />
              <Route path="upcoming" element={<Upcoming />} />
              <Route path="teams" element={<Teams />} />
              <Route path="admin" element={<ProtectedRoute allowedRoles={['lead', 'co-lead', 'admin']}><AdminPanel /></ProtectedRoute>} />
              <Route path="create-event" element={<ProtectedRoute allowedRoles={['lead', 'co-lead', 'admin']}><CreateEvent /></ProtectedRoute>} />
              <Route path="events/:id" element={<EventDetails />} />
              <Route path="events/:id/register" element={<TeamRegistration />} />
              <Route path="events/:id/attendance" element={<ProtectedRoute allowedRoles={['lead', 'co-lead', 'admin']}><Attendance /></ProtectedRoute>} />
              <Route path="events/:id/submit" element={<Submission />} />
              <Route path="events/:id/judge" element={<ProtectedRoute allowedRoles={['lead', 'co-lead', 'admin']}><JudgeDashboard /></ProtectedRoute>} />
            </Route>
          </Routes>
        </Router>
      </EventProvider>
    </AuthProvider>
  );
}

export default App;
