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
    if (State.debug) {
        console.log('[Binding][in] State.truth.value: ' + State.truth);
        console.log('[Binding][in] State.truth.value: ' + State.truth.value);
        console.log('[Binding][in] State.speech.value: ' + State.speech);
        console.log('[Binding][in] State.speech.value: ' + State.speech.value);
    }

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
        if (State.debug) {
            console.log('[addBinding] State.truth.value: ' + State.truth);
            console.log('[addBinding] State.truth.value: ' + State.truth.value);
            console.log('[addBinding] State.speech.value: ' + State.speech);
            console.log('[addBinding] State.speech.value: ' + State.speech.value);
        }
        return _this;
    };

    if (State.debug) {
        console.log('[Binding][1] State.truth.value: ' + State.truth);
        console.log('[Binding][1] State.truth.value: ' + State.truth.value);
        console.log('[Binding][1] State.speech.value: ' + State.speech);
        console.log('[Binding][1] State.speech.value: ' + State.speech.value);
    }

    Object.defineProperty(b.object, b.property, {
        get: valueGetter,
        set: valueSetter
    });

    if (State.debug) {
        console.log('[Binding][2] State.truth.value: ' + State.truth);
        console.log('[Binding][2] State.truth.value: ' + State.truth.value);
        console.log('[Binding][2] State.speech.value: ' + State.speech);
        console.log('[Binding][2] State.speech.value: ' + State.speech.value);
    }

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
var Counter = function() {
    return {
        value: 0,
    };
}
var Bubble = function(value) {
    return {
        value: value !== undefined ? value : '',
        characters: [],
        charactersCounter: Counter(),
        validate: function(truth) {
            var response = this;
            // If valid, returns original truth string if valid. Else returns a modified truth string with incorrect characters in elements e.g. <span class="invalid">X</span>
            var result = {
                success: false,
                completed: false,
                result: {
                    error_indices: [],
                    num_errors: 0,
                    value: truth.value,
                }
            };
            // if (response.value.length == 0) {
            //     // Incomplete
            // }
            if (response.value.length <= truth.value.length) {
                for (var i = 0; i < response.value.length; i++) {
                    if (response.value[i] !== truth.value[i]) {
                        // Invalid
                        result.result.error_indices.push(i);
                        // markInvalidBubble(truth.element, i);
                    } else {
                        // Valid
                        // markValidBubble(truth.element, i);
                    }
                }
                for (var i = response.value.length; i < truth.value.length; i++) {
                    // Valid
                    // markNormalBubble(truth.element, i);
                }

                // Populate result
                result.success = result.result.error_indices.length == 0 ? true : false;
                result.result.num_errors = result.result.error_indices.length;

                if (response.characters.length >= 0) {
                    var characters = result.result.value.split('');
                    for (var i = 0; i < characters.length; i++) {
                        if (i === response.value.length) {
                            characters[i] = '<span class="cursor">' + Helpers.htmlEntities(characters[i]) + '</span>';
                        }else if (result.result.error_indices.includes(i)) {
                            characters[i] = '<span class="invalid">' + Helpers.htmlEntities(characters[i]) + '</span>';
                        }else {
                            characters[i] = '<span class="">' + Helpers.htmlEntities(characters[i]) + '</span>';
                        }
                    }
                    result.result.value = characters.join('')
                }
            }

            if (result.success && response.value.length == truth.value.length) {
                result.completed = true;
            }

            console.log('[validateBubble] result.success: ' + result.success);
            console.log('[validateBubble] result.completed: ' + result.completed);
            console.log('[validateBubble] result.result.error_indices: ' + result.result.error_indices);
            console.log('[validateBubble] result.result.num_errors: ' + result.result.num_errors);
            console.log('[validateBubble] result.result.value: ' + result.result.value);
            return result;
        }
    };
};

// Controllers
var BubbleController = function () {
    var _controller = this;
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
            // Set speech value
            _speech.value = _truth.value;

            // Set speech characters
            _speech.characters = _speech.value.split('');

            // Set speech counter
            _speech.charactersCounter.value = _speech.value.length;

            // Validate response
            var result = _response.validate(_truth);
            // Set speech value
            _speech.value = result.result.value;

            console.log('[DOMContentLoaded] _speech.value: ' + _speech.value);
            console.log('[DOMContentLoaded] _speech.characters: ' + _speech.characters);
            console.log('[DOMContentLoaded] _speech.charactersCounter.value: ' + _speech.charactersCounter.value);
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
            _response.charactersCounter.value = _response.value.length;

            // Validate response
            var result = _response.validate(_truth);
            // Set speech value
            _speech.value = result.result.value;

            console.log('[keyup] _truth.value: ' + _truth.value);
            console.log('[keyup] _truth.characters: ' + _truth.characters);
            console.log('[keyup] _truth.charactersCounter.value: ' + _truth.charactersCounter.value);
            console.log('[keyup] _speech.value: ' + _speech.value);
            console.log('[keyup] _speech.characters: ' + _speech.characters);
            console.log('[keyup] _speech.charactersCounter.value: ' + _speech.charactersCounter.value);
            console.log('[keyup] _response.value: ' + _response.value);
            console.log('[keyup] _response.characters: ' + _response.characters);
            console.log('[keyup] _response.charactersCounter.value: ' + _response.charactersCounter.value);
        }
    )
    new Binding({
        object: _response.charactersCounter,
        property: "value"
    }).addBinding(
        document.getElementsByTagName('characterscounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );

    // Data binding - Component: counters
    var _counters = State.counters
    new Binding({
        object: _counters.incorrectCharactersCounter,
        property: "value"
    }).addBinding(
        document.getElementsByTagName('incorrectcharacterscounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );

    // Private
    // var characterizeBubble = function (bubble) {
    //     // var domElements = [];
    //     bubble.element.innerHTML = '';
    //     for (var i = 0; i < bubble.props.characters.length; i++) {
    //         characterElement = document.createElement('span');
    //         characterElement.innerHTML = Helpers.htmlEntities(bubble.props.characters[i]);
    //         // domElements.push(characterElement);
    //         bubble.element.appendChild(characterElement);
    //     }
    // };
}

// App state
var State = function() {
    return {
        debug: true,
        truth: Bubble('Get some truth to type.'),
        speech: Bubble(''),
        response: Bubble(''),
        result: null,
        counters: {
            incorrectCharactersCounter: Counter(),
            homeworkCounter: Counter(),
        }
    }
}();
var myApp = function () {
    BubbleController();
}();

var a = {
    foo: 'bar'
};
var b = {
    foo: ''
};

b.foo = a.foo
b.foo = 1;
console.log(a.foo)
console.log(b.foo)
