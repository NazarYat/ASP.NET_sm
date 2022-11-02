async function OnMouseEnterAnimation( button )
{
    //console.log( "mouse enter" );
    button.attr("stop", false);
    var color = 0;
    for ( var i = 0; i < 50 & button.attr("stop") != "true"; i++ )
    {
        color += 0.4;
        button.css( "background-color", `rgb(${color}, ${color}, ${color})` );
        await Delay( 2 );
    }
    button.attr("stop", false);
}
function OnMouseLeftAnimation( button )
{
    button.attr("stop", true);
    button.css( "background-color", `rgb(${0}, ${0}, ${0})` );
    button.css( "box-shadow",
    "rgba(50, 50, 93, 0) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0) 0px 18px 36px -18px inset" );
}

function OnMouseDown( button )
{
    button.css( "box-shadow",
    "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset" );
}
function OnMouseUp( button )
{
    console.log( "mouse up" );
    button.css( "box-shadow",
    "rgba(50, 50, 93, 0) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0) 0px 18px 36px -18px inset" );
}
function lockButtons()
{
    var buttons = $( "button" );

    for ( var i = 0; i < buttons.length; i++ )
    {
        $( buttons[i] ).prop('disabled', true);
    }
}
function unLockButtons()
{
    var buttons = $( "button" );

    for ( var i = 0; i < buttons.length; i++ )
    {
        $( buttons[i] ).prop('disabled', false);
    }
}