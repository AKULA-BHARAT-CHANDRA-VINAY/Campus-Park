def choose_strategy(predicted_2w_ratio):
    if predicted_2w_ratio > 0.7:
        return "2W_FIRST"
    elif predicted_2w_ratio < 0.3:
        return "4W_FIRST"
    else:
        return "MIXED"
