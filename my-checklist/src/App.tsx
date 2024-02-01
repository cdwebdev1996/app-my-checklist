import React from 'react';
import { Typography } from '@mui/material';
import { ThemeProvider } from '@mui/system';
import { CheckListItemDialog, ChecklistSkeleton, FeedbackAlert, FilterPanel, Header } from './components';
import { AppContext } from './context';
import { Checklist } from './pages';
import { 
  APIs,
  ActionTypes,
  ApplicationState, 
  CheckListDialogInterface, 
  ChecklistItem, 
  Feedback,
  FeedbackStatus,
} from './types';
import { theme, callAPI } from './utils';
import './App.css';

export const App = () => {

  const [checklistData, setChecklistData] = React.useState<Array<ChecklistItem>>([]);
  const [cachedData, setCachedData] = React.useState<Array<ChecklistItem>>([]);
  const [checklistDialog, setChecklistDialog] = React.useState<CheckListDialogInterface>({ isOpen: false, actionType: null, checklistItem : null, checklistLength: 0 });
  const [feedback, setFeedback] = React.useState<Feedback>({ action: null, status: null });
  const [isFeedbackMessageShown, setIsFeedbackMessageShown] = React.useState<boolean>(false);
  const [isFiltering, setIsFiltering] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const showFeedbackMessage = React.useCallback((action: ActionTypes, status: FeedbackStatus) => {
    setFeedback({
      action,
      status
    });
    setIsFeedbackMessageShown(true);
  }, []);

  const handleOnSuccess = (data: ChecklistItem[]) => {
    setChecklistData(data);
    setCachedData(data);
  }

  const getAllChecklist = React.useCallback(() => {
    callAPI({apiEndpoint: APIs.GETALL, loader: setIsLoading, onSuccess: handleOnSuccess, onError: showFeedbackMessage});
  }, [showFeedbackMessage]);

  const applicationState: ApplicationState = {
    cachedData,
    checklistData,
    checklistDialog,
    feedback,
    isFeedbackMessageShown,
    isFiltering,
    isLoading,
    getAllChecklist,
    setCachedData,
    setChecklistData,
    setChecklistDialog,
    setFeedback,
    setIsFeedbackMessageShown,
    setIsFiltering,
    setIsLoading,
    showFeedbackMessage,
  }

  React.useEffect(() => {
    getAllChecklist();
  }, [getAllChecklist]);

  return (
    <AppContext.Provider value={ applicationState }>
      <ThemeProvider theme={theme}>
        <div className='app'>
          <FeedbackAlert />
          <div className='grid-container'>
            <div className='grid-item item-1' />
            <div className='grid-item item-2'>
              <CheckListItemDialog />
              <Header />
              <FilterPanel />
              {
                isLoading 
                  ? <ChecklistSkeleton /> 
                  : !checklistData.length
                    ? <Typography variant='h6'>You have no tasks for today</Typography>
                    : <Checklist />
              }
            </div>
            <div className='grid-item item-3' />
          </div>
        </div>
      </ThemeProvider>
    </AppContext.Provider>
  );
};

export default App;

