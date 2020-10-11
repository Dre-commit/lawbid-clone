$(document).ready(function () {
    $("a[href*=contactForm]").on("click", function () {
        var subject = decodeURI($(this).data("autofill-subject"));
        var body = decodeURI($(this).data("autofill-body"));
        $("#virtualPASubjectInput").val(subject);
        $("#virtualPAMessageText").val(body);
    });

    $("form#virtualPAContactForm").on("submit", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var form = $(this);
        var url = form.attr("action");
        var data = form.serialize();
        $.ajax({
            method: "POST",
            url: url,
            data: data
        }).then(function (data) {
            $("#virtualPAContactSuccess").addClass("show");
        });
        form.addClass("was-validated");
    });
});
