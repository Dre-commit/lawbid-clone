window.addEventListener('load', function () {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var form = document.getElementById('virtualPAContactForm');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === false) {
            var feedback = document.getElementsByClassName('invalid-feedback')
            for (var i = 0; i < feedback.length; ++i) {
                feedback[i].classList.remove('hide');
            }
        } else {
            sendContactEmail();
        }
        form.classList.add('was-validated');
        return false;
    }, false);
}, false);

function sendContactEmail() {
    var postData = $('#virtualPAContactForm').serialize();
    $.post('https://formspree.io/info@lawbid.co.uk', postData)
        .done(function (data) {
            $('#virtualPAContactSuccess').addClass('in');
        })
        .fail(function () {
            $('#virtualPAContactFail').addClass('in');
        })
        .always(function () {
            $('#virtualPAContactForm').removeClass('in');
        });
}