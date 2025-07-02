import React from 'react';

type DocumentType = {
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
  type: string;
  authority: string;
  field: string;
  signer: string;
  recipients?: string;
  file: string;
  pages: number;
};

import { IDocument } from '@/types/document';
import { activities, categories, issuingAgency } from '@/api/documentData';

type DocumentTableProps = {
  filteredDocuments: IDocument[];
  setSelectedDocument: (doc: IDocument) => void;
};
type ModalProps = {
  selectedDocument: IDocument | null;
  setSelectedDocument: (doc: IDocument | null) => void;
  relatedDocuments: IDocument[];
  selectedCategory: string;
  selectedActivity: string;
  selectedIssuingAgency: string;
};

const Modal = ({
  selectedDocument,
  setSelectedDocument,
  relatedDocuments,
  selectedCategory,
  selectedActivity,
  selectedIssuingAgency,
}: ModalProps) => (
  selectedDocument && (
    <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-start justify-center z-50 p-4 md:p-10 overflow-auto">
      <div className="w-full max-w-4xl mx-auto">
        
        {/* Thông tin chi tiết văn bản - chiếm toàn bộ */}
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 relative">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">Thông tin chi tiết văn bản</h2>
          <div className="space-y-2 text-sm leading-relaxed">
            <p><strong>Mã số:</strong> {selectedDocument.code}</p>
            <p><strong>Số hiệu văn bản:</strong> {selectedDocument.refNumber}</p>
            <p><strong>Thời điểm tạo:</strong> {selectedDocument.createdAt}</p>
            <p><strong>Ngày ban hành:</strong> {selectedDocument.issuedDate}</p>
            <p><strong>Trích yếu:</strong> {selectedDocument.summary}</p>
            <p><strong>Độ khẩn:</strong> {selectedDocument.urgency}</p>
            <p><strong>Độ mật:</strong> {selectedDocument.confidentiality}</p>
            <p><strong>Loại văn bản:</strong> {categories.find(t => t.id === selectedDocument.type)?.name}</p>
            <p><strong>Cơ quan ban hành:</strong> {issuingAgency.find(a => a.id === selectedDocument.authority)?.name}</p>
            <p><strong>Lĩnh vực hoạt động:</strong> {activities.find(f => f.id === selectedDocument.field)?.name}</p>
            <p><strong>Người ký:</strong> {selectedDocument.signer}</p>
            <p><strong>Nơi nhận:</strong> {selectedDocument.recipients || 'Không có'}</p>
            <p><strong>File đính kèm:</strong> {selectedDocument.file}</p>
            <p><strong>Số trang:</strong> {selectedDocument.pages}</p>
          </div>
    
          {/* Lượt truy cập - góc dưới bên phải */}
          <div className="absolute bottom-6 right-6">
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-3 shadow-sm">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {Math.floor(Math.random() * 500) + 50}
                </div>
                <div className="text-xs text-blue-800 font-medium">
                  Lượt xem
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nút đóng */}
        <div className="flex justify-center mt-6">
          <button
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            onClick={() => setSelectedDocument(null)}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
);

export default Modal;

