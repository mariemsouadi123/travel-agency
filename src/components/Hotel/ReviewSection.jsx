import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { 
  Button, 
  TextField, 
  Typography, 
  Grid, 
  Rating,
  CircularProgress
} from '@mui/material';
import { ADD_REVIEW } from '../../graphql/queries';  // ✅ Correct import
import queries from '../../graphql/queries';  // ✅ Correct import

const ReviewSection = ({ hotelId, reviews }) => {
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(3);
  const [addReview, { loading, error }] = useMutation(ADD_REVIEW);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addReview({
      variables: { hotelId, name, comment, rating },
      refetchQueries: ['GetHotelsByPreferences']
    });
    setName('');
    setComment('');
    setRating(3);
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <Typography variant="h6" gutterBottom>
        Reviews ({reviews.length})
      </Typography>

      {reviews.map(review => (
        <div key={review.id} style={{ marginBottom: '1rem' }}>
          <Typography variant="subtitle2">{review.name}</Typography>
          <Rating value={review.rating} readOnly />
          <Typography variant="body2">{review.comment}</Typography>
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <Rating
              value={rating}
              onChange={(e, newValue) => setRating(newValue)}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Comment"
              multiline
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <Button 
              type="submit" 
              variant="contained"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Submit Review'}
            </Button>
          </Grid>
        </Grid>
      </form>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          Error submitting review: {error.message}
        </Typography>
      )}
    </div>
  );
};

export default ReviewSection;
