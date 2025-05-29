const router = require("express").Router();
const Settings = require("../schemas/settings.schema");

router.post("/", async (req, res) => {
  const { userId, settings } = req.body;
  try {
    const newSettings = new Settings({ userId, settings });
    await newSettings.save();
    res.status(201).json(newSettings);
  } catch (error) {
    res.status(500).json({ error: "Failed to create settings" });
  }
});

router.put("/edit", async (req, res) => {
  const { userId, settings } = req.body;
  try {
    const updatedSettings = await Settings.findOneAndUpdate(
      { userId },
      { settings },
      { new: true }
    );
    res.status(200).json(updatedSettings);
  } catch (error) {
    res.status(500).json({ error: "Failed to update settings" });
  }
});
