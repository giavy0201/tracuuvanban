import React from 'react';
import { Search } from 'lucide-react';

type SearchSectionProps = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
};

const SearchSection = ({ searchTerm, setSearchTerm }: SearchSectionProps) => (
  <div className="mb-8" data-component-id="search-section-007">
    <div className="flex items-center gap-4">
      <label className="text-sm font-medium text-gray-700">Tìm kiếm:</label>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
          placeholder="Nhập từ khóa tìm kiếm..."
        />
      </div>
      <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        Tìm kiếm
      </button>
      <button className="px-6 py-2 bg-gray-100 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors">
        Tìm kiếm nâng cao
      </button>
    </div>
  </div>
);

export default SearchSection;