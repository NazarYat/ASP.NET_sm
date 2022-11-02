function loginButtonClick()
{
    if ( checkLoginEmail() & checkPassword() )
    {
        lockButtons();

        SendPOSTRequest( new FormData( document.forms.login), (content) => {
            $( "#accountName" ).html( $("#emailField").val() );
            loadSite(content);
            unLockButtons();
        }, (responseMessage) => { 
            showMessage( responseMessage );
            $( "#emailField" ).removeClass( "correct" );
            $( "#emailField" ).addClass( "warning" );
            $( "#passwordField" ).addClass( "warning" );
            unLockButtons();
        } );
    }
}
function checkLoginEmail()
{
    var emailField = $( "#emailField" );

    if ( emailVerify( emailField.val() ) )
    {
        emailField.removeClass( "warning" );
        emailField.addClass( "correct" );
        showMessage( "" );
        return true;
    }
    else
    {
        emailField.removeClass( "correct" );
        emailField.addClass( "warning" );
        showMessage( "*incorrect email address" );
        return false;
    }
}
function emailVerify( email )
{
    return email
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ) != null;
}
function checkPassword()
{
    var passwordField = $( "#passwordField" );

    if ( passwordField.val().length == 0 )
    {
        passwordField.addClass( "warning" );
        showMessage( "*all fields must be fill" );
        return false;
    }
    else 
    {
        passwordField.removeClass( "warning" );
        showMessage( "" );
        return true;
    }
}
function guestButtonClick()
{
    lockButtons();

    SendPOSTRequest( new FormData( document.forms.loginGuest), (content) => {
        $( "#accountName" ).html( "Guest" );
        $( "#registerPageButton" ).css( "visibility", "visible" );
        $( "#deleteAccountButton" ).remove();
        $( "#exitButton" ).remove();
        loadSite(content);
        unLockButtons();
    }, ( responseMessage ) => {
        showMessage( responseMessage );
        unLockButtons();
    } );
}
function loadSite()
{
    loadingAnimation();
    SendPOSTRequest( null, replaceContent, () => {}, "../home/main" );
}
async function replaceContent( content ) 
{
    await Delay( 1000 );
    $( "#mainDiv" ).html( "" );
    await maindivWidthAnimation();
    $( "#buffer" ).html( content );
    openMainDivAnimation();
    await contentElementsAnimation();

}
async function contentElementsAnimation()
{
    var elements = $( ".contentElement" );
    var elementIndexer = 0;
    var mainDiv = $( "#mainDiv" );
    var contentElementHeight = (elements.length > 0) ? 100 : 0;

    while ( elements.length != elementIndexer )
    {
        if ( ( contentElementHeight * ( elementIndexer + 1 ) ) < mainDiv.height() )
        {
            contentElementFadeAnimation( $( elements[ elementIndexer ] ) );
            elementIndexer++;
        }
        await Delay( 1000 / 60 );
    }
}
async function contentElementFadeAnimation( element )
{
    var mainDiv = $( "#mainDiv" );
    mainDiv.append( element );
    var deltaOpacity = 1 / 30;

    for ( var i = 0; i < 30; i++ )
    {
        element.css( "opacity", deltaOpacity * ( i + 1 ) );
        await Delay( 1000 / 60 );
    }
}
async function openMainDivAnimation()
{
    var contentElements = $( ".contentElement" );
    var contentElementHeight = contentElements.length > 0 ? 155 : 0;
    var contentHeight = contentElementHeight * contentElements.length;
    var mainDiv = $( "#mainDiv" );
    var startHeight = mainDiv.height();
    var endHeight;

    if ( $( window ).height() - 50 > contentHeight )
    {
        endHeight = $( window ).height() - mainDiv.css( "margin-top" ).replace( 'px', '' ) - 50;
    }
    else {
        endHeight = contentHeight;
    }
    var heightDelta = ( startHeight - endHeight ) / 30;
    for ( var i = 0; i < 30; i++ )
    {
        mainDiv.height( -1 * heightDelta * ( 1 + i ) + 'px' );
        await Delay( 1000 / 60 );
    }
}
async function maindivWidthAnimation()
{
    var mainDiv = $( "#mainDiv" );
    var startWidth = mainDiv.width();
    var startHeight = mainDiv.height();
    var startMarginTop = mainDiv.css( "margin-top" ).replace( 'px', '' );

    for ( var i = 0; i < 35; i++ )
    {
        mainDiv.width( startWidth * (1 + ( i + 1 ) * ((1.99)/35) ) + 'px' );
        mainDiv.height( startHeight * (1 + ( i + 1 ) * ((-0.99)/35) ) + 'px' );
        mainDiv.css( "margin-left", `calc( ( 100% - ${mainDiv.width()}px )/2 )` );
        mainDiv.css( "margin-top", startMarginTop * (1 + ( i + 1 ) * ((-0.5)/35) ) + 'px' );

        await Delay( 1000 / 60 );
    }
}
async function loadingAnimation()
{
    var mainDiv = $( "#mainDiv" );
    var height = mainDiv.height();
    var width = mainDiv.width();
    mainDiv.html( "" );
    mainDiv.height( height );
    mainDiv.width( width );

    await mainDivAnimation();

    var loadingCircle = $( "#loadingCircle" );
    mainDiv.html( loadingCircle );

    await loadingCircleAnimation();
}
async function loadingCircleAnimation()
{
    rotateLoadingCircle();

    var img = $( "#loadingCircle" );
    img.height( 50 );
    img.width( 50 );
    img.css( "margin-top", `calc( ( 100% - ${ img.height() }px ) / 2 )` );
    img.css( "margin-left", `calc( ( 100% - ${ img.width() }px ) / 2 )` );
    img.css( "opacity", 0 );

    for( var i = 0; i < 15; i++ ) {
        var opacity = (i + 1) * (1 / 15);
        img.css( "opacity", opacity );

        await Delay( 1000 / 60 );
    }
}
var rotateCircle = false;
async function rotateLoadingCircle()
{
    rotateCircle = true;
    while( rotateCircle )
    {
        for ( var i = 0; i < 60; i++ )
        {
            var angle = (360 / 60) * -i;

            $( "#loadingCircle" ).css({
                "-webkit-transform": `rotate(${ angle }deg)`,
                "-moz-transform": `rotate(${ angle }deg)`,
                "transform": `rotate(${ angle }deg)` /* For modern browsers(CSS3)  */
            });

            await Delay( 1000 / 60 );
        }
    }
}
async function mainDivAnimation()
{
    var mainDiv = $( "#mainDiv" );
    var heightDelta = ( mainDiv.height() - mainDiv.width() ) / 30;
    for ( var i = 0; i < 30; i++ ) {
        var height = mainDiv.height() - heightDelta;
        mainDiv.height( height );

        await Delay( 1000 / 60 );
    }
}
function showMessage( message )
{
    $("#messageBox").html( message );
}
async function openMenuAnimation() {
    if ( $( "#accountName" ).html().length > 0 ) {
        var menuCase = $( "#menuCase" );
        var buttons = $( ".menuButton" );
        var frames = 5;

        menuCase.css( "height", "0" );
        for ( var i = 0; i < buttons.length; i++ ) {
            $( buttons[i] ).css( "opacity", `0` );
        }

        for ( var i = 0; i < frames; i++ ) {
            for ( var j = 0; j < buttons.length; j++ ) {
                $( buttons[j] ).css( "opacity", `${(100 / frames * ( i + 1 )) / 100 }` );
            }

            menuCase.css( "height", `${ 100 / frames * ( i + 1 ) }%` );
            await Delay( 1000 / 60 );
        }
    }
}
async function closeMenuAnimation() {
    if ( $( "#accountName" ).html().length > 0 ) {
        var menuCase = $( "#menuCase" );
        var buttons = $( ".menuButton" );
        var frames = 5;

        menuCase.css( "opacity", "1" );
        for ( var i = 0; i < buttons.length; i++ ) {
            $( buttons[i] ).css( "opacity", `1` );
        }

        for ( var i = 0; i < frames; i++ ) {

            for ( var j = 0; j < buttons.length; j++ ) {
                $( buttons[j] ).css( "opacity", `${(100 - 100 / frames * ( i + 1 )) / 100 }` );
            }

            menuCase.css( "height", `${100 - 100 / frames * ( i + 1 ) }%` );
            await Delay( 1000 / 60 );
        }
    }
}
function exit() {
    SendPOSTRequest( null, () => {
    location.reload();
    }, alert );
}
function deleteAccount() {
    if ( confirm( "Are you sure want to delete account?" ) )
    SendPOSTRequest( null, () => {
        location.reload();
    }, alert, `../home/deleteAccount?email=${ $( "#accountName" ).html() }` );
}