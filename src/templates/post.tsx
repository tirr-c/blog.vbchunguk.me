import React from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/Layout';
import SEO from '../components/SEO';

interface Props {
    data: {
        markdownRemark: {
            html: string;
            excerpt: string;
            frontmatter: {
                title: string;
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
    return (
        <>
            <SEO title={title} description={description} />
            <Layout bodyClassName="markdown-body">
                <h1>{title}</h1>
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
            excerpt
            frontmatter {
                title
            }
            fields {
                date
                slug
            }
        }
    }
`;

export default Blog;
