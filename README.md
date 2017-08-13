# moreInfoPopup
A JQuery Plugin to create a customisable, animated, more info popup.

Example usage:

    // Function that returns the element that holds the content that is to be inserted into the popup element
    // relative to 'this', where 'this' is the clicked element ('.someClickableElements' in this example).
    var aFn = function() {
      return
        $(this)
          .parent()
          .next('.someRelativeDescriptionElement');
    }
    
    
    $('#someContainer').moreInfoPopup('.someClickableElements', aFn, {
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
    });

The above usage will:

1. Create a new more info popup plugin, and attach it to the container referenced by `#someContainer`.
2. It will attach click event listeners on all elements referenced by `.someClickableElements`, within the `#someContainer` element.
3. It will discover the content to be inserted into the popup, by using the `aFn` function.
4. It will set the class names for the four components that make up the more info popup, namely:
    - `wrapper` (the container)
    - `arrow` (the pointer arrow)
    - `body` (the popups' body)
    - `content` (the content that's inserted)
5. It will define the animation to be used when showing/hiding the popup, as well as the speed at which the animation should play at. This is a fromTo animation, using the GreenSock Animation Platform (https://greensock.com/docs/TimelineMax/fromTo()).
