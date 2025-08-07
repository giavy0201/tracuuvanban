'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { 
  Calendar, 
  Edit2, 
  Trash2, 
  Plus, 
  Search,
  Check,
  X,
  Zap,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';

type Activity = {
  id: string;
  name: string;
};

export default function ActivitiesManager() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [name, setName] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/activities');
      setActivities(res.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setError('Không thể tải danh sách hoạt động. Vui lòng thử lại.');
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
        await axios.put('/api/activities', { id: editId, name });
      } else {
        await axios.post('/api/activities', { name });
      }
      setName('');
      setEditId(null);
      await fetchActivities();
    } catch (error) {
      console.error('Error saving activity:', error);
      setError(editId ? 'Không thể cập nhật hoạt động' : 'Không thể thêm hoạt động mới');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa hoạt động này?')) return;
    
    setError('');
    try {
      await axios.delete('/api/activities', { data: { id } });
      await fetchActivities();
    } catch (error) {
      console.error('Error deleting activity:', error);
      setError('Không thể xóa hoạt động');
    }
  };

  const handleEdit = (activity: Activity) => {
    setName(activity.name);
    setEditId(activity.id);
    setError('');
  };

  const cancelEdit = () => {
    setName('');
    setEditId(null);
    setError('');
  };

  const filteredActivities = activities.filter(activity =>
    activity.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="bg-green-600 rounded-lg p-3 mr-4">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Quản lý hoạt động</h1>
              <p className="text-gray-600 mt-1 text-sm md:text-base">Tạo, chỉnh sửa và quản lý các hoạt động của bạn</p>
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
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6 border border-green-100">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  className="w-full px-4 py-3 bg-white border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 text-sm md:text-base"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nhập tên hoạt động..."
                  onKeyPress={(e) => e.key === 'Enter' && !isSubmitting && handleSubmit()}
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleSubmit}
                  disabled={!name.trim() || isSubmitting}
                  className="flex items-center px-4 md:px-6 py-2 md:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 text-sm md:text-base font-medium"
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
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 text-sm md:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm hoạt động..."
            />
          </div>
        </div>

        {/* Activities List */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center">
                <Zap className="w-5 h-5 md:w-6 md:h-6 mr-2 text-green-600" />
                Danh sách hoạt động
              </h2>
              <div className="flex items-center gap-4">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {filteredActivities.length} hoạt động
                </span>
                <button
                  onClick={fetchActivities}
                  disabled={isLoading}
                  className="flex items-center px-3 py-2 text-green-600 hover:bg-green-100 rounded-lg transition-all duration-200 text-sm"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                  ) : null}
                  Làm mới
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="p-12 text-center animate-fade-in">
              <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-sm md:text-base">Đang tải dữ liệu...</p>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="p-12 text-center animate-fade-in">
              <Calendar className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">
                {activities.length === 0 
                  ? 'Chưa có hoạt động nào' 
                  : searchTerm 
                    ? 'Không tìm thấy hoạt động' 
                    : 'Chưa có hoạt động nào'
                }
              </h3>
              <p className="text-gray-600 text-sm md:text-base">
                {activities.length === 0 
                  ? 'Hãy thêm hoạt động đầu tiên của bạn' 
                  : 'Thử thay đổi từ khóa tìm kiếm'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredActivities.map((activity, index) => (
                <div 
                  key={activity.id} 
                  className={`p-6 hover:bg-gray-50 transition-colors duration-200 ${
                    editId === activity.id ? 'bg-green-50 border-l-4 border-green-600' : ''
                  } animate-fade-in`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-green-100 rounded-lg p-2 mr-4">
                        <Calendar className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-base md:text-lg font-medium text-gray-900">{activity.name}</h3>
                        <p className="text-xs md:text-sm text-gray-500">ID: {activity.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => handleEdit(activity)}
                        disabled={isSubmitting}
                        className="flex items-center px-3 py-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors duration-200 disabled:opacity-50"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-4 h-4 mr-1" />
                        <span className="hidden sm:inline">Sửa</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(activity.id)}
                        disabled={isSubmitting}
                        className="flex items-center px-3 py-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200 disabled:opacity-50"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        <span className="hidden sm:inline">Xóa</span>
                      </button>
                    </div>
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
        className="fixed bottom-6 left-6 flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-lg"
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