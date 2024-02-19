/******************************************************************************
 * JeB      : JavaScript Simulation Framework for Event-B
 * @author  : Faqing Yang
 * @date    : 2013/11/29
 * @version : 0.6.5
 *
 * Copyright (c) 2013 Faqing Yang
 * Licensed under the MIT license.
 * 
 ******************************************************************************/

/******************************************************************************
 * JeB Namespaces
 ******************************************************************************/

var jeb       = {};
jeb.constant  = {};
jeb.axiom     = {};
jeb.variable  = {};
jeb.invariant = {};
jeb.event     = {};
jeb.util      = {};
jeb.ui        = {};
jeb.animator  = {};
jeb.scenario  = {};
jeb.scheduler = {};
jeb.lang      = {};

/* short reference for namespaces */
var $cst = jeb.constant;
var $axm = jeb.axiom;
var $var = jeb.variable;
var $inv = jeb.invariant;
var $evt = jeb.event;
var $anim;    // reference to animator context

// objects cache
jeb.__constants = [];
jeb.__axioms = [];
jeb.__variables = [];
jeb.__parameters = [];
jeb.__invariants = [];
jeb.__events = [];

/******************************************************************************
 * JeB Utility
 ******************************************************************************/

jeb.util.random = function( low, high ) {
    var range = high - low + 1;
    return Math.floor( Math.random() * range + low );
};

jeb.util.integer = function( fNumber ) {
    return fNumber > 0 ? Math.floor( fNumber ) : Math.ceil( fNumber );
};

jeb.util.parse = function( literal ) {
    return eval( literal );
};

jeb.util.clone = function( obj ) {
    if ( obj == undefined ) { // case undefined or null
        return obj;
    } else if ( typeof obj === "string" ) { // case string
        return obj;
    } else if ( obj.toLiteral ) {
        return eval( obj.toLiteral() );
    } else {
        return obj;
    }
};

jeb.util.extend = function ( destination, source ) {
    for ( var prop in source ) {
        if ( source.hasOwnProperty( prop ) ) {
            destination[ prop ] = source[ prop ];
        }
    }
};


/******************************************************************************
 * JeB UI Controller
 ******************************************************************************/

jeb.ui.$ = function( id ) {
    return document.getElementById( id );
};

jeb.ui.$$ = function( name ) {
    return document.getElementsByName( name );
};

jeb.ui.TIMER_INTERVAL = 100;
jeb.ui.MAX_TRY_ARGUMENTS = 10;
jeb.ui.CODE_TIP_DISPLAY = false;
jeb.ui.PARAMETERS_DISPLAY = true;
jeb.ui.GUARDS_DISPLAY = false;
jeb.ui.ACTIONS_DISPLAY = false;
jeb.ui.SCENARIO_ENABLED = true;
jeb.ui.VARIABLES_CHECKED = true;
jeb.ui.INVARIANTS_CHECKED = true;
jeb.ui.AXIOMS_CHECKED = true;
jeb.ui.PROBABILITY_ENABLED = true;

jeb.ui.print = function() {
    var console = jeb.ui.console,
        text = [].join.call( arguments, ' ' );
    console.innerHTML += text + '<br>';
    if( console.scrollHeight > console.clientHeight ) {
        console.scrollTop = console.scrollHeight - console.clientHeight;
    }
};

jeb.ui.clearConsole = function() {
    var console = jeb.ui.console;
    console.innerHTML = '';
    console.scrollTop = 0;
};

jeb.ui.showTip = function( event, obj ) {
    var code,
        tip = jeb.ui.tip;
    if ( !jeb.ui.CODE_TIP_DISPLAY ) {
        return '';
    }
    if ( obj instanceof jeb.lang.Action ) {
        code = obj.id + '.assignment = <br>' + obj.assignment;
    } else {
        code = obj.id + '.predicate = <br>' + obj.predicate;
    }
    tip.innerHTML = '<pre>' + code + '</pre>';
    tip.style.visibility = 'visible';
    tip.style.left = event.pageX - 30;
    tip.style.top = event.pageY + 20;
};

jeb.ui.hideTip = function( event ) {
    var tip = jeb.ui.tip;
    tip.innerHTML = '';
    tip.style.visibility = 'hidden';
};

jeb.ui.toGreen = function( text ) {
    return '<font color="#008000"><b>' + text + '</b></font>';
};

jeb.ui.toRed = function( text ) {
    return '<font color="#ff0000"><b>' + text + '</b></font>';
};

jeb.ui.toBlue = function( text ) {
    return '<font color="#0000ff"><b>' + text + '</b></font>';
};

jeb.ui.toLightGreen = function( text ) {
    return '<font color="#00ff40"><b>' + text + '</b></font>';
};

jeb.ui.parseArgument = function( text ) {
    return jeb.util.parse( text );
};

/* domId form : jeb.ui.<*>
 */
jeb.ui.update = function( domId ) {
    var target = domId.split('.')[2],
        domNode = jeb.ui.$( domId ),
        result, parameters, guards, actions, i, len;
    switch ( target ) {
    case 'CODE_TIP_DISPLAY' :
        jeb.ui.CODE_TIP_DISPLAY = domNode.checked;
        break;
    case 'SCENARIO_ENABLED' :
        break;
    case 'PARAMETERS_DISPLAY' :
        jeb.ui.PARAMETERS_DISPLAY = domNode.checked;
        domNodes = jeb.ui.$$( 'parameter' );
        for ( i = 0, len = domNodes.length; i < len; i++ ) {
            domNodes[i].style.display = jeb.ui.PARAMETERS_DISPLAY ? '' : 'none';
        }
        jeb.ui.toggleCheckbox( 'parameterCheckbox' );
        break;
    case 'GUARDS_DISPLAY' :
        jeb.ui.GUARDS_DISPLAY = domNode.checked;
        domNodes = jeb.ui.$$( 'guard' );
        for ( i = 0, len = domNodes.length; i < len; i++ ) {
            domNodes[i].style.display = jeb.ui.GUARDS_DISPLAY ? '' : 'none';
        }
        jeb.ui.toggleCheckbox( 'guardCheckbox' );
        break;
    case 'ACTIONS_DISPLAY' :
        jeb.ui.ACTIONS_DISPLAY = domNode.checked;
        domNodes = jeb.ui.$$( 'action' );
        for ( i = 0, len = domNodes.length; i < len; i++ ) {
            domNodes[i].style.display = jeb.ui.ACTIONS_DISPLAY ? '' : 'none';
        }
        jeb.ui.toggleCheckbox( 'actionCheckbox' );
        break;
    case 'PROBABILITY_ENABLED' :
		jeb.ui.PROBABILITY_ENABLED = domNode.checked;
		domNodes = jeb.ui.$$( 'probability' );
		for ( i = 0, len = domNodes.length; i < len; i++ ) {
		        domNodes[i].style.display = jeb.ui.PROBABILITY_ENABLED ? '' : 'none';
		    }
    	break;
    case 'TIMER_INTERVAL' :
        result = parseInt( domNode.value );
        if ( result > 0 ) {
            jeb.ui.TIMER_INTERVAL = result;
            if ( jeb.scheduler.timer != null ) {
                jeb.scheduler.stop();
                jeb.scheduler.autoRun();
            }
        } else {
            alert( 'The number entered must be greater than zero!' );
        }
        break;
    case 'MAX_TRY_ARGUMENTS' :
        result = parseInt( domNode.value );
        if ( result > 0 ) {
            jeb.ui.MAX_TRY_ARGUMENTS = result ;
        } else {
            alert( 'The number entered must be greater than zero!' );
        }
        break;
    case 'VARIABLES_CHECKED' :
        jeb.ui.VARIABLES_CHECKED = domNode.checked;
        jeb.ui.toggleCheckbox( 'variableCheckbox' );
        break;
    case 'INVARIANTS_CHECKED' :
        jeb.ui.INVARIANTS_CHECKED = domNode.checked;
        jeb.ui.toggleCheckbox( 'invariantCheckbox' );
        break;
    case 'AXIOMS_CHECKED' :
        jeb.ui.AXIOMS_CHECKED = domNode.checked;
        jeb.ui.toggleCheckbox( 'axiomCheckbox' );
        break;
    }
};

// domId form : $evt.<eventId>.<guard|action>
jeb.ui.updateEvent = function( domId ) {
    var words = domId.split('.'),
        eventId = words[0] + '.' + words[1],
        target = words[2],
        nodes = jeb.ui.$$( target ),
        i, len;
    for ( i = 0, len = nodes.length; i < len; i++ ) {
        if ( nodes[i].getAttribute( 'eventId' ) === eventId ) {
            nodes[i].style.display = jeb.ui.$( domId ).checked ? '' : 'none';
        }
    }
};

jeb.ui.toggleCheckbox = function( target ) {
    var nodes = jeb.ui.$$( target ),
        i, len;
    switch ( target ) {
    case 'parameterCheckbox' :
        for ( i = 0, len = nodes.length; i < len; i++ ) {
            nodes[i].checked = jeb.ui.PARAMETERS_DISPLAY;
        }
        break;
    case 'guardCheckbox' :
        for ( i = 0, len = nodes.length; i < len; i++ ) {
            nodes[i].checked = jeb.ui.GUARDS_DISPLAY;
        }
        break;
    case 'actionCheckbox' :
        for ( i = 0, len = nodes.length; i < len; i++ ) {
            nodes[i].checked = jeb.ui.ACTIONS_DISPLAY;
        }
        break;
    case 'variableCheckbox' :
        for ( i = 0, len = nodes.length - 1; i < len; i++ ) {
            nodes[i].firstChild.checked = jeb.ui.VARIABLES_CHECKED;
        }
        break;
    case 'invariantCheckbox' :
        for ( i = 0, len = nodes.length - 1; i < len; i++ ) {
            nodes[i].firstChild.checked = jeb.ui.INVARIANTS_CHECKED;
        }
        break;
    case 'axiomCheckbox' :
        for ( i = 0, len = nodes.length; i < len; i++ ) {
            nodes[i].firstChild.checked = jeb.ui.AXIOMS_CHECKED;
        }
        break;
    }
};

// buttonId form: jeb.ui.<variableCheckbox|invariantCheckbox|axiomCheckbox>
jeb.ui.filter = function( buttonId ) {
    var button = jeb.ui.$( buttonId ),
        target = buttonId.split('.')[2],
        nodes, i, len;
    if ( button.value == 'Filter' ) {
        button.value = 'Apply';
        nodes = jeb.ui.$$( target );
        for ( i = 0, len = nodes.length; i < len; i++ ) {
            nodes[i].parentNode.style.display = '' // show all rows
            nodes[i].style.display = '';           // show column
        }
    } else { // button.value = 'Apply'
        button.value = 'Filter';
        nodes = jeb.ui.$$( target );
        for ( i = 0, len = nodes.length; i < len; i++ ) {
            nodes[i].style.display = 'none';      // hide column
            if ( 0 < i && i < len - 1 ) {         // keep header and button row
                nodes[i].parentNode.style.display = 
                    nodes[i].firstChild.checked ? 'none' : '';   // hide rows
            }
        }
    } 
};

jeb.ui.checkConstants = function() {
    var undefinedConstants = [],
        i, len, domNode, constant;
    for ( i = 0, len = jeb.__constants.length; i < len; i++ ) {
        domNode = jeb.ui.$( jeb.__constants[i] ),
        constant = jeb.util.parse( jeb.__constants[i] );
        if ( typeof constant === 'undefined' ) {
            undefinedConstants.push( jeb.__constants[i] );
        } else {
            if ( domNode !== null ) { // filter seen constants
                domNode.innerHTML = constant.toString();
            }
        }
    }
    if ( undefinedConstants.length > 0 ) {
        alert( 'Please setup contexts:\n' + undefinedConstants.join(', ') );
        return false;
    } else {
        return true;
    }
};

jeb.ui.checkArgumemtGenerators = function() {
    var result = [],
        i, len, func;
    for ( i = 0, len = jeb.__parameters.length; i < len; i++ ) {
        if ( jeb.__parameters[i].type === 1 ) { // local variable
            continue;
        }
        func = 'get_' + jeb.__parameters[i].id.split('.')[3];
        if ( typeof window[func] === 'undefined' ) {
            if ( result.indexOf( func ) === -1 ) {
                result.push( func );
            }
        }
    }
    if ( result.length > 0 ) {
        alert( 'Please implement argument generators:\n' + result.join(', ') );
        return false;
    } else {
        return true;
    }
};


