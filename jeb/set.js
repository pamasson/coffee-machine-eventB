/******************************************************************************
 * Set      : JavaScript Set Library for Event-B
 * @author  : Faqing YANG
 * @date    : 2013/11/29
 * @version : 0.6.5
 *
 * Copyright (c) 2013 Faqing Yang
 * Licensed under the MIT license.
 *
 * Uses biginteger.js
 * Copyright (c) 2009 Matthew Crumley <email@matthewcrumley.com>
 * Copyright (c) 2010,2011 by John Tobey <John.Tobey@gmail.com>
 * Released under the MIT license.
 *
 ******************************************************************************/

// version corrigee du 11/05/2022 JPJ

(function() {

    var prefix = "$B";

    Boolean.prototype.toLiteral = function() {
	return this.toString();
    };

    Boolean.prototype.equal = function( obj ) {
	return this.valueOf() === obj;
    };

    // addition finite
    Boolean.prototype.isFinite = function () {
	return true;
    }

    
    String.prototype.toLiteral = function() {
	return "String('" + this.replace( /\'/g, '"' ) + "')";
	//    return "'" + this.toString() + "'";
    };

    String.prototype.equal = function( obj ) {
	return "" + this === obj;
    };

    // addition finite
    String.prototype.isFinite = function () {
	return true;
    }


    //BigInteger.prototype.toLiteral = function() {
    //    return this.toString();
    //};

    /* TRUE
     * a constant with primitive true value
     */
    var TRUE = true;

    /* FALSE
     * a constant with primitive false value
     */
    var FALSE = false;

    /******************************************************************************
     * Event-B Arithmetic
     ******************************************************************************/

    var regInteger = /^[-]?[0-9]+$/;

    /* Integer
     * Parameters:
     *   literal: an Integer, a BigInteger or a decimal string
     * Return:
     *   an instance of Integer or undefined
     */

    var Integer = function( literal ) {
	var obj = {};
	if ( literal instanceof Integer ) {
            return literal;
	} else if ( literal instanceof BigInteger ) {
            obj.literal = literal;
	} else if ( typeof literal === "string" ) {
            if ( regInteger.test( literal ) ) {
		obj.literal = BigInteger.parse( literal );
            }
	}
	if ( obj.literal ) {
            obj.__proto__ = Integer.prototype;
            return obj;
	}
    };

    Integer.prototype = {
	toLiteral : function() {
            return ( prefix + "('" + this.literal + "')" );
	    //        return "'" + this.literal + "'";
	},

	toString : function() {
            return "" + this.literal;
	},

	equal : function( obj ) {
            obj = Integer( obj );
            if ( obj ) {
		return "" + this.literal === "" + obj.literal;
            } else {
		return false;
            }
	},
	// addition finite
	isFinite : function() {
	    return true;
	}
    };
    

    var ZERO = Integer( '0' );
    var ONE  = Integer( '1' );
    var TWO  = Integer( '2' );
    var MAX_ENUMERATED_VALUE = Integer( '2' );
    var MIN_ENUMERATED_VALUE = Integer( '-2' );

    var isInteger = function( literal ) {
	if ( literal instanceof Integer ) {
            return true;
	} else if ( literal instanceof BigInteger ) {
            return true;
	} else if ( typeof literal === "string" ) {
            if ( regInteger.test( literal ) ) {
		return true;
            }
	}
	return false;
    };

    /* Pair
     * Parameters:
     *   left, right : two math objects
     * Return:
     *   a new Pair object
     */
    var Pair = function( left, right ) {
	var pair = {};
	pair.left = left;
	pair.right = right;
	pair.__proto__ = Pair.prototype;
	return pair;
    };

    Pair.prototype = Object.create(Object.prototype, {
	constructor: {
	    configurable: true,
	    enumerable: true,
	    value: Pair,
	    writable: true},
	
	toArguments : {
	    value:  function( argArray ) {
            if ( this.left instanceof Pair ) {
		this.left.toArguments( argArray );
            }  else {
		argArray.push( this.left );
            }
            if ( this.right instanceof Pair ) {
		this.right.toArguments( argArray );
            } else {
		argArray.push( this.right );
            }
	}},

	toLiteral : {
	    value: function() {
            return ( prefix + ".Pair(" + this.left.toLiteral() + "," +
		     this.right.toLiteral() + ")" );
	}},

	toString : {
	    value: function() {
            var leftString = this.left instanceof Pair ?
		"(" + this.left + ")" : this.left,
		rightString = this.right instanceof Pair ?
		"(" + this.right + ")" : this.right;
            return ( leftString + '\u21a6' + rightString );
	}},

	equal : {
	    value : function( obj ) {
            if ( obj instanceof Pair ) {
		return this.left.equal(obj.left) && this.right.equal(obj.right);
            } else {
		return false;
            }
	}},
	// addition finite
	isFinite :{value:  function() {
	    return true;
	}}
    });

    /* minus
     * Parameters:
     *   m, n : two Integer objects
     * Return:
     *   a new Integer object or undefined
     */
    var minus = function( m, n ) {
	m = Integer( m );
	n = Integer( n );
	if ( m instanceof Integer && n instanceof Integer ) {
            return Integer( m.literal.subtract( n.literal ) );
	}
    };

    /* divide
     * Parameters:
     *   m, n : two Integer objects
     * Return:
     *   a new Integer object or undefined
     */
    var divide = function( m, n ) {
	m = Integer( m );
	n = Integer( n );
	if ( m instanceof Integer && n instanceof Integer &&
             n.literal.compare( ZERO ) !== 0 ) {
            return Integer( m.literal.quotient( n.literal ) );
	}
    };

    /* mod
     * Parameters:
     *   m, n : two Integer objects
     * Return:
     *   a new Integer object or undefined
     */
    var mod = function( m, n ) {
	m = Integer( m );
	n = Integer( n );
	if ( m instanceof Integer && n instanceof Integer &&
             n.literal.compare( ZERO ) !== 0 ) {
            return Integer( m.literal.remainder( n.literal ) );
	}
    };

    /* pow
     * Parameters:
     *   m, n : two Integer objects
     * Return:
     *   a new Integer object or undefined
     */
    var pow = function( m, n ) {
	m = Integer( m );
	n = Integer( n );
	if ( m instanceof Integer && n instanceof Integer ) {
            return Integer( m.literal.pow( n.literal ) );
	}
    };

    /* plus
     * Parameters:
     *   a list of Integer objects, list.length >= 2
     * Return:
     *   a new Integer object or undefined
     */
    var plus = function( /* integerList */ ) {
	var argArray = [].slice.call( arguments, 0 ),
            m, n;
	argArray = argArray.map( function(e){return Integer(e);} );
	m = argArray.shift();
	do {
            n = argArray.shift();
            if ( m instanceof Integer && n instanceof Integer ) {
		m = Integer( m.literal.add( n.literal ) );
            } else {
		return undefined;
            }
	} while ( argArray.length > 0 );
	return m;
    };

    /* multiply
     * Parameters:
     *   a list of Integer objects, list.length >= 2
     * Return:
     *   a new Integer object or undefined
     */
    var multiply = function( /* integerList */ ) {
	var argArray = [].slice.call( arguments, 0 ),
            m, n;
	argArray = argArray.map( function(e){return Integer(e);} );
	m = argArray.shift();
	do {
            n = argArray.shift();
            if ( m instanceof Integer && n instanceof Integer ) {
		m = Integer( m.literal.multiply( n.literal ) );
            } else {
		return undefined;
            }
	} while ( argArray.length > 0 );
	return m;
    };

    /* pred
     * Parameters:
     *   n : a Integer object
     * Return:
     *   a new Integer object or undefined
     */
    var pred = function( n ) {
	n = Integer( n );
	if ( n instanceof Integer ) {
            return Integer( n.literal.prev() );
	}
    };

    /* succ
     * Parameters:
     *   n : a Integer object
     * Return:
     *   a new Integer object or undefined
     */
    var succ = function( n ) {
	n = Integer( n );
	if ( n instanceof Integer ) {
            return Integer( n.literal.next() );
	}
    };

    /* unminus
     * Parameters:
     *   n : a Integer object
     * Return:
     *   a new Integer object or undefined
     */
    var unminus = function( n ) {
	n = Integer( n );
	if ( n instanceof Integer ) {
            return Integer( n.literal.negate() );
	}
    };

    /* lessThan
     * Parameters:
     *   m, n : two Integer objects
     * Return:
     *   a boolean value
     */
    var lessThan = function( m, n ) {
	m = Integer( m );
	n = Integer( n );
	if ( m instanceof Integer && n instanceof Integer ) {
            return m.literal.compare( n.literal ) === -1 ? true : false;
	} else {
            return false;
	}
    };

    /* lessEqual
     * Parameters:
     *   m, n : two Integer objects
     * Return:
     *   a boolean value
     */
    var lessEqual = function( m, n ) {
	m = Integer( m );
	n = Integer( n );
	if ( m instanceof Integer && n instanceof Integer ) {
            return m.literal.compare( n.literal ) <= 0 ? true : false;
	} else {
            return false;
	}
    };

    /* greaterThan
     * Parameters:
     *   m, n : two Integer objects
     * Return:
     *   a boolean value
     */
    var greaterThan = function( m, n ) {
	m = Integer( m );
	n = Integer( n );
	if ( m instanceof Integer && n instanceof Integer ) {
            return m.literal.compare( n.literal ) === 1 ? true : false;
	} else {
            return false;
	}
    };

    /* greaterEqual
     * Parameters:
     *   m, n : two Integer objects
     * Return:
     *   a boolean value
     */
    var greaterEqual = function( m, n ) {
	m = Integer( m );
	n = Integer( n );
	if ( m instanceof Integer && n instanceof Integer ) {
            return m.literal.compare( n.literal ) >= 0 ? true : false;
	} else {
            return false;
	}
    };
    /* Set
     * A semi-abstract class, 
     * not part of the interface
     * 
     */
    var Set = function() {
	var res = [];
	res.__proto__= Set.prototype;
	res.finite = false;
	res.concrete = false;
	return res;
    };
    
    Set.prototype  = Object.create( Array.prototype, {
	constructor : {
	    configurable: true,
	    enumerable: true,
	    value: Set,
	    writable: true
	},
	map: {value: function(f) {
	    var elts =  [].map.call(this,f);
	    var res = SetExtension.apply(null,elts);
	    return res;
	}},
	isFinite: {value :function() {return this.finite;}},
	isConcrete: {value: function() {return this.concrete;}},
	card: {
	    value :function() {
		if (this.isConcrete()) {
		    return Integer( "" + this.length );
		}
		if (this.isFinite()) {
		    this.toSetExtension();
		    return Integer(""+ this.length);
		} else {
		    return "NaN";
		}
	    },
	    writable: true},
	equal: {
	    value: function(s) {
		if (s instanceof Set) {
		    if (! this.isFinite() || ! s.isFinite()) {
			return this.toLiteral() === s.toLiteral();
		    }
		    if (!this.concrete) {
			this.toSetExtension();
		    }
		    if (!s.isConcrete() ) {
			s.toSetExtension()
		    }
		    if (this.length !== s.length ) {
			return false; }
		    var i=0, res=true;
		    while (i<this.length && res) {
			res= res && (this[i].equal(s[i]));
			i++;
		    }
		    return res;
		} else {
		    return false;
		}
	    },

	    writable: true
	},
	contains : {
	    value: function( element ) {
		if (this.concrete) {
		    return this.some( function( e ) {
			return equal( e, element );
		    });
		}
	    },
	    writable: true},

	anyMember : {
	    value: function() {
		if (this.concrete) {
		    //		    var any = UpTo( ZERO, Integer( "" + (this.length - 1) ) ).anyMember();
		    var any = Math.floor(Math.random()*this.length);
		    //		    return this[any.toString()];
		    return this[any];
		}
	    },
	    writable: true},

	indexOf : {
	    value: function( element ) {
		if (this.concrete) {
		    var i, len;
		    for ( i = 0, len = this.length; i < len; i++ ) {
			if ( equal( this[i], element ) ) {
			    return i;
			}
		    }
		    return -1;
		}
	    },
	    writable: true},

	indexOfKey : {
	    value: function( key ) {
		if (this.concrete) {
		    var i, len;
		    for ( i = 0, len = this.length; i < len; i++ ) {
			if ( equal( this[i].left, key ) ) {
			    return i;
			}
		    }
		    return -1;
		}
	    },
	    writable: true},

	getImage : {
	    value: function( left ) {
		if (this.concrete) {
		    var i, len;
		    for ( i = 0, len = this.length; i < len; i++ ) {
			if ( equal( this[i].left, left ) ) {
			    return this[i].right;
			}
		    }
		}
	    },
	    writable: true},

	setImage : {
	    value: function( left, right ) {
		if (this.concrete) {
		    var i, len;
		    for ( i = 0, len = this.length; i < len; i++ ) {
			if ( equal( this[i].left, left ) ) {
			    this[i].right = right;
			    break;
			}
		    }
		}
	    },
	    writable: true},


    });
    

    /* SetExtension
     * SetExtension use Array to store elements, the maximum elements must
     * less than 2^32 (4294967296) by the limitation of Array length
     * Parameters:
     *   a list of meme type math objects
     * Return:
     *   a new SetExtension object
     */
    // modif JPJ : passage a un heritage de Array
    // var SetExtension = function( /* objectList */ ) {
    //     var elements = [];
    //     elements.push.apply( elements, arguments );
    //     elements.concrete = true;
    //     elements.finite = true;
    //     elements.__proto__ = SetExtension.prototype;
    //     elements.sort();
    //     return elements;
    // };

    var SetExtension  = function(/* list of elements */) {
	var res = Set();
	if (arguments !== "undefined") {
	    res.push.apply(res,arguments);
	}
	res.finite = true;
	res.concrete = true;
	res.__proto__ = SetExtension.prototype;
	res.sort();
	return res;
    };
    
    SetExtension.prototype = Object.create(Set.prototype, {
	constructor : {
	    configurable: true,
	    enumerable: true,
	    value: SetExtension,
	    writable: true
	},

	contains : {
	    value: function( element ) {
		return this.some( function( e ) {
                    return equal( e, element );
		});
	    },
	    writable: true},

	anyMember : {
	    value: function() {
		var any = Math.floor(Math.random()*this.length);
		return this[any];
	    },
	    writable: true},

	indexOf : {
	    value: function( element ) {
		var i, len;
		for ( i = 0, len = this.length; i < len; i++ ) {
		    if ( equal( this[i], element ) ) {
			return i;
		    }
		}
		return -1;
	    },
	    writable: true},

	indexOfKey : {
	    value: function( key ) {
		var i, len;
		for ( i = 0, len = this.length; i < len; i++ ) {
		    if ( equal( this[i].left, key ) ) {
			return i;
		    }
		}
		return -1;
	    },
	    writable: true},

	getImage : {
	    value: function( left ) {
		var i, len;
		for ( i = 0, len = this.length; i < len; i++ ) {
		    if ( equal( this[i].left, left ) ) {
			return this[i].right;
		    }
		}
	    },
	    writable: true},

	setImage : {
	    value: function( left, right ) {
		var i, len;
		for ( i = 0, len = this.length; i < len; i++ ) {
		    if ( equal( this[i].left, left ) ) {
			this[i].right = right;
			break;
		    }
		}
	    },
	    writable: true},

	toLiteral : {
	    value: function() {
		var literalArray = Array.prototype.map.call(this, function( e ) {
                    return e.toLiteral();
		});
		return prefix + ".SetExtension(" + literalArray.join( "," ) + ")";
	    },
	    writable: true},

	toString :{
	    value: function() {
		var toStringArray = Array.prototype.map.call(this, function( e ) {
                    return ( typeof e === "undefined" ? e : e.toString() );
		});
		if ( toStringArray.length === 0 ) {
		    return "\u2205";
		} else {
		    return ( '{' + toStringArray.join( ', ' ) + '}' );
		}
	    },
	    writable: true},
	toSetExtension :  {
	    value: function() {
		return this;
	    },
	    writable: true},

    });

    /* QuantifiedExpression
     * Parameters:
     *   predicateFunction : a function
     *   expressionFunction : a function
     *   domainArray : an array contains all quantifiers domain
     *   stringForm : optional, the string form of QuantifiedExpression
     * Return:
     *   an abstract form of QuantifiedExpression
     */
    var QuantifiedExpression = function( predicateFunction, expressionFunction,
					 domainArray, stringForm ) {
	//    var result = new SetExtension(); // JPJ
	var res = SetExtension();
	res.concrete = false;
	res.predicateFunction = predicateFunction;
	res.expressionFunction = expressionFunction;
	res.domainArray = domainArray;
	// test if the expression is finite
	res.finite = true;
	if (!(typeof domainArray === "undefined")) {
	    var i;
	    for ( i=0; i< domainArray.length; i++ ) {
		var d = domainArray[i];
		res.finite = res.finite && domainArray[i].isFinite();
	    }
	}
	// end of test
	res.stringForm = stringForm;
	res.type = prefix + ".QuantifiedExpression";
	res.__proto__ = QuantifiedExpression.prototype;
	return res;
    };

    QuantifiedExpression.prototype = Object.create(SetExtension.prototype,{
	constructor: {
	    configurable: true,
	    enumerable: true,
	    value: QuantifiedExpression,
	    writable: true},
	
	__toSetExtension : {
	    value: function() {
		if (this.finite === true ) {
		    var self = this,
			argArray = [],
			lastLevel = self.domainArray.length - 1;
		    var __getSetExtension = function(obj, nestLevel ) {
			if ( nestLevel === lastLevel ) { // the last quantifier domain
			    return self.domainArray[nestLevel].forEach( function( x ) {
				argArray[ nestLevel ] = x;
				if ( self.predicateFunction.apply( null, argArray ) ) {
				    obj.push( self.expressionFunction.apply(
					null, argArray ) );

				}
			    });
			} else {
			    return self.domainArray[nestLevel].forEach( function( x ) {
				argArray[ nestLevel ] = x;
				return __getSetExtension( obj, (nestLevel + 1) );
			    });
			}
		    };
		    __getSetExtension(this, 0 );
		    this.concrete = true;
    		    this.sort();
		    this.toSetExtension = function () {
			return this;
		    }
		}
	    },
	    writable: true},

	toLiteral : {value: function() {
            if ( this.concrete ) {
		return SetExtension.prototype.toLiteral.call( this );
            } else {
		var stringForm = this.stringForm ? this.stringForm : '';
		return ( this.type + "(" + this.predicateFunction + "," +
			 this.expressionFunction + ",[" +
			 this.domainArray.map( function(v){return v.toLiteral();} ).join(",") + "],'" +
			 stringForm + "')" );
            }
	},
		     writable: true},

	toString :{value: function() {
            if ( this.concrete ) {
		return SetExtension.prototype.toString.call( this );
            } else if ( this.stringForm ) {
		return this.stringForm;
            } else {
		return this.type + "(...)";
            }
	},
		   writable: true}

    });

    /* SetComprehension
     * Parameters:
     *   predicateFunction : a function
     *   expressionFunction : a function
     *   domainArray : an array contains all quantifiers domain
     *   stringForm : optional, the string form of set comprehension
     * Return:
     *   an abstract form of set comprehension
     */
    var SetComprehension = function( predicateFunction, expressionFunction,
				     domainArray, stringForm ) {
	var res = QuantifiedExpression(predicateFunction, expressionFunction,
				       domainArray, stringForm );
	res.type = prefix + ".SetComprehension";
	res.__proto__ = SetComprehension.prototype;
	return res;
    };

    SetComprehension.prototype = Object.create(QuantifiedExpression.prototype, {
	constructor: {
	    configurable: true,
	    enumerable: true,
	    value: SetComprehension,
	    writable: true
	},
	toSetExtension : {
	    value: function() {
		this.__toSetExtension();
		return this;
	    },
	    writable: true},

	functionImage :{
	    value:  function( /* arguments */ ) {
		var pair;
		if ( this.predicateFunction.apply( null, arguments ) ) {
		    pair = this.expressionFunction.apply( null, arguments );
		}
		if ( pair instanceof Pair ) {
		    return pair.right;
		}
	    },
	    writable: true},

	/* before JeB_08_16 filterDomainArray didn't exist */
	filterDomainArray :{
	    value:  function() {
		var da = this.domainArray.filter(this.predicateFunction);
		this.domainArray = da;
		return this;
	    },
	    writable: true},

	/* JPJ ajout de anyMember */
	anyMember :{
	    value: function(){
		var tempSetExtension = this.toSetExtension();
		return SetExtension.prototype.anyMember.call(this);
	    },
	    writable: true}
    });

    /* PowerSet
     * Parameters:
     *   S : a set
     * Return:
     *   a new PowerSet object
     */
    var PowerSet = function( S ) {
	var res = Set();
	res.S = S;
	res.finite = S.isFinite(); // addition finite
	res.__proto__ = PowerSet.prototype;
	return res;
    };

    PowerSet.prototype = Object.create(Set.prototype, {
	constructor: {
	    configurable: true,
	    enumerable: true,
	    value: PowerSet,
	    writable: true},

	contains : {
	    value: function( S ) {
		return subset( S, this.S );
	    },
	    writable: true},

	card :{
	    value: function() {
		if (this.S.isFinite()) {
		    return pow( TWO, this.S.card() );
		} else {
		    return 'NaN';
		}
	    },
	    writable: true},

	toSetExtension : {
	    value: function() {
		if (this.S.isFinite()) { // addition finite
		    var self = this;
//		    this.type = this.toLiteral();
//		    this.S = this.S;
		    /* before JeB_08_16 result.concrete = true; was a deadcode placed after the return statement */
		    this.concrete = true;
		    this.reduce( function( accumulator, element ) {
			return accumulator.concat( accumulator.map( function( S ) {
			    return S.concat( element );
			}));
		    }, this );
		    this.toSetExtension  = function() {
			return this;
		    }
		    return this;
		} else {
		    return Set();
		}
	    },
	    writable: true},

	toLiteral : {
	    value: function() {
		return prefix + ".PowerSet(" + this.S.toLiteral() + ")";
	    },
	    writable: true},

	toString : {
	    value: function() {
		return ( "\u2119(" + this.S.toString() + ")" );
	    },
	    writable: true}	
    });

    /* PowerSet1
     * Parameters:
     *   S : a set
     * Return:
     *   a new PowerSet1 object
     */
    var PowerSet1 = function( S ) {
	var res= PowerSet(S);
	res.__proto__ = PowerSet1.prototype;
	return res;
    };

    PowerSet1.prototype = Object.create(PowerSet.prototype, {
	constructor: {
	    configurable: true,
	    enumerable: true,
	    value: PowerSet1,
	    writable: true
	},
	card : {
	    value: function() {
		if (this.S.isFinite()) { // addition finite
		    return pred( pow( TWO, this.S.card() ) );
		} else {
		    return 'NaN';
		}
	    },
	    writable: true},

	toLiteral : {
	    value: function() {
		return prefix + ".PowerSet1(" + this.S.toLiteral() + ")";
	    },
	    writable: true},

	toString :{
	    value: function() {
		return ( "\u2119\u0031(" + this.S.toString() + ")" );
	    },
	    writable: true},
	toSetExtension: {
	    value: function () {
		PowerSet.prototype.toSetExtension.call(this);
		var i = this.indexOf(EmptySet);
		if (i != -1) {
		    this.splice(1,1);
		}
		this.toSetExtension = function() {
		    return this;
		}
		return this;
	    },
	    writable: true}
    });

    /* CartesianProduct
     * Parameters:
     *   S : a set
     * Return:
     *   a new CartesianProduct object
     */
    var CartesianProduct = function( S, T ) {
	//    var obj = {};
	var res = Set();
	res.S = S;
	res.T = T;
	res.dom = S;
	res.ran = T;
	res.finite = S.isFinite() && T.isFinite(); // addition finite
	res.concrete = false;
	res.__proto__ = CartesianProduct.prototype;
// Ajout JPJ 05/2022	
	if (res.finite) {
	    res.toSetExtension();
	}
	return res;
    };

    
    CartesianProduct.prototype = Object.create(Set.prototype, {
	constructor: {
	    configurable: true,
	    enumerable: true,
	    value: CartesianProduct,
	    writable: true },

	card :{
	    value: function() {
		return multiply( this.S.card(), this.T.card() );
	    },
	    writable: true},

	contains :{
	    value: function( pair ) {
		if (pair instanceof Pair) {
		    return ( this.S.contains( pair.left )
			     && this.T.contains( pair.right ) );
		} else {
		    return false;
		}
	    },
	    writable: true},

	forEach : {
	    value: function( func ) {
		var self = this;
		self.S.forEach( function( left ) {
		    self.T.forEach( function( right ) {
			func.call( self,  Pair( left, right ) );
		    });
		});
	    },
	    writable: true},

	every :{
	    value: function( func ) {
		var self = this;
		return self.S.every( function( left ) {
		    return self.T.every( function( right ) {
			return func.call( self, Pair ( left, right ) );
		    });
		});
	    },
	    writable: true},

	anyMember :{
	    value: function() {
		return  Pair( this.S.anyMember(), this.T.anyMember() );
	    },
	    writable: true},

// modificaiton JPJ 05/2022 (pb avec this)
	toSetExtension :{
	    value: function() {
		var   domain;
		var self = this;
		if (self.finite) { // addition finite
		    domain = self.dom.concrete ? self.dom : self.dom.toSetExtension();
		    domain.forEach( function( left ) {
			var range = self.ran.concrete ? self.ran : self.ran.toSetExtension();
			range.forEach( function( right ) {
			    self.push(  Pair( left, right ) );
			},self);
		    }, self);
		    self.concrete = true;
		    self.sort();
		    self.toSetExtension = function() {
			return self;
		    };
		    return self;
		} else {
		    self.concrete = false;
		    return self;
		}
	    },
	    writable: true},

	toLiteral :{
	    value: function() {
		return prefix + ".CartesianProduct(" + this.S.toLiteral() + "," +
		    this.T.toLiteral() + ")";
	    },
	    writable: true},

	toString :{
	    value: function() {
		return ( this.S.toString() + " \u00D7 " + this.T.toString() );
	    },
	    writable: true}
    });

    /* UpTo
     * Parameters:
     *   low  : the low bound Integer object
     *   high : the high bound Integer object
     * Return:
     *   an abstract set representation of Integer objects
     *   with bound [low, high]
     */
    var UpTo = function( low, high ) {
	var res = Set();
	res.low = new Integer( low ); // JPJ
	res.high = new Integer( high ); // JPJ
	res.finite = true;
	res.__proto__ = UpTo.prototype;
	return res;
    };

    UpTo.prototype = Object.create(Set.prototype, {

	constructor : {
	    configurable: true,
	    enumerable: true,
	    value: UpTo,
	    writable: true
	},

	card : {
	    value: function() {
		return succ( minus( this.high, this.low ) );
	    },
	    writable: true},

	contains : {
	    value: function( e ) {
		e = Integer( e );
		return ( e !== /* before JeB_08_16 != */ undefined &&
			 greaterEqual( e, this.low ) &&
			 lessEqual( e, this.high ) ? true : false );
	    },
	    writable: true},

	includes :{
	    value: function( S ) {
		return (  S.toLiteral() === this.toLiteral() ? true : false );
	    },
	    writable: true},

	forEach :{
	    value: function( func ) {
		var iterator = this.low;
		while ( lessEqual( iterator, this.high ) ) {
		    func( iterator );
		    iterator = succ( iterator );
		}
	    },
	    writable: true},

	every :{
	    value: function( func ) {
		var iterator = this.low,
		    result = true;
		while ( result && lessEqual( iterator, this.high ) ) {
		    result = func( iterator );
		    iterator = succ( iterator );
		}
		return result;
	    },
	    writable: true},

	some : {
	    value: function( func ) {
		var iterator = this.low,
		    result = false;
		while ( !result && lessEqual( iterator, this.high ) ) {
		    result = func( iterator );
		    iterator = succ( iterator );
		}
		return result;
	    },
	    writable: true},

	anyMember :{
	    value: function() {
		var range = plus( minus( this.high, this.low ), ONE ),
		    mod = 10000000000000000; // 10^16
		return plus( BigInteger( mod * Math.random() ).
			     multiply( range ).divide( mod ), this.low );
	    },
	    writable: true},

	toSetExtension :{
	    value: function() {
		var  iterator = this.low;
		while ( lessEqual( iterator, this.high ) ) {
		    this.push( iterator );
		    iterator = succ( iterator );
		}
		this.sort();
		this.concrete = true;
		this.toSetExtension = function() {
		    return this;
		}
		return this;
	    },
	    writable: true},

	toLiteral :{
	    value: function() {
		return ( prefix + ".UpTo(" + this.low.toLiteral() + "," +
			 this.high.toLiteral() + ")" );
	    },
	    writable: true},

	toString : {
	    value: function() {
		return ( this.low + " \u2025 " + this.high );
	    },
	    writable: true}
    });

    /* EmptySet
     * a constant set contains no elements
     */
    var EmptySet = SetExtension();// JPJ


    /* BOOL
     * a constant set contains exact two elements true and false
     */
    var BOOL = SetExtension( true, false );
    
    jeb.util.extend( BOOL, {
	toLiteral : function() {
            return prefix + ".BOOL";
	},

	toString : function() {
            return "BOOL";
	},
    });

    /* INTEGER
     * a constant set contains all Integer objects
     */
    var INTEGER = Set();

    jeb.util.extend(INTEGER, {
	finite: false,
	concrete: false,
	
	card : function() {
	    return "NaN";
	},

	contains : function( e ) {
            return ( isInteger( e ));
	},

	includes : function( S ) {
            return ( S.toLiteral() === this.toLiteral.toLiteral() );
	},

	anyMember : function() {
            return UpTo( MIN_ENUMERATED_VALUE, MAX_ENUMERATED_VALUE ).anyMember();
	},

	forEach : function( func ) {
            return UpTo( MIN_ENUMERATED_VALUE, MAX_ENUMERATED_VALUE  ).forEach( func );
	},

	every : function( func ) {
            return UpTo( MIN_ENUMERATED_VALUE, MAX_ENUMERATED_VALUE  ).every( func );
	},

	some : function( func ) {
            return UpTo( MIN_ENUMERATED_VALUE, MAX_ENUMERATED_VALUE  ).some( func );
	},

	toLiteral : function() {
            return prefix + ".INTEGER";
	},

	toString : function() {
            return "\u2124";
	}

    });

    /* NATURAL
     * a constant set contains all natural Integer objects
     */
    var NATURAL = Set();

    jeb.util.extend(NATURAL, {
	finite : false,
	concrete: false,

	card : function() {
	    return "NaN";
	},

	contains : function( e ) {
            e = Integer( e );
            return ( e !== /* before JeB_08_16 != */ undefined &&
		     greaterEqual( e, ZERO ) );
	    
	},

	includes : function( S ) {
            return ( S.toLiteral() === this.toLiteral.toLiteral());
	},

	anyMember : function() {
            return UpTo( ZERO, MAX_ENUMERATED_VALUE ).anyMember();
	},

	forEach : function( func ) {
            return UpTo( ZERO, MAX_ENUMERATED_VALUE  ).forEach( func );
	},

	every : function( func ) {
            return UpTo( ZERO, MAX_ENUMERATED_VALUE  ).every( func );
	},

	some : function( func ) {
            return UpTo( ZERO, MAX_ENUMERATED_VALUE  ).some( func );
	},

	toLiteral : function() {
            return prefix + ".NATURAL";
	},

	toString : function() {
            return "\u2115";
	}
    });

    /* NATURAL1
     * a constant set contains all positives Integer objects
     */
    var NATURAL1 = Set();

    jeb.util.extend(NATURAL1, {
	finite : false,
	concrete: false,
	
	card : function() {
	    return "NaN";
	},

	contains : function( e ) {
            e = Integer( e );
            return ( e !== /* before JeB_08_16 != */ undefined &&
		     greaterEqual( e, ONE ) );
	},

	includes : function( S ) {
            return ( S.toLiteral() === this.toLiteral.toLiteral());
	},

	anyMember : function() {
            return UpTo( ONE, MAX_ENUMERATED_VALUE ).anyMember();
	},

	forEach : function( func ) {
            return UpTo( ONE, MAX_ENUMERATED_VALUE ).forEach( func );
	},

	every : function( func ) {
            return UpTo( ONE, MAX_ENUMERATED_VALUE ).every( func );
	},

	some : function( func ) {
            return UpTo( ONE, MAX_ENUMERATED_VALUE ).some( func );
	},

	toLiteral : function() {
            return prefix + ".NATURAL1";
	},

	toString : function() {
            return "\u2115\u0031";
	}
    });

    /* setMinus
     * Parameters:
     *   S, T : two sets
     * Return:
     *   a new SetExtension
     */
    var setMinus = function( S, T ) {
	var setA = jeb.util.clone( S ),
            setB = jeb.util.clone( T ),
            index = 0,
            elementOfSetB;
	setA = ( setA.concrete ? setA : setA.toSetExtension() );
	setB = ( setB.concrete ? setB : setB.toSetExtension() );

	while ( setB.length > 0 ) {
            elementOfSetB = setB.pop();
            index = setA.indexOf( elementOfSetB );
            if ( index !== -1 ) { // setA contains elementOfSetB, remove it
		setA.splice( index, 1 );
            }
	}
	return setA;
    };

    
    /* setUnion
     * Parameters:
     *   a list of sets
     * Return:
     *   a new SetExtension
     */
    var setUnion = function( /* setList */ ) {
	var setListArray = [].slice.call( arguments, 0 ),
            setA, setB, elementOfSetB;
	setListArray = setListArray.map( function( s ) {
            return s.concrete ? s : s.toSetExtension();
	});
	// smaller set first
	setListArray.sort( function( a, b ) {
            return a.length - b.length;
	});
	setA = SetExtension(); // ajout pour typer correctement; // JPJ
	
	setListArray.shift().forEach (function(e) {setA.push(e);});
	while ( setListArray.length > 0 ) {
            setB = jeb.util.clone( setListArray.shift() );
            while ( setB.length > 0 ) {
		elementOfSetB = setB.pop();
		if ( !setA.contains( elementOfSetB ) ) {
                    setA.push( elementOfSetB );
		}
            }
	}
	return setA.sort();
    };

    /* setInter
     * Parameters:
     *   a list of sets
     * Return:
     *   a new SetExtension
     */
    var setInter = function( /* setList */ ) {
	var setListArray = [].slice.call( arguments, 0 ),
            setA, elementOfSetA, isMemberOfAllSets, i, len,
            result = SetExtension(); // JPJ
	setListArray = setListArray.map( function( s ) {
            return s.concrete ? s : s.toSetExtension();
	});
	// smaller set first
	setListArray.sort( function( a, b ) {
            return a.length - b.length;
	});
	setA = jeb.util.clone( setListArray.shift() );
	while ( setA.length > 0 ) {
            elementOfSetA = setA.pop();
            isMemberOfAllSets = true;
            for ( i = 0, len = setListArray.length; i < len && isMemberOfAllSets;
		  i++ ) {
		if ( !setListArray[i].contains( elementOfSetA ) ) {
                    isMemberOfAllSets = false;
		}
            }
            if ( isMemberOfAllSets ) {
		result.push( elementOfSetA );
            }
	}
	return result.sort();
    };

    /* union
     * Parameters:
     *   U : a set of list of sets, U.length > 0
     * Return:
     *   a new SetExtension
     */
    var union = function( U ) {
	return setUnion.apply(null, U);
    };

    /* inter
     * Parameters:
     *   U : a set of list of sets, U.length > 0
     * Return:
     *   a new set
     */
    var inter = function( U ) {
	return setInter.apply(null, U);
    };

    /* quantifiedUnion
     * Parameters:
     *   predicateFunction : a function
     *   expressionFunction : a function
     *   domainArray : an array contains all quantifiers domain
     *   stringForm : optional, the string form of quantifiedUnion

     * Return:
     *   an abstract form of quantifiedUnion
     */
    var quantifiedUnion = function( predicateFunction, expressionFunction,
				    domainArray, stringForm ) {
	var res = QuantifiedExpression( predicateFunction, expressionFunction,
					domainArray, stringForm);
	res.type = prefix + ".quantifiedUnion";
	res.__proto__ = quantifiedUnion.prototype;
	return res;
    };

    quantifiedUnion.prototype = Object.create(QuantifiedExpression.prototype, {
	constructor: {
	    configurable: true,
	    enumerable: true,
	    value: quantifiedUnion,
	    writable: true
	},
	toSetExtension : {
	    value: function() {
		var tempSetExtension = this.__toSetExtension();
		tempSetExtension = setUnion.apply( null, tempSetExtension );
		jeb.util.extend( this, tempSetExtension );
		return this.sort();
	    },
	    writable: true}
    });

    /* quantifiedInter
     * Parameters:
     *   predicateFunction : a function
     *   expressionFunction : a function
     *   domainArray : an array contains all quantifiers domain
     *   stringForm : optional, the string form of quantifiedInter
     * Return:
     *   an abstract form of quantifiedInter
     */
    var quantifiedInter = function( predicateFunction, expressionFunction,
				    domainArray, stringForm ) {
	var res = QuantifiedExpression( predicateFunction, expressionFunction,
					domainArray, stringForm);
	res.type = prefix + ".quantifiedInter";
	res.__proto__ = quantifiedInter.prototype;
	return res;
    };

    quantifiedInter.prototype = Object.create(QuantifiedExpression.prototype, {
	constructor: {
	    configurable: true,
	    enumerable: true,
	    value: quantifiedInter,
	    writable: true
	},
	
	toSetExtension : {
	    value: function() {
		var tempSetExtension = this.__toSetExtension();
		tempSetExtension = setInter.apply( null, tempSetExtension );
		jeb.util.extend( this, tempSetExtension );
		return this.sort();
	    },
	    writable: true}
    });
    

    /* card
     * Parameters:
     *   S : a finite set
     * Return:
     *   the cardinality of S
     */
    var card = function( S ) {
	//    if ( typeof S === "object" || typeof S === "function" && S.card ) {
	if (S instanceof Set || S instanceof Function) {
//	    S = S.concrete ? S : S.toSetExtension();
	    return S.card();
	}
	return "NaN";
    };

    /* min
     * Parameters:
     *   S : a set extension of Integer objects
     * Return:
     *   the minimum Integer object of S or undefined
     */
    var min = function( S ) {
	var result, i, len;
	if ( S instanceof Set && S.length > 0  ) {
            S = S.map( function(e){return Integer(e);} );
            if ( S.every( function(e){return e instanceof Integer;} ) ) {
		result = S[0];
		for ( i = 1, len = S.length; i < len; i++) {
                    if ( lessThan( S[i], result ) ) {
			result = S[i];
                    }
		}
            }
	}
	return result;
    };

    /* max
     * Parameters:
     *   S : a set extension of Integer objects
     * Return:
     *   the maximum Integer object of S or undefined
     */
    var max = function( S ) {
	var result, i, len;
	if ( S instanceof Set && S.length > 0  ) {
            S = S.map( function(e){return Integer(e);} );
            if ( S.every( function(e){return e instanceof Integer;} ) ) {
		result = S[0];
		for ( i = 1, len = S.length; i < len; i++) {
                    if ( greaterThan( S[i], result ) ) {
			result = S[i];
                    }
		}
            }
	}
	return result;
    };

    /* belong
     * Parameters:
     *   E : an element
     *   S : a set
     * Return:
     *   a boolean value
     */
    var belong = function( E, S ) {
	return S.contains( E );
    };

    /* notBelong
     * Parameters:
     *   E : an element
     *   S : a set
     * Return:
     *   a boolean value
     */
    var notBelong = function( E, S ) {
	return !S.contains( E );
    };

    /* properSubset
     * Parameters:
     *   S, T : two sets
     * Return:
     *   a boolean value
     */
    var properSubset = function( S, T ) {
	return subset( S, T ) && !equal( S, T );
    };

    /* notProperSubset
     * Parameters:
     *   S, T : two sets
     * Return:
     *   a boolean value
     */
    var notProperSubset = function( S, T ) {
	return !properSubset( S, T );
    };

    /* subset
     * Parameters:
     *   S, T : two sets
     * Return:
     *   a boolean value
     */
    var subset = function( S, T ) {
	return S.every( function( e ) {
            return T.contains( e );
	});
    };

    /* notSubset
     * Parameters:
     *   S, T : two sets
     * Return:
     *   a boolean value
     */
    var notSubset = function( S, T ) {
	return !subset( S, T );
    };

    /* finite
     * Parameters:
     *   S : a set
     * Return:
     *   a boolean value
     */
    var finite = function( S ) {
	return S.finite;
    };

    /* partition
     * Parameters:
     *   a list of sets
     * Return:
     *   a boolean value
     */
    var partition = function( S /* setList */ ) {
	var setListArray = [].slice.call( arguments, 1 ),
            result, i, j, len1, len2;
	if ( setListArray.length === 0 ) {
            return equal( S, EmptySet );
	} else if ( setListArray.length === 1 ) {
            return equal( S, setListArray[0] );
	} else {
            result = equal( S, setUnion.apply(null,
					      setListArray ) );
            for ( i = 0, len1 = setListArray.length; i < len1; i++ ) {
		for ( j = i + 1, len2 = setListArray.length; j < len2; j++ ) {
                    result = result && equal( EmptySet,
					      setInter( setListArray[i], setListArray[j] ) );
                    if ( !result ) {
			break;
                    }
		}
            }
	}
	return result;
    };

    /* Relations
     * Parameters:
     *   S, T : two sets
     * Return:
     *   a new Relations object
     */
    var Relations = function( S, T ) {
	var res = Set();
	if (typeof S !== "undefined" && typeof T !== "undefined") {
	    res.S = S;
	    res.T = T;
	    res.dom = S;
	    res.ran = T;
	    res.finite = S.isFinite() && T.isFinite(); // addition finite
	} else {
	    res.concrete = false;
	    res.finite = true;
	}
	res.__proto__ = Relations.prototype;
	return res;
    };

    
    Relations.prototype = Object.create(Set.prototype, {
	constructor: {
	    configurable: true,
	    enumerable: true,
	    value: Relations,
	    writable: true
	},
	contains : {
	    value: function( relation ) {
		var self = this;
		if ( equal( relation, EmptySet) ) {
		    return true;
		}
		if ( !relation.concrete) {
		    if( !relation.isFinite()) {
			return (subset(dom(relation), this.S) && subset(ran(relation), this.T))
		    } else {
			relation.toSetExtension();
		    }
		}
		return relation.every( function( pair ) {
                    return self.S.contains( pair.left ) &&
			self.T.contains( pair.right );
		});
	    },
	    writable: true},

	toLiteral : {
	    value: function() {
		return prefix + ".Relations(" + this.S.toLiteral() + "," +
		    this.T.toLiteral() + ")";
	    },
	    writable: true},

	toString :{
	    value: function() {
		return ( this.S.toString() + " \u2194 " + this.T.toString() );
	    },
	    writable: true}
    });

    /* TotalRelations
     * Parameters:
     *   S, T : two sets
     * Return:
     *   a new TotalRelations object
     */
    var TotalRelations = function( S, T ) {
	var res = Relations( S, T );
	res.dom = S;
	res.__proto__ = TotalRelations.prototype;
	return res;
    };

    
    TotalRelations.prototype = Object.create(Relations.prototype, {
	constructor: {
	    configurable: true,
	    enumerable: true,
	    value: TotalRelations,
	    writable: true },

	toLiteral : {
	    value: function() {
		return prefix + ".TotalRelations(" + this.S.toLiteral() + "," +
		    this.T.toLiteral() + ")";
	    },
	    writable: true},

	toString : {
	    value: function() {
		return ( this.S.toString() + " \ue100 " + this.T.toString() );
	    },
	    writable: true},

	// contains: function (relation) {
	//     var self = this;
        //     if ( equal( relation, EmptySet) ) {
	// 	return true;
        //     } else {
	// 	if ( !relation.concrete && relation.isFinite()) {
        //             relation.toSetExtension();
	// 	}
	// 	return relation.every( function( pair ) {
        //             return self.S.contains( pair.left ) &&
	// 		self.T.contains( pair.right );
	// 	}) && equal(this.S, dom(relation));
        //     }
	// }
	contains:{value: function(relation) {
	    return Relations.prototype.contains.call(this,relation)? equal(this.S, dom(relation)): false;
	}}
    });

    /* SurjectiveRelations
     * Parameters:
     *   S, T : two sets
     * Return:
     *   a new SurjectiveRelations object
     */
    var SurjectiveRelations = function( S, T ) {
	var res = Relations( S, T );
	res.ran = T;
	res.__proto__ = SurjectiveRelations.prototype;
	return res;
    };

    SurjectiveRelations.prototype = Object.create( Relations.prototype,{
	constructor: {
	    configurable: true,
	    enumerable: true,
	    value: SurjectiveRelations,
	    writable: true
	},

	toLiteral :{
	    value: function() {
		return prefix + ".SurjectiveRelations(" + this.S.toLiteral() + "," +
		    this.T.toLiteral() + ")";
	    },
	    writable: true},

	toString : {
	    value:function() {
		return ( this.S.toString() + " \ue101 " + this.T.toString() );
	    },
	    writable: true},
	
	// contains: function (relation) {
	// 	var self = this;
	//     if ( equal( relation, EmptySet) ) {
	//         return true;
	//     } else {
	//         if ( !relation.concrete && relation.isFinite()) {
	//             relation.toSetExtension();
	//         }
	//         return relation.every( function( pair ) {
	//             return self.S.contains( pair.left ) &&
	//                 self.T.contains( pair.right );
	//         }) && equal(this.T, ran(relation));
	//     }
	// }
	contains:  {
	    value: function(relation) {
		return Relations.prototype.contains.call(this,relation)? equal(this.T, ran(relation)): false;
	    },
	    writable: true}
    });

    /* TotalSurjectiveRelations
     * Parameters:
     *   S, T : two sets
     * Return:
     *   a new TotalSurjectiveRelations object
     */
    var TotalSurjectiveRelations = function( S, T ) {
	var res = TotalRelations(S, T ); // JPJ
	res.ran = T;
	res.__proto__ = TotalSurjectiveRelations.prototype;
	return res;
    };

    TotalSurjectiveRelations.prototype = Object.create(TotalRelations.prototype, {
	constructor: {
	    configurable: true,
	    enumerable: true,
	    value: TotalSurjectiveRelations,
	    writable: true
	},

	toLiteral : {
	    value: function() {
		return prefix + ".TotalSurjectiveRelations(" + this.S.toLiteral() + "," +
		    this.T.toLiteral() + ")";
	    },
	    writable: true},

	toString :{
	    value:  function() {
		return ( this.S.toString() + " \ue102 " + this.T.toString() );
	    },
	    writable: true},

	// 	contains: function (relation) {
	// 	var self = this;
	//     if ( equal( relation, EmptySet) ) {
	//         return true;
	//     } else {
	//         if ( !relation.concrete && relation.isFinite()) {
	//             relation.toSetExtension();
	//         }
	//         return relation.every( function( pair ) {
	//             return self.S.contains( pair.left ) &&
	//                 self.T.contains( pair.right );
	//         }) && equal(this.T, ran(relation)) && equal(this.S, dom(relation));
	//     }
	// }
	contains : {
	    value: function() {
		return TotalRelations.prototype.contains.call(this,relation)? equal(this.T, ran(relation)): false;
	    },
	    writable: true}
    });

    /* dom
     * Parameters:
     *   r : a relation
     * Return:
     *   a new SetExtension
     */
    var dom = function( r ) {
	var result = SetExtension(); // JPJ
	if ( equal( r, EmptySet ) ) {
            return EmptySet;
	} else {
	    if ( r.dom ) {
		return r.dom;
	    } else {
		r.forEach( function( pair ) {
		    if ( notBelong( pair.left, result ) ) {
			result.push( pair.left );
		    }
		});
		return result.sort();
	    }
	}
    };

    /* ran
     * Parameters:
     *   r : a relation
     * Return:
     *   a new SetExtension
     */
    var ran = function( r ) {
	var result = SetExtension(); //JPJ
	if ( r.ran ) {
            return r.ran;
	} else if ( equal( r, EmptySet ) ) {
            return EmptySet;
	} else {
            r.forEach( function( pair ) {
		if ( notBelong( pair.right, result ) ) {
                    result.push( pair.right );
		}
            });
            return result.sort();
	}
    };

    /* relationImage
     * Parameters:
     *   r : a relation object
     *   S : a set
     * Return:
     *   the image of E defined by f
     */
    var relationImage = function( r, S ) {
	S = S.concrete ? S : S.toSetExtension();
	var result = SetExtension();
	r.forEach( function( pair ) {
            if ( belong( pair.left, S ) &&
		 notBelong( pair.right, result ) ) {
		result.push( pair.right );
            }
	});
	return result;
    };

    /* domainRestriction
     * Parameters:
     *   S : a set
     *   r : a relation
     * Return:
     *   a new relation
     */
    var domainRestriction = function( S, r ) {
	S = S.concrete ? S : S.toSetExtension();
	var resultArray = r.filter( function( pair ) {
            return S.contains( pair.left );
	});
	return SetExtension.apply( null, resultArray );
    };

    /* domainSubtraction
     * Parameters:
     *   S : a set
     *   r : a relation
     * Return:
     *   a new relation
     */
    var domainSubtraction = function( S, r ) {
	S = S.concrete ? S : S.toSetExtension();
	var resultArray = r.filter( function( pair ) {
            return !S.contains( pair.left );
	});
	return SetExtension.apply( null, resultArray );
    };

    /* rangeRestriction
     * Parameters:
     *   r : a relation
     *   T : a set
     * Return:
     *   a new relation
     */
    var rangeRestriction = function( r, T ) {
	T = T.concrete ? T : T.toSetExtension();
	var resultArray = r.filter( function( pair ) {
            return T.contains( pair.right );
	});
	return SetExtension.apply( null, resultArray );
    };

    /* rangeSubtraction
     * Parameters:
     *   r : a relation
     *   T : a set
     * Return:
     *   a new relation
     */
    var rangeSubtraction = function( r, T ) {
	T = T.concrete ? T : T.toSetExtension();
	var resultArray = r.filter( function( pair ) {
            return !T.contains( pair.right );
	});
	return SetExtension.apply( null, resultArray );
    };

    /* backwardComposition
     * Parameters:
     *   a list of relations
     * Return:
     *   a new relation
     */
    var backwardComposition = function( /* relationList */ ) {
	var relationListArray = [].slice.call( arguments, 0 );
        relationListArray.reverse();
	return forwardComposition.apply( null, relationListArray );
    };

    /* forwardComposition
     * Parameters:
     *   a list of relations
     * Return:
     *   a new relation
     */
    var forwardComposition = function( /* relationList */ ) {
	var relationListArray = [].slice.call( arguments, 0 ),
            relationA, relationB, elementA, i, len,
            result = SetExtension();  // JPJ a regarder attentivement pour le typage ...
	while ( relationListArray.length > 1 ) {
            relationA = jeb.util.clone( relationListArray.shift() );
            relationB = jeb.util.clone( relationListArray.shift() );
            result.length = 0;
            while ( relationA.length > 0 ) {
		elementA = relationA.shift();
		for ( i = 0, len = relationB.length; i < len; i++ ) {
                    if ( equal( elementA.right, relationB[i].left ) ) {
			pair =  Pair( elementA.left, relationB[i].right );
			if ( !result.contains( pair) ) {
                            result.push( pair );
			}
                    }
		}
            }
            relationListArray.unshift( result );
	}
	return result.sort();
    };

    /* override
     * Parameters:
     *   a list of relations
     * Return:
     *   a new relation
     */
    var override = function( /* relationList */ ) {
	var relationListArray = [].slice.call( arguments, 0 ),
            relationA, relationB,
            result = SetExtension();  // JPJ a regarder pour le typage
	relationListArray = relationListArray.map( function( s ) {
            return s.concrete ? s : s.toSetExtension();
	});
	while ( relationListArray.length > 1 ) {
	    var ss = relationListArray[0];
	    var ins = ss instanceof Set; 
            relationA = jeb.util.clone( relationListArray.shift() );
            relationB = relationListArray.shift();
//            result.length = 0;
            result = setUnion( relationB, domainSubtraction(
                dom(relationB), relationA ) );
            relationListArray.unshift( result );
	}
	return result.sort();
    };

    /* directProduct
     * Parameters:
     *   r1, r2 : two relations
     * Return:
     *   a new relation
     */
    var directProduct = function( r1, r2 ) {
	var setA, elementOfSetA, i, len, pair,
            result = SetExtension();  // JPJ a regarder pour le typage
	setA = jeb.util.clone( r1 );
	while ( setA.length > 0 ) {
            elementOfSetA = setA.shift();
            for ( i = 0, len = r2.length; i < len; i++ ) {
		if ( equal( elementOfSetA.left, r2[i].left ) ) {
                    pair =  Pair( elementOfSetA.left,
				  Pair( elementOfSetA.right, r2[i].right ) );
                    if ( !result.contains( pair) ) {
			result.push( pair );
                    }
		}
            }
	}
	return result.sort();
    };

    /* parallelProduct
     * Parameters:
     *   r1, r2 : two relations
     * Return:
     *   a new relation
     */
    var parallelProduct = function( r1, r2 ) {
	var setA, elementOfSetA, i, len1, len2, pair,
            result = SetExtension();   // JPJ a regarder pour le typage
	for ( i = 0, len1 = r1.length; i < len1; i++ ) {
            for ( j = 0, len2 = r2.length; j < len2; j++ ) {
		pair =  Pair(  Pair( r1[i].left, r2[j].left ),
			       Pair( r1[i].right, r2[j].right ) );
		result.push( pair );
            }
	}
	return result.sort();
    };

    /* converse
     * Parameters:
     *   r : a relation
     * Return:
     *   a new relation
     */
    var converse = function( r ) {
	var result = SetExtension(); // JPJ
	r.forEach( function( pair ) {
            result.push( Pair( pair.right, pair.left ) );
	});
	return result.sort();
    };

    /* PartialFunctions
     * Parameters:
     *   S, T : two sets
     * Return:
     *   a new PartialFunctions object
     */
    var PartialFunctions = function( S, T ) {
	var res = Relations( S, T ); // JPJ
	res.__proto__ = PartialFunctions.prototype;
	return res;
    };

    PartialFunctions.prototype = Object.create(Relations.prototype, {
	constructor: {
	    configurable: true,
	    enumerable: true,
	    value: PartialFunctions,
	    writable: true
	},

	toLiteral : {
	    value: function() {
		return prefix + ".PartialFunctions(" + this.S.toLiteral() + "," +
		    this.T.toLiteral() + ")";
	    },
	    writable: true},
	
	toString :  {
	    value: function() {
		return ( this.S.toString() + " \u21f8 " + this.T.toString() );
	    },
	    writable: true},
	contains:{
	    value: function(f) {
		if (Relations.prototype.contains.call(this,f)) {
		    var cd= card(dom(f));
		    var cf = card(f);
		    return equal(cd,cf);
		} else {
		    return false;
		}
	    },
	    writable: true}
    });

    /* TotalFunctions
     * Parameters:
     *   S, T : two sets
     * Return:
     *   a new TotalFunctions object
     */
    var TotalFunctions = function( S, T ) {
	var res = PartialFunctions(S, T ); // JPJ
	res.dom = S;
	res.__proto__ = TotalFunctions.prototype;
	return res
    };

    TotalFunctions.prototype = Object.create(PartialFunctions.prototype,{
	constructor: {
	    configurable: true,
	    enumerable: true,
	    value: TotalFunctions,
	    writable: true
	},

	makeSetExtension : {
	    value: function( functionImage ) {
		var result = SetExtension(); // JPJ
		result.type = this.toLiteral();
		result.dom = this.dom;
		result.T = this.T;
		if ( typeof functionImage === "function" ) {
		    this.S.forEach( function( e ) {
			result.push(  Pair( e, functionImage(e) ) );
		    });
		}
		return result.sort();
	    },
	    writable: true},

	// contains : function( func ) {
        //     if ( func.concrete ) {
	// 	return Relations.prototype.contains.call( this, func );
        //     } else if ( func.dom ) {
	// 	return equal( this.dom, func.dom ) &&
        //             subset( func.T, this.T );
        //     } else if ( func.toSetExtension ) {
	// 	return Relations.prototype.contains.call( this,
	// 						  func.toSetExtension() );
        //     }
	// },

	contains: {
	    value: function(f) {
		return PartialFunctions.prototype.contains.call(this,f) &&
		    equal(dom(f), this.dom);
	    },
	    writable: true},
	anyMember :{
	    value: function() {
		var self = this,
		    func = function( e ) { return self.T.anyMember(); /* before JeB_08_16 no semicolon */ };
		return this.makeSetExtension( func );
	    },
	    writable: true},

	toLiteral : {
	    value: function() {
		return prefix + ".TotalFunctions(" + this.S.toLiteral() + "," +
		    this.T.toLiteral() + ")";
	    },
	    writable: true},

	toString :{
	    value: function() {
		return ( this.S.toString() + " \u2192 " + this.T.toString() );
	    },
	    writable: true}
    });

    /* PartialInjections
     * Parameters:
     *   S, T : two sets
     * Return:
     *   a new PartialInjections object
     */
    var PartialInjections = function( S, T ) {
	var res = PartialFunctions( S, T ); // JPJ
	res.__proto__ = PartialFunctions.prototype;
	return res
    };

    PartialInjections.prototype = Object.create( PartialFunctions.prototype, {
	constructor: {
	    configurable: true,
	    enumerable: true,
	    value: PartialInjections,
	    writable: true
	},

	toLiteral :{
	    value: function() {
		return prefix + ".PartialInjections(" + this.S.toLiteral() + "," +
		    this.T.toLiteral() + ")";
	    },
	    writable: true},
	
	toString : {
	    value: function() {
		return ( this.S.toString() + " \u2914 " + this.T.toString() );
	    },
	    writable: true},
	
	contains: {
	    value: function(f) {
		if (PartialFunction.prototype.contains(this,f)) {
		    var cr = card(ran(f));
		    var cf = card(f);
		    return equal(cr, cf);
		} else {
		    return false;
		}
	    },
	    writable: true}
    });

    /* TotalInjections
     * Parameters:
     *   S, T : two sets
     * Return:
     *   a new TotalInjections object
     */
    var TotalInjections = function( S, T ) {
	var res = TotalFunctions( S, T ); // JPJ
	res.__proto__ = TotalFunctions.prototype;
	return res;
    };

    TotalInjections.prototype = Object.create(TotalFunctions.prototype, {
	constructor : {
	    configurable: true,
	    enumerable: true,
	    value: TotalInjections,
	    writable: true
	},

	toLiteral :{
	    value: function() {
		return prefix + ".TotalInjections(" + this.S.toLiteral() + "," + this.T.toLiteral() + ")";
	    },
	    writable: true},

	toString : {
	    value: function() {
		return ( this.S.toString() + " \u21a3 " + this.T.toString() );
	    },
	    writable: true},
	contains:{
	    value: function(f) {
		if (TotallFunction.prototype.contains(this,f)) {
		    var cr = card(ran(f));
		    var cf = card(f);
		    return equal(cr, cf);
		} else {
		    return false;
		}
	    },
	    writable: true}

    });

    /* PartialSurjections
     * Parameters:
     *   S, T : two sets
     * Return:
     *   a new PartialSurjections object
     */
    var PartialSurjections = function( S, T ) {
	var res = PartialFunctions(S, T ); // JPJ
	res.ran = T;
	res.__proto__ = PartialSurjections.prototype;
	return res;

    };

    PartialSurjections.prototype = Object.create(PartialFunctions.prototype, {
	constructor: {
	    configurable: true,
	    enumerable: true,
	    value: PartialSurjections,
	    writable: true
	},

	toLiteral : {
	    value: function() {
		return prefix + ".PartialSurjections(" + this.S.toLiteral() + "," +
		    this.T.toLiteral() + ")";
	    },
	    writable: true},

	toString : {
	    value: function() {
		return ( this.S.toString() + " \u2900 " + this.T.toString() );
	    },
	    writable: true},
	contains:{
	    value: function(f) {
		return PartialFunction.prototype.contains.call(this, f) &&
		    equal(this.ran, ran(f));
	    },
	    writable: true}
    });

    /* TotalSurjections
     * Parameters:
     *   S, T : two sets
     * Return:
     *   a new TotalSurjections object
     */
    var TotalSurjections = function( S, T ) {
	var res = PartialSurjections(S, T ); // JPJ
	res.ran = T;
	res.dom = S;
	res.__proto__ = TotalSurjections.prototype;
	return res;
    };

    TotalSurjections.prototype = Object.create(PartialSurjections.prototype, {
	constructor: {
	    configurable: true,
	    enumerable: true,
	    value: TotalSurjections,
	    writable: true
	},

	toLiteral :{
	    value:  function() {
		return prefix + ".TotalSurjections(" + this.S.toLiteral() + "," +
		    this.T.toLiteral() + ")";
	    },
	    writable: true},

	toString :{
	    value: function() {
		return ( this.S.toString() + " \u21a0 " + this.T.toString() );
	    },
	    writable: true},
	contains: {
	    value: function(f) {
		return PartialSurjections.prototype.contains.call(this, f) &&
		    equal(this.ran, ran(f));
	    },
	    writable: true}
    });

    /* TotalBijections
     * Parameters:
     *   S, T : two sets
     * Return:
     *   a new TotalBijections object
     */
    var TotalBijections = function( S, T ) {
	var res = TotalInjections(S, T ); // JPJ
	res.ran = T;
	res.__proto__ = TotalBijections.prototype;
	return res;
    };
    TotalBijections.prototype = Object.create(TotalInjections.prototype, {
	constructor: {
	    configurable: true,
	    enumerable: true,
	    value: TotalBijections,
	    writable: true
	},
	toLiteral : {
	    value: function() {
		return prefix + ".TotalBijections(" + this.S.toLiteral() + "," + this.T.toLiteral() + ")";
	    },
	    writable: true},

	toString : {
	    value: function() {
		return ( this.S.toString() + " \u2916 " + this.T.toString() );
	    },
	    writable: true},
	contains: {
	    value: function(f) {
		return TotalInjections.prototype.contains.call(this, f) &&
		    equal(this.ran, ran(f));
	    },
	    writable: true}
    });

    /* Lambda
     * Parameters:
     *   predicateFunction : a function
     *   expressionFunction : a function
     *   domainArray : an array contains all quantifiers domain
     *   stringForm : optional, the string form of lambda
     * Return:
     *   an abstract form of lambda
     */
    var Lambda = function( predicateFunction, expressionFunction,
			   domainArray, stringForm ) {
	var res = SetComprehension(predicateFuncton, expressionFunction,
				   domainArray, stringForm);
	res.type = prefix + ".Lambda";
	res.__proto__ = Lambda.prototype;
	return res;
    };

    Lambda.prototype = Object.create(SetComprehension.prototype,{
	constructor: {
	    configurable: true,
	    enumerable: true,
	    value: Lambda,
	    writable: true
	}});

    /* id
     * Parameters:
     *   object : a math object
     * Return:
     *   the same object
     */
    var id = function( object ) {
	return object;
    };

    /* prj1
     * Parameters:
     *   pair : a Pair
     * Return:
     *   the left part of pair
     */
    var prj1 = function( pair ) {
	return pair.left;
    };

    /* prj2
     * Parameters:
     *   pair : a Pair
     * Return:
     *   the right part of pair
     */
    var prj2 = function( pair ) {
	return pair.right;
    };

    /* functionImage
     * Parameters:
     *   f : a function object
     *   E : a expression
     * Return:
     *   the image of E defined by f
     */
    var functionImage = function( f, E ) {
	if (typeof f === "function") {
	    return f(E);
	}
	if ( !( typeof f === "object" ) ) {
            return;
	}
	if ( f.concrete ) { // case set extension
            return f.getImage( E );
	} else if ( f.functionImage ) { // case defined fImage
            if( E instanceof Pair ) {
		var argArray = [];
                E.toArguments( argArray );
		return f.functionImage.apply( null, argArray );
            } else {
		return f.functionImage( E );
            }
	}
    };


    /******************************************************************************
     * Event-B predicate
     ******************************************************************************/

    /* bTrue
     * Parameters:
     *   none
     * Return:
     *   true
     */
    var bTrue = function() {
	return true;
    };

    /* bFalse
     * Parameters:
     *   none
     * Return:
     *   false
     */
    var bFalse = function() {
	return false;
    };


    /* implication
     * Parameters:
     *   P, Q : two predicates
     * Return:
     *   a boolean value
     */
    var implication = function( P, Q ) {
	return !Boolean( P ) || Boolean( Q );
    };

    /* equivalence
     * Parameters:
     *   P, Q : two predicates
     * Return:
     *   a boolean value
     */
    var equivalence = function( P, Q ) {
	return Boolean( P ) === Boolean( Q );
    };

    /* and
     * Parameters:
     *   a list of predicates
     * Return:
     *   a boolean value
     */
    var and = function( /* predicateList */ ) {
	var argArray = [].slice.call( arguments, 0 ),
            i, len,
            result = Boolean( argArray[0] ) && Boolean( argArray[1] );
	for ( i = 2, len = argArray.length; result && i < len; i++ ) {
            result = Boolean( argArray[i] );
	}
	return result;
    };

    /* or
     * Parameters:
     *   a list of predicates
     * Return:
     *   a boolean value
     */
    var or = function( /* predicateList */ ) {
	var argArray = [].slice.call( arguments, 0 ),
            i, len,
            result = Boolean( argArray[0] ) || Boolean( argArray[1] );
	for ( i = 2, len = argArray.length; !result && i < len; i++ ) {
            result = Boolean( argArray[i] );
	}
	return result;
    };

    /* not
     * Parameters:
     *   P : a predicate
     * Return:
     *   a boolean value
     */
    var not = function( P ) {
	return !Boolean( P );
    };

    /* forAll
     * Parameters:
     *   predicateFunction : a function
     *   domainArray : an array contains all quantifiers domain
     * Return:
     *   a boolean value
     */
    var forAll = function( predicateFunction, domainArray ) {
	// argArray  : an array used to construct predicateFunction arguments
	var argArray = [],
            lastLevel = domainArray.length - 1;
	// nestLevel : the level of recursive call
	var check = function( nestLevel ) {
            if ( nestLevel === lastLevel ) { // the last quantifier domain
		return domainArray[ nestLevel ].every( function( x ) {
                    argArray[ nestLevel ] = x;
                    return predicateFunction.apply( null, argArray );
		});
            } else {
		return domainArray[ nestLevel ].every( function( x ) {
                    argArray[ nestLevel ] = x;
                    return check( nestLevel + 1 );
		});
            }
	};
	return check( 0 );
    };

    /* exists
     * Parameters:
     *   predicateFunction : a function
     *   domainArray : an array contains all quantifiers domain
     * Return:
     *   a boolean value
     */
    var exists = function( predicateFunction, domainArray ) {
	// argArray  : an array used to construct predicateFunction arguments
	var argArray = [],
            lastLevel = domainArray.length - 1;
	// nestLevel : the level of recursive call
	var check = function( nestLevel ) {
            if ( nestLevel === lastLevel ) { // the last quantifier domain
		return domainArray[ nestLevel ].some( function( x ) {
                    argArray[ nestLevel ] = x;
                    return predicateFunction.apply( null, argArray );
		});
            } else {
		return domainArray[ nestLevel ].some( function( x ) {
                    argArray[ nestLevel ] = x;
                    return check( nestLevel + 1 );
		});
            }
	};
	return check( 0 );
    };

    /* equal
     * Parameters:
     *   E, F : two same type math objects
     * Return:
     *   a boolean value
     */
    var equal = function( E, F ) {
	if (typeof E === "undefined" || typeof F === "undefined") {
	    return false;
	} else {
	    if (typeof E.equal === "function") {
		return E.equal(F);
	    } else {
		return (E.toString() === F.toString());
	    }
	}
    };

    /* notEqual
     * Parameters:
     *   E, F : two same type math objects
     * Return:
     *   a boolean value
     */
    var notEqual = function( E, F ) {
	return !equal( E, F );
    };

    /* bool
     * Parameters:
     *   P : a predicate
     * Return:
     *   the value of predicate
     */
    var bool = function( P ) {
	return Boolean(P);
    };

    /******************************************************************************
     * Event-B assignment
     ******************************************************************************/

    /* becomesEqualTo
     * Parameters:
     *   identifierArray : an array contains assigned identifiers
     *   expressionArray : an array contains expressions
     * Return:
     *   undefined
     */
    var becomesEqualTo = function( identifierArray, expressionArray ) {
	var i, len;
	for ( i = 0, len = identifierArray.length; i < len; i++ ) {
            identifierArray[i]._value = expressionArray[i];
	}
    };

    /* becomesMemberOf
     * Parameters:
     *   x : an assigned identifier
     *   E : a set expression
     * Return:
     *   undefined
     */
    var becomesMemberOf = function( x, E ) {
	x._value = E.anyMember();
    };

    /* becomesSuchThat
     * Parameters:
     *   identifierArray : an array contains assigned variables
     *   predicateFunction : a function
     *   domainArray : an array contains all identifiers domain
     * Return:
     *   undefined
     */
    var becomesSuchThat = function( identifierArray,
				    predicateFunction, domainArray ) {
	var lastLevel = domainArray.length - 1;
	// nestLevel : the level of recursive call
	var check = function( nestLevel ) {
            if ( nestLevel === lastLevel ) { // the last quantifier domain
		return domainArray[nestLevel].some( function( x ) {
                    identifierArray[ nestLevel ]._value = x ;
                    return predicateFunction();
		});
            } else {
		return domainArray[nestLevel].some( function( x ) {
                    identifierArray[ nestLevel ]._value = x ;
                    return check( nestLevel + 1 );
		});
            }
	};
	if ( !check( 0 ) ) {
            throw new Error("No primed values satisfied the before-after-predicate!");
	}
    };

    /* before JeB_08_16 this overriding didn't exist */
    /*
     * Overriding the display of an Array
     * this is used to copy the behaviour of the toString function
     * of SetExtension and SetComprehension
     * because domainArray needs to output
     * the same thing as the other functions
     */
    Array.prototype.toString = function() {
	var toStringArray = this.map( function( e ) {
            return ( typeof e === "undefined" ? e : e.toString() );
        });
	if ( toStringArray.length === 0 ) {
            return "\u2205";
	} else {
            return ( '{' + toStringArray.join( ', ' ) + '}' );
	}
    };

    /* before JeB_08_16 contains didn't exist */
    /*
     * Check if an object is in an array
     * http://stackoverflow.com/a/237176
     */
    Array.prototype.contains = function(obj) {
	var i = this.length;
	while (i--) {
            if (this[i].equal(obj)) {
		return true;
            }
	}
	return false;
    }

    /* before JeB_08_16 unify didn't exist */
    /*
     * Merge array elements, remove duplicates and sort
     */
    Array.prototype.unify = function() {
	var length = this.length;
	// if this is an empty array, we don't need to do nothing
	if ( length === 0 ){
            return this;
	}
	// introduire le typage SetExtension
	//    var a = [];
	var a = SetExtension();
	var eltArray;
	// for every subarray
	for(var i=0,ilength=0; i<length; i++){
	    // making sure the subelement is an array
	    if(Array.isArray(this[i])){
		eltArray = this[i];
		ilength=eltArray.length;
            } else {
		if (this[i] instanceof SetExtension) {
		    if (this[i].concrete) {
			eltArray = this[i];
			ilength = eltArray.length;
		    } else {
			if (this[i].finite) {
			    eltArray = this[i].toSetExtension();
			    ilength = eltArray.length;
			} else {
			    eltArray = [];
			    ilength = 0;
			}
		    }
		} else {
		    if (this[i] instanceof UpTo) {
			eltArray = this[i].toSetExtension();
			ilength = eltArray.length;
		    } else {
			eltArray = [];
			ilength = 0;
		    }
		}
	    }
	    if(ilength>0){
		// for every subelement of the subarray
		for(var j=0; j<ilength;j++){
		    // we insert it if it isn't in the new array
		    if(!a.contains(eltArray[j])){
			a.push(eltArray[j]);
		    }
		}
	    }
	}
	return a.sort(function(a,b){return a - b});
    };

jeb.util.clone = function( obj ) {
    if ( obj === undefined || obj === null /* before JeB_08_16 obj == undefined */) { // case undefined or null
        return obj;
    } else if ( typeof obj === "string" ) { // case string
        return obj;
    } else if (obj instanceof Set && obj.isConcrete() ) {
	var res = Object.create(obj.__proto__);
	res.push.apply(res, obj);
	return res;
    } else if ( obj.toLiteral ) {
        return eval( obj.toLiteral() );
    } else {
        return obj;
    }
};

    var $B = Integer;

    jeb.util.extend( $B, {
	TRUE                       : TRUE,
	FALSE                      : FALSE,
	Pair                       : Pair,

	minus                      : minus,
	divide                     : divide,
	mod                        : mod,
	pow                        : pow,
	plus                       : plus,
	multiply                   : multiply,
	pred                       : pred,
	succ                       : succ,
	unminus                    : unminus,

	lessThan                   : lessThan,
	lessEqual                  : lessEqual,
	greaterThan                : greaterThan,
	greaterEqual               : greaterEqual,

	Set                        : Set,
	SetExtension               : SetExtension,
	SetComprehension           : SetComprehension,
	PowerSet                   : PowerSet,
	PowerSet1                  : PowerSet1,
	CartesianProduct           : CartesianProduct,
	UpTo                       : UpTo,

	EmptySet                   : EmptySet,
	BOOL                       : BOOL,
	INTEGER                    : INTEGER,
	NATURAL                    : NATURAL,
	NATURAL1                   : NATURAL1,

	setMinus                   : setMinus,
	setUnion                   : setUnion,
	setInter                   : setInter,
	union                      : union,
	inter                      : inter,
	quantifiedUnion            : quantifiedUnion,
	quantifiedInter            : quantifiedInter,
	card                       : card,
	min                        : min,
	max                        : max,

	belong                     : belong,
	notBelong                  : notBelong,
	properSubset               : properSubset,
	notProperSubset            : notProperSubset,
	subset                     : subset,
	notSubset                  : notSubset,
	finite                     : finite,
	partition                  : partition,

	Relations                  : Relations,
	TotalRelations             : TotalRelations,
	SurjectiveRelations        : SurjectiveRelations,
	TotalSurjectiveRelations   : TotalSurjectiveRelations,

	dom                        : dom,
	ran                        : ran,
	relationImage              : relationImage,
	domainRestriction          : domainRestriction,
	domainSubtraction          : domainSubtraction,
	rangeRestriction           : rangeRestriction,
	rangeSubtraction           : rangeSubtraction,
	backwardComposition        : backwardComposition,
	forwardComposition         : forwardComposition,
	override                   : override,
	directProduct              : directProduct,
	parallelProduct            : parallelProduct,
	converse                   : converse,

	PartialFunctions           : PartialFunctions,
	TotalFunctions             : TotalFunctions,
	PartialInjections          : PartialInjections,
	TotalInjections            : TotalInjections,
	PartialSurjections         : PartialSurjections,
	TotalSurjections           : TotalSurjections,
	TotalBijections            : TotalBijections,

	Lambda                     : Lambda,
	id                         : id,
	prj1                       : prj1,
	prj2                       : prj2,
	functionImage              : functionImage,

	bTrue                      : bTrue,
	bFalse                     : bFalse,
	implication                : implication,
	equivalence                : equivalence,
	and                        : and,
	or                         : or,
	not                        : not,
	forAll                     : forAll,
	exists                     : exists,
	equal                      : equal,
	notEqual                   : notEqual,
	bool                       : bool,

	becomesEqualTo             : becomesEqualTo,
	becomesMemberOf            : becomesMemberOf,
	becomesSuchThat            : becomesSuchThat /* before JeB_08_16 , */
    });

    window.$B = $B;

})();
