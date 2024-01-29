import { SetStateAction } from 'react';
import axios from 'axios';
import { ChecklistItem, HttpMethods } from '../types';
import { API_CONTEXT } from '../config'; 

type Func = (prop?: any) => void;

export const GetAllChecklistAPI = (
  setLoader?: null | React.Dispatch<React.SetStateAction<boolean>>, 
  onSuccess?: null | Func,
  onError?: null | Func,
  callBack?: null | Func,
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
      }, 700)
    });
}

export default GetAllChecklistAPI;