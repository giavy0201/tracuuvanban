import React, { useState } from 'react';

type CategoryType = { id: string; name: string };

type CategoryFilterProps = {
  categories: CategoryType[];
  selectedCategory: string;
  setSelectedCategory: (id: string) => void;
  setSelectedActivity: (id: string) => void;
  setSelectedIssuingAgency: (id: string) => void;
};

const CategoryFilter = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  setSelectedActivity,
  setSelectedIssuingAgency,
}: CategoryFilterProps) => {
  const [visibleCategories, setVisibleCategories] = useState(5);
  const hasMore = categories.length > visibleCategories;

  const handleViewMore = () => {
    setVisibleCategories((prev) => prev + 5);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100" data-component-id="category-filter-003">
      <div className="bg-blue-50 p-4 rounded-t-xl">
        <h3 className="font-semibold text-blue-800 text-base">LOẠI VĂN BẢN:</h3>
      </div>
      <div className="p-3 space-y-1">
        {categories.slice(0, visibleCategories).map((category) => (
          <button
            key={category.id}
            className={`w-full flex items-center gap-2 py-2 px-3 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors ${
              selectedCategory === category.id ? 'bg-blue-100 font-medium' : ''
            }`}
            onClick={() => {
              setSelectedCategory(category.id);
              setSelectedActivity('');
              setSelectedIssuingAgency('');
            }}
          >
            <span className="text-red-500 text-xs">▶</span>
            <span className="hover:underline">{category.name}</span>
          </button>
        ))}
        {hasMore && (
          <button
            className="w-full px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            onClick={handleViewMore}
          >
            Xem thêm
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryFilter;