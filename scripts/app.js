;(function init() {
    var render = _.template(document.getElementById('tile-template').innerHTML, { variable: 'data' });
    var tiles = document.querySelector('.tiles');
    var preloader = document.querySelector('.overlay-loader');

    addHandlers();

    function addHandlers() {
        var load = document.getElementById('load');
        var toggle = document.getElementById('toggle');
        var onWindowScrollThrottled = _.throttle(onWindowScroll, 400, { leading: true });

        load.addEventListener('click', onLoadClick);
        toggle.addEventListener('click', onToggleClick);
        window.addEventListener('scroll', onWindowScrollThrottled);
        window.addEventListener('mousewheel', onWindowScrollThrottled);
        window.addEventListener('DOMMouseScroll', onWindowScrollThrottled);

        function onLoadClick() {
            appendTiles();
            scrollToBottom();
        }

        function onToggleClick() {
            load.classList.toggle('hidden');
            toggle.classList.toggle('active');
            preloader.classList.toggle('hidden');
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

        function onWindowScroll(e) {
            if (!preloader.classList.contains('hidden')) {
                if (!isOnScreen(preloader)) return;

                setTimeout(function() {
                    appendTiles();
                }, 200);
            }
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

    function isOnScreen(elm) {
        var vpH = viewPortHeight(),
            st = scrollY(),
            y = posY(elm);

        return (y < (vpH + st));

        function posY(elm) {
            var test = elm,
                top = 0;

            while (!!test && test.tagName.toLowerCase() !== "body") {
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

    function scrollToBottom() {
        var id;

        if (document.body.clientWidth < 1150) return;

        animate();

        setTimeout(function() {
            cancelAnimationFrame(id);
        }, 1000);

        function animate() {
            id = requestAnimationFrame(function() {
                window.scrollBy(0, 15);
                animate();
            });
        }

    }

})();
