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
                twitter
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
            twitter: string;
        };
    };
}

interface Props {
    type: 'listing' | 'article';
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
        const { type, description, lang, meta, keywords, title } = this.props;
        const siteTitle = data.site.siteMetadata.title;
        const rawMetaDescription =
            description || data.site.siteMetadata.description;
        const metaDescription = rawMetaDescription.replace(/\s+/g, ' ');
        const metaTitle = type === 'listing' ? siteTitle : title;
        const finalMeta = [
            {
                name: 'description',
                content: metaDescription,
            },
            {
                property: 'og:title',
                content: metaTitle,
            },
            {
                property: 'og:description',
                content: metaDescription,
            },
            {
                name: 'twitter:card',
                content: 'summary',
            },
            {
                name: 'twitter:site',
                content: data.site.siteMetadata.twitter,
            },
            {
                name: 'twitter:creator',
                content: data.site.siteMetadata.author,
            },
            {
                name: 'twitter:title',
                content: metaTitle,
            },
            {
                name: 'twitter:description',
                content: metaDescription,
            },
        ];
        if (type === 'listing') {
            finalMeta.push({
                property: 'og:type',
                content: 'website',
            });
        } else if (type === 'article') {
            finalMeta.push(
                {
                    property: 'og:site_name',
                    content: data.site.siteMetadata.title,
                },
                {
                    property: 'og:type',
                    content: 'article',
                },
                {
                    property: 'og:article:author',
                    content: data.site.siteMetadata.author,
                },
            );
        }
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
