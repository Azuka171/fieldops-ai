
def generate_diagnosis(equipment: str, fault: str, symptoms: str):

    equipment_lower = equipment.lower()
    fault_lower = fault.lower()
    symptoms_lower = symptoms.lower()

    # ============================================================
    # MOTOR
    # ============================================================

    if "motor" in equipment_lower:

        # Motor trips / overload / high current
        if any(word in fault_lower for word in [
            "trip",
            "overload",
            "overcurrent",
            "high current",
        ]) or any(word in symptoms_lower for word in [
            "overload",
            "high current",
            "trips",
            "trip",
        ]):

            return {
                "assessment": (
                    "The motor trip condition may be associated with overload, "
                    "excessive current, supply imbalance, mechanical loading, "
                    "or a protection-system issue. Measurements are required "
                    "before confirming the root cause."
                ),
                "steps": [
                    "Confirm the motor identification, rated voltage, and operating condition.",
                    "Verify the approved isolation and electrical safety procedure.",
                    "Check incoming phase-to-phase supply voltage.",
                    "Check for voltage imbalance or missing phase.",
                    "Inspect the overload relay and protection settings.",
                    "Check motor running current against the nameplate rating.",
                    "Inspect motor terminals, cables, and contactor connections.",
                    "Check for abnormal mechanical loading or obstruction where applicable.",
                    "Perform approved insulation and winding tests where authorized.",
                ],
                "tools": [
                    "Digital multimeter",
                    "Clamp meter",
                    "Insulation resistance tester where authorized",
                    "Motor nameplate/documentation",
                    "Appropriate PPE",
                    "Approved electrical test equipment",
                ],
                "escalation": (
                    "Escalate to a qualified electrical engineer or maintenance "
                    "supervisor if the motor repeatedly trips, current remains "
                    "abnormally high, protection settings appear incorrect, "
                    "or mechanical/internal motor damage is suspected."
                ),
                "likely_causes": [
                    "Mechanical overload or excessive driven load",
                    "Voltage imbalance or phase loss",
                    "Excessive motor current",
                    "Incorrect or faulty overload protection",
                    "Loose or damaged motor/cable connection",
                    "Motor winding or insulation fault",
                ],
                
                "severity": "High",
                "confidence": "Medium",
                "next_best_check": (
                    "Measure motor current and compare operating temperature "
                    "with the approved motor limits."
                ),
                "next_check": {
                    "check": (
                        "Measure motor current and compare the operating temperature "
                        "with the approved motor limits."
                    ),
                    "expected": (
                        "Motor current remains within the approved operating range "
                        "and temperature is within the applicable operating limit."
                    ),
                    "if_normal": (
                        "Continue with cooling, mechanical loading, ventilation, "
                        "and maintenance-history checks."
                    ),
                    "if_abnormal": (
                        "Investigate excessive load, phase imbalance, cooling problems, "
                        "mechanical issues, or possible motor insulation/winding problems."
                    ),
                    "safety_note": (
                        "Perform electrical measurements only under approved isolation, "
                        "test, and authorization procedures."
                    ),
                    "reason": (
                        "This check helps determine whether the overheating is associated "
                        "with excessive electrical loading or an abnormal operating condition "
                        "before deeper mechanical or motor-health checks."
                    ),
                    "why_points": [
                        "Excessive motor current or electrical loading",
                        "Voltage imbalance or phase-related condition",
                        "Cooling or mechanical loading problem",
                    ],
                },

                "stop_conditions": [
                    "Visible burning, arcing, smoke, or severe overheating",
                    "Repeated protection trips",
                    "Suspected short circuit",
                    "Unsafe electrical condition",
                    "Test results outside approved limits",
                ],
            }

        # Motor does not start / contactor / control issue
        if any(word in fault_lower for word in [
            "not start",
            "won't start",
            "does not start",
            "cannot start",
        ]) or any(word in symptoms_lower for word in [
            "does not start",
            "won't start",
            "contactor does not pull",
            "contactor not pulling",
            "no control power",
            "no start command",
        ]):

            return {
                "assessment": (
                    "The motor may have a supply, control-circuit, contactor, "
                    "interlock, protection, or motor-side fault. The first "
                    "priority is to establish whether the start command and "
                    "control circuit are functioning."
                ),
                "steps": [
                    "Confirm motor identification and operating condition.",
                    "Verify the approved electrical isolation procedure.",
                    "Check incoming power availability where authorized.",
                    "Verify control-circuit supply.",
                    "Check start command and control signals.",
                    "Inspect contactor operation and coil condition.",
                    "Check overload relay and protective-device status.",
                    "Verify relevant interlocks and permissive signals.",
                    "Inspect motor terminals and accessible connections.",
                ],
                "tools": [
                    "Digital multimeter",
                    "Clamp meter",
                    "Control-circuit drawings",
                    "Motor documentation",
                    "Appropriate PPE",
                ],
                "escalation": (
                    "Escalate if control power is abnormal, protection devices "
                    "remain tripped, interlocks cannot be verified, or a motor "
                    "or control-system defect is suspected."
                ),
                "likely_causes": [
                    "Loss of control power",
                    "Faulty contactor or contactor coil",
                    "Overload relay operation",
                    "Control-circuit fault",
                    "Interlock or permissive not satisfied",
                    "Motor supply fault",
                ],
                "severity": "High",
                "confidence": "Medium",
                "next_best_check": (
                "Verify control power and determine whether the start "
                "command reaches the motor contactor/control circuit."
            ),

           "next_check": {
                "check": (
                    "Verify control power and determine whether the start "
                    "command reaches the motor contactor/control circuit."
                ),
                "expected": (
                    "Control power is present and the start command reaches "
                    "the contactor/control circuit."
                ),
                "if_normal": (
                    "Proceed to contactor, overload, interlock, and motor-side checks."
                ),
                "if_abnormal": (
                    "Investigate the control-power circuit, start command, "
                    "interlocks, or permissive signals."
                ),
                "safety_note": (
                    "Perform electrical testing only under approved isolation, "
                    "test, and authorization procedures."
                ),
                "reason": (
                    "This check helps determine whether the reported fault "
                    "originates from the control circuit or from the motor "
                    "and associated power equipment."
                ),

                "why_points": [
                    "Control circuit or permissive issue",
                    "Contactor, overload, or interlock issue",
                    "Equipment-side electrical fault",
                ],
                },

                "stop_conditions": [
                    "Exposed energized conductors",
                    "Burning, smoke, or arcing",
                    "Suspected short circuit",
                    "Repeated protection operation",
                    "Unsafe or unknown energy condition",
                ],
            }

        # Motor overheating
        if any(word in fault_lower for word in [
            "overheat",
            "overheating",
            "hot",
            "temperature",
        ]) or any(word in symptoms_lower for word in [
            "overheating",
            "high temperature",
            "runs hot",
            "hot after",
            "temperature rising",
        ]):

            return {
                "assessment": (
                    "The motor overheating condition may be related to excessive "
                    "load, electrical imbalance, inadequate cooling, bearing or "
                    "mechanical problems, or winding deterioration."
                ),
                "steps": [
                    "Confirm motor rating and normal operating temperature.",
                    "Verify approved safety and isolation requirements.",
                    "Measure motor current on all phases where authorized.",
                    "Check voltage balance.",
                    "Inspect ventilation and cooling paths.",
                    "Check for abnormal mechanical loading.",
                    "Inspect accessible bearings and coupling condition.",
                    "Review recent operating and maintenance history.",
                    "Perform approved insulation testing where authorized.",
                ],
                "tools": [
                    "Digital multimeter",
                    "Clamp meter",
                    "Infrared thermometer or thermal camera",
                    "Insulation resistance tester where authorized",
                    "Motor documentation",
                    "Appropriate PPE",
                ],
                "escalation": (
                    "Escalate for persistent overheating, abnormal current, "
                    "bearing or mechanical damage, insulation concerns, or "
                    "temperatures outside approved operating limits."
                ),
                "likely_causes": [
                    "Excessive mechanical load",
                    "Voltage imbalance or phase loss",
                    "Blocked or inadequate cooling",
                    "Bearing or coupling problem",
                    "High motor current",
                    "Winding or insulation deterioration",
                ],
                
                "severity": "High",
                "confidence": "Medium",
                "next_best_check": (
                    "Measure motor current and compare operating temperature "
                    "with the approved motor limits."
                ),
                "next_check": {
                    "check": (
                        "Measure motor current and compare the operating temperature "
                        "with the approved motor limits."
                    ),
                    "expected": (
                        "Motor current remains within the approved operating range "
                        "and temperature is within the applicable operating limit."
                    ),
                    "if_normal": (
                        "Continue with cooling, mechanical loading, ventilation, "
                        "and maintenance-history checks."
                    ),
                    "if_abnormal": (
                        "Investigate excessive load, phase imbalance, cooling problems, "
                        "mechanical issues, or possible motor insulation or winding problems."
                    ),
                    "safety_note": (
                        "Perform electrical measurements only under approved isolation, "
                        "test, and authorization procedures."
                    ),
                    "reason": (
                        "This check helps determine whether the overheating is associated "
                        "with excessive electrical loading or an abnormal operating condition "
                        "before deeper mechanical or motor-health checks."
                    ),
                    "why_points": [
                        "Excessive motor current or electrical loading",
                        "Voltage imbalance or phase-related condition",
                        "Cooling or mechanical loading problem",
                    ],
                },

                "stop_conditions": [
                    "Severe overheating",
                    "Burning smell or smoke",
                    "Visible insulation damage",
                    "Abnormal bearing noise",
                    "Repeated protection trips",
                ],
            }

        # General motor
        return {
            "assessment": (
                "The motor condition may involve electrical supply, protection, "
                "control circuitry, mechanical loading, or motor health."
            ),
            "steps": [
                "Confirm motor identification and operating condition.",
                "Review the reported fault and operating history.",
                "Verify the approved isolation procedure.",
                "Check supply condition where authorized.",
                "Inspect accessible connections.",
                "Check protection status.",
                "Review motor current and temperature where authorized.",
            ],
            "tools": [
                "Digital multimeter",
                "Clamp meter",
                "Motor documentation",
                "Appropriate PPE",
            ],
            "escalation": (
                "Escalate if abnormal electrical measurements, repeated trips, "
                "mechanical damage, or unsafe conditions are identified."
            ),
            "likely_causes": [
                "Electrical supply abnormality",
                "Protection operation",
                "Control-system issue",
                "Mechanical loading",
                "Motor connection fault",
                "Internal motor fault",
            ],
            "severity": "Medium",
            "confidence": "Low",
            "next_best_check": (
                "Confirm the motor operating condition and review available "
                "alarm, protection, and measurement information."
            ),
            "stop_conditions": [
                "Smoke or fire",
                "Severe overheating",
                "Arcing",
                "Suspected short circuit",
                "Unsafe electrical condition",
            ],
        }

    # ============================================================
    # TRANSFORMER
    # ============================================================

    if "transformer" in equipment_lower:

        if any(word in fault_lower for word in [
            "overheat",
            "overheating",
            "temperature",
        ]) or any(word in symptoms_lower for word in [
            "overheating",
            "high temperature",
            "hot",
            "temperature rising",
            "unusual humming",
        ]):

            return {
                "assessment": (
                    "The transformer overheating condition may involve overload, "
                    "cooling problems, abnormal supply conditions, connections, "
                    "or insulation/internal transformer faults."
                ),
                "steps": [
                    "Confirm transformer identification and rating.",
                    "Review operating load and recent loading history.",
                    "Check temperature indication and alarms.",
                    "Verify cooling system operation where applicable.",
                    "Check primary and secondary conditions where authorized.",
                    "Inspect accessible connections for overheating.",
                    "Check for abnormal noise, smell, leakage, or visible damage.",
                    "Review recent maintenance history.",
                    "Perform approved transformer tests within authorized scope.",
                ],
                "tools": [
                    "Digital multimeter",
                    "Clamp meter",
                    "Infrared thermometer or thermal camera",
                    "Transformer documentation",
                    "Appropriate PPE",
                ],
                "escalation": (
                    "Escalate immediately for severe overheating, abnormal noise, "
                    "oil leakage, insulation concerns, or suspected internal damage."
                ),
                "likely_causes": [
                    "Transformer overload",
                    "Cooling-system failure",
                    "Abnormal supply condition",
                    "Loose or overheated connection",
                    "Insulation deterioration",
                    "Internal transformer fault",
                ],
                "severity": "High",
                "confidence": "Medium",
                "next_best_check": (
                "Review transformer loading and temperature indication, "
                "then verify the cooling system condition."
                ),
                "next_check": {
                    "check": (
                        "Review the transformer loading and temperature indication, "
                        "then verify that the applicable cooling system is operating normally."
                    ),
                    "expected": (
                        "Transformer loading and temperature remain within the approved "
                        "operating limits and the cooling system is operating normally."
                    ),
                    "if_normal": (
                        "Continue with supply conditions, accessible connections, "
                        "temperature trends, and recent maintenance history."
                    ),
                    "if_abnormal": (
                        "Investigate excessive loading, cooling-system failure, abnormal "
                        "supply conditions, overheated connections, or possible transformer "
                        "insulation/internal faults according to site procedure."
                    ),
                    "safety_note": (
                        "Treat the transformer as energized unless it has been properly "
                        "isolated and verified de-energized under the approved site procedure. "
                        "Do not approach or inspect suspected arcing, severe overheating, "
                        "or damaged equipment."
                    ),
                    "reason": (
                        "This check helps determine whether the overheating is associated "
                        "with transformer loading or cooling performance before deeper "
                        "electrical or internal-fault investigation."
                    ),
                    "why_points": [
                        "Confirm whether transformer loading is excessive",
                        "Determine whether temperature is outside the approved operating range",
                        "Verify that the cooling system is functioning correctly",
                    ],
                },

                "stop_conditions": [
                    "Oil leakage",
                    "Smoke or fire",
                    "Severe overheating",
                    "Arcing",
                    "Suspected internal transformer fault",
                ],
            }

        return {
            "assessment": (
                "The reported transformer condition may involve supply, "
                "protection, connections, loading, insulation, or cooling."
            ),
            "steps": [
                "Confirm transformer identification, rating, and operating condition.",
                "Verify the approved isolation procedure before inspection.",
                "Check primary and secondary supply conditions where authorized.",
                "Inspect protection indicators and alarm/trip status.",
                "Check for abnormal temperature, noise, smell, or visible damage.",
                "Inspect accessible cable and terminal connections.",
                "Review recent loading and maintenance history.",
                "Perform approved transformer tests within authorized scope.",
            ],
            "tools": [
                "Digital multimeter",
                "Clamp meter",
                "Insulation resistance tester where authorized",
                "Transformer documentation",
                "Appropriate PPE",
                "Approved electrical test equipment",
            ],
            "escalation": (
                "Escalate immediately for repeated trips, overheating, oil leakage, "
                "abnormal noise, insulation concerns, or suspected internal damage."
            ),
            "likely_causes": [
                "Abnormal supply condition",
                "Overload",
                "Protection operation",
                "Loose or damaged connection",
                "Cooling problem",
                "Insulation or internal transformer fault",
            ],
            "severity": "High",
            "confidence": "Low",
            "next_best_check": (
                "Review the transformer alarm/trip indication and operating "
                "condition before performing authorized electrical tests."
            ),
            "stop_conditions": [
                "Oil leakage",
                "Smoke, fire, or severe overheating",
                "Arcing",
                "Repeated protection trips",
                "Suspected internal transformer fault",
            ],
        }

    # ============================================================
    # CIRCUIT BREAKER
    # ============================================================

    if "breaker" in equipment_lower or "circuit breaker" in equipment_lower:

        if any(word in fault_lower for word in [
            "trip",
            "trips",
            "short",
            "short circuit",
        ]) or any(word in symptoms_lower for word in [
            "trips immediately",
            "repeatedly trips",
            "short circuit",
            "arcing",
            "burning",
        ]):

            return {
                "assessment": (
                    "The breaker trip condition may be associated with overload, "
                    "short circuit, protection operation, control-circuit failure, "
                    "or a mechanical/electrical defect."
                ),
                "steps": [
                    "Identify the breaker and confirm its rating and protection function.",
                    "Review the trip indication and available fault information.",
                    "Verify the approved isolation procedure.",
                    "Inspect accessible connections and signs of overheating.",
                    "Check upstream and downstream conditions where authorized.",
                    "Verify control power and trip/close circuit operation where applicable.",
                    "Review protection settings against approved documentation.",
                    "Perform approved breaker testing within authorized scope.",
                ],
                "tools": [
                    "Digital multimeter",
                    "Clamp meter",
                    "Approved electrical test equipment",
                    "Breaker documentation",
                    "Appropriate PPE",
                ],
                "escalation": (
                    "Escalate for repeated trips, suspected short circuits, "
                    "protection abnormalities, overheating, mechanical defects, "
                    "or any condition outside the technician's authorized scope."
                ),
                "likely_causes": [
                    "Overload",
                    "Short circuit",
                    "Protection-system operation",
                    "Control-circuit failure",
                    "Loose or overheated connection",
                    "Breaker mechanical defect",
                ],
                "severity": "High",
                "confidence": "Medium",
                "next_best_check": (
                    "Review the breaker trip indication and available fault "
                    "information before attempting reset or further testing."
                ),
                "next_check": {
                    "check": (
                        "Review the breaker trip indication and available fault information "
                        "to determine whether the protection operated for an abnormal "
                        "electrical condition."
                    ),
                    "expected": (
                        "The trip indication and available fault information identify a "
                        "clear protection event, with no visible evidence of arcing, "
                        "burning, severe overheating, or enclosure damage."
                    ),
                    "if_normal": (
                        "Continue with approved inspection of upstream and downstream "
                        "conditions, protection settings, control-circuit status, and "
                        "recent operating or maintenance history."
                    ),
                    "if_abnormal": (
                        "Do not reset or re-energize the breaker. Follow the approved "
                        "isolation and escalation procedure and investigate the suspected "
                        "short circuit, arcing, overheating, protection abnormality, or "
                        "equipment damage within authorized scope."
                    ),
                    "safety_note": (
                        "Do not attempt to reset or test a breaker when a short circuit, "
                        "arcing, burning, severe overheating, or damaged enclosure is "
                        "suspected. Follow approved isolation, verification, and "
                        "authorization procedures."
                    ),
                    "reason": (
                        "This check helps establish why the breaker operated before any "
                        "reset or further testing, reducing the risk of re-energizing "
                        "a faulted circuit."
                    ),
                    "why_points": [
                        "Identify the reason for the protection operation",
                        "Check for evidence of short circuit, arcing, or overheating",
                        "Prevent inappropriate reset or re-energization of a faulted circuit",
                    ],
                },

                "stop_conditions": [
                    "Suspected short circuit",
                    "Arcing",
                    "Severe overheating",
                    "Repeated unexplained trips",
                    "Damaged breaker enclosure",
                ],
            }

        return {
            "assessment": (
                "The breaker condition may be associated with overload, short "
                "circuit, protection operation, control-circuit failure, or "
                "a mechanical/electrical defect."
            ),
            "steps": [
                "Identify the breaker and confirm its rating.",
                "Review available trip and protection information.",
                "Verify the approved isolation procedure.",
                "Inspect accessible connections.",
                "Check upstream and downstream conditions where authorized.",
                "Verify control-circuit operation where applicable.",
                "Review protection settings against approved documentation.",
            ],
            "tools": [
                "Digital multimeter",
                "Clamp meter",
                "Approved electrical test equipment",
                "Breaker documentation",
                "Appropriate PPE",
            ],
            "escalation": (
                "Escalate for repeated trips, suspected short circuits, protection "
                "abnormalities, overheating, or mechanical defects."
            ),
            "likely_causes": [
                "Overload",
                "Short circuit",
                "Protection-system operation",
                "Control-circuit failure",
                "Loose connection",
                "Mechanical defect",
            ],
            "severity": "High",
            "confidence": "Low",
            "next_best_check": (
                "Review the breaker trip indication and available fault information."
            ),
            "stop_conditions": [
                "Suspected short circuit",
                "Arcing",
                "Severe overheating",
                "Repeated unexplained trips",
                "Damaged enclosure",
            ],
        }

    # ============================================================
    # GENERATOR
    # ============================================================

    if "generator" in equipment_lower or "genset" in equipment_lower:

        if any(word in fault_lower for word in [
            "not start",
            "won't start",
            "does not start",
            "fail to start",
        ]) or any(word in symptoms_lower for word in [
            "does not start",
            "won't start",
            "cranks but",
            "no start",
        ]):

            return {
                "assessment": (
                    "The generator start failure may involve starting power, "
                    "fuel supply, control logic, protection, engine conditions, "
                    "or generator-side electrical systems."
                ),
                "steps": [
                    "Confirm generator identification and operating mode.",
                    "Review active alarms and shutdown indications.",
                    "Check starting battery condition where authorized.",
                    "Verify fuel availability and relevant indications.",
                    "Check emergency-stop status.",
                    "Review control-system permissives and start command.",
                    "Check generator protection status.",
                    "Inspect accessible electrical connections.",
                ],
                "tools": [
                    "Digital multimeter",
                    "Clamp meter",
                    "Generator documentation",
                    "Control-system information",
                    "Appropriate PPE",
                ],
                "escalation": (
                    "Escalate if shutdown protections remain active, starting "
                    "power is abnormal, fuel/engine faults are indicated, or "
                    "generator electrical faults are suspected."
                ),
                "likely_causes": [
                    "Weak or failed starting battery",
                    "Fuel supply problem",
                    "Emergency-stop activation",
                    "Control-system fault",
                    "Protection interlock",
                    "Engine or generator fault",
                ],
                "severity": "High",
                "confidence": "Medium",
                "next_best_check": (
                    "Review active alarms and confirm starting battery, emergency "
                    "stop, and generator permissive status."
                ),
                "next_check": {
                    "check": (
                        "Review active generator alarms and shutdown indications, "
                        "then confirm the starting battery, emergency-stop status, "
                        "and generator start permissives."
                    ),
                    "expected": (
                        "No active shutdown alarm is present, the starting battery "
                        "is within the approved operating condition, the emergency "
                        "stop is reset, and the required start permissives are satisfied."
                    ),
                    "if_normal": (
                        "Continue with fuel-system, control-system, starter, and "
                        "generator-side electrical checks according to the approved "
                        "site procedure."
                    ),
                    "if_abnormal": (
                        "Do not repeatedly attempt to start the generator. Investigate "
                        "the identified alarm, starting-system fault, emergency-stop "
                        "condition, or failed permissive within authorized scope."
                    ),
                    "safety_note": (
                        "Follow approved isolation, testing, and authorization procedures. "
                        "Do not bypass shutdown protections, interlocks, or emergency-stop "
                        "systems to force a generator start."
                    ),
                    "reason": (
                        "This check helps determine whether the start failure is caused "
                        "by a protection, control, or starting-system condition before "
                        "deeper engine or generator-side troubleshooting."
                    ),
                    "why_points": [
                        "Identify active alarms or shutdown conditions",
                        "Confirm starting-system readiness",
                        "Verify emergency-stop and start permissive status",
                    ],
                },

                "stop_conditions": [
                    "Fuel leak",
                    "Fire or smoke",
                    "Abnormal exhaust condition",
                    "Severe overheating",
                    "Repeated shutdown trips",
                ],
            }

        return {
            "assessment": (
                "The generator condition may involve fuel, starting, engine, "
                "control, protection, or electrical generation systems."
            ),
            "steps": [
                "Confirm generator identification and operating condition.",
                "Review active alarms and shutdown indications.",
                "Check operating parameters.",
                "Verify fuel and starting system status.",
                "Check generator protection indications.",
                "Inspect accessible electrical connections.",
                "Review recent operating and maintenance history.",
            ],
            "tools": [
                "Digital multimeter",
                "Clamp meter",
                "Generator documentation",
                "Appropriate PPE",
            ],
            "escalation": (
                "Escalate for repeated shutdowns, abnormal electrical output, "
                "fuel-system faults, engine problems, or unsafe conditions."
            ),
            "likely_causes": [
                "Fuel-system problem",
                "Starting-system problem",
                "Protection operation",
                "Control-system fault",
                "Engine condition",
                "Generator electrical fault",
            ],
            "severity": "High",
            "confidence": "Low",
            "next_best_check": (
                "Review active alarms, operating parameters, and protection status."
            ),
            "next_check": {
                "check": (
                    "Review active generator alarms and operating parameters, "
                    "then confirm the generator protection system shows normal status."
                ),
                "expected": (
                    "Operating parameters are within the approved range, no active "
                    "shutdown or protection alarm is present, and the generator is "
                    "operating under normal conditions."
                ),
                "if_normal": (
                    "Continue with fuel-system, engine, cooling, control, and "
                    "generator-side electrical checks according to the approved "
                    "site procedure."
                ),
                "if_abnormal": (
                    "Investigate the abnormal alarm, operating parameter, or "
                    "protection indication and follow the applicable isolation "
                    "and escalation procedure."
                ),
                "safety_note": (
                    "Do not bypass generator protection systems or continue operation "
                    "when unsafe conditions, abnormal temperatures, fuel leaks, smoke, "
                    "or repeated shutdowns are present."
                ),
                "reason": (
                    "This check establishes the current operating and protection "
                    "condition before deeper troubleshooting of the generator system."
                ),
                "why_points": [
                    "Identify active alarms or abnormal operating conditions",
                    "Confirm generator protection status",
                    "Determine whether the condition is operational or requires escalation",
                ],
            },

            "stop_conditions": [
                "Fuel leak",
                "Fire or smoke",
                "Severe overheating",
                "Repeated shutdowns",
                "Unsafe operating condition",
            ],
        }

    # ============================================================
    # COMPRESSOR
    # ============================================================

    if "compressor" in equipment_lower:

        if any(word in fault_lower for word in [
            "trip",
            "overload",
            "overheat",
            "pressure",
        ]) or any(word in symptoms_lower for word in [
            "high discharge pressure",
            "high pressure",
            "high temperature",
            "overload",
            "trips",
        ]):

            return {
                "assessment": (
                    "The compressor condition may involve electrical supply, "
                    "motor protection, control circuitry, instrumentation, "
                    "pressure/temperature conditions, or mechanical/process loading."
                ),
                "steps": [
                    "Confirm compressor identification and operating condition.",
                    "Review active alarms and trip indications.",
                    "Verify the approved isolation procedure.",
                    "Check electrical supply and protection status.",
                    "Review discharge and suction pressure indications.",
                    "Review temperature indications.",
                    "Check motor current where authorized.",
                    "Inspect accessible electrical connections.",
                    "Review recent maintenance and operating history.",
                ],
                "tools": [
                    "Digital multimeter",
                    "Clamp meter",
                    "Compressor documentation",
                    "Pressure/temperature instrumentation",
                    "Approved diagnostic instruments",
                    "Appropriate PPE",
                ],
                "escalation": (
                    "Escalate for repeated trips, abnormal pressure or temperature, "
                    "electrical protection operation, gas/process concerns, or "
                    "mechanical faults outside the technician's authorized scope."
                ),
                "likely_causes": [
                    "High discharge pressure",
                    "Motor overload",
                    "Electrical supply abnormality",
                    "Instrumentation fault",
                    "Mechanical loading",
                    "Cooling problem",
                ],
                "severity": "High",
                "confidence": "Medium",
                "next_best_check": (
                    "Review active compressor alarms, trips, pressure, and temperature "
                    "indications before further diagnosis."
                ),
                "next_check": {
                    "check": (
                        "Review the compressor discharge pressure and temperature indications "
                        "and confirm whether the high-pressure condition is still present."
                    ),
                    "expected": (
                        "Discharge pressure and temperature are within the approved operating "
                        "range and no active high-pressure protection indication remains."
                    ),
                    "if_normal": (
                        "Continue with alarm history, suction conditions, cooling, control "
                        "settings, and recent operating or maintenance history."
                    ),
                    "if_abnormal": (
                        "Investigate the high-pressure condition, including possible flow "
                        "restriction, control/instrumentation problems, cooling issues, or "
                        "other process conditions according to site procedure."
                    ),
                    "safety_note": (
                        "Treat the compressor and connected process system as potentially "
                        "pressurized. Follow approved isolation, depressurization, "
                        "authorization, and site safety procedures before intervention."
                    ),
                    "reason": (
                        "This check establishes whether the reported high-pressure condition "
                        "is still present and helps distinguish an active process condition "
                        "from an alarm or instrumentation issue."
                    ),
                    "why_points": [
                        "Confirm whether high discharge pressure is still present",
                        "Identify possible process or flow restriction",
                        "Check for abnormal temperature associated with the pressure condition",
                    ],
                },

                "stop_conditions": [
                    "Gas leak or suspected hazardous release",
                    "Fire or smoke",
                    "Severe overheating",
                    "Abnormal pressure condition",
                    "Repeated protection trips",
                ],
            }

        return {
            "assessment": (
                "The compressor condition may involve electrical supply, motor "
                "protection, control circuitry, instrumentation, or mechanical/"
                "process conditions."
            ),
            "steps": [
                "Confirm compressor identification and operating condition.",
                "Review active alarms and trip indications.",
                "Verify the approved isolation procedure.",
                "Check electrical supply and protection status.",
                "Inspect accessible electrical connections.",
                "Check motor current where authorized.",
                "Review relevant pressure, temperature, and control indications.",
                "Review recent maintenance and operating history.",
            ],
            "tools": [
                "Digital multimeter",
                "Clamp meter",
                "Compressor documentation",
                "Approved diagnostic instruments",
                "Appropriate PPE",
            ],
            "escalation": (
                "Escalate for repeated trips, abnormal pressure or temperature, "
                "electrical protection operation, or mechanical/process faults "
                "outside the technician's authorized scope."
            ),
            "likely_causes": [
                "Electrical supply abnormality",
                "Motor protection operation",
                "Control-system fault",
                "Instrumentation fault",
                "Mechanical loading",
                "Pressure or temperature abnormality",
            ],
        "severity": "High",
        "confidence": "Low",
        "next_best_check": (
            "Review active compressor alarms, trips, pressure, and temperature "
            "indications before further diagnosis."
        ),
        "next_check": {
            "check": (
                "Review the compressor operating condition, active alarms, "
                "pressure and temperature indications, and protection status."
            ),
            "expected": (
                "The compressor is operating within the approved range, no active "
                "shutdown or protection abnormality is present, and pressure and "
                "temperature indications are consistent with normal operation."
            ),
            "if_normal": (
                "Continue with electrical supply, control-system status, "
                "instrumentation, cooling, mechanical condition, and recent "
                "operating or maintenance-history checks."
            ),
            "if_abnormal": (
                "Investigate the abnormal alarm, pressure, temperature, protection "
                "indication, control condition, or mechanical/process issue according "
                "to the approved site procedure."
            ),
            "safety_note": (
                "Treat the compressor and connected process system as potentially "
                "pressurized and hazardous. Follow approved isolation, "
                "depressurization, testing, and authorization procedures before "
                "intervention."
            ),
            "reason": (
                "This check establishes the compressor's current operating and "
                "protection condition before deeper electrical, instrumentation, "
                "mechanical, or process troubleshooting."
            ),
            "why_points": [
                "Confirm normal compressor operating conditions",
                "Identify abnormal pressure or temperature conditions",
                "Check for active alarms or protection issues",
            ],
        },
            "stop_conditions": [
                "Gas leak or suspected hazardous release",
                "Fire or smoke",
                "Severe overheating",
                "Abnormal pressure condition",
                "Repeated protection trips",
            ],
        }

    # ============================================================
    # PUMP
    # ============================================================

    if "pump" in equipment_lower:

        if any(word in fault_lower for word in [
            "not pumping",
            "no flow",
            "low flow",
            "overheat",
            "trip",
        ]) or any(word in symptoms_lower for word in [
            "no flow",
            "low flow",
            "cavitation",
            "high vibration",
            "overheating",
            "motor trip",
        ]):

            return {
                "assessment": (
                    "The pump condition may involve electrical supply, motor "
                    "protection, suction/discharge conditions, cavitation, "
                    "mechanical loading, or pump-system restrictions."
                ),
                "steps": [
                    "Confirm pump identification and operating condition.",
                    "Review alarms and trip indications.",
                    "Verify approved isolation requirements.",
                    "Check motor supply and protection status.",
                    "Review suction and discharge pressure.",
                    "Check for abnormal vibration or noise.",
                    "Inspect accessible valves and connections.",
                    "Check motor current where authorized.",
                    "Review recent maintenance and operating history.",
                ],
                "tools": [
                    "Digital multimeter",
                    "Clamp meter",
                    "Pressure gauges",
                    "Vibration measurement equipment where available",
                    "Pump documentation",
                    "Appropriate PPE",
                ],
                "escalation": (
                    "Escalate for persistent low flow, cavitation, high vibration, "
                    "repeated trips, seal problems, or mechanical faults outside "
                    "the technician's authorized scope."
                ),
                "likely_causes": [
                    "Blocked or restricted flow path",
                    "Low suction condition",
                    "Cavitation",
                    "Motor overload",
                    "Mechanical damage",
                    "Valve or process-system issue",
                ],
                "severity": "Medium",
                "confidence": "Medium",
                "next_best_check": (
                    "Verify suction/discharge pressure and confirm that the pump "
                    "is receiving the expected flow conditions."
                ),
                "next_check": {
                    "check": (
                        "Verify the pump suction and discharge pressure indications "
                        "and confirm that the pump is receiving the expected flow conditions."
                    ),
                    "expected": (
                        "Suction and discharge conditions are within the approved operating "
                        "range, the expected flow path is available, and there is no clear "
                        "indication of severe restriction or abnormal hydraulic condition."
                    ),
                    "if_normal": (
                        "Continue with motor current, vibration, valve position, mechanical "
                        "condition, and recent operating or maintenance-history checks."
                    ),
                    "if_abnormal": (
                        "Investigate the abnormal suction or discharge condition, possible "
                        "flow restriction, cavitation, valve issue, or other process-system "
                        "condition according to the approved site procedure."
                    ),
                    "safety_note": (
                        "Treat the pump and connected piping as potentially pressurized. "
                        "Follow approved isolation, depressurization, testing, and "
                        "authorization procedures before intervention."
                    ),
                    "reason": (
                        "This check helps determine whether the reported pump condition "
                        "is associated with the hydraulic or process side before deeper "
                        "electrical or mechanical troubleshooting."
                    ),
                    "why_points": [
                        "Confirm suction and discharge conditions",
                        "Identify possible flow restriction or hydraulic abnormality",
                        "Check for conditions that could indicate cavitation or process problems",
                    ],
                },

                "stop_conditions": [
                    "Major leakage",
                    "Severe vibration",
                    "Fire or smoke",
                    "Severe overheating",
                    "Repeated protection trips",
                ],
            }

        return {
            "assessment": (
                "The pump condition may involve electrical, mechanical, hydraulic, "
                "or process-system factors."
            ),
            "steps": [
                "Confirm pump identification and operating condition.",
                "Review available alarms and operating indications.",
                "Verify approved isolation requirements.",
                "Check electrical supply and protection.",
                "Review suction and discharge conditions.",
                "Inspect accessible mechanical components.",
                "Review recent maintenance history.",
            ],
            "tools": [
                "Digital multimeter",
                "Clamp meter",
                "Pressure gauges",
                "Pump documentation",
                "Appropriate PPE",
            ],
            "escalation": (
                "Escalate for repeated trips, abnormal pressure, severe vibration, "
                "leakage, or mechanical faults."
            ),
            "likely_causes": [
                "Electrical supply issue",
                "Motor protection operation",
                "Flow restriction",
                "Hydraulic condition",
                "Mechanical fault",
                "Process-system problem",
            ],
            "severity": "Medium",
            "confidence": "Low",
           "next_best_check": (
                "Review pump operating condition and suction/discharge indications."
            ),
            "next_check": {
                "check": (
                    "Review the pump operating condition, suction and discharge "
                    "indications, and available alarm or protection status."
                ),
                "expected": (
                    "Pump operating conditions are within the approved range, "
                    "suction and discharge indications are normal, and no active "
                    "alarm or protection abnormality is present."
                ),
                "if_normal": (
                    "Continue with electrical supply, motor condition, mechanical "
                    "inspection, valve position, and recent operating or maintenance "
                    "history checks."
                ),
                "if_abnormal": (
                    "Investigate the abnormal pressure, alarm, protection indication, "
                    "mechanical condition, or process-system issue according to the "
                    "approved site procedure."
                ),
                "safety_note": (
                    "Treat the pump and connected piping as potentially pressurized "
                    "and mechanically hazardous. Follow approved isolation, "
                    "depressurization, testing, and authorization procedures before "
                    "intervention."
                ),
                "reason": (
                    "This check establishes the pump's current operating condition "
                    "before deeper electrical, mechanical, or hydraulic troubleshooting."
                ),
                "why_points": [
                    "Confirm normal pump operating conditions",
                    "Identify abnormal suction or discharge conditions",
                    "Check for active alarms or protection issues",
                ],
            },

            "stop_conditions": [
                "Major leakage",
                "Fire or smoke",
                "Severe vibration",
                "Severe overheating",
                "Unsafe condition",
            ],
        }

    # ============================================================
    # GENERIC ELECTRICAL EQUIPMENT
    # ============================================================

    return {
        "assessment": (
            "The reported equipment condition requires structured electrical "
            "and operational checks to identify the likely fault source."
        ),
        "steps": [
            "Confirm equipment identification and operating condition.",
            "Review the reported fault and observed symptoms.",
            "Verify the approved isolation and safety procedure.",
            "Check relevant supply and protection conditions where authorized.",
            "Inspect accessible connections and signs of damage.",
            "Review alarms, indications, and recent maintenance history.",
            "Perform approved diagnostic tests within authorized scope.",
        ],
        "tools": [
            "Digital multimeter",
            "Clamp meter",
            "Equipment documentation",
            "Approved electrical test equipment",
            "Appropriate PPE",
        ],
        "escalation": (
            "Escalate if the fault involves repeated protection operation, "
            "unsafe electrical conditions, abnormal measurements, or equipment "
            "damage outside the technician's authorized scope."
        ),
        "likely_causes": [
            "Electrical supply abnormality",
            "Protection operation",
            "Control-system fault",
            "Loose or damaged connection",
            "Mechanical or process condition",
            "Internal equipment fault",
        ],
        "severity": "Medium",
        "confidence": "Low",
        "next_best_check": (
            "Review available alarms, protection indications, operating "
            "conditions, and approved measurements."
        ),
        "next_check": {
            "check": (
                "Review available alarms and protection indications, confirm "
                "the equipment operating condition, and perform approved "
                "measurements within the technician's authorized scope."
            ),
            "expected": (
                "No active protection abnormality is present, operating "
                "conditions are within the approved range, and available "
                "measurements are consistent with normal operation."
            ),
            "if_normal": (
                "Continue with equipment-specific electrical, control, "
                "mechanical, or process checks using the applicable equipment "
                "documentation and site procedure."
            ),
            "if_abnormal": (
                "Investigate the abnormal alarm, protection indication, "
                "operating condition, or measurement and follow the applicable "
                "isolation and escalation procedure."
            ),
            "safety_note": (
                "Perform measurements and inspections only under approved "
                "isolation, testing, authorization, and electrical safety "
                "procedures. Do not work on energized equipment unless "
                "specifically authorized and the applicable procedure permits it."
            ),
            "reason": (
                "This check establishes the basic operating and protection "
                "condition before more equipment-specific troubleshooting."
            ),
            "why_points": [
                "Identify active alarms or protection conditions",
                "Confirm normal equipment operating status",
                "Establish a safe starting point for further diagnosis",
            ],
        },

        "stop_conditions": [
            "Smoke or fire",
            "Arcing",
            "Severe overheating",
            "Suspected short circuit",
            "Unsafe electrical condition",
        ],
    }

