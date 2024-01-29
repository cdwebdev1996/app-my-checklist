export interface ChecklistItem {
  id: number;
  priority: number;
  name: string;
  remarks: string | null;
  backgroundColor: string;
  tags: string | null;
  isArchived?: number;
  isCompleted?: number;
}
