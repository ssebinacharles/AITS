import { useEffect, useState } from "react";

import { getCompanies, createCompany } from "../../api/companiesApi";
import { createPlacement, getPlacements } from "../../api/placementsApi";
import { asArray, formatDateTime } from "../../utils/dashboardHelpers";

function StudentPlacementRequestPage() {
  const [companies, setCompanies] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);

  const [form, setForm] = useState({
    company_name: "",
    location: "",
    contact_email: "",
    contact_phone: "",
    contact_person_name: "",
    org_department: "",
    workplace_supervisor_name: "",
    workplace_supervisor_email: "",
    workplace_supervisor_phone: "",
    workplace_supervisor_title: "",
    workplace_supervisor_department: "",
    start_date: "",
    end_date: "",
    student_notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
