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
