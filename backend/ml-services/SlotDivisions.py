from dataclasses import dataclass
from typing import List, Dict

SLOT_2W = (1.0, 2.0)
SLOT_4W = (2.5, 5.0)
DEFAULT_LANE = 3.0


@dataclass
class Slot:
    slot_type: str
    x: float
    y: float
    width: float
    length: float


def generate_layout(
    area_width: float,
    area_length: float,
    ratio_2w: float,
    strategy: str,
    lane_width: float = DEFAULT_LANE
) -> List[Slot]:

    slots: List[Slot] = []
    y = 0.0

    while y < area_length:

        if strategy == "2W_FIRST":
            is_2w_row = True
        elif strategy == "4W_FIRST":
            is_2w_row = False
        else:  # MIXED
            is_2w_row = (len(slots) % 2 == 0)

        if is_2w_row and ratio_2w > 0:
            w, l = SLOT_2W
            slot_type = "2W"
        else:
            w, l = SLOT_4W
            slot_type = "4W"

        if y + l > area_length:
            break

        x = 0.0
        while x + w <= area_width:
            slots.append(Slot(slot_type, x, y, w, l))
            x += w

        y += l + lane_width

    return slots


def evaluate_layout(slots, area_width, area_length, target_ratio):
    used_area = sum(s.width * s.length for s in slots)
    total_area = area_width * area_length
    wasted_area = total_area - used_area

    two_w = sum(1 for s in slots if s.slot_type == "2W")
    total = len(slots)

    actual_ratio = two_w / total if total else 0
    ratio_error = abs(actual_ratio - target_ratio)

    score = (
        total * 10
        - wasted_area * 0.2
        - ratio_error * 100
    )

    return {
        "score": round(score, 2),
        "total_slots": total,
        "actual_2w_ratio": round(actual_ratio, 2),
        "wasted_area": round(wasted_area, 2)
    }
