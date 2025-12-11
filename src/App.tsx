import { BrowserRouter as Router, Routes, Route, useSearchParams } from 'react-router-dom';
import { Dashboard } from '@/pages/Dashboard';
import { Redirect } from '@/pages/Redirect';
import { WidgetPage } from '@/pages/WidgetPage';
import { Header } from '@/components/layout/Header';
import { Toaster } from '@/components/ui/toaster';

function AppContent() {
  const [searchParams] = useSearchParams();
  const isWidget = searchParams.get('widget') === 'true';

  // If widget mode, show dashboard without header
  if (isWidget) {
    return (
      <div className="min-h-screen bg-background">
        <Dashboard />
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/widget" element={<WidgetPage />} />
        <Route path="/:code" element={<Redirect />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
