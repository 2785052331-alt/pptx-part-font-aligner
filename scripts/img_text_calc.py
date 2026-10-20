from PIL import Image
import os

MEDIA = "E:/openclaw_workspace/logs/pptx_build/ppt/media"

# (file, 显示宽in, 显示高in) —— 来自 slide XML 的 a:ext
imgs = [
    ("image46.png", 4.14, 1.95),
    ("image47.png", 3.93, 1.85),
    ("image48.png", 3.93, 1.85),
    ("image49.png", 3.93, 1.85),
    ("image50.png", 6.22, 1.20),
]

# 从 OCR 拿到的文字高度（px，来自 tmp_winocr_boxes.txt 的 y2-y1）
# image46: City PIanning 226-259(33) / demand sensing 355-379(24) / Urban MFC 245-271(26)
#          fast-moving SKUs 355-379(24) / 底部标语 598-618(20) / EV Home 227-252(25)
# image47: PUSH 159-186(27) / standard components 260-284(24) / postponement 245-268(23)
#          底部 598-624(26)
# image48: 70% 140-186(46 含符号) / Global hubs 281-301(20) / 30% 151-192(41)
#          Nearshore 288-308(20) / 底部 598-624(26)
# image49: Use 64-82(18) / Resell 277-296(19) / Buy Back 277-301(24) / Refurbish 490-509(19)
#          timber recovered 598-624(26)
# image50: Phase 1 110-132(22) / Year 1 158-176(18) / Urban MFC pilot 343-367(24)

# 关键：计算每张图的 px -> inch 比例，再算文字实际 pt
print("=" * 78)
print("图内文字实际大小测算")
print("=" * 78)
for f, win, hin in imgs:
    p = os.path.join(MEDIA, f)
    im = Image.open(p)
    pw, ph = im.size
    px_per_in_w = pw / win
    px_per_in_h = ph / hin
    print(f"\n{f}: {pw}x{ph}px 显示 {win}x{hin}in")
    print(f"   横向 {px_per_in_w:.1f} px/in, 纵向 {px_per_in_h:.1f} px/in")

# Part5 正文 18pt。18pt 行高约 18*1.2 = 21.6pt = 0.30in
# 若要让图内文字达到 18pt 等效，其像素高度需 = 0.30in * px_per_in
print("\n" + "=" * 78)
print("目标：图内文字等效 18pt（Part5 正文）")
print("=" * 78)
for f, win, hin in imgs:
    p = os.path.join(MEDIA, f)
    im = Image.open(p)
    pw, ph = im.size
    ppi = ph / hin
    # 18pt 字高对应的像素（用 cap height ≈ 0.70 * font size）
    target_px = 18 * 0.70 / 72 * ppi
    print(f"{f}: 需要文字像素高 ≈ {target_px:.0f}px (当前 OCR 测得 18-33px)")
