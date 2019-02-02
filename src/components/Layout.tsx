import React from 'react';
import { StaticQuery, graphql } from 'gatsby';

import * as styles from './Layout.module.css';

const QUERY = graphql`
    query SiteTitleQuery {
        site {
            siteMetadata {
                title
            }
        }
    }
`;

const Layout: React.FunctionComponent = ({ children }) => (
    <StaticQuery
        query={QUERY}
        render={data => (
            <div className={styles.layout}>
                <header className={styles.header}>
                    <h2 className={styles.centered}>
                        {data.site.siteMetadata.title}
                    </h2>
                </header>
                <div className={styles.body}>
                    <div className={`${styles.bodyInner} ${styles.centered}`}>
                        {children}
                    </div>
                </div>
                <footer className={styles.footer}>
                    <div className={styles.centered}>
                        © {new Date().getFullYear()}, Built with
                        {` `}
                        <a href="https://www.gatsbyjs.org">Gatsby</a>
                    </div>
                </footer>
            </div>
        )}
    />
);

export default Layout;
