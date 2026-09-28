import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import {
  Wrench,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Loader2,
  Activity,
  ArrowRight,
  CheckCircle2,
  Gauge,
  ClipboardList,
  SearchCheck,
  UserRoundCheck,
  History,
  Trash2,
} from "lucide-react";

function App() {
  const [equipment, setEquipment] = useState("");
  const [fault, setFault] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeDemo, setActiveDemo] = useState(null);

  const [checkFinding, setCheckFinding] = useState(null);
  const [decisionMessage, setDecisionMessage] = useState("");

  const [activeDiagnosticStep, setActiveDiagnosticStep] = useState(null);
  const [completedDiagnosticSteps, setCompletedDiagnosticSteps] = useState([]);
  const [diagnosticFindings, setDiagnosticFindings] = useState({});
  const [diagnosticOutcome, setDiagnosticOutcome] = useState(null);
  const [correctiveAction, setCorrectiveAction] = useState("");



  const [incidentHistory, setIncidentHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("fieldops_incidents")) || [];
    } catch {
      return [];
    }
  });

  const [selectedIncident, setSelectedIncident] = useState(null);
  const [activeIncidentId, setActiveIncidentId] = useState(null);
    useEffect(() => {
      if (!selectedIncident) {
        setDiagnosticFindings({});
        setCompletedDiagnosticSteps([]);
        setDiagnosticOutcome(null);
        setCorrectiveAction("");
        return;
      }

      const savedFindings = selectedIncident.diagnostic_findings || {};

      setDiagnosticFindings(savedFindings);

      setCompletedDiagnosticSteps(
        Object.keys(savedFindings)
          .map(Number)
          .filter((index) => savedFindings[index])
      );

      setDiagnosticOutcome(selectedIncident.diagnostic_outcome || null);
      setCorrectiveAction(selectedIncident.corrective_action || "");
    }, [selectedIncident]);

  const dashboardStats = {
    total: incidentHistory.length,

    highSeverity: incidentHistory.filter(
      (incident) => incident.severity === "High"
    ).length,

    maintenance: incidentHistory.filter(
      (incident) => incident.diagnostic_outcome === "maintenance"
    ).length,

    escalated: incidentHistory.filter(
      (incident) => incident.diagnostic_outcome === "escalated"
    ).length,

    resolved: incidentHistory.filter(
      (incident) => incident.diagnostic_outcome === "resolved"
    ).length,
  };

  const demoScenarios = [
    {
      name: "Motor — Won't Start",
      equipment: "Motor",
      fault: "Motor will not start",
      symptoms: "Motor does not start when the start command is given.",
    },
    {
      name: "Motor — Overheating",
      equipment: "Motor",
      fault: "Motor overheating",
      symptoms:
        "Motor temperature is rising above normal operating condition.",
    },
    {
      name: "Compressor — High Pressure",
      equipment: "Compressor",
      fault: "Compressor high pressure trip",
      symptoms: "High discharge pressure followed by compressor trip.",
    },
    {
      name: "Circuit Breaker — Repeated Trips",
      equipment: "Circuit Breaker",
      fault: "Circuit breaker repeatedly trips",
      symptoms: "Breaker trips again after being reset.",
    },
    {
      name: "Transformer — Overheating",
      equipment: "Transformer",
      fault: "Transformer overheating",
      symptoms: "Transformer temperature is higher than normal.",
    },
  ];

  function startVoiceInput(field) {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-NG";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(field);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();

      if (field === "equipment") {
        setEquipment(transcript);
      }

      if (field === "fault") {
        setFault(transcript);
      }

      if (field === "symptoms") {
        setSymptoms(transcript);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }

  async function analyzeFault() {
    if (!equipment || !fault) {
      alert("Please enter the equipment and fault description.");
      return;
    }

    setLoading(true);
    setResult(null);
    setCheckFinding(null);
    setDecisionMessage("");
    setActiveDiagnosticStep(null);
    setCompletedDiagnosticSteps([]);
    setDiagnosticOutcome(null);



    try {
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          equipment,
          fault,
          symptoms,
        }),
      });

      if (!response.ok) {
        throw new Error("Backend request failed.");
      }

      const data = await response.json();
      setResult(data);

      const incident = {
      id: Date.now(),
      equipment,
      fault,
      symptoms,

      assessment: data.assessment,
      severity: data.severity,
      confidence: data.confidence,

      likely_causes: data.likely_causes || [],
      safety_checks: data.safety_checks || [],
      diagnostic_steps: data.diagnostic_steps || [],
      tools: data.tools || [],
      stop_conditions: data.stop_conditions || [],
      escalation: data.escalation,

      next_best_check: data.next_best_check,
      next_check: data.next_check,

      diagnostic_findings: {},
      check_finding: null,
      decision_message: "",
      corrective_action: "",
      diagnostic_outcome: null,

      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
    };

    setActiveIncidentId(incident.id);

      setIncidentHistory((current) => {
        const updated = [incident, ...current].slice(0, 10);
        localStorage.setItem(
          "fieldops_incidents",
          JSON.stringify(updated)
        );
        return updated;
      });
    } catch (error) {
      setResult({
        error:
          "Could not connect to FieldOps AI. Make sure the backend server is running.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function runDemoScenario(scenario) {
    setActiveDemo(scenario.name);
    setEquipment(scenario.equipment);
    setFault(scenario.fault);
    setSymptoms(scenario.symptoms);

    setResult(null);
    setCheckFinding(null);
    setDecisionMessage("");
    setLoading(true);
    setActiveDiagnosticStep(null);
    setCompletedDiagnosticSteps([]);
    setDiagnosticFindings({});
    setDiagnosticOutcome(null);

    try {
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          equipment: scenario.equipment,
          fault: scenario.fault,
          symptoms: scenario.symptoms,
        }),
      });

      if (!response.ok) {
        throw new Error("Backend request failed.");
      }

      const data = await response.json();
      setResult(data);

      const incident = {
      id: Date.now(),
      equipment: scenario.equipment,
      fault: scenario.fault,
      symptoms: scenario.symptoms,

      assessment: data.assessment,
      severity: data.severity,
      confidence: data.confidence,

      likely_causes: data.likely_causes || [],
      safety_checks: data.safety_checks || [],
      diagnostic_steps: data.diagnostic_steps || [],
      tools: data.tools || [],
      stop_conditions: data.stop_conditions || [],
      escalation: data.escalation,

      next_best_check: data.next_best_check,
      next_check: data.next_check,

      diagnostic_findings: {},
      check_finding: null,
      decision_message: "",
      corrective_action: "",
      diagnostic_outcome: null,

      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
    };

    setActiveIncidentId(incident.id);

      setIncidentHistory((current) => {
        const updated = [incident, ...current].slice(0, 10);

        localStorage.setItem(
          "fieldops_incidents",
          JSON.stringify(updated)
        );

        return updated;
      });

      setTimeout(() => {
        document.getElementById("diagnostic-results")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (error) {
      setResult({
        error:
          "Could not connect to FieldOps AI. Make sure the backend server is running.",
      });
    } finally {
      setLoading(false);
      setActiveDemo(null);
    }
  }

  function startDiagnosticStep(index) {
    setActiveDiagnosticStep(index);
  }

  function completeDiagnosticStep(index) {
    const finding = diagnosticFindings[index];

    if (!finding) {
      return;
    }

    if (finding === "not_tested") {
      return;
    }

    setCompletedDiagnosticSteps((current) => {
      if (current.includes(index)) {
        return current;
      }

      return [...current, index];
    });

    setIncidentHistory((incidents) => {
      if (!activeIncidentId) {
        return incidents;
      }

      const updatedIncidents = incidents.map((incident) => {
        if (incident.id !== activeIncidentId) {
          return incident;
        }

        return {
          ...incident,
          diagnostic_findings: {
            ...(incident.diagnostic_findings || {}),
            [index]: finding,
          },
          updatedAt: new Date().toLocaleString(),
        };
      });

      localStorage.setItem(
        "fieldops_incidents",
        JSON.stringify(updatedIncidents)
      );

      const updatedActiveIncident = updatedIncidents.find(
        (incident) => incident.id === activeIncidentId
      );

      if (updatedActiveIncident) {
        setSelectedIncident(updatedActiveIncident);
      }

      return updatedIncidents;
    });

    if (finding === "abnormal") {
      setTimeout(() => {
        scrollToSection("diagnostic-outcome");
      }, 100);

      return;
    }

    if (result?.diagnostic_steps?.[index + 1]) {
      setActiveDiagnosticStep(index + 1);
    }
  }

  
  function handleDiagnosticOutcome(outcome) {
    setDiagnosticOutcome(outcome);

    setIncidentHistory((incidents) => {
      if (incidents.length === 0 || !activeIncidentId) {
        return incidents;
      }

      const updatedIncidents = incidents.map((incident) => {
        if (incident.id !== activeIncidentId) {
          return incident;
        }

        return {
          ...incident,
          diagnostic_outcome: outcome,
          corrective_action: correctiveAction,
          updatedAt: new Date().toLocaleString(),
        };
      });

      localStorage.setItem(
        "fieldops_incidents",
        JSON.stringify(updatedIncidents)
      );

      const updatedActiveIncident = updatedIncidents.find(
        (incident) => incident.id === activeIncidentId
      );

      if (updatedActiveIncident) {
        setSelectedIncident(updatedActiveIncident);
      }

      return updatedIncidents;
    });
  }

  function recordDiagnosticFinding(index, finding) {
    setDiagnosticFindings((current) => {
      const updated = {
        ...current,
        [index]: finding,
      };

      let fieldDecision = "";
      let nextAction = "";

      if (finding === "normal") {
        fieldDecision =
          "Normal finding recorded. Continue with the next diagnostic step.";

        nextAction =
          "Continue to the next recommended diagnostic check.";
      } else if (finding === "abnormal") {
        fieldDecision =
          "Abnormal finding recorded. Review safety controls and escalation guidance before continuing.";

        nextAction =
          "Pause the diagnostic sequence and review safety and escalation guidance.";
      } else if (finding === "not_tested") {
        fieldDecision =
          "Check not tested. Verify the condition before treating the result as normal.";

        nextAction =
          "Verify this diagnostic condition before proceeding.";
      }
      setIncidentHistory((incidents) => {
        if (incidents.length === 0 || !activeIncidentId) {
          return incidents;
        }

        const updatedIncidents = incidents.map((incident) => {
          if (incident.id !== activeIncidentId) {
            return incident;
          }

          return {
            ...incident,
            diagnostic_findings: updated,
            decision_message: fieldDecision,
            next_action: nextAction,
            updatedAt: new Date().toLocaleString(),
          };
        });

        localStorage.setItem(
          "fieldops_incidents",
          JSON.stringify(updatedIncidents)
        );

        const updatedActiveIncident = updatedIncidents.find(
          (incident) => incident.id === activeIncidentId
        );

        if (updatedActiveIncident) {
          setSelectedIncident(updatedActiveIncident);
        }

        return updatedIncidents;
      });

      return updated;
    });
  }

  function handleCheckFinding(finding) {
    setCheckFinding(finding);

    const activeIncident = incidentHistory.find(
      (incident) => incident.id === activeIncidentId
    );

    if (!activeIncident?.next_check) {
      return;
    }

    let message = "";

    if (finding === "normal") {
      message = activeIncident.next_check.if_normal;
    }

    if (finding === "abnormal") {
      message = activeIncident.next_check.if_abnormal;
    }

    if (finding === "not_tested") {
      message =
        "Do not proceed with further diagnostic testing until the check is completed under the applicable site procedure.";
    }

    setDecisionMessage(message);

    setIncidentHistory((current) => {
      const updated = current.map((incident) => {
        if (incident.id !== activeIncidentId) {
          return incident;
        }

        return {
          ...incident,
          check_finding: finding,
          decision_message: message,
          updatedAt: new Date().toLocaleString(),
        };
      });

      localStorage.setItem(
        "fieldops_incidents",
        JSON.stringify(updated)
      );

      const updatedActiveIncident = updated.find(
        (incident) => incident.id === activeIncidentId
      );

      if (updatedActiveIncident) {
        setSelectedIncident(updatedActiveIncident);
      }

      return updated;
    });
  }

  function clearIncidentHistory() {
    localStorage.removeItem("fieldops_incidents");
    setIncidentHistory([]);
  }

  function startNewAnalysis() {
    setEquipment("");
    setFault("");
    setSymptoms("");
    setResult(null);
    setActiveDemo(null);
    setCheckFinding(null);
    setDecisionMessage("");
    setActiveDiagnosticStep(null);
    setCompletedDiagnosticSteps([]);
    setDiagnosticFindings({});
    setDiagnosticOutcome(null);
    setCorrectiveAction("");
    setActiveIncidentId(null);
    setSelectedIncident(null);
  }

  function scrollToSection(id) {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function generateMaintenanceReport() {
    const incident = selectedIncident;

    if (!incident) {
      alert("Please select an incident before generating a maintenance report.");
      return;
    }

    const technicianFinding =
      incident.check_finding === "normal"
        ? "Normal"
        : incident.check_finding === "abnormal"
          ? "Abnormal"
          : incident.check_finding === "not_tested"
            ? "Not Tested"
            : "Not recorded";

    const finalOutcome =
      incident.diagnostic_outcome === "resolved"
        ? "Resolved"
        : incident.diagnostic_outcome === "maintenance"
          ? "Requires Maintenance"
          : incident.diagnostic_outcome === "escalated"
            ? "Escalated"
            : "Not recorded";

    const hasCorrectiveActionField = Object.prototype.hasOwnProperty.call(
      incident,
      "corrective_action"
    );

    const correctiveAction = hasCorrectiveActionField
      ? incident.corrective_action?.trim()
        ? incident.corrective_action
        : "No corrective action recorded."
      : "Not recorded for this incident.";

   const formatList = (items, emptyMessage) => {
      return items?.length
        ? items.map((item, index) => `${index + 1}. ${item}`).join("\n")
        : emptyMessage;
    };

    const diagnosticFindingsReport = incident.diagnostic_steps?.length
      ? incident.diagnostic_steps
          .map((step, index) => {
            const finding = incident.diagnostic_findings?.[index];

            const findingLabel =
              finding === "normal"
                ? "Normal"
                : finding === "abnormal"
                  ? "Abnormal"
                  : finding === "not_tested"
                    ? "Not Tested"
                    : "Not recorded";

            return [
              `Step ${index + 1}: ${step}`,
              `Finding: ${findingLabel}`,
            ].join("\n");
          })
          .join("\n\n")
      : "No diagnostic findings recorded.";

    const likelyCauses = formatList(
      incident.likely_causes,
      "No likely causes recorded."
    );

    const safetyChecks = formatList(
      incident.safety_checks,
      "No safety checks recorded."
    );

    const diagnosticSteps = formatList(
      incident.diagnostic_steps,
      "No diagnostic steps recorded."
    );

    const requiredTools = formatList(
      incident.tools,
      "No tools recorded."
    );

    const stopConditions = formatList(
      incident.stop_conditions,
      "No stop conditions recorded."
    );

    const nextCheck = incident.next_check
      ? [
          `Check:`,
          incident.next_check.check || "Not recorded",
          "",
          `Expected Finding:`,
          incident.next_check.expected || "Not recorded",
          "",
          `If Normal:`,
          incident.next_check.if_normal || "Not recorded",
          "",
          `If Abnormal:`,
          incident.next_check.if_abnormal || "Not recorded",
          "",
          `Safety Note:`,
          incident.next_check.safety_note || "Not recorded",
          "",
          `Reason:`,
          incident.next_check.reason || "Not recorded",
          "",
          `Why This Check:`,
          (incident.next_check.why_points?.length
            ? incident.next_check.why_points
                .map((item, index) => `${index + 1}. ${item}`)
                .join("\n")
            : "Not recorded"),
        ].join("\n")
      : "No structured next-check information recorded.";

    const recommendedAction =
      incident.diagnostic_outcome === "resolved"
        ? "Confirm the equipment is safe and fit for service according to applicable site procedures before returning it to operation."
        : incident.diagnostic_outcome === "maintenance"
          ? "Maintenance intervention is required before the equipment is returned to service."
          : incident.diagnostic_outcome === "escalated"
            ? "Escalate the condition to the appropriate technical or supervisory team and follow the applicable escalation procedure."
            : "Complete the diagnostic workflow and record the appropriate field disposition.";

    const report = `
  FIELDOPS AI
  FIELD MAINTENANCE DIAGNOSTIC REPORT
  ========================================

  REPORT IDENTIFICATION
  ----------------------------------------

  Generated By
  FieldOps AI

  Report Type
  AI-Assisted Field Maintenance Diagnostic Report

  Incident ID
  ${incident.id}

  Created
  ${incident.createdAt || "Not recorded"}

  Last Updated
  ${incident.updatedAt || "Not recorded"}

  Report Generated
  ${new Date().toLocaleString()}


  ========================================
  EQUIPMENT & FAULT
  ========================================

  Equipment
  ${incident.equipment || "Not recorded"}

  Fault Description
  ${incident.fault || "Not recorded"}

  Observed Symptoms
  ${incident.symptoms || "Not provided"}


  ========================================
  INITIAL ASSESSMENT
  ========================================

  ${incident.assessment || "No assessment recorded."}


  ========================================
  DIAGNOSTIC STATUS
  ========================================

  Severity
  ${incident.severity || "Not recorded"}

  Confidence
  ${incident.confidence || "Not recorded"}

  Technician Finding
  ${technicianFinding}

  Final Outcome
  ${finalOutcome}


  ========================================
  NEXT BEST CHECK
  ========================================

  ${incident.next_best_check || "No next-best-check recorded."}

  ${nextCheck}


  ========================================
  FIELD DECISION & TECHNICIAN RECORD
  ========================================

  Technician Finding
  ${technicianFinding}

  Field Decision
  ${incident.decision_message || "No technician decision recorded."}

  Corrective Action / Technician Note
  ${correctiveAction}


  ========================================
  DIAGNOSTIC FINDINGS
  ========================================

  ${diagnosticFindingsReport}


  ========================================
  LIKELY CAUSES
  ========================================

  ${likelyCauses}


  ========================================
  SAFETY CHECKS
  ========================================

  ${safetyChecks}


  ========================================
  DIAGNOSTIC STEPS
  ========================================

  ${diagnosticSteps}


  ========================================
  REQUIRED TOOLS
  ========================================

  ${requiredTools}


  ========================================
  STOP CONDITIONS
  ========================================

  ${stopConditions}


  ========================================
  ESCALATION GUIDANCE
  ========================================

  ${incident.escalation || "No escalation guidance recorded."}


  ========================================
  FIELD HANDOVER SUMMARY
  ========================================

  Technician Finding
  ${technicianFinding}

  Corrective Action
  ${correctiveAction}

  Final Outcome
  ${finalOutcome}

  Recommended Action
  ${recommendedAction}


  ========================================
  SAFETY DISCLAIMER
  ========================================

  This report is an AI-assisted troubleshooting aid and does not
  replace approved engineering procedures, manufacturer instructions,
  site operating procedures, permit-to-work requirements, electrical
  safety rules, isolation procedures, lockout/tagout requirements,
  or qualified-person judgment.

  All testing, isolation, maintenance, repair, and return-to-service
  activities must be performed by appropriately authorized personnel
  under the applicable site procedures.


  ========================================
  END OF REPORT
  ========================================
  `.trim();

    const blob = new Blob([report], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const safeEquipment = (incident.equipment || "Equipment")
      .replace(/[^a-z0-9]/gi, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "");

    link.href = url;
    link.download = `FieldOps_Maintenance_Report_${
      safeEquipment || "Equipment"
    }.txt`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  function generateMaintenancePDF() {
    const incident = selectedIncident;

    if (!incident) {
      alert("Please select an incident before generating a PDF report.");
      return;
    }

    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const margin = 18;
    const contentWidth = pageWidth - margin * 2;

    let y = 20;

    const technicianFinding =
      incident.check_finding === "normal"
        ? "Normal"
        : incident.check_finding === "abnormal"
          ? "Abnormal"
          : incident.check_finding === "not_tested"
            ? "Not Tested"
            : "Not recorded";

    const finalOutcome =
      incident.diagnostic_outcome === "resolved"
        ? "Resolved"
        : incident.diagnostic_outcome === "maintenance"
          ? "Requires Maintenance"
          : incident.diagnostic_outcome === "escalated"
            ? "Escalated"
            : "Not recorded";

    const correctiveAction =
      Object.prototype.hasOwnProperty.call(
        incident,
        "corrective_action"
      )
        ? incident.corrective_action?.trim() ||
          "No corrective action recorded."
        : "Not recorded for this incident.";

    const addPageIfNeeded = (height = 10) => {
      if (y + height > pageHeight - 18) {
        doc.addPage();
        y = 20;
      }
    };

    const addTitle = (text) => {
      addPageIfNeeded(12);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(text, margin, y);

      y += 8;
    };

    const addSection = (title) => {
      addPageIfNeeded(18);

      y += 4;

      doc.setFillColor(245, 247, 250);
      doc.rect(margin, y - 5, contentWidth, 9, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(title, margin + 3, y + 1);

      y += 11;
    };

    const addLabelValue = (label, value) => {
      const safeValue = String(value || "Not recorded");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text(label, margin, y);

      y += 5;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);

      const lines = doc.splitTextToSize(
        safeValue,
        contentWidth
      );

      addPageIfNeeded(lines.length * 4.5);

      doc.text(lines, margin, y);

      y += lines.length * 4.5 + 4;
    };

    const addList = (items, emptyMessage) => {
      if (!items?.length) {
        addLabelValue("Record", emptyMessage);
        return;
      }

      items.forEach((item, index) => {
        const text = `${index + 1}. ${item}`;

        const lines = doc.splitTextToSize(
          text,
          contentWidth - 4
        );

        addPageIfNeeded(lines.length * 4.5 + 2);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(lines, margin + 2, y);

        y += lines.length * 4.5 + 2;
      });

      y += 3;
    };

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("FIELDOPS AI", margin, y);

    y += 8;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(
      "FIELD MAINTENANCE DIAGNOSTIC REPORT",
      margin,
      y
    );

    y += 7;

    doc.setFontSize(8);
    doc.text(
      "AI-assisted field engineering diagnostic record",
      margin,
      y
    );

    y += 10;

    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);

    y += 9;

    // Report identification
    addSection("REPORT IDENTIFICATION");

    addLabelValue(
      "Incident ID",
      incident.id
    );

    addLabelValue(
      "Created",
      incident.createdAt
    );

    addLabelValue(
      "Last Updated",
      incident.updatedAt
    );

    addLabelValue(
      "Report Generated",
      new Date().toLocaleString()
    );

    // Equipment
    addSection("EQUIPMENT & FAULT");

    addLabelValue(
      "Equipment",
      incident.equipment
    );

    addLabelValue(
      "Fault Description",
      incident.fault
    );

    addLabelValue(
      "Observed Symptoms",
      incident.symptoms || "Not provided"
    );

    // Diagnostic status
    addSection("DIAGNOSTIC STATUS");

    addLabelValue(
      "Severity",
      incident.severity
    );

    addLabelValue(
      "Confidence",
      incident.confidence
    );

    addLabelValue(
      "Technician Finding",
      technicianFinding
    );

    addLabelValue(
      "Final Outcome",
      finalOutcome
    );

    // Assessment
    addSection("INITIAL ASSESSMENT");

    addLabelValue(
      "Assessment",
      incident.assessment
    );

    // Next best check
    addSection("NEXT BEST CHECK");

    addLabelValue(
      "Next Best Check",
      incident.next_best_check
    );

    if (incident.next_check) {
      addLabelValue(
        "Check",
        incident.next_check.check
      );

      addLabelValue(
        "Expected Finding",
        incident.next_check.expected
      );

      addLabelValue(
        "If Normal",
        incident.next_check.if_normal
      );

      addLabelValue(
        "If Abnormal",
        incident.next_check.if_abnormal
      );
    }

    // Technician record
    addSection("FIELD DECISION & TECHNICIAN RECORD");

    addLabelValue(
      "Technician Finding",
      technicianFinding
    );

    addLabelValue(
      "Field Decision",
      incident.decision_message
    );

    addLabelValue(
      "Corrective Action / Technician Note",
      correctiveAction
    );

    // Diagnostic findings
    addSection("DIAGNOSTIC FINDINGS");

    if (incident.diagnostic_steps?.length) {
      incident.diagnostic_steps.forEach(
        (step, index) => {
          const finding =
            incident.diagnostic_findings?.[index];

          const findingLabel =
            finding === "normal"
              ? "Normal"
              : finding === "abnormal"
                ? "Abnormal"
                : finding === "not_tested"
                  ? "Not Tested"
                  : "Not recorded";

          addLabelValue(
            `Step ${index + 1}`,
            `${step}\nFinding: ${findingLabel}`
          );
        }
      );
    } else {
      addLabelValue(
        "Record",
        "No diagnostic findings recorded."
      );
    }

    // Likely causes
    addSection("LIKELY CAUSES");

    addList(
      incident.likely_causes,
      "No likely causes recorded."
    );

    // Safety
    addSection("SAFETY CHECKS");

    addList(
      incident.safety_checks,
      "No safety checks recorded."
    );

    // Diagnostic steps
    addSection("DIAGNOSTIC STEPS");

    addList(
      incident.diagnostic_steps,
      "No diagnostic steps recorded."
    );

    // Tools
    addSection("REQUIRED TOOLS");

    addList(
      incident.tools,
      "No tools recorded."
    );

    // Stop conditions
    addSection("STOP CONDITIONS");

    addList(
      incident.stop_conditions,
      "No stop conditions recorded."
    );

    // Escalation
    addSection("ESCALATION GUIDANCE");

    addLabelValue(
      "Guidance",
      incident.escalation
    );

    // Handover
    addSection("FIELD HANDOVER SUMMARY");

    addLabelValue(
      "Technician Finding",
      technicianFinding
    );

    addLabelValue(
      "Corrective Action",
      correctiveAction
    );

    addLabelValue(
      "Final Outcome",
      finalOutcome
    );

    const recommendedAction =
      incident.diagnostic_outcome === "resolved"
        ? "Confirm the equipment is safe and fit for service according to applicable site procedures before returning it to operation."
        : incident.diagnostic_outcome === "maintenance"
          ? "Maintenance intervention is required before the equipment is returned to service."
          : incident.diagnostic_outcome === "escalated"
            ? "Escalate the condition to the appropriate technical or supervisory team and follow the applicable escalation procedure."
            : "Complete the diagnostic workflow and record the appropriate field disposition.";

    addLabelValue(
      "Recommended Action",
      recommendedAction
    );

    // Safety disclaimer
    addSection("SAFETY DISCLAIMER");

    addLabelValue(
      "Important",
      "This report is an AI-assisted troubleshooting aid and does not replace approved engineering procedures, manufacturer instructions, site operating procedures, permit-to-work requirements, electrical safety rules, isolation procedures, lockout/tagout requirements, or qualified-person judgment."
    );

    addLabelValue(
      "Requirement",
      "All testing, isolation, maintenance, repair, and return-to-service activities must be performed by appropriately authorized personnel under the applicable site procedures."
    );

    // Footer / page numbers
    const totalPages =
      doc.internal.getNumberOfPages();

    for (let page = 1; page <= totalPages; page++) {
      doc.setPage(page);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);

      doc.text(
        "FieldOps AI — Field Maintenance Diagnostic Report",
        margin,
        pageHeight - 8
      );

      doc.text(
        `Page ${page} of ${totalPages}`,
        pageWidth - margin,
        pageHeight - 8,
        { align: "right" }
      );
    }

    const safeEquipment = (
      incident.equipment || "Equipment"
    )
      .replace(/[^a-z0-9]/gi, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "");

    doc.save(
      `FieldOps_Maintenance_Report_${
        safeEquipment || "Equipment"
      }.pdf`
    );
  }

  const severityClass =
    result?.severity?.toLowerCase().replace(/\s+/g, "-") || "";

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <div className="brand-mark">
            <Activity size={22} />
          </div>

          <div>
            <h1>FieldOps AI</h1>
            <p>Field troubleshooting & maintenance intelligence</p>
          </div>
        </div>

        <div className="status">
          <span />
          System Online
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <div className="eyebrow">
            <span>FIELD ENGINEERING COPILOT</span>
          </div>

          <h2>
            Diagnose field problems
            <br />
            <span>with structured intelligence.</span>
          </h2>

          <p>
            Describe an equipment fault and FieldOps AI builds a structured
            troubleshooting pathway with safety checks, likely causes,
            diagnostic steps and escalation guidance.
          </p>
        </section>

        <div className="dashboard-section" id="dashboard">
          <div className="section-title">
            <Activity size={20} />

            <div>
              <h3>Field Operations Dashboard</h3>
              <p>Current incident and diagnostic activity</p>
            </div>
          </div>

          <div className="dashboard-stats">
            <div className="dashboard-stat">
              <span className="dashboard-stat-label">TOTAL INCIDENTS</span>
              <strong>{dashboardStats.total}</strong>
            </div>

            <div className="dashboard-stat">
              <span className="dashboard-stat-label">HIGH SEVERITY</span>
              <strong>{dashboardStats.highSeverity}</strong>
            </div>

            <div className="dashboard-stat">
              <span className="dashboard-stat-label">MAINTENANCE</span>
              <strong>{dashboardStats.maintenance}</strong>
            </div>

            <div className="dashboard-stat">
              <span className="dashboard-stat-label">ESCALATED</span>
              <strong>{dashboardStats.escalated}</strong>
            </div>

            <div className="dashboard-stat">
              <span className="dashboard-stat-label">RESOLVED</span>
              <strong>{dashboardStats.resolved}</strong>
            </div>
          </div>
          <div className="recent-incidents">
            <div className="recent-incidents-header">
              <div>
                <h4>Recent Field Incidents</h4>
                <p>Latest equipment diagnostics recorded in FieldOps AI. Select an incident to view details.</p>
              </div>
            </div>

            {incidentHistory.length === 0 ? (
              <div className="empty-incidents">
                <p>No field incidents recorded yet.</p>
              </div>
            ) : (
              <div className="incident-list">
                {incidentHistory.slice(0, 5).map((incident) => (
                  <div
                    className={`dashboard-incident ${
                      selectedIncident?.id === incident.id ? "selected" : ""
                    }`}
                    key={incident.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIncident(incident);
                      setActiveIncidentId(incident.id);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setSelectedIncident(incident);
                        setActiveIncidentId(incident.id);
                      }
                    }}
                  >

                    <div className="dashboard-incident-main">
                      <strong>{incident.equipment}</strong>
                      <span>{incident.fault}</span>
                    </div>

                    <div className="dashboard-incident-arrow" aria-hidden="true">
                      <ArrowRight size={17} />
                    </div>

                    <div className="dashboard-incident-meta">
                      <span className="incident-severity">
                        {incident.severity || "Unknown"}
                      </span>

                      {incident.diagnostic_outcome && (
                        <span
                          className={`dashboard-incident-status ${incident.diagnostic_outcome}`}
                        >
                          {incident.diagnostic_outcome === "resolved"
                            ? "RESOLVED"
                            : incident.diagnostic_outcome === "maintenance"
                              ? "MAINTENANCE"
                              : "ESCALATED"}
                        </span>
                      )}

                      <span>
                        {incident.createdAt}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="field-activity">
            <div className="field-activity-header">
              <div>
                <h4>Field Activity</h4>
                <p>Latest diagnostic activity from the field</p>
              </div>
            </div>

            {incidentHistory.length === 0 ? (
              <div className="empty-incidents">
                <p>No field activity recorded yet.</p>
              </div>
            ) : (
              <div className="activity-list">
                {incidentHistory.slice(0, 3).map((incident) => (
                  <div className="activity-item" key={`activity-${incident.id}`}>
                    <div className="activity-icon">
                      <Activity size={16} />
                    </div>

                    <div className="activity-content">
                      <div className="activity-title-row">
                        <strong>
                          {incident.equipment} diagnosis recorded
                        </strong>

                        {incident.diagnostic_outcome && (
                          <span
                            className={`activity-status ${incident.diagnostic_outcome}`}
                          >
                            {incident.diagnostic_outcome === "resolved"
                              ? "RESOLVED"
                              : incident.diagnostic_outcome === "maintenance"
                                ? "MAINTENANCE"
                                : "ESCALATED"}
                          </span>
                        )}
                      </div>

                      <span className="activity-fault">
                        {incident.fault}
                      </span>

                      <small>
                        {incident.createdAt}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedIncident && (
            <div
              className="selected-incident"
              style={{
                display: "block",
                marginTop: "20px",
                padding: "20px",
                border: "1px solid rgba(255, 255, 255, 0.15)",
              }}
            >
              <div className="selected-incident-header">
                <div>
                  <span className="mini-label">SELECTED INCIDENT</span>

                  <h4>{selectedIncident.equipment}</h4>

                  <p>{selectedIncident.fault}</p>
                </div>

                <button
                  type="button"
                  className="close-incident-button"
                  onClick={() => setSelectedIncident(null)}
                >
                  Close
                </button>
              </div>

              <div className="selected-incident-meta">
                <div className="incident-meta-card">
                  <span className="mini-label">INCIDENT ID</span>
                  <strong>{selectedIncident.id}</strong>
                </div>

                <div className="incident-meta-card">
                  <span className="mini-label">CREATED</span>
                  <strong>{selectedIncident.createdAt}</strong>
                </div>

                <div className="incident-meta-card">
                  <span className="mini-label">LAST UPDATED</span>
                  <strong>{selectedIncident.updatedAt}</strong>
                </div>
              </div>

              <div className="incident-status-card">
                <div>
                  <span className="mini-label">DIAGNOSTIC STATUS</span>
                  <p>Recorded status for this field incident</p>
                </div>

                <div className="incident-status-values">
                  <div>
                    <span className="mini-label">SEVERITY</span>

                    <strong
                      className={`status-badge severity-${(
                        selectedIncident.severity || "not-recorded"
                      )
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {selectedIncident.severity || "Not recorded"}
                    </strong>
                  </div>

                  <div>
                    <span className="mini-label">CONFIDENCE</span>

                    <strong
                      className={`status-badge confidence-${(
                        selectedIncident.confidence || "not-recorded"
                      )
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {selectedIncident.confidence || "Not recorded"}
                    </strong>
                  </div>

                  <div>
                    <span className="mini-label">FIELD FINDING</span>

                    <strong
                      className={`status-badge finding-${(
                        selectedIncident.check_finding || "not-recorded"
                      )
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {selectedIncident.check_finding === "normal"
                        ? "Normal"
                        : selectedIncident.check_finding === "abnormal"
                          ? "Abnormal"
                          : selectedIncident.check_finding === "not_tested"
                            ? "Not Tested"
                            : "Not recorded"}
                    </strong>
                  </div>

                  <div>
                    <span className="mini-label">OUTCOME</span>

                    <strong
                      className={`status-badge outcome-${(
                        selectedIncident.diagnostic_outcome || "not-recorded"
                      )
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {selectedIncident.diagnostic_outcome === "resolved"
                        ? "Resolved"
                        : selectedIncident.diagnostic_outcome === "maintenance"
                          ? "Requires Maintenance"
                          : selectedIncident.diagnostic_outcome === "escalated"
                            ? "Escalated"
                            : "Not recorded"}
                    </strong>
                  </div>
                </div>
              </div>
              <details
                className="selected-incident-section review-collapsible"
                open
              >
                <summary className="review-summary">
                  <div className="section-title">
                    <FileText size={18} />
                    <div>
                      <h3>AI Assessment</h3>
                      <p>
                        Initial diagnostic assessment recorded for the incident
                      </p>
                    </div>
                  </div>
                </summary>

                <div className="review-section-content">
                  <div className="selected-incident-check">
                    <span className="mini-label">ASSESSMENT</span>
                    <p>
                      {selectedIncident.assessment ||
                        "No assessment recorded."}
                    </p>
                  </div>

                  <div className="selected-incident-check">
                    <span className="mini-label">LIKELY CAUSES</span>

                    {selectedIncident.likely_causes?.length ? (
                      <ul>
                        {selectedIncident.likely_causes.map(
                          (cause, index) => (
                            <li key={index}>{cause}</li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p>No likely causes recorded.</p>
                    )}
                  </div>
                </div>
              </details>

              <details
                className="selected-incident-section review-collapsible"
                open
              >
                <summary className="review-summary">
                  <div className="section-title">
                    <Wrench size={18} />
                    <div>
                      <h3>Field Diagnosis</h3>
                      <p>Technician checks and recorded findings</p>
                    </div>
                  </div>
                </summary>

                <div className="review-section-content">
                  <div className="selected-incident-check">
                    <span className="mini-label">NEXT BEST CHECK</span>
                    <p>
                      {selectedIncident.next_best_check ||
                        "No next-best-check recorded."}
                    </p>
                  </div>

                  {selectedIncident.next_check && (
                    <div className="selected-incident-check">
                      <span className="mini-label">STRUCTURED CHECK</span>

                      <p>
                        <strong>Check:</strong>{" "}
                        {selectedIncident.next_check.check}
                      </p>

                      <p>
                        <strong>Expected:</strong>{" "}
                        {selectedIncident.next_check.expected}
                      </p>

                      <p>
                        <strong>If Normal:</strong>{" "}
                        {selectedIncident.next_check.if_normal}
                      </p>

                      <p>
                        <strong>If Abnormal:</strong>{" "}
                        {selectedIncident.next_check.if_abnormal}
                      </p>
                    </div>
                  )}

                  <div className="selected-incident-check">
                    <span className="mini-label">FIELD DECISION</span>
                    <p>
                      {selectedIncident.decision_message ||
                        "No field decision recorded."}
                    </p>
                  </div>

                  <div className="selected-incident-check">
                    <span className="mini-label">DIAGNOSTIC FINDINGS</span>

                    {selectedIncident.diagnostic_steps?.length ? (
                      <div className="review-diagnostic-findings">
                        {selectedIncident.diagnostic_steps.map(
                          (step, index) => {
                            const finding =
                              selectedIncident.diagnostic_findings?.[index];

                            const findingLabel =
                              finding === "normal"
                                ? "Normal"
                                : finding === "abnormal"
                                  ? "Abnormal"
                                  : finding === "not_tested"
                                    ? "Not Tested"
                                    : "Not recorded";

                            return (
                              <div
                                key={index}
                                className={`review-diagnostic-item ${
                                  finding || "not-recorded"
                                }`}
                              >
                                <div>
                                  <strong>Step {index + 1}</strong>
                                  <p>{step}</p>
                                </div>

                                <span>{findingLabel}</span>
                              </div>
                            );
                          }
                        )}
                      </div>
                    ) : (
                      <p>No diagnostic findings recorded.</p>
                    )}
                  </div>
                </div>
              </details>

              <details
                className="selected-incident-section review-collapsible"
              >
                  <summary className="review-summary">
                    <div className="section-title">
                      <ShieldCheck size={18} />
                      <div>
                        <h3>Safety & Escalation</h3>
                        <p>Safety controls and escalation guidance</p>
                      </div>
                    </div>
                  </summary>

                  <div className="review-section-content">
                    <div className="selected-incident-check">
                      <span className="mini-label">SAFETY CHECKS</span>

                      {selectedIncident.safety_checks?.length ? (
                        <ul>
                          {selectedIncident.safety_checks.map(
                            (item, index) => (
                              <li key={index}>{item}</li>
                            )
                          )}
                        </ul>
                      ) : (
                        <p>No safety checks recorded.</p>
                      )}
                    </div>

                    <div className="selected-incident-check">
                      <span className="mini-label">STOP CONDITIONS</span>

                      {selectedIncident.stop_conditions?.length ? (
                        <ul>
                          {selectedIncident.stop_conditions.map(
                            (item, index) => (
                              <li key={index}>{item}</li>
                            )
                          )}
                        </ul>
                      ) : (
                        <p>No stop conditions recorded.</p>
                      )}
                    </div>

                    <div className="selected-incident-check">
                      <span className="mini-label">ESCALATION GUIDANCE</span>

                      <p>
                        {selectedIncident.escalation ||
                          "No escalation guidance recorded."}
                      </p>
                    </div>
                  </div>
                </details>

                <details
                  className="selected-incident-section review-collapsible"
                >
                  <summary className="review-summary">
                    <div className="section-title">
                      <CheckCircle2 size={18} />
                      <div>
                        <h3>Field Disposition</h3>
                        <p>Final technician disposition for this incident</p>
                      </div>
                    </div>
                  </summary>

                  <div className="review-section-content">
                    <div className="selected-incident-check">
                      <span className="mini-label">CORRECTIVE ACTION</span>

                      <p>
                        {Object.prototype.hasOwnProperty.call(
                          selectedIncident,
                          "corrective_action"
                        )
                          ? selectedIncident.corrective_action?.trim() ||
                            "No corrective action recorded."
                          : "Not recorded for this incident."}
                      </p>
                    </div>

                    <div className="selected-incident-check">
                      <span className="mini-label">FINAL OUTCOME</span>

                      <p>
                        {selectedIncident.diagnostic_outcome === "resolved"
                          ? "Resolved"
                          : selectedIncident.diagnostic_outcome === "maintenance"
                            ? "Requires Maintenance"
                            : selectedIncident.diagnostic_outcome === "escalated"
                              ? "Escalated"
                              : "Not recorded"}
                      </p>
                    </div>
                  </div>
              </details>

              <div className="selected-incident-actions">
                <button
                  type="button"
                  className="report-button"
                  onClick={generateMaintenanceReport}
                >
                  <FileText size={17} />
                  Generate TXT Report
                </button>

                <button
                  type="button"
                  className="report-button"
                  onClick={generateMaintenancePDF}
                >
                  <FileText size={17} />
                  Generate PDF Report
                </button>
              </div>

             
            </div>
          )}
        </div>

        <section className="card input-card">
          <div className="section-title">
            <Wrench size={20} />

            <div>
              <h3>Report Equipment Fault</h3>
              <p>Provide the available field information.</p>
            </div>
          </div>

          <div className="field">
            <div className="field-label-row">
              <label>Equipment</label>

              <button
                type="button"
                className={`voice-button ${
                  isListening === "equipment" ? "listening" : ""
                }`}
                onClick={() => startVoiceInput("equipment")}
                disabled={loading || isListening}
              >
                <span className="voice-icon">
                  {isListening === "equipment" ? "●" : "🎙"}
                </span>

                {isListening === "equipment" ? "Listening..." : "Voice Input"}
              </button>
            </div>

            <input
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
              placeholder="e.g. Motor, Compressor, Transformer"
            />
          </div>
                    {/* Fault Description */}
          <div className="field">
            <div className="field-label-row">
              <label>Fault Description</label>

              <button
                type="button"
                className={`voice-button ${
                  isListening === "fault" ? "listening" : ""
                }`}
                onClick={() => startVoiceInput("fault")}
                disabled={loading || isListening}
              >
                <span className="voice-icon">
                  {isListening === "fault" ? "●" : "🎙"}
                </span>

                {isListening === "fault" ? "Listening..." : "Voice Input"}
              </button>
            </div>

            <textarea
              value={fault}
              onChange={(e) => setFault(e.target.value)}
              placeholder="Describe the fault..."
            />
          </div>

          {/* Observed Symptoms */}
          <div className="field">
            <div className="field-label-row">
              <label>Observed Symptoms</label>

              <button
                type="button"
                className={`voice-button ${
                  isListening === "symptoms" ? "listening" : ""
                }`}
                onClick={() => startVoiceInput("symptoms")}
                disabled={loading || isListening}
              >
                <span className="voice-icon">
                  {isListening === "symptoms" ? "●" : "🎙"}
                </span>

                {isListening === "symptoms"
                  ? "Listening..."
                  : "Voice Input"}
              </button>
            </div>

            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe what you observed in the field..."
            />
          </div>

          <button
            className="primary-button"
            onClick={analyzeFault}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="spin" size={18} />
                Analyzing Field Data...
              </>
            ) : (
              <>
                <Activity size={18} />
                Analyze Fault
              </>
            )}
          </button>
        </section>

        {/* ================================
            INCIDENT OUTCOME CHART
        ================================= */}
        {incidentHistory.length > 0 && (
          <section className="incident-chart-section">
            <div className="chart-header">
              <div className="section-title">
                <Activity size={20} />

                <div>
                  <h3>Field Incident Outcomes</h3>
                  <p>Current disposition of recorded diagnostic sessions</p>
                </div>
              </div>
            </div>

            <div className="incident-chart">
              {[
                {
                  label: "Resolved",
                  value: incidentHistory.filter(
                    (incident) => incident.diagnostic_outcome === "resolved"
                  ).length,
                  className: "resolved",
                },
                {
                  label: "Requires Maintenance",
                  value: incidentHistory.filter(
                    (incident) => incident.diagnostic_outcome === "maintenance"
                  ).length,
                  className: "maintenance",
                },
                {
                  label: "Escalated",
                  value: incidentHistory.filter(
                    (incident) => incident.diagnostic_outcome === "escalated"
                  ).length,
                  className: "escalated",
                },
                {
                  label: "No Outcome",
                  value: incidentHistory.filter(
                    (incident) => !incident.diagnostic_outcome
                  ).length,
                  className: "pending",
                },
              ].map((item) => {
                const percentage =
                  incidentHistory.length > 0
                    ? (item.value / incidentHistory.length) * 100
                    : 0;

                return (
                  <div className="chart-row" key={item.label}>
                    <div className="chart-row-header">
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                    </div>

                    <div className="chart-track">
                      <div
                        className={`chart-bar ${item.className}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <span className="chart-percentage">
                      {Math.round(percentage)}%
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="chart-total">
              <span>Total recorded incidents</span>
              <strong>{incidentHistory.length}</strong>
            </div>
          </section>
        )}

        {/* ================================
            DEMO MODE
        ================================= */}

        <section className="demo-section">
          <div className="demo-header">
            <div className="section-title">
              <Gauge size={20} />

              <div>
                <h3>Demo Mode</h3>
                <p>
                  Load a sample field fault to demonstrate the diagnostic
                  workflow.
                </p>
              </div>
            </div>
          </div>

          <div className="demo-grid">
            {demoScenarios.map((scenario) => (
              <button
                key={scenario.name}
                className={`demo-card ${activeDemo === scenario.name ? "demo-card-active" : ""
                  }`}
                onClick={() => runDemoScenario(scenario)}
                disabled={loading}
              >
                <div className="demo-card-icon">
                  {activeDemo === scenario.name ? (
                    <Loader2 className="spin" size={18} />
                  ) : (
                    <Activity size={18} />
                  )}
                </div>

                <div className="demo-card-content">
                  <strong>
                    {activeDemo === scenario.name
                      ? "Analyzing..."
                      : scenario.name}
                  </strong>

                  <span>{scenario.symptoms}</span>
                </div>

                <ArrowRight size={17} className="demo-arrow" />
              </button>
            ))}
          </div>
        </section>

        {incidentHistory.length > 0 && (
          <section className="history-section">
            <div className="history-header">
              <div className="section-title">
                <History size={20} />

                <div>
                  <h3>Recent Incidents</h3>
                  <p>Previous field diagnostic sessions</p>
                </div>
              </div>

              <button
                className="clear-history-button"
                onClick={clearIncidentHistory}
              >
                <Trash2 size={16} />
                Clear History
              </button>
            </div>

            <div className="incident-list">
              {incidentHistory.map((incident) => (
                <div
                  className={`incident-card ${
                    selectedIncident?.id === incident.id ? "selected" : ""
                  }`}
                  key={incident.id}
                  onClick={() => {
                    setSelectedIncident(incident);
                    setActiveIncidentId(incident.id);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelectedIncident(incident);
                      setActiveIncidentId(incident.id);
                    }
                  }}
                >
                  {selectedIncident?.id === incident.id && (
                    <div className="incident-active-label">
                      ACTIVE REVIEW
                    </div>
                  )}

                  {incident.diagnostic_outcome && (
                    <div
                      className={`incident-status ${incident.diagnostic_outcome}`}
                    >
                      {incident.diagnostic_outcome === "resolved"
                        ? "RESOLVED"
                        : incident.diagnostic_outcome === "maintenance"
                          ? "REQUIRES MAINTENANCE"
                          : "ESCALATED"}
                    </div>
                  )}
                  <div className="incident-main">
                    <div className="incident-equipment">
                      <Activity size={17} />
                      <strong>{incident.equipment}</strong>
                    </div>

                    <p className="incident-fault">{incident.fault}</p>

                    {incident.symptoms && (
                      <p className="incident-symptoms">
                        Observation: {incident.symptoms}
                      </p>
                    )}

                    {incident.check_finding && (
                      <p className="incident-finding">
                        Technician Finding:{" "}
                        <strong>
                          {incident.check_finding === "normal"
                            ? "Normal"
                            : incident.check_finding === "abnormal"
                              ? "Abnormal"
                              : "Not Tested"}
                        </strong>
                      </p>
                    )}

                    {incident.diagnostic_findings &&
                      Object.keys(incident.diagnostic_findings).length > 0 && (
                        <div className="incident-diagnostic-findings">
                          <span className="incident-finding-title">
                            Diagnostic Findings
                          </span>

                          {Object.entries(incident.diagnostic_findings).map(
                            ([step, finding]) => (
                              <div
                                key={step}
                                className={`incident-diagnostic-item ${finding}`}
                              >
                                <span>Step {Number(step) + 1}</span>

                                <strong>
                                  {finding === "normal"
                                    ? "Normal"
                                    : finding === "abnormal"
                                      ? "Abnormal"
                                      : "Not Tested"}
                                </strong>
                              </div>
                            )
                          )}
                        </div>
                      )}

                    {incident.diagnostic_outcome && (
                      <div className="incident-diagnostic-outcome">
                        <span className="incident-finding-title">
                          Diagnostic Outcome
                        </span>

                        <strong>
                          {incident.diagnostic_outcome === "resolved"
                            ? "Resolved"
                            : incident.diagnostic_outcome === "maintenance"
                              ? "Requires Maintenance"
                              : "Escalated"}
                        </strong>
                      </div>
                    )}



                    <span className="incident-date">
                      {incident.createdAt}
                    </span>
                  </div>

                  <div className="incident-status">
                    <span
                      className={`severity-badge ${incident.severity
                          ?.toLowerCase()
                          .replace(/\s+/g, "-") || ""
                        }`}
                    >
                      <AlertTriangle size={14} />
                      {incident.severity}
                    </span>

                    <span className="incident-confidence">
                      {incident.confidence} confidence
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {result && !result.error && (
          <section className="results" id="diagnostic-results">
            <div className="results-heading">
              <div>
                <span className="eyebrow">ANALYSIS COMPLETE</span>
                <h2>Diagnostic Intelligence</h2>
              </div>
            </div>

            <div className="analysis-context">
              <div className="context-main">
                <span className="mini-label">EQUIPMENT</span>

                <h3>{equipment}</h3>

                <div className="context-fault">
                  <span>REPORTED FAULT</span>
                  <strong>{fault}</strong>
                </div>

                {symptoms && (
                  <div className="context-symptoms">
                    <span>FIELD OBSERVATION</span>
                    <p>{symptoms}</p>
                  </div>
                )}
              </div>

              <div className="context-status">
                <div className="status-item">
                  <span>SEVERITY</span>

                  <div className={`severity-badge ${severityClass}`}>
                    <AlertTriangle size={15} />
                    {result.severity}
                  </div>
                </div>

                <div className="status-divider" />

                <div className="status-item">
                  <span>DIAGNOSTIC CONFIDENCE</span>

                  <strong className={`context-confidence ${severityClass}`}>
                    {result.confidence}
                  </strong>
                </div>
              </div>
            </div>

            <div className="pathway-card">
              <div className="pathway-header">
                <div>
                  <span className="mini-label">AI DIAGNOSTIC PATHWAY</span>
                  <h3>Recommended troubleshooting flow</h3>
                </div>

                <Gauge size={21} />
              </div>

              <div className="pathway">
                <button
                  className="path-node"
                  onClick={() => scrollToSection("reported-fault")}
                >
                  <div className="node-top">
                    <span className="node-number">01</span>
                    <ClipboardList size={18} />
                  </div>

                  <strong>Reported Fault</strong>
                  <small>Equipment & fault information</small>
                </button>

                <ArrowRight className="path-arrow" size={19} />

                <button
                  className="path-node"
                  onClick={() => scrollToSection("safety")}
                >
                  <div className="node-top">
                    <span className="node-number">02</span>
                    <ShieldCheck size={18} />
                  </div>

                  <strong>Safety Screen</strong>
                  <small>Energy isolation & hazards</small>
                </button>

                <ArrowRight className="path-arrow" size={19} />

                <button
                  className="path-node"
                  onClick={() => scrollToSection("likely-causes")}
                >
                  <div className="node-top">
                    <span className="node-number">03</span>
                    <SearchCheck size={18} />
                  </div>

                  <strong>Likely Causes</strong>
                  <small>{result.likely_causes.length} potential causes</small>
                </button>

                <ArrowRight className="path-arrow" size={19} />

                <button
                  className="path-node next-check-node"
                  onClick={() => scrollToSection("next-check")}
                >
                  <div className="node-top">
                    <span className="node-number">04</span>
                    <CheckCircle2 size={18} />
                  </div>

                  <strong>Next Best Check</strong>
                  <small>Prioritized verification</small>
                </button>

                <ArrowRight className="path-arrow" size={19} />

                <button
                  className="path-node"
                  onClick={() => scrollToSection("escalation")}
                >
                  <div className="node-top">
                    <span className="node-number">05</span>
                    <UserRoundCheck size={18} />
                  </div>

                  <strong>Escalation</strong>
                  <small>Support based on findings</small>
                </button>
              </div>
            </div>

            <div className="summary-grid">
              <div className="card assessment-card" id="reported-fault">
                <div className="section-title">
                  <Activity size={20} />

                  <div>
                    <h3>Initial Assessment</h3>
                    <p>AI-generated fault assessment</p>
                  </div>
                </div>

                <p>{result.assessment}</p>
              </div>

              <div className="card confidence-card">
                <div className="section-title">
                  <Gauge size={20} />

                  <div>
                    <h3>Diagnostic Confidence</h3>
                    <p>Based on available field information</p>
                  </div>
                </div>

                <div className={`confidence-value ${severityClass}`}>
                  {result.confidence}
                </div>

                <p className="muted">
                  Confidence may increase as additional measurements and
                  observations are provided.
                </p>
              </div>
            </div>

            <div className="next-check-card" id="next-check">
              <div className="next-check-icon">
                <CheckCircle2 size={24} />
              </div>

              <div className="next-check-content">
                <span className="mini-label">NEXT BEST CHECK</span>

                <h3>
                  {result.next_check?.check || result.next_best_check}
                </h3>

                {result.next_check && (
                  <>
                    <p className="next-check-expected">
                      <strong>Expected finding:</strong>{" "}
                      {result.next_check.expected}
                    </p>

                    <p className="next-check-safety">
                      <ShieldCheck size={15} />
                      {result.next_check.safety_note}
                    </p>

                    <div className="why-this-check">
                      <div className="why-this-check-header">
                        <span className="mini-label">WHY THIS CHECK?</span>
                      </div>

                      <p>
                        {result.next_check.reason}
                      </p>

                      <div className="why-this-check-points">
                        {(result.next_check.why_points || []).map((point, index) => (
                          <span key={index}>• {point}</span>
                        ))}
                      </div>
                    </div>

                    <div className="check-feedback">
                      <span className="feedback-label">
                        WHAT DID YOU FIND?
                      </span>

                      <div className="feedback-buttons">
                        <button
                          type="button"
                          className={`feedback-button ${checkFinding === "normal" ? "active normal" : ""
                            }`}
                          onClick={() => handleCheckFinding("normal")}
                        >
                          <CheckCircle2 size={17} />
                          Normal
                        </button>

                        <button
                          type="button"
                          className={`feedback-button ${checkFinding === "abnormal" ? "active abnormal" : ""
                            }`}
                          onClick={() => handleCheckFinding("abnormal")}
                        >
                          <AlertTriangle size={17} />
                          Abnormal
                        </button>

                        <button
                          type="button"
                          className={`feedback-button ${checkFinding === "not_tested" ? "active not-tested" : ""
                            }`}
                          onClick={() => handleCheckFinding("not_tested")}
                        >
                          Not Tested
                        </button>
                      </div>
                    </div>

                    {decisionMessage && (
                      <div className="field-decision">
                        <span className="mini-label">FIELD DECISION</span>

                        <strong>
                          {checkFinding === "normal"
                            ? "Finding: Normal"
                            : checkFinding === "abnormal"
                              ? "Finding: Abnormal"
                              : "Finding: Not Tested"}
                        </strong>

                        <p>{decisionMessage}</p>

                        {checkFinding === "abnormal" && (
                          <button
                            type="button"
                            className="continue-diagnosis-button"
                            onClick={() => scrollToSection("diagnostic-steps")}
                          >
                            Continue Diagnosis
                            <ArrowRight size={17} />
                          </button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="content-grid">
              <div className="card" id="likely-causes">
                <div className="section-title">
                  <AlertTriangle size={20} />

                  <div>
                    <h3>Likely Causes</h3>
                    <p>Potential fault sources</p>
                  </div>
                </div>

                <ul>
                  {result.likely_causes.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="card safety-card" id="safety">
                <div className="section-title">
                  <ShieldCheck size={20} />

                  <div>
                    <h3>Safety Checks</h3>
                    <p>Complete before intervention</p>
                  </div>
                </div>

                <ul>
                  {result.safety_checks.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="card" id="diagnostic-steps">
              <div className="section-title">
                <Wrench size={20} />

                <div>
                  <h3>Diagnostic Steps</h3>
                  <p>Recommended troubleshooting sequence</p>
                </div>
              </div>

              <div className="diagnostic-progress">
                <span>
                  {completedDiagnosticSteps.length} of{" "}
                  {result.diagnostic_steps.length} steps completed
                </span>
              </div>

              <ol className="diagnostic-list">
                {result.diagnostic_steps.map((item, index) => {
                  const isActive = activeDiagnosticStep === index;
                  const isCompleted = completedDiagnosticSteps.includes(index);

                  return (
                    <li
                      key={index}
                      className={`diagnostic-step ${isActive ? "active" : ""
                        } ${isCompleted ? "completed" : ""}`}
                    >
                      <span className="diagnostic-step-number">
                        {isCompleted ? "\u2713" : index + 1}
                      </span>

                      <div className="diagnostic-step-content">
                        <p>{item}</p>

                        {!isCompleted && !isActive && (
                          <button
                            type="button"
                            className="diagnostic-step-button"
                            onClick={() => startDiagnosticStep(index)}
                          >
                            Start Step
                          </button>
                        )}

                        {isActive && (
                          <div className="diagnostic-finding">
                            <div className="diagnostic-action">
                              <span className="mini-label">TECHNICIAN ACTION</span>

                              <p>
                                Perform the check described above and record the actual field
                                condition before completing this step.
                              </p>
                            </div>

                            <span className="finding-label">
                              TECHNICIAN FINDING
                            </span>

                            <div className="finding-buttons">
                              <button
                                type="button"
                                className={`finding-button ${diagnosticFindings[index] === "normal"
                                    ? "selected normal"
                                    : ""
                                  }`}
                                onClick={() =>
                                  recordDiagnosticFinding(index, "normal")
                                }
                              >
                                Normal
                              </button>

                              <button
                                type="button"
                                className={`finding-button ${diagnosticFindings[index] === "abnormal"
                                    ? "selected abnormal"
                                    : ""
                                  }`}
                                onClick={() =>
                                  recordDiagnosticFinding(index, "abnormal")
                                }
                              >
                                Abnormal
                              </button>

                              <button
                                type="button"
                                className={`finding-button ${diagnosticFindings[index] === "not_tested"
                                    ? "selected not-tested"
                                    : ""
                                  }`}
                                onClick={() =>
                                  recordDiagnosticFinding(index, "not_tested")
                                }
                              >
                                Not Tested
                              </button>
                            </div>
                           {diagnosticFindings[index] === "normal" && (
                              <div className="diagnostic-guidance normal">
                                <div className="diagnostic-guidance-icon">
                                  <CheckCircle2 size={18} />
                                </div>

                                <div className="diagnostic-guidance-content">
                                  <div className="diagnostic-guidance-header">
                                    <strong>Normal Finding Recorded</strong>
                                    <span className="diagnostic-guidance-badge">
                                    NORMAL
                                  </span>
                                  </div>

                                  <p>
                                    No abnormal condition was identified at this check.
                                    Continue to the next recommended diagnostic step.
                                  </p>

                                  <div className="diagnostic-decision">
                                    <span className="mini-label">FIELD DECISION</span>
                                    <strong>Continue diagnostic path</strong>
                                  </div>
                                </div>
                              </div>
                            )}

                           {diagnosticFindings[index] === "not_tested" && (
                            <div className="diagnostic-guidance not-tested">
                              <div className="diagnostic-guidance-icon">
                                <AlertTriangle size={18} />
                              </div>

                              <div className="diagnostic-guidance-content">
                                <div className="diagnostic-guidance-header">
                                  <strong>Check Not Tested</strong>
                                  <span className="diagnostic-guidance-badge">
                                    NOT VERIFIED
                                  </span>
                                </div>

                                <p>
                                  This condition has not been verified. Do not treat the
                                  result as normal before continuing.
                                </p>

                                <div className="diagnostic-decision">
                                  <span className="mini-label">FIELD DECISION</span>
                                  <strong>Verify before continuing</strong>
                                </div>
                              </div>
                            </div>
                          )}
                           {diagnosticFindings[index] === "abnormal" && (
                              <div className="diagnostic-alert">
                                <div className="diagnostic-alert-icon">
                                  <AlertTriangle size={18} />
                                </div>

                                <div className="diagnostic-alert-content">
                                  <div className="diagnostic-alert-header">
                                    <strong>Abnormal Finding Detected</strong>
                                    <span className="diagnostic-alert-badge">
                                      ACTION REQUIRED
                                    </span>
                                  </div>

                                  <p>
                                    Review the condition before continuing. Follow the applicable
                                    isolation, safety, and escalation procedure.
                                  </p>

                                  <div className="diagnostic-decision">
                                    <span className="mini-label">FIELD DECISION</span>
                                    <strong>Review safety & escalation</strong>
                                  </div>

                                  <div className="diagnostic-alert-actions">
                                    <button
                                      type="button"
                                      className="review-finding-button"
                                      onClick={() => scrollToSection("escalation")}
                                    >
                                      Review Finding
                                      <ArrowRight size={16} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}

                            <button
                              type="button"
                              className="diagnostic-step-button"
                              onClick={() => completeDiagnosticStep(index)}
                            >
                              Complete Step
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
              {Object.keys(diagnosticFindings).length > 0 && (
                <div className="diagnostic-findings-summary">
                  <div className="summary-header">
                    <FileText size={18} />

                    <div>
                      <h4>Diagnostic Findings</h4>
                      <p>Recorded technician observations</p>
                    </div>
                  </div>

                  <div className="findings-summary-list">
                    {result.diagnostic_steps.map((step, index) => {
                      const finding = diagnosticFindings[index];

                      if (!finding) {
                        return null;
                      }

                      return (
                        <div
                          key={index}
                          className={`finding-summary-item ${finding}`}
                        >
                          <span className="finding-summary-step">
                            Step {index + 1}
                          </span>

                          <span className="finding-summary-text">
                            {finding === "normal"
                              ? "Normal"
                              : finding === "abnormal"
                                ? "Abnormal"
                                : "Not Tested"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {result.diagnostic_steps.length > 0 &&
                (completedDiagnosticSteps.length ===
                  result.diagnostic_steps.length ||
                  Object.values(diagnosticFindings).some(
                    (finding) => finding === "abnormal"
                  )) && (
                  <div className="diagnostic-outcome" id="diagnostic-outcome">
                    <div className="outcome-header">
                      <FileText size={18} />

                      <div>
                        <h4>Final Diagnostic Outcome</h4>
                        <p>Record the current field disposition</p>
                      </div>
                    </div>
                    <div className="corrective-action">
                      <span className="mini-label">CORRECTIVE ACTION / TECHNICIAN NOTE</span>

                      <textarea
                        value={correctiveAction}
                        onChange={(e) => setCorrectiveAction(e.target.value)}
                        placeholder="Record the corrective action taken, technician observation, or reason for escalation..."
                        rows={4}
                      />

                      <p className="field-help">
                        Record what was done after the diagnostic finding. This note will be saved
                        with the incident and included in the maintenance report.
                      </p>
                    </div>

                    {!diagnosticOutcome && (
                      <div className="outcome-options">
                        <button
                          type="button"
                          className="outcome-button"
                          onClick={() => {
                            if (!correctiveAction.trim()) {
                              alert("Please record the corrective action or technician note before selecting an outcome.");
                              return;
                            }

                            handleDiagnosticOutcome("resolved");
                          }}
                        >
                          Resolved
                        </button>

                        <button
                          type="button"
                          className="outcome-button"
                          onClick={() => {
                            if (!correctiveAction.trim()) {
                              alert("Please record the corrective action or technician note before selecting an outcome.");
                              return;
                            }

                            handleDiagnosticOutcome("maintenance");
                          }}
                        >
                          Requires Maintenance
                        </button>

                        <button
                          type="button"
                          className="outcome-button"
                          onClick={() => {
                            if (!correctiveAction.trim()) {
                              alert("Please record the corrective action or technician note before selecting an outcome.");
                              return;
                            }

                            handleDiagnosticOutcome("escalated");
                          }}
                        >
                          Escalated
                        </button>
                      </div>
                    )}

                    {diagnosticOutcome && (
                      <>
                        <div className="outcome-confirmed">
                          <span className="mini-label">CONFIRMED OUTCOME</span>

                          <strong>
                            {diagnosticOutcome === "resolved"
                              ? "Resolved"
                              : diagnosticOutcome === "maintenance"
                                ? "Requires Maintenance"
                                : "Escalated"}
                          </strong>

                          <button
                            type="button"
                            className="change-outcome-button"
                            onClick={() => setDiagnosticOutcome(null)}
                          >
                            Change Outcome
                          </button>
                        </div>

                        <div className="field-disposition">
                          <span className="mini-label">FIELD DISPOSITION</span>

                          <strong>
                            {diagnosticOutcome === "resolved"
                              ? "Issue marked as resolved"
                              : diagnosticOutcome === "maintenance"
                                ? "Maintenance action required"
                                : "Technical escalation required"}
                          </strong>

                          <p>
                            {diagnosticOutcome === "resolved"
                              ? "Confirm the equipment is safe and fit for service according to applicable site procedures before returning it to operation."
                              : diagnosticOutcome === "maintenance"
                                ? "The identified condition requires appropriate maintenance intervention before the equipment is returned to service."
                                : "Hand over the issue to the appropriate technical or supervisory team and follow the applicable escalation procedure."}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}
            </div>

            <div className="content-grid">
              <div className="card">
                <div className="section-title">
                  <Wrench size={20} />

                  <div>
                    <h3>Required Tools</h3>
                    <p>Suggested diagnostic resources</p>
                  </div>
                </div>

                <ul>
                  {result.tools.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="card stop-card">
                <div className="section-title">
                  <AlertTriangle size={20} />

                  <div>
                    <h3>Stop Conditions</h3>
                    <p>Conditions requiring work to stop</p>
                  </div>
                </div>

                <ul>
                  {result.stop_conditions.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="card escalation-card" id="escalation">
              <div className="section-title">
                <UserRoundCheck size={20} />

                <div>
                  <span className="mini-label">ESCALATION GUIDANCE</span>
                  <h3>Know when to involve additional support</h3>
                  <p>Support based on diagnostic findings</p>
                </div>
              </div>

              <p>{result.escalation}</p>
            </div>

            <div className="result-actions">
              <button
                className="secondary-button"
                onClick={startNewAnalysis}
              >
                <Activity size={18} />
                New Analysis
              </button>

              <div className="incident-report-actions">
                  <button
                    type="button"
                    className="maintenance-report-button"
                    onClick={generateMaintenanceReport}
                  >
                    <FileText size={18} />
                    Generate TXT Report
                  </button>

                  <button
                    type="button"
                    className="maintenance-report-button"
                    onClick={generateMaintenancePDF}
                  >
                    <FileText size={18} />
                    Generate PDF Report
                  </button>
                </div>
            </div>
          </section>
        )}

        {result?.error && <div className="error">{result.error}</div>}
      </main>
    </div>
  );
}

export default App;
