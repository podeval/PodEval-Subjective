/*************************************************************************
 * LikertScale2.js - Enhanced Likert Scale Component with Checkbox Support
 * 
 * This component extends the basic Likert scale functionality to support
 * checkbox-based multi-selection responses in addition to standard form inputs.
 * 
 * Key Features:
 * - Checkbox type support for multi-selection scenarios
 * - Option type for text input fields
 * - Flexible configuration through responseConfig parameter
 * - Dynamic rendering with jQuery Mobile integration
 * - Callback support for real-time response handling
 * 
 * Usage:
 * Used in webMUSHRA subjective listening tests where participants need
 * to select multiple options or provide checkbox-based responses.
 * 
 *************************************************************************/

/**
 * Constructor for LikertScale2 component
 * @param {Array} _responseConfig - Configuration array for response options
 * @param {string} _prefix - Unique prefix for form elements
 * @param {boolean} _initDisabled - Whether to initialize in disabled state
 * @param {Function} _callback - Callback function for response changes
 */
function LikertScale2(_responseConfig, _prefix, _initDisabled, _callback) {
  this.responseConfig = _responseConfig;
  this.prefix = _prefix;
  this.initDisabled = _initDisabled;
  this.callback = _callback;
  this.group = null;
  this.elements = [];
}

/**
 * Enable all input elements in this scale
 */
LikertScale2.prototype.enable = function () {
  $('input[name=' + this.prefix + '_response]').checkboxradio('enable');
};

/**
 * Render the Likert scale component to the specified parent element
 * @param {jQuery} _parent - Parent element to append the scale to
 */
LikertScale2.prototype.render = function (_parent) {
  // Create main container
  this.group = $("<fieldset data-role='controlgroup' data-type='horizontal'></fieldset>");
  _parent.append(this.group);
  this.elements = [];
  
  if (this.responseConfig == null) {
    return;
  }

  // Process each response configuration item
  for (var i = 0; i < this.responseConfig.length; i++) {
    var responseValueConfig = this.responseConfig[i];
    
    this._renderTitle(responseValueConfig);
    this._renderResponseElement(responseValueConfig, i);
  }

  // Attach change event handler
  this._attachChangeHandler();
  
  // Apply initial disabled state if needed
  if (this.initDisabled) {
    this.group.children().attr('disabled', 'disabled');
  }
};

/**
 * Render title and description for a response configuration
 * @param {Object} responseValueConfig - Configuration object
 * @private
 */
LikertScale2.prototype._renderTitle = function (responseValueConfig) {
  if (responseValueConfig.title) {
    var header = $("<p class='session-header'>" + responseValueConfig.title + "</p>");
    this.group.append(header);
    
    if (responseValueConfig.description) {
      var description = $("<p class='session-description'>" + responseValueConfig.description + "</p><br/>");
      this.group.append(description);
    }
  }
};

/**
 * Render the appropriate response element based on type
 * @param {Object} responseValueConfig - Configuration object
 * @param {number} index - Index of the current configuration
 * @private
 */
LikertScale2.prototype._renderResponseElement = function (responseValueConfig, index) {
  switch (responseValueConfig.type) {
    case 'checkbox':
      this._renderCheckboxElement(responseValueConfig);
      break;
    case 'option':
      this._renderOptionElement(responseValueConfig);
      break;
    default:
      this._renderDefaultElement(responseValueConfig, index);
      break;
  }
};

/**
 * Render checkbox type element
 * @param {Object} responseValueConfig - Configuration object
 * @private
 */
LikertScale2.prototype._renderCheckboxElement = function (responseValueConfig) {
  var element = $("<p>" + responseValueConfig.label + "</p>");
  this.group.append(element);
  
  if (responseValueConfig.options) {
    var options = responseValueConfig.options.split('/');
    var container = $("<div class='checkbox-container'></div>");
    
    for (var j = 0; j < options.length; j++) {
      var checkboxId = this.prefix + '_response2_' + j;
      var checkbox = $("<input type='checkbox' class='custom-checkbox' data-mini='false' value='" + j + "' name='" + this.prefix + "_response' id='" + checkboxId + "'/>");
      var label = $("<label for='" + checkboxId + "' class='custom-label'>" + options[j] + "</label>");
      
      container.append(checkbox, label);
      this.elements.push(checkbox, label);
    }
    
    this.group.append(container);
  }
  
  this.group.append($("<br/>"));
};

/**
 * Render option type element (text input)
 * @param {Object} responseValueConfig - Configuration object
 * @private
 */
LikertScale2.prototype._renderOptionElement = function (responseValueConfig) {
  var element = $("<p>" + responseValueConfig.label + "</p>");
  this.group.append(element);
  
  var inputElement = $("<input id='comment_option' type='text'/>");
  this.group.append(inputElement);
};

/**
 * Render default element type (checkbox with image support)
 * @param {Object} responseValueConfig - Configuration object
 * @param {number} index - Index of the current configuration
 * @private
 */
LikertScale2.prototype._renderDefaultElement = function (responseValueConfig, index) {
  var img = "";
  if (responseValueConfig.img) {
    img = "<img id='" + this.prefix + "_response_img_" + index + "' src='" + responseValueConfig.img + "'/>";
  }
  
  var elementId = this.prefix + '_response2_' + index;
  var element = $(
    "<input type='checkbox' data-mini='false' value='" + responseValueConfig.value + "' name='" + this.prefix + "_response' id='" + elementId + "'/>" +
    "<label for='" + elementId + "' class='custom-label2'>" + responseValueConfig.label + "<br/>" + img + "</label>"
  );
  
  this.group.append(element);
  this.elements.push(element);
};

/**
 * Attach change event handler to the group
 * @private
 */
LikertScale2.prototype._attachChangeHandler = function () {
  var self = this;
  this.group.change(function () {
    if (self.callback) {
      self.callback(self.prefix);
    }
  });
};