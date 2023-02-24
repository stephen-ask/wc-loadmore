(function($) {
    'use strict';
    
    $.noConflict( );

	var product_array = [];
	var productEmpty = false;

    localStorage.setItem('paged', 2);

    var paged = localStorage.getItem('paged');
  
    if($('.wc-product-category')) {
        $('.wc-product-category').prop('checked', false);
    }
    
	$('.elementor-tabs-wrapper').find('.elementor-tab-title').click(function(){
		localStorage.setItem('paged', 2);
	});
	
    // HANDLES PRODUCTS AJAX REQUEST 
    function ajax_post( url, data, paged ) {
        $.ajax({
            type: "POST",
            url: url,
            data: data,
            success: function(response){
                product_array = response.success == true ? response.data : [];
                
                if( paged == true && product_array.length == 0 ) {
                    console.log('empty no products loaded');
//                     $('.product-load-more').html('NO MORE PRODUCTS TO LOAD').prop('disabled', true);
					$('.elementor-tabs-content-wrapper').find('.elementor-active').find('.product-load-more').html('NO MORE PRODUCTS TO LOAD').prop('disabled', true);
					$('.provider-profile-container .product-load-more').html('NO MORE PRODUCTS TO LOAD').prop('disabled', true);
                    productEmpty = true;
                    return;
                }
                productEmpty = false;
                $('.product-load-more').html('LOAD MORE');                 
                categoryProductlisting( product_array, paged );
            },
            processData: false,
            contentType:false,
        });
    }
    
    // SETS PRODUCT GRID AFTER AJAX REQUEST
    function categoryProductlisting( product_array, paged ) {
        let productItem = [];

        product_array.forEach((item, index)=>{
            let rating_percentage = ( item.rating_count / 5 ) * 100;
            productItem[index] = '<li class="blog-post product type-product post-'+item.product_id+' status-publish instock product_cat-seller has-post-thumbnail sale shipping-taxable purchasable product-type-simple">';
                productItem[index] += '<a href="'+item.link+'"';
                productItem[index] += 'class="woocommerce-LoopProduct-link woocommerce-loop-product__link">';
                    productItem[index] += '<span class="onsale">Sale!</span>';
                    
                    // PRODUCT IMAGE 
                    productItem[index] += '<img src="'+item.product_image+'" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail"';
                    productItem[index] += 'alt=""  width="228" height="228">';
                    
                    // PRODUCT TITLE
                    productItem[index] += '<h2 class="woocommerce-loop-product__title">'+item.product_name+'</h2>';
                    
                    // PRODUCT REVIEW
                    productItem[index] += '<div class="eael-star-rating star-rating"><span style="width:'+rating_percentage+'%">';
                        productItem[index] += 'Rated <strong class="rating">'+item.rating_count+'</strong> out of 5</span>';
                    productItem[index] += '</div>';
                    productItem[index] += '<span class="price">';
                    
                    // PRODUCT SALE PRICE
                    if(item.sale_price != '') {
                        productItem[index] += '<ins>';
                            productItem[index] += '<span class="woocommerce-Price-amount amount"><bdi>';
                            productItem[index] += '<span class="woocommerce-Price-currencySymbol">$</span>'+item.sale_price+'</bdi></span>';
                        productItem[index] += '</ins>';
                    }

                    if(item.sale_price == '' && item.regular_price != '') {
                        productItem[index] += '<ins>';
                            productItem[index] += '<span class="woocommerce-Price-amount amount"><bdi>';
                            productItem[index] += '<span class="woocommerce-Price-currencySymbol">$</span>'+item.regular_price+'</bdi></span>';
                        productItem[index] += '</ins>';
                    }

                    // PRODUCT PRICE 
                    if(item.regular_price != '' && item.sale_price != '') {
                        productItem[index] += '<del>';
                            productItem[index] += '<span class="woocommerce-Price-amount amount">';
                                productItem[index] += '<bdi>';
                                    productItem[index] += '<span class="woocommerce-Price-currencySymbol">$</span>'+item.regular_price;
                                productItem[index] += '</bdi>';
                            productItem[index] += '</span>';
                        productItem[index] += '</del>';
                    }
                    
                    // VENDOR INFO
                    if(item.vendor_info) {
                        productItem[index] += '<div class="product-author-name"> By : '+item.vendor_info+'</div></span>';
                    } 
                    else { 
                        productItem[index] += '<div class="product-author-name"></div></span>';
                    }

                productItem[index] += '</a>';
                
                // WISHLIST 
                productItem[index] +='<div class="yith-wcwl-add-to-wishlist add-to-wishlist-'+item.product_id+'  wishlist-fragment on-first-load" ';
                productItem[index] +='data-fragment-ref="'+item.product_id+'" ';
                productItem[index] +='data-fragment-options="';
                productItem[index] +='{';
                productItem[index] +='	&quot;base_url&quot;:&quot;&quot;,&quot;in_default_wishlist&quot;:false,&quot;is_single&quot;:false,&quot;';
                productItem[index] +='	show_exists&quot;:false,&quot;product_id&quot;:'+item.product_id+',&quot;parent_product_id&quot;:'+item.product_id+',&quot;product_type&quot;';
                productItem[index] +='	:&quot;simple&quot;,&quot;show_view&quot;:false,&quot;browse_wishlist_text&quot;:&quot;Browse wishlist&quot;';
                productItem[index] +='	,&quot;already_in_wishslist_text&quot;:&quot;The product is already in your wishlist!&quot;,&quot;';
                productItem[index] +='	product_added_text&quot;:&quot;Product added!&quot;,&quot;heading_icon&quot;:&quot;fa-heart-o&quot;,&quot;';
                productItem[index] +='	available_multi_wishlist&quot;:false,&quot;disable_wishlist&quot;:false,&quot;show_count&quot;:false,&quot;';
                productItem[index] +='	ajax_loading&quot;:false,&quot;loop_position&quot;:&quot;after_add_to_cart&quot;,&quot;item&quot;:&quot;';
                productItem[index] +='	add_to_wishlist&quot;';
                productItem[index] +='}">';
                    productItem[index] +='	<div class="yith-wcwl-add-button">';
                        productItem[index] +='<a href="?add_to_wishlist='+item.product_id+'&amp;_wpnonce=c7b9fa27a1" ';
                        productItem[index] +='class="add_to_wishlist single_add_to_wishlist"';
                        productItem[index] +='data-product-id="'+item.product_id+'" data-product-type="simple" ';
                        productItem[index] +='data-original-product-id="'+item.product_id+'" ';
                        productItem[index] +='data-title="Add to wishlist" ';
                        productItem[index] +='rel="nofollow" >';
                            productItem[index] +='<i class="yith-wcwl-icon fa fa-heart-o"></i><span>Add to wishlist</span>';
                        productItem[index] +='	</a>';
                    productItem[index] +='	</div>';
                productItem[index] +='</div>';
                    
                // CART BTN
                productItem[index] += '<a href="?add-to-cart='+item.product_id+'"';
                productItem[index] += 'data-quantity="1"';
                productItem[index] += 'class="button wp-element-button product_type_simple add_to_cart_button ajax_add_to_cart"';
                productItem[index] += ' data-product_id="'+item.product_id+'" data-product_sku=""';
                productItem[index] += 'aria-label="Add “'+item.product_name+'” to your cart" rel="nofollow">';
                    productItem[index] += 'Add to cart';
                productItem[index] += '</a>';

            productItem[index] += '</li>';
        });
        
        // CLEARS CURRENT PRODUCTS ONLY IF CATEGORY OPTION SELECTED
        if(paged == false) {
			$('.elementor-tabs-content-wrapper').find('.elementor-active').find('.products').empty();
            $('.provider-profile-container .products').empty();
        }
        $('.elementor-tabs-content-wrapper').find('.elementor-active').find('.products').append(productItem);
		$('.provider-profile-container .products').append(productItem);
		
        if( $(document).width() > 992 ) {
            $('.woocommerce ul.products li.product, .woocommerce-page ul.products li.product').css('margin', '0 2.5% 2.2em 0');
        }
    }
    $(document).ready(function(){
        // LOADS PRODUCTS BASED ON CATEGORY 
        $('.wc-product-category').click(function(e){
            product_array=[];
            localStorage.setItem('paged', 2);
			$('.elementor-tabs-content-wrapper').find('.elementor-active').find('.product-load-more').prop('disabled', false);
            
            let product_listing_type = $('.elementor-tabs-wrapper').find('.elementor-active').data('tab');

            $('.wc-product-category').prop('checked', false);
            $(this).prop('checked') ? $(this).prop('checked', false) : $(this).prop('checked', true);
            let id = $(this).data('id');

            let form = new FormData();
            if( id != '' ) {
                form.append( 'category_id', id );
            }
            form.append( 'type', product_listing_type );
            form.append( 'action', 'ajax_product_pagination' );
            ajax_post(ajaxurl, form, false);
        });
    });
    
    // LOADS PRODUCT PAGINATION 
    $('.product-load-more').click(function(){
        product_array=[];
        paged = localStorage.getItem('paged');
		
        let id = $('.wc-product-category').data('id');
        let product_listing_type = $('.elementor-tabs-wrapper').find('.elementor-active').data('tab');
		
        let form = new FormData();
        
        if( id != '' ) {
            form.append( 'category_id', id );
        }
        form.append( 'type', product_listing_type );
        form.append( 'action', 'ajax_product_pagination' );
        form.append( 'paged', paged );
        
        ajax_post(ajaxurl, form, true);
        if(productEmpty == false) {
            paged++; 
        }
        localStorage.setItem('paged', paged); 
		
    });
})(jQuery);