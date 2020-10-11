"use strict";
$("#postCaseRegisterForm").hide();
$("#postCaseRegisterFormButtons").hide();
$("#currentCases").hide();
$("#open-cart").hide();
$("#loginClientForm").hide();
$("#loginButtonClient").hide();
$("#forwardButtonClient").hide();
$("#backButtonClient").hide();
$("#logoutClient").hide();
$("#submitPostRequestClient").hide();
$("#postCaseRegisterForm").children().addClass("animated fadeOutLeft").hide();
$("#postCaseRegisterForm").children().first().removeClass("animated fadeOutLeft").addClass("animated fadeInRight").show();
$("#log-in-client").hide();
$("#forgot-password-client").hide();
$("#register-client").hide();
$("#loading-screen-client").hide();
$("#portalRedirectClient").hide();
$("#suggestionsDropDown").hide();
$("#login-item").show();

ko.validation.init({
    registerExtenders: true,
    messagesOnModified: true,
    insertMessages: true,
    parseInputAttributes: true,
    messageTemplate: null
}, true);

ko.validation.rules['mustMatch'] = {
    getValue: function (field) {
        return typeof field === 'function' ? field() : field
    },
    validator: function (value, other) {
        return value === this.getValue(other)
    },
    message: "Passwords must match"
}

ko.validation.rules['checked'] = {
    validator: function (value) {
      console.log(value);
        if (!value) {
            return false;
        }
        return true;
    }
};

var shuffle = function (array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};

var showLoggedInClientDOMElements = function () {
    $("#currentCases").show();
    $("#open-cart").show();
    $("#logoutClient").show();
    $("#portalRedirectClient").show();
    $("#loginButtonClient").hide();
    $("#register-client").hide();
    $("#forgot-password-client").hide();
    $("#loginClientForm").hide();
    $("#login-item").hide();
};

var showRegistrationClientDOMElements = function () {
    $("#postCaseRegisterForm").hide();
    $("#logoutClient").hide();
    $("#portalRedirectClient").hide();
    $("#register-client").hide();
    $("#forgot-password-client").hide();
    $("#currentCases").hide();
    $("#open-cart").hide();
    $("#login-item").show();

    if ($.cookie("registeredClient")) {
        $("#loginClientForm").show();
        $("#loginButtonClient").show();
        $("#forwardButtonClient").hide();
        $("#backButtonClient").hide();
        $("#log-in-client").hide();

        $("#register-client").show();
        $("#forgot-password-client").show();
    } else {
        $("#postCaseRegisterForm").show();
        $("#forwardButtonClient").show();
        $("#loginClientForm").hide();
        $("#loginButtonClient").hide();
        $("#log-in-client").show();

        $("#register-client").hide();
        $("#forgot-password-client").hide();
    }
};

