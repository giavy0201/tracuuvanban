import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import CategoryFilter from './CategoryFilter';
import ActivityFilter from './ActivityFilter';
import IssuingAgencyFilter from './IssuingAgencyFilter';
import MainContent from './MainContent';
import SearchSection from './SearchSection';
import DocumentTable from './DocumentTable';
import Pagination from './Pagination';
import Modal from './Modal';
import Footer from './Footer';
import { DocumentType, documents, categories, activities, issuingAgency } from '@/api/documentData';

const DocumentLookupSystem = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');
  const [selectedIssuingAgency, setSelectedIssuingAgency] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const documentsPerPage = 10;

  const filteredDocuments = documents.filter(doc => 
    (doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || doc.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!selectedCategory || doc.type === selectedCategory) &&
    (!selectedActivity || doc.field === selectedActivity) &&
    (!selectedIssuingAgency || doc.authority === selectedIssuingAgency)
  );

  const totalPages = Math.ceil(filteredDocuments.length / documentsPerPage);
  const startIndex = (currentPage - 1) * documentsPerPage;
  const endIndex = startIndex + documentsPerPage;
  const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex);
  const hasMore = currentPage < totalPages;

  const handleViewMore = () => {
    if (hasMore) setCurrentPage(currentPage + 1);
  };

  const relatedDocuments = selectedDocument
    ? documents.filter(doc => 
        (selectedCategory && doc.type === selectedCategory) ||
        (selectedActivity && doc.field === selectedActivity) ||
        (selectedIssuingAgency && doc.authority === selectedIssuingAgency)
      )
    : [];

  return (
    <div className="min-h-screen bg-gray-50 font-sans" data-component-id="root-000">
      <Header />
      <main className="container mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        <Sidebar>
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            setSelectedActivity={setSelectedActivity}
            setSelectedIssuingAgency={setSelectedIssuingAgency}
          />
          <ActivityFilter
            activities={activities}
            selectedActivity={selectedActivity}
            setSelectedActivity={setSelectedActivity}
            setSelectedCategory={setSelectedCategory}
            setSelectedIssuingAgency={setSelectedIssuingAgency}
          />
          <IssuingAgencyFilter
            issuingAgency={issuingAgency}
            selectedIssuingAgency={selectedIssuingAgency}
            setSelectedIssuingAgency={setSelectedIssuingAgency}
            setSelectedCategory={setSelectedCategory}
            setSelectedActivity={setSelectedActivity}
          />
        </Sidebar>
        <MainContent>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 min-h-[400px]">
            <SearchSection searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <div className="mb-6">
              <p className="text-blue-600 font-medium">
                Tìm thấy {filteredDocuments.length} văn bản - Hiển thị {paginatedDocuments.length} văn bản
              </p>
            </div>
            <DocumentTable filteredDocuments={paginatedDocuments} setSelectedDocument={setSelectedDocument} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
          <Modal
            selectedDocument={selectedDocument}
            setSelectedDocument={setSelectedDocument}
            relatedDocuments={relatedDocuments}
            selectedCategory={selectedCategory}
            selectedActivity={selectedActivity}
            selectedIssuingAgency={selectedIssuingAgency}
          />
        </MainContent>
      </main>
      <Footer />
    </div>
  );
};

export default DocumentLookupSystem;