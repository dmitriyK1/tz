;(function() {
    var MOBILE_WIDTH = 1150;

    window.helper = {};

    helper.scrollToBottom = function(isDesktop) {
        if (!isDesktop) return;

        var intervalId = setInterval(function() {
            window.scrollBy(0, 15);
        }, 1000 / 60);

        setTimeout(function() {
            clearInterval(intervalId);
        }, 1000);
    };

    helper.checkIsDesktop = function() {
        return document.documentElement.clientWidth > MOBILE_WIDTH;
    };

    helper.isOnScreen = function(elm) {
        var vpH = viewPortHeight(),
            st = scrollY(),
            y = posY(elm);

        return (y < (vpH + st));

        function posY(elm) {
            var test = elm,
                top = 0;

            while (!!test && test.tagName.toLowerCase() !== 'body') {
                top += test.offsetTop;
                test = test.offsetParent;
            }

            return top;
        }

        function viewPortHeight() {
            var de = document.documentElement;

            if (!!window.innerWidth) {
                return window.innerHeight;
            } else if (de && !isNaN(de.clientHeight)) {
                return de.clientHeight;
            }

            return 0;
        }

        function scrollY() {
            if (window.pageYOffset) {
                return window.pageYOffset;
            }
            return Math.max(document.documentElement.scrollTop, document.body.scrollTop);
        }
    };
})();
