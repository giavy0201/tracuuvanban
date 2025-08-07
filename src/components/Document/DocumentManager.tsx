// "use client";
// import React, { useState, useEffect } from 'react';
// import { DocumentType } from '@/app/types/data';

// type DocumentFormData = {
//   id?: string;
//   date: string;
//   title: string;
//   code: string;
//   ref_number: string;
//   issued_date: string;
//   created_at?: string;
//   summary: string;
//   urgency: string;
//   confidentiality: string;
//   type: string | null;
//   authority: string | null;
//   field: string | null;
//   signer: string;
//   recipients: string | null;
//   file: File | string | null;
//   pages: number;
// };

// type Category = { id: string; name: string };
// type Activity = { id: string; name: string };
// type IssuingAgency = { id: string; name: string };

// const DocumentManager = () => {
//   const [documents, setDocuments] = useState<DocumentType[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [activities, setActivities] = useState<Activity[]>([]);
//   const [issuingAgencies, setIssuingAgencies] = useState<IssuingAgency[]>([]);
//   const [formData, setFormData] = useState<DocumentFormData>({
//     date: '',
//     title: '',
//     code: '',
//     ref_number: '',
//     issued_date: '',
//     summary: '',
//     urgency: 'Bình thường',
//     confidentiality: 'Công khai',
//     type: null,
//     authority: null,
//     field: null,
//     signer: '',
//     recipients: null,
//     file: null,
//     pages: 1,
//   });
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

//   // Auto-hide success message
//   useEffect(() => {
//     if (success) {
//       const timer = setTimeout(() => setSuccess(null), 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [success]);

//   // Hàm chuyển đổi ngày sang YYYY-MM-DD
//   const formatDateForInput = (date: string | Date | null | undefined): string => {
//     if (!date) return '';
//     try {
//       let parsedDate: Date;
//       if (typeof date === 'string') {
//         if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(date)) {
//           parsedDate = new Date(date);
//         } else if (/^\d{2}-\d{2}-\d{4}$/.test(date)) {
//           const [day, month, year] = date.split('-').map(Number);
//           parsedDate = new Date(year, month - 1, day);
//         } else if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
//           parsedDate = new Date(date);
//         } else {
//           return '';
//         }
//       } else {
//         parsedDate = new Date(date);
//       }
//       if (isNaN(parsedDate.getTime())) return '';
//       return parsedDate.toISOString().split('T')[0];
//     } catch (e) {
//       console.error('Error parsing date:', e);
//       return '';
//     }
//   };

//   // Hàm đảm bảo chuỗi không null/undefined
//   const ensureString = (value: string | null | undefined): string => {
//     return value ?? '';
//   };

