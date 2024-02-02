import { ActionTypes } from './Middleware.d';

export enum FeedbackMessages {
  SUCCESS_CREATE ='Checklist item successfully created.',
  SUCCESS_DELETE ='Checklist item successfully removed.',
  SUCCESS_UPDATE ='Checklist item successfully updated.',
  ERROR_CREATE ='Checklist item creation failed.',
  ERROR_DELETE ='Checklist item removal failed.',
  ERROR_UPDATE ='Checklist item modification failed.',
  ERROR_GET_DATA ='Cannot fetch data from the server.',
  ERR_NETWORK = 'Cannot connect to the server. Please check connection.',
};

export enum FeedbackStatus {
  SUCCESS =  'success',
  ERROR = 'error',
};

export interface Feedback {
  action: ActionTypes | null;
  status: FeedbackStatus | null;
  customMessage?: string | null;
};

export enum ErrorCodes {
  ERR_NETWORK='ERR_NETWORK',
};