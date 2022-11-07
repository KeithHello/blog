const express = require("express");
const router = express.Router();
const { db, genid } = require("../db/DbUtils");

// 添加博客
router.post("/_token/add", async (req, res) => {
  let { title, content, categoryId } = req.body;
  let id = genid.NextId();
  let createTime = new Date().getTime();

  const insert_sql =
    "Insert Into `blog` (`id`, `title`, `content`, `category_id`, `create_time`) Values (?, ?, ?, ?, ?)";
  let { err, rows } = await db.async.run(insert_sql, [
    id,
    title,
    content,
    categoryId,
    createTime,
  ]);

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

// 修改博客
router.put("/_token/update", async (req, res) => {
  let { id, title, content, categoryId } = req.body;
  const update_sql =
    "Update `blog` Set `title` = ?, `content` = ?, `category_id` = ? Where `id` = ?";
  let { err, rows } = await db.async.run(update_sql, [
    title,
    content,
    categoryId,
    id,
  ]);

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

// 删除博客
router.delete("/_token/delete", async (req, res) => {
  let { id } = req.body;
  const delete_sql = "Delete From `blog` Where `id` = ?";
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

// 查询博客
router.get("/search", async (req, res) => {
  /**
   * keyword 关键字
   * 作用于title和content和分类名称
   *
   * 分页
   * page 页码
   * pageSize 每页条数
   */

  let { keyword, categoryId, page, pageSize } = req.query;

  page = page || 1;
  pageSize = pageSize || 10;
  categoryId = categoryId || 0;
  keyword = keyword || "";

  let params = [];
  let whereSqls = [];
  if (categoryId) {
    whereSqls.push(" `category_id` = ? ");
    params.push(categoryId);
  }
  if (keyword) {
    whereSqls.push(" (`title` like ? or `content` like ?) ");
    params.push(`%${keyword}%`);
    params.push(`%${keyword}%`);
  }

  let whereSqlStr = "";
  if (whereSqls.length > 0) {
    whereSqlStr = " Where " + whereSqls.join(" and ");
  }

  // 查询分页内容
  let searchSql = `Select * From blog ${whereSqlStr} Order By create_time Desc Limit ?, ?`;
  let searchSqlParams = [...params, (page - 1) * pageSize, pageSize];

  // 查询数据总数
  let countSql = `Select count(*) as count From blog ${whereSqlStr}`;
  let countSqlParams = params;

  let searchResult = await db.async.all(searchSql, searchSqlParams);
  let countResult = await db.async.all(countSql, countSqlParams);

  if (!searchResult.err && !countResult.err) {
    res.send({
      code: 200,
      msg: "查询成功",
      data: {
        keyword,
        categoryId,
        page,
        pageSize,
        total: countResult.rows[0].count,
        list: searchResult.rows,
      },
    });
  } else {
    res.send({
      code: 500,
      msg: "查询失败",
    });
  }
});

module.exports = router;
