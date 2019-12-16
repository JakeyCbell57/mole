<?php

/**
*   Plugin Name: Payment Api
*   description: 
*   Version: 1.0
*   Author: Custom
*   License: GPLv2 or later
*/

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require 'class-lb-payment-api.php';
require 'lb-payment-api-endpoints.php';

add_action( 'rest_api_init', 'register_lb_payment_api' );

new LB_Payment_Api();

?>
