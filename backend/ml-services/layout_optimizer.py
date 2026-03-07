from SlotDivisions import generate_layout, evaluate_layout

def optimize_layout(area_width, area_length, ratio_2w):
    best = None
    best_layout = None

    for strategy in ["2W_FIRST", "4W_FIRST", "MIXED"]:
        layout = generate_layout(area_width, area_length, ratio_2w, strategy)
        metrics = evaluate_layout(layout, area_width, area_length, ratio_2w)

        if not best or metrics["score"] > best["score"]:
            best = metrics
            best_layout = layout

    return best_layout, best
