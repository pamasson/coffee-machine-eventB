// Auto-generated function: argument generator

var get_s = function( eventId ) {
    if (eventId == $evt.e5) {
        return $B.multiply($B.UpTo($B('1'), $B('10')).anyMember(),$cst.CoffeePrice);
    }
};


// Auto-generated function: argument generator
var get_c = function( eventId ) {
    if (eventId == $evt.e7) {
        return $B.UpTo($B('1'), $B.minus($cst.MAX_COF ,$var.CofLeft.value)).anyMember();
    }
};

var fcanvas;
var textOn, textOff, textError;
var cashContainer, cashBox, balanceContainer, balanceBox, coffeeContainer, coffeeBox;

jeb.animator.init = function() {
    $anim.canvas.width = 1000;
    $anim.canvas.height = 500;
    $anim.canvas.style.display = '';

    fcanvas = new fabric.Canvas("jeb.ui.animator");
    textOn = new fabric.Text('On', {left:100, top: 50, fontSize:15, fontFamily: 'Arial', selectable:false});
    fcanvas.add(textOn);
    textOff = new fabric.Text('Off', {left:100, top: 80, fontSize: 15, fontFamily: 'Arial',selectable:false});
    fcanvas.add(textOff);
    textError = new fabric.Text('Error', {left:100, top: 110, fontSize:15, fontFamily: 'Arial',selectable:false});
    fcanvas.add(textError);
    coffeeContainer = new fabric.Rect({left: 50, top:150,
				 width: 80, height: 200,
				 stroke: 'black',
				 strokeWidht: 1,
				 fill: 'lightCyan',
				     selectable:true
				      });
    fcanvas.add(coffeeContainer);
    fcanvas.add(new fabric.Text('Coffee',{left:50, top:370, fontSize:15, fontFamily: 'Arial', selectable:false}));
    coffeeBox = new fabric.Rect ({left: 60,
				  width: 60,
				  stroke: 'black',
				  strokeWidth: 1,
				  fill: 'Brown',
				  selectable: false});
		
//    coffeeBox.set({height: $var.CofLeft.value.literal*10});
//    coffeeBox.set({top: 150 + (20-$var.CofLeft.value.literal)*10});
    fcanvas.add(coffeeBox);
    fcanvas.bringToFront(coffeeBox);
     cashContainer = new fabric.Rect ({left: 210,
				      width: 100,
				      top: 150,
				      height: 200,
				  stroke: 'black',
				  strokeWidth: 1,
				  fill: 'lightCyan',
				      selectable: false});
    fcanvas.add(cashContainer);
    fcanvas.add(new fabric.Text('Cash',{left:215, top:370, fontSize:15, fontFamily: 'Arial', selectable:false}));

    cashBox = new fabric.Rect ({left: 210,
				 width: 100,
				  stroke: 'black',
				  strokeWidth: 1,
				fill: 'silver',
			         selectable: false});
    fcanvas.add(cashBox);
  //  cashBox.set({height: ($var.Pot.value.literal/50)*10});
    //    cashBox.set({top: 150 + ((1000-$var.Pot.value.literal)/50)*10});

   fcanvas.renderAll();

}

jeb.animator.draw = function() {
       coffeeBox.set({height: $var.CofLeft.value.literal*10});
    coffeeBox.set({top: 150 + (20-$var.CofLeft.value.literal)*10});
    cashBox.set({height: ($var.Pot.value.literal/50)*10});
    cashBox.set({top: 150 + ((1000-$var.Pot.value.literal)/50)*10});
  fcanvas.bringToFront(coffeeBox);

    textOn.set({textBackgroundColor: 'white'});
    textOff.set({textBackgroundColor: 'white'});
    textError.set({textBackgroundColor: 'white'});
    
    if ($var.Status.value == "on") {
	textOn.set({textBackgroundColor: 'lightGreen'});
    } else if ($var.Status.value == "off") {
	textOff.set({textBackgroundColor: 'yellow'});
    } else if ($var.Status.value == "error") {
	textError.set({textBackgroundColor: 'red'});
    }

    fcanvas.renderAll();
}


