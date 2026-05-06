
import { getAssignments ,createAssignment,
  updateAssignment,
  deleteAssignment,} from "../api/auth/assignmentCreate.api";

export const getAssignmentsService = async () => getAssignments();
export const createAssignmentService = async (data) => createAssignment(data);
export const updateAssignmentService = async (id, data) => updateAssignment(id, data);
export const deleteAssignmentService = async (id) => deleteAssignment(id);