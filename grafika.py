# ustvari slike in jih shrani v imenik "slike"
from PIL import Image, ImageDraw, ImageFont
import os

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

unicode_font = ImageFont.truetype(cwd1 + "\\dejavu-fonts-ttf-2.37\\ttf\\DejaVuSans.ttf", 20)
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

for ba in barveVIgralca.keys():
    for be in besede:
        out = Image.new("RGBA", (širinaSlike, višinaSlike), ba)
        draw = ImageDraw.Draw(out, mode="RGBA")

        širinaTeksta, višinaTeksta = draw.textsize(be, font=unicode_font)
        # širinaSlike, višinaSlike = out.size  # no, to bi lahk tut kr iz parametrov razbrali

        # https://stackoverflow.com/questions/1970807/center-middle-align-text-with-pil
        koordinate = (
            (širinaSlike - širinaTeksta)/2,
            (višinaSlike - višinaTeksta)/2
        )

        if be == "Kmet":
            napiši_multiline(draw, be + "\n" + oznakeSmeri[smeri[barveVIgralca[ba]]], (0, 0, 0), koordinate)
        else:
            napiši(draw, be, (0, 0, 0), koordinate)
        ime = be.lower() + "_" + barveVImeBarve[ba]
        shrani(ime, out)


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

# za prikaz slike bi dali:
# out.show()