const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();
const { db, genid } = require("./db/DbUtils");
const port = 8080;

// 跨域请求
app.use((req, res, next) => {
  // 设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin", "*");
  // 允许的header类型
  res.header("Access-Control-Allow-Headers", "*");
  // 跨域允许的请求方式
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  req.method === "OPTIONS" ? res.sendStatus(200) : next();
});

// JSON解析
app.use(express.json());

// 上传文件
const update = multer({ dest: "./public/upload/temp" });
app.use(update.any());
app.use(express.static(path.join(__dirname, "public")));

// 中间件
const TOKEN_PATH = "/_token";
app.all("*", async (req, res, next) => {
    if (req.path.indexOf(TOKEN_PATH) > -1) {
        let token = req.headers.token;
        let admin_token_sql = "Select * From `admin` Where `token` = ?";
        let adminResult = await db.async.all(admin_token_sql, [token]);
        if (adminResult.err || adminResult.rows.length === 0) {
            res.send({
                code: 403,
                msg: "请先登录",
            });
            return;
        } else {
            next();
        }
    } else {
        next();
    }
});

// 路由
app.use("/test", require("./router/TestRouter"));
app.use("/admin", require("./router/AdminRouter"));
app.use("/category", require("./router/CategoryRouter"));
app.use("/blog", require("./router/BlogRouter"));
app.use("/upload", require("./router/UploadRouter"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
