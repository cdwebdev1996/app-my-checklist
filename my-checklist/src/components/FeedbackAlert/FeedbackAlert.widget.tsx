import React from "react"
import { Alert, AlertTitle } from "@mui/material";
import { AppContext } from "../../context"
import { FeedbackStatus, FeedbackMessages, ActionTypes } from '../../types'

export const FeedbackAlert = () => {
  const { feedback, isFeedbackMessageShown, setIsFeedbackMessageShown, } = React.useContext(AppContext);

  const renderFeedbackMessage = () => {
    const { action, status } = feedback;
    switch(action) {
      case ActionTypes.ADD:
       return status && status === FeedbackStatus.SUCCESS
          ? FeedbackMessages.SUCCESS_CREATE : FeedbackMessages.ERROR_CREATE;
      case ActionTypes.DELETE:
        return status === FeedbackStatus.SUCCESS
          ? FeedbackMessages.SUCCESS_DELETE : FeedbackMessages.ERROR_DELETE;
      case ActionTypes.EDIT:
        return status === FeedbackStatus.SUCCESS
          ? FeedbackMessages.SUCCESS_UPDATE : FeedbackMessages.ERROR_UPDATE;
      case ActionTypes.GET:
        return status === FeedbackStatus.ERROR ? FeedbackMessages.ERROR_GET_DATA : null;
      default:
        return 'Unknown Error';
    }
  }

  React.useEffect(() => {
    isFeedbackMessageShown && setTimeout(() => {
      // automatically hide feedback message three (3) seconds after rendering
      setIsFeedbackMessageShown(false);
    }, 3800);
  }, [ isFeedbackMessageShown, setIsFeedbackMessageShown]);

  return (
   <React.Fragment>
      {isFeedbackMessageShown ? (
        <Alert variant='filled' severity={feedback?.status || FeedbackStatus.ERROR} sx={{
          position: 'fixed',
          zIndex: 1,
          top: 0,
          width: '100%',
          boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
          borderRadius: 0,
        }}>
          <AlertTitle>{feedback?.status?.toUpperCase()}</AlertTitle>
          {renderFeedbackMessage()}
        </Alert>
      ) : null}
   </React.Fragment>
  );
}