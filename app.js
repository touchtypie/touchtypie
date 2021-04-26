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
        const peekIndices= getPeekIndices(bubble, truth);
        const startIndex = peekIndices[0];
        const endIndex = peekIndices[1];
        virtue.result.value = getFeedbackHtmlValue(
            bubble.value.length == 0 ? bubble.value : bubble.value.substring(startIndex, endIndex + 1 < bubble.value.length ? endIndex + 1: bubble.value.length ),
            truth.value.substring(startIndex, endIndex + 1)
        );
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
var Book = function() {
    return {
        id: '',
        content: ''
    }
};
// A representation of memory: working memory, short-term memory, and long-term memory.
var Memory = function() {
    // Mental representations of books
    var bookCollectionIds = [ 'https://leojonathanoh.github.io/bible_databases/links/links.txt' ];
    var books = {};
    var bookCount;
    var bookIds = [];
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
        xhr.onreadystatechange = function(event, event) {
            if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200 || xhr.readyState == XMLHttpRequest.DONE && xhr.status == 304) {
                if (callback) {
                    callback(readbody(xhr), callbackData);
                }
            }

            // Debug
            if (State.debug) {
                console.log('[xhr.onreadystatechange] :' + xhr.readyState);
                console.log('[xhr.status] :' + xhr.status);
                if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 0) {
                    if (callback) {
                        callback('zzz', callbackData);
                    }
                }
            }
        };
        xhr.open(method, url);
        xhr.send(null);
    };

    // Retrieval
    var getBook = function() {
        var _this = this;
        return books[_this.workingMemoryBookId];
    };

    var getNextBook = function() {
        var _this = this;
        var keys = Object.keys(books);
        var nextIndex = keys.indexOf(_this.workingMemoryBookId) + 1;
        if (nextIndex !== -1) {
            var nextKey = keys[nextIndex];
            _this.workingMemoryBookId = nextKey;
            return _this.getBook();
        }else {
            return null;
        }
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

    // Working memory
    var prepareWorkingMemory = function() {
        var _this = this;
        this.workingMemoryBookId = Object.keys(books)[0];
    };

    // Recollection
    var recall = function(callback) {
        var _this = this;
        fetch({
            method: 'GET',
            url: bookCollectionIds[0],
            callback: function(bookIds) {
                recallBooks(_this, bookIds, function() {
                    // Once all books are recalled are done, call the callback
                    if (isReady()) {
                        callback();
                    }
                });
            }
        });
    };

    // Recollection of books and their content
    var recallBooks = function(_this, bookIds, callback) {
        // Recall reading the book
        _this.bookIds = bookIds.split(/\r\n|\n/) //.slice(0,1);
        for (var i = 0; i < _this.bookIds.length; i++) {
            var book = Book();
            book.id = _this.bookIds[i];
            _this.books[book.id] = book;
        }
        _this.bookCount = _this.bookIds.length;

        // Refresh my memory of its content
        for (var k in _this.books) {
            fetch({
                method: 'GET',
                url: _this.books[k].id,
                callback: function(text, data) {
                    var _this = data.self;
                    var key = data.key;
                    _this.books[key].content = text;
                    callback();
                },
                callbackData: { self: _this, key: k }
            });
        }
    };

    return {
        books: books,
        bookIds: bookIds,
        bookCount: bookCount,
        workingMemoryBookId: workingMemoryBookId,
        getBook: getBook,
        getNextBook: getNextBook,
        isReady: isReady,
        prepareWorkingMemory: prepareWorkingMemory,
        recall: recall,
    };
};
var Trainer = function() {
    var memory = Memory();
    var truth = Bubble('Get ready...');
    var speech = Bubble('');

    var getTopics = function() {
        return memory.bookIds;
    };

    var getCurrentTopic = function() {
        return memory.getBook().id;
    };

    var getCurrentTopicContent = function() {
        return memory.getBook().content;
    };

    var getNextTopicContent = function() {
        return memory.getNextBook().content;
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
        memory.prepareWorkingMemory();
    };

    var setCurrentTopic = function(bookId) {
        memory.workingMemoryBookId = bookId;
    };

    return {
        truth: truth,
        speech: speech,
        memory: memory,
        getTopics: getTopics,
        getCurrentTopic: getCurrentTopic,
        getCurrentTopicContent: getCurrentTopicContent,
        getNextTopicContent: getNextTopicContent,
        isKnowledgeReady: isKnowledgeReady,
        prepareKnowledge: prepareKnowledge,
        setCurrentTopic: setCurrentTopic,
    };
};
var Student = function() {
    return {
        response: Bubble(''),
        focusElement: null,
        units: {
            count: 0,
            num_total: 0
        },
        virtue: BubbleVirtue(),
        virtues: {
            count: 0,
            values: []
        },
        focus: function() {
            this.focusElement.focus();
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
        setFocus: function(element) {
            this.focusElement = element;
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

    var prepare = function(callback) {
        var _this = this;

        // Begin the training with a trainer's intro speech
        _this.start();

        _this.student.response.disabled = true;
        _this.trainer.prepareKnowledge(function() {
            _this.student.response.disabled = false;
            _this.start(_this.trainer.getCurrentTopicContent());
            _this.student.focus();

            if (callback) {
                callback();
            }
        });
    };

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
        start(_this.trainer.getNextTopicContent());
    };

    return {
        trainer: trainer,
        student: student,
        next: next,
        prepare: prepare,
        start: start,
    };
};

// Controllers
var TrainingController = function () {
    var _training = State.training;

    var recreateTopicSelectOptions = function(event, _this, binding) {
        // If new topic was selected, change to that topic
        var topic = _training.trainer.getCurrentTopic();
        var topicNew = binding.element.value;
        if (topic !== topicNew) {
            // On DOMContenteLoaded, the .value is empty
            if (topicNew === '') {
                topicNew = topic;
            }
            _training.trainer.setCurrentTopic(topicNew);
            _training.start(_training.trainer.getCurrentTopicContent());

            // Remove all options
            binding.element.innerHTML = '';
            // Recreate all options
            var topics = _training.trainer.getTopics();
            var optionElement;
            for (var i = 0; i < topics.length; i++) {
                optionElement = document.createElement('option');
                if (topics[i] === _training.trainer.getCurrentTopic()) {
                    optionElement.setAttribute('selected', true);
                }
                optionElement.setAttribute('value', topics[i]);
                optionElement.innerHTML = decodeURIComponent(topics[i].replace(/.+\/([^\/]+)$/, '$1'));
                binding.element.appendChild(optionElement);
            }

        }
    };

    // Data binding - Component: topics
    Binding({
        object: _training.trainer.memory,
        property: "workingMemoryBookId"
    })
    .addBinding(
        document.getElementsByTagName('topics')[0].getElementsByTagName('select')[0],
        'value',
        'DOMContentLoaded',
        function(event, _this, binding) {
            _training.prepare(function() {
                recreateTopicSelectOptions(event, _this, binding);
                // Fire the change event to populate this element with <option> elements
                // binding.element.onchange();
                // binding.element.dispatchEvent(new Event('change'));
            });
        }
    )
    .addBinding(
        document.getElementsByTagName('topics')[0].getElementsByTagName('select')[0],
        'innerHTML',
        'change',
        recreateTopicSelectOptions
    );

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
