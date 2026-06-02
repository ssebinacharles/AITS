import { useEffect, useState } from "react";

import { getSupervisorAssignments } from "../../api/supervisorAssignmentsApi";
import { getWeeklyLogs } from "../../api/weeklyLogsApi";
import { getFeedback } from "../../api/feedbackApi";
import { getEvaluations } from "../../api/evaluationsApi";

import {
  asArray,
  countByStatus,
  formatDateTime,
  getPlacementIdFromItem,
  getStoredUser,
  getUserProfileId,
  isMySupervisorAssignment,
  uniqueById,
} from "../../utils/dashboardHelpers";

function AcademicSupervisorDashboard() {
  const [user] = useState(() => getStoredUser());

  const [dashboard, setDashboard] = useState({
    assignments: [],
    students: [],
    weeklyLogs: [],
    submittedLogs: [],
    feedback: [],
    evaluations: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

    function loadDashboard() {
    setLoading(true);
    setError("");

    Promise.all([
      getSupervisorAssignments(),
      getWeeklyLogs(),
      getFeedback(),
      getEvaluations(),
    ])
      .then(([assignmentsData, logsData, feedbackData, evaluationsData]) => {
        const assignments = asArray(assignmentsData).filter((assignment) =>
          isMySupervisorAssignment(assignment, user, "ACADEMIC")
        );

        const placementIds = assignments
          .map((assignment) => getPlacementIdFromItem(assignment))
          .filter(Boolean);

        const students = uniqueById(
          assignments
            .map((assignment) => assignment.placement?.student)
            .filter(Boolean)
        );

        const weeklyLogs = asArray(logsData).filter((log) =>
          placementIds.includes(getPlacementIdFromItem(log))
        );

        const submittedLogs = weeklyLogs.filter((log) =>
          ["SUBMITTED", "UNDER_REVIEW"].includes(log.status)
        );

        const profileId = getUserProfileId(user);

        const feedback = asArray(feedbackData).filter((entry) => {
          const supervisor = entry.supervisor;

          return (
            supervisor?.id === profileId ||
            supervisor?.user?.id === user?.id ||
            supervisor?.user?.username === user?.username ||
            supervisor?.user?.email === user?.email
          );
        });

        const evaluations = asArray(evaluationsData).filter((evaluation) => {
          const evaluator = evaluation.evaluator;
          const placementId = getPlacementIdFromItem(evaluation);

          return (
            evaluator?.id === profileId ||
            evaluator?.user?.id === user?.id ||
            evaluator?.user?.username === user?.username ||
            evaluator?.user?.email === user?.email ||
            placementIds.includes(placementId)
          );
        });

        setDashboard({
          assignments,
          students,
          weeklyLogs,
          submittedLogs,
          feedback,
          evaluations,
        });

        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load academic supervisor dashboard.");
        setLoading(false);
      });
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  function displayScore(value) {
    if (value === null || value === undefined || value === "") {
      return "Not available";
    }

    return `${value}%`;
  }

  function getFeedbackCount(log) {
    return asArray(log.feedback_entries).length;
  }

  if (loading) {
    return (
      <Page>
        <h1>Academic Supervisor Dashboard</h1>

        <div className="card">
          <p>Loading dashboard...</p>
        </div>
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <h1>Academic Supervisor Dashboard</h1>

        <p className="error">Error: {error}</p>

        <button onClick={loadDashboard}>Try Again</button>
      </Page>
    );
  }

  const logStatusCounts = countByStatus(dashboard.weeklyLogs);

  return (
    <Page>
      <div className="dashboard-header">
        <div>
          <h1>Academic Supervisor Dashboard</h1>

          <p className="muted">
            Monitor assigned students, review weekly logs, give academic
            feedback, and track academic evaluation records.
          </p>
        </div>
      </div>

      <Grid>
        <Card title="Assigned Students" value={dashboard.students.length} />
        <Card title="Assigned Placements" value={dashboard.assignments.length} />
        <Card title="Weekly Logs" value={dashboard.weeklyLogs.length} />
        <Card title="Submitted Logs" value={logStatusCounts.SUBMITTED || 0} />
        <Card title="Approved Logs" value={logStatusCounts.APPROVED || 0} />
        <Card title="Rejected Logs" value={logStatusCounts.REJECTED || 0} />
        <Card title="Feedback Given" value={dashboard.feedback.length} />
        <Card
          title="Academic Evaluations"
          value={dashboard.evaluations.length}
        />
      </Grid>

      <Section title="Assigned Students">
        {dashboard.assignments.length === 0 ? (
          <p>No assigned students found.</p>
        ) : (
          dashboard.assignments.map((assignment) => (
            <ListItem key={assignment.id}>
              <h3>
                {assignment.placement?.student?.registration_number ||
                  "Student"}
              </h3>

              <p>
                <strong>Student:</strong>{" "}
                {assignment.placement?.student?.user?.username || "-"}
              </p>

              <p>
                <strong>Company:</strong>{" "}
                {assignment.placement?.company?.company_name || "-"}
              </p>

              <p>
                <strong>Internship Period:</strong>{" "}
                {assignment.placement?.start_date || "-"} to{" "}
                {assignment.placement?.end_date || "-"}
              </p>

              <p>
                <strong>Assignment Role:</strong>{" "}
                {assignment.assignment_role || "-"}
              </p>

              <p>
                <strong>Assigned At:</strong>{" "}
                {assignment.assigned_at
                  ? formatDateTime(assignment.assigned_at)
                  : "-"}
              </p>

              <p>
                <strong>Placement Status:</strong>{" "}
                <span
                  className={`badge badge-${String(
                    assignment.placement?.status || ""
                  ).toLowerCase()}`}
                >
                  {assignment.placement?.status || "-"}
                </span>
              </p>

              <p>
                <strong>Active Assignment:</strong>{" "}
                {assignment.is_active ? "Yes" : "No"}
              </p>
            </ListItem>
          ))
        )}
      </Section>
