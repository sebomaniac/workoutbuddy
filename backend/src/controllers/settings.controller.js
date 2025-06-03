const router = require("express").Router();
const Settings = require("../schemas/settings.schema");

router.put("/save", async (req, res) => {
  const userId = req.user.id;
  const { settings } = req.body;
  try {
    const updatedSettings = await Settings.findOneAndUpdate(
      { userId },
      { settings },
      { new: true, upsert: true }
    );
    res.status(200).json(updatedSettings);
  } catch (error) {
    console.error('Error saving settings:', error);
    res.status(500).json({ error: "Failed to save settings" });
  }
});

router.get("/get", async (req, res) => {
  const userId = req.user.id;
  try {
    const settings = await Settings.findOne({ userId });
    if (!settings) {
      return res.status(200).json({ userId, settings: {} });
    }
    res.status(200).json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: "Failed to get settings" });
  }
});

module.exports = router;
