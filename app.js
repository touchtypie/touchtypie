https://codetonics.com/javascript/detect-document-ready/
function ready(callbackFunction){
    if(document.readyState != 'loading')
      callbackFunction(event)
    else
      document.addEventListener("DOMContentLoaded", callbackFunction)
  }
  ready(event => {
    console.log('DOM is ready.')
  })


var Helpers = function () {
    return {
        htmlEntities: function htmlEntities(str) {
            return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/ /, '&nbsp;');
        }
    };
}()

// Simple data binding with some modifications
// Props to https://www.wintellect.com/data-binding-pure-javascript/
var Binding = function(b) {
    var elementBindings = [];
    var value = b.object[b.property];
    var valueGetter = function(){
        return value;
    };
    var valueSetter = function(val){
        value = val;
        for (var i = 0; i < elementBindings.length; i++) {
            var binding = elementBindings[i];
            binding.element[binding.attribute] = val;
        }
    };
    var addBinding = function(element, attribute, event, callback){
        var _this = this;
        var binding = {
            element: element,
            attribute: attribute,
            event: event
        }
        if (event){
            // E.g. DOMContentLoaded, onreadystatechange
            var ele = /DOM|ready/.test(event) ? document : element;
            if (callback) {
                ele.addEventListener(event, function(event){
                    callback(event, _this, binding);
                });
            }else {
                ele.addEventListener(event, function(event){
                    valueSetter(element[attribute]);
                });
            }
            binding.event = event;
        }
        elementBindings.push(binding)
        element[attribute] = value;
        return _this;
    };
    Object.defineProperty(b.object, b.property, {
        get: valueGetter,
        set: valueSetter
    });

    b.object[b.property] = value;

    if (State.debug) {
        console.log('[Binding][out] State.truth.value: ' + State.truth);
        console.log('[Binding][out] State.truth.value: ' + State.truth.value);
        console.log('[Binding][out] State.speech.value: ' + State.speech);
        console.log('[Binding][out] State.speech.value: ' + State.speech.value);
    }

    return {
        elementBindings: elementBindings,
        value: value,
        valueGetter: valueGetter,
        valueSetter: valueSetter,
        addBinding: addBinding,
    };
}


// Models
var BubbleVirtue = function() {
    var success = false;
    var completed = false;
    var result = {
        errors_indices: [],
        errors_num: 0,
        errors_num_new: 0,
        errors_num_total: 0,
        value: ''
    };

    var newleaf = function() {
        success = false,
        completed = false,
        result.errors_indices = [],
        result.errors_num = 0,
        result.errors_num_new = 0,
        result.value = '';
    };
    var newlife = function() {
        newleaf();
        result.errors_num_total = 0;
    }

    return {
        success: success,
        completed: completed,
        result: result,
        newleaf: newleaf,
        newlife: newlife
    }
}
var Bubble = function(default_value) {
    var value = default_value;
    var characters = [];
    var charactersCounter = 0;

    var virtue = BubbleVirtue();

    // Populates this bubble's BubbleVirtue object, when this bubble.value is measured against truth.value
    var measureVirtue = function(truth) {
        var bubble = this;

        virtue.newleaf();

        if (bubble.value.length <= truth.value.length) {
            for (var i = 0; i < bubble.value.length; i++) {
                if (bubble.value[i] !== truth.value[i]) {
                    // Invalid
                    virtue.result.errors_indices.push(i);
                    if (i === bubble.value.length - 1) {
                        virtue.result.errors_num_new = 1;
                    }
                }else {
                    // Valid
                }
            }
            // for (var i = bubble.value.length; i < truth.value.length; i++) {
            //     // Valid
            // }

            // Populate result
            virtue.success = virtue.result.errors_indices.length == 0 ? true : false;
            virtue.result.errors_num = virtue.result.errors_indices.length;
            virtue.result.errors_num_total += virtue.result.errors_num_new;
            if (bubble.value.length >= 0) {
                var characters = truth.value.split('');
                for (var i = 0; i < characters.length; i++) {
                    if (i === bubble.value.length) {
                        characters[i] = '<span class="cursor">' + Helpers.htmlEntities(characters[i]) + '</span>';
                    }else if (virtue.result.errors_indices.includes(i)) {
                        characters[i] = '<span class="invalid">' + Helpers.htmlEntities(characters[i]) + '</span>';
                    }else {
                        characters[i] = '<span class="">' + Helpers.htmlEntities(characters[i]) + '</span>';
                    }
                }
                virtue.result.value = characters.join('')
            }
        }

        if (virtue.success && bubble.value.length == truth.value.length) {
            virtue.completed = true;
        }

        if (State.debug) {
            console.log('[measureVirtue] result.success: ' + virtue.success);
            console.log('[measureVirtue] result.completed: ' + virtue.completed);
            console.log('[measureVirtue] virtue.result.errors_indices: ' + virtue.result.errors_indices);
            console.log('[measureVirtue] virtue.result.errors_num: ' + virtue.result.errors_num);
            console.log('[measureVirtue] virtue.result.errors_num_total: ' + virtue.result.errors_num_total);
            console.log('[measureVirtue] virtue.result.value: ' + virtue.result.value);
        }
        return virtue;
    };

    return {
        value: value,
        characters: characters,
        charactersCounter: charactersCounter,
        virtue: virtue,
        measureVirtue: measureVirtue,
    };
};

