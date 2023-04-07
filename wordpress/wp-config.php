<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'wordpress' );

/** Database username */
define( 'DB_USER', 'wordpress' );

/** Database password */
define( 'DB_PASSWORD', 'Lmaolol123!' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'JR^yfWETJwqjn;{-zmHLVQ)s|)m_Ka/i[-Q[uAB|(n,V6,@moUVTOljrHn>Q:W^X' );
define( 'SECURE_AUTH_KEY',  'R2Wdw?o4>Mhb2$T9-_+)CC3uU[LfNP;IQb}qt|I=YY4S1_q?^:KB}g+T*IM6L`t)' );
define( 'LOGGED_IN_KEY',    'dd/vXG>X)LnPVF`v-/ K+DgdF9!augMt)#{?<>8(t;~?V>MZ$K;w7#Xlm4VGJcPl' );
define( 'NONCE_KEY',        'm Jpj.s,TS;uIoa<sD/lSST6O{J@jvy::Tilq8xykgK8~<8sg<FHdif5BYTfGVb`' );
define( 'AUTH_SALT',        '_;nzxv@[A15I=Pp%JEw</tmqsAZoQ4CTP2Fr>QgE<yX/vAu~,(nGz|dQ_Ed$AXnJ' );
define( 'SECURE_AUTH_SALT', '=FYx5-N3s rIK G4 r5bJAZ>I]ST-V@$HH%?0<2v:,kv9>YcY{UjF$1!RSzkn`_r' );
define( 'LOGGED_IN_SALT',   'fRR;HwQJpYqJ{52h6j2YC0zAD e(n:zCe)]aD>Qe{[CmY7/OOyT:;ZWcRrHkANXm' );
define( 'NONCE_SALT',       'M!Le)q{n4Vr:@:bjy=LPiS1tq#$3&UU!%O=gv$@QIl<Y+hH9vvAtn7o||){[uL=%' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
