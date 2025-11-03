import { useState, useEffect, useRef } from 'react';
import { Report } from '@/types/reports';
import * as reportService from '@/services/reportService';

export function useReportManager() {
    const [reports, setReports] = useState<Report[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const fetchReports = async () => {
        try {
            const sortedData = await reportService.getReports();
            setReports(sortedData);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Não foi possível carregar os relatórios.');
        }
    };

    useEffect(() => {
        fetchReports();
        const intervalId = setInterval(fetchReports, 5000);
        return () => clearInterval(intervalId);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) {
            setError('Por favor, selecione um arquivo CSV.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await reportService.uploadReport(file);
            setFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            await fetchReports();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido no upload');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        reports,
        file,
        isLoading,
        error,
        fileInputRef,
        handleFileChange,
        handleUpload,
    };
}
