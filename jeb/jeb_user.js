$cst.MAX_COF = $B('20');
$cst.CoffeePrice = $B('50');
$cst.MAX_BAL = $B.multiply($B('5'),$cst.CoffeePrice);
$cst.MAX_POT = $B('1000');
$cst.on = "on";
$cst.off = "off";
$cst.error = "error";

$cst.STATUS = $B.SetExtension($cst.on, $cst.off, $cst.error);

$cst.inputCash = "inputCash";
$cst.returnCash = "returnCash";
$cst.askCoffee = "askCoffee";
$cst.pourCoffee = "pourCoffee";
$cst.inactive = "inactive";

$cst.INTERACTIONS = $B.SetExtension($cst.inputCash, $cst.returnCash, $cst.askCoffee, $cst.pourCoffee, $cst.inactive);

