import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import uploadFile from '../actions/index';

class Home extends Component {
  constructor(props) {
    super(props);
    this.select = document.querySelector.bind(document);
    this.state = {
      info: '',
    };
  }

  handleSelect = () => {
    const { load } = this.props;
    const { path } = this.select('.file').files[0];
    load(path);
  };

  getInfo = () => {
    const {
      file: { fileInfo },
    } = this.props;
    this.setState({ info: `This file has a duration of ${fileInfo}` });
  };

  render() {
    return (
      <div>
        <div className="top"></div>
        <div className="content">
          <h1 className="title">Fidio</h1>
          <input
            className="file"
            onChange={this.handleSelect}
            type="file"
            accept="video/*"
          />
          <button id="info" onClick={this.getInfo}>
            Get Info
          </button>
          <h1 id="display">{this.state.info}</h1>
        </div>
        <div className="footer"></div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  file: state.file,
});

const mapDispatchToProps = {
  load: uploadFile,
};

Home.propTypes = {
  load: PropTypes.func.isRequired,
  file: PropTypes.any.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