//   // Lấy danh sách văn bản và dữ liệu dropdown
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const [documentsRes, categoriesRes, activitiesRes, agenciesRes] = await Promise.all([
//           fetch('/api/documents'),
//           fetch('/api/categories'),
//           fetch('/api/activities'),
//           fetch('/api/issuing-agencies'),
//         ]);

//         if (!documentsRes.ok) throw new Error('Không thể tải danh sách văn bản');
//         if (!categoriesRes.ok) throw new Error('Không thể tải danh sách loại văn bản');
//         if (!activitiesRes.ok) throw new Error('Không thể tải danh sách lĩnh vực');
//         if (!agenciesRes.ok) throw new Error('Không thể tải danh sách cơ quan ban hành');

//         const documents = await documentsRes.json();
//         const categories = await categoriesRes.json();
//         const activities = await activitiesRes.json();
//         const agencies = await agenciesRes.json();

//         setDocuments(documents);
//         setCategories(categories);
//         setActivities(activities);
//         setIssuingAgencies(agencies);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Lỗi khi tải dữ liệu');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   // Xử lý thay đổi file
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null;
//     setFormData({ ...formData, file });
//   };

//   // Xử lý tải xuống file
//   const handleDownload = () => {
//     if (typeof formData.file === 'string' && formData.file) {
//       // Giả định file được lưu trên server với đường dẫn `/uploads/{filename}`
//       const fileUrl = `/uploads/${formData.file}`; // Thay bằng endpoint thực tế của bạn
//       const link = document.createElement('a');
//       link.href = fileUrl;
//       link.download = formData.file; // Tên file khi tải xuống
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };

//   // Xử lý gửi biểu mẫu
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       setError(null);
//       setSuccess(null);

//       // Validate dữ liệu bắt buộc
//       if (!formData.date || !formData.issued_date || !formData.ref_number || 
//           !formData.title || !formData.code || !formData.signer || !formData.file) {
//         setError('Vui lòng điền đầy đủ tất cả các trường bắt buộc');
//         setLoading(false);
//         return;
//       }

//       const method = editingId ? 'PUT' : 'POST';

//       // Chuẩn bị dữ liệu gửi lên server
//       const requestBody: DocumentFormData = {
//         date: formData.date,
//         title: formData.title,
//         code: formData.code,
//         ref_number: formData.ref_number,
//         issued_date: formData.issued_date,
//         created_at: editingId ? undefined : new Date().toISOString(),
//         summary: formData.summary,
//         urgency: formData.urgency,
//         confidentiality: formData.confidentiality,
//         type: formData.type || null,
//         authority: formData.authority || null,
//         field: formData.field || null,
//         signer: formData.signer,
//         recipients: formData.recipients || null,
//         file: formData.file instanceof File ? formData.file.name : formData.file,
//         pages: formData.pages,
//       };

//       if (editingId) {
//         requestBody.id = editingId;
//       }

//       console.log('Sending request:', requestBody);

//       const response = await fetch('/api/documents', {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(requestBody),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('API error response:', errorText);
//         throw new Error(`Không thể ${editingId ? 'cập nhật' : 'thêm'} văn bản: ${errorText}`);
//       }

//       const updatedDocument = await response.json();

//       if (editingId) {
//         setDocuments(documents.map((doc) => (doc.id === editingId ? updatedDocument : doc)));
//         setSuccess('Cập nhật văn bản thành công!');
//       } else {
//         setDocuments([...documents, updatedDocument]);
//         setSuccess('Thêm văn bản thành công!');
//       }

//       // Reset form
//       resetForm();
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Lỗi khi lưu văn bản');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Xử lý chỉnh sửa
//   const handleEdit = (doc: DocumentType) => {
//     const ref_number = doc.refNumber || (doc as any).ref_number || '';
//     const issued_date = doc.issuedDate || (doc as any).issued_date || '';

//     setEditingId(doc.id);
//     setFormData({
//       date: formatDateForInput(doc.date),
//       title: ensureString(doc.title),
//       code: ensureString(doc.code),
//       ref_number: ensureString(ref_number),
//       issued_date: formatDateForInput(issued_date),
//       summary: ensureString(doc.summary),
//       urgency: ensureString(doc.urgency),
//       confidentiality: ensureString(doc.confidentiality),
//       type: doc.type ?? null,
//       authority: doc.authority ?? null,
//       field: doc.field ?? null,
//       signer: ensureString(doc.signer),
//       recipients: doc.recipients ?? null,
//       file: ensureString(doc.file),
//       pages: doc.pages ?? 1,
//     });
//   };

//   // Xử lý xóa
//   const handleDelete = async (id: string) => {
//     if (!confirm('Bạn có chắc chắn muốn xóa văn bản này?')) return;

//     try {
//       setLoading(true);
//       const response = await fetch('/api/documents', {
//         method: 'DELETE',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ id }),
//       });

//       if (!response.ok) throw new Error('Không thể xóa văn bản');
//       setDocuments(documents.filter((doc) => doc.id !== id));
//       setSuccess('Xóa văn bản thành công!');
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Lỗi khi xóa văn bản');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Reset form
//   const resetForm = () => {
//     setEditingId(null);
//     setFormData({
//       date: '',
//       title: '',
//       code: '',
//       ref_number: '',
//       issued_date: '',
//       summary: '',
//       urgency: 'Bình thường',
//       confidentiality: 'Công khai',
//       type: null,
//       authority: null,
//       field: null,
//       signer: '',
//       recipients: null,
//       file: null,
//       pages: 1,
//     });
//     setError(null);
//   };

//   const getUrgencyColor = (urgency: string) => {
//     switch (urgency) {
//       case 'Rất khẩn': return 'bg-red-500 text-white shadow-lg shadow-red-200';
//       case 'Khẩn': return 'bg-orange-500 text-white shadow-lg shadow-orange-200';
//       default: return 'bg-green-500 text-white shadow-lg shadow-green-200';
//     }
//   };

//   const getConfidentialityIcon = (confidentiality: string) => {
//     switch (confidentiality) {
//       case 'Mật': return '🔒';
//       case 'Hạn chế': return '🔐';
//       default: return '📄';
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
//       <div className="p-6 max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
//             📋 Hệ thống Quản lý Văn bản
//           </h1>
//           <p className="text-gray-600 text-lg">Quản lý và tổ chức văn bản một cách hiệu quả</p>
//         </div>

//         {/* Notifications */}
//         {success && (
//           <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg shadow-sm animate-pulse">
//             <div className="flex items-center">
//               <span className="text-green-600 text-xl mr-2">✅</span>
//               <p className="text-green-700 font-medium">{success}</p>
//             </div>
//           </div>
//         )}

//         {error && (
//           <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg shadow-sm">
//             <div className="flex items-center">
//               <span className="text-red-600 text-xl mr-2">❌</span>
//               <p className="text-red-700 font-medium">{error}</p>
//             </div>
//           </div>
//         )}

//         {/* Form Card */}
//         <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8 overflow-hidden">
//           <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
//             <h2 className="text-xl font-semibold text-white flex items-center">
//               {editingId ? '✏️ Chỉnh sửa văn bản' : '➕ Thêm văn bản mới'}
//             </h2>
//           </div>

//           <form onSubmit={handleSubmit} className="p-6">
//             <div className="space-y-6">
//               {/* Tiêu đề */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   📋 Tiêu đề <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.title}
//                   onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
//                   placeholder="Nhập tiêu đề văn bản..."
//                   required
//                 />
//               </div>

//               {/* Ngày ban hành và Ngày soạn thảo */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     📅 Ngày soạn thảo <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="date"
//                     value={formData.issued_date}
//                     onChange={(e) => setFormData({ ...formData, issued_date: e.target.value })}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     📆 Ngày ban hành <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="date"
//                     value={formData.date}
//                     onChange={(e) => setFormData({ ...formData, date: e.target.value })}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Trích yếu */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   📝 Trích yếu <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   value={formData.summary}
//                   onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md resize-none"
//                   placeholder="Nhập trích yếu nội dung văn bản..."
//                   rows={3}
//                   required
//                 />
//               </div>

//               {/* Thông tin cơ bản */}
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     🏷️ Mã số <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.code}
//                     onChange={(e) => setFormData({ ...formData, code: e.target.value })}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
//                     placeholder="VD: QC001"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     🔢 Số hiệu <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.ref_number}
//                     onChange={(e) => setFormData({ ...formData, ref_number: e.target.value })}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
//                     placeholder="VD: 15/2025/QC-BGDDT"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     ✍️ Người ký <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.signer}
//                     onChange={(e) => setFormData({ ...formData, signer: e.target.value })}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
//                     placeholder="Nhập tên người ký..."
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     📎 File đính kèm <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="file"
//                     onChange={handleFileChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
//                     accept=".pdf,.doc,.docx"
//                     required={!editingId || !formData.file}
//                   />
//                   {editingId && formData.file && typeof formData.file === 'string' && (
//                     <div className="mt-2 flex items-center gap-2">
//                       <p className="text-sm text-gray-500">File hiện tại: {formData.file}</p>
//                       <button
//                         type="button"
//                         onClick={handleDownload}
//                         className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 focus:ring-4 focus:ring-blue-300 text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
//                       >
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//                         </svg>
//                         Tải xuống
//                       </button>
//                     </div>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     📄 Số trang
//                   </label>
//                   <input
//                     type="number"
//                     value={formData.pages}
//                     onChange={(e) => setFormData({ ...formData, pages: parseInt(e.target.value, 10) || 1 })}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
//                     min="1"
//                   />
//                 </div>
//               </div>

