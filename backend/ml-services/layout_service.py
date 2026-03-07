from layout_optimizer import optimize_layout
from layout_strategy_selector import choose_strategy

def generate_parking_layout(area_width, area_length, predicted_ratio):
    strategy = choose_strategy(predicted_ratio)
    layout, metrics = optimize_layout(area_width, area_length, predicted_ratio)

    return {
        "strategy": strategy,
        "metrics": metrics,
        "slots": [s.__dict__ for s in layout]
    }
