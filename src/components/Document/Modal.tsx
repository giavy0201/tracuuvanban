// import React from 'react';

// type DocumentType = {
//   id: string;
//   date: string;
//   title: string;
//   code: string;
//   refNumber: string;
//   createdAt: string;
//   issuedDate: string;
//   summary: string;
//   urgency: string;
//   confidentiality: string;
//   type: string;
//   authority: string;
//   field: string;
//   signer: string;
//   recipients?: string;
//   file: string;
//   pages: number;
// };

// // Update the path below if your data file is in a different location
// import { IDocument } from '../app/types/data'; // Adjust the import path as necessary
// import { activities, categories, issuingAgency } from '@/api/documentData';

// type DocumentTableProps = {
//   filteredDocuments: IDocument[];
//   setSelectedDocument: (doc: IDocument) => void;
// };
// type ModalProps = {
//   selectedDocument: IDocument | null;
//   setSelectedDocument: (doc: IDocument | null) => void;
//   relatedDocuments: IDocument[];
//   selectedCategory: string;
//   selectedActivity: string;
//   selectedIssuingAgency: string;
// };

// const Modal = ({
//   selectedDocument,
//   setSelectedDocument,
//   relatedDocuments,
//   selectedCategory,
//   selectedActivity,
//   selectedIssuingAgency,
// }: ModalProps) => (
//   selectedDocument && (
//     <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-start justify-center z-50 p-4 md:p-10 overflow-auto">
//       <div className="w-full max-w-4xl mx-auto">
        
//         {/* Thông tin chi tiết văn bản - chiếm toàn bộ */}
//         <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 relative">
//           <h2 className="text-2xl font-bold mb-4 text-blue-800">Thông tin chi tiết văn bản</h2>
//           <div className="space-y-2 text-sm leading-relaxed">
//             <p><strong>Mã số:</strong> {selectedDocument.code}</p>
//             <p><strong>Số hiệu văn bản:</strong> {selectedDocument.refNumber}</p>
//             <p><strong>Thời điểm tạo:</strong> {typeof selectedDocument.createdAt === 'string' && !isNaN(Date.parse(selectedDocument.createdAt)) ? new Date(selectedDocument.createdAt).toLocaleString() : selectedDocument.createdAt}</p>
//             <p><strong>Ngày ban hành:</strong> {selectedDocument.issuedDate}</p>
//             <p><strong>Trích yếu:</strong> {selectedDocument.summary}</p>
//             <p><strong>Độ khẩn:</strong> {selectedDocument.urgency}</p>
//             <p><strong>Độ mật:</strong> {selectedDocument.confidentiality}</p>
//             <p><strong>Loại văn bản:</strong> {categories.find(t => t.id === selectedDocument.category)?.name}</p>
//             <p><strong>Cơ quan ban hành:</strong> {issuingAgency.find(a => a.id === selectedDocument.issuingAgency)?.name}</p>
//             <p><strong>Lĩnh vực hoạt động:</strong> {activities.find(f => f.id === selectedDocument.activity)?.name}</p>
//             <p><strong>Người ký:</strong> {selectedDocument.signer}</p>
//             <p><strong>Nơi nhận:</strong> {selectedDocument.recipients || 'Không có'}</p>
//             <p><strong>File đính kèm:</strong> {selectedDocument.file}</p>
//             <p><strong>Số trang:</strong> {selectedDocument.pages}</p>
//           </div>
    
//           {/* Lượt truy cập - góc dưới bên phải */}
//           <div className="absolute bottom-6 right-6">
//             <div className="bg-blue-50 rounded-lg border border-blue-200 p-3 shadow-sm">
//               <div className="text-center">
//                 <div className="text-lg font-bold text-blue-600">
//                   {Math.floor(Math.random() * 500) + 50}
//                 </div>
//                 <div className="text-xs text-blue-800 font-medium">
//                   Lượt xem
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Nút đóng */}
//         <div className="flex justify-center mt-6">
//           <button
//             className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//             onClick={() => setSelectedDocument(null)}
//           >
//             Đóng
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// );

// export default Modal;
"use client";

import React, { useState } from "react";
import { IDocument } from "../../app/types/data";
import { activities, categories, issuingAgency } from "@/api/documentData";
import { toast } from "sonner";

type ModalProps = {
  selectedDocument: IDocument | null;
  setSelectedDocument: (doc: IDocument | null) => void;
  relatedDocuments: IDocument[];
  selectedCategory: string;
  selectedActivity: string;
  selectedIssuingAgency: string;
};

const Modal: React.FC<ModalProps> = ({
  selectedDocument,
  setSelectedDocument,
}) => {
  const [loading, setLoading] = useState(false);

  if (!selectedDocument) return null;

  const handleDownload = async (id: string, filename: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/documents/files/download?id=${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          toast.error("Không tìm thấy file. Đang tải lại trang...");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          toast.error("Đã xảy ra lỗi khi tải file.");
        }
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Tải file thành công!");
    } catch (error) {
      toast.error("Lỗi kết nối máy chủ!");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return !isNaN(date.getTime()) ? date.toLocaleString("vi-VN") : dateStr;
  };

  const ensureString = (value: string | null | undefined): string => {
    return value ?? "";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl relative">
        {/* Nội dung */}
        <div className="p-6 md:p-8 text-gray-800">
          <h2 className="text-xl md:text-2xl font-bold text-blue-700 mb-5">
            Thông tin chi tiết văn bản
          </h2>

          <div className="space-y-3 text-sm md:text-base leading-relaxed">
            <p><strong>Mã số:</strong> {selectedDocument.code}</p>
            <p><strong>Số hiệu văn bản:</strong> {selectedDocument.refNumber}</p>
            <p><strong>Ngày soạn thảo:</strong> {formatDate(selectedDocument.issuedDate)}</p>
            <p><strong>Ngày ban hành:</strong> {formatDate(selectedDocument.createdAt)}</p>
            <p><strong>Trích yếu:</strong> {selectedDocument.summary}</p>
            <p><strong>Độ khẩn:</strong> {selectedDocument.urgency}</p>
            <p><strong>Độ mật:</strong> {selectedDocument.confidentiality}</p>
            <p>
              <strong>Loại văn bản:</strong>{" "}
              {categories.find((c) => c.id === selectedDocument.category)?.name || "Không xác định"}
            </p>
            <p>
              <strong>Cơ quan ban hành:</strong>{" "}
              {issuingAgency.find((i) => i.id === selectedDocument.issuingAgency)?.name || "Không xác định"}
            </p>
            <p>
              <strong>Lĩnh vực hoạt động:</strong>{" "}
              {activities.find((a) => a.id === selectedDocument.activity)?.name || "Không xác định"}
            </p>
            <p><strong>Người ký:</strong> {selectedDocument.signer}</p>
            <p><strong>Nơi nhận:</strong> {selectedDocument.recipients || "Không có"}</p>
            <p><strong>Số trang:</strong> {selectedDocument.pages}</p>
            <p><strong>File đính kèm:</strong> {selectedDocument.file}</p>

            <button
              type="button"
              onClick={() => handleDownload(selectedDocument.id, ensureString(selectedDocument.file))}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {loading ? "Đang tải..." : "Tải xuống"}
            </button>
          </div>
        </div>

        {/* Lượt xem */}
        <div className="absolute bottom-6 right-6">
          <div className="bg-blue-100 border border-blue-300 rounded-lg px-4 py-2 text-center shadow-sm">
            <p className="text-lg font-bold text-blue-600">{Math.floor(Math.random() * 500) + 50}</p>
            <p className="text-sm font-medium text-blue-800">Lượt xem</p>
          </div>
        </div>

        {/* Nút đóng */}
        <div className="p-4 flex justify-center">
          <button
            onClick={() => setSelectedDocument(null)}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
