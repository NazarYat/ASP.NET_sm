function registerButtonClick()
{
    if ( checkLoginEmail() & passwordScanner() & checkSecondPassword() )
    {
        lockButtons();

        SendPOSTRequest( new FormData( document.forms.login), () => {
            location = "../";
        }, ( responseMessage ) => { 
            showMessage( responseMessage ); 
            unLockButtons();
        });
    }
}
function checkLoginEmail()
{
    var emailField = $( "#emailField" );

    if ( emailVerify( emailField.val() ) )
    {
        emailField.addClass( "correct" );
        emailField.removeClass( "warning" );
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
        return true;
    }
}
function checkSecondPassword()
{
    var passwordField = $( "#passwordField" );
    var secondPasswordField = $( "#repeatPasswordField" );

    if ( passwordField.val() != secondPasswordField.val() | secondPasswordField.val().length == 0 )
    {
        secondPasswordField.removeClass( "correct" );
        secondPasswordField.addClass( "warning" );
        showMessage( "*passwords must conside" );
        return false;
    }
    else 
    {
        secondPasswordField.removeClass( "warning" );
        secondPasswordField.addClass( "correct" );
        showMessage( "" );
        return true;
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
function passwordScanner()
{
    var passwordField = $( "#passwordField" );
    passwordField.removeClass( "correct" );
    passwordField.removeClass( "warning" );

    var password = passwordField.val();
    var haveSpecificSymbol = false;
    var haveUppercaseAndLowercase = false;
    var haveNumber = false;
    for ( var i = 0; i < password.length; i++ ) 
    {
        if ( ( password.charCodeAt(i) >= 65 & password.charCodeAt(i) <= 90 ) || ( password.charCodeAt(i) >= 97 & password.charCodeAt(i) <= 122 ) )
        {
            haveUppercaseAndLowercase = true;
        }
        if ( password.charCodeAt(i) >= 33 & password.charCodeAt(i) <= 46 )
        {
            haveSpecificSymbol = true;
        }
        if ( password.charCodeAt(i) >= 48 & password.charCodeAt(i) <= 57 )
        {
            haveNumber = true;
        }
    }
    if ( password.length < 8 | password.length > 20 )
    {
        $( "#passwordField" ).addClass( "warning" );
        showMessage("*password must have length 8 - 20 symbols.");
        return false;
    }
    else if ( !haveUppercaseAndLowercase )
    {
        $( "#passwordField" ).addClass( "warning" );
        showMessage("*password must have at lest 1 letter.");
        return false;
    }
    else if ( !haveNumber )
    {
        $( "#passwordField" ).addClass( "warning" );
        showMessage("*password must have at lest 1 number.");
        return false;
    }
    else if ( !haveSpecificSymbol )
    {
        $( "#passwordField" ).addClass( "warning" );
        showMessage("*password must have at lest 1 specific symbol.");
        return false;
    }
    else 
    {
        $( "#passwordField" ).addClass( "correct" );
        showMessage( "" );
        return true;
    }
}
function checkEmail( email )
{
    SendPOSTRequest( "", () => {
        $( "#emailField" ).removeClass( "warning" );
        $( "#emailField" ).addClass( "correct" );
    }, () => {
            $( "#emailField" ).removeClass( "correct" );
            $( "#emailField" ).addClass( "warning" ); 
        }, 
    `../email/verify/?email=${email}` );
}