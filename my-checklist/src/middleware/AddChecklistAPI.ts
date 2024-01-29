import axios from 'axios';
import { HttpMethods } from '../types';
import { API_CONTEXT } from '../config'; 

type Func = (prop?: any) => void;
interface Obj {
  [key: string]: any
}

export const AddChecklistAPI = (
  setLoader?: null | React.Dispatch<React.SetStateAction<boolean>>, 
  onSuccess?: null | Func,
  onError?: null | Func,
  callBack?: null | Func,
  payload?: null | Obj,
) => {
  axios({
    method: HttpMethods.POST,
    url: `${API_CONTEXT}/add`,
    data: payload
  })
  .then(response => {
    setLoader && setLoader(true)
    onSuccess && onSuccess();
      // callback(response.data);
  })
  .catch(err => onError && onError(err))
  .finally(() => {
    callBack && callBack();
    setTimeout(() => {
      setLoader && setLoader(false);
    }, 700)
  });
};

export default AddChecklistAPI;