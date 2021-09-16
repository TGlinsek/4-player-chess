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
        if (Math.abs(x1 - x2) !== Math.abs(y1 - y2) && x1 !== x2 && y1 !== y2) return false;  // to sploh ni poltrak
        for (var i = 1; i < Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)); i++) {
            if ("EE" !== this.vrniPolje(x1 + i * Math.sign(x2 - x1), y1 + i * Math.sign(y2 - y1))) {
                return false;
            }
        }
        return true;
    }


    this.nasprotnikVidiToPolje = function(x, y) {  // torej, kralja ne moremo tja premakniti
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
                if (meja[1] !== String(this.igralecNaVrsti) && (["L", "Q", "A"].includes(meja[0]) || (k == 1 && meja[0] === "K"))) {
                    return true;
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
                if (meja[1] !== String(this.igralecNaVrsti) && (["R", "Q", "A"].includes(meja[0]) || (k === 1 && meja[0] === "K"))) {
                    return true;
                }
            }
        }
        for (var i = -2; i <= 2; i += 4) {
            for (var j = -1; j <= 1; j += 2) {
                for (var k = 0; k <= 1; k++) {
                    var meja = [this.vrniPolje(x + i, y + j), this.vrniPolje(x + j, y + i)][k];
                    if (["EE", "XX"].includes(meja)) {
                        continue;
                    }
                    if (meja[1] !== String(this.igralecNaVrsti) && ["V", "A"].includes(meja[0])) {
                        return true;
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
                if (meja[1] === String(this.igralecNaVrsti)) {  // svojih kmetov ne upoštevamo
                    continue;
                }
                var smer = this.smeri[parseInt(meja[1])];
                if (meja[0] === "P" && [[-i, 0], [0, -j]].includes(this.smerniVektorji[smer])) {  // če (i, j) vektor iz (x, y) do (x + i, y + j), potem sta vektorja (-i, 0) in (0, -j) ravno ta vektorja, da te kmet s to smerjo premikanja lahko zbije
                    return true;
                }
            }
        }
        return false;
    }


    this.premikJeMožen = function(x1, y1, x2, y2) {  // x gre od 0 do 7, prav tako y
        console.log(this.igralecNaVrsti);

        izhodišče = this.vrniPolje(x1, y1);
        cilj = this.vrniPolje(x2, y2);
        if (vrniIgralca(izhodišče) !== this.igralecNaVrsti) return false;  // false, saj ne premikamo svoje figure, ampak figuro nekoga drugega
        if ([-1, this.igralecNaVrsti].includes(vrniIgralca(cilj))) return false;  // false, saj premikamo v skalo ali pa v svoje figure

        if (x1 === x2 && y1 === y2) return false;  // cilj ne sme biti enak izhodišču

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
                return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2)) === 1 && !this.nasprotnikVidiToPolje(x2, y2);
                break;
            case "P":
                return potezaKmetaVeljavna(x2 - x1, y2 - y1, this.smerniVektorji[this.smeri[this.igralecNaVrsti]], cilj !== "EE");
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

        this.igralecNaVrsti = this.pridobiNaslednjegaIgralca();
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