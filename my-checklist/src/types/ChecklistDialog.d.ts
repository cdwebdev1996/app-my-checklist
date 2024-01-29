export type CheckListDialogActionType = 'edit' | 'add' | 'delete' | 'get';

export enum CheckListDialogActionEnum {
  ADD = 'add',
  DELETE = 'delete',
  EDIT = 'edit',
  GET = 'get'
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
  checklistLength: number;
}

export interface ChecklistDialogState {
  checklistDialog: CheckListDialogInterface,
  setChecklistDialog: React.Dispatch<React.SetStateAction<CheckListDialogInterface>>
}

export type Colors = 
  '#C0392B' |
  '#E74C3C' |
  '#9B59B6' |
  '#8E44AD' |
  '#2980B9' |
  '#3498DB' |
  '#1ABC9C' |
  '#16A085' |
  '#27AE60' |
  '#2ECC71' |
  '#F1C40F' |
  '#F39C12' |
  '#E67E22' |
  '#D35400' |
  '#ECF0F1' |
  '#BDC3C7' |
  '#95A5A6' |
  '#7F8C8D' |
  '#34495E' |
  '#2C3E50';