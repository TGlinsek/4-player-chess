var Igra = function(plošča) {
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

    this.premikJeMožen = function(x1, y1, x2, y2) {  // x gre od 0 do 7, prav tako y
        izhodišče = this.plošča[y1][x1];
        cilj = this.plošča[y2][x2];

        return true;  // TODO
    }

    this.premakni = function(x1, y1, x2, y2) {
        if (!this.premikJeMožen(x1, y1, x2, y2)) {
            throw "Ta premik ni možen";
        }
        this.plošča[y2][x2] = this.plošča[y1][x1];
        this.plošča[y1][x1] = "EE";
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