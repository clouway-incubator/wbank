import React from 'react'
import renderer from 'react-test-renderer'
import { shallow, mount, render } from 'enzyme'
import AccountDetailsPage from './AccountDetailsPage'

describe('AccountDetailsPage', () => {
  let page
  let deleteAccount
  let loadAccountDetails
  let Link
 
  beforeEach(() => {
    deleteAccount = jest.fn()  
    loadAccountDetails = jest.fn()
  })

  it('renders the account details properly', () => {   
    const history = { push: jest.fn() }     
    const tree = renderer.create(
      <AccountDetailsPage 
        match={{params: { id: '123' }}}
        loadAccountDetails={loadAccountDetails}
        loading={false}
        accountDetails={{ AccountID: '123', Currency: 'USD', Amount: 1000, Type: 'Credit' }}
        history={history}
      />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })


  it('renders with props', () => {
    const page = mount(
      <AccountDetailsPage 
        deleteAccount={deleteAccount} match={{params: { id: '123' }}} 
        loadAccountDetails={loadAccountDetails}
        loading={false}
      />
    )
    expect(page).toBeDefined()
  })


  it('renders loading message when account details begin loading', () => {
    const tree = renderer.create(
      <AccountDetailsPage
        deleteAccount={deleteAccount}
        match={{ params: { id: '123' } }}
        loadAccountDetails={loadAccountDetails}
        loading={true}
      />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders bad account details message when account details cannot be loaded', () => {        
    const tree = renderer.create(
      <AccountDetailsPage 
        deleteAccount={deleteAccount}
        match={{params: { id: '123' }}}
        loadAccountDetails={loadAccountDetails}
        loading={false}
        accountDetails={undefined} 
      />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('redirects to accounts page when account is deleted successfully', (done) => {
    const promise = {then: resolve => resolve()}
    const deleteAccount = () => promise

    const history = { push: jest.fn() }
    const page = shallow(
      <AccountDetailsPage
        deleteAccount={deleteAccount}
        match={{ params: { id: '123' } }}
        loadAccountDetails={loadAccountDetails}
        loading={false}
        accountDetails={{ AccountID: '123' }}
        history={history}
      />
    )

    const button = page.find('button').at(2)
    button.simulate('click')
    
    setTimeout(() => {
        try {
            expect(history.push).toBeCalledWith('/accounts')
            done()
        } catch(e) {
            done.fail(e)
        }
    }, 0)    
  })

  it('goes to account transaction page when user clicks on the account history button', () => {
    const history = { push: jest.fn() }
    const page = shallow(
      <AccountDetailsPage
        match={{ params: { id: '123' } }}
        loadAccountDetails={loadAccountDetails}
        loading={false}
        accountDetails={{ AccountID: '123' }}
        history={history}
      />
    )
    const button = page.find('button').at(3)
    button.simulate('click')
    expect(history.push).toBeCalledWith('/transactions/123')
  })

})