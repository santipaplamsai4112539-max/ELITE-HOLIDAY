import React, { useState } from 'react';
import { Lead, LeadStatus, LeadSegment } from '../types';
import { Phone, Calendar, ChevronRight, User, Bell, Flame, Snowflake, Leaf, Volume2 } from 'lucide-react';
import { playLeadSummary } from '../services/aiService';

interface LeadListProps {
  leads: Lead[];
}

const LeadList: React.FC<LeadListProps> = ({ leads }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getSegmentIcon = (s?: LeadSegment) => {
      if (!s) return null;
      switch (s) {
          case LeadSegment.HIGH: return <span className="flex items-center text-red-600 bg-red-50 px-1.5 py-0.5 rounded text-[10px] font-bold border border-red-100 ml-2"><Flame size={10} className="mr-0.5"/> VIP</span>;
          case LeadSegment.MEDIUM: return <span className="flex items-center text-green-600 bg-green-50 px-1.5 py-0.5 rounded text-[10px] font-bold border border-green-100 ml-2"><Leaf size={10} className="mr-0.5"/> รอติดตาม</span>;
          case LeadSegment.COLD: return <span className="flex items-center text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-[10px] font-bold border border-blue-100 ml-2"><Snowflake size={10} className="mr-0.5"/> ทั่วไป</span>;
      }
  };

  const handlePlayTTS = (e: React.MouseEvent, lead: Lead) => {
    e.stopPropagation();
    const textToSpeak = `ลูกค้าคุณ ${lead.customerName} สนใจ ${lead.interest || 'สินค้า'} สถานะ ${lead.status} ${lead.note ? 'หมายเหตุ ' + lead.note : ''}`;
    playLeadSummary(textToSpeak);
  };

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-gray-400">
        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
            <User size={48} className="text-gray-300" />
        </div>
        <p>ยังไม่มีข้อมูล Lead</p>
        <p className="text-sm mt-2">เริ่มรับสายและบันทึกข้อมูลได้เลย!</p>
      </div>
    );
  }

  // Sort: Overdue follow-ups first, then new leads
  const sortedLeads = [...leads].sort((a, b) => {
      const dateA = new Date(a.dateRecorded).getTime();
      const dateB = new Date(b.dateRecorded).getTime();
      return dateB - dateA;
  });

  return (
    <div className="pb-24 pt-4 px-4 space-y-3 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-4 px-1">ประวัติลูกค้า (History)</h2>
      
      {sortedLeads.map((lead) => {
        const isFollowUpDue = lead.followUpDate && new Date(lead.followUpDate) <= new Date() && lead.status !== LeadStatus.CLOSED;
        
        return (
            <div 
                key={lead.id} 
                className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all ${isFollowUpDue ? 'border-red-300 ring-1 ring-red-100' : 'border-gray-100'}`}
            >
            <div 
                className="p-4 flex justify-between items-center cursor-pointer active:bg-gray-50"
                onClick={() => toggleExpand(lead.id)}
            >
                <div className="flex-1">
                    <div className="flex items-center mb-1 flex-wrap">
                        <span className="font-bold text-gray-800 mr-2">{lead.customerName}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${
                            lead.status === LeadStatus.NEW ? 'bg-green-50 text-green-700 border-green-200' : 
                            lead.status === LeadStatus.CLOSED ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            'bg-gray-50 text-gray-600 border-gray-200'
                        }`}>
                            {lead.status}
                        </span>
                        {getSegmentIcon(lead.segment)}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 space-x-3 mt-1">
                        <span className="flex items-center">
                            <Calendar size={10} className="mr-1" />
                            {new Date(lead.dateRecorded).toLocaleDateString('th-TH')}
                        </span>
                        <span className="font-medium text-blue-600">{lead.channel}</span>
                    </div>
                    {lead.followUpDate && lead.status !== LeadStatus.CLOSED && (
                        <div className={`flex items-center text-xs mt-2 ${isFollowUpDue ? 'text-red-600 font-bold animate-pulse' : 'text-orange-500'}`}>
                            <Bell size={10} className="mr-1" />
                            {isFollowUpDue ? 'ครบกำหนดติดตาม: ' : 'ติดตาม: '}
                            {new Date(lead.followUpDate).toLocaleString('th-TH', { day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit'})}
                        </div>
                    )}
                </div>
                <ChevronRight size={16} className={`text-gray-400 transform transition-transform ${expandedId === lead.id ? 'rotate-90' : ''}`} />
            </div>

            {expandedId === lead.id && (
                <div className="bg-gray-50 p-4 border-t border-gray-100 text-sm animate-in slide-in-from-top-2 duration-200 relative">
                    <button 
                        onClick={(e) => handlePlayTTS(e, lead)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 bg-white p-2 rounded-full border border-gray-200 shadow-sm"
                        title="ฟังข้อมูล"
                    >
                        <Volume2 size={16} />
                    </button>

                    <div className="grid grid-cols-2 gap-4 mb-4 pr-10">
                        <div>
                            <p className="text-gray-500 text-xs">เบอร์โทรศัพท์</p>
                            <a href={`tel:${lead.contactInfo}`} className="text-blue-600 font-medium flex items-center mt-1">
                                <Phone size={12} className="mr-1" /> {lead.contactInfo}
                            </a>
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs">สิ่งที่สนใจ</p>
                            <p className="font-medium text-gray-800 mt-1">{lead.interest || '-'}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs">งบประมาณ</p>
                            <p className="font-medium text-gray-800 mt-1">
                                {lead.budget ? lead.budget.toLocaleString() : '-'}
                            </p>
                        </div>
                    </div>
                    {lead.note && (
                        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-yellow-800 text-xs leading-relaxed">
                            <span className="font-semibold block mb-1">หมายเหตุ:</span>
                            {lead.note}
                        </div>
                    )}
                </div>
            )}
            </div>
        );
      })}
    </div>
  );
};

export default LeadList;