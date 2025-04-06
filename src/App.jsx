

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs.jsx"
import { Dashboard } from "./pages/Dashboard.jsx"
import { MapView } from "./pages/MapView.jsx"
import { Analytics } from "./pages/Analytics.jsx"
import { Predictions } from "./pages/Predictions.jsx"
import { Header } from "./components/Header.jsx"
import { Sidebar } from "./components/Sidebar.jsx"
import { MobileNav } from "./components/MobileNav.jsx"
import { DashboardProvider } from "./context/DashboardContext.jsx"

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import DeforestationAnalysisPage from './pages/deforestation-analysis';

function App() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <DashboardProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar className="hidden md:flex" />
          <main className="flex-1 p-4 md:p-6">
            <MobileNav className="md:hidden mb-4" />
            <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid grid-cols-4 w-full md:w-auto">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="map">Map View</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="predictions">Predictions</TabsTrigger>
              </TabsList>
              <TabsContent value="dashboard" className="space-y-4">
                <Dashboard />
              </TabsContent>
              <TabsContent value="map" className="space-y-4">
                <MapView />
              </TabsContent>
              <TabsContent value="analytics" className="space-y-4">
                <Analytics />
              </TabsContent>
              <TabsContent value="predictions" className="space-y-4">
                <Predictions />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
      <Router>
      <div className="app-container">
        <header className="app-header">
          <nav className="main-navigation">
            <div className="logo">
              <h1>GreenTrack</h1>
            </div>
            <ul className="nav-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/deforestation-analysis">Deforestation Analysis</Link></li>
              {/* Add your other navigation links */}
              <li><Link to="/about">About</Link></li>
            </ul>
          </nav>
        </header>

        <main className="app-content">
          <Routes>
            {/* Route for the Deforestation Analysis page */}
            <Route path="/deforestation-analysis" element={<DeforestationAnalysisPage />} />
            
            {/* Your existing routes */}
            {/* <Route path="/" element={<HomePage />} /> */}
            {/* <Route path="/about" element={<AboutPage />} /> */}
            {/* Add other routes as needed */}
          </Routes>
        </main>

        <footer className="app-footer">
          <p>© {new Date().getFullYear()} GreenTrack | All Rights Reserved</p>
        </footer>
      </div>
    </Router>
    </DashboardProvider>
  )
}

export default App


// App.jsx - Main application file
// import React, { useState } from 'react';

// Import your existing components
// import HomePage from './pages/home';
// import AboutPage from './pages/about';
// Add other imports as needed


