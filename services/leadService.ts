import { Lead, LeadStatus, Channel, LeadSegment, MOCK_USER } from '../types';

const STORAGE_KEY = 'speedlead_data';

export const getLeads = (): Lead[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveLead = (lead: Omit<Lead, 'id' | 'dateRecorded' | 'salesName'>): Lead => {
  const currentLeads = getLeads();
  
  const newLead: Lead = {
    ...lead,
    id: crypto.randomUUID(),
    dateRecorded: new Date().toISOString(),
    salesName: MOCK_USER,
  };

  const updatedLeads = [newLead, ...currentLeads];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLeads));
  return newLead;
};

// Seed some data if empty for visualization
export const seedDataIfEmpty = () => {
  const current = getLeads();
  if (current.length === 0) {
    const seed: Lead[] = [
      {
        id: '1',
        dateRecorded: new Date(Date.now() - 10000000).toISOString(),
        salesName: MOCK_USER,
        channel: Channel.PHONE,
        customerName: 'คุณสมชาย',
        contactInfo: '081-111-2222',
        interest: 'คอนโด Unit A',
        budget: 3500000,
        status: LeadStatus.NEW,
        segment: LeadSegment.HIGH,
        followUpDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        note: 'ต้องการเข้าอยู่ด่วน'
      },
      {
        id: '2',
        dateRecorded: new Date(Date.now() - 5000000).toISOString(),
        salesName: MOCK_USER,
        channel: Channel.LINE,
        customerName: 'คุณเมย์',
        contactInfo: '089-999-8888',
        interest: 'บ้านเดี่ยว Type B',
        budget: 5000000,
        status: LeadStatus.CLOSED,
        segment: LeadSegment.MEDIUM,
        note: 'วางเงินจองแล้ว'
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  }
};