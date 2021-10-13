var vrniIgralca = function(string) {  // vrne 1, če prvi igralec, oz. 2, če drugi igralec, oz. ..., drugače vrne 0, če prazno polje, če pa skala, pa vrne -1
    if (["1", "2", "3", "4"].includes(string[1])) return parseInt(string[1]);
    if (string[1] == "X") return -1;
    return 0;
}

var seznamaStaEnaka = function(sez1, sez2) {  // seznama morata biti dolžine 2
    // deluje le, če so elementi obeh seznamov primitivni tipi
    var a, b;
    [a, b] = sez1;
    var x, y;
    [x, y] = sez2;
    return a == x && b == y;
}

var seznamVsebuje = function(sez, vsebovanec) {  // le če vsebovanec in vsi elementi seza vsi dolžine 2
    for (var i = 0; i < sez.length; i++) {
        if (seznamaStaEnaka(sez[i], vsebovanec)) {
            return true;
        }
    }
    return false;
}

var podvoji = function(seznam) {  // seznam dolžine 2, ki ima za elemente števila
    var a, b;
    [a, b] = seznam;
    return [2 * a, 2 * b];
}

var seštej = function(sez1, sez2) {  // seznam dolžine 2, ki ima za elemente števila
    var a, b;
    [a, b] = sez1;
    var c, d;
    [c, d] = sez2;
    return [a + c, b + d];
}

var potezaKmetaVeljavna = function(xPremik, yPremik, smerniVektor, zbijanje, kmetLahkoGreZaDva=false) {  // vrne true, če je veljavna
    // xPremik je vektor x smeri: x2 - x1
    // yPremik je vektor y smeri: y2 - y1
    // smerNeba: N, S, W, ali E
    // zbijanje: bool, ki pove, a kmet zbija
    // zaenkrat ignoriramo premikanje za dva polja in pa en passant
    // smerni vektor je enotski vektor

    // tukaj ne preverjamo, ali je poteza dejansko izvedljiva (recimo, da ni skala na poti), saj itak nimamo informacij o plošči
    if (!zbijanje) {
        if (kmetLahkoGreZaDva && 
            seznamaStaEnaka([xPremik, yPremik], podvoji(smerniVektor))) return true;
        return seznamaStaEnaka([xPremik, yPremik], smerniVektor);
    } else {
        var seznam = [];
        if (seznamaStaEnaka(smerniVektor, [0, -1])) {
            seznam = [[-1, -1], [1, -1]];
        } else if (seznamaStaEnaka(smerniVektor, [0, 1])) {
            seznam = [[-1, 1], [1, 1]];
        } else if (seznamaStaEnaka(smerniVektor, [-1, 0])) {
            seznam = [[-1, -1], [-1, 1]];
        } else if (seznamaStaEnaka(smerniVektor, [1, 0])) {
            seznam = [[1, -1], [1, 1]];
        } else {
            throw "Ta smer sploh ni veljavna!";
        }

        return seznamVsebuje(seznam, [xPremik, yPremik]);
    }
}


var Igra = function(plošča) {
    this.šahiraniIgralci = [];  // igralci, trenutno v šahu
    this.prviPoraženec = null;

    this.igralecNaVrsti = 1;  // 1, 2, 3, ali 4

    this.vrstniRedIgralcev = [1, 3, 2, 4];

    this.enPassants = {
        1 : null,  // format je 1 : (5, 3), kjer polje (5, 3) predstavlja polje, kjer bi kmet bil, če bi šel le za eno naprej. Po eni rundi se to polje spremeni v null, razen če ta igralec prestavi kakega drugega kmeta za dve naprej
        2 : null,
        3 : null,
        4 : null
    }

    this.pridobiNaslednjegaIgralca = function() {
        trenutniIndeks = this.vrstniRedIgralcev.indexOf(this.igralecNaVrsti);
        if (trenutniIndeks >= this.vrstniRedIgralcev.length - 1) {  // nikoli ne velja trenutniIndeks > this.vrstniRedIgralcev.length - 1, tako da bi lahko dali tudi enakost
            return this.vrstniRedIgralcev[0];
        }
        return this.vrstniRedIgralcev[trenutniIndeks + 1];
    };

    this.smeri = {
        1 : "N",  // igralec 1 gre navzgor
        2 : "S",  // igralec 2 gre navzdol
        3 : "E",
        4 : "W"
    }

    this.smerniVektorji = {
        "N" : [0, -1],
        "S" : [0, 1],
        "W" : [-1, 0],
        "E" : [1, 0]
    }

    /*
    this.plošča = [
        ["R2", "V2", "L2", "Q2", "K2", "L2", "V2", "R2"],
        ["P2", "P2", "P2", "P2", "P2", "P2", "P2", "P2"],
        ["EE", "EE", "EE", "EE", "EE", "EE", "EE", "EE"],
        ["EE", "EE", "EE", "EE", "EE", "EE", "EE", "EE"],
        ["EE", "EE", "EE", "EE", "EE", "EE", "XX", "EE"],  // XX je skala
        ["EE", "EE", "EE", "EE", "EE", "EE", "EE", "EE"],
        ["P1", "P1", "P1", "P1", "P1", "P1", "P1", "P1"],
        ["R1", "V1", "L1", "Q1", "K1", "L1", "V1", "R1"]
    ];
    */
    
    this.plošča = [
        ["XX", "XX", "XX", "R2", "V2", "L2", "K2", "Q2", "L2", "V2", "R2", "XX", "XX", "XX"],
        ["XX", "XX", "XX", "P2", "P2", "P2", "P2", "P2", "P2", "P2", "P2", "XX", "XX", "XX"],
        ["XX", "XX", "XX", "EE", "EE", "EE", "EE", "EE", "EE", "EE", "EE", "XX", "XX", "XX"],
        ["R3", "P3", "EE", "EE", "EE", "EE", "EE", "EE", "EE", "EE", "EE", "EE", "P4", "R4"],
        ["V3", "P3", "EE", "EE", "EE", "EE", "EE", "EE", "EE", "EE", "EE", "EE", "P4", "V4"],
        ["L3", "P3", "EE", "EE", "EE", "EE", "EE", "EE", "EE", "EE", "EE", "EE", "P4", "L4"],
        ["K3", "P3", "EE", "EE", "EE", "EE", "EE", "EE", "EE", "EE", "EE", "EE", "P4", "Q4"],
        ["Q3", "P3", "EE", "EE", "EE", "EE", "EE", "EE", "EE", "EE", "EE", "EE", "P4", "K4"],
        ["L3", "P3", "EE", "EE", "EE", "EE", "EE", "EE", "EE", "EE", "EE", "EE", "P4", "L4"],
        ["V3", "P3", "EE", "EE", "EE", "EE", "EE", "EE", "EE", "EE", "EE", "EE", "P4", "V4"],
        ["R3", "P3", "EE", "EE", "EE", "EE", "EE", "EE", "EE", "EE", "EE", "EE", "P4", "R4"],
        ["XX", "XX", "XX", "EE", "EE", "EE", "EE", "EE", "EE", "EE", "EE", "XX", "XX", "XX"],
        ["XX", "XX", "XX", "P1", "P1", "P1", "P1", "P1", "P1", "P1", "P1", "XX", "XX", "XX"],
        ["XX", "XX", "XX", "R1", "V1", "L1", "Q1", "K1", "L1", "V1", "R1", "XX", "XX", "XX"]
    ]


    this.širina = this.plošča[0].length;
    this.višina = this.plošča.length;


    this.vrniPolje = function(x, y) {
        if (x < 0 || x >= this.širina || y < 0 || y >= this.višina) return "XX";  // če smo izven mej, vrnemo skalo
        return this.plošča[y][x];
    }

    // za mouse evente:
    this.začetnoPolje = null;
    this.končnoPolje = null;

    this.poltrakJeProstInVeljaven = function(x1, y1, x2, y2) {  // za poltrak se šteje vsaka izmed 8 glavnih smeri: 4 smeri neba in 4 diagonale
        if (Math.abs(x1 - x2) != Math.abs(y1 - y2) && x1 != x2 && y1 != y2) return false;  // to sploh ni poltrak
        for (var i = 1; i < Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)); i++) {
            if ("EE" != this.vrniPolje(x1 + i * Math.sign(x2 - x1), y1 + i * Math.sign(y2 - y1))) {
                return false;
            }
        }
        return true;
    }

    this.poljeJeNapadenoPoDiagonali = function(x, y, igralec=this.igralecNaVrsti) {  // poleg boola vrne tudi koordinate napadalca; če jih je več, potem naključnega
        var seznamNapadalcev = [];
        for (var i = -1; i <= 1; i += 2) {
            for (var j = -1; j <= 1; j += 2) {
                var k = 1;
                while (this.vrniPolje(x + k * i, y + k * j) == "EE") {
                    k += 1;
                }
                var meja = this.vrniPolje(x + k * i, y + k * j);
                if (meja == "XX") {
                    continue;
                }
                if (meja[1] != String(igralec) && (["L", "Q", "A"].includes(meja[0]) || (k == 1 && meja[0] == "K"))) {
                    // return [true, [x + k * i, y + k * j]];  // bomo rajš tkle: če je true, potem seznam ni prazen, če pa je false, pa je
                    seznamNapadalcev.push([x + k * i, y + k * j]);
                }
            }
        }
        return seznamNapadalcev;
    }

    this.poljeJeNapadenoPoDiagonaliSStraniNapadalca = function(x, y, napadalec, kraljJeVključen=false) {
        // kraljJeVključen samo pomeni, ali upoštevamo morebitno napadanje kralja ali ne
        // pač, nek odlikovan igralec je napadalec
        /*  // ta zakomentirana koda ne nardi tega, kar mi hočemo
        var sez = this.poljeJeNapadenoPoDiagonali(x, y, igralec);
        var novSez = [];
        for (var i = 0; i < sez.length; i++) {
            var x_, y_;
            [x_, y_] = sez[i];
            if (this.vrniPolje(x_, y_)[1] == String(napadalec)) {  // napadalec je int
                novSez.push(sez[i]);
            }
        }
        return novSez;
        */
        var seznamNapadalcev = [];
        for (var i = -1; i <= 1; i += 2) {
            for (var j = -1; j <= 1; j += 2) {
                var k = 1;
                while (this.vrniPolje(x + k * i, y + k * j) == "EE") {
                    k += 1;
                }
                var meja = this.vrniPolje(x + k * i, y + k * j);
                if (meja == "XX") {
                    continue;
                }
                if (meja[1] == String(napadalec) && (["L", "Q", "A"].includes(meja[0]) || (k == 1 && meja[0] == "K" && kraljJeVključen))) {
                    // return [true, [x + k * i, y + k * j]];  // bomo rajš tkle: če je true, potem seznam ni prazen, če pa je false, pa je
                    seznamNapadalcev.push([x + k * i, y + k * j]);
                }
            }
        }
        return seznamNapadalcev;
    }

    this.poljeJeNapadenoPoRavniČrti = function(x, y, igralec=this.igralecNaVrsti) {  // po vodoravnici ali navpičnici
        var seznamNapadalcev = [];
        for (var i = -1; i <= 1; i += 2) {
            for (var j = -1; j <= 1; j += 2) {
                var k = 1;

                var i_ = (i != j) * i, j_ = (i == j) * j;
                /*
                (1, -1) -> (1, 0)
                (-1, 1) -> (-1, 0)
                (1, 1) -> (0, 1)
                (-1, -1) -> (0, -1)
                */

                while (this.vrniPolje(x + k * i_, y + k * j_) == "EE") {
                    k += 1;
                }
                var meja = this.vrniPolje(x + k * i_, y + k * j_);
                if (meja == "XX") {
                    continue;
                }
                if (meja[1] != String(igralec) && (["R", "Q", "A"].includes(meja[0]) || (k == 1 && meja[0] == "K"))) {
                    // return [true, [x + k * i_, y + k * j_]];
                    seznamNapadalcev.push([x + k * i_, y + k * j_])
                }
            }
        }
        return seznamNapadalcev;
    }

    this.poljeJeNapadenoPoRavniČrtiSStraniNapadalca = function(x, y, napadalec, kraljJeVključen=false) {
        // kraljJeVključen samo pomeni, ali upoštevamo morebitno napadanje kralja ali ne
        /*
        var sez = this.poljeJeNapadenoPoRavniČrti(x, y, igralec);
        var novSez = [];
        for (var i = 0; i < sez.length; i++) {
            var x_, y_;
            [x_, y_] = sez[i];
            if (this.vrniPolje(x_, y_)[1] == String(napadalec)) {  // napadalec je int
                novSez.push(sez[i]);
            }
        }
        return novSez;
        */
        var seznamNapadalcev = [];
        for (var i = -1; i <= 1; i += 2) {
            for (var j = -1; j <= 1; j += 2) {
                var k = 1;

                var i_ = (i != j) * i, j_ = (i == j) * j;
                /*
                (1, -1) -> (1, 0)
                (-1, 1) -> (-1, 0)
                (1, 1) -> (0, 1)
                (-1, -1) -> (0, -1)
                */

                while (this.vrniPolje(x + k * i_, y + k * j_) == "EE") {
                    k += 1;
                }
                var meja = this.vrniPolje(x + k * i_, y + k * j_);
                if (meja == "XX") {
                    continue;
                }
                if (meja[1] == String(napadalec) && (["R", "Q", "A"].includes(meja[0]) || (k == 1 && meja[0] == "K" && kraljJeVključen))) {
                    // return [true, [x + k * i_, y + k * j_]];
                    seznamNapadalcev.push([x + k * i_, y + k * j_])
                }
            }
        }
        return seznamNapadalcev;
    }

    this.poljeJeNapadenoPoKonje = function(x, y, igralec=this.igralecNaVrsti) {
        var seznamNapadalcev = [];
        for (var i = -2; i <= 2; i += 4) {
            for (var j = -1; j <= 1; j += 2) {
                for (var k = 0; k <= 1; k++) {
                    var meja = [this.vrniPolje(x + i, y + j), this.vrniPolje(x + j, y + i)][k];
                    var koordMeje = [[x + i, y + j], [x + j, y + i]][k];
                    if (["EE", "XX"].includes(meja)) {
                        continue;
                    }
                    if (meja[1] != String(igralec) && ["V", "A"].includes(meja[0])) {
                        // return [true, koordMeje];
                        seznamNapadalcev.push(koordMeje);
                    }
                }
            }
        }
        return seznamNapadalcev;
    }

    this.poljeJeNapadenoPoKonjeSStraniNapadalca = function(x, y, napadalec) {
        /*
        var sez = this.poljeJeNapadenoPoKonje(x, y, igralec);
        var novSez = [];
        for (var i = 0; i < sez.length; i++) {
            var x_, y_;
            [x_, y_] = sez[i];
            if (this.vrniPolje(x_, y_)[1] == String(napadalec)) {  // napadalec je int
                novSez.push(sez[i]);
            }
        }
        return novSez;
        */
        var seznamNapadalcev = [];
        for (var i = -2; i <= 2; i += 4) {
            for (var j = -1; j <= 1; j += 2) {
                for (var k = 0; k <= 1; k++) {
                    var meja = [this.vrniPolje(x + i, y + j), this.vrniPolje(x + j, y + i)][k];
                    var koordMeje = [[x + i, y + j], [x + j, y + i]][k];
                    if (["EE", "XX"].includes(meja)) {
                        continue;
                    }
                    if (meja[1] == String(napadalec) && ["V", "A"].includes(meja[0])) {
                        // return [true, koordMeje];
                        seznamNapadalcev.push(koordMeje);
                    }
                }
            }
        }
        return seznamNapadalcev;
    }

    this.poljeJeNapadenoPrekoKmeta = function(x, y, igralec=this.igralecNaVrsti) {
        var seznamNapadalcev = [];
        for (var i = -1; i <= 1; i += 2) {
            for (var j = -1; j <= 1; j += 2) {
                var meja = this.vrniPolje(x + i, y + j);
                if (["EE", "XX"].includes(meja)) {
                    continue;
                }
                if (meja[1] == String(igralec)) {  // svojih kmetov ne upoštevamo
                    continue;
                }
                var smer = this.smeri[parseInt(meja[1])];
                if (meja[0] == "P" && seznamVsebuje([[-i, 0], [0, -j]], this.smerniVektorji[smer])) {  // če (i, j) vektor iz (x, y) do (x + i, y + j), potem sta vektorja (-i, 0) in (0, -j) ravno ta vektorja, da te kmet s to smerjo premikanja lahko zbije
                    // return [true, [x + i, y + j]];
                    seznamNapadalcev.push([x + i, y + j]);
                }
            }
        }
        return seznamNapadalcev;
    }

    this.poljeJeNapadenoPrekoKmetaSStraniNapadalca = function(x, y, napadalec) {
        /*
        var sez = this.poljeJeNapadenoPrekoKmeta(x, y, igralec);
        var novSez = [];
        for (var i = 0; i < sez.length; i++) {
            var x_, y_;
            [x_, y_] = sez[i];
            if (this.vrniPolje(x_, y_)[1] == String(napadalec)) {  // napadalec je int
                novSez.push(sez[i]);
            }
        }
        return novSez;
        */
        if (this.vrniPolje(x, y)[1] == String(napadalec) || this.vrniPolje(x, y)[1] == "E" || this.vrniPolje(x, y)[1] == "X") {
            return [];  // namreč ne kmet ne more napadati, če to kar napada ni nasprotnikova figura
        }

        var seznamNapadalcev = [];
        for (var i = -1; i <= 1; i += 2) {
            for (var j = -1; j <= 1; j += 2) {
                var meja = this.vrniPolje(x + i, y + j);
                if (["EE", "XX"].includes(meja)) {
                    continue;
                }
                if (meja[1] != String(napadalec)) {  // figura mora biti napadalčeva
                    continue;
                }
                var smer = this.smeri[parseInt(meja[1])];
                if (meja[0] == "P" && seznamVsebuje([[-i, 0], [0, -j]], this.smerniVektorji[smer])) {  // če (i, j) vektor iz (x, y) do (x + i, y + j), potem sta vektorja (-i, 0) in (0, -j) ravno ta vektorja, da te kmet s to smerjo premikanja lahko zbije
                    // return [true, [x + i, y + j]];
                    seznamNapadalcev.push([x + i, y + j]);
                }
            }
        }
        return seznamNapadalcev;
    }

    this.poljeJeVidenoPrekoKmetaSStraniNapadalca = function(x, y, napadalec) {
        if (this.vrniPolje(x, y)[0] != "E") {
            return [];  // namreč kmet se ne more premakniti naprej, če sprednje polje ni prazno
        }

        var seznamNapadalcev = [];
        for (var i = -1; i <= 1; i += 2) {
            for (var j = -1; j <= 1; j += 2) {
                var i_ = (i != j) * i, j_ = (i == j) * j;
                /*
                (1, -1) -> (1, 0)
                (-1, 1) -> (-1, 0)
                (1, 1) -> (0, 1)
                (-1, -1) -> (0, -1)
                */
                var meja = this.vrniPolje(x + i_, y + j_);
                if (["EE", "XX"].includes(meja)) {
                    continue;
                }
                if (meja[1] != String(napadalec)) {
                    continue;
                }
                var smer = this.smeri[parseInt(meja[1])];
                if (meja[0] == "P" && seznamaStaEnaka([-i_, -j_], this.smerniVektorji[smer])) {
                    // return [true, [x + i_, y + j_]];
                    seznamNapadalcev.push([x + i_, y + j_]);
                }
            }
        }
        return seznamNapadalcev;
    }

    this.poljeJeNapadenoOzVidenoPrekoKmetaSStraniNapadalca = function(x, y, napadalec) {  // informacija o napadalcu seveda tudi poda smer tega kmeta
        // velja tudi, če kmet recimo na polju (x - 1, y) in se lahko samo naravnost premakne na (x, y). Podobno za ostale smeri
        // predpostavljamo, da na (x, y) ni skale ali pa kar prijateljske figure od kmeta, ampak tega ne bomo posebej preverjali (no, tu bomo, da ločimo, ali se kmet le premika ali pa tudi napada)
        return [...this.poljeJeNapadenoPrekoKmetaSStraniNapadalca(x, y, napadalec), ...this.poljeJeVidenoPrekoKmetaSStraniNapadalca(x, y, napadalec)];
    }

    // preko kralja pa itak ne more bit napadeno

    this.nasprotnikVidiToPolje = function(x, y, neNasprotnik=this.igralecNaVrsti) {  // torej, kralja ne moremo tja premakniti
        // vrne par: prvi element je bool (če je true, potem nasprotnik vidi to polje, drugače false), drugi element pa pove koordinate nasprotnikove figure, ki napada to polje
        var sez1 = this.poljeJeNapadenoPoDiagonali(x, y, neNasprotnik);
        var sez2 = this.poljeJeNapadenoPoRavniČrti(x, y, neNasprotnik);
        var sez3 = this.poljeJeNapadenoPoKonje(x, y, neNasprotnik);
        var sez4 = this.poljeJeNapadenoPrekoKmeta(x, y, neNasprotnik);
        return [...sez1, ...sez2, ...sez3, ...sez4];
    }

    this.šahJe = function(neNasprotnik, poljeKraljaOdNeNasprotnika=null) {  // vrne true, če je šah za neNasprotnika
        if (poljeKraljaOdNeNasprotnika == null) {  // če to ni null, potem prihranimo veliko časa za iskanje polje kralja
            for (var i = 0; i < this.plošča.length; i++) {
                for (var j = 0; j < this.plošča[i].length; j++) {
                    if (this.vrniPolje(j, i) == ("K" + neNasprotnik)) {
                        poljeKraljaOdNeNasprotnika = [j, i];
                    }
                }
            }
        }

        return this.nasprotnikVidiToPolje(poljeKraljaOdNeNasprotnika[0], poljeKraljaOdNeNasprotnika[1], neNasprotnik).length != 0;
    }

    this.trdnjavaSeLahkoPremakne = function(x1, y1, x2, y2) {  // predpostavljamo, da bi trdnjava lahko pristala na (x2, y2), tj., predpostavljamo, da tam ni recimo skale ali pa neke prijateljske figure (ampak tega ne bomo preverjali, kr zaupamo uporabniku te funkcije)
        // predpostavljamo tudi, da na (x1, y1) res trdnjava, ampak spet, tega ne bomo preverjali posebej
        // ni važno, a je trdnjava dejansko na x1, y1; tam je lahko karkoli drugega. Prav tako je na (x2, y2) lahko karkoli, ne rabi bit prazno
        // važno pa je, da so vsa polja vmes prazna, da se lahko hipotetična trdnjava pelje po njih
        return (x1 == x2 || y1 == y2) && this.poltrakJeProstInVeljaven(x1, y1, x2, y2);
    }

    this.konjSeLahkoPremakne = function(x1, y1, x2, y2) {
        return x1 != x2 && y1 != y2 && Math.abs(x1 - x2) + Math.abs(y1 - y2) == 3;
    }

    this.tekačSeLahkoPremakne = function(x1, y1, x2, y2) {
        return Math.abs(x2 - x1) == Math.abs(y2 - y1) && this.poltrakJeProstInVeljaven(x1, y1, x2, y2);
    }

    this.kraljicaSeLahkoPremakne = function(x1, y1, x2, y2) {
        return this.poltrakJeProstInVeljaven(x1, y1, x2, y2);
    }

    this.kraljSeLahkoPremakne = function(x1, y1, x2, y2, lastnikKralja=this.igralecNaVrsti) {
        // ker je kralj občutljiv na nasprotnikove figure, potrebujemo informacijo o tem, katere figure so nasprotnikove

        var igra3 = new Igra();
        // igra3.plošča = this.plošča.slice();  // plitka kopija
        igra3.plošča = JSON.parse(JSON.stringify(this.plošča));  // globoka kopija
        igra3.plošča[y1][x1] = "EE";  // kraljevo polje zamenjamo s praznim, zato da bo metoda "nasprotnikVidiToPolje" pravilno delovala (drugače bi lahko kralj zastiral pogled nasprotnikovih figur)
        return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2)) == 1 && !igra3.nasprotnikVidiToPolje(x2, y2, lastnikKralja)[0];
    }

    this.poljeJeTakšnoDaLahkoKmetiGrejoZaDvaNaprej = function(x, y, lastnikKmeta) {
        // lastnik kmeta je torej število od 1 do 4
        // return [1, 12].includes(y) || [1, 12].includes(x);  // lahko bi tudi vzeli presek [1, 12] in [x, y] in pogledali, ali je prazen
        if (x == 1 && lastnikKmeta == 3) return true;  // leva
        if (x == 12 && lastnikKmeta == 4) return true;  // desna
        if (y == 1 && lastnikKmeta == 2) return true;  // gor
        if (y == 12 && lastnikKmeta == 1) return true;  // dol
        return false;
    }

    this.vrniVseEnPassanteOdNasprotnikov = function(neNasprotnik=this.igralecNaVrsti) {  // vrne seznam tuplov (ne vsebuje nullov)
        var sez = [];
        for (var ključ in this.enPassants) {
            if (ključ != neNasprotnik) {  // to ne deluje pravilno, če uporabimo !==
                var vrednost = this.enPassants[ključ];
                if (vrednost != null) {
                    sez.push(vrednost);
                }
            }
        }
        return sez;
    }

    this.vrniVseEnPassanteOdNasprotnikov2 = function(neNasprotnik=this.igralecNaVrsti) {  // vrne seznam dvojic: igralec, tuple (brez nullov)
        var sez = [];
        for (var ključ in this.enPassants) {
            if (ključ != neNasprotnik) {  // to ne deluje pravilno, če uporabimo !==
                var vrednost = this.enPassants[ključ];
                if (vrednost != null) {
                    sez.push([ključ, vrednost]);
                }
            }
        }
        return sez;
    }

    /*
    this.izIgralcaPridobiKmetaKiSeJePremaknilZaDve = function(igralec) {
        var koordEnPassant = this.enPassants[igralec];
        if (koordEnPassant == null) {
            throw "To se ne sme zgoditi.";
        }
        var smerIgralca = this.smerniVektorji[this.smeri[igralec]];
        return seštej(koordEnPassant, smerIgralca);
    }
    */

    this.kmetSeLahkoPremakne = function(x1, y1, x2, y2, lastnikKmeta=this.igralecNaVrsti) {
        // console.log(cilj);  // že tu je cilj definiran in celo enak kot pa po naslednji vrstici. Ne vem pa, zakaj
        var cilj = this.vrniPolje(x2, y2);  // te vrstice torej ne rabimo, ampak za preglednost je boljš
        
        // tako navaden premik kot zbijanje je dovoljeno
        // predpostavljamo, da (x2, y2) ni zasedeno s prijateljsko figuro oz. s skalo, in da na (x1, y1) res kmet, in to ustreznega igralca. Tega ne bomo preverjali posebej
        var smer = this.smerniVektorji[this.smeri[lastnikKmeta]];  // tuki dejansko ne rabimo zamenjat this.igralecNaVrsti z neNasprotnik, ampak ni važno
        if (x2 == 5 && y2 == 11) {
            console.log(seznamVsebuje(this.vrniVseEnPassanteOdNasprotnikov(lastnikKmeta), [x2, y2]));
        }
        return potezaKmetaVeljavna(x2 - x1, y2 - y1, smer, cilj != "EE" || seznamVsebuje(this.vrniVseEnPassanteOdNasprotnikov(lastnikKmeta), [x2, y2]), 
            this.poljeJeTakšnoDaLahkoKmetiGrejoZaDvaNaprej(x1, y1, lastnikKmeta) && // ali je polje ustrezno za kmetov dvojni korak naprej
            this.vrniPolje(seštej([x1, y1], smer)[0], seštej([x1, y1], smer)[1]) == "EE"  // preverimo, da kmet, ki bi šel za dve polji naprej, ni preskočil kake figure ali pa skale
        );
    }

    this.konjicaSeLahkoPremakne = function(x1, y1, x2, y2) {
        return this.konjSeLahkoPremakne(x1, y1, x2, y2) || this.kraljicaSeLahkoPremakne(x1, y1, x2, y2);
    }

    this.premikJeMožen = function(x1, y1, x2, y2, neNasprotnik=this.igralecNaVrsti, poljeKraljaOdNeNasprotnika=null) {  // x gre od 0 do 7, prav tako y
        izhodišče = this.vrniPolje(x1, y1);
        cilj = this.vrniPolje(x2, y2);
        if (vrniIgralca(izhodišče) != neNasprotnik) return false;  // false, saj ne premikamo svoje figure, ampak figuro nekoga drugega
        if ([-1, neNasprotnik].includes(vrniIgralca(cilj))) return false;  // false, saj premikamo v skalo ali pa v svoje figure
        if (x1 == x2 && y1 == y2) return false;  // cilj ne sme biti enak izhodišču
        if (izhodišče[0] != "K") {  // če ni kralj, kr drugač se polje kralja spremeni. Za kralja je pa itak že spodaj poskrbljeno
            var igra2 = new Igra();  // skopiramo igro
            // igra2.plošča = this.plošča.slice();  // plitka kopija
            igra2.plošča = JSON.parse(JSON.stringify(this.plošča));  // globoka kopija

            // nardimo potezo z neko figuro, ki ni kralj
            igra2.plošča[y2][x2] = igra2.plošča[y1][x1];
            igra2.plošča[y1][x1] = "EE";

            // če je po tej potezi šah
            if (igra2.šahJe(neNasprotnik, poljeKraljaOdNeNasprotnika)) {  // če je šah, potem ko premaknemo figuro
                return false;
            }
        }
        switch(izhodišče[0]) {
            case "R":  // ignoriramo ro(k/š)ado
                return this.trdnjavaSeLahkoPremakne(x1, y1, x2, y2);
                break;
            case "V":
                return this.konjSeLahkoPremakne(x1, y1, x2, y2);
                break;
            case "L":
                return this.tekačSeLahkoPremakne(x1, y1, x2, y2);
                break;
            case "Q":
                return this.kraljicaSeLahkoPremakne(x1, y1, x2, y2);
                break;
            case "K":
                return this.kraljSeLahkoPremakne(x1, y1, x2, y2, neNasprotnik);
                break;
            case "P":
                return this.kmetSeLahkoPremakne(x1, y1, x2, y2, neNasprotnik);
                break;
            case "A":
                return this.konjicaSeLahkoPremakne(x1, y1, x2, y2);
                break;
            default:
                throw "To se ne bi smelo zgoditi.";
        }
    }


    this.premakni = function(x1, y1, x2, y2) {
        if (!this.premikJeMožen(x1, y1, x2, y2)) {
            throw "Napaka";
        }
        this.plošča[y2][x2] = this.plošča[y1][x1];
        this.plošča[y1][x1] = "EE";
        
        for (var [igralec, enPassant] of this.vrniVseEnPassanteOdNasprotnikov2(this.igralecNaVrsti)) {
            if (enPassant == null) throw "To se itak naj ne bi zgodilo.";
            if (seznamaStaEnaka(enPassant, [x2, y2]) && this.plošča[y2][x2][0] == "P" && Math.min(Math.abs(x2 - x1), Math.abs(y2 - y1)) == 1) {
                var smerNasprotnika = this.smerniVektorji[this.smeri[igralec]];
                var noveKoordinate = seštej(enPassant, smerNasprotnika);
                var [x, y] = noveKoordinate;
                this.plošča[y][x] = "EE";  // zbijemo nasprotnika preko en passanta
            }
        }
        /*
        if (seznamVsebuje(this.vrniVseEnPassanteOdNasprotnikov(this.igralecNaVrsti), [x2, y2]) && this.plošča[y2][x2][0] == "P" && Math.min(Math.abs(x2 - x1), Math.abs(y2 - y1)) == 1) {
            // tu zbijemo nasprotnika preko en passanta
        }
        */

        if (this.plošča[y2][x2][0] == "P" && Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)) == 2) {  // dvojni skok kmeta
            this.enPassants[this.igralecNaVrsti] = [(x1 + x2)/2, (y1 + y2)/2];
        } else {
            this.enPassants[this.igralecNaVrsti] = null;  // resetiramo en passant
        }

        this.aliJeŠahMat();

        this.igralecNaVrsti = this.pridobiNaslednjegaIgralca();
    }

    this.vsajEnaIzmedNašihFigurVidiPolje = function(koordinata, igralec, kraljJeVključen=false) {
        // kralj itak ne more bit taka figura, ki bi lahko preprečila šah le z nastavljanjem
        var x, y;
        [x, y] = koordinata;
        var unija = [
            ...this.poljeJeNapadenoPoDiagonaliSStraniNapadalca(x, y, igralec, kraljJeVključen), 
            ...this.poljeJeNapadenoPoRavniČrtiSStraniNapadalca(x, y, igralec, kraljJeVključen), 
            ...this.poljeJeNapadenoPoKonjeSStraniNapadalca(x, y, igralec), 
            ...this.poljeJeNapadenoOzVidenoPrekoKmetaSStraniNapadalca(x, y, igralec)
        ];
        return unija.length != 0;
    }

    this.aliJeŠahMat = function() {
        this.šahiraniIgralci = [];  // izpraznimo seznam igralcev v šahu

        zankaČezVseIgralce:
        for (var k = 0; k < this.vrstniRedIgralcev.length; k++) {
            var igralec = this.vrstniRedIgralcev[k];
            for (var i = 0; i < this.plošča.length; i++) {
                for (var j = 0; j < this.plošča[i].length; j++) {
                    if (this.vrniPolje(j, i) == ("K" + igralec)) {  // polepšaj kodo: TODO
                        preprečevanjeŠaha:
                        {  // morda lahko šah preprečimo s tem, da nastavimo kako našo figuro vmes, ali pa nasprotnikovo figuro kar pojemo
                            var koordinateNasprotnikov = this.nasprotnikVidiToPolje(j, i, igralec);
                            if (koordinateNasprotnikov.length == 0) {
                                continue zankaČezVseIgralce;  // pol itak ni šah
                            }
                            console.log("Šah je za igralca " + this.vrstniRedIgralcev[k]);
                            if (koordinateNasprotnikov.length >= 2) {  // če sta napadalca vsaj dva, potem se šaha ne moremo znebiti s tem, da le nastavimo kako od svojih figur. V tem primeru torej ne potrebujemo nobenih simulacij
                                break preprečevanjeŠaha;
                            }
                            var x, y;
                            [x, y] = koordinateNasprotnikov[0];  // koordinate nasprotnika

                            var seznamPoljKamorJeTrebaDatiNašoFiguroDaPreprečimoŠah = [];  // kot pove ime (ni nujno, da za vsako izmed teh polj obstaja kaka naša figura, ki jo lahk postavimo tja. Če za vsako polje v tem seznamu velja, da ne obstaja ustrezna naša figura, potem bo šahmat, razen če se lahko kralj kam premakne)
                            
                            // seznamPoljKamorJeTrebaDatiNašoFiguroDaPreprečimoŠah.push([x, y]);  // če nasprotnika pojemo, to prepreči šahmat

                            // če nasprotnika pojemo, to prepreči šahmat:
                            if (this.vsajEnaIzmedNašihFigurVidiPolje([x, y], igralec, true)) {  // kralj ne more blokirati, lahko pa vseeno poje napadalca
                                continue zankaČezVseIgralce;
                            }

                            var nasprotnikovaFigura = this.vrniPolje(x, y)[0];
                            if (["V", "P"].includes(nasprotnikovaFigura)) {  // če nas napada konj oz. kmet
                                // potem nič ne moremo postaviti med konja/kmeta in našega kralja, lahk ga sam pojemo
                            } else if (nasprotnikovaFigura == "L") {
                                // if (!(Math.abs(x - j) == Math.abs(y - i) && this.poltrakJeProstInVeljaven(j, i, x, y))) throw "To se ne bi smelo zgoditi: tekač v tem primeru sploh ne more napadati našega kralja!";
                                if (!this.tekačSeLahkoPremakne(j, i, x, y)) throw "To se ne bi smelo zgoditi: tekač v tem primeru sploh ne more napadati našega kralja!";

                                for (var l = 1; l < Math.abs(x - j); l++) {
                                    seznamPoljKamorJeTrebaDatiNašoFiguroDaPreprečimoŠah.push([j + l * Math.sign(x - j), i + l * Math.sign(y - i)]);
                                }
                            } else if (nasprotnikovaFigura == "R") {
                                // if (!((j == x || i == y) && this.poltrakJeProstInVeljaven(j, i, x, y))) throw "Trdnjava nas sploh ne napada! To se ne bi smelo zgoditi.";
                                if (!this.trdnjavaSeLahkoPremakne(j, i, x, y)) throw "Trdnjava nas sploh ne napada! To se ne bi smelo zgoditi.";

                                for (var l = 1; l < Math.max(Math.abs(x - j), Math.abs(y - i)); l++) {
                                    seznamPoljKamorJeTrebaDatiNašoFiguroDaPreprečimoŠah.push([j + l * Math.sign(x - j), i + l * Math.sign(y - i)]);
                                }
                            } else if (nasprotnikovaFigura == "Q") {
                                // if (!this.poltrakJeProstInVeljaven(j, i, x, y)) throw "To se ne bi smelo zgoditi, saj kraljica sploh ne more v tem primeru napadati našega kralja.";
                                if (!this.kraljicaSeLahkoPremakne(j, i, x, y)) throw "To se ne bi smelo zgoditi, saj kraljica sploh ne more v tem primeru napadati našega kralja.";
                                
                                for (var l = 1; l < Math.max(Math.abs(x - j), Math.abs(y - i)); l++) {
                                    seznamPoljKamorJeTrebaDatiNašoFiguroDaPreprečimoŠah.push([j + l * Math.sign(x - j), i + l * Math.sign(y - i)]);
                                }
                            } else if (nasprotnikovaFigura == "A") {
                                // if (!((j != x && i != y && Math.abs(j - x) + Math.abs(i - y) == 3) || this.poltrakJeProstInVeljaven(j, i, x, y))) throw "Konjica sploh ni v pravem položaju za napadanje! Nekaj je šlo narobe ...";
                                if (!this.konjicaSeLahkoPremakne(j, i, x, y)) throw "Konjica sploh ni v pravem položaju za napadanje! Nekaj je šlo narobe ...";
                                
                                // if (j != x && i != y && Math.abs(j - x) + Math.abs(i - y) == 3) {  // konjica našega kralja napada iz konjske pozicije
                                if (this.konjSeLahkoPremakne(j, i, x, y)) {  // konjica našega kralja napada iz konjske pozicije
                                    // nič ne moremo narediti, ker potem med konjico in kraljem ne moremo ničesar postaviti, da bi odpravili šah
                                } else {  // zdaj pa postopamo isto kot pri kraljici
                                    for (var l = 1; l < Math.max(Math.abs(x - j), Math.abs(y - i)); l++) {
                                        seznamPoljKamorJeTrebaDatiNašoFiguroDaPreprečimoŠah.push([j + l * Math.sign(x - j), i + l * Math.sign(y - i)]);
                                    }
                                }
                            } else {
                                throw "Ta figura sploh ne more napadati kraljev! Figura: " + nasprotnikovaFigura;
                            }

                            // zdaj pa loopamo po seznamu in pogledamo, ali katera od naših figur vidi ta polja
                            for (var m = 0; m < seznamPoljKamorJeTrebaDatiNašoFiguroDaPreprečimoŠah.length; m++) {
                                if (this.vsajEnaIzmedNašihFigurVidiPolje(seznamPoljKamorJeTrebaDatiNašoFiguroDaPreprečimoŠah[m], igralec)) {  // tukaj ne upoštevamo kralja, saj kralj ne more blokirati šaha
                                    // v primeru, da smo za kralja našli le enega napadalca, kjer bi jih lahko bilo tudi več, je treba tukaj še simulirati to potezo in pogledati, ali ta poteza res reši kralja pred šahom
                                    // bolj elegantno pa je, če kar najdemo vse napadalce: če sta napadalca vsaj dva, potem se šaha ne moremo znebiti s tem, da le nastavimo kako od svojih figur. V tem primeru torej ne potrebujemo nobenih simulacij
                                    continue zankaČezVseIgralce;  // to figuro lahko torej tja premaknemo
                                }
                            }

                        }
                        // na tem mestu je edina morebitna rešitev pred šahmatom to, da kralja umaknemo nekam
                        if (!this.šahiraniIgralci.includes(this.vrstniRedIgralcev[k])) {  // da ne dobimo dvojnih vrednosti
                            this.šahiraniIgralci.push(this.vrstniRedIgralcev[k]);
                        }

                        /*
                        if (this.premikJeMožen(j, i, j + 1, i + 1, igralec, [j, i])) {
                            continue zankaČezVseIgralce;
                        }
                        if (this.premikJeMožen(j, i, j + 1, i, igralec, [j, i])) {
                            continue zankaČezVseIgralce;
                        }
                        if (this.premikJeMožen(j, i, j + 1, i - 1, igralec, [j, i])) {
                            continue zankaČezVseIgralce;
                        }
                        if (this.premikJeMožen(j, i, j, i - 1, igralec, [j, i])) {
                            continue zankaČezVseIgralce;
                        }
                        if (this.premikJeMožen(j, i, j - 1, i - 1, igralec, [j, i])) {
                            continue zankaČezVseIgralce;
                        }
                        if (this.premikJeMožen(j, i, j - 1, i, igralec, [j, i])) {
                            continue zankaČezVseIgralce;
                        }
                        if (this.premikJeMožen(j, i, j - 1, i + 1, igralec, [j, i])) {
                            continue zankaČezVseIgralce;
                        }
                        if (this.premikJeMožen(j, i, j, i + 1, igralec, [j, i])) {
                            continue zankaČezVseIgralce;
                        }
                        */

                        
                        for (var k = -1; k <= 1; k++) {
                            for (var l = -1; l <= 1; l++) {
                                if (k != 0 || l != 0) {
                                    if (this.premikJeMožen(j, i, j + k, i + l, igralec, [j, i])) {
                                        continue zankaČezVseIgralce;
                                    }
                                }
                            }
                        }
                        
                    }
                }
            }
            this.prviPoraženec = this.vrstniRedIgralcev[k];
            console.log("Igralec " + this.prviPoraženec + " je prvi izgubil!.");
            return;
        }
    }

    /*
    this.shrani = function() {
        window.sessionStorage.setItem("plošča", this.plošča);
    }

    this.preberi = function() {
        return window.sessionStorage.getItem("plošča");
    }
    */
}
// če bo kdaj treba kaj uvažat: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import