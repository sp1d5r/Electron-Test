import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { ProtectedRoute } from './components/ProtectedRoute';
import ScrollableLayout from './layouts/ScrollableLayout';
import { Landing } from './pages/Landing';
import { Authentication } from './pages/Authentication';
import { DarkModeProvider } from './contexts/DarkModeProvider';
import { AuthProvider } from './contexts/AuthenticationProvider';
import { ResetPassword } from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import { Pricing } from './pages/Pricing';
import { Articles } from './pages/Articles';
import { ApiProvider } from './contexts/ApiContext';
import { ArticlePage } from './pages/ArticlePage';
import { ProfileProvider } from './contexts/ProfileProvider';
import Onboarding from './pages/Onboarding';
import { ChatPage } from './pages/ChatPage';

// Example components for different routes
const About = () => <ScrollableLayout><h2>About Page</h2></ScrollableLayout>;
const Contact = () => <ScrollableLayout><h2>Contact Page</h2></ScrollableLayout>;
const NotFound = () => <ScrollableLayout><h2>No Clue Mate...</h2></ScrollableLayout>
const ChatView = () => <p>Individual Chat View - Coming Soon</p>;

function App() {
  return (
    <div>
      <Router>
        <DarkModeProvider>
          <AuthProvider>
            <ProfileProvider>
              <ApiProvider>
                <Routes>
                  {/* Public routes */}
                  <Route path="/authentication" element={<Authentication />} />
                  <Route path="/reset-password" element={<ResetPassword />} />

                  {/* Protected routes */}
                  <Route path="/" element={
                    <ProtectedRoute>
                      <Landing />
                    </ProtectedRoute>
                  } />
                  <Route path="/about" element={
                    <ProtectedRoute>
                      <About />
                    </ProtectedRoute>
                  } />
                  <Route path="/contact" element={
                    <ProtectedRoute>
                      <Contact />
                    </ProtectedRoute>
                  } />
                  <Route path="/pricing" element={
                    <ProtectedRoute>
                      <Pricing />
                    </ProtectedRoute>
                  } />
                  <Route path="/articles" element={
                    <ProtectedRoute>
                      <Articles />
                    </ProtectedRoute>
                  } />
                  <Route path="/article/:slug" element={
                    <ProtectedRoute>
                      <ArticlePage />
                    </ProtectedRoute>
                  } />
                  <Route path="/onboarding" element={
                    <ProtectedRoute>
                      <Onboarding />
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/chat/:chatId" element={
                    <ProtectedRoute>
                      <ChatPage />
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={
                    <ProtectedRoute>
                      <NotFound />
                    </ProtectedRoute>
                  } />
                </Routes>
              </ApiProvider>
            </ProfileProvider>
          </AuthProvider>
        </DarkModeProvider>
      </Router>
    </div>
  );
}

export default App;