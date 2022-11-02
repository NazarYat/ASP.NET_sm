function OnMouseClickCheckBox( button )
{
    if ( button.attr("value") == "false")
    {
        button.attr("value", true);
        $( `#${button.attr("for")}` ).attr( "value", true );
        button.css( "background-color", `rgb(20, 20, 20)` );
    }
    else
    {
        button.attr("value", false);
        $( `#${button.attr("for")}` ).attr( "value", false );
        button.css( "background-color", `rgb(0, 0, 0)` );
    }
}
function OnMouseEnterAnimationCheckBox( button )
{
    button.css( "box-shadow",
    "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset" );
}
function OnMouseLeftAnimationCheckBox( button )
{
    button.css( "box-shadow",
    "rgba(50, 50, 93, 0) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0) 0px 18px 36px -18px inset" );
}