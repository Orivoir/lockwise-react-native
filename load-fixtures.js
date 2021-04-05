import {getAll, createMultiple, remove} from './apis/local/accounts';
const accountsFixtures = require('./fixtures.json');

export default function () {
  return createMultiple(
    accountsFixtures.slice(0,3).map(accountFixture => ({
      login: accountFixture.login,
      platform: accountFixture.platform,
      loginUrl: accountFixture.loginUrl,
      isFavorite: accountFixture.isFavorite,
    }))
  );

}