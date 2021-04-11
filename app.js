var Helpers = function () {
    return {
        htmlEntities: function htmlEntities(str) {
            return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/ /, '&nbsp;');
        }
    };
}()

// Models
var Bubble = function (element, value) {
    var o = {
        element: element,
        props: {
            value: '',
            characters: []
        },
        setValue: function (value) {
            this.props.value = value;
            this.props.characters = value.split('')
        }
    };
    o.setValue(value);

    return o;
};
var Counter = function (element, value) {
    var o = {
        element: element,
        props: {
            value: 0,
        },
        setValue: function (value) {
            this.props.value = value;
        }
    };
    o.setValue(value);

    return o;
}

// Controller
var BubbleController = function (o) {
    var speech = Bubble(o.bubbles[0], o.bubbles[0].innerHTML);
    var response = Bubble(o.bubbles[1], o.bubbles[1].value); // Textarea value
    var characterCounter = Counter(o.counters[0], response.props.characters.length);
    var incorrectCharacterCounter = Counter(o.counters[1], 0);

    // Private
    var characterizeBubble = function (bubble) {
        // var domElements = [];
        bubble.element.innerHTML = '';
        for (var i = 0; i < bubble.props.characters.length; i++) {
            characterElement = document.createElement('span');
            characterElement.innerHTML = Helpers.htmlEntities(bubble.props.characters[i]);
            // domElements.push(characterElement);
            bubble.element.appendChild(characterElement);
        }
    };
    var markNormalBubble = function (ele, characterIndex) {
        ele.getElementsByTagName('span')[characterIndex].className = '';
    }
    var markInvalidBubble = function (ele, characterIndex) {
        ele.getElementsByTagName('span')[characterIndex].className = 'invalid';
    }
    var markValidBubble = function (ele, characterIndex) {
        ele.getElementsByTagName('span')[characterIndex].className = 'valid';
    }
    var onKeyDown = function (e) {
        console.log('[onKeyDown]');

        // Data binding
        var ele = e.target;
        response.setValue(ele.value); // Textarea
        characterCounter.setValue(ele.value); // Textarea
        console.log('[keyup] ele.value: ' + ele.value);
        console.log('[keyup] ele.value.length: ' + ele.value.length);
        console.log('[keyup] response.props.characters: ' + response.props.characters);
        console.log('[keyup] response.props.characters.length: ' + response.props.characters.length);

        // Mark
        if (response.props.characters.length == 0) {
            for (var i = 0; i < speech.props.characters.length; i++) {
                markNormalBubble(speech.element, i);
            }
        }
        if (response.props.characters.length > 0) {
            var errNum = 0;
            for (var i = 0; i < response.props.characters.length; i++) {
                if (response.props.characters[i] !== speech.props.characters[i]) {
                    markInvalidBubble(speech.element, i);
                    errNum++;
                } else {
                    markValidBubble(speech.element, i);
                }
            }
            for (var i = response.props.characters.length; i < speech.props.characters.length; i++) {
                markNormalBubble(speech.element, i);
            }

            characterCounter.setValue(response.props.characters.length);
            characterCounter.element.getElementsByTagName('span')[0].innerHTML = Helpers.htmlEntities(response.props.characters.length + '/' + speech.props.characters.length);

            incorrectCharacterCounter.setValue(errNum);
            incorrectCharacterCounter.element.getElementsByTagName('span')[0].innerHTML  = Helpers.htmlEntities(errNum);
        }
    }

    var initBinds = function () {};
    var initBubbles = function () {
        characterizeBubble(speech);
    };

    // Public
    var init = function () {
        // Event listeners
        initBinds();

        // Characterization
        initBubbles()
    };

    return {
        init: init,
        onKeyDown: onKeyDown,
        response: response
    };
}

var HomeworkCounterController = function (homeworkCounterElement) {
    var homeworkCounter = Counter(homeworkCounterElement, 0);

    var initBinds = function () {};

    var onKeyDown = function() {
        homeworkCounter.element.innerHTML += 1;
    }

    // Public
    var init = function () {
        // Event listeners
        initBinds();
    };

    return {
        init: init
    };
}

var myApp = function () {
    var bc = BubbleController({
        bubbles: [
            document.getElementsByTagName('speech')[0].getElementsByTagName('content')[0],
            document.getElementsByTagName('response')[0].getElementsByTagName('textarea')[0],
        ],
        counters: [
            document.getElementsByTagName('counters')[0].getElementsByTagName('charactercounter')[0],
            document.getElementsByTagName('counters')[0].getElementsByTagName('incorrectcharactercounter')[0],
        ]
    });
    var cc = HomeworkCounterController(
        document.getElementsByTagName('counters')[0].getElementsByTagName('homeworkcounter')[0],
    )
    bc.response.element.addEventListener('keyup', function (e) {
        bc.onKeyDown(e);
    });

    console.log(bc)
    bc.init();
}();
