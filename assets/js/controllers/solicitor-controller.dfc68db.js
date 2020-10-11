/**
 * Created by Admin on 2/23/2017.
 */
"use strict";
//init all client view elements
var prepareFormsForSolicitor = function () {
    $("#welcomeSection").hide();
    $("#portalRedirect").hide();
    $("#logout").hide();
    $("#suggestionsSolicitorDropDown").hide();

    if ($.cookie("registeredSolicitor")) {
        $("#loginSolicitorForm").show();
        $("#solicitorLoginButton").show();
        $("#registerSolicitorForm").hide();
        $("#log-in").hide();

        $("#register").show();
        $("#forgot-password-solicitor").show();
    } else {
        $("#registerSolicitorForm").show();
        $("#loginSolicitorForm").hide();
        $("#solicitorLoginButton").hide();
        $("#forwardButtonSolicitor").show();
        $("#log-in").show();
        $("#forgot-password-solicitor").hide();
        $("#register").hide();

    }
};

var prepareViewForLoggedInSolicitor = function () {
    $("#no-activity").hide();
    $("#loginSolicitorForm").hide();
    $("#solicitorLoginButton").hide();
    $("#registerSolicitorForm").hide();
    $("#portalRedirect").show();
    $("#logout").show();
    $("#welcomeSection").show();
    $("#log-in").hide();
    $("#forgot-password-solicitor").hide();
    $("#register").hide();
    $("#login-item").hide();
};

$("#loading-screen").hide();
$("#welcomeSection").hide();
$("#loginSolicitorForm").hide();
$("#solicitorLoginButton").hide();
$("#backButtonSolicitor").hide();
$("#submitRegisterSolicitor").hide();
$("#portalRedirect").hide();
$("#logout").hide();
$('#forwardButtonSolicitor').hide();

$("#registerSolicitorForm").children().addClass("animated fadeOutLeft").hide();
$("#registerSolicitorForm").children().first().removeClass("animated fadeOutLeft").addClass("animated fadeInRight").show();

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

function myViewModelSolicitor() {
    var self = this;
    //formFields details

    self.portalRedirect = function () {
        $("html").addClass("animated fadeOut");
        location.href = "app#!/app/dashboard";
        //location.href = "app#!/app/pages/user";
    };

    const passwordRegex = /(?=^.{6,30}$)[ -~]+/
    const nameRegex = /(?=^.{2,20}$).+/

    self.personalDetails = {
        firstName: ko.observable().extend({
            required: true, pattern: {
                params: nameRegex,
                message: "First name must be between 2 and 30 characters long."
            }
        }),
        lastName: ko.observable().extend({
            required: true,
            pattern: {
                params: nameRegex,
                message: "Last name must be between 2 and 30 characters long."
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
        SRA: ko.observable().extend({
            required: true,
            digit: true,
            pattern: {params: "(^[0-9]{1,6}$)|0", message: "The SRA number must have at most 6 digits."}
        }),
        country: ko.observable().extend({
            required: true
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
            minLength: 7,
            maxLength: 15
        })
    };

    self.companyDetails = {
        companyName: ko.observable().extend({
            required: true,
            minLength: 2,
            maxLength: 60

        }),
        description: ko.observable().extend({
            required: true,
            minLength: 10,
            maxLength: 500
        })
    };

    self.categories = ko.observableArray([]);
    self.general = ko.observable(true);
    self.proBonoWord = ko.observable(false);
    self.legalAid = ko.observable(false);
    self.currentStep = ko.observable(0);
    self.testMe = ko.observable(false);

    self.employment = ko.observable(false);
    self.immigration = ko.observable(false);
    self.personalInjury = ko.observable(false);
    self.litigation = ko.observable(false);
    self.property = ko.observable(false);
    self.taxServices = ko.observable(false);
    self.willsAndProbate = ko.observable(false);
    self.businessMatters = ko.observable(false);
    self.intellectualProperty = ko.observable(false);
    self.crimeMotoringOffences = ko.observable(false);
    self.family = ko.observable(false);
    self.debt = ko.observable(false);
    self.corporate = ko.observable(false);

    self.activitylogs = ko.observableArray();

    self.proBono = ko.observable(false);
    self.legalAid = ko.observable(false);

    self.freeServices = ko.observableArray(["ProBono", "LegalAid"]);

    self.isInScotland = function(){
        self.personalDetails.SRA("000000");
        return true;
    };

    self.isInEngland = function(){
        self.personalDetails.SRA(undefined);
        return true;
    };

    self.isInNorthernIreland = function(){
        self.personalDetails.SRA("000000");
        return true;
    };

    self.countryChanged = function () {
        if (self.personalDetails.country() == "England") {
            self.personalDetails.SRA(undefined);
        } else {
            self.personalDetails.SRA("000000");
        }
        return true;
    };

    //shared variables with the view for login
    self.loginDetails = {
        emailSolicitorLogin: ko.observable().extend({required: true, email: true}),
        passwordSolicitorLogin: ko.observable().extend({
            required: true,
            pattern: {
                params: /(?=^.{6,30}$)[ -~]+/,
                message: "The password must be between 6 and 20 characters and digits."
            }
        })
    };

    self.checkClass = function (activity) {
        if (activity == "interested") {
            return "timeline-item warning";
        }
        else if (activity == "not interested") {
            return "timeline-item danger";
        }
        else if (activity == "bid") {
            return "timeline-item info";
        }
        else if (activity == "accepted") {
            return "timeline-item success";
        }
        else if (activity == "asked for info") {
            return "timeline-item primary";
        }
    };

    if (localStorage.PacketLtr6applicationData) {
        if (JSON.parse(localStorage.PacketLtr6applicationData).token) {
            var payload = jwt_decode(JSON.parse(localStorage.PacketLtr6applicationData).token);
            if (payload.type === 2) {
                prepareViewForLoggedInSolicitor();
                $.ajax({
                    type: "GET",
                    url: "/api/fetchActivityLogs",
                    data: {
                        period: 30
                    },
                    headers: {
                        "Content-Type": "application/json",
                        "Cache-Control": "no-cache",
                        "Authorization": "JWT " + JSON.parse(localStorage.PacketLtr6applicationData).token
                    },
                    success: function (data) {
                        data = JSON.parse(data);
                        if (data.activities.length === 0) {
                            $("#no-activity").show();
                        }
                        for (var index = 0; index < data.activities.length; index++) {
                            if (data.activities[index].Action === 'bidded') {
                                data.activities[index].Action = 'bid';
                            }
                        }
                        self.activitylogs(data.activities);
                    }
                });
                $("#open-right-sidebar").hide();
                $("#open-left-sidebar").text("Welcome Back");
            } else if (payload.type === 1) {

                prepareFormsForSolicitor();
            }
        } else {
            prepareFormsForSolicitor();
        }
    } else {
        prepareFormsForSolicitor();
    }

    self.logout = function () {
        delete localStorage.PacketLtr6applicationData;

        $("#open-right-sidebar").show();
        $("#open-left-sidebar").text("I am a solicitor");
        $("#login-item").show();

        prepareFormsForSolicitor();
    };

    self.logInOpen = function () {
        $("#registerSolicitorForm").hide();
        $("#loginSolicitorForm").show();
        $("#forwardButtonSolicitor").hide();
        $("#backButtonSolicitor").hide();
        $("#solicitorLoginButton").show();
        $("#log-in").hide();
        $("#forgot-password-solicitor").show();
        $("#solicitorError").text("");
        $("#register").show();
    };

    self.registerOpen = function () {
        $("#registerSolicitorForm").show();
        $("#loginSolicitorForm").hide();
        $("#forwardButtonSolicitor").show();
        $("#backButtonSolicitor").hide();
        $("#solicitorLoginButton").hide();
        $("#log-in").show();
        $("#forgot-password-solicitor").hide();
        $("#solicitorError").text("");
        $("#register").hide();
    };

    self.loginSolicitor = function () {
        if (ko.validation.group(self.loginDetails)().length === 0) {
            $.ajax({
                type: "POST",
                url: "/api/login",
                data: {
                    email: self.loginDetails.emailSolicitorLogin,
                    password: self.loginDetails.passwordSolicitorLogin
                },
                success: function (data) {
                    if (data.code === 600) {
                        var applicationData = { token: data.token };
                        localStorage.PacketLtr6applicationData = JSON.stringify(applicationData);

                        var payload = jwt_decode(JSON.parse(localStorage.PacketLtr6applicationData).token);
                        if (payload.type === 1) {
                            delete localStorage.PacketLtr6applicationData;
                            $("#solicitorError").text("If you are a Client, please click on the client tab on the sidebar to log in.");
                        } else {
                            $("#loginSolicitorForm").hide();
                            $("#solicitorLoginButton").hide();
                            $("#loading-screen").show();
                            $("#loading-screen").hide();
                            prepareViewForLoggedInSolicitor();
                            $.ajax({
                                type: "GET",
                                url: "/api/fetchActivityLogs",
                                data: {
                                    period: 30
                                },
                                headers: {
                                    "Content-Type": "application/json",
                                    "Cache-Control": "no-cache",
                                    "Authorization": "JWT " + JSON.parse(localStorage.PacketLtr6applicationData).token
                                },
                                success: function (data) {
                                    data = JSON.parse(data);
                                    if (data.activities.length === 0) {
                                        $("#no-activity").show();
                                    }
                                    for (var index = 0; index < data.activities.length; index++) {
                                        if (data.activities[index].Action === 'bidded') {
                                            data.activities[index].Action = 'bid';
                                        }
                                    }
                                    self.activitylogs(data.activities);
                                }
                            });

                            $("#open-right-sidebar").hide();
                            $("#open-left-sidebar").text("Welcome Back");
                        }
                    } else {
                        $("#solicitorError").text(data.message);
                    }
                }
            });
        } else {
            $("#solicitorError").text("Please fill the form with the required data.");
        }
    };

    self.registerSolicitor = function () {
        var services = [
            self.employment(),
            self.immigration(),
            self.personalInjury(),
            self.litigation(),
            self.property(),
            self.taxServices(),
            self.willsAndProbate(),
            self.businessMatters(),
            self.crimeMotoringOffences(),
            self.family(),
            self.debt(),
            self.corporate(),
            self.general(),
            self.intellectualProperty()
        ];
        self.stepForward();
        var country = self.personalDetails.country();
        var countries = {
            England: country == "England",
            Scotland: country == "Scotland",
            NorthernIreland: country == "NorthernIreland",
        };

        var url = "https://api.postcodes.io/postcodes/" + self.contactDetails.postCode() + "/validate";
        $.ajax({
            url: url,
            type: "GET",
            success: function (data) {
                if (data.result === false) {
                    self.stepBack();
                    self.stepBack();
                    self.stepBack();
                    self.stepBack();
                    $("#solicitorError").text("Postcode is not correct, please try again using a valid postcode.");
                } else {
                    $.ajax({
                        type: "POST",
                        url: "/api/register",
                        contentType: "application/json",
                        data: JSON.stringify({
                            firstName: self.personalDetails.firstName(),
                            lastName: self.personalDetails.lastName(),
                            telephone: self.contactDetails.telephone(),
                            address: self.contactDetails.address(),
                            addressLine2: self.contactDetails.addressLine2(),
                            city: self.contactDetails.city(),
                            SRA: self.personalDetails.SRA(),
                            companyName: self.companyDetails.companyName(),
                            email: self.personalDetails.email(),
                            type: 2,
                            password: self.personalDetails.password(),
                            postcode: self.contactDetails.postCode(),
                            categories: services,
                            countries: countries,
                            description: self.companyDetails.description(),
                            solicitor: true,
                            ProBono: self.proBono(),
                            LegalAid: self.legalAid()
                        }),
                        success: function (data) {
                            self.stepForward();
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
                                            localStorage.PacketLtr6applicationData = JSON.stringify({
                                                token: data.token
                                            });

                                            $.cookie("registeredSolicitor", true, {
                                                expires: 2.59 * 1000000000
                                            });
                                            self.stepForward();
                                        } else {
                                            $("#solicitorError").text(data.message + " Please contact support for further details.");
                                        }
                                    },
                                    error: function (err) {
                                        console.log(err);
                                    }
                                });
                            } else {
                                $("#solicitorError").text(data.message);
                            }
                        },
                        error: function (err) {
                            console.log(err);
                        }
                    });
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    };

    //Logic of registration forms
    self.stepForward = function () {
        if (self.currentStep() < 6) {
            self.changeSectionForward(self.currentStep() + 1);
        }
    };

    self.stepBack = function () {
        if (self.currentStep() > 0) {
            self.changeSectionBack(self.currentStep() - 1);
        }
    };

    self.changeSectionForward = function (destIdx) {
        if (self.currentStep() === 0) {
            if (ko.validation.group(self.personalDetails)().length === 0) {
                $('#backButtonSolicitor').show();
                self.currentStep(destIdx);
                $("#solicitorError").text("");
            } else {
                $("#solicitorError").text("Please complete all the fields and correct all the issues highlighted above.");
            }
        } else if (self.currentStep() === 1) {
            if (ko.validation.group(self.contactDetails)().length === 0) {
                self.currentStep(destIdx);
                $("#solicitorError").text("");
            } else {
                $("#solicitorError").text("Please complete all the fields and correct all the issues highlighted above.");
            }
        } else if (self.currentStep() === 2) {
            if (ko.validation.group(self.companyDetails)().length === 0) {
                self.currentStep(destIdx);
                $("#solicitorError").text("");
            } else {
                $("#solicitorError").text("Please complete all the fields and correct all the issues highlighted above.");
            }
        } else {
            self.currentStep(destIdx);
            $("#solicitorError").text("");
        }

        if (self.currentStep() === 6) {
            $("#portalRedirect").toggle();
            $("#logout").toggle();
            $("#backButtonSolicitor").toggle();
            $("#submitRegisterSolicitor").toggle();
            $("#log-in").hide();

        }

        if (self.currentStep() === 4) {
            $("#forwardButtonSolicitor").toggle();
            $("#submitRegisterSolicitor").toggle();
        }

        $("#registerSolicitorForm").children().eq(self.currentStep() - 1).removeClass(" fadeInRight").addClass(" fadeOutLeft").hide();
        $("#registerSolicitorForm").children().eq(self.currentStep()).removeClass(" fadeOutLeft").addClass(" fadeInRight").show();

        return true;
    };

    self.changeSectionBack = function (destIdx) {
        if (self.currentStep() === 4) {
            $("#forwardButtonSolicitor").toggle();
            $("#submitRegisterSolicitor").hide();
        }

        self.currentStep(destIdx);
        $("#solicitorError").text("");

        if (self.currentStep() === 0) {
            $("#backButtonSolicitor").toggle();
        }

        $("#registerSolicitorForm").children().eq(self.currentStep() + 1).removeClass(" fadeInRight").addClass(" fadeOutLeft").hide();
        $("#registerSolicitorForm").children().eq(self.currentStep()).removeClass(" fadeOutLeft").addClass(" fadeInRight").show();

        return true;
    };


    $(document).on("keypress", function (e) {
        if (e.which === 13 && $("body").hasClass("off-canvas-left-sidebar-open") && self.currentStep() < 4 && $("#registerSolicitorForm").is(":visible")) {
            self.stepForward();
        }

        if (e.which === 13 && $("body").hasClass("off-canvas-left-sidebar-open") && $("#loginSolicitorForm").is(":visible")) {
            self.loginSolicitor();
        }
    });

}

ko.validation.registerExtenders();
ko.applyBindings(new myViewModelSolicitor(), document.getElementById("solicitorSidebar"));
