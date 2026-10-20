from PIL import Image
import os, json

MEDIA = "E:/openclaw_workspace/logs/pptx_build/ppt/media"
OUT = "E:/openclaw_workspace/logs/img_analysis"
os.makedirs(OUT, exist_ok=True)

for f in ["image46.png","image47.png","image48.png","image49.png","image50.png"]:
    im = Image.open(os.path.join(MEDIA, f)).convert("RGBA")
    rgb = im.convert("RGB")
    cols = rgb.getcolors(maxcolors=200000)
    cols.sort(reverse=True)
    # 找出非白非浅灰的主色
    main = []
    for cnt, c in cols:
        r, g, b = c
        if r > 240 and g > 240 and b > 240:
            continue
        if abs(r-g) < 12 and abs(g-b) < 12 and abs(r-b) < 12 and r > 225:
            continue
        main.append((cnt, c))
        if len(main) >= 8:
            break
    print("\n=== " + f + " " + str(im.size) + " ===")
    for cnt, c in main:
        print("   #%02X%02X%02X  x%d" % (c[0], c[1], c[2], cnt))
    # 找圆角矩形的填充色（用于复刻卡片）
    # 采样若干点
    w, h = im.size
    samples = {
        "左上": rgb.getpixel((int(w*0.08), int(h*0.30))),
        "中上": rgb.getpixel((int(w*0.50), int(h*0.25))),
        "左下": rgb.getpixel((int(w*0.10), int(h*0.75))),
        "底部条": rgb.getpixel((int(w*0.50), int(h*0.90))),
    }
    for k, v in samples.items():
        print("   sample %s: #%02X%02X%02X" % (k, v[0], v[1], v[2]))
