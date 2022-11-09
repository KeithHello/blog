const express = require("express");
const router = express.Router();
const { db, genid } = require("../db/DbUtils");

router.get("/test", async (req, res) => {
    let out = await db.async.all("Select * From `admin`", []);

    res.send({
        id: genid.NextId(),
        out
    });
});

module.exports = router;