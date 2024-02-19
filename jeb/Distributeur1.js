/******************************************************************************
 * MACHINE [Distributeur1]
 * Generated at 2023/05/25 10:55:50
 * JeB translator version 0.6.5
 ******************************************************************************/

/* Variables */
$var.Status = new jeb.lang.Variable( '$var.Status' );
$var.Pot = new jeb.lang.Variable( '$var.Pot' );
$var.CofLeft = new jeb.lang.Variable( '$var.CofLeft' );
$var.MoneyBack = new jeb.lang.Variable( '$var.MoneyBack' );

/* Invariants */
$inv.i1 = new jeb.lang.Invariant( '$inv.i1', 'statusType' );
$inv.i1.predicate = function() {
    return $B.belong($var.Status.value, $cst.STATUS);
};

$inv.i2 = new jeb.lang.Invariant( '$inv.i2', 'Pottype' );
$inv.i2.predicate = function() {
    return $B.belong($var.Pot.value, $B.UpTo($B('0'), $cst.MAX_POT));
};

$inv.i3 = new jeb.lang.Invariant( '$inv.i3', 'CofLeftType' );
$inv.i3.predicate = function() {
    return $B.belong($var.CofLeft.value, $B.UpTo($B('0'), $cst.MAX_COF));
};

$inv.i4 = new jeb.lang.Invariant( '$inv.i4', 'MoneyBackType' );
$inv.i4.predicate = function() {
    return $B.belong($var.MoneyBack.value, $B.NATURAL);
};

/* Event [INITIALISATION] */
$evt.init = new jeb.lang.Event( '$evt.init', 'INITIALISATION' );

$evt.init.action.a1 = new jeb.lang.Action( '$evt.init.action.a1', 'off', $evt.init );
$evt.init.action.a1.assignment = function( $arg ) {
    $B.becomesEqualTo([$var.Status], [$cst.off]);
};

$evt.init.action.a2 = new jeb.lang.Action( '$evt.init.action.a2', 'pot', $evt.init );
$evt.init.action.a2.assignment = function( $arg ) {
    $B.becomesEqualTo([$var.Pot], [$cst.CoffeePrice]);
};

$evt.init.action.a3 = new jeb.lang.Action( '$evt.init.action.a3', 'MoneyBack', $evt.init );
$evt.init.action.a3.assignment = function( $arg ) {
    $B.becomesEqualTo([$var.MoneyBack], [$B('0')]);
};

$evt.init.action.a4 = new jeb.lang.Action( '$evt.init.action.a4', 'Cleft', $evt.init );
$evt.init.action.a4.assignment = function( $arg ) {
    $B.becomesEqualTo([$var.CofLeft], [$B('0')]);
};


/* Event [SwitchOffAuto] */
$evt.e1 = new jeb.lang.Event( '$evt.e1', 'SwitchOffAuto' );

$evt.e1.guard.g1 = new jeb.lang.Guard( '$evt.e1.guard.g1', 'marche', $evt.e1, 0 );
$evt.e1.guard.g1.predicate = function( $arg ) {
    return $B.equal($var.Status.value, $cst.on);
};

$evt.e1.guard.g2 = new jeb.lang.Guard( '$evt.e1.guard.g2', 'NoMoreCoffeePotFull', $evt.e1, 0 );
$evt.e1.guard.g2.predicate = function( $arg ) {
    return $B.or($B.equal($var.Pot.value, $cst.MAX_POT), $B.equal($var.CofLeft.value, $B('0')));
};

$evt.e1.action.a1 = new jeb.lang.Action( '$evt.e1.action.a1', 'switchOff', $evt.e1 );
$evt.e1.action.a1.assignment = function( $arg ) {
    $B.becomesEqualTo([$var.Status], [$cst.off]);
};


/* Event [SwitchOffForced] */
$evt.e2 = new jeb.lang.Event( '$evt.e2', 'SwitchOffForced' );

$evt.e2.guard.g1 = new jeb.lang.Guard( '$evt.e2.guard.g1', 'marche', $evt.e2, 0 );
$evt.e2.guard.g1.predicate = function( $arg ) {
    return $B.equal($var.Status.value, $cst.on);
};

$evt.e2.action.a1 = new jeb.lang.Action( '$evt.e2.action.a1', 'switchOff', $evt.e2 );
$evt.e2.action.a1.assignment = function( $arg ) {
    $B.becomesEqualTo([$var.Status], [$cst.off]);
};


/* Event [Erreur] */
$evt.e3 = new jeb.lang.Event( '$evt.e3', 'Erreur' );

$evt.e3.guard.g1 = new jeb.lang.Guard( '$evt.e3.guard.g1', 'marche', $evt.e3, 0 );
$evt.e3.guard.g1.predicate = function( $arg ) {
    return $B.equal($var.Status.value, $cst.on);
};

$evt.e3.action.a1 = new jeb.lang.Action( '$evt.e3.action.a1', 'oups', $evt.e3 );
$evt.e3.action.a1.assignment = function( $arg ) {
    $B.becomesEqualTo([$var.Status], [$cst.error]);
};


/* Event [SwitchOn] */
$evt.e4 = new jeb.lang.Event( '$evt.e4', 'SwitchOn' );

$evt.e4.guard.g1 = new jeb.lang.Guard( '$evt.e4.guard.g1', 'off', $evt.e4, 0 );
$evt.e4.guard.g1.predicate = function( $arg ) {
    return $B.equal($var.Status.value, $cst.off);
};

$evt.e4.guard.g2 = new jeb.lang.Guard( '$evt.e4.guard.g2', 'CoffeeAvailable', $evt.e4, 0 );
$evt.e4.guard.g2.predicate = function( $arg ) {
    return $B.notEqual($var.CofLeft.value, $B('0'));
};

$evt.e4.action.a1 = new jeb.lang.Action( '$evt.e4.action.a1', 'on', $evt.e4 );
$evt.e4.action.a1.assignment = function( $arg ) {
    $B.becomesEqualTo([$var.Status], [$cst.on]);
};


/* Event [CashMoney] */
$evt.e5 = new jeb.lang.Event( '$evt.e5', 'CashMoney' );

$evt.e5.parameter.s = new jeb.lang.Parameter( '$evt.e5.parameter.s', $evt.e5, 0 );
$evt.e5.bindArguments = function( $arg ) {
    $arg.s.value = jeb.ui.parseArgument($arg.s.domNodeInput.value);
};

$evt.e5.guard.g1 = new jeb.lang.Guard( '$evt.e5.guard.g1', 'on', $evt.e5, 0 );
$evt.e5.guard.g1.predicate = function( $arg ) {
    return $B.equal($var.Status.value, $cst.on);
};

$evt.e5.guard.g2 = new jeb.lang.Guard( '$evt.e5.guard.g2', 'positif', $evt.e5, 1 );
$evt.e5.guard.g2.predicate = function( $arg ) {
    return $B.greaterThan($arg.s.value, $B('0'));
};

$evt.e5.guard.g3 = new jeb.lang.Guard( '$evt.e5.guard.g3', 'money', $evt.e5, 1 );
$evt.e5.guard.g3.predicate = function( $arg ) {
    return $B.exists(function(n){return $B.and($B.belong(n, $B.UpTo($B('1'), $B('10'))), $B.equal($arg.s.value, $B.multiply(n, $cst.CoffeePrice)));}, [$B.UpTo($B('1'), $B('10'))]);
};

$evt.e5.guard.g4 = new jeb.lang.Guard( '$evt.e5.guard.g4', 'MoneyAcceptable', $evt.e5, 1 );
$evt.e5.guard.g4.predicate = function( $arg ) {
    return $B.lessEqual($arg.s.value, $B.minus($cst.MAX_POT ,$var.Pot.value));
};

$evt.e5.guard.g5 = new jeb.lang.Guard( '$evt.e5.guard.g5', 'CaffeeAvailable', $evt.e5, 0 );
$evt.e5.guard.g5.predicate = function( $arg ) {
    return $B.notEqual($var.CofLeft.value, $B('0'));
};

$evt.e5.action.a1 = new jeb.lang.Action( '$evt.e5.action.a1', 'adPot', $evt.e5 );
$evt.e5.action.a1.assignment = function( $arg ) {
    $B.becomesEqualTo([$var.Pot], [$B.plus($var.Pot.value, $arg.s.value)]);
};

$evt.e5.action.a2 = new jeb.lang.Action( '$evt.e5.action.a2', 'moneyBack', $evt.e5 );
$evt.e5.action.a2.assignment = function( $arg ) {
    $B.becomesEqualTo([$var.MoneyBack], [$B.minus($arg.s.value ,$cst.CoffeePrice)]);
};


/* Event [PourCoffee] */
$evt.e6 = new jeb.lang.Event( '$evt.e6', 'PourCoffee' );

$evt.e6.guard.g1 = new jeb.lang.Guard( '$evt.e6.guard.g1', 'on', $evt.e6, 0 );
$evt.e6.guard.g1.predicate = function( $arg ) {
    return $B.equal($var.Status.value, $cst.on);
};

$evt.e6.guard.g2 = new jeb.lang.Guard( '$evt.e6.guard.g2', 'stillCoffee', $evt.e6, 0 );
$evt.e6.guard.g2.predicate = function( $arg ) {
    return $B.notEqual($var.CofLeft.value, $B('0'));
};

$evt.e6.action.a1 = new jeb.lang.Action( '$evt.e6.action.a1', 'CofLeft', $evt.e6 );
$evt.e6.action.a1.assignment = function( $arg ) {
    $B.becomesEqualTo([$var.CofLeft], [$B.minus($var.CofLeft.value ,$B('1'))]);
};


/* Event [AddCof] */
$evt.e7 = new jeb.lang.Event( '$evt.e7', 'AddCof' );

$evt.e7.parameter.c = new jeb.lang.Parameter( '$evt.e7.parameter.c', $evt.e7, 0 );
$evt.e7.bindArguments = function( $arg ) {
    $arg.c.value = jeb.ui.parseArgument($arg.c.domNodeInput.value);
};

$evt.e7.guard.g1 = new jeb.lang.Guard( '$evt.e7.guard.g1', 'off', $evt.e7, 0 );
$evt.e7.guard.g1.predicate = function( $arg ) {
    return $B.equal($var.Status.value, $cst.off);
};

$evt.e7.guard.g2 = new jeb.lang.Guard( '$evt.e7.guard.g2', 'cquantity', $evt.e7, 1 );
$evt.e7.guard.g2.predicate = function( $arg ) {
    return $B.belong($arg.c.value, $B.UpTo($B('1'), $B.minus($cst.MAX_COF ,$var.CofLeft.value)));
};

$evt.e7.action.a1 = new jeb.lang.Action( '$evt.e7.action.a1', 'remplit', $evt.e7 );
$evt.e7.action.a1.assignment = function( $arg ) {
    $B.becomesEqualTo([$var.CofLeft], [$B.plus($var.CofLeft.value, $arg.c.value)]);
};


/* Event [takePot] */
$evt.e8 = new jeb.lang.Event( '$evt.e8', 'takePot' );

$evt.e8.guard.g1 = new jeb.lang.Guard( '$evt.e8.guard.g1', 'off', $evt.e8, 0 );
$evt.e8.guard.g1.predicate = function( $arg ) {
    return $B.equal($var.Status.value, $cst.off);
};

$evt.e8.guard.g2 = new jeb.lang.Guard( '$evt.e8.guard.g2', 'moneyToGet', $evt.e8, 0 );
$evt.e8.guard.g2.predicate = function( $arg ) {
    return $B.greaterEqual($var.Pot.value, $cst.CoffeePrice);
};

$evt.e8.action.a1 = new jeb.lang.Action( '$evt.e8.action.a1', 'getIt', $evt.e8 );
$evt.e8.action.a1.assignment = function( $arg ) {
    $B.becomesEqualTo([$var.Pot], [$cst.CoffeePrice]);
};


