import { SetStateAction } from 'react';
import axios from 'axios';
import { APIs, AddOrUpdateRequestBody, ChecklistItem, HttpMethods, VoidFunctionCallback } from '../types';
import { API_CONTEXT } from '../config'; 

const handleURL = (endpoint: APIs) => {
  return `${API_CONTEXT}${endpoint}`;
}

export const ChecklistPresentationService = (
  endpoint: APIs,
  method: HttpMethods,
  setLoader: null | React.Dispatch<React.SetStateAction<boolean>>, 
  onSuccess: null | ((data?: SetStateAction<ChecklistItem[]>) => void),
  onError: null | VoidFunctionCallback,
  callBack?: null | VoidFunctionCallback,
  payload?: null | AddOrUpdateRequestBody,
) => {
    setLoader && setLoader(true);
    axios({
        method: method,
        url: handleURL(endpoint),
        data: payload,
    })
    .then(response => {
      onSuccess && onSuccess(response.data as SetStateAction<ChecklistItem[]>);
    })
    .catch(err => {
      onError && onError(err);
    })
    .finally(() => {
      callBack && callBack();
      setLoader && setLoader(false);
    });
}

export default ChecklistPresentationService;