jeb.ui.initContextPage = function() {
    jeb.ui.tip = jeb.ui.$( 'jeb.ui.tip' );
    jeb.ui.$( 'jeb.ui.CODE_TIP_DISPLAY' ).checked = jeb.ui.CODE_TIP_DISPLAY;
    jeb.ui.checkConstants();
};

jeb.ui.initMachinePage = function() {
    // load tool-bar configuration
    var toggleArray = [ 'jeb.ui.CODE_TIP_DISPLAY', 'jeb.ui.PARAMETERS_DISPLAY',
                        'jeb.ui.GUARDS_DISPLAY', 'jeb.ui.ACTIONS_DISPLAY', 
                        'jeb.ui.SCENARIO_ENABLED', 'jeb.ui.PROBABILITY_ENABLED' ],
        inputArray  = [ 'jeb.ui.TIMER_INTERVAL', 'jeb.ui.MAX_TRY_ARGUMENTS' ],
        updateArray = [ 'jeb.ui.PARAMETERS_DISPLAY', 'jeb.ui.GUARDS_DISPLAY',
                        'jeb.ui.ACTIONS_DISPLAY', 'jeb.ui.PROBABILITY_ENABLED'  ];
    toggleArray.forEach( function( e ) {
        jeb.ui.$( e ).checked = jeb.util.parse( e );
    });
    inputArray.forEach( function( e ) {
        jeb.ui.$( e ).value = jeb.util.parse( e );
    });
    updateArray.forEach( function( e ) {
        jeb.ui.update( e );
    });

    // bind DOM nodes
    jeb.ui.console = jeb.ui.$( 'jeb.ui.console' );
    jeb.ui.tip = jeb.ui.$( 'jeb.ui.tip' );
    $anim = jeb.ui.$( 'jeb.ui.animator' ).getContext( '2d' );
    jeb.scheduler.testAllGuards.domNode = jeb.ui.$( 
        'jeb.scheduler.testAllGuards' );
    jeb.scheduler.autoRun.domNode = jeb.ui.$( 'jeb.scheduler.autoRun' );
    jeb.scheduler.stop.domNode = jeb.ui.$( 'jeb.scheduler.stop' );
    
    // disable TestAllGuards, AutoRun, Stop buttons
    jeb.scheduler.testAllGuards.domNode.disabled = true;
    jeb.scheduler.autoRun.domNode.disabled = true;
    jeb.scheduler.stop.domNode.disabled = true;
    
    // disable all events buttons
    jeb.__events.forEach( function( evt ) {
        evt.domNode.disabled = true;
    });

    // check constants and argement generator, enable init button if pass check
    if ( jeb.ui.checkConstants() && jeb.ui.checkArgumemtGenerators() ) {
        $evt.init.domNode.disabled = false;
        $evt.init.domNode.style.backgroundColor = '#00ff00';
    }

    // load ainimator configuration
    jeb.animator.init();
};

/******************************************************************************
 * JeB Animator
 ******************************************************************************/

jeb.animator.init = function(){};

jeb.animator.draw = function(){};


/******************************************************************************
 * JeB Scenario
 ******************************************************************************/

jeb.scenario.counter = 0;
jeb.scenario.variables = [];
jeb.scenario.parameters = [];
jeb.scenario.links = [];

// type: <variable|parameter>
jeb.scenario.save = function( type, eventLabel ) {
    var link,
        counter = jeb.scenario.counter;
    if ( !jeb.ui.SCENARIO_ENABLED ) {
        return;
    }
    // click an event after restore
    if ( type === 'variable' && counter < jeb.scenario.variables.length ) {
        jeb.scenario.variables.splice( counter );
        jeb.scenario.parameters.splice( counter );
        jeb.scenario.links.splice( counter );
        jeb.ui.clearConsole();
        jeb.ui.print( jeb.scenario.links.join( '<br>' ) );
    }
    if ( type === 'variable' ) {
        jeb.scenario.variables[ counter ] = [];
        jeb.__variables.forEach( function( variable ) {
            jeb.scenario.variables[ counter ].push( variable.value.toLiteral() );
        });
        link = "<a href='javascript:jeb.scenario.restore(" + counter + ")'>" + 
            eventLabel + "</a>";
        jeb.scenario.links.push( link );
        jeb.ui.print( link );
    } else if ( type === 'parameter' ) {
        jeb.scenario.parameters[ counter ] = [];
        jeb.__parameters.forEach( function( parameter ) {
            jeb.scenario.parameters[ counter ].push( 
                typeof parameter.value === 'undefined' ? parameter.value : 
                parameter.value.toLiteral() );
        });
        jeb.scenario.counter++;
    }
};

