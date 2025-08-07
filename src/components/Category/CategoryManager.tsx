'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { 
  Grid3X3, 
  Edit2, 
  Trash2, 
  Plus, 
  Search,
  Check,
  X,
  Tag,
  AlertCircle,
  FolderOpen,
  ArrowLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';

type Category = {
  id: string;
  name: string;
};

export default function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Không thể tải danh sách danh mục. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      if (editId) {
        await axios.put('/api/categories', { id: editId, name });
      } else {
        await axios.post('/api/categories', { name });
      }
      setName('');
      setEditId(null);
      await fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      setError(editId ? 'Không thể cập nhật danh mục' : 'Không thể thêm danh mục mới');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return;
    
    setError('');
    try {
      await axios.delete('/api/categories', { data: { id } });
      await fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      setError('Không thể xóa danh mục');
    }
  };

  const handleEdit = (category: Category) => {
    setName(category.name);
    setEditId(category.id);
    setError('');
  };

  const cancelEdit = () => {
    setName('');
    setEditId(null);
    setError('');
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="bg-indigo-600 rounded-xl p-3 mr-4">
              <Grid3X3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Quản lý danh mục</h1>
              <p className="text-gray-600 mt-1 text-sm md:text-base">Tạo, chỉnh sửa và quản lý các danh mục của bạn</p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center animate-fade-in">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
              <button 
                onClick={() => setError('')}
                className="ml-auto text-red-600 hover:text-red-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Add/Edit Form */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-6 border border-indigo-100">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  className="w-full px-4 py-3 bg-white border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 text-sm md:text-base"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nhập tên danh mục..."
                  onKeyPress={(e) => e.key === 'Enter' && !isSubmitting && handleSubmit()}
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleSubmit}
                  disabled={!name.trim() || isSubmitting}
                  className="flex items-center px-4 md:px-6 py-2 md:py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 text-sm md:text-base font-medium"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white mr-2"></div>
                  ) : editId ? (
                    <Check className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  ) : (
                    <Plus className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  )}
                  {isSubmitting ? 'Đang xử lý...' : editId ? 'Cập nhật' : 'Thêm mới'}
                </button>
                {editId && !isSubmitting && (
                  <button 
                    onClick={cancelEdit}
                    className="flex items-center px-3 md:px-4 py-2 md:py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 text-sm md:text-base"
                  >
                    <X className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 text-sm md:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm danh mục..."
            />
          </div>
        </div>

        {/* Categories List */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center">
                <Tag className="w-5 h-5 md:w-6 md:h-6 mr-2 text-indigo-600" />
                Danh sách danh mục
              </h2>
              <div className="flex items-center gap-4">
                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                  {filteredCategories.length} danh mục
                </span>
                <button
                  onClick={fetchCategories}
                  disabled={isLoading}
                  className="flex items-center px-3 py-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-all duration-200 text-sm"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
                  ) : null}
                  Làm mới
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="p-12 text-center animate-fade-in">
              <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-sm md:text-base">Đang tải dữ liệu...</p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="p-12 text-center animate-fade-in">
              <FolderOpen className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">
                {categories.length === 0 
                  ? 'Chưa có danh mục nào' 
                  : searchTerm 
                    ? 'Không tìm thấy danh mục' 
                    : 'Chưa có danh mục nào'
                }
              </h3>
              <p className="text-gray-600 text-sm md:text-base">
                {categories.length === 0 
                  ? 'Hãy thêm danh mục đầu tiên của bạn' 
                  : 'Thử thay đổi từ khóa tìm kiếm'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 p-6">
              {filteredCategories.map((category, index) => (
                <div 
                  key={category.id} 
                  className={`bg-white border-2 rounded-lg p-4 hover:shadow-lg transition-all duration-300 ease-in-out ${
                    editId === category.id 
                      ? 'border-indigo-400 bg-indigo-50' 
                      : 'border-gray-200 hover:border-indigo-300'
                  } animate-fade-in`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center flex-1">
                      <div className="bg-indigo-100 rounded-lg p-2 mr-3">
                        <Tag className="w-4 h-4 md:w-5 md:h-5 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base md:text-lg font-medium text-gray-900 truncate">
                          {category.name}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-500">ID: {category.id}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
                    <button 
                      onClick={() => handleEdit(category)}
                      disabled={isSubmitting}
                      className="flex items-center px-3 py-1.5 md:py-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-all duration-200 text-xs md:text-sm disabled:opacity-50"
                      title="Chỉnh sửa"
                    >
                      <Edit2 className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                      <span>Sửa</span>
                    </button>
                    <button 
                      onClick={() => handleDelete(category.id)}
                      disabled={isSubmitting}
                      className="flex items-center px-3 py-1.5 md:py-2 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 text-xs md:text-sm disabled:opacity-50"
                      title="Xóa"
                    >
                      <Trash2 className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                      <span>Xóa</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Back Button */}
      <button
  onClick={() => router.back()}
  className="fixed bottom-6 left-6 flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 shadow-lg"
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