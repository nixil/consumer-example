define('userlogin', ['jquery', 'knockout', 'modules/common/user', 'modules/common/dialog-utils', 'modules/common/ko-validation-util'],

    function($, ko, user, dialog) {

        console.log("defining userlogin module...");

        function UserLoginViewModel() {

            var self = this;

            self.credential = user;
            self.loading = ko.observable(true);

            self.currentFunction = ko.observable();

            self.email = ko.observable();
            self.enableSendButton = ko.observable(false);

            self.password = ko.observable().extend({ required: true , passwordComplexity: true });
            self.confirmPassword = ko.observable().extend({ required: true , areSame: self.password });

            var queryParams = parseQueryParameters();
            //if user comes to this page from
            // the new user confirmation or reset password email link
            self.code = queryParams['v'] || queryParams['a'];
            self.type = queryParams['v'] ? 'v' : queryParams['a'] ? 'a' : null;
            if (self.type && self.code) {
                $.ajax({
                    type: 'POST',
                    url: "rest/userservice/verify_code",
                    dataType: "text", // data type of response
                    contentType: "application/x-www-form-urlencoded; charset=utf-8",
                    data: {type: self.type, code: self.code},
                    success: function (data, textStatus, jqXHR) {
                        self.credential.userId(data);
                        self.currentFunction('RESETPWD');
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        dialog.alertError(jqXHR.responseText);
                        self.currentFunction('LOGIN');
                    },
                    complete: function() {
                        self.loading(false);
                    }
                });
            } else {
                self.currentFunction = ko.observable('LOGIN');
                self.loading(false);
            }


            /*
             * login action for the login page
             */
            self.login = function() {

                if (user.userId() && user.password()) {

                    $.ajax({
                        type: 'POST',
                        url: "rest/userservice/user_login",
                        dataType: "json", // data type of response
                        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                        data: {userid: user.userId(), password: user.password()},

                        success: function(userData, textStatus, jqXHR) {
                            var queryParams = parseQueryParameters();
                            //if there is a url specified go there otherwise go default
                            if (queryParams['r']) {
                                window.location.href = queryParams['r'];
                            } else {
                                window.location.href = "index.html";
                            }
                        },

                        error: function(jqXHR, textStatus, errorThrown) {
                            dialog.alertWarning("Invalid user ID and password, please try again!");
                        }

                    });

                } else
                    dialog.alertWarning("Please enter user ID and password!");

            };

            self.forgotPassword = function() {
                self.currentFunction('FORGOT');
            };

            self.backToLogin = function() {
                self.currentFunction('LOGIN');
            };

            self.email.subscribe(function (val) {
                // jquery validate regex
                self.enableSendButton(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(val));
            });

            self.initiateResetPassword = function() {
                self.loading(true);
                $.ajax({
                    type: 'POST',
                    url: "rest/userservice/forget_password",
                    dataType: "text", // data type of response
                    contentType: "application/json; charset=utf-8",
                    data: self.email(),
                    success: function (data, textStatus, jqXHR) {
                        dialog.alertSuccess('Reset password email has been sent to ' + self.email() + ' successfully, please go to check your email inbox.');
                        self.currentFunction('LOGIN');
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        dialog.alertError(jqXHR.responseText);
                    },
                    complete: function() {
                        self.loading(false);
                    }
                });
            };

            self.activateUser = function() {
                if (!validatePassword()) return;

                self.loading(true);
                $.ajax({
                    type: 'POST',
                    url: "rest/userservice/activate_user",
                    dataType: "text", // data type of response
                    contentType: "application/x-www-form-urlencoded; charset=utf-8",
                    data: {code: self.code, password: self.password},
                    success: function (data, textStatus, jqXHR) {
                        dialog.alertSuccess('User is activated successfully, please try login with the password you just set');
                        self.currentFunction('LOGIN');
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        dialog.alertError(jqXHR.responseText);
                    },
                    complete: function() {
                        self.loading(false);
                    }
                });
            };

            self.changePassword = function() {
                if (!validatePassword()) return;
                self.loading(true);
                $.ajax({
                    type: 'POST',
                    url: "rest/userservice/change_password",
                    dataType: "text", // data type of response
                    contentType: "application/x-www-form-urlencoded; charset=utf-8",
                    data: {code: self.code, password: self.password},
                    success: function (data, textStatus, jqXHR) {
                        dialog.alertSuccess('Password has been set successfully, please try login with the password you just set');
                        self.currentFunction('LOGIN');
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        dialog.alertError(jqXHR.responseText);
                    },
                    complete: function() {
                        self.loading(false);
                    }
                });
            };

            function validatePassword() {
                var userObj = {
                    password: self.password,
                    confirmPassword: self.confirmPassword
                };

                ko.validation.group(userObj, {evaluate: false});

                if (userObj.errors().length > 0) {
                    dialog.alertError('Data validation failed: ' + userObj.errors());
                    //a trick to workaround the ko validation problem of not showing message when there is no user input
                    self.password(null);
                    self.confirmPassword(null);
                    self.password(self.password());
                    self.confirmPassword(self.confirmPassword());
                    return false;
                } else
                return true;

            }

            /*
             * Method to parse query parameter from current url
             */
            function parseQueryParameters() {
                var match,
                    pl     = /\+/g,  // Regex for replacing addition symbol with a space
                    search = /([^&=]+)=?([^&]*)/g,
                    decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
                    query  = window.location.search.substring(1);

                var urlParams = {};
                while (match = search.exec(query)) {
                    urlParams[decode(match[1])] = decode(match[2]);
                }

                return urlParams;
            }

            // Here's a custom Knockout binding that makes elements shown/hidden via jQuery's fadeIn()/fadeOut() methods
            // Could be stored in a separate utility library
            ko.bindingHandlers.fadeVisible = {
                init: function(element, valueAccessor) {
                    // Initially set the element to be instantly visible/hidden depending on the value
                    var value = valueAccessor();
                    $(element).toggle(ko.unwrap(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
                },
                update: function(element, valueAccessor) {
                    // Whenever the value subsequently changes, slowly fade the element in or out
                    var value = valueAccessor();
                    if (ko.unwrap(value)) {
                        window.setTimeout(function () {
                            $(element).fadeIn();
                        }, 500);
                    } else {
                        $(element).fadeOut();
                    }
                }
            };

        }

        return new UserLoginViewModel();
    }
);

requirejs.config({
    //Versioning to prevent client-side cache between different release.
    urlArgs: 'v=3.8',
    // Path mappings for the logical module names
    paths: {
        'knockout': 'lib/knockout/knockout-3.1.0',
        'knockout.global': 'lib/knockout/knockout.global',
        'jquery': 'lib/jquery/jquery-1.11.0.min',
        'pnotify': 'lib/pnotify/pnotify.custom',
        'bootstrap': 'lib/bootstrap/bootstrap.min',
        'knockout-validation': 'lib/knockout/knockout.validation'
    },

    // Shim configurations for modules that do not expose AMD
    shim: {
        'jquery': {
            exports: ['jQuery', '$']
        },
        'bootstrap': {
            deps: ['jquery']
        }
    }
});


/**
 * A top-level require call executed by the Application.
 */
require(['knockout', 'knockout.global', 'userlogin', 'modules/common/httputils', 'bootstrap', 'modules/common/ko-validation-util'],
    function(ko, ignore, loginVM) // this callback gets executed when all required modules are loaded
    {
        /* apply viewmodel */
        $(document).ready(function() {
            //register knockout validation custom rules
            ko.validation.registerExtenders();
            ko.applyBindings(loginVM, document.getElementById('mainContent'));
        });
    }
);



