# Goliath polymap

Draw nice polygon on a google map

## Required

### Google Map API key

You need to have a [Google map API key](https://developers.google.com/maps/documentation/javascript/get-api-key)

And you need to add it to your wp-config.php this way :

```
define( 'GOOGLE_MAP_API', 'AIzaSy*******************NZfs' );
```

## Filters

### gpm/post-type

To add the metabox on your custom post type you can use the filter `gpm/post-type`. Keep in mind you need to return an array.

```
// Example to add polymap metabox to a custom post type named "operation"
add_filter( 'gpm/post-type', function(){
    return array( 'operation' );
});
```
