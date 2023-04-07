<?php
/**
 * The template for displaying all pages
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site may use a
 * different template.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Best_Minimal_Restaurant
 * @author  PriceListo
 */

get_header();
?>

<main id="site-main primary" class="site-main">
		<section class="latest_post_wrap v1"></section>

		<div id="site-content" class="content-area">
			<?php
			if ( have_posts() ) :

				/* Start the Loop */
				while ( have_posts() ) :

					the_post();
					get_template_part( 'template-parts/content' );
				endwhile;

			else :

				get_template_part( 'template-parts/content', 'none' );

			endif;
			?>
		</div>

	</main><!-- #main -->

<?php
get_footer();
