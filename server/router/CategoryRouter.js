const express = require("express");
const router = express.Router();
const { db, genid } = require("../db/DbUtils");

// 列表接口
router.get("/list", async (req, res) => {
  let { err, rows } = await db.async.all("Select * From `category` Order By `create_time`", []);

  if (!err) {
    res.send({
      code: 200,
      msg: "查询成功",
      rows,
    });
  } else {
    res.send({
      code: 500,
      msg: "查询失败",
    });
  }
});

// 添加接口
router.post("/_token/add", async (req, res) => {
  let { name } = req.body;
  let createTime = new Date().getTime();

  const insert_sql = "Insert Into `category` (`id`, `name`, `create_time`) Values (?, ?, ?)";
  let { err, rows } = await db.async.run(insert_sql, [genid.NextId(), name, createTime]);

  if (!err) {
    res.send({
      code: 200,
      msg: "添加成功",
    });
  } else {
    res.send({
      code: 500,
      msg: "添加失败",
    });
  }
});

// 修改接口
router.put("/_token/update", async (req, res) => {

  let { id, name } = req.body;
  const update_sql = "Update `category` Set `name` = ? Where `id` = ?";
  let { err, rows } = await db.async.run(update_sql, [name, id]);

  if (!err) {
    res.send({
      code: 200,
      msg: "修改成功",
    });
  } else {
    res.send({
      code: 500,
      msg: "修改失败",
    });
  }
});

// 删除接口 /category/delete?id=1
router.delete("/_token/delete", async (req, res) => {
  let id = req.query.id;
  const delete_sql = "Delete From `category` Where `id` = ?";
  let { err, rows } = await db.async.run(delete_sql, [id]);

  if (!err) {
    res.send({
      code: 200,
      msg: "删除成功",
    });
  } else {
    res.send({
      code: 500,
      msg: "删除失败",
    });
  }
});

module.exports = router;
