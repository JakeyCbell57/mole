<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Payment_Api_Stripe_Gateway {

    /**
	 * Stripe API Endpoint
	 */
	const ENDPOINT           = 'https://api.stripe.com/v1';
	const STRIPE_API_VERSION = '2019-09-09';

    /**
	 * Generates the user agent we use to pass to API request so
	 * Stripe can identify our application.
	 *
	 * @since 4.0.0
	 * @version 4.0.0
	 */
	public static function get_user_agent() {
		$app_info = array(
			'name'    => 'WooCommerce Stripe Gateway',
			'version' => WC_STRIPE_VERSION,
			'url'     => 'https://woocommerce.com/products/stripe/',
		);

		return array(
			'lang'         => 'php',
			'lang_version' => phpversion(),
			'publisher'    => 'woocommerce',
			'uname'        => php_uname(),
			'application'  => $app_info,
		);
    }

	/**
	 * Get secret key from Woocommerce Stripe Settings.
	 * @return string
	 */
	public static function get_secret_key() {
		$options = get_option( 'woocommerce_stripe_settings' );

		if ( isset( $options['testmode'], $options['secret_key'], $options['test_secret_key'] ) ) {
			return 'yes' === $options['testmode'] ? $options['test_secret_key'] : $options['secret_key'];
		}
		
		return null;
    }
    

	/**
	 * Generates the headers to pass to API request.
	 *
	 * @since 4.0.0
	 * @version 4.0.0
	 */
	public static function get_headers() {
		$user_agent = self::get_user_agent();
		$app_info   = $user_agent['application'];

		return apply_filters(
			'woocommerce_stripe_request_headers',
			array(
				'Authorization'              => 'Basic ' . base64_encode( self::get_secret_key() . ':' ),
				'Stripe-Version'             => self::STRIPE_API_VERSION,
				'User-Agent'                 => $app_info['name'] . '/' . $app_info['version'] . ' (' . $app_info['url'] . ')',
				'X-Stripe-Client-User-Agent' => json_encode( $user_agent ),
			)
		);
    }

    /**
     * Send card details to Stripe to create a payment token
     * @return object payment token to be used as source for payment
     */
    public static function create_token($card_number, $card_expiry_month, $card_expiry_year, $card_cvv) {
        $data = array(
            'card[number]'    => $card_number,
            'card[exp_month]' => $card_expiry_month,
            'card[exp_year]'  => $card_expiry_year,
            'card[cvc]'       => $card_cvv
        );

        $args = array(
            'headers'     => self::get_headers(),
            'body'        => $data,
            'method'      => 'POST',
            'data_format' => 'body',
        );

        //get token from stripe
        $response = wp_remote_post(self::ENDPOINT . '/tokens', $args);

        //wordpress errored for some reason
        if( is_wp_error( $response ) ) {
            return array('error' => array('status' => 500));
        }

        $body = json_decode( $response['body'], true );

        if(!$body['error']) {
            return array( 'id' => $body['id'] );

        } else {
            return array(
                'error'  => array(
					'code' => $body['error']['code'],
					'message' => $body['error']['message']
				)
            );
        }
    }

    public static function process_order($params) {
        $token = self::create_token($params['cardNumber'], $params['expiryMonth'], $params['expiryYear'], $params['cvv']);

        if($token['error']) {
            return array(
                'status' => 'DECLINED',
                'error'  => $token['error'],
            );
        }

        //token is good, proceed with order

        $data = array(
            'amount'    => $params['orderTotal'],
            'currency'  => $params['currency'],
            'source'    => $token['id']
        );

        $args = array(
            'headers'     => self::get_headers(),
            'body'        => json_encode($data),
            'method'      => 'POST',
            'data_format' => 'body'
        );

        $response = wp_remote_post(self::ENDPOINT . '/charges', $args);

        //wordpress errored for some reason
        if( is_wp_error( $response ) ) {
            return array('error' => array('status' => 500));
        }

        $body = json_decode( $response['body'], true );
        
        if($body['status'] == 'succeeded') {
            return array(
                'status'  => 'APPROVED',
                'orderId' => $body[id]
            );

        } else if($body['type'] == 'card_error') {
            //some kind of decline
            return array(
                'status' => 'DECLINED',
                'error'  => array(
                    'message' => $body['message']
                )
            );

        } else {
            //non decline error. may indicate something wrong with account.
            //returning FATAL will tell payment api to try the next processor
            return array(
                'status' =>'FATAL',
                'error'  => array(
                    'message' => $body['error']['message'],
					'code' 	  => $body['error']['code']  
				)
            );
        }
    }

    public static function get_balance() {
        $args = array(
            'headers'     => self::get_headers(),
            'body'        => $data,
            'method'      => 'GET',
            'data_format' => 'body',
        );

        $response = wp_remote_get(self::ENDPOINT . '/balance', $args);

        //wordpress errored for some reason
        if( is_wp_error( $response ) ) {
            return array('error' => array('status' => 500));
        }

        $body = json_decode( $response['body'], true );

        if(!$body['error']) {
            return $body;

        } else {
            return array(
                'error'  => array(
					'code' => $body['error']['code'],
					'message' => $body['error']['message']
				)
            );
        }
    }

}

?>
