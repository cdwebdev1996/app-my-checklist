import { SetStateAction } from 'react';
import axios from 'axios';
import { ChecklistItem, HttpMethods, VoidFunctionCallback } from '../types';
import { API_CONTEXT } from '../config'; 



export const GetAllChecklistAPI = (
  setLoader?: null | React.Dispatch<React.SetStateAction<boolean>>, 
  onSuccess?: null | ((prop: SetStateAction<ChecklistItem[]>) => void),
  onError?: null | VoidFunctionCallback,
  callBack?: null | VoidFunctionCallback,
) => {
    axios({
        method: HttpMethods.GET,
        url: `${API_CONTEXT}/getAll`,
    })
    .then(response => {
      setLoader && setLoader(true);
      onSuccess && onSuccess(response.data as SetStateAction<ChecklistItem[]>);
    })
    .catch(err => {
      onError && onError(err);
    })
    .finally(() => {
      callBack && callBack();
      // provides a buffer before the loading state ends
      setTimeout(() => {
        setLoader && setLoader(false);
      }, 700);
    });
}

export default GetAllChecklistAPI;