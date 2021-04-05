import RNFS from 'react-native-fs';

/**
 * @param {number} accountId - `id` of target account
 * @return {Account|null} - `null` while `account` not exists
 */
export function getById(accountId) {}

/**
 * @param {{[string]: any}} matcher - find `accounts` from `matcher object`
 * @return {Account[]}
 */
export function getWith(matcher) {}

/**
 * @return {Account[]}
 */
export function getAll() {}

/**
 * @description all `accounts` with attribute `isFavorite` at `true`
 * @return {Account[]}
 */
export function getFavorites() {}

/**
 * @description update not await couple (`lastAccount, `newAccount`) because `id` is **immuable** attribute
 * @param {Account} account - `id account` should be `lastAccount` target and other properties the `new values`
 * @return {Account|null} - `null` while `account` not exists, else `new account` state
 */
export function update(account) {}

/**
 * @description **warn:** remove action cant reserve, not copy save or factory remove as `isRemove: true`
 * @param {Account} account - account target remove action
 * @return {Account|null} - `null` while account not exists
 */
export function remove(account) {}

/**
 * @description **warn:** remove action cant reserve, not copy save or factory remove as `isRemove: true`
 * @param {number} accountId - account id target remove action
 * @return {Account|null} - `null` while account not exists
 */
export function removeById(accountId) {}

/**
 * @description append a `new account`
 * @param {{platform: string, login: string, ?urlLogin: string | null, ?isFavorite: boolean | null}} account - user fields data account, `id` and `createAt` is auto append
 * @return {Account | null} - `null` while field.s invalid
 */
export function create(account) {}

/**
 * @description set `boolean` value of attribute `isFavorite`
 * @param {Account} account - account target of set favorite
 * @return {Account|null} - null while account not exists
 */
export function toggleFavorite(account) {}

/**
 * @description set `boolean` value of attribute `isFavorite`
 * @param {number} accountId - account id target of set favorite
 * @return {Account|null}
 */
export function toggleFavoriteById(accountId) {}
