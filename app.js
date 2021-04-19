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
        console.log('[Binding][out] State.training.trainer.truth.value: ' + State.training.trainer.truth);
        console.log('[Binding][out] State.training.trainer.truth.value: ' + State.training.trainer.truth.value);
        console.log('[Binding][out] State.training.trainer.truth.value: ' + State.training.trainer.truth);
        console.log('[Binding][out] State.training.trainer.truth.value: ' + State.training.trainer.truth.value);
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
    var newVirtue = function() {
        return {
            success: false,
            completed: false,
            value: '',
            value_length: 0,

            // Progress
            shot_num_new: 0,
            hits_indices: [],
            hit_num: 0,
            hit_num_new: 0,
            hit_num_percentage: 0.00,
            miss_indices: [],
            miss_num: 0,
            miss_num_new: 0,
            miss_num_percentage: 0.00,
            amend_num_new: 0,

            // Unit
            shot_num_total: 0,
            hit_num_total: 0,
            hit_num_total_percentage: 0.00,
            miss_num_total: 0,
            miss_num_total_percentage: 0.00,
            amend_num_total: 0,
            amend_num_total_percentage: 0.00,
        };
    }
    var result = newVirtue();

    var newleaf = function() {
        this.result.success = false;
        this.result.completed = false;

        this.result.value = '';

        this.result.shot_num_new = 0;
        this.result.hits_indices = [];
        this.result.hit_num = 0;
        this.result.hit_num_new = 0;
        this.result.hit_num_percentage = 0.00;
        this.result.miss_indices = [];
        this.result.miss_num = 0;
        this.result.miss_num_new = 0;
        this.result.miss_num_percentage = 0.00;
    };
    var newlife = function() {
        this.newleaf();
        this.result.hit_num_total = 0;
        this.result.hit_num_total_percentage = 0.00;
        this.result.miss_num_total = 0;
        this.result.miss_num_total_percentage = 0.00;
        this.result.shots_num_total = 0;
        this.result.amend_num_total = 0;
        this.result.amend_num_total_percentage = 0;
    }

    return {
        result: result,
        newleaf: newleaf,
        newlife: newlife
    }
}
var Bubble = function(default_value) {
    var disabled = false;
    var value = default_value;
    var charactersCounter = 0;

    var virtue = BubbleVirtue();

    // Creates a new virtue
    var reset = function() {
        this.value = '';
        this.charactersCounter = 0;
        this.virtue = BubbleVirtue();
    };

    // Populates this bubble's BubbleVirtue object, when this bubble.value is measured against truth.value
    var measureVirtue = function(truth, amend) {
        var bubble = this;

        var value_length_prev = virtue.result.value_length;
        virtue.newleaf();

        if (bubble.value.length <= truth.value.length) {
            virtue.result.shot_num_new = 1;
            virtue.result.amend_num_new = bubble.value.length < value_length_prev && amend === true ? 1 : 0
            for (var i = 0; i < bubble.value.length; i++) {
                if (bubble.value[i] !== truth.value[i]) {
                    // Invalid
                    virtue.result.miss_indices.push(i);
                    if (i === bubble.value.length - 1 && bubble.value.length > value_length_prev) {
                        virtue.result.miss_num_new = 1;
                    }
                }else {
                    // Valid
                    virtue.result.hits_indices.push(i);
                    if (i === bubble.value.length - 1 && bubble.value.length > value_length_prev) {
                        virtue.result.hit_num_new = 1;
                    }
                }
            }

            // for (var i = bubble.value.length; i < truth.value.length; i++) {
            //     // Valid
            // }

            // Populate result
            virtue.result.success = virtue.result.miss_indices.length == 0 ? true : false;
            if (bubble.value.length >= 0) {
                var characters = truth.value.split('');
                for (var i = 0; i < characters.length; i++) {
                    if (i === bubble.value.length) {
                        characters[i] = '<span class="cursor">' + Helpers.htmlEntities(characters[i]) + '</span>';
                    }else if (virtue.result.miss_indices.includes(i)) {
                        characters[i] = '<span class="invalid">' + Helpers.htmlEntities(characters[i]) + '</span>';
                    }else {
                        characters[i] = '<span class="">' + Helpers.htmlEntities(characters[i]) + '</span>';
                    }
                }
                virtue.result.value = characters.join('')
            }
            virtue.result.value_length = bubble.value.length;
            virtue.result.hit_num = virtue.result.hits_indices.length;
            virtue.result.hit_num_percentage = bubble.value.length == 0 ? 0.00 : (virtue.result.hit_num / bubble.value.length * 100).toFixed(2);
            virtue.result.miss_num = virtue.result.miss_indices.length;
            virtue.result.miss_num_percentage = bubble.value.length == 0 ? 0.00 : (virtue.result.miss_num / bubble.value.length * 100).toFixed(2);

            virtue.result.shot_num_total += bubble.value.length == 0 ? 0 : 1;
            virtue.result.hit_num_total += virtue.result.hit_num_new;
            virtue.result.hit_num_total_percentage = virtue.result.hit_num_total == 0.00 ? 0.00 : (virtue.result.hit_num_total / virtue.result.shot_num_total * 100).toFixed(2);
            virtue.result.miss_num_total += virtue.result.miss_num_new;
            virtue.result.miss_num_total_percentage = virtue.result.miss_num_total == 0.00 ? 0.00 : (virtue.result.miss_num_total / virtue.result.shot_num_total * 100).toFixed(2);
            virtue.result.amend_num_total += virtue.result.amend_num_new;
            virtue.result.amend_num_total_percentage = virtue.result.amend_num_total == 0.00 ? 0.00 : (virtue.result.amend_num_total / virtue.result.shot_num_total * 100).toFixed(2);
        }

        if (virtue.result.success && bubble.value.length == truth.value.length) {
            virtue.result.completed = true;
        }

        if (State.debug) {
            console.log('[measureVirtue] result.success: ' + virtue.result.success);
            console.log('[measureVirtue] result.completed: ' + virtue.result.completed);
            console.log('[measureVirtue] virtue.result.miss_indices: ' + virtue.result.miss_indices);
            console.log('[measureVirtue] virtue.result.miss_num: ' + virtue.result.miss_num);
            console.log('[measureVirtue] virtue.result.value: ' + virtue.result.value);
        }
        return virtue;
    };

    return {
        disabled: disabled,
        value: value,
        charactersCounter: charactersCounter,
        virtue: virtue,
        reset: reset,
        measureVirtue: measureVirtue,
    };
};
var Trainer = function() {
    return {
        truth:  Bubble('Get some truth to type.'),
        speech: Bubble('')
    };
};
var Student = function() {
    return {
        response: Bubble(''),
        homework: {
            count: 0,
            num_total: 0
        },
        virtue: BubbleVirtue(),
        virtues: {
            count: 0,
            values: []
        }
    }
};
var Training = function() {
    return {
        trainer:  Trainer(),
        student: Student()
    };
}