function myViewModelClient() {
    var self = this;

    //shared variables with the view
    self.emailLogin = ko.observable();
    self.passwordLogin = ko.observable();

    self.logout = function () {
        delete localStorage.PacketLtr6applicationData;
        var styleAttribute = "background-image: url('landing_page/assets/images/backgrounds-homepage/Collage-General.jpg');";

        $("#hero").attr("style", styleAttribute);

        $("#open-left-sidebar").show();
        $("#for-solicitors-link").show();
        $("#open-right-sidebar").text("I need a solicitor");
        showRegistrationClientDOMElements();
    };

    self.describeMatter = {
        caseType: ko.observable().extend({
            required: true
        }),
        caseDescription: ko.observable().extend({
            required: true,
            maxLength: 900
        })
    };

    const passwordRegex = /(?=^.{6,30}$)[ -~]+/
    const nameRegex = /(?=^.{2,20}$).+/

    self.personalDetails = {
        firstName: ko.observable().extend({
            required: true, pattern: {
                params: nameRegex,
                message: "First name must be between 2 and 20 characters long."
            }
        }),
        lastName: ko.observable().extend({
            required: true,
            pattern: {
                params: nameRegex,
                message: "Last name must be between 2 and 20 characters long."
            }
        }),
        email: ko.observable().extend({required: true, email: true}),
        password: ko.observable().extend({
            required: true,
            pattern: {
                params: passwordRegex,
                message: "The password must be between 6 and 30 characters and digits."
            }
        }),
        checkTandCs: ko.observable().extend({
            checked: {
                message: "Please confirm that you have read the terms and conditions to continue"
            }
        })
    }
    self.personalDetails.confirmPassword = ko.observable().extend({
        required: true,
        pattern: {
            params: passwordRegex,
            message: "Passwords must match"
        },
        mustMatch: self.personalDetails.password
    })

    var addressRegex = "(?=^.{4,99}$)[ A-Za-z0-9_@.,#&!'&quot;%<>;:/^*$-]*$";

    self.contactDetails = {
        address: ko.observable().extend({
            required: true,
            pattern: {
                params: addressRegex,
                message: "Address must be between 4 and 99 characters."
            }
        }),
        addressLine2: ko.observable().extend({
            required: false,
            pattern: {
                params: addressRegex,
                message: "Address (line 2) must be between 4 and 99 characters."
            }
        }),
        postCode: ko.observable().extend({
            required: true,
            maxLength: 12
        }),
        city: ko.observable().extend({
            required: true,
            pattern: {
                params: "(?=^.{2,70}$)[a-zA-Z0-9\\s-]+",
                message: "City must be between 2 and 70 letters and digits."
            }
        }),
        telephone: ko.observable().extend({
            required: true,
            pattern: {
                params: "(\\+44\\ ?|0)(\\d\\ ?){9,10}",
                message: "Invalid telephone number"
            }
        })
    };

    //navigation init
    self.currentStep = ko.observable(0);
    self.loginClientOpen = function () {
        $("#loginClientForm").show();
        $("#postCaseRegisterForm").hide();
        $("#forwardButtonClient").hide();
        $("#backButtonClient").hide();
        $("#log-in-client").hide();

        $("#register-client").show();
        $("#forgot-password-client").show();
        $("#loginButtonClient").show();
        $("#submitPostRequestClient").hide();
        $("#clientError").text("");
    };

    self.registerClientOpen = function () {
        $(".validationMessage").hide();
        $("#loginClientForm").hide();
        $("#postCaseRegisterForm").show();
        $("#forwardButtonClient").show();
        $("#log-in-client").show();
        $("#forgot-password-client").hide();
        $("#register-client").hide();
        $("#loginButtonClient").hide();
        $("#clientError").text("");
        if (self.currentStep() > 0) {
            $("#backButtonClient").show();
        }
        if (self.currentStep() === 2) {
            $("#forwardButtonClient").hide();
            $("#submitPostRequestClient").show();
        }

        if (self.currentStep() === 4) {
            self.currentStep(0);
            $("#postCaseRegisterForm").children().eq(self.currentStep() - 1).removeClass(" fadeInRight").addClass(" fadeOutLeft").hide();
            $("#postCaseRegisterForm").children().eq(self.currentStep()).removeClass(" fadeOutLeft").addClass(" fadeInRight").show();
        }
    };

    self.cases = ko.observableArray([]);
    //Base on state of client show elements
    if (localStorage.PacketLtr6applicationData) {
        if (JSON.parse(localStorage.PacketLtr6applicationData).token) {
            var payload = jwt_decode(JSON.parse(localStorage.PacketLtr6applicationData).token);
            if (payload.type === 1) {
                showLoggedInClientDOMElements();
                $.ajax({
                    type: "GET",
                    url: "/api/fetchCases",
                    headers: {
                        "Content-Type": "application/json",
                        "Cache-Control": "no-cache",
                        "Authorization": "JWT " + JSON.parse(localStorage.PacketLtr6applicationData).token
                    },
                    success: function (data) {
                        var collageArray = [];

                        self.cases(JSON.parse(data).cases);
                        if (self.cases().length !== 0) {
                            self.cases().forEach(function (theCase) {
                                collageArray.push("Collage-" + theCase.Type + ".jpg");
                            });
                        } else {
                            collageArray.push("Collage-General.jpg");
                        }

                        var shuffledArray = shuffle(collageArray);

                        var styleAttribute = "background-image: url('landing_page/assets/images/backgrounds-homepage/" + shuffledArray[0] + "');";
                        $("#cart-amount").text(self.cases().length);
                        $("#hero").addClass("fadeOut").attr("style", styleAttribute).removeClass("fadeOut").addClass("fadeIn");
                    },
                    error: function (err) {
                        console.log(err);
                    }
                });
                $("#for-solicitors-link").hide();
                $("#open-left-sidebar").hide();
                $("#open-right-sidebar").text("Welcome Back");
            } else if (payload.type === 2) {
                $("#currentCases").hide();
                $("#open-cart").hide();
                showRegistrationClientDOMElements();
            }
        } else {
            showRegistrationClientDOMElements();
        }
    } else {
        showRegistrationClientDOMElements();
    }

    self.portalRedirect = function () {
        $("html").addClass("animated fadeOut");
        location.href = "app#!/app/cases";
    };

    self.changeSectionForward = function (destIdx) {
        if (self.currentStep() === 0) {
            if (ko.validation.group(self.describeMatter)().length === 0) {
                $('#backButtonClient').show();
                self.currentStep(destIdx);
                $("#clientError").text("");
            } else {
                $("#clientError").text("Please complete all the fields and correct all the issues highlighted above.");
            }
        } else if (self.currentStep() === 1) {
            var validationResults = ko.validation.group(self.personalDetails)()
            if (validationResults.length === 0) {
                $.ajax({
                    type: "POST",
                    url: "/api/holdIntermediateDetails",
                    data: {
                        firstName: self.personalDetails.firstName,
                        lastName: self.personalDetails.lastName,
                        email: self.personalDetails.email
                    },
                    error: function (err) {
                        console.log(err);
                    }
                });
                self.currentStep(destIdx);
                $("#clientError").text("");
                $("#submitPostRequestClient").show();
                $("#forwardButtonClient").hide();
            } else {
                $("#clientError").text("Please complete all the fields and correct all the issues highlighted above.");
                ko.validation.group(self.personalDetails).showAllMessages();
            }
        } else if (self.currentStep() === 3) {
            $("#logoutClient").show();
            $("#portalRedirectClient").show();
            $("#clientError").text("");
            window.uetq = window.uetq || [];
            window.uetq.push({ 'ea': 'case posted' });
            ga('send', 'event', 'Submission', 'Click', 'Client Case');
            self.currentStep(destIdx);
        } else {
            self.currentStep(destIdx);
            $("#clientError").text("");
        }

        $("#postCaseRegisterForm").children().eq(self.currentStep() - 1).removeClass(" fadeInRight").addClass(" fadeOutLeft").hide();
        $("#postCaseRegisterForm").children().eq(self.currentStep()).removeClass(" fadeOutLeft").addClass(" fadeInRight").show();

        return true;
    };

    self.changeSectionBack = function (destIdx) {
        if (self.currentStep() === 2) {
            $("#submitPostRequestClient").hide();
            $("#backButtonClient").show();
            $("#forwardButtonClient").show();
        }

        self.currentStep(destIdx);
        $("#clientError").text("");
        if (self.currentStep() === 0) {
            $("#backButtonClient").hide();
        }

        $("#postCaseRegisterForm").children().eq(self.currentStep() + 1).removeClass(" fadeInRight").addClass(" fadeOutLeft").hide();
        $("#postCaseRegisterForm").children().eq(self.currentStep()).removeClass(" fadeOutLeft").addClass(" fadeInRight").show();

        return true;
    };


    self.stepBack = function () {
        if (self.currentStep() > 0) {
            self.changeSectionBack(self.currentStep() - 1);
        }
    };

    self.ceilValue = function (value) {
        return Math.ceil(value);
    };

    self.loginClient = function () {
        $.ajax({
            type: "POST",
            url: "/api/login",
            data: {
                email: self.emailLogin,
                password: self.passwordLogin
            },
            success: function (data) {
                if (data.code === 600) {
                    localStorage.PacketLtr6applicationData = JSON.stringify({
                        token: data.token
                    });
                    var payload = jwt_decode(JSON.parse(localStorage.PacketLtr6applicationData).token);
                    if (payload.type === 2) {
                        delete localStorage.PacketLtr6applicationData;
                        $("#clientError").text(" If you are a Solicitor, please click on the solicitor tab on the sidebar to log in.");
                    } else {
                        showLoggedInClientDOMElements();
                        $.ajax({
                            type: "GET",
                            url: "/api/fetchCases",
                            headers: {
                                "Content-Type": "application/json",
                                "Cache-Control": "no-cache",
                                "Authorization": "JWT " + JSON.parse(localStorage.PacketLtr6applicationData).token
                            },
                            success: function (data) {
                                var collageArray = [];

                                self.cases(JSON.parse(data).cases);
                                if (self.cases().length !== 0) {
                                    self.cases().forEach(function (theCase) {
                                        collageArray.push("Collage-" + theCase.Type + ".jpg");
                                    });
                                } else {
                                    collageArray.push("Collage-General.jpg");
                                }

                                var shuffledArray = shuffle(collageArray);

                                var styleAttribute = "background-image: url('landing_page/assets/images/backgrounds-homepage/" + shuffledArray[0] + "');";

                                $("#open-left-sidebar").hide();
                                $("#for-solicitors-link").hide();
                                $("#open-right-sidebar").text("Welcome Back");

                                $("#hero").addClass("fadeOut").attr("style", styleAttribute).removeClass("fadeOut").addClass("fadeIn");

                            },
                            error: function (err) {
                                console.log(err);
                            }
                        });
                    }
                } else {
                    $("#clientError").text(data.message);
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    };

    function containsPersonalDetails(str) {
        var emailRegex = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}/;
        var telephoneRegex = /(\+44\ ?|0)(\d\ ?){9,10}/;
        return emailRegex.test(str)
            || telephoneRegex.test(str)
    }

    self.stepForward = function () {
        if (self.currentStep() === 0 &&
            containsPersonalDetails(self.describeMatter.caseDescription())) {
            swal({
                title: "Contact details detected",
                text:
                    "Please do not enter your personal details in the case " +
                    "description.\n\n" +
                    "Please remove any phone numbers or email addresses from " +
                    "the description and try again.",
                type: "error"
            })
        } else if (self.currentStep() < 4) {
            self.changeSectionForward(self.currentStep() + 1);
        }
    };

    self.submitPostRequest = function () {
        if (self.currentStep() === 2) {
            if (ko.validation.group(self.contactDetails)().length === 0) {
                $("#log-in-client").hide();

                $("#backButtonClient").hide();
                $("#submitPostRequestClient").hide();
                self.stepForward();
                $.ajax({
                    type: "POST",
                    url: "/api/postCaseAndRegister",
                    data: {
                        Title: " ",
                        Type: self.describeMatter.caseType,
                        Area: 1500,
                        Description: self.describeMatter.caseDescription,
                        Status: 0,
                        firstName: self.personalDetails.firstName,
                        lastName: self.personalDetails.lastName,
                        telephone: self.contactDetails.telephone,
                        address: self.contactDetails.address,
                        addressLine2: self.contactDetails.addressLine2,
                        city: self.contactDetails.city,
                        SRA: "000000",
                        companyName: "",
                        email: self.personalDetails.email,
                        type: 1,
                        password: self.personalDetails.password,
                        postcode: self.contactDetails.postCode,
                        description: "",
                        solicitor: false
                    },
                    success: function (data) {
                        data = JSON.parse(data);
                        if (data.code === 620) {
                            $.ajax({
                                type: "POST",
                                url: "/api/login",
                                data: {
                                    email: self.personalDetails.email,
                                    password: self.personalDetails.password
                                },
                                success: function (data) {
                                    if (data.code === 600) {
                                        var applicationData = { token: data.token };
                                        localStorage.PacketLtr6applicationData =
                                            JSON.stringify(applicationData);
                                        $.cookie("registeredClient", true, {
                                            expires: 2.59 * 1000000000
                                        });
                                        self.stepForward();
                                    } else {
                                        $("#clientError").text(data.message);
                                    }
                                },
                                error: function (err) {
                                    console.log(err);
                                }
                            });
                        } else {
                            $("#log-in-client").show();

                            $("#backButtonClient").show();
                            $("#submitPostRequestClient").show();
                            self.stepBack();
                            $("#clientError").text(data.message);
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    }
                });
            } else {
                $("#clientError").text("Please correct all the issues highlighted on the form.");
            }
        }
    };

    $(document).on("keypress", function (e) {
        if (e.which === 13 && $("body").hasClass("off-canvas-right-sidebar-open") && self.currentStep() < 2 && $("#postCaseRegisterForm").is(":visible")) {
            self.stepForward();
        }

        if (e.which === 13 && $("body").hasClass("off-canvas-right-sidebar-open") && $("#loginClientForm").is(":visible")) {
            self.loginClient();
        }
    });

}

ko.validation.registerExtenders();
ko.applyBindings(new myViewModelClient(), document.getElementById("clientSidebar"));
