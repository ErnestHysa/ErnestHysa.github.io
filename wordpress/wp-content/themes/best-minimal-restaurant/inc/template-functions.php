<?php
/**
 * Functions which enhance the theme by hooking into WordPress
 *
 * @package Best_Minimal_Restaurant
 * @author  PriceListo
 */

if ( ! function_exists( 'best_minimal_restaurant_get_header' ) ) {
	/**
	 * Displays site header regarding to selected template.
	 *
	 * @since 1.0.0
	 *
	 * @return mixed
	 */
	function best_minimal_restaurant_get_header() {
		get_header();
	}
}

if ( ! function_exists( 'best_minimal_restaurant_get_footer' ) ) {
	/**
	 * Displays site footer.
	 *
	 * @since 1.0.0
	 *
	 * @return mixed
	 */
	function best_minimal_restaurant_get_footer() {
		get_footer();
	}
}

/**
 * Creates continue reading text.
 *
 * @since 1.0.0
 */
function best_minimal_restaurant_continue_reading_text() {
	$continue_reading = sprintf(
		/* translators: %s: Name of current post. */
		esc_html__( 'Continue reading %s', 'best-minimal-restaurant' ),
		the_title( '<span class="screen-reader-text">', '</span>', false )
	);

	return $continue_reading;
}

/**
 * Determines if post thumbnail can be displayed.
 *
 * @since 1.0.0
 *
 * @return bool
 */
function best_minimal_restaurant_can_show_post_thumbnail() {
	/**
	 * Filters whether post thumbnail can be displayed.
	 *
	 * @since 1.0.0
	 *
	 * @param bool $show_post_thumbnail Whether to show post thumbnail.
	 */
	return apply_filters(
		'best_minimal_restaurant_can_show_post_thumbnail',
		! post_password_required() && ! is_attachment() && has_post_thumbnail()
	);
}

/**
 * Adds custom classes to the array of body classes.
 *
 * @param array $classes Classes for the body element.
 * @return array
 */
function best_minimal_restaurant_body_classes( $classes ) {
	// Adds a class of hfeed to non-singular pages.
	if ( ! is_singular() ) {
		$classes[] = 'hfeed';
	}

	// Adds a class of no-sidebar when there is no sidebar present.
	if ( ! is_active_sidebar( 'sidebar-1' ) ) {
		$classes[] = 'no-sidebar';
	}

	// Custom template pages.
	$page_templates = apply_filters(
		'best_minimal_restaurant_custom_page_templates',
		array(
			'home'     => 'template-home.php',
			'about'    => 'template-about.php',
			'contact'  => 'template-contact.php',
			'menu'     => 'template-menu.php',
			'location' => 'template-location.php',
		)
	);

	// Get current active template name.
	$template_name = best_minimal_restaurant_get_active_theme_template();

	// Adds a class of current active template.
	if ( is_page_template( $page_templates ) ) {
		$classes[] = $template_name;
	}

	return $classes;
}
add_filter( 'body_class', 'best_minimal_restaurant_body_classes' );

/**
 * Adds custom classes to nav menu.
 *
 * @param array  $classes Classes for the nav menu.
 * @param object $item    The item object.
 * @param array  $args    The nav args.
 *
 * @return array
 */
function best_minimal_restaurant_menu_css_classes( $classes, $item, $args ) {
	if ( 'best_minimal_restaurant_top_right_menu' === $args->theme_location || 'best_minimal_restaurant_top_left_menu' === $args->theme_location ) {
		$classes[] = 'nav-item';
	}

	if ( in_array( 'current-menu-item', $classes ) ) {
		$classes[] = 'active';
	}

	return $classes;
}
add_filter( 'nav_menu_css_class', 'best_minimal_restaurant_menu_css_classes', 10, 3 );


/**
 * Add a pingback url auto-discovery header for single posts, pages, or attachments.
 *
 * @since 1.0.0
 *
 * @return void
 */
function best_minimal_restaurant_pingback_header() {
	if ( is_singular() && pings_open() ) {
		printf( '<link rel="pingback" href="%s">', esc_url( get_bloginfo( 'pingback_url' ) ) );
	}
}
add_action( 'wp_head', 'best_minimal_restaurant_pingback_header' );

/**
 * Filters the custom logo HTML.
 *
 * @param string $html The logo HTML.
 *
 * @since 1.0.0
 *
 * @return string $html The filtered logo html
 */
