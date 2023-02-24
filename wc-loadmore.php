<?php
/*
 * Plugin Name: Woocommerce Loadmore Plugin
 */

 if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

class WC_Loadmore  {
    // INITIALIZE VARIABLES
    public $thumbnail_placeholder;

    function __construct() {
        $this->thumbnail_placeholder = 5921;
        $this->init();
    }
    
    // INIT PLUGIN NESSARY ELEMENTS
    function init() {
        // INIT THEME ACTIONS
        add_action( 'wp_enqueue_scripts', [$this, 'load_styles'], PHP_INT_MAX );
        add_action( 'wp_enqueue_scripts', [$this,'load_scripts'], PHP_INT_MAX );
        add_action( 'plugins_loaded', [$this,'init_woocommerce'] );
        
        // INIT THEME SHORTCODES 
        add_shortcode( 'category_listing', [$this,'product_category_list'] );
    }
    
    function init_woocommerce() {
        add_action( 'wp_ajax_priv_ajax_product_pagination', [$this,'ajax_product_pagination'] );
        add_action( 'wp_ajax_nopriv_ajax_product_pagination', [$this,'ajax_product_pagination'] );
        
    
        add_filter( 'woocommerce_shortcode_products_query', [$this,'add_custom_button_to_product_shortcode'] );
        add_action( 'woocommerce_after_shop_loop_item',  [$this,'woocommerce_custom_button'], 5 );
        add_action( 'woocommerce_shortcode_after_products_loop',  [$this,'loadmore_btn'], 11 );
    }

    function add_custom_button_to_product_shortcode( $atts ) {
        $atts['custom_button'] = true;
        $atts['loadmore'] = true;
        return $atts;
    }
    
    // PLUGIN STYLE CALLBACK
    function load_styles() {
        wp_enqueue_style( 'wc-loadmore-style', plugin_dir_url(__FILE__). 'assets/css/wc-loadmore-style.css' );
    }
    
    // PLUGIN JS SCRIPTS CALLBACK
    function load_scripts() {
        wp_enqueue_script( 'wc-loadmore-script', plugin_dir_url(__FILE__).'assets/js/wc-loadmore-script.js', array(), '0.1', true );
    }

    // WOOCOMMERCE WISHLIST BTN FOR PRODUCTS
    function woocommerce_custom_button() {
        echo do_shortcode( '[yith_wcwl_add_to_wishlist]' );
    }
    
    // LOADMORE BUTTON CALLBACK
    function loadmore_btn() {
        echo '<button class="button product-load-more">LOADMORE</button>';
    }

    // PRODUCTS LISTING WITH PAGINATION 
    function ajax_product_pagination(){
    
        // PARAMETERS
        $category_id = sanitize_text_field( $_POST['category_id'] );
        $paged = sanitize_text_field( $_POST['paged'] ) ?? 1;
        $products_array = array();

        $args = array(
            'category' => array($category_id),
            'paged' => $paged
        );

        // RETURN ERROR IF FUNTION DOES NOT EXIST 
        if( !function_exists( "wc_get_products" ) ) wp_send_json_error("wc_get_products was not exist");
        
        $product_list = wc_get_products($args);
        
        
        // RETURN MSG IF PRODUCT EMPTY
        if(empty($product_list)) return wp_send_json_error("No Products Found");

        // FETCH NESSORY PRODUCT INFO
        foreach($product_list as $product) {
            $product_id = $product->get_id();
            $vendor_id = get_post_field( 'post_author', $product_id );
            $vendor = get_userdata( $vendor_id );
            $product_image = get_post_thumbnail_id( $product_id ) ?? get_post_thumbnail_id( $this->thumbnail_placeholder );
            $products_array[] = array(
                'product_id' => $product_id,
                'product_name' => $product->get_name(),
                'product_title' => $product->get_title(),
                'product_status' => $product->get_status(),
                'price' => $product->get_price(),
                'sale_price' => $product->get_sale_price(),
                'regular_price' => $product->get_regular_price(),
                'product_image' => wp_get_attachment_image_src( $product_image, 'single-post-thumbnail' )[0],
                'rating_count' => $product->get_average_rating(),
                'review_count' => $product->get_review_count(),
                'vendor_info' => $vendor->display_name,
                'link' => get_permalink($product_id)
            );
        }
        
        // RETURN DATA
        wp_send_json_success($products_array);
    }

    function product_category_list() {
        
        $attr = array();

        do_action( 'shortcode_category_list_attribute', $attr );

        // GET PRODUCT CATEGORIES 
        $terms = get_terms(
            array(
                "cat" => "product_cat"
            )
        );
        
        // RETURN MSG IF CATEGORY IS EMPTY
        if(empty($terms)) $html = "No Records Found"; 

        $html = "<div class='wc-product-categories-container'>";
            $html .= "<ul class='wc-product-categories'>";
            $i = 1;
            foreach($terms as $term) {
                $html .= "<li class='item'>";
                    $html .= "<label for='wc-product-category-$i'>";
                    $html .= "<input id='wc-product-category-$i' type='checkbox' name='wc-product-category' class='wc-product-category' value='$term->name' data-id='$term->slug'>";
                        $html .=  $term->name;
                    $html .= "</label>";
                    
                $html .= "</li>";
                $i++;
            }
            $html .= "</ul>";
        
        // RETURN CATEGORIES LIST
        return $html .= "</div>";   
    }
}

new WC_Loadmore();


