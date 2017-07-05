import React from 'react';
import AccountListRow from './AccountListRow';

const AccountList = ({ 
  accounts
}) => (
  <table className='table'>
    <thead>
      <tr>
        <th>Account ID</th>
        <th>Currency</th>
        <th>Balance</th>
        <th>Type</th>
      </tr>
    </thead>
    <tbody>
      {accounts.map(account =>
        <AccountListRow key={account.id} account={account} />
      )}
    </tbody>
  </table>
);

export default AccountList;