function best_minimal_restaurant_get_custom_logo( $html ) {
	$custom_logo_id = get_theme_mod( 'custom_logo' );

	if ( $custom_logo_id ) {
		$html = sprintf(
			'<a href="%1$s" class="custom-logo-link" rel="home" itemprop="url"><img class="custom-logo" style="max-width:%2$spx;max-height:%3$spx" src="%4$s" /></a>',
			esc_url( home_url( '/' ) ),
			300,
			100,
			wp_get_attachment_image_src(
				$custom_logo_id,
				'full'
			)[0]
		);
	}

	return $html;
}
add_filter( 'get_custom_logo', 'best_minimal_restaurant_get_custom_logo', 10, 2 );

/**
 * Gets the SVG code for a given icon.
 *
 * @since 1.0.0
 *
 * @param string $icon  The icon.
 *
 * @return string
 */
function best_minimal_restaurant_get_icon_svg( $icon ) {

	$icons = array(
		'arrow_right' => '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="m4 13v-2h12l-4-4 1-2 7 7-7 7-1-2 4-4z" fill="currentColor"/></svg>',
		'arrow_left'  => '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M20 13v-2H8l4-4-1-2-7 7 7 7 1-2-4-4z" fill="currentColor"/></svg>',
	);

	if ( isset( $icon ) && isset( $icons[ $icon ] ) ) {
		return $icons[ $icon ];
	}

	return '';
}


/**
 * Add a button to top-level menu items that has sub-menus.
 * An icon is added using CSS depending on the value of aria-expanded.
 *
 * @since 1.0.5
 *
 * @param string $output Nav menu item start element.
 * @param object $item   Nav menu item.
 * @param int    $depth  Depth.
 * @param object $args   Nav menu args.
 *
 * @return string Nav menu item start element.
 */
function best_minimal_restaurant_add_sub_menu_toggle( $output, $item, $depth, $args ) {
	if ( 0 === $depth && in_array( 'menu-item-has-children', $item->classes, true ) ) {

		// Add toggle button.
		$output .= '<a href="#" class="sub-menu-toggle">';
		$output .= '<span class="icon-plus">' . best_minimal_restaurant_get_svg( 'plus', 18 ) . '</span>';
		$output .= '<span class="icon-minus">' . best_minimal_restaurant_get_svg( 'minus', 18 ) . '</span>';
		$output .= '<span class="screen-reader-text">' . esc_html__( 'Open menu', 'best-minimal-restaurant' ) . '</span>';
		$output .= '</a>';
	}
	return $output;
}
add_filter( 'walker_nav_menu_start_el', 'best_minimal_restaurant_add_sub_menu_toggle', 10, 4 );

/**
 * Gets the icon svg code.
 *
 * @param string $icon  The icon.
 * @param int    $size  The icon-size in pixels.
 *
 * @return string $svg
 */
function best_minimal_restaurant_get_svg( $icon, $size ) {
	$icons = array(
		'plus'  => '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M18 11.2h-5.2V6h-1.6v5.2H6v1.6h5.2V18h1.6v-5.2H18z" fill="currentColor"/></svg>',
		'minus' => '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6 11h12v2H6z" fill="currentColor"/></svg>',
	);

	/**
	 * Filters array of icons.
	 *
	 * @since 1.0.5
	 *
	 * @param array $icons Array of icons.
	 */
	$icons = apply_filters( 'best_minimal_restaurant_svg_icons', $icons );

	$svg = '';
	if ( array_key_exists( $icon, $icons ) ) {
		$repl = sprintf( '<svg class="svg-icon" width="%d" height="%d" aria-hidden="true" role="img" focusable="false" ', $size, $size );

		$svg = preg_replace( '/^<svg /', $repl, trim( $icons[ $icon ] ) ); // Add extra attributes to SVG code.
	}

	// @phpstan-ignore-next-line.
	return $svg;
}

/**
 * Filters the arguments for a single nav menu item.
 *
 * @since 1.0.5
 *
 * @param stdClass $args  An object of wp_nav_menu() arguments.
 * @param WP_Post  $item  Menu item data object.
 * @param int      $depth Depth of menu item. Used for padding.
 *
 * @return stdClass
 */
function best_minimal_restaurant_add_menu_description_args( $args, $item, $depth ) {
	$args->link_after = '';
	if ( 0 === $depth && isset( $item->description ) && $item->description ) {
		// The extra <span> element is here for styling purposes: Allows the description to not be underlined on hover.
		$args->after = '<p class="menu-item-description"><span>' . $item->description . '</span></p>';
	}
	return $args;
}
add_filter( 'nav_menu_item_args', 'best_minimal_restaurant_add_menu_description_args', 10, 3 );
