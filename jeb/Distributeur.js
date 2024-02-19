/******************************************************************************
 * MACHINE [Distributeur]
 * Generated at 2023/05/25 10:55:50
 * JeB translator version 0.6.5
 ******************************************************************************/

/* Variables */
$var.Status = new jeb.lang.Variable( '$var.Status' );

/* Invariants */
$inv.i1 = new jeb.lang.Invariant( '$inv.i1', 'statusType' );
$inv.i1.predicate = function() {
    return $B.belong($var.Status.value, $cst.STATUS);
};

/* Event [INITIALISATION] */
$evt.init = new jeb.lang.Event( '$evt.init', 'INITIALISATION' );

$evt.init.action.a1 = new jeb.lang.Action( '$evt.init.action.a1', 'off', $evt.init );
$evt.init.action.a1.assignment = function( $arg ) {
    $B.becomesEqualTo([$var.Status], [$cst.off]);
};


/* Event [SwitchOff] */
$evt.e1 = new jeb.lang.Event( '$evt.e1', 'SwitchOff' );

$evt.e1.guard.g1 = new jeb.lang.Guard( '$evt.e1.guard.g1', 'marche', $evt.e1, 0 );
$evt.e1.guard.g1.predicate = function( $arg ) {
    return $B.equal($var.Status.value, $cst.on);
};

$evt.e1.action.a1 = new jeb.lang.Action( '$evt.e1.action.a1', 'switchOff', $evt.e1 );
$evt.e1.action.a1.assignment = function( $arg ) {
    $B.becomesEqualTo([$var.Status], [$cst.off]);
};


/* Event [Erreur] */
$evt.e2 = new jeb.lang.Event( '$evt.e2', 'Erreur' );

$evt.e2.guard.g1 = new jeb.lang.Guard( '$evt.e2.guard.g1', 'marche', $evt.e2, 0 );
$evt.e2.guard.g1.predicate = function( $arg ) {
    return $B.equal($var.Status.value, $cst.on);
};

$evt.e2.action.a1 = new jeb.lang.Action( '$evt.e2.action.a1', 'oups', $evt.e2 );
$evt.e2.action.a1.assignment = function( $arg ) {
    $B.becomesEqualTo([$var.Status], [$cst.error]);
};


/* Event [SwitchOn] */
$evt.e3 = new jeb.lang.Event( '$evt.e3', 'SwitchOn' );

$evt.e3.guard.g1 = new jeb.lang.Guard( '$evt.e3.guard.g1', 'off', $evt.e3, 0 );
$evt.e3.guard.g1.predicate = function( $arg ) {
    return $B.equal($var.Status.value, $cst.off);
};

$evt.e3.action.a1 = new jeb.lang.Action( '$evt.e3.action.a1', 'on', $evt.e3 );
$evt.e3.action.a1.assignment = function( $arg ) {
    $B.becomesEqualTo([$var.Status], [$cst.on]);
};


/* Event [CashMoney] */
$evt.e4 = new jeb.lang.Event( '$evt.e4', 'CashMoney' );

$evt.e4.parameter.s = new jeb.lang.Parameter( '$evt.e4.parameter.s', $evt.e4, 0 );
$evt.e4.bindArguments = function( $arg ) {
    $arg.s.value = jeb.ui.parseArgument($arg.s.domNodeInput.value);
};

$evt.e4.guard.g1 = new jeb.lang.Guard( '$evt.e4.guard.g1', 'on', $evt.e4, 0 );
$evt.e4.guard.g1.predicate = function( $arg ) {
    return $B.equal($var.Status.value, $cst.on);
};

$evt.e4.guard.g2 = new jeb.lang.Guard( '$evt.e4.guard.g2', 'positif', $evt.e4, 1 );
$evt.e4.guard.g2.predicate = function( $arg ) {
    return $B.greaterThan($arg.s.value, $B('0'));
};

$evt.e4.guard.g3 = new jeb.lang.Guard( '$evt.e4.guard.g3', 'money', $evt.e4, 1 );
$evt.e4.guard.g3.predicate = function( $arg ) {
    return $B.exists(function(n){return $B.and($B.belong(n, $B.UpTo($B('1'), $B('10'))), $B.equal($arg.s.value, $B.multiply(n, $cst.CoffeePrice)));}, [$B.UpTo($B('1'), $B('10'))]);
};


/* Event [PourCoffee] */
$evt.e5 = new jeb.lang.Event( '$evt.e5', 'PourCoffee' );

$evt.e5.guard.g1 = new jeb.lang.Guard( '$evt.e5.guard.g1', 'on', $evt.e5, 0 );
$evt.e5.guard.g1.predicate = function( $arg ) {
    return $B.equal($var.Status.value, $cst.on);
};


