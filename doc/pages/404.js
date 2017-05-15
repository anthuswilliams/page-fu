const React = require('react');
const { PropTypes } = React;

const NotFound = React.createClass({
  propTypes: {
    goBack: PropTypes.func.isRequired,
  },

  render() {
    return (
      <div className="not-found">
        <div>
          <div
            className="icon icon-earth margin-tb-s"
            style={{ fontSize: '196px' }}
          />

          <p>
            While the Earth <em>is</em> huge, you seem to have
            hit somewhere that just doesn't exist!
          </p>
        </div>

        <div className="margin-tb-m">
          <a onClick={this.props.goBack}>
            Okay, take me somewhere that <em>does</em> exist.
          </a>
        </div>
      </div>
    );
  },

});

module.exports = NotFound;
