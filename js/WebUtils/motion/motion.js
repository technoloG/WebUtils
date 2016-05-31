/*!
 * Motion v0.0.1
 * Copyright 2015 Richard Nalezynski
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

if (typeof jQuery === 'undefined') {
  throw new Error('Motion\'s JavaScript requires jQuery')
}

+function ($) {
  'use strict';

  // MOTION PUBLIC CLASS DEFINITION
  // ===============================

  var Motion = function() {

  }

  Motion.VERSION = '0.0.1'

  Motion.TRANSITION_DURATION = 150

  // Collapse

  // Slide

  // Scale

  // Shake

  // Parallax

  // MOTION PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)

      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.motion             = Plugin
  $.fn.motion.Constructor = Motion

  // MOTION NO CONFLICT
  // =================

  $.fn.motion.noConflict = function () {
    $.fn.motion = old
    return this
  }

} (jQuery);
