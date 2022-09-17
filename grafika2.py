# ustvari slike in jih shrani v imenik "slike"
from PIL import Image, ImageDraw, ImageFont
import os
from math import cos, sin, pi

from pathlib import Path


cwd = os.getcwd()
starš = Path(__file__).parent

os.chdir(starš)  # gremo eno mapo gor, da lahko gremo nazaj eno mapo dol
cwd1 = os.getcwd()
os.chdir("slike2")

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

# def nazobčana_glava(x1, y1, x2, y2, globina_luknje, število_zobov=3):


for ba in barveVIgralca.keys():
    for be in besede:
        out = Image.new("RGBA", (širinaSlike, višinaSlike), ba)
        draw = ImageDraw.Draw(out, mode="RGBA")
        
        if be == "Kmet":
            
            draw.ellipse([(širinaSlike/3, višinaSlike/6), (2*širinaSlike/3, višinaSlike/2)], outline=(0, 0, 0), width=5)
            # draw.ellipse([(širinaSlike/6, višinaSlike/2), (5*širinaSlike/6, 3*višinaSlike/2)], outline=(0, 0, 0), width=5)
            sp = 9*višinaSlike/10
            # draw.rectangle([(0, sp), (širinaSlike, višinaSlike)], fill=ba)
            elipsa(draw, [(širinaSlike/6, višinaSlike/2), (5*širinaSlike/6, 3*višinaSlike/2)], [(0, sp), (širinaSlike, višinaSlike)], ba, fill=None, outline=(0, 0, 0), width=5)
            draw.line([(0.175 * širinaSlike, sp), ((1 - 0.175) * širinaSlike, sp)], fill=(0, 0, 0), width=5)
            ime = "kmet" + "_" + barveVImeBarve[ba]
            shrani(ime, out)
        elif be == "Kralj":
            višina_rect = 1.2*višinaSlike/10
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

            draw.line((x0 + rx*cos(kot1_rad), y0 - ry*sin(kot1_rad), širinaSlike - (x0 + rx*cos(kot1_rad)), y0 - ry*sin(kot1_rad)), fill=0, width=5)

        
            draw.arc((x1, y1 - višina_rect, x2, y2 - višina_rect), -kot1, 0, fill=0, width=5)
            draw.arc((širinaSlike - x2, y1 - višina_rect, širinaSlike - x1, y2 - višina_rect), 180, 180 + kot1, fill=0, width=5)
            
            draw.rectangle([(3*širinaSlike/10, 4.5*višinaSlike/10 - višina_rect), (7*širinaSlike/10, 4.5*višinaSlike/10)], outline=(0, 0, 0), width=5)

            kot2 = 50
            kot2_rad = kot2*pi/180
            draw.arc((x1, y1, x2, y2), 0, kot2, fill=0, width=5)
            draw.arc((širinaSlike - x2, y1, širinaSlike - x1, y2), 180 - kot2, 180, fill=0, width=5)
            sp = 9.5*višinaSlike/10
            lv = 2*širinaSlike/10


            #elipsa(draw, [(širinaSlike/6, višinaSlike/2), (5*širinaSlike/6, 3*višinaSlike/2)], [(0, sp - 1.5*višinaSlike/10), (širinaSlike, višinaSlike)], ba, fill=None, outline=(0, 0, 0), width=5)
            draw.rectangle([(lv, sp - 1.5*višinaSlike/10), (širinaSlike - lv, sp)], outline=(0, 0, 0), width=5)
            
            ime = "kralj" + "_" + barveVImeBarve[ba]
            shrani(ime, out)
        elif be == "Kraljica":
            višina_rect = 1.2*višinaSlike/10
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

            draw.line((x0 + rx*cos(kot1_rad), y0 - ry*sin(kot1_rad), širinaSlike - (x0 + rx*cos(kot1_rad)), y0 - ry*sin(kot1_rad)), fill=0, width=5)

        
            draw.arc((x1, y1 - višina_rect, x2, y2 - višina_rect), -kot1, 0, fill=0, width=5)
            draw.arc((širinaSlike - x2, y1 - višina_rect, širinaSlike - x1, y2 - višina_rect), 180, 180 + kot1, fill=0, width=5)
            
            draw.rectangle([(3*širinaSlike/10, 4.5*višinaSlike/10 - višina_rect), (7*širinaSlike/10, 4.5*višinaSlike/10)], outline=(0, 0, 0), width=5)

            kot2 = 50
            kot2_rad = kot2*pi/180
            draw.arc((x1, y1, x2, y2), 0, kot2, fill=0, width=5)
            draw.arc((širinaSlike - x2, y1, širinaSlike - x1, y2), 180 - kot2, 180, fill=0, width=5)
            sp = 9.5*višinaSlike/10
            lv = 2*širinaSlike/10


            #elipsa(draw, [(širinaSlike/6, višinaSlike/2), (5*širinaSlike/6, 3*višinaSlike/2)], [(0, sp - 1.5*višinaSlike/10), (širinaSlike, višinaSlike)], ba, fill=None, outline=(0, 0, 0), width=5)
            draw.rectangle([(lv, sp - 1.5*višinaSlike/10), (širinaSlike - lv, sp)], outline=(0, 0, 0), width=5)
            
            ime = "kraljica" + "_" + barveVImeBarve[ba]
            shrani(ime, out)
        """
        elif be == "Trdnjava":
            višina_rect = 0
            x1 = -širinaSlike
            y1 = -višinaSlike/2
            x2 = širinaSlike/4
            y2 = 3*višinaSlike/2

            
            rx = (x2 - x1)/2
            x0 = x1 + rx
            ry = (y2 - y1)/2
            y0 = y1 + ry - višina_rect

            kot1 = 20
            kot1_rad = kot1*pi/180
            
            # bunkica
            # višina_križa = višinaSlike/10
            # širina_križa = 0.7*širinaSlike/10
            # draw.ellipse((širinaSlike/2 - širina_križa/2, y0 - ry*sin(kot1_rad) - višina_križa, širinaSlike/2 + širina_križa/2, y0 - ry*sin(kot1_rad)), fill=(0, 0, 0), width=5)

            draw.line((x0 + rx*cos(kot1_rad), y0 - ry*sin(kot1_rad), širinaSlike - (x0 + rx*cos(kot1_rad)), y0 - ry*sin(kot1_rad)), fill=0, width=5)

        
            draw.arc((x1, y1 - višina_rect, x2, y2 - višina_rect), -kot1, 0, fill=0, width=5)
            draw.arc((širinaSlike - x2, y1 - višina_rect, širinaSlike - x1, y2 - višina_rect), 180, 180 + kot1, fill=0, width=5)
            
            # draw.rectangle([(3*širinaSlike/10, 4.5*višinaSlike/10 - višina_rect), (7*širinaSlike/10, 4.5*višinaSlike/10)], outline=(0, 0, 0), width=5)

            kot2 = 15
            kot2_rad = kot2*pi/180
            draw.arc((x1, y1, x2, y2), 0, kot2, fill=0, width=5)
            draw.arc((širinaSlike - x2, y1, širinaSlike - x1, y2), 180 - kot2, 180, fill=0, width=5)
            sp = 9.5*višinaSlike/10
            lv = 2*širinaSlike/10


            #elipsa(draw, [(širinaSlike/6, višinaSlike/2), (5*širinaSlike/6, 3*višinaSlike/2)], [(0, sp - 1.5*višinaSlike/10), (širinaSlike, višinaSlike)], ba, fill=None, outline=(0, 0, 0), width=5)
            draw.rectangle([(lv, sp - 1.5*višinaSlike/10), (širinaSlike - lv, sp)], outline=(0, 0, 0), width=5)
            
            ime = "trdnjava" + "_" + barveVImeBarve[ba]
            shrani(ime, out)
        """

# zid (skala)
out = Image.new("RGBA", (100, 100), (255, 255, 255, 0))
draw = ImageDraw.Draw(out, mode="RGBA")

širinaTeksta, višinaTeksta = draw.textsize("Zid", font=unicode_font)

koordinate = (
    (širinaSlike - širinaTeksta)/2,
    (višinaSlike - višinaTeksta)/2
)

napiši(draw, "Zid", (0, 0, 0), koordinate)
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