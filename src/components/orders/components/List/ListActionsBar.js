import React from 'react';
import {connect} from 'dva'
import ListFiltersForm from './ListFiltersForm'
import {Button, Modal} from 'antd'
import {cancelOrdersByTokenPairs, cancelAllOrders} from 'Loopring/relay/order';
import {toHex} from 'Loopring/common/formatter'

function ListActionsBar(props) {

  const {actions = {}, LIST = {}, className, privateKey, gasPrice, contractAddress} = props;
  const {filters = {}} = LIST
  const tokenPair = filters.pair;
  const cancelAll = () => {
    Modal.confirm({
      title: 'Do you Want to cancel all orders?',
      content: 'Some descriptions',
      onOk: () => {
        const seconds = toHex(Math.ceil(new Date().getTime() / 1e3));
        const params = {
          privateKey,
          gasPrice: toHex(gasPrice * 1e9),
          timestamp: seconds,
          protocolAddress: contractAddress
        };
        tokenPair ? cancelOrdersByTokenPairs({...params, tokenPairs: [tokenPair]}) : cancelAllOrders({...params});
      },
      onCancel: () => {
      },
      okText: 'Yes',
      cancelText: 'No',
    })
  }
  return (
    <div className={className}>
      <div className="row ml0 mr0 align-items-center">
        <div className="col-auto">
          <ListFiltersForm actions={actions} LIST={LIST}/>
        </div>
        <div className="col">

        </div>
        <div className="col-auto">
          <Button type="primary" onClick={cancelAll}>Cancel All</Button>
        </div>
      </div>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    privateKey: state.account.privateKey,
    gasPrice: state.settings.trading.gasPrice,
    contractAddress: state.settings.trading.contract.address
  };
}

export default connect(mapStateToProps)(ListActionsBar)
