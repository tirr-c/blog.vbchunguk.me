import React from 'react';
import cn from 'classnames';
import { Link, StaticQuery, graphql } from 'gatsby';

import * as styles from './Layout.module.css';

interface Props {
    displayCC?: boolean;
    bodyClassName?: string;
}

const QUERY = graphql`
    query SiteTitleQuery {
        site {
            siteMetadata {
                title
                author
                repository
            }
        }
    }
`;

const Layout: React.FunctionComponent<Props> = ({
    displayCC,
    bodyClassName,
    children,
}) => (
    <StaticQuery
        query={QUERY}
        render={data => (
            <div className={styles.layout}>
                <header className={styles.header}>
                    <h2 className={styles.centered}>
                        <Link to="/" className={styles.title}>
                            {data.site.siteMetadata.title}
                        </Link>
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
                        <a href={data.site.siteMetadata.repository}>Repo</a> |{' '}
                        {displayCC && (
                            <>
                                <a href="https://creativecommons.org/licenses/by-sa/4.0/">
                                    CC-BY-SA-4.0
                                </a>{' '}
                            </>
                        )}
                        © {new Date().getFullYear()}{' '}
                        {data.site.siteMetadata.author}, Built with{' '}
                        <a href="https://www.gatsbyjs.org">Gatsby</a>
                    </div>
                </footer>
            </div>
        )}
    />
);

export default Layout;
