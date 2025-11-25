import React from 'react';
import { Lead } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DashboardProps {
  leads: Lead[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Dashboard: React.FC<DashboardProps> = ({ leads }) => {
  // Aggregate Data for Channels
  const channelData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach(l => {
      counts[l.channel] = (counts[l.channel] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [leads]);

   // Aggregate Data for Status
   const statusData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach(l => {
      counts[l.status] = (counts[l.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [leads]);

  return (
    <div className="pb-24 pt-4 px-4 space-y-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-gray-800">ภาพรวม (Dashboard)</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500 text-xs uppercase tracking-wider">ลูกค้าทั้งหมด</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">{leads.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
             <p className="text-gray-500 text-xs uppercase tracking-wider">วันนี้</p>
             <p className="text-3xl font-bold text-green-600 mt-1">
                {leads.filter(l => new Date(l.dateRecorded).toDateString() === new Date().toDateString()).length}
             </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">แบ่งตามช่องทาง (By Channel)</h3>
        <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={channelData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {channelData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend iconSize={8} layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{fontSize: '10px'}}/>
                </PieChart>
            </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">แบ่งตามสถานะ (By Status)</h3>
        <div className="space-y-3">
            {statusData.map((item, idx) => (
                <div key={item.name}>
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">{item.name}</span>
                        <span className="font-bold">{item.value}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                        <div 
                            className="h-2 rounded-full" 
                            style={{ width: `${(item.value / leads.length) * 100}%`, backgroundColor: COLORS[idx % COLORS.length] }}
                        ></div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;