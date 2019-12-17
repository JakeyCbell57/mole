<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class LB_Payment_Api_Utils {

    public static function authorize_request( $request ) {
        $options = get_option( 'lb_payment_api_settings' , array() );
        $header = $request->get_header( 'Authorization' );
		
		if(!$header || !$options['api_key_credentials']) {
			return false;
		}
		
        $authorized = false;
    
        if($header == 'Bearer ' . $options['api_key_credentials']) {
            $authorized = true;
        }
    
        return $authorized;
    }

    public static function deny_request() {
        return new WP_Error( 'Invalid Credentials', 'Unauthorized', array( 'status' => 401 ) );
    }
}

?>