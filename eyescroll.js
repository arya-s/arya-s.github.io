var eyescrolljs = (function () {


  var getWindowHeight = function () {
    return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  };

  var windowHeight = getWindowHeight();

  window.addEventListener('resize', function () {
    windowHeight = getWindowHeight();
  });

  var me = {};
  me.isCalibrated = false;
  me.gazePoints = [];

  // Globals
  var GAZER_SRC = 'webgazer.min.js';
  var CALIBRATION_POINTS_COUNT = 4;
  var GAZE_POINT_COLLECTION_THRESHOLD = 5; // Amount of gaze points to average to avoid scrolling on noise
  var DEFAULT_TRIGGER_SIZE = 150; // 150 px default triggers
  var SCROLL_BY_PIXELS = 20; // 20 px default scroll amount

  // Setup gazer
  var gazerScript = document.createElement('script');
  gazerScript.type = 'text/javascript';
  gazerScript.src = GAZER_SRC;
  gazerScript.onload = function () {

    webgazer.setRegression('ridge')
    .setTracker('clmtrackr')
    .setGazeListener(onGaze)
    .begin();

    window.setTimeout(readyCheck, 100);

  };
  document.body.appendChild(gazerScript);

  // Trigger elements
  var upTrigger = createNode('div', null, 'eyescrolljs__triggers eyescrolljs__up');
  upTrigger.textContent = 'UP';
  document.body.appendChild(upTrigger);

  var downTrigger = createNode('div', null, 'eyescrolljs__triggers eyescrolljs__down');
  downTrigger.textContent = 'DOWN';
  document.body.appendChild(downTrigger);

  // Setup calibration elements
  var calibrationElms = createNode('div', 'eyescrolljs__calibration');
  calibrationElms.textContent = 'Look at the red dot and click it to calibrate the eyetracker.';
  document.body.insertBefore(calibrationElms, document.body.firstChild);

  var lastPoint = createNode('div', null, 'eyescrolljs__calibration-point');
  lastPoint.textContent = CALIBRATION_POINTS_COUNT;
  lastPoint.dataset.point = CALIBRATION_POINTS_COUNT;
  calibrationElms.appendChild(lastPoint);

  lastPoint.onclick = function () {

    lastPoint.classList.remove('eyescrolljs__show');
    calibrationElms.classList.remove('eyescrolljs__show');
    upTrigger.classList.add('eyescrolljs__show');
    downTrigger.classList.add('eyescrolljs__show');

    me.isCalibrated = true;
    me.onCalibrated();

  };

  for (var i = (GAZE_POINT_COLLECTION_THRESHOLD - 2); i > 0; i--) {

    var point = createNode('div', null, 'eyescrolljs__calibration-point');
    point.textContent = i;
    point.dataset.point = i;
    calibrationElms.appendChild(point);

    calibrationHandler(point);

  }

  point.classList.add('eyescrolljs__show');

  var scrollPage = function (y) {

    console.log(y);

    if (y <= DEFAULT_TRIGGER_SIZE) {

      window.scrollBy(0, -SCROLL_BY_PIXELS);
      upTrigger.classList.add('eyescrolljs__faded-in');

    } else if (y >= (windowHeight - DEFAULT_TRIGGER_SIZE)) {

      window.scrollBy(0, SCROLL_BY_PIXELS);
      downTrigger.classList.add('eyescrolljs__faded-in');

    } else {

      upTrigger.classList.remove('eyescrolljs__faded-in');
      downTrigger.classList.remove('eyescrolljs__faded-in');

    }

  };

  var collectGazePoints = function (point, onReady) {

    if (me.gazePoints.length < GAZE_POINT_COLLECTION_THRESHOLD) {

      me.gazePoints.push(point);

    } else {

      onReady(me.gazePoints.reduce(function (a, b) {
        return a + b;
      }) / GAZE_POINT_COLLECTION_THRESHOLD);

      me.gazePoints = [point];

    }

  };

  var onGaze = function (data, clock) {

    if (data === null || me.isCalibrated === false) {
      return;
    }

    collectGazePoints(data.y, function (averageY) {
      scrollPage(averageY);
    });

  };

  var readyCheck = function () {

    if (webgazer.isReady()) {

      webgazer.params.imgWidth = 320;
      webgazer.params.imgHeight = 240;
      me.onLoaded();

    } else {
      window.setTimeout(readyCheck, 100);
    }

  };

  // Abstract - To be set by instantiator
  me.onLoaded = function () {};
  me.onCalibrated = function () {};

  me.startCalibration = function (points) {
    calibrationElms.classList.add('eyescrolljs__show');
  };

  function calibrationHandler (point) {

    var tempPoint = lastPoint;

    point.onclick = function () {

      point.classList.remove('eyescrolljs__show');
      tempPoint.classList.add('eyescrolljs__show');

    };

    lastPoint = point;

  }

  function createNode (type, id, className) {

      var node = document.createElement(type);

      if (className != null) {
        node.className = className;
      }

      if (id != null) {
        node.id = id;
      }

      return node;

  }

  return me;

})();