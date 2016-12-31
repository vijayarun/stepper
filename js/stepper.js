/*!
 * Stepper v0.0.1,
 * ===================================
 * Stepper
 *
 * (c) 2016 Vijay , http://vijayarun.in
 * MIT Licensed
 */

(function($){
    var _stepper = 'stepper', _stepperCls = 'stepper', hide = { position : 'absolute', opacity : 0 },
        _input = 'input[type="text"], input[type="number"]', _stepperInput = 'data-stepper-input',
        skin = /^skin-(red|green|blue|aero|grey|orange|yellow|pink|purple|polaris|dark)$/i,
        methods = /^(update|get|destroy)$/i;

    $.fn[_stepper] = function(options, inputVal){
        var stack = $(), handle = _input + ', div',
            walker = function(object) {
                object.each(function() {
                    if( $(this).is(handle) ){
                        stack = stack.add($(this));
                    }
                });
            };
        var stepperVal, parent, self, e, element;

        if (methods.test(options)) {
            walker(this);

            return stack.each(function(){
                self = $(this);
                switch ( options ){
                    case 'destroy':
                        destroy(self);
                        break;
                    case 'set':
                        if( inputVal != undefined ){
                            set(self, inputVal);
                        }
                        break;
                    case 'get':
                        return get(self);
                        break;
                }
                return self;
            });

        }else if( typeof options == 'object' || !options ){

            options = $.extend({}, $.fn[_stepper].defaults, options );
            walker(this);

            return stack.each(function(){
                self = $(this);
                var selfClone = self.clone();

                if( _getOption(self) != false ){ // Already initialized
                    return;
                }
                parent = _init(self, options);
                parent.data(_stepper, { o : options, _src : selfClone, ele : self });

                parent.find('.decrease').on('click', function(){
                    self = $(this).closest('.' + _stepperCls);
                    options = _getOption(self);
                    element = options.ele;
                    options = options.o;
                    e = $.Event('stepper.decrement');
                    element.trigger(e);
                    if (e.isDefaultPrevented()) return;

                    stepperVal = get(self) - parseInt(options.step);

                    if (stepperVal < parseInt(options.min)) {
                        stepperVal = options.min;
                    }
                    set(self, stepperVal);
                    element.trigger($.Event('stepper.decremented'));
                });
                parent.find('.increase').on('click', function(){
                    self = $(this).closest('.' + _stepperCls);
                    options = _getOption(self);
                    element = options.ele;
                    options = options.o;
                    e = $.Event('stepper.increment');
                    element.trigger(e);
                    if (e.isDefaultPrevented()) return;

                    stepperVal = get(self) + parseInt(options.step);
                    if (parseInt(options.max) != 0 && stepperVal > parseInt(options.max)) {
                        stepperVal = options.max;
                    }
                    set(self, stepperVal);
                    element.trigger($.Event('stepper.incremented'));
                });

                return self;
            });
        }else {
            return this;
        }
    };

    function destroy(self){
        var options = self.closest('.' + _stepperCls);

        if( (options = _getOption(options)) != false ){
            options = options.o;

            if( self.is(_input) ){
                self.parent().html(self.css('display', ''));
                self.unwrap();
            }else {
                self.removeClass(_stepperCls)
                    .find('.btn, input').remove();
                if( skin.test(options.skin) ){
                    self.removeClass(options.skin);
                }
            }
        }
    }

    function _init(self, options){
        var parent;
        // Checking whether the element is input
        if( self.is(_input) ){
            parent = self.wrap('<div />').css('display', 'none').parent();
        }else {
            parent = self;
        }
        parent.addClass(_stepperCls)
            .append($('<span />').addClass('decrease').html(options.decrement_icon))
            .append($('<input type="number" pattern="[0-9]*" readonly />').val(options.initial).attr(_stepperInput, true))
            .append($('<span />').addClass('increase').html(options.increment_icon));
        parent.find('span').addClass('btn');
        if( skin.test(options.skin) ){
            parent.addClass(options.skin);
        }
        return parent;
    }

    function _getOption(self){
        if( self.data(_stepper) != undefined ){
            return self.data(_stepper);
        }
        return false
    }

    function set(self, stepperVal){
        var parent = self;
        if( self.is(_input) ){
            parent = self.parent();
        }
        $(parent.find('input')).each(function(){
            $(this).val(stepperVal);
        });
    }

    function get(self){
        return parseInt(self.find('[' + _stepperInput + '="true"]').val());
    }

    // Default Configuration
    $.fn[_stepper].defaults = {
        step            : 1,
        min             : 1,
        max             : 0,
        initial         : 1,
        decrement_icon  : '-',
        increment_icon  : '+',
        skin            : false
    };
})(jQuery);