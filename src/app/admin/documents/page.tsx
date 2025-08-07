import DocumentManager from '@/components/Document/DocumentManager';
import { Toaster } from "sonner";
export default function DocumentsPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <DocumentManager />
       <Toaster richColors position="top-right" />
    </div>
  );
}
