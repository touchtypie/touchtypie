'use strict';

var Helpers = function () {
    return {
        htmlEntities: function htmlEntities(str) {
            return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/"/g, '&#34;').replace(/ /g, '&nbsp;').replace(/\r?\n/g, '<br />');
        },
        convertToUnderscores: function(object) {
            // E.g. { 'FooBarBaz': 'hello' } becomes { 'foo_bar_baz': 'hello' }
            var objectWithUnderscores = {};
            var underscoredKey;
            for (var k in object) {
                underscoredKey = k.replace(/([A-Z])?/g, function($0, $1) { return $1 ? '_' + $1.toLowerCase() : ''; });
                objectWithUnderscores[underscoredKey] = object[k];
            }

            return objectWithUnderscores;
        },
        copyToClipboard: function(text) {
            var textarea = document.createElement('textarea');
            textarea.innerHTML = text;
            document.body.appendChild(textarea);

            // Synchronous copy
            textarea.focus();
            textarea.select();
            var result = document.execCommand('copy');

            document.body.removeChild(textarea);
            return result;
        },
        getBrowserScrollbarWidth: function() {
            // Gets the native browser's scrollbar width

            // Create a mock scrollbox
            var scrollDiv = document.createElement("div");
            scrollDiv.setAttribute('style', 'width: 100px; height: 100px; overflow: scroll; position: absolute; z-index: -1000;');
            document.body.appendChild(scrollDiv);

            // Get the scrollbar width
            var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

            // Remove the scrollbox
            document.body.removeChild(scrollDiv);

            return scrollbarWidth;
        },
        getUrlParams: function() {
            // E.g. 'key=value' returns { key: 'value' }
            // E.g. 'key=value1&key=value' returns { key: [ 'value1', 'value2' ] }
            var urlParams = {};
            var search = /([^&=]+)=?([^&]*)/g, match, queryString = window.location.search.substring(1), key, value;
            while (match = search.exec(queryString)) {
                try {
                    key = decodeURIComponent(match[1].replace(/\+/g, ' '));
                }catch {
                    key = match[1];
                }
                try {
                    value = decodeURIComponent(match[2].replace(/\+/g, ' '));
                }catch {
                    value = match[2];
                }
                if (key in urlParams) {
                    if (!Array.isArray(urlParams[key])) {
                        urlParams[key] = [urlParams[key]];
                    }
                    urlParams[key].push(value);
                }else {
                    urlParams[key] = value;
                }
            }
            return urlParams;
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
        },
        toSearchUrl: function(urlParams) {
            // E.g. { foo: 'bar' } becomes '?foo=bar'
            // E.g. { foo: [ 'bar, 'baz' ] } becomes '?foo=bar&foo=baz'
            var url = '';
            for (var k in urlParams) {
                if (Array.isArray(urlParams[k])) {
                    for (var i = 0; i < urlParams[k].length; i++) {
                        url += '&' + k + '=' + urlParams[k][i]
                    }
                }else {
                    url += '&' + k + '=' + urlParams[k].toString()
                }
            }

            // Replace leading '&' with '?'
            return url.replace(/^&/, '?');
        },
        isDesktopBrowser: function() {
            // This will return true on Android.
            // This will return false for iOS. iOS does not support fullscreen.
            return navigator.platform.toUpperCase().indexOf('LINUX') >= 0 || navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('WIN') >= 0;
        },
        isFullScreen: function() {
            return document.fullscreenElement || // This should work on most modern browsers
                document.webkitIsFullScreen || document.mozFullscreen ||  // This should work on older browsers
                document.msFullscreenElement || document.fullscreenElement ||
                document.fullscreen || document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                window.innerHeight == screen.height; // This might work for the rest
        },
        enterFullScreen: function(targetEle) {
            var ele = targetEle || document.documentElement;
            if (ele.requestFullScreen) {
                ele.requestFullscreen();
            }else if (ele.webkitRequestFullScreen) {
                ele.webkitRequestFullScreen();
            }else if (ele.mozRequestFullScreen) {
                ele.mozRequestFullScreen();
            }else if(ele.msRequestFullscreen) {
                ele.msRequestFullscreen();
            }
        },
        exitFullScreen: function(targetEle) {
            var ele = targetEle || document.documentElement;
            if (ele.requestFullscreen) {
                console.log('exit');
                document.exitFullscreen();
            }else if (ele.webkitRequestFullscreen) {
                document.webkitCancelFullScreen();
            }else if (ele.mozRequestFullScreen) {
                document.mozCancelFullScreen();
            }else if(ele.msRequestFullscreen){
                document.msExitFullscreen();
            }
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
        };
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
            meditation: false,
            perfection: false,
            jumble: false,
            scramble: false,
            ambience: '',
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
    };
    var result = newVirtue();

    var newleaf = function() {
        // Unit meta
        this.result.meditation = false;
        this.result.perfection = false;
        this.result.jumble = false;
        this.result.scramble = false;
        this.result.ambience = '';
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
    };
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
    var loading = true;
    var disabled = false;
    var placeholder = '';
    var value = default_value;
    var charactersCounter = 0;
    var maxLines = 0;   // No limit
    var lineWidth = 0;
    var characterWidth = 0;

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

    // Returns two indices representing a peek (substring) in truth proximal to the current cursor
    var getPeekIndices = function(bubble, truth, maxLines, lineWidth, characterWidth) {
        // The cursor is one character ahead of the bubble value
        const cursorIndex = bubble.value.length > 0 ? bubble.value.length - 1 + 1: 0;

        // The .clientWidth, .offsetWidth, .scrollWidth of elements round up the actual width. So we discount one character to be safe
        var maxLength = typeof(lineWidth) !== 'undefined' && typeof(characterWidth) !== 'undefined' && lineWidth > 0 && characterWidth > 0 ? Math.floor((lineWidth - 1) / characterWidth) * maxLines: 101;
        // Always keep max length an odd number for an equal padding of characters before and after cursor
        maxLength = maxLength % 2 ? maxLength : maxLength - 1;
        // Pad characters equally on both sides of cursor. i.e. <padCharacters><cursor><padCharacters>
        const padCharacters = Math.floor(maxLength / 2);
        if (State.debug) {
            console.log('[getPeekIndices] lineWidth: ' + lineWidth + ', characterWidth: ' + characterWidth + ', maxLength: ' + maxLength + ', padCharacters: ' + padCharacters);
        }

        var startIndex, endIndex;

        // Determine if the truth value is multiline.
        var lfIndices = [];
        for (var i = 0; i < truth.value.length; i++) {
            if (/\n/.test(truth.value[i])) {
                lfIndices.push(i);
            }
        }

        var isMultiline = lfIndices.length === 0 ? false : true;
        if (isMultiline) {
            // Truth value is is multiline

            // Treat the beginning of truth value as an LF
            if (!/\n/.test(truth.value[0])){
                lfIndices.unshift(0);
            }
            // Treat the end of truth value as an LF only if it isn't
            if (!/\n/.test(truth.value[truth.value.length - 1]) ){
                lfIndices.push(truth.value.length - 1);
            }

            // Find nearest previous LF index relative to cursor
            var nearestLfIndicesIndex = -1;
            for(var i = 0; i < lfIndices.length; i++) {
                if (lfIndices[i] <= cursorIndex) {
                    nearestLfIndicesIndex = i;
                }else {
                    break;
                }
            }

            // Deprecated: The peek scope no longer based on on on truth lines (i.e. LF). See next section
            // We want ideally 2 lines before and 2 after the cursor's line, if not at most 5 lines including the cursor's line.
            // We need 2 LFs before and 3 LFs after (1 extra LF)
            // i.e.
            // <LF>
            // <LF>
            // <nearestLF>...<cursor>
            // <LF>
            // <LF>
            // <LF>
            // const maxLf = 6; // Includes nearest LF
            // const padLfBefore = 2;
            // const padLfAfter = 3;
            // var startLfIndicesIdx, endLfIndicesIdx;
            // if (nearestLfIndicesIndex - padLfBefore < 0) {
            //     // Not enough LF to pad before nearest LF
            //     startLfIndicesIdx = 0;
            //     // Pad leftover LF after nearest LF
            //     endLfIndicesIdx = startLfIndicesIdx + maxLf - 1 > lfIndices.length - 1 ? lfIndices.length - 1 : startLfIndicesIdx + maxLf - 1;
            // }else if (nearestLfIndicesIndex + padLfAfter > lfIndices.length - 1) {
            //     // Not enough LF to pad after nearest LF
            //     endLfIndicesIdx = lfIndices.length - 1;
            //     // Pad leftover LF before nearest LF
            //     startLfIndicesIdx = endLfIndicesIdx - maxLf + 1 < 0 ? 0 : endLfIndicesIdx - maxLf + 1;
            // }else {
            //     // Pad desired number of LF before and after nearest LF
            //     startLfIndicesIdx = nearestLfIndicesIndex - padLfBefore;
            //     endLfIndicesIdx = nearestLfIndicesIndex + padLfAfter;
            // }

            // The peek scope based on how many characters can fit a given area
            var startLfIndicesIdx = nearestLfIndicesIndex, endLfIndicesIdx = nearestLfIndicesIndex;
            if (lfIndices.length === 2) {
                // 2 LFs
                // Treat this as a single LF string
                isMultiline = false;
                startIndex = lfIndices[0];
                endIndex = lfIndices[lfIndices.length - 1];
            }else {
                // More than two LFs
                // Go in this order: lfDeviationAfter+1, lfDeviationBefore-1, lfDeviationAfter+2, lfDeviationBefore-2 ... until a line cannot fit in anymore:
                // <lfDeviationBefore-2>
                // <lfDeviationBefore-1>
                // <nearestLF|>...<cursor>
                // <lfDeviationAfter+1>
                // <lfDeviationAfter+2>
                if (characterWidth > 0 && lineWidth > 0) {
                    const maxPadChars = maxLines * Math.floor(lineWidth / characterWidth);
                    if (lfIndices[startLfIndicesIdx + 1] - lfIndices[startLfIndicesIdx] > maxPadChars) {
                        const padChars = Math.floor(maxPadChars / 2);
                        // Get the start index
                        // Get the end index
                        if (cursorIndex - padChars < lfIndices[startLfIndicesIdx]) {
                            // Not enough characters to pad before cursor
                            startIndex = lfIndices[startLfIndicesIdx];
                            // Pad leftover characters after cursor
                            endIndex = startIndex + maxPadChars - 1 > lfIndices[startLfIndicesIdx + 1] - 1 ? lfIndices[startLfIndicesIdx + 1] - 1 : startIndex + maxPadChars - 1;
                        }else if (cursorIndex + padChars > lfIndices[startLfIndicesIdx + 1] - 1) {
                            // Not enough characters to pad after cursor
                            endIndex = lfIndices[startLfIndicesIdx + 1] - 1;
                            // Pad leftover characters before cursor
                            startIndex = endIndex - maxPadChars + 1 < lfIndices[startLfIndicesIdx] ? lfIndices[startLfIndicesIdx] : endIndex - maxPadChars + 1;
                        }else {
                            // Pad equal number of characters before and after cursor
                            startIndex = cursorIndex - padChars;
                            endIndex = cursorIndex + padChars;
                        }
                        if (State.debug) {
                            console.log('[getPeekIndices] Book line overflows trainer speech. start: ' + lfIndices[startLfIndicesIdx] + ', end: ' + (lfIndices[startLfIndicesIdx + 1] - 1));
                            console.log('[getPeekIndices] cursorIndex: ' + cursorIndex + ', maxPadChars: ' + maxPadChars + ', padChars: ' + padChars);
                        }
                    }else {
                        function getNumberOfWrapLines(line, lineWidth, characterWidth) {
                            // The .clientWidth, .offsetWidth, .scrollWidth of elements round up the actual width. So we always assume it is 1px smaller to be safe.
                            return Math.ceil( (line.length * characterWidth) / (lineWidth - 1) );
                        }
                        var directionBefore = false, lfDeviationBefore = -1, lfDeviationAfter = 1, fromIdx, toIdx, lineCount = 0, totalLineCount = 0;
                        var padCharactersBefore = 0, padCharactersAfter = 0;
                        while (lfDeviationAfter - lfDeviationBefore - 1 <= lfIndices.length) {
                            if (directionBefore) {
                                if (nearestLfIndicesIndex + lfDeviationBefore >= -1) {
                                    if (nearestLfIndicesIndex + lfDeviationBefore === -1 ) {
                                        // Right at the beginning
                                        if (State.debug) {
                                            console.log('[getPeekIndices] nearestLfIndicesIndex: ' + nearestLfIndicesIndex + ', totalLineCount: ' + totalLineCount + ', lineCount: ' + lineCount + ', directionBefore: ' + directionBefore);
                                        }
                                    }else {
                                        // Not yet the beginning
                                        fromIdx = lfIndices[nearestLfIndicesIndex + lfDeviationBefore];
                                        toIdx = lfIndices[nearestLfIndicesIndex + lfDeviationBefore + 1] - 1; // -1 to ignore the trailing LF
                                        lineCount = getNumberOfWrapLines(truth.value.substring(fromIdx, toIdx + 1), lineWidth, characterWidth);
                                        if (State.debug) {
                                            console.log('[getPeekIndices] nearestLfIndicesIndex: ' + nearestLfIndicesIndex + ', totalLineCount: ' + totalLineCount + ', lineCount: ' + lineCount + ', directionBefore: ' + directionBefore);
                                        }
                                        if (totalLineCount + lineCount > maxLines) {
                                            // Pad some lines before to meet the maxLines
                                            padCharactersBefore = Math.floor( (maxLines - totalLineCount) * Math.floor(lineWidth / characterWidth) );
                                            break;
                                        }
                                        totalLineCount += lineCount;
                                        if (nearestLfIndicesIndex + lfDeviationBefore === -1 ) {
                                            startLfIndicesIdx = lfIndices[0];
                                        }else if (nearestLfIndicesIndex + lfDeviationBefore > -1) {
                                            startLfIndicesIdx = nearestLfIndicesIndex + lfDeviationBefore;
                                        }
                                    }
                                    lfDeviationBefore--;
                                }
                            }else {
                                if (nearestLfIndicesIndex + lfDeviationAfter <= lfIndices.length) {
                                    if (nearestLfIndicesIndex + lfDeviationAfter === lfIndices.length) {
                                        // Hit the end
                                        if (State.debug) {
                                            console.log('[getPeekIndices] nearestLfIndicesIndex: ' + nearestLfIndicesIndex + ', totalLineCount: ' + totalLineCount + ', lineCount: ' + lineCount + ', directionBefore: ' + directionBefore);
                                        }
                                    }else {
                                        // Not yet the end
                                        fromIdx = lfIndices[nearestLfIndicesIndex + lfDeviationAfter - 1];
                                        toIdx = lfIndices[nearestLfIndicesIndex + lfDeviationAfter] - 1; // -1 to ignore the trailing LF
                                        lineCount = getNumberOfWrapLines(truth.value.substring(fromIdx, toIdx + 1), lineWidth, characterWidth);
                                        if (State.debug) {
                                            console.log('[getPeekIndices] nearestLfIndicesIndex: ' + nearestLfIndicesIndex + ', totalLineCount: ' + totalLineCount + ', lineCount: ' + lineCount + ', directionBefore: ' + directionBefore);
                                        }
                                        if (totalLineCount + lineCount > maxLines) {
                                            // Pad some lines after to meet the maxLines
                                            padCharactersAfter = Math.floor( (maxLines - totalLineCount) * Math.floor(lineWidth / characterWidth ) );
                                            // Never pad beyond the next LF
                                            if (lfIndices[nearestLfIndicesIndex + lfDeviationAfter] + padCharactersAfter - 1 > lfIndices[nearestLfIndicesIndex + lfDeviationAfter + 1]) {
                                                padCharactersAfter -= (lfIndices[nearestLfIndicesIndex + lfDeviationAfter] + padCharactersAfter - 1) - lfIndices[nearestLfIndicesIndex + lfDeviationAfter + 1];
                                            }
                                            break;
                                        }
                                        totalLineCount += lineCount;
                                        endLfIndicesIdx = nearestLfIndicesIndex + lfDeviationAfter;
                                    }
                                    lfDeviationAfter++;
                                }
                            }
                            directionBefore = !directionBefore;
                        }
                        if (State.debug) {
                            console.log('[getPeekIndices] startLfIndicesIdx: ' + startLfIndicesIdx + ', endLfIndicesIdx: ' + endLfIndicesIdx + ', lfIndices[startLfIndicesIdx]: ' + lfIndices[startLfIndicesIdx] + ', lfIndices[endLfIndicesIdx]: ' + lfIndices[endLfIndicesIdx]);
                            console.log('[getPeekIndices] padCharactersAfter: ' + padCharactersAfter + ', padCharactersBefore: ' + padCharactersBefore);
                        }
                        startIndex = padCharactersBefore > 0 ? lfIndices[startLfIndicesIdx] - padCharactersBefore + 1 : lfIndices[startLfIndicesIdx];
                        endIndex = padCharactersAfter > 0 ? lfIndices[endLfIndicesIdx] + padCharactersAfter - 1 : lfIndices[endLfIndicesIdx];
                    }
                }else {
                    // Invalid linewidth and characterwidth, treat it as a single line
                    isMultiline = false;
                }
            }

            // If not at the end, exclude the trailing LF
            if (/\n/.test(truth.value[endIndex]) && endIndex < truth.value.length - 1) {
                endIndex--;
            }

            // Always trim down to a maximum length (But this breaks legibility, since text physically moves)
            // if (endIndex > startIndex + maxLength - 1) {
            //     isMultiline = false;
            // }
        }

        if (!isMultiline) {
            // Truth value is single line

            if (truth.value.length <= maxLength) {
                // Keep the entire string
                startIndex = 0;
                endIndex = truth.value.length - 1;
            }else {
                // Trim the string
                if (cursorIndex - padCharacters < 0) {
                    // Not enough characters to pad before cursor
                    startIndex = 0;
                    // Pad leftover characters after cursor
                    endIndex = startIndex + maxLength - 1 > truth.value.length - 1 ? truth.value.length - 1 : startIndex + maxLength - 1;
                }else if (cursorIndex + padCharacters > truth.value.length - 1) {
                    // Not enough characters to pad after cursor
                    endIndex = truth.value.length - 1;
                    // Pad leftover characters before cursor
                    startIndex = endIndex - maxLength + 1 < 0 ? 0 : endIndex - maxLength + 1;
                }else {
                    // Pad equal number of characters before and after cursor
                    startIndex = cursorIndex - padCharacters;
                    endIndex = cursorIndex + padCharacters;
                }

                // Always show characters at and after cursor. (But this means there's no visual feedback of whether there were misses)
                // startIndex = cursorIndex;
                // endIndex = cursorIndex + maxLength - 1 > truth.value.length - 1 ? truth.value.length - 1 : cursorIndex + maxLength - 1;
            }
        }
        if (State.debug) {
            console.log('[getPeekIndices] startIndex: ' + startIndex);
            console.log('[getPeekIndices] endIndex: ' + endIndex);
        }
        return [startIndex, endIndex];
    }

    // Returns a HTML string with cursor and highlighted error(s), based on a given value validated against a given truth value
    var getFeedbackHtmlValue = function(bubble, truth, environment) {
        // Always add a 1px placeholder at the beginning
        var html = '<character class="line-feed-placeholder"></character>';

        var isLineFeed, _prependHtml, _classHtml, invalidFound = false, _appendHtml;
        for (var i = 0; i < truth.value.length; i++) {
            isLineFeed = /\n/.test(truth.value[i]) ? true : false;

            _prependHtml = '';
            _classHtml = '';
            _appendHtml = '';
            if (isLineFeed) {
                // _prependHtml = '<br />';
                // _classHtml = 'line-feed ';
                _appendHtml = '<br />';
            }
            if (environment.perfection === true) {
                if (!invalidFound && i === bubble.value.length) {
                    _classHtml += 'cursor';
                }else if (i <= bubble.value.length - 1 && bubble.value[i] !== truth.value[i]) {
                    _classHtml += 'invalid cursor';
                    invalidFound = true;
                }else if (i < bubble.value.length) {
                    _classHtml += 'valid';
                }
            }else {
                if (i === bubble.value.length) {
                    _classHtml += 'cursor';
                }else if (i <= bubble.value.length - 1 && bubble.value[i] !== truth.value[i]) {
                    _classHtml += 'invalid';
                }else if (i <= bubble.value.length) {
                    _classHtml += 'valid';
                }
            }
            html += _prependHtml + '<character class="' + _classHtml + '">' + ( isLineFeed === true ? '↵' :  Helpers.htmlEntities(truth.value[i]) ) + '</character>' + _appendHtml;
        }
        return html;
    }

    // Populates this bubble's BehaviorVirtue object, when this bubble.value is measured against truth.value
    var measureVirtue = function(truth, speech, environment, key) {
        var bubble = this;
        var virtue = bubble.virtue;

        var started = false;
        var amend = environment.perfection === false && ( key == 8 || key == 46 ) ? true : false;
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
        if (environment.perfection === true) {
            if (bubble.value[bubble.value.length - 1] === truth.value[bubble.value.length - 1]) {
                virtue.result.hit_indices.push(bubble.value.length - 1);
                virtue.result.hit_num_new = 1;
            }else {
                virtue.result.miss_indices.push(bubble.value.length - 1);
                virtue.result.miss_num_new = 1;
            }
        }else {
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
        }
        // Misses beyond the truth
        virtue.result.miss_num_new = environment.perfection === false && amend === false && bubble.value.length > truth.value.length ? 1 : virtue.result.miss_num_new;
        virtue.result.amend_num_new = environment.perfection === false && amend === true && bubble.value.length < value_length_prev ? 1 : virtue.result.amend_num_new;
        virtue.result.other_num_new = virtue.result.shot_num_new && virtue.result.hit_num_new === 0 && virtue.result.miss_num_new === 0 && virtue.result.amend_num_new === 0 ? 1 : 0;

        // for (var i = bubble.value.length; i < truth.value.length; i++) {
        //     // Valid
        // }

        // Populate result
        virtue.result.libraryId = truth.libraryId;
        virtue.result.collectionId = truth.collectionId;
        virtue.result.id = truth.id;
        virtue.result.meditation = environment.meditation;
        virtue.result.perfection = environment.perfection;
        virtue.result.jumble = environment.jumble;
        virtue.result.scramble = environment.scramble;
        virtue.result.ambience = environment.ambience;
        virtue.result.success = virtue.result.miss_indices.length == 0 ? true : false;
        if (virtue.result.value === '') {
            virtue.result.value = truth.value;
        }
        var startIndex, endIndex;
        if (speech.maxLines > 0 && speech.lineWidth > 0 && speech.characterWidth) {
            // Truncated speech
            const peekIndices = getPeekIndices(bubble, truth, speech.maxLines, speech.lineWidth, speech.characterWidth);
            startIndex = peekIndices[0];
            endIndex = peekIndices[1];
        }else {
            // Non-truncated speech
            startIndex = 0;
            endIndex = truth.value.length - 1;
        }
        virtue.result.value_zonal = getFeedbackHtmlValue(
            bubble,
            truth,
            environment
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

        if ( (environment.perfection && virtue.result.success && bubble.value.length >= truth.value.length) ||
             (!environment.perfection && bubble.value.length >= truth.value.length)
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
            console.log('[measureVirtue] virtue.result.meditation: ' + virtue.result.meditation);
            console.log('[measureVirtue] virtue.result.perfection: ' + virtue.result.perfection);
            console.log('[measureVirtue] virtue.result.jumble: ' + virtue.result.jumble);
            console.log('[measureVirtue] virtue.result.scramble: ' + virtue.result.scramble);
            console.log('[measureVirtue] virtue.result.ambience: ' + virtue.result.ambience);
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
        loading: loading,
        disabled: disabled,
        placeholder: placeholder,
        value: value,
        charactersCounter: charactersCounter,
        maxLines: maxLines,
        lineWidth: lineWidth,
        characterWidth: characterWidth,
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
        playmodes: {
            shuffleglobal: 'shuffleglobal',
            shuffle: 'shuffle',
            repeat: 'repeat',
            repeatone: 'repeatone',
        },
        playmode: 'shuffleglobal',
        meditation : false,
        perfection : false,
        jumble : false,
        scramble : false,
        ambience: 'sky',
        statistics: true,
    };

    // Mental representations of books
    var bookLibraries = {};
    var bookCollections = {};
    var books = {};
    var bookLibraryCount = 0;
    var bookCollectionCount = 0;
    var bookCount = 0;
    var workingMemoryLibraryId = '';
    var workingMemoryCollectionId = '';
    var workingMemoryBookId = '';

    // Fetch content from long-term memory
    var fetch = function (params) {
        var method = params.method;
        var url = params.url;
        var fakeContent = params.fakeContent || '';
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

        if (fakeContent) {
            // Fake the content
            if (callback) {
                callback.apply(callbackData.self, [ fakeContent, callbackData ]);
            }
        }else {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    var status = xhr.status;
                    if (status === 200) {
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
        }
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

    var getFullEnvironment = function(sanitise) {
        var fullEnvironment = {};
        for (var k in environment) {
            if (typeof environment[k] === 'boolean' || typeof environment[k] === 'string') {
                fullEnvironment[k] = environment[k];
            }
        }

        fullEnvironment.bookLibraryIds = this.workingMemoryLibraryId;
        fullEnvironment.bookCollectionIds = this.workingMemoryCollectionId;
        fullEnvironment.bookIds = this.workingMemoryBookId;

        if (sanitise) {
            // Remove unneeded properties
            if (/^Custom /i.test(fullEnvironment.bookLibraryIds)) {
                delete fullEnvironment.bookLibraryIds;
            }
            if (/^Custom /i.test(fullEnvironment.bookCollectionIds)) {
                delete fullEnvironment.bookCollectionIds;
            }
            if (/^Custom /i.test(fullEnvironment.bookIds)) {
                delete fullEnvironment.bookIds;
            }
        }

        return fullEnvironment;
    }

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

    var prepare = function(trainingConfig) {
        // Override the environment
        for (var k in trainingConfig) {
            if (k in environment) {
                if (typeof environment[k] === 'boolean') {
                    // Convert to boolean
                    environment[k] = trainingConfig[k] === 'true';
                }
                if (typeof environment[k] === 'string') {
                    environment[k] = trainingConfig[k];
                }
                // Ignore other types
            }
        }

        // If jumble is on and scramble is on, turn scramble off
        if (environment.jumble === true && environment.scramble === true) {
            environment.scramble = false;
        }
    };

    // Recollection of knowledge
    var recall = function(trainingConfig, callbackOnSuccess, callbackOnError) {
        var _this = this;

        // Determine what to recall, depending on the trainingConfig
        var keys = Object.keys(trainingConfig);
        var bookLibraryIds;
        var fakeEntities = {}
        if ('bookLibraryIds' in trainingConfig) {
            // Pre-defined config
            bookLibraryIds = Array.isArray(trainingConfig.bookLibraryIds) ? trainingConfig.bookLibraryIds : [ trainingConfig.bookLibraryIds ];
        }else {
            // Custom config
            // bookLibraryIds = [
            //     'Custom library'
            // ];
        }

        if ('bookIds' in trainingConfig) {
            // Custom bookIds

            // Create fake library
            bookLibraryIds = [
                'Custom library'
            ];
            fakeEntities.bookLibrary = BookLibrary();
            fakeEntities.bookLibrary.id = 'Custom library';
            fakeEntities.bookLibrary.content = 'Custom collection';
            // Create fake collection
            fakeEntities.bookCollection = BookCollection();
            fakeEntities.bookCollection.libraryId = fakeEntities.bookLibrary.id;
            fakeEntities.bookCollection.id = fakeEntities.bookLibrary.content;
            fakeEntities.bookCollection.content = Array.isArray(trainingConfig.bookIds) ? trainingConfig.bookIds.join("\n") : trainingConfig.bookIds;
        }else if ('bookCollectionIds' in trainingConfig) {
            // Custom bookCollectionIds

            // Create fake library
            bookLibraryIds = [
                'Custom library'
            ];
            fakeEntities.bookLibrary = BookLibrary();
            fakeEntities.bookLibrary.id = 'Custom library';
            fakeEntities.bookLibrary.content = Array.isArray(trainingConfig.bookCollectionIds) ? trainingConfig.bookCollectionIds.join("\n") : trainingConfig.bookCollectionIds;
        }

        // Recall
        recallLibraries.apply(_this, [bookLibraryIds, fakeEntities, function() {
            // Once recollection is done
            _this.bookLibraryCount = Object.keys(_this.bookLibraries).length;
            _this.bookCollectionCount = Object.keys(_this.bookCollections).length;
            _this.bookCount = Object.keys(_this.books).length;
            callbackOnSuccess();
        }, function() {
            // Recollection failed
            callbackOnError();
        }]);
    };

    // Recollection of book libraries
    var recallLibraries = function(bookLibraryIds, fakeEntities, callbackOnSuccess, callbackOnError) {
        var _this = this;

        // Recognize and recall libraries
        var bookLibrary;
        for (var i = 0; i < bookLibraryIds.length; i++) {
            // Recognize
            bookLibrary = BookLibrary();
            bookLibrary.id = bookLibraryIds[i];
            _this.bookLibraries[bookLibrary.id] = bookLibrary;
            // Recall
            recallLibrary.apply(_this, [bookLibrary, fakeEntities, function() {
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
    var recallLibrary = function(bookLibrary, fakeEntities, callbackOnSuccess, callbackOnError) {
        var _this = this;
        fetch({
            method: 'GET',
            url: bookLibrary.id,
            fakeContent: 'bookLibrary' in fakeEntities ? fakeEntities.bookLibrary.content : '',
            callback: function(_bookCollectionStr, data) {
                // Recognize and recall collections
                data.bookLibrary.index = _bookCollectionStr.split(/\r\n|\n/).filter(function (v) { return v !== ''; }); //.slice(0,1);
                var k, bookCollection;
                for (var i = 0; i < data.bookLibrary.index.length; i++) {
                    (function(k) {
                        // Recognize
                        bookCollection = BookCollection();
                        bookCollection.libraryId = data.bookLibrary.id;
                        bookCollection.id = k;
                        data.bookCollections[k] = bookCollection;
                        // Recall
                        recallCollection.apply(data.self, [bookCollection, fakeEntities, function() {
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
                        }, function() {
                            // Failed. Remove the recognition
                            delete data.bookCollections[k];

                            callbackOnError();
                        }]);
                    })(data.bookLibrary.index[i]);
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
    var recallCollection = function(bookCollection, fakeEntities, callbackOnSuccess, callbackOnError) {
        var _this = this;
        fetch({
            method: 'GET',
            url: bookCollection.id,
            fakeContent: 'bookCollection' in fakeEntities ? fakeEntities.bookCollection.content : '',
            callback: function(_bookIdsStr, data) {
                data.bookCollection.index = _bookIdsStr.split(/\r\n|\n/).filter(function (v) { return v !== ''; }); //.slice(0,1);

                // Recognize and recall books
                var k, book;
                for (var i = 0; i < data.bookCollection.index.length; i++) {
                    (function(k) {
                        // Recognize
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
                            data.callbackOnSuccess()
                        }, function() {
                            // Failed. Remove the recognition
                            delete data.books[k];

                            callbackOnError();
                        }]);
                    })(data.bookCollection.index[i]);
                }
            },
            callbackOnError: callbackOnError,
            callbackData: {
                self: _this,
                bookCollection: bookCollection,
                books: _this.books,
                callbackOnSuccess: callbackOnSuccess
            }
        });
    };

    // Recollection of libary collection book
    var recallBook = function(book, callbackOnSuccess, callbackOnError) {
        var _this = this;
        fetch({
            method: 'GET',
            url: book.id,
            callback: function(_bookContentStr, data) {
                // Recalled book
                data.book.content = _bookContentStr;
                data.book.recalled = true;
                data.callbackOnSuccess();
            },
            callbackOnError: callbackOnError,
            callbackData: {
                self: _this,
                book: book,
                callbackOnSuccess: callbackOnSuccess
            }
        });
    };

    return {
        environment: environment,
        bookLibraries: bookLibraries,
        bookCollections, bookCollections,
        books: books,
        bookLibraryCount: bookLibraryCount,
        bookCollectionCount: bookCollectionCount,
        bookCount: bookCount,
        workingMemoryLibraryId: workingMemoryLibraryId,
        workingMemoryCollectionId: workingMemoryCollectionId,
        workingMemoryBookId: workingMemoryBookId,
        getBook: getBook,
        getBooksOfCollectionId: getBooksOfCollectionId,
        getBookOfId: getBookOfId,
        getCollectionsOfLibraryId: getCollectionsOfLibraryId,
        getFullEnvironment: getFullEnvironment,
        getNextBook, getNextBook,
        isReady: isReady,
        prepare: prepare,
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

    var getBooks = function() {
        return memory.books;
    };

    var getCollections = function() {
        return memory.bookCollections;
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

    var getLibraries = function() {
        return memory.bookLibraries;
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

    var prepare = function(trainingConfig) {
        memory.prepare(trainingConfig);
    };

    var recallKnowledge = function(trainingConfig, callbackOnSuccess, callbackOnError) {
        memory.prepare(trainingConfig);

        memory.recall(trainingConfig, function() {
            if (trainingConfig.bookIds) {
                var books = getBooks();
                var key = Array.isArray(trainingConfig.bookIds) ? trainingConfig.bookIds[0] : trainingConfig.bookIds;
                setAttention(books[key]);
            }else if (trainingConfig.bookCollectionIds) {
                var books = getBooksOfCollectionId(Array.isArray(trainingConfig.bookCollectionIds) ? trainingConfig.bookCollectionIds[0] : trainingConfig.bookCollectionIds);
                setAttention(books[Object.keys(books)[0]]);
            }else if (trainingConfig.bookLibraryIds) {
                var collections = getCollectionsOfLibraryId(Array.isArray(trainingConfig.bookLibraryIds) ? trainingConfig.bookLibraryIds[0] : trainingConfig.bookLibraryIds);
                var books = getBooksOfCollectionId(Object.keys(collections)[0]);
                setAttention(books[Object.keys(books)[0]]);
            }
            callbackOnSuccess();
        }, callbackOnError);
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
        getBooks: getBooks,
        getCollections: getCollections,
        getCollectionsOfLibraryId: getCollectionsOfLibraryId,
        getCurrentBook: getCurrentBook,
        getCurrentBookContent: getCurrentBookContent,
        getNextBook: getNextBook,
        getNextBookContent: getNextBookContent,
        getLibraries: getLibraries,
        getBooksOfCollectionId: getBooksOfCollectionId,
        getBookOfId: getBookOfId,
        isKnowledgeReady: isKnowledgeReady,
        prepare: prepare,
        recallKnowledge: recallKnowledge,
        setCurrentBook: setCurrentBook,
        setNextBook: setNextBook,
    };
};
var Student = function() {
    return {
        response: Bubble(''),

        // My virtue
        virtue: StudentVirtue(),
        virtueSnapshot: StudentVirtue(),

        // My behavioral virtues
        virtues: {
            count: 0,
            values: []
        },

        reflectVirtue: function(virtue, populateGlobal, cumulateGlobal) {
            var _student = this;

            // Populate my virtue (Unit meta)
            _student.virtue.result.libraryId = virtue.result.libraryId;
            _student.virtue.result.collectionId = virtue.result.collectionId;
            _student.virtue.result.id = virtue.result.id;
            _student.virtue.result.meditation = virtue.result.meditation;
            _student.virtue.result.perfection = virtue.result.perfection;
            _student.virtue.result.jumble = virtue.result.jumble;
            _student.virtue.result.scramble = virtue.result.scramble;
            _student.virtue.result.ambience = virtue.result.ambience;
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

    var begin = function(trainingConfig, callbackOnSuccess, callbackOnError) {
        student.response.disabled = true;

        callbackOnError = callbackOnError ? callbackOnError : function() {
            // Not loading anymore
            trainer.speech.loading = false;
            student.response.loading = false;

            // Ignore the intro response virtue
            student.response.newlife();

            // Fail the training
            fail();

            if (callbackOnError) {
                callbackOnError();
            }
        };
        trainer.recallKnowledge(trainingConfig, function() {
            // Not loading anymore
            trainer.speech.loading = false;
            student.response.loading = false;

            // Ignore the intro response virtue
            student.response.newlife();
            student.response.disabled = false;
            student.response.placeholder = 'Start typing . . .';

            // Start the training
            start();

            if (callbackOnSuccess) {
                callbackOnSuccess();
            }
        }, callbackOnError);
    };

    var fail = function() {
        // Set trainer truth value
        // trainer.truth.value = "Something went wrong . . . T.T\n\nPlease refresh and retry . . . ^.^";
        trainer.truth.value = "I am failing to recall my libraries' books . . . T.T\n\nPlease refresh and retry . . . ^.^";

        // Validate student response
        var virtue = student.response.virtue;
        student.response.measureVirtue(trainer.truth, trainer.speech, trainer.memory.environment);

        // Set trainer speech value
        trainer.speech.value = virtue.result.value_zonal;
    }

    var prepare = function(trainingConfig) {
        trainer.prepare(trainingConfig);
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

        // Validate student response
        var virtue = student.response.virtue;
        student.response.measureVirtue(trainer.truth, trainer.speech, trainer.memory.environment);

        // Set trainer speech value
        trainer.speech.value = virtue.result.value_zonal;

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
        student.response.measureVirtue(trainer.truth, trainer.speech, trainer.memory.environment);

        // Set trainer speech value
        trainer.speech.value = virtue.result.value_zonal;
    };

    return {
        trainer: trainer,
        student: student,
        begin: begin,
        complete: complete,
        fail: fail,
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

    // Add some properties to component
    c.bindings = [];
    c.rootElement = null;

    var createElementFromHTML = function(html) {
        var div = document.createElement('div');
        div.innerHTML = html.trim();

        // Change this to div.childNodes to support multiple top-level nodes
        return div.firstChild;
    };

    var createBindings = function(rootElement) {
        // Get all elements
        var allElements = [ rootElement ];
        var myElements = rootElement.getElementsByTagName('*');
        for (var i = 0; i < myElements.length; i++) {
            allElements.push(myElements[i]);
        }

        var matches, split, events, setters, propsPaths, object, property, binding, addedBinding;

        // Parse elements
        for (var ele, i = 0; i < allElements.length; i++) {
            ele = allElements[i];
            events = [], setters = [], addedBinding = false;

            // Parse attributes for events
            for (var j = 0, atts = ele.attributes; j < atts.length; j++) {
                // Get any eventListeners and eventHandlers names
                // E.g. <element b-on="click:myhandler,change:mychangehandler" />
                if ("b-on" === atts[j].name) {
                    split = atts[j].value.split(',').filter(function (v) { return v !== ''; });
                    for (var _= 0; _ < split.length; _++) {
                        matches = /([^:]+):?(.*)/.exec(split[_]);
                        if (matches.length > 0) {
                            events.push({
                                event: matches[1],
                                handler: matches[2] === '' ? matches[1] : matches[2]
                            });
                        }
                    }
                }

                // Get any object properties and setters
                if ('b-setter' === atts[j].name) {
                    // E.g. '.foo.bar:mysetter'
                    split = atts[j].value.split(';').filter(function (v) { return v !== ''; });
                    for (var _= 0; _ < split.length; _++) {
                        matches = /([^:]+):?(.*)/.exec(split[_]);
                        if (matches.length > 0) {
                            (function(m) {
                                var object = c.props, property;
                                var propsPaths = m[1].trim().split('.').filter(function (v) { return v !== ''; });
                                if (propsPaths.length > 1) {
                                    // E.g. c.props.foo
                                    for (var _ = 0; _ < propsPaths.length - 1; _++) {
                                        if (propsPaths[_] !== '') {
                                            object = object[propsPaths[_]];
                                        }
                                    }
                                    // E.g. 'bar'
                                    property = propsPaths[propsPaths.length - 1];
                                }else {
                                    // E.g. 'bar'
                                    property = propsPaths[0];
                                }
                                // E.g. 'mysetter'
                                var setterName = m[2].trim();

                                // Create a setter
                                var _value; // Shadow value
                                var setter = {
                                    object: object,
                                    property: property,
                                    getter: function() {
                                        return _value;
                                    },
                                    setter: function (newVal) {
                                        _value = newVal,
                                        c.methods[setterName].apply(c, [c, newVal]);
                                    }
                                };
                                // Call the setter function once
                                setter.setter(object[property]);

                                // Store the setter
                                setters.push(setter);
                            })(matches);
                        }
                    }
                }
            }

            // Parse attributes for data binding
            for (var j = 0, atts = ele.attributes; j < atts.length; j++) {
                // Create data binding to attribute.
                // E.g. <element someattribute="{{ .foo }}" /> or <element someattribute="{{ .foo.bar }}" />
                binding = null;
                matches = /\{\{([^\}]+)\}\}/.exec(atts[j].value);
                if (matches && matches.length > 0) {
                    object = c.props;
                    propsPaths = matches[1].trim().split('.').filter(function (v) { return v !== ''; });
                    if (propsPaths.length > 1) {
                        // E.g. c.props.foo
                        for (var _ = 0; _ < propsPaths.length - 1; _++) {
                            if (propsPaths[_] !== '') {
                                object = object[propsPaths[_]];
                            }
                        }
                        // E.g. 'bar'
                        property = propsPaths[propsPaths.length - 1];
                    }else {
                        // E.g. 'bar'
                        property = propsPaths[0];
                    }

                    // Use existing object binding, or else create a new one
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
                    if (events.length > 0) {
                        for (var _ = 0; _ < events.length; _++) {
                            binding.addBinding(
                                ele,
                                /^class$/i.test(atts[j].name) ? 'className' : atts[j].name, // e.g. 'someattr' or 'innerHTML'
                                events[_].event, // e.g. 'click'
                                c.eventsListeners[events[_].handler], // callback,
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
            if (ele.childNodes.length === 1 && ele.childNodes[0].nodeType === 3) {
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
                    if (events.length > 0) {
                        for (var _ = 0; _ < events.length; _++) {
                            binding.addBinding(
                                ele,
                                'innerHTML', // e.g. 'someattr' or 'innerHTML'
                                events[_].event,  // e.g. 'click'
                                c.eventsListeners[events[_].handler], // callback,
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
            }

            // If there is no data binding, simply set up the eventListeners
            if (!addedBinding) {
                if (events.length > 0) {
                    for (var _ = 0; _ < events.length; _++) {
                        (function(eventObj) {
                            var _ele = /DOM|ready/.test(eventObj.event) ? document : ele;
                            _ele.addEventListener(eventObj.event, function(e){
                                c.eventsListeners[eventObj.handler].apply(c, [e]);
                            });
                        })(events[_]);
                    }
                }
            }

            // Set up the setters
            if (setters.length > 0) {
                for (var _ele, _ = 0; _ < setters.length; _++) {
                    (function(setter) {
                        Object.defineProperty(setter.object, setter.property, {
                            get: setter.getter,
                            set: setter.setter
                        });
                    })(setters[_]);
                }
            }
        }
    };

    // Create the DOM element
    var rootElement = createElementFromHTML(c.template);
    c.rootElement = rootElement;
    if (rootElement) {
        if (/select/i.test(rootElement.nodeName)) {
            // Create its <option> elements
            var createSelectOptions = (function() {
                var _selectElement = rootElement.getElementsByTagName('select')[0];
                var optionElement;
                var options = c.props.options;
                for (var i = 0; i < options.length; i++) {
                    optionElement = document.createElement('option');
                    if (options[i] === component.value) {
                        optionElement.selected = true;
                    }
                    optionElement.value, options[i];
                    optionElement.innerHTML = decodeURIComponent(options[i].replace(/.+\/([^\/]+)$/, '$1'));
                    _selectElement.appendChild(optionElement);
                }
            })();
            // Create the DOM element
            c.parentElement.appendChild(rootElement);

            // Create data bindings
            createBindings(rootElement);
        }else {
            // Create the DOM element
            c.parentElement.appendChild(rootElement);

            // Create data bindings
            createBindings(rootElement);
        }
    }
};

// Controllers
var SplashController = function () {
    var scene = Scene('splash');
    return scene;
};

var HomeController = function () {
    const scene = Scene('home');
    var _training = State.training;
    var environment = _training.trainer.memory.environment;

    // Component: header
    Component({
        parentElement: document.getElementsByTagName('home')[0],
        name: 'header_home',
        template: `
            <header>
                <heading>{{ .label }}</heading>
            </header>
        `,
        props: {
            label: 't o u c h t y p i e',
        }
    });

    // Component: menu
    Component({
        parentElement: document.getElementsByTagName('home')[0],
        name: 'menu_home',
        template: `
            <menu></menu>
        `,
        props: {
            label: '⚙️',
        },
        eventsListeners: {
            click: function(event) {
                myApp.sceneController.scene = 'environment';
            }
        }
    });
    Component({
        parentElement: Components.menu_home.rootElement,
        name: 'menu_home_environmentbutton',
        template: `
            <menubutton b-on="click"><icon>{{ .label }}</icon></menubutton>
        `,
        props: {
            label: '⚙️',
        },
        eventsListeners: {
            click: function(event) {
                myApp.sceneController.scene = 'environment';
            }
        }
    });
    Component({
        parentElement: Components.menu_home.rootElement,
        name: 'menu_home_fullscreenbutton',
        template: `
            <menubutton b-on="DOMContentLoaded,click"><icon>{{ .label }}</icon></menubutton>
        `,
        props: {
            label: '💻',
            inFullScreen: false
        },
        eventsListeners: {
            DOMContentLoaded: function(event, _this, binding) {
                var c = this;

                // Hide this button for non-desktop browsers. Android is the only exception, since fullscreen works nicely.
                var isDesktopBrowser = Helpers.isDesktopBrowser();
                if (!isDesktopBrowser) {
                    c.rootElement.style.display = 'none';
                }
            },
            click: function(event) {
                var c = this;

                if (Helpers.isFullScreen()) {
                    if (State.debug) {
                        console.log('[menu_home_fullscreenbutton] exiting full screen');
                    }
                    Helpers.exitFullScreen();
                }else {
                    if (State.debug) {
                        console.log('[menu_home_fullscreenbutton] entering full screen');
                    }
                    Helpers.enterFullScreen();
                }

                // Focus on the student response
                Components.response.methods.focus(Components.response);
            }
        }
    });

    // Component: main
    Component({
        parentElement: document.getElementsByTagName('home')[0],
        name: 'main_home',
        template: `
            <main></main>
        `,
    });

    // Component: truth
    Component({
        parentElement: document.getElementsByTagName('home')[0].getElementsByTagName('main')[0],
        name: 'truth',
        template: `
            <truth>
                <value b-setter="._training.trainer.truth.value:_setter"></value>
            </truth>
        `,
        props: {
            _training: _training,
        },
        methods: {
            _setter: function(c, value) {
                // Set trainer truth counter
                c.props._training.trainer.truth.charactersCounter = c.props._training.trainer.truth.value.length;

                // Update element value
                var truthValueElement = c.rootElement.getElementsByTagName('value')[0];
                truthValueElement.innerHTML = Helpers.htmlEntities(value);
            }
        }
    });

    // Component: speech
    Component({
        parentElement: document.getElementsByTagName('home')[0].getElementsByTagName('main')[0],
        name: 'speech',
        template: `
            <speech b-on="DOMContentLoaded,click:speechclick" class="loading">
                <speechwrapper>
                    <box>
                        <scrollbox b-on="wheel:speechscroll,scroll:speechscroll">
                            <value b-setter="._training.trainer.speech.value:_setter"></value>
                        </scrollbox>
                        <scrollbar></scrollbar>
                    </box>
                </speechwrapper>
            </speech>
        `,
        props: {
            _training: _training,
            resizeTimeoutId: -1,
            prettyScrollbarEnabled: false,
            prettyScrollbarTimeoutId: -1
        },
        methods: {
            _setter: function(c, value) {
                if (!c.props._training.trainer.speech.loading) {
                    // Remove loading animation
                    c.rootElement.classList.remove('loading');
                }

                // Set trainer speech counter
                c.props._training.trainer.speech.charactersCounter = c.props._training.trainer.speech.value.length;

                // Update element value
                var speechValueElement = c.rootElement.getElementsByTagName('value')[0];
                speechValueElement.innerHTML = value;

                // Scroll to Speech cursor
                c.methods.setSpeechScrollPosition(c);
            },
            setSpeechScrollPosition: function(c) {
                // Scroll to the Speech cursor
                var scrollboxEle = c.rootElement.getElementsByTagName('scrollbox')[0];
                var cursorEle = c.rootElement.getElementsByClassName('cursor')[0];
                if (cursorEle && scrollboxEle.offsetHeight > 0 && cursorEle.offsetHeight > 0) {
                    // Show the current line surrounded by ideally an equal number lines of preceding and following the cursor's line
                    const numberOfLines = Math.round(scrollboxEle.offsetHeight / cursorEle.offsetHeight); // E.g. 163 / 32 = 5.09375 = 5
                    var numberOfFollowingLines = Math.floor(numberOfLines / 2); // Excludes the cursor's line. E.g. 5 / 2 = 2
                    var numberOfPreceedingLines = numberOfLines - numberOfFollowingLines - 1; // Excludes the cursor's line. E.g. 5 - 2 - 1 = 2

                    scrollboxEle.scrollTop = cursorEle.offsetTop - (cursorEle.offsetHeight * numberOfPreceedingLines);
                    if (State.debug) {
                        console.log('[setSpeechScrollPosition] scrollboxEle.scrollTop: ' + scrollboxEle.scrollTop);
                        console.log('[setSpeechScrollPosition] cursorEle.clientTop: ' + cursorEle.clientTop + ', cursorEle.offsetTop: ' + cursorEle.offsetTop + ', cursorEle.scrollTop: ' + cursorEle.scrollTop + ', numberOfLines: ' + numberOfLines + ', numberOfFollowingLines: ' + numberOfFollowingLines + ', numberOfPreceedingLines: ' + numberOfPreceedingLines);
                    }
                }
            },
            // Deprecated: Sets the trainer speech line and character widths. These will be useed to determine the presentation of speech.
            setSpeechWidths: function(c) {
                if (State.debug) {
                    console.log('[setSpeechWidths]');
                }

                // Get trainer speech dimensions
                var speechValueElement = c.rootElement.getElementsByTagName('value')[0];

                if (speechValueElement.childNodes.length > 0) {
                    const speechWidth = speechValueElement.clientWidth;
                    const speechHeight = speechValueElement.clientHeight;

                    // Get trainer speech character dimensions
                    // The first character is always a placeholder, so we get the width of the second character
                    const speechCharacterWidth = speechValueElement.getElementsByTagName('character')[1].offsetWidth;
                    const speechCharacterHeight = speechValueElement.getElementsByTagName('character')[1].offsetHeight;

                    // Set speech max characters
                    if (speechWidth > 0 && speechCharacterWidth > 0) {
                        c.props._training.trainer.speech.lineWidth = speechWidth;
                        c.props._training.trainer.speech.characterWidth = speechCharacterWidth;
                    }
                    if (State.debug) {
                        console.log('[setSpeechWidths] speechWidth: ' + speechWidth, ', speechCharacterWidth: ' + speechCharacterWidth  + ', chars / line: ' + speechWidth / speechCharacterWidth + ', max chars: ' + speechWidth / speechCharacterWidth * 5 );
                    }
                }
            },
            hideNativeScrollbar: function(c) {
                var scrollboxEle = c.rootElement.getElementsByTagName('scrollbox')[0];
                scrollboxEle.style.width = 'calc(100% + ' + Helpers.getBrowserScrollbarWidth() + 'px )';
            },
            renderPrettyScrollbar: function(c) {
                if (c.props.prettyScrollbarEnabled) {
                    var scrollbarEle = c.rootElement.getElementsByTagName('scrollbar')[0];
                    var scrollboxEle = c.rootElement.getElementsByTagName('scrollbox')[0];
                    // var contentEle = c.rootElement.getElementsByTagName('value')[0];

                    // Get heights
                    const scrollboxHeight = scrollboxEle.offsetHeight;
                    // const scrollboxHeight = scrollboxEle.getBoundingClientRect().height;
                    const contentHeight = scrollboxEle.scrollHeight;
                    // var contentHeight = contentEle.getBoundingClientRect().height;

                    // Set scrollbar height. It's should have a min-height of '25px'
                    const scrollbarDesiredHeight = contentHeight > scrollboxHeight ? (scrollboxHeight / contentHeight) * scrollboxHeight : 0;
                    const scrollbarMinHeight = 25;
                    const scrollbarHeight = scrollbarDesiredHeight < scrollbarMinHeight ? scrollbarMinHeight : scrollbarDesiredHeight;
                    scrollbarEle.style.height = scrollbarHeight + 'px';

                    // Get scrolltops
                    const contentScrollTop = scrollboxEle.scrollTop;

                    // Set scrollbar top position
                    const scrollbarScrollTop = (contentScrollTop / (contentHeight - scrollboxHeight)) * (scrollboxHeight - scrollbarHeight);
                    scrollbarEle.style.top = scrollbarScrollTop + 'px';

                    // Show scrollbar and fade it out after x milliseconds
                    const animationDuration = contentScrollTop > 0 ? 750 : 100;
                    scrollbarEle.style.animation = 'none';
                    scrollbarEle.offsetHeight; // trigger browser reflow
                    scrollbarEle.style.animation = 'scrollbarfadeout ' + parseFloat((animationDuration / 1000).toFixed(2)) + 's forwards';
                    clearTimeout(c.props.prettyScrollbarTimeoutId);
                    c.props.prettyScrollbarTimeoutId = setTimeout(function() {
                        if (State.debug) {
                            console.log('[renderPrettyScrollbar] remove animation');
                        }
                        scrollbarEle.style.animation = '';
                    }, animationDuration);

                    if (State.debug) {
                        console.log('[renderPrettyScrollbar]');
                        console.log('[renderPrettyScrollbar] scrollboxHeight: ' + scrollboxHeight);
                        console.log('[renderPrettyScrollbar] contentHeight: ' + contentHeight);
                        console.log('[renderPrettyScrollbar] scrollbarDesiredHeight: ' + scrollbarDesiredHeight);
                        console.log('[renderPrettyScrollbar] scrollbarMinHeight: ' + scrollbarMinHeight);
                        console.log('[renderPrettyScrollbar] scrollbarHeight: ' + scrollbarHeight);
                        console.log('[renderPrettyScrollbar] contentScrollTop: ' + contentScrollTop);
                        console.log('[renderPrettyScrollbar] scrollbarScrollTop: ' + scrollbarScrollTop);
                    }
                }
            }
        },
        eventsListeners: {
            DOMContentLoaded: function(event, _this, binding) {
                var c = this;

                // Hide the scrollbar for non-Mac desktop browsers with non-zero-width native scrollbar
                c.props.prettyScrollbarEnabled = navigator.platform.toUpperCase().indexOf('MAC') === -1 && Helpers.getBrowserScrollbarWidth() > 0;
                if (c.props.prettyScrollbarEnabled) {
                    c.methods.hideNativeScrollbar(c);
                }

                // Data binding - Component: speech
                myApp.eventController.registerEvent('training-init', function() {
                    // Initialize training the training with an trainer intro speech
                    c.props._training.start();

                    // Deprecated: Set the speech widths based on the intro speech
                    // c.methods.setSpeechWidths(c);

                    // Scroll to Speech cursor
                    c.methods.setSpeechScrollPosition(c);
                });

                // Window resize event
                window.addEventListener('resize', function() {
                    clearTimeout(c.props.resizeTimeoutId);
                    c.props.resizeTimeoutId = setTimeout(function() {
                        if (State.debug) {
                            console.log('[resize]');
                        }

                        // Deprecated: Set the speech widths based on the intro speech
                        // c.methods.setSpeechWidths(c);

                        // Scroll to Speech cursor
                        c.methods.setSpeechScrollPosition(c);

                        // Render pretty scrollbar
                        c.methods.renderPrettyScrollbar(c);

                        // Validate student response
                        var virtue = c.props._training.student.response.virtue;
                        c.props._training.student.response.measureVirtue(c.props._training.trainer.truth, c.props._training.trainer.speech, c.props._training.trainer.memory.environment);

                        // Set trainer speech value
                        c.props._training.trainer.speech.value = virtue.result.value_zonal;
                    }, 100);
                });
            },
            speechclick: function(event, _this, binding) {
                var c = this;

                // Focus on Student response
                Components.response.methods.focus(Components.response);

                event.stopPropagation();
            },
            speechscroll: function(event, _this, binding) {
                var c = this;

                // Render pretty scrollbar
                c.methods.renderPrettyScrollbar(c);
            },
        }
    });

    // Component: response
    Component({
        parentElement: document.getElementsByTagName('home')[0].getElementsByTagName('main')[0],
        name: 'response',
        template: `
            <response b-on="click:responseclick" class="loading">
                <textareawrapper>
                    <box>
                        <textarea b-on="DOMContentLoaded,click:textareaclick,keydown:textareakeydown,input:textareainput,wheel:responsescroll,scroll:responsescroll" placeholder="{{ _training.student.response.placeholder }}" b-setter="._training.student.response.value:_setter" tabindex="0"></textarea>
                        <textarea b-on="keydown:textareakeydown,input:textareainput" tabindex="0"></textarea>
                        <scrollbar></scrollbar>
                    </box>
                </textareawrapper>
            </response>
        `,
        props: {
            _training: _training,
            focusElement: null,
            lastKeyCode: -1,
            lastKey: '',
            prettyScrollbarEnabled: false,
            prettyScrollbarTimeoutId: -1
        },
        methods: {
            _setter: function(c, value) {
                if (!c.props._training.student.response.loading) {
                    // Remove loading animation
                    c.rootElement.classList.remove('loading');
                }

                // Set student response counter
                c.props._training.student.response.charactersCounter = c.props._training.student.response.value.length;

                // Get response textarea elements
                var amendableTextareaEle = c.rootElement.getElementsByTagName('textarea')[0];
                var nonAmendableTextareaEle = c.rootElement.getElementsByTagName('textarea')[1];

                // Update response textarea values
                amendableTextareaEle.value = c.props._training.student.response.value;
                nonAmendableTextareaEle.value = '';
            },
            focus: function(c) {
                c.props.focusElement.focus();
            },
            setResponseAmendability: function(c) {
                // Get response textarea elements
                var amendableTextareaEle = c.rootElement.getElementsByTagName('textarea')[0];
                var nonAmendableTextareaEle = c.rootElement.getElementsByTagName('textarea')[1];

                // Determine which textarea should be active
                if (c.props._training.trainer.memory.environment.perfection === true) {
                    // Non-amendable textarea active for perfection mode, where amends are disallowed. Student training is goal-oriented.
                    amendableTextareaEle.style.display = 'none';
                    nonAmendableTextareaEle.style.display = 'block';
                    c.props.focusElement = nonAmendableTextareaEle;

                    // Hide the student response element
                    c.rootElement.style.margin = 0;
                    c.rootElement.style.width = 0;
                    c.rootElement.style.height = 0;
                    c.rootElement.style.overflow = 'hidden';
                    // Create a new training session
                    var book = c.props._training.trainer.getCurrentBook();
                    if (book) {
                        c.props._training.improvise(book);
                    }
                }else {
                    // Amendable textarea active for non-perfection mode, where amends are allowed. Student training is correction-oriented.
                    amendableTextareaEle.style.display = 'block';
                    nonAmendableTextareaEle.style.display = 'none';
                    c.props.focusElement = amendableTextareaEle;

                    // Unhide the student response element
                    c.rootElement.removeAttribute('style');

                    // Set the student response value
                    c.props._training.student.response.value = c.props._training.student.response.value;
                }
            },
            handleResponse: function(c, value, keyCode) {
                // Validate student response
                var virtue = c.props._training.student.response.virtue;
                var started = c.props._training.student.response.measureVirtue(c.props._training.trainer.truth, c.props._training.trainer.speech, c.props._training.trainer.memory.environment, keyCode);

                if (c.props._training.trainer.memory.environment.perfection === true) {
                    if (value.length > 0 && virtue.result.success === false) {
                        // Set student response
                        c.props._training.student.response.value = c.props._training.student.response.value.slice(0, -1 * value.length);
                    }
                }

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
                                c.props._training.student.reflectVirtue(_virtue, true, false);
                            }
                        }, intervalMilliseconds);
                        if (State.debug) {
                            console.log('[keyup][interval] create');
                        }
                    })();
                }
                // Set trainer speech value
                c.props._training.trainer.speech.value = virtue.result.value_zonal;
                // Update student virtue non-time-based stats
                c.props._training.student.reflectVirtue(virtue, true, true);
                if (virtue.result.completed) {
                    // Run the next training unit
                    c.props._training.complete(virtue);
                    c.props._training.next();

                    // Update environment libraries
                    Components.menuselect_booklibraries.methods.updateSelectOptions(Components.menuselect_booklibraries);

                    // Update environment collections
                    Components.menuselect_bookcollections.methods.updateSelectOptions(Components.menuselect_bookcollections);

                    // Update environment books
                    Components.menuselect_books.methods.updateSelectOptions(Components.menuselect_books);
                }

                if (State.debug) {
                    console.log('[keyup] c.props._training.trainer.truth.value: ' + c.props._training.trainer.truth.value);
                    console.log('[keyup] c.props._training.trainer.truth.charactersCounter: ' + c.props._training.trainer.truth.charactersCounter);
                    console.log('[keyup] c.props._training.trainer.speech.value: ' + c.props._training.trainer.speech.value);
                    console.log('[keyup] c.props._training.trainer.speech.charactersCounter: ' + c.props._training.trainer.speech.charactersCounter);
                    console.log('[keyup] c.props._training.student.response.value: ' + c.props._training.student.response.value);
                    console.log('[keyup] c.props._training.student.response.charactersCounter: ' + c.props._training.student.response.charactersCounter);
                }
            },
            hideNativeScrollbar: function(c) {
                var scrollboxEle = c.rootElement.getElementsByTagName('textarea')[0];
                scrollboxEle.style.width = 'calc(100% + ' + Helpers.getBrowserScrollbarWidth() + 'px )';
            },
            renderPrettyScrollbar: function(c) {
                if (c.props.prettyScrollbarEnabled) {
                    var scrollbarEle = c.rootElement.getElementsByTagName('scrollbar')[0];
                    var scrollboxEle = c.rootElement.getElementsByTagName('textarea')[0];
                    // var contentEle = c.rootElement.getElementsByTagName('value')[0];

                    // Get heights
                    const scrollboxHeight = scrollboxEle.offsetHeight;
                    // const scrollboxHeight = scrollboxEle.getBoundingClientRect().height;
                    const contentHeight = scrollboxEle.scrollHeight;
                    // var contentHeight = contentEle.getBoundingClientRect().height;

                    // Set scrollbar height. It's should have a min-height of '25px'
                    const scrollbarDesiredHeight = contentHeight > scrollboxHeight ? (scrollboxHeight / contentHeight) * scrollboxHeight : 0;
                    const scrollbarMinHeight = 25;
                    const scrollbarHeight = scrollbarDesiredHeight < scrollbarMinHeight ? scrollbarMinHeight : scrollbarDesiredHeight;
                    scrollbarEle.style.height = scrollbarHeight + 'px';

                    // Get scrolltops
                    const contentScrollTop = scrollboxEle.scrollTop;

                    // Set scrollbar top position
                    const scrollbarScrollTop = (contentScrollTop / (contentHeight - scrollboxHeight)) * (scrollboxHeight - scrollbarHeight);
                    scrollbarEle.style.top = scrollbarScrollTop + 'px';

                    // Show scrollbar and fade it out after x milliseconds
                    const animationDuration = contentScrollTop > 0 ? 750 : 100;
                    scrollbarEle.style.animation = 'none';
                    scrollbarEle.offsetHeight; // trigger browser reflow
                    scrollbarEle.style.animation = 'scrollbarfadeout ' + parseFloat((animationDuration / 1000).toFixed(2)) + 's forwards';
                    clearTimeout(c.props.prettyScrollbarTimeoutId);
                    c.props.prettyScrollbarTimeoutId = setTimeout(function() {
                        if (State.debug) {
                            console.log('[renderPrettyScrollbar] remove animation');
                        }
                        scrollbarEle.style.animation = '';
                    }, animationDuration);

                    if (State.debug) {
                        console.log('[renderPrettyScrollbar]');
                        console.log('[renderPrettyScrollbar] scrollboxHeight: ' + scrollboxHeight);
                        console.log('[renderPrettyScrollbar] contentHeight: ' + contentHeight);
                        console.log('[renderPrettyScrollbar] scrollbarDesiredHeight: ' + scrollbarDesiredHeight);
                        console.log('[renderPrettyScrollbar] scrollbarMinHeight: ' + scrollbarMinHeight);
                        console.log('[renderPrettyScrollbar] scrollbarHeight: ' + scrollbarHeight);
                        console.log('[renderPrettyScrollbar] contentScrollTop: ' + contentScrollTop);
                        console.log('[renderPrettyScrollbar] scrollbarScrollTop: ' + scrollbarScrollTop);
                    }
                }
            }
        },
        eventsListeners: {
            DOMContentLoaded: function(event, _this, binding) {
                var c = this;

                // Hide the scrollbar for non-Mac desktop browsers with non-zero-width native scrollbar
                c.props.prettyScrollbarEnabled = navigator.platform.toUpperCase().indexOf('MAC') === -1 && Helpers.getBrowserScrollbarWidth() > 0;
                if (c.props.prettyScrollbarEnabled) {
                    c.methods.hideNativeScrollbar(c);
                }

                // Data binding
                new Binding({
                    object: c.props._training.student.response,
                    property: "disabled"
                }).addBinding(
                    c.rootElement.getElementsByTagName('textarea')[0],
                    'disabled'
                ).addBinding(
                    c.rootElement.getElementsByTagName('textarea')[1],
                    'disabled'
                );

                // Window resize event
                window.addEventListener('resize', function() {
                    clearTimeout(c.props.resizeTimeoutId);
                    c.props.resizeTimeoutId = setTimeout(function() {
                        if (State.debug) {
                            console.log('[resize]');
                        }

                        // Render pretty scrollbar
                        c.methods.renderPrettyScrollbar(c);
                    }, 100);
                });


                c.methods.setResponseAmendability(c);
            },
            responseclick: function(event, _this, binding) {
                var c = this;

                // Focus on Student response
                c.methods.focus(c);

                event.stopPropagation();
            },
            textareaclick: function(event, _this, binding) {
                event.stopPropagation();
            },
            textareakeydown: function(event, _this, binding) {
                var c = this;
                var ele = event.target || event.srcElement;
                var keyCode = event.keyCode || event.charCode;
                var key = event.key;

                if (State.debug) {
                    console.log('[textareakeydown] keyCode: ' + keyCode + ', key: ' + key);
                }

                // Store the keydown state
                c.props.lastKeyCode = keyCode;
                c.props.lastKey = key;
            },
            textareainput: function(event, _this, binding) {
                var c = this;
                var ele = event.target || event.srcElement;
                var keyCode = c.props.lastKeyCode;
                var key = c.props.lastKey;

                // Remove all CRs
                var newValue = ele.value.replace(/\r/g, '');
                var valueLengthDiff = newValue.length - c.props._training.student.response.value.length;
                if (State.debug) {
                    console.log('[textareainput] perfection: ' + c.props._training.trainer.memory.environment.perfection + ', keyCode: ' + keyCode + ', key: ' + key);
                    console.log('[textareainput] newValue.length: ' + newValue.length + ', c.props._training.student.response.value.length: ' + c.props._training.student.response.value.length + ', valueLengthDiff: ' + valueLengthDiff);
                }
                if (c.props._training.trainer.memory.environment.perfection === true) {
                    // In perfection mode, the textarea value consist of a single character(the pressed key)
                    c.props._training.student.response.value += newValue;
                    c.methods.handleResponse(c, newValue, keyCode);
                }else {
                    // In non-perfection mode, we may accept any character changes
                    if (State.debug) {
                        console.log('[textareainput] validating' );
                    }
                    c.props._training.student.response.value = newValue;
                    c.methods.handleResponse(c, newValue, keyCode);
                }
            },
            responsescroll: function(event, _this, binding) {
                var c = this;

                // Render pretty scrollbar
                c.methods.renderPrettyScrollbar(c);
            },
        }
    });

    // Component: statistics
    Component({
        parentElement: document.getElementsByTagName('home')[0],
        name: 'statistics',
        template: `
            <statistics></statistics>
        `,
    });

    // Component: statistics
    Component({
        parentElement: document.getElementsByTagName('home')[0].getElementsByTagName('statistics')[0],
        name: 'unitprogress',
        template: `
            <unitprogress>
                <heading>P R O G R E S S</heading>
                <characterscounter>
                    <label>Characters: </label>
                    <value>{{ _training.student.virtue.result.value_length }}</value>
                    <span>&nbsp;/&nbsp;</span>
                    <total>{{ _training.trainer.truth.charactersCounter }}</total>
                </characterscounter>
                <characterspercentagecounter>
                    <label>Characters (%): </label>
                    <value>{{ _training.student.virtue.result.value_length_percentage }}</value>
                </characterspercentagecounter>
                <hitcounter>
                    <label>Hits: </label>
                    <value>{{ _training.student.virtue.result.hit_num }}</value>
                </hitcounter>
                <hitpercentagecounter>
                    <label>Hits (%): </label>
                    <value>{{ _training.student.virtue.result.hit_num_percentage }}</value>
                </hitpercentagecounter>
                <misscounter>
                    <label>Misses: </label>
                    <value>{{ _training.student.virtue.result.miss_num }}</value>
                </misscounter>
                <misspercentagecounter>
                    <label>Misses (%): </label>
                    <value>{{ _training.student.virtue.result.miss_num_percentage }}</value>
                </misspercentagecounter>
            </unitprogress>
        `,
        props: {
            _training: _training
        }
    });

    // Component: statistics
    Component({
        parentElement: document.getElementsByTagName('home')[0].getElementsByTagName('statistics')[0],
        name: 'unitoverall',
        template: `
            <unitoverall>
                <heading>U N I T</heading>
                <datetimestart>
                    <label>Date: </label>
                    <value>{{ _training.student.virtue.result.datetime_start_iso }}</value>
                </datetimestart>
                <datetimestopwatch>
                    <label>Duration: </label>
                    <value>{{ _training.student.virtue.result.datetime_stopwatch }}</value>
                </datetimestopwatch>
                <shotcounter>
                    <label>Shots: </label>
                    <value>{{ _training.student.virtue.result.shot_num_total }}</value>
                </shotcounter>
                <ratehitpermincounter>
                    <label>Hits / min: </label>
                    <value>{{ _training.student.virtue.result.rate_hit_per_min }}</value>
                </ratehitpermincounter>
                <hitcounter>
                    <label>Hits: </label>
                    <value>{{ _training.student.virtue.result.hit_num_total }}</value>
                </hitcounter>
                <hitpercentagecounter>
                    <label>Hits (%): </label>
                    <value>{{ _training.student.virtue.result.hit_num_total_percentage }}</value>
                </hitpercentagecounter>
                <misscounter>
                    <label>Misses: </label>
                    <value>{{ _training.student.virtue.result.miss_num_total }}</value>
                </misscounter>
                <misspercentagecounter>
                    <label>Misses (%): </label>
                    <value>{{ _training.student.virtue.result.miss_num_total_percentage }}</value>
                </misspercentagecounter>
                <amendcounter>
                    <label>Amends: </label>
                    <value>{{ _training.student.virtue.result.amend_num_total }}</value>
                </amendcounter>
                <amendpercentagecounter>
                    <label>Amends (%): </label>
                    <value>{{ _training.student.virtue.result.amend_num_total_percentage }}</value>
                </amendpercentagecounter>
                <othercounter>
                    <label>Other: </label>
                    <value>{{ _training.student.virtue.result.other_num_total }}</value>
                </othercounter>
                <otherpercentagecounter>
                    <label>Other (%): </label>
                    <value>{{ _training.student.virtue.result.other_num_total_percentage }}</value>
                </otherpercentagecounter>
            </unitoverall>
        `,
        props: {
            _training: _training
        }
    });

    // Component: statistics
    Component({
        parentElement: document.getElementsByTagName('home')[0].getElementsByTagName('statistics')[0],
        name: 'globaloverall',
        template: `
            <globaloverall>
                <heading>G L O B A L</heading>
                <datetimestopwatch>
                    <label>Duration: </label>
                    <value>{{ _training.student.virtue.result.datetime_stopwatch_global }}</value>
                </datetimestopwatch>
                <shotcounter>
                    <label>Shots: </label>
                    <value>{{ _training.student.virtue.result.shot_num_global }}</value>
                </shotcounter>
                <ratehitpermincounter>
                    <label>Hits / min: </label>
                    <value>{{ _training.student.virtue.result.rate_hit_per_min_global }}</value>
                </ratehitpermincounter>
                <hitcounter>
                    <label>Hits: </label>
                    <value>{{ _training.student.virtue.result.hit_num_global }}</value>
                </hitcounter>
                <hitpercentagecounter>
                    <label>Hits (%): </label>
                    <value>{{ _training.student.virtue.result.hit_num_global_percentage }}</value>
                </hitpercentagecounter>
                <misscounter>
                    <label>Misses: </label>
                    <value>{{ _training.student.virtue.result.miss_num_global }}</value>
                </misscounter>
                <misspercentagecounter>
                    <label>Misses (%): </label>
                    <value>{{ _training.student.virtue.result.miss_num_global_percentage }}</value>
                </misspercentagecounter>
                <amendcounter>
                    <label>Amends: </label>
                    <value>{{ _training.student.virtue.result.amend_num_global }}</value>
                </amendcounter>
                <amendpercentagecounter>
                    <label>Amends (%): </label>
                    <value>{{ _training.student.virtue.result.amend_num_global_percentage }}</value>
                </amendpercentagecounter>
                <othercounter>
                    <label>Other: </label>
                    <value>{{ _training.student.virtue.result.other_num_global }}</value>
                </othercounter>
                <otherpercentagecounter>
                    <label>Other (%): </label>
                    <value>{{ _training.student.virtue.result.other_num_global_percentage }}</value>
                </otherpercentagecounter>
                <booklibrarycounter>
                    <label>Libraries: </label>
                    <value>{{ _training.trainer.memory.bookLibraryCount }}</value>
                </booklibrarycounter>
                <bookcollectioncounter>
                    <label>Collections: </label>
                    <value>{{ _training.trainer.memory.bookCollectionCount }}</value>
                </bookcollectioncounter>
                <bookcounter>
                    <label>Books: </label>
                    <value>{{ _training.student.virtues.count }}</value><span>&nbsp;/&nbsp;</span><total>{{ _training.trainer.memory.bookCount }}</total>
                </bookcounter>
            </globaloverall>
        `,
        props: {
            _training: _training
        }
    });

    // Component: statistics
    // Component({
    //     parentElement: document.getElementsByTagName('home')[0].getElementsByTagName('statistics')[0],
    //     name: 'globaloverall',
    //     template: `
    //         <progressbar>
    //             <characterscounter>
    //                 <label></label>
    //                 <value></value><span>&nbsp;/&nbsp;</span><total></total>
    //             </characterscounter>
    //         </progressbar>
    //     `,
    //     props: {
    //         _training: _training
    //     }
    // });

    Component({
        parentElement: document.getElementsByTagName('home')[0],
        name: 'footer',
        template: `
            <footer>
                <icons>
                    <a href="https://github.com/touchtypie/touchtypie" title="Github">
                        <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 256 256"><path d="M 155.68,218.64 C 155.68,214.68 155.83,201.56 155.83,185.23 155.83,173.81 151.86,166.32 147.59,162.66 174.74,159.66 203.26,149.35 203.26,102.48 203.26,89.16 198.53,78.28 190.75,69.74 191.97,66.66 196.09,54.26 189.53,37.45 189.53,37.45 179.31,34.18 156.13,49.96 146.37,47.24 136.00,45.90 125.63,45.84 115.26,45.90 104.89,47.24 95.13,49.96 71.80,34.18 61.58,37.45 61.58,37.45 55.03,54.26 59.14,66.66 60.52,69.74 52.69,78.28 47.96,89.16 47.96,102.48 47.96,149.22 76.44,159.72 103.53,162.77 100.05,165.82 96.90,171.19 95.81,179.08 88.83,182.20 71.15,187.59 60.27,168.94 60.27,168.94 53.84,157.22 41.59,156.37 41.59,156.37 29.68,156.22 40.73,163.78 40.73,163.78 48.75,167.54 54.31,181.62 54.31,181.62 61.46,205.35 95.40,197.99 95.45,208.16 95.55,215.84 95.55,218.73 95.55,218.73 155.68,218.64 155.68,218.64 Z" /></svg>
                    </a>
                </icons>
            </footer>
        `,
        props: {}
    });

    return scene;
};

var EnvironmentController = function() {
    const scene = Scene('environment');
    var _training = State.training;
    var environment = _training.trainer.memory.environment;

    // Component: header
    Component({
        parentElement: document.getElementsByTagName('environment')[0],
        name: 'header_environment',
        template: `
            <header>
                <heading>{{ .label }}</heading>
            </header>
        `,
        props: {
            label: 'E N V I R O N M E N T',
        }
    });

    // Component: menu
    Component({
        parentElement: document.getElementsByTagName('environment')[0],
        name: 'menu_environment',
        template: `
            <menu>
                <menubutton b-on="click"><icon>{{ .label }}</icon></menubutton>
            </menu>
        `,
        props: {
            label: '🏡',
            _training: _training
        },
        eventsListeners: {
            click: function(event) {
                var c = this;

                myApp.sceneController.scene = 'home';
                Components.response.methods.focus(Components.response);
            }
        }
    });

    // Component: main
    Component({
        parentElement: document.getElementsByTagName('environment')[0],
        name: 'main_environment',
        template: `
            <main></main>
        `,
    });
    Component({
        parentElement: document.getElementsByTagName('environment')[0].getElementsByTagName('main')[0],
        name: 'menuselect_booklibraries',
        template: `
            <menuselect>
                <label>{{ .label }}</label>
                <select b-on="DOMContentLoaded,change:selectchange,click:selectclick,keyup:selectkeyup" title="{{ ._training.trainer.memory.workingMemoryLibraryId }}"></select>
                <input class="hidden" b-on="keyup:inputkeyup" type="text" placeholder="enter url of library..." />
                <add b-on="click:addclick,keyup:addkeyup" title="Add a library" tabindex="0">{{ .addStatus }}</add>
            </menuselect>
        `,
        props: {
            label: 'library',
            addStatus: '+',
            _training: _training,
            get options() {
                return Object.values(_training.trainer.getLibraries());
            }
        },
        methods: {
            createSelectOptions: function(c, binding) {
                var ele = binding ? binding.element : c.bindings['._training.trainer.memory.workingMemoryLibraryId'].elementBindings[0].element;
                // Remove all options elements
                ele.innerHTML = '';
                // Recreate all options elements
                var optionElement;
                var options = c.props.options;
                for (var i = 0; i < options.length; i++) {
                    optionElement = document.createElement('option');
                    if (options[i].id === c.props._training.trainer.memory.workingMemoryLibraryId) {
                        optionElement.selected = true;
                    }
                    optionElement.value = options[i].id;
                    optionElement.innerHTML = decodeURIComponent(options[i].id);
                    optionElement.data = options[i];
                    ele.appendChild(optionElement);
                }
            },
            updateSelectOptions: function(c, binding) {
                var ele = binding ? binding.element : c.bindings['._training.trainer.memory.workingMemoryLibraryId'].elementBindings[0].element;
                var options = ele.options;
                for (var option, i = 0; i < options.length; i++) {
                    option = options[i];
                    if (option.value == c.props._training.trainer.memory.workingMemoryLibraryId) {
                        ele.selectedIndex = i;
                        break;
                    }
                }
            },
            loadBookLibrary: function(c, bookLibraryId) {
                var bookLibraryIds = [bookLibraryId];
                c.methods.toggleAddStatus(c, '.');
                var trainingConfig = {
                    bookLibraryIds: bookLibraryIds
                };
                c.props._training.begin(trainingConfig, function() {
                    c.methods.toggleAddStatus(c, '+');
                    c.methods.createSelectOptions(c);
                    Components.menuselect_bookcollections.methods.createSelectOptions(Components.menuselect_bookcollections);
                    Components.menuselect_bookcollections.methods.updateSelectOptions(Components.menuselect_bookcollections);
                    Components.menuselect_books.methods.createSelectOptions(Components.menuselect_books);
                    Components.menuselect_books.methods.updateSelectOptions(Components.menuselect_books);
                }, function() {
                    c.methods.toggleAddStatus(c, '!');
                });
            },
            getBookLibraryFirstBook: function(c, libraryId) {
                var collections = c.props._training.trainer.getCollectionsOfLibraryId(libraryId);
                var keys, collection, books, book;
                if (collections) {
                    keys = Object.keys(collections);
                    if (keys.length > 0) {
                        collection = collections[keys[0]];

                        books = c.props._training.trainer.getBooksOfCollectionId(collection.id);
                        if (books) {
                            keys = Object.keys(books);
                            if (keys.length > 0) {
                                book = books[keys[0]];
                                return book;
                            }
                        }
                    }
                }
                return null;
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
                        c.rootElement.getElementsByTagName('input')[0].className = 'hidden';
                        c.rootElement.getElementsByTagName('input')[0].disabled = true;
                        c.rootElement.getElementsByTagName('input')[0].value = '';
                        // c.bindings['.addStatus'].elementBindings[0].element.removeAttribute('class');
                        break;
                    // adding
                    case '-':
                        c.bindings['._training.trainer.memory.workingMemoryLibraryId'].elementBindings[0].element.className = 'hidden';
                        c.rootElement.getElementsByTagName('input')[0].removeAttribute('class');
                        c.rootElement.getElementsByTagName('input')[0].removeAttribute('disabled');
                        c.rootElement.getElementsByTagName('input')[0].focus();
                        // c.bindings['.addStatus'].elementBindings[0].element.removeAttribute('class');
                        break;
                    // loading
                    case '.':
                        c.bindings['._training.trainer.memory.workingMemoryLibraryId'].elementBindings[0].element.className = 'hidden';
                        c.rootElement.getElementsByTagName('input')[0].className = 'loading';
                        c.rootElement.getElementsByTagName('input')[0].removeAttribute('disabled');
                        // c.bindings['.addStatus'].elementBindings[0].element.className = 'adding';
                        break;
                    // loading error
                    case '!':
                        c.bindings['._training.trainer.memory.workingMemoryLibraryId'].elementBindings[0].element.className = 'hidden';
                        c.rootElement.getElementsByTagName('input')[0].className = 'error';
                        c.rootElement.getElementsByTagName('input')[0].removeAttribute('disabled');
                        c.rootElement.getElementsByTagName('input')[0].focus();
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
                myApp.eventController.registerEvent('training-start', function() {
                    c.methods.createSelectOptions(c, binding);
                    c.methods.updateSelectOptions(c, binding);
                    Components.menuselect_bookcollections.methods.createSelectOptions(Components.menuselect_bookcollections);
                    Components.menuselect_bookcollections.methods.updateSelectOptions(Components.menuselect_bookcollections);
                    Components.menuselect_books.methods.createSelectOptions(Components.menuselect_books);
                    Components.menuselect_books.methods.updateSelectOptions(Components.menuselect_books);
                });
            },
            selectchange: function(event, _this, binding) {
                if (State.debug) {
                    console.log('[selectchange]');
                }
                var c = this;
                var valueNew = binding.element.value;
                c.props._training.trainer.memory.workingMemoryLibraryId = valueNew;
                var book = c.methods.getBookLibraryFirstBook(c, valueNew);
                c.props._training.improvise(book);

                // Update collection and books
                Components.menuselect_bookcollections.methods.updateSelectOptions(Components.menuselect_bookcollections);
                Components.menuselect_books.methods.updateSelectOptions(Components.menuselect_books);
            },
            selectclick: function(event, _this, binding) {
                if (State.debug) {
                    console.log('[selectclick]');
                }
                scene.underInteraction = !scene.underInteraction;
                event.stopPropagation();
            },
            selectkeyup: function(event, _this, binding) {
                var c = this;
                var ele = event.target || event.srcElement;
                var keyCode = event.keyCode || event.charCode;

                // ESC key should escape the user interaction
                if (keyCode === 27) {
                    if (State.debug) {
                        console.log('[selectkeyup] ESC key');
                    }
                    if (scene.underInteraction) {
                        scene.underInteraction = false;
                        event.stopPropagation();
                    }
                }
            },
            inputkeyup: function(event, _this, binding) {
                var c = this;
                var ele = event.target || event.srcElement;
                var keyCode = event.keyCode || event.charCode;
                var value = ele.value.trim();

                // ENTER key
                if (keyCode === 13) {
                    if (value !== '') {
                        c.methods.loadBookLibrary(c, value);
                    }
                }

                // ESC key should toggle back to add status
                if (keyCode === 27) {
                    if (State.debug) {
                        console.log('[keyup] ESC key');
                    }
                    c.methods.toggleAddStatus(c);
                    scene.underInteraction = false;
                    c.rootElement.getElementsByTagName('select')[0].focus();
                    event.stopPropagation();
                }
            },
            addclick: function(event, _this, binding) {
                var c = this;
                scene.underInteraction = !scene.underInteraction;
                c.methods.toggleAddStatus(c);
            },
            addkeyup: function(event, _this, binding) {
                var c = this;
                var keyCode = event.keyCode || event.charCode;

                // ENTER or SPACE key
                if (keyCode === 13 || keyCode === 32) {
                    if (State.debug) {
                        console.log('[addkeyup] ENTER or SPACE key');
                    }
                    scene.underInteraction = !scene.underInteraction;
                    c.methods.toggleAddStatus(c);
                }
            }
        }
    });
    Component({
        parentElement: document.getElementsByTagName('environment')[0].getElementsByTagName('main')[0],
        name: 'menuselect_bookcollections',
        template: `
        <menuselect>
            <label>{{ .label }}</label>
            <select b-on="change,click:selectclick,change:selectchange,keyup:selectkeyup" title="{{ ._training.trainer.memory.workingMemoryCollectionId }}"></select>
            <input class="hidden" b-on="keyup:inputkeyup" type="text" placeholder="enter url of collection..." />
            <add b-on="click:addclick,keyup:addkeyup" title="Add a collection" tabindex="0">{{ .addStatus }}</add>
        </menuselect>
        `,
        props: {
            label: 'collection',
            addStatus: '+',
            _training: _training,
            get options() {
                return Object.values(_training.trainer.getCollections());
            }
        },
        methods: {
            createSelectOptions: function(c, binding) {
                var ele = binding ? binding.element : c.bindings['._training.trainer.memory.workingMemoryCollectionId'].elementBindings[0].element;
                // Remove all options elements
                ele.innerHTML = '';
                // Recreate all options elements
                var optionElement;
                var options = c.props.options;
                for (var i = 0; i < options.length; i++) {
                    optionElement = document.createElement('option');
                    if (options[i].libraryId === c.props._training.trainer.memory.workingMemoryLibraryId &&
                        options[i].id === c.props._training.trainer.memory.workingMemoryCollectionId
                    ) {
                        optionElement.selected = true;
                    }
                    optionElement.value = options[i].id;
                    optionElement.innerHTML = decodeURIComponent(options[i].id.replace(/.+\/([^\/]+)$/, '$1'));
                    optionElement.data = options[i];
                    ele.appendChild(optionElement);
                }
            },
            updateSelectOptions: function(c, binding) {
                var ele = binding ? binding.element : c.bindings['._training.trainer.memory.workingMemoryCollectionId'].elementBindings[0].element;
                var options = ele.options;
                for (var option, i = 0; i < options.length; i++) {
                    option = options[i];
                    if (option.data.libraryId === c.props._training.trainer.memory.workingMemoryLibraryId) {
                        // Show
                        option.style.display = 'block';
                        if (option.data.id === c.props._training.trainer.memory.workingMemoryCollectionId) {
                            // Selected
                            ele.selectedIndex = i;
                        }
                    }else {
                        // Hide
                        option.style.display = 'none';
                    }
                }
            },
            loadBookCollection: function(c, bookCollectionId) {
                var bookCollectionIds = [bookCollectionId];
                c.methods.toggleAddStatus(c, '.');
                var trainingConfig = {
                    bookCollectionIds: bookCollectionIds
                };
                c.props._training.begin(trainingConfig, function() {
                    c.methods.toggleAddStatus(c, '+');
                    Components.menuselect_booklibraries.methods.createSelectOptions(Components.menuselect_booklibraries);
                    Components.menuselect_booklibraries.methods.updateSelectOptions(Components.menuselect_booklibraries);
                    c.methods.createSelectOptions(c);
                    c.methods.updateSelectOptions(c);
                    Components.menuselect_books.methods.createSelectOptions(Components.menuselect_books);
                    Components.menuselect_books.methods.updateSelectOptions(Components.menuselect_books);
                }, function() {
                    c.methods.toggleAddStatus(c, '!');
                });
            },
            getBookCollectionFirstBook: function(c, collectionId) {
                var books = c.props._training.trainer.getBooksOfCollectionId(collectionId);
                var keys, book;
                if (books) {
                    keys = Object.keys(books);
                    if (keys.length > 0) {
                        book = books[keys[0]];
                        return book;
                    }
                }
                return null;
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
                         c.bindings['._training.trainer.memory.workingMemoryCollectionId'].elementBindings[0].element.removeAttribute('class');
                         c.rootElement.getElementsByTagName('input')[0].className = 'hidden';
                         c.rootElement.getElementsByTagName('input')[0].disabled = true;
                         c.rootElement.getElementsByTagName('input')[0].value = '';
                         // c.bindings['.addStatus'].elementBindings[0].element.removeAttribute('class');
                         break;
                     // adding
                     case '-':
                         c.bindings['._training.trainer.memory.workingMemoryCollectionId'].elementBindings[0].element.className = 'hidden';
                         c.rootElement.getElementsByTagName('input')[0].removeAttribute('class');
                         c.rootElement.getElementsByTagName('input')[0].removeAttribute('disabled');
                         c.rootElement.getElementsByTagName('input')[0].focus();
                         // c.bindings['.addStatus'].elementBindings[0].element.removeAttribute('class');
                         break;
                     // loading
                     case '.':
                         c.bindings['._training.trainer.memory.workingMemoryCollectionId'].elementBindings[0].element.className = 'hidden';
                         c.rootElement.getElementsByTagName('input')[0].className = 'loading';
                         c.rootElement.getElementsByTagName('input')[0].removeAttribute('disabled');
                         // c.bindings['.addStatus'].elementBindings[0].element.className = 'adding';
                         break;
                     // loading error
                     case '!':
                         c.bindings['._training.trainer.memory.workingMemoryCollectionId'].elementBindings[0].element.className = 'hidden';
                         c.rootElement.getElementsByTagName('input')[0].className = 'error';
                         c.rootElement.getElementsByTagName('input')[0].removeAttribute('disabled');
                         c.rootElement.getElementsByTagName('input')[0].focus();
                         // c.bindings['.addStatus'].elementBindings[0].element.removeAttribute('class');
                         break;
                     default:
                         break;
                 }
                 c.props.addStatus = statusNew;
             }
        },

        eventsListeners: {
            selectchange: function(event, _this, binding) {
                if (State.debug) {
                    console.log('[selectchange]');
                }
                var c = this;
                var valueNew = binding.element.value;

                var book = c.methods.getBookCollectionFirstBook(c, valueNew);
                if (book) {
                    c.props._training.improvise(book);
                }
                // Update library and books
                Components.menuselect_booklibraries.methods.updateSelectOptions(Components.menuselect_booklibraries);
                Components.menuselect_books.methods.updateSelectOptions(Components.menuselect_books);
            },
            selectclick: function(event, _this, binding) {
                if (State.debug) {
                    console.log('[selectclick]');
                }
                scene.underInteraction = !scene.underInteraction;
                event.stopPropagation();
            },
            selectkeyup: function(event, _this, binding) {
                var c = this;
                var ele = event.target || event.srcElement;
                var keyCode = event.keyCode || event.charCode;

                // ESC key should escape the user interaction
                if (keyCode === 27) {
                    if (State.debug) {
                        console.log('[selectkeyup] ESC key');
                    }
                    if (scene.underInteraction) {
                        scene.underInteraction = false;
                        event.stopPropagation();
                    }
                }
            },
            inputkeyup: function(event, _this, binding) {
                var c = this;
                var ele = event.target || event.srcElement;
                var keyCode = event.keyCode || event.charCode;
                var value = ele.value.trim();

                // ENTER key
                if (keyCode === 13) {
                    if (value !== '') {
                        c.methods.loadBookCollection(c, value);
                    }
                }

                // ESC key should toggle back to add status
                if (keyCode === 27) {
                    if (State.debug) {
                        console.log('[keyup] ESC key');
                    }
                    c.methods.toggleAddStatus(c);
                    scene.underInteraction = false;
                    c.rootElement.getElementsByTagName('select')[0].focus();
                    event.stopPropagation();
                }
            },
            addclick: function(event, _this, binding) {
                var c = this;
                scene.underInteraction = !scene.underInteraction;
                c.methods.toggleAddStatus(c);
            },
            addkeyup: function(event, _this, binding) {
                var c = this;
                var keyCode = event.keyCode || event.charCode;

                // ENTER or SPACE key
                if (keyCode === 13 || keyCode === 32) {
                    if (State.debug) {
                        console.log('[addkeyup] ENTER or SPACE key');
                    }
                    scene.underInteraction = !scene.underInteraction;
                    c.methods.toggleAddStatus(c);
                }
            }
        }
    });
    Component({
        parentElement: document.getElementsByTagName('environment')[0].getElementsByTagName('main')[0],
        name: 'menuselect_books',
        template: `
            <menuselect>
                <label>{{ .label }}</label>
                <select b-on="change,click:selectclick,change:selectchange,keyup:selectkeyup" title="{{ ._training.trainer.memory.workingMemoryBookId }}"></select>
                <input class="hidden" b-on="keyup:inputkeyup" type="text" placeholder="enter url of book..." />
                <add b-on="click:addclick,keyup:addkeyup" title="Add a book" tabindex="0">{{ .addStatus }}</add>
            </menuselect>
        `,
        props: {
            label: 'book',
            addStatus: '+',
            _training: _training,
            get options() {
                return Object.values(_training.trainer.getBooks());
            }
        },
        methods: {
            createSelectOptions: function(c, binding) {
                var ele = binding ? binding.element : c.bindings['._training.trainer.memory.workingMemoryBookId'].elementBindings[0].element;
                // Remove all options elements
                ele.innerHTML = '';
                // Recreate all options elements
                var optionElement;
                var options = c.props.options;
                var book = c.props._training.trainer.getCurrentBook();
                if (book) {
                    for (var i = 0; i < options.length; i++) {
                        optionElement = document.createElement('option');
                        if (options[i].libraryId === c.props._training.trainer.memory.workingMemoryLibraryId &&
                            options[i].collectionId === c.props._training.trainer.memory.workingMemoryCollectionId &&
                            options[i].id === c.props._training.trainer.memory.workingMemoryBookId
                        ) {
                            optionElement.selected = true;
                        }
                        optionElement.value = options[i].id;
                        optionElement.innerHTML = decodeURIComponent(options[i].id.replace(/.+\/([^\/]+)$/, '$1'));
                        optionElement.data = options[i];
                        ele.appendChild(optionElement);
                    }
                }
            },
            updateSelectOptions: function(c, binding) {
                var ele = binding ? binding.element : c.bindings['._training.trainer.memory.workingMemoryBookId'].elementBindings[0].element;
                var options = ele.options;
                for (var option, i = 0; i < options.length; i++) {
                    option = options[i];
                    if (option.data.libraryId === c.props._training.trainer.memory.workingMemoryLibraryId &&
                        option.data.collectionId === c.props._training.trainer.memory.workingMemoryCollectionId
                    ) {
                        // Show
                        option.style.display = 'block';
                        if (option.data.id === c.props._training.trainer.memory.workingMemoryBookId) {
                            // Selected
                            ele.selectedIndex = i;
                        }
                    }else {
                        // Hide
                        option.style.display = 'none';
                    }
                }
            },
            loadBook: function(c, bookId) {
                var bookIds = [bookId];
                c.methods.toggleAddStatus(c, '.');
                var trainingConfig = {
                    bookIds: bookIds
                };
                c.props._training.begin(trainingConfig, function() {
                    c.methods.toggleAddStatus(c, '+');
                    Components.menuselect_booklibraries.methods.createSelectOptions(Components.menuselect_booklibraries);
                    Components.menuselect_booklibraries.methods.updateSelectOptions(Components.menuselect_booklibraries);
                    Components.menuselect_bookcollections.methods.createSelectOptions(Components.menuselect_bookcollections);
                    Components.menuselect_bookcollections.methods.updateSelectOptions(Components.menuselect_bookcollections);
                    c.methods.createSelectOptions(c);
                    c.methods.updateSelectOptions(c);
                }, function() {
                    c.methods.toggleAddStatus(c, '!');
                });
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
                        c.bindings['._training.trainer.memory.workingMemoryBookId'].elementBindings[0].element.removeAttribute('class');
                        c.rootElement.getElementsByTagName('input')[0].className = 'hidden';
                        c.rootElement.getElementsByTagName('input')[0].disabled = true;
                        c.rootElement.getElementsByTagName('input')[0].value = '';
                        // c.bindings['.addStatus'].elementBindings[0].element.removeAttribute('class');
                        break;
                    // adding
                    case '-':
                        c.bindings['._training.trainer.memory.workingMemoryBookId'].elementBindings[0].element.className = 'hidden';
                        c.rootElement.getElementsByTagName('input')[0].removeAttribute('class');
                        c.rootElement.getElementsByTagName('input')[0].removeAttribute('disabled');
                        c.rootElement.getElementsByTagName('input')[0].focus();
                        // c.bindings['.addStatus'].elementBindings[0].element.removeAttribute('class');
                        break;
                    // loading
                    case '.':
                        c.bindings['._training.trainer.memory.workingMemoryBookId'].elementBindings[0].element.className = 'hidden';
                        c.rootElement.getElementsByTagName('input')[0].className = 'loading';
                        c.rootElement.getElementsByTagName('input')[0].removeAttribute('disabled');
                        // c.bindings['.addStatus'].elementBindings[0].element.className = 'adding';
                        break;
                    // loading error
                    case '!':
                        c.bindings['._training.trainer.memory.workingMemoryBookId'].elementBindings[0].element.className = 'hidden';
                        c.rootElement.getElementsByTagName('input')[0].className = 'error';
                        c.rootElement.getElementsByTagName('input')[0].removeAttribute('disabled');
                        c.rootElement.getElementsByTagName('input')[0].focus();
                        // c.bindings['.addStatus'].elementBindings[0].element.removeAttribute('class');
                        break;
                    default:
                        break;
                }
                c.props.addStatus = statusNew;
            }
        },
        eventsListeners: {
            selectchange: function(event, _this, binding) {
                if (State.debug) {
                    console.log('[selectchange]');
                }
                var c = this;
                var valueNew = binding.element.value;
                c.props._training.trainer.memory.workingMemoryBookId = valueNew;
                var book = c.props._training.trainer.getCurrentBook();
                if (book) {
                    c.props._training.improvise(book);
                }
            },
            selectclick: function(event, _this, binding) {
                if (State.debug) {
                    console.log('[selectclick]');
                }
                scene.underInteraction = !scene.underInteraction;
                event.stopPropagation();
            },
            selectkeyup: function(event, _this, binding) {
                var c = this;
                var ele = event.target || event.srcElement;
                var keyCode = event.keyCode || event.charCode;

                // ESC key should escape the user interaction
                if (keyCode === 27) {
                    if (State.debug) {
                        console.log('[selectkeyup] ESC key');
                    }
                    if (scene.underInteraction) {
                        scene.underInteraction = false;
                        event.stopPropagation();
                    }
                }
            },
            inputkeyup: function(event, _this, binding) {
                var c = this;
                var ele = event.target || event.srcElement;
                var keyCode = event.keyCode || event.charCode;
                var value = ele.value.trim();

                // ENTER key
                if (keyCode === 13) {
                    if (value !== '') {
                        c.methods.loadBook(c, value);
                    }
                }

                // ESC key should toggle back to add status
                if (keyCode === 27) {
                    if (State.debug) {
                        console.log('[inputkeyup] ESC key');
                    }
                    c.methods.toggleAddStatus(c);
                    scene.underInteraction = false;
                    c.rootElement.getElementsByTagName('select')[0].focus();
                    event.stopPropagation();
                }
            },
            addclick: function(event, _this, binding) {
                var c = this;
                scene.underInteraction = !scene.underInteraction;
                c.methods.toggleAddStatus(c);
            },
            addkeyup: function(event, _this, binding) {
                var c = this;
                var keyCode = event.keyCode || event.charCode;

                // ENTER or SPACE key
                if (keyCode === 13 || keyCode === 32) {
                    if (State.debug) {
                        console.log('[addkeyup] ENTER or SPACE key');
                    }
                    scene.underInteraction = !scene.underInteraction;
                    c.methods.toggleAddStatus(c);
                }
            }
        }
    });
    Component({
        parentElement: document.getElementsByTagName('environment')[0].getElementsByTagName('main')[0],
        name: 'menumultiswitch_playmode',
        template: `
            <menumultiswitch>
                <label>playmode</label>
                <symbol b-on="DOMContentLoaded,click,keyup:symbolkeyup" title="{{ ._training.trainer.memory.environment.playmode }}" tabindex="0"></symbol>
            </menumultiswitch>
        `,
        props: {
            _training: _training
        },
        methods: {
            updateSymbol: function(c, binding, playMode) {
                var html;
                switch(playMode) {
                    case c.props._training.trainer.memory.environment.playmodes.repeatone:
                        html = '<emoji>🔁</emoji><span>1</span>';
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
            },
            getNextPlayMode: function(c) {
                var nextPlaymode = (function() {
                    var keys = Object.keys(c.props._training.trainer.memory.environment.playmodes);
                    var currIndex = keys.indexOf(c.props._training.trainer.memory.environment.playmode);
                    var nextIndex = currIndex + 1 < keys.length ? currIndex + 1 : 0;
                    return c.props._training.trainer.memory.environment.playmodes[keys[nextIndex]];
                })();
                return nextPlaymode;
            },
            setPlayMode: function(c, binding, playMode) {
                c.props._training.trainer.memory.environment.playmode = playMode;
                c.methods.updateSymbol(c, binding, playMode);
            }
        },
        eventsListeners: {
            DOMContentLoaded: function(event, _this, binding) {
                var c = this;
                c.methods.updateSymbol(c, binding, c.props._training.trainer.memory.environment.playmode);
            },
            click: function(event, _this, binding) {
                var c = this;
                var nextPlaymode =  c.methods.getNextPlayMode(c, binding);
                c.methods.setPlayMode(c, binding, nextPlaymode);

                event.stopPropagation();
            },
            symbolkeyup: function(event, _this, binding) {
                var c = this;
                var ele = event.target || event.srcElement;
                var keyCode = event.keyCode || event.charCode;

                // ENTER or SPACE key
                if (keyCode === 13 || keyCode === 32) {
                    if (State.debug) {
                        console.log('[symbolkeyup] ENTER or SPACE key');
                    }
                    var nextPlaymode =  c.methods.getNextPlayMode(c);
                    c.methods.setPlayMode(c, binding, nextPlaymode);

                    event.stopPropagation();
                }
            }
        }
    });
    Component({
        parentElement: document.getElementsByTagName('environment')[0].getElementsByTagName('main')[0],
        name: 'menuswitch_meditation',
        template: `
            <menuswitch>
                <label>meditation</label>
                <switch b-on="click,keyup:switchkeyup" b-setter="._training.trainer.memory.environment.meditation:_setter" tabindex="0">
                    <handle></handle>
                </switch>
            </menuswitch>
        `,
        props: {
            _training: _training
        },
        methods: {
            _setter: function(c, value) {
                c.rootElement.getElementsByTagName('switch')[0].className = value === true ? 'true' : 'false';

                if (value === true) {
                    Components.header_home.rootElement.classList.add('meditation');
                    Components.speech.rootElement.classList.add('meditation');
                    Components.response.rootElement.classList.add('meditation');
                    Components.footer.rootElement.classList.add('meditation');

                    // Turn off statistics
                    c.props._training.trainer.memory.environment.statistics = false;

                    // Deprecated: Set Trainer speech to 10 lines
                    // c.props._training.trainer.speech.maxLines = 10;
                }else {
                    Components.header_home.rootElement.classList.remove('meditation');
                    Components.speech.rootElement.classList.remove('meditation');
                    Components.response.rootElement.classList.remove('meditation');
                    Components.footer.rootElement.classList.remove('meditation');

                    // Deprecated: Set Trainer speech back to 5 lines
                    // c.props._training.trainer.speech.maxLines = 5;
                }

                // Validate student response
                var virtue = c.props._training.student.response.virtue;
                c.props._training.student.response.measureVirtue(c.props._training.trainer.truth, c.props._training.trainer.speech, c.props._training.trainer.memory.environment);

                // Set trainer speech value
                c.props._training.trainer.speech.value = virtue.result.value_zonal;
            },
            toggleValue: function(c) {
                var newValue =  !c.props._training.trainer.memory.environment.meditation;
                c.props._training.trainer.memory.environment.meditation = newValue;
            }
        },
        eventsListeners: {
            click: function(event, _this, binding) {
                var c = this;
                c.methods.toggleValue(c);

                event.stopPropagation()
            },
            switchkeyup: function(event, _this, binding) {
                var c = this;
                var ele = event.target || event.srcElement;
                var keyCode = event.keyCode || event.charCode;

                // ENTER or SPACE key
                if (keyCode === 13 || keyCode === 32) {
                    if (State.debug) {
                        console.log('[switchkeyup] ENTER or SPACE key');
                    }
                    c.methods.toggleValue(c);

                    event.stopPropagation();
                }
            }
        }
    });
    Component({
        parentElement: document.getElementsByTagName('environment')[0].getElementsByTagName('main')[0],
        name: 'menuswitch_perfection',
        template: `
            <menuswitch>
                <label>perfection</label>
                <switch b-on="click,keyup:switchkeyup" b-setter="._training.trainer.memory.environment.perfection:_setter" tabindex="0">
                    <handle></handle>
                </switch>
            </menuswitch>
        `,
        props: {
            _training: _training
        },
        methods: {
            _setter: function(c, value) {
                c.rootElement.getElementsByTagName('switch')[0].className = value === true ? 'true' : 'false';

                // Update the Student response component
                Components.response.methods.setResponseAmendability(Components.response);

                if (value === true) {
                    Components.speech.rootElement.classList.add('perfection');
                }else {
                    Components.speech.rootElement.classList.remove('perfection');
                }
            },
            toggleValue: function(c) {
                var newValue =  !c.props._training.trainer.memory.environment.perfection;
                c.props._training.trainer.memory.environment.perfection = newValue;
            }
        },
        eventsListeners: {
            click: function(event, _this, binding) {
                var c = this;
                c.methods.toggleValue(c);

                event.stopPropagation()
            },
            switchkeyup: function(event, _this, binding) {
                var c = this;
                var ele = event.target || event.srcElement;
                var keyCode = event.keyCode || event.charCode;

                // ENTER or SPACE key
                if (keyCode === 13 || keyCode === 32) {
                    if (State.debug) {
                        console.log('[switchkeyup] ENTER or SPACE key');
                    }
                    c.methods.toggleValue(c);

                    event.stopPropagation();
                }
            }
        }
    });
    Component({
        parentElement: document.getElementsByTagName('environment')[0].getElementsByTagName('main')[0],
        name: 'menuswitch_jumble',
        template: `
            <menuswitch>
                <label>jumble</label>
                <switch b-on="click,keyup:switchkeyup" class="{{ ._training.trainer.memory.environment.jumble }}" tabindex="0">
                    <handle></handle>
                </switch>
            </menuswitch>
        `,
        props: {
            _training: _training
        },
        methods: {
            toggleValue: function(c) {
                var newVal = !c.props._training.trainer.memory.environment.jumble;
                c.props._training.trainer.memory.environment.jumble = newVal;

                // If scramble is on, turn it off
                if (newVal === true) {
                    if (c.props._training.trainer.memory.environment.scramble === true) {
                        c.props._training.trainer.memory.environment.scramble = false;
                    }
                }
            }
        },
        eventsListeners: {
            click: function(event, _this, binding) {
                var c = this;
                c.methods.toggleValue(c);
                c.props._training.improvise(_training.trainer.getCurrentBook());

                event.stopPropagation();
            },
            switchkeyup: function(event, _this, binding) {
                var c = this;
                var ele = event.target || event.srcElement;
                var keyCode = event.keyCode || event.charCode;

                // ENTER or SPACE key
                if (keyCode === 13 || keyCode === 32) {
                    if (State.debug) {
                        console.log('[switchkeyup] ENTER or SPACE key');
                    }
                    c.methods.toggleValue(c);
                    c.props._training.improvise(_training.trainer.getCurrentBook());

                    event.stopPropagation();
                }
            }
        }
    });
    Component({
        parentElement: document.getElementsByTagName('environment')[0].getElementsByTagName('main')[0],
        name: 'menuswitch_scramble',
        template: `
            <menuswitch>
                <label>scramble</label>
                <switch b-on="click,keyup:switchkeyup" class="{{ ._training.trainer.memory.environment.scramble }}" tabindex="0">
                    <handle></handle>
                </switch>
            </menuswitch>
        `,
        props: {
            _training: _training
        },
        methods: {
            toggleValue: function(c) {
                var newVal = !c.props._training.trainer.memory.environment.scramble;
                c.props._training.trainer.memory.environment.scramble = newVal;

                // If jumble is on, turn it off
                if (newVal === true) {
                    if (c.props._training.trainer.memory.environment.jumble === true) {
                        c.props._training.trainer.memory.environment.jumble = false;
                    }
                }

            }
        },
        eventsListeners: {
            click: function(event, _this, binding) {
                var c = this;
                c.methods.toggleValue(c);
                c.props._training.improvise(_training.trainer.getCurrentBook());

                event.stopPropagation();
            },
            switchkeyup: function(event, _this, binding) {
                var c = this;
                var ele = event.target || event.srcElement;
                var keyCode = event.keyCode || event.charCode;

                // ENTER or SPACE key
                if (keyCode === 13 || keyCode === 32) {
                    if (State.debug) {
                        console.log('[switchkeyup] ENTER or SPACE key');
                    }
                    c.methods.toggleValue(c);
                    c.props._training.improvise(_training.trainer.getCurrentBook());

                    event.stopPropagation();
                }
            }
        }
    });
    Component({
        parentElement: document.getElementsByTagName('environment')[0].getElementsByTagName('main')[0],
        name: 'menuswitch_statistics',
        template: `
            <menuswitch>
                <label>statistics</label>
                <switch b-on="click,keyup:switchkeyup" b-setter="._training.trainer.memory.environment.statistics:_setter" tabindex="0">
                    <handle></handle>
                </switch>
            </menuswitch>
        `,
        props: {
            _training: _training
        },
        methods: {
            _setter: function(c, value) {
                Components.statistics.rootElement.style.display = value === true ? 'block' : 'none';
                c.rootElement.getElementsByTagName('switch')[0].className = value === true ? 'true' : 'false';
            },
            toggleValue: function(c) {
                var newValue =  !c.props._training.trainer.memory.environment.statistics;
                c.props._training.trainer.memory.environment.statistics = newValue;
            },
        },
        eventsListeners: {
            click: function(event, _this, binding) {
                var c = this;
                c.methods.toggleValue(c);

                event.stopPropagation();
            },
            switchkeyup: function(event, _this, binding) {
                var c = this;
                var ele = event.target || event.srcElement;
                var keyCode = event.keyCode || event.charCode;

                // ENTER or SPACE key
                if (keyCode === 13 || keyCode === 32) {
                    if (State.debug) {
                        console.log('[switchkeyup] ENTER or SPACE key');
                    }
                    c.methods.toggleValue(c);

                    event.stopPropagation();
                }
            }
        }
    });
    Component({
        parentElement: document.getElementsByTagName('environment')[0].getElementsByTagName('main')[0],
        name: 'menuambienceswitch',
        template: `
            <menuambienceswitch>
                <label>ambience</label>
                <ambiences b-on="DOMContentLoaded,keyup:ambienceskeyup" b-setter="ambience:setChoice" tabindex="0"></ambiences>
            </menuambienceswitch>
        `,
        props: {
            _training: _training,
            ambience: _training.trainer.memory.environment.ambience,
            ambiences: {
                // CSS styles
                sky: 'linear-gradient(45deg, rgb(0, 186, 272) 10%, rgb(0, 186, 272) 80%, rgb(0, 186, 272) 100%)',
                sea: 'linear-gradient(45deg, rgb(46, 99, 157) 10%, rgb(0, 46, 106) 80%, rgb(28, 124, 153) 100%)',
                ocean: 'linear-gradient(45deg, rgb(0, 73, 108) 10%, rgb(0, 22, 51) 80%, rgb(1, 47, 119) 100%)',
                dawn: 'linear-gradient(45deg, rgb(49, 19, 8) 10%, rgb(0, 0, 0) 80%, rgb(91, 69, 52) 100%)',
                sunrise: 'linear-gradient(45deg, rgb(170, 88, 0) 10%, rgb(196, 172, 154) 80%, rgb(183, 119, 88) 100%)',
                noon: 'linear-gradient(45deg, rgb(147, 183, 255) 10%, rgb(32, 105, 217) 80%, rgb(255, 253, 229) 100%)',
                dusk: 'linear-gradient(45deg, rgb(115, 70, 0) 10%, rgb(0, 72, 117) 80%, rgb(255, 225, 153) 100%)',
                midnight: 'linear-gradient(45deg, rgb(38, 18, 9) 10%, rgb(0, 0, 0) 80%, rgb(104, 100, 84) 100%)',
                nebula: 'linear-gradient(45deg, rgb(60, 89, 69) 10%, rgb(10, 1, 49) 80%, rgb(149, 125, 103) 100%)',
                stars: 'linear-gradient(45deg, rgb(151, 123, 106) 10%, rgb(33, 18, 104) 80%, rgb(111, 83, 69) 100%)',
                heaven: 'linear-gradient(45deg, rgb(255, 131, 218) 10%, rgb(0, 158, 217) 80%, rgb(251, 246, 201) 100%)',
                dark: 'linear-gradient(45deg, rgb(0, 0, 0) 10%, rgb(0, 0, 0) 80%, rgb(0, 0, 0) 100%)',
                get random() {
                    var getRandomColor = function() {
                        return [
                            Math.floor(Math.random() * 255),
                            Math.floor(Math.random() * 255),
                            Math.floor(Math.random() * 255)
                        ].join(',');
                    }
                    return 'linear-gradient(45deg, rgb(' + getRandomColor() + ') 10%, rgb(' + getRandomColor() + ') 80%, rgb(' + getRandomColor() + ') 100%)'
                }
            }
        },
        methods: {
            getNextChoice: function(c, direction) {
                var choices = Object.keys(c.props.ambiences);
                var currentChoice = c.props.ambience;
                var currIndex = choices.indexOf(currentChoice);
                var nextIndex;
                if (direction === 'before') {
                    nextIndex = currIndex - 1 >= 0 ? currIndex - 1 : choices.length - 1;
                }else if (direction === 'after') {
                    nextIndex = currIndex + 1 <= choices.length - 1 ? currIndex + 1 : 0;
                }else {
                    nextIndex = 0;
                }
                return choices[nextIndex];
            },
            setChoice: function(c, choice) {
                // Set the environment ambience to this ambience
                c.props._training.trainer.memory.environment.ambience = choice;
                // Set backgrounds on UI
                var backgroundImage = c.props.ambiences[choice];
                document.body.style.backgroundImage = backgroundImage;
                // Update choices
                c.methods.updateChoices(c);
            },
            updateChoices: function(c) {
                var choiceElements = c.rootElement.getElementsByTagName('ambiences')[0].getElementsByTagName('choice');
                for (var i = 0; i < choiceElements.length; i++ ) {
                    if (choiceElements[i].name === c.props.ambience) {
                        choiceElements[i].className = 'active';
                    }else {
                        choiceElements[i].className = '';
                    }
                }
            }
        },
        eventsListeners: {
            DOMContentLoaded: function(event, _this, binding) {
                var c = this;

                var ambiencesEle = c.rootElement.getElementsByTagName('ambiences')[0];
                // Create all choice elements
                var ambienceEle;
                for (var ambience in c.props.ambiences) {
                    ambienceEle = document.createElement('choice');
                    ambienceEle.name = ambience;
                    ambienceEle.title = ambience;
                    ambienceEle.style.backgroundImage = c.props.ambiences[ambience];
                    if (ambience === 'random') {
                        ambienceEle.innerHTML = '?';
                    }
                    ambienceEle.addEventListener('click', function(event) {
                        var ele = event.target || event.srcElement;
                        var newChoice = ele.name;
                        c.props.ambience = newChoice;

                        event.stopPropagation();
                    });
                    ambiencesEle.appendChild(ambienceEle);
                }
                // Update choices
                c.methods.updateChoices(c);
            },
            ambienceskeyup: function(event, _this, binding) {
                var c = this;

                var ele = event.target || event.srcElement;
                var keyCode = event.keyCode || event.charCode;

                var direction, nextChoice;
                // LEFT or RIGHT key
                if (keyCode === 37) {
                    if (State.debug) {
                        console.log('[ambienceskeyup] LEFT key');
                    }
                    direction = 'before';
                }
                // RIGHT key
                else if (keyCode === 39) {
                    if (State.debug) {
                        console.log('[ambienceskeyup] RIGHT key');
                    }
                    direction = 'after';
                }
                // ENTER or SPACE key
                else if (keyCode === 13 || keyCode === 32) {
                    if (State.debug) {
                        console.log('[ambienceskeyup] ENTER or SPACE key');
                    }
                    direction = 'after';
                }

                if (direction) {
                    nextChoice = c.methods.getNextChoice(c, direction);
                    c.props.ambience = nextChoice;

                    event.stopPropagation();
                }
            }
        }
    });
    Component({
        parentElement: document.getElementsByTagName('environment')[0].getElementsByTagName('main')[0],
        name: 'menuexport',
        template: `
            <menuexport>
                <label>virtues</label>
                <download b-on="click,keyup:downloadkeyup" tabindex="0">download</download>
            </menuexport>
        `,
        props: {
            _training: _training
        },
        methods: {
            beginDownload: function(c) {
                var data = {
                    virtue: c.props._training.student.virtue,
                    virtues: c.props._training.student.virtues
                };
                var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 4));

                var now = new Date();
                var nowEpochMs = now.valueOf();
                var nowEpoch = Math.round(nowEpochMs / 1000);
                var nowIso = now.toISOString();
                var nowIsoShort = nowIso.substr(0, 10);
                var file = nowIsoShort + '-' + nowEpoch + '-virtues.json'; // E.g. '2021-01-01-1609430400-virtues.json

                var downloadAnchorNode = document.createElement('a');
                downloadAnchorNode.setAttribute("href", dataStr);
                downloadAnchorNode.setAttribute("download", file);
                document.body.appendChild(downloadAnchorNode); // required for firefox
                downloadAnchorNode.click();
                downloadAnchorNode.remove();
            }
        },
        eventsListeners: {
            click: function(event) {
                var c = this;
                // var ele = event.target || event.srcElement;
                c.methods.beginDownload(c);

                event.stopPropagation();
            },
            downloadkeyup: function(event, _this, binding) {
                var c = this;
                var ele = event.target || event.srcElement;
                var keyCode = event.keyCode || event.charCode;

                // ENTER or SPACE key
                if (keyCode === 13 || keyCode === 32) {
                    if (State.debug) {
                        console.log('[downloadkeyup] ENTER or SPACE key');
                    }
                    c.methods.beginDownload(c);

                    event.stopPropagation();
                }
            }
        }
    });
    Component({
        parentElement: document.getElementsByTagName('environment')[0].getElementsByTagName('main')[0],
        name: 'menufavorite',
        template: `
            <menufavorite>
                <label>favorite</label>
                <copybutton b-on="click:copyButtonLibraryClick,keyup:copyButtonLibraryKeyup" tabindex="0" title="favorite this library!">{{ .copyButtons.library.label }}</copybutton>
                <copybutton b-on="click:copyButtonCollectionClick,keyup:copyButtonCollectionKeyup" tabindex="0" title="favorite this collection!">{{ .copyButtons.collection.label }}</copybutton>
                <copybutton b-on="click:copyButtonBookClick,keyup:copyButtonBookKeyup" tabindex="0" title="favorite this book!">{{ .copyButtons.book.label }}</copybutton>
            </menufavorite>
        `,
        props: {
            _training: _training,
            copyButtons: {
                library: {
                    environment: null,
                    label: 'L',
                    originalLabel: 'L',
                    copyTimeoutId: -1,
                    copyTimeoutDuration: 2000
                },
                collection: {
                    environment: null,
                    label: 'C',
                    originalLabel: 'C',
                    copyTimeoutId: -1,
                    copyTimeoutDuration: 2000
                },
                book: {
                    environment: null,
                    label: 'B',
                    originalLabel: 'B',
                    copyTimeoutId: -1,
                    copyTimeoutDuration: 2000
                }
            }
        },
        methods: {
            copyFavorite: function(c, copyButton) {
                // Convert object keys to underscore convention
                var fullEnvironmentUnderscores = Helpers.convertToUnderscores(copyButton.environment);

                // Generate the search url. E.g. '?foo=bar&hello=world'
                var searchUrl = Helpers.toSearchUrl(fullEnvironmentUnderscores);
                var fullUrl = window.location.origin + searchUrl;

                // Set the full URL in the browser's address bar
                // window.history.pushState("bookmark", window.document.title, fullUrl);

                // Copy full URL to clipboard (synchronous copy)
                Helpers.copyToClipboard(fullUrl);

                if (State.debug) {
                    console.log('[copyFavorite] Copied url: ' + fullUrl);
                }

                // Show success
                c.methods.success(c, copyButton);

                // Reset after a duration
                clearTimeout(copyButton.copyTimeoutId);
                copyButton.copyTimeoutId = setTimeout(function() {
                    c.methods.reset(c, copyButton);
                }, copyButton.copyTimeoutDuration);
            },
            copyFavoriteLibrary: function(c) {
                var environment = _training.trainer.memory.getFullEnvironment(true);

                // Remove unneeded properties
                delete environment.bookCollectionIds;
                delete environment.bookIds;

                if ('bookLibraryIds' in environment) {
                    // Populate copy button configuration
                    c.props.copyButtons.library.environment = environment;
                    c.methods.copyFavorite(c, c.props.copyButtons.library);
                }else {
                    c.methods.failToCopyFavourite(c, c.props.copyButtons.library);
                }
            },
            copyFavoriteCollection: function(c) {
                var environment = _training.trainer.memory.getFullEnvironment(true);

                // Remove unneeded properties
                delete environment.bookLibraryIds;
                delete environment.bookIds;

                if ('bookCollectionIds' in environment) {
                    // Populate copy button configuration
                    c.props.copyButtons.collection.environment = environment;
                    c.methods.copyFavorite(c, c.props.copyButtons.collection);
                }else {
                    c.methods.failToCopyFavourite(c, c.props.copyButtons.collection);
                }
            },
            copyFavoriteBook: function(c) {
                var environment = _training.trainer.memory.getFullEnvironment(true);

                // Remove unneeded properties
                delete environment.bookLibraryIds;
                delete environment.bookCollectionIds;

                if ('bookIds' in environment) {
                    // Populate copy button configuration
                    c.props.copyButtons.book.environment = environment;
                    c.methods.copyFavorite(c, c.props.copyButtons.book);
                }else {
                    c.methods.failToCopyFavourite(c, c.props.copyButtons.book);
                }
            },
            failToCopyFavourite: function(c, copyButton) {
                // Show failure
                c.methods.fail(c, copyButton);

                // Reset after a duration
                clearTimeout(copyButton.copyTimeoutId);
                copyButton.copyTimeoutId = setTimeout(function() {
                    c.methods.reset(c, copyButton);
                }, copyButton.copyTimeoutDuration);
            },
            fail: function(c, copyButton) {
                copyButton.label = ':(';
            },
            reset: function(c, copyButton) {
                copyButton.label = copyButton.originalLabel;
            },
            success: function(c, copyButton) {
                copyButton.label = 'copied!';
            }
        },
        eventsListeners: {
            copyButtonLibraryClick: function(event, _this, binding) {
                var c = this;
                // var ele = event.target || event.srcElement;

                c.methods.copyFavoriteLibrary(c);

                event.stopPropagation();
            },
            copyButtonCollectionClick: function(event, _this, binding) {
                var c = this;
                // var ele = event.target || event.srcElement;

                c.methods.copyFavoriteCollection(c);

                event.stopPropagation();
            },
            copyButtonBookClick: function(event, _this, binding) {
                var c = this;
                // var ele = event.target || event.srcElement;

                c.methods.copyFavoriteBook(c);

                event.stopPropagation();
            },
            copyButtonLibraryKeyup: function(event, _this, binding) {
                var c = this;
                var ele = event.target || event.srcElement;
                var keyCode = event.keyCode || event.charCode;

                // ENTER or SPACE key
                if (keyCode === 13 || keyCode === 32) {
                    if (State.debug) {
                        console.log('[copyButtonLibraryKeyup] ENTER or SPACE key');
                    }
                    c.methods.copyFavoriteLibrary(c);

                    event.stopPropagation();
                }
            },
            copyButtonCollectionKeyup: function(event, _this, binding) {
                var c = this;
                var ele = event.target || event.srcElement;
                var keyCode = event.keyCode || event.charCode;

                // ENTER or SPACE key
                if (keyCode === 13 || keyCode === 32) {
                    if (State.debug) {
                        console.log('[copyButtonCollectionKeyup] ENTER or SPACE key');
                    }
                    c.methods.copyFavoriteCollection(c);

                    event.stopPropagation();
                }
            },
            copyButtonBookKeyup: function(event, _this, binding) {
                var c = this;
                var ele = event.target || event.srcElement;
                var keyCode = event.keyCode || event.charCode;

                // ENTER or SPACE key
                if (keyCode === 13 || keyCode === 32) {
                    if (State.debug) {
                        console.log('[copyButtonBookKeyup] ENTER or SPACE key');
                    }
                    c.methods.copyFavoriteBook(c);

                    event.stopPropagation();
                }
            },
        }
    });

    // Return a scene object
    return scene;
};

// App state
var State = function() {
    return {
        bookLibraryIds: [
            'https://touchtypie.github.io/touchtypie-libraries/libraries/daily.txt'
        ],
        debug: false,
        events: [
            'training-init',
            'training-start'
        ],
        scene: 'splash',
        scenes: [],
        training: Training()
    }
}();
var ConfigController = function(Config) {
    // The given pre-defined Config should be an object

    // Get config from GET parameters
    var urlParams = Helpers.getUrlParams();
    // Convert to camel-cased keys
    var urlParamsCamelCased = {}, camelCasedKey;
    for (var k in urlParams) {
        // E.g. 'foo_bar_baz' becomes 'fooBarBaz', '_foo_bar_baz_' becomes 'FooBarBaz'
        camelCasedKey = k.replace(/_([a-zA-Z])?/g, function($0, $1) { return $1 ? $1.toUpperCase() : ''; });
        urlParamsCamelCased[camelCasedKey] = urlParams[k];
    }

    // Merge pre-defined Config and GET config
    var keys = Object.keys(urlParamsCamelCased);
    var mergedConfig = {};
    if (keys.length === 0) {
        // Pre-defined config
        mergedConfig['bookLibraryIds'] = Config['bookLibraryIds'];
    }else {
        if (! ('bookLibraryIds' in keys) && ! ('bookCollectionIds' in keys) && ! ('bookIds' in keys) ) {
            // Pre-defined config
            mergedConfig['bookLibraryIds'] = Config['bookLibraryIds'];
        }

        // Custom GET config
        if (Object.keys(urlParamsCamelCased).length > 0) {
            for (var k in urlParamsCamelCased) {
                mergedConfig[k] = urlParamsCamelCased[k];
            }
        }
    }

    return {
        config: mergedConfig
    };
};
var EventController = function(Config) {
    // Config just has to an array of event names

    // An event is just an array of callbacks
    // E.g. 'event': [callback];
    var events = {};

    // Populate events object
    for (var i = 0; i < Config.length; i++) {
        events[Config[i]] = [];
    }

    var registerEvent = function(event, callback) {
        if (event in events) {
            events[event].push(callback);
        }
    };

    var doEvent = function(event) {
        if (event in events) {
            for (var callback, i = 0; i < events[event].length; i++) {
                callback = events[event][i];
                callback.apply(events[event][i]);
            }
        }
    };

    return {
        events: events,
        doEvent: doEvent,
        registerEvent: registerEvent,
    };
};
// Scene object
var Scene = function(name) {
    return {
        id: name,
        parentElement: document.getElementsByTagName(name)[0],
        underInteraction: false
    };
};
var SceneController = function(state, scenes) {
    // Object containing Scene objects
    var _scenes = {};
    for (var i = 0; i < scenes.length; i++) {
        _scenes[scenes[i].id] = scenes[i];
    }

    // Shows the new scene and hide all other scenes if only is unspecified
    var setScene = function(newScene, only) {
        var sceneParentEle;
        for (var k in _scenes) {
            if (_scenes[k].id === newScene) {
                _scenes[k].parentElement.style.display = 'block';

                // Update state object's scene
                state.scene = newScene;
            }else {
                if (!only) {
                    _scenes[k].parentElement.style.display = 'none';
                }
            }
        }
    };

    // Fades out the current scene to the new scene
    var transitionToScene = function(newScene, timeoutCallback, timeoutDuration, timeoutCallbackContext) {
        // Create a CSS fadeout animation keyframe dynamically
        var styleEle = document.createElement('style');
        styleEle.type = 'text/css';
        styleEle.innerHTML = '@keyframes fadeout { 0% { opacity: 1; } 100% { opacity: 0; } }';
        document.head.appendChild(styleEle);

        // Add animation to current scene and keep it on top of all scenes
        var currentScene = _scenes[state.scene];
        currentScene.parentElement.style.animation = 'fadeout ' + parseFloat((timeoutDuration / 1000).toFixed(2)) + 's forwards';
        currentScene.parentElement.style.zIndex = '1000000';

        // Show the new scene
        setScene(newScene, true);
        setTimeout(function() {
            // Remove the dynamically created CSS style
            styleEle.remove();

            // Remove animation from the current scene
            currentScene.parentElement.style.animation = '';
            currentScene.parentElement.style.zIndex = '';
            // And hide the current scene
            setScene(newScene);

            // Call the callback
            timeoutCallback.apply(timeoutCallbackContext);
        }, timeoutDuration);
    };

    // Show the default scene
    setScene(state.scene);

    return {
        get scene() {
            return state.scene;
        },
        set scene(newScene) {
            setScene(newScene);
        },
        get scenes() {
            return _scenes;
        },
        transitionToScene: transitionToScene
    };
};
var myApp = function () {
    // Create events
    var configController = ConfigController(State);
    var eventController = EventController(State.events);
    var sceneController;

    var init = function() {
        // Configure
        State.training.prepare(configController.config);

        // Create scenes
        sceneController = SceneController(
            // The state object
            State,
            // Scenes
            [
                SplashController(),
                HomeController(),
                EnvironmentController()
            ]
        );

        // Event listeners - Global
        window.addEventListener('keyup', function(event){
            var keyCode = event.keyCode || event.charCode;

            // ESC key toggles between environment and home scenes
            if (keyCode === 27) {
                if (State.debug) {
                    console.log('[keyup] ESC key');
                }
                if (sceneController.scenes[sceneController.scene].underInteraction === false) {
                    switch(sceneController.scene) {
                        case 'home':
                            sceneController.scene = 'environment';
                            break;
                        case 'environment':
                            sceneController.scene = 'home';

                            // Scroll trainer speech to speech cursor
                            Components.speech.methods.setSpeechScrollPosition(Components.speech);

                            // Focus on the student response
                            Components.response.methods.focus(Components.response);

                            break;
                        default:
                            break;
                    }
                }
            }
        });

        // Start training
        window.addEventListener('load', function(event) {
            // Fade the splash scene out into the home scene
            const transitionDuration = 1000; // 1 second
            sceneController.transitionToScene('home', function() {
                // Event: training-init
                eventController.doEvent('training-init');

                // Replenish training environment
                State.training.begin(configController.config, function() {
                    // Focus on the student response
                    Components.response.methods.focus(Components.response);

                    // Event: training-start
                    eventController.doEvent('training-start');
                });
            }, transitionDuration);
        });
    }

    return {
        get eventController() {
            return eventController
        },
        get sceneController() {
            return sceneController
        },
        init: init
    };
}();
myApp.init();
