import React from 'react';
import { Snackbar, Typography } from '@mui/material';
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
  ErrorCodes, 
  Feedback,
  FeedbackMessages,
  FeedbackStatus,
} from './types';
import { theme, callAPI } from './utils';
import Empty from './assets/empty.png';
import ConnectionError from './assets/no-connection.png';
import './App.css';

export const App = () => {

  const [checklistData, setChecklistData] = React.useState<Array<ChecklistItem>>([]);
  const [cachedData, setCachedData] = React.useState<Array<ChecklistItem>>([]);
  const [checklistDialog, setChecklistDialog] = React.useState<CheckListDialogInterface>({ isOpen: false, actionType: null, checklistItem : null, checklistLength: 0 });
  const [feedback, setFeedback] = React.useState<Feedback>({ action: null, status: null, customMessage: null });
  const [responseErrorCodes, setResponseErrorCodes] = React.useState<ErrorCodes | null>(null);
  const [isFeedbackMessageShown, setIsFeedbackMessageShown] = React.useState<boolean>(false);
  const [isFiltering, setIsFiltering] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [showSnackBar, setShowSnackbar] = React.useState<boolean>(false);

  const showFeedbackMessage = React.useCallback((action: ActionTypes, status: FeedbackStatus, code?: ErrorCodes) => {
    setFeedback({
      action,
      status,
      customMessage: code === ErrorCodes.ERR_NETWORK ? FeedbackMessages.ERR_NETWORK : null,
    });
    setIsFeedbackMessageShown(true);
  }, []);

  const handleOnSuccess = React.useCallback((data: ChecklistItem[]) => {
    setChecklistData(data);
    setCachedData(data);
  }, []);

  const handleOnError = React.useCallback((action: ActionTypes, status: FeedbackStatus, code?: ErrorCodes) => {
    setResponseErrorCodes(code as ErrorCodes);
    code && showFeedbackMessage(action, status, code);
  }, [showFeedbackMessage]);

  const getAllChecklist = React.useCallback(() => {
    callAPI({apiEndpoint: APIs.GETALL, loader: setIsLoading, onSuccess: handleOnSuccess, onError: handleOnError});
  }, [handleOnError, handleOnSuccess]);

  const applicationState: ApplicationState = {
    cachedData,
    checklistData,
    checklistDialog,
    feedback,
    isFeedbackMessageShown,
    isFiltering,
    isLoading,
    responseErrorCodes,
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

  const _renderLandingBasedOnFeedback = () => {
    return (
      <React.Fragment>
        <div className='container-landing'>
          {
            responseErrorCodes && responseErrorCodes === ErrorCodes.ERR_NETWORK ? (
              <React.Fragment>
                <Typography variant='h4' sx={{ color: '#1E1E1E' }}>Unable to establish connection to the server</Typography>
                <Typography variant='overline' sx={{ color: '#1E1E1E' }}>Please check your conection and try again.</Typography>
                <img src={ConnectionError} width={'28%'} alt='cover-landing-no-connection' />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Typography variant='h4' sx={{ color: '#1E1E1E' }}>Oops! It seems like your checklist for today is empty</Typography>
                <Typography variant='overline' sx={{ color: '#1E1E1E' }}>Take charge and start addings tasks to customize your checklist</Typography>
                <img src={Empty} width={'58%'} alt='cover-landing-no-data' />
              </React.Fragment>
            )
          }
        </div>
      </React.Fragment>
    );
  }

  React.useEffect(() => {
    getAllChecklist();
    // setTimeout(() => setShowSnackbar(true), 1200);
  }, [getAllChecklist]);

  return (
    <AppContext.Provider value={ applicationState }>
      <ThemeProvider theme={theme}>
        <div className='app'>
          <FeedbackAlert />
          <Snackbar
            open={showSnackBar}
            autoHideDuration={6000}
            onClose={() => setShowSnackbar(false)}
            message="Welcome to My Checklist App!"
          />
          <div className='grid-container'>
            <div className='grid-item item-1' />
            <div className='grid-item item-2'>
              <CheckListItemDialog />
              <Header />
              <FilterPanel />
              {
                isLoading 
                  ? <ChecklistSkeleton /> 
                  : !checklistData.length || responseErrorCodes
                    ? _renderLandingBasedOnFeedback()
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

