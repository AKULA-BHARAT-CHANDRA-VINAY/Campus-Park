/**
 * Layout Generator Utility for Smart Parking System
 * Ported from SlotDivisions.py
 */

// Slot dimensions (meters) - approximate for relative coordinate calculation
const SLOT_2W = { width: 1.0, length: 2.0 };
const SLOT_4W = { width: 2.5, length: 5.0 };
const LANE_WIDTH = 3.0;

/**
 * Generates parking slot layout for given area dimensions.
 * @param {number} areaWidth - Total width of the parking area
 * @param {number} areaLength - Total length of the parking area
 * @param {number} ratio2W - Proportion of 2W slots (0.0 to 1.0)
 * @returns {Array} List of slot objects with x, y, width, length, slotType
 */
export const generateLayout = (areaWidth, areaLength, ratio2W = 0.6) => {
    const slots = [];
    let y = 0.0;
    let remainingLength = areaLength;
    let currentRatio = ratio2W; // Start with requested ratio

    let rowCount = 0;

    // Safety check for infinite loops
    let maxRows = 1000;

    while (remainingLength >= Math.min(SLOT_2W.length, SLOT_4W.length) && rowCount < maxRows) {
        // Decide row type based on ratio logic (simple alternator weighted by ratio)
        // If ratio is 0.6, we want roughly 60% 2W rows. 
        // Simple heuristic: if random < ratio, make it 2W. 
        // For deterministic layout: we can alternate based on accumulated count or just block wise.
        // Let's stick to the logic from the Python script: "Alternate row type" + "ratio check"
        
        // However, the python script had `ratio_2w = 1 - ratio_2w` which flips it every row.
        // Let's implement a smoother distribution:
        const use2W = currentRatio >= 0.5;

        let slotW, slotL, slotType;

        if (use2W) {
            slotW = SLOT_2W.width;
            slotL = SLOT_2W.length;
            slotType = "2W";
        } else {
            slotW = SLOT_4W.width;
            slotL = SLOT_4W.length;
            slotType = "4W";
        }

        if (remainingLength < slotL) {
            break;
        }

        // Fit as many slots as possible in this row
        // Add some padding/margin for rendering nicely
        const slotsInRow = Math.floor(areaWidth / slotW);

        let x = 0.0;
        for (let i = 0; i < slotsInRow; i++) {
            slots.push({
                slotType: slotType,
                x: parseFloat(x.toFixed(2)),
                y: parseFloat(y.toFixed(2)),
                width: parseFloat(slotW.toFixed(2)),
                length: parseFloat(slotL.toFixed(2))
            });
            x += slotW;
        }

        // Move to next row (slot row + lane)
        y += slotL + LANE_WIDTH;
        remainingLength -= (slotL + LANE_WIDTH);
        rowCount++;

        // Adjust ratio for next row to keep balance
        // If we just added 2W, we might want 4W next if ratio demands it.
        // Simple alternation logic from Python script:
        currentRatio = 1 - currentRatio; 
    }

    return slots;
};
