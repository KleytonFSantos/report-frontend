'use client';

import React from 'react';
import { FileText, Download, Inbox } from 'lucide-react';
import { ReportStatus, ReportStatusType } from '@/components/report/ReportStatus';

const API_URL = process.env.API_URL + '/api';

interface Report {
    id: number;
    original_filename: string | null;
    status: ReportStatusType;
    error_message: string | null;
    created_at: string;
}

interface ReportHistoryTableProps {
    reports: Report[];
}

export function ReportHistoryTable({ reports }: ReportHistoryTableProps) {
    return (
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
    );
}
