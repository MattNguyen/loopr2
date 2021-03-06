import React, { Component } from 'react';
import { connect } from 'react-redux';
import SocketProvider from './Provider';


const SocketProviderContainer = (props)=>{
  const { settings } = props
  const host = settings.relay.selected || 'https://relay1.loopring.io'
  const url = `http://10.137.107.92:8087`
  console.log('url',url)
  return (
      <SocketProvider url={url}>
        {props.children}
      </SocketProvider>
  )
}
export default connect(({settings})=>({settings}))(SocketProviderContainer)