jeb.scenario.restore = function( counter ) {
    jeb.scenario.counter = counter;
    jeb.__variables.forEach( function( variable, index ) {
        variable.value = jeb.util.parse( 
            jeb.scenario.variables[ counter ][ index ] );
                variable.updateView();
        variable.updateView();
    });
    if ( counter < jeb.scenario.variables.length - 1 ) {
        jeb.__parameters.forEach( function( parameter, index ) {
            parameter.value = jeb.ui.parseArgument( 
                jeb.scenario.parameters[ counter ][ index ] );
        });
        // update event view
        jeb.__events.forEach( function( evt ) {
            evt.updateParametersView();
            evt.evaluateGuards();
            evt.domNode.disabled = !evt.enabled;
            evt.domNode.style.backgroundColor = evt.enabled ? '#00ff00' : null;
        });
    } else {
        jeb.scheduler.testAllGuards();  // the last occurrence
    }
    jeb.animator.draw();
    jeb.scheduler.checkInvariants();
};


/******************************************************************************
 * JeB Scheduler
 ******************************************************************************/

jeb.scheduler.events = [];
jeb.scheduler.timer = null;

jeb.scheduler.addEvent = function( label ) {
    jeb.scheduler.events.push( jeb.lang.getEventByLabel( label ) );
};

jeb.scheduler.removeEvent = function( label ) {
    jeb.scheduler.events = jeb.scheduler.events.filter( function( evt ) {
        return label !== evt.label;
    });
};

jeb.scheduler.checkAxioms = function() {
    var result, i, len,
        axioms = [],
        nodes = jeb.ui.$$( 'axiomCheckbox' );
    for ( i = 1, len = nodes.length; i < len; i++ ) { // skip header row
        if ( nodes[i].firstChild.checked ) {
            axioms.push( jeb.util.parse( nodes[i].parentNode.children[3].id ) );
        }
    }
    jeb.scheduler.clearAxiomsEvaluation();
    for ( i = 0, len = axioms.length; i < len; i++ ) {
        result = axioms[i].predicate();
        if ( result ) {
            axioms[i].domNode.innerHTML = jeb.ui.toGreen( result );
        }else {
            axioms[i].domNode.innerHTML = jeb.ui.toRed( result );
        }
    }
};

jeb.scheduler.clearAxiomsEvaluation = function() {
    var i, len;
    for ( i = 0, len = jeb.__axioms.length; i < len; i++ ) {
        if ( jeb.__axioms[i].domNode !== null ) {
            jeb.__axioms[i].domNode.innerHTML = '';
        }
    }
};

jeb.scheduler.checkInvariants = function() {
    var result, i, len, restInvariants;
    for ( i = 0, len = jeb.__invariants.length; i < len; i++ ) {
        result = jeb.__invariants[i].predicate();
        if ( result ) {
            jeb.__invariants[i].domNode.innerHTML = jeb.ui.toGreen( result );
        }else {
            jeb.__invariants[i].domNode.innerHTML = jeb.ui.toRed( result );
            restInvariants = jeb.__invariants.slice( i + 1 );
            restInvariants.forEach( function( inv ) {
                inv.domNode.innerHTML='';
            });
            jeb.scheduler.stop();
            jeb.ui.print( jeb.ui.toRed( 'Violate invariant!' ) );
            break;
        }
    }
};

