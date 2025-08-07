import React, { useState } from 'react';

type ActivityFilterProps = {
  activities: { id: string; name: string }[];
  selectedActivity: string;
  setSelectedActivity: (id: string) => void;
  setSelectedCategory: (id: string) => void;
  setSelectedIssuingAgency: (id: string) => void;
};

const ActivityFilter = ({
  activities,
  selectedActivity,
  setSelectedActivity,
  setSelectedCategory,
  setSelectedIssuingAgency,
}: ActivityFilterProps) => {
  const [visibleActivities, setVisibleActivities] = useState(5);
  const hasMore = activities.length > visibleActivities;

  const handleViewMore = () => {
    setVisibleActivities((prev) => prev + 5);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100" data-component-id="activity-filter-004">
      <div className="bg-blue-50 p-4 rounded-t-xl">
        <h3 className="font-semibold text-blue-800 text-base">LĨNH VỰC HOẠT ĐỘNG:</h3>
      </div>
      <div className="p-3 space-y-1">
        {activities.slice(0, visibleActivities).map((activity) => (
          <button
            key={activity.id}
            className={`w-full flex items-center gap-2 py-2 px-3 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors ${
              selectedActivity === activity.id ? 'bg-blue-100 font-medium' : ''
            }`}
            onClick={() => {
              setSelectedActivity(activity.id);
              setSelectedCategory('');
              setSelectedIssuingAgency('');
            }}
          >
            <span className="text-red-500 text-xs">▶</span>
            <span className="hover:underline">{activity.name}</span>
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

export default ActivityFilter;