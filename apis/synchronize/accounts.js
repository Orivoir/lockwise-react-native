import {
  SYNCHRONIZE_BASE_URL,
  SYNCHRONIZE_MAX_ITEMS_FETCH_BY_PAGE
} from './../../constants';

/*
ApiResponse {
  success: boolean,
  statusCode: number,
  statusText: string
}

ApiResponsePing extends ApiResponse {}
ApiResponseCount extends ApiResponse {
  count: number
}
ApiResponseList extends ApiResponse {
  totalPages: number,
  totalItems: number,
  page: number,
  count: number,
  items: Account[]
}
ApiResponseGetById extends ApiResponse {
  ?account: Account[]
}
*/

const getAbsoluteUrl = pathname => {
  if(pathname.charAt(0) === "/") {
    pathname = pathname.slice(1,);
  }

  return SYNCHRONIZE_BASE_URL + pathname;
};

/**
 * @description - `GET "/ping"` check if local synchronize server is available, *should connected on same wifi point*
 * @returns {Promise<boolean>} - check if synchronize server is available
 */
export const isAvailable = () => {
  console.log("start fetch at: ", getAbsoluteUrl('/ping'));
  return new Promise((resolve, reject) => {
    fetch(getAbsoluteUrl('/ping'), {method: "GET"})
    .then(response => response.json())
    .then(data => {
      resolve(!!data.success);
    })
    .catch(error => {
      // can be network error
      console.error(`server synchronize not available with: ${error.message}`);
      resolve(false);
    });
  });
};

/**
 * @description - `GET "/count"` - fetch number `accounts` into storage of local synchronize server *should connected on same wifi point*
 * @returns {Promise<{success: boolean, statusCode: number, statusText: string, ?count: number}>}
 */
export const getCount = () => {
  return new Promise((resolve, reject) => {
    fetch(getAbsoluteUrl('/count', {method: "GET"}))
    .then(response => response.json())
    .then(resolve)
    .catch(reject);
  });
};


// GET "/list?page={number}&limit={number}"
export const getAll = (
  totalAccounts,

  // page=null,
  // originalResolve=null,
  // originalReject=null,
  // outputData=null
) => {

  if(typeof totalAccounts !== "number") {
    throw new RangeError('arg1 number account should be a number, cant fetch');
  }

  const totalPages = Math.ceil(totalAccounts/SYNCHRONIZE_MAX_ITEMS_FETCH_BY_PAGE);

  return new Promise((resolve, reject) => {
    Promise.all(
      Array.from(Array(totalPages).keys()).map(index => (
        getAbsoluteUrl(`/list?page=${(index+1)}&limit=${SYNCHRONIZE_MAX_ITEMS_FETCH_BY_PAGE}`)
      ))
      .map(urlTarget => fetch(urlTarget, {method: "GET"}))
    )
    .then(responses => (
      Promise.all(responses.map(response => response.json())
    )))
    .then(resolve)
    .catch(reject);
  });

};

/**
 * @description - `GET "/single/:id"` - fetch a account by id should be id of local synchronize server, *should connnected on same wifi point*
 * @param {number} accountId
 * @return {Promise<success: boolean, statusCode: number, statusText: string,?account: Account}>}
 */
export const getById = accountId => {
  return new Promise((resolve, reject) => {
    fetch(getAbsoluteUrl(`/single/${accountId}`), {method: "GET"})
    .then(response => response.json())
    .then(resolve)
    .catch(reject)
  });
};
