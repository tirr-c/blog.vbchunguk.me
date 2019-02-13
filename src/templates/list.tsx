import React from 'react';
import { Link, graphql } from 'gatsby';

import Layout from '../components/Layout';
import PostListItem from '../components/PostListItem';
import SEO from '../components/SEO';

import * as styles from './list.module.css';

interface Props {
    data: {
        allMarkdownRemark: {
            edges: {
                node: {
                    excerpt: string;
                    frontmatter: {
                        title: string;
                    };
                    fields: {
                        slug: string;
                        date: string;
                    };
                };
            }[];
        };
    };
    pageContext: {
        limit: number;
        skip: number;
        currentPage: number;
        totalPages: number;
    };
}

const List: React.FunctionComponent<Props> = ({ data, pageContext }) => {
    const { currentPage, totalPages } = pageContext;
    const posts = data.allMarkdownRemark.edges.map(({ node }) => {
        return (
            <PostListItem
                key={node.fields.slug}
                slug={node.fields.slug}
                title={node.frontmatter.title}
                date={node.fields.date}
                excerpt={node.excerpt}
            />
        );
    });
    const nextPosts =
        currentPage > 1 ? (
            <Link to={`/posts/${currentPage - 1}/`}>최근 글</Link>
        ) : (
            <div />
        );
    const prevPosts =
        currentPage !== totalPages ? (
            <Link to={`/posts/${currentPage + 1}/`}>이전 글</Link>
        ) : (
            <div />
        );
    return (
        <>
            <SEO title="Posts" />
            <Layout>
                {posts}
                <div className={styles.navigator}>
                    {nextPosts}
                    {prevPosts}
                </div>
            </Layout>
        </>
    );
};

export default List;

export const query = graphql`
    query ListQuery($limit: Int!, $skip: Int!) {
        allMarkdownRemark(
            limit: $limit
            skip: $skip
            sort: { fields: fields___date, order: DESC }
        ) {
            edges {
                node {
                    excerpt(truncate: true)
                    frontmatter {
                        title
                    }
                    fields {
                        slug
                        date
                    }
                }
            }
        }
    }
`;
