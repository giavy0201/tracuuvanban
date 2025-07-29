import { ReactNode } from 'react';

export type ActivityType = {
  id: string;
  name: string;
};
export type CategoryType = {
  id: string;
  name: string;
};
export type IssuingAgencyType = {
  id: string;
  name: string;
};

export interface IDocument  {
  pages: ReactNode;
  file: ReactNode;
  recipients: string;
  signer: ReactNode;
  confidentiality: ReactNode;
  urgency: ReactNode;
  summary: ReactNode;
  issuedDate: ReactNode;
  refNumber: ReactNode;
  code: ReactNode;
  id: string;
  title: string;
  documentNumber: string;
  issuingAgency: string;
  category: string;
  activity: string;
  effectiveDate: Date;
  content?: string;
  attachments?: string[];
  status: 'active' | 'inactive' | 'draft';
  createdAt: Date;
  updatedAt: Date;
}