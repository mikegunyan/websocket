import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { Card, Avatar, Input, Typography } from 'antd';

const { Search } = Input;

const client = new W3CWebSocket('ws://localhost:8000');

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      userName: '',
      isLoggedIn: false,
      messages: []
    }
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    client.onopen = () => {
      console.log('Websocket Client Connected');
    };
    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      console.log('got reply! ', dataFromServer);
      if(dataFromServer.type === 'message') {
        this.setState((state) => ({
          messages: [ ...state.messages,
          {
            msg: dataFromServer.msg,
            user: dataFromServer.user
          }]
        }));
      }
    };
  }
  handleClick(value) {
    const { userName } = this.state;
    client.send(JSON.stringify({
      type: "message",
      msg: value,
      user: userName
    }))
  }
  render() {
    const { isLoggedIn, userName, messages } = this.state;
    return (
      <div className="main">
        {isLoggedIn ?
        <div>
          {userName}
          <button onClick={() => this.handleClick("hello")}>Send Message</button>
        {messages.map((msg, index) => <p key={index}>message: {msg.msg}, user: {msg.user}</p>)}
        </div>
        :
        <div style={{ padding: '200px 40px' }}>
          <Search
            placeholder="Enter Username"
            enterButton="Login"
            size="Large"
            onSearch={value => this.setState({ isLoggedIn: true, userName: value })}
          />
        </div>
        }
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));