
$( document ).ready(function() {
    
    var scrOn = "#roomRender";

    $(".nav-link").click(function(){
        let selectedScreen = $(this).attr('data-screen');

        if(selectedScreen){

            selectedScreen='#'+selectedScreen;
            console.log("Home Value : "+selectedScreen);
            $(".nav-link").parent().removeClass("active");
            $(this).parent().addClass("active");
            $(scrOn).removeClass("d-flex").addClass("d-none");
            $(selectedScreen).addClass("d-flex").removeClass("d-none");
            scrOn = selectedScreen;

        }
    });

});