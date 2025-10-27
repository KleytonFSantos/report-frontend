'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    UploadCloud,
    FileText,
    Clock,
    CheckCircle,
    XCircle,
    Download,
    Loader2,
    Inbox
} from 'lucide-react';

const API_URL = 'http://127.0.0.1:8000';

type ReportStatusType = 'pendente' | 'processando' | 'concluido' | 'falhou';

interface Report {
    id: number;
    original_filename: string | null;
    status: ReportStatusType;
    error_message: string | null;
    created_at: string;
}

interface ReportStatusProps {
    status: ReportStatusType;
    error: string | null;
}


export default function Home() {
    const [reports, setReports] = useState<Report[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const fetchReports = async (): Promise<void> => {
        // @ts-ignore
        // @ts-ignore
        try {
            const response = await fetch(`${API_URL}/api/reports`);
            if (!response.ok) {
                throw new Error('Falha ao buscar relatórios');
            }

            const data: Report[] = await response.json();

            const sortedData = data.sort((a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            setReports(sortedData);
            // @ts-expect-error
        } catch (err: any) {
            setError(err.message || 'Não foi possível carregar os relatórios.');
        }
    };

    useEffect(() => {
        fetchReports();

        const intervalId = setInterval(() => {
            fetchReports();
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
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

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${API_URL}/api/reports`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Falha no upload');
            }

            setFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            await fetchReports();
            // ts-expect-error
        } catch (err: any) {
            setError(err.message || 'Erro desconhecido no upload');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 p-4 sm:p-8">
            <div className="max-w-6xl mx-auto">

                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Gerador de Relatórios</h1>
                    <p className="text-gray-600 mt-1">Faça upload de um arquivo .csv para processar.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-1">
                        <form onSubmit={handleUpload} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                            <h2 className="text-xl font-semibold mb-4 flex items-center">
                                <UploadCloud className="w-5 h-5 mr-2 text-blue-600" />
                                Novo Relatório
                            </h2>

                            <label
                                htmlFor="file-upload"
                                className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                                {file ? (
                                    <div className="text-center">
                                        <FileText className="w-12 h-12 text-blue-600 mx-auto" />
                                        <p className="mt-2 font-semibold text-gray-700">{file.name}</p>
                                        <p className="text-xs text-gray-500">{Math.round(file.size / 1024)} KB</p>
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500">
                                        <UploadCloud className="w-12 h-12 mx-auto" />
                                        <p className="mt-2 font-semibold">Clique para enviar</p>
                                        <p className="text-xs">ou arraste e solte (CSV)</p>
                                    </div>
                                )}
                                <input
                                    id="file-upload"
                                    ref={fileInputRef}
                                    name="csv_file"
                                    type="file"
                                    className="sr-only"
                                    accept=".csv"
                                    onChange={handleFileChange}
                                />
                            </label>

                            <button
                                type="submit"
                                disabled={isLoading || !file}
                                className="mt-6 w-full flex items-center justify-center bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Processando...
                                    </>
                                ) : (
                                    'Gerar Relatório'
                                )}
                            </button>

                            {error && (
                                <div className="mt-4 text-center text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                                    {error}
                                </div>
                            )}
                        </form>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                            <h2 className="text-xl font-semibold mb-4 flex items-center">
                                <FileText className="w-5 h-5 mr-2 text-gray-700" />
                                Histórico de Relatórios
                            </h2>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arquivo</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {reports.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center">
                                                <Inbox className="w-12 h-12 text-gray-400 mx-auto" />
                                                <p className="text-gray-500 mt-2">Nenhum relatório encontrado.</p>
                                            </td>
                                        </tr>
                                    )}

                                    {reports.map((report) => (
                                        <tr key={report.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                                                {report.original_filename || 'report.csv'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <ReportStatus status={report.status} error={report.error_message} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(report.created_at).toLocaleString('pt-BR')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {report.status === 'concluido' && (
                                                    <a
                                                        href={`${API_URL}/api/reports/${report.id}/download`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800 flex items-center"
                                                    >
                                                        <Download className="w-4 h-4 mr-1" />
                                                        Baixar
                                                    </a>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

function ReportStatus({ status, error }: ReportStatusProps) {
    if (status === 'concluido') {
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1.5" />
        Concluído
      </span>
        );
    }

    if (status === 'falhou') {
        return (
            <span title={error || 'Erro desconhecido'} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 cursor-help">
        <XCircle className="w-3 h-3 mr-1.5" />
        Falhou
      </span>
        );
    }

    if (status === 'processando') {
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
        Processando
      </span>
        );
    }

    return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
      <Clock className="w-3 h-3 mr-1.5" />
      Pendente
    </span>
    );
}
