import React from 'react';
import { StaticQuery, graphql } from 'gatsby';

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
            <>
                <h2>{data.site.siteMetadata.title}</h2>
                <hr />
                <div
                    style={{
                        margin: `0 auto`,
                        maxWidth: 960,
                        padding: `0px 1.0875rem 1.45rem`,
                        paddingTop: 0,
                    }}
                >
                    {children}
                    <footer>
                        © {new Date().getFullYear()}, Built with
                        {` `}
                        <a href="https://www.gatsbyjs.org">Gatsby</a>
                    </footer>
                </div>
            </>
        )}
    />
);

export default Layout;
