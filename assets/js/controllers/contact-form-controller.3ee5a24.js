/**
 * Created by Admin on 3/1/2017.
 */
$("#firstName").on("change paste keyup", function(){
    $("#lastName").removeClass("fadeOut").addClass("fadeIn");
});

$("#lastName").on("change paste keyup", function(){
    $("#email").removeClass("fadeOut").addClass("fadeIn");
});

$("#email").on("change paste keyup", function(){
    $("#telephone").removeClass("fadeOut").addClass("fadeIn");
});

$("#telephone").on("change paste keyup", function(){
    $("#subject").removeClass("fadeOut").addClass("fadeIn");
});


$("#subject").on("change paste keyup", function(){
    $("#message").removeClass("fadeOut").addClass("fadeIn");
});

