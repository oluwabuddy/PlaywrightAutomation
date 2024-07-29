"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyLoadState = verifyLoadState;
exports.Frame = void 0;

var _utils = require("../utils/utils");

var _channelOwner = require("./channelOwner");

var _locator = require("./locator");

var _elementHandle = require("./elementHandle");

var _jsHandle = require("./jsHandle");

var _fs = _interopRequireDefault(require("fs"));

var network = _interopRequireWildcard(require("./network"));

var _events = require("events");

var _waiter = require("./waiter");

var _events2 = require("./events");

var _types = require("./types");

var _clientHelper = require("./clientHelper");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright 2017 Google Inc. All rights reserved.
 * Modifications copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Frame extends _channelOwner.ChannelOwner {
  static from(frame) {
    return frame._object;
  }

  static fromNullable(frame) {
    return frame ? Frame.from(frame) : null;
  }

  constructor(parent, type, guid, initializer) {
    super(parent, type, guid, initializer);
    this._eventEmitter = void 0;
    this._loadStates = void 0;
    this._parentFrame = null;
    this._url = '';
    this._name = '';
    this._detached = false;
    this._childFrames = new Set();
    this._page = void 0;
    this._eventEmitter = new _events.EventEmitter();

    this._eventEmitter.setMaxListeners(0);

    this._parentFrame = Frame.fromNullable(initializer.parentFrame);
    if (this._parentFrame) this._parentFrame._childFrames.add(this);
    this._name = initializer.name;
    this._url = initializer.url;
    this._loadStates = new Set(initializer.loadStates);

    this._channel.on('loadstate', event => {
      if (event.add) {
        this._loadStates.add(event.add);

        this._eventEmitter.emit('loadstate', event.add);
      }

      if (event.remove) this._loadStates.delete(event.remove);
    });

    this._channel.on('navigated', event => {
      this._url = event.url;
      this._name = event.name;

      this._eventEmitter.emit('navigated', event);

      if (!event.error && this._page) this._page.emit(_events2.Events.Page.FrameNavigated, this);
    });
  }

  page() {
    return this._page;
  }

  async goto(url, options = {}) {
    const waitUntil = verifyLoadState('waitUntil', options.waitUntil === undefined ? 'load' : options.waitUntil);
    return network.Response.fromNullable((await this._channel.goto({
      url,
      ...options,
      waitUntil
    })).response);
  }

  _setupNavigationWaiter(options) {
    const waiter = new _waiter.Waiter(this._page, '');
    if (this._page.isClosed()) waiter.rejectImmediately(new Error('Navigation failed because page was closed!'));
    waiter.rejectOnEvent(this._page, _events2.Events.Page.Close, new Error('Navigation failed because page was closed!'));
    waiter.rejectOnEvent(this._page, _events2.Events.Page.Crash, new Error('Navigation failed because page crashed!'));
    waiter.rejectOnEvent(this._page, _events2.Events.Page.FrameDetached, new Error('Navigating frame was detached!'), frame => frame === this);

    const timeout = this._page._timeoutSettings.navigationTimeout(options);

    waiter.rejectOnTimeout(timeout, `Timeout ${timeout}ms exceeded.`);
    return waiter;
  }

  async waitForNavigation(options = {}) {
    return this._page._wrapApiCall(async () => {
      const waitUntil = verifyLoadState('waitUntil', options.waitUntil === undefined ? 'load' : options.waitUntil);

      const waiter = this._setupNavigationWaiter(options);

      const toUrl = typeof options.url === 'string' ? ` to "${options.url}"` : '';
      waiter.log(`waiting for navigation${toUrl} until "${waitUntil}"`);
      const navigatedEvent = await waiter.waitForEvent(this._eventEmitter, 'navigated', event => {
        var _this$_page;

        // Any failed navigation results in a rejection.
        if (event.error) return true;
        waiter.log(`  navigated to "${event.url}"`);
        return (0, _clientHelper.urlMatches)((_this$_page = this._page) === null || _this$_page === void 0 ? void 0 : _this$_page.context()._options.baseURL, event.url, options.url);
      });

      if (navigatedEvent.error) {
        const e = new Error(navigatedEvent.error);
        e.stack = '';
        await waiter.waitForPromise(Promise.reject(e));
      }

      if (!this._loadStates.has(waitUntil)) {
        await waiter.waitForEvent(this._eventEmitter, 'loadstate', s => {
          waiter.log(`  "${s}" event fired`);
          return s === waitUntil;
        });
      }

      const request = navigatedEvent.newDocument ? network.Request.fromNullable(navigatedEvent.newDocument.request) : null;
      const response = request ? await waiter.waitForPromise(request._finalRequest()._internalResponse()) : null;
      waiter.dispose();
      return response;
    });
  }

  async waitForLoadState(state = 'load', options = {}) {
    state = verifyLoadState('state', state);
    if (this._loadStates.has(state)) return;
    return this._page._wrapApiCall(async () => {
      const waiter = this._setupNavigationWaiter(options);

      await waiter.waitForEvent(this._eventEmitter, 'loadstate', s => {
        waiter.log(`  "${s}" event fired`);
        return s === state;
      });
      waiter.dispose();
    });
  }

  async waitForURL(url, options = {}) {
    var _this$_page2;

    if ((0, _clientHelper.urlMatches)((_this$_page2 = this._page) === null || _this$_page2 === void 0 ? void 0 : _this$_page2.context()._options.baseURL, this.url(), url)) return await this.waitForLoadState(options.waitUntil, options);
    await this.waitForNavigation({
      url,
      ...options
    });
  }

  async frameElement() {
    return _elementHandle.ElementHandle.from((await this._channel.frameElement()).element);
  }

  async evaluateHandle(pageFunction, arg) {
    (0, _jsHandle.assertMaxArguments)(arguments.length, 2);
    const result = await this._channel.evaluateExpressionHandle({
      expression: String(pageFunction),
      isFunction: typeof pageFunction === 'function',
      arg: (0, _jsHandle.serializeArgument)(arg)
    });
    return _jsHandle.JSHandle.from(result.handle);
  }

  async evaluate(pageFunction, arg) {
    (0, _jsHandle.assertMaxArguments)(arguments.length, 2);
    const result = await this._channel.evaluateExpression({
      expression: String(pageFunction),
      isFunction: typeof pageFunction === 'function',
      arg: (0, _jsHandle.serializeArgument)(arg)
    });
    return (0, _jsHandle.parseResult)(result.value);
  }

  async $(selector, options) {
    const result = await this._channel.querySelector({
      selector,
      ...options
    });
    return _elementHandle.ElementHandle.fromNullable(result.element);
  }

  async waitForSelector(selector, options = {}) {
    if (options.visibility) throw new Error('options.visibility is not supported, did you mean options.state?');
    if (options.waitFor && options.waitFor !== 'visible') throw new Error('options.waitFor is not supported, did you mean options.state?');
    const result = await this._channel.waitForSelector({
      selector,
      ...options
    });
    return _elementHandle.ElementHandle.fromNullable(result.element);
  }

  async dispatchEvent(selector, type, eventInit, options = {}) {
    await this._channel.dispatchEvent({
      selector,
      type,
      eventInit: (0, _jsHandle.serializeArgument)(eventInit),
      ...options
    });
  }

  async $eval(selector, pageFunction, arg) {
    (0, _jsHandle.assertMaxArguments)(arguments.length, 3);
    const result = await this._channel.evalOnSelector({
      selector,
      expression: String(pageFunction),
      isFunction: typeof pageFunction === 'function',
      arg: (0, _jsHandle.serializeArgument)(arg)
    });
    return (0, _jsHandle.parseResult)(result.value);
  }

  async $$eval(selector, pageFunction, arg) {
    (0, _jsHandle.assertMaxArguments)(arguments.length, 3);
    const result = await this._channel.evalOnSelectorAll({
      selector,
      expression: String(pageFunction),
      isFunction: typeof pageFunction === 'function',
      arg: (0, _jsHandle.serializeArgument)(arg)
    });
    return (0, _jsHandle.parseResult)(result.value);
  }

  async $$(selector) {
    const result = await this._channel.querySelectorAll({
      selector
    });
    return result.elements.map(e => _elementHandle.ElementHandle.from(e));
  }

  async _queryCount(selector) {
    return (await this._channel.queryCount({
      selector
    })).value;
  }

  async content() {
    return (await this._channel.content()).value;
  }

  async setContent(html, options = {}) {
    const waitUntil = verifyLoadState('waitUntil', options.waitUntil === undefined ? 'load' : options.waitUntil);
    await this._channel.setContent({
      html,
      ...options,
      waitUntil
    });
  }

  name() {
    return this._name || '';
  }

  url() {
    return this._url;
  }

  parentFrame() {
    return this._parentFrame;
  }

  childFrames() {
    return Array.from(this._childFrames);
  }

  isDetached() {
    return this._detached;
  }

  async addScriptTag(options = {}) {
    const copy = { ...options
    };

    if (copy.path) {
      copy.content = (await _fs.default.promises.readFile(copy.path)).toString();
      copy.content += '//# sourceURL=' + copy.path.replace(/\n/g, '');
    }

    return _elementHandle.ElementHandle.from((await this._channel.addScriptTag({ ...copy
    })).element);
  }

  async addStyleTag(options = {}) {
    const copy = { ...options
    };

    if (copy.path) {
      copy.content = (await _fs.default.promises.readFile(copy.path)).toString();
      copy.content += '/*# sourceURL=' + copy.path.replace(/\n/g, '') + '*/';
    }

    return _elementHandle.ElementHandle.from((await this._channel.addStyleTag({ ...copy
    })).element);
  }

  async click(selector, options = {}) {
    return await this._channel.click({
      selector,
      ...options
    });
  }

  async dblclick(selector, options = {}) {
    return await this._channel.dblclick({
      selector,
      ...options
    });
  }

  async dragAndDrop(source, target, options = {}) {
    return await this._channel.dragAndDrop({
      source,
      target,
      ...options
    });
  }

  async tap(selector, options = {}) {
    return await this._channel.tap({
      selector,
      ...options
    });
  }

  async fill(selector, value, options = {}) {
    return await this._channel.fill({
      selector,
      value,
      ...options
    });
  }

  async _highlight(selector) {
    return await this._channel.highlight({
      selector
    });
  }

  locator(selector, options) {
    return new _locator.Locator(this, selector, options);
  }

  frameLocator(selector) {
    return new _locator.FrameLocator(this, selector);
  }

  async focus(selector, options = {}) {
    await this._channel.focus({
      selector,
      ...options
    });
  }

  async textContent(selector, options = {}) {
    const value = (await this._channel.textContent({
      selector,
      ...options
    })).value;
    return value === undefined ? null : value;
  }

  async innerText(selector, options = {}) {
    return (await this._channel.innerText({
      selector,
      ...options
    })).value;
  }

  async innerHTML(selector, options = {}) {
    return (await this._channel.innerHTML({
      selector,
      ...options
    })).value;
  }

  async getAttribute(selector, name, options = {}) {
    const value = (await this._channel.getAttribute({
      selector,
      name,
      ...options
    })).value;
    return value === undefined ? null : value;
  }

  async inputValue(selector, options = {}) {
    return (await this._channel.inputValue({
      selector,
      ...options
    })).value;
  }

  async isChecked(selector, options = {}) {
    return (await this._channel.isChecked({
      selector,
      ...options
    })).value;
  }

  async isDisabled(selector, options = {}) {
    return (await this._channel.isDisabled({
      selector,
      ...options
    })).value;
  }

  async isEditable(selector, options = {}) {
    return (await this._channel.isEditable({
      selector,
      ...options
    })).value;
  }

  async isEnabled(selector, options = {}) {
    return (await this._channel.isEnabled({
      selector,
      ...options
    })).value;
  }

  async isHidden(selector, options = {}) {
    return (await this._channel.isHidden({
      selector,
      ...options
    })).value;
  }

  async isVisible(selector, options = {}) {
    return (await this._channel.isVisible({
      selector,
      ...options
    })).value;
  }

  async hover(selector, options = {}) {
    await this._channel.hover({
      selector,
      ...options
    });
  }

  async selectOption(selector, values, options = {}) {
    return (await this._channel.selectOption({
      selector,
      ...(0, _elementHandle.convertSelectOptionValues)(values),
      ...options
    })).values;
  }

  async setInputFiles(selector, files, options = {}) {
    await this._channel.setInputFiles({
      selector,
      files: await (0, _elementHandle.convertInputFiles)(files),
      ...options
    });
  }

  async type(selector, text, options = {}) {
    await this._channel.type({
      selector,
      text,
      ...options
    });
  }

  async press(selector, key, options = {}) {
    await this._channel.press({
      selector,
      key,
      ...options
    });
  }

  async check(selector, options = {}) {
    await this._channel.check({
      selector,
      ...options
    });
  }

  async uncheck(selector, options = {}) {
    await this._channel.uncheck({
      selector,
      ...options
    });
  }

  async setChecked(selector, checked, options) {
    if (checked) await this.check(selector, options);else await this.uncheck(selector, options);
  }

  async waitForTimeout(timeout) {
    await this._channel.waitForTimeout({
      timeout
    });
  }

  async waitForFunction(pageFunction, arg, options = {}) {
    if (typeof options.polling === 'string') (0, _utils.assert)(options.polling === 'raf', 'Unknown polling option: ' + options.polling);
    const result = await this._channel.waitForFunction({ ...options,
      pollingInterval: options.polling === 'raf' ? undefined : options.polling,
      expression: String(pageFunction),
      isFunction: typeof pageFunction === 'function',
      arg: (0, _jsHandle.serializeArgument)(arg)
    });
    return _jsHandle.JSHandle.from(result.handle);
  }

  async title() {
    return (await this._channel.title()).value;
  }

}

exports.Frame = Frame;

function verifyLoadState(name, waitUntil) {
  if (waitUntil === 'networkidle0') waitUntil = 'networkidle';
  if (!_types.kLifecycleEvents.has(waitUntil)) throw new Error(`${name}: expected one of (load|domcontentloaded|networkidle|commit)`);
  return waitUntil;
}