<?php
/*
Plugin Name: Goliath Polymap
Description: Draw nice polygon on a google map
Version: 1.0
Author: Studio Goliath
Author URI: http://www.studio-goliath.com
*/


class Goliath_Polymap{

    private $post_type;


    public function __construct() {

        $this->post_type = apply_filters( 'gpm/post-type', array( 'post' ) );

        foreach ( $this->post_type as $post_type ){

            add_action( "add_meta_boxes_{$post_type}", array( $this,'register_meta_box' ) );

            add_action( "save_post_{$post_type}", array( $this, 'save_meta_box' ) );
        }

        add_action( 'admin_enqueue_scripts', array( $this, 'add_admin_scripts' ) );

    }

    public function register_meta_box() {

        add_meta_box( 'gpm_map_metabox', __( 'Generate Polygon', 'goliath-map-kml' ), array( $this, 'display_map_metabox' ) );

    }


    /**
     * Meta box display callback.
     *
     * @param WP_Post $post Current post object.
     */
    public function display_map_metabox( $post ) {

        $path = get_post_meta( $post->ID, 'gpm-path', true );

        wp_nonce_field( 'gpm-metabox-save', 'gpm-metabox' );

        ?>
        <div id="goliath-map-polygon"></div>

        <table class="form-table">
            <tr>
                <th><label><?php _e('Polygon coord'); ?></label></th>
                <td><textarea name='gpm-path' class="large-text" rows="3"><?php echo $path ?></textarea></td>
            </tr>
        </table>

        <?php
    }

    public function save_meta_box( $post_ID ){

        if ( isset( $_POST['gpm-metabox'] ) &&
             wp_verify_nonce( $_POST['gpm-metabox'], 'gpm-metabox-save' ) &&
             current_user_can( 'edit_post', $post_ID ) ) {

            if( isset( $_POST['gpm-path'] ) ){

                $path = sanitize_text_field( $_POST['gpm-path'] );
                update_post_meta( $post_ID,'gpm-path', $path );
            }

        }
    }

    public function add_admin_scripts( $hook ){

        global $post;

        if ( $hook == 'post-new.php' || $hook == 'post.php' ) {

            if ( in_array( $post->post_type, $this->post_type ) ){

                wp_enqueue_script(  'gpm-admin-script', plugins_url( 'js/admin-polymap.js', __FILE__ ), array(), '1.0' );

                wp_localize_script( 'gpm-admin-script', 'gpm', array(
                    'googleApiKey'   => GOOGLE_MAP_API,
                ));
            }
        }
    }
}



add_action( 'admin_init', function(){ new Goliath_Polymap(); } );