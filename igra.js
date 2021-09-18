var vrniIgralca = function(string) {  // vrne 1, če prvi igralec, oz. 2, če drugi igralec, oz. ..., drugače vrne 0, če prazno polje, če pa skala, pa vrne -1
    if (["1", "2", "3", "4"].includes(string[1])) return parseInt(string[1]);
    if (string[1] === "X") return -1;
    return 0;
}


var potezaKmetaVeljavna = function(xPremik, yPremik, smerniVektor, zbijanje) {  // vrne true, če je veljavna
    // xPremik je vektor x smeri: x2 - x1
    // yPremik je vektor y smeri: y2 - y2
    // smerNeba: N, S, W, ali E
    // zbijanje: bool, ki pove, a kmet zbija
    // zaenkrat ignoriramo premikanje za dva polja in pa en passant
    
    if (!zbijanje) {
        var a, b;
        [a, b] = smerniVektor;
        return a === xPremik && b === yPremik;
        // return [xPremik, yPremik] === smerniVektor;
    } else {
        var seznam = [];
        switch(smerniVektor) {
            case [0, -1]:
                seznam = [[-1, -1], [1, -1]];
                break;
            case [0, 1]:
                seznam = [[-1, 1], [1, 1]];
                break;
            case [-1, 0]:
                seznam = [[-1, -1], [-1, 1]];
                break;
            case [1, 0]:
                seznam = [[1, -1], [1, 1]];
                break;
        }
        // return seznam.includes([xPremik, yPremik]);
        for (var i = 0; i < seznam.length; i++) {
            var a, b;
            [a, b] = seznam[i];
            if (a === xPremik && b === yPremik) {
                return true;
            }
        }
        return false;
    }
}


