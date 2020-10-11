'use strict';
app.directive('dragHorizontally', function () {

    return {
        restrict: 'A',
        link: function ($scope, $element, $attributes) {

            var start = {
                x: 0
            };

            $element.bind('touchstart', function () {
                start.x = event.changedTouches[0].pageX;
            });

            $element.bind('DOMMouseScroll mousewheel onmousewheel touchmove', function () {
                var event = window.event || event; // old IE support
                var deltaTouchY;

                if (event.wheelDelta == undefined) {
                    deltaTouchY = event.changedTouches[0].pageX - start.x;
                }
                var delta = Math.max(-5, Math.min(5, (event.wheelDelta || deltaTouchY || -event.detail)));

                $element[0].scrollLeft -= delta;

                event.preventDefault();

            });

        }
    };

});
