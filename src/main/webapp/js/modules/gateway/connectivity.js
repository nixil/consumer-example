define(['jquery', 'knockout', 'bootstrap-file-upload', 'modules/common/dialog-utils'],
        function($, ko, dialog) {

            function ConnectivityViewModel() {
                var self = this;
                self.file = ko.observable();
                self.ownIp = ko.observable();
                self.done = ko.observable(true);
                self.ipaddresses = ko.observableArray();
                self.results = ko.observableArray();

                var wsUri = "ws://" + document.location.host + document.location.pathname + "connectivityWebSocket";
                console.log("document.location.host=" + document.location.host);
                console.log("document.location.pathname=" + document.location.pathname);
                console.log("wsUri=" + wsUri);
                var websocket = new WebSocket(wsUri);

                self.afterRender = function() {
                    $('input[type=file]').bootstrapFileInput();
                };

                $.ajax({
                    type: 'GET',
                    url: "rest/gatewayservice/ipaddresses",
                    dataType: "json", // data type of response
                    contentType: "application/json; charset=utf-8",
                    success: function(data, textStatus, jqXHR) {
                        self.ipaddresses(data);
                    }
                });

                ko.bindingHandlers.fileUpload = {
                    update: function(element) {
                        console.log("fileUpload update");
                        $(element).change(function() {
                            if (element.files.length) {
                                console.log("fileUpload 2" + element.files.length);
                                self.file(element.files[0]);
                            }
                        });
                    }
                };

                self.proceed = function() {
                    if (self.done()) {
                        self.done(false);
                        console.log("ownIp=" + self.ownIp());
                        var reader = new FileReader();
                        reader.onload = function(e) {
                            var text = reader.result;
                            console.log("text=" + text);
                            var json = JSON.stringify({
                                "ownIp": self.ownIp(),
                                "xml": text
                            });
                            self.results.removeAll();
                            websocket.send(json);
                        };
                        reader.readAsText(self.file());
                    }
                };

                websocket.onmessage = function(evt) {
                    console.log("received: " + evt.data);
                    if (!self.done()) {
                        if ("DONE" === evt.data) {
                            self.done(true);
                            console.log("DONE");
                        } else {
                            var json = JSON.parse(evt.data);
//                    console.log("name " + json.name);
//                    console.log("ip " + json.ip);
//                    console.log("output" + json.output);
//                    console.log("port" + json.port);
//                    console.log("targetType" + json.targetType);
//                    console.log("testType" + json.testType);
//                    console.log("isForward" + json.isForward);
//                    console.log("isPassed" + json.isPassed);
                            self.results.push(json);
                        }
                    }
                };

                self.resultsGrid = {data: self.results,
                    showFilter: true,
                    enablePaging: true,
                    multiSelect: false,
                    //selectWithCheckboxOnly: true,
                    canSelectRows: false,
                    displaySelectionCheckbox: false,
                    disableTextSelection: false,
                    //sortInfo: self.sortInfo,
                    fixedViewPortHeight: false,
                    pagingOptions: {
                        pageSizes: ko.observableArray([10, 100, 500, 1000]),
                        pageSize: ko.observable(10),
                        totalServerItems: ko.observable(0),
                        currentPage: ko.observable(1)
                    },
                    showToolbar: false,
                    columnDefs: [
                        {field: 'name', displayName: 'Node Name', width: '20%'},
                        {field: 'targetType', displayName: 'Node Type', width: '10%'},
                        {field: 'ip', displayName: 'IP Address', width: '12%'},
                        {field: 'testType', displayName: 'Protocol', width: '12%'},
                        {field: 'isForward', displayName: 'Direction',
                            cellFilter: function(isForward) {
                                if (isForward) {
                                    return "From Gateway";
                                } else {
                                    return "To Gateway";
                                }
                            }, width: '12%'},
                        {field: 'port', displayName: 'Port', width: '12%'},
                        {field: 'isPassed', displayName: 'Result',
                            cellFilter: function(isPassed) {
                                if (isPassed) {
                                    //return "<label style=\"color:#088A08\">Passed</label>";
                                    return "<label style=\"color:#419641\">Passed</label>";
                                } else {
                                    return "<label style=\"color:#FF0000\">Failed</label>";
                                }
                            }, width: '12%'}
                    ]};
            }
            return new ConnectivityViewModel();
        }
);
