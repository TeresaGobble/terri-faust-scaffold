import { gql } from "@apollo/client";
import Link from "next/link";
import Header from "../components/header";
import EntryHeader from "../components/entry-header";

export default function Component(props) {
  const { title: siteTitle, description: siteDescription } =
    props.data.generalSettings;
  const menuItems = props.data.primaryMenuItems.nodes;
  const { archiveType, name, posts } = props.data.nodeByUri;

  return (
    <>
      <Header
        siteTitle={siteTitle}
        siteDescription={siteDescription}
        menuItems={menuItems}
      />

      <EntryHeader title={`Archive for ${archiveType}: ${name}`} />

      <h3>Recent Posts</h3>
      <ul>
        {posts.nodes.map((post) => (
          <Link key={post.id} href={post.uri}>
            <li>{post.title}</li>
          </Link>
        ))}
      </ul>
    </>
  );
}

Component.variables = (seedQuery, ctx) => {
  return {
    uri: seedQuery.uri,
  };
};

Component.query = gql`
  ${Header.fragments.entry}
  query GetArchive($uri: String!) {
    nodeByUri(uri: $uri) {
      archiveType: __typename
      ... on Category {
        name
        posts {
          nodes {
            id
            title
            uri
          }
        }
      }
      ... on Tag {
        name
        posts {
          nodes {
            id
            title
            uri
          }
        }
      }
    }
    ...HeaderFragment
  }
`;
