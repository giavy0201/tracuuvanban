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

export interface IDocument {
  id: string;
  documentNumber: string;
  issuingAgency: string | null;
  category: string | null;
  activity: string | null;
  code: string;
  effectiveDate: string;
  status: string;
  updatedAt: string;
  title: string;
  refNumber: string;
  createdAt: string;
  issuedDate: string;
  summary: string;
  urgency: string;
  confidentiality: string;
  signer: string;
  recipients?: string;
  file: string;
  pages: number;
}

export interface DocumentType {
  id: string;
  date: string;
  title: string;
  code: string;
  refNumber: string;
  createdAt: string;
  issuedDate: string;
  summary: string;
  urgency: string;
  confidentiality: string;
  type: string | null;
  authority: string | null;
  field: string | null;
  signer: string;
  recipients?: string;
  file: string;
  pages: number;
}