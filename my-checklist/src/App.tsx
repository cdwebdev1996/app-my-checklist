import React from 'react';
import { Alert, AlertTitle } from '@mui/material';
import { ThemeProvider } from '@mui/system';
import { CheckListItemDialog, ChecklistSkeleton, FilterPanel, Header } from './components';
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

  const [checklistDialog, setChecklistDialog] = React.useState<CheckListDialogInterface>({isOpen: false, actionType: null, checklistItem : null});
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isFeedbackMessageShown, setIsFeedbackMessageShown] = React.useState<boolean>(false);
  const [feedback, setFeedback] = React.useState<Feedback>();
  const feedbackMessages = {
    SUCCESS_CREATE: 'Checklist item successfully created.',
    SUCCESS_DELETE: 'Checklist item successfully removed.',
    SUCCESS_UPDATE: 'Checklist item successfully updated.',
    FAILED_CREATE: 'Checklist item creation failed.',
    FAILED_DELETE: 'Checklist item removal failed.',
    FAILED_UPDATE: 'Checklist item modification failed.',
  }
  const [checklistData, setChecklistData] = React.useState<Array<ChecklistItem>>([
    {
      id: 1,
      priority: 1,
      name: 'Pay Meralco Bill',
      remarks: 'Payment of Meralco Bill due on 4th of February.',
      backgroundColor: '#E67E22',
      tags: 'payment,due,bills',
      isArchived: 0,
      isCompleted: 0
    }
  ]);

  const showFeedbackMessage = (action: CheckListDialogActionType | null, status: Status) => {
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
    }
    setIsFeedbackMessageShown(true);
    setTimeout(() => {
      setIsFeedbackMessageShown(false);
    }, 3800);
  }

  const checklistDialogState: ChecklistDialogState = {
    checklistDialog,
    setChecklistDialog,
  };

  const checklistDialogComponentProps = {
    checklistDialogState,
    isLoading,
    showFeedbackMessage,
  }

  const checklistPageProps = {
    checklistDialogState,
    checklistData,
  }

  const filterPanelProps = {
    checklistDialogState,
    isLoading
  };

  React.useEffect(() => {
    // showFeedbackMessage();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className='app'>
        {isFeedbackMessageShown && (
          <Alert severity={feedback?.status === StatusEnum.SUCCESS ? 'success' : 'error'}>
            <AlertTitle>Success</AlertTitle>
            {feedback?.message}
          </Alert>
        )}
        <div className='grid-container'>
          <div className='grid-item item-1' />
          <div className='grid-item item-2'>
            <CheckListItemDialog {...checklistDialogComponentProps}/>
            <Header />
            <FilterPanel {...filterPanelProps} />
            {isLoading ? <ChecklistSkeleton /> : <Checklist {...checklistPageProps}/>}
          </div>
          <div className='grid-item item-3' />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;

