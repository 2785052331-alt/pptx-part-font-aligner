# -*- coding: utf-8 -*-
"""
重绘 Part6 配图。布局全部按「画布像素比例」计算，不用英寸换算，避免比例失真。
字号目标：等效 18pt（与 Part5 正文一致）。
"""
from PIL import Image, ImageDraw, ImageFont
import os

MEDIA = "E:/openclaw_workspace/logs/pptx_build/ppt/media"

INK    = (15, 23, 42)
GREY   = (71, 85, 105)
BLUE   = (0, 88, 163)
GREEN  = (16, 185, 129)
ORANGE = (245, 158, 11)
WHITE  = (255, 255, 255)
BG_BLUE  = (239, 246, 255)
BG_GREEN = (236, 253, 245)
BG_ORANGE= (255, 247, 237)
BG_GREY  = (248, 250, 252)
LINE     = (203, 213, 225)

# 输出分辨率（宽高比必须与原图一致，否则 PPT 中变形）
# 原比例: 46/47/48/49 = 1589x748 (2.124) ; 50 = 2520x486 (5.185)
OUT_RES = {
    "image46.png": (2200, 1036),
    "image47.png": (2200, 1036),
    "image48.png": (2200, 1036),
    "image49.png": (2200, 1036),
    "image50.png": (2600, 501),
}

# 显示尺寸(英寸) -> 用于把 pt 换算成像素
DISP = {
    "image46.png": (4.14, 1.95),
    "image47.png": (3.93, 1.85),
    "image48.png": (3.93, 1.85),
    "image49.png": (3.93, 1.85),
    "image50.png": (6.22, 1.20),
}

FONTS   = ["C:/Windows/Fonts/segoeui.ttf", "C:/Windows/Fonts/arial.ttf"]
FONTS_B = ["C:/Windows/Fonts/seguisb.ttf", "C:/Windows/Fonts/arialbd.ttf", "C:/Windows/Fonts/segoeui.ttf"]

def font(px, bold=False):
    for c in (FONTS_B if bold else FONTS):
        if os.path.exists(c):
            return ImageFont.truetype(c, px)
    return ImageFont.load_default()

def ctext(d, cx, cy, text, f, fill):
    b = d.textbbox((0, 0), text, font=f)
    tw, th = b[2] - b[0], b[3] - b[1]
    d.text((cx - tw / 2 - b[0], cy - th / 2 - b[1]), text, font=f, fill=fill)

def fit_font(d, text, max_w, start_px, bold=True, min_px=10):
    """从 start_px 递减，直到文字宽度 <= max_w"""
    px = start_px
    while px > min_px:
        f = font(px, bold)
        b = d.textbbox((0, 0), text, font=f)
        if b[2] - b[0] <= max_w:
            return f
        px -= 1
    return font(min_px, bold)

def pill(d, box, r, fill=None, outline=None, width=1):
    d.rounded_rectangle(box, radius=r, fill=fill, outline=outline, width=width)

