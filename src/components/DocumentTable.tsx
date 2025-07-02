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

type DocumentTableProps = {
  filteredDocuments: DocumentType[];
  setSelectedDocument: (doc: DocumentType) => void;
};

const DocumentTable = ({ filteredDocuments, setSelectedDocument }: DocumentTableProps) => (
  <div className="overflow-x-auto rounded-lg border border-gray-200" data-component-id="document-table-008">
    <table className="w-full bg-white">
      <thead>
        <tr className="bg-gray-50 text-gray-700">
          <th className="p-4 text-left font-semibold w-1/5">Số-Ký hiệu</th>
          <th className="p-4 text-left font-semibold w-1/4">Ngày ban hành</th>
          <th className="p-4 text-left font-semibold w-3/5">Tên Văn bản</th>
        </tr>
      </thead>
      <tbody>
        {filteredDocuments.map((doc, index) => (
          <tr
            key={doc.id}
            className={`border-t border-gray-200 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}
          >
            <td className="p-4 font-medium text-blue-600">{doc.id}</td>
            <td className="p-4 text-gray-600">
              {new Date(doc.date).toLocaleDateString('vi-VN')}
            </td>

            <td
              className="p-4 text-sm text-gray-800 cursor-pointer hover:underline"
              onClick={() => setSelectedDocument(doc)}
            >
              {doc.title}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default DocumentTable;