import express from "express";
import DeptOfftake from "../models/deptOfftakeModel.js";
import deptOfftake_model from "../models/deptOfftakeModel.js";

import multer from "multer";
import path from "path";
import fs from "fs";


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads/deptLogos";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

const deptOfftakeRouter = express.Router();

// Get all department offtake records
deptOfftakeRouter.get("/api/getDeptOfftake", async (req, res) => {
  try {
    const data = await DeptOfftake.find();
    res.status(200).json({ Status: "Success", data });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get department offtake by depId
deptOfftakeRouter.get("/api/getDeptOfftake/:depId", async (req, res) => {
  try {
    const { depId } = req.params;
    const data = await DeptOfftake.findOne({ depId });
    if (!data) return res.status(404).json({ message: "Not found" });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

deptOfftakeRouter.get("/api/offtake-summary", async (req, res) => {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    const month = now.getMonth() + 1;

    //  India FY: April - March
    const fyStartYear = month >= 4 ? currentYear : currentYear - 1;
    const fyEndYear = fyStartYear + 1;
    const currentFY = `${fyStartYear}-${fyEndYear}`;

    const depts = await deptOfftake_model.find({});

    let totalCurrYearOfftakeTarget = 0;
    let totalCurrYearOfftakeAchived = 0;
    let totalOfftakeTarget = 0;
    let totalOfftakeAchived = 0;

    depts.forEach((dept) => {
      // ---- Annual Targets ----
      dept.annualTarget?.forEach((t) => {
        const targetVal = parseFloat(t.offtakeTarget) || 0;
        totalOfftakeTarget += targetVal;

        if (t.finYear === currentFY) {
          totalCurrYearOfftakeTarget += targetVal;
        }
      });

      // ---- Offtake Data ----
      dept.offtakeData?.forEach((o) => {
        const offVal = parseFloat(o.offtakeValue) || 0;
        totalOfftakeAchived += offVal;

        const oDate = new Date(o.offtakeDate);
        const oYear = oDate.getFullYear();
        const oMonth = oDate.getMonth() + 1;

        const oFyStart = oMonth >= 4 ? oYear : oYear - 1;
        const oFyEnd = oFyStart + 1;
        const oFY = `${oFyStart}-${oFyEnd}`;

        if (oFY === currentFY) {
          totalCurrYearOfftakeAchived += offVal;
        }
      });
    });

    res.json({
      totalCurrYearOfftakeTarget,
      totalCurrYearOfftakeAchived,
      totalOfftakeTarget,
      totalOfftakeAchived,
    });
  } catch (error) {
    console.error("Error in /api/offtake-summary:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create a new department offtake record
// deptOfftakeRouter.post("/api/createDeptOfftake", async (req, res) => {
//     try {
//         const newDeptOfftake = new DeptOfftake(req.body);
//         await newDeptOfftake.save();
//         res.status(201).json(newDeptOfftake);
//     } catch (error) {
//         res.status(400).json({ message: "Error saving data", error });
//     }
// });

deptOfftakeRouter.post("/api/createDeptOfftake", async (req, res) => {
  try {
    // console.log(req.body);

    const newDeptOfftakes = await DeptOfftake.insertMany(req.body); // Accepts an array
    res.status(201).json(newDeptOfftakes);
  } catch (error) {
    console.log(error);

    res.status(400).json({ message: "Error saving data", error });
  }
});

// Update an existing department offtake record
// deptOfftakeRouter.put(api/updateDeptOfftake/:depId", async (req, res) => {
//     try {
//         const { depId } = req.params;
//         const updatedData = await DeptOfftake.findOneAndUpdate(
//             { depId },
//             req.body,
//             { new: true, runValidators: true }
//         );
//         if (!updatedData) return res.status(404).json({ message: "Not found" });
//         res.status(200).json(updatedData);
//     } catch (error) {
//         res.status(400).json({ message: "Error updating data", error });
//     }
// });

// deptOfftakeRouter.put("/api/updateDeptOfftake", async (req, res) => {
//   try {
//     const updates = req.body;

//     const filteredUpdates = updates.filter((update) =>
//       update.offtakeData?.some(
//         (entry) => entry.offtakeValue && Number(entry.offtakeValue) !== 0
//       )
//     );

//     const updatePromises = filteredUpdates.map((update) => {
//       const validEntries = update.offtakeData.filter(
//         (entry) => entry.offtakeValue && Number(entry.offtakeValue) !== 0
//       );

//       return DeptOfftake.findOneAndUpdate(
//         { department: update.department },
//         { $push: { offtakeData: { $each: validEntries } } },
//         { new: true, runValidators: true }
//       );
//     });

//     const updatedRecords = await Promise.all(updatePromises);

//     res.status(200).json(updatedRecords);
//   } catch (error) {
//     console.error("Update Error:", error);
//     res.status(400).json({ message: "Error updating data", error });
//   }
// });

deptOfftakeRouter.put("/api/updateDeptOfftake", async (req, res) => {
  try {
    const updates = req.body;

    const filteredUpdates = updates.filter((update) =>
      update.offtakeData?.some(
        (entry) => entry.offtakeValue && Number(entry.offtakeValue) !== 0
      )
    );

    const results = [];

    for (const update of filteredUpdates) {
      const validEntries = update.offtakeData.filter(
        (entry) => entry.offtakeValue && Number(entry.offtakeValue) !== 0
      );

      // 🔍 Check if department exists
      let dept = await DeptOfftake.findOne({
        department: update.department,
      });

      // 🆕 Create if not exists
      if (!dept) {
        // Get latest depId
        const lastDept = await DeptOfftake.findOne({})
          .sort({ createdAt: -1 })
          .select("depId");

        let nextNumber = 1;
        if (lastDept?.depId) {
          nextNumber = parseInt(lastDept.depId.replace("D", "")) + 1;
        }

        const newDepId = `D${String(nextNumber).padStart(3, "0")}`;

        dept = await DeptOfftake.create({
          depId: newDepId,
          department: update.department,
          fullName: update.department,
          abbreviation: update?.abbreviation || update.department,
          TotalOfftake: "0",
          annualTarget: [],
          offtakeData: [],
        });
      }

      // ➕ Push new offtake entries
      dept.offtakeData.push(...validEntries);
      await dept.save();

      results.push(dept);
    }

    res.status(200).json({
      Status: "Success",
      data: results,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(400).json({
      Status: "Error",
      message: "Error updating data",
      error,
    });
  }
});


// deptOfftakeRouter.put("/api/updateDeptOfftakeTarget", async (req, res) => {
//     try {
//         const updates = req.body; // Expecting an array of department updates

//         const updatePromises = updates.map(async (update) => {
//             const deptRecord = await DeptOfftake.findOne({ department: update.department });

//             if (!deptRecord) {
//                 return null;
//             }

//             // Update or push annualTarget entries
//             update.annualTarget?.forEach(newTarget => {
//                 const existingTarget = deptRecord.annualTarget.find(
//                     t => t.finYear === newTarget.finYear
//                 );

//                 if (existingTarget) {
//                     existingTarget.offtakeTarget = newTarget.offtakeTarget;
//                 } else {
//                     deptRecord.annualTarget.push(newTarget);
//                 }
//             });

//             // Optionally update offtakeData as well, if present
//             if (update.offtakeData && update.offtakeData.length > 0) {
//                 deptRecord.offtakeData.push(...update.offtakeData);
//             }

//             return deptRecord.save();
//         });

//         const updatedRecords = await Promise.all(updatePromises);

//         res.status(200).json(updatedRecords);
//     } catch (error) {
//         console.error("Update error:", error);
//         res.status(400).json({ message: "Error updating data", error });
//     }
// });

deptOfftakeRouter.put("/api/updateDeptOfftakeTarget", async (req, res) => {
  try {
    const updates = req.body;

    // Helper function to generate next depId
    const generateNextDepId = async () => {
      const lastRecord = await DeptOfftake.findOne({})
        .sort({ depId: -1 }) // Sort descending
        .collation({ locale: "en", numericOrdering: true }); // Ensure numeric sort on string

      if (!lastRecord || !lastRecord.depId) return "D001";

      const lastNumber = parseInt(lastRecord.depId.replace("D", "")) || 0;
      const nextNumber = lastNumber + 1;
      return `D${String(nextNumber).padStart(3, "0")}`;
    };

    const updatePromises = updates.map(async (update) => {
      let deptRecord = await DeptOfftake.findOne({
        department: update.department,
      });

      if (!deptRecord) {
        const newDepId = await generateNextDepId();
        deptRecord = new DeptOfftake({
          department: update.department,
          depId: newDepId,
          annualTarget: [],
          offtakeData: [],
        });
      }

      // Update or push annualTarget entries
      update.annualTarget?.forEach((newTarget) => {
        const existingTarget = deptRecord.annualTarget.find(
          (t) => t.finYear === newTarget.finYear
        );

        if (existingTarget) {
          existingTarget.offtakeTarget = newTarget.offtakeTarget;
        } else {
          deptRecord.annualTarget.push(newTarget);
        }
      });

      // Append to offtakeData if present
      if (update.offtakeData && update.offtakeData.length > 0) {
        deptRecord.offtakeData.push(...update.offtakeData);
      }

      return deptRecord.save();
    });

    const updatedRecords = await Promise.all(updatePromises);

    res.status(200).json(updatedRecords);
  } catch (error) {
    console.error("Update error:", error);
    res.status(400).json({ message: "Error updating data", error });
  }
});



deptOfftakeRouter.post(
  "/api/update_dept",
  upload.any(), // accept multiple files
  async (req, res) => {
    try {
      const deptDetails = JSON.parse(req.body.deptDetails);

      const filesMap = {};
      if (req.files) {
        req.files.forEach(file => {
          filesMap[file.fieldname] = file.path;
        });
      }

      for (const deptData of deptDetails) {
        const { depId, fullName, abbr } = deptData;

        const dept = await deptOfftake_model.findOne({ depId });
        if (!dept) continue;

        dept.fullName = fullName;
        dept.abbreviation = abbr;

        // LOGO HANDLING
        const logoField = `logo_${depId}`;
        if (filesMap[logoField]) {
          dept.logo = filesMap[logoField];
        }

        await dept.save();
      }

      res.status(200).json({ Status: "Success" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ Status: "Error", error });
    }
  }
);




// deptOfftakeRouter.post("/api/update_dept", async (req, res) => {
//   try {
//     const { deptDetails } = req.body;

//     console.log(req.body);

//     if (!Array.isArray(deptDetails)) {
//       return res.status(400).json({ message: "Invalid request body" });
//     }

//     for (const { depId, fullName, abbr } of deptDetails) {
//       const dept = await deptOfftake_model.findOne({ depId });

//       if (!dept) {
//         console.log(`${depId} not found`);

//         continue; // Skip if dept not found
//       }

//       dept.fullName = fullName;
//       dept.abbreviation = abbr;

//       await dept.save();
//     }

//     return res.status(200).json({ Status: "Success" });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Internal Server Error", error });
//   }
// });

deptOfftakeRouter.delete("/api/cleanDept", async (req, res) => {
  try {
    const result = await deptOfftake_model.updateMany(
      {}, // match all
      { $set: { annualTarget: [], offtakeData: [] } }
    );

    res.json({
      success: true,
      message: "All department offtake targets and data cleared.",
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error("Error clearing deptOfftake:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
});

export default deptOfftakeRouter;
