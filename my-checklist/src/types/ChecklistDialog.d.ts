import { ChecklistItem } from './Checklist.d';

export interface CheckListDialogInterface {
  isOpen: boolean;
  actionType: ActionTypes | null;
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