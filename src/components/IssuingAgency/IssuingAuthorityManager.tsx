'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { Edit2, Trash2, Plus, X, Check, Building2, Search, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Authority = {
  id: string;
  name: string;
};

export default function IssuingAuthoritiesManager() {
  const [authorities, setAuthorities] = useState<Authority[]>([]);
  const [name, setName] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  // Filter authorities based on search term
  const filteredAuthorities = authorities.filter(authority =>
    authority.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchAuthorities();
  }, []);

  const fetchAuthorities = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/issuing-agencies');
      setAuthorities(res.data);
      setError('');
    } catch (err) {
      setError('Không thể tải danh sách cơ quan cấp phép');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent | React.KeyboardEvent) => {
    e?.preventDefault();
    if (!name.trim()) {
      setError('Vui lòng nhập tên cơ quan');
      return;
    }

    try {
      setLoading(true);
      if (editId) {
        await axios.put('/api/issuing-agencies', { id: editId, name: name.trim() });
      } else {
        await axios.post('/api/issuing-agencies', { name: name.trim() });
      }
      
      setName('');
      setEditId(null);
      setError('');
      fetchAuthorities();
    } catch (err) {
      setError(editId ? 'Không thể cập nhật cơ quan' : 'Không thể thêm cơ quan mới');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa cơ quan này?')) return;

    try {
      setLoading(true);
      await axios.delete('/api/issuing-agencies', { data: { id } });
      fetchAuthorities();
      setError('');
    } catch (err) {
      setError('Không thể xóa cơ quan');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (authority: Authority) => {
    setName(authority.name);
    setEditId(authority.id);
  };

  const handleCancel = () => {
    setName('');
    setEditId(null);
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-800 rounded-t-lg p-6 text-white">
        <div className="flex items-center gap-3">
          <Building2 size={28} />
          <div>
            <h1 className="text-2xl font-bold">Quản lý Cơ quan Cấp phép</h1>
            <p className="text-orange-100 mt-1">Danh sách các cơ quan có thẩm quyền cấp giấy phép</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border-x border-gray-200 p-4 border-b">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
            placeholder="Tìm kiếm cơ quan cấp phép..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>
        {searchTerm && (
          <p className="text-sm text-gray-600 mt-2">
            Tìm thấy {filteredAuthorities.length} kết quả cho "{searchTerm}"
          </p>
        )}
      </div>

      {/* Form */}
      <div className="bg-white border-x border-gray-200 p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="authorityName" className="block text-sm font-medium text-gray-700 mb-2">
              {editId ? 'Chỉnh sửa tên cơ quan' : 'Thêm cơ quan mới'}
            </label>
            <div className="flex gap-3">
              <input
                id="authorityName"
                type="text"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên cơ quan cấp phép..."
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit(e);
                  }
                }}
              />
              <button
                onClick={handleSubmit}
                disabled={loading || !name.trim()}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                {editId ? (
                  <>
                    <Check size={16} />
                    Cập nhật
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    Thêm mới
                  </>
                )}
              </button>
              {editId && (
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2 transition-colors"
                >
                  <X size={16} />
                  Hủy
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* List */}
      <div className="bg-white border-x border-b border-gray-200 rounded-b-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Building2 size={20} />
            Danh sách cơ quan ({filteredAuthorities.length}{searchTerm ? ` / ${authorities.length}` : ''})
          </h2>
        </div>

        {loading && authorities.length === 0 ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Đang tải...</p>
          </div>
        ) : filteredAuthorities.length === 0 ? (
          <div className="p-8 text-center">
            {searchTerm ? (
              <>
                <Search size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">Không tìm thấy kết quả</h3>
                <p className="text-gray-500 mb-4">Không có cơ quan nào phù hợp với "{searchTerm}"</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-orange-600 hover:text-orange-700 underline"
                >
                  Xóa bộ lọc
                </button>
              </>
            ) : (
              <>
                <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">Chưa có cơ quan nào</h3>
                <p className="text-gray-500">Thêm cơ quan cấp phép đầu tiên của bạn</p>
              </>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredAuthorities.map((authority, index) => (
              <div 
                key={authority.id} 
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  editId === authority.id ? 'bg-orange-50 border-l-4 border-orange-500' : ''
                } animate-fade-in`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-semibold text-sm">
                      {searchTerm ? authorities.findIndex(auth => auth.id === authority.id) + 1 : index + 1}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{authority.name}</h3>
                      <p className="text-sm text-gray-500">ID: {authority.id}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(authority)}
                      disabled={loading}
                      className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors disabled:opacity-50"
                      title="Chỉnh sửa"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(authority.id)}
                      disabled={loading}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                      title="Xóa"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="fixed bottom-6 left-6 flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 shadow-lg"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        <span>Quay lại</span>
      </button>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}