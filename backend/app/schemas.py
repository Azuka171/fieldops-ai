from pydantic import BaseModel


class FaultRequest(BaseModel):
    equipment: str
    fault: str
    symptoms: str
class NextCheck(BaseModel):
    check: str
    expected: str
    if_normal: str
    if_abnormal: str
    safety_note: str
    reason: str
    why_points: list[str]


class FaultResponse(BaseModel):
    assessment: str
    safety_checks: list[str]
    diagnostic_steps: list[str]
    tools: list[str]
    escalation: str
    likely_causes: list[str]
    severity: str
    confidence: str
    next_best_check: str
    next_check: NextCheck | None = None
    stop_conditions: list[str]