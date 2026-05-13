import {
  Navigate
} from "react-router-dom";

const AdminRoute = ({
  autorizado,
  children
}) => {

  if (!autorizado) {
    return (
      <Navigate to="/login/admin" />
    );
  }

  return children;
};

export default AdminRoute;