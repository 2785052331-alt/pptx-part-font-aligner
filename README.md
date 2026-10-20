# PPTX Part Font Aligner

把 PPT 里**某一个章节**的所有字体（含配图上的文字）统一到指定大小，同时保证排版不溢出。

针对的真实场景：一份 29 页的课堂演示，第 20-23 页（第五部分）正文 18pt、小标题 20pt、角标 24pt；而第 24-28 页（第六部分）正文只有 9-11pt。目标是把第六部分对齐到第五部分。

---

## 核心难点

这个任务有三个坑，前两个是技术问题，第三个是我自己踩的：

### 1. 图内文字不能靠缩放图片解决

第五部分有 5 张配图是流程图/时间轴，图上的文字（"PUSH"、"70%"、"Phase 1"）是内容的一部分。原图是 1589×748 位图，图上文字实际只有 **18-33px 高**，要达到等效 18pt 需要 **60px 以上**。直接放大图片，文字会糊成一团。

**解法**：提取原图的设计令牌（配色、圆角半径、卡片布局、箭头样式），用 PIL 按相同视觉语言重绘，字号直接按 pt→px 换算设定。同时写 `fit_font()` 自适应——文字超宽就自动降级，保证不裁切不重叠。

### 2. 放大字体必然导致溢出，必须同步精简文本

正文从 10pt 放到 18pt，同样内容的占位高度变成 1.8 倍，原文本框放不下，会互相重叠。

**解法**：先放大字号，再逐框计算溢出，然后把过长的文本精简到能舒适排下的长度。保留全部信息点（`▸` 要点、数字、结论），只砍修饰性词语。

### 3. 打包必须用 zip，不能用 tar（我踩的坑）

第一版产物 PowerPoint 打不开。原因是打包用了：

```bash
tar -a -c -f out.pptx -C build .
```

`tar -a` 本意是按扩展名自动选 zip 格式，但在 Windows 的 bsdtar 上这个推断失效，实际打出的是 **tar 包**（文件头 `5B 43 6F 6E` = `[Con`，偏移 257 有 `ustar` 魔数），而 PPTX 要求 zip（头四字节必须是 `50 4B 03 04` = `PK\x03\x04`）。

**更深的问题**：我当时的验证脚本用 `tar -tzf` 去读自己刚打的包——tar 当然能读 tar，所以检查一直"通过"。**我在用错误的方式验证错误的产物。**

修正后的 `pack_zip.js` 手写了标准 ZIP 结构（本地文件头 + CRC32 + 中央目录 + EOCD），并用 `System.IO.Packaging.Package`（PowerPoint 实际走的 OPC 解析路径）验证能正常打开、292 个部件全部识别。

---

## 用法

```bash
# 1. 解包 PPTX 并提取全部文字
node scripts/extract_pptx.js

# 2. 分析全 deck 字体分布 + 每页形状版式
node scripts/analyze_deck.js
node scripts/inspect_layout.js

# 3. 改字体/文本/文本框（按你的映射表改 fix_part6.js 后运行）
node scripts/fix_part6.js
node scripts/fix_boxes.js        # 修正溢出
node scripts/final_pass.js       # 最后一轮精简

# 4. 重绘配图（字号设为等效 18pt）
python scripts/redraw_images.py

# 5. 溢出检查
node scripts/overflow_check.js

# 6. 打包（必须用这个，不要用 tar）
node scripts/pack_zip.js

# 7. 验证
node scripts/final_check.js      # XML 完整性 + 未改动页字节级比对
node scripts/verify_zip.js       # zip 内容与源目录逐文件比对
```

脚本里的路径都是硬编码的（`E:/openclaw_workspace/logs/...`），复用前先改 `pptx_lib.js` 顶部的 `slidesDir` 和各脚本的路径常量。

---

## 字体映射表

本次实际使用的映射（第六部分 → 对齐第五部分）：

| 元素 | 改前 | 改后 | 依据 |
|---|---|---|---|
| 角标 | 11pt | **24pt** | Part5 角标 24pt |
| 小标题 | 12.5-14pt | **20pt** | Part5 小标题 20pt |
| 正文 | 9-11pt | **18pt** | Part5 正文 18pt |
| 副标题 | 13pt | **16pt** | Part5 无此角色，取正文级偏大 |
| 强调标签 | 9pt | **14pt** | — |
| 主标题 | 29/25pt | 保持 | 原本已 ≥ Part5 的 24pt |

**映射原则**：先统计目标章节的字号分布，按「角色」而非「数值」对齐。同一个数值在不同章节可能扮演不同角色（比如 Part6 的 13pt 既是副标题也是小标题），要分别处理。

---

## 验证方式

没有 PowerPoint / LibreOffice 可用时，用这三层间接验证：

1. **图内文字**：WinRT OCR 逐张识别，确认文字完整、不跨界、不重叠。这一步抓到了两轮布局错误（文字粘在一起、内容溢出卡片边界）。
2. **正文溢出**：`overflow_check.js` 逐框计算 `字符宽 × 字号 × 行高` vs `文本框高度` 和版面下边界。
3. **打包产物**：文件头签名 + `System.IO.Packaging.Package` OPC 解析 + zip 条目与源目录逐字节比对。

比目视更严，但终究是间接手段。有条件的话还是应该用 PowerPoint 实际渲染确认。

---

## 目录结构

```
scripts/          全部脚本（Node + Python）
docs/             分析报告和验证日志
output/           最终产物和重绘后的配图
```

`output/IKEA_Part6_fixed.pptx` 是本次的最终产物。

---

## 复用建议

如果要处理别的 PPT，按这个顺序：

1. `extract_pptx.js` 拿到全部文字，确认章节边界
2. `analyze_deck.js` 统计目标章节和参考章节的字号分布
3. 确定「角色 → 字号」映射表
4. 改字号 → 跑溢出检查 → 精简文本 → 再跑溢出检查，循环到 0 溢出
5. 配图：先 OCR 看图上有没有文字。**没有文字的图直接缩放；有文字的必须重绘**
6. 打包用 `pack_zip.js`，**打包后第一件事是检查文件头是不是 `PK\x03\x04`**
