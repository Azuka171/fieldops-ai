from .schemas import FaultRequest
from .tools.diagnosis import generate_diagnosis
from .tools.safety import generate_safety_checks


def analyze_fault(request: FaultRequest):

    diagnosis = generate_diagnosis(
        request.equipment,
        request.fault,
        request.symptoms,
    )

    safety_checks = generate_safety_checks(request.equipment)

    return {
        "assessment": diagnosis["assessment"],
        "safety_checks": safety_checks,
        "diagnostic_steps": diagnosis["steps"],
        "tools": diagnosis["tools"],
        "escalation": diagnosis["escalation"],
        "likely_causes": diagnosis["likely_causes"],
        "severity": diagnosis["severity"],
        "confidence": diagnosis["confidence"],
        "next_best_check": diagnosis["next_best_check"],
        "next_check": diagnosis.get("next_check"),
        "stop_conditions": diagnosis["stop_conditions"],
    }
