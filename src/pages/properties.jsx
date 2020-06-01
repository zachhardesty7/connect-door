import React from 'react'
import { graphql } from 'gatsby'

const Properties = ({ data }) => {
  console.log('Properties -> data', data)
  return <div>test</div>
}

export default Properties

export const imageQuery = graphql`
  query {
    contentfulPageProperties(contentful_id: {eq: "5bdotCvkQYqNXaQnhTw6Ys"}) {
      id
      title
      listings {
        description
        file {
          url
        }
      }
    }
    # custom transformed from above result
    allPropertyJson {
      nodes {
        properties {
          name
          addr
          units {
            apartmentAmenities
            communityAmenities
            unit
            beds
            baths
            monthlyRentPerBed
          }
        }
      }
    }
  }
`
