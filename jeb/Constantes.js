/******************************************************************************
 * CONTEXT [Constantes]
 * Generated at 2023/05/25 10:55:50
 * JeB translator version 0.6.5
 ******************************************************************************/

/* Sets */
$cst.STATUS;


/* Constants */
$cst.MAX_BAL;

$cst.MAX_POT;

$cst.MAX_COF;

$cst.on;

$cst.off;

$cst.error;

$cst.CoffeePrice;


/* Axioms */
$axm.a1 = new jeb.lang.Axiom( '$axm.a1', 'COF_type' );
$axm.a1.predicate = function() {
    return $B.belong($cst.MAX_COF, $B.NATURAL1);
};

$axm.a2 = new jeb.lang.Axiom( '$axm.a2', 'BAL_type' );
$axm.a2.predicate = function() {
    return $B.belong($cst.MAX_BAL, $B.NATURAL1);
};

$axm.a3 = new jeb.lang.Axiom( '$axm.a3', 'POT_type' );
$axm.a3.predicate = function() {
    return $B.belong($cst.MAX_POT, $B.NATURAL1);
};

$axm.a4 = new jeb.lang.Axiom( '$axm.a4', 'STATUS_def' );
$axm.a4.predicate = function() {
    return $B.partition($cst.STATUS, $B.SetExtension($cst.on), $B.SetExtension($cst.off), $B.SetExtension($cst.error));
};

$axm.a5 = new jeb.lang.Axiom( '$axm.a5', 'CoffeePrice' );
$axm.a5.predicate = function() {
    return $B.belong($cst.CoffeePrice, $B.NATURAL1);
};

$axm.a6 = new jeb.lang.Axiom( '$axm.a6', 'CoffeePrice50' );
$axm.a6.predicate = function() {
    return $B.exists(function(n){return $B.implication($B.belong(n, $B.UpTo($B('1'), $B('10'))), $B.equal($cst.CoffeePrice, $B.multiply(n, $B('50'))));}, [$B.UpTo($B('1'), $B('10'))]);
};

$axm.a7 = new jeb.lang.Axiom( '$axm.a7', 'CoffeePriceValue' );
$axm.a7.predicate = function() {
    return $B.equal($cst.CoffeePrice, $B('50'));
};

$axm.a8 = new jeb.lang.Axiom( '$axm.a8', 'PotMax' );
$axm.a8.predicate = function() {
    return $B.greaterEqual($cst.MAX_POT, $B.multiply($cst.CoffeePrice, $cst.MAX_COF));
};

$axm.a9 = new jeb.lang.Axiom( '$axm.a9', 'MaxBal' );
$axm.a9.predicate = function() {
    return $B.equal($cst.MAX_BAL, $B.multiply($B('5'), $cst.CoffeePrice));
};


/* Cache constants */
jeb.__constants.push( '$cst.STATUS' );
jeb.__constants.push( '$cst.MAX_BAL' );
jeb.__constants.push( '$cst.MAX_POT' );
jeb.__constants.push( '$cst.MAX_COF' );
jeb.__constants.push( '$cst.on' );
jeb.__constants.push( '$cst.off' );
jeb.__constants.push( '$cst.error' );
jeb.__constants.push( '$cst.CoffeePrice' );
