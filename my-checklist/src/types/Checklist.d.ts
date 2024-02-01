export interface ChecklistItem {
  id?: number;
  priority?: number;
  name: string;
  remarks: string | null;
  backgroundColor: string;
  tags: string | null;
  isArchived?: number;
  isCompleted?: number;
}

export interface AddOrUpdateRequestBody {
  id?: number;
  priority?: number;
  name?: string;
  remarks?: string | null;
  backgroundColor?: string;
  tags?: string | null;
}
