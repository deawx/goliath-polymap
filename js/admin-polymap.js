/**
 * Created by goliath on 10/10/2016.
 */


ready( function(){

    var poly, gmap;
    var mapElement = document.getElementById('goliath-map-polygon');
    var textarea = document.querySelector( 'textarea[name="gpm-path"]');

    // Loader la carte
    var loadGoogleMaps = function(){

        var script_tag = document.createElement('script');
        script_tag.setAttribute("type","text/javascript");
        script_tag.setAttribute("src","http://maps.google.com/maps/api/js?callback=gmapInitialize&key=" + gpm.googleApiKey );
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
    };

    window.gmapInitialize = function(){

        mapElement.style.height = '70vh';

        var mapOptions = {
            zoom: 12,
            center: new google.maps.LatLng( '46.586446', '1.522820' ),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            streetViewControl: false,
        };
        gmap = new google.maps.Map(mapElement,mapOptions);

        var poplygonArgs = {
            strokeColor: '#ccc',
            strokeOpacity: 1.0,
            strokeWeight: 1,
            editable: true,
        };

        if( textarea.value != '' ){

            var savedPath = '';
            try{
                savedPath = JSON.parse( textarea.value );
            } catch (e) {
                return;
            }

            poplygonArgs.path = savedPath;
        }

        poly = new google.maps.Polygon( poplygonArgs );

        poly.setMap( gmap );
        var path = poly.getPath();

        poly.addListener('rightclick', function(e) {

            if ( e.vertex != undefined) {
                path.removeAt( e.vertex );
            }

        } );

        gmap.addListener('click', function( e ){
            path.push( e.latLng );
        } );

        google.maps.event.addListener( path, 'insert_at', gpmSavePolygonPath );
        google.maps.event.addListener( path, 'remove_at', gpmSavePolygonPath );
        google.maps.event.addListener( path, 'set_at', gpmSavePolygonPath );
    };

    window.gpmSavePolygonPath = function(){

        var path = poly.getPath();


        var textPath = '[';
        for (var i =0; i < path.getLength(); i++) {
            var xy = path.getAt(i);
            textPath += '{"lat":' + xy.lat() + ',"lng":' + xy.lng() + '},';
        }
        textPath = textPath.slice(0, -1);
        textPath += ']';

        textarea.value = textPath;
    };

    if( typeof mapElement != 'undefined' ){

        // If ACF check for the google map field
        if( typeof acf == 'object' ){

            acf.add_action('load', function( $el ){

                // Only execute the init function if there's a google map on the page
                if( acf.fields.google_map.map ){

                    // execute the init function
                    gmapInitialize();
                } else {

                    loadGoogleMaps();

                }

            });

        } else if( typeof google === 'object' && typeof google.maps === 'object' ){

            gmapInitialize();

        } else {

           loadGoogleMaps();

        }

    }

});

function ready(fn) {
    if (document.readyState != 'loading'){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}