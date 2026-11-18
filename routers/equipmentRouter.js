const router = require("express").Router();
const c = require("../controllers/equipmentController");
const upload = require("../utils/upload");

router.get("/", c.getAll);
router.get("/:id", c.getOne);
router.post("/", upload.single("image"), c.create);
router.put("/:id", upload.single("image"), c.update);
router.delete("/:id", c.remove);

module.exports = router;

