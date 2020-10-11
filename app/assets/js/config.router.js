'use strict';

/**
 * Config for the router
 */
app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$ocLazyLoadProvider', 'JS_REQUIRES', '$analyticsProvider',
  function($stateProvider, $urlRouterProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $ocLazyLoadProvider, jsRequires, $analyticsProvider) {

    app.controller = $controllerProvider.register;
    app.directive = $compileProvider.directive;
    app.filter = $filterProvider.register;
    app.factory = $provide.factory;
    app.service = $provide.service;
    app.constant = $provide.constant;
    app.value = $provide.value;

    // LAZY MODULES

    $ocLazyLoadProvider.config({
      debug: false,
      events: true,
      modules: jsRequires.modules
    });


    // APPLICATION ROUTES
    // -----------------------------------
    // For any unmatched url, redirect to /app/dashboard
    $urlRouterProvider.otherwise("/login/signin");
    //
    // Set up the states
    $stateProvider.state('app', {
        url: "/app",
        templateUrl: "assets/views/app.html",
        resolve: loadSequence('chartjs', 'chart.js'),
        abstract: true
      }).state('app.dashboard', {
        url: "/dashboard",
        templateUrl: "assets/views/dashboard.html",
        resolve: loadSequence('d3', 'ui.knob', 'countTo', 'dashboardCtrl', 'ngTable', 'ngTableCtrl'),
        title: 'Dashboard',
        ncyBreadcrumb: {
          label: 'Dashboard'
        },
        data: {
          requiresLogin: true,
          isSolicitor: true,
          isVerified: true
        }
      })

      // Bidding routes
      .state('app.bidDescription', {
        url: '/bids_description/:caseID',
        templateUrl: 'assets/views/bids_description.html',
        ncyBreadcrumb: {
          label: 'CaseDetails'
        },
        data: {
          requiresLogin: true,
          isSolicitor: true,
          isVerified: true
        },
        resolve: loadSequence('touchspin-plugin', 'sweetAlertCtrl')
      }).state('app.caseTaken', {
        url: '/case_taken',
        templateUrl: 'assets/views/case_taken.html',
        ncyBreadcrumb: {
          label: 'CaseTaken'
        },
        data: {
          requiresLogin: true,
          isSolicitor: true,
          isVerified: true
        }
      }).state('app.caseDoesNotExist', {
        url: '/case_unavailable',
        templateUrl: 'assets/views/case_does_not_exist.html',
        ncyBreadcrumb: {
          label: 'CaseInvalid'
        },
        data: {
          requiresLogin: true,
          isSolicitor: true,
          isVerified: true
        }
      }).state('app.notAllowed', {
        url: '/case_denied',
        templateUrl: 'assets/views/case_is_denied.html',
        ncyBreadcrumb: {
          label: 'CaseDenied'
        },
        data: {
          requiresLogin: true,
          isSolicitor: true,
          isVerified: true
        }
      })
      .state('app.caseDescription', {
        url: '/case_description/:caseID',
        templateUrl: 'assets/views/user_case.html',
        resolve: loadSequence('sweetAlertCtrl'),
        ncyBreadcrumb: {
          label: 'Case Description'
        },
        data: {
          requiresLogin: true,
          isClient: true,
          isVerified: true
        }
      })
      .state('app.accepted', {
        url: '/accepted_cases',
        templateUrl: 'assets/views/accepted_cases.html',
        title: 'Find a solicitor in your area with LawBid.',
        ncyBreadcrumb: {
          label: 'My Cases'
        },
        data: {
          requiresLogin: true,
          isSolicitor: true,
          isVerified: true
        }
      })
      // Membership
      .state('app.membership', {
        url: '/membership',
        templateUrl: 'assets/views/membership.html',
        title: 'Find a solicitor in your area with LawBid.',
        ncyBreadcrumb: {
          label: 'Membership'
        },
        data: {
          requiresLogin: true,
          isSolicitor: true,
          isVerified: true
        }
      }).state('app.activitylog', {
        url: '/activitylog',
        templateUrl: 'assets/views/activitylog.html',
        title: 'Find a solicitor in your area with LawBid.',
        ncyBreadcrumb: {
          label: 'ActivityLog'
        },
        data: {
          requiresLogin: true,
          isSolicitor: true,
          isVerified: true
        },
        resolve: loadSequence('ngTable', 'ngTableCtrl')
      }).state('app.demo', {
        url: '/demo',
        templateUrl: 'assets/views/demo.html',
        title: 'Book a Demo.',
        ncyBreadcrumb: {
          label: 'demo'
        },
        data: {
          requiresLogin: true,
          isSolicitor: true,
          isVerified: true
        },
        resolve: loadSequence('ngTable', 'ngTableCtrl')
      })
      .state('app.post', {
        url: '/cases',
        templateUrl: "assets/views/post_case.html",
        ncyBreadcrumb: {
          label: 'Post'
        },
        data: {
          requiresLogin: true,
          isClient: true,
          isVerified: true
        },
        resolve: loadSequence('PostCtrl', 'ngNotify')
      }).state('app.cases', {
        url: '/post',
        templateUrl: "assets/views/cases_list.html",
        ncyBreadcrumb: {
          label: 'My Cases'
        },
        data: {
          requiresLogin: true,
          isClient: true,
          isVerified: true

        }
      }).state('app.pages', {
        url: '/pages',
        template: '<div ui-view class="fade-in-up"></div>',
        title: 'Pages',
        ncyBreadcrumb: {
          label: 'Pages'
        },
        data: {
          requiresLogin: true
        }
      }).state('app.pages.user', {
        url: '/user',
        templateUrl: "assets/views/pages_user_profile.html",
        title: 'User Profile',
        ncyBreadcrumb: {
          label: 'User Profile'
        },
        data: {
          requiresLogin: true
        },
        resolve: loadSequence('flow', 'userCtrl')
      }).state('error', {
        url: '/error',
        template: '<div ui-view class="fade-in-up"></div>'
      })

      // Login routes

      .state('login', {
        url: '/login',
        template: '<div ui-view class="fade-in-right-big smooth"></div>',
        abstract: true
      }).state('login.signin', {
        url: '/signin',
        templateUrl: "assets/views/login_login.html",
        title: "Sign in to your LawBid account to access your dashboard",
        description: "Welcome back to LawBid. Sign in to your LawBid account as a client or Solicitor. Post a case or reach out to new clients through your dashboard."
      }).state('login.forgot', {
        url: '/forgot',
        templateUrl: "assets/views/login_forgot.html",
        title: "Forgot Password",
        description: "Change your password just by providing your e-mail address."
      }).state('login.registration', {
        url: '/registration',
        templateUrl: "assets/views/login_registration.html",
        title: "Register",
        description: "Register as a client or a solicitor today. LawBid is the fast, free and innovative platform matching clients and solicitors nationwide."
      }).state('login.verify-client-account', {
        url: '/verify-client-account',
        templateUrl: "assets/views/login_verify_client_account.html"
      }).state('login.verify-solicitor-account', {
        url: '/verify-solicitor-account',
        templateUrl: "assets/views/login_verify_solicitor_account.html"
      })


      // Landing Page route
      .state('landing', {
        url: '/landing-page',
        template: '<div ui-view class="fade-in-right-big smooth"></div>',
        abstract: true,
        resolve: loadSequence('jquery-appear-plugin', 'ngAppear', 'countTo')
      });


    $analyticsProvider.firstPageview(true); /* Records pages that don't use $state or $route */
    $analyticsProvider.withAutoBase(true); /* Records full path */


    // Generates a resolve object previously configured in constant.JS_REQUIRES (config.constant.js)
    function loadSequence() {
      var _args = arguments;
      return {
        deps: ['$ocLazyLoad', '$q',
          function($ocLL, $q) {
            var promise = $q.when(1);
            for (var i = 0, len = _args.length; i < len; i++) {
              promise = promiseThen(_args[i]);
            }
            return promise;

            function promiseThen(_arg) {
              if (typeof _arg == 'function')
                return promise.then(_arg);
              else
                return promise.then(function() {
                  var nowLoad = requiredData(_arg);
                  if (!nowLoad)
                    return $.error('Route resolve: Bad resource name [' + _arg + ']');
                  return $ocLL.load(nowLoad);
                });
            }

            function requiredData(name) {
              if (jsRequires.modules)
                for (var m in jsRequires.modules)
                  if (jsRequires.modules[m].name && jsRequires.modules[m].name === name)
                    return jsRequires.modules[m];
              return jsRequires.scripts && jsRequires.scripts[name];
            }
          }
        ]
      };
    }
  }
]);
