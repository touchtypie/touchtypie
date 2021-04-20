var Helpers = function () {
    return {
        htmlEntities: function htmlEntities(str) {
            return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/ /, '&nbsp;').replace(/\s+$/, '<br/>');
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
            hit_indices: [],
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

            // Global
            shot_num_global: 0,
            hit_num_global: 0,
            hit_num_global_percentage: 0.00,
            miss_num_global: 0,
            miss_num_global_percentage: 0.00,
            amend_num_global: 0,
            amend_num_global_percentage: 0.00,
        };
    }
    var result = newVirtue();

    var newleaf = function() {
        this.result.success = false;
        this.result.completed = false;

        this.result.value = '';
        this.result.value_length = 0;

        this.result.shot_num_new = 0;
        this.result.hit_indices = [];
        this.result.hit_num = 0;
        this.result.hit_num_new = 0;
        this.result.hit_num_percentage = 0.00;
        this.result.miss_indices = [];
        this.result.miss_num = 0;
        this.result.miss_num_new = 0;
        this.result.miss_num_percentage = 0.00;
        this.result.amend_num_new = 0;
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
        // newlife: newlife
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

        virtue.result.shot_num_new = 1;
        virtue.result.amend_num_new = amend === true && bubble.value.length < value_length_prev ? 1 : virtue.result.amend_num_new;
        virtue.result.miss_num_new = amend === false && bubble.value.length > truth.value.length ? 1 : virtue.result.miss_num_new;
        for (var i = 0; i < bubble.value.length && i < truth.value.length; i++) {
            if (bubble.value[i] !== truth.value[i]) {
                // Invalid
                virtue.result.miss_indices.push(i);
                if (i === bubble.value.length - 1 && bubble.value.length > value_length_prev) {
                    virtue.result.miss_num_new = 1;
                }
            }else {
                // Valid
                virtue.result.hit_indices.push(i);
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
            var _prependHtml = '', _classHtml = '';
            for (var i = 0; i < characters.length; i++) {
                _prependHtml = '';
                if (/\n/.test(characters[i])) {
                    _prependHtml = '<br />';
                    characters[i] = '';
                }
                if (i === bubble.value.length) {
                    _classHtml = 'cursor';
                }else if (virtue.result.miss_indices.includes(i)) {
                    _classHtml = 'invalid';
                }else {
                    _classHtml = '';
                }
                characters[i] = _prependHtml + '<span class="' + _classHtml + '">' + Helpers.htmlEntities(characters[i]) + '</span>';
            }
            // Show at most 100 characters
            var startIndex = bubble.value.length - 1 - 50;
            var endIndex = bubble.value.length - 1 + 50;
            virtue.result.value = startIndex >= 0 && endIndex <= characters.length ? characters.slice(startIndex, endIndex).join('') : characters.slice(0, 99).join('');
        }
        virtue.result.value_length = bubble.value.length;
        virtue.result.hit_num = virtue.result.hit_indices.length;
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

        if (virtue.result.success && bubble.value.length == truth.value.length) {
            virtue.result.completed = true;
        }

        if (State.debug) {
            console.log('[measureVirtue] result.success: ' + virtue.result.success);
            console.log('[measureVirtue] result.completed: ' + virtue.result.completed);
            console.log('[measureVirtue] virtue.result.value: ' + virtue.result.value);
            console.log('[measureVirtue] virtue.result.value_length: ' + virtue.result.value_length);
            console.log('[measureVirtue] virtue.result.shot_num_new: ' + virtue.result.shot_num_new);
            console.log('[measureVirtue] virtue.result.hit_indices: ' + virtue.result.hit_indices);
            console.log('[measureVirtue] virtue.result.hit_num_new: ' + virtue.result.hit_num_new);
            console.log('[measureVirtue] virtue.result.hit_num: ' + virtue.result.hit_num);
            console.log('[measureVirtue] virtue.result.hit_num_percentage: ' + virtue.result.hit_num_percentage);
            console.log('[measureVirtue] virtue.result.miss_indices: ' + virtue.result.miss_indices);
            console.log('[measureVirtue] virtue.result.miss_num_new: ' + virtue.result.miss_num_new);
            console.log('[measureVirtue] virtue.result.miss_num: ' + virtue.result.miss_num);
            console.log('[measureVirtue] virtue.result.miss_num_percentage: ' + virtue.result.miss_num_percentage);
            console.log('[measureVirtue] virtue.result.amend_num_new: ' + virtue.result.amend_num_new);

            console.log('[measureVirtue] virtue.result.shot_num_total: ' + virtue.result.shot_num_total);
            console.log('[measureVirtue] virtue.result.hit_num_total: ' + virtue.result.hit_num_total);
            console.log('[measureVirtue] virtue.result.hit_num_total_percentage: ' + virtue.result.hit_num_total_percentage);
            console.log('[measureVirtue] virtue.result.miss_num_total: ' + virtue.result.miss_num_total);
            console.log('[measureVirtue] virtue.result.miss_num_total_percentage: ' + virtue.result.miss_num_total_percentage);
            console.log('[measureVirtue] virtue.result.amend_num_total: ' + virtue.result.amend_num_total);
            console.log('[measureVirtue] virtue.result.amend_num_total_percentage: ' + virtue.result.amend_num_total_percentage);
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
    var truth = Bubble('Get some truth to type.');
    var speech = Bubble('');

    var callback;
    var getNewUnit = function(callback) {
        var _this = this;
        var method='GET';
        var url = '/app.css';
        _this.callback = callback;

        var readbody = function(xhr) {
            var data;
            if (!xhr.responseType || xhr.responseType === "text") {
                data = xhr.responseText;
            } else if (xhr.responseType === "document") {
                data = xhr.responseXML;
            } else {
                data = xhr.response;
            }
            return data;
        };

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(event, event) {
            if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                _this.callback(readbody(xhr));
            }

            // Debug
            if (State.debug) {
                console.log('[xhr.onreadystatechange] :' + xhr.readyState);
                console.log('[xhr.status] :' + xhr.status);
                if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 0) {
                    if (_this.callback) {
                        _this.callback('zzz');
                    }
                }
            }
        };
        xhr.open(method, url);
        xhr.send(null);
    };

    return {
        truth: truth ,
        speech: speech,
        getNewUnit: getNewUnit
    };
};
var Student = function() {
    return {
        response: Bubble(''),
        units: {
            count: 0,
            num_total: 0
        },
        virtue: BubbleVirtue(),
        virtues: {
            count: 0,
            values: []
        },
        inheritVirtue: function(virtue) {
            var _student = this;

            // Populate my virtue (progress, non-cumulative)
            _student.virtue.result.success = virtue.result.success;
            _student.virtue.result.completed = virtue.result.completed;
            _student.virtue.result.value = virtue.result.value;
            _student.virtue.result.value_length = virtue.result.value_length;
            _student.virtue.result.shot_num_new = virtue.result.shot_num_new;
            _student.virtue.result.hit_indices = virtue.result.hit_indices;
            _student.virtue.result.hit_num = virtue.result.hit_num;
            _student.virtue.result.hit_num_new = virtue.result.hit_num_new;
            _student.virtue.result.hit_num_percentage = virtue.result.hit_num_percentage;
            _student.virtue.result.miss_indices = virtue.result.miss_indices;
            _student.virtue.result.miss_num = virtue.result.miss_num;
            _student.virtue.result.miss_num_new = virtue.result.miss_num_new;
            _student.virtue.result.miss_num_percentage = virtue.result.miss_num_percentage;
            _student.virtue.result.amend_num_new = virtue.result.amend_num_new;

            // Populate my virtue (unit, cumulative)
            _student.virtue.result.shot_num_total = virtue.result.shot_num_total;
            _student.virtue.result.hit_num_total = virtue.result.hit_num_total;
            _student.virtue.result.hit_num_total_percentage = virtue.result.hit_num_total_percentage;
            _student.virtue.result.miss_num_total = virtue.result.miss_num_total;
            _student.virtue.result.miss_num_total_percentage = virtue.result.miss_num_total_percentage;
            _student.virtue.result.amend_num_total = virtue.result.amend_num_total;
            _student.virtue.result.amend_num_total_percentage = virtue.result.amend_num_total_percentage;

            // Popululate my virtue (global, cumulative)
            _student.virtue.result.shot_num_global += virtue.result.shot_num_new;
            _student.virtue.result.hit_num_global += virtue.result.hit_num_new;
            _student.virtue.result.hit_num_global_percentage = _student.virtue.result.hit_num_global == 0 ? 0.00 : (_student.virtue.result.hit_num_global / _student.virtue.result.shot_num_global * 100).toFixed(2)
            _student.virtue.result.miss_num_global += virtue.result.miss_num_new;
            _student.virtue.result.miss_num_global_percentage = _student.virtue.result.miss_num_global == 0 ? 0.00 : (_student.virtue.result.miss_num_global / _student.virtue.result.shot_num_global * 100).toFixed(2)
            _student.virtue.result.amend_num_global += virtue.result.amend_num_new;
            _student.virtue.result.amend_num_global_percentage = _student.virtue.result.amend_num_global == 0 ? 0.00 : (_student.virtue.result.amend_num_global / _student.virtue.result.shot_num_global * 100).toFixed(2)

        },
        stashVirtue: function(virtue) {
            var _student = this;

            // Set units value
            _student.virtues.values.push(virtue);
            _student.virtues.count += 1;
            _student.units.count += 1;
        }
    }
};
var Training = function() {
    var _this = this;
    var trainer = Trainer();
    var student = Student();

    var start = function(text) {
        var _this = this;
        // Set truth values
        if (text) {
            _this.trainer.truth.value = text;
        }
        _this.trainer.truth.charactersCounter = _this.trainer.truth.value.length;

        // Set trainer speech
        _this.trainer.speech.value = _this.trainer.truth.value;
        _this.trainer.speech.charactersCounter = _this.trainer.speech.value.length;

        // Validate student response
        var virtue = _this.student.response.measureVirtue(_this.trainer.truth);
        // Set trainer speech value
        _this.trainer.speech.value = virtue.result.value;
        // Set student unit num_total
        _this.student.units.num_total++;

        if (State.debug) {
            console.log('[Training][start] _this.trainer.speech.value: ' + _this.trainer.speech.value);
            console.log('[Training][start] _this.trainer.speech.charactersCounter: ' + _this.trainer.speech.charactersCounter);
        }
    };

    var next = function() {
        var _this = this;
        // Refresh the student response
        _this.student.response.reset();
        // _this.student.response.disabled = true;

        // Fetch new units
        _this.trainer.getNewUnit(function(text) {
            _this.start(text);
        });
    };

    return {
        trainer: trainer,
        student: student,
        start: start,
        next: next
    };
};

// Controllers
var TrainingController = function () {
    var _training = State.training;

    // Data binding - Component: truth
    Binding({
        object: _training.trainer.truth,
        property: "value"
    })
    .addBinding(
        document.getElementsByTagName('truth')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );

    // Data binding - Component: speech
    Binding({
        object: _training.trainer.speech,
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

            _training.start()
        }
    );

    // Data binding - Component: response
    new Binding({
        object: _training.student.response,
        property: "disabled"
    }).addBinding(
        document.getElementsByTagName('response')[0].getElementsByTagName('textarea')[0],
        'disabled'    // textarea
    )
    new Binding({
        object: _training.student.response,
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

            // Set student response. Remove all CRs
            _this.valueSetter(binding.element[binding.attribute].replace(/\r/g, ''));
            // Set student response counter
            _training.student.response.charactersCounter = _training.student.response.value.length;

            // Validate student response
            var virtue = _training.student.response.measureVirtue(_training.trainer.truth, amend);
            // Set trainer speech value
            _training.trainer.speech.value = virtue.result.value;
            // Update student virtue
            _training.student.inheritVirtue(virtue);
            if (virtue.result.completed) {
                // Record student virtue
                _training.student.stashVirtue(virtue);

                // Run the next training unit
                _training.next();
            }

            if (State.debug) {
                console.log('[keyup] _training.trainer.truth.value: ' + _training.trainer.truth.value);
                console.log('[keyup] _training.trainer.truth.charactersCounter: ' + _training.trainer.truth.charactersCounter);
                console.log('[keyup] _training.trainer.speech.value: ' + _training.trainer.speech.value);
                console.log('[keyup] _training.trainer.speech.charactersCounter: ' + _training.trainer.speech.charactersCounter);
                console.log('[keyup] _training.student.response.value: ' + _training.student.response.value);
                console.log('[keyup] _training.student.response.charactersCounter: ' + _training.student.response.charactersCounter);
            }
        }
    )
    // Data binding - Component: unitprogress
    new Binding({
        object: _training.student.response,
        property: "charactersCounter"
    }).addBinding(
        document.getElementsByTagName('unitprogress')[0].getElementsByTagName('characterscounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _training.trainer.truth,
        property: "charactersCounter"
    }).addBinding(
        document.getElementsByTagName('unitprogress')[0].getElementsByTagName('characterscounter')[0].getElementsByTagName('total')[0],
        'innerHTML'
    );
    new Binding({
        object: _training.student.virtue.result,
        property: "hit_num"
    }).addBinding(
        document.getElementsByTagName('unitprogress')[0].getElementsByTagName('hitcounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _training.student.virtue.result,
        property: "hit_num_percentage"
    }).addBinding(
        document.getElementsByTagName('unitprogress')[0].getElementsByTagName('hitpercentagecounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _training.student.virtue.result,
        property: "miss_num"
    }).addBinding(
        document.getElementsByTagName('unitprogress')[0].getElementsByTagName('misscounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _training.student.virtue.result,
        property: "miss_num_percentage"
    }).addBinding(
        document.getElementsByTagName('unitprogress')[0].getElementsByTagName('misspercentagecounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );

    // Data binding - Component: unitoverall
    new Binding({
        object: _training.student.virtue.result,
        property: "shot_num_total"
    }).addBinding(
        document.getElementsByTagName('unitoverall')[0].getElementsByTagName('shotcounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _training.student.virtue.result,
        property: "hit_num_total"
    }).addBinding(
        document.getElementsByTagName('unitoverall')[0].getElementsByTagName('hitcounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _training.student.virtue.result,
        property: "hit_num_total_percentage"
    }).addBinding(
        document.getElementsByTagName('unitoverall')[0].getElementsByTagName('hitpercentagecounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _training.student.virtue.result,
        property: "miss_num_total"
    }).addBinding(
        document.getElementsByTagName('unitoverall')[0].getElementsByTagName('misscounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _training.student.virtue.result,
        property: "miss_num_total_percentage"
    }).addBinding(
        document.getElementsByTagName('unitoverall')[0].getElementsByTagName('misspercentagecounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _training.student.virtue.result,
        property: "amend_num_total"
    }).addBinding(
        document.getElementsByTagName('unitoverall')[0].getElementsByTagName('amendcounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _training.student.virtue.result,
        property: "amend_num_total_percentage"
    }).addBinding(
        document.getElementsByTagName('unitoverall')[0].getElementsByTagName('amendpercentagecounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );

    // Data binding - Component: globaloverall
    new Binding({
        object: _training.student.virtue.result,
        property: "shot_num_global"
    }).addBinding(
        document.getElementsByTagName('globaloverall')[0].getElementsByTagName('shotcounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _training.student.virtue.result,
        property: "hit_num_global"
    }).addBinding(
        document.getElementsByTagName('globaloverall')[0].getElementsByTagName('hitcounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _training.student.virtue.result,
        property: "hit_num_global_percentage"
    }).addBinding(
        document.getElementsByTagName('globaloverall')[0].getElementsByTagName('hitpercentagecounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _training.student.virtue.result,
        property: "miss_num_global"
    }).addBinding(
        document.getElementsByTagName('globaloverall')[0].getElementsByTagName('misscounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _training.student.virtue.result,
        property: "miss_num_global_percentage"
    }).addBinding(
        document.getElementsByTagName('globaloverall')[0].getElementsByTagName('misspercentagecounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _training.student.virtue.result,
        property: "amend_num_global"
    }).addBinding(
        document.getElementsByTagName('globaloverall')[0].getElementsByTagName('amendcounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _training.student.virtue.result,
        property: "amend_num_global_percentage"
    }).addBinding(
        document.getElementsByTagName('globaloverall')[0].getElementsByTagName('amendpercentagecounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _training.student.units,
        property: "count"
    }).addBinding(
        document.getElementsByTagName('globaloverall')[0].getElementsByTagName('unitcounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _training.student.units,
        property: "num_total"
    }).addBinding(
        document.getElementsByTagName('globaloverall')[0].getElementsByTagName('unitcounter')[0].getElementsByTagName('total')[0],
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
    TrainingController();
}();
