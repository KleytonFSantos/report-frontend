import { Report } from '@/types/reports';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || '') + '/api';

export async function getReports(): Promise<Report[]> {
    const response = await fetch(`${API_URL}/reports`);
    if (!response.ok) {
        throw new Error('Falha ao buscar relatórios');
    }
    const data: Report[] = await response.json();
    return data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function uploadReport(file: File): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/reports`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Falha no upload');
    }
}