jeb.scheduler.testAllGuards = function() {
    jeb.__events.forEach( function( evt ) {
        evt.testGuards();
    });
};
//gestion de la checkbox "enable probability"
jeb.scheduler.pickEvent = function() {
	if(jeb.ui.PROBABILITY_ENABLED) {
		var enabledEvents, sumprob, prob, i;
		enabledEvents = jeb.scheduler.events.filter( function( evt ) {
			return evt.enabled;
		});
		if ( enabledEvents.length > 0 ) {
			for( i = 0, sumprob = 0; i < enabledEvents.length; i++ ) {
				sumprob += enabledEvents[i].probability;
			}
			if( sumprob == 0 ) {
				return null;
			}else {
				prob = Math.random() * sumprob;
				for( i = 0; prob >= 0; i++ ) {
					prob -= enabledEvents[i].probability;
				}
			return enabledEvents[ i - 1 ];
			}
		} else {
			return null;
		}
	} else {
		var choice, enabledEvents;
		enabledEvents = jeb.scheduler.events.filter( function( evt ) {
			return evt.enabled;
		});
		if ( enabledEvents.length > 0 ) {
			choice = jeb.util.random( 0, enabledEvents.length - 1 );
			return enabledEvents[ choice ];
		} else {
			return null;
		}
	}
};

jeb.scheduler.execute = function( event ) {
    jeb.scenario.save( 'parameter' );
    event.doActions();
    jeb.scenario.save( 'variable', event.label );
    jeb.animator.draw();
    jeb.scheduler.checkInvariants();
};

jeb.scheduler.loop = function() {
    var anyEvent = jeb.scheduler.pickEvent();
    if ( anyEvent !== null ) {
        jeb.scheduler.execute( anyEvent );
    }
    jeb.scheduler.testAllGuards();
};

jeb.scheduler.onEventClick = function( event ) {
    jeb.scheduler.execute( event );
    jeb.scheduler.testAllGuards();
};

jeb.scheduler.autoRun = function() {
    jeb.scheduler.timer = setInterval( jeb.scheduler.loop, 
        jeb.ui.TIMER_INTERVAL );
    jeb.scheduler.autoRun.domNode.disabled = true;
    jeb.scheduler.stop.domNode.disabled = false;
};

jeb.scheduler.stop = function() {
    clearInterval( jeb.scheduler.timer );
    jeb.scheduler.timer = null;
    jeb.scheduler.autoRun.domNode.disabled = false;
    jeb.scheduler.stop.domNode.disabled = true;
};

// Start simulation cycle
jeb.scheduler.init = function() {
    jeb.scheduler.stop(); // stop timer if it was already ran
    $evt.init.doActions();
    jeb.scenario.save( 'variable', 'INITIALISATION' );
    jeb.animator.draw();
    jeb.scheduler.checkInvariants();
    jeb.scheduler.testAllGuards();
    jeb.scheduler.testAllGuards.domNode.disabled = false;
    jeb.scheduler.autoRun.domNode.disabled = false;
};


/******************************************************************************
 * JeB Structure Mapping Event-B Component
 ******************************************************************************/

/* Axiom */
jeb.lang.Axiom = function( id, label ) {
    this.id = id;                      // axiom id
    this.label = label;                // axiom label
    this.domNode = jeb.ui.$( id );     // axiom DOM node
    this.predicate = function(){};     // overrode by JeB translator
    jeb.__axioms.push( this );         // cache for JeB scheduler
};

/* Variable */
jeb.lang.Variable = function( id ) {
    this.id = id;                      // variable id
    this.value = undefined;            // variable value
    this._value = undefined;           // variable primed value
    this.domNode = jeb.ui.$( id );     // variable DOM node
    jeb.__variables.push( this );      // cache for JeB scheduler
};

jeb.lang.Variable.prototype.updateView = function() {
    this.domNode.innerHTML = this.value;
};

/* Invariant */
jeb.lang.Invariant = function( id, label ) {
    this.id = id;                      // invariant id
    this.label = label;                // invariant label
    this.domNode = jeb.ui.$( id );     // invariant DOM node
    this.predicate = function(){};     // overrode by JeB translator
    jeb.__invariants.push( this );     // cache for JeB scheduler
};

/* Parameter */
jeb.lang.Parameter = function( id, eventId, type ) {
    this.id = id;                      // parameter id
    this.eventId = eventId;            // reference to its event parent
    this.type = type;                  // 0: parameter, 1: local variable
    this.domNode = jeb.ui.$( id );     // parameter DOM node
    this.domNodeInput = jeb.ui.$( id + '.input' ); // parameter input DOM node
    jeb.__parameters.push( this );     // cache for JeB scenario
    eventId.__parameters.push( this ); // cache for update view
};
jeb.lang.Parameter.prototype.updateView = function() {
    this.domNode.innerHTML = this.value;
};

