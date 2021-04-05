import RNFS from 'react-native-fs';

const ROOT_DIR = RNFS.DocumentDirectoryPath;
const FILENAME_STORAGE = "accounts.json";

const getAbsolutePath = filename => (
  ROOT_DIR + "/" + filename
);

const onError = error => {
  console.error(`react-native-fs has crash: ${error.message}`);
  throw new Error('File System is not available.');
};

/**
 * @description set accounts from file storage from `callback`
 * @param {(accounts: Account[]) => Account[]} setter - callback setter `argument 1` is the current `accounts` return value is `new accounts`
 * @returns {Promise<Account[]>} resovle with `new accounts` after finish write file
 */
function setAccounts(setter) {

  return new Promise((resolve, reject) => {
    getAll()
    .then(accounts => {
      const newAccounts = setter(accounts);

      RNFS.writeFile(getAbsolutePath(FILENAME_STORAGE), JSON.stringify(newAccounts), "utf-8")
      .then(() => resolve(newAccounts))
      .catch(reject)
    })
    .catch(reject);
  });
}

/**
 * @description verify file storage already exists else create this \
 * should call prepare before all operation storage
 * @returns {Promise<void>} resovle task after prepare
 */
function prepare() {
  const absPathFile = getAbsolutePath(FILENAME_STORAGE);

  return new Promise((resolve, reject) => {
    RNFS.exists(absPathFile)
    .then(isExists => {
      if(!isExists) {
        RNFS.appendFile(
          absPathFile,
          JSON.stringify([]),
          "utf-8"
        ).then(resolve).catch(reject)
      } else resolve();
    })
    .catch(reject);
  });
}

/**
 * @param {number} accountId - `id` of target account
 * @return {Account|null} - `null` while `account` not exists
 */
export function getById(accountId) {

  return new Promise((resolve,reject) => {

    prepare()
    .then(() => {
      getAll()
      .then(accounts => (
        resolve(
          accounts.find(account => account.id === accountId) || null
        )
      ))
      .catch(reject)
    })
    .catch(reject);
  });
}

/**
 * @param {{[string]: any}} matcher - find `accounts` from `matcher object`
 * @return {Account[]}
 */
export function getWith(matcher) {

  prepare()
  .then(() => {
    getAll()
    .then(accounts => (
      resolve(
        accounts.filter(account => {
          let isMatche = true;

          Object.keys(matcher).forEach(properties => {
            if(matcher[properties] !== account[properties]) {
              isMatche = false;
            }
          });

          return isMatche;
        })
      )
    ))
    .catch(reject)
  })
  .catch(reject);
}

/**
 * @return {Account[]}
 */
export function getAll() {
  const absPathFile = getAbsolutePath(FILENAME_STORAGE)
  return new Promise((resolve,reject) => {
    RNFS.readFile(absPathFile, "utf-8")
    .then(contentString => {
      let accounts = null;
      try {
        accounts = JSON.parse(contentString);
        resolve(accounts);
      } catch(SyntaxError) {
        // invalid data from storage file
        // should use syncronized action for remote accounts
        RNFS.unlink(absPathFile).catch(onError);
        resolve([]);
      }
    })
    .catch(reject);
  });
}

/**
 * @description all `accounts` with attribute `isFavorite` at `true`
 * @return {Account[]}
 */
export function getFavorites() {
  prepare()
  .then(() => {
    getAll()
    .then(accounts => (
      resolve(
        accounts.filter(account => account.isFavorite)
      )
    ))
    .catch(reject)
  })
  .catch(reject);
}

/**
 * @description update not await couple (`lastAccount, `newAccount`) because `id` is **immuable** attribute
 * @param {Account} account - `id account` should be `lastAccount` target and other properties the `new values`
 * @return {Account|null} - `null` while `account` not exists, else `new account` state
 */
