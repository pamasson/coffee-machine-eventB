// Auto-generated function: argument generator

var get_s = function( eventId ) {
    if (eventId == $evt.e4) {
        return $B.multiply($B.UpTo($B('1'), $B('10')).anyMember(),$cst.CoffeePrice);
    }
};


var fcanvas;
var textOn, textOff, textError;


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
    fcanvas.renderAll();

}

jeb.animator.draw = function() {
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

