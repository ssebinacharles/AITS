import { useEffect, useState } from "react";

import { getPlacements } from "../../api/placementsApi";
import { getWeeklyLogs } from "../../api/weeklyLogsApi";
import { getEvaluations } from "../../api/evaluationsApi";
import { getFinalResults } from "../../api/finalResultsApi";

import { asArray, formatDateTime } from "../../utils/dashboardHelpers";

function AdminAssessmentsPage() {
  const [data, setData] = useState({
    placements: [],
    logs: [],
    evaluations: [],
    results: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function loadAssessments() {
    setLoading(true);
    setError("");

    Promise.all([
      getPlacements(),
      getWeeklyLogs(),
      getEvaluations(),
      getFinalResults(),
    ])
      .then(([placements, logs, evaluations, results]) => {
        setData({
          placements: asArray(placements),
          logs: asArray(logs),
          evaluations: asArray(evaluations),
          results: asArray(results),
        });

        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load student assessments.");
        setLoading(false);
      });
  }

  useEffect(() => {
    loadAssessments();
  }, []);

  function displayScore(value) {
    if (value === null || value === undefined || value === "") {
      return "Not available";
    }

    return `${value}%`;
  }

  function getPlacementLogs(placementId) {
    return data.logs.filter((log) => log.placement?.id === placementId);
  }

  function getPlacementEvaluations(placementId) {
    return data.evaluations.filter(
      (evaluation) => evaluation.placement?.id === placementId
    );
  }

  function getPlacementFinalResult(placementId) {
    return data.results.find((result) => result.placement?.id === placementId);
  }

  if (loading) {
    return (
      <div style={{ padding: "30px" }}>
        <h1>Student Assessments</h1>
        <p>Loading assessments...</p>
      </div>
    );
  }
