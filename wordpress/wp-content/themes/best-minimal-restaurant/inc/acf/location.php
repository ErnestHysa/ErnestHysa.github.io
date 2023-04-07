<?php
/**
 * Location Page Template Custom Fields
 *
 * @package Best_Minimal_Restaurant
 * @author  PriceListo
 */

if ( function_exists( 'acf_add_local_field_group' ) ) :

	acf_add_local_field_group(
		array(
			'key'                   => 'group_5f1a1c4ec224f',
			'title'                 => esc_html__( 'Location', 'best-minimal-restaurant' ),
			'fields'                => array(
				array(
					'key'               => 'field_location5f1bd80865fa8',
					'label'             => esc_html__( 'Show/Hide Sections', 'best-minimal-restaurant' ),
					'name'              => 'location-visible-sections',
					'type'              => 'checkbox',
					'instructions'      => esc_html__( 'Uncheck section(s) to be hided from the page!', 'best-minimal-restaurant' ),
					'required'          => 0,
					'conditional_logic' => 0,
					'wrapper'           => array(
						'width' => '',
						'class' => '',
						'id'    => '',
					),
					'choices'           => array(
						'breadcrumb'   => esc_html__( 'Show Breadcrumb Section', 'best-minimal-restaurant' ),
						'our-location' => esc_html__( 'Show Our Location Section', 'best-minimal-restaurant' ),
					),
					'allow_custom'      => 0,
					'default_value'     => array(
						0 => 'breadcrumb',
						1 => 'our-location',
					),
					'layout'            => 'horizontal',
					'toggle'            => 0,
					'return_format'     => 'value',
					'save_custom'       => 0,
				),
				array(
					'key'               => 'field_location5f1a1c5880f7c',
					'label'             => esc_html__( 'Breadcrumb', 'best-minimal-restaurant' ),
					'name'              => '',
					'type'              => 'tab',
					'instructions'      => '',
					'required'          => 0,
					'conditional_logic' => array(
						array(
							array(
								'field'    => 'field_location5f1bd80865fa8',
								'operator' => '==',
								'value'    => 'breadcrumb',
							),
						),
					),
					'wrapper'           => array(
						'width' => '',
						'class' => '',
						'id'    => '',
					),
					'placement'         => 'top',
					'endpoint'          => 0,
				),
				array(
					'key'               => 'field_location5f1a1c7680f7d',
					'label'             => esc_html__( 'Background', 'best-minimal-restaurant' ),
					'name'              => 'background-breadcrump-location',
					'type'              => 'image',
					'instructions'      => '',
					'required'          => 0,
					'conditional_logic' => 0,
					'wrapper'           => array(
						'width' => '',
						'class' => '',
						'id'    => '',
					),
					'return_format'     => 'url',
					'preview_size'      => 'medium',
					'library'           => 'all',
					'min_width'         => '',
					'min_height'        => '',
					'min_size'          => '',
					'max_width'         => '',
					'max_height'        => '',
					'max_size'          => '',
					'mime_types'        => '',
					'default_value'     => urestaurany_get_attachment_id_by_name( 'urest-minimal-locationpage-breadcrumb-background' ),
				),
				array(
					'key'               => 'field_location5f1a1c9880f7e',
					'label'             => esc_html__( 'Heading', 'best-minimal-restaurant' ),
					'name'              => 'heading-breadcrump-location',
					'type'              => 'text',
					'instructions'      => '',
					'required'          => 0,
					'conditional_logic' => 0,
					'wrapper'           => array(
						'width' => '',
						'class' => '',
						'id'    => '',
					),
					'default_value'     => esc_html__( 'Location', 'best-minimal-restaurant' ),
					'placeholder'       => '',
					'prepend'           => '',
					'append'            => '',
					'maxlength'         => '',
				),
				array(
					'key'               => 'field_location5f1a1cd480f7f',
					'label'             => esc_html__( 'Our Location', 'best-minimal-restaurant' ),
					'name'              => '',
					'type'              => 'tab',
					'instructions'      => '',
					'required'          => 0,
					'conditional_logic' => array(
						array(
							array(
								'field'    => 'field_location5f1bd80865fa8',
								'operator' => '==',
								'value'    => 'our-location',
							),
						),
					),
					'wrapper'           => array(
						'width' => '',
						'class' => '',
						'id'    => '',
					),
					'placement'         => 'top',
					'endpoint'          => 0,
				),
				array(
					'key'               => 'field_location5f1a1ceb80f80',
					'label'             => esc_html__( 'Title', 'best-minimal-restaurant' ),
					'name'              => 'our-location-title',
					'type'              => 'text',
					'instructions'      => '',
					'required'          => 0,
					'conditional_logic' => 0,
					'wrapper'           => array(
						'width' => '',
						'class' => '',
						'id'    => '',
					),
					'default_value'     => esc_html__( 'Our Location', 'best-minimal-restaurant' ),
					'placeholder'       => '',
					'prepend'           => '',
					'append'            => '',
					'maxlength'         => '',
				),
				array(
					'key'               => 'field_location5f1a1d2080f81',
					'label'             => esc_html__( 'Address', 'best-minimal-restaurant' ),
					'name'              => 'location-address',
					'type'              => 'text',
					'instructions'      => '',
					'required'          => 0,
					'conditional_logic' => 0,
					'wrapper'           => array(
						'width' => '',
						'class' => '',
						'id'    => '',
					),
					'default_value'     => esc_html__( '123 Elm Street Los Angeles, CA 90210', 'best-minimal-restaurant' ),
					'placeholder'       => '',
					'prepend'           => '',
					'append'            => '',
					'maxlength'         => '',
				),
				array(
					'key'               => 'field_location5f1a1d7a80f82',
					'label'             => esc_html__( 'Google Maps Shortcode', 'best-minimal-restaurant' ),
					'name'              => 'location-map',
					'type'              => 'text',
					'instructions'      => esc_html__( 'Enter the WP Google Maps Plugin Shortcode!', 'best-minimal-restaurant' ),
					'required'          => 0,
					'conditional_logic' => 0,
					'wrapper'           => array(
						'width' => '',
						'class' => '',
						'id'    => '',
					),
					'default_value'     => '[wpgmza id="1"]',
					'placeholder'       => '',
					'prepend'           => '',
					'append'            => '',
					'maxlength'         => '',
				),
			),
			'location'              => array(
				array(
					array(
						'param'    => 'page_template',
						'operator' => '==',
						'value'    => 'template-location.php',
					),
				),
			),
			'menu_order'            => 0,
			'position'              => 'normal',
			'style'                 => 'default',
			'label_placement'       => 'top',
			'instruction_placement' => 'label',
			'hide_on_screen'        => array(
				1  => 'the_content',
				2  => 'excerpt',
				3  => 'discussion',
				4  => 'comments',
				7  => 'author',
				8  => 'format',
				10 => 'featured_image',
				11 => 'categories',
				12 => 'tags',
				13 => 'send-trackbacks',
			),
			'active'                => true,
			'description'           => '',
		)
	);

endif;
