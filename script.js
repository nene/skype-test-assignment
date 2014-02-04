

window.onload = function() {
    // only for DOM-capable browsers
    if (document.getElementById) {
        initSearchBox();
        initFormValidation();
    }
}

/**
 * Initialize search box.
 *
 * add word 'Search' to the box and attatch an event
 * that clears the field when clicked
 */
function initSearchBox() {
    var searchBox = getSearchBox();

    // if found, set it's content to 'Search'
    if (searchBox) {
        searchBox.value = "Search";
    }
}

/**
 * retrieve our search box element
 */
function getSearchBox() {
    return document.getElementById("query");
}


/**
 * Attatch onsubmit event handler to the form
 */
function initFormValidation() {
    var largeForm = getLargeForm();

    if (largeForm) {
        largeForm.onsubmit = validateForm;
    }
}

/**
 * Perform the validation of form fields
 * when form is submitted.
 *
 * Returns true, if form is valid.
 */
function validateForm() {
    clearErrors();
    var allFilled = validateRequiredFields();
    var validEmail = validateEmailFields();

    // show error message when needed
    if ( !allFilled && !validEmail ) {
        alert("Please fill all the required fields and enter a correct e-mail address.");
    }
    else if ( !validEmail ) {
        alert("Please enter a correct e-mail address.");
    }
    else if ( !allFilled ) {
        alert("Please fill all the required fields.");
    }

    return allFilled && validEmail;
}

/**
 * Removes class "error" from all form fields
 */
function clearErrors() {
    var errFields = getFieldsWithClass("error");
    errFields.map( function(DL){ hideError( DL ); } );
}


/**
 * Perform validation of all the required fields
 * Returns true if all required fields are filled
 *
 * check each field, resulting an array of boolean values
 * then check, if all the values are true
 */
function validateRequiredFields() {
    var requiredFields = getRequiredFields();

    return requiredFields.map(validateRequiredField).every( id );
}

/**
 * Perform validation of all the e-mail fields
 * Returns true if these fields are filled correctly
 *
 * check each field, resulting an array of boolean values
 * then check, if all the values are true
 */
function validateEmailFields() {
    var emailFields = getEmailFields();

    return emailFields.map(validateEmailField).every( id );
}

/**
 * Returns array with all required fields in form
 */
function getRequiredFields() {
    return getFieldsWithClass("required");
}

/**
 * Returns array with all e-mail fields in form
 */
function getEmailFields() {
    return getFieldsWithClass("e-mail");
}

/**
 * Returns array with all the DLs in form,
 * that have a given classname
 */
function getFieldsWithClass(className) {
    var largeForm = getLargeForm();

    var dLists = largeForm.getElementsByTagName("dl");

    var dlHasClass = function(field){ return hasClass(field, className); }

    // filter out DL-s that have the classname
    return nodeListToArray(dLists).filter( dlHasClass );
}

/**
 * return the the input/select/textarea element inside DL
 */
function getFieldFromDL(fieldDL) {
    var field = fieldDL.getElementsByTagName("input")[0];
    if (field) {
        return field;
    }

    field = fieldDL.getElementsByTagName("select")[0];
    if (field) {
        return field;
    }

    field = fieldDL.getElementsByTagName("textarea")[0];
    if (field) {
        return field;
    }

    return false;
}

/**
 * Test that field contents look like an e-mail address
 */
function validateEmailField( fieldDL ) {
    return validateField(
        fieldDL,
        // I'm not really into writing RFC-2822-compatible regex
        function(fieldValue) { return (fieldValue.length == 0 || /@/.test( fieldValue ) ); }
    );
}

/**
 * Test that field is not empty
 */
function validateRequiredField( fieldDL ) {
    return validateField(
        fieldDL,
        function(fieldValue) { return (! /^ *$/.test( fieldValue ) ); }
    );
}

/**
 * Generic validation function
 *
 * Takes the field ID and a predicate, which is a function
 * Returns true, if predicate is true when applied to fields value
 *
 * As a side effect, error notice is shown
 */
function validateField(fieldDL, predicate) {
    var field = getFieldFromDL(fieldDL);

    // if field was not found, then assume it to be valid
    // if there's some problem, the server side should handle it
    if ( !field ) {
        return true;
    }

    // check the field with validator
    if ( predicate( field.value ) ) {
        return true;
    }
    else {
        displayError( fieldDL );
        return false;
    }
}

/**
 * Attatches class 'error' to its parent DL
 */
function displayError( fieldDL ) {
    addClass(fieldDL, "error" );
}

/**
 * Removes class 'error' from its parent DL
 */
function hideError( fieldDL ) {
    removeClass(fieldDL, "error" );
}

/**
 * Adds CSS class to element
 */
function addClass(element, className) {
    var classNames = element.className.split(" ");
    classNames.push( className );
    element.className = classNames.join(" ");
}

/**
 * Removes a CSS class from element
 */
function removeClass(element, className) {
    var classNames = element.className.split(" ");
    classNames = classNames.filter( function(cn){ return cn != className; } );
    element.className = classNames.join(" ");
}

/**
 * test weather element contains a particular classname
 */
function hasClass(element, className) {
    var classNames = element.className.split(" ");
    return classNames.some( function(cn){ return cn == className; } );
}

/**
 * A simple pass-through function, returns the value itself
 */
function id(val) {
    return val;
}

/**
 * retrieve our form element
 */
function getLargeForm() {
    return document.getElementById("large-form");
}

/**
 * Convert DOM NodeList object into array
 */
function nodeListToArray(nodeList) {
    var arr = new Array( nodeList.length );
    for (var i=0; i<nodeList.length; i++) {
        arr[i] = nodeList.item(i);
    }
    return arr;
}



/**
 * Add additional methods to arrays.
 *
 * From:
 * http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference
 */
if (!Array.prototype.map) {
    Array.prototype.map = function(fun /*, thisp*/) {
        if (typeof fun != "function") {
            throw new TypeError();
        }

        var len = this.length;
        var res = new Array(len);
        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in this) {
                res[i] = fun.call(thisp, this[i], i, this);
            }
        }

        return res;
    };
}

if (!Array.prototype.every) {
    Array.prototype.every = function(fun /*, thisp*/) {
        if (typeof fun != "function") {
            throw new TypeError();
        }

        var len = this.length;
        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in this && !fun.call(thisp, this[i], i, this)) {
                return false;
            }
        }

        return true;
    };
}

if (!Array.prototype.some) {
    Array.prototype.some = function(fun /*, thisp*/) {
        if (typeof fun != "function") {
            throw new TypeError();
        }

        var len = this.length;
        var thisp = arguments[1];
        for (var i = 0; i < len; i++)
        {
            if (i in this && fun.call(thisp, this[i], i, this)) {
                return true;
            }
        }

        return false;
    };
}

if (!Array.prototype.filter) {
    Array.prototype.filter = function(fun /*, thisp*/)
    {
        if (typeof fun != "function") {
            throw new TypeError();
        }

        var len = this.length;
        var res = new Array();
        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in this) {
                var val = this[i]; // in case fun mutates this
                if (fun.call(thisp, val, i, this))
                res.push(val);
            }
        }

        return res;
    };
}