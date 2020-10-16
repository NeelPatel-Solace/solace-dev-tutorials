import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import Sidebar from "../components/sidebar"
import { Container, Col } from "react-bootstrap"
import { Breadcrumb } from "gatsby-plugin-breadcrumb"

const tutorial = ({ data, pageContext }) => {
  const {
    breadcrumb: { crumbs },
  } = pageContext
  const node = data.tutorialBody.edges[0].node
  const tutorials = data.tableOfContent.edges.filter(
    (edge) => edge.node.frontmatter.layout === "tutorials"
  )
  const features = data.tableOfContent.edges.filter(
    (edge) => edge.node.frontmatter.layout === "features"
  )
  return (
    <Layout>
      <section id="breadcrumbs">
        <Container>
          <Breadcrumb
            crumbs={crumbs}
            crumbLabel={node.frontmatter.title}
            crumbSeparator=" > "
          />
        </Container>
      </section>
      <Container className="flex-row">
        <div className="max-w-70 mt4 mb4">
          <h1>{node.frontmatter.title}</h1>
          <h5 id="minutes" className="mb3 pt2">
            {node.timeToRead} Minute Read
          </h5>
          <div dangerouslySetInnerHTML={{ __html: node.html }} />
        </div>
        {/* sidebar */}
        <div className="flex-column">
          <div id="sidebar" className="pl5 mt6 min-w-30">
            {tutorials.length !== 0 && (
              <div className="f4 fw4">MESSAGING PATTERNS</div>
            )}
            <Col className="f5">
              {tutorials.map(({ node }) => (
                <div key={node.id} className="pl0">
                  <a
                    className={
                      pageContext.slug === node.fields.slug
                        ? "c-grey"
                        : "c-grey4 o-90"
                    }
                    href={node.fields.slug}
                  >
                    {node.frontmatter.title}
                  </a>
                </div>
              ))}
            </Col>
            {features.length !== 0 && <div className="mt3">API FEATURES</div>}
            <Col className="f5">
              {features.map(({ node }) => (
                <div key={node.id}>
                  <a
                    className={
                      pageContext.slug === node.fields.slug
                        ? "c-grey6"
                        : "c-grey4 o-70"
                    }
                    href={node.fields.slug}
                  >
                    {node.frontmatter.title}
                  </a>
                </div>
              ))}
            </Col>
            <Sidebar />
          </div>
        </div>
      </Container>
    </Layout>
  )
}

export const query = graphql`
  query myTutorialQuery($slug: String, $slugRoot: String) {
    tutorialBody: allMarkdownRemark(
      filter: { fields: { slug: { eq: $slug } } }
    ) {
      edges {
        node {
          html
          timeToRead
          fields {
            slug
            slugRoot
          }
          frontmatter {
            title
            summary
            layout
            links {
              label
              link
            }
          }
        }
      }
    }
    tableOfContent: allMarkdownRemark(
      filter: {
        fileAbsolutePath: { regex: "/^(?!.*assets).*$/" }
        fields: { slugRoot: { eq: $slugRoot } }
      }
    ) {
      edges {
        node {
          frontmatter {
            title
            layout
          }
          fields {
            slug
            slugRoot
          }
          id
          fileAbsolutePath
        }
      }
    }
  }
`

export default tutorial