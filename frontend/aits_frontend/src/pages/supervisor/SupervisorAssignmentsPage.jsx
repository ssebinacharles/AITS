import { useEffect, useState } from "react";

import { getPlacements, patchPlacement } from "../../api/placementsApi";
import {
  getSupervisorAssignments,
  createSupervisorAssignment,
} from "../../api/supervisorAssignmentsApi";
import { getSupervisors } from "../../api/usersApi";

import {
  asArray,
  formatDateTime,
  getStoredUser,
} from "../../utils/dashboardHelpers";

function SupervisorAssignmentsPage() {
  const [placements, setPlacements] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [forms, setForms] = useState({});

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loggedInUser = getStoredUser();

  const isAdmin =
    loggedInUser?.role === "ADMINISTRATOR" ||
    loggedInUser?.is_staff ||
    loggedInUser?.is_superuser;
