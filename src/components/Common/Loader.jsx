// components/Common/Loader.jsx
import { CircularProgress } from '@mui/material';

const Loader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
    <CircularProgress size={60} />
  </div>
);

export default Loader; 