# ================= image46 =================
def d46():
    name = "image46.png"
    W, H = OUT_RES[name]
    dw, dh = DISP[name]
    ppi = W / dw                       # 像素/英寸
    PT = lambda p: int(p / 72 * ppi)   # pt -> px
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)

    cards = [
        ("City Planning", "Studio", "Demand sensing", BG_BLUE, BLUE),
        ("Urban MFC", None, "Fast-moving SKUs", BG_ORANGE, ORANGE),
        ("EV Home", "Delivery", "24-48h window", BG_GREEN, GREEN),
    ]
    n = 3
    M = int(W * 0.030)
    G = int(W * 0.075)
    cw = (W - M * 2 - G * (n - 1)) / n
    ch = int(H * 0.50)
    top = int(H * 0.10)

    for i, (l1, l2, sub, bg, ac) in enumerate(cards):
        x0 = M + i * (cw + G)
        pill(d, [x0, top, x0 + cw, top + ch], int(ch * 0.10), fill=bg)
        bar = int(ch * 0.07)
        d.rounded_rectangle([x0, top, x0 + cw, top + bar], radius=int(ch * 0.10), fill=ac)
        d.rectangle([x0, top + bar // 2, x0 + cw, top + bar], fill=ac)
        cx = x0 + cw / 2
        inner = cw * 0.88
        f1 = fit_font(d, l1, inner, PT(17), True)
        if l2:
            ctext(d, cx, top + ch * 0.33, l1, f1, INK)
            f2 = fit_font(d, l2, inner, PT(17), True)
            ctext(d, cx, top + ch * 0.55, l2, f2, INK)
        else:
            ctext(d, cx, top + ch * 0.44, l1, f1, INK)
        f3 = fit_font(d, sub, inner, PT(16), False)
        ctext(d, cx, top + ch * 0.80, sub, f3, GREY)
        if i < n - 1:
            ax = x0 + cw + G / 2; ay = top + ch / 2; s = int(ch * 0.13)
            d.polygon([(ax - s, ay - s), (ax + s, ay), (ax - s, ay + s)], fill=BLUE)

    fh = int(H * 0.17); fy = H - fh - int(H * 0.09)
    pill(d, [M, fy, W - M, fy + fh], int(fh * 0.30), fill=INK)
    ft = fit_font(d, "Closer to the customer \u00b7 lower last-mile cost", W - M * 2 - int(W*0.10), PT(16), True)
    ctext(d, W / 2, fy + fh / 2, "Closer to the customer \u00b7 lower last-mile cost", ft, WHITE)
    return im

# ================= image47 =================
def d47():
    name = "image47.png"
    W, H = OUT_RES[name]
    dw, dh = DISP[name]
    ppi = W / dw
    PT = lambda p: int(p / 72 * ppi)
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)

    M = int(W * 0.030); G = int(W * 0.062)
    cw = (W - M * 2 - G * 2) / 3
    top = int(H * 0.10); ch = int(H * 0.52)

    cards = [
        ("P U S H", ["Standard components", "(LACK / KALLAX fittings)"], BG_BLUE, BLUE),
        (None, ["Postponement", "point"], BG_GREY, ORANGE),
        ("P U L L", ["Finish \u00b7 colour \u00b7 fabric"], BG_GREEN, GREEN),
    ]
    for i, (head, lines, bg, ac) in enumerate(cards):
        x0 = M + i * (cw + G)
        pill(d, [x0, top, x0 + cw, top + ch], int(ch * 0.10), fill=bg)
        cx = x0 + cw / 2
        inner = cw * 0.90
        if head:
            hh = int(ch * 0.30)
            d.rounded_rectangle([x0, top, x0 + cw, top + hh], radius=int(ch * 0.10), fill=ac)
            d.rectangle([x0, top + hh // 2, x0 + cw, top + hh], fill=ac)
            fh_ = fit_font(d, head, inner, PT(18), True)
            ctext(d, cx, top + hh / 2, head, fh_, WHITE)
            for j, ln in enumerate(lines):
                fj = fit_font(d, ln, inner, PT(16), False)
                ctext(d, cx, top + hh + int(ch * 0.16) + j * int(ch * 0.19), ln, fj, INK)
        else:
            ctext(d, cx, top + ch * 0.32, lines[0], fit_font(d, lines[0], inner, PT(18), True), INK)
            ctext(d, cx, top + ch * 0.32 + int(ch * 0.20), lines[1], fit_font(d, lines[1], inner, PT(18), True), INK)
            ctext(d, cx, top + ch * 0.78, "Delay final finish", fit_font(d, "Delay final finish", inner, PT(15), False), GREY)
        if i < 2:
            ax = x0 + cw + G / 2; ay = top + ch / 2; s = int(ch * 0.12)
            d.polygon([(ax - s, ay - s), (ax + s, ay), (ax - s, ay + s)], fill=ORANGE)

    fh = int(H * 0.17); fy = H - fh - int(H * 0.09)
    pill(d, [M, fy, W - M, fy + fh], int(fh * 0.30), fill=INK)
    t = "Same scale cost + MUJI-like responsiveness"
    ft = fit_font(d, t, W - M * 2 - int(W * 0.10), PT(16), True)
    ctext(d, W / 2, fy + fh / 2, t, ft, WHITE)
    return im

# ================= image48 =================
def d48():
    name = "image48.png"
    W, H = OUT_RES[name]
    dw, dh = DISP[name]
    ppi = W / dw
    PT = lambda p: int(p / 72 * ppi)
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)

    M = int(W * 0.030); G = int(W * 0.055)
    cw = (W - M * 2 - G) / 2
    top = int(H * 0.10); ch = int(H * 0.52)
    blocks = [
        (BG_BLUE, BLUE, "70%", "Global hubs", "Poland \u00b7 Asia", "Scale cost base"),
        (BG_GREEN, GREEN, "30%", "Nearshore", "EU \u00b7 N. America", "Disruption buffer"),
    ]
    for i, (bg, ac, big, lab, sub, note) in enumerate(blocks):
        x0 = M + i * (cw + G)
        pill(d, [x0, top, x0 + cw, top + ch], int(ch * 0.10), fill=bg)
        cx = x0 + cw / 2
        inner = cw * 0.90
        ctext(d, cx, top + ch * 0.20, big, fit_font(d, big, inner, PT(26), True), ac)
        ctext(d, cx, top + ch * 0.50, lab, fit_font(d, lab, inner, PT(17), True), INK)
        ctext(d, cx, top + ch * 0.68, sub, fit_font(d, sub, inner, PT(16), False), GREY)
        nh = int(ch * 0.17); ny = top + ch - nh - int(ch * 0.09)
        pill(d, [x0 + int(cw * 0.07), ny, x0 + cw - int(cw * 0.07), ny + nh], int(nh * 0.35), fill=ac)
        fn_ = fit_font(d, note, inner * 0.9, PT(13), True)
        ctext(d, cx, ny + nh / 2, note, fn_, WHITE)

    fh = int(H * 0.17); fy = H - fh - int(H * 0.09)
    pill(d, [M, fy, W - M, fy + fh], int(fh * 0.30), fill=INK)
    t = "Scale cost base + disruption buffer"
    ft = fit_font(d, t, W - M * 2 - int(W * 0.10), PT(16), True)
    ctext(d, W / 2, fy + fh / 2, t, ft, WHITE)
    return im

# ================= image49 =================
def d49():
    name = "image49.png"
    W, H = OUT_RES[name]
    dw, dh = DISP[name]
    ppi = W / dw
    PT = lambda p: int(p / 72 * ppi)
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)

    nodes = [("Use", BG_GREY, GREY), ("Buy Back", BG_BLUE, BLUE),
             ("Resell", BG_GREEN, GREEN), ("Refurbish", BG_ORANGE, ORANGE)]
    n = 4
    M = int(W * 0.030); G = int(W * 0.050)
    cw = (W - M * 2 - G * (n - 1)) / n
    top = int(H * 0.16); ch = int(H * 0.36)

    for i, (lab, bg, ac) in enumerate(nodes):
        x0 = M + i * (cw + G)
        pill(d, [x0, top, x0 + cw, top + ch], int(ch * 0.16), fill=bg,
             outline=ac, width=max(2, int(H * 0.008)))
        ctext(d, x0 + cw / 2, top + ch / 2, lab, fit_font(d, lab, cw * 0.86, PT(17), True), INK)
        if i < n - 1:
            ax = x0 + cw + G / 2; ay = top + ch / 2; s = int(ch * 0.16)
            d.polygon([(ax - s, ay - s), (ax + s, ay), (ax - s, ay + s)], fill=BLUE)

    # 回流弧
    fy = top + ch + int(H * 0.16)
    xe = M + cw / 2
    xs = M + (n - 1) * (cw + G) + cw / 2
    lw = max(3, int(H * 0.009))
    d.line([(xs, top + ch + int(H * 0.02)), (xs, fy), (xe, fy), (xe, top + ch + int(H * 0.06))],
           fill=GREEN, width=lw)
    s = int(ch * 0.16)
    tip = top + ch + int(H * 0.06)
    d.polygon([(xe - s, tip - s), (xe + s, tip - s), (xe, tip - int(H * 0.015))], fill=GREEN)
    ctext(d, (xs + xe) / 2, fy + int(H * 0.08), "Circular loop",
          fit_font(d, "Circular loop", W * 0.30, PT(15), True), GREEN)

    fh = int(H * 0.17); yy = H - fh - int(H * 0.07)
    pill(d, [M, yy, W - M, yy + fh], int(fh * 0.30), fill=INK)
    t = "Timber recovered \u00b7 virgin wood dependency down"
    ft = fit_font(d, t, W - M * 2 - int(W * 0.10), PT(16), True)
    ctext(d, W / 2, yy + fh / 2, t, ft, WHITE)
    return im

# ================= image50 =================
def d50():
    name = "image50.png"
    W, H = OUT_RES[name]
    dw, dh = DISP[name]
    ppi = W / dw
    PT = lambda p: int(p / 72 * ppi)
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)

    phases = [("Phase 1", "Year 1", BG_BLUE, BLUE, "Urban MFC pilot"),
              ("Phase 2", "Years 1-3", BG_GREEN, GREEN, "Nearshore 30%"),
              ("Phase 3", "Years 3-5", BG_ORANGE, ORANGE, "Closed loop")]
    n = 3
    M = int(W * 0.020); G = int(W * 0.030)
    cw = (W - M * 2 - G * (n - 1)) / n
    r = int(H * 0.10)
    ly = int(H * 0.50)
    lw = max(3, int(H * 0.020))
    d.line([(M + cw / 2, ly), (W - M - cw / 2, ly)], fill=LINE, width=lw)

    for i, (p, y, bg, ac, task) in enumerate(phases):
        x0 = M + i * (cw + G)
        cx = x0 + cw / 2
        ut = int(H * 0.05); ub = ly - r - int(H * 0.03)
        pill(d, [x0, ut, x0 + cw, ub], int(H * 0.07), fill=bg)
        mid = (ut + ub) / 2
        inner = cw * 0.88
        ctext(d, cx, mid - int(H * 0.075), p, fit_font(d, p, inner, PT(15), True), ac)
        ctext(d, cx, mid + int(H * 0.075), y, fit_font(d, y, inner, PT(14), False), GREY)
        d.ellipse([cx - r, ly - r, cx + r, ly + r], fill=ac, outline=WHITE, width=lw)
        lt = ly + r + int(H * 0.03); lb = H - int(H * 0.05)
        pill(d, [x0, lt, x0 + cw, lb], int(H * 0.07), fill=WHITE, outline=LINE,
             width=max(2, int(H * 0.010)))
        ctext(d, cx, (lt + lb) / 2, task, fit_font(d, task, inner, PT(15), True), INK)
    return im

if __name__ == "__main__":
    for fn, f in [("image46.png", d46), ("image47.png", d47), ("image48.png", d48),
                  ("image49.png", d49), ("image50.png", d50)]:
        img = f()
        img.save(os.path.join(MEDIA, fn))
        print("redrawn:", fn, img.size)
