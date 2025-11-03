import { ReportStatusType } from "@/components/report/ReportStatus";

export interface Report {
    id: number;
    original_filename: string | null;
    status: ReportStatusType;
    error_message: string | null;
    created_at: string;
}