// Controllers
var BubbleController = function () {
    var _trainer = State.training.trainer;
    var _truth = State.training.trainer.truth;
    var _speech = State.training.trainer.speech;
    var _student = State.training.student;
    var _response = State.training.student.response;

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

            // Set speech counter
            _speech.charactersCounter = _speech.value.length;

            // Validate response
            var virtue = _response.measureVirtue(_truth);
            // Set speech value
            _speech.value = virtue.result.value;

            if (State.debug) {
                console.log('[DOMContentLoaded] _speech.value: ' + _speech.value);
                console.log('[DOMContentLoaded] _speech.charactersCounter: ' + _speech.charactersCounter);
            }
        }
    );

    // Data binding - Component: response
    new Binding({
        object: _response,
        property: "disabled"
    }).addBinding(
        document.getElementsByTagName('response')[0].getElementsByTagName('textarea')[0],
        'disabled'    // textarea
    )
    new Binding({
        object: _response,
        property: "value"
    }).addBinding(
        document.getElementsByTagName('response')[0].getElementsByTagName('textarea')[0],
        'value',    // textarea
        "DOMContentLoaded",
        function(event, _this, binding) {
            binding.element.focus()
        }
    ).addBinding(
        document.getElementsByTagName('response')[0].getElementsByTagName('textarea')[0],
        'value',    // textarea
        "keyup",
        function(event, _this, binding) {
            var key = event.keyCode || event.charCode;
            var amend = ( key == 8 || key == 46 ) ? true : false;

            // Set value
            _this.valueSetter(binding.element[binding.attribute]);

            // Set response counter
            _response.charactersCounter = _response.value.length;

            // measureVirtue response
            var virtue = _response.measureVirtue(_truth, amend);
            // Set speech value
            _speech.value = virtue.result.value;
            // Populate global virtues
            _student.virtue.result.shot_num_total += virtue.result.shot_num_new;
            _student.virtue.result.hit_num_total += virtue.result.hit_num_new;
            _student.virtue.result.hit_num_total_percentage = _student.virtue.result.hit_num_total == 0 ? 0.00 : (_student.virtue.result.hit_num_total / _student.virtue.result.shot_num_total * 100).toFixed(2)
            _student.virtue.result.miss_num_total += virtue.result.miss_num_new;
            _student.virtue.result.miss_num_total_percentage = _student.virtue.result.miss_num_total == 0 ? 0.00 : (_student.virtue.result.miss_num_total / _student.virtue.result.shot_num_total * 100).toFixed(2)
            _student.virtue.result.amend_num_total += virtue.result.amend_num_new;
            _student.virtue.result.amend_num_total_percentage = _student.virtue.result.amend_num_total == 0 ? 0.00 : (_student.virtue.result.amend_num_total / _student.virtue.result.shot_num_total * 100).toFixed(2)
            if (virtue.result.completed) {
                // Set homework value
                _student.virtues.values.push(virtue);
                _student.virtues.count += 1;

                // Next homework
                // _response.vidtue.newlife();
                // _truth.next();
            }

            if (State.debug) {
                console.log('[keyup] _truth.value: ' + _truth.value);
                console.log('[keyup] _truth.charactersCounter: ' + _truth.charactersCounter);
                console.log('[keyup] _speech.value: ' + _speech.value);
                console.log('[keyup] _speech.charactersCounter: ' + _speech.charactersCounter);
                console.log('[keyup] _response.value: ' + _response.value);
                console.log('[keyup] _response.charactersCounter: ' + _response.charactersCounter);
            }
        }
    )
    // Data binding - Component: unitprogress
    new Binding({
        object: _response,
        property: "charactersCounter"
    }).addBinding(
        document.getElementsByTagName('unitprogress')[0].getElementsByTagName('characterscounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _truth,
        property: "charactersCounter"
    }).addBinding(
        document.getElementsByTagName('unitprogress')[0].getElementsByTagName('characterscounter')[0].getElementsByTagName('total')[0],
        'innerHTML'
    );
    new Binding({
        object: _response.virtue.result,
        property: "hit_num"
    }).addBinding(
        document.getElementsByTagName('unitprogress')[0].getElementsByTagName('hitcounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _response.virtue.result,
        property: "hit_num_percentage"
    }).addBinding(
        document.getElementsByTagName('unitprogress')[0].getElementsByTagName('hitpercentagecounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _response.virtue.result,
        property: "miss_num"
    }).addBinding(
        document.getElementsByTagName('unitprogress')[0].getElementsByTagName('misscounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _response.virtue.result,
        property: "miss_num_percentage"
    }).addBinding(
        document.getElementsByTagName('unitprogress')[0].getElementsByTagName('misspercentagecounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );

    // Data binding - Component: unitoverall
    new Binding({
        object: _response.virtue.result,
        property: "shot_num_total"
    }).addBinding(
        document.getElementsByTagName('unitoverall')[0].getElementsByTagName('shotcounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _response.virtue.result,
        property: "hit_num_total"
    }).addBinding(
        document.getElementsByTagName('unitoverall')[0].getElementsByTagName('hitcounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _response.virtue.result,
        property: "hit_num_total_percentage"
    }).addBinding(
        document.getElementsByTagName('unitoverall')[0].getElementsByTagName('hitpercentagecounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _response.virtue.result,
        property: "miss_num_total"
    }).addBinding(
        document.getElementsByTagName('unitoverall')[0].getElementsByTagName('misscounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _response.virtue.result,
        property: "miss_num_total_percentage"
    }).addBinding(
        document.getElementsByTagName('unitoverall')[0].getElementsByTagName('misspercentagecounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _response.virtue.result,
        property: "amend_num_total"
    }).addBinding(
        document.getElementsByTagName('unitoverall')[0].getElementsByTagName('amendcounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _response.virtue.result,
        property: "amend_num_total_percentage"
    }).addBinding(
        document.getElementsByTagName('unitoverall')[0].getElementsByTagName('amendpercentagecounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );

    // Data binding - Component: globaloverall
    new Binding({
        object: _student.virtue.result,
        property: "shot_num_total"
    }).addBinding(
        document.getElementsByTagName('globaloverall')[0].getElementsByTagName('shotcounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _student.virtue.result,
        property: "hit_num_total"
    }).addBinding(
        document.getElementsByTagName('globaloverall')[0].getElementsByTagName('hitcounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _student.virtue.result,
        property: "hit_num_total_percentage"
    }).addBinding(
        document.getElementsByTagName('globaloverall')[0].getElementsByTagName('hitpercentagecounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _student.virtue.result,
        property: "miss_num_total"
    }).addBinding(
        document.getElementsByTagName('globaloverall')[0].getElementsByTagName('misscounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _student.virtue.result,
        property: "miss_num_total_percentage"
    }).addBinding(
        document.getElementsByTagName('globaloverall')[0].getElementsByTagName('misspercentagecounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _student.virtue.result,
        property: "amend_num_total"
    }).addBinding(
        document.getElementsByTagName('globaloverall')[0].getElementsByTagName('amendcounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _student.virtue.result,
        property: "amend_num_total_percentage"
    }).addBinding(
        document.getElementsByTagName('globaloverall')[0].getElementsByTagName('amendpercentagecounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _student.virtues,
        property: "count"
    }).addBinding(
        document.getElementsByTagName('globaloverall')[0].getElementsByTagName('homeworkcounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _student.homework,
        property: "num_total"
    }).addBinding(
        document.getElementsByTagName('globaloverall')[0].getElementsByTagName('homeworkcounter')[0].getElementsByTagName('total')[0],
        'innerHTML'
    );
}

// App state
var State = function() {
    return {
        debug: true,
        training: Training()
    }
}();
var myApp = function () {
    BubbleController();
}();
