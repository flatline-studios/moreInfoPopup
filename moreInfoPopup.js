// Create Closure.
(function($) {
  
  /** More Info Popup Plugin definition.
   *  
   *  Author  : Kerry Taylor
   *  Version : 0.5
   *  Date    : 13/08/2017
   *  
   *  Creates a floating window in a position relative to a clicked element.
   *  The floating window (the popup), contains the contents of another DOM element, whose relative
   *  location is defined in the getContents callback function.
   *  
   *  #Dependencies
   *    - JQuery 3.x and above
   *    - GSAP TimelineMax
   *  
   *  @args
   *    onClickSelector : A selector of elements that will call the more info popup.
   *    getContents     : A user defined function that defines a route that can be taken to get from
   *                      the onClickSelector, to the info that needs to be presented within the popup.
   *    options         : The options object. See the defaults for an example.
   *  
   *  @properties
   *    none
   *  
   *  @methods
   *    none
   *  
   */
  $.fn.moreInfoPopup = function(onClickSelector, getContents, options) {
    
    // Creates the settings for this INSTANCE.
    var settings = $.extend(true, {}, $.fn.moreInfoPopup.defaults, options);
    
    // Saves the element(s) that the plugin is being used on as root.
    var $root = this;
    
    // Adds additional items to the settings, for convenience and cacheability.
    settings._wrapper = '.'+settings.wrapper;
    settings._arrow = '.'+settings.arrow;
    settings._body = '.'+settings.body;
    settings._content = '.'+settings.content;
    
    
    // Helper function that gets the bottom coordinate of the main element.
    // The container dictates what the coordinate is relative to.
    // The result is the Y co-ordinate of the main elements bottom edge, relative to the container.
    var getBottomY = function($mainElement, $container) {
      return $mainElement.outerHeight() + ($mainElement.offset().top - $container.offset().top);
    }
    
    
    // Creates the helper objects, as the DOM elements might not exist yet.
    var createHelpers = function() {
      settings.$wrapper = $(settings._wrapper);
      settings.$arrow = $(settings._arrow);
      settings.$body = $(settings._body);
      settings.$content = $(settings._content);
    }
    
    // Adds the GSAP timeline to the settings.
    var createTimeline = function() {
      
      settings.timeline = new TimelineMax({
        paused: true,
        onReverseComplete: function() {
          settings.$wrapper.css('top', 0);
          settings.$wrapper.removeData('rowIndex');
        },
      }).fromTo(settings.$wrapper, settings.animation.speed, settings.animation.from, settings.animation.to);
    }
    
    
    // Creates the popup window and structure.
    var createPopup = function() {
      
      $root
        .prepend($('<div/>', {
          'class': settings.wrapper,
        })
          .append($('<div/>', {
            'class': settings.arrow,
          })
          )
          .append($('<div/>', {
            'class': settings.body,
          })
            .append($('<p/>', {
              'class': settings.content,
            })
            )
          )
        );
    }
    
    
    // The onClick event and logic for showing/hiding/updating the more info popup.
    $root.on('click.moreInfoPopup', onClickSelector, function(e) {
      
      // Gets the linked popup contents.
      var $popupContents = getContents.call(this);

      // Finds the relative location of the bottom edge of the clicked selector.
      var yLocation = getBottomY($(this), $root);
      
      // Saves the index of the clicked selector.
      settings.$wrapper.data('rowIndex', $(this).index(onClickSelector));


      // Shows or hides the more info popup.
      //
      // If the same onClickSelector has been clicked twice, or, if the clicked selector doesn't have 
      // any content related to it, hide the more info popup, and exit the
      // function before the .one event listener can be instantiated, as it's not necessary.
      // Otherwise, show and move the relative more info popup, and create the .one event
      // listener.
      if ((parseFloat(settings.$wrapper.css('top')) === yLocation) || (!$popupContents.length)) {
        
        // Hides the more info popup.
        settings.timeline.reverse();

        // Exits the function, before the .one event listener can be instantiated.
        return;

      } else {
        
        // Sets the more info popup to be at the correct height.
        settings.$wrapper.css('top', yLocation + 'px');

        // Sets the more info popup to contain the relative description.
        settings.$content.html($popupContents.html());

        // Shows the more info popup.
        settings.timeline.restart();
      }
      
      // Prevents the event from bubbling to the one time click event.
      // i.e., firing immediately on this click.
      e.stopPropagation();
      
      // Creates a one-time click function to hide the more info popup.
      $(document).one('click', function(e) {
        
        // If anywhere other than the onClickSelector is clicked, then hide the popup.
        if (!$(e.target).is(onClickSelector)) {

          // Hides the more info popup.
          settings.timeline.reverse();

        }
      });
    });
    
    
    // Moves the more info popup to the correct position whenever the window is resized.
    $(window).on('resize.moreInfoPopup', function() {

      // Checks that the more info popup is actually open.
      if (typeof (rowIndex = settings.$wrapper.data('rowIndex')) != 'undefined') {
        
        // Gets the clicked element that the popup is attached to.
        var $clickedElement = $(onClickSelector).eq(rowIndex);

        // Calculates what the top value of the popup _should_ be.
        var newTopValue = getBottomY($clickedElement, $root);

        // If the more popup info isn't at the correct vertical position, move it so it is.
        if (parseFloat(settings.$wrapper.css('top')) !== newTopValue) {
          settings.$wrapper.css('top', newTopValue + 'px');
        }
      }
    });

    
    // Initialises the plugin.
    var init = function() {
      
      // Ensures that the defined wrapper element exist somewhere within the root element.
      // If it doesn't, a new popup element is created.
      if (!$root.find(settings._wrapper).length) {
        createPopup();
      }
      
      // Creates all the helper functions to help ease implementation.
      createHelpers();
      
      // Creates the GSAP timeline object, and adds it to the settings literal. 
      createTimeline();
      
      // Returns itself, to allow JQuery chaining.
      return this;
    }
    
    return init();

  };
  
  
  // These are GLOBAL defaults (across all implementations of the plugin).
  $.fn.moreInfoPopup.defaults = {
    wrapper: 'more-info-popup',
    arrow: 'more-info-popup__arrow',
    body: 'more-info-popup__body',
    content: 'more-info-popup__content',
    animation: {
      speed: 0.3,
      from: {
        yPercent: -20,
        autoAlpha: 0,
      },
      to: {
        yPercent: 0,
        autoAlpha: 1,
      },
    },
  };

// End Closure.
}(jQuery));
