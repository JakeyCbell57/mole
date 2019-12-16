<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class LB_Payment_Api {

    private $options;

    public function __construct() {
        add_action( 'admin_menu', array( $this, 'add_plugin_page' ) );
        add_action( 'admin_init', array( $this, 'page_init' ) );
    }

    public function add_plugin_page() {
        // This page will be under "Settings"
        add_options_page(
            'Payment Api', 
            'Payment Api', 
            'manage_options', 
            'lb-payment-api', 
            array( $this, 'create_admin_page' )
        );
    }

    public function create_admin_page() {
        $this->options = get_option( 'lb_payment_api_settings' );
        ?>
        <div class="wrap">
            <h1>Payment Api Settings</h1>
            <form method="post" action="options.php">
            <?php
                // This prints out all hidden setting fields
                settings_fields( 'my_option_group' );
                do_settings_sections( 'lb-payment-api' );
                submit_button();
            ?>
            </form>
        </div>
        <?php
    }

    public function page_init(){        
        register_setting(
            'my_option_group', // Option group
            'lb_payment_api_settings', // Option name
            'api_key_credentials' // Sanitize
        );

        add_settings_section(
            'api_credentials_section', // ID
            'Credentials', // Title
            array( $this, 'print_section_info' ), // Callback
            'lb-payment-api' // Page
        );  

        add_settings_field(
            'api_key_credentials', // ID
            'Api Key', // Title 
            array( $this, 'api_key_credentials_callback' ), // Callback
            'lb-payment-api', // Page
            'api_credentials_section' // Section           
        );      
    
    }

    public function print_section_info() {
        print 'Enter your settings below:';
    }

    public function api_key_credentials_callback() {
        printf(
            '<input type="text" style="width: 400px" placeholder="Enter Api Key" id="api_key_credentials" name="lb_payment_api_settings[api_key_credentials]" value="%s" />',
            isset( $this->options['api_key_credentials'] ) ? esc_attr( $this->options['api_key_credentials']) : ''
        );
    }

}

?>