'use client';

import { Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export type ReportStatusType = 'pendente' | 'processando' | 'concluido' | 'falhou';

interface ReportStatusProps {
    status: ReportStatusType;
    error: string | null;
}

export function ReportStatus({ status, error }: ReportStatusProps) {
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
