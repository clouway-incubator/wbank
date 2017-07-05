import React from 'react';
import {Link} from 'react-router-dom';
import AccountHistoryTable from './AccountHistoryTable';

export default class AccountDetailsPage extends React.Component {

  componentDidMount() {
    this.props.loadHistory(this.props.match.params.id);
  }

  render() {
    return (
      <div className="jumbotron">
        <h2>Transactions History for {this.props.match.params.id}</h2>
        <AccountHistoryTable operationsHistory={this.props.history} />
        <div className='div--back-button'>
          <Link to={'/account/' + this.props.match.params.id}>
            <button className="btn btn-default btn-md">Back</button>
          </Link>
        </div>
      </div>
    );
  }
}