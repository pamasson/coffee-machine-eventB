// Auto-generated function: argument generator
var get_c = function( eventId ) {
    if (eventId == $evt.e13) {
        return $B.UpTo($B('1'), $B.minus($cst.MAX_COF ,$var.CofLeft.value)).anyMember();
    }
};

var fcanvas;
var textOn, textOff, textError;
var slotP1, slotP2;
var buttonCoffee, buttonMoneyBack;

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
    slotP1 = new fabric.Rect({left:600, top:100, width:10, height: 40, fill: "lightGray", selectable:false});
    slotP2 = new fabric.Rect({left:660, top:100, width:10, height: 60, fill: "lightGray", selectable:false});
    
    fcanvas.add(slotP1);
    fcanvas.add(slotP2);
    fcanvas.add(new fabric.Text('P1',{left:595, top:80, fontSize: 13,selectable: false}));
    fcanvas.add(new fabric.Text('P2',{left:655, top:80, fontSize: 13,selectable: false}));

    balanceBox = new fabric.Rect({left:620, width: 40, fill:'silver', stroke:'black', strokeWidth:1});
    fcanvas.add(balanceBox);
    
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

    buttonCoffee = new fabric.Circle({radius: 20, stroke:'black', strokefill:1, fill:'white', left:500, top:90,selectable:false});
    fcanvas.add(buttonCoffee);
    fcanvas.add(new fabric.Text('Coffee', {left:500,  top:140, fontSize:13, selectable:false}));
    buttonMoneyBack = new fabric.Circle({radius: 20, stroke:'black', strokefill:1, fill:'white',left:710, top:90,selectable:false});
    fcanvas.add(buttonMoneyBack);
    fcanvas.add(new fabric.Text('Return', {left:710,  top:140, fontSize:13, selectalbe:false}));    

    fcanvas.renderAll();

    slotP1.event = $evt.e9;
    slotP2.event = $evt.e10;
    buttonCoffee.event = $evt.e8;
    buttonMoneyBack.event = $evt.e6;

    fcanvas.on('mouse:up', function (opt) {
	if (opt.target == slotP1) {
	    if (slotP1.event.enabled) {
		jeb.scheduler.onEventClick(slotP1.event);
	    }
	}
	if (opt.target == slotP2) {
	    if (slotP2.event.enabled) {
		jeb.scheduler.onEventClick(slotP2.event);
	    }
	}
	if (opt.target == buttonCoffee) {
	    if (buttonCoffee.event.enabled) {
		jeb.scheduler.onEventClick(buttonCoffee.event);
	    }
	}
	if (opt.target ==  buttonMoneyBack) {
	    if (buttonMoneyBack.event.enabled) {
		jeb.scheduler.onEventClick(buttonMoneyBack.event);
	    }
	}
    });
    
	     
	     
    
}

jeb.animator.draw = function() {
    //ADD ANIMATION HERE
    coffeeBox.set({height: $var.CofLeft.value.literal*10});
    coffeeBox.set({top: 150 + (20-$var.CofLeft.value.literal)*10});
    cashBox.set({height: ($var.Pot.value.literal/50)*10});
    cashBox.set({top: 150 + ((1000-$var.Pot.value.literal)/50)*10});
    balanceBox.set({height: ($var.Balance.value.literal/50)*10});
    balanceBox.set({top: 200 + ((250-$var.Balance.value.literal)/50*10)});

    jeb.scheduler.testAllGuards();
    
    if (slotP1.event.enabled) {
	slotP1.set({fill:'green'});
    } else {
	slotP1.set({fill:'lighGray'});
    }

    if (slotP2.event.enabled) {
	slotP2.set({fill:'green'});
    } else {
	slotP2.set({fill:'lighGray'});
    }

    if (buttonCoffee.event.enabled) {
	buttonCoffee.set({fill:'green'});
    } else {
	buttonCoffee.set({fill:'white'});
    }
    if (buttonMoneyBack.event.enabled) {
	buttonMoneyBack.set({fill:'green'});
    } else {
	buttonMoneyBack.set({fill:'white'});
    }

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

