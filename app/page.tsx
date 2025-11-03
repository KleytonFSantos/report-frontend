'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { ReportUploadForm } from '@/components/report/ReportUploadForm';
import { ReportHistoryTable } from '@/components/report/ReportHistoryTable';
import { useReportManager } from '@/hooks/useReportManager';

export default function Home() {
    const {
        reports,
        file,
        isLoading,
        error,
        fileInputRef,
        handleFileChange,
        handleUpload,
    } = useReportManager();

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 p-4 sm:p-8">
            <div className="max-w-6xl mx-auto">
                <PageHeader />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <ReportUploadForm
                        file={file}
                        isLoading={isLoading}
                        error={error}
                        fileInputRef={fileInputRef}
                        handleUpload={handleUpload}
                        handleFileChange={handleFileChange}
                    />
                    <ReportHistoryTable reports={reports} />
                </div>
            </div>
        </div>
    );
}
