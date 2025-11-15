const express = require("express");
const router = express.Router();
const controller = require("../controllers/boardController");

router.get("/categories", controller.getCategories);
router.get("/categories/:id/buttons", controller.getButtonsByCategory);
router.post("/buttons", controller.createButton);
router.put("/buttons/:id", controller.updateButton);
router.delete("/buttons/:id", controller.deleteButton);

module.exports = router;
