<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require 'class-lb-payment-api-stripe-gateway.php';

function register_lb_payment_api() {
    register_rest_route( 'custom', 'payment', array(
                    'methods'  => 'POST',
                    'callback' => 'process_order',
                )
            );
}

function process_order( $request ) {
    $options = get_option( 'lb_payment_api_settings' , array() );
    $header = $request->get_header( 'Authorization' );

    //invalid credentials. exit
    if(!$header || $header != 'Bearer ' . $options['api_key_credentials']) {
        return new WP_Error( 'Invalid Credentials', 'Unauthorized', array( 'status' => 401 ) );
    }

    $order = Payment_Api_Stripe_Gateway::process_order($request);

    return rest_ensure_response($order);
}

?>