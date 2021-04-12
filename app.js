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
function Binding(b) {
    _this = this
    this.elementBindings = []
    this.value = b.object[b.property]
    this.valueGetter = function(){
        return _this.value;
    }
    this.valueSetter = function(val){
        _this.value = val
        for (var i = 0; i < _this.elementBindings.length; i++) {
            var binding=_this.elementBindings[i]
            binding.element[binding.attribute] = val
        }
    }
    this.addBinding = function(element, attribute, event, callback){
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
                    _this.valueSetter(element[attribute]);
                });
            }
            binding.event = event
        }
        this.elementBindings.push(binding)
        element[attribute] = _this.value
        return _this
    }

    Object.defineProperty(b.object, b.property, {
        get: this.valueGetter,
        set: this.valueSetter
    });

    b.object[b.property] = this.value;
    var a = b.object[b.property]
    console.log('done.');
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
        value1: value !== undefined ? value : '',
        characters: [],
        charactersCounter: Counter()
    };
};

// Controllers
var BubbleController = function () {
    var _controller = this
    var _text = State.text
    var _speech = State.speech
    var _response = State.response

    // Data binding - Component: text
    var a = new Binding({
        object: _text,
        property: "value",
    })
    .addBinding(
        document.getElementsByTagName('text')[0].getElementsByTagName('value')[0],
        'innerHTML'
    )

    // Data binding - Component: speech
    var b = new Binding({
        object: _speech,
        property: "value",
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
            console.log('onready');
            // Set speech value
            _this.valueSetter(_text.value);
            // binding.element[binding.attribute] = _text.value

            // Set speech characters
            _speech.characters = _speech.value.split('');

            // Set speech counter
            _speech.charactersCounter.value = _speech.value.length;

            console.log('_speech.value: ' + _speech.value);
        }
    );

    var a = 1;

    // Data binding - Component: response
    // new Binding({
    //     object: _response,
    //     property: "value"
    // }).addBinding(
    //     document.getElementsByTagName('response')[0].getElementsByTagName('textarea')[0],
    //     'value',    // textarea
    //     "keyup",
    //     function(event, _this, binding) {
    //         // Set value
    //         _this.valueSetter(binding.element[binding.attribute]);

    //         // Set response characters
    //         _response.characters = binding.element[binding.attribute].split('');

    //         // Set response counter
    //         // _response.charactersCounter.value = binding.element[binding.attribute].length;

    //         // Validate response
    //         var result = _controller.validateBubble(_speech, _response);
    //         // Set speech value
    //         _speech.value = result.result.value;

    //         console.log('_response.value: ' + _response.value);
    //     }
    // )
    // new Binding({
    //     object: _response.charactersCounter,
    //     property: "value"
    // }).addBinding(
    //     document.getElementsByTagName('characterscounter')[0].getElementsByTagName('value')[0],
    //     'innerHTML'
    // );

    // Data binding - Component: counters
    // var _counters = State.counters
    // new Binding({
    //     object: _counters.incorrectCharactersCounter,
    //     property: "value"
    // }).addBinding(
    //     document.getElementsByTagName('incorrectcharacterscounter')[0].getElementsByTagName('value')[0],
    //     'innerHTML'
    // );

    // If valid, returns original speech string if valid. Else returns modified speech string with incorrect characters in elements e.g. <span class="invalid">X</span>
    this.validateBubble = function(speech, response) {
        var result = {
            success: false,
            completed: false,
            result: {
                error_indices: [],
                num_errors: 0,
                value: speech.value,
            }
        };
        if (response.characters.length == 0) {
            result.success = true;
        }
        if (response.characters.length > 0 && response.characters.length <= speech.characters.length) {
            for (var i = 0; i < response.characters.length; i++) {
                if (response.characters[i] !== speech.characters[i]) {
                    // Invalid
                    result.result.error_indices.push(i);
                    // markInvalidBubble(speech.element, i);
                } else {
                    // Valid
                    // markValidBubble(speech.element, i);
                }
            }
            for (var i = response.characters.length; i < speech.characters.length; i++) {
                // Valid
                // markNormalBubble(speech.element, i);
            }

            // Populate result
            result.success = result.result.error_indices.length == 0 ? true : false;
            if (!result.success) {
                result.success = false
                var split = result.result.value.split('')
                for (var i = 0; i < error_indices.length; i++) {
                    split[error_indices[i]] = split[error_indices[i]].replace(/(.*)/, '<span class="invalid">$1</span>');
                }
                result.result.value = split.join()

                result.result.num_errors = result.result.error_indices.length;
            }
        }

        if (result.success && response.characters.length == speech.characters.length) {
            result.completed = true;
        }

        return result;
    }

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
        text: Bubble('Select some text.'),
        speech: Bubble(''),
        response: Bubble(''),
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
