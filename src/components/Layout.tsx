import React from 'react';
import cn from 'classnames';
import { StaticQuery, graphql } from 'gatsby';

import * as styles from './Layout.module.css';

interface Props {
    bodyClassName?: string;
}

const QUERY = graphql`
    query SiteTitleQuery {
        site {
            siteMetadata {
                title
            }
        }
    }
`;

const Layout: React.FunctionComponent<Props> = ({
    bodyClassName,
    children,
}) => (
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
                    <div
                        className={cn(
                            styles.bodyInner,
                            styles.centered,
                            bodyClassName,
                        )}
                    >
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
