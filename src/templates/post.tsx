import React from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/Layout';
import SEO from '../components/SEO';

import * as styles from './post.module.css';

interface Props {
    data: {
        markdownRemark: {
            html: string;
            excerpt: string;
            frontmatter: {
                title: string;
                keywords: string[] | null;
            };
            fields: {
                date: string;
                slug: string;
            };
        };
    };
}

const Blog: React.FunctionComponent<Props> = props => {
    const title =
        props.data.markdownRemark.frontmatter.title ||
        props.data.markdownRemark.fields.slug;
    const description = props.data.markdownRemark.excerpt;
    const keywords =
        props.data.markdownRemark.frontmatter.keywords || undefined;
    return (
        <>
            <SEO title={title} description={description} keywords={keywords} />
            <Layout displayCC bodyClassName="markdown-body">
                <h1>{title}</h1>
                <div className={styles.date}>
                    {props.data.markdownRemark.fields.date}
                </div>
                <div
                    dangerouslySetInnerHTML={{
                        __html: props.data.markdownRemark.html,
                    }}
                />
            </Layout>
        </>
    );
};

export const query = graphql`
    query PostQuery($slug: String!) {
        markdownRemark(fields: { slug: { eq: $slug } }) {
            html
            excerpt(truncate: true)
            frontmatter {
                title
                keywords
            }
            fields {
                date
                slug
            }
        }
    }
`;

export default Blog;
