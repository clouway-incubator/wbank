import React from 'react';

export default class StatusbarPage extends React.Component {
  
  render() {
    const { status, auth, resetStatusMessage, resetAuthMessage  } = this.props
    return (
      <div className='div--status-bar'>
        {this.showMessage(status.message, resetStatusMessage)}
        {this.showMessage(auth.message, resetAuthMessage)}
      </div>
    );
  }

  showMessage(msg, resetMsg) {
    if (msg) {
      this.resetMessage(resetMsg);
      return (
        <span className='span--status-bar'>
          {msg}
        </span>
      );
    }
  }

  resetMessage(func) {
    setTimeout(() => {
      func();
    }, 2000);
  }

}