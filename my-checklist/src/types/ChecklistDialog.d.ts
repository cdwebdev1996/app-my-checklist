export type CheckListDialogActionType = 'edit' | 'add' | 'delete';

export enum CheckListDialogActionEnum {
  ADD = 'add',
  DELETE = 'delete',
  EDIT = 'edit',
}

export type Status = 'success' | 'failed';

export enum StatusEnum {
  SUCCESS =  'success',
  FAILED = 'failed',
}

export interface FeedbackInterface {
  status: Status;
}

export interface Feedback {
  message: string;
  status: Status;
}

export interface CheckListDialogInterface {
  isOpen: boolean;
  actionType: CheckListDialogActionType | null;
  checklistItem: ChecklistItem | null;
}

export interface ChecklistDialogState {
  checklistDialog: CheckListDialogInterface,
  setChecklistDialog: React.Dispatch<React.SetStateAction<CheckListDialogInterface>>
}