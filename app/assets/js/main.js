var app = angular.module('app', ['packet', 'ngCookies']);


//Attach authentication header to requests
app.config(['$httpProvider', 'jwtOptionsProvider',
    function ($httpProvider, jwtOptionsProvider) {

        //If he is not authenticated push him to log-in
        jwtOptionsProvider.config({
            unauthenticatedRedirector: ['$state', function ($state) {
                $state.go('login.signin');
            }]
        });

        //Attach token to the header of each $http request [if there is any token]
        $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function ($q, $location, $localStorage) {
            return {
                'request': function (config) {
                    config.headers = config.headers || {};
                    if ($localStorage.applicationData.token) {
                        config.headers.Authorization = "JWT " + $localStorage.applicationData.token;
                    }
                    return config;
                },
                'responseError': function (response) {
                    if (response.status === 401 || response.status === 403) {
                        $location.path('/');
                    }
                    return $q.reject(response);
                }
            };
        }]);
    }]);

//When application is refreshed I need to check if token is valid and if is not token will be deleted
app.run(['$rootScope', '$location', '$state', '$timeout', 'userService', '$stateParams', 'caseService', 'SweetAlert', '$cookies', 'tokenManager', '$localStorage', '$http',
    function ($rootScope, $location, $state, $timeout, userService, $stateParams, caseService, SweetAlert, $cookies, tokenManager, $localStorage, $http) {
        tokenManager.checkAuthOnRefresh();
        if($localStorage.applicationData == undefined){
            $localStorage.applicationData = {};
        }
        $rootScope.$on('tokenHasExpired', function () {
            delete $localStorage.applicationData.token;
            $http.defaults.headers.common.Authorization = '';
            $state.go('login.signin');
        });
    }]);

//When application is opened token expiration date is refreshed
app.run(['$rootScope', '$location', '$state', '$timeout', 'userService', '$stateParams', 'caseService', 'SweetAlert', 'jwtHelper', '$localStorage', 'tokenManager', '$http',
    function ($rootScope, $location, $state, $timeout, userService, $stateParams, caseService, SweetAlert, jwtHelper, $localStorage, tokenManager, $http) {
        if ($localStorage.applicationData.token) {
            tokenManager.refreshToken().then(function (data) {
                data = data.data;

                if (data.code === 600) {
                    $localStorage.applicationData.token = data.token;
                    $http.defaults.headers.common.Authorization = 'JWT ' + data.token;
                } else {
                    console.log(data.message);
                }
            });
        }
    }]);


// Prevents users from navigated pages which are out of their permission
// Solicitor go on client page and the other way around
app.run(['$rootScope', '$location', '$state', '$timeout', 'userService', '$stateParams', 'caseService', 'SweetAlert', 'jwtHelper', '$localStorage', 'tokenManager', '$http',
    function ($rootScope, $location, $state, $timeout, userService, $stateParams, caseService, SweetAlert, jwtHelper, $localStorage, tokenManager, $http) {
        $rootScope.$on("$stateChangeStart", function (event, next, current) {
            var userData;

            if($localStorage.applicationData.token){
                userData = jwtHelper.decodeToken($localStorage.applicationData.token);
            }else{
                userData = {};
            }

            //If there are any conditions for the user to comply in order to access the page then check them
            if (next.data) {
                //If this page is for a solicitor but the user is a client then redirect him to the post page
                if (next.data.isSolicitor === true && userData.type === 1) {
                    event.preventDefault();
                    $state.go("app.cases");
                }
                //If this page is for a client but the user is a solicitor then redirect him to the dashboard.
                if (next.data.isClient === true && userData.type === 2) {
                    event.preventDefault();
                    $state.go("app.dashboard");
                }
                // If the user must be verified but he is not then ...
                if (next.data.isVerified === true && userData.verified === 0){
                    event.preventDefault();

                    //If he is a solicitor redirect to dashboard and show alert message
                    if(userData.type === 2){
                        $state.go("app.pages.user");
                        SweetAlert.swal({
                            title: "Verifying account",
                            text: "Your account details are being verified, you will receive a confirmation email shortly. In the mean time please ensure your details are complete. If you cannot find an email from us in your inbox, please check your <strong>junk</strong> or <strong>spam</strong> folder.",
                            type: "success",
                            html: true,
                            confirmButtonColor: "#007AFF"
                        });
                    }else{
                        //If the is a client redirect to post page and show alert message
                        $state.go("app.pages.user");
                        SweetAlert.swal({
                            title: "Verifying account",
                            text: "We have sent you an email to verify your account, please click the provided link. If you cannot find an email from us in your inbox, please check your <strong>junk</strong> or <strong>spam</strong> folder, then go to your profile to re-send it. Log out for the changes to take effect.",
                            type: "success",
                            html: true,
                            confirmButtonColor: "#007AFF"
                        });
                    }

                }
            }

            //If the user has a token skip the login page.
            if (next.name === "login.signin" && userData.type === 1) {
                event.preventDefault();
                $state.go("app.cases");
            } else if (next.name === "login.signin" && userData.type === 2) {
                event.preventDefault();
                $state.go("app.dashboard");
            }

            //As long as the account is not verified ask for a new token on each state change.
            //This is done to catch when the account is actually verified
            if ($localStorage.applicationData.token && userData.verified === 0) {
                tokenManager.refreshToken().then(function (data) {
                    data = data.data;

                    if (data.code === 600) {
                        $localStorage.applicationData.token = data.token;
                        $http.defaults.headers.common.Authorization = 'JWT ' + data.token;
                    } else {
                        console.log(data.message);
                    }
                });
            }
        });
    }]);
