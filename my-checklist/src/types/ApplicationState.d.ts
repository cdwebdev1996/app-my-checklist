


import { ChecklistItem } from './Checklist.d';
import { CheckListDialogInterface } from './ChecklistDialog.d';
import { ActionTypes } from './Middleware';
import { ErrorCodes, Feedback } from './FeedbackMessages.d';

export type VoidFunctionCallback = (...prop?: any) => void;

export interface ApplicationState {
  cachedData: ChecklistItem[];
  checklistData: ChecklistItem[];
  checklistDialog: CheckListDialogInterface;
  feedback: Feedback;
  isFeedbackMessageShown: boolean;
  isFiltering: boolean;
  isLoading: boolean;
  responseErrorCodes: ErrorCodes | null;
  getAllChecklist: VoidFunctionCallback;
  setCachedData: React.Dispatch<React.SetStateAction<ChecklistItem[]>>;
  setChecklistData: React.Dispatch<React.SetStateAction<ChecklistItem[]>>;
  setChecklistDialog: React.Dispatch<React.SetStateAction<CheckListDialogInterface>>;
  setFeedback: React.Dispatch<React.SetStateAction<Feedback>>;
  setIsFeedbackMessageShown: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFiltering: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  showFeedbackMessage: (action: ActionTypes, status: FeedbackStatus) => void;
};