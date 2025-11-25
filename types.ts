export enum Channel {
  PHONE = 'Phone',
  LINE = 'LINE OA',
  FACEBOOK = 'Facebook',
  WALKIN = 'Walk-in',
  REFERRAL = 'Referral'
}

export enum LeadStatus {
  NEW = 'New',
  INTERESTED = 'Interested',
  CLOSED = 'Closed',
  NO_ANSWER = 'No Answer'
}

export enum LeadSegment {
  HIGH = 'High Potential',
  MEDIUM = 'Needs Nurturing',
  COLD = 'Cold Lead'
}

export interface Lead {
  id: string;
  dateRecorded: string; // ISO String
  salesName: string;
  channel: Channel;
  customerName: string;
  contactInfo: string;
  interest: string;
  budget: number | '';
  status: LeadStatus;
  segment?: LeadSegment; // Optional for backward compatibility
  followUpDate?: string; // ISO String
  note: string;
}

export const MOCK_USER = "Sales Agent 1";