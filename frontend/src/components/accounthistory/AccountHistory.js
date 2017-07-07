import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { loadAccountHistory } from '../../modules/history'
import AccountHistoryPage from './AccountHistoryPage'

const mapStateToProps = (state) => {
  return {
    accountHistory: state.history
  }
}

const mapDispatchToProps = {
  loadAccountHistory
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountHistoryPage))

