

import { ChecklistPresentationService } from '../middleware';
import { APIs, ActionTypes, AddOrUpdateRequestBody, ChecklistItem, ErrorCodes, FeedbackStatus, HttpMethods, VoidFunctionCallback } from '../types';

interface apiParams {
  apiEndpoint: APIs;
  loader: null | React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess: null | VoidFunctionCallback;
  onError: null | ((actionType: ActionTypes, status: FeedbackStatus, code: ErrorCodes) => void);
  callBack?: null | VoidFunctionCallback; // callback is optional
  payload?: null | AddOrUpdateRequestBody; // payload is optional
}

type callApiInterface = (props: apiParams) => void;

const getActionTypeByEndpoint = (endpoint: APIs) => {
  switch (endpoint) {
    case APIs.ADD:
      return ActionTypes.ADD;
    case APIs.DELETE:
      return ActionTypes.DELETE;
    case APIs.GETALL:
      return ActionTypes.GET;
    case APIs.UPDATE:
      return ActionTypes.EDIT;
  };
}

const getHttpMethodByEndpoint = (endpoint: APIs) => {
  switch (endpoint) {
    case APIs.ADD:
      return HttpMethods.POST;
    case APIs.UPDATE:
      return HttpMethods.PATCH;
    case APIs.DELETE:
      return HttpMethods.PATCH;
    case APIs.GETALL:
      return HttpMethods.GET;
  }
}

export const callAPI: callApiInterface = ({
  apiEndpoint,
  loader,
  onSuccess,
  onError,
  callBack,
  payload,
}) => {
  const actionType = getActionTypeByEndpoint(apiEndpoint);
  ChecklistPresentationService(
    apiEndpoint,
    getHttpMethodByEndpoint(apiEndpoint) as HttpMethods,
    loader,
    (data) => onSuccess && onSuccess(data as ChecklistItem[]),
    (err) => onError && onError(actionType, FeedbackStatus.ERROR, err.code),
    callBack,
    payload,
  );
}