//               {/* Phân loại và thuộc tính */}
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">⚡ Độ khẩn</label>
//                   <select
//                     value={formData.urgency}
//                     onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
//                   >
//                     <option value="Bình thường">🟢 Bình thường</option>
//                     <option value="Khẩn">🟡 Khẩn</option>
//                     <option value="Rất khẩn">🔴 Rất khẩn</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">🔒 Độ mật</label>
//                   <select
//                     value={formData.confidentiality}
//                     onChange={(e) => setFormData({ ...formData, confidentiality: e.target.value })}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
//                   >
//                     <option value="Công khai">📄 Công khai</option>
//                     <option value="Hạn chế">🔐 Hạn chế</option>
//                     <option value="Mật">🔒 Mật</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">📑 Loại văn bản</label>
//                   <select
//                     value={formData.type || ''}
//                     onChange={(e) => setFormData({ ...formData, type: e.target.value || null })}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
//                   >
//                     <option value="">Chọn loại văn bản</option>
//                     {categories.map((cat) => (
//                       <option key={cat.id} value={cat.id}>
//                         {cat.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">🏢 Cơ quan ban hành</label>
//                   <select
//                     value={formData.authority || ''}
//                     onChange={(e) => setFormData({ ...formData, authority: e.target.value || null })}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
//                   >
//                     <option value="">Chọn cơ quan ban hành</option>
//                     {issuingAgencies.map((agency) => (
//                       <option key={agency.id} value={agency.id}>
//                         {agency.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">🎯 Lĩnh vực</label>
//                   <select
//                     value={formData.field || ''}
//                     onChange={(e) => setFormData({ ...formData, field: e.target.value || null })}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
//                   >
//                     <option value="">Chọn lĩnh vực</option>
//                     {activities.map((act) => (
//                       <option key={act.id} value={act.id}>
//                         {act.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">📧 Nơi nhận</label>
//                   <input
//                     type="text"
//                     value={formData.recipients || ''}
//                     onChange={(e) => setFormData({ ...formData, recipients: e.target.value || null })}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
//                     placeholder="Nhập nơi nhận..."
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-gray-200">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="flex-1 min-w-[150px] px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
//               >
//                 {loading ? (
//                   <span className="flex items-center justify-center">
//                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Đang xử lý...
//                   </span>
//                 ) : (
//                   `${editingId ? '💾 Cập nhật' : '➕ Thêm'} văn bản`
//                 )}
//               </button>
//               {editingId && (
//                 <button
//                   type="button"
//                   onClick={resetForm}
//                   className="px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-xl hover:from-gray-700 hover:to-gray-800 focus:ring-4 focus:ring-gray-300 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
//                 >
//                   ❌ Hủy chỉnh sửa
//                 </button>
//               )}
//             </div>
//           </form>
//         </div>

//         {/* Bảng văn bản */}
//         <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
//           <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
//             <h2 className="text-xl font-semibold text-white flex items-center">
//               📋 Danh sách văn bản
//             </h2>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full bg-white text-gray-700">
//               <thead>
//                 <tr className="bg-gray-50 text-gray-800 text-sm font-semibold uppercase tracking-wide">
//                   <th className="p-4 text-left">Số hiệu</th>
//                   <th className="p-4 text-left">Ngày ban hành</th>
//                   <th className="p-4 text-left">Tiêu đề</th>
//                   <th className="p-4 text-left">Loại văn bản</th>
//                   <th className="p-4 text-left">Cơ quan ban hành</th>
//                   <th className="p-4 text-left">Độ khẩn</th>
//                   <th className="p-4 text-left">Độ mật</th>
//                   <th className="p-4 text-left">Hành động</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {documents.length === 0 ? (
//                   <tr>
//                     <td colSpan={8} className="p-8 text-center text-gray-500 text-base">
//                       <div className="flex items-center justify-center gap-2">
//                         <span>📂</span>
//                         <span>Chưa có văn bản nào</span>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   documents.map((doc, index) => (
//                     <tr
//                       key={doc.id}
//                       className={`border-t border-gray-100 hover:bg-gray-50 transition-all duration-200 ${
//                         index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
//                       }`}
//                     >
//                       <td className="p-4 text-blue-600 font-medium text-sm">
//                         {ensureString(doc.refNumber || (doc as any).ref_number || 'Chưa có')}
//                       </td>
//                       <td className="p-4 text-gray-600 text-sm">
//                         {(() => {
//                           const dateStr = formatDateForInput(doc.date || (doc as any).data);
//                           return dateStr ? new Date(dateStr).toLocaleDateString('vi-VN') : 'Chưa xác định';
//                         })()}
//                       </td>
//                       <td className="p-4 text-sm text-gray-800 max-w-xs truncate group relative" title={doc.title}>
//                         {ensureString(doc.title)}
//                         <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded-lg py-1 px-2 z-10 max-w-xs break-words">
//                           {ensureString(doc.title)}
//                         </div>
//                       </td>
//                       <td className="p-4 text-sm text-gray-600">
//                         {categories.find((cat) => cat.id === doc.type)?.name || 'Chưa xác định'}
//                       </td>
//                       <td className="p-4 text-sm text-gray-600">
//                         {issuingAgencies.find((agency) => agency.id === doc.authority)?.name || 'Chưa xác định'}
//                       </td>
//                       <td className="p-4">
//                         <span
//                           className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm ${getUrgencyColor(
//                             ensureString(doc.urgency)
//                           )}`}
//                         >
//                           {ensureString(doc.urgency)}
//                         </span>
//                       </td>
//                       <td className="p-4 text-sm text-gray-600">
//                         <span className="flex items-center gap-2">
//                           {getConfidentialityIcon(ensureString(doc.confidentiality))}
//                           {ensureString(doc.confidentiality)}
//                         </span>
//                       </td>
//                       <td className="p-4">
//                         <div className="flex gap-3">
//                           <button
//                             className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 focus:ring-4 focus:ring-yellow-300 text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
//                             onClick={() => handleEdit(doc)}
//                             disabled={loading}
//                           >
//                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                             </svg>
//                             Sửa
//                           </button>
//                           <button
//                             className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 focus:ring-4 focus:ring-red-300 text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
//                             onClick={() => handleDelete(doc.id)}
//                             disabled={loading}
//                           >
//                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4M9 7v12m6-12v12M10 3h4" />
//                             </svg>
//                             Xóa
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DocumentManager;

"use client";
import React, { useState, useEffect } from 'react';
import { DocumentType } from '@/app/types/data';
import { useRouter } from 'next/navigation';
import { ArrowLeft} from 'lucide-react';
type DocumentFormData = {
  id?: string;
  date: string;
  title: string;
  code: string;
  ref_number: string;
  issued_date: string;
  created_at?: string;
  summary: string;
  urgency: string;
  confidentiality: string;
  type: string | null;
  authority: string | null;
  field: string | null;
  signer: string;
  recipients: string | null;
  file: File | string | null;
  pages: number;
};

type Category = { id: string; name: string };
type Activity = { id: string; name: string };
type IssuingAgency = { id: string; name: string };

const DocumentManager = () => {
    const router = useRouter();
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [issuingAgencies, setIssuingAgencies] = useState<IssuingAgency[]>([]);
  const [formData, setFormData] = useState<DocumentFormData>({
    date: '',
    title: '',
    code: '',
    ref_number: '',
    issued_date: '',
    summary: '',
    urgency: 'Bình thường',
    confidentiality: 'Công khai',
    type: null,
    authority: null,
    field: null,
    signer: '',
    recipients: null,
    file: null,
    pages: 1,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Auto-hide success message
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Hàm chuyển đổi ngày sang YYYY-MM-DD
  const formatDateForInput = (date: string | Date | null | undefined): string => {
    if (!date) return '';
    try {
      let parsedDate: Date;
      if (typeof date === 'string') {
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(date)) {
          parsedDate = new Date(date);
        } else if (/^\d{2}-\d{2}-\d{4}$/.test(date)) {
          const [day, month, year] = date.split('-').map(Number);
          parsedDate = new Date(year, month - 1, day);
        } else if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          parsedDate = new Date(date);
        } else {
          return '';
        }
      } else {
        parsedDate = new Date(date);
      }
      if (isNaN(parsedDate.getTime())) return '';
      return parsedDate.toISOString().split('T')[0];
    } catch (e) {
      console.error('Error parsing date:', e);
      return '';
    }
  };

  // Hàm đảm bảo chuỗi không null/undefined
  const ensureString = (value: string | null | undefined): string => {
    return value ?? '';
  };

  // Lấy danh sách văn bản và dữ liệu dropdown
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [documentsRes, categoriesRes, activitiesRes, agenciesRes] = await Promise.all([
          fetch('/api/documents'),
          fetch('/api/categories'),
          fetch('/api/activities'),
          fetch('/api/issuing-agencies'),
        ]);

        if (!documentsRes.ok) throw new Error('Không thể tải danh sách văn bản');
        if (!categoriesRes.ok) throw new Error('Không thể tải danh sách loại văn bản');
        if (!activitiesRes.ok) throw new Error('Không thể tải danh sách lĩnh vực');
        if (!agenciesRes.ok) throw new Error('Không thể tải danh sách cơ quan ban hành');

        const documents = await documentsRes.json();
        const categories = await categoriesRes.json();
        const activities = await activitiesRes.json();
        const agencies = await agenciesRes.json();

        setDocuments(documents);
        setCategories(categories);
        setActivities(activities);
        setIssuingAgencies(agencies);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Xử lý thay đổi file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && !['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
      setError('Chỉ hỗ trợ file PDF, DOC, DOCX');
      return;
    }
    if (file && file.size > 10 * 1024 * 1024) {
      setError('File quá lớn, tối đa 10MB');
      return;
    }
    setFormData({ ...formData, file });
  };

  // Xử lý tải xuống file
  const handleDownload = async (id: string, filename: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/documents/files/download?id=${id}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Không thể tải file');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải file');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý gửi biểu mẫu
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Validate dữ liệu bắt buộc
      if (!formData.date || !formData.issued_date || !formData.ref_number || 
          !formData.title || !formData.code || !formData.signer) {
        setError('Vui lòng điền đầy đủ tất cả các trường bắt buộc');
        setLoading(false);
        return;
      }

      // Validate file khi thêm mới
      if (!editingId && !(formData.file instanceof File)) {
        setError('Vui lòng chọn file khi thêm mới văn bản');
        setLoading(false);
        return;
      }

      const method = editingId ? 'PUT' : 'POST';
      const formDataToSend = new FormData();

      // Thêm dữ liệu văn bản vào FormData
      formDataToSend.append('date', formData.date);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('code', formData.code);
      formDataToSend.append('ref_number', formData.ref_number);
      formDataToSend.append('issued_date', formData.issued_date);
      if (!editingId) formDataToSend.append('created_at', new Date().toISOString());
      formDataToSend.append('summary', formData.summary || '');
      formDataToSend.append('urgency', formData.urgency);
      formDataToSend.append('confidentiality', formData.confidentiality);
      if (formData.type) formDataToSend.append('type', formData.type);
      if (formData.authority) formDataToSend.append('authority', formData.authority);
      if (formData.field) formDataToSend.append('field', formData.field);
      formDataToSend.append('signer', formData.signer);
      if (formData.recipients) formDataToSend.append('recipients', formData.recipients);
      formDataToSend.append('pages', formData.pages.toString());
      if (editingId) formDataToSend.append('id', editingId);

      // Thêm file nếu có
    //   if (formData.file instanceof File) {
    //     formDataToSend.append('file', formData.file);
    //   } else if (editingId && typeof formData.file === 'string' && formData.file) {
    //     formDataToSend.append('file', formData.file);
    //   }
    if (formData.file instanceof File) {
  formDataToSend.append('file', formData.file); // Gửi file mới
} // KHÔNG gửi file nếu là string (đã tồn tại rồi, server giữ nguyên)


      const response = await fetch('/api/documents', {
        method,
        body: formDataToSend,
        // Không đặt Content-Type để trình duyệt tự động đặt multipart/form-data
      });
      const data = await response.json(); // bắt buộc để kết thúc pending
     console.log(data);
      if (!response.ok) {
        console.error('API error response:', data);
  throw new Error(`Không thể ${editingId ? 'cập nhật' : 'thêm'} văn bản: ${data.error || 'Lỗi không xác định'}`);

      }

    
      if (editingId) {
  setDocuments(documents.map((doc) => (doc.id === editingId ? data : doc)));
  setSuccess('Cập nhật văn bản thành công!');
} else {
  setDocuments([...documents, data]);
  setSuccess('Thêm văn bản thành công!');
}

resetForm(); 
router.refresh();
console.log('Form reset')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi lưu văn bản');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý chỉnh sửa
  const handleEdit = (doc: DocumentType) => {
    const ref_number = doc.refNumber || (doc as any).ref_number || '';
    const issued_date = doc.issuedDate || (doc as any).issued_date || '';

    setEditingId(doc.id);
    setFormData({
      date: formatDateForInput(doc.date),
      title: ensureString(doc.title),
      code: ensureString(doc.code),
      ref_number: ensureString(ref_number),
      issued_date: formatDateForInput(issued_date),
      summary: ensureString(doc.summary),
      urgency: ensureString(doc.urgency),
      confidentiality: ensureString(doc.confidentiality),
      type: doc.type ?? null,
      authority: doc.authority ?? null,
      field: doc.field ?? null,
      signer: ensureString(doc.signer),
      recipients: doc.recipients ?? null,
      file: ensureString(doc.file),
      pages: doc.pages ?? 1,
    });
  };

  // Xử lý xóa
  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa văn bản này?')) return;

    try {
      setLoading(true);
      const response = await fetch('/api/documents', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Không thể xóa văn bản');
      }
      setDocuments(documents.filter((doc) => doc.id !== id));
      setSuccess('Xóa văn bản thành công!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi xóa văn bản');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setEditingId(null);
    setFormData({
      date: '',
      title: '',
      code: '',
      ref_number: '',
      issued_date: '',
      summary: '',
      urgency: 'Bình thường',
      confidentiality: 'Công khai',
      type: null,
      authority: null,
      field: null,
      signer: '',
      recipients: null,
      file: null,
      pages: 1,
    });
    setError(null);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Rất khẩn': return 'bg-red-500 text-white shadow-lg shadow-red-200';
      case 'Khẩn': return 'bg-orange-500 text-white shadow-lg shadow-orange-200';
      default: return 'bg-green-500 text-white shadow-lg shadow-green-200';
    }
  };

  const getConfidentialityIcon = (confidentiality: string) => {
    switch (confidentiality) {
      case 'Mật': return '🔒';
      case 'Hạn chế': return '🔐';
      default: return '📄';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            📋 Hệ thống Quản lý Văn bản
          </h1>
          <p className="text-gray-600 text-lg">Quản lý và tổ chức văn bản một cách hiệu quả</p>
        </div>

        {/* Notifications */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg shadow-sm animate-pulse">
            <div className="flex items-center">
              <span className="text-green-600 text-xl mr-2">✅</span>
              <p className="text-green-700 font-medium">{success}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg shadow-sm">
            <div className="flex items-center">
              <span className="text-red-600 text-xl mr-2">❌</span>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              {editingId ? '✏️ Chỉnh sửa văn bản' : '➕ Thêm văn bản mới'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Tiêu đề */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📋 Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                  placeholder="Nhập tiêu đề văn bản..."
                  required
                />
              </div>

              {/* Ngày ban hành và Ngày soạn thảo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📅 Ngày soạn thảo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.issued_date}
                    onChange={(e) => setFormData({ ...formData, issued_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📆 Ngày ban hành <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                    required
                  />
                </div>
              </div>

              {/* Trích yếu */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📝 Trích yếu
                </label>
                <textarea
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md resize-none"
                  placeholder="Nhập trích yếu nội dung văn bản..."
                  rows={3}
                />
              </div>

              {/* Thông tin cơ bản */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🏷️ Mã số <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                    placeholder="VD: QC001"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🔢 Số hiệu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.ref_number}
                    onChange={(e) => setFormData({ ...formData, ref_number: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                    placeholder="VD: 28/QC"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ✍️ Người ký <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.signer}
                    onChange={(e) => setFormData({ ...formData, signer: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                    placeholder="Nhập tên người ký..."
                    required
                  />
                </div>
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📎 File đính kèm <span className="text-red-500">{editingId ? '' : '*'}</span>
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                    accept=".pdf,.doc,.docx"
                    required={!editingId}
                  />
                  {editingId && formData.file && typeof formData.file === 'string' && (
                    <div className="mt-2 flex items-center gap-2">
                      <p className="text-sm text-gray-500">File hiện tại: {formData.file}</p>
                      <button
                        type="button"
                        onClick={() => handleDownload(editingId!, typeof formData.file === 'string' ? formData.file : '')}
                        className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 focus:ring-4 focus:ring-blue-300 text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                        disabled={loading}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Tải xuống
                      </button>
                    </div>
                  )}
                </div> */}
                <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    📎 File đính kèm
    {!editingId && <span className="text-red-500"> *</span>}
  </label>

  <input
    type="file"
    accept=".pdf,.doc,.docx"
    onChange={handleFileChange}
    required={!editingId}
    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
  />

  {editingId && formData.file && typeof formData.file === 'string' && (
    <div className="mt-2 flex items-center gap-2">
      <p className="text-sm text-gray-500 truncate max-w-[200px]">
        File hiện tại: {formData.file}
      </p>
      <button
        type="button"
        onClick={() => handleDownload(editingId, formData.file as string)}
        disabled={loading}
        className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Tải xuống
      </button>
    </div>
  )}
</div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📄 Số trang
                  </label>
                  <input
                    type="number"
                    value={formData.pages}
                    onChange={(e) => setFormData({ ...formData, pages: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                    min="1"
                  />
                </div>
              </div>

              {/* Phân loại và thuộc tính */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">⚡ Độ khẩn</label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <option value="Bình thường">🟢 Bình thường</option>
                    <option value="Khẩn">🟡 Khẩn</option>
                    <option value="Rất khẩn">🔴 Rất khẩn</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">🔒 Độ mật</label>
                  <select
                    value={formData.confidentiality}
                    onChange={(e) => setFormData({ ...formData, confidentiality: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <option value="Công khai">📄 Công khai</option>
                    <option value="Hạn chế">🔐 Hạn chế</option>
                    <option value="Mật">🔒 Mật</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">📑 Loại văn bản</label>
                  <select
                    value={formData.type || ''}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value || null })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <option value="">Chọn loại văn bản</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">🏢 Cơ quan ban hành</label>
                  <select
                    value={formData.authority || ''}
                    onChange={(e) => setFormData({ ...formData, authority: e.target.value || null })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <option value="">Chọn cơ quan ban hành</option>
                    {issuingAgencies.map((agency) => (
                      <option key={agency.id} value={agency.id}>
                        {agency.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">🎯 Lĩnh vực</label>
                  <select
                    value={formData.field || ''}
                    onChange={(e) => setFormData({ ...formData, field: e.target.value || null })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <option value="">Chọn lĩnh vực</option>
                    {activities.map((act) => (
                      <option key={act.id} value={act.id}>
                        {act.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">📧 Nơi nhận</label>
                  <input
                    type="text"
                    value={formData.recipients || ''}
                    onChange={(e) => setFormData({ ...formData, recipients: e.target.value || null })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                    placeholder="Nhập nơi nhận..."
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 min-w-[150px] px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                  </span>
                ) : (
                  `${editingId ? '💾 Cập nhật' : '➕ Thêm'} văn bản`
                )}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-xl hover:from-gray-700 hover:to-gray-800 focus:ring-4 focus:ring-gray-300 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  ❌ Hủy chỉnh sửa
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Bảng văn bản */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              📋 Danh sách văn bản
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full bg-white text-gray-700">
              <thead>
                <tr className="bg-gray-50 text-gray-800 text-sm font-semibold uppercase tracking-wide">
                  <th className="p-4 text-left">Số hiệu</th>
                  <th className="p-4 text-left">Ngày ban hành</th>
                  <th className="p-4 text-left">Tiêu đề</th>
                  <th className="p-4 text-left">Loại văn bản</th>
                  <th className="p-4 text-left">Cơ quan ban hành</th>
                  <th className="p-4 text-left">Độ khẩn</th>
                  <th className="p-4 text-left">Độ mật</th>
                  <th className="p-4 text-left">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {documents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-500 text-base">
                      <div className="flex items-center justify-center gap-2">
                        <span>📂</span>
                        <span>Chưa có văn bản nào</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  documents.map((doc, index) => (
                    <tr
                      key={doc.id}
                      className={`border-t border-gray-100 hover:bg-gray-50 transition-all duration-200 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                      }`}
                    >
                      <td className="p-4 text-blue-600 font-medium text-sm">
                        {ensureString(doc.refNumber || (doc as any).ref_number || 'Chưa có')}
                      </td>
                      <td className="p-4 text-gray-600 text-sm">
                        {(() => {
                          const dateStr = formatDateForInput(doc.date || (doc as any).data);
                          return dateStr ? new Date(dateStr).toLocaleDateString('vi-VN') : 'Chưa xác định';
                        })()}
                      </td>
                      <td className="p-4 text-sm text-gray-800 max-w-xs truncate group relative" title={doc.title}>
                        {ensureString(doc.title)}
                        <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded-lg py-1 px-2 z-10 max-w-xs break-words">
                          {ensureString(doc.title)}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {categories.find((cat) => cat.id === doc.type)?.name || 'Chưa xác định'}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {issuingAgencies.find((agency) => agency.id === doc.authority)?.name || 'Chưa xác định'}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm ${getUrgencyColor(
                            ensureString(doc.urgency)
                          )}`}
                        >
                          {ensureString(doc.urgency)}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        <span className="flex items-center gap-2">
                          {getConfidentialityIcon(ensureString(doc.confidentiality))}
                          {ensureString(doc.confidentiality)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 focus:ring-4 focus:ring-yellow-300 text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handleEdit(doc)}
                            disabled={loading}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Sửa
                          </button>
                          <button
                            className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 focus:ring-4 focus:ring-red-300 text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handleDelete(doc.id)}
                            disabled={loading}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4M9 7v12m6-12v12M10 3h4" />
                            </svg>
                            Xóa
                          </button>
                          {doc.file && (
                            <button
                              className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 focus:ring-4 focus:ring-blue-300 text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={() => handleDownload(doc.id, ensureString(doc.file))}
                              disabled={loading}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              Tải xuống
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <button
        onClick={() => router.back()}
        className="fixed bottom-6 left-6 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        <span>Quay lại</span>
      </button>
      </div>
    </div>
  );
};

export default DocumentManager;