var Igra = function(plošča) {
    this.šahiraniIgralci = [];  // igralci, trenutno v šahu
    this.prviPoraženec = null;

    this.igralecNaVrsti = 1;  // 1, 2, 3, ali 4

    this.vrstniRedIgralcev = [1, 3, 2, 4];

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
        ["K3", "P3", "EE", "EE", "EE", "EE", "A1", "A2", "EE", "EE", "EE", "EE", "P4", "Q4"],
        ["Q3", "P3", "EE", "EE", "EE", "EE", "A3", "A4", "EE", "EE", "EE", "EE", "P4", "K4"],
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
        if (Math.abs(x1 - x2) !== Math.abs(y1 - y2) && x1 !== x2 && y1 !== y2) return false;  // to sploh ni poltrak
        for (var i = 1; i < Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)); i++) {
            if ("EE" !== this.vrniPolje(x1 + i * Math.sign(x2 - x1), y1 + i * Math.sign(y2 - y1))) {
                return false;
            }
        }
        return true;
    }


    this.nasprotnikVidiToPolje = function(x, y, neNasprotnik=this.igralecNaVrsti) {  // torej, kralja ne moremo tja premakniti
        // vrne par: prvi element je bool (če je true, potem nasprotnik vidi to polje, drugače false), drugi element pa pove koordinate nasprotnikove figure, ki napada to polje
        for (var i = -1; i <= 1; i += 2) {
            for (var j = -1; j <= 1; j += 2) {
                var k = 1;
                while (this.vrniPolje(x + k * i, y + k * j) === "EE") {
                    k += 1;
                }
                var meja = this.vrniPolje(x + k * i, y + k * j);
                if (meja === "XX") {
                    continue;
                }
                if (meja[1] !== String(neNasprotnik) && (["L", "Q", "A"].includes(meja[0]) || (k === 1 && meja[0] === "K"))) {
                    return [true, [x + k * i, y + k * j]];
                }
            }
        }
        for (var i = -1; i <= 1; i += 2) {
            for (var j = -1; j <= 1; j += 2) {
                var k = 1;

                var i_ = (i !== j) * i, j_ = (i === j) * j;
                /*
                (1, -1) -> (1, 0)
                (-1, 1) -> (-1, 0)
                (1, 1) -> (0, 1)
                (-1, -1) -> (0, -1)
                */

                while (this.vrniPolje(x + k * i_, y + k * j_) === "EE") {
                    k += 1;
                }
                var meja = this.vrniPolje(x + k * i_, y + k * j_);
                if (meja === "XX") {
                    continue;
                }
                if (meja[1] !== String(neNasprotnik) && (["R", "Q", "A"].includes(meja[0]) || (k === 1 && meja[0] === "K"))) {
                    return [true, [x + k * i_, y + k * j_]];
                }
            }
        }
        for (var i = -2; i <= 2; i += 4) {
            for (var j = -1; j <= 1; j += 2) {
                for (var k = 0; k <= 1; k++) {
                    var meja = [this.vrniPolje(x + i, y + j), this.vrniPolje(x + j, y + i)][k];
                    var koordMeje = [[x + i, y + j], [x + j, y + i]][k];
                    if (["EE", "XX"].includes(meja)) {
                        continue;
                    }
                    if (meja[1] !== String(neNasprotnik) && ["V", "A"].includes(meja[0])) {
                        return [true, koordMeje];
                    }
                }
            }
        }
        for (var i = -1; i <= 1; i += 2) {
            for (var j = -1; j <= 1; j += 2) {
                var meja = this.vrniPolje(x + i, y + j);
                if (["EE", "XX"].includes(meja)) {
                    continue;
                }
                if (meja[1] === String(neNasprotnik)) {  // svojih kmetov ne upoštevamo
                    continue;
                }
                var smer = this.smeri[parseInt(meja[1])];
                if (meja[0] === "P" && [[-i, 0], [0, -j]].includes(this.smerniVektorji[smer])) {  // če (i, j) vektor iz (x, y) do (x + i, y + j), potem sta vektorja (-i, 0) in (0, -j) ravno ta vektorja, da te kmet s to smerjo premikanja lahko zbije
                    return [true, [x + i, y + j]];
                }
            }
        }
        return [false, null];
    }

    this.šahJe = function(neNasprotnik, poljeKraljaOdNeNasprotnika=null) {  // vrne true, če je šah za neNasprotnika
        if (poljeKraljaOdNeNasprotnika === null) {  // če to ni null, potem prihranimo veliko časa za iskanje polje kralja
            for (var i = 0; i < this.plošča.length; i++) {
                for (var j = 0; j < this.plošča[i].length; j++) {
                    if (this.vrniPolje(j, i) === ("K" + neNasprotnik)) {
                        poljeKraljaOdNeNasprotnika = [j, i];
                    }
                }
            }
        }

        return this.nasprotnikVidiToPolje(poljeKraljaOdNeNasprotnika[0], poljeKraljaOdNeNasprotnika[1], neNasprotnik)[0];
    }


    this.premikJeMožen = function(x1, y1, x2, y2, neNasprotnik=this.igralecNaVrsti, poljeKraljaOdNeNasprotnika=null) {  // x gre od 0 do 7, prav tako y
        izhodišče = this.vrniPolje(x1, y1);
        cilj = this.vrniPolje(x2, y2);

        if (vrniIgralca(izhodišče) !== neNasprotnik) return false;  // false, saj ne premikamo svoje figure, ampak figuro nekoga drugega
        if ([-1, neNasprotnik].includes(vrniIgralca(cilj))) return false;  // false, saj premikamo v skalo ali pa v svoje figure

        if (x1 === x2 && y1 === y2) return false;  // cilj ne sme biti enak izhodišču

        if (izhodišče[0] !== "K") {  // če ni kralj, kr drugač se polje kralja spremeni. Za kralja je pa itak že spodaj poskrbljeno
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
                return (x1 === x2 || y1 === y2) && this.poltrakJeProstInVeljaven(x1, y1, x2, y2);
                break;
            case "V":
                return x1 !== x2 && y1 !== y2 && Math.abs(x1 - x2) + Math.abs(y1 - y2) === 3;
                break;
            case "L":
                return Math.abs(x2 - x1) === Math.abs(y2 - y1) && this.poltrakJeProstInVeljaven(x1, y1, x2, y2);
                break;
            case "Q":
                return this.poltrakJeProstInVeljaven(x1, y1, x2, y2);
                break;
            case "K":
                var igra3 = new Igra();
                // igra3.plošča = this.plošča.slice();  // plitka kopija
                igra3.plošča = JSON.parse(JSON.stringify(this.plošča));  // globoka kopija
                igra3.plošča[y1][x1] = "EE";  // kraljevo polje zamenjamo s praznim, zato da bo metoda "nasprotnikVidiToPolje" pravilno delovala (drugače bi lahko kralj zastiral pogled nasprotnikovih figur)
                return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2)) === 1 && !igra3.nasprotnikVidiToPolje(x2, y2, neNasprotnik)[0];
                break;
            case "P":
                return potezaKmetaVeljavna(x2 - x1, y2 - y1, this.smerniVektorji[this.smeri[neNasprotnik]], cilj !== "EE");  // tuki dejansko ne rabimo zamenjat this.igralecNaVrsti z neNasprotnik, ampak ni važno
                break;
            case "A":
                return (x1 !== x2 && y1 !== y2 && Math.abs(x1 - x2) + Math.abs(y1 - y2) === 3) || this.poltrakJeProstInVeljaven(x1, y1, x2, y2);
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

        this.aliJeŠahMat();

        this.igralecNaVrsti = this.pridobiNaslednjegaIgralca();
    }


    this.aliJeŠahMat = function() {
        this.šahiraniIgralci = [];  // izpraznimo seznam igralcev v šahu

        zankaČezVseIgralce:
        for (var k = 0; k < this.vrstniRedIgralcev.length; k++) {
            var igralec = this.vrstniRedIgralcev[k];
            for (var i = 0; i < this.plošča.length; i++) {
                for (var j = 0; j < this.plošča[i].length; j++) {
                    if (this.vrniPolje(j, i) === ("K" + igralec)) {  // polepšaj kodo: TODO
                        {  // morda lahko šah preprečimo s tem, da nastavimo kako našo figuro vmes, ali pa nasprotnikovo figuro kar pojemo
                            
                            var nasprotnikVidiPolje, koordinateNasprotnika;
                            [nasprotnikVidiPolje, koordinateNasprotnika] = this.nasprotnikVidiToPolje(j, i, igralec);
                            if (!nasprotnikVidiPolje) {
                                continue zankaČezVseIgralce;  // pol itak ni šah
                            }
                            /*
                            var x, y;
                            [x, y] = koordinateNasprotnika;

                            var seznamPoljKamorJeTrebaDatiNašoFiguroDaPreprečimoŠah = [];  // kot pove ime (ni nujno, da za vsako izmed teh polj obstaja kaka naša figura, ki jo lahk postavimo tja. Če za vsako polje v tem seznamu velja, da ne obstaja ustrezna naša figura, potem bo šahmat, razen če se lahko kralj kam premakne)
                            
                            seznamPoljKamorJeTrebaDatiNašoFiguroDaPreprečimoŠah.push(koordinateNasprotnika);  // če nasprotnika pojemo, to prepreči šahmat

                            var nasprotnikovaFigura = this.vrniPolje(x, y)[0];
                            if (["V", "P"].includes(nasprotnikovaFigura)) {  // če nas napada konj oz. kmet
                                // potem nič ne moremo postaviti med konja/kmeta in našega kralja, lahk ga sam pojemo
                            } else if (nasprotnikovaFigura === "L") {
                                if (!(Math.abs(x - j) === Math.abs(y - i) && this.poltrakJeProstInVeljaven(j, i, x, y))) throw "To se ne bi smelo zgoditi: tekač v tem primeru sploh ne more napadati našega kralja!;

                                for (var l = 1; l < Math.abs(x - j); l++) {
                                    seznamPoljKamorJeTrebaDatiNašoFiguroDaPreprečimoŠah.push([j + l * Math.sign(x - j), i + l * Math.sign(y - i)]);
                                }
                            } else if (nasprotnikovaFigura === "R") {
                                if (!((j === x || i === y) && this.poltrakJeProstInVeljaven(j, i, x, y))) throw "Trdnjava nas sploh ne napada! To se ne bi smelo zgoditi.";

                                for (var l = 1; l < Math.max(Math.abs(x - j), Math.abs(y - i)); l++) {
                                    seznamPoljKamorJeTrebaDatiNašoFiguroDaPreprečimoŠah.push([j + l * Math.sign(x - j), i + l * Math.sign(y - i)]);
                                }
                            } else if (nasprotnikovaFigura === "Q") {
                                if (!this.poltrakJeProstInVeljaven(x1, y1, x2, y2)) throw "To se ne bi smelo zgoditi, saj kraljica sploh ne more v tem primeru napadati našega kralja.";

                                for (var l = 1; l < Math.max(Math.abs(x - j), Math.abs(y - i)); l++) {
                                    seznamPoljKamorJeTrebaDatiNašoFiguroDaPreprečimoŠah.push([j + l * Math.sign(x - j), i + l * Math.sign(y - i)]);
                                }
                            } else if (nasprotnikovaFigura === "A") {
                                if (!((x1 !== x2 && y1 !== y2 && Math.abs(x1 - x2) + Math.abs(y1 - y2) === 3) || this.poltrakJeProstInVeljaven(x1, y1, x2, y2))) throw "Konjica sploh ni v pravem položaju za napadanje! Nekaj je šlo narobe ...";

                                if (x1 !== x2 && y1 !== y2 && Math.abs(x1 - x2) + Math.abs(y1 - y2) === 3) {  // konjica našega kralja napada iz konjske pozicije
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
                                if (vsaj ena izmed naših figur vidi polje seznamPoljKamorJeTrebaDatiNašoFiguroDaPreprečimoŠah[m]) {  // TODO
                                    continue zankaČezVseIgralce;  // to figuro lahko torej tja premaknemo
                                }
                            }
                            */
                        }
                        console.log("Šah je za igralca " + this.vrstniRedIgralcev[k]);
                        if (!this.šahiraniIgralci.includes(this.vrstniRedIgralcev[k])) {  // da ne dobimo dvojnih vrednosti
                            this.šahiraniIgralci.push(this.vrstniRedIgralcev[k]);
                        }

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