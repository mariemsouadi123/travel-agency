import { gql } from '@apollo/client';

export const GET_DESTINATIONS = gql`
  query GetDestinations {
    destinations {
      id
      name
      country
      description
    }
  }
`;

export const GET_HOTELS_BY_PREFERENCES = gql`
  query GetHotelsByPreferences(
    $destinationName: String!
    $minStars: Int
    $maxPrice: Float
    $amenities: [String]
  ) {
    getHotelsByDestinationAndPreferences(
      destinationName: $destinationName
      minStars: $minStars
      maxPrice: $maxPrice
      amenities: $amenities
    ) {
      id
      name
      city
      price
      stars
      amenities
      reviews {
        id
        name
        comment
        rating
      }
    }
  }
`;

export const ADD_REVIEW = gql`
  mutation AddReview($hotelId: ID!, $name: String!, $comment: String!, $rating: Int!) {
    addReview(hotelId: $hotelId, name: $name, comment: $comment, rating: $rating) {
      id
      name
      comment
      rating
    }
  }
`;
