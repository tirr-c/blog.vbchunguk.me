import React from 'react';
import Helmet from 'react-helmet';
import { StaticQuery, graphql } from 'gatsby';

const detailsQuery = graphql`
    query DefaultSEOQuery {
        site {
            siteMetadata {
                title
                description
                author
            }
        }
    }
`;

interface DefaultSEOQueryData {
    site: {
        siteMetadata: {
            title: string;
            description: string;
            author: string;
        };
    };
}

interface Props {
    description?: string;
    lang: string;
    meta: any[];
    keywords: string[];
    title: string;
}

export default class SEO extends React.PureComponent<Props> {
    static defaultProps = {
        lang: 'ko',
        meta: [],
        keywords: [],
    };

    private renderInner = (data: DefaultSEOQueryData): React.ReactNode => {
        const { description, lang, meta, keywords, title } = this.props;
        const metaDescription =
            description || data.site.siteMetadata.description;
        const finalMeta = [
            {
                name: 'description',
                content: metaDescription,
            },
            {
                property: 'og:title',
                content: title,
            },
            {
                property: 'og:description',
                content: metaDescription,
            },
            {
                property: 'og:type',
                content: 'website',
            },
            {
                name: 'twitter:card',
                content: 'summary',
            },
            {
                name: 'twitter:creator',
                content: data.site.siteMetadata.author,
            },
            {
                name: 'twitter:title',
                content: title,
            },
            {
                name: 'twitter:description',
                content: metaDescription,
            },
        ];
        if (keywords.length > 0) {
            meta.push({
                name: 'keywords',
                content: keywords.join(', '),
            });
        }
        return (
            <Helmet
                htmlAttributes={{ lang }}
                title={title}
                titleTemplate={`%s | ${data.site.siteMetadata.title}`}
                meta={finalMeta.concat(meta)}
            />
        );
    };

    render() {
        return <StaticQuery query={detailsQuery} render={this.renderInner} />;
    }
}
