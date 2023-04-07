(function($) {
    "use strict";

    //===== Prealoder
    $(window).on('load', function(event) {
        $('.proloader').delay(500).fadeOut(500);
    });


    /* -------------------------------------
               Sticky Header
       -------------------------------------- */
    var wind = $(window);
    var sticky = $('.header-bar-area');
    wind.on('scroll', function() {
        var scroll = wind.scrollTop();
        if (scroll < 100) {
            sticky.removeClass('sticky');
        } else {
            sticky.addClass('sticky');
        }
    });

    /* -------------------------------------
               Responsive menu
    -------------------------------------- */
    var siteMenuClone = function() {

        $('.js-clone-nav').each(function() {
            var $this = $(this);
            $this.clone().attr('class', 'site-nav-wrap').prependTo('.site-mobile-menu-body');
        });

        setTimeout(function() {

            var counter = 0;
            $('.site-mobile-menu .has-children').each(function() {
                var $this = $(this);

                $this.prepend('<span class="arrow-collapse collapsed">');

                $this.find('.arrow-collapse').attr({
                    'data-toggle': 'collapse',
                    'data-target': '#collapseItem' + counter,
                });

                $this.find('> ul').attr({
                    'class': 'collapse',
                    'id': 'collapseItem' + counter,
                });

                counter++;

            });

        }, 1000);

        $('body').on('click', '.js-menu-toggle', function(e) {
            var $this = $(this);
            e.preventDefault();

            if ($('body').hasClass('offcanvas-menu')) {
                $('body').removeClass('offcanvas-menu');
                $('.logo').show();
                $('.site-mobile-menu').hide();
                $('.header_btn.md-none').hide();
                $('.d-lg-none.sm-right').show();
                $('#primary-menu-open').focus();
                $('#site-content').show();
                $('footer').show();
                $this.removeClass('active');
            } else {
                $('body').addClass('offcanvas-menu');
                $this.addClass('active');
                $('.logo').hide();
                $('.site-mobile-menu').show();
                $('.header_btn.md-none').show();
                $('#primary-menu-close').focus();
                $('.d-lg-none.sm-right').hide();
                $('#site-content').hide();
                $('footer').hide();
            }
        })
    };
    siteMenuClone();

    /**
     * Trap keyboard navigation in the menu modal.
     * Adapted from Twenty Twenty.
     *
     * @since 1.0.0
     */
    var trapKeyboardNavigation = function() {
        var wrapper = document.body, // this is the element to which a CSS class is added when a mobile nav menu is open
        mobileButton = document.getElementById( 'primary-menu-close' ),
        navMenuEl = document.getElementById( 'site-mobile-menu' );

        // If there's no nav menu, none of this is necessary.
        if ( ! navMenuEl ) {
            return;
        }

        document.addEventListener( 'keydown', function( event ) {
            var modal, elements, selectors, lastEl, firstEl, activeEl, tabKey, shiftKey, escKey;
            if ( ! wrapper.classList.contains('offcanvas-menu' ) ) {
                return;
            }
    
            modal = document.querySelector( '.site-mobile-menu' );
            selectors = 'input, a, button';
            elements = modal.querySelectorAll( selectors );
            elements = Array.prototype.slice.call( elements );
            tabKey = event.keyCode === 9;
            shiftKey = event.shiftKey;
            escKey = event.keyCode === 27;
            activeEl = document.activeElement; // eslint-disable-line @wordpress/no-global-active-element
            lastEl = elements[ elements.length - 1 ];
            firstEl = elements[0];

            if ( escKey ) {
                event.preventDefault();
                wrapper.classList.remove( 'offcanvas-menu' );
                //mobileButton.focus();
            }

            if ( ! shiftKey && tabKey && lastEl === activeEl ) {
                event.preventDefault();
                firstEl.focus();
            }

            if ( shiftKey && tabKey && firstEl === activeEl ) {
                event.preventDefault();
                lastEl.focus();
            }

            // If there are no elements in the menu, don't move the focus
            if ( tabKey && firstEl === lastEl ) {
                event.preventDefault();
            }
        } );
    }
    trapKeyboardNavigation();

    /* -------------------------------------
                Show or hide the sticky footer button
    ------------------------------------- */
    $(window).on('scroll', function(event) {
        if ($(this).scrollTop() > 600) {
            $('.back-to-top').fadeIn(200)
        } else {
            $('.back-to-top').fadeOut(200)
        }
    });


    //Animate the scroll to top
    $('.back-to-top').on('click', function(event) {
        event.preventDefault();

        $('html, body').animate({
            scrollTop: 0,
        }, 1500);
    });

    // Toggle navigation submenu.
    $('.site-navigation .menu-item-has-children').each(function(el){
        if( $(this).parents('.sub-menu').length == 0 ) {
            $(this).on('mouseenter', function(e){
                $(this).removeClass('collapsed').addClass('expanded');
            });
    
            $(this).on('mouseleave', function(e){
                $(this).removeClass('expanded').addClass('collapsed');
            });
        }
    });

    // Trap keyboard navigation in the sub menu modal.
    $('.site-navigation .menu-item-has-children .sub-menu-toggle').each(function(e){
        var toggle = $(this);
        var parent = toggle.parent();
        var lastLi = parent.children('ul').children('li').last();
        var liTarget = lastLi.children('a');
        var elLink = parent.find('ul > li:last-child > a');
        elLink.on('blur', function(event){
            if(!$.contains(parent[0], event.relatedTarget)) {
                parent.removeClass('expanded').addClass('collapsed');
            }
        });

    });

    // On click icon plus open sub menu.
    $(document).on('click', '.menu-item-has-children.collapsed .sub-menu-toggle, .menu-item-has-children:not(".expanded") .sub-menu-toggle', function(e){
        $('.menu-item-has-children').removeClass('expanded');
        $(this).closest('.menu-item').removeClass('collapsed').addClass('expanded');
    });

    // On click icon minus close sub menu.
    $(document).on('click', '.menu-item-has-children.expanded .sub-menu-toggle', function(e){
        $('.menu-item-has-children').removeClass('collapsed');
        $(this).closest('.menu-item').removeClass('expanded').addClass('collapsed');
    });

    /*---------------------------------
                 Nice select
      -----------------------------------*/
    $(document).ready(function() {
        $('select').niceSelect();
    });

    /*-------------------------------------
              Magnific Popup js
      --------------------------------------*/
    $('.play_btn').magnificPopup({
        type: 'iframe',
        mainClass: 'mfp-fade',
        preloader: true,
    });



})(jQuery);