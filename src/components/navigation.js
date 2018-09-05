import React from 'react'
import Link from 'gatsby-link'
import Logo from './logo'

import styles from './navigation.module.css'

export default () => (
  <nav className={styles.navigation} role='navigation'>
    <Link className={styles.logo} to='/'>
      <Logo />
    </Link>
    <ul className={styles.navigationItems}>
      <li className={styles.navigationItem}>
        <Link to='/'>Home</Link>
      </li>
      <li className={styles.navigationItem}>
        <Link to='/blog/'>Blog</Link>
      </li>
    </ul>
  </nav>
)
