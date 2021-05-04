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
var BubbleVirtue = function() {
    var newVirtue = function() {
        return {
            // Unit meta
            libraryId: '',
            collectionId: '',
            id: '',
            perfection: false,
            success: false,
            completed: false,
            value: '',
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
        this.result.success = false;
        this.result.completed = false;
        this.result.value = '';
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
        this.result.value = '<redacted>';
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
    var virtue = BubbleVirtue();

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
    var id = '';
    var disabled = false;
    var value = default_value;
    var charactersCounter = 0;

    var virtue = BubbleVirtue();

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
        this.virtue = BubbleVirtue();
    };

    // Returns two indices representing a peek (substring) in truth proximal to the current bubble cursor
    var getPeekIndices = function(bubble, truth) {
        const cursorIndex = bubble.value.length > 0 ? bubble.value.length - 1: 0;

        // By default the peak (substring) around the cursor is x maximum characters
        const maxLength = 100;
        var startIndex = cursorIndex - ((maxLength / 2) - 1) > 0 ? cursorIndex - ((maxLength / 2) - 1) : 0
        var endIndex = cursorIndex + ((maxLength / 2) - 1) < maxLength ? cursorIndex + ((maxLength / 2) - 1) : maxLength;
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
                console.log('startIndex: ' + startIndex);
                console.log('endIndex: ' + endIndex);
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

    // Populates this bubble's BubbleVirtue object, when this bubble.value is measured against truth.value
    var measureVirtue = function(truth, key, perfection) {
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
                        // if (State.debug) {
                        //     console.log('[measureVirtue][interval] delete');
                        // }
                        clearInterval(intervalId);
                    }else {
                        // if (State.debug) {
                        //     console.log('[measureVirtue][interval] _virtue.result.datetime_duration_ms: ' + _virtue.result.datetime_duration_ms);
                        // }
                        var now = new Date();
                        _virtue.result.datetime_duration_ms = now.valueOf() - virtue.result.datetime_start_epoch;
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
        virtue.result.other_num_new = virtue.result.shot_num_new && bubble.value.length === value_length_prev ? 1 : virtue.result.amend_num_new;

        // for (var i = bubble.value.length; i < truth.value.length; i++) {
        //     // Valid
        // }

        // Populate result
        virtue.result.libraryId = truth.libraryId;
        virtue.result.collectionId = truth.collectionId;
        virtue.result.id = truth.id;
        virtue.result.perfection = perfection;
        virtue.result.success = virtue.result.miss_indices.length == 0 ? true : false;
        const peekIndices= getPeekIndices(bubble, truth);
        const startIndex = peekIndices[0];
        const endIndex = peekIndices[1];
        virtue.result.value = getFeedbackHtmlValue(
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

        if ( (perfection && virtue.result.success && bubble.value.length == truth.value.length) ||
             (!perfection && bubble.value.length == truth.value.length)
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
            console.log('[measureVirtue] virtue.result.success: ' + virtue.result.success);
            console.log('[measureVirtue] virtue.result.completed: ' + virtue.result.completed);
            console.log('[measureVirtue] virtue.result.value: ' + virtue.result.value);
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
        id: id,
        disabled: disabled,
        value: value,
        charactersCounter: charactersCounter,
        virtue: virtue,
        newleaf: newleaf,
        newlife: newlife,
        measureVirtue: measureVirtue,
    };
};
var Book = function() {
    return {
        libraryId: '',
        collectionId: '',
        id: '',
        content: ''
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
        randomization : true,
        perfection : true,
        statistics: true,
    };

    // Mental representations of books
    var bookLibraryIds = [
        'https://leojonathanoh.github.io/typie-library/libraries/daily.txt'
    ];
    var books = {};
    var bookCount = 0;
    var bookCollectionIds = [];
    var bookIds = [];
    var workingMemoryLibraryId = '';
    var workingMemoryCollectionId = '';
    var workingMemoryBookId = '';

    // Fetch content from long-term memory
    var fetch = function (params) {
        var method = params.method;
        var url = params.url;
        var callback = params.callback;
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
            if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200 || xhr.readyState == XMLHttpRequest.DONE && xhr.status == 304) {
                if (callback) {
                    callback.apply(callbackData.self, [ readbody(xhr), callbackData ]);
                }
            }

            // Debug
            if (State.debug) {
                console.log('[xhr.onreadystatechange] :' + xhr.readyState);
                console.log('[xhr.status] :' + xhr.status);
                if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 0) {
                    if (callback) {
                        callback.apply(callbackData.self, [ 'zzz', callbackData ]);
                    }
                }
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

    var getFirstIncompleteBook = function() {
        // Get the first incomplete book
        var incompleteBook;
        for (var k in books) {
            if (!books[k].complete) {
                incompleteBook = books[k];
                break;
            }
        }
        return incompleteBook ? incompleteBook : null;
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
        for (var k in books) {
            if (books[k].content === '') {
                return false;
            }
        }
        return Object.keys(books).length > 0 ? true : false;
    };

    // Recollection of libraries
    var recall = function(callback) {
        var _this = this;
        var _bookCollectionIdsTmp = [];
        var _bookIdsTmp = [];
        for (var i = 0; i < bookLibraryIds.length; i++) {
            fetch({
                method: 'GET',
                url: bookLibraryIds[i],
                callback: function(_bookCollectionStr, data) {
                    recallCollections.apply(data.self, [_bookCollectionStr, data._bookLibraryId, data._bookCollectionIdsTmp, data._bookIdsTmp, function() {
                        // Once all books are recalled are done, call the callback
                        if (isReady()) {
                            data.self.bookCollectionIds = _bookCollectionIdsTmp;
                            data.self.bookIds = _bookIdsTmp;
                            data.self.bookCount = _bookIdsTmp.length;
                            callback();
                        }
                    }])
                },
                callbackData: {
                    self: _this,
                    _bookLibraryId: bookLibraryIds[i],
                    _bookCollectionIdsTmp: _bookCollectionIdsTmp,
                    _bookIdsTmp: _bookIdsTmp
                }
            });
        }
    };

    // Recollection of library collections
    var recallCollections = function(_bookCollectionStr, _bookLibraryId, _bookCollectionIdsTmp, _bookIdsTmp, callback) {
        var _this = this;
        // Recall this collection
        var _bookCollectionIds = _bookCollectionStr.split(/\r\n|\n/).filter(function (v) { return v !== ''; }); //.slice(0,1);
        for (var i = 0; i < _bookCollectionIds.length; i++) {
            _bookCollectionIdsTmp.push(_bookCollectionIds[i])
        };

        for (var i = 0; i < _bookCollectionIds.length; i++) {
            fetch({
                method: 'GET',
                url: _bookCollectionIds[i],
                callback: function(_bookIdsStr, data) {
                    recallBooks.apply(data.self, [_bookIdsStr, data._bookLibraryId, data._bookCollectionId, data._bookIdsTmp, callback])
                },
                callbackData: {
                    self: _this,
                    _bookLibraryId: _bookLibraryId,
                    _bookCollectionId: _bookCollectionIds[i],
                    _bookIdsTmp: _bookIdsTmp,
                }
            });
        }
    };

    // Recollection of libary collections' books and their content
    var recallBooks = function(_bookIdsStr, _bookLibraryId, _bookCollectionId, _bookIdsTmp, callback) {
        var _this = this;
        // Recall reading the book
        var _bookIds = _bookIdsStr.split(/\r\n|\n/).filter(function (v) { return v !== ''; }); //.slice(0,1);
        for (var i = 0; i < _bookIds.length; i++) {
            _bookIdsTmp.push(_bookIds[i])
        };
        for (var i = 0; i < _bookIds.length; i++) {
            var book = Book();
            book.libraryId = _bookLibraryId;
            book.collectionId = _bookCollectionId;
            book.id = _bookIds[i];
            books[book.id] = book;
        }

        // Refresh my memory of its content
        for (var k in books) {
            fetch({
                method: 'GET',
                url: books[k].id,
                callback: function(text, data) {
                    var key = data.key;
                    books[key].content = text;
                    callback();
                },
                callbackData: { self: _this, key: k }
            });
        }
    };

    return {
        environment: environment,
        books: books,
        bookCollectionIds: bookCollectionIds,
        get bookIds() {
            return bookIds;
        },
        set bookIds(value) {
            bookIds = value;
        },
        bookCount: bookCount,
        workingMemoryLibraryId: workingMemoryLibraryId,
        workingMemoryCollectionId: workingMemoryCollectionId,
        workingMemoryBookId: workingMemoryBookId,
        getBook: getBook,
        getBooksOfCollectionId: getBooksOfCollectionId,
        getBookOfId: getBookOfId,
        getNextBook, getNextBook,
        isReady: isReady,
        recall: recall,
    };
};
var Trainer = function() {
    var memory = Memory();
    var truth = Bubble('Get ready...');
    var speech = Bubble('');

    var completeCurrentTopic = function() {
        return memory.getBook().complete = true;
    };

    var getCurrentTopic = function() {
        return memory.getBook();
    };

    var getCurrentTopicContent = function() {
        return memory.getBook().content;
    };

    var getNextTopic = function() {
        var nextBook = memory.getNextBook();
        return nextBook ? nextBook : null;
    };

    var getNextTopicContent = function() {
        var nextBook = memory.getNextBook();
        return nextBook ? nextBook.content : null;
    };

    var getTopicOfId = function(bookId) {
        return memory.getBookOfId(bookId);
    };

    var getTopicsOfCollectionId = function(collectionId) {
        return memory.getBooksOfCollectionId(collectionId);
    };

    var isKnowledgeReady = function() {
        return memory.isReady();
    };

    var prepareKnowledge = function(callback) {
        if (!isKnowledgeReady()) {
            recallKnowledge(function() {
                setAttention();
                callback();
            });
        }
    };

    var recallKnowledge = function(callback) {
        memory.recall(function() {
            callback();
        });
    };

    var setAttention = function() {
        var book = memory.getNextBook();
        if (book) {
            setCurrentTopic(book);
        }
    };

    var setCurrentTopic = function(book) {
        memory.workingMemoryLibraryId = book.workingMemoryLibraryId;
        memory.workingMemoryCollectionId = book.collectionId;
        memory.workingMemoryBookId = book.id;
    };

    var setNextTopic = function() {
        completeCurrentTopic();
        var nextTopic = getNextTopic();
        if (nextTopic) {
            setCurrentTopic(nextTopic);
            return nextTopic;
        }
        return null;
    };

    return {
        truth: truth,
        speech: speech,
        memory: memory,
        getCurrentTopic: getCurrentTopic,
        getCurrentTopicContent: getCurrentTopicContent,
        getNextTopic: getNextTopic,
        getNextTopicContent: getNextTopicContent,
        getTopicsOfCollectionId: getTopicsOfCollectionId,
        getTopicOfId: getTopicOfId,
        isKnowledgeReady: isKnowledgeReady,
        prepareKnowledge: prepareKnowledge,
        setCurrentTopic: setCurrentTopic,
        setNextTopic: setNextTopic,
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
        inheritVirtue: function(virtue, populateGlobal, cumulateGlobal) {
            var _student = this;

            // Populate my virtue (Unit meta)
            _student.virtue.result.libraryId = virtue.result.libraryId;
            _student.virtue.result.collectionId = virtue.result.collectionId;
            _student.virtue.result.id = virtue.result.id;
            _student.virtue.result.success = virtue.result.success;
            _student.virtue.result.completed = virtue.result.completed;
            _student.virtue.result.value = virtue.result.value;
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

            // Set units value
            virtue.graduate();
            _student.virtues.values.push(virtue);
            _student.virtues.count += 1;
        }
    }
};
var Training = function() {
    var trainer = Trainer();
    var student = Student();

    var prepare = function(callback) {
        // Begin the training with a trainer's intro speech
        start();

        student.response.disabled = true;
        trainer.prepareKnowledge(function() {
            student.response.disabled = false;
            start();
            student.focus();

            if (callback) {
                callback();
            }
        });
    };

    var start = function() {
        // Set truth values
        var topic = trainer.getCurrentTopic();
        if (topic) {
            trainer.truth.libraryId = topic.libraryId;
            trainer.truth.collectionId = topic.collectionId;
            trainer.truth.id = topic.id;
            trainer.truth.value = topic.content;
        }
        trainer.truth.charactersCounter = trainer.truth.value.length;

        // Set trainer speech
        trainer.speech.value = trainer.truth.value;
        trainer.speech.charactersCounter = trainer.speech.value.length;

        // Validate student response
        var virtue = student.response.virtue;
        student.response.measureVirtue(trainer.truth);
        // Set trainer speech value
        trainer.speech.value = virtue.result.value;

        if (State.debug) {
            console.log('[Training][start] trainer.speech.value: ' + trainer.speech.value);
            console.log('[Training][start] trainer.speech.charactersCounter: ' + trainer.speech.charactersCounter);
        }
    };

    var improvise = function(topic) {
        // Forget my last behavior
        student.newleaf();
        // Set a new topic
        trainer.setCurrentTopic(topic);
        start();
    };

    var next = function() {
        var _this = this;
        // Reset the student response
        student.response.newlife();

        if (trainer.setNextTopic()) {
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
        student.response.measureVirtue(trainer.truth);
        // Set trainer speech value
        trainer.speech.value = virtue.result.value;
    }

    return {
        trainer: trainer,
        student: student,
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
    }

    var creatingBindings = function(rootElement) {
        var allElements = rootElement.getElementsByTagName('*');
        var matches, propsPaths, object, property, binding, events;
        for (var i = 0; i < allElements.length; i++) {
            var ele = allElements[i];
            for (var j = 0, atts = ele.attributes; j < atts.length; j++) {
                // Get any eventListeners
                matches = /b-on/.exec(atts[j].name);
                if (matches && matches.length > 0) {
                    events = atts[j].value.split(',').filter(function (v) { return v !== ''; });
                }
                // Create data binding to attribute. E.g. '{{ .foo }}'
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
                    binding = Binding({
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
                    ele.binding = binding;
                    c.bindings.push(binding);
                }
            }
            // Or data bind to innerHTML
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
                binding = Binding({
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
                ele.binding = binding;
                c.bindings.push(binding);
            }

            // If there is no data binding, simply set up the eventListeners
            if (typeof(ele.binding) === 'undefined') {
                if (events) {
                    for (var e = 0; e < events.length; e++) {
                        var handler = c.eventsListeners[events[e]];
                        ele.addEventListener(events[e], function(event){
                            handler.apply(c, [event]);
                        });
                    }
                }
            }
        }
    }


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
        name: 'menuselect_bookcollections',
        template: `
            <menuselect><label>{{ .label }}</label><select b-on="DOMContentLoaded,change" value="{{ ._training.trainer.memory.workingMemoryCollectionId }}"></select></menuselect><br />
        `,
        props: {
            label: 'collection',
            _training: _training,
            get options() {
                return _training.trainer.memory.bookCollectionIds;
            },
        },
        methods: {
            createSelectOptions: function(c, binding) {
                var ele = binding ? binding.element : c.bindings[1].elementBindings[0].element;
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
            DOMContentLoaded: function(event, _this, binding) {
                var c = this;
                _training.prepare(function() {
                    c.methods.createSelectOptions(c, binding);

                    Components.menuselect_books.methods.createSelectOptions(Components.menuselect_books);
                });
            },
            change: function(event, _this, binding) {
                var c = this;
                // If new value was selected, do something
                var valueNew = binding.element.value;
                var value = c.props.value;
                if (valueNew !== value) {
                    // On DOMContentLoaded, the .value is empty
                    if (valueNew === '') {
                        valueNew = value;
                    };

                    var topics = c.props._training.trainer.getTopicsOfCollectionId(valueNew);
                    var keys, topic;
                    if (topics) {
                        keys = Object.keys(topics);
                        if (keys.length > 0) {
                            topic = topics[keys[0]]
                            c.props._training.improvise(topic);
                        }
                    }
                    // c.props._training.trainer.memory.workingMemoryCollectionId = valueNew;

                    Components.menuselect_books.methods.createSelectOptions(Components.menuselect_books);
                }
            }
        }
    });
    Component({
        parentElement: document.getElementsByTagName('menu')[0].getElementsByTagName('environment')[0].getElementsByTagName('popup')[0],
        name: 'menuselect_books',
        template: `
            <menuselect><label>{{ .label }}</label><select b-on="change" value="{{ ._training.trainer.memory.workingMemoryBookId }}"></select></menuselect><br />
        `,
        props: {
            label: 'topic',
            _training: _training,
            get options() {
                var topic = this._training.trainer.getCurrentTopic();
                if (topic) {
                    var topics = this._training.trainer.getTopicsOfCollectionId(topic.collectionId);
                    var topicIds = Object.keys(topics);
                    return topicIds;
                }
                return [];
            },
        },
        methods: {
            createSelectOptions: function(c, binding) {
                var ele = binding ? binding.element : c.bindings[1].elementBindings[0].element;
                // Remove all options elements
                ele.innerHTML = '';
                // Recreate all options elements
                var optionElement;
                var topic = c.props._training.trainer.getCurrentTopic();
                if (topic) {
                    for (var i = 0; i < c.props.options.length; i++) {
                        optionElement = document.createElement('option');
                        if (c.props.options[i] === topic.id) {
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
            // DOMContentLoaded: function(event, _this, binding) {
            //     var c = this;
            //     _training.prepare(function() {
            //         c.methods.createSelectOptions(c, binding);
            //     });
            // },
            change: function(event, _this, binding) {
                var c = this;
                // If new value was selected, do something
                var valueNew = binding.element.value;
                var value = c.props.value;
                if (valueNew !== value) {
                    // On DOMContentLoaded, the .value is empty
                    if (valueNew === '') {
                        valueNew = value;
                    }
                   c.props._training.trainer.memory.workingMemoryBookId = valueNew;
                   var topic = c.props._training.trainer.getCurrentTopic();
                   if (topic) {
                        c.props._training.improvise(topic);
                   }
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
                        html = '🔂';
                        break;
                    case c.props._training.trainer.memory.environment.playmodes.repeat:
                        html = '🔁';
                        break;
                    case c.props._training.trainer.memory.environment.playmodes.shuffle:
                        html = '🔀';
                        break;
                    case c.props._training.trainer.memory.environment.playmodes.shuffleglobal:
                        html = '<circle style="border: 1px solid #fff; border-radius: 50%;">🔀</circle>';
                        break;
                    default:
                        break;
                }
                binding.element.innerHTML = html;
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
                var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(c.props._training.student.virtues));
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
            console.log('[DOMContentLoaded]');

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
            var started = _training.student.response.measureVirtue(_training.trainer.truth, key, environment.perfection);

            // Update student virtue every interval
            if (started) {
                (function() {
                    // Store reference to this virtue
                    var _virtue = virtue;
                    const intervalMilliseconds = 100;
                    var intervalId = setInterval(function() {
                        if (_virtue.result.datetime_start_epoch === 0 || _virtue.result.completed) {
                            // if (State.debug) {
                                console.log('[keyup][interval] delete ' + ' ');
                            // }
                            clearInterval(intervalId);
                        }else {
                            // if (State.debug) {
                            //     console.log('[keyup][interval] ');
                            // }
                            _training.student.inheritVirtue(virtue, true, false);
                        }
                    }, intervalMilliseconds);
                    if (State.debug) {
                        console.log('[keyup][interval] create');
                    }
                })();
            }
                        // Set trainer speech value
            _training.trainer.speech.value = virtue.result.value;
            // Update student virtue non-time-based stats
            _training.student.inheritVirtue(virtue, true, true);
            if (virtue.result.completed) {
                // Snapshot student virtue
                _training.student.snapshotVirtue();
                // Record virtue
                _training.student.stashVirtue(virtue);
                // Reset  virtue
                _training.student.virtue.newlife();

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
        debug: true,
        training: Training()
    }
}();
var myApp = function () {
    TrainingController();
}();
