<?php
/* @wordpress-plugin
 * Plugin Name:       WooCommerce Easy Processing
 * Description:       Easy Processing.
 * Version:           1.0.0
 * WC requires at least: 3.0
 * WC tested up to: 3.8
 * Text Domain:       woocommerce-easy-processing-gateway
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 */

defined( 'ABSPATH' ) or die( 'Not Available' );

$active_plugins = apply_filters('active_plugins', get_option('active_plugins'));

if(woocommerce_active()) {
    add_filter('woocommerce_payment_gateways', 'add_easy_processing_gateway');
    add_action('plugins_loaded', 'init_easy_processing_gateway');
    
    function add_easy_processing_gateway( $gateways ){
        $gateways[] = 'WC_Easy_Processing_Payment_Gateway';
		return $gateways; 
	}
    
	function init_easy_processing_gateway(){
        require 'easy-processing-gateway.php';
    }
}

function woocommerce_active() {
	$active_plugins = (array) get_option('active_plugins', array());

	if (is_multisite()) {
		$active_plugins = array_merge($active_plugins, get_site_option('active_sitewide_plugins', array()));
	}

	return in_array('woocommerce/woocommerce.php', $active_plugins) || array_key_exists('woocommerce/woocommerce.php', $active_plugins);
}