// Controllers
var BubbleController = function () {
    var _virtues = State.student.virtues;
    var _truth = State.truth;
    var _speech = State.speech;
    var _response = State.response;

    // Data binding - Component: truth
    Binding({
        object: _truth,
        property: "value"
    })
    .addBinding(
        document.getElementsByTagName('truth')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );

    // Data binding - Component: speech
    Binding({
        object: _speech,
        property: "value"
    })
    .addBinding(
        document.getElementsByTagName('speech')[0].getElementsByTagName('value')[0],
        'innerHTML'
    )
    .addBinding(
        document.getElementsByTagName('speech')[0].getElementsByTagName('value')[0],
        'innerHTML',
        "DOMContentLoaded",
        function(event, _this, binding) {
            console.log('[DOMContentLoaded]');
            // Set truth values
            _truth.charactersCounter = _truth.value.length;

            // Set speech value
            _speech.value = _truth.value;

            // Set speech characters
            _speech.characters = _speech.value.split('');

            // Set speech counter
            _speech.charactersCounter = _speech.value.length;

            // Validate response
            var virtue = _response.measureVirtue(_truth);
            // Set speech value
            _speech.value = virtue.result.value;
            if (virtue.completed) {
                // Set homework value
                _virtues.values.push[virtue];
                _virtues.count += 1;

                // Next homework
                _response.virtue.newlife();
                _truth.next();
            }

            if (State.debug) {
                console.log('[DOMContentLoaded] _speech.value: ' + _speech.value);
                console.log('[DOMContentLoaded] _speech.characters: ' + _speech.characters);
                console.log('[DOMContentLoaded] _speech.charactersCounter: ' + _speech.charactersCounter);
            }
        }
    );

    var a = 1;

    // Data binding - Component: response
    new Binding({
        object: _response,
        property: "value"
    }).addBinding(
        document.getElementsByTagName('response')[0].getElementsByTagName('textarea')[0],
        'value',    // textarea
        "keyup",
        function(event, _this, binding) {
            // Set value
            _this.valueSetter(binding.element[binding.attribute]);

            // Set response characters
            _response.characters = _response.value.split('');

            // Set response counter
            _response.charactersCounter = _response.value.length;

            // measureVirtue response
            var virtue = _response.measureVirtue(_truth);
            // Set speech value
            _speech.value = virtue.result.value;

            if (State.debug) {
                console.log('[keyup] _truth.value: ' + _truth.value);
                console.log('[keyup] _truth.characters: ' + _truth.characters);
                console.log('[keyup] _truth.charactersCounter: ' + _truth.charactersCounter);
                console.log('[keyup] _speech.value: ' + _speech.value);
                console.log('[keyup] _speech.characters: ' + _speech.characters);
                console.log('[keyup] _speech.charactersCounter: ' + _speech.charactersCounter);
                console.log('[keyup] _response.value: ' + _response.value);
                console.log('[keyup] _response.characters: ' + _response.characters);
                console.log('[keyup] _response.charactersCounter: ' + _response.charactersCounter);
            }
        }
    )
    // Data binding - Component: counters
    new Binding({
        object: _response,
        property: "charactersCounter"
    }).addBinding(
        document.getElementsByTagName('characterscounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _truth,
        property: "charactersCounter"
    }).addBinding(
        document.getElementsByTagName('characterscounter')[0].getElementsByTagName('total')[0],
        'innerHTML'
    );
    new Binding({
        object: _response.virtue.result,
        property: "errors_num"
    }).addBinding(
        document.getElementsByTagName('errorscounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _response.virtue.result,
        property: "errors_num_total"
    }).addBinding(
        document.getElementsByTagName('totalerrorscounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _virtues,
        property: "count"
    }).addBinding(
        document.getElementsByTagName('totalhomeworkcounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
}

// App state
var State = function() {
    return {
        debug: true,
        truth: Bubble('Get some truth to type.'),
        speech: Bubble(''),
        response: Bubble(''),
        student: {
            homework: {
                count: 0
            },
            virtues: {
                count: 0,
                values: []
            }
        }
    }
}();
var myApp = function () {
    BubbleController();
}();
