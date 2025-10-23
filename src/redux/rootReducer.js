import { combineReducers } from 'redux';
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/users/userSlice';
import adjustPlanReducer from "../features/adjustPlan/adjustPlanSlice";

// SocietyCare reducers
import societyAuthReducer from '../features/societyCare/auth/authSlice';
import paymentReducer from '../features/societyCare/payments/paymentSlice';
import complaintReducer from '../features/societyCare/complaints/complaintSlice';
import noticeReducer from '../features/societyCare/notices/noticeSlice';
import residentReducer from '../features/societyCare/residents/residentSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  users: userReducer,
  adjustPlan: adjustPlanReducer,
  
  // SocietyCare reducers
  societyAuth: societyAuthReducer,
  payments: paymentReducer,
  complaints: complaintReducer,
  notices: noticeReducer,
  residents: residentReducer,
});

export default rootReducer;