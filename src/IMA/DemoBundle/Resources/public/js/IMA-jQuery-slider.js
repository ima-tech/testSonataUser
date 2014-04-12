(function($){



    $.fn.slider = function(options){

        var $element = this;

        var slider = {};

        slider.slides = $element.find('li');

        slider.activeSlideNumber = 0;
        slider.activeSlideElement;

        slider.autoPlayTimeout;

        slider.settings = {
            //GENERAL
            firstSlideIndex : 0,

            autoPlay : {
                activated: true,
                duration : 3000
            },

            controls : {
                next : {
                    show: true,
                    id: "IMA-nextControl"
                },
                previous : {
                    show: true,
                    id: "IMA-previousControl"
                }
            },


            animation : {
                elementsToAnimate : {
                    className: "elementToAnimate"
                },
                type : "fade", // Can be carousel, fade,

                //Transitions between slides
                transitions :  {
                    properties : {

                        duration: 1000, // in milliseconds. if there's more than one, we will choose randomly one duration for each element
                        easingType : "none"
                    }
                }

            },

            sliderContainer : {
                id: 'sliderContainer',
                class: 'IMA-sliderContainer'
            }

        }

        /************
         *
         *
         * UTILITY FUNCTIONS
         *
         */



        /***************
         * @param from
         * @param to
         * @returns {number}
         */

        slider.getRandomNumber = function(from, to) {
            return Math.floor(Math.random()*(to-from+1)+from);
        }


        slider.verifyTransition = function(transition) {

            if(slider.settings.animation.type == 'carousel') {

                if(transition.properties.duration != undefined || transition.properties.duration != "") {
                    var dir = transition.properties.direction;
                    if( (dir != undefined || dir != "") && (dir == 'left' || dir == 'right' || dir == 'top' || dir == 'bottom') )
                        return transition
                    else {
                        console.log("Error: There is a problem with the direction (must be 'left', 'right', 'top' or 'bottom'):" + dir);
                    }
                }
                else {
                    console.log("Error: There is a problem with the duration in the transition (0 <= duration): "+transition.duration);
                }
            }
            if(slider.settings.animation.type == 'fade') {

                if(transition.properties.duration != undefined || transition.properties.duration != "") {
                    var dir = transition.properties.direction;
                    return transition;
                }
                else {
                    console.log("Error: There is a problem with the duration in the transition (0 <= duration): "+transition.duration);
                }
            }

            return undefined;
        }

        slider.getTransition = function($elem, type, slideDirection) {
            var transitions = $elem.attr('data-animation');

            var transition;

            if(transitions == "" || transitions == undefined) {
                transitions = slider.settings.animation.transitions;
            }

            var transition;

            transition = slider.verifyTransition(transitions);

            return transition;
        }


        /************
         *
         *
         * Events FUNCTIONS
         *
         */


        slider.setUpEvents = function () {

            //Attributes click event on
            $('#'+slider.settings.controls.next.id).click(function() {
                slider.clickNextSlide();
            })

            $('#'+slider.settings.controls.previous.id).click(function() {
                slider.clickPreviousSlide();
            })

            $('#'+slider.settings.sliderContainer.id).hover(
                function() {
                    clearTimeout(slider.autoPlayTimeout);
                    console.log('mouse is hover')
                },
                function() {
                    slider.setTimer();
                }
            )

            $('#stop').click(function() {
                clearTimeout(slider.autoPlayTimeout)
            })

        }

        slider.clickNextSlide = function () {
            if(slider.settings.autoPlay.activated == true) {
                clearTimeout(slider.autoPlayTimeout)
            }

            slider.nextSlide();
        }

        slider.clickPreviousSlide = function () {
            if(slider.settings.autoPlay.activated == true)
                clearTimeout(slider.autoPlayTimeout)

            slider.previousSlide();
        }

        slider.setTimer = function () {
            clearTimeout(slider.autoPlayTimeout)

            if(slider.settings.autoPlay.activated == true) {
                slider.autoPlayTimeout = setTimeout(function() {
                    slider.nextSlide()
                }, slider.settings.autoPlay.duration);
            }

        }



        slider.init = function (options) {
            //We update the default settings (in slider.settings) with the options passed in argument
            $.extend(true, slider.settings, options)

            slider.activeSlideNumber = slider.settings.firstSlideIndex

            slider.activeSlideElement = slider.slides.eq(slider.activeSlideNumber);

            if(slider.settings.animation.type == 'individualElements') {

                //Set the initial background position
                backgroundPosition = $('#'+slider.settings.sliderContainer.id).css('background-position').split(" ");
                slider.divBackgroundPosition = {
                    x: Number(backgroundPosition[0].replace('%', '')),
                    y: Number(backgroundPosition[1].replace('%', ''))
                }
            }

            //Set up the events of all the elements
            slider.setUpEvents();

            slider.activeSlideElement.show();


            slider.setTimer();

        }

        slider.animateCurrentSlide = function(transition, transitionType) {
            var elem = slider.activeSlideElement

            var animationType = slider.settings.animation.type;

            var cssProperties = {}, animateProperties = {}, options = {}, easing = {}, done={};



            if(animationType == 'carousel') {

                if(transitionType == 'OUT') {
                    done = function() {
                        $(this).hide();
                    }
                }

                options = {
                    duration: transition.properties.duration,
                    done : done,
                    queue: false
                }

                if(transitionType == 'IN') {
                    if(transition.properties.direction == 'left') {
                        cssProperties = {
                            'margin-left' : elem.width()
                        }
                        animateProperties = {
                            'margin-left' : 0
                        }

                    }
                    else if(transition.properties.direction == 'right') {
                        cssProperties = {
                            'margin-left' : -elem.width()
                        }
                        animateProperties = {
                            'margin-left' : 0
                        }
                    }
                    else if(transition.properties.direction == 'top') {
                        cssProperties = {
                            'margin-top' : elem.height()
                        }
                        animateProperties = {
                            'margin-top' : 0
                        }
                    }
                    else if(transition.properties.direction == 'bottom') {
                        cssProperties = {
                            'margin-top' : -1000
                        }
                        animateProperties = {
                            'margin-top' : 0
                        }
                    }
                }
                else if(transitionType == 'OUT') {
                    if(transition.properties.direction == 'left') {
                        animateProperties = {
                            'margin-left' : -elem.width()
                        }
                    }
                    else if(transition.properties.direction == 'right') {
                        animateProperties = {
                            'margin-left' : 1000
                        }
                    }
                    else if(transition.properties.direction == 'top') {
                        animateProperties = {
                            'margin-top' : -elem.height()
                        }
                    }
                    else if(transition.properties.direction == 'bottom') {
                        animateProperties = {
                            'margin-top' : 1000
                        }
                    }


                }

                elem.css(cssProperties)

                if(transitionType == 'IN'){
                    elem.show().animate(animateProperties, options, easing);
                }
                else if(transitionType == 'OUT')
                    elem.animate(animateProperties, options, easing);

            }
            else if(animationType == 'fade') {

                options = {
                    duration: transition.properties.duration
                }

                if(transitionType == 'IN'){
                    elem.fadeIn(options);
                }
                else if(transitionType == 'OUT')
                    elem.fadeOut(options);
            }


        }

        slider.showCurrentSlide = function(slideDirection) {
            var elem = slider.activeSlideElement

            var transition = slider.getTransition(slider.activeSlideElement); //we assume that when we show the slide, it means we use the in transition

            //we animate the current element with the transition
            slider.animateCurrentSlide(transition, 'IN');
        }

        slider.hideCurrentSlide = function(slideDirection) {
            var elem = slider.activeSlideElement
            var transition = slider.getTransition(slider.activeSlideElement); //we assume that when we show the slide, it means we use the in transition

            //we animate the current element with the transition
            slider.animateCurrentSlide(transition, 'OUT');
        }


        slider.processCurrentSlide = function(slideDirection) {

            //Transition the current Element
            slider.hideCurrentSlide(slideDirection);

            slider.activeSlideElement = slider.slides.eq(slider.activeSlideNumber);

            //Animate the slide
            slider.showCurrentSlide(slideDirection);

            //Animate the background
            if(slider.settings.animation.mode == 'individualElements')
                slider.animateBackground(slideDirection)

            //Set the timer
            slider.setTimer();

        }

        slider.nextSlide = function() {
            slider.activeSlideNumber ++;

            if(slider.activeSlideNumber >= slider.slides.length)
                slider.activeSlideNumber = 0

            //We call the show slide method
            slider.processCurrentSlide('next');
        }

        slider.previousSlide = function() {

            slider.activeSlideNumber --;

            if(slider.activeSlideNumber <= 0)
                slider.activeSlideNumber = slider.slides.length - 1;

            //We call the show slide method
            slider.processCurrentSlide('prev');
        }

        slider.transitionCurrentElement = function() {
            var animation = slider.settings.slides.animation;
            if(animation.transitions.type == 'slide') { //this mode simply shows each slide one after another.

                var transition = $element.attr('data-transition');

            }
        }

        slider.animateBackground = function(slideDirection) {
            var inc = slider.settings.background.animation.increment;
            if(slider.settings.background.animation.direction == 'horizontal') {
                if(slideDirection == 'prev') {
                    if( (slider.divBackgroundPosition.x + inc) > 100 )
                        slider.divBackgroundPosition.x = 0;
                    else
                        slider.divBackgroundPosition.x += inc;
                }
                else if(slideDirection == 'next') {
                    if( (slider.divBackgroundPosition.y - inc) < 0 )
                        slider.divBackgroundPosition.x = 100;
                    else
                        slider.divBackgroundPosition.x -= inc;
                }
            }
            else if(slider.settings.background.animation.direction == 'vertical') {
                if(slideDirection == 'prev') {
                    if( (slider.divBackgroundPosition.y + inc) > 100 )
                        slider.divBackgroundPosition.y = 0;
                    else
                        slider.divBackgroundPosition.y += inc;
                }
                else if(slideDirection == 'next') {
                    if( (slider.divBackgroundPosition.y - inc) < 0 )
                        slider.divBackgroundPosition.y = 100;
                    else
                        slider.divBackgroundPosition.y -= inc;
                }
            }

            $('#'+slider.settings.sliderContainerId).animate(
                {
                    'background-position-x' : slider.divBackgroundPosition.x + '%',
                    'background-position-y' : slider.divBackgroundPosition.y + '%'
                }, 1000)
        }


        slider.init(options);

        return $element;
    }


})(jQuery);
