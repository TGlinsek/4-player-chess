#
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


def napiši_multiline(draw, tekst, barva):
    draw.multiline_text((50, 50), tekst, fill=barva, font=unicode_font, align="center")  # lahko dodamo \n v tekst

širinaSlike, višinaSlike = 100, 100

# kralj
out = Image.new("RGBA", (100, 100), (255, 0, 0, 0))
draw = ImageDraw.Draw(out, mode="RGBA")

širinaTeksta, višinaTeksta = draw.textsize("Kralj", font=unicode_font)
# širinaSlike, višinaSlike = out.size  # no, to bi lahk tut kr iz parametrov razbrali

# https://stackoverflow.com/questions/1970807/center-middle-align-text-with-pil
koordinate = (
    (širinaSlike - širinaTeksta)/2,
    (višinaSlike - višinaTeksta)/2
)

napiši(draw, "Kralj", (0, 0, 0), koordinate)
ime = "kralj"
shrani(ime, out)


# kraljica
out = Image.new("RGBA", (100, 100), (255, 0, 0, 0))
draw = ImageDraw.Draw(out, mode="RGBA")

širinaTeksta, višinaTeksta = draw.textsize("Kraljica", font=unicode_font)

koordinate = (
    (širinaSlike - širinaTeksta)/2,
    (višinaSlike - višinaTeksta)/2
)

napiši(draw, "Kraljica", (0, 0, 0), koordinate)
ime = "kraljica"
shrani(ime, out)


# tekač
out = Image.new("RGBA", (100, 100), (255, 0, 0, 0))
draw = ImageDraw.Draw(out, mode="RGBA")

širinaTeksta, višinaTeksta = draw.textsize("Tekač", font=unicode_font)

koordinate = (
    (širinaSlike - širinaTeksta)/2,
    (višinaSlike - višinaTeksta)/2
)

napiši(draw, "Tekač", (0, 0, 0), koordinate)
ime = "tekač"
shrani(ime, out)


# konj
out = Image.new("RGBA", (100, 100), (255, 0, 0, 0))
draw = ImageDraw.Draw(out, mode="RGBA")

širinaTeksta, višinaTeksta = draw.textsize("Konj", font=unicode_font)

koordinate = (
    (širinaSlike - širinaTeksta)/2,
    (višinaSlike - višinaTeksta)/2
)

napiši(draw, "Konj", (0, 0, 0), koordinate)
ime = "konj"
shrani(ime, out)


# kralj
out = Image.new("RGBA", (100, 100), (255, 0, 0, 0))
draw = ImageDraw.Draw(out, mode="RGBA")

širinaTeksta, višinaTeksta = draw.textsize("Trdnjava", font=unicode_font)

koordinate = (
    (širinaSlike - širinaTeksta)/2,
    (višinaSlike - višinaTeksta)/2
)

napiši(draw, "Trdnjava", (0, 0, 0), koordinate)
ime = "trdnjava"
shrani(ime, out)


# kralj
out = Image.new("RGBA", (100, 100), (255, 0, 0, 0))
draw = ImageDraw.Draw(out, mode="RGBA")

širinaTeksta, višinaTeksta = draw.textsize("Kmet", font=unicode_font)

koordinate = (
    (širinaSlike - širinaTeksta)/2,
    (višinaSlike - višinaTeksta)/2
)

napiši(draw, "Kmet", (0, 0, 0), koordinate)
ime = "kmet"
shrani(ime, out)


# kralj
out = Image.new("RGBA", (100, 100), (255, 0, 0, 0))
draw = ImageDraw.Draw(out, mode="RGBA")

širinaTeksta, višinaTeksta = draw.textsize("Konjica", font=unicode_font)

koordinate = (
    (širinaSlike - širinaTeksta)/2,
    (višinaSlike - višinaTeksta)/2
)

napiši(draw, "Konjica", (0, 0, 0), koordinate)
ime = "konjica"
shrani(ime, out)


# zid (skala)
out = Image.new("RGBA", (100, 100), (255, 0, 0, 0))
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
out = Image.new("RGBA", (100, 100), (255, 0, 0, 0))

ime = "praznina"
shrani(ime, out)

# za prikaz slike bi dali:
# out.show()