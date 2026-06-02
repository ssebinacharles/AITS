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