/* Guard */
jeb.lang.Guard = function( id, label, eventId, type ) {
    this.id = id;                      // guard id
    this.label = label;                // guard label
    this.eventId = eventId;            // reference to its event parent
    this.type = type;                  // 0: normal, 1: parameterized
    this.domNode = jeb.ui.$( id );     // guard DOM node
    this.predicate = function(){};     // overrode by JeB translator
    eventId.__guards.push( this );     // cache for JeB scheduler
};

/* Action */
jeb.lang.Action = function( id, label, eventId ) {
    this.id = id;                      // action id
    this.label = label;                // action label
    this.eventId = eventId;            // reference to its event parent
    this.assignment = function(){};    // overrode by JeB translator
    eventId.__actions.push( this );    // cache for JeB scheduler
};

/* Event */
jeb.lang.Event = function( id, label ) {
    this.id = id;                      // event id
    this.label = label;                // event label
    this.domNode = jeb.ui.$( id );     // event DOM node
    this.enabled = true;               // activation condition
    this.parameter = {};               // parameters namespace 
    this.guard = {};                   // guards namespace 
    this.action = {};                  // actions namespace
    this.bindArguments = function(){}; // overrode by JeB translator
    this.probability = 1;              // probability to get chosen by the event picker
    this.__parameters = [];            // parameters cache 
    this.__guards = [];                // guards cache 
    this.__actions = [];               // actions cache
    jeb.__events.push( this );         // cache for JeB scheduler
    if ( label !== 'INITIALISATION' ) {
        jeb.scheduler.addEvent( label );
    }
};

jeb.lang.Event.prototype.updateParametersView = function() {
    this.__parameters.forEach( function( parameter ) {
        parameter.updateView();
    });
};

jeb.lang.Event.prototype.testGuards = function() {
    var counter = 1;
    do{
        try {
            this.bindArguments( this.parameter );
            this.updateParametersView();
        } catch( error ){
            this.enabled = false;
            this.__guards.forEach( function( guard ) {
                guard.domNode.innerHTML = '';
            });
            jeb.ui.print('[' + this.label+'] ' + error.message);
            break;
        }
        this.evaluateGuards();
    } while ( !this.enabled && counter++ < jeb.ui.MAX_TRY_ARGUMENTS )
    this.domNode.disabled = !this.enabled;
    this.domNode.style.backgroundColor = this.enabled ? '#00ff00' : null;
};

jeb.lang.Event.prototype.evaluateGuards = function() {
    var result = true,
        i, len, restGuards;
    for ( i = 0, len = this.__guards.length; i < len; i++ ) {
        try {
            result = this.__guards[i].predicate( this.parameter );
        } catch ( error ) {
            result = false;
            jeb.ui.print('[' + this.label+'] ' + error.message );
        }
        if ( result ) {
            this.__guards[i].domNode.innerHTML = jeb.ui.toGreen( result );
        } else {
            this.__guards[i].domNode.innerHTML = jeb.ui.toRed( result );
            restGuards = this.__guards.slice( i + 1 );
            restGuards.forEach( function( guard ) {
                guard.domNode.innerHTML = '';
            });
            break;
        }
    }
    this.enabled = result;
};

jeb.lang.Event.prototype.doActions = function() {
    var self = this;
    if ( !this.enabled ) {
        jeb.ui.print( '[' +this.label+'] is disabled!' );
        return;
    }
    try {
        this.__actions.forEach( function( action ) {
            action.assignment( self.parameter );
        });
    } catch ( error ) {
        jeb.ui.print( '[' + this.label+'] ' + error.message );
    }
    jeb.__variables.forEach( function( variable ) {
        variable.value = variable._value;
        variable.updateView();
    });
}

jeb.lang.getEventByLabel = function( label ) {
    var i, len;
    for ( i = 0, len = jeb.__events.length; i < len; i++ ) {
        if ( jeb.__events[i].label === label ) {
            return jeb.__events[i];
        }
    }
};