app.directive('restrict', function (userService, $compile, $localStorage, jwtHelper) {
    return {
        restrict: 'A',
        priority: 100000,
        scope: false,
        terminal: true,
        link: function(scope,elem,attr) {
            var accessDenied;
            var userData = jwtHelper.decodeToken($localStorage.applicationData.token);
            role = userData.type;
            role = (role === 1) ? "user" : "solicitor";
            var attributes = attr.access.split(" ");
            for (var i in attributes) {
                if (role === attributes[i]) {
                    accessDenied = false;
                }
            }
            if(accessDenied == false) {
                elem.removeClass("ng-hide");
                elem.removeAttr("restrict");
                $compile(elem)(scope);
            }

        }

    };
});

app.directive('membership', function (userService) {
    return {
        restrict: 'A',
        priority: 100000,
        scope: false,
        compile: function (element, attr, linker) {
            var accessDenied = true;
            var role;

            userService.getUserMembership().then(function (d) {
                membership = d.data.membership.MembershipType;
                var attributes = attr.access.split(" ");
                for (var i in attributes) {
                    if (membership == attributes[i]) {
                        accessDenied = false;
                    }
                }
                if (accessDenied) {
                    element.children().remove();
                    element.remove();
                }
            });
        }
    };
});

//If src file is not found use the default avatar picture.
app.directive('errSrc', function () {
    return {
        link: function (scope, element, attrs) {
            element.bind('error', function () {
                if (attrs.src != attrs.errSrc) {
                    attrs.$set('src', attrs.errSrc);
                }
            });
        }
    };
});

app.directive('ddTextCollapse', ['$compile', function ($compile) {

    return {
        restrict: 'A',
        scope: true,
        link: function (scope, element, attrs) {

            // start collapsed
            scope.collapsed = false;

            // create the function to toggle the collapse
            scope.toggle = function () {
                scope.collapsed = !scope.collapsed;
            };

            // wait for changes on the text
            attrs.$observe('ddTextCollapseText', function (text) {

                // get the length from the attributes
                var maxLength = scope.$eval(attrs.ddTextCollapseMaxLength);

                if (text.length > maxLength) {
                    // split the text in two parts, the first always showing
                    var firstPart = String(text).substring(0, maxLength);
                    var secondPart = String(text).substring(maxLength, text.length);

                    // create some new html elements to hold the separate info
                    var firstSpan = $compile('<span>' + firstPart + '</span>')(scope);
                    var moreIndicatorSpan = $compile('<span ng-if="!collapsed">... </span>')(scope);


                    // remove the current contents of the element
                    // and add the new ones we created
                    element.empty();
                    element.append(firstSpan);
                    element.append(moreIndicatorSpan);
                }
                else {
                    element.empty();
                    element.append(text);
                }
            });
        }
    };
}]);

//Upload files
app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

//Do not cache image from src. Adding a timestamp to request to dodge chrome caching.
app.directive('noCacheObj', function ($window) {
    return {
        priority: 99,
        link: function (scope, element, attrs) {
            attrs.$observe('noCacheObj', function (noCacheObj) {
                noCacheObj += '?' + (new Date()).getTime();
                attrs.$set('data', noCacheObj);
            });
        }
    };
});

app.run(['$rootScope', '$state', '$stateParams',
    function ($rootScope, $state, $stateParams) {

        // Attach Fastclick for eliminating the 300ms delay between a physical tap and the firing of a click event on mobile browsers
        FastClick.attach(document.body);

        // Set some reference to access them from any scope
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        // GLOBAL APP SCOPE
        // set below basic information
        $rootScope.app = {
            name: 'LawBid', // name of your project
            author: 'LawBid LTD', // author's name or company name
            description: 'LawBid User Portal | Find a Solicitor with LawBid', // brief description
            version: '1.0', // current version
            year: ((new Date()).getFullYear()), // automatic current year (for copyright information)
            isMobile: (function () {// true if the browser is a mobile device
                var check = false;
                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    check = true;
                }
                ;
                return check;
            })(),
            defaultLayout: {
                isNavbarFixed: true, //true if you want to initialize the template with fixed header
                isSidebarFixed: true, // true if you want to initialize the template with fixed sidebar
                isSidebarClosed: false, // true if you want to initialize the template with closed sidebar
                isFooterFixed: false, // true if you want to initialize the template with fixed footer
                isBoxedPage: false, // true if you want to initialize the template with boxed layout
                theme: 'lyt6-theme-1', // indicate the theme chosen for your project
                logo: 'assets/images/logo.png', // relative path of the project logo
                logoCollapsed: 'assets/images/logo-collapsed.png' // relative path of the collapsed logo
            },
            layout: ''
        };
        $rootScope.app.layout = angular.copy($rootScope.app.defaultLayout);
    }]);
// translate config
app.config(['$translateProvider',
    function ($translateProvider) {

        // prefix and suffix information  is required to specify a pattern
        // You can simply use the static-files loader with this pattern:
        $translateProvider.useStaticFilesLoader({
            prefix: 'assets/i18n/',
            suffix: '.json'
        });

        // Since you've now registered more then one translation table, angular-translate has to know which one to use.
        // This is where preferredLanguage(langKey) comes in.
        $translateProvider.preferredLanguage('en');

        // Store the language in the local storage
        $translateProvider.useLocalStorage();

        // Enable sanitize
        $translateProvider.useSanitizeValueStrategy('sanitize');

    }]);

//google maps configuration
app.config(function (uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyCNskin7tK0WSltYDr3MM-JCF69vUkRVKk',
        v: '3.23', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
    });
});

// Angular-Loading-Bar
// configuration
app.config(['cfpLoadingBarProvider',
    function (cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeBar = true;
        cfpLoadingBarProvider.includeSpinner = false;

    }]);
// Angular-breadcrumb
// configuration
app.config(function ($breadcrumbProvider) {
    $breadcrumbProvider.setOptions({
        template: '<ul class="breadcrumb"><li><a ui-sref="app.dashboard"><i class="fa fa-home margin-right-5 text-large text-dark"></i>Home</a></li><li ng-repeat="step in steps">{{step.ncyBreadcrumbLabel}}</li></ul>'
    });
});
// ng-storage
//set a prefix to avoid overwriting any local storage variables
app.config(['$localStorageProvider',
    function ($localStorageProvider) {
        $localStorageProvider.setKeyPrefix('PacketLtr6');
    }]);
//filter to convert html to plain text
app.filter('htmlToPlaintext', function () {
        return function (text) {
            return String(text).replace(/<[^>]+>/gm, '');
        };
    }
);
// ngCacheBuster
app.config(function(httpRequestInterceptorCacheBusterProvider){
    httpRequestInterceptorCacheBusterProvider
        .setMatchlist([
            /.*node_modules.*/,
            /.*bower_components.*/,
            /.*images*./,
            /.*ng-table*./,
            /.*uib*./,
            /.*asideContent*./,
            /.*api*./,
            /.*fileViewer*./
        ]);
})
//Custom UI Bootstrap Calendar Popup Template
app.run(["$templateCache", function ($templateCache) {
    $templateCache.put("uib/template/datepicker/popup.html",
        "<div>\n" +
        "  <ul class=\"uib-datepicker-popup clip-datepicker dropdown-menu\" dropdown-nested ng-if=\"isOpen\" ng-style=\"{top: position.top+'px', left: position.left+'px'}\" ng-keydown=\"keydown($event)\" ng-click=\"$event.stopPropagation()\">\n" +
        "    <li ng-transclude></li>\n" +
        "    <li ng-if=\"showButtonBar\" class=\"uib-button-bar\">\n" +
        "    <span class=\"btn-group pull-left\">\n" +
        "      <button type=\"button\" class=\"btn btn-sm btn-primary btn-o uib-datepicker-current\" ng-click=\"select('today')\" ng-disabled=\"isDisabled('today')\">{{ getText('current') }}</button>\n" +
        "      <button type=\"button\" class=\"btn btn-sm btn-primary btn-o uib-clear\" ng-click=\"select(null)\">{{ getText('clear') }}</button>\n" +
        "    </span>\n" +
        "      <button type=\"button\" class=\"btn btn-sm btn-primary pull-right uib-close\" ng-click=\"close()\">{{ getText('close') }}</button>\n" +
        "    </li>\n" +
        "  </ul>\n" +
        "</div>\n" +
        "");
    $templateCache.put("uib/template/datepicker/year.html",
        "<table class=\"uib-yearpicker\" role=\"grid\" aria-labelledby=\"{{::uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n" +
        "  <thead>\n" +
        "    <tr>\n" +
        "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left uib-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-left\"></i></button></th>\n" +
        "      <th colspan=\"{{::columns - 2}}\"><button id=\"{{::uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm uib-title\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\"><strong>{{title}}</strong></button></th>\n" +
        "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right uib-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-right\"></i></button></th>\n" +
        "    </tr>\n" +
        "  </thead>\n" +
        "  <tbody>\n" +
        "    <tr class=\"uib-years\" ng-repeat=\"row in rows track by $index\">\n" +
        "      <td ng-repeat=\"dt in row\" class=\"uib-year text-center\" role=\"gridcell\"\n" +
        "        id=\"{{::dt.uid}}\"\n" +
        "        ng-class=\"::dt.customClass\">\n" +
        "        <button type=\"button\" class=\"btn btn-default\"\n" +
        "          uib-is-class=\"\n" +
        "            'btn-current' for selectedDt,\n" +
        "            'active' for activeDt\n" +
        "            on dt\"\n" +
        "          ng-click=\"select(dt.date)\"\n" +
        "          ng-disabled=\"::dt.disabled\"\n" +
        "          tabindex=\"-1\"><span ng-class=\"::{'text-info': dt.current}\">{{::dt.label}}</span></button>\n" +
        "      </td>\n" +
        "    </tr>\n" +
        "  </tbody>\n" +
        "</table>\n" +
        "");
    $templateCache.put("uib/template/datepicker/month.html",
        "<table class=\"uib-monthpicker\" role=\"grid\" aria-labelledby=\"{{::uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n" +
        "  <thead>\n" +
        "    <tr>\n" +
        "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left uib-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-left\"></i></button></th>\n" +
        "      <th><button id=\"{{::uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm uib-title\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\"><strong>{{title}}</strong></button></th>\n" +
        "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right uib-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-right\"></i></button></th>\n" +
        "    </tr>\n" +
        "  </thead>\n" +
        "  <tbody>\n" +
        "    <tr class=\"uib-months\" ng-repeat=\"row in rows track by $index\">\n" +
        "      <td ng-repeat=\"dt in row\" class=\"uib-month text-center\" role=\"gridcell\"\n" +
        "        id=\"{{::dt.uid}}\"\n" +
        "        ng-class=\"::dt.customClass\">\n" +
        "        <button type=\"button\" class=\"btn btn-default\"\n" +
        "          uib-is-class=\"\n" +
        "            'btn-current' for selectedDt,\n" +
        "            'active' for activeDt\n" +
        "            on dt\"\n" +
        "          ng-click=\"select(dt.date)\"\n" +
        "          ng-disabled=\"::dt.disabled\"\n" +
        "          tabindex=\"-1\"><span ng-class=\"::{'text-info': dt.current}\">{{::dt.label}}</span></button>\n" +
        "      </td>\n" +
        "    </tr>\n" +
        "  </tbody>\n" +
        "</table>\n" +
        "");
}]);

// Updates
app.run(["$rootScope", "$localStorage", "userService", function ($rootScope, $localStorage, userService) {
    $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams) {
            if ($localStorage.applicationData.token) {
                userService.showUpdatesDialogs();
                userService.getUserInformation().then(function (userData) {
                    var userInfo = userData.data.details.info;
                    if (userInfo.DismissedSetupDialog === 0 && userInfo.Type === 2) {
                        let userID = userInfo.ID;
                        userService.showSolicitorLoginDialog(userID);
                    }
                })
            }
        });
}]);
