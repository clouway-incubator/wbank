import React from 'react';
import AccountHistoryTableRow from './AccountHistoryTableRow';

const AccountHistoryTable = ({ operationsHistory }) => (
  <table className='table'>
    <thead>
      <tr>
        <th>Account Id</th>
        <th>Transaction Type</th>
        <th>Currency</th>
        <th>Amount</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>
      {operationsHistory.map(historyItem =>
        <AccountHistoryTableRow key={historyItem.transactionId} historyItem={historyItem} />
      )}
    </tbody>
  </table>
);

export default AccountHistoryTable;

