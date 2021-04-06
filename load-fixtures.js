import {createMultiple} from './apis/local/accounts';
const accountsFixtures = require('./fixtures.json');

export default function () {
  return createMultiple(
    accountsFixtures.map(accountFixture => ({
      login: accountFixture.login,
      platform: accountFixture.platform,
      loginUrl: accountFixture.loginUrl,
      password: accountFixture.password,
      isFavorite: accountFixture.isFavorite,
    })),
  );
}
