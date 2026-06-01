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

   return (
    <div style={{ padding: "30px" }}>
      <h1>Student Assessments</h1>

      <p>
        View weekly log assessments, supervisor evaluations, workplace
        assessments, and final results for each student.
      </p>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {data.placements.length === 0 ? (
        <p>No placements found.</p>
      ) : (
        data.placements.map((placement) => {
          const placementLogs = getPlacementLogs(placement.id);
          const placementEvaluations = getPlacementEvaluations(placement.id);
          const finalResult = getPlacementFinalResult(placement.id);

          return (
            <div key={placement.id} style={boxStyle}>
              <h2>
                {placement.student?.registration_number || "-"} -{" "}
                {placement.company?.company_name || "-"}
              </h2>

              <p>
                <strong>Student:</strong>{" "}
                {placement.student?.user?.username || "-"}
              </p>

              <p>
                <strong>Company:</strong>{" "}
                {placement.company?.company_name || "-"}
              </p>

              <p>
                <strong>Placement Status:</strong> {placement.status || "-"}
              </p>

              <p>
                <strong>Internship Period:</strong>{" "}
                {placement.start_date || "-"} to {placement.end_date || "-"}
              </p>

              <p>
                <strong>Total Weekly Logs:</strong> {placementLogs.length}
              </p>

              <p>
                <strong>Total Supervisor Evaluations:</strong>{" "}
                {placementEvaluations.length}
              </p>

              <p>
                <strong>Final Mark:</strong>{" "}
                {finalResult
                  ? displayScore(finalResult.final_mark)
                  : "Not published"}
              </p>

              <h3>Weekly Log Assessments</h3>

              {placementLogs.length === 0 ? (
                <p>No weekly logs submitted yet.</p>
              ) : (
                placementLogs.map((log) => (
                  <div key={log.id} style={innerBoxStyle}>
                    <h4>
                      Week {log.week_number}: {log.title}
                    </h4>

                    <p>
                      <strong>Status:</strong> {log.status}
                    </p>

                    <p>
                      <strong>Submitted At:</strong>{" "}
                      {log.submitted_at
                        ? formatDateTime(log.submitted_at)
                        : "Not submitted yet"}
                    </p>

                    <p>
                      <strong>Academic Supervisor Score:</strong>{" "}
                      {displayScore(log.academic_score)}
                    </p>

                    <p>
                      <strong>Workplace Supervisor Score:</strong>{" "}
                      {displayScore(log.workplace_score)}
                    </p>

                    <p>
                      <strong>Final Weekly Log Mark:</strong>{" "}
                      {displayScore(log.average_score)}
                    </p>

                    <p>
                      <strong>Fully Assessed:</strong>{" "}
                      {log.is_fully_assessed ? "Yes" : "No"}
                    </p>

                    <h4>Feedback Received</h4>

                    {asArray(log.feedback_entries).length === 0 ? (
                      <p>No feedback submitted for this weekly log yet.</p>
                    ) : (
                      asArray(log.feedback_entries).map((feedback) => (
                        <div key={feedback.id} style={feedbackBoxStyle}>
                          <p>
                            <strong>Supervisor:</strong>{" "}
                            {feedback.supervisor?.user?.username || "-"}
                          </p>

                          <p>
                            <strong>Supervisor Type:</strong>{" "}
                            {feedback.supervisor?.supervisor_type || "-"}
                          </p>

                          <p>
                            <strong>Feedback Sent At:</strong>{" "}
                            {feedback.created_at
                              ? formatDateTime(feedback.created_at)
                              : "-"}
                          </p>

                          <p>
                            <strong>Decision:</strong>{" "}
                            {feedback.decision || "-"}
                          </p>

                          <p>
                            <strong>Score:</strong>{" "}
                            {displayScore(feedback.score)}
                          </p>

                          <p>
                            <strong>Comment:</strong>{" "}
                            {feedback.comment || "-"}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                ))
              )}
