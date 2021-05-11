'use strict'

var Helpers = function () {
    return {
        htmlEntities: function htmlEntities(str) {
            return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/ /, '&nbsp;').replace(/\s+$/, '<br/>');
        },
        getStopwatchValue: function getStopwatchValue(milliseconds) {
            var stopwatch = '';

            function pad(num, size) {
                num = num.toString();
                while (num.length < size) num = "0" + num;
                return num;
            }

            var centiseconds = Math.floor(milliseconds / 10 % 100);
            var seconds = Math.floor(milliseconds / 1000 % 60);
            var minutes = Math.floor(milliseconds / 1000 / 60 % 60);
            var hours = Math.floor(milliseconds / 1000 / 60 / 60 % 24);
            var days = Math.floor(milliseconds / 1000 / 60 / 60 / 24);
            stopwatch = pad(minutes, 2) + ':' + pad(seconds, 2);
            if (hours > 0) {
                stopwatch = pad(hours, 2) + ':' +  stopwatch;
            }
            if (days > 0) {
                stopwatch = pad(days, 2) + 'd ' + stopwatch;
            }
            // stopwatch = pad(days, 2) + 'd ' + pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(seconds, 2) + '.' + pad(centiseconds, 2);

            return stopwatch;
        },
        scrambleText: function scrambleText(text) {
            var textScrambled = [];
            var textSplit = text.split('');
            var pos;
            while (textScrambled.length < text.length) {
                pos = Math.floor(Math.random() * textSplit.length);
                // Append
                textScrambled.push(textSplit[pos]);
                // Remove
                textSplit.splice(pos, 1);
            }
            return textScrambled.join('');
        },
        jumbleText: function jumbleText(text) {
            var textJumbled = [];
            var nonWhitespaces = text.split(/\s+/).filter(function (v) { return v !== ''; });
            var whitespaces = text.split(/[^\s]+/).filter(function (v) { return v !== ''; });

            var longerLength = nonWhitespaces.length > whitespaces.length ? nonWhitespaces.length : whitespaces.length;
            var pos;
            for (var i = 0; i < longerLength; i++) {
                // Add non-whitespace
                if (nonWhitespaces.length > 0) {
                    pos = Math.floor(Math.random() * nonWhitespaces.length);
                    textJumbled.push(nonWhitespaces[pos]);
                    nonWhitespaces.splice(pos, 1);
                }

                // Add whitespace
                if (whitespaces.length > 0) {
                    pos = Math.floor(Math.random() * whitespaces.length);
                    textJumbled.push(whitespaces[pos]);
                    whitespaces.splice(pos, 1);
                }
            }
            return textJumbled.join('');
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
    var addBinding = function(element, attribute, event, callback, callbackThisObj){
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
                    callback.apply(callbackThisObj, [event, _this, binding]);
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
// A representation of the measure of a behavior's conguence to perfect behavior
var BehaviorVirtue = function() {
    var newVirtue = function() {
        return {
            // Unit meta
            libraryId: '',
            collectionId: '',
            id: '',
            perfection: false,
            jumble: false,
            scramble: false,
            success: false,
            completed: false,
            value: '',
            value_zonal: '',
            value_length: 0,
            value_length_percentage: 0,
            datetime_start_epoch: 0,
            datetime_end_epoch: 0,
            datetime_start_iso: '',
            datetime_end_iso: '',
            datetime_duration_ms: 0,
            datetime_stopwatch: '',

            // Unit rate
            rate_hit_per_min: 0,

            // Unit progress
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
            other_num_new: 0,

            // Unit cumulative
            shot_num_total: 0,
            hit_num_total: 0,
            hit_num_total_percentage: 0.00,
            miss_num_total: 0,
            miss_num_total_percentage: 0.00,
            amend_num_total: 0,
            amend_num_total_percentage: 0.00,
            other_num_total: 0,
            other_num_total_percentage: 0.00,
        };
    }
    var result = newVirtue();

    var newleaf = function() {
        // Unit meta
        this.result.perfection = false;
        this.result.jumble = false;
        this.result.scramble = false;
        this.result.success = false;
        this.result.completed = false;
        this.result.value_zonal = '';
        this.result.value_length = 0;
        this.result.value_length_percentage = 0;

        // Unit progress
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
        this.result.other_num_new = 0;
    };
    var newlife = function() {
        this.newleaf();

        // Unit meta
        this.result.libraryId = '';
        this.result.collectionId = '';
        this.result.id = '';
        this.result.value = '';
        this.result.datetime_start_epoch = 0;
        this.result.datetime_end_epoch = 0;
        this.result.datetime_start_iso = '';
        this.result.datetime_end_iso = '';
        this.result.datetime_duration_ms = 0;
        this.result.datetime_stopwatch = '';
        this.result.rate_hit_per_min = '';

        // Unit cumulative
        this.result.shot_num_total = 0;
        this.result.hit_num_total = 0;
        this.result.hit_num_total_percentage = 0.00;
        this.result.miss_num_total = 0;
        this.result.miss_num_total_percentage = 0.00;
        this.result.amend_num_total = 0;
        this.result.amend_num_total_percentage = 0;
        this.result.other_num_total = 0;
        this.result.other_num_total_percentage = 0;
    };
    var graduate = function() {
        // Unit meta
        this.result.value_zonal = '<redacted>';
    };

    return {
        result: result,
        newleaf: newleaf,
        newlife: newlife,
        graduate: graduate
    }
}
// A representation of the measure of a student nature's congruence to a perfect nature
var StudentVirtue = function() {
    var virtue = BehaviorVirtue();

    var globalvirtue = {
        result: {
            // Global meta
            datetime_duration_ms_global: 0,
            datetime_stopwatch_global: '',

            // Global rate
            rate_hit_per_min_global: 0,

            // Global cumulative
            shot_num_global: 0,
            hit_num_global: 0,
            hit_num_global_percentage: 0.00,
            miss_num_global: 0,
            miss_num_global_percentage: 0.00,
            amend_num_global: 0,
            amend_num_global_percentage: 0.00,
            other_num_global: 0,
            other_num_global_percentage: 0.00
        }
    };

    // Merge
    for (var k in globalvirtue.result) {
        virtue.result[k] = globalvirtue.result[k];
    }

    return virtue;
};
// A representation of a behavior
var Bubble = function(default_value) {
    var libraryId = '';
    var collectionId = '';
    var id = '';
    var disabled = false;
    var value = default_value;
    var charactersCounter = 0;

    var virtue = BehaviorVirtue();

    // Resets the existing virtue
    var newleaf = function() {
        this.id = '';
        this.value = '';
        this.charactersCounter = 0;
        this.virtue.newlife();
    };

    // Creates a new virtue
    var newlife = function() {
        this.id = '';
        this.value = '';
        this.charactersCounter = 0;
        this.virtue = BehaviorVirtue();
    };

     // Returns two indices representing a peek (substring) in truth proximal to the current bubble cursor
     var getPeekIndices = function(bubble, truth) {
        const cursorIndex = bubble.value.length > 0 ? bubble.value.length - 1: 0;

        // By default the peak (substring) around the cursor is x maximum characters
        const maxLength = 100;
        var startIndex, endIndex;
        if (truth.value.length <= maxLength) {
            startIndex = 0;
            endIndex = truth.value.length - 1;
        }else {
            startIndex = cursorIndex - ((maxLength / 2) - 1) > 0 ? cursorIndex - ((maxLength / 2) - 1) : 0
            endIndex = cursorIndex + ((maxLength / 2) - 1) < maxLength ? cursorIndex + ((maxLength / 2) - 1) : maxLength;
            // return truth.value.substr(startIndex, endIndex - startIndex);

            // From this point, determine if the truth value is multiline.
            // Determine all LF indices of truth value. Consider the start of string as a LF
            var lfIndices = [0];
            if (lfIndices.length > 0) {
                for (var i = 0; i < truth.value.length; i++) {
                    if (/\n/.test(truth.value[i])) {
                        lfIndices.push(i);
                    }
                }

                // Find nearest LF index relative to cursor
                var nearestLfIndicesIndex = 0;
                for(var i = 0; i < lfIndices.length; i++) {
                    // Look +1 characters ahead of the cursor
                    if (lfIndices[i] <= cursorIndex + 1) {
                        nearestLfIndicesIndex = i;
                    }else {
                        break;
                    }
                }
                // Get characters between x LFs before cursor and x+1 LFs after cursor
                const padLfMax = 5;
                const padLfBefore = 2;
                const startLfIndicesIdx = nearestLfIndicesIndex - padLfBefore < 0 ? 0 : nearestLfIndicesIndex - padLfBefore;
                const endLfIndicesIdx = startLfIndicesIdx + padLfMax > lfIndices.length - 1 ? lfIndices.length - 1 : startLfIndicesIdx + padLfMax;
                // If there are enough LF characters following the cursor, set our new peek indices to the LF positions
                if (lfIndices[endLfIndicesIdx] > 0) {
                    startIndex = lfIndices[startLfIndicesIdx];
                    endIndex = lfIndices[endLfIndicesIdx];
                    if (status.debug) {
                        console.log('startIndex: ' + startIndex);
                        console.log('endIndex: ' + endIndex);
                    }
                }
            }
        }
        return [startIndex, endIndex];
    }

    // Returns a HTML string with highlighted error(s) and cursor positions, based on given value validated against giuven array of miss_indices
    var getFeedbackHtmlValue = function(value, truthValue) {
        var characters = truthValue.split('');

        var _prependHtml, _classHtml;
        for (var i = 0; i < characters.length; i++) {
            _prependHtml = '';
            _classHtml = '';
            if (i == 0) {
                _prependHtml = '<character class="line-feed-placeholder"></character>';
            }
            if (/\n/.test(characters[i])) {
                _prependHtml = '<br />';
                _classHtml = 'line-feed ';
                characters[i] = '';
            }
            if (i === value.length) {
                _classHtml += 'cursor';
            }else if (i <= value.length - 1 && value[i] !== truthValue[i]) {
                _classHtml += 'invalid';
            }else if (i <= value.length) {
                _classHtml += 'valid';
            }
            characters[i] = _prependHtml + '<character class="' + _classHtml + '">' + Helpers.htmlEntities(characters[i]) + '</character>';
        }
        return characters.join('');
    }

    // Populates this bubble's BehaviorVirtue object, when this bubble.value is measured against truth.value
    var measureVirtue = function(truth, environment, key) {
        var bubble = this;
        var virtue = bubble.virtue;

        var started = false;
        var amend = ( key == 8 || key == 46 ) ? true : false;
        var value_length_prev = virtue.result.value_length;
        virtue.newleaf();

        if (key && !virtue.result.datetime_start_epoch) {
            started = true;
            var now = new Date();
            virtue.result.datetime_start_epoch = now.valueOf() ;
            virtue.result.datetime_start_iso = now.toISOString();
            // Update datetime_* every interval
            (function() {
                // Store reference to this virtue
                var _virtue = virtue;
                const intervalMilliseconds = 100;
                var intervalId = setInterval(function(){
                    if (_virtue.result.datetime_start_epoch === 0 || _virtue.result.completed) {
                        if (State.debug) {
                            console.log('[measureVirtue][interval] delete');
                        }
                        clearInterval(intervalId);
                    }else {
                        // if (State.debug) {
                        //     console.log('[measureVirtue][interval] _virtue.result.datetime_duration_ms: ' + _virtue.result.datetime_duration_ms);
                        // }
                        var now = new Date();
                        _virtue.result.datetime_duration_ms = now.valueOf() - _virtue.result.datetime_start_epoch;
                        _virtue.result.datetime_stopwatch = Helpers.getStopwatchValue(_virtue.result.datetime_duration_ms);
                        _virtue.result.rate_hit_per_min = _virtue.result.datetime_duration_ms === 0 ? 0.00 : parseFloat((_virtue.result.hit_num_total / (_virtue.result.datetime_duration_ms / 1000) * 60).toFixed(2));
                    }
                }, intervalMilliseconds)
                if (State.debug) {
                    console.log('[measureVirtue][interval] create');
                }
            })();
        }
        virtue.result.shot_num_new = key ? 1 : 0;
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
        virtue.result.miss_num_new = amend === false && bubble.value.length > truth.value.length ? 1 : virtue.result.miss_num_new;
        virtue.result.amend_num_new = amend === true && bubble.value.length < value_length_prev ? 1 : virtue.result.amend_num_new;
        virtue.result.other_num_new = virtue.result.shot_num_new && bubble.value.length === value_length_prev ? 1 : 0;

        // for (var i = bubble.value.length; i < truth.value.length; i++) {
        //     // Valid
        // }

        // Populate result
        virtue.result.libraryId = truth.libraryId;
        virtue.result.collectionId = truth.collectionId;
        virtue.result.id = truth.id;
        virtue.result.jumble = environment.jumble;
        virtue.result.scramble = environment.scramble;
        virtue.result.perfection = environment.perfection;
        virtue.result.success = virtue.result.miss_indices.length == 0 ? true : false;
        if (virtue.result.value === '') {
            virtue.result.value = truth.value;
        }
        const peekIndices= getPeekIndices(bubble, truth);
        const startIndex = peekIndices[0];
        const endIndex = peekIndices[1];
        virtue.result.value_zonal = getFeedbackHtmlValue(
            bubble.value.length == 0 ? bubble.value : bubble.value.substring(startIndex, endIndex + 1 < bubble.value.length ? endIndex + 1: bubble.value.length ),
            truth.value.substring(startIndex, endIndex + 1)
        );
        virtue.result.value_length = bubble.value.length;
        virtue.result.value_length_percentage = bubble.value.length == 0 ? 0.00 : parseFloat((bubble.value.length / truth.value.length * 100).toFixed(2));
        virtue.result.hit_num = virtue.result.hit_indices.length;
        virtue.result.hit_num_percentage = bubble.value.length == 0 ? 0.00 : parseFloat((virtue.result.hit_num / bubble.value.length * 100).toFixed(2));
        virtue.result.miss_num = virtue.result.miss_indices.length;
        virtue.result.miss_num_percentage = bubble.value.length == 0 ? 0.00 : parseFloat((virtue.result.miss_num / bubble.value.length * 100).toFixed(2));

        virtue.result.shot_num_total += virtue.result.shot_num_new;
        virtue.result.hit_num_total += virtue.result.hit_num_new;
        virtue.result.hit_num_total_percentage = virtue.result.hit_num_total == 0 ? 0.00 : parseFloat((virtue.result.hit_num_total / virtue.result.shot_num_total * 100).toFixed(2));
        virtue.result.miss_num_total += virtue.result.miss_num_new;
        virtue.result.miss_num_total_percentage = virtue.result.miss_num_total == 0 ? 0.00 : parseFloat((virtue.result.miss_num_total / virtue.result.shot_num_total * 100).toFixed(2));
        virtue.result.amend_num_total += virtue.result.amend_num_new;
        virtue.result.amend_num_total_percentage = virtue.result.amend_num_total == 0 ? 0.00 : parseFloat((virtue.result.amend_num_total / virtue.result.shot_num_total * 100).toFixed(2));
        virtue.result.other_num_total += virtue.result.other_num_new;
        virtue.result.other_num_total_percentage = virtue.result.other_num_total == 0 ? 0.00 : parseFloat((virtue.result.other_num_total / virtue.result.shot_num_total * 100).toFixed(2));

        if ( (environment.perfection && virtue.result.success && bubble.value.length == truth.value.length) ||
             (!environment.perfection && bubble.value.length == truth.value.length)
            ) {
            virtue.result.completed = true;
            var now = new Date();
            virtue.result.datetime_end_epoch = now.valueOf();
            virtue.result.datetime_end_iso = now.toISOString();
            virtue.result.datetime_duration_ms = virtue.result.datetime_end_epoch - virtue.result.datetime_start_epoch;
            virtue.result.rate_hit_per_min = virtue.result.datetime_duration_ms === 0 ? 0.00 : parseFloat((virtue.result.hit_num_total / (virtue.result.datetime_duration_ms / 1000) * 60).toFixed(2));
        }

        if (State.debug) {
            // Unit meta
            console.log('[measureVirtue] virtue.result.libraryId: ' + virtue.result.libraryId);
            console.log('[measureVirtue] virtue.result.collectionId: ' + virtue.result.collectionId);
            console.log('[measureVirtue] virtue.result.id: ' + virtue.result.id);
            console.log('[measureVirtue] virtue.result.perfection: ' + virtue.result.perfection);
            console.log('[measureVirtue] virtue.result.jumble: ' + virtue.result.jumble);
            console.log('[measureVirtue] virtue.result.scramble: ' + virtue.result.scramble);
            console.log('[measureVirtue] virtue.result.success: ' + virtue.result.success);
            console.log('[measureVirtue] virtue.result.completed: ' + virtue.result.completed);
            console.log('[measureVirtue] virtue.result.value: ' + virtue.result.value);
            console.log('[measureVirtue] virtue.result.value_zonal: ' + virtue.result.value_zonal);
            console.log('[measureVirtue] virtue.result.value_length: ' + virtue.result.value_length);
            console.log('[measureVirtue] virtue.result.value_length_percentage: ' + virtue.result.value_length_percentage);
            console.log('[measureVirtue] virtue.result.datetime_start_epoch: ' + virtue.result.datetime_start_epoch);
            console.log('[measureVirtue] virtue.result.datetime_end_epoch: ' + virtue.result.datetime_end_epoch);
            console.log('[measureVirtue] virtue.result.datetime_start_iso: ' + virtue.result.datetime_start_iso);
            console.log('[measureVirtue] virtue.result.datetime_end_iso: ' + virtue.result.datetime_end_iso);
            console.log('[measureVirtue] virtue.result.datetime_duration_ms: ' + virtue.result.datetime_duration_ms);
            console.log('[measureVirtue] virtue.result.datetime_stopwatch: ' + virtue.result.datetime_stopwatch);
            console.log('[measureVirtue] virtue.result.rate_hit_per_min: ' + virtue.result.rate_hit_per_min);

            // Unit progress
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
            console.log('[measureVirtue] virtue.result.other_num_new: ' + virtue.result.other_num_new);

            // Unit cumulative
            console.log('[measureVirtue] virtue.result.shot_num_total: ' + virtue.result.shot_num_total);
            console.log('[measureVirtue] virtue.result.hit_num_total: ' + virtue.result.hit_num_total);
            console.log('[measureVirtue] virtue.result.hit_num_total_percentage: ' + virtue.result.hit_num_total_percentage);
            console.log('[measureVirtue] virtue.result.miss_num_total: ' + virtue.result.miss_num_total);
            console.log('[measureVirtue] virtue.result.miss_num_total_percentage: ' + virtue.result.miss_num_total_percentage);
            console.log('[measureVirtue] virtue.result.amend_num_total: ' + virtue.result.amend_num_total);
            console.log('[measureVirtue] virtue.result.amend_num_total_percentage: ' + virtue.result.amend_num_total_percentage);
            console.log('[measureVirtue] virtue.result.other_num_total: ' + virtue.result.other_num_total);
            console.log('[measureVirtue] virtue.result.other_num_total_percentage: ' + virtue.result.other_num_total_percentage);
        }
        return started;
    };

    return {
        libraryId: '',
        collectionId: '',
        id: '',
        disabled: disabled,
        value: value,
        charactersCounter: charactersCounter,
        virtue: virtue,
        newleaf: newleaf,
        newlife: newlife,
        measureVirtue: measureVirtue,
    };
};
// A representation of a memory of books
var BookLibrary = function() {
    return {
        id: '',
        index: [],
        recalled: false
    };
};
var BookCollection = function() {
    return {
        libraryId: '',
        id: '',
        index: [],
        recalled: false
    };
};
var Book = function() {
    return {
        libraryId: '',
        collectionId: '',
        id: '',
        content: '',
        recalled: false
    }
};
// A representation of memory: working memory, short-term memory, and long-term memory.
var Memory = function() {

    // Mental representation of the physical and social environment
    var environment = {
        state: '',
        playmodes: {
            shuffleglobal: 'shuffleglobal',
            shuffle: 'shuffle',
            repeat: 'repeat',
            repeatone: 'repeatone',
        },
        playmode: 'shuffleglobal',
        perfection : true,
        jumble : false,
        scramble : false,
        statistics: true,
    };

    // Mental representations of books
    var bookLibraries = {};
    var bookCollections = {};
    var books = {};
    var bookCount = 0;
    var workingMemoryLibraryId = '';
    var workingMemoryCollectionId = '';
    var workingMemoryBookId = '';

    // Fetch content from long-term memory
    var fetch = function (params) {
        var method = params.method;
        var url = params.url;
        var callback = params.callback;
        var callbackOnError = params.callbackOnError;
        var callbackData = typeof(params.callbackData) !== 'undefined' ? params.callbackData : null;
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
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                var status = xhr.status;
                if (status === 0 || (status >= 200 && status < 400)) {
                    // Success
                    if (callback) {
                        callback.apply(callbackData.self, [ readbody(xhr), callbackData ]);
                    }
                }else {
                    // Error
                    if (callbackOnError) {
                        callbackOnError.apply(callbackData.self, [ callbackData ]);
                    }
                }
            }

            // Debug
            if (State.debug) {
                console.log('[xhr.onreadystatechange] :' + xhr.readyState);
                console.log('[xhr.status] :' + xhr.status);
            }
        };
        xhr.open(method, url);
        xhr.send(null);
    };

    // Retrieval
    var getBook = function() {
        return books[this.workingMemoryBookId];
    };

    var getBooksOfCollectionId = function(collectionId) {
        var _books = {};
        for(var k in books) {
            if (books[k].collectionId === collectionId) {
                _books[k] = books[k];
            }
        }
        return _books;
    };

    var getBookOfId = function(bookId) {
        return bookId in books ? books[bookId] : null;
    };

    var getCollectionsOfLibraryId = function(libraryId) {
        var _collections = {};
        for(var k in bookCollections) {
            if (bookCollections[k].libraryId === libraryId) {
                _collections[k] = bookCollections[k];
            }
        }
        return _collections;
    }

    var getFollowingBook = function() {
        var book;
        var books = getBooksOfCollectionId(this.workingMemoryCollectionId);
        var keys = Object.keys(books);
        var currIndex = keys.indexOf(this.workingMemoryBookId);
        var nextIndex = currIndex + 1 < keys.length ? currIndex + 1 : 0;
        var nextKey = keys[nextIndex];
        var book = books[nextKey];
        return book;
    };

    var getNextBook = function() {
        var _book, _books;
        var availableBooks = [];
        switch(environment.playmode) {
            case environment.playmodes.repeatone:
                _book = this.getBook();
                // book = book && !book.complete ? book : null
                break;
            case environment.playmodes.repeat:
                _book = getFollowingBook.call(this);
                break;
            case environment.playmodes.shuffle:
                _books = getBooksOfCollectionId(this.workingMemoryCollectionId);
                for(var k in _books) {
                    if (!_books[k].complete) {
                        availableBooks.push(_books[k]);
                    }
                }
                _book = availableBooks.length === 0 ? null : availableBooks[Math.floor(Math.random() * availableBooks.length)];
                break;
            case environment.playmodes.shuffleglobal:
                _books = books;
                for(var k in _books) {
                    if (!_books[k].complete) {
                        availableBooks.push(_books[k]);
                    }
                }
                _book = availableBooks.length === 0 ? null : availableBooks[Math.floor(Math.random() * availableBooks.length)];
                break;
            default:
                break;
        }
        return _book;
    };

    // Have I been refreshed with all books?
    var isReady = function() {
        var _this = this;

        // Ensure all entities are recognized
        if (Object.keys(bookLibraries).length === 0 || Object.keys(bookCollections).length === 0 || Object.keys(books).length === 0 ) {
            return false;
        }

        // Ensure all libraries are recalled
        for (var k in _this.bookLibraries) {
            if (_this.bookLibraries[k].recalled === false) {
                return false;
            }
        }
        // Ensure all collections are recalled
        for (var k in _this.bookCollections) {
            if (_this.bookCollections[k].recalled === false) {
                return false;
            }
        }

        // Ensure all books are recalled
        for (var k in _this.books) {
            if (_this.books[k].recalled === false) {
                return false;
            }
        }
        return true;
    };

    // Recollection of knowledge
    var recall = function(bookLibraryIds, callbackOnSuccess, callbackOnError) {
        var _this = this;
        recallLibraries.apply(_this, [bookLibraryIds, function() {
            // Once recollection is done
            _this.bookCount = Object.keys(_this.books).length;
            callbackOnSuccess();
        }, function() {
            // Recollection failed
            callbackOnError();
        }]);
    };

    // Recollection of book libraries
    var recallLibraries = function(bookLibraryIds, callbackOnSuccess, callbackOnError) {
        var _this = this;

        // Recognize and recall libraries
        var bookLibrary;
        for (var i = 0; i < bookLibraryIds.length; i++) {
            // Recognize
            bookLibrary = BookLibrary();
            bookLibrary.id = bookLibraryIds[i];
            _this.bookLibraries[bookLibrary.id] = bookLibrary;
            // Recall
            recallLibrary.apply(_this, [bookLibrary, function() {
                // Ensure all libraries are recalled
                for (var k in _this.bookLibraries) {
                    if (_this.bookLibraries[k].recalled === false) {
                        return;
                    }
                }
                callbackOnSuccess();
            }, callbackOnError]);
        }
    };

    // Recollection of a book library
    var recallLibrary = function(bookLibrary, callbackOnSuccess, callbackOnError) {
        var _this = this;
        fetch({
            method: 'GET',
            url: bookLibrary.id,
            callback: function(_bookCollectionStr, data) {
                // Recognize and recall collections
                data.bookLibrary.index = _bookCollectionStr.split(/\r\n|\n/).filter(function (v) { return v !== ''; }); //.slice(0,1);
                var k, bookCollection;
                for (var i = 0; i < data.bookLibrary.index.length; i++) {
                    k = data.bookLibrary.index[i];

                    // Recognize
                    bookCollection = BookCollection();
                    bookCollection.libraryId = data.bookLibrary.id;
                    bookCollection.id = k;
                    data.bookCollections[k] = bookCollection;
                    // Recall
                    recallCollection.apply(data.self, [bookCollection, function() {
                        // Ensure all collections are recalled
                        var k;
                        for (var i = 0; i < data.bookLibrary.index.length; i++) {
                            k = data.bookLibrary.index[i];
                            if (data.bookCollections[k].recalled === false) {
                                return;
                            }
                        }
                        // Recalled library
                        data.bookLibrary.recalled = true;
                        data.callbackOnSuccess();
                    }]);
                };
            },
            callbackOnError: callbackOnError,
            callbackData: {
                self: _this,
                bookLibrary: bookLibrary,
                bookCollections: _this.bookCollections,
                callbackOnSuccess: callbackOnSuccess
            }
        });
    };

    // Recollection of a library collection
    var recallCollection = function(bookCollection, callback) {
        var _this = this;
        fetch({
            method: 'GET',
            url: bookCollection.id,
            callback: function(_bookIdsStr, data) {
                data.bookCollection.index = _bookIdsStr.split(/\r\n|\n/).filter(function (v) { return v !== ''; }); //.slice(0,1);

                // Recognize and recall books
                var k, book;
                for (var i = 0; i < data.bookCollection.index.length; i++) {
                    // Recognize
                    k = data.bookCollection.index[i];
                    book = Book();
                    book.libraryId = data.bookCollection.libraryId;
                    book.collectionId = data.bookCollection.id;
                    book.id = k;
                    data.books[k] = book;

                    // Recall
                    recallBook.apply(data.self, [book, function() {
                        // Ensure all books are recalled
                        var k;
                        for (var i = 0; i < data.bookCollection.index.length; i++) {
                            k = data.bookCollection.index[i];
                            if (data.books[k].recalled === false) {
                                return;
                            }
                        }
                        data.bookCollection.recalled = true;
                        data.callback()
                    }])
                }
            },
            callbackData: {
                self: _this,
                bookCollection: bookCollection,
                books: _this.books,
                callback: callback
            }
        });
    };

    // Recollection of libary collection book
    var recallBook = function(book, callback) {
        var _this = this;
        fetch({
            method: 'GET',
            url: book.id,
            callback: function(_bookContentStr, data) {
                // Recalled book
                data.book.content = _bookContentStr;
                data.book.recalled = true;
                data.callback();
            },
            callbackData: {
                self: _this,
                book: book,
                callback: callback
            }
        });
    };

    return {
        environment: environment,
        bookLibraries: bookLibraries,
        bookCollections, bookCollections,
        books: books,
        bookCount: bookCount,
        workingMemoryLibraryId: workingMemoryLibraryId,
        workingMemoryCollectionId: workingMemoryCollectionId,
        workingMemoryBookId: workingMemoryBookId,
        getBook: getBook,
        getBooksOfCollectionId: getBooksOfCollectionId,
        getBookOfId: getBookOfId,
        getCollectionsOfLibraryId: getCollectionsOfLibraryId,
        getNextBook, getNextBook,
        isReady: isReady,
        recall: recall,
    };
};
var Trainer = function() {
    var memory = Memory();
    var truth = Bubble('Get ready...');
    var speech = Bubble('');

    var completeCurrentBook = function() {
        return memory.getBook().complete = true;
    };

    var getCollectionsOfLibraryId = function(libraryId) {
        return memory.getCollectionsOfLibraryId(libraryId);
    };

    var getCurrentBook = function() {
        return memory.getBook();
    };

    var getCurrentBookContent = function() {
        return memory.getBook().content;
    };

    var getNextBook = function() {
        var nextBook = memory.getNextBook();
        return nextBook ? nextBook : null;
    };

    var getNextBookContent = function() {
        var nextBook = memory.getNextBook();
        return nextBook ? nextBook.content : null;
    };

    var getBookOfId = function(bookId) {
        return memory.getBookOfId(bookId);
    };

    var getBooksOfCollectionId = function(collectionId) {
        return memory.getBooksOfCollectionId(collectionId);
    };

    var isKnowledgeReady = function() {
        return memory.isReady();
    };

    var prepareKnowledge = function(bookLibraryIds, callbackOnSuccess, callbackOnError) {
        recallKnowledge(bookLibraryIds, function() {
            if (bookLibraryIds) {
                var collections = getCollectionsOfLibraryId(bookLibraryIds[0]);
                var books = getBooksOfCollectionId(Object.keys(collections)[0]);
                setAttention(books[Object.keys(books)[0]]);
            }else {
                setAttention();
            }
            callbackOnSuccess();
        }, callbackOnError);
    };

    var recallKnowledge = function(bookLibraryIds, callbackOnSuccess, callbackOnError) {
        memory.recall(bookLibraryIds, callbackOnSuccess, callbackOnError);
    };

    var setAttention = function(book) {
        var book = book ? book : memory.getNextBook();
        if (book) {
            setCurrentBook(book);
        }
    };

    var setCurrentBook = function(book) {
        memory.workingMemoryLibraryId = book.libraryId;
        memory.workingMemoryCollectionId = book.collectionId;
        memory.workingMemoryBookId = book.id;
    };

    var setNextBook = function() {
        completeCurrentBook();
        var nextBook = getNextBook();
        if (nextBook) {
            setCurrentBook(nextBook);
            return nextBook;
        }
        return null;
    };

    return {
        truth: truth,
        speech: speech,
        memory: memory,
        getCollectionsOfLibraryId: getCollectionsOfLibraryId,
        getCurrentBook: getCurrentBook,
        getCurrentBookContent: getCurrentBookContent,
        getNextBook: getNextBook,
        getNextBookContent: getNextBookContent,
        getBooksOfCollectionId: getBooksOfCollectionId,
        getBookOfId: getBookOfId,
        isKnowledgeReady: isKnowledgeReady,
        prepareKnowledge: prepareKnowledge,
        setCurrentBook: setCurrentBook,
        setNextBook: setNextBook,
    };
};
var Student = function() {
    return {
        response: Bubble(''),
        focusElement: null,

        // My virtue
        virtue: StudentVirtue(),
        virtueSnapshot: StudentVirtue(),

        // My behavioral virtues
        virtues: {
            count: 0,
            values: []
        },

        focus: function() {
            this.focusElement.focus();
        },
        reflectVirtue: function(virtue, populateGlobal, cumulateGlobal) {
            var _student = this;

            // Populate my virtue (Unit meta)
            _student.virtue.result.libraryId = virtue.result.libraryId;
            _student.virtue.result.collectionId = virtue.result.collectionId;
            _student.virtue.result.id = virtue.result.id;
            _student.virtue.result.perfection = virtue.result.perfection;
            _student.virtue.result.jumble = virtue.result.jumble;
            _student.virtue.result.scramble = virtue.result.scramble;
            _student.virtue.result.success = virtue.result.success;
            _student.virtue.result.completed = virtue.result.completed;
            _student.virtue.result.value = virtue.result.value;
            _student.virtue.result.value_zonal = virtue.result.value_zonal;
            _student.virtue.result.value_length = virtue.result.value_length;
            _student.virtue.result.value_length_percentage = virtue.result.value_length_percentage;
            _student.virtue.result.datetime_start_epoch = virtue.result.datetime_start_epoch;
            _student.virtue.result.datetime_end_epoch = virtue.result.datetime_end_epoch;
            _student.virtue.result.datetime_start_iso = virtue.result.datetime_start_iso;
            _student.virtue.result.datetime_end_iso = virtue.result.datetime_end_iso;
            _student.virtue.result.datetime_duration_ms = virtue.result.datetime_duration_ms;
            _student.virtue.result.datetime_stopwatch = virtue.result.datetime_stopwatch;

            // Populate my virtue (Unit rate)
            _student.virtue.result.rate_hit_per_min = virtue.result.rate_hit_per_min;

            // Populate my virtue (Unit progress)
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

            // Populate my virtue (Unit cumulative)
            _student.virtue.result.shot_num_total = virtue.result.shot_num_total;
            _student.virtue.result.hit_num_total = virtue.result.hit_num_total;
            _student.virtue.result.hit_num_total_percentage = virtue.result.hit_num_total_percentage;
            _student.virtue.result.miss_num_total = virtue.result.miss_num_total;
            _student.virtue.result.miss_num_total_percentage = virtue.result.miss_num_total_percentage;
            _student.virtue.result.amend_num_total = virtue.result.amend_num_total;
            _student.virtue.result.amend_num_total_percentage = virtue.result.amend_num_total_percentage;
            _student.virtue.result.other_num_total = virtue.result.other_num_total;
            _student.virtue.result.other_num_total_percentage = virtue.result.other_num_total_percentage;

            // Populate my virtue (Global)
            if (populateGlobal) {
                var datetime_duration_ms_global_virtues = 0;
                var rate_hit_per_min_virtues = 0;
                for (var i = 0 ; i < _student.virtues.values.length; i++) {
                    datetime_duration_ms_global_virtues += _student.virtues.values[i].result.datetime_duration_ms;
                    rate_hit_per_min_virtues += _student.virtues.values[i].result.rate_hit_per_min;
                }
                _student.virtue.result.datetime_duration_ms_global = Math.round( ( datetime_duration_ms_global_virtues + virtue.result.datetime_duration_ms ) );
                _student.virtue.result.datetime_stopwatch_global = Helpers.getStopwatchValue( _student.virtue.result.datetime_duration_ms_global );
                _student.virtue.result.rate_hit_per_min_global = parseFloat(( ( rate_hit_per_min_virtues + virtue.result.rate_hit_per_min ) / ( _student.virtues.values.length + 1 ) ).toFixed(2));
            }
            if (cumulateGlobal) {
                _student.virtue.result.shot_num_global += virtue.result.shot_num_new;
                _student.virtue.result.hit_num_global += virtue.result.hit_num_new;
                _student.virtue.result.hit_num_global_percentage = _student.virtue.result.hit_num_global == 0 ? 0.00 : parseFloat((_student.virtue.result.hit_num_global / _student.virtue.result.shot_num_global * 100).toFixed(2));
                _student.virtue.result.miss_num_global += virtue.result.miss_num_new;
                _student.virtue.result.miss_num_global_percentage = _student.virtue.result.miss_num_global == 0 ? 0.00 : parseFloat((_student.virtue.result.miss_num_global / _student.virtue.result.shot_num_global * 100).toFixed(2));
                _student.virtue.result.amend_num_global += virtue.result.amend_num_new;
                _student.virtue.result.amend_num_global_percentage = _student.virtue.result.amend_num_global == 0 ? 0.00 : parseFloat((_student.virtue.result.amend_num_global / _student.virtue.result.shot_num_global * 100).toFixed(2));
                _student.virtue.result.other_num_global += virtue.result.other_num_new;
                _student.virtue.result.other_num_global_percentage = _student.virtue.result.other_num_global == 0 ? 0.00 : parseFloat((_student.virtue.result.other_num_global / _student.virtue.result.shot_num_global * 100).toFixed(2));
            }
        },
        newleaf: function() {
            // Erase my last known behavior
            this.response.newleaf();
            // Revert to my last known virtue without behavioural natures
            this.restoreVirtue();
        },
        inheritVirtue: function(virtue) {
            var _student = this;
            virtue.graduate();
            // Pocket the virtue
            _student.stashVirtue(virtue);
            // Reset my behavior virtue and snapshot it
            _student.virtue.newlife();
            _student.snapshotVirtue();
            // Create a new behavior virtue
            _student.response.newlife();
        },
        snapshotVirtue: function() {
            for (var k in this.virtue.result) {
                this.virtueSnapshot.result[k] = this.virtue.result[k];
            }
        },
        restoreVirtue: function() {
            for (var k in this.virtue.result) {
                this.virtue.result[k] = this.virtueSnapshot.result[k];
            }
            // Reset the behavioural nature
            this.virtue.newlife();
        },
        setFocus: function(element) {
            this.focusElement = element;
        },
        stashVirtue: function(virtue) {
            var _student = this;
            _student.virtues.values.push(virtue);
            _student.virtues.count += 1;
        }
    }
};
var Training = function() {
    var trainer = Trainer();
    var student = Student();

    var prepare = function(bookLibraryIds, callbackOnSuccess, callbackOnError) {
        // Begin the training with a trainer's intro speech
        student.response.newlife();
        start();
        student.response.disabled = true;

        trainer.prepareKnowledge(bookLibraryIds, function() {
            // Ignore the intro response virtue
            student.response.newlife();
            student.response.disabled = false;

            // Start the training
            start();
            student.focus();

            if (callbackOnSuccess) {
                callbackOnSuccess();
            }
        }, function() {
            if (callbackOnError) {
                callbackOnError();
            }
        });
    };

    var start = function() {
        // Set truth values
        var book = trainer.getCurrentBook();
        if (book) {
            trainer.truth.libraryId = book.libraryId;
            trainer.truth.collectionId = book.collectionId;
            trainer.truth.id = book.id;
            trainer.truth.value = (function() {
                if (trainer.memory.environment.jumble) {
                    return Helpers.jumbleText(book.content);
                }else if (trainer.memory.environment.scramble) {
                    return Helpers.scrambleText(book.content);
                }else {
                    return book.content;
                }
            })();
        }
        trainer.truth.charactersCounter = trainer.truth.value.length;

        // Validate student response
        var virtue = student.response.virtue;
        student.response.measureVirtue(trainer.truth, trainer.memory.environment);

        // Set trainer speech value
        trainer.speech.value = virtue.result.value_zonal;
        trainer.speech.charactersCounter = trainer.truth.value.length;

        if (State.debug) {
            console.log('[Training][start] trainer.speech.value: ' + trainer.speech.value);
            console.log('[Training][start] trainer.speech.charactersCounter: ' + trainer.speech.charactersCounter);
        }
    };

    var complete = function(virtue) {
        // Pocket student virtue
        student.inheritVirtue(virtue);
    };

    var improvise = function(book) {
        // Forget my last behavior
        student.newleaf();
        // Set a new book
        trainer.setCurrentBook(book);
        start();
    };

    var next = function() {
        var _this = this;

        if (trainer.setNextBook()) {
            start();
        }else {
            end();
        }
    };

    var end = function() {
        // Set the end message
        trainer.truth.value = 'Training complete. You have graduated.';
        trainer.speech.value = trainer.truth.value;

        // Disable the student response
        student.response.disabled = true;

        // Validate student response
        var virtue = student.response.virtue;
        student.response.measureVirtue(trainer.truth, trainer.memory.environment);
        // Set trainer speech value
        trainer.speech.value = virtue.result.value;
    }

    return {
        trainer: trainer,
        student: student,
        complete: complete,
        improvise: improvise,
        next: next,
        prepare: prepare,
        start: start,
    };
};

// Global store of components
var Components = {};
var Component = function(c) {

    // Store this components in global
    Components[c.name] = c;
    c.bindings = [];

    var rootElement, results;

    var createElementFromHTML = function(html) {
        var div = document.createElement('div');
        div.innerHTML = html.trim();

        // Change this to div.childNodes to support multiple top-level nodes
        return div.firstChild;
    };

    var creatingBindings = function(rootElement) {
        var allElements = rootElement.getElementsByTagName('*');
        var matches, propsPaths, object, property, binding, events, addedBinding;
        for (var i = 0; i < allElements.length; i++) {
            var ele = allElements[i];

            // Parse elements' attributes for events, and object properties specified in attribute value  '{{ .obj.someprop }}'
            for (var j = 0, atts = ele.attributes; j < atts.length; j++) {

                addedBinding = false;

                // Get any eventListeners
                matches = /b-on/.exec(atts[j].name);
                if (matches && matches.length > 0) {
                    events = atts[j].value.split(',').filter(function (v) { return v !== ''; });
                }
                // Create data binding to attribute. E.g. '{{ .foo }}'
                binding = null;
                matches = /\{\{([^\}]+)\}\}/.exec(atts[j].value);
                if (matches && matches.length > 0) {
                    object = c.props;
                    propsPaths = matches[1].trim().split('.').filter(function (v) { return v !== ''; });
                    if (propsPaths.length > 1) {
                        for (var _ = 0; _ < propsPaths.length - 1; _++) {
                            if (propsPaths[_] !== '') {
                                object = object[propsPaths[_]];
                            }
                        }
                        property = propsPaths[propsPaths.length - 1];
                    }else {
                        property = propsPaths[0];
                    }
                    // Search for existing object binding
                    for (var key in c.bindings) {
                        if (key === matches[1].trim()) {
                            binding = c.bindings[key];
                            break;
                        }
                    }
                    binding = binding ? binding : Binding({
                        object: object,
                        property: property
                    });
                    if (events) {
                        for (var e = 0; e < events.length; e++) {
                            binding.addBinding(
                                ele,
                                /^class$/i.test(atts[j].name) ? 'className' : atts[j].name, // e.g. 'someattr' or 'innerHTML'
                                events[e], // e.g. 'click'
                                c.eventsListeners[events[e]], // callback,
                                c // callbackThisObj
                            );
                        }
                    }else {
                        binding.addBinding(
                            ele,
                            /^class$/i.test(atts[j].name) ? 'className' : atts[j].name, // e.g. 'someattr' or 'innerHTML'
                        );
                    }
                    // Store the binding
                    c.bindings[matches[1].trim()] = binding;
                    addedBinding = true;
                }
            }
            // Or data bind to innerHTML
            binding = null;
            matches = /\{\{([^\}]+)\}\}/.exec(ele.innerHTML);
            if (matches && matches.length > 0) {
                object = c.props;
                propsPaths = matches[1].trim().split('.').filter(function (v) { return v !== ''; });
                if (propsPaths.length > 1) {
                    for (var _ = 0; _ < propsPaths.length - 1; _++) {
                        if (propsPaths[_] !== '') {
                            object = object[propsPaths[_]];
                        }
                    }
                    property = propsPaths[propsPaths.length - 1];
                }else {
                    property = propsPaths[0];
                }
                    // Search for existing object binding
                    for (var key in c.bindings) {
                        if (key === matches[1].trim()) {
                            binding = c.bindings[key];
                            break;
                        }
                    }
                binding = binding ? binding : Binding({
                    object: object,
                    property: property
                });
                if (events) {
                    for (var e = 0; e < events.length; e++) {
                        binding.addBinding(
                            ele,
                            'innerHTML', // e.g. 'someattr' or 'innerHTML'
                            events[e],  // e.g. 'click'
                            c.eventsListeners[events[e]], // callback,
                            c // callbackThisObj
                        )
                    }
                }else {
                    binding.addBinding(
                        ele,
                        'innerHTML'
                    );
                }
                // Store the binding
                c.bindings[matches[1].trim()] = binding;
                addedBinding = true;
            }

            // If there is no data binding, simply set up the eventListeners
            if (!addedBinding) {
                if (events) {
                    var _ele, handler;
                    for (var e = 0; e < events.length; e++) {
                        _ele = /DOM|ready/.test(events[e]) ? document : ele;
                         handler = c.eventsListeners[events[e]];
                        _ele.addEventListener(events[e], function(event){
                            handler.apply(c, [event]);
                        });
                    }
                }
            }
        }
    };


    // Create the DOM element
    var rootElement = createElementFromHTML(c.template);
    if (rootElement) {
        if (/select/i.test(rootElement.nodeName)) {
            // Create its <option> elements
            var createSelectOptions = (function() {
                var _selectElement = rootElement.getElementsByTagName('select')[0];
                var optionElement;
                for (var i = 0; i < c.props.options.length; i++) {
                    optionElement = document.createElement('option');
                    if (component.props.options[i] === component.value) {
                        optionElement.setAttribute('selected', true);
                    }
                    optionElement.setAttribute('value', component.props.options[i]);
                    optionElement.innerHTML = decodeURIComponent(component.props.options[i].replace(/.+\/([^\/]+)$/, '$1'));
                    _selectElement.appendChild(optionElement);
                }
            })();
            // Create the DOM element
            c.parentElement.appendChild(rootElement);

            // Create data bindings
            creatingBindings(rootElement);
        }else {
            // Create the DOM element
            c.parentElement.appendChild(rootElement);

            // Create data bindings
            creatingBindings(rootElement);
        }
    }
};

// Controllers
var TrainingController = function () {
    var _training = State.training;

    // Data binding - Component: menu
    var environment = _training.trainer.memory.environment;
    Binding({
        object: environment,
        property: "state"
    })
    .addBinding(
        document.getElementsByTagName('menu')[0].getElementsByTagName('environment')[0],
        'className',
    );
    // Event listeners - Component: menu environment
    document.getElementsByTagName('menu')[0].getElementsByTagName('environment')[0].getElementsByTagName('menubutton')[0].addEventListener('click', function(element, event) {
        environment.state = environment.state === '' ? 'customize' : '';
    });
    document.getElementsByTagName('menu')[0].getElementsByTagName('environment')[0].getElementsByTagName('backdrop')[0].addEventListener('click', function(element, event) {
        environment.state = environment.state === '' ? 'customize' : '';
    });
    // Components
    Component({
        parentElement: document.getElementsByTagName('menu')[0].getElementsByTagName('environment')[0].getElementsByTagName('popup')[0],
        name: 'menuselect_booklibraries',
        template: `
            <menuselect>
                <label>{{ .label }}</label>
                <select b-on="DOMContentLoaded,change" title="{{ ._training.trainer.memory.workingMemoryLibraryId }}"></select>
                <input class="hidden" b-on="keyup" type="text" placeholder="enter url of library..." />
                <add b-on="click" title="Add a library">{{ .addStatus }}</add>
            </menuselect><br />
        `,
        props: {
            label: 'library',
            addStatus: '+',
            _training: _training,
            customBookLibraryId: '',
            get options() {
                return Object.keys(_training.trainer.memory.bookLibraries);
            },
        },
        methods: {
            createSelectOptions: function(c, binding) {
                var ele = binding ? binding.element : c.bindings['._training.trainer.memory.workingMemoryLibraryId'].elementBindings[0].element;
                // Remove all options elements
                ele.innerHTML = '';
                // Recreate all options elements
                var optionElement;
                for (var i = 0; i < c.props.options.length; i++) {
                    optionElement = document.createElement('option');
                    if (c.props.options[i] === c.props._training.trainer.memory.workingMemoryLibraryId) {
                        optionElement.setAttribute('selected', true);
                    }
                    optionElement.setAttribute('value', c.props.options[i]);
                    optionElement.innerHTML = decodeURIComponent(c.props.options[i]);
                    ele.appendChild(optionElement);
                }
            },
            loadBookLibrary: function(c, bookLibraryId) {
                var bookLibraryIds = [bookLibraryId];
                c.methods.toggleAddStatus(c, '.');
                c.props._training.prepare(bookLibraryIds, function() {
                    c.methods.toggleAddStatus(c, '+');
                    c.methods.createSelectOptions(c);
                    c.methods.updateCollectionsAndBooks(c, bookLibraryId);
                    Components.menuselect_bookcollections.methods.createSelectOptions(Components.menuselect_bookcollections);
                    Components.menuselect_books.methods.createSelectOptions(Components.menuselect_books);
                }, function() {
                    c.methods.toggleAddStatus(c, '!');
                });
            },
            updateCollectionsAndBooks: function(c, libraryId) {
                var collections = c.props._training.trainer.getCollectionsOfLibraryId(libraryId);
                var keys, collection;
                if (collections) {
                    keys = Object.keys(collections);
                    if (keys.length > 0) {
                        collection = collections[keys[0]];
                        Components.menuselect_bookcollections.methods.createSelectOptions(Components.menuselect_bookcollections);

                        var books = c.props._training.trainer.getBooksOfCollectionId(collection.id);
                        var keys, book;
                        if (books) {
                            keys = Object.keys(books);
                            if (keys.length > 0) {
                                book = books[keys[0]]
                                c.props._training.improvise(book);

                                Components.menuselect_books.methods.createSelectOptions(Components.menuselect_books);
                            }
                        }
                    }
                }
            },
            toggleAddStatus: function(c, statusNew) {
               var status = c.props.addStatus;

                // No status provided. Dynamically determine the new status based on existing status.
                if (typeof(statusNew) === 'undefined') {
                    switch(status) {
                        case '+':
                            statusNew = '-'
                            break;
                        case '-':
                        case '!':
                            statusNew = '+'
                            break;
                        case '.':
                            break;
                        default:
                            break;
                    }
                }
                switch(statusNew) {
                    // default
                    case '+':
                        c.bindings['._training.trainer.memory.workingMemoryLibraryId'].elementBindings[0].element.removeAttribute('class');
                        c.parentElement.getElementsByTagName('input')[0].className = 'hidden';
                        c.parentElement.getElementsByTagName('input')[0].disabled = true;
                        c.parentElement.getElementsByTagName('input')[0].value = '';
                        // c.bindings['.addStatus'].elementBindings[0].element.removeAttribute('class');
                        break;
                    // adding
                    case '-':
                        c.bindings['._training.trainer.memory.workingMemoryLibraryId'].elementBindings[0].element.className = 'hidden';
                        c.parentElement.getElementsByTagName('input')[0].removeAttribute('class');
                        c.parentElement.getElementsByTagName('input')[0].removeAttribute('disabled');
                        c.parentElement.getElementsByTagName('input')[0].focus();
                        // c.bindings['.addStatus'].elementBindings[0].element.removeAttribute('class');
                        break;
                    // loading
                    case '.':
                        c.bindings['._training.trainer.memory.workingMemoryLibraryId'].elementBindings[0].element.className = 'hidden';
                        c.parentElement.getElementsByTagName('input')[0].className = 'loading';
                        c.parentElement.getElementsByTagName('input')[0].removeAttribute('disabled');
                        // c.bindings['.addStatus'].elementBindings[0].element.className = 'adding';
                        break;
                    // loading error
                    case '!':
                        c.bindings['._training.trainer.memory.workingMemoryLibraryId'].elementBindings[0].element.className = 'hidden';
                        c.parentElement.getElementsByTagName('input')[0].className = 'error';
                        c.parentElement.getElementsByTagName('input')[0].removeAttribute('disabled');
                        c.parentElement.getElementsByTagName('input')[0].focus();
                        // c.bindings['.addStatus'].elementBindings[0].element.removeAttribute('class');
                        break;
                    default:
                        break;
                }
                c.props.addStatus = statusNew;
            }
        },
        eventsListeners: {
            DOMContentLoaded: function(event, _this, binding) {
                var c = this;
                _training.prepare(State.bookLibraryIds, function() {
                    c.methods.createSelectOptions(c, binding);
                    Components.menuselect_bookcollections.methods.createSelectOptions(Components.menuselect_bookcollections);
                    Components.menuselect_books.methods.createSelectOptions(Components.menuselect_books);
                });
            },
            change: function(event, _this, binding) {
                var c = this;
                var valueNew = binding.element.value;
                c.props._training.trainer.memory.workingMemoryLibraryId = valueNew;
                c.methods.updateCollectionsAndBooks(c, valueNew);
            },
            keyup: function(event, _this, binding) {
                var c = this;
                var ele = ele = event.target || event.srcElement;
                var key = event.keyCode || event.charCode;
                var value = ele.value.trim();
                // ENTER key
                if (key === 13) {
                    c.methods.loadBookLibrary(c, value)
                }
            },
            click: function(event, _this, binding) {
                var c = this;
                c.methods.toggleAddStatus(c);
            }
        }
    });
    Component({
        parentElement: document.getElementsByTagName('menu')[0].getElementsByTagName('environment')[0].getElementsByTagName('popup')[0],
        name: 'menuselect_bookcollections',
        template: `
        <menuselect><label>{{ .label }}</label><select b-on="change" title="{{ ._training.trainer.memory.workingMemoryCollectionId }}"></select></menuselect><br />
        `,
        props: {
            label: 'collection',
            _training: _training,
            get options() {
                return Object.keys(_training.trainer.getCollectionsOfLibraryId(_training.trainer.memory.workingMemoryLibraryId));
            },
        },
        methods: {
            createSelectOptions: function(c, binding) {
                var ele = binding ? binding.element : c.bindings['._training.trainer.memory.workingMemoryCollectionId'].elementBindings[0].element;
                // Remove all options elements
                ele.innerHTML = '';
                // Recreate all options elements
                var optionElement;
                for (var i = 0; i < c.props.options.length; i++) {
                    optionElement = document.createElement('option');
                    if (c.props.options[i] === c.props._training.trainer.memory.workingMemoryCollectionId) {
                        optionElement.setAttribute('selected', true);
                    }
                    optionElement.setAttribute('value', c.props.options[i]);
                    optionElement.innerHTML = decodeURIComponent(c.props.options[i].replace(/.+\/([^\/]+)$/, '$1'));
                    ele.appendChild(optionElement);
                }
            }
        },
        eventsListeners: {
            change: function(event, _this, binding) {
                var c = this;
                var valueNew = binding.element.value;
                var books = c.props._training.trainer.getBooksOfCollectionId(valueNew);
                var keys, book;
                if (books) {
                    keys = Object.keys(books);
                    if (keys.length > 0) {
                        book = books[keys[0]]
                        c.props._training.improvise(book);

                        Components.menuselect_books.methods.createSelectOptions(Components.menuselect_books);
                    }
                }
            }
        }
    });
    Component({
        parentElement: document.getElementsByTagName('menu')[0].getElementsByTagName('environment')[0].getElementsByTagName('popup')[0],
        name: 'menuselect_books',
        template: `
            <menuselect><label>{{ .label }}</label><select b-on="change" title="{{ ._training.trainer.memory.workingMemoryBookId }}"></select></menuselect><br />
        `,
        props: {
            label: 'book',
            _training: _training,
            get options() {
                var book = this._training.trainer.getCurrentBook();
                if (book) {
                    var books = this._training.trainer.getBooksOfCollectionId(book.collectionId);
                    var bookIds = Object.keys(books);
                    return bookIds;
                }
                return [];
            },
        },
        methods: {
            createSelectOptions: function(c, binding) {
                var ele = binding ? binding.element : c.bindings['._training.trainer.memory.workingMemoryBookId'].elementBindings[0].element;
                // Remove all options elements
                ele.innerHTML = '';
                // Recreate all options elements
                var optionElement;
                var book = c.props._training.trainer.getCurrentBook();
                if (book) {
                    for (var i = 0; i < c.props.options.length; i++) {
                        optionElement = document.createElement('option');
                        if (c.props.options[i] === book.id) {
                            optionElement.setAttribute('selected', true);
                        }
                        optionElement.setAttribute('value', c.props.options[i]);
                        optionElement.innerHTML = decodeURIComponent(c.props.options[i].replace(/.+\/([^\/]+)$/, '$1'));
                        ele.appendChild(optionElement);
                    }
                }
            }
        },
        eventsListeners: {
            change: function(event, _this, binding) {
                var c = this;
                var valueNew = binding.element.value;
                c.props._training.trainer.memory.workingMemoryBookId = valueNew;
                var book = c.props._training.trainer.getCurrentBook();
                if (book) {
                    c.props._training.improvise(book);
                }
            }
        }
    });
    Component({
        parentElement: document.getElementsByTagName('menu')[0].getElementsByTagName('environment')[0].getElementsByTagName('popup')[0],
        name: 'menumultiswitch-playmode',
        template: `
            <menumultiswitch><label>playmode</label><symbol b-on="DOMContentLoaded,click" title="{{ ._training.trainer.memory.environment.playmode }}"></symbol></menumultiswitch>
        `,
        props: {
            _training: _training
        },
        methods: {
            updateSymbol: function(c, binding, playMode) {
                var html;
                switch(playMode) {
                    case c.props._training.trainer.memory.environment.playmodes.repeatone:
                        html = '<emoji>🔂</emoji>';
                        break;
                    case c.props._training.trainer.memory.environment.playmodes.repeat:
                        html = '<emoji>🔁</emoji>';
                        break;
                    case c.props._training.trainer.memory.environment.playmodes.shuffle:
                        html = '<emoji>🔀</emoji><span>1</span>';
                        break;
                    case c.props._training.trainer.memory.environment.playmodes.shuffleglobal:
                        html = '<emoji>🔀</emoji>';
                        break;
                    default:
                        break;
                }
                binding.element.innerHTML = html;
                binding.element.className = playMode;
            }
        },
        eventsListeners: {
            DOMContentLoaded: function(event, _this, binding) {
                var c = this;
                c.methods.updateSymbol(c, binding, c.props._training.trainer.memory.environment.playmode);
            },
            click: function(event, _this, binding) {
                var c = this;
                var nextPlaymode = (function() {
                    var keys = Object.keys(c.props._training.trainer.memory.environment.playmodes);
                    var currIndex = keys.indexOf(c.props._training.trainer.memory.environment.playmode);
                    var nextIndex = currIndex + 1 < keys.length ? currIndex + 1 : 0;
                    return c.props._training.trainer.memory.environment.playmodes[keys[nextIndex]];
                })();
                c.props._training.trainer.memory.environment.playmode = nextPlaymode;
                c.methods.updateSymbol(c, binding, nextPlaymode);
                event.stopPropagation()
            }
        }
    });
    Component({
        parentElement: document.getElementsByTagName('menu')[0].getElementsByTagName('environment')[0].getElementsByTagName('popup')[0],
        name: 'menuswitch',
        template: `
            <menuswitch><label>perfection</label><switch b-on="click" class="{{ ._training.trainer.memory.environment.perfection }}"><handle></handle></switch></menuswitch>
        `,
        props: {
            _training: _training
        },
        eventsListeners: {
            click: function(event, _this, binding) {
                var c = this;
                var newVal = !c.props._training.trainer.memory.environment.perfection;
                c.props._training.trainer.memory.environment.perfection = newVal;
                event.stopPropagation()
            }
        }
    });
    Component({
        parentElement: document.getElementsByTagName('menu')[0].getElementsByTagName('environment')[0].getElementsByTagName('popup')[0],
        name: 'menuswitch_jumble',
        template: `
            <menuswitch><label>jumble</label><switch b-on="click" class="{{ ._training.trainer.memory.environment.jumble }}"><handle></handle></switch></menuswitch>
        `,
        props: {
            _training: _training
        },
        eventsListeners: {
            click: function(event, _this, binding) {
                var c = this;
                var newVal = !c.props._training.trainer.memory.environment.jumble;
                c.props._training.trainer.memory.environment.jumble = newVal;
                event.stopPropagation();

                // If scramble is on, turn it off
                if (newVal === true) {
                    if (c.props._training.trainer.memory.environment.scramble === true) {
                        c.props._training.trainer.memory.environment.scramble = false;
                    }
                }

                // Start the jumbled text
                c.props._training.improvise(_training.trainer.getCurrentBook());
            }
        }
    });
    Component({
        parentElement: document.getElementsByTagName('menu')[0].getElementsByTagName('environment')[0].getElementsByTagName('popup')[0],
        name: 'menuswitch_scramble',
        template: `
            <menuswitch><label>scramble</label><switch b-on="click" class="{{ ._training.trainer.memory.environment.scramble }}"><handle></handle></switch></menuswitch>
        `,
        props: {
            _training: _training
        },
        eventsListeners: {
            click: function(event, _this, binding) {
                var c = this;
                var newVal = !c.props._training.trainer.memory.environment.scramble;
                c.props._training.trainer.memory.environment.scramble = newVal;
                event.stopPropagation()


                // If jumble is on, turn it off
                if (newVal === true) {
                    if (c.props._training.trainer.memory.environment.jumble === true) {
                        c.props._training.trainer.memory.environment.jumble = false;
                    }
                }

                // Start the scrambled text
                c.props._training.improvise(_training.trainer.getCurrentBook());
            }
        }
    });
    Component({
        parentElement: document.getElementsByTagName('menu')[0].getElementsByTagName('environment')[0].getElementsByTagName('popup')[0],
        name: 'menuswitch',
        template: `
            <menuswitch><label>statistics</label><switch b-on="click" class="{{ ._training.trainer.memory.environment.statistics }}"><handle></handle></switch></menuswitch>
        `,
        props: {
            _training: _training
        },
        eventsListeners: {
            click: function(event, _this, binding) {
                var c = this;

                // Toggle. JSON.parse() to cast string to boolean
                var newVal = !c.props._training.trainer.memory.environment.statistics;
                c.props._training.trainer.memory.environment.statistics = newVal;
                // _this.value = newVal;
                // _this.valueSetter(newVal);
                document.getElementsByTagName('statistics')[0].style.display = newVal === true ? 'block' : 'none';
                event.stopPropagation()
            }
        }
    });
    Component({
        parentElement: document.getElementsByTagName('menu')[0].getElementsByTagName('environment')[0].getElementsByTagName('popup')[0],
        name: 'menuexport',
        props: {
            _training: _training
        },
        template: `
            <menuexport><label>virtues</label><download b-on="click">download</download></menuexport>
        `,
        eventsListeners: {
            click: function(event) {
                var c = this;
                // var ele = event.target || event.srcElement;
                var data = {
                    virtue: c.props._training.student.virtue,
                    virtues: c.props._training.student.virtues
                };
                var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 4));
                var downloadAnchorNode = document.createElement('a');
                downloadAnchorNode.setAttribute("href", dataStr);
                downloadAnchorNode.setAttribute("download", "virtues.json");
                document.body.appendChild(downloadAnchorNode); // required for firefox
                downloadAnchorNode.click();
                downloadAnchorNode.remove();
                event.stopPropagation()
            }
        }
    });

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
            if (State.debug) {
                console.log('[DOMContentLoaded]');
            }

            // _training.prepare();

            // Might want to get data on init
            // _training.next()
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
            _training.student.setFocus(binding.element);
            _training.student.focus();
        }
    ).addBinding(
        document.getElementsByTagName('response')[0].getElementsByTagName('textarea')[0],
        'value',    // textarea
        "keyup",
        function(event, _this, binding) {
            var key = event.keyCode || event.charCode;

            // Set student response. Remove all CRs
            _this.valueSetter(binding.element[binding.attribute].replace(/\r/g, ''));
            // Set student response counter
            _training.student.response.charactersCounter = _training.student.response.value.length;

            var virtue = _training.student.response.virtue;
            // Validate student response
            var started = _training.student.response.measureVirtue(_training.trainer.truth, _training.trainer.memory.environment, key);

            // Update student virtue every interval
            if (started) {
                (function() {
                    // Store reference to this virtue
                    var _virtue = virtue;
                    const intervalMilliseconds = 100;
                    var intervalId = setInterval(function() {
                        if (_virtue.result.datetime_start_epoch === 0 || _virtue.result.completed) {
                            if (State.debug) {
                                console.log('[keyup][interval] delete ' + ' ');
                            }
                            clearInterval(intervalId);
                        }else {
                            // if (State.debug) {
                            //     console.log('[keyup][interval] ');
                            // }
                            _training.student.reflectVirtue(_virtue, true, false);
                        }
                    }, intervalMilliseconds);
                    if (State.debug) {
                        console.log('[keyup][interval] create');
                    }
                })();
            }
            // Set trainer speech value
            _training.trainer.speech.value = virtue.result.value_zonal;
            // Update student virtue non-time-based stats
            _training.student.reflectVirtue(virtue, true, true);
            if (virtue.result.completed) {
                // Run the next training unit
                _training.complete(virtue);
                _training.next();

                // Update environment books
                Components.menuselect_books.methods.createSelectOptions(Components.menuselect_books);
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
        object: _training.student.virtue.result,
        property: "value_length"
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
        property: "value_length_percentage"
    }).addBinding(
        document.getElementsByTagName('unitprogress')[0].getElementsByTagName('characterspercentagecounter')[0].getElementsByTagName('value')[0],
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
        property: "datetime_start_iso"
    }).addBinding(
        document.getElementsByTagName('unitoverall')[0].getElementsByTagName('datetimestart')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _training.student.virtue.result,
        property: "datetime_stopwatch"
    }).addBinding(
        document.getElementsByTagName('unitoverall')[0].getElementsByTagName('datetimestopwatch')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _training.student.virtue.result,
        property: "shot_num_total"
    }).addBinding(
        document.getElementsByTagName('unitoverall')[0].getElementsByTagName('shotcounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _training.student.virtue.result,
        property: "rate_hit_per_min"
    }).addBinding(
        document.getElementsByTagName('unitoverall')[0].getElementsByTagName('ratehitpermincounter')[0].getElementsByTagName('value')[0],
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
    new Binding({
        object: _training.student.virtue.result,
        property: "other_num_total"
    }).addBinding(
        document.getElementsByTagName('unitoverall')[0].getElementsByTagName('othercounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _training.student.virtue.result,
        property: "other_num_total_percentage"
    }).addBinding(
        document.getElementsByTagName('unitoverall')[0].getElementsByTagName('otherpercentagecounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );

    // Data binding - Component: globaloverall
    new Binding({
        object: _training.student.virtue.result,
        property: "datetime_stopwatch_global"
    }).addBinding(
        document.getElementsByTagName('globaloverall')[0].getElementsByTagName('datetimestopwatch')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _training.student.virtue.result,
        property: "rate_hit_per_min_global"
    }).addBinding(
        document.getElementsByTagName('globaloverall')[0].getElementsByTagName('ratehitpermincounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
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
        object: _training.student.virtue.result,
        property: "other_num_global"
    }).addBinding(
        document.getElementsByTagName('globaloverall')[0].getElementsByTagName('othercounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _training.student.virtue.result,
        property: "other_num_global_percentage"
    }).addBinding(
        document.getElementsByTagName('globaloverall')[0].getElementsByTagName('otherpercentagecounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _training.student.virtues,
        property: "count"
    }).addBinding(
        document.getElementsByTagName('globaloverall')[0].getElementsByTagName('unitcounter')[0].getElementsByTagName('value')[0],
        'innerHTML'
    );
    new Binding({
        object: _training.trainer.memory,
        property: "bookCount"
    }).addBinding(
        document.getElementsByTagName('globaloverall')[0].getElementsByTagName('unitcounter')[0].getElementsByTagName('total')[0],
        'innerHTML'
    );
}

// App state
var State = function() {
    return {
        bookLibraryIds: [
            'https://touchtypie.github.io/touchtypie-libraries/libraries/daily.txt'
        ],
        debug: false,
        training: Training()
    }
}();
var myApp = function () {
    TrainingController();
}();