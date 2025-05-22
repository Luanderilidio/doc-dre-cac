import { v4 as uuidv4 } from "uuid";
// import { useBoolean } from "react-hooks-shareable";
import CardAdminSchools from "../components/GremioAdmin/CardAdminSchools";
import CardAdminInterlocutors from "../components/GremioAdmin/CardAdminInterlocutors";
import CardAdminStudents from "../components/GremioAdmin/CardAdminStudents";
import CardAdminGremios from "../components/GremioAdmin/CardAdminGremio";
uuidv4();

export default function GremioAdmin() {
  // const [isViewAdd, openViewAdd, closeViewAdd, toggleViewAdd] =
  //   useBoolean(false);

  return (
    <div className="w-full grid grid-cols-12 gap-3 border-red-500 px-8 mt-10">
      <div className="col-span-4">
        <CardAdminSchools />
      </div>
      <div className="col-span-4">
        <CardAdminInterlocutors />
      </div>
      <div className="col-span-4">
        <CardAdminStudents />
      </div>
      <div className="col-span-12">
      <CardAdminGremios />
      </div>
    </div>
  );
}
