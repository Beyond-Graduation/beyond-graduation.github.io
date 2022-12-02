import React from "react";
import { isAuth } from "../../../auth/Auth";
import { useStateValue } from "../../../reducer/StateProvider";
import UpdateAlumniProfile from "./UpdateAlumniProfile";
import UpdateStudentProfile from "./UpdateStudentProfile";

function UpdateProfile() {
  const [{ userData, userId }, dispatch] = useStateValue();
  return isAuth.userType === "student" ? (
    <UpdateStudentProfile data={userData} />
  ) : (
    <UpdateAlumniProfile data={userData} />
  );
}

export default UpdateProfile;
