import React from 'react';
import Spinner from './Spinner';
import styles from './Loader.module.css';

const LoaderRouteComponent = () => (
  <div className={styles.routeContainer}>
    <Spinner />
  </div>
);

export default LoaderRouteComponent;
