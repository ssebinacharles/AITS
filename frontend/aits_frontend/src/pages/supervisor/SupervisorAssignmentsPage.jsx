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
   if (!existingAcademic && !academicSupervisorId) {
      setError("Please select an academic supervisor.");
      return;
    }

    if (!existingWorkplace && !workplaceSupervisorId) {
      setError("Please select a workplace supervisor.");
      return;
    }

    if (existingAcademic && existingWorkplace && placement.status !== "PENDING") {
      setError("Both supervisors are already assigned to this placement.");
      return;
    }

    try {
      if (placement.status === "PENDING") {
        await patchPlacement(placement.id, {
          status: "APPROVED",
        });
      }

      if (!existingAcademic) {
        await createSupervisorAssignment({
          placement_id: placement.id,
          supervisor_id: Number(academicSupervisorId),
          assignment_role: "ACADEMIC",
          is_active: true,
        });
      }

      if (!existingWorkplace) {
        await createSupervisorAssignment({
          placement_id: placement.id,
          supervisor_id: Number(workplaceSupervisorId),
          assignment_role: "WORKPLACE",
          is_active: true,
        });
      }

      setMessage("Placement approved and supervisors assigned successfully.");
      loadData();
    } catch (err) {
      setError(err.message || "Failed to assign supervisors.");
    }
  }

  if (loading) {
    return (
      <div style={{ padding: "30px" }}>
        <h1>Supervisor Assignments</h1>
        <p>Loading supervisor assignments...</p>
      </div>
    );
  }
 const academicSupervisors = getAcademicSupervisors();
  const workplaceSupervisors = getWorkplaceSupervisors();

  return (
    <div style={{ padding: "30px" }}>
      <h1>Supervisor Assignments</h1>

      <p>
        This page displays academic supervisor and workplace supervisor
        assignments for internship placements.
      </p>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {isAdmin && (
        <section style={sectionStyle}>
          <h2>Approve Placements & Assign Supervisors</h2>

          {placements.length === 0 ? (
            <p>No placements found.</p>
          ) : (
            placements.map((placement) => {
              const existingAcademic = getActiveAssignmentForRole(
                placement.id,
                "ACADEMIC"
              );

              const existingWorkplace = getActiveAssignmentForRole(
                placement.id,
                "WORKPLACE"
              );

              const placementAssignments = getPlacementAssignments(placement.id);
