<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require 'class-lb-payment-api-stripe-gateway.php';
require 'class-lb-payment-api-utils.php';

add_action( 'rest_api_init', 'register_payment_route' );
add_action( 'rest_api_init', 'register_balance_route' );

function register_payment_route() {
    register_rest_route( 'lb-api-restricted', '/stripe/payment', array(
            'methods'  => 'POST',
            'callback' => 'process_order',
        )
    );
}

function register_balance_route() {
    register_rest_route( 'lb-api-restricted', '/stripe/balance', array(
            'methods'  => 'POST',
            'callback' => 'get_balance',
        )
    );
}

function process_order( $request ) {
    $authorized = LB_Payment_Api_Utils::authorizeRequest( $request );

    if(!$authorized) {
        return LB_Payment_Api_Utils::deny_request();
    }

    $order = Payment_Api_Stripe_Gateway::process_order($request);
    return rest_ensure_response($order);
}


/**
 * Get all currency balances. This is also used as a ping test. 
 */
function get_balance( $request ) {
    $authorized = LB_Payment_Api_Utils::authorize_request( $request );

    if(!$authorized) {
        return LB_Payment_Api_Utils::deny_request();
    }

    $balance = Payment_Api_Stripe_Gateway::get_balance();
    return rest_ensure_response($balance);
}

?>
