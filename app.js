function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(' ', '&nbsp;');
}

// Model
var Bubble = function(element, content) {
    return {
        element: element,
        props: {
            value: content,
            characters: content.split('')
        }
    };
};

// Controller
var BubbleController = function(speechElement, speechHighlightElement, responseElement) {
    var speech = Bubble(speechElement, speechElement.innerHTML);
    // var speechHighlight = Bubble(speechHighlightElement, speechHighlightElement.innerHTML);
    var response = Bubble(responseElement, responseElement.value);  // Textarea value

    // Private
    var characterizeBubble = function(bubble) {
        // var domElements = [];
        bubble.element.innerHTML = '';
        for (var i = 0; i < bubble.props.characters.length; i++) {
            characterElement = document.createElement('span');
            characterElement.innerHTML = bubble.props.characters[i];
            // domElements.push(characterElement);
            bubble.element.appendChild(characterElement);
        }
    };
    var markBubbleValid = function(ele, characterIndex) {
        ele.getElementsByTagName('span')[characterIndex].className = 'valid';
    }
    var markBubbleInvalid = function(ele, characterIndex) {
        spee;ele.getElementsByTagName('span')[characterIndex].className = 'invalid';
    }

    var initBubbles = function() {
        characterizeBubble(speech);
    };
    var initBinds = function() {
        response.element.addEventListener('onkeyup', function(ele) {
            // Get
            response.characters = ele.value; // Textarea
            // Check
            for (i = 0; i < response.characters.length; i++) {
                if (response.characters[i] === speech.characters[i]) {
                    markBubbleValid(speech, i);
                }else {
                    markBubbleInvalid(speech, i);
                }
            }
        });
    };

    // Public
    var init = function() {
        // Event listeners
        initBinds();

        // Characterization
        initBubbles()

    };

    return {
        init: init
    };
}

var myApp = function() {
    var touchtypie = BubbleController(
        document.getElementsByTagName('speech')[0].getElementsByTagName('content')[0],
        document.getElementsByTagName('speech')[0].getElementsByTagName('highlight')[0],
        document.getElementsByTagName('response')[0].getElementsByTagName('textarea')[0]
    );

    console.log(touchtypie)
    touchtypie.init();
}();

