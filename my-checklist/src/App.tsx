import React from 'react';
import { Alert, AlertTitle, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/system';
import { CheckListItemDialog, ChecklistSkeleton, FilterPanel, Header } from './components';
import { GetAllChecklistAPI } from './middleware';
import { Checklist } from './pages';
import { 
  CheckListDialogInterface, 
  ChecklistItem, 
  ChecklistDialogState, 
  CheckListDialogActionType, 
  Feedback, 
  Status, 
  CheckListDialogActionEnum,
  StatusEnum
} from './types';
import { theme } from './utils';
import './App.css';

export const App = () => {

  const [checklistDialog, setChecklistDialog] = React.useState<CheckListDialogInterface>({isOpen: false, actionType: null, checklistItem : null, checklistLength: 0});
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isFeedbackMessageShown, setIsFeedbackMessageShown] = React.useState<boolean>(false);
  const [feedback, setFeedback] = React.useState<Feedback>();
  const feedbackMessages = {
    SUCCESS_CREATE: 'Checklist item successfully created.',
    SUCCESS_DELETE: 'Checklist item successfully removed.',
    SUCCESS_UPDATE: 'Checklist item successfully updated.',
    FAILED_CREATE: 'Checklist item creation failed.',
    FAILED_DELETE: 'Checklist item removal failed.',
    FAILED_UPDATE: 'Checklist item modification failed.',
    FAILED_GET_DATA: 'Cannot fetch data from the server.',
  }
  const [checklistData, setChecklistData] = React.useState<Array<ChecklistItem>>([]);

  const showFeedbackMessage = React.useCallback((action: CheckListDialogActionType | null, status: Status) => {
    switch (action) {
      case CheckListDialogActionEnum.ADD:
        if (status === StatusEnum.SUCCESS) {
          setFeedback({
            message: feedbackMessages.SUCCESS_CREATE,
            status
          });
        } else {
          setFeedback({
            message: feedbackMessages.FAILED_CREATE,
            status
          });
        }
        break;
      case CheckListDialogActionEnum.EDIT:
        if (status === StatusEnum.SUCCESS) {
          setFeedback({
            message: feedbackMessages.SUCCESS_UPDATE,
            status
          });
        } else {
          setFeedback({
            message: feedbackMessages.FAILED_UPDATE,
            status
          });
        }
        break;
      case CheckListDialogActionEnum.DELETE:
        if (status === StatusEnum.SUCCESS) {
          setFeedback({
            message: feedbackMessages.SUCCESS_DELETE,
            status
          });
        } else {
          setFeedback({
            message: feedbackMessages.FAILED_DELETE,
            status
          });
        }
        break;
      case CheckListDialogActionEnum.GET:
        if (status === StatusEnum.FAILED) {
          setFeedback({
            message: feedbackMessages.FAILED_GET_DATA,
            status
          });
        }
        break;
    }
    setIsFeedbackMessageShown(true);
    setTimeout(() => {
      setIsFeedbackMessageShown(false);
    }, 3800);
  }, [
      feedbackMessages.FAILED_CREATE,
      feedbackMessages.FAILED_DELETE,
      feedbackMessages.FAILED_GET_DATA,
      feedbackMessages.FAILED_UPDATE,
      feedbackMessages.SUCCESS_CREATE,
      feedbackMessages.SUCCESS_DELETE,
      feedbackMessages.SUCCESS_UPDATE
  ]);

  const getAllChecklist = React.useCallback(() => {
    GetAllChecklistAPI(
      setIsLoading,
      (data) => setChecklistData(data as Array<ChecklistItem>),
      () => showFeedbackMessage(CheckListDialogActionEnum.GET, StatusEnum.FAILED),
    );
  }, [setChecklistData, showFeedbackMessage]);

  const checklistDialogState: ChecklistDialogState = {
    checklistDialog,
    setChecklistDialog,
  };

  const checklistDialogComponentProps = {
    checklistDialogState,
    isLoading,
    showFeedbackMessage,
    getAllChecklist,
  }

  const checklistPageProps = {
    checklistDialogState,
    checklistData,
  }

  const filterPanelProps = {
    checklistDialogState,
    checklistData,
    isLoading
  };

  React.useEffect(() => {
    getAllChecklist();
  }, [getAllChecklist]);

  return (
    <ThemeProvider theme={theme}>
      <div className='app'>
        {isFeedbackMessageShown && (
          <Alert severity={feedback?.status === StatusEnum.SUCCESS ? 'success' : 'error'}>
            <AlertTitle>{feedback?.status === StatusEnum.SUCCESS ? 'Success' : 'Error'}</AlertTitle>
            {feedback?.message}
          </Alert>
        )}
        <div className='grid-container'>
          <div className='grid-item item-1' />
          <div className='grid-item item-2'>
            <CheckListItemDialog {...checklistDialogComponentProps}/>
            <Header />
            <FilterPanel {...filterPanelProps} />
            {
              isLoading 
                ? <ChecklistSkeleton /> 
                : !checklistData.length
                  ? <Typography variant='h6'>No checklist at the moment</Typography>
                  : <Checklist {...checklistPageProps}/>
            }
          </div>
          <div className='grid-item item-3' />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;

