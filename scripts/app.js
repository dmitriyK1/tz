;(function init() {
    var render       = _.template(document.getElementById('tile-template').innerHTML, { variable: 'data' });
    var tiles        = document.querySelector('.tiles');
    var preloader    = document.querySelector('.overlay-loader');
    var MOBILE_WIDTH = 1150;
    var isDesktop    = helper.checkIsDesktop();

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
            helper.scrollToBottom();
        }

        function onToggleClick() {
            load.classList.toggle('hidden');
            toggle.classList.toggle('active');
            preloader.classList.toggle('hidden');
        }

        function onWindowScroll(e) {
            if (preloader.classList.contains('hidden')) return;
            if (!helper.isOnScreen(preloader)) return;

            setTimeout(function() {
                appendTiles();
            }, 200);
        }

        function onWindowResize() {
            helper.checkIsDesktop();
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

})();
