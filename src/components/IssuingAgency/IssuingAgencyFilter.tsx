import React, { useState } from 'react';

type IssuingAgencyType = { id: string; name: string };

type IssuingAgencyFilterProps = {
  issuingAgency: IssuingAgencyType[];
  selectedIssuingAgency: string;
  setSelectedIssuingAgency: (id: string) => void;
  setSelectedCategory: (id: string) => void;
  setSelectedActivity: (id: string) => void;
};

const IssuingAgencyFilter = ({
  issuingAgency,
  selectedIssuingAgency,
  setSelectedIssuingAgency,
  setSelectedCategory,
  setSelectedActivity,
}: IssuingAgencyFilterProps) => {
  const [visibleAgencies, setVisibleAgencies] = useState(5);
  const hasMore = issuingAgency.length > visibleAgencies;

  const handleViewMore = () => {
    setVisibleAgencies((prev) => prev + 5);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100" data-component-id="issuing-agency-filter-005">
      <div className="bg-blue-50 p-4 rounded-t-xl">
        <h3 className="font-semibold text-blue-800 text-base">CƠ QUAN BAN HÀNH:</h3>
      </div>
      <div className="p-3 space-y-1">
        {issuingAgency.slice(0, visibleAgencies).map((agency) => (
          <button
            key={agency.id}
            className={`w-full flex items-center gap-2 py-2 px-3 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors ${
              selectedIssuingAgency === agency.id ? 'bg-blue-100 font-medium' : ''
            }`}
            onClick={() => {
              setSelectedIssuingAgency(agency.id);
              setSelectedCategory('');
              setSelectedActivity('');
            }}
          >
            <span className="text-red-500 text-xs">▶</span>
            <span className="hover:underline">{agency.name}</span>
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

export default IssuingAgencyFilter;