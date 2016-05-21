;(function init() {
    var render       = _.template(document.getElementById('tile-template').innerHTML, { variable: 'data' });
    var tiles        = document.querySelector('.tiles');
    var preloader    = document.querySelector('.overlay-loader');
    var isDesktop    = checkIsDesktop();
    var MOBILE_WIDTH = 1150;

    addHandlers();

    function addHandlers() {
        var load                    = document.getElementById('load');
        var toggle                  = document.getElementById('toggle');
        var onWindowScrollThrottled = _.throttle(onWindowScroll, 400, { leading: true });
        var onWindowResizeThrottled = _.throttle(onWindowResize, 400);

        load.addEventListener('click', onLoadClick);
        toggle.addEventListener('click', onToggleClick);
        window.addEventListener('scroll', onWindowScrollThrottled);
        window.addEventListener('mousewheel', onWindowScrollThrottled);
        window.addEventListener('DOMMouseScroll', onWindowScrollThrottled);
        window.addEventListener('resize', onWindowResizeThrottled);

        function onLoadClick() {
            appendTiles();
            scrollToBottom();
        }

        function onToggleClick() {
            load.classList.toggle('hidden');
            toggle.classList.toggle('active');
            preloader.classList.toggle('hidden');
        }

        function onWindowScroll(e) {
            if (preloader.classList.contains('hidden')) return;
            if (!isOnScreen(preloader)) return;

            setTimeout(function() {
                appendTiles();
            }, 200);
        }

        function onWindowResize() {
            checkIsDesktop();
        }
    }

    function appendTiles() {
        loadTiles()
            .then(onTilesLoad)
            .catch(onTilesLoadError);

        function onTilesLoad(data) {
            var compiledHtml = render(data);
            tiles.insertAdjacentHTML('beforeEnd', compiledHtml);
        }

        function onTilesLoadError(error) {
            console.log(error.message);
        }
    }

    function loadTiles() {
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'items.json', true);
            xhr.responseType = 'json';

            xhr.onload = function() {
                if (xhr.status !== 200) return;
                resolve(xhr.response);
            };

            xhr.onerror = function(e) {
                reject(e.target.status);
            };

            xhr.onloadend = function() {
                if (xhr.status !== 404) return;
                reject(new Error('404'));
            };

            xhr.send();
        });
    }

    function scrollToBottom() {
        if (!isDesktop) return;

        var intervalId = setInterval(function() {
            window.scrollBy(0, 15);
        }, 1000 / 60);

        setTimeout(function() {
            clearInterval(intervalId);
        }, 1000);
    }

    function checkIsDesktop() {
        return isDesktop = document.body.clientWidth > MOBILE_WIDTH;
    }

    function isOnScreen(elm) {
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
    }

})();
