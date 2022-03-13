import React from 'react';
import { Link, Redirect } from 'react-router-dom';

const defaultRedirectTo = '/';

class Route404 extends React.Component {
  state = {
    redirect: false,
  };

  componentDidMount() {
    setTimeout(() => this.setState({ redirect: true }), 5000);
  }

  render() {
    const match = this.props.match.path.match(/(.+)\/\*/);
    const redirectTo = !!match ? match[1] : defaultRedirectTo;
    return this.state.redirect === true ? (
      <Redirect to={redirectTo} />
    ) : (
      <div>
        Η σελίδα {this.props.location.pathname} δε βρέθηκε
        <br />
        <br />
        Πατήστε <Link to={redirectTo}>εδώ</Link> για να επιστρέψετε
      </div>
    );
  }
}

export default Route404;
