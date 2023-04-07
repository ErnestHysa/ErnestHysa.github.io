<?php
/**
 * Contact Page Template Custom Fields
 *
 * @package Best_Minimal_Restaurant
 * @author  PriceListo
 */

if ( function_exists( 'acf_add_local_field_group' ) ) :

	acf_add_local_field_group(
		array(
			'key'                   => 'group_5f1b2731db719',
			'title'                 => esc_html__( 'Contact', 'best-minimal-restaurant' ),
			'fields'                => array(
				array(
					'key'               => 'field_contact5f1bd59e75b99',
					'label'             => esc_html__( 'Show/Hide Sections', 'best-minimal-restaurant' ),
					'name'              => 'contact-visible-sections',
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
						'contact-info' => esc_html__( 'Show Contact Info Section', 'best-minimal-restaurant' ),
						'contact-form' => esc_html__( 'Show Contact Form Section', 'best-minimal-restaurant' ),
						'map'          => esc_html__( 'Show Google Map Section', 'best-minimal-restaurant' ),
					),
					'allow_custom'      => 0,
					'default_value'     => array(
						0 => 'breadcrumb',
						1 => 'contact-info',
						2 => 'contact-form',
						3 => 'map',
					),
					'layout'            => 'horizontal',
					'toggle'            => 0,
					'return_format'     => 'value',
					'save_custom'       => 0,
				),
				array(
					'key'               => 'field_contact5f1b27418a96c',
					'label'             => esc_html__( 'Breadcrumb', 'best-minimal-restaurant' ),
					'name'              => '',
					'type'              => 'tab',
					'instructions'      => '',
					'required'          => 0,
					'conditional_logic' => array(
						array(
							array(
								'field'    => 'field_contact5f1bd59e75b99',
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
					'key'               => 'field_contact5f1b27528a96d',
					'label'             => esc_html__( 'Background', 'best-minimal-restaurant' ),
					'name'              => 'background-breadcrump-contact',
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
					'default_value'     => urestaurany_get_attachment_id_by_name( 'urest-minimal-contactpage-breadcrumb-background' ),
				),
				array(
					'key'               => 'field_contact5f1b277e8a96e',
					'label'             => esc_html__( 'Heading', 'best-minimal-restaurant' ),
					'name'              => 'heading-breadcrump-contact',
					'type'              => 'text',
					'instructions'      => '',
					'required'          => 0,
					'conditional_logic' => 0,
					'wrapper'           => array(
						'width' => '',
						'class' => '',
						'id'    => '',
					),
					'default_value'     => esc_html__( 'Contact us', 'best-minimal-restaurant' ),
					'placeholder'       => '',
					'prepend'           => '',
					'append'            => '',
					'maxlength'         => '',
				),
				array(
					'key'               => 'field_contact5f1b28a38a96f',
					'label'             => esc_html__( 'Contact Info', 'best-minimal-restaurant' ),
					'name'              => '',
					'type'              => 'tab',
					'instructions'      => '',
					'required'          => 0,
					'conditional_logic' => array(
						array(
							array(
								'field'    => 'field_contact5f1bd59e75b99',
								'operator' => '==',
								'value'    => 'contact-info',
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
					'key'               => 'field_contact5f1b28c98a970',
					'label'             => esc_html__( 'Title', 'best-minimal-restaurant' ),
					'name'              => 'contact-info-title',
					'type'              => 'text',
					'instructions'      => '',
					'required'          => 0,
					'conditional_logic' => 0,
					'wrapper'           => array(
						'width' => '',
						'class' => '',
						'id'    => '',
					),
					'default_value'     => esc_html__( 'How To reach us', 'best-minimal-restaurant' ),
					'placeholder'       => '',
					'prepend'           => '',
					'append'            => '',
					'maxlength'         => '',
				),
				array(
					'key'               => 'field_contact5f1b2a98e3791',
					'label'             => esc_html__( 'Contact Info', 'best-minimal-restaurant' ),
					'name'              => 'contact-info',
					'type'              => 'group',
					'instructions'      => '',
					'required'          => 0,
					'conditional_logic' => 0,
					'wrapper'           => array(
						'width' => '',
						'class' => '',
						'id'    => '',
					),
					'layout'            => 'block',
					'sub_fields'        => array(
						array(
							'key'               => 'field_contact5f1b2b05e3793',
							'label'             => esc_html__( 'Phone', 'best-minimal-restaurant' ),
							'name'              => 'phone',
							'type'              => 'text',
							'instructions'      => '',
							'required'          => 0,
							'conditional_logic' => 0,
							'wrapper'           => array(
								'width' => '',
								'class' => '',
								'id'    => '',
							),
							'default_value'     => '000-000-0000',
							'placeholder'       => '',
							'prepend'           => '',
							'append'            => '',
							'maxlength'         => '',
						),
						array(
							'key'               => 'field_contact5f1b2ac6e3792',
							'label'             => esc_html__( 'Phone Image', 'best-minimal-restaurant' ),
							'name'              => 'phone-image',
							'type'              => 'image',
							'instructions'      => '',
							'required'          => 0,
							'conditional_logic' => 0,
							'wrapper'           => array(
								'width' => '',
								'class' => '',
								'id'    => '',
							),
							'return_format'     => 'array',
							'preview_size'      => 'thumbnail',
							'library'           => 'all',
							'min_width'         => '',
							'min_height'        => '',
							'min_size'          => '',
							'max_width'         => '',
							'max_height'        => '',
							'max_size'          => '',
							'mime_types'        => '',
							'default_value'     => urestaurany_get_attachment_id_by_name( 'urest-minimal-contactpage-contact-phone' ),
						),
						array(
							'key'               => 'field_contact5f1b2b33e3794',
							'label'             => esc_html__( 'Email', 'best-minimal-restaurant' ),
							'name'              => 'email',
							'type'              => 'text',
							'instructions'      => '',
							'required'          => 0,
							'conditional_logic' => 0,
							'wrapper'           => array(
								'width' => '',
								'class' => '',
								'id'    => '',
							),
							'default_value'     => esc_html__( 'info@info.com', 'best-minimal-restaurant' ),
							'placeholder'       => '',
							'prepend'           => '',
							'append'            => '',
							'maxlength'         => '',
						),
						array(
							'key'               => 'field_contact5f1b2b4de3795',
							'label'             => esc_html__( 'Email Image', 'best-minimal-restaurant' ),
							'name'              => 'email-image',
							'type'              => 'image',
							'instructions'      => '',
							'required'          => 0,
							'conditional_logic' => 0,
							'wrapper'           => array(
								'width' => '',
								'class' => '',
								'id'    => '',
							),
							'return_format'     => 'array',
							'preview_size'      => 'thumbnail',
							'library'           => 'all',
							'min_width'         => '',
							'min_height'        => '',
							'min_size'          => '',
							'max_width'         => '',
							'max_height'        => '',
							'max_size'          => '',
							'mime_types'        => '',
							'default_value'     => urestaurany_get_attachment_id_by_name( 'urest-minimal-contactpage-contact-email' ),
						),
						array(
							'key'               => 'field_contact5f1b2b6be3796',
							'label'             => esc_html__( 'Location', 'best-minimal-restaurant' ),
							'name'              => 'location',
							'type'              => 'text',
							'instructions'      => '',
							'required'          => 0,
							'conditional_logic' => 0,
							'wrapper'           => array(
								'width' => '',
								'class' => '',
								'id'    => '',
							),
							'default_value'     => esc_html__( 'Lorem ipsum dolor.', 'best-minimal-restaurant' ),
							'placeholder'       => '',
							'prepend'           => '',
							'append'            => '',
							'maxlength'         => '',
						),
						array(
							'key'               => 'field_contact5f1b2ba0e3797',
							'label'             => esc_html__( 'Location Image', 'best-minimal-restaurant' ),
							'name'              => 'location-image',
							'type'              => 'image',
							'instructions'      => '',
							'required'          => 0,
							'conditional_logic' => 0,
							'wrapper'           => array(
								'width' => '',
								'class' => '',
								'id'    => '',
							),
							'return_format'     => 'array',
							'preview_size'      => 'thumbnail',
							'library'           => 'all',
							'min_width'         => '',
							'min_height'        => '',
							'min_size'          => '',
							'max_width'         => '',
							'max_height'        => '',
							'max_size'          => '',
							'mime_types'        => '',
							'default_value'     => urestaurany_get_attachment_id_by_name( 'urest-minimal-contactpage-contact-location' ),
						),
					),
				),
				array(
					'key'               => 'field_contact5f1b5524168e4',
					'label'             => esc_html__( 'Contact Form', 'best-minimal-restaurant' ),
					'name'              => '',
					'type'              => 'tab',
					'instructions'      => '',
					'required'          => 0,
					'conditional_logic' => array(
						array(
							array(
								'field'    => 'field_contact5f1bd59e75b99',
								'operator' => '==',
								'value'    => 'contact-form',
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
					'key'               => 'field_contact5f1b5537168e5',
					'label'             => esc_html__( 'Section Background', 'best-minimal-restaurant' ),
					'name'              => 'contact-form-background',
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
					'default_value'     => urestaurany_get_attachment_id_by_name( 'urest-minimal-contactpage-contact-form-background' ),
				),
				array(
					'key'               => 'field_contact5f1b5585168e6',
					'label'             => esc_html__( 'Contact Form Shortcode', 'best-minimal-restaurant' ),
					'name'              => 'contact-form-shortcode',
					'type'              => 'text',
					'instructions'      => '',
					'required'          => 0,
					'conditional_logic' => 0,
					'wrapper'           => array(
						'width' => '',
						'class' => '',
						'id'    => '',
					),
					'default_value'     => '',
					'placeholder'       => '',
					'prepend'           => '',
					'append'            => '',
					'maxlength'         => '',
				),
				array(
					'key'               => 'field_contact5f1b59ff4a1cd',
					'label'             => esc_html__( 'Google Map', 'best-minimal-restaurant' ),
					'name'              => '',
					'type'              => 'tab',
					'instructions'      => '',
					'required'          => 0,
					'conditional_logic' => array(
						array(
							array(
								'field'    => 'field_contact5f1bd59e75b99',
								'operator' => '==',
								'value'    => 'map',
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
					'key'               => 'field_contact5f1b5a114a1ce',
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
						'value'    => 'template-contact.php',
					),
				),
			),
			'menu_order'            => 0,
			'position'              => 'normal',
			'style'                 => 'default',
			'label_placement'       => 'top',
			'instruction_placement' => 'label',
			'hide_on_screen'        => '',
			'active'                => true,
			'description'           => '',
		)
	);

endif;
