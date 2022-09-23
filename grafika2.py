# ustvari slike in jih shrani v imenik "slike"
from PIL import Image, ImageDraw, ImageFont
import os
from math import cos, sin, tan, pi, sqrt

from pathlib import Path


cwd = os.getcwd()
starš = Path(__file__).parent

os.chdir(starš)  # gremo eno mapo gor, da lahko gremo nazaj eno mapo dol
cwd1 = os.getcwd()
os.chdir("slike")

# os.chdir("..") je za premikanje ene mape gor


# https://pillow.readthedocs.io/en/stable/reference/ImageDraw.html

# tako začnemo risati:
"""
out = Image.new("RGBA", (100, 100), (255, 0, 0, 0))  # transparentno
draw = ImageDraw.Draw(out, mode="RGBA")  # mode od Image in od ImageDraw mora biti isti
"""


def shrani(destinacija, slika):  # brez končnice
    pot = destinacija + ".png"
    slika.save(pot)


unicode_font = ImageFont.truetype(cwd1 + "\\dejavu-fonts-ttf-2.37\\ttf\\DejaVuSans.ttf", 20)  # ta font si lahko naložimo na https://sourceforge.net/projects/dejavu/
# unicode_font = None  # če hočemo default font, ampak potem se pri šumnikih sesuje


def napiši(draw, tekst, barva, koordinate):
    draw.multiline_text(koordinate, tekst, fill=barva, font=unicode_font)  # prvi parameter je koordinata začetka teksta (levo zgoraj od teksta)


def napiši_multiline(draw, tekst, barva, koordinate):
    draw.multiline_text(koordinate, tekst, fill=barva, font=unicode_font, align="center")  # lahko dodamo \n v tekst


širinaSlike, višinaSlike = 100, 100


besede = ["Kralj", "Kraljica", "Tekač", "Konj", "Trdnjava", "Kmet", "Konjica"]


barveVImeBarve = {
    (0, 0, 255, 128) : "modra",
    (0, 255, 0, 128) : "zelena",
    (255, 255, 0, 128) : "rumena",
    (255, 0, 0, 128) : "rdeča"
}


barveVIgralca = {
    (0, 0, 255, 128) : 1,
    (0, 255, 0, 128) : 3,
    (255, 255, 0, 128) : 2,
    (255, 0, 0, 128) : 4
}


"""
smeri = {
    1 : "N",
    3 : "E",
    2 : "S",
    4 : "W"
}


oznakeSmeri = {
    "N" : "↑",
    "E" : "→",
    "S" : "↓",
    "W" : "←"
}
"""


def razpakiraj(nabor):
    prva, druga, *ostalo = nabor
    try:
        x2, y2 = ostalo
        x1 = prva
        y1 = druga
    except:
        x1, y1 = prva
        x2, y2 = druga
    return (x1, y1, x2, y2)


def elipsa(draw, koordinate, koordinate_pravokotnika, barva_ozadja, fill, outline, width):
    # outline je barva, width pa debelina
    
    x1, y1, x2, y2 = razpakiraj(koordinate)
    
    x1_, y1_, x2_, y2_ = razpakiraj(koordinate_pravokotnika)
    
    draw.ellipse(((x1, y1), (x2, y2)), outline=outline, width=width)

    draw.rectangle(((max(x1, x1_), max(y1, y1_)), (min(x2, x2_), min(y2, y2_))), fill=barva_ozadja)

    draw.rectangle(((x1_, y1_), (x2_, y2_)), fill=barva_ozadja)


def nazobčana_glava(x1, y1, x2, y2, globina_luknje, število_zobov=3, fill=(0, 0, 0), width=5):
    # točka (x2, y2) je nižje in bolj desno kot točka (x1, y1)
    širina = x2 - x1
    # višina = y2 - y1
    draw.line((x1, y2, x2, y2), fill=fill, width=width)
    draw.line((x1, y1, x1, y2), fill=fill, width=width)
    draw.line((x2, y1, x2, y2), fill=fill, width=width)
    
    širina_zoba = širina/(2*število_zobov - 1)
    draw.line((x1, y1, x1 + širina_zoba, y1), fill=fill, width=width)
    for i in range(1, število_zobov):
        zamik = (širina - širina_zoba)/(število_zobov - 1)  # to smo dal v loop v primeru če zob le en
        draw.line((x1 + (i - 1)*zamik + širina_zoba, y1, x1 + (i - 1)*zamik + širina_zoba, y1 + globina_luknje), fill=fill, width=width)
        draw.line((x1 + (i - 1)*zamik + širina_zoba, y1 + globina_luknje, x1 + i*zamik, y1 + globina_luknje), fill=fill, width=width)
        draw.line((x1 + i*zamik, y1, x1 + i*zamik, y1 + globina_luknje), fill=fill, width=width)
        draw.line((x1 + i*zamik, y1, x1 + i*zamik + širina_zoba, y1), fill=fill, width=width)
    return


def krona(x1, y1, x2, y2, št_zobov, globina_zarez):
    # x1 je levo, x2 desno
    # y1 je zgoraj, y2 je spodaj

    draw.line((x1, y2, x1, y1), fill=(0, 0, 0), width=1)
    širina = x2 - x1
    razmik = širina/(št_zobov - 1)
    for i in range(št_zobov - 1):
        draw.line((x1 + i*razmik, y1, x1 + (i + 0.5)*razmik, y1 + globina_zarez), fill=(0, 0, 0), width=1)
        draw.line((x1 + (i + 0.5)*razmik, y1 + globina_zarez, x1 + (i + 1)*razmik, y1), fill=(0, 0, 0), width=1)
    
    draw.line((x2, y1, x2, y2), fill=(0, 0, 0), width=1)
    return


for ba in barveVIgralca.keys():
    for be in besede:
        out = Image.new("RGBA", (širinaSlike, višinaSlike), ba)
        draw = ImageDraw.Draw(out, mode="RGBA")
        
        if be == "Kmet":
            class Kmet:
                draw.ellipse([(širinaSlike/3, višinaSlike/6), (2*širinaSlike/3, višinaSlike/2)], outline=(0, 0, 0), width=5)
                # draw.ellipse([(širinaSlike/6, višinaSlike/2), (5*širinaSlike/6, 3*višinaSlike/2)], outline=(0, 0, 0), width=5)
                sp = 9*višinaSlike/10
                # draw.rectangle([(0, sp), (širinaSlike, višinaSlike)], fill=ba)
                elipsa(draw, [(širinaSlike/6, višinaSlike/2), (5*širinaSlike/6, 3*višinaSlike/2)], [(0, sp), (širinaSlike, višinaSlike)], ba, fill=None, outline=(0, 0, 0), width=5)
                draw.line([(0.175 * širinaSlike, sp), ((1 - 0.175) * širinaSlike, sp)], fill=(0, 0, 0), width=5)
                ime = "kmet" + "_" + barveVImeBarve[ba]
                shrani(ime, out)
        elif be == "Kralj":
            class Kralj:
                višina_rect = 1.2*višinaSlike/10  # višina sredinskega člena
                x1 = -širinaSlike/2
                y1 = 0
                x2 = 2*širinaSlike/5
                y2 = 4.5*višinaSlike/5

                
                rx = (x2 - x1)/2
                x0 = x1 + rx
                ry = (y2 - y1)/2
                y0 = y1 + ry - višina_rect

                kot1 = 20
                kot1_rad = kot1*pi/180
                
                # križ
                višina_križa = višinaSlike/10
                širina_križa = 0.7*širinaSlike/10
                draw.line((širinaSlike/2, y0 - ry*sin(kot1_rad) - višina_križa, širinaSlike/2, y0 - ry*sin(kot1_rad)), fill=(0, 0, 0), width=3)
                draw.line((širinaSlike/2 - širina_križa/2, y0 - ry*sin(kot1_rad) - 2*višina_križa/3, širinaSlike/2 + širina_križa/2, y0 - ry*sin(kot1_rad) - 2*višina_križa/3), fill=(0, 0, 0), width=3)

                # vrh
                draw.line((x0 + rx*cos(kot1_rad), y0 - ry*sin(kot1_rad), širinaSlike - (x0 + rx*cos(kot1_rad)), y0 - ry*sin(kot1_rad)), fill=(0, 0, 0), width=5)

                # zgornje krivulje (to je krožnica s središčem (x0, y0) in polmeroma rx in ry)
                draw.arc((x1, y1 - višina_rect, x2, y2 - višina_rect), -kot1, 0, fill=(0, 0, 0), width=5)
                draw.arc((širinaSlike - x2, y1 - višina_rect, širinaSlike - x1, y2 - višina_rect), 180, 180 + kot1, fill=(0, 0, 0), width=5)
                
                # vmesni člen
                kok_gleda_ven = širinaSlike/10
                draw.rectangle([(x2 - kok_gleda_ven, y0), (širinaSlike - (x2 - kok_gleda_ven), y0 + višina_rect)], outline=(0, 0, 0), width=5)

                y0_ = y0 + višina_rect

                # spodnje krivulje (krožnica s središčem (x0, y0_) in polmeroma rx in ry)
                kot2 = 50
                kot2_rad = kot2*pi/180
                draw.arc((x1, y1, x2, y2), 0, kot2, fill=(0, 0, 0), width=5)
                draw.arc((širinaSlike - x2, y1, širinaSlike - x1, y2), 180 - kot2, 180, fill=(0, 0, 0), width=5)

                # podstavek
                višina_podstavka = 1.5*višinaSlike/10
                sp = y0_ + ry*sin(kot2_rad) + višina_podstavka
                lv = x0 + rx*cos(kot2_rad)
                kok_podstavek_ven_gleda = 0
                draw.rectangle([(lv - kok_podstavek_ven_gleda, sp - višina_podstavka), (širinaSlike - lv + kok_podstavek_ven_gleda, sp)], outline=(0, 0, 0), width=5)

                ime = "kralj" + "_" + barveVImeBarve[ba]
                shrani(ime, out)
        elif be == "Kraljica":
            class Kraljica:
                višina_rect = 1.2*višinaSlike/10  # višina sredinskega člena
                x1 = -širinaSlike/2
                y1 = 0
                x2 = 2*širinaSlike/5
                y2 = 4.5*višinaSlike/5

                
                rx = (x2 - x1)/2
                x0 = x1 + rx
                ry = (y2 - y1)/2
                y0 = y1 + ry - višina_rect

                kot1 = 20
                kot1_rad = kot1*pi/180
                
                # bunkica
                višina_križa = višinaSlike/10
                širina_križa = 0.7*širinaSlike/10
                draw.ellipse((širinaSlike/2 - širina_križa/2, y0 - ry*sin(kot1_rad) - višina_križa, širinaSlike/2 + širina_križa/2, y0 - ry*sin(kot1_rad)), fill=(0, 0, 0), width=5)

                # vrh
                draw.line((x0 + rx*cos(kot1_rad), y0 - ry*sin(kot1_rad), širinaSlike - (x0 + rx*cos(kot1_rad)), y0 - ry*sin(kot1_rad)), fill=(0, 0, 0), width=5)

                # zgornje krivulje
                draw.arc((x1, y1 - višina_rect, x2, y2 - višina_rect), -kot1, 0, fill=(0, 0, 0), width=5)
                draw.arc((širinaSlike - x2, y1 - višina_rect, širinaSlike - x1, y2 - višina_rect), 180, 180 + kot1, fill=(0, 0, 0), width=5)
                
                # vmesni_člen
                kok_gleda_ven = širinaSlike/10
                draw.rectangle([(x2 - kok_gleda_ven, y0), (širinaSlike - (x2 - kok_gleda_ven), y0 + višina_rect)], outline=(0, 0, 0), width=5)

                y0_ = y0 + višina_rect

                # spodnje krivulje
                kot2 = 50
                kot2_rad = kot2*pi/180
                draw.arc((x1, y1, x2, y2), 0, kot2, fill=(0, 0, 0), width=5)
                draw.arc((širinaSlike - x2, y1, širinaSlike - x1, y2), 180 - kot2, 180, fill=(0, 0, 0), width=5)

                # podstavek
                višina_podstavka = 1.5*višinaSlike/10
                sp = y0_ + ry*sin(kot2_rad) + višina_podstavka
                lv = x0 + rx*cos(kot2_rad)
                kok_podstavek_ven_gleda = 0
                draw.rectangle([(lv - kok_podstavek_ven_gleda, sp - višina_podstavka), (širinaSlike - lv + kok_podstavek_ven_gleda, sp)], outline=(0, 0, 0), width=5)

                ime = "kraljica" + "_" + barveVImeBarve[ba]
                shrani(ime, out)
        elif be == "Trdnjava":
            class Trdnjava:
                višina_rect = 0  # višina sredinskega člena
                x1 = -širinaSlike
                y1 = -višinaSlike/2
                x2 = širinaSlike/4
                y2 = 3*višinaSlike/2

                            
                rx = (x2 - x1)/2
                x0 = x1 + rx
                ry = (y2 - y1)/2
                y0 = y1 + ry - višina_rect

                kot1 = 10
                kot1_rad = kot1*pi/180
                
                # bunkica
                # višina_križa = višinaSlike/10
                # širina_križa = 0.7*širinaSlike/10
                # draw.ellipse((širinaSlike/2 - širina_križa/2, y0 - ry*sin(kot1_rad) - višina_križa, širinaSlike/2 + širina_križa/2, y0 - ry*sin(kot1_rad)), fill=(0, 0, 0), width=5)

                # vrh
                višina_glave = 2*višinaSlike/10
                kolk_gleda_glava_ven = širinaSlike/10
                nazobčana_glava(x0 + rx*cos(kot1_rad) - kolk_gleda_glava_ven, y0 - ry*sin(kot1_rad) - višina_glave, širinaSlike - (x0 + rx*cos(kot1_rad) - kolk_gleda_glava_ven), y0 - ry*sin(kot1_rad), višina_glave/2)
                # draw.line((x0 + rx*cos(kot1_rad), y0 - ry*sin(kot1_rad), širinaSlike - (x0 + rx*cos(kot1_rad)), y0 - ry*sin(kot1_rad)), fill=(0, 0, 0), width=5)

                # zgornje krivulje
                draw.arc((x1, y1 - višina_rect, x2, y2 - višina_rect), -kot1, 0, fill=(0, 0, 0), width=5)
                draw.arc((širinaSlike - x2, y1 - višina_rect, širinaSlike - x1, y2 - višina_rect), 180, 180 + kot1, fill=(0, 0, 0), width=5)
                
                # vmesni_člen
                # kok_gleda_ven = širinaSlike/10
                # draw.rectangle([(x2 - kok_gleda_ven, y0), (širinaSlike - (x2 - kok_gleda_ven), y0 + višina_rect)], outline=(0, 0, 0), width=5)

                y0_ = y0 + višina_rect

                # spodnje krivulje
                kot2 = 20
                kot2_rad = kot2*pi/180
                draw.arc((x1, y1, x2, y2), 0, kot2, fill=(0, 0, 0), width=5)
                draw.arc((širinaSlike - x2, y1, širinaSlike - x1, y2), 180 - kot2, 180, fill=(0, 0, 0), width=5)

                # podstavek
                višina_podstavka = 1.5*višinaSlike/10
                sp = y0_ + ry*sin(kot2_rad) + višina_podstavka
                lv = x0 + rx*cos(kot2_rad)
                kok_podstavek_ven_gleda = širinaSlike/10
                draw.rectangle([(lv - kok_podstavek_ven_gleda, sp - višina_podstavka), (širinaSlike - lv + kok_podstavek_ven_gleda, sp)], outline=(0, 0, 0), width=5)
                
                ime = "trdnjava" + "_" + barveVImeBarve[ba]
                shrani(ime, out)
        elif be == "Tekač":
            class Tekač:
                višina_rect = 0.7*višinaSlike/10  # višina sredinskega člena
                x1 = -širinaSlike/2
                y1 = 0
                x2 = 2.3*širinaSlike/5
                y2 = 4.5*višinaSlike/5

                
                rx = (x2 - x1)/2
                x0 = x1 + rx
                ry = (y2 - y1)/2
                y0 = y1 + ry - višina_rect

                kot1 = 15
                kot1_rad = kot1*pi/180
                

                # vrh
                # draw.line((x0 + rx*cos(kot1_rad), y0 - ry*sin(kot1_rad), širinaSlike - (x0 + rx*cos(kot1_rad)), y0 - ry*sin(kot1_rad)), fill=(0, 0, 0), width=5)

                # glava
                polmer_glave = (rx + širinaSlike/2 - x2)/cos(kot1_rad) - sqrt((rx*cos(kot1_rad))**2 + (ry*sin(kot1_rad))**2)
                y_središča_glave = y0 - (rx + širinaSlike/2 - x2)*tan(kot1_rad)
                draw.arc((širinaSlike/2 - polmer_glave, y_središča_glave - polmer_glave, širinaSlike/2 + polmer_glave, y_središča_glave + polmer_glave), 180 - kot1, kot1, fill=(0, 0, 0), width=3)

                # bunkica
                višina_križa = 0.7*višinaSlike/10
                širina_križa = 0.7*širinaSlike/10
                draw.ellipse((širinaSlike/2 - širina_križa/2, y_središča_glave - polmer_glave - višina_križa, širinaSlike/2 + širina_križa/2, y_središča_glave - polmer_glave), fill=(0, 0, 0), width=5)

                # zgornje krivulje
                draw.arc((x1, y1 - višina_rect, x2, y2 - višina_rect), -kot1, 0, fill=(0, 0, 0), width=3)
                draw.arc((širinaSlike - x2, y1 - višina_rect, širinaSlike - x1, y2 - višina_rect), 180, 180 + kot1, fill=(0, 0, 0), width=3)
                
                # vmesni_člen
                kok_gleda_ven = 0.7*širinaSlike/10
                draw.rectangle([(x2 - kok_gleda_ven, y0), (širinaSlike - (x2 - kok_gleda_ven), y0 + višina_rect)], outline=(0, 0, 0), width=3)

                y0_ = y0 + višina_rect

                # spodnje krivulje
                kot2 = 50
                kot2_rad = kot2*pi/180
                draw.arc((x1, y1, x2, y2), 0, kot2, fill=(0, 0, 0), width=3)
                draw.arc((širinaSlike - x2, y1, širinaSlike - x1, y2), 180 - kot2, 180, fill=(0, 0, 0), width=3)

                # podstavek
                višina_podstavka = 0.8*višinaSlike/10
                sp = y0_ + ry*sin(kot2_rad) + višina_podstavka
                lv = x0 + rx*cos(kot2_rad)
                kok_podstavek_ven_gleda = 0
                draw.rectangle([(lv - kok_podstavek_ven_gleda, sp - višina_podstavka), (širinaSlike - lv + kok_podstavek_ven_gleda, sp)], outline=(0, 0, 0), width=3)

                ime = "tekač" + "_" + barveVImeBarve[ba]
                shrani(ime, out)
        elif be == "Konj":
            class Konj:
                
                višina_rect = 0.7*višinaSlike/10  # višina sredinskega člena
                x1 = -širinaSlike/2
                y1 = 0
                x2 = 2.3*širinaSlike/5
                y2 = 4.5*višinaSlike/5

                
                rx = (x2 - x1)/2
                x0 = x1 + rx
                ry = (y2 - y1)/2
                y0 = y1 + ry - višina_rect

                # kot1 = 15
                # kot1_rad = kot1*pi/180
                

                # vrh
                # draw.line((x0 + rx*cos(kot1_rad), y0 - ry*sin(kot1_rad), širinaSlike - (x0 + rx*cos(kot1_rad)), y0 - ry*sin(kot1_rad)), fill=(0, 0, 0), width=5)

                # glava
                # polmer_glave = (rx + širinaSlike/2 - x2)/cos(kot1_rad) - sqrt((rx*cos(kot1_rad))**2 + (ry*sin(kot1_rad))**2)
                # y_središča_glave = y0 - (rx + širinaSlike/2 - x2)*tan(kot1_rad)
                # draw.arc((širinaSlike/2 - polmer_glave, y_središča_glave - polmer_glave, širinaSlike/2 + polmer_glave, y_središča_glave + polmer_glave), 180 - kot1, kot1, fill=(0, 0, 0), width=3)

                # bunkica
                # višina_križa = 0.7*višinaSlike/10
                # širina_križa = 0.7*širinaSlike/10
                # draw.ellipse((širinaSlike/2 - širina_križa/2, y_središča_glave - polmer_glave - višina_križa, širinaSlike/2 + širina_križa/2, y_središča_glave - polmer_glave), fill=(0, 0, 0), width=5)

                # zgornje krivulje
                # draw.arc((x1, y1 - višina_rect, x2, y2 - višina_rect), -kot1, 0, fill=(0, 0, 0), width=3)
                # draw.arc((širinaSlike - x2, y1 - višina_rect, širinaSlike - x1, y2 - višina_rect), 180, 180 + kot1, fill=(0, 0, 0), width=3)
                
                # vmesni_člen
                # kok_gleda_ven = 0.7*širinaSlike/10
                # draw.rectangle([(x2 - kok_gleda_ven, y0), (širinaSlike - (x2 - kok_gleda_ven), y0 + višina_rect)], outline=(0, 0, 0), width=3)

                y0_ = y0 + višina_rect

                # spodnje krivulje
                kot2 = 50
                kot2_rad = kot2*pi/180
                # draw.arc((x1, y1, x2, y2), 0, kot2, fill=(0, 0, 0), width=3)
                # draw.arc((širinaSlike - x2, y1, širinaSlike - x1, y2), 180 - kot2, 180, fill=(0, 0, 0), width=3)
                
                
                # podstavek
                višina_podstavka = 0.8*višinaSlike/10
                sp = y0_ + ry*sin(kot2_rad) + višina_podstavka
                lv = x0 + rx*cos(kot2_rad)
                kok_podstavek_ven_gleda = 0
                draw.rectangle([(lv - kok_podstavek_ven_gleda, sp - višina_podstavka), (širinaSlike - lv + kok_podstavek_ven_gleda, sp)], outline=(0, 0, 0), width=3)
                
                # trebuh
                ry_sl = 2*višinaSlike/5
                kot_sl = 60
                kot_sl_rad = kot_sl * pi/180
                x_spodaj_levo = 3*širinaSlike/4
                y_spodaj_levo = sp - višina_podstavka
                rx_sl = x_spodaj_levo - lv
                draw.arc((lv, y_spodaj_levo - ry_sl, lv + 2 * rx_sl, y_spodaj_levo + ry_sl), 180, 180 + kot_sl, fill=(0, 0, 0), width=3)
                
                # griva
                ry_sd = višinaSlike
                kot_sd = 40
                kot_sd_rad = kot_sd * pi/180
                x_spodaj_desno = 1*širinaSlike/4
                y_spodaj_desno = sp - višina_podstavka
                lv_2 = lv + (širinaSlike - 2*lv)
                rx_sd = lv_2 - x_spodaj_desno
                draw.arc((lv_2 - 2* rx_sd, y_spodaj_desno - ry_sd, lv_2, y_spodaj_desno + ry_sd), -kot_sd, 0, fill=(0, 0, 0), width=3)
                
                vrh_x = x_spodaj_desno + rx_sd*cos(kot_sd_rad)
                vrh_y = y_spodaj_desno - ry_sd*sin(kot_sd_rad)

                x_vrat = x_spodaj_levo - rx_sl*cos(kot_sl_rad)
                y_vrat = y_spodaj_levo - ry_sl*sin(kot_sl_rad)

                # podbradek
                nov_x = širinaSlike/4
                draw.line((x_vrat, y_vrat, nov_x, y_vrat), fill=(0, 0, 0), width=3)

                # obraz
                nov_y = višinaSlike/4
                draw.line((nov_x, y_vrat, nov_x, nov_y), fill=(0, 0, 0), width=3)

                # oko
                oko_x = nov_x + 2*širinaSlike/10
                oko_y = nov_y + 0.7*višinaSlike/10
                polmer_očesa = 2
                draw.ellipse((oko_x - polmer_očesa, oko_y - polmer_očesa, oko_x + polmer_očesa, oko_y + polmer_očesa), fill=(0, 0, 0), outline=0)
                
                uho_x = širinaSlike/2
                uho_y = nov_y
                
                # vrh glave
                draw.line((nov_x, nov_y, uho_x, uho_y), fill=(0, 0, 0), width=3)
                draw.line((uho_x, uho_y, vrh_x, vrh_y), fill=(0, 0, 0), width=3)

                ime = "konj" + "_" + barveVImeBarve[ba]
                shrani(ime, out)
        elif be == "Konjica":
            class Konjica:
                višina_rect = 0.7*višinaSlike/10  # višina sredinskega člena
                x1 = -širinaSlike/2
                y1 = 0
                x2 = 2.3*širinaSlike/5
                y2 = 4.5*višinaSlike/5

                
                rx = (x2 - x1)/2
                x0 = x1 + rx
                ry = (y2 - y1)/2
                y0 = y1 + ry - višina_rect

                y0_ = y0 + višina_rect
                
                kot2 = 50
                kot2_rad = kot2*pi/180


                # podstavek
                višina_podstavka = 0.8*višinaSlike/10
                sp = y0_ + ry*sin(kot2_rad) + višina_podstavka
                lv = x0 + rx*cos(kot2_rad)
                kok_podstavek_ven_gleda = 0
                draw.rectangle([(lv - kok_podstavek_ven_gleda, sp - višina_podstavka), (širinaSlike - lv + kok_podstavek_ven_gleda, sp)], outline=(0, 0, 0), width=3)
                
                # trebuh
                ry_sl = 2*višinaSlike/5
                kot_sl = 60
                kot_sl_rad = kot_sl * pi/180
                x_spodaj_levo = 3*širinaSlike/4
                y_spodaj_levo = sp - višina_podstavka
                rx_sl = x_spodaj_levo - lv
                draw.arc((lv, y_spodaj_levo - ry_sl, lv + 2 * rx_sl, y_spodaj_levo + ry_sl), 180, 180 + kot_sl, fill=(0, 0, 0), width=3)
                
                # griva
                ry_sd = višinaSlike
                kot_sd = 40
                kot_sd_rad = kot_sd * pi/180
                x_spodaj_desno = 1*širinaSlike/4
                y_spodaj_desno = sp - višina_podstavka
                lv_2 = lv + (širinaSlike - 2*lv)
                rx_sd = lv_2 - x_spodaj_desno
                draw.arc((lv_2 - 2* rx_sd, y_spodaj_desno - ry_sd, lv_2, y_spodaj_desno + ry_sd), -kot_sd, 0, fill=(0, 0, 0), width=3)
                
                vrh_x = x_spodaj_desno + rx_sd*cos(kot_sd_rad)
                vrh_y = y_spodaj_desno - ry_sd*sin(kot_sd_rad)

                x_vrat = x_spodaj_levo - rx_sl*cos(kot_sl_rad)
                y_vrat = y_spodaj_levo - ry_sl*sin(kot_sl_rad)

                # podbradek
                nov_x = širinaSlike/4
                draw.line((x_vrat, y_vrat, nov_x, y_vrat), fill=(0, 0, 0), width=3)

                # obraz
                nov_y = višinaSlike/4
                draw.line((nov_x, y_vrat, nov_x, nov_y), fill=(0, 0, 0), width=3)

                # oko
                oko_x = nov_x + 2*širinaSlike/10
                oko_y = nov_y + 0.7*višinaSlike/10
                polmer_očesa = 2
                draw.ellipse((oko_x - polmer_očesa, oko_y - polmer_očesa, oko_x + polmer_očesa, oko_y + polmer_očesa), fill=(0, 0, 0), outline=0)
                
                uho_x = širinaSlike/2
                uho_y = nov_y
                
                # vrh glave
                draw.line((nov_x, nov_y, uho_x, uho_y), fill=(0, 0, 0), width=3)
                draw.line((uho_x, uho_y, vrh_x, vrh_y), fill=(0, 0, 0), width=3)
                višina_krone = višinaSlike/10
                krona(nov_x + širinaSlike/10, nov_y - višina_krone, nov_x + 2*širinaSlike/10, nov_y, 3, 0.3*višina_krone)

                ime = "konjica" + "_" + barveVImeBarve[ba]
                shrani(ime, out)

# https://stackoverflow.com/questions/22163442/how-to-force-local-scope-in-python


# zid (skala)
out = Image.new("RGBA", (100, 100), (255, 255, 255, 0))
draw = ImageDraw.Draw(out, mode="RGBA")

# širinaTeksta, višinaTeksta = draw.textsize("Zid", font=unicode_font)

"""
koordinate = (
    (širinaSlike - širinaTeksta)/2,
    (višinaSlike - višinaTeksta)/2
)
"""

# napiši(draw, "Zid", (0, 0, 0), koordinate)

draw.rectangle((0, 0, širinaSlike, višinaSlike), fill=(0, 0, 0))

ime = "skala"
shrani(ime, out)


# praznina
out = Image.new("RGBA", (100, 100), (255, 255, 255, 0))

ime = "praznina"
shrani(ime, out)


# pika
out = Image.new("RGBA", (100, 100), (255, 255, 255, 0))
draw = ImageDraw.Draw(out, mode="RGBA")

draw.ellipse((35, 35, 65, 65), fill='black', outline='black')

ime = "pika"
shrani(ime, out)

# za prikaz slike bi dali:
# out.show()