import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import CategoryFilter from '@/components/CategoryFilter';
import ActivityFilter from '@/components/ActivityFilter';
import IssuingAgencyFilter from '@/components/IssuingAgencyFilter';
import MainContent from '@/components/MainContent';
import SearchSection from '@/components/SearchSection';
import DocumentTable from '@/components/DocumentTable';
import Pagination from '@/components/Pagination';
import Modal from '@/components/Modal';
import Footer from '@/components/Footer';

interface Category {
  id: string;
  name: string;
}

interface Activity {
  id: string;
  name: string;
}

interface IssuingAgency {
  id: string;
  name: string;
}

type DocumentType = {
  id: string;
  date: string;
  title: string;
  code: string;
  refNumber: string;
  createdAt: string;
  issuedDate: string;
  summary: string;
  urgency: string;
  confidentiality: string;
  type: string;
  authority: string;
  field: string;
  signer: string;
  recipients?: string;
  file: string;
  pages: number;
};

const DocumentLookupSystem = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');
  const [selectedIssuingAgency, setSelectedIssuingAgency] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [issuingAgencies, setIssuingAgencies] = useState<IssuingAgency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const documentsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [docsRes, catsRes, actsRes, iasRes] = await Promise.all([
          fetch('/api/documents'),
          fetch('/api/categories'),
          fetch('/api/activities'),
          fetch('/api/issuing-agencies'),
        ]);

        if (!docsRes.ok) throw new Error(`Documents: ${docsRes.status} - ${docsRes.statusText}`);
        if (!catsRes.ok) throw new Error(`Categories: ${catsRes.status} - ${catsRes.statusText}`);
        if (!actsRes.ok) throw new Error(`Activities: ${actsRes.status} - ${actsRes.statusText}`);
        if (!iasRes.ok) throw new Error(`Issuing Agencies: ${iasRes.status} - ${iasRes.statusText}`);

        const [documentsData, categoriesData, activitiesData, issuingAgenciesData] = await Promise.all([
          docsRes.json(),
          catsRes.json(),
          actsRes.json(),
          iasRes.json(),
        ]);

        setDocuments(documentsData);
        setCategories(categoriesData);
        setActivities(activitiesData);
        setIssuingAgencies(issuingAgenciesData);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Error fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredDocuments = documents.filter((doc) =>
    (doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     doc.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!selectedCategory || doc.type === selectedCategory) &&
    (!selectedActivity || doc.field === selectedActivity) &&
    (!selectedIssuingAgency || doc.authority === selectedIssuingAgency)
  );

  const totalPages = Math.ceil(filteredDocuments.length / documentsPerPage);
  const startIndex = (currentPage - 1) * documentsPerPage;
  const endIndex = startIndex + documentsPerPage;
  const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex);

  const handleViewMore = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const relatedDocuments = selectedDocument
    ? documents.filter((doc) =>
        doc.id !== selectedDocument.id &&
        ((selectedCategory && doc.type === selectedCategory) ||
         (selectedActivity && doc.field === selectedActivity) ||
         (selectedIssuingAgency && doc.authority === selectedIssuingAgency))
      )
    : [];

  if (loading) return <div className="min-h-screen bg-gray-50 font-sans">Đang tải...</div>;
  if (error) return <div className="min-h-screen bg-gray-50 font-sans">Lỗi: {error}</div>;

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
            issuingAgency={issuingAgencies}
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
             <DocumentTable filteredDocuments={paginatedDocuments} setSelectedDocument={(doc) => setSelectedDocument(doc)} /> 
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
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