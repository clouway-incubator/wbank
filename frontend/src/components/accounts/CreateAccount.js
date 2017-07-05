import React from 'react';

let inputAmount;

class CreateAccount extends React.Component {
  constructor() {
    super()
    
    this.state = {
      value: 'USD',
      checked: false,
      status: 'emptyNot'
    }

    this.handleCheckButton = this.handleCheckButton.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    return (
      <div>
        <button className="btn btn-default btn-md" 
                onClick={this.handleCheckButton} 
                checked={this.state.checked}>
          Create New Account
        </button>
        {this.toggleDiv()}
      </div>
    );
  }

  toggleDiv() {
    if (this.state.checked) {
      return (
        <div className='div--create-new-account'>
          <form onSubmit={this.handleSubmit}>
            <select className='form--select-currency' 
                    value={this.state.value} 
                    onChange={this.handleChange}
            >
              <option value='USD'>USD</option>
              <option value='EUR'>EUR</option>
              <option value='BGN'>BGN</option>
              <option value='GBP'>GBP</option>
            </select>
            <input className='form--input-amount'
                   type='text' 
                   ref={node => { 
                     inputAmount = node }} 
            />
            <input className='form--submit-button' 
                   type='submit' 
                   value='Submit' />
          </form>
        </div>
      );
    }
  };

  handleChange(event) {
      this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    let promptInput = parseFloat(inputAmount.value);
    const currencyInput = this.state.value;

    this.isNumber(promptInput) && promptInput != null
      ?
      this.props.createAccount({ Currency: currencyInput, Amount: promptInput, Type: 'credit' })
      :
      this.props.showStatusMessage(`Invalid amount. Please, type a valid number to deposit.`)

    this.setState({
      checked: false
    })
  }

  handleCheckButton(event) {
    this.setState({
      checked: !event.target.checked
    })
  }
  
  isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
}

export default CreateAccount;