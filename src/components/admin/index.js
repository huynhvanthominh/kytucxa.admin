
import LayoutAdmin from "../layouts/admin/layout-admin";
import MaterialRoute from "../routes/material";
import DormitoryRoute from "../routes/dormitory";

const IndexAdmin = () => {
  return (
    <LayoutAdmin>
      <MaterialRoute />
        <DormitoryRoute />
    </LayoutAdmin>
  );
};

export default IndexAdmin;