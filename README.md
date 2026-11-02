# ForPC 项目主页

网址：https://roboforpc.github.io/

页面只有一个文件 `index.html`，推送到 `main` 分支后 GitHub Pages 会自动更新（通常 1~2 分钟）。

## 改文字

打开 `index.html`，搜索 `TODO`，每一处注释都写了要填什么：标题、作者、单位、期刊、按钮链接、摘要、BibTeX。

## 页面结构

| 部分 | 内容 |
|---|---|
| 首屏视频 | 长路径连续任务，4 倍速 |
| Velocity Command Tracking | vx / vy / ωz 三个标签页；按钮切换负载和方向；每个工况两个视角并排 |
| Trajectory Following | 三条轨迹，正面 + 侧面 |
| Long-Horizon Delivery | 两条长路径、一条短路径 |
| Method | 方法简介 + 仿真渲染图 |

## 视频文件

视频在 `static/videos/`，封面帧在 `static/images/posters/`（同名 `.jpg`）。命名规则：

| 文件 | 原始视频（`D:\Video_CJME`） | 倍速 |
|---|---|---|
| `teaser.mp4` | `长路径连续任务` | 4× |
| `vx_front.mp4` / `vx_side.mp4` | `soomth_ground_vx/0.3-vx`、`0.3-vx-side` | 2× |
| `vy_<0kg\|12kg>_<left\|right>_<front\|top>.mp4` | `soomth_ground_vy/*`（`upper` = 高机位，对应 `top`） | 2× |
| `wz_<0kg\|12kg\|25kg>_<front\|top>.mp4` | `soomth_ground_wz/*` | 2× |
| `traj_<1\|2\|3>_<front\|side>.mp4` | `tragectory/*`、`tragectory_side/*` | 3× |
| `delivery_long_1/2.mp4`、`delivery_short.mp4` | `长路径运送1/2`、`短路径运送1` | 4× / 3× |

视频文件还没放进来时，页面上会显示一个写着文件路径的虚线占位框。

压缩命令（宽 960、去掉声音、2 倍速）：

```bash
ffmpeg -i input.mp4 -an -vf "setpts=PTS/2,fps=30,scale=960:-2" -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p -movflags +faststart output.mp4
```

封面帧：

```bash
ffmpeg -i output.mp4 -frames:v 1 -q:v 4 poster.jpg
```

## 图片

| 文件 | 来源（`E:\CJME_Push_car\output\paper_figures`） |
|---|---|
| `timelapse_vx.jpg` | `real_timelapse/straight_vx_0p3_path.png` |
| `timelapse_vy.jpg` | `real_timelapse/lateral_vy_12p5kg_4poses_path.png` |
| `timelapse_wz.jpg` | `real_timelapse/turning_wz_25kg_path_handle.png` |
| `timelapse_wz_grid.jpg` | `real_timelapse/turning_wz_load_grid.png` |
| `render_side34.jpg` | `side34.png` |
| `social_preview.jpg` | 首屏视频截图，链接分享卡片用（1200×630） |

## 本地预览

```bash
npx http-server -p 8000
```

然后打开 http://localhost:8000 。

## 致谢

页面基于 [Academic Project Page Template](https://github.com/eliahuhorwitz/Academic-project-page-template)，源自 [Nerfies](https://nerfies.github.io/) 项目主页，遵循 [CC BY-SA 4.0](http://creativecommons.org/licenses/by-sa/4.0/) 许可。
