import axios from 'axios';
import { ChecklistItem, HttpMethods } from '../types';
import { API_CONTEXT } from '../config'; 

type VoidFunctionCallback = (prop?: any) => void;

export const AddChecklistAPI = (
  payload: ChecklistItem,
  onSuccess?: null | VoidFunctionCallback,
  onError?: null | VoidFunctionCallback,
  callBack?: null | VoidFunctionCallback,
) => {
  axios({
    method: HttpMethods.POST,
    url: `${API_CONTEXT}/add`,
    data: payload
  })
  .then(response => {
    // add a buffer so to make the feedback appear smooth
    setTimeout(() => {
      onSuccess && onSuccess();
    }, 800);
  })
  .catch(err => {
    // add a buffer so to make the feedback appear smooth
    setTimeout(() => {
      onError && onError()
    }, 800);
  })
  .finally(() => {
    callBack && callBack();
  });
};

export default AddChecklistAPI;