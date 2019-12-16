<?php

class WC_Easy_Processing_Payment_Gateway extends WC_Payment_Gateway_CC {
    
    public function __construct(){
		$this->id = 'easy-gateway';
        $this->method_title = 'Easy Gateway';
		$this->has_fields = true;
		$this->init_form_fields();
		$this->init_settings();
		$this->enabled      = $this->get_option('enabled');
		$this->title        = $this->get_option('title');
        $this->api_key      = $this->get_option('api_key');
        $this->api_url      = $this->get_option('api_url');
		$this->order_status = $this->get_option('order_status');

		add_action('woocommerce_update_options_payment_gateways_'.$this->id, array($this, 'process_admin_options'));
    }
    
    public function init_form_fields(){
        $this->form_fields = array(

            'enabled'       => array(
                'title' 		=> 'Enable/Disable',
                'type' 			=> 'checkbox',
                'label' 		=> 'Enable Credit Card Payment',
                'default' 		=> 'yes'
            ),
            'title'         => array(
                'title' 		=> 'Payment Type Title',
                'type' 			=> 'text',
                'description' 	=> 'This controls the title of the payment selectable payment types',
                'default'		=> 'Credit Card',
                'desc_tip'		=> true
            ),
            'api_key'       => array(
                'title' 		=> 'Api Key',
                'type' 			=> 'text',
                'description' 	=> 'The Api key for this gateway',
                'default'		=> 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                'desc_tip'		=> true
            ),
            'api_url'       => array(
                'title' 		=> 'Api URL',
                'type' 			=> 'text',
                'description' 	=> 'The Api URL for this gateway',
                'default'		=> '',
                'desc_tip'		=> true
            )
        );
    }


	public function admin_options() {
		?>
		    <h3>Easy Processing Settings</h3>
			<div id="poststuff">
				<div id="post-body" class="metabox-holder columns-2">
					<div id="post-body-content">
						<table class="form-table">
							<?php $this->generate_settings_html();?>
						</table><!--/.form-table-->
					</div>
					
				</div>
				<div class="clear"></div>

            </div>
		<?php
	}

	public function validate_fields() {
		return true;
    }
    
    public function process_payment( $order_id ) {
		global $woocommerce;
 
	    // we need it to get any order detailes
	    $order = wc_get_order( $order_id );
		
	    $params = array(
            'orderTotal' => (float) $order->get_total(),
            'ccNumber'   => $_POST[$this->id .'-card-number'],
            'ccExpiry'   => $_POST[$this->id .'-card-expiry'],
            'cvv'        => $_POST[$this->id .'-card-cvc'],
        );

        $arguments = array(
            'headers'     => $this->get_headers(),
            'body'        => json_encode($params),
            'method'      => 'POST',
            'data_format' => 'body',
        );
    
	    /*
	     * Your API interaction could be built with wp_remote_post()
 	     */
	     $response = wp_remote_post($this->api_url.'/payment', $arguments );
    
	     if( !is_wp_error( $response ) ) {
	    	 $body = json_decode( $response['body'], true );
        
	    	 // it could be different depending on your payment processor
	    	 if ( $body['status'] == 'APPROVED' ) {
            
	    		// we received the payment
	    		$order->payment_complete();
	    		$order->reduce_order_stock();
            
	    		// some notes to customer (replace true with false to make it private)
	    		// $order->add_order_note( 'Hey, your order is paid! Thank you!', true );
            
	    		// Empty cart
	    		$woocommerce->cart->empty_cart();
            
	    		// Redirect to the thank you page
	    		return array(
	    			'result' => 'success',
	    			'redirect' => $this->get_return_url( $order )
	    		);
            
	    	 } else {
	    		wc_add_notice( 'Please try again.', 'error' );
	    		return;
	    	}
        
	    } else {
	    	wc_add_notice( 'Connection error.', 'error' );
	    	return;
        }	
	}
    
    private function get_headers() {
        return array(
			'Content-Type' => 'application/json; charset=utf-8',
			'Authorization' => 'Bearer ' . $this->api_key
		);
    }

}
