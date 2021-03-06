define(['./DvtToolkit'], function() {
  // Internal use only.  All APIs and functionality are subject to change at any time.
  /** Copyright (c) 2011, Oracle and/or its affiliates. All rights reserved. */
var DvtTimeUtils = new Object();

DvtTimeUtils.supportsTouch = function()
{
  return DvtAgent.isTouchDevice();
};

DvtObj.createSubclass(DvtTimeUtils, DvtObj, 'DvtTimeUtils');


/**
 * startTime - the start time of timeline in millis
 * endTime - the end of the timeline in millis
 * time - the time in question
 * width - the width of the element
 *
 * @return the position relative to the width of the element
 */
DvtTimeUtils.getDatePosition = function(startTime, endTime, time, width)
{
  var number = (time - startTime) * width;
  var denominator = (endTime - startTime);
  if (number == 0 || denominator == 0)
    return 0;

  return number / denominator;
};


/**
 * @return time in millis
 */
DvtTimeUtils.getPositionDate = function(startTime, endTime, pos, width)
{
  var number = pos * (endTime - startTime);
  if (number == 0 || width == 0)
    return startTime;

  return (number / width) + startTime;
};
/**
 * Overview component.
 * @param {DvtContext} context The rendering context.
 * @param {object} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The object context for the callback function
 * @class Overview component.
 * @constructor
 * @extends {DvtContainer}
 * @export
 */
var DvtOverview = function(context, callback, callbackObj) {
  this.Init(context, callback, callbackObj);
};

DvtObj.createSubclass(DvtOverview, DvtContainer, 'DvtOverview');

DvtOverview.MIN_WINDOW_SIZE = 10;
DvtOverview.DEFAULT_VERTICAL_TIMEAXIS_SIZE = 40;
DvtOverview.DEFAULT_HORIZONTAL_TIMEAXIS_SIZE = 20;
DvtOverview.HANDLE_PADDING_SIZE = 20;


/**
 * Initializes the view.
 * @param {DvtContext} context The rendering context.
 * @param {object} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The object context for the callback function
 * @protected
 */
DvtOverview.prototype.Init = function(context, callback, callbackObj) 
{
  DvtOverview.superclass.Init.call(this, context);
  this._callback = callback;
  this._callbackObj = callbackObj;

  if (this.isFlashEnvironment())
    this._lastChildIndex = 7;
  else
    this._lastChildIndex = 6;

  var interactive = (this._callback != null || this._callbackObj != null);
  if (interactive)
  {
    // register listeners
    if (DvtTimeUtils.supportsTouch())
    {
      this.addEvtListener(DvtTouchEvent.TOUCHSTART, this.HandleTouchStart, false, this);
      this.addEvtListener(DvtTouchEvent.TOUCHMOVE, this.HandleTouchMove, false, this);
      this.addEvtListener(DvtTouchEvent.TOUCHEND, this.HandleTouchEnd, false, this);
      this.addEvtListener(DvtMouseEvent.CLICK, this.HandleShapeClick, false, this);
    }
    else
    {
      this.addEvtListener(DvtMouseEvent.MOUSEOVER, this.HandleShapeMouseOver, false, this);
      this.addEvtListener(DvtMouseEvent.MOUSEOUT, this.HandleShapeMouseOut, false, this);
      this.addEvtListener(DvtMouseEvent.CLICK, this.HandleShapeClick, false, this);
      this.addEvtListener(DvtMouseEvent.MOUSEDOWN, this.HandleMouseDown, false, this);
      this.addEvtListener(DvtMouseEvent.MOUSEUP, this.HandleMouseUp, false, this);
      this.addEvtListener(DvtMouseEvent.MOUSEMOVE, this.HandleMouseMove, false, this);
      this.addEvtListener(DvtKeyboardEvent.KEYDOWN, this.HandleKeyDown, false, this);
      this.addEvtListener(DvtKeyboardEvent.KEYUP, this.HandleKeyUp, false, this);
    }
  }

  this._initPos = 0;
};


/**
 * To support Chart zoom and scroll feature
 * Ability to set the overview window start and end pos
 * @param start - the viewport start time
 * @param end - the viewport end time
 */
DvtOverview.prototype.setViewportRange = function(start, end)
{
  var viewportStart = this.getDatePosition(start);
  var viewportEnd = this.getDatePosition(end);

  // make sure it's in bound
  if (viewportStart < this.getMinimumPosition() || viewportEnd > this.getMaximumPosition())
    return;

  // make sure the viewport range is not smaller than the minimum window size
  var size = Math.max(viewportEnd - viewportStart, this.getMinimumWindowSize());

  // make sure values are valid
  if (size > 0 && viewportStart >= 0 && viewportEnd <= this.Width)
  {
    var slidingWindow = this.getSlidingWindow();
    if (this.isRTL())
      this.setSlidingWindowPos(slidingWindow, this.Width - (viewportStart + size));
    else
      this.setSlidingWindowPos(slidingWindow, viewportStart);
    this.setSlidingWindowSize(slidingWindow, size);

    this.ScrollTimeAxis();
  }
};


/**
 * Sets the initial position of the overview window
 */
DvtOverview.prototype.setInitialPosition = function(pos)
{
  // make sure initial position is within bound
  if (pos >= this.getMinimumPosition() && pos <= this.getMaximumPosition())
    this._initPos = pos;
};


/**
 * Checks whether a particular feature is turned off
 */
DvtOverview.prototype.isFeatureOff = function(feature)
{
  if (this._featuresOff == null)
    return false;

  return (this._featuresOff.indexOf(feature) != -1);
};


/**
 * Checks whether sliding window should animate when move
 */
DvtOverview.prototype.isAnimationOnClick = function()
{
  return !(this._animationOnClick === 'off');
};


/**
 * Renders the component using the specified xml.  If no xml is supplied to a component
 * that has already been rendered, this function will rerender the component with the
 * specified size.
 * @param {obj} obj Either the component xml or json object
 * @param {number} width The width of the component.
 * @param {number} height The height of the component.
 * @export
 */
DvtOverview.prototype.render = function(obj, width, height) 
{
  if (obj == null)
  {
    // sets the correct time where the sliding window starts
    var start = this._start;
    var end = this._end;

    var slidingWindow = this.getSlidingWindow();
    var slidingWindowPos = this.getSlidingWindowPos(slidingWindow);
    if (slidingWindow != null && slidingWindowPos != 0)
    {
      // note this.Width references the old width
      this._renderStart = DvtTimeUtils.getPositionDate(start, end, slidingWindowPos, this.Width);
    }

    // clean out existing elements since they will be regenerate
    this.removeChildren();
  }

  // Store the size
  if (width != null && height != null)
  {
    this.Width = width;
    this.Height = height;
  }

  // If new xml is provided, parse it and apply the properties
  if (obj)
  {
    var props = this.Parse(obj);
    this._applyParsedProperties(props);
  }

  var interactive = (this._callback != null || this._callbackObj != null);

  this.createBackground(width, height);

  if (interactive)
    this.createSlidingWindow(width, height);

  this.updateTimeAxis(width, height);

  this.parseFilledTimeRangesXML(width, height);

  // update current time
  this.updateCurrentTime(width, height);

  // render data
  this.parseDataXML(width, height);

  if (interactive)
  {
    this.createBorderAroundSlidingWindow(width, height);

    if (this.isFlashEnvironment())
    {
      // flash does not supply the resize cursor, and since none of the available cursors
      // works for resize, we'll render our own hint
      this._resizeArrow = this.createResizeArrow();
    }

    // updates the position and width of sliding window and borders around window
    this.updateSlidingWindow(width, height);
  }

  if (this._initialFocusTime != null)
    this._initPos = Math.max(0, DvtTimeUtils.getDatePosition(this._start, this._end, this._initialFocusTime, this._width));

  if (this._initPos > 0)
    this.longScrollToPos(this._initPos);
};

DvtOverview.prototype.getParser = function(obj)
{
  return new DvtOverviewParser(this);
};

DvtOverview.prototype.Parse = function(obj) 
{
  var parser = this.getParser(obj);
  return parser.parse(obj);
};


/**
 * Applies the parsed properties to this component.
 * @param {object} props An object containing the parsed properties for this component.
 * @private
 */
DvtOverview.prototype._applyParsedProperties = function(props) 
{
  this._start = props.start;
  this._end = props.end;
  this._width = props.width;
  this._renderStart = props.renderStart;
  this._currentTime = props.currentTime;
  this._initialFocusTime = props.initialFocusTime;
  this._animationOnClick = props.animationOnClick;

  // chart specific options: left and right margin
  this._leftMargin = Math.max(0, props.leftMargin);
  this._rightMargin = Math.max(0, props.rightMargin);
  if (isNaN(this._leftMargin))
    this._leftMargin = 0;
  if (isNaN(this._rightMargin))
    this._rightMargin = 0;

  this._orientation = props.orientation;
  this._overviewPosition = props.overviewPosition;
  this._isRtl = props.isRtl;
  if (props.featuresOff != null)
    this._featuresOff = props.featuresOff.split(' ');
  if (props.minimumWindowSize != null && props.minimumWindowSize > 0)
    this._minimumWindowSize = props.minimumWindowSize;

  this._borderStyles = props.borderStyles;
  this._timeAxisInfo = props.timeAxisInfo;
  if (props.timeAxisInfo != null)
    this._ticks = this._timeAxisInfo.ticks;
  this._formattedTimeRanges = props.formattedTimeRanges;

  this._borderTopStyle = props.borderTopStyle;
  this._borderTopColor = props.borderTopColor;

  this._windowBackgroundColor = props.windowBackgroundColor;
  this._windowBackgroundAlpha = props.windowBackgroundAlpha;
  this._windowBorderTopStyle = props.windowBorderTopStyle;
  this._windowBorderRightStyle = props.windowBorderRightStyle;
  this._windowBorderBottomStyle = props.windowBorderBottomStyle;
  this._windowBorderLeftStyle = props.windowBorderLeftStyle;
  this._windowBorderTopColor = props.windowBorderTopColor;
  this._windowBorderRightColor = props.windowBorderRightColor;
  this._windowBorderBottomColor = props.windowBorderBottomColor;
  this._windowBorderLeftColor = props.windowBorderLeftColor;

  this._handleTextureColor = props.handleTextureColor;
  this._handleFillColor = props.handleFillColor;
  this._handleBackgroundImage = props.handleBackgroundImage;
  this._handleWidth = props.handleWidth;
  this._handleHeight = props.handleHeight;

  this._overviewBackgroundColor = props.overviewBackgroundColor;
  this._currentTimeIndicatorColor = props.currentTimeIndicatorColor;
  this._timeIndicatorColor = props.timeIndicatorColor;
  this._timeAxisBarColor = props.timeAxisBarColor;
  this._timeAxisBarOpacity = props.timeAxisBarOpacity;

  // chart specific options: left and right filter panels
  this._leftFilterPanelColor = props.leftFilterPanelColor;
  this._leftFilterPanelAlpha = props.leftFilterPanelAlpha;
  this._rightFilterPanelColor = props.rightFilterPanelColor;
  this._rightFilterPanelAlpha = props.rightFilterPanelAlpha;
};


/***************************** common helper methods *********************************************/
DvtOverview.prototype.getDatePosition = function(date)
{
  return Math.max(0, DvtTimeUtils.getDatePosition(this._start, this._end, date, this.getOverviewSize())) + this._leftMargin;
};

DvtOverview.prototype.getPositionDate = function(pos)
{
  return DvtTimeUtils.getPositionDate(this._start, this._end, Math.max(0, pos - this._leftMargin), this.getOverviewSize());
};

DvtOverview.prototype.isRTL = function()
{
  return !this.isVertical() && (this._isRtl == 'true');
};

DvtOverview.prototype.isVertical = function()
{
  return (this._orientation == 'vertical');
};

DvtOverview.prototype.isOverviewAbove = function()
{
  return (this._overviewPosition == 'above');
};

// Sets the left and right margins, used by chart
DvtOverview.prototype.setMargins = function(leftMargin, rightMargin)
{
  if (!isNaN(leftMargin) && leftMargin != null && leftMargin > 0)
    this._leftMargin = leftMargin;

  if (!isNaN(rightMargin) && rightMargin != null && rightMargin > 0)
    this._rightMargin = rightMargin;
};

// returns the width of the overview, taking margins into account
DvtOverview.prototype.getOverviewSize = function()
{
  if (this.isVertical())
    return this.Height - this._leftMargin - this._rightMargin;
  else
    return this.Width - this._leftMargin - this._rightMargin;
};

// return the minmum position where the sliding window can reach
DvtOverview.prototype.getMinimumPosition = function()
{
  return this._leftMargin;
};

// return the maximum position where the sliding window can reach
DvtOverview.prototype.getMaximumPosition = function()
{
  if (this.isVertical())
    return this.Height - this._rightMargin;
  else
    return this.Width - this._rightMargin;
};

// returns the minimum size of the sliding window
DvtOverview.prototype.getMinimumWindowSize = function()
{
  if (this._minWinSize != null)
    return this._minWinSize;
  else if (this._minimumWindowSize != null)
  {
    this._minWinSize = DvtTimeUtils.getDatePosition(this._start, this._end, this._start + this._minimumWindowSize, this.getOverviewSize());
    return this._minWinSize;
  }
  else
    return DvtOverview.MIN_WINDOW_SIZE;
};

DvtOverview.prototype.getGrippySize = function()
{
  return 10;
};

// return the start of the resize handle
DvtOverview.prototype.getHandleStart = function()
{
  if (DvtTimeUtils.supportsTouch())
    return this.getHandleSize() / 2;
  else
    return 0;
};

// return the size of the resize handle, which is wider on touch devices
DvtOverview.prototype.getHandleSize = function() 
{
  if (DvtTimeUtils.supportsTouch())
    return 30;
  else
    return 10;
};

DvtOverview.prototype.isHandle = function(drawable) 
{
  var id = drawable.getId();
  return (id == 'lh' || id == 'rh' || id == 'lhb' || id == 'rhb' || id == 'grpy' || id == 'lbgrh' || id == 'rbgrh' || (drawable.getParent() != null && drawable.getParent().getId() == 'grpy'));
};

// for vertical
DvtOverview.prototype.getTimeAxisWidth = function()
{
  // checks if there is a time axis
  if (this._timeAxisInfo == null)
    return 0;

  // read from skin?
  if (this._timeAxisWidth == null)
  {
    var width = parseInt(this._timeAxisInfo.width, 10);
    if (!isNaN(width) && width < this.Width)
      this._timeAxisWidth = width;
    else
      this._timeAxisWidth = DvtOverview.DEFAULT_VERTICAL_TIMEAXIS_SIZE;
  }

  return this._timeAxisWidth;
};

DvtOverview.prototype.getTimeAxisHeight = function()
{
  // checks if there is a time axis
  if (this._timeAxisInfo == null)
    return 0;

  // read from skin?
  if (this._timeAxisHeight == null)
  {
    var height = parseInt(this._timeAxisInfo.height, 10);
    if (!isNaN(height) && height < this.Height)
      this._timeAxisHeight = height;
    else
      this._timeAxisHeight = DvtOverview.DEFAULT_HORIZONTAL_TIMEAXIS_SIZE;
  }

  return this._timeAxisHeight;
};

DvtOverview.prototype.getPageX = function(event)
{
  if (DvtTimeUtils.supportsTouch() && event.targetTouches != null)
  {
    if (event.targetTouches.length > 0)
      return event.targetTouches[0].pageX;
    else
      return null;
  }
  else
    return event.pageX;
};

DvtOverview.prototype.getPageY = function(event)
{
  if (DvtTimeUtils.supportsTouch() && event.targetTouches != null)
  {
    if (event.targetTouches.length > 0)
      return event.targetTouches[0].pageY;
    else
      return null;
  }
  else
    return event.pageY;
};


/**
 * Returns true if a panel should be rendered on the left and right side of the overview window.
 * By default they are not rendered.
 * @protected
 */
DvtOverview.prototype.isLeftAndRightFilterRendered = function()
{
  return false;
};

DvtOverview.prototype.getSlidingWindow = function()
{
  return this.getChildAt(1);
};

DvtOverview.prototype.getLeftBackground = function()
{
  if (this.isLeftAndRightFilterRendered())
    return this.getChildAt(3);
  else
    return null;
};

DvtOverview.prototype.getRightBackground = function()
{
  if (this.isLeftAndRightFilterRendered())
    return this.getChildAt(4);
  else
    return null;
};

DvtOverview.prototype.getLeftBackgroundHandle = function()
{
  if (this.isLeftAndRightFilterRendered() && !this.isFeatureOff('zoom'))
    return this.getChildAt(5);
  else
    return null;
};

DvtOverview.prototype.getRightBackgroundHandle = function()
{
  if (this.isLeftAndRightFilterRendered() && !this.isFeatureOff('zoom'))
    return this.getChildAt(6);
  else
    return null;
};

DvtOverview.prototype.getLeftHandle = function()
{
  var offset = this._lastChildIndex;
  return this.getChildAt(this.getNumChildren() - offset);
};

DvtOverview.prototype.getRightHandle = function()
{
  var offset = this._lastChildIndex - 1;
  return this.getChildAt(this.getNumChildren() - offset);
};

DvtOverview.prototype.getLeftTopBar = function()
{
  var offset = this._lastChildIndex - 2;
  return this.getChildAt(this.getNumChildren() - offset);
};

DvtOverview.prototype.getRightTopBar = function()
{
  var offset = this._lastChildIndex - 3;
  return this.getChildAt(this.getNumChildren() - offset);
};

DvtOverview.prototype.getBottomBar = function()
{
  var offset = this._lastChildIndex - 4;
  return this.getChildAt(this.getNumChildren() - offset);
};

DvtOverview.prototype.getTopBar = function()
{
  var offset = this._lastChildIndex - 5;
  return this.getChildAt(this.getNumChildren() - offset);
};

DvtOverview.prototype.setLinePos = function(line, pos1, pos2)
{
  if (this.isVertical())
  {
    if (pos1 != -1)
      line.setY1(pos1);
    if (pos2 != -1)
      line.setY2(pos2);
  }
  else
  {
    if (pos1 != -1)
      line.setX1(pos1);
    if (pos2 != -1)
      line.setX2(pos2);
  }
};

DvtOverview.prototype.getLinePos1 = function(line)
{
  if (this.isVertical())
    return line.getY1();
  else
    return line.getX1();
};


/**
 * Returns the drawable that is the target of the event.
 * @return {DvtBaseTreeNode} the target of the event
 */
DvtOverview.prototype._findDrawable = function(event) 
{
  var target = event.target;
  if (target != null)
  {
    var id = target.getId();
    if (id == null)
      return null;

    if (id.substr(id.length - 7) == '_border')
    {
      // if it's the border shape, returns the actual drawable
      return this.getChildAfter(target);
    }
    else if (id.substr(0, 4) != 'tick' && id != 'ltb' && id != 'rtb' && id != 'bb' && id != 'tab')
      return target;
  }

  return null;
};

DvtOverview.prototype.isMovable = function(drawable)
{
  if (drawable.getId() == 'window' ||
      drawable.getId() == 'ftr' ||
      drawable.getId() == 'sta' ||
      this.isHandle(drawable))
    return true;

  return false;
};

DvtOverview.prototype.isFlashEnvironment = function()
{
  return (window && window.isFlashEnvironment);
};

/***************************** end common helper methods *********************************************/


/***************************** marker creation and event handling *********************************************/
DvtOverview.prototype.createBackground = function(width, height)
{
  // draw a background shape covering all area to capture all mouse events
  var background = new DvtRect(this.getCtx(), 0, 0, width, height, 'bg');
  background.setSolidFill(this._overviewBackgroundColor);

  // Do not antialias the background
  background.setPixelHinting(true);

  this.addChild(background);
  return background;
};

DvtOverview.prototype.createSlidingWindow = function(width, height)
{
  var vertical = this.isVertical();

  // draw sliding window first so that it is under the markers
  if (vertical)
    var slidingWindow = new DvtRect(this.getCtx(), 0, 0, width, 0, 'window');
  else
    slidingWindow = new DvtRect(this.getCtx(), 0, 0, 0, height, 'window');
  slidingWindow.setSolidFill(this._windowBackgroundColor, this._windowBackgroundAlpha);

  // Do not antialias the Timeline Overview
  slidingWindow.setPixelHinting(true);

  if (!this.isFeatureOff('zoom'))
  {
    var handleSize = this.getHandleSize();
    var handleStart = this.getHandleStart();
    var grippySize = this.getGrippySize();
    if (vertical)
    {
      var handleX = (width - 36) / 2;
      var leftHandleCmds = DvtPathUtils.moveTo(handleX, 0) +
          DvtPathUtils.quadTo(handleX + 3, 6, handleX + 8, 8) +
                  DvtPathUtils.lineTo(handleX + 28, 8) +
                  DvtPathUtils.quadTo(handleX + 33, 6, handleX + 36, 0);
      DvtPathUtils.closePath();
      var rightHandleCmds = DvtPathUtils.moveTo(handleX, 0) +
          DvtPathUtils.quadTo(handleX + 3, -6, handleX + 8, -8) +
                  DvtPathUtils.lineTo(handleX + 28, -8) +
                  DvtPathUtils.quadTo(handleX + 33, -6, handleX + 36, 0);
      DvtPathUtils.closePath();
      var leftHandleBackground = new DvtRect(this.getCtx(), 0, 0, width, handleSize, 'lhb');
      var rightHandleBackground = new DvtRect(this.getCtx(), 0, 0, width, handleSize, 'rhb');
      var cursor = 'row-resize';

      if (this._handleBackgroundImage)
      {
        var leftGrippy = this.createGrippyImage(width, grippySize);
        var rightGrippy = this.createGrippyImage(width, grippySize);
      }
      else
      {
        leftGrippy = this.createGrippy(handleX);
        rightGrippy = this.createGrippy(handleX);
      }
    }
    else
    {
      var handleY = (height - 36) / 2;
      leftHandleCmds = DvtPathUtils.moveTo(0, handleY) +
          DvtPathUtils.quadTo(6, handleY + 3, 8, handleY + 8) +
                  DvtPathUtils.lineTo(8, handleY + 28) +
                  DvtPathUtils.quadTo(6, handleY + 33, 0, handleY + 36);
      DvtPathUtils.closePath();
      rightHandleCmds = DvtPathUtils.moveTo(0, handleY) +
          DvtPathUtils.quadTo(-6, handleY + 3, -8, handleY + 8) +
                  DvtPathUtils.lineTo(-8, handleY + 28) +
                  DvtPathUtils.quadTo(-6, handleY + 33, 0, handleY + 36);
      DvtPathUtils.closePath();
      leftHandleBackground = new DvtRect(this.getCtx(), 0 - handleStart, 0, handleSize, height, 'lhb');
      rightHandleBackground = new DvtRect(this.getCtx(), handleStart, 0, handleSize, height, 'rhb');
      cursor = 'col-resize';

      if (this._handleBackgroundImage)
      {
        leftGrippy = this.createGrippyImage(grippySize, height);
        rightGrippy = this.createGrippyImage(grippySize, height);
      }
      else
      {
        leftGrippy = this.createGrippy(handleY);
        rightGrippy = this.createGrippy(handleY);
      }
    }

    leftHandleBackground.setSolidFill(this._windowBackgroundColor, 0);
    rightHandleBackground.setSolidFill(this._windowBackgroundColor, 0);

    // Do not antialias the handle backgrounds
    leftHandleBackground.setPixelHinting(true);
    rightHandleBackground.setPixelHinting(true);

    var leftHandle = new DvtPath(this.getCtx(), leftHandleCmds, 'lh');
    var rightHandle = new DvtPath(this.getCtx(), rightHandleCmds, 'rh');
    leftHandle.setSolidFill(this._handleFillColor);
    leftHandle.setSolidStroke(this._handleFillColor);
    rightHandle.setSolidFill(this._handleFillColor);
    rightHandle.setSolidStroke(this._handleFillColor);

    // if the handle color is the same as the background color, it should not have antialiasing so it does not appear visible
    if (this._windowBackgroundColor == this._handleFillColor)
    {
      leftHandle.setPixelHinting(true);
      rightHandle.setPixelHinting(true);
    }

    // sets the resize cursor, for Flash this will hide the cursor and we will render our own cursor instead
    leftHandleBackground.setCursor(cursor);
    rightHandleBackground.setCursor(cursor);
    leftHandle.setCursor(cursor);
    rightHandle.setCursor(cursor);
    leftGrippy.setCursor(cursor);
    rightGrippy.setCursor(cursor);

    slidingWindow.addChild(leftHandleBackground);
    slidingWindow.addChild(leftHandle);
    slidingWindow.addChild(leftGrippy);
    slidingWindow.addChild(rightHandleBackground);
    slidingWindow.addChild(rightHandle);
    slidingWindow.addChild(rightGrippy);
  }

  // sets cursor AFTER adding child since toolkit adds a group and the cursor would be set on group instead
  slidingWindow.setCursor('move');
  this.addChild(slidingWindow);

  // border above time axis
  if (vertical)
    var timeAxisTopBar = new DvtLine(this.getCtx(), width - this.getTimeAxisWidth(), 0, width - this.getTimeAxisWidth(), height, 'tab');
  else
  {
    if (this.isOverviewAbove())
      timeAxisTopBar = new DvtLine(this.getCtx(), 0, this.getTimeAxisHeight(), width, this.getTimeAxisHeight(), 'tab');
    else
      timeAxisTopBar = new DvtLine(this.getCtx(), 0, height - this.getTimeAxisHeight(), width, height - this.getTimeAxisHeight(), 'tab');
  }
  timeAxisTopBar.setSolidStroke(this._timeAxisBarColor, this._timeAxisBarOpacity);

  // Do not antialias the time axis top bar
  timeAxisTopBar.setPixelHinting(true);

  this.addChild(timeAxisTopBar);

  if (this.isLeftAndRightFilterRendered())
  {
    if (vertical)
    {
      var leftBackground = new DvtRect(this.getCtx(), 0, 0, width, 0, 'lbg');
      var rightBackground = new DvtRect(this.getCtx(), 0, 0, width, 0, 'rbg');
    }
    else
    {
      leftBackground = new DvtRect(this.getCtx(), 0, 0, 0, height, 'lbg');
      rightBackground = new DvtRect(this.getCtx(), 0, 0, 0, height, 'rbg');
    }

    leftBackground.setSolidFill(this._leftFilterPanelColor, this._leftFilterPanelAlpha);
    this.addChild(leftBackground);
    rightBackground.setSolidFill(this._rightFilterPanelColor, this._rightFilterPanelAlpha);
    this.addChild(rightBackground);

    // the left and right background resize handle are needed for touch because the touch area for resize handle goes
    // beyond the handle and into the left and right background area, so we'll need something on top of the background
    if (DvtTimeUtils.supportsTouch() && handleStart != undefined)
    {
      var handleSize = this.getHandleStart();
      if (vertical)
      {
        var leftBackgroundResizeHandle = new DvtRect(this.getCtx(), 0, 0, width, handleStart, 'lbgrh');
        var rightBackgroundResizeHandle = new DvtRect(this.getCtx(), 0, 0, width, handleStart, 'rbgrh');
      }
      else
      {
        leftBackgroundResizeHandle = new DvtRect(this.getCtx(), 0, 0, handleStart, height, 'lbgrh');
        rightBackgroundResizeHandle = new DvtRect(this.getCtx(), 0, 0, handleStart, height, 'rbgrh');
      }

      leftBackgroundResizeHandle.setSolidFill(this._leftFilterPanelColor, 0);
      this.addChild(leftBackgroundResizeHandle);
      rightBackgroundResizeHandle.setSolidFill(this._rightFilterPanelColor, 0);
      this.addChild(rightBackgroundResizeHandle);
    }
  }
};

// renders the grippy from an image
DvtOverview.prototype.createGrippyImage = function(width, height)
{
  var posX = (width - this._handleWidth) / 2;
  var posY = (height - this._handleHeight) / 2;
  return new DvtImage(this.getCtx(), this._handleBackgroundImage, posX, posY, this._handleWidth, this._handleHeight, 'grpy');
};

// renders the dots in the grippy
DvtOverview.prototype.createGrippy = function(handlePos)
{
  var grippy = new DvtContainer(this.getCtx(), 'grpy');
  var gap = 2; // gap between dots
  var count = 9;  // how many dots to draw
  var color = this._handleTextureColor; // color of the dots

  if (this.isVertical())
  {
    var startx = 8 + handlePos;  // start x location of dots relative to container
    var starty = 3;  // start y location of dots relative to container
    for (var i = 0; i < count; i++)
    {
      var dot = new DvtLine(this.getCtx(), startx + i * gap, starty, startx + i * gap + 1, starty, 'dot1' + i);
      dot.setSolidStroke(color);
      grippy.addChild(dot);

      starty = starty + gap;
      dot = new DvtLine(this.getCtx(), (startx + 1) + i * gap, starty, (startx + 1) + i * gap + 1, starty, 'dot2' + i);
      dot.setSolidStroke(color);
      grippy.addChild(dot);

      starty = starty + gap;
      dot = new DvtLine(this.getCtx(), startx + i * gap, starty, startx + i * gap + 1, starty, 'dot3' + i);
      dot.setSolidStroke(color);
      grippy.addChild(dot);

      starty = 3;
    }

    dot = new DvtLine(this.getCtx(), startx + count * gap, starty, startx + count * gap + 1, starty, 'dot4');
    dot.setSolidStroke(color);
    grippy.addChild(dot);
    starty = starty + gap * 2;
    dot = new DvtLine(this.getCtx(), startx + count * gap, starty, startx + count * gap + 1, starty, 'dot5');
    dot.setSolidStroke(color);
    grippy.addChild(dot);
  }
  else
  {
    startx = 3;  // start x location of dots relative to container
    starty = 8 + handlePos;  // start y location of dots relative to container
    for (i = 0; i < count; i++)
    {
      dot = new DvtLine(this.getCtx(), startx, starty + i * gap, startx, starty + i * gap + 1, 'dot1' + i);
      dot.setSolidStroke(color);
      grippy.addChild(dot);

      startx = startx + gap;
      dot = new DvtLine(this.getCtx(), startx, (starty + 1) + i * gap, startx, (starty + 1) + i * gap + 1, 'dot2' + i);
      dot.setSolidStroke(color);
      grippy.addChild(dot);

      startx = startx + gap;
      dot = new DvtLine(this.getCtx(), startx, starty + i * gap, startx, starty + i * gap + 1, 'dot3' + i);
      dot.setSolidStroke(color);
      grippy.addChild(dot);

      startx = 3;
    }

    dot = new DvtLine(this.getCtx(), startx, starty + count * gap, startx, starty + count * gap + 1, 'dot4');
    dot.setSolidStroke(color);
    grippy.addChild(dot);
    startx = startx + gap * 2;
    dot = new DvtLine(this.getCtx(), startx, starty + count * gap, startx, starty + count * gap + 1, 'dot5');
    dot.setSolidStroke(color);
    grippy.addChild(dot);
  }

  // Do not antialias the grippy
  grippy.setPixelHinting(true);

  return grippy;
};

DvtOverview.prototype.updateSlidingWindow = function(width, height)
{
  var vertical = this.isVertical();

  var window = this.getSlidingWindow();
  var size = this.getOverviewSize();
  var actualSize = vertical ? this.Height : this.Width;

  var timelineWidth = this._width;
  var start = this._start;
  var end = this._end;
  var renderStart = this._renderStart;

  // first get the date using the width of timeline overview as position relative to the overall timeline
  var rangeStartTime = DvtTimeUtils.getPositionDate(start, end, 0, timelineWidth);
  var rangeEndTime = DvtTimeUtils.getPositionDate(start, end, actualSize, timelineWidth);

  // now find the position relative to the width of timeline overview
  var rangeStartPos = this.getDatePosition(rangeStartTime);
  var rangeEndPos = Math.min(actualSize, this.getDatePosition(rangeEndTime));
  var renderStartPos = this.getDatePosition(renderStart);

  var newLeft = renderStartPos;
  var newWidth = rangeEndPos - rangeStartPos;

  if (this.isRTL())
    this.setSlidingWindowPos(window, size - renderStartPos - newWidth);
  else
    this.setSlidingWindowPos(window, newLeft);
  this.setSlidingWindowSize(window, newWidth);

  this.ScrollTimeAxis();

  // update increment as well
  this._increment = this.calculateIncrement(size);
};

DvtOverview.prototype.createBorderAroundSlidingWindow = function(width, height)
{
  // add the left and right grip last since we want them over the markers
  var slidingWindow = this.getSlidingWindow();
  if (this.isVertical())
  {
    var top = slidingWindow.getY();
    var bottom = slidingWindow.getY() + slidingWindow.getHeight() - 1;

    if (this.isFlashEnvironment() || DvtAgent.isPlatformWebkit())
    {
      var left = 0;
      var right = width - 1;
    }
    else
    {
      left = 1;
      right = width;
    }

    var leftHandle = new DvtLine(this.getCtx(), 0, top, width, top, 'lh');
    var rightHandle = new DvtLine(this.getCtx(), 0, bottom, width, bottom, 'rh');

    var leftTopBar = new DvtLine(this.getCtx(), left, 0, left, top, 'ltb');
    var rightTopBar = new DvtLine(this.getCtx(), left, bottom, left, height, 'rtb');

    var bottomBar = new DvtLine(this.getCtx(), right, top, right, bottom, 'bb');
    var topBar = new DvtLine(this.getCtx(), left, top, left, bottom, 'tb');
  }
  else
  {
    top = 1;
    if (this.isFlashEnvironment())
      top = 0;
    bottom = height - 1;
    left = slidingWindow.getX();
    right = slidingWindow.getX() + slidingWindow.getWidth() - 1;
    leftHandle = new DvtLine(this.getCtx(), left, top, left, bottom, 'lh');
    rightHandle = new DvtLine(this.getCtx(), right, top, right, bottom, 'rh');

    /* This mode is not currently implemented ...
        if (this.isOverviewAbove())
        {
            leftTopBar = new DvtLine(this.getCtx(), 0, height-1, left, height-1, "ltb");
            rightTopBar = new DvtLine(this.getCtx(), right, height-1, width, height-1, "rtb");

            bottomBar = new DvtLine(this.getCtx(), left, 1, right, 1, "bb");
            topBar = new DvtLine(this.getCtx(), left, height-1, right, height-1, "tb");
        }
        else ... */

    // leftTopBar and rightTopBar are only visible in fusion skins
    leftTopBar = new DvtLine(this.getCtx(), 0, Math.max(0, top - 1), left + 1, Math.max(0, top - 1), 'ltb');
    rightTopBar = new DvtLine(this.getCtx(), right - 1, Math.max(0, top - 1), width, Math.max(0, top - 1), 'rtb');

    bottomBar = new DvtLine(this.getCtx(), left, bottom, right, bottom, 'bb');
    topBar = new DvtLine(this.getCtx(), left, top, right, top, 'tb');
  }

  // Do not antialias the sliding window borders
  leftHandle.setPixelHinting(true);
  rightHandle.setPixelHinting(true);
  leftTopBar.setPixelHinting(true);
  rightTopBar.setPixelHinting(true);
  bottomBar.setPixelHinting(true);
  topBar.setPixelHinting(true);

  if (this._windowBorderLeftStyle != 'none')
    leftHandle.setSolidStroke(this._windowBorderLeftColor);
  this.addChild(leftHandle);

  if (this._windowBorderRightStyle != 'none')
    rightHandle.setSolidStroke(this._windowBorderRightColor);
  this.addChild(rightHandle);

  if (this._borderTopStyle != 'none' && this._borderTopColor)
  {
    leftTopBar.setSolidStroke(this._borderTopColor);
    rightTopBar.setSolidStroke(this._borderTopColor);
  }
  this.addChild(leftTopBar);
  this.addChild(rightTopBar);

  if (this._windowBorderBottomStyle != 'none')
    bottomBar.setSolidStroke(this._windowBorderBottomColor);
  this.addChild(bottomBar);

  if (this._windowBorderTopStyle != 'none')
    topBar.setSolidStroke(this._windowBorderTopColor);
  this.addChild(topBar);
};

DvtOverview.prototype.createResizeArrow = function()
{
  if (this.isVertical())
  {
    var arrowCmds = DvtPathUtils.moveTo(6, 0) +
        DvtPathUtils.lineTo(0, 5) +
        DvtPathUtils.lineTo(5, 5) +
        DvtPathUtils.lineTo(5, 17) +
        DvtPathUtils.lineTo(0, 17) +
        DvtPathUtils.lineTo(6, 22) +
        DvtPathUtils.lineTo(12, 17) +
        DvtPathUtils.lineTo(7, 17) +
        DvtPathUtils.lineTo(7, 5) +
        DvtPathUtils.lineTo(12, 5) +
        DvtPathUtils.closePath();
  }
  else
  {
    arrowCmds = DvtPathUtils.moveTo(5, 0) +
        DvtPathUtils.lineTo(0, 6) +
        DvtPathUtils.lineTo(5, 12) +
        DvtPathUtils.lineTo(5, 7) +
        DvtPathUtils.lineTo(17, 7) +
        DvtPathUtils.lineTo(17, 12) +
        DvtPathUtils.lineTo(22, 6) +
        DvtPathUtils.lineTo(17, 0) +
        DvtPathUtils.lineTo(17, 4) +
        DvtPathUtils.lineTo(5, 4) +
        DvtPathUtils.lineTo(5, 0) +
        DvtPathUtils.closePath();
  }

  var arrow = new DvtPath(this.getCtx(), arrowCmds, 'arr');
  arrow.setSolidFill('#ffffff');
  arrow.setSolidStroke('#000000');
  arrow.setVisible(false);
  this.addChild(arrow);

  return arrow;
};

// orientation independent method
DvtOverview.prototype.setRectPos = function(rect, pos)
{
  if (this.isVertical())
    rect.setY(pos);
  else
    rect.setX(pos);
};

DvtOverview.prototype.getRectPos = function(rect)
{
  if (this.isVertical())
    return rect.getY();
  else
    return rect.getX();
};

DvtOverview.prototype.getRectSize = function(rect)
{
  if (this.isVertical())
    return rect.getHeight();
  else
    return rect.getWidth();
};

DvtOverview.prototype.setRectSize = function(rect, size)
{
  if (this.isVertical())
    rect.setHeight(size);
  else
    rect.setWidth(size);
};

DvtOverview.prototype.getSlidingWindowPos = function(slidingWindow)
{
  if (this.isVertical())
    return slidingWindow.getTranslateY();
  else
    return slidingWindow.getTranslateX();
};

DvtOverview.prototype.setSlidingWindowPos = function(slidingWindow, pos)
{
  // make sure it cannot be negative
  pos = Math.max(0, pos);

  if (this.isVertical())
    slidingWindow.setTranslateY(pos);
  else
    slidingWindow.setTranslateX(pos);

  if (this.isLeftAndRightFilterRendered())
  {
    var leftBackground = this.getLeftBackground();
    leftBackground.setWidth(pos);
    var rightStart = pos + this.getSlidingWindowSize(slidingWindow);
    var rightBackground = this.getRightBackground();
    rightBackground.setX(rightStart);
    rightBackground.setWidth(Math.max(0, this.Width - rightStart));

    // updates the background resize handle for touch
    if (DvtTimeUtils.supportsTouch() && !this.isFeatureOff('zoom'))
    {
      var handleStart = this.getHandleStart();
      var leftBackgroundHandle = this.getLeftBackgroundHandle();
      leftBackgroundHandle.setX(pos - handleStart);
      var rightBackgroundHandle = this.getRightBackgroundHandle();
      rightBackgroundHandle.setX(rightStart);
    }
  }
};

DvtOverview.prototype.getSlidingWindowSize = function(slidingWindow)
{
  return this.getRectSize(slidingWindow);
};

DvtOverview.prototype.setSlidingWindowSize = function(slidingWindow, size)
{
  // make sure it's greater than the minimum window size
  size = Math.max(this.getMinimumWindowSize(), size);

  // make sure it does not exceed overview
  size = Math.min(this.isVertical() ? this.Height : this.Width, size);

  this.setRectSize(slidingWindow, size);

  // update left and right filter if one is specified
  if (this.isLeftAndRightFilterRendered())
  {
    var rightStart = this.getSlidingWindowPos(slidingWindow) + size;
    var rightBackground = this.getRightBackground();
    rightBackground.setX(rightStart);
    rightBackground.setWidth(Math.max(0, this.Width - rightStart));

    // updates the background resize handle for touch
    if (DvtTimeUtils.supportsTouch() && !this.isFeatureOff('zoom'))
    {
      var rightBackgroundHandle = this.getRightBackgroundHandle();
      rightBackgroundHandle.setX(rightStart);
    }
  }

  // if resize feature is off then there's nothing else to do
  if (this.isFeatureOff('zoom'))
    return;

  // update the resize handles
  var rightHandleBackground = slidingWindow.getChildAt(3);
  var rightHandle = slidingWindow.getChildAt(4);
  var rightGrippy = slidingWindow.getChildAt(5);
  if (this.isVertical())
  {
    rightHandle.setTranslateY(size);
    rightHandleBackground.setTranslateY(size - this.getHandleSize());
    rightGrippy.setTranslateY(size - this.getGrippySize());
  }
  else
  {
    rightHandle.setTranslateX(size);
    rightHandleBackground.setTranslateX(size - this.getHandleSize());
    rightGrippy.setTranslateX(size - this.getGrippySize());
  }
};

DvtOverview.prototype.calculateIncrement = function(overviewWidth)
{
  var timelineWidth = this._width;
  var start = this._start;
  var end = this._end;

  // get the date diff for 1 pixel
  var day1 = DvtTimeUtils.getPositionDate(start, end, 1, overviewWidth);
  var day2 = DvtTimeUtils.getPositionDate(start, end, 2, overviewWidth);

  // now map it back to whole timeline for position
  var pos1 = DvtTimeUtils.getDatePosition(start, end, day1, timelineWidth);
  var pos2 = DvtTimeUtils.getDatePosition(start, end, day2, timelineWidth);

  var inc = pos2 - pos1;
  return inc;
};

DvtOverview.prototype.updateTimeAxis = function(width, height)
{
  if (this._ticks == null)
    return;

  var vertical = this.isVertical();
  var size = this.getOverviewSize();

  var start = this._start;
  var end = this._end;

  for (var i = 0; i < this._ticks.length; i++)
  {
    var child = this._ticks[i];

    var time = parseInt(child.getAttr('time'), 10);
    var time_pos = this.getDatePosition(time);
    var label = child.getAttr('label');

    var maxWidth = 0;
    if (i + 1 < this._ticks.length)
    {
      var next_time = parseInt(this._ticks[i + 1].getAttr('time'), 10);
      var next_time_pos = this.getDatePosition(next_time);
      maxWidth = next_time_pos - time_pos;
    }
    else
    {
      // last label
      maxWidth = size - time_pos;
    }

    if (this.isRTL())
      time_pos = size - time_pos;

    this.addTick(time_pos, width, height, 'tick' + i);
    this.addLabel(time_pos, label, width, height, maxWidth, 'label' + i);
  }
};

// adds a tick mark
DvtOverview.prototype.addTick = function(pos, width, height, id)
{
  if (this.isVertical())
    var line = new DvtLine(this.getCtx(), 0, pos, width, pos, id);
  else
    line = new DvtLine(this.getCtx(), pos, 0, pos, height, id);
  var stroke = new DvtSolidStroke(this._timeIndicatorColor);
  stroke.setStyle(DvtStroke.DASHED, 3);
  line.setStroke(stroke);

  // Do not antialias tick marks
  line.setPixelHinting(true);

  this.addChild(line);
};

// add a label in time axis
DvtOverview.prototype.addLabel = function(pos, text, width, height, maxWidth, id)
{
  if (this.isVertical())
    var label = new DvtOutputText(this.getCtx(), text, 4, pos, id);
  else
  {
    if (this.isOverviewAbove())
      var y = 2;
    else
      y = height - this.getTimeAxisHeight() + 2;

    label = new DvtOutputText(this.getCtx(), text, pos + 5, y, id);
  }

  label.setCSSStyle(new DvtCSSStyle('font-weight:bold'));

  DvtTextUtils.fitText(label, maxWidth, Infinity, this);

  // save the raw text for tooltip
  label._rawText = label.getUntruncatedTextString();
};

DvtOverview.prototype.updateCurrentTime = function(width, height)
{
  if (this._currentTime == null || isNaN(this._currentTime))
    return;

  var start = this._start;
  var end = this._end;
  var time_pos = this.getDatePosition(this._currentTime);

  if (this.isVertical())
    var line = new DvtLine(this.getCtx(), 0, time_pos, width, time_pos, 'ocd');
  else
  {
    if (this.isRTL())
      time_pos = width - time_pos;
    line = new DvtLine(this.getCtx(), time_pos, 0, time_pos, height, 'ocd');
  }
  line.setSolidStroke(this._currentTimeIndicatorColor);

  // Do not antialias current time line
  line.setPixelHinting(true);

  this.addChild(line);
};

DvtOverview.prototype.parseFilledTimeRangesXML = function(width, height)
{
  if (this._formattedTimeRanges == null)
    return;

  // draw filled time ranges so that it is over the sliding window but under the markers
  var start = this._start;
  var end = this._end;

  for (var i = 0; i < this._formattedTimeRanges.length; i++)
  {
    var ftr = this._formattedTimeRanges[i];
    this.addFilledTimeRange(ftr, start, end, width, height);
  }
};

DvtOverview.prototype.addFilledTimeRange = function(elem, start, end, width, height)
{
  var rangeStart = parseInt(elem.getAttr('rs'), 10);
  var rangeEnd = parseInt(elem.getAttr('re'), 10);
  var color = elem.getAttr('c');

  if (rangeStart != null && rangeEnd != null)
  {
    var size = this.getOverviewSize();

    var rangeStart_pos = this.getDatePosition(rangeStart);
    var rangeEnd_pos = this.getDatePosition(rangeEnd);
    var rangeWidth = rangeEnd_pos - rangeStart_pos;
    if (this.isRTL())
    {
      rangeStart_pos = size - rangeStart_pos - rangeWidth;
      rangeEnd_pos = size - rangeEnd_pos - rangeWidth;
    }

    if (this.isVertical())
      var displayable = new DvtRect(this.getCtx(), 0, rangeStart_pos, width - this.getTimeAxisWidth(), rangeWidth, 'ftr');
    else
      displayable = new DvtRect(this.getCtx(), rangeStart_pos, this.isOverviewAbove() ? this.getTimeAxisHeight() : 0, rangeWidth, height - this.getTimeAxisHeight(), 'ftr');

    if (color != null)
      displayable.setSolidFill(color, 0.4);
    displayable.setCursor('move');

    // Do not antialias filled time range
    displayable.setPixelHinting(true);

    this.addChild(displayable);
  }
};

DvtOverview.prototype.parseDataXML = function(width, height)
{
};


/************************** sliding window animation *********************************************/
DvtOverview.prototype.animateSlidingWindow = function(newLeft, newWidth)
{
  var slidingWindow = this.getSlidingWindow();
  var handleBackground = slidingWindow.getChildAt(3);
  var handle = slidingWindow.getChildAt(4);
  var grippy = slidingWindow.getChildAt(5);

  // first check if sliding window move or resize at all
  if (newWidth == undefined && newLeft == this.getSlidingWindowPos(slidingWindow))
    return;

  var leftHandle = this.getLeftHandle();
  var rightHandle = this.getRightHandle();
  var leftTopBar = this.getLeftTopBar();
  var rightTopBar = this.getRightTopBar();
  var bottomBar = this.getBottomBar();
  var topBar = this.getTopBar();

  if (this.isVertical())
  {
    var posGetter = slidingWindow.getTranslateY;
    var posSetter = slidingWindow.setTranslateY;
    var sizeGetter = slidingWindow.getHeight;
    var sizeSetter = slidingWindow.setHeight;
    var leftHandlePos1Getter = leftHandle.getY1;
    var leftHandlePos1Setter = leftHandle.setY1;
    var leftHandlePos2Getter = leftHandle.getY2;
    var leftHandlePos2Setter = leftHandle.setY2;
    var rightHandlePos1Getter = rightHandle.getY1;
    var rightHandlePos1Setter = rightHandle.setY1;
    var rightHandlePos2Getter = rightHandle.getY2;
    var rightHandlePos2Setter = rightHandle.setY2;
    var leftTopBarPosGetter = leftTopBar.getY2;
    var leftTopBarPosSetter = leftTopBar.setY2;
    var rightTopBarPosGetter = rightTopBar.getY1;
    var rightTopBarPosSetter = rightTopBar.setY1;
    var bottomBarPos1Getter = bottomBar.getY1;
    var bottomBarPos1Setter = bottomBar.setY1;
    var bottomBarPos2Getter = bottomBar.getY2;
    var bottomBarPos2Setter = bottomBar.setY2;
    var topBarPos1Getter = topBar.getY1;
    var topBarPos1Setter = topBar.setY1;
    var topBarPos2Getter = topBar.getY2;
    var topBarPos2Setter = topBar.setY2;

    if (handle != null && grippy != null)
    {
      var handleGetter = handle.getTranslateY;
      var handleSetter = handle.setTranslateY;
      var grippyGetter = grippy.getTranslateY;
      var grippySetter = grippy.setTranslateY;
    }
  }
  else
  {
    posGetter = slidingWindow.getTranslateX;
    posSetter = slidingWindow.setTranslateX;
    sizeGetter = slidingWindow.getWidth;
    sizeSetter = slidingWindow.setWidth;
    leftHandlePos1Getter = leftHandle.getX1;
    leftHandlePos1Setter = leftHandle.setX1;
    leftHandlePos2Getter = leftHandle.getX2;
    leftHandlePos2Setter = leftHandle.setX2;
    rightHandlePos1Getter = rightHandle.getX1;
    rightHandlePos1Setter = rightHandle.setX1;
    rightHandlePos2Getter = rightHandle.getX2;
    rightHandlePos2Setter = rightHandle.setX2;
    leftTopBarPosGetter = leftTopBar.getX2;
    leftTopBarPosSetter = leftTopBar.setX2;
    rightTopBarPosGetter = rightTopBar.getX1;
    rightTopBarPosSetter = rightTopBar.setX1;
    bottomBarPos1Getter = bottomBar.getX1;
    bottomBarPos1Setter = bottomBar.setX1;
    bottomBarPos2Getter = bottomBar.getX2;
    bottomBarPos2Setter = bottomBar.setX2;
    topBarPos1Getter = topBar.getX1;
    topBarPos1Setter = topBar.setX1;
    topBarPos2Getter = topBar.getX2;
    topBarPos2Setter = topBar.setX2;

    if (handle != null && grippy != null)
    {
      handleGetter = handle.getTranslateX;
      handleSetter = handle.setTranslateX;
      grippyGetter = grippy.getTranslateX;
      grippySetter = grippy.setTranslateX;
    }
  }

  // make sure it doesn't go over
  var minPos = this.getMinimumPosition();
  var maxPos = this.getMaximumPosition();
  var slidingWindowSize = this.getSlidingWindowSize(slidingWindow);
  if (newWidth != undefined)
    newLeft = Math.max(minPos, Math.min(maxPos - newWidth, newLeft));
  else
    newLeft = Math.max(minPos, Math.min(maxPos - slidingWindowSize, newLeft));

  // sliding window
  var animator = this.isAnimationOnClick() ? new DvtAnimator(this.getCtx(), 0.5, 0, DvtEasing.linear) : null;
  this.animateProperty(animator, slidingWindow, posGetter, posSetter, newLeft);
  if (newWidth != undefined)
  {
    this.animateProperty(animator, slidingWindow, sizeGetter, sizeSetter, newWidth);
    if (handle != null)
      this.animateProperty(animator, handle, handleGetter, handleSetter, newWidth);
    if (handleBackground != null)
      this.animateProperty(animator, handleBackground, handleGetter, handleSetter, newWidth - this.getHandleSize());
    if (grippy != null)
      this.animateProperty(animator, grippy, grippyGetter, grippySetter, newWidth - this.getGrippySize());
  }

  // left and right handles
  this.animateProperty(animator, leftHandle, leftHandlePos1Getter, leftHandlePos1Setter, newLeft);
  this.animateProperty(animator, leftHandle, leftHandlePos2Getter, leftHandlePos2Setter, newLeft);

  if (newWidth != undefined)
  {
    this.animateProperty(animator, rightHandle, rightHandlePos1Getter, rightHandlePos1Setter, newLeft + newWidth);
    this.animateProperty(animator, rightHandle, rightHandlePos2Getter, rightHandlePos2Setter, newLeft + newWidth);
  }
  else
  {
    this.animateProperty(animator, rightHandle, rightHandlePos1Getter, rightHandlePos1Setter, newLeft + slidingWindowSize);
    this.animateProperty(animator, rightHandle, rightHandlePos2Getter, rightHandlePos2Setter, newLeft + slidingWindowSize);
  }

  // left and right top bar
  this.animateProperty(animator, leftTopBar, leftTopBarPosGetter, leftTopBarPosSetter, newLeft + 1);

  if (newWidth != undefined)
    this.animateProperty(animator, rightTopBar, rightTopBarPosGetter, rightTopBarPosSetter, newLeft + newWidth - 1);
  else
    this.animateProperty(animator, rightTopBar, rightTopBarPosGetter, rightTopBarPosSetter, newLeft + slidingWindowSize - 1);

  this.animateProperty(animator, bottomBar, bottomBarPos1Getter, bottomBarPos1Setter, newLeft);
  this.animateProperty(animator, topBar, topBarPos1Getter, topBarPos1Setter, newLeft);

  if (newWidth != undefined)
  {
    this.animateProperty(animator, bottomBar, bottomBarPos2Getter, bottomBarPos2Setter, newLeft + newWidth);
    this.animateProperty(animator, topBar, topBarPos2Getter, topBarPos2Setter, newLeft + newWidth);
  }
  else
  {
    this.animateProperty(animator, bottomBar, bottomBarPos2Getter, bottomBarPos2Setter, newLeft + slidingWindowSize);
    this.animateProperty(animator, topBar, topBarPos2Getter, topBarPos2Setter, newLeft + slidingWindowSize);
  }

  if (this.isLeftAndRightFilterRendered())
  {
    var leftBackground = this.getLeftBackground();
    var leftBackgroundGetter = leftBackground.getWidth;
    var leftBackgroundSetter = leftBackground.setWidth;
    this.animateProperty(animator, leftBackground, leftBackgroundGetter, leftBackgroundSetter, newLeft);

    var rightStart = newLeft + slidingWindowSize;
    var rightBackground = this.getRightBackground();
    var rightBackgroundGetter = rightBackground.getWidth;
    var rightBackgroundSetter = rightBackground.setWidth;
    var rightBackgroundPosGetter = rightBackground.getX;
    var rightBackgroundPosSetter = rightBackground.setX;

    if (this.isVertical())
      var timelineSize = this.Height;
    else
      timelineSize = this.Width;
    this.animateProperty(animator, rightBackground, rightBackgroundGetter, rightBackgroundSetter, timelineSize - rightStart);
    this.animateProperty(animator, rightBackground, rightBackgroundPosGetter, rightBackgroundPosSetter, rightStart);

    if (DvtTimeUtils.supportsTouch() && !this.isFeatureOff('zoom'))
    {
      var handleStart = this.getHandleStart();
      var leftBackgroundHandle = this.getLeftBackgroundHandle();
      var leftBackgroundHandleGetter = leftBackgroundHandle.getX;
      var leftBackgroundHandleSetter = leftBackgroundHandle.setX;
      var rightBackgroundHandle = this.getRightBackgroundHandle();
      var rightBackgroundHandleGetter = rightBackgroundHandle.getX;
      var rightBackgroundHandleSetter = rightBackgroundHandle.setX;

      this.animateProperty(animator, leftBackgroundHandle, leftBackgroundHandleGetter, leftBackgroundHandleSetter, newLeft - handleStart);
      this.animateProperty(animator, rightBackgroundHandle, rightBackgroundHandleGetter, rightBackgroundHandleSetter, rightStart);
    }
  }

  if (animator != null)
    animator.play();
};

DvtOverview.prototype.animateProperty = function(animator, obj, getter, setter, value)
{
  if (animator != null)
    animator.addProp(DvtAnimator.TYPE_NUMBER, obj, getter, setter, value);
  else
    setter.call(obj, value);
};
/************************** end sliding window animation *********************************************/


/************************** event handling *********************************************/
DvtOverview.prototype.HandleShapeMouseOver = function(event)
{
  var drawable = this._findDrawable(event);
  // Return if no drawable is found
  if (!drawable || drawable.getId() == 'bg' || drawable.getId() == 'ocd')
    return;

  // if it is a label, show a tooltip of the label if it is truncated
  if (drawable.getId().substr(0, 5) == 'label' && drawable instanceof DvtOutputText)
  {
    if (drawable.isTruncated())
      this.getCtx().getTooltipManager().showDatatip(event.pageX, event.pageY, drawable._rawText, '#000000');
    return;
  }

  if (this._resizeArrow != null && this.isHandle(drawable))
  {
    var relPos = this.getCtx().pageToStageCoords(event.pageX, event.pageY);
    relPos = this.stageToLocal(relPos);
    if (this.isVertical())
    {
      this._resizeArrow.setTranslate(relPos.x + 6, relPos.y - 10);
    }
    else
    {
      this._resizeArrow.setTranslate(relPos.x - 6, relPos.y - 20);
    }
    this._resizeArrow.setVisible(true);
  }

  if (drawable.getId() == 'window' || drawable.getId() == 'ftr' || drawable.getId() == 'arr' || this.isHandle(drawable))
  {
    if (this.isFlashEnvironment())
      this.setCursor('move');

    return;
  }

  return drawable;
};

DvtOverview.prototype.HandleShapeMouseOut = function(event)
{
  // don't change cursor yet if we are in a moving state
  if (this._moveDrawable == null)
    this.setCursor('default');

  var drawable = this._findDrawable(event);
  if (drawable == null)
    return;

  // dismiss resize arrow
  if (this.isHandle(drawable) && this._resizeArrow != null)
    this._resizeArrow.setVisible(false);

  return drawable;
};

DvtOverview.prototype.HandleShapeClick = function(event, pageX, pageY)
{
  // so that graph will not get a click event and clear selection
  event.stopPropagation();

  var drawable = this._findDrawable(event);

  // Return if no drawable is found
  if (!drawable || drawable.getId() == 'window' || this.isHandle(drawable))
    return;

  // if clicking anywhere on the overview scroll to the location
  if (drawable.getId() == 'bg' || drawable.getId().substr(0, 5) == 'label' || drawable.getId() == 'ocd' || drawable.getId() == 'lbg' || drawable.getId() == 'rbg')
  {
    if (pageX == undefined)
      pageX = event.pageX;
    if (pageY == undefined)
      pageY = event.pageY;

    var relPos = this.getCtx().pageToStageCoords(pageX, pageY);
    relPos = this.stageToLocal(relPos);
    if (this.isVertical())
    {
      var pos = relPos.y;
      var size = this.Height;
    }
    else
    {
      pos = relPos.x;
      size = this.Width;
    }

    // scroll sliding window
    var slidingWindow = this.getSlidingWindow();
    var newPos = pos - this.getRectSize(slidingWindow) / 2;
    this.animateSlidingWindow(newPos);

    if (this.isRTL())
      pos = this.Width - pos;

    var time = this.getPositionDate(pos);

    // scroll timeline
    var evt = new DvtOverviewEvent(DvtOverviewEvent.SUBTYPE_SCROLL_TIME);
    evt.setTime(time);

    // make sure position is in bound
    newPos = Math.max(0, Math.min(newPos, size - this.getRectSize(slidingWindow)));

    if (this.isRTL())
    {
      var newStartTime = this.getPositionDate(this.Width - (newPos + this.getRectSize(slidingWindow)));
      var newEndTime = this.getPositionDate(this.Width - newPos);
    }
    else
    {
      newStartTime = this.getPositionDate(newPos);
      newEndTime = this.getPositionDate(newPos + this.getRectSize(slidingWindow));
    }
    evt.setNewStartTime(newStartTime);
    evt.setNewEndTime(newEndTime);

    this.dispatchEvent(evt);

    return;
  }

  return drawable;
};

DvtOverview.prototype.HandleMouseDown = function(event)
{
  this.HandleMouseDownOrTouchStart(event);
};

DvtOverview.prototype.HandleMouseDownOrTouchStart = function(event)
{
  // since we are stopping propagation, we'll need to detect and handle click event for Touch ourselves
  event.stopPropagation();

  var drawable = this._findDrawable(event);
  if (drawable != null && this.isMovable(drawable))
  {
    // if the drawable is the formatted time ranges, move the sliding window
    if (drawable.getId() == 'ftr' || drawable.getId() == 'sta')
      drawable = this.getSlidingWindow();

    this._initX = this.getPageX(event);
    this._initY = this.getPageY(event);

    if (this.isHandle(drawable))
    {
      var slidingWindow = this.getSlidingWindow();
      if (this.isRTL())
      {
        this._oldEndPos = this.Width - slidingWindow.getX();
        this._oldStartPos = this._oldEndPos - slidingWindow.getWidth();
      }
      else
      {
        this._oldStartPos = slidingWindow.getX();
        this._oldEndPos = this._oldStartPos + slidingWindow.getWidth();
      }

      if (drawable.getParent().getId() == 'grpy')
        drawable = drawable.getParent();

      var drawableId = drawable.getId();

      if (drawableId == 'grpy')
      {
        drawable = slidingWindow.getChildBefore(drawable);
        drawableId = drawable.getId();
      }

      if (drawableId == 'lh' || drawableId == 'rh')
      {
        drawable = slidingWindow.getChildBefore(drawable);
        drawableId = drawable.getId();
      }

      if (drawableId == 'lbgrh')
        drawable = slidingWindow.getChildAt(0);

      if (drawableId == 'rbgrh')
        drawable = slidingWindow.getChildAt(slidingWindow.getNumChildren() - 3);

      // drawable should be lhb or rhb
      // temporarily increase size of handle to capture wider area and prevent cursor from changing
      // only do this for non touch since we won't run into cursor issue
      if (!DvtTimeUtils.supportsTouch())
      {
        if (this.isVertical())
        {
          drawable.setY(0 - DvtOverview.HANDLE_PADDING_SIZE);
          drawable.setHeight((drawable.getHeight() + DvtOverview.HANDLE_PADDING_SIZE) * 2);
        }
        else
        {
          drawable.setX(0 - DvtOverview.HANDLE_PADDING_SIZE);
          drawable.setWidth((drawable.getWidth() + DvtOverview.HANDLE_PADDING_SIZE) * 2);
        }
      }

      // temporily change the cursor of other areas of overview so that
      // the cursor won't change when it is moved outside of the handle
      this.overrideCursors(drawable.getCursor());
    }

    this._moveDrawable = drawable;

    // ask the overview peer to notify us if the release happened outside of the overview
    // see stopDragAction method
    var evt = new DvtOverviewEvent(DvtOverviewEvent.SUBTYPE_PRE_RANGECHANGE);
    this.dispatchEvent(evt);
  }
};

// Change the cursor of the sliding window and the left and right backgrounds
DvtOverview.prototype.overrideCursors = function(cursor)
{
  var slidingWindow = this.getSlidingWindow();
  if (slidingWindow != null)
    slidingWindow.setCursor(cursor);

  if (this.isLeftAndRightFilterRendered())
  {
    var leftBackground = this.getLeftBackground();
    var rightBackground = this.getRightBackground();
    if (leftBackground != null && rightBackground != null)
    {
      leftBackground.setCursor(cursor);
      rightBackground.setCursor(cursor);
    }
  }
};

// reset the cursor to what it was original state
DvtOverview.prototype.resetCursors = function()
{
  var slidingWindow = this.getSlidingWindow();
  if (slidingWindow != null)
    slidingWindow.setCursor('move');

  if (this.isLeftAndRightFilterRendered())
  {
    var leftBackground = this.getLeftBackground();
    var rightBackground = this.getRightBackground();
    if (leftBackground != null && rightBackground != null)
    {
      leftBackground.setCursor('default');
      rightBackground.setCursor('default');
    }
  }
};

DvtOverview.prototype.HandleMouseUp = function(event)
{
  this.HandleMouseUpOrTouchEnd(event);
};

DvtOverview.prototype.HandleMouseUpOrTouchEnd = function(event)
{
  // stop bubbling
  if (event != null)
    event.stopPropagation();

  if (this._moveDrawable != null)
  {
    if (this._moveDrawable.getId() == 'window')
      this.finishWindowDrag(event, 0, 0);
    else if (this.isHandle(this._moveDrawable))
    {
      this.finishHandleDrag(event, 0, 0);

      // reset the temporarily resized handle
      if (!DvtTimeUtils.supportsTouch())
      {
        if (this.isVertical())
        {
          this._moveDrawable.setY(0);
          this._moveDrawable.setHeight(this.getHandleSize());
        }
        else
        {
          this._moveDrawable.setX(0);
          this._moveDrawable.setWidth(this.getHandleSize());
        }
      }

      // reset cursors that were temporily changed
      this.resetCursors();
    }

    this._moveDrawable = null;
    this._initX = -1;
  }
};

DvtOverview.prototype.HandleMouseMove = function(event)
{
  this.HandleMouseMoveOrTouchMove(event);
};

DvtOverview.prototype.HandleMouseMoveOrTouchMove = function(event)
{
  event.stopPropagation();

  if (this._moveDrawable != null && this._initX != -1)
  {
    var pageX = this.getPageX(event);
    var pageY = this.getPageY(event);
    var diffX = pageX - this._initX;
    var diffY = pageY - this._initY;
    this._initX = pageX;
    this._initY = pageY;

    if (this._moveDrawable.getId() == 'window')
    {
      this.handleWindowDragPositioning(event, diffX, diffY);
    }
    else if (this._moveDrawable.getId() == 'lh' || this._moveDrawable.getId() == 'lhb')
    {
      this.handleLeftHandleDragPositioning(event, diffX, diffY);
    }
    else if (this._moveDrawable.getId() == 'rh' || this._moveDrawable.getId() == 'rhb')
    {
      this.handleRightHandleDragPositioning(event, diffX, diffY);
    }
  }
};

DvtOverview.prototype.HandleTouchStart = function(event)
{
  var target = event.targetTouches[0];
  this._touchStartX = target.pageX;
  this._touchStartY = target.pageY;

  // see if this is a width change gesture
  if (event.targetTouches.length == 2)
  {
    // only prevent default if it is a multi-touch gesture otherwise we don't get click callback
    event.preventDefault();

    target = event.targetTouches[1];
    this._touchStartX2 = target.pageX;
    this._touchStartY2 = target.pageY;

    if (Math.abs(this._touchStartY - this._touchStartY2) < 20)
      this._counter = 0;
    else
    {
      this._touchStartX = null;
      this._touchStartY = null;
      this._touchStartX2 = null;
      this._touchStartY2 = null;
    }
  }
  else
  {
    this.HandleMouseDownOrTouchStart(event);
  }
};

DvtOverview.prototype.HandleTouchMove = function(event)
{
  event.preventDefault();

  // width change gesture
  if (this._touchStartX2 != null && this._touchStartY2 != null)
  {
    if (this._counter < 50)
    {
      // we can't do the dynamic update very often as it is very CPU intensive...
      this._counter++;
      return;
    }

    var target = event.targetTouches[1];

    var deltaX = target.pageX - this._touchStartX2;
    this.handleRightHandleDragPositioning(null, deltaX, 0);

    this._touchStartX2 = target.pageX;

    // reset
    this._counter = 0;
  }
  else
  {
    // null out the var to signal that this is not a click event
    // need to check actual coord since Android delivers touch move event regardless
    target = event.targetTouches[0];
    if (this._touchStartX != target.pageX || this._touchStartY != target.pageY)
    {
      this._touchStartX = null;
      this._touchStartY = null;
    }
    this.HandleMouseMoveOrTouchMove(event);
  }
};

DvtOverview.prototype.HandleTouchEnd = function(event)
{
  if (this._touchStartX2 != null && this._touchStartY2 != null)
  {
    // width change gesture
    this.finishHandleDrag(null, 0, 0);
  }
  else
  {
    this.HandleMouseUpOrTouchEnd(event);

    if (this._touchStartX != null && this._touchStartY != null)
      this.HandleShapeClick(event, this._touchStartX, this._touchStartY);
  }

  this._touchStartX = null;
  this._touchStartY = null;
  this._touchStartX2 = null;
  this._touchStartY2 = null;
};

// called externally from overview peer to stop all dragging if the drop action happened outside of the overview
DvtOverview.prototype.stopDragAction = function()
{
  this.HandleMouseUpOrTouchEnd(null);
};


/**
 * Handles keyboard event on the overview.
 * @param {Event} event the keyboard event
 */
DvtOverview.prototype.HandleKeyDown = function(event) 
{
  var keyCode = event.keyCode;
  if (keyCode === DvtKeyboardEvent.LEFT_ARROW || keyCode === DvtKeyboardEvent.RIGHT_ARROW)
  {
    var func = event.shiftKey ? this.handleRightHandleDragPositioning : this.handleWindowDragPositioning;
    var delta = keyCode === DvtKeyboardEvent.LEFT_ARROW ? -1 : 1;
    func.call(this, event, delta, delta);
  }
};


/**
 * Handles keyboard event on the overview.
 * @param {Event} event the keyboard event
 */
DvtOverview.prototype.HandleKeyUp = function(event) 
{
  var keyCode = event.keyCode;
  if (keyCode === DvtKeyboardEvent.LEFT_ARROW || keyCode === DvtKeyboardEvent.RIGHT_ARROW)
  {
    var func = event.shiftKey ? this.finishHandleDrag : this.finishWindowDrag;
    var delta = keyCode === DvtKeyboardEvent.LEFT_ARROW ? -1 : 1;
    func.call(this, event, delta, delta);
  }
};
/************************** end event handling *********************************************/

/***************************** window scrolling triggered by timeline *********************************************/
// called by peer
DvtOverview.prototype.ScrollToStart = function()
{
  var slidingWindow = this.getSlidingWindow();
  var totalWidth = this.Width;
  if (this.isRTL())
    this.setSlidingWindowPos(slidingWindow, totalWidth - this.getSlidingWindowSize(slidingWindow));
  else
    this.setSlidingWindowPos(slidingWindow, 0);

  this.ScrollTimeAxis();
};

DvtOverview.prototype.ScrollToEnd = function()
{
  var slidingWindow = this.getSlidingWindow();
  var totalWidth = this.Width;
  if (this.isRTL())
    this.setSlidingWindowPos(slidingWindow, 0);
  else
    this.setSlidingWindowPos(slidingWindow, totalWidth - this.getSlidingWindowSize(slidingWindow));

  this.ScrollTimeAxis();
};

DvtOverview.prototype.ScrollByAmount = function(amount)
{
  var slidingWindow = this.getSlidingWindow();
  // todo: rounding makes this inaccurate at some point, perhaps a way to sync up the scroll pos with actual data points?
  var actualAmount = amount / this._increment;
  if (this.isRTL())
    actualAmount = 0 - actualAmount;

  if (this.isVertical())
    var maxAmount = this.Height - slidingWindow.getHeight();
  else
    maxAmount = this.Width - slidingWindow.getWidth();

  this.setSlidingWindowPos(slidingWindow, Math.min(maxAmount, this.getSlidingWindowPos(slidingWindow) + actualAmount));

  this.ScrollTimeAxis();
};

// called by timeline peer keyboard navigation methods
DvtOverview.prototype.longScrollToPos = function(pos)
{
  var actualAmount = pos / this._increment;
  if (this.isRTL())
    actualAmount = 0 - actualAmount;

  this.animateSlidingWindow(actualAmount);
};

// called by timeline peer on restore position after zoom
DvtOverview.prototype.ScrollToPos = function(pos)
{
  var slidingWindow = this.getSlidingWindow();
  var actualAmount = pos / this._increment;
  if (this.isRTL())
    actualAmount = 0 - actualAmount;

  this.setSlidingWindowPos(slidingWindow, actualAmount);
  this.ScrollTimeAxis();
};


/**
 * Called by apps to scroll the overview window to a particular time
 * @public
 */
DvtOverview.prototype.scrollToTime = function(time)
{
  var pos = Math.max(0, DvtTimeUtils.getDatePosition(this._start, this._end, time, this._width));
  this.longScrollToPos(pos);
};
/************************** end window scrolling triggered by timeline *********************************************/


/***************************** window scrolling and resizing *********************************************/
DvtOverview.prototype.handleWindowDragPositioning = function(event, deltaX, deltaY)
{
  this.fireScrollEvent(DvtOverviewEvent.SUBTYPE_SCROLL_POS, deltaX, deltaY);
};

DvtOverview.prototype.finishWindowDrag = function(event, deltaX, deltaY)
{
  this.fireScrollEvent(DvtOverviewEvent.SUBTYPE_SCROLL_END, deltaX, deltaY);
};

DvtOverview.prototype.fireScrollEvent = function(type, deltaX, deltaY)
{
  var slidingWindow = this.getSlidingWindow();
  var pos = this.getSlidingWindowPos(slidingWindow);
  var size = this.getRectSize(slidingWindow);
  var minPos = this.getMinimumPosition();
  var maxPos = this.getMaximumPosition();

  if (this.isVertical())
    var delta = deltaY;
  else
    delta = deltaX;

  if ((pos + delta) <= minPos)
  {
    // hit the top
    this.setSlidingWindowPos(slidingWindow, minPos);
    if (this.isRTL())
      var scrollTo = DvtOverviewEvent.END_POS;
    else
      scrollTo = DvtOverviewEvent.START_POS;
  }
  else if (pos + size + delta >= maxPos)
  {
    // hit the bottom
    this.setSlidingWindowPos(slidingWindow, maxPos - size);
    if (this.isRTL())
      scrollTo = DvtOverviewEvent.START_POS;
    else
      scrollTo = DvtOverviewEvent.END_POS;
  }
  else
  {
    this.setSlidingWindowPos(slidingWindow, pos + delta);
    if (this.isRTL())
      scrollTo = (maxPos - size - pos - this._leftMargin) * this._increment;
    else
      scrollTo = (pos - this._leftMargin) * this._increment;
  }

  // sync window tima axis
  this.ScrollTimeAxis();

  // scroll timeline
  var evt = new DvtOverviewEvent(type);
  evt.setPosition(scrollTo);

  if (this.isRTL())
  {
    var newStartTime = this.getPositionDate(this.Width - (pos + this.getRectSize(slidingWindow)));
    var newEndTime = this.getPositionDate(this.Width - pos);
  }
  else
  {
    newStartTime = this.getPositionDate(pos);
    newEndTime = this.getPositionDate(pos + this.getRectSize(slidingWindow));
  }
  evt.setNewStartTime(newStartTime);
  evt.setNewEndTime(newEndTime);

  this.dispatchEvent(evt);
};

DvtOverview.prototype.handleLeftHandleDragPositioning = function(event, deltaX, deltaY)
{
  this.handleLeftOrRightHandleDragPositioning(event, deltaX, deltaY, true);
};

DvtOverview.prototype.handleRightHandleDragPositioning = function(event, deltaX, deltaY)
{
  this.handleLeftOrRightHandleDragPositioning(event, deltaX, deltaY, false);
};

DvtOverview.prototype.handleLeftOrRightHandleDragPositioning = function(event, deltaX, deltaY, isLeft)
{
  var size = this.getOverviewSize();
  if (this.isVertical())
    var delta = deltaY;
  else
    delta = deltaX;

  if (delta == 0)
    return;

  var slidingWindow = this.getSlidingWindow();
  var windowPos = this.getSlidingWindowPos(slidingWindow);
  var windowSize = this.getSlidingWindowSize(slidingWindow);
  if (isLeft)
  {
    // make sure width of sliding window is larger than minimum
    if (windowSize - delta <= this.getMinimumWindowSize())
      return;

    // make sure position of left handle is not less than minimum (delta is negative when moving handle to the left)
    if (windowPos + delta <= this.getMinimumPosition())
      return;

    // window should only resize when the cursor is back to where the handle is
    if (this.isVertical())
      var relPos = this.getCtx().pageToStageCoords(this.getPageX(event), this.getPageY(event)).y;
    else
      relPos = this.getCtx().pageToStageCoords(this.getPageX(event), this.getPageY(event)).x;
    relPos = this.stageToLocal(relPos);

    if (delta > 0 && relPos <= windowPos)
      return;
    else if (delta < 0 && relPos >= windowPos)
      return;

    this.setSlidingWindowPos(slidingWindow, windowPos + delta);
    this.setSlidingWindowSize(slidingWindow, windowSize - delta);
  }
  else
  {
    // make sure width of sliding window is larger than minimum
    if (windowSize + delta <= this.getMinimumWindowSize())
      return;

    // make sure position of right handle is not less than minimum
    if (windowPos + windowSize + delta >= this.getMaximumPosition())
      return;

    // window should only resize when the cursor is back to where the handle is
    if (this.isVertical())
      relPos = this.getCtx().pageToStageCoords(this.getPageX(event), this.getPageY(event)).y;
    else
      relPos = this.getCtx().pageToStageCoords(this.getPageX(event), this.getPageY(event)).x;
    relPos = this.stageToLocal(relPos);

    if (delta > 0 && relPos <= windowPos + windowSize)
      return;
    else if (delta < 0 && relPos >= windowPos + windowSize)
      return;

    this.setSlidingWindowSize(slidingWindow, windowSize + delta);
  }

  // sync with time axis
  this.ScrollTimeAxis();

  // dynamically update contents of timeline (time axis, position of items etc.)
  var time = this.getPositionDate(this.getSlidingWindowSize(slidingWindow));

  // if we know the position and date we can calculate the new width
  var newSize = (size * (this._end - this._start)) / (time - this._start);

  // tell event handler that time range is changing
  if (this.isRangeChangingSupported())
  {
    var evt = new DvtOverviewEvent(DvtOverviewEvent.SUBTYPE_RANGECHANGING);
    evt.setNewSize(newSize);
    evt.setEndHandle(this.isRTL() ? isLeft : !isLeft);
    if (isLeft)
      evt.setExpand((delta < 0));
    else
      evt.setExpand((delta > 0));

    if (this.isRTL())
    {
      var newStartTime = this.getPositionDate(this.Width - (this.getSlidingWindowPos(slidingWindow) + this.getRectSize(slidingWindow)));
      var newEndTime = this.getPositionDate(this.Width - this.getSlidingWindowPos(slidingWindow));
    }
    else
    {
      newStartTime = this.getPositionDate(this.getSlidingWindowPos(slidingWindow));
      newEndTime = this.getPositionDate(this.getSlidingWindowPos(slidingWindow) + this.getRectSize(slidingWindow));
    }
    evt.setNewStartTime(newStartTime);
    evt.setNewEndTime(newEndTime);

    this.dispatchEvent(evt);
  }
};

// whether to fire a range changing event, which will be fired continuously when the sliding window is resize
DvtOverview.prototype.isRangeChangingSupported = function()
{
  return true;
};

DvtOverview.prototype.finishHandleDrag = function(event, deltaX, deltaY)
{
  var start = this._start;
  var end = this._end;
  var oldSize = this._width;
  var size = this.getOverviewSize();

  var slidingWindow = this.getSlidingWindow();
  var time = this.getPositionDate(this.getRectSize(slidingWindow));

  // if we know the position and date we can calculate the new width
  var newSize = (size * (end - start)) / (time - start);

  var oldStartTime = this.getPositionDate(this._oldStartPos);
  var oldEndTime = this.getPositionDate(this._oldEndPos);
  if (this.isRTL())
  {
    var newStartTime = this.getPositionDate(this.Width - (this.getSlidingWindowPos(slidingWindow) + this.getRectSize(slidingWindow)));
    var newEndTime = this.getPositionDate(this.Width - this.getSlidingWindowPos(slidingWindow));
  }
  else
  {
    newStartTime = this.getPositionDate(this.getSlidingWindowPos(slidingWindow));
    newEndTime = this.getPositionDate(this.getSlidingWindowPos(slidingWindow) + this.getRectSize(slidingWindow));
  }

  // alert peer of time range change
  var evt = new DvtOverviewEvent(DvtOverviewEvent.SUBTYPE_RANGECHANGE);
  evt.setOldSize(oldSize);
  evt.setNewSize(newSize);
  evt.setOldStartTime(oldStartTime);
  evt.setOldEndTime(oldEndTime);
  evt.setNewStartTime(newStartTime);
  evt.setNewEndTime(newEndTime);
  this.dispatchEvent(evt);
};

// scroll time axis to match sliding window
// sync all parts of overview
DvtOverview.prototype.ScrollTimeAxis = function()
{
  var slidingWindow = this.getSlidingWindow();

  var leftHandle = this.getLeftHandle();
  var rightHandle = this.getRightHandle();
  var leftTopBar = this.getLeftTopBar();
  var rightTopBar = this.getRightTopBar();
  var bottomBar = this.getBottomBar();
  var topBar = this.getTopBar();

  this.setLinePos(leftHandle, this.getSlidingWindowPos(slidingWindow), this.getSlidingWindowPos(slidingWindow));
  this.setLinePos(rightHandle, this.getSlidingWindowPos(slidingWindow) + this.getSlidingWindowSize(slidingWindow), this.getSlidingWindowPos(slidingWindow) + this.getSlidingWindowSize(slidingWindow));
  this.setLinePos(leftTopBar, -1, this.getSlidingWindowPos(slidingWindow) + 1);
  this.setLinePos(rightTopBar, this.getLinePos1(rightHandle) - 1, -1);
  this.setLinePos(bottomBar, this.getLinePos1(leftHandle), this.getLinePos1(rightHandle));
  this.setLinePos(topBar, this.getLinePos1(leftHandle), this.getLinePos1(rightHandle));
};
/**************************end window scrolling and resizing *********************************************/


/**
 * Dispatches the event to the callback function.  This enables callback function on the peer.
 * @param {object} event The event to be dispatched.
 */
DvtOverview.prototype.dispatchEvent = function(event) 
{
  DvtEventDispatcher.dispatchEvent(this._callback, this._callbackObj, this, event);
};
/**
 * Overview JSON Parser
 * @param {DvtOverview} overview The owning Overview component.
 * @class
 * @constructor
 * @extends {DvtObj}
 */
var DvtOverviewParser = function(view) 
{
  this.Init(view);
};

DvtObj.createSubclass(DvtOverviewParser, DvtObj, 'DvtOverviewParser');

DvtOverviewParser.prototype.Init = function(view) 
{
  this._view = view;
};


/**
 * Parses the JSON object and returns the root node of the timeRangeSelector
 * @param {data} JSON object describing the component.
 * @return {object} An object containing the parsed properties
 */
DvtOverviewParser.prototype.parse = function(data) 
{
  // for now all the JSON contains should be options and no data, that could change in the future.
  var options = data;

  var ret = this.ParseRootAttributes(options);
  return ret;
};


/**
 * Parses the attributes on the root node.
 * @param {DvtXmlNode} xmlNode The xml node defining the root
 * @return {object} An object containing the parsed properties
 * @protected
 */
DvtOverviewParser.prototype.ParseRootAttributes = function(options) 
{
  // The object that will be populated with parsed values and returned
  var ret = new Object();

  // animation related options
  ret.animationOnClick = options['animationOnClick'];

  if (options['startTime'] != null)
    ret.start = options['startTime'];
  if (options['endTime'] != null)
    ret.end = options['endTime'];

  // start and end time are MANDATORY and start time must be before end time
  if (ret.start == null)
    ret.start = (new Date()).getTime();
  if (ret.end == null || ret.end <= ret.start)
    ret.end = ret.start + 1000 * 60 * 60 * 24;

  if (options['currentTime'] != null)
    ret.currentTime = options['currentTime'];
  if (options['initialFocusTime'] != null)
    ret.initialFocusTime = options['initialFocusTime'];

  ret.orientation = 'horizontal';
  if (options['orientation'] != null)
    ret.orientation = options['orientation'];

  ret.featuresOff = options['featuresOff'];
  ret.minimumWindowSize = options['minimumWindowSize'];
  ret.leftMargin = options['leftMargin'];
  ret.rightMargin = options['rightMargin'];

  // the time where the viewport of the associated view ends and the width is also MANDATORY
  if (options['viewportEndTime'] != null)
  {
    var viewportEndTime = options['viewportEndTime'];
    var viewportStartTime = ret.start;

    // if viewport start time is specified
    if (options['viewportStartTime'] != null && options['viewportStartTime'] < viewportEndTime)
      viewportStartTime = options['viewportStartTime'];

    // calculate the overall width of the container (i.e. timeline/chart)
    // if viewportEndPos wasn't specified, use width of overview, this basically assumes the width of the overview is
    // the same as the width of the view that the overview is associated with (timeline or chart)
    if (options['viewportEndPos'] != null)
      ret.width = this.calculateWidth(ret.start, ret.end, viewportStartTime, viewportEndTime, options['viewportEndPos']);
    else
      ret.width = this.calculateWidth(ret.start, ret.end, viewportStartTime, viewportEndTime, this._view.Width);

    ret.renderStart = viewportStartTime;
  }
  else
    ret.renderStart = ret.start;

  if (ret.width == 0)
    ret.width = 1000; // just some arbitrary default...

  ret.overviewPosition = 'below';
  ret.selectionMode = 'none';
  ret.isRtl = DvtAgent.isRightToLeft(this._view.getCtx()).toString();
  if (options['rtl'] != null)
    ret.isRtl = options['rtl'].toString();

  // should come from skin
  ret.handleFillColor = '#FFFFFF';
  ret.handleTextureColor = '#B3C6DB';
  ret.windowBackgroundColor = '#FFFFFF';
  ret.windowBackgroundAlpha = 1;
  ret.windowBorderTopStyle = 'solid';
  ret.windowBorderRightStyle = 'solid';
  ret.windowBorderBottomStyle = 'solid';
  ret.windowBorderLeftStyle = 'solid';
  ret.windowBorderTopColor = '#4F4F4F';
  ret.windowBorderRightColor = '#4F4F4F';
  ret.windowBorderBottomColor = '#4F4F4F';
  ret.windowBorderLeftColor = '#4F4F4F';
  ret.overviewBackgroundColor = '#E6ECF3';
  ret.currentTimeIndicatorColor = '#C000D1';
  ret.timeIndicatorColor = '#BCC7D2';
  ret.timeAxisBarColor = '#e5e5e5';
  ret.timeAxisBarOpacity = 1;
  ret.leftFilterPanelColor = '#FFFFFF';
  ret.leftFilterPanelAlpha = 0.7;
  ret.rightFilterPanelColor = '#FFFFFF';
  ret.rightFilterPanelAlpha = 0.7;

  // apply any styles overrides
  if (options['style'] != null)
  {
    if (options['style']['handleFillColor'] != null)
      ret.handleFillColor = options['style']['handleFillColor'];

    if (options['style']['handleTextureColor'] != null)
      ret.handleTextureColor = options['style']['handleTextureColor'];

    if (options['style']['handleBackgroundImage'] != null)
      ret.handleBackgroundImage = options['style']['handleBackgroundImage'];

    if (options['style']['handleWidth'] != null)
      ret.handleWidth = options['style']['handleWidth'];

    if (options['style']['handleHeight'] != null)
      ret.handleHeight = options['style']['handleHeight'];

    if (options['style']['windowBackgroundColor'] != null)
      ret.windowBackgroundColor = options['style']['windowBackgroundColor'];

    if (options['style']['windowBackgroundAlpha'] != null)
      ret.windowBackgroundAlpha = options['style']['windowBackgroundAlpha'];

    if (options['style']['windowBorderTopStyle'] != null)
      ret.windowBorderTopStyle = options['style']['windowBorderTopStyle'];

    if (options['style']['windowBorderRightStyle'] != null)
      ret.windowBorderRightStyle = options['style']['windowBorderRightStyle'];

    if (options['style']['windowBorderBottomStyle'] != null)
      ret.windowBorderBottomStyle = options['style']['windowBorderBottomStyle'];

    if (options['style']['windowBorderLeftStyle'] != null)
      ret.windowBorderLeftStyle = options['style']['windowBorderLeftStyle'];

    if (options['style']['windowBorderTopColor'] != null)
      ret.windowBorderTopColor = options['style']['windowBorderTopColor'];

    if (options['style']['windowBorderRightColor'] != null)
      ret.windowBorderRightColor = options['style']['windowBorderRightColor'];

    if (options['style']['windowBorderBottomColor'] != null)
      ret.windowBorderBottomColor = options['style']['windowBorderBottomColor'];

    if (options['style']['windowBorderLeftColor'] != null)
      ret.windowBorderLeftColor = options['style']['windowBorderLeftColor'];

    if (options['style']['overviewBackgroundColor'] != null)
      ret.overviewBackgroundColor = options['style']['overviewBackgroundColor'];

    if (options['style']['currentTimeIndicatorColor'] != null)
      ret.currentTimeIndicatorColor = options['style']['currentTimeIndicatorColor'];

    if (options['style']['timeIndicatorColor'] != null)
      ret.timeIndicatorColor = options['style']['timeIndicatorColor'];

    if (options['style']['leftFilterPanelColor'] != null)
      ret.leftFilterPanelColor = options['style']['leftFilterPanelColor'];

    if (options['style']['leftFilterPanelAlpha'] != null)
      ret.leftFilterPanelAlpha = options['style']['leftFilterPanelAlpha'];

    if (options['style']['rightFilterPanelColor'] != null)
      ret.rightFilterPanelColor = options['style']['rightFilterPanelColor'];

    if (options['style']['rightFilterPanelAlpha'] != null)
      ret.rightFilterPanelAlpha = options['style']['rightFilterPanelAlpha'];
  }

  return ret;
};

// convinient method to calculate the width based on start time/end time and viewport end time
DvtOverviewParser.prototype.calculateWidth = function(startTime, endTime, viewportStartTime, viewportEndTime, viewportEndPos)
{
  var number = viewportEndPos * (endTime - startTime);
  var denominator = (viewportEndTime - viewportStartTime);
  if (number == 0 || denominator == 0)
    return 0;

  return number / denominator;
};
/**
 * Encapsulates an event fired by Overview
 * @param {string} type The type of event fired by Overview
 * @class
 * @constructor
 */
var DvtOverviewEvent = function(type) {
  this.Init(DvtOverviewEvent.TYPE);
  this._subtype = type;
};

DvtObj.createSubclass(DvtOverviewEvent, DvtBaseComponentEvent, 'DvtOverviewEvent');

DvtOverviewEvent.TYPE = 'overview';

// fired when user initiate range change
DvtOverviewEvent.SUBTYPE_PRE_RANGECHANGE = 'dropCallback';

// fired when user clicks on an empty area which cause overview to scroll to where user clicks
DvtOverviewEvent.SUBTYPE_SCROLL_TIME = 'scrollTime';
// fired when user scrolls the overview window
DvtOverviewEvent.SUBTYPE_SCROLL_POS = 'scrollPos';
// fired when user finish scrolling the overview window
DvtOverviewEvent.SUBTYPE_SCROLL_END = 'scrollEnd';
// fired when user finish resizing the overview window
DvtOverviewEvent.SUBTYPE_RANGECHANGE = 'rangeChange';
// fired when user resizes the overview window
DvtOverviewEvent.SUBTYPE_RANGECHANGING = 'rangeChanging';

// keys to look up value
DvtOverviewEvent.TIME_KEY = 'time';
DvtOverviewEvent.POS_KEY = 'pos';

DvtOverviewEvent.OLD_SIZE_KEY = 'oldSize';
DvtOverviewEvent.NEW_SIZE_KEY = 'newSize';
DvtOverviewEvent.OLD_START_TIME_KEY = 'oldStartTime';
DvtOverviewEvent.NEW_START_TIME_KEY = 'newStartTime';
DvtOverviewEvent.OLD_END_TIME_KEY = 'oldEndTime';
DvtOverviewEvent.NEW_END_TIME_KEY = 'newEndTime';

DvtOverviewEvent.EXPAND_KEY = 'expand';
DvtOverviewEvent.END_HANDLE_KEY = 'endHandle';

DvtOverviewEvent.START_POS = -1;
DvtOverviewEvent.END_POS = -2;

DvtOverviewEvent.prototype.getSubType = function() 
{
  return this._subtype;
};


/****** scroll to time **************/
DvtOverviewEvent.prototype.setTime = function(time) 
{
  this.addParam(DvtOverviewEvent.TIME_KEY, time);
};

DvtOverviewEvent.prototype.getTime = function() 
{
  return this.getParamValue(DvtOverviewEvent.TIME_KEY);
};


/*********** range change ************/
DvtOverviewEvent.prototype.setOldSize = function(oldSize) 
{
  this.addParam(DvtOverviewEvent.OLD_SIZE_KEY, oldSize);
};

DvtOverviewEvent.prototype.getOldSize = function() 
{
  return this.getParamValue(DvtOverviewEvent.OLD_SIZE_KEY);
};

DvtOverviewEvent.prototype.setNewSize = function(newSize) 
{
  this.addParam(DvtOverviewEvent.NEW_SIZE_KEY, newSize);
};

DvtOverviewEvent.prototype.getNewSize = function() 
{
  return this.getParamValue(DvtOverviewEvent.NEW_SIZE_KEY);
};

DvtOverviewEvent.prototype.setOldStartTime = function(oldStartTime) 
{
  this.addParam(DvtOverviewEvent.OLD_START_TIME_KEY, oldStartTime);
};

DvtOverviewEvent.prototype.getOldStartTime = function() 
{
  return this.getParamValue(DvtOverviewEvent.OLD_START_TIME_KEY);
};

DvtOverviewEvent.prototype.setNewStartTime = function(newStartTime) 
{
  this.addParam(DvtOverviewEvent.NEW_START_TIME_KEY, newStartTime);
};

DvtOverviewEvent.prototype.getNewStartTime = function() 
{
  return this.getParamValue(DvtOverviewEvent.NEW_START_TIME_KEY);
};

DvtOverviewEvent.prototype.setOldEndTime = function(oldEndTime) 
{
  this.addParam(DvtOverviewEvent.OLD_END_TIME_KEY, oldEndTime);
};

DvtOverviewEvent.prototype.getOldEndTime = function() 
{
  return this.getParamValue(DvtOverviewEvent.OLD_END_TIME_KEY);
};

DvtOverviewEvent.prototype.setNewEndTime = function(newEndTime) 
{
  this.addParam(DvtOverviewEvent.NEW_END_TIME_KEY, newEndTime);
};

DvtOverviewEvent.prototype.getNewEndTime = function() 
{
  return this.getParamValue(DvtOverviewEvent.NEW_END_TIME_KEY);
};


/*********** range changing ************/
DvtOverviewEvent.prototype.setExpand = function(expand) 
{
  this.addParam(DvtOverviewEvent.EXPAND_KEY, expand);
};

DvtOverviewEvent.prototype.isExpand = function() 
{
  return this.getParamValue(DvtOverviewEvent.EXPAND_KEY);
};

DvtOverviewEvent.prototype.setEndHandle = function(endHandle) 
{
  this.addParam(DvtOverviewEvent.END_HANDLE_KEY, endHandle);
};

DvtOverviewEvent.prototype.isEndHandle = function() 
{
  return this.getParamValue(DvtOverviewEvent.END_HANDLE_KEY);
};


/************* scroll to pos ***************/
DvtOverviewEvent.prototype.setPosition = function(pos) 
{
  this.addParam(DvtOverviewEvent.POS_KEY, pos);
};

DvtOverviewEvent.prototype.getPosition = function() 
{
  return this.getParamValue(DvtOverviewEvent.POS_KEY);
};
});