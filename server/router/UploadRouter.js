const express = require("express");
const router = express.Router();
const fs = require("fs");
const { db, genid } = require("../db/DbUtils");

router.post("/rich_editor_upload", async (req, res) => {
    if (!req.files) {
        res.send({
            errno: 1,
            message: "上传失败"
        });

        return;
    }

    let files = req.files;
    let ret_files = [];

    for (let file of files) {
        // 获取文件后缀名
        let file_ext = file.originalname.split(".").pop();

        // 生成新的文件名
        let new_file_name = genid.NextId() + "." + file_ext;

        // 修改文件名 + 移动文件的路径
        fs.renameSync(
            process.cwd() + "/public/upload/temp/" + file.filename, 
            process.cwd() + "/public/upload/" + new_file_name
        );
        ret_files.push("/upload/" + new_file_name);
    }

    res.send({
        errno: 0,
        data: {
            url: ret_files[0],
            alt: "上传成功",
        }
    });
});

module.exports = router;