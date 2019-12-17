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

require 'class-lb-payment-api-settings.php';
require 'lb-payment-api-endpoints.php';

new LB_Payment_Api();

?>
