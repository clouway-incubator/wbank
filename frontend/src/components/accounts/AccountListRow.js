import React from 'react';
import { Link } from 'react-router-dom';

const AccountListRow =({
  account
}) => (
    <tr>
      <td><Link to={'/account/' + account.AccountID}>{account.AccountID}</Link></td>
      <td>{account.Currency}</td>
      <td>{account.Amount}</td>
      <td>{account.Type}</td>
    </tr>
);

export default AccountListRow;