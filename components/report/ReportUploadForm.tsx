'use client';

import React from 'react';
import { UploadCloud, FileText, Loader2 } from 'lucide-react';

interface ReportUploadFormProps {
    file: File | null;
    isLoading: boolean;
    error: string | null;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    handleUpload: (e: React.FormEvent<HTMLFormElement>) => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ReportUploadForm({
    file,
    isLoading,
    error,
    fileInputRef,
    handleUpload,
    handleFileChange,
}: ReportUploadFormProps) {
    return (
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
    );
}
