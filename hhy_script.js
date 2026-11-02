/**
 * 音乐手机选项卡组件（所有 JS 变量均以 hhy_ 开头）
 * 用法：容器添加 data-tabs，并可用 data-default-tab 指定默认选项卡；
 * 选项卡按钮添加 data-tab="名称"，内容面板添加 data-panel="名称"。
 * 页面加载后自动初始化所有 [data-tabs] 容器，也可手动调用 window.hhy_initTabs。
 */
(function () {
  'use strict';

  function hhy_initTabs(hhy_root, hhy_options) {
    var hhy_opts = hhy_options || {};
    var hhy_buttons = Array.prototype.slice.call(hhy_root.querySelectorAll('[data-tab]'));
    var hhy_panels = Array.prototype.slice.call(hhy_root.querySelectorAll('[data-panel]'));

    if (!hhy_buttons.length || !hhy_panels.length) {
      return null;
    }

    // 默认选项卡：调用参数 > 容器 data-default-tab > 第一个选项卡
    var hhy_defaultTab =
      hhy_opts.defaultTab ||
      hhy_root.getAttribute('data-default-tab') ||
      hhy_buttons[0].getAttribute('data-tab');

    // 第一步：清除所有选项卡的选中状态
    function hhy_clearSelected() {
      hhy_buttons.forEach(function (hhy_button) {
        hhy_button.classList.remove('hhy_is-active');
        hhy_button.setAttribute('aria-selected', 'false');
        hhy_button.setAttribute('tabindex', '-1');
      });

      hhy_panels.forEach(function (hhy_panel) {
        hhy_panel.classList.remove('hhy_is-active');
        hhy_panel.hidden = true;
      });
    }

    // 第二步：设置当前元素的选中状态
    function hhy_activate(hhy_tabName) {
      var hhy_currentButton = hhy_buttons.filter(function (hhy_button) {
        return hhy_button.getAttribute('data-tab') === hhy_tabName;
      })[0];
      var hhy_currentPanel = hhy_panels.filter(function (hhy_panel) {
        return hhy_panel.getAttribute('data-panel') === hhy_tabName;
      })[0];

      if (!hhy_currentButton || !hhy_currentPanel) {
        return;
      }

      hhy_clearSelected();

      hhy_currentButton.classList.add('hhy_is-active');
      hhy_currentButton.setAttribute('aria-selected', 'true');
      hhy_currentButton.setAttribute('tabindex', '0');

      hhy_currentPanel.classList.add('hhy_is-active');
      hhy_currentPanel.hidden = false;
    }

    // 事件监听：点击切换选项卡
    hhy_buttons.forEach(function (hhy_button) {
      hhy_button.addEventListener('click', function () {
        hhy_activate(hhy_button.getAttribute('data-tab'));
      });

      // 左右方向键切换，方便键盘操作
      hhy_button.addEventListener('keydown', function (hhy_event) {
        if (hhy_event.key !== 'ArrowLeft' && hhy_event.key !== 'ArrowRight') {
          return;
        }

        var hhy_index = hhy_buttons.indexOf(hhy_button);
        var hhy_step = hhy_event.key === 'ArrowRight' ? 1 : -1;
        var hhy_nextButton = hhy_buttons[(hhy_index + hhy_step + hhy_buttons.length) % hhy_buttons.length];

        hhy_event.preventDefault();
        hhy_activate(hhy_nextButton.getAttribute('data-tab'));
        hhy_nextButton.focus();
      });
    });

    // 初始化：默认选中指定选项卡
    hhy_activate(hhy_defaultTab);

    return { hhy_activate: hhy_activate, hhy_clearSelected: hhy_clearSelected };
  }

  // 暴露到全局，便于在其他页面复用
  window.hhy_initTabs = hhy_initTabs;

  document.addEventListener('DOMContentLoaded', function () {
    var hhy_roots = document.querySelectorAll('[data-tabs]');
    Array.prototype.forEach.call(hhy_roots, function (hhy_root) {
      hhy_initTabs(hhy_root, {
        defaultTab: hhy_root.getAttribute('data-default-tab')
      });
    });
  });
})();
