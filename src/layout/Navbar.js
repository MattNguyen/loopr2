import React from 'react';
import {connect} from 'dva';
import {FormattedMessage,injectIntl} from 'react-intl';
import {Menu,Select,Popover,Button,Icon,message} from 'antd';
import {Link} from 'dva/router';
import logo from '../assets/images/logo-blue@2x.png'
import copy from 'copy-to-clipboard';

function Navbar(props){

  const account = props.account;

  const localeChange = (value)=>{
    props.dispatch({
      type:'locales/localeChange',
      payload:{
        locale:value
      }
    })
  }
  const showModal = (id,address)=>{
    props.dispatch({
      type:'modals/modalChange',
      payload:{
        id,
        address,
        visible:true
      }
    })
  }

  const quit = ()=>{
    props.dispatch({
      type:'account/deleteAccount',
      payload:{}
    })
  };

  function copyToClipboard() {

    if(account.isUnlocked ){
      copy(account.address) ? message.success('Copy Successfully') :  message.error("Copy Failed")
    }else{
      message.warning('Please unlock you wallet first')
    }
  }

  const accountMenus = (
    <div className="fs18">
      {
        account.isUnlocked &&
        <div>
          <div className="zb-b-b fs14 p10 pl15 pr15">
            <div className="row align-items-center">
              <div className="col">
                <div className="fs16 color-grey-900">Wallet Address</div>
                <div className="fs12 color-grey-500 text-wrap" style={{maxWidth:'180px'}}>{account.address}</div>
              </div>
              <div className="col-auto">
                <Button className="fs12" type="primary" size="small" onClick={copyToClipboard}>Copy</Button>
              </div>
            </div>
          </div>
          <div className="zb-b-b fs14 color-grey-900 p10 pl15 pr15">
            <a onClick={showModal.bind(this,'token/receive',account.address)}>
              <Icon type="qrcode" className="mr5" />QR Code
            </a>
          </div>
          {account.walletType === 'key' &&  <div className="zb-b-b fs14 color-grey-900 p10 pl15 pr15">
            <a onClick={showModal.bind(this,'wallet/export/keystore')}>
              <Icon type="export" className="mr5" />Export Keystore
            </a>
          </div>}
          <div className="zb-b-b fs14 color-grey-900 p10 pl15 pr15">
            <Icon type="question-circle-o" className="mr5" />Help
          </div>
          {false && <div className="zb-b-b fs14 color-grey-900 p10 pl15 pr15">
            Switch Wallet
          </div>}
          <div className="zb-b-b fs14 color-grey-900 p10 pl15 pr15">
            Tools
          </div>
          <div className="zb-b-b fs14 color-grey-900 p10 pl15 pr15">
            <a onClick={quit}><Icon type="poweroff" className="mr5" />Quit
            </a>
          </div>
        </div>
      }
      {!account.isUnlocked &&
        <div>
          <div className="zb-b-b fs14 p10 pl15 pr15">
            <div className="row align-items-center">
              <div className="col-auto">
                <a  onClick={showModal.bind(this,'wallet/unlock')}>Unlock Wallet</a>
              </div>
            </div>
          </div>
          <div className="zb-b-b fs14 color-grey-900 p10 pl15 pr15">
            <a onClick={showModal.bind(this,'wallet/generate')}>Generate Wallet</a>
          </div>
          <div className="zb-b-b fs14 color-grey-900 p10 pl15 pr15">
            <Icon type="question-circle-o" className="mr5" />Help
          </div>
          {false && <div className="zb-b-b fs14 color-grey-900 p10 pl15 pr15">
            Switch Wallet
          </div>}
          <div className="zb-b-b fs14 color-grey-900 p10 pl15 pr15">Tools</div>
        </div>
      }
    </div>
  )

  return (
    <div className="">
      <div className="container">
        <div className="row align-items-stretch justify-content-between ml0">
          <div className="col-auto pl0 pr0">
            <a href="/" className="d-block" >
              <img src={logo} alt="" style={{height:'38px'}} />
            </a>
          </div>
          <div className="col-auto">
            <Menu
              theme="light"
              className="bg-none border-0"
              mode="horizontal"
              style={{ lineHeight: '64px' }}
            >
              <Menu.Item key="home" ><Link to="/home"><FormattedMessage id='navbar.home' /></Link></Menu.Item>
              <Menu.Item key="portfolio" ><Link to="/portfolio"><FormattedMessage id='navbar.portfolio'/></Link></Menu.Item>
              <Menu.Item key="trade">
                <Link to="/trade"><FormattedMessage id='navbar.trade' /></Link>
              </Menu.Item>
              <Menu.Item key="wallet">
                <Link to="/wallet"><FormattedMessage id='navbar.wallet' /></Link>
              </Menu.Item>
            </Menu>
          </div>
          <div className="col-auto">
            <span className="fs14 mr10 color-grey-600 cursor-pointer" onClick={showModal.bind(this,'settings')}><FormattedMessage id='navbar.setting' /></span>
            <Select defaultValue="en" onChange={localeChange} className="navbar-language mr5">
              <Select.Option value="en">English</Select.Option>
              <Select.Option value="zh">中文</Select.Option>
            </Select>
            <Popover content={accountMenus} title={null}>
                <a className="fs14">Account <Icon type="down" className="color-grey-400 fs12" /></a>
            </Popover>
          </div>

        </div>
      </div>

    </div>
  )
}

export default connect(({locales,account})=>({locales,account}))(Navbar)
