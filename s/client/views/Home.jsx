import React, { Component } from 'react';

class Home extends Component {
  constructor(props) {
    super(props);
    this.home = '';
  }

  render() {
    return (
      <div>
        <div className="top" />
        <div className="content">
          <h1 className="title">Fidio</h1>
          <input
            className="file"
            onChange={() => ''}
            type="file"
            accept="video/*"
          />
          <button type="button" id="info" onClick={() => ''}>
            Get Info
          </button>
          <h1 id="display">{() => ''}</h1>
        </div>
        <div className="footer" />
      </div>
    );
  }
}

export default Home;
