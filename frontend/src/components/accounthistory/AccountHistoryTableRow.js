import React from 'react'
import moment from 'moment'

const AccountHistoryTableRow = ({ historyItem, index }) => (
  <tr key={index}>
    <td>{historyItem.AccountID}</td>
    <td>{historyItem.TransactionType}</td>
    <td>{historyItem.Currency}</td>
    <td>{historyItem.Amount}</td>
    <td>{moment(historyItem.Date).toDate().toString().split('GMT')[0]}</td>
  </tr>
)

export default AccountHistoryTableRow