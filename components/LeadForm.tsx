import React, { useState, useEffect } from 'react';
import { Save, User, Clock, Phone, StickyNote, DollarSign, Target, Bell, Calendar, Flame, Snowflake, Leaf, Sparkles } from 'lucide-react';
import { Channel, LeadStatus, LeadSegment, MOCK_USER } from '../types';
import { saveLead } from '../services/leadService';
import { refineLeadNote } from '../services/aiService';

interface LeadFormProps {
  onSuccess: () => void;
}

const LeadForm: React.FC<LeadFormProps> = ({ onSuccess }) => {
  // Form State
  const [channel, setChannel] = useState<Channel | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [interest, setInterest] = useState('');
  const [budget, setBudget] = useState<number | ''>('');
  const [status, setStatus] = useState<LeadStatus>(LeadStatus.NEW);
  const [segment, setSegment] = useState<LeadSegment | undefined>(undefined);
  const [followUpDate, setFollowUpDate] = useState('');
  const [note, setNote] = useState('');

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const setQuickFollowUp = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    date.setHours(10, 0, 0, 0); // Default to 10:00 AM
    // Format to YYYY-MM-DDTHH:mm for input[type="datetime-local"]
    const isoString = date.toISOString().slice(0, 16);
    setFollowUpDate(isoString);
  };

  const handleRefineNote = async () => {
    if (!note) return;
    setIsRefining(true);
    const refined = await refineLeadNote(note);
    setNote(refined);
    setIsRefining(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!channel) {
      alert('กรุณาเลือกช่องทาง (Channel)');
      return;
    }
    if (!customerName || !contactInfo) {
      alert('กรุณากรอกชื่อลูกค้าและเบอร์โทร');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate slight network delay for realism then save
    setTimeout(() => {
      saveLead({
        channel,
        customerName,
        contactInfo,
        interest,
        budget,
        status,
        segment,
        followUpDate: followUpDate ? new Date(followUpDate).toISOString() : undefined,
        note
      });
      setIsSubmitting(false);
      resetForm();
      onSuccess();
    }, 400);
  };

  const resetForm = () => {
    setChannel(null);
    setCustomerName('');
    setContactInfo('');
    setInterest('');
    setBudget('');
    setStatus(LeadStatus.NEW);
    setSegment(undefined);
    setFollowUpDate('');
    setNote('');
  };

  const getSegmentLabel = (s: LeadSegment) => {
    switch (s) {
        case LeadSegment.HIGH: return { label: 'VIP (สูง)', icon: <Flame size={14} className="mr-1" />, color: 'bg-red-50 text-red-600 border-red-200' };
        case LeadSegment.MEDIUM: return { label: 'ปานกลาง', icon: <Leaf size={14} className="mr-1" />, color: 'bg-green-50 text-green-600 border-green-200' };
        case LeadSegment.COLD: return { label: 'ทั่วไป', icon: <Snowflake size={14} className="mr-1" />, color: 'bg-blue-50 text-blue-600 border-blue-200' };
    }
  };

  return (
    <div className="pb-24">
      <header className="bg-white p-4 sticky top-0 z-10 shadow-sm border-b border-gray-100 flex justify-between items-center">
        <div>
            <h1 className="text-xl font-bold text-gray-800">รับลูกค้าใหม่ (New Lead)</h1>
            <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
                <span className="flex items-center"><User size={12} className="mr-1"/> {MOCK_USER}</span>
                <span className="flex items-center"><Clock size={12} className="mr-1"/> {currentTime}</span>
            </div>
        </div>
        <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
            Live Mode
        </div>
      </header>

      <form onSubmit={handleSubmit} className="p-4 space-y-6 max-w-md mx-auto">
        
        {/* Channel Selection - Buttons for Speed */}
        <section>
          <label className="block text-sm font-semibold text-gray-700 mb-2">ช่องทางที่ติดต่อ (Channel) <span className="text-red-500">*</span></label>
          <div className="grid grid-cols-3 gap-2">
            {Object.values(Channel).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setChannel(c)}
                className={`py-3 px-1 rounded-lg text-sm font-medium transition-all duration-200 border ${
                  channel === c
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        {/* Essential Info - Top Priority */}
        <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">ชื่อลูกค้า (Name) <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg"
              placeholder="เช่น คุณสมชาย"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">เบอร์โทรศัพท์ (Tel) <span className="text-red-500">*</span></label>
            <div className="relative">
              <Phone className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input
                type="tel"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg font-mono"
                placeholder="08X-XXX-XXXX"
                required
              />
            </div>
          </div>
        </section>

        {/* Lead Segment - New Feature */}
        <section>
           <label className="block text-sm font-semibold text-gray-700 mb-2">ระดับความสนใจ (Segment)</label>
           <div className="grid grid-cols-3 gap-2">
            {Object.values(LeadSegment).map((s) => {
                const config = getSegmentLabel(s);
                return (
                    <button
                        key={s}
                        type="button"
                        onClick={() => setSegment(s)}
                        className={`py-2 px-1 rounded-lg text-xs font-bold flex items-center justify-center transition-all border ${
                            segment === s
                                ? 'bg-gray-800 text-white border-gray-800 shadow-md'
                                : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        {config.icon} {config.label}
                    </button>
                )
            })}
           </div>
        </section>

        {/* Follow Up - New Feature */}
        <section className="bg-blue-50 p-4 rounded-xl border border-blue-100">
             <label className="flex items-center text-sm font-semibold text-blue-800 mb-2">
                <Bell size={14} className="mr-1"/> แจ้งเตือนติดตาม (Follow Up)
            </label>
            <div className="flex space-x-2 mb-2">
                 <button type="button" onClick={() => setQuickFollowUp(1)} className="flex-1 bg-white text-blue-600 border border-blue-200 py-1 rounded text-xs hover:bg-blue-50">+1 วัน</button>
                 <button type="button" onClick={() => setQuickFollowUp(3)} className="flex-1 bg-white text-blue-600 border border-blue-200 py-1 rounded text-xs hover:bg-blue-50">+3 วัน</button>
                 <button type="button" onClick={() => setQuickFollowUp(7)} className="flex-1 bg-white text-blue-600 border border-blue-200 py-1 rounded text-xs hover:bg-blue-50">+1 สัปดาห์</button>
            </div>
            <div className="relative">
                <Calendar className="absolute left-3 top-2.5 text-blue-400" size={16} />
                <input 
                    type="datetime-local"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-blue-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
                />
            </div>
        </section>

        {/* Secondary Info - Optional */}
        <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
           <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-1">
                <Target size={14} className="mr-1"/> สิ่งที่สนใจ (Interest)
            </label>
            <input
              type="text"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="ระบุสินค้าหรือบริการ..."
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-1">
                 <DollarSign size={14} className="mr-1"/> งบประมาณ (Budget)
            </label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value ? Number(e.target.value) : '')}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="0.00"
            />
          </div>
        </section>

        {/* Status Selection - Buttons */}
        <section>
          <label className="block text-sm font-semibold text-gray-700 mb-2">สถานะ (Status)</label>
          <div className="flex flex-wrap gap-2">
            {Object.values(LeadStatus).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={`py-2 px-4 rounded-full text-sm font-medium transition-colors border ${
                  status === s
                    ? s === LeadStatus.NEW ? 'bg-green-100 text-green-800 border-green-300' 
                    : s === LeadStatus.CLOSED ? 'bg-blue-100 text-blue-800 border-blue-300'
                    : 'bg-gray-800 text-white border-gray-800'
                    : 'bg-white text-gray-600 border-gray-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </section>

         {/* Note with AI Assist */}
         <section>
            <div className="flex justify-between items-center mb-2">
                <label className="flex items-center text-sm font-semibold text-gray-700">
                    <StickyNote size={14} className="mr-1"/> หมายเหตุ (Note)
                </label>
                <button 
                    type="button"
                    onClick={handleRefineNote}
                    disabled={isRefining || !note}
                    className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-md flex items-center hover:bg-purple-200 transition-colors disabled:opacity-50"
                >
                    {isRefining ? <span className="animate-spin mr-1">⏳</span> : <Sparkles size={12} className="mr-1"/>}
                    AI เรียบเรียง
                </button>
            </div>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="พิมพ์ข้อความคร่าวๆ แล้วกดปุ่ม AI..."
            />
        </section>

        {/* Sticky Action Button */}
        <div className="fixed bottom-16 left-0 right-0 p-4 bg-gradient-to-t from-slate-100 via-slate-100 to-transparent pointer-events-none z-20">
             <button
                type="submit"
                disabled={isSubmitting}
                className="pointer-events-auto w-full max-w-md mx-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center transition-transform active:scale-95"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">กำลังบันทึก...</span>
                ) : (
                  <>
                    <Save className="mr-2" size={20} /> บันทึกข้อมูล
                  </>
                )}
              </button>
        </div>
      </form>
    </div>
  );
};

export default LeadForm;