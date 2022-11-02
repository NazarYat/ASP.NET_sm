function sendContnetForm()
{
    if ( checkElementNameField() ) {
        SendPOSTRequest( new FormData( document.forms.contentElementForm ),
                    () => { 
                        $('#contentElementForm')[0].reset(); 
                        reloadContent();
                    },
                    alert,
                    "../admin/addContentElement"
                );
    }
    else {
        alert( "*Field nema must be filled." );
    }
}
async function contentElementOnMouseEnter( element )
{
    var frames = 10;
    var contnetElementBackground = $( element.children("#contentElementBackground" )[0] );

    var deltaOpacity = 1 / frames;
    var opacity = 0;
    for ( var i = 0; i < frames; i++ )
    {
        opacity += deltaOpacity;
        contnetElementBackground.attr(
            "style",
            `background: linear-gradient(217deg, rgba(147,0,57,${opacity}) 0%, rgba(166,1,22,${opacity}) 26%, rgba(212,0,0,${opacity}) 64%, rgba(232,54,0,${opacity}) 89%, rgba(255,115,0,${opacity}) 100%);`
        );
        await Delay( 1000 / 60 );
    }
}
async function contentElementOnMouseLeft( element )
{
    var frames = 10;
    var contnetElementBackground = $( element.children("#contentElementBackground" )[0] );

    var deltaOpacity = 1 / frames;
    var opacity = 1;
    for ( var i = 0; i < frames; i++ )
    {
        opacity -= deltaOpacity;
        contnetElementBackground.attr(
            "style",
            `background: linear-gradient(217deg, rgba(147,0,57,${opacity}) 0%, rgba(166,1,22,${opacity}) 26%, rgba(212,0,0,${opacity}) 64%, rgba(232,54,0,${opacity}) 89%, rgba(255,115,0,${opacity}) 100%);`
        );
        await Delay( 1000 / 60 );
    }
}
function deleteElement( button )
{
    confirm( `Are you sure want to delete element ${ button.attr( "elementName" ) }` ) ? SendPOSTRequest( "",
                    () => { 
                        reloadContent();
                    },
                    alert,
                    `../admin/deleteContentElement?name=${ button.attr( "elementName" ) }`
                ): {};
}
async function reloadContent()
{
    SendPOSTRequest( null, (content) => {
        $( "#mainDiv" ).html( content );
        turnOnContentElements();
    }, () => {}, "../home/main" );
}
function turnOnContentElements()
{
    var elements = $( ".contentElement" );

    for ( var i = 0; i < elements.length; i++ ) {
        $( elements[i] ).css( "opacity", "1" );
    }
}
function checkElementNameField() {
    var elementNameField = $( "#elementNameField" );

    if ( elementNameField.val().length == 0 ) {
        elementNameField.addClass( warning );
        return false;
    }
    elementNameField.removeClass( "warning" );
    return true;
}