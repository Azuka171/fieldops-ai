def generate_safety_checks(equipment: str) -> list[str]:
    return [
        "Follow the applicable site safety procedure.",
        "Identify and isolate all relevant energy sources.",
        "Apply lockout/tagout requirements where applicable.",
        "Verify absence of hazardous energy before intervention.",
        "Use appropriate PPE and approved test instruments.",
        "Do not bypass protective devices.",
        "Stop work and escalate if conditions become unsafe.",
    ]