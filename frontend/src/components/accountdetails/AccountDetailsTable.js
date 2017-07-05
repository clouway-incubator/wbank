import React from 'react';

const AccountDetailsTable = ({ 
  account, 
  history
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
      <tr>
      <td>{account.AccountID}</td>
      <td>{account.Currency}</td>
      <td>{account.Amount}</td>
      <td>{account.Type}</td>
      </tr>
    </tbody>
  </table>
);

export default AccountDetailsTable;