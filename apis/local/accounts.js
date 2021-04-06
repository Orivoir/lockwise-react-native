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
 * @warn not support `async` writing: \
 *  thread 1: setAccount(currentsAccounts) => newAccount \
 *                        ^^^^^^^^^^^^^
 *  thread 2: setAccount(currentsAccounts) => newAccounts \
 *                       ^^^^^^^^^^^^^^
 *  threads receveid same `currentsAccounts` because file system have not re writing between two call value last thread erease all previous thread \
 *  cant use writing multiple with: `Promise.all`
 * @param {(accounts: Account[]) => Account[]} setter - callback setter `argument 1` is the current `accounts` return value is `new accounts`
 * @returns {Promise<Account[]>} resovle with `new accounts` after finish write file
 */
function setAccounts(setter) {
  return new Promise((resolve, reject) => {
    getAll()
    .then(accounts => {
      const newAccounts = setter(accounts);
      RNFS.writeFile(getAbsolutePath(FILENAME_STORAGE), JSON.stringify(newAccounts))
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
          JSON.stringify([])
        ).then(resolve).catch(reject)
      } else resolve();
    })
    .catch(reject);
  });
}

export function clear() {
  return new Promise((resolve, reject) => {

    RNFS.exists(getAbsolutePath(FILENAME_STORAGE))
    .then(isExists => {

      if(isExists) {
        RNFS.unlink(getAbsolutePath(FILENAME_STORAGE)).then(resolve).catch(reject)
      } else {
        resolve();
      }
    })
    .catch(reject)
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
      .then(accounts => {
        const accountFind = accounts.find(account => account.id == accountId) || null;
        resolve(accountFind);
      })
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
    prepare()
    .then(() => {
      RNFS.readFile(absPathFile)
      .then(contentString => {
        let accounts = null;
        try {
          accounts = JSON.parse(contentString);
          resolve(accounts);
        } catch(SyntaxError) {
          console.error(`invalid data from storage file, storage has been reset`);
          // invalid data from storage file
          // should use syncronized action for remote accounts
          RNFS.unlink(absPathFile).catch(onError);
          resolve([]);
        }
      })
      .catch(reject);
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
 * @return {Promise<Account|null>} - `null` while account not exists
 */
export function remove(account) {

  return new Promise((resolve, reject) => {
    prepare()
    .then(() => {
      getById(account.id)
      .then(accountToRemove => {
        if(!accountToRemove) {
          // account not exists
          resolve(null);
        } else {
          setAccounts(currentAccounts => (
            currentAccounts.filter(currentAccount => (
              currentAccount.id !== accountToRemove.id
            ))
          ))
          .then(() => resolve(accountToRemove))
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
 * @return {Promise<Account|null>} - `null` while account not exists
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
 *
 * @param {{platform: string, login: string, ?urlLogin: string | null, ?isFavorite: boolean | null}[]} accounts - accounts to appends
 * @param {(Account[]) => void} originalResolve - you should give always `null` this params is use for remote original `resolve` function during recursive call into body function
 * @param {Account[]} outputsAccounts - you should give always `null` this params is use for persist `accounts` create during recursive call into body function
 * @returns {Promise<Account[]>} - accounts created
 */
export function createMultiple(accounts, originalResolve=null, outputsAccounts=[]) {

  const accountPush = accounts[0];
  if(!accountPush) {
    if(originalResolve instanceof Function) {
      return originalResolve(outputsAccounts);
    } else {
      // has call with: accounts.length === 0
      return Promise.resolve([]);
    }
  } else {
    return new Promise((resolve, reject) => {
      create(accountPush)
      .then(accountCreated => {
        outputsAccounts.push(accountCreated);
        const newAccounts = accounts.slice(1,);

        if(newAccounts.length >= accounts.length) {
          throw new Error('createMultiple steps is broke');
        }

        createMultiple(newAccounts, (originalResolve || resolve), outputsAccounts);
      })
      .catch(error => reject({error: error, accountsCreated: outputsAccounts}));
    });
  }

}

/**
 * @description append a `new account`
 * * @warn not support `async` writing: \
 *  thread 1: setAccount(currentsAccounts) => newAccount \
 *                        ^^^^^^^^^^^^^
 *  thread 2: setAccount(currentsAccounts) => newAccounts \
 *                       ^^^^^^^^^^^^^^
 *  threads receveid same `currentsAccounts` because file system have not re writing between two call value last thread erease all previous thread \
 *  cant use writing multiple with: `Promise.all` \
 *  for multiple add use `createMultiple(accounts: {platform: string, login: string, ?urlLogin: string | null, ?isFavorite: boolean | null}[]): Promise<Account[]>`
 * @param {{platform: string, login: string, ?urlLogin: string | null, ?isFavorite: boolean | null}} account - user fields data account, `id` and `createAt` is auto append
 * @return {Promise<Account | null>} - `null` while field.s invalid
 */
export function create(account) {

  return new Promise((resolve,reject) => {
    if(
      typeof account?.platform !== "string" ||
      typeof account?.login !== "string"
    ) {
      resolve(null);
    } else {
      if(typeof account.urlLogin !== "string") {
        account.urlLogin = null;
      }
      if(typeof account.isFavorite !== "boolean") {
        account.isFavorite = false;
      }

      setAccounts(currentAccounts => {
        account.id = currentAccounts.length;
        account.createAt = Date.now();
        return [
          ...currentAccounts,
          account
        ]
      })
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
 * @return {Promise<Account|null>} - `null` while account not exists
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
 * @return {Promise<Account|null>} - `null` while account not exists
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
              currentAccount.id === account.id ? {
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
