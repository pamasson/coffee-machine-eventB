/******************************************************************************
 * MACHINE [Distributeur2]
 * Generated at 2023/05/25 10:55:50
 * JeB translator version 0.6.5
 ******************************************************************************/

/* Variables */
$var.Status = new jeb.lang.Variable( '$var.Status' );
$var.Pot = new jeb.lang.Variable( '$var.Pot' );
$var.CofLeft = new jeb.lang.Variable( '$var.CofLeft' );
$var.MoneyBack = new jeb.lang.Variable( '$var.MoneyBack' );
$var.interaction = new jeb.lang.Variable( '$var.interaction' );
$var.Balance = new jeb.lang.Variable( '$var.Balance' );

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

$inv.i5 = new jeb.lang.Invariant( '$inv.i5', 'interactionState' );
$inv.i5.predicate = function() {
    return $B.belong($var.interaction.value, $cst.INTERACTIONS);
};

$inv.i6 = new jeb.lang.Invariant( '$inv.i6', 'moneyEntree' );
$inv.i6.predicate = function() {
    return $B.belong($var.Balance.value, $B.UpTo($B('0'), $cst.MAX_BAL));
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

$evt.init.action.a5 = new jeb.lang.Action( '$evt.init.action.a5', 'interaction', $evt.init );
$evt.init.action.a5.assignment = function( $arg ) {
    $B.becomesEqualTo([$var.interaction], [$cst.inactive]);
};

$evt.init.action.a6 = new jeb.lang.Action( '$evt.init.action.a6', 'Balance', $evt.init );
$evt.init.action.a6.assignment = function( $arg ) {
    $B.becomesEqualTo([$var.Balance], [$B('0')]);
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

$evt.e1.guard.g3 = new jeb.lang.Guard( '$evt.e1.guard.g3', 'interactionChange', $evt.e1, 0 );
$evt.e1.guard.g3.predicate = function( $arg ) {
    return $B.equal($var.interaction.value, $cst.inputCash);
};

$evt.e1.guard.g4 = new jeb.lang.Guard( '$evt.e1.guard.g4', 'BalanceNulle', $evt.e1, 0 );
$evt.e1.guard.g4.predicate = function( $arg ) {
    return $B.equal($var.Balance.value, $B('0'));
};

$evt.e1.action.a1 = new jeb.lang.Action( '$evt.e1.action.a1', 'switchOff', $evt.e1 );
$evt.e1.action.a1.assignment = function( $arg ) {
    $B.becomesEqualTo([$var.Status], [$cst.off]);
};

$evt.e1.action.a2 = new jeb.lang.Action( '$evt.e1.action.a2', 'interaction', $evt.e1 );
$evt.e1.action.a2.assignment = function( $arg ) {
    $B.becomesEqualTo([$var.interaction], [$cst.inactive]);
};


/* Event [SwitchOffForced] */
$evt.e2 = new jeb.lang.Event( '$evt.e2', 'SwitchOffForced' );

$evt.e2.guard.g1 = new jeb.lang.Guard( '$evt.e2.guard.g1', 'marche', $evt.e2, 0 );
$evt.e2.guard.g1.predicate = function( $arg ) {
    return $B.equal($var.Status.value, $cst.on);
};

$evt.e2.guard.g2 = new jeb.lang.Guard( '$evt.e2.guard.g2', 'NoMoreMoney', $evt.e2, 0 );
$evt.e2.guard.g2.predicate = function( $arg ) {
    return $B.equal($var.Balance.value, $B('0'));
};

$evt.e2.action.a1 = new jeb.lang.Action( '$evt.e2.action.a1', 'switchOff', $evt.e2 );
$evt.e2.action.a1.assignment = function( $arg ) {
    $B.becomesEqualTo([$var.Status], [$cst.off]);
};


/* Event [PressSwitchOff] */
$evt.e3 = new jeb.lang.Event( '$evt.e3', 'PressSwitchOff' );

$evt.e3.guard.g1 = new jeb.lang.Guard( '$evt.e3.guard.g1', 'idle', $evt.e3, 0 );
$evt.e3.guard.g1.predicate = function( $arg ) {
    return $B.equal($var.interaction.value, $cst.inputCash);
};

$evt.e3.guard.g2 = new jeb.lang.Guard( '$evt.e3.guard.g2', 'status', $evt.e3, 0 );
$evt.e3.guard.g2.predicate = function( $arg ) {
    return $B.equal($var.Status.value, $cst.on);
};

$evt.e3.action.a1 = new jeb.lang.Action( '$evt.e3.action.a1', 'returnMoney', $evt.e3 );
$evt.e3.action.a1.assignment = function( $arg ) {
    $B.becomesEqualTo([$var.interaction], [$cst.returnCash]);
};


/* Event [Erreur] */
$evt.e4 = new jeb.lang.Event( '$evt.e4', 'Erreur' );

$evt.e4.guard.g1 = new jeb.lang.Guard( '$evt.e4.guard.g1', 'marche', $evt.e4, 0 );
$evt.e4.guard.g1.predicate = function( $arg ) {
    return $B.equal($var.Status.value, $cst.on);
};

$evt.e4.action.a1 = new jeb.lang.Action( '$evt.e4.action.a1', 'oups', $evt.e4 );
$evt.e4.action.a1.assignment = function( $arg ) {
    $B.becomesEqualTo([$var.Status], [$cst.error]);
};


/* Event [SwitchOn] */
$evt.e5 = new jeb.lang.Event( '$evt.e5', 'SwitchOn' );

$evt.e5.guard.g1 = new jeb.lang.Guard( '$evt.e5.guard.g1', 'off', $evt.e5, 0 );
$evt.e5.guard.g1.predicate = function( $arg ) {
    return $B.equal($var.Status.value, $cst.off);
};

$evt.e5.guard.g2 = new jeb.lang.Guard( '$evt.e5.guard.g2', 'CoffeeAvailable', $evt.e5, 0 );
$evt.e5.guard.g2.predicate = function( $arg ) {
    return $B.notEqual($var.CofLeft.value, $B('0'));
};

$evt.e5.action.a1 = new jeb.lang.Action( '$evt.e5.action.a1', 'on', $evt.e5 );
$evt.e5.action.a1.assignment = function( $arg ) {
    $B.becomesEqualTo([$var.Status], [$cst.on]);
};

$evt.e5.action.a2 = new jeb.lang.Action( '$evt.e5.action.a2', 'interaction', $evt.e5 );
$evt.e5.action.a2.assignment = function( $arg ) {
    $B.becomesEqualTo([$var.interaction], [$cst.inputCash]);
};

$evt.e5.action.a3 = new jeb.lang.Action( '$evt.e5.action.a3', 'balance', $evt.e5 );
$evt.e5.action.a3.assignment = function( $arg ) {
    $B.becomesEqualTo([$var.Balance], [$B('0')]);
};


/* Event [PressReturn] */
$evt.e6 = new jeb.lang.Event( '$evt.e6', 'PressReturn' );

$evt.e6.guard.g1 = new jeb.lang.Guard( '$evt.e6.guard.g1', 'interaction', $evt.e6, 0 );
$evt.e6.guard.g1.predicate = function( $arg ) {
    return $B.equal($var.interaction.value, $cst.inputCash);
};

$evt.e6.guard.g2 = new jeb.lang.Guard( '$evt.e6.guard.g2', 'modeOn', $evt.e6, 0 );
$evt.e6.guard.g2.predicate = function( $arg ) {
    return $B.equal($var.Status.value, $cst.on);
};

$evt.e6.action.a1 = new jeb.lang.Action( '$evt.e6.action.a1', 'giveBackMoneyr', $evt.e6 );
$evt.e6.action.a1.assignment = function( $arg ) {
    $B.becomesEqualTo([$var.interaction], [$cst.returnCash]);
};


/* Event [backBalance] */
$evt.e7 = new jeb.lang.Event( '$evt.e7', 'backBalance' );

$evt.e7.guard.g1 = new jeb.lang.Guard( '$evt.e7.guard.g1', 'status', $evt.e7, 0 );
$evt.e7.guard.g1.predicate = function( $arg ) {
    return $B.equal($var.Status.value, $cst.on);
};

$evt.e7.guard.g2 = new jeb.lang.Guard( '$evt.e7.guard.g2', 'giveBack', $evt.e7, 0 );
$evt.e7.guard.g2.predicate = function( $arg ) {
    return $B.equal($var.interaction.value, $cst.returnCash);
};

$evt.e7.action.a1 = new jeb.lang.Action( '$evt.e7.action.a1', 'balanceNulle', $evt.e7 );
$evt.e7.action.a1.assignment = function( $arg ) {
    $B.becomesEqualTo([$var.Balance], [$B('0')]);
};

$evt.e7.action.a2 = new jeb.lang.Action( '$evt.e7.action.a2', 'interaction', $evt.e7 );
$evt.e7.action.a2.assignment = function( $arg ) {
    $B.becomesEqualTo([$var.interaction], [$cst.inputCash]);
};


/* Event [PressCoffee] */
$evt.e8 = new jeb.lang.Event( '$evt.e8', 'PressCoffee' );

$evt.e8.guard.g1 = new jeb.lang.Guard( '$evt.e8.guard.g1', 'moneyIn', $evt.e8, 0 );
$evt.e8.guard.g1.predicate = function( $arg ) {
    return $B.equal($var.interaction.value, $cst.inputCash);
};

$evt.e8.guard.g2 = new jeb.lang.Guard( '$evt.e8.guard.g2', 'enoughMoney', $evt.e8, 0 );
$evt.e8.guard.g2.predicate = function( $arg ) {
    return $B.greaterEqual($var.Balance.value, $cst.CoffeePrice);
};

$evt.e8.guard.g3 = new jeb.lang.Guard( '$evt.e8.guard.g3', 'CoffeeAvailable', $evt.e8, 0 );
$evt.e8.guard.g3.predicate = function( $arg ) {
    return $B.notEqual($var.CofLeft.value, $B('0'));
};

$evt.e8.action.a1 = new jeb.lang.Action( '$evt.e8.action.a1', 'pour', $evt.e8 );
$evt.e8.action.a1.assignment = function( $arg ) {
    $B.becomesEqualTo([$var.interaction], [$cst.askCoffee]);
};


/* Event [insertP1] */
$evt.e9 = new jeb.lang.Event( '$evt.e9', 'insertP1' );

$evt.e9.guard.g1 = new jeb.lang.Guard( '$evt.e9.guard.g1', 'interaction', $evt.e9, 0 );
$evt.e9.guard.g1.predicate = function( $arg ) {
    return $B.equal($var.interaction.value, $cst.inputCash);
};

$evt.e9.guard.g2 = new jeb.lang.Guard( '$evt.e9.guard.g2', 'status', $evt.e9, 0 );
$evt.e9.guard.g2.predicate = function( $arg ) {
    return $B.equal($var.Status.value, $cst.on);
};

$evt.e9.guard.g3 = new jeb.lang.Guard( '$evt.e9.guard.g3', 'notMax', $evt.e9, 0 );
$evt.e9.guard.g3.predicate = function( $arg ) {
    return $B.lessEqual($var.Balance.value, $B.minus($cst.MAX_BAL ,$cst.CoffeePrice));
};

$evt.e9.action.a1 = new jeb.lang.Action( '$evt.e9.action.a1', 'Balance', $evt.e9 );
$evt.e9.action.a1.assignment = function( $arg ) {
    $B.becomesEqualTo([$var.Balance], [$B.plus($var.Balance.value, $cst.CoffeePrice)]);
};


/* Event [insertP2] */
$evt.e10 = new jeb.lang.Event( '$evt.e10', 'insertP2' );

$evt.e10.guard.g1 = new jeb.lang.Guard( '$evt.e10.guard.g1', 'interaction', $evt.e10, 0 );
$evt.e10.guard.g1.predicate = function( $arg ) {
    return $B.equal($var.interaction.value, $cst.inputCash);
};

$evt.e10.guard.g2 = new jeb.lang.Guard( '$evt.e10.guard.g2', 'status', $evt.e10, 0 );
$evt.e10.guard.g2.predicate = function( $arg ) {
    return $B.equal($var.Status.value, $cst.on);
};

$evt.e10.guard.g3 = new jeb.lang.Guard( '$evt.e10.guard.g3', 'notMax', $evt.e10, 0 );
$evt.e10.guard.g3.predicate = function( $arg ) {
    return $B.lessEqual($var.Balance.value, $B.minus($cst.MAX_BAL ,$B.multiply($B('2'), $cst.CoffeePrice)));
};

$evt.e10.action.a1 = new jeb.lang.Action( '$evt.e10.action.a1', 'Balance', $evt.e10 );
$evt.e10.action.a1.assignment = function( $arg ) {
    $B.becomesEqualTo([$var.Balance], [$B.plus($var.Balance.value, $B.multiply($B('2'), $cst.CoffeePrice))]);
};


/* Event [CashMoney] */
$evt.e11 = new jeb.lang.Event( '$evt.e11', 'CashMoney' );

$evt.e11.parameter.s = new jeb.lang.Parameter( '$evt.e11.parameter.s', $evt.e11, 1 );
$evt.e11.bindArguments = function( $arg ) {
    $arg.s.value = $var.Balance.value;
};

$evt.e11.guard.g1 = new jeb.lang.Guard( '$evt.e11.guard.g1', 'on', $evt.e11, 0 );
$evt.e11.guard.g1.predicate = function( $arg ) {
    return $B.equal($var.Status.value, $cst.on);
};

$evt.e11.guard.g2 = new jeb.lang.Guard( '$evt.e11.guard.g2', 'positif', $evt.e11, 1 );
$evt.e11.guard.g2.predicate = function( $arg ) {
    return $B.greaterThan($arg.s.value, $B('0'));
};

$evt.e11.guard.g3 = new jeb.lang.Guard( '$evt.e11.guard.g3', 'money', $evt.e11, 1 );
$evt.e11.guard.g3.predicate = function( $arg ) {
    return $B.exists(function(n){return $B.and($B.belong(n, $B.UpTo($B('1'), $B('10'))), $B.equal($arg.s.value, $B.multiply(n, $cst.CoffeePrice)));}, [$B.UpTo($B('1'), $B('10'))]);
};

$evt.e11.guard.g4 = new jeb.lang.Guard( '$evt.e11.guard.g4', 'MoneyAcceptable', $evt.e11, 1 );
$evt.e11.guard.g4.predicate = function( $arg ) {
    return $B.lessEqual($arg.s.value, $B.minus($cst.MAX_POT ,$var.Pot.value));
};

$evt.e11.guard.g5 = new jeb.lang.Guard( '$evt.e11.guard.g5', 'CaffeeAvailable', $evt.e11, 0 );
$evt.e11.guard.g5.predicate = function( $arg ) {
    return $B.notEqual($var.CofLeft.value, $B('0'));
};

$evt.e11.guard.g6 = new jeb.lang.Guard( '$evt.e11.guard.g6', 'cafeOk', $evt.e11, 0 );
$evt.e11.guard.g6.predicate = function( $arg ) {
    return $B.equal($var.interaction.value, $cst.askCoffee);
};

$evt.e11.guard.g7 = new jeb.lang.Guard( '$evt.e11.guard.g7', 's', $evt.e11, 1 );
$evt.e11.guard.g7.predicate = function( $arg ) {
    return $B.equal($arg.s.value, $var.Balance.value);
};

$evt.e11.action.a1 = new jeb.lang.Action( '$evt.e11.action.a1', 'adPot', $evt.e11 );
$evt.e11.action.a1.assignment = function( $arg ) {
    $B.becomesEqualTo([$var.Pot], [$B.plus($var.Pot.value, $arg.s.value)]);
};

$evt.e11.action.a2 = new jeb.lang.Action( '$evt.e11.action.a2', 'moneyBack', $evt.e11 );
$evt.e11.action.a2.assignment = function( $arg ) {
    $B.becomesEqualTo([$var.MoneyBack], [$B.minus($arg.s.value ,$cst.CoffeePrice)]);
};

$evt.e11.action.a3 = new jeb.lang.Action( '$evt.e11.action.a3', 'goPour', $evt.e11 );
$evt.e11.action.a3.assignment = function( $arg ) {
    $B.becomesEqualTo([$var.interaction], [$cst.pourCoffee]);
};


/* Event [PourCoffee] */
$evt.e12 = new jeb.lang.Event( '$evt.e12', 'PourCoffee' );

$evt.e12.guard.g1 = new jeb.lang.Guard( '$evt.e12.guard.g1', 'on', $evt.e12, 0 );
$evt.e12.guard.g1.predicate = function( $arg ) {
    return $B.equal($var.Status.value, $cst.on);
};

$evt.e12.guard.g2 = new jeb.lang.Guard( '$evt.e12.guard.g2', 'stillCoffee', $evt.e12, 0 );
$evt.e12.guard.g2.predicate = function( $arg ) {
    return $B.notEqual($var.CofLeft.value, $B('0'));
};

$evt.e12.guard.g3 = new jeb.lang.Guard( '$evt.e12.guard.g3', 'pouring', $evt.e12, 0 );
$evt.e12.guard.g3.predicate = function( $arg ) {
    return $B.equal($var.interaction.value, $cst.pourCoffee);
};

$evt.e12.action.a1 = new jeb.lang.Action( '$evt.e12.action.a1', 'CofLeft', $evt.e12 );
$evt.e12.action.a1.assignment = function( $arg ) {
    $B.becomesEqualTo([$var.CofLeft], [$B.minus($var.CofLeft.value ,$B('1'))]);
};

$evt.e12.action.a2 = new jeb.lang.Action( '$evt.e12.action.a2', 'interaction', $evt.e12 );
$evt.e12.action.a2.assignment = function( $arg ) {
    $B.becomesEqualTo([$var.interaction], [$cst.inputCash]);
};


/* Event [AddCof] */
$evt.e13 = new jeb.lang.Event( '$evt.e13', 'AddCof' );

$evt.e13.parameter.c = new jeb.lang.Parameter( '$evt.e13.parameter.c', $evt.e13, 0 );
$evt.e13.bindArguments = function( $arg ) {
    $arg.c.value = jeb.ui.parseArgument($arg.c.domNodeInput.value);
};

$evt.e13.guard.g1 = new jeb.lang.Guard( '$evt.e13.guard.g1', 'off', $evt.e13, 0 );
$evt.e13.guard.g1.predicate = function( $arg ) {
    return $B.equal($var.Status.value, $cst.off);
};

$evt.e13.guard.g2 = new jeb.lang.Guard( '$evt.e13.guard.g2', 'cquantity', $evt.e13, 1 );
$evt.e13.guard.g2.predicate = function( $arg ) {
    return $B.belong($arg.c.value, $B.UpTo($B('1'), $B.minus($cst.MAX_COF ,$var.CofLeft.value)));
};

$evt.e13.action.a1 = new jeb.lang.Action( '$evt.e13.action.a1', 'remplit', $evt.e13 );
$evt.e13.action.a1.assignment = function( $arg ) {
    $B.becomesEqualTo([$var.CofLeft], [$B.plus($var.CofLeft.value, $arg.c.value)]);
};


/* Event [takePot] */
$evt.e14 = new jeb.lang.Event( '$evt.e14', 'takePot' );

$evt.e14.guard.g1 = new jeb.lang.Guard( '$evt.e14.guard.g1', 'off', $evt.e14, 0 );
$evt.e14.guard.g1.predicate = function( $arg ) {
    return $B.equal($var.Status.value, $cst.off);
};

$evt.e14.guard.g2 = new jeb.lang.Guard( '$evt.e14.guard.g2', 'moneyToGet', $evt.e14, 0 );
$evt.e14.guard.g2.predicate = function( $arg ) {
    return $B.greaterEqual($var.Pot.value, $cst.CoffeePrice);
};

$evt.e14.action.a1 = new jeb.lang.Action( '$evt.e14.action.a1', 'getIt', $evt.e14 );
$evt.e14.action.a1.assignment = function( $arg ) {
    $B.becomesEqualTo([$var.Pot], [$cst.CoffeePrice]);
};


