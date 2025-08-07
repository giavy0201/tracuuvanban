// import DocumentManager from '@/components/DocumentManager';

// export default function AdminPage() {
//   return (
//     <div className="min-h-screen bg-gray-100">
//       <DocumentManager />
//     </div>
//   );
// }

// import Link from 'next/link';

// export default function AdminDashboard() {
//   return (
//     <div className="min-h-screen bg-white p-6 space-y-4">
//       <h1 className="text-3xl font-bold">Trang Quản Trị</h1>
//       <ul className="list-disc pl-6 space-y-2">
//         <li><Link href="/admin/documents" className="text-blue-600 hover:underline">Quản lý văn bản</Link></li>
//         <li><Link href="/admin/activities" className="text-blue-600 hover:underline">Quản lý hoạt động</Link></li>
//         <li><Link href="/admin/categories" className="text-blue-600 hover:underline">Quản lý danh mục</Link></li>
//         <li><Link href="/admin/issuing-authorities" className="text-blue-600 hover:underline">Quản lý cơ quan ban hành</Link></li>
//       </ul>
//     </div>
//   );
// }
"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {  DocumentType } from '@/app/types/data';
import { 
  FileText, 
  Calendar, 
  Grid3X3, 
  Building2, 
  BarChart3, 
  Users, 
  Settings,
  Bell
} from 'lucide-react';

export default function AdminDashboard() {
   const [documents, setDocuments] = useState<DocumentType[]>([]);
  useEffect(() => {
  fetchDocuments();
}, []);

const fetchDocuments = async () => {
  try {
    const res = await fetch('/api/documents');
    const data = await res.json();
    setDocuments(data);
  } catch (error) {
    console.error('Lỗi khi lấy documents:', error);
  }
};

  const menuItems = [
    {
      href: '/admin/documents',
      icon: FileText,
      title: 'Quản lý văn bản',
      description: 'Tạo, chỉnh sửa và quản lý tài liệu',
      color: 'bg-blue-500'
    },
    {
      href: '/admin/activities',
      icon: Calendar,
      title: 'Quản lý hoạt động',
      description: 'Theo dõi và quản lý các hoạt động',
      color: 'bg-green-500'
    },
    {
      href: '/admin/categories',
      icon: Grid3X3,
      title: 'Quản lý danh mục',
      description: 'Phân loại và tổ chức nội dung',
      color: 'bg-purple-500'
    },
    {
      href: '/admin/issuing-authorities',
      icon: Building2,
      title: 'Quản lý cơ quan ban hành',
      description: 'Quản lý thông tin cơ quan phát hành',
      color: 'bg-orange-500'
    }
  ];
  const filteredDocuments = documents.filter((doc) =>
    (doc.id || '').toLowerCase().includes('') 
  );

  const stats = [
    { label: 'Tổng văn bản', value  : filteredDocuments.length  , icon: FileText, color: 'text-blue-600' },
    { label: 'Hoạt động tháng này', value: '89', icon: BarChart3, color: 'text-green-600' },
    { label: 'Người dùng', value: '45', icon: Users, color: 'text-purple-600' },
    { label: 'Danh mục', value: '12', icon: Grid3X3, color: 'text-orange-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Trang Quản Trị</h1>
              <p className="text-gray-600 mt-1">Chào mừng bạn đến với bảng điều khiển quản trị</p>
            </div>
            {/* <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-6 h-6" />
              </button>
            </div> */}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {menuItems.map((item, index) => (
            <Link key={index} href={item.href} className="group">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-lg hover:border-gray-300 transition-all duration-200 group-hover:transform group-hover:-translate-y-1">
                <div className="flex items-start space-x-4">
                  <div className={`${item.color} rounded-lg p-3 text-white shadow-lg`}>
                    <item.icon className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                    <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                      <span>Truy cập ngay</span>
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        
      </div>
    </div>
  );

  }