export function update(account) {

  return new Promise((resolve, reject) => {
    prepare()
    .then(() => {
      getById(account.id)
      .then(accountToUpdate => {
        if(!accountToUpdate) {
          // account not exists
          resolve(null);
        } else {
          setAccounts(accounts => (
            accounts.map(currentAccount => (
              currentAccount.id === account.id ? account: currentAccount
            ))
          ))
          .then(newAccounts => resolve(newAccounts.find(newAccount => newAccount.id === account.id)))
          .catch(reject);
        }
      }).catch(reject);
    })
    .catch(reject);
  });
}

/**
 * @description **warn:** remove action cant reserve, not copy save or factory remove as `isRemove: true`
 * @param {Account} account - account target remove action
 * @return {Account|null} - `null` while account not exists
 */
export function remove(account) {

  return new Promise((resolve, reject) => {
    prepare()
    .then(() => {
      getById(account.id)
      .then(accountToUpdate => {
        if(!accountToUpdate) {
          // account not exists
          resolve(null);
        } else {
          setAccounts(accounts => (
            accounts.filter(currentAccount => (
              currentAccount.id !== account.id
            ))
          ))
          .then(newAccounts => resolve(newAccounts.find(newAccount => newAccount.id === account.id)))
          .catch(reject);
        }
      }).catch(reject);
    })
    .catch(reject);
  });
}

/**
 * @description **warn:** remove action cant reserve, not copy save or factory remove as `isRemove: true`
 * @param {number} accountId - account id target remove action
 * @return {Account|null} - `null` while account not exists
 */
export function removeById(accountId) {
  return new Promise((resolve, reject) => {
    prepare()
    .then(() => {
      getById(accountId)
      .then(account => {
        if(!account) {
          resolve(null);
        } else {
          remove(account).then(resolve).catch(reject);
        }
      })
    })
    .catch(reject);
  });
}

/**
 * @description append a `new account`
 * @param {{platform: string, login: string, ?urlLogin: string | null, ?isFavorite: boolean | null}} account - user fields data account, `id` and `createAt` is auto append
 * @return {Account | null} - `null` while field.s invalid
 */
export function create(account) {

  return new Promise((resolve,reject) => {
    if(
      typeof account?.platform !== "string" ||
      typeof login?.platform !== "string"
    ) {
      resolve(null);
    } else {
      if(typeof account.urlLogin !== "string") {
        account.urlLogin = null;
      }
      if(typeof account.isFavorite !== "boolean") {
        account.isFavorite = false;
      }

      setAccounts(currentAccounts => ([
        ...currentAccounts,
        account
      ]))
      // @warn can find a another account with same value
      .then(newAccounts => resolve(newAccounts.find(newAccount => (
        // AccountCreate has not id
        newAccount.platform === account.platform &&
        newAccount.login === account.login &&
        newAccount.isFavorite === account.isFavorite &&
        newAccount.urlLogin === account.urlLogin
      ))))
      .catch(reject)
    }
  });
}

/**
 * @description set `boolean` value of attribute `isFavorite`
 * @param {Account} account - account target of set favorite
 * @return {Account|null} - null while account not exists
 */
export function toggleFavorite(account) {
  return new Promise((resolve, reject) => {
    prepare()
    .then(() => {
      toggleFavoriteById(account.id)
      .then(resolve).catch(reject);
    })
    .catch(reject);
  })
}

/**
 * @description set `boolean` value of attribute `isFavorite`
 * @param {number} accountId - account id target of set favorite
 * @return {Account|null}
 */
export function toggleFavoriteById(accountId) {
  return new Promise((resolve, reject) => {
    prepare()
    .then(() => {
      getById(accountId)
      .then(account => {
        if(!account) {
          resolve(null);
        } else {
          setAccounts(currentAccounts => (
            currentAccounts.map(currentAccount => (
              currentAccount.id === acccount.id ? {
                ...currentAccount,
                isFavorite: !currentAccount.isFavorite
              }: currentAccount
            ))
          ))
          .then(newAccounts => resolve(newAccounts.find(newAccount => newAccount.id === account.id)))
          .catch(reject);
        }
      })
    })
    .catch(reject);
  });
}
