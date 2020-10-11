"use strict";
$("#open-cart").hide();

function myViewModelNav() {
    var self = this;

    //shared variables with the view
    self.cases = ko.observableArray([]);
    self.casesNumber = ko.observable(0);
    //Base on state of client show elements
    if (localStorage.PacketLtr6applicationData) {
        if (JSON.parse(localStorage.PacketLtr6applicationData).token) {
            $("#login-item").hide();
            var payload = jwt_decode(JSON.parse(localStorage.PacketLtr6applicationData).token);
            if (payload.type === 1) {
                $("#open-cart").show();
                $.ajax({
                    type: "GET",
                    url: "/api/fetchCases",
                    headers: {
                        "Content-Type": "application/json",
                        "Cache-Control": "no-cache",
                        "Authorization": "JWT " + JSON.parse(localStorage.PacketLtr6applicationData).token
                    },
                    success: function (data) {
                        self.cases(JSON.parse(data).cases);
                        self.casesNumber(JSON.parse(data).cases.length);
                        console.log(self.casesNumber());
                    }
                });
            } else {
                $("#open-cart").hide();
            }
        } else {
            $("#login-item").show();
        }
    }

}

ko.applyBindings(new myViewModelNav(), document.getElementById("open-cart"));
