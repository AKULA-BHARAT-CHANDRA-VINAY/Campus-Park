import mongoose from "mongoose";
import dotenv from "dotenv";
import ParkingArea from "../models/parkingAreaModel.js";
import ParkingSlot from "../models/parkingSlotModel.js";

dotenv.config({ path: ".env" });

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("DB connected for seeding");
};

const generateSlots = async (area, prefix, twoW, fourW) => {
  const slots = [];

  for (let i = 1; i <= twoW; i++) {
    slots.push({
      area: area._id,
      slotNumber: `${prefix}-2W-${String(i).padStart(3, "0")}`,
      slotType: "2W"
    });
  }

  for (let i = 1; i <= fourW; i++) {
    slots.push({
      area: area._id,
      slotNumber: `${prefix}-4W-${String(i).padStart(3, "0")}`,
      slotType: "4W"
    });
  }

  await ParkingSlot.insertMany(slots);
};

const seedParking = async () => {
  try {
    await connectDB();

    await ParkingArea.deleteMany();
    await ParkingSlot.deleteMany();

    console.log("Old parking data cleared");

    const areas = [
      {
        name: "Main Gate Parking",
        allowedRoles: ["student"],
        slotsConfig: { twoWheeler: 200, fourWheeler: 0 },
        prefix: "MG"
      },
      {
        name: "Beside Basketball Court",
        allowedRoles: ["student", "outsider"],
        slotsConfig: { twoWheeler: 50, fourWheeler: 20 },
        prefix: "BBC"
      },
      {
        name: "CSE Beside",
        allowedRoles: ["faculty"],
        slotsConfig: { twoWheeler: 20, fourWheeler: 10 },
        prefix: "CSE"
      },
      {
        name: "Mech Beside",
        allowedRoles: ["faculty"],
        slotsConfig: { twoWheeler: 15, fourWheeler: 6 },
        prefix: "MECH"
      },
      {
        name: "DE Dept",
        allowedRoles: ["faculty"],
        slotsConfig: { twoWheeler: 10, fourWheeler: 5 },
        prefix: "DE"
      },
      {
        name: "Civil Pond Side",
        allowedRoles: ["faculty"],
        slotsConfig: { twoWheeler: 10, fourWheeler: 5 },
        prefix: "CIVIL"
      }
    ];

    for (const areaData of areas) {
      const { prefix, slotsConfig, ...areaFields } = areaData;

      const area = await ParkingArea.create(areaFields);

      await generateSlots(
        area,
        prefix,
        slotsConfig.twoWheeler,
        slotsConfig.fourWheeler
      );

      console.log(`Seeded: ${area.name}`);
    }

    console.log("✅ Parking areas & slots seeded successfully");
    process.exit();

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedParking();