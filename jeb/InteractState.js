/******************************************************************************
 * CONTEXT [InteractState]
 * Generated at 2023/05/25 10:55:50
 * JeB translator version 0.6.5
 ******************************************************************************/

/* Sets */
$cst.INTERACTIONS;


/* Constants */
$cst.inputCash;

$cst.returnCash;

$cst.askCoffee;

$cst.pourCoffee;

$cst.inactive;


/* Axioms */
$axm.a10 = new jeb.lang.Axiom( '$axm.a10', 'INTERACTIONS' );
$axm.a10.predicate = function() {
    return $B.partition($cst.INTERACTIONS, $B.SetExtension($cst.inputCash), $B.SetExtension($cst.returnCash), $B.SetExtension($cst.askCoffee), $B.SetExtension($cst.pourCoffee), $B.SetExtension($cst.inactive));
};


/* Cache constants */
jeb.__constants.push( '$cst.INTERACTIONS' );
jeb.__constants.push( '$cst.inputCash' );
jeb.__constants.push( '$cst.returnCash' );
jeb.__constants.push( '$cst.askCoffee' );
jeb.__constants.push( '$cst.pourCoffee' );
jeb.__constants.push( '$cst.inactive' );
