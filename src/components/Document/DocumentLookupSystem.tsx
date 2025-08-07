// import React, { useState, useEffect } from 'react';
// import Header from '@/components/Header';
// import Sidebar from '@/components/Sidebar';
// import CategoryFilter from '@/components/CategoryFilter';
// import ActivityFilter from '@/components/ActivityFilter';
// import IssuingAgencyFilter from '@/components/IssuingAgencyFilter';
// import MainContent from '@/components/MainContent';
// import SearchSection from '@/components/SearchSection';
// import DocumentTable from '@/components/DocumentTable';
// import Pagination from '@/components/Pagination';
// import Modal from '@/components/Modal';
// import Footer from '@/components/Footer';

// interface Category {
//   id: string;
//   name: string;
// }

// interface Activity {
//   id: string;
//   name: string;
// }

// interface IssuingAgency {
//   id: string;
//   name: string;
// }

// type DocumentType = {
//   id: string;
//   date: string;
//   title: string;
//   code: string;
//   refNumber: string;
//   createdAt: string;
//   issuedDate: string;
//   summary: string;
//   urgency: string;
//   confidentiality: string;
//   type: string;
//   authority: string;
//   field: string;
//   signer: string;
//   recipients?: string;
//   file: string;
//   pages: number;
// };
// type ModalProps = {
//   selectedDocument: DocumentType | null;
//   setSelectedDocument: React.Dispatch<React.SetStateAction<DocumentType | null>>;
//   relatedDocuments: DocumentType[];
//   selectedCategory: string;
//   selectedActivity: string;
//   selectedIssuingAgency: string;
// };
// const DocumentLookupSystem = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [selectedActivity, setSelectedActivity] = useState('');
//   const [selectedIssuingAgency, setSelectedIssuingAgency] = useState('');
//   const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [documents, setDocuments] = useState<DocumentType[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [activities, setActivities] = useState<Activity[]>([]);
//   const [issuingAgencies, setIssuingAgencies] = useState<IssuingAgency[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const documentsPerPage = 10;

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const [docsRes, catsRes, actsRes, iasRes] = await Promise.all([
//           fetch('/api/documents'),
//           fetch('/api/categories'),
//           fetch('/api/activities'),
//           fetch('/api/issuing-agencies'),
//         ]);

//         if (!docsRes.ok) throw new Error(`Documents: ${docsRes.status} - ${docsRes.statusText}`);
//         if (!catsRes.ok) throw new Error(`Categories: ${catsRes.status} - ${catsRes.statusText}`);
//         if (!actsRes.ok) throw new Error(`Activities: ${actsRes.status} - ${actsRes.statusText}`);
//         if (!iasRes.ok) throw new Error(`Issuing Agencies: ${iasRes.status} - ${iasRes.statusText}`);

//         const [documentsData, categoriesData, activitiesData, issuingAgenciesData] = await Promise.all([
//           docsRes.json(),
//           catsRes.json(),
//           actsRes.json(),
//           iasRes.json(),
//         ]);

//         setDocuments(documentsData);
//         setCategories(categoriesData);
//         setActivities(activitiesData);
//         setIssuingAgencies(issuingAgenciesData);
//         setLoading(false);
//       } catch (err) {
//         console.error('Fetch error:', err);
//         setError(err instanceof Error ? err.message : 'Error fetching data');
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const filteredDocuments = documents.filter((doc) =>
//     (doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//      doc.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
//     (!selectedCategory || doc.type === selectedCategory) &&
//     (!selectedActivity || doc.field === selectedActivity) &&
//     (!selectedIssuingAgency || doc.authority === selectedIssuingAgency)
//   );

//   const totalPages = Math.ceil(filteredDocuments.length / documentsPerPage);
//   const startIndex = (currentPage - 1) * documentsPerPage;
//   const endIndex = startIndex + documentsPerPage;
//   const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex);

//   const handleViewMore = () => {
//     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
//   };

//   const relatedDocuments = selectedDocument
//     ? documents.filter((doc) =>
//         doc.id !== selectedDocument.id &&
//         ((selectedCategory && doc.type === selectedCategory) ||
//          (selectedActivity && doc.field === selectedActivity) ||
//          (selectedIssuingAgency && doc.authority === selectedIssuingAgency))
//       )
//     : [];

//   if (loading) return <div className="min-h-screen bg-gray-50 font-sans">Đang tải...</div>;
//   if (error) return <div className="min-h-screen bg-gray-50 font-sans">Lỗi: {error}</div>;

//   return (
//     <div className="min-h-screen bg-gray-50 font-sans" data-component-id="root-000">
//       <Header />
//       <main className="container mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
//         <Sidebar>
//           <CategoryFilter
//             categories={categories}
//             selectedCategory={selectedCategory}
//             setSelectedCategory={setSelectedCategory}
//             setSelectedActivity={setSelectedActivity}
//             setSelectedIssuingAgency={setSelectedIssuingAgency}
//           />
//           <ActivityFilter
//             activities={activities}
//             selectedActivity={selectedActivity}
//             setSelectedActivity={setSelectedActivity}
//             setSelectedCategory={setSelectedCategory}
//             setSelectedIssuingAgency={setSelectedIssuingAgency}
//           />
//           <IssuingAgencyFilter
//             issuingAgency={issuingAgencies}
//             selectedIssuingAgency={selectedIssuingAgency}
//             setSelectedIssuingAgency={setSelectedIssuingAgency}
//             setSelectedCategory={setSelectedCategory}
//             setSelectedActivity={setSelectedActivity}
//           />
//         </Sidebar>
//         <MainContent>
//           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 min-h-[400px]">
//             <SearchSection searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
//             <div className="mb-6">
//               <p className="text-blue-600 font-medium">
//                 Tìm thấy {filteredDocuments.length} văn bản - Hiển thị {paginatedDocuments.length} văn bản
//               </p>
//             </div>
//              <DocumentTable filteredDocuments={paginatedDocuments} setSelectedDocument={(doc) => setSelectedDocument(doc)} /> 
//             <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
//           </div>
//           <Modal
//             selectedDocument={selectedDocument}
//             setSelectedDocument={setSelectedDocument}
//             relatedDocuments={relatedDocuments}
//             selectedCategory={selectedCategory}
//             selectedActivity={selectedActivity}
//             selectedIssuingAgency={selectedIssuingAgency}
//           />
//         </MainContent>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default DocumentLookupSystem;

import React, { useState, useEffect } from 'react';
import Header from '@/components/home/Header';
import Sidebar from '@/components/home/Sidebar';
import CategoryFilter from '@/components/Category/CategoryFilter';
import ActivityFilter from '@/components/Activity/ActivityFilter';
import IssuingAgencyFilter from '@/components/IssuingAgency/IssuingAgencyFilter';
import MainContent from '@/components/home/MainContent';
import SearchSection from '@/components/home/SearchSection';
import DocumentTable from '@/components/Document/DocumentTable';
import Pagination from '@/components/home/Pagination';
import Modal from '@/components/Document/Modal';
import Footer from '@/components/home/Footer';
import { IDocument, DocumentType } from '@/app/types/data';

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

// Define DocumentTable-compatible type
interface DocumentTableType {
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
  type: string; // Non-nullable
  authority: string; // Non-nullable
  field: string; // Non-nullable
  signer: string;
  recipients?: string;
  file: string;
  pages: number;
}

interface ModalProps {
  selectedDocument: IDocument | null;
  setSelectedDocument: React.Dispatch<React.SetStateAction<DocumentType | null>>;
  relatedDocuments: IDocument[];
  selectedCategory: string;
  selectedActivity: string;
  selectedIssuingAgency: string;
}

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

        // Transform API response to match DocumentType
        const transformedDocuments: DocumentType[] = documentsData.map((doc: any) => ({
          id: doc.id,
          date: doc.date,
          title: doc.title,
          code: doc.code,
          refNumber: doc.ref_number,
          createdAt: doc.created_at,
          issuedDate: doc.issued_date,
          summary: doc.summary,
          urgency: doc.urgency,
          confidentiality: doc.confidentiality,
          type: doc.type,
          authority: doc.authority,
          field: doc.field,
          signer: doc.signer,
          recipients: doc.recipients,
          file: doc.file,
          pages: doc.pages,
        }));

        setDocuments(transformedDocuments);
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

  // Transform paginatedDocuments for DocumentTable
  const transformedPaginatedDocuments: DocumentTableType[] = paginatedDocuments.map((doc) => ({
    id: doc.id,
    date: doc.date,
    title: doc.title,
    code: doc.code,
    refNumber: doc.refNumber,
    createdAt: doc.createdAt,
    issuedDate: doc.issuedDate,
    summary: doc.summary,
    urgency: doc.urgency,
    confidentiality: doc.confidentiality,
    type: doc.type || 'Unknown', // Ensure non-null
    authority: doc.authority || 'Unknown', // Ensure non-null
    field: doc.field || 'Unknown', // Ensure non-null
    signer: doc.signer,
    recipients: doc.recipients,
    file: doc.file,
    pages: doc.pages,
  }));

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

  // Transform DocumentType to IDocument
  const transformedSelectedDocument: IDocument | null = selectedDocument
    ? {
        id: selectedDocument.id,
        documentNumber: selectedDocument.code,
        issuingAgency: selectedDocument.authority,
        category: selectedDocument.type,
        activity: selectedDocument.field,
        code: selectedDocument.code,
        effectiveDate: selectedDocument.issuedDate,
        status: 'active', // Default value since not in schema
        updatedAt: selectedDocument.createdAt,
        title: selectedDocument.title,
        refNumber: selectedDocument.refNumber,
        createdAt: selectedDocument.createdAt,
        issuedDate: selectedDocument.issuedDate,
        summary: selectedDocument.summary,
        urgency: selectedDocument.urgency,
        confidentiality: selectedDocument.confidentiality,
        signer: selectedDocument.signer,
        recipients: selectedDocument.recipients,
        file: selectedDocument.file,
        pages: selectedDocument.pages,
      }
    : null;

  // Transform relatedDocuments to IDocument[]
  const transformedRelatedDocuments: IDocument[] = relatedDocuments.map((doc) => ({
    id: doc.id,
    documentNumber: doc.code,
    issuingAgency: doc.authority,
    category: doc.type,
    activity: doc.field,
    code: doc.code,
    effectiveDate: doc.issuedDate,
    status: 'active', // Default value since not in schema
    updatedAt: doc.createdAt,
    title: doc.title,
    refNumber: doc.refNumber,
    createdAt: doc.createdAt,
    issuedDate: doc.issuedDate,
    summary: doc.summary,
    urgency: doc.urgency,
    confidentiality: doc.confidentiality,
    signer: doc.signer,
    recipients: doc.recipients,
    file: doc.file,
    pages: doc.pages,
  }));

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
            <DocumentTable filteredDocuments={transformedPaginatedDocuments} setSelectedDocument={(doc) => setSelectedDocument(doc)} />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
          <Modal
            selectedDocument={transformedSelectedDocument}
            setSelectedDocument={(doc: IDocument | null) => {
              if (!doc) {
                setSelectedDocument(null);
              } else {
                setSelectedDocument({
                  id: doc.id,
                  date: doc.effectiveDate || '',
                  title: doc.title,
                  code: doc.code,
                  refNumber: doc.refNumber,
                  createdAt: doc.createdAt,
                  issuedDate: doc.issuedDate,
                  summary: doc.summary,
                  urgency: doc.urgency,
                  confidentiality: doc.confidentiality,
                  type: doc.category ,
                  authority: doc.issuingAgency,
                  field: doc.activity ,
                  signer: doc.signer,
                  recipients: doc.recipients,
                  file: doc.file,
                  pages: doc.pages,
                });
              }
            }}
            relatedDocuments={transformedRelatedDocuments}
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