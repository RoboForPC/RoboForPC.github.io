# ForPC 项目主页

网址：https://roboforpc.github.io/

页面只有一个文件 `index.html`，推送到 `main` 分支后 GitHub Pages 会自动更新（通常 1~2 分钟）。

## 改文字

打开 `index.html`，搜索 `TODO`，每一处注释都写了要填什么：标题、作者、单位、会议、按钮链接、摘要、方法、结果、BibTeX。

## 放图片和视频

按下面的文件名放进对应文件夹即可，不用改代码。文件还没放进来时，页面上会显示一个写着文件路径的虚线占位框。

| 文件 | 内容 | 建议 |
|---|---|---|
| `static/videos/teaser.mp4` | 首屏视频 | 10~30 秒，静音循环，< 10MB |
| `static/videos/real_1.mp4` … `real_4.mp4` | 真机实验，每个任务一段 | 每段 < 10MB |
| `static/images/method_overview.png` | 方法框图 | 宽 2000px 左右 |
| `static/images/results.png` | 结果图/表 | 宽 2000px 左右 |
| `static/images/social_preview.png` | 链接分享卡片图 | 1200×630 |

完整的长视频请上传到 YouTube 或 B 站，然后按 `index.html` 里 Video 部分的注释嵌入，不要直接放进仓库。

压缩视频（需要 ffmpeg）：

```bash
ffmpeg -i input.mp4 -vcodec libx264 -crf 28 -preset slow -an -vf "scale=1280:-2" output.mp4
```

`-an` 去掉声音，`scale=1280:-2` 缩到 720p 宽度。

## 本地预览

```bash
npx http-server -p 8000
```

然后打开 http://localhost:8000 。

## 致谢

页面基于 [Academic Project Page Template](https://github.com/eliahuhorwitz/Academic-project-page-template)，源自 [Nerfies](https://nerfies.github.io/) 项目主页，遵循 [CC BY-SA 4.0](http://creativecommons.org/licenses/by-sa/4.0/) 许可。
