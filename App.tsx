import React, { useState, useEffect } from 'react';
import LeadForm from './components/LeadForm';
import LeadList from './components/LeadList';
import Dashboard from './components/Dashboard';
import { PlusCircle, List, BarChart2 } from 'lucide-react';
import { getLeads, seedDataIfEmpty } from './services/leadService';
import { Lead } from './types';

// Simple Router Enum
enum View {
  FORM = 'form',
  LIST = 'list',
  STATS = 'stats'
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.FORM);
  const [leads, setLeads] = useState<Lead[]>([]);

  // Load data on mount
  useEffect(() => {
    seedDataIfEmpty();
    refreshLeads();
  }, []);

  const refreshLeads = () => {
    setLeads(getLeads());
  };

  const handleFormSuccess = () => {
    refreshLeads();
    // Optional: Switch to list or stay on form? 
    // Spec says "High speed", so maybe stay on form or show a quick toast.
    // For this demo, let's just refresh data and maybe show a quick alert (simulated in Form component)
    // We will stay on form to allow rapid entry of next lead.
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-gray-900">
      
      {/* Main Content Area */}
      <main className="max-w-md mx-auto min-h-screen bg-slate-50 relative shadow-2xl">
        {currentView === View.FORM && <LeadForm onSuccess={handleFormSuccess} />}
        {currentView === View.LIST && <LeadList leads={leads} />}
        {currentView === View.STATS && <Dashboard leads={leads} />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
        <div className="max-w-md mx-auto flex justify-around items-center h-16">
          <button
            onClick={() => setCurrentView(View.FORM)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
              currentView === View.FORM ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <PlusCircle size={24} strokeWidth={currentView === View.FORM ? 2.5 : 2} />
            <span className="text-[10px] font-medium">บันทึก Lead</span>
          </button>
          
          <button
            onClick={() => setCurrentView(View.LIST)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
              currentView === View.LIST ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <List size={24} strokeWidth={currentView === View.LIST ? 2.5 : 2} />
            <span className="text-[10px] font-medium">ประวัติ</span>
          </button>

          <button
            onClick={() => setCurrentView(View.STATS)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
              currentView === View.STATS ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <BarChart2 size={24} strokeWidth={currentView === View.STATS ? 2.5 : 2} />
            <span className="text-[10px] font-medium">สรุปผล</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;