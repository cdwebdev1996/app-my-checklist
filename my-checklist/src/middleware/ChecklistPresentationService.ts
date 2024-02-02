import { SetStateAction } from 'react';
import axios from 'axios';
import { APIs, AddOrUpdateRequestBody, ChecklistItem, HttpMethods, VoidFunctionCallback } from '../types';
import { API_CONTEXT } from '../config'; 

const generateURL = (endpoint: APIs) => {
  return `${API_CONTEXT}${endpoint}`;
}

export const ChecklistPresentationService = (
  endpoint: APIs,
  method: HttpMethods,
  setLoader: null | React.Dispatch<React.SetStateAction<boolean>>, 
  onSuccess: null | VoidFunctionCallback,
  onError: null | VoidFunctionCallback,
  callBack?: null | VoidFunctionCallback,
  payload?: null | AddOrUpdateRequestBody,
) => {
    setLoader && setLoader(true);
    axios({
        method: method,
        url: generateURL(endpoint),
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
      setTimeout(() => {
        setLoader && setLoader(false);
      }, 300);
    });
}

export default ChecklistPresentationService;