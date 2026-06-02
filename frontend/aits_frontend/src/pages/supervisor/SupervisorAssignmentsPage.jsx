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
 function loadData() {
    setLoading(true);
    setError("");

    Promise.all([
      getPlacements(),
      getSupervisorAssignments(),
      getSupervisors(),
    ])
      .then(([placementData, assignmentData, supervisorData]) => {
        setPlacements(asArray(placementData));
        setAssignments(asArray(assignmentData));
        setSupervisors(asArray(supervisorData));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load supervisor assignments.");
        setLoading(false);
      });
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleFormChange(placementId, field, value) {
    setForms((previous) => ({
      ...previous,
      [placementId]: {
        ...(previous[placementId] || {}),
        [field]: value,
      },
    }));
  }

  function getUserDisplayName(user) {
    if (!user) return "-";

    const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim();

    return fullName || user.username || "-";
  }

  function getSupervisorDisplayName(supervisor) {
    if (!supervisor) return "Not assigned";

    return (
      supervisor.full_name ||
      supervisor.username ||
      getUserDisplayName(supervisor.user) ||
      "Supervisor"
    );
  }

  function getAcademicSupervisors() {
    return supervisors.filter(
      (supervisor) => supervisor.supervisor_type === "ACADEMIC"
    );
  }

  function getWorkplaceSupervisors() {
    return supervisors.filter(
      (supervisor) => supervisor.supervisor_type === "WORKPLACE"
    );
  }

  function getPlacementAssignments(placementId) {
    return assignments.filter(
      (assignment) => assignment.placement?.id === placementId
    );
  }

  function getActiveAssignmentForRole(placementId, role) {
    return assignments.find(
      (assignment) =>
        assignment.placement?.id === placementId &&
        assignment.assignment_role === role &&
        assignment.is_active
    );
  }

  async function approvePlacement(placement) {
    setMessage("");
    setError("");

    try {
      await patchPlacement(placement.id, {
        status: "APPROVED",
      });

      setMessage("Placement approved successfully.");
      loadData();
    } catch (err) {
      setError(err.message || "Failed to approve placement.");
    }
  }

  async function assignBothSupervisors(placement) {
    setMessage("");
    setError("");

    const form = forms[placement.id] || {};
    const academicSupervisorId = form.academic_supervisor_id;
    const workplaceSupervisorId = form.workplace_supervisor_id;

    const existingAcademic = getActiveAssignmentForRole(
      placement.id,
      "ACADEMIC"
    );

    const existingWorkplace = getActiveAssignmentForRole(
      placement.id,
      "WORKPLACE"
    );
