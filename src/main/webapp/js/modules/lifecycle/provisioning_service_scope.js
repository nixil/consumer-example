define(['jquery', 'knockout', 'bootstrap-file-upload','modules/lifecycle/lifecycleServiceUtil', 'jqueryxml2js','modules/common/user-validation', 'modules/common/dialog-utils' ],
        function($, ko, util,x2j, user_validation, dialog, file) {

            console.log("defining provisioning scope View Module ...");
            ko.validation.init();
            function ProvisioningScopeVM() {
                var self = this
                self.selectedTargetList = ko.observableArray(null);
                self.targetsDetailList = ko.observableArray(null);
                self.targetStatusList = ko.observableArray(null);
                self.targetList = ko.observableArray(null);
                self.selectedHostName = ko.observable(null);
                self.selectedControlHostName = ko.observable(null);
                self.selectedTargetStatusList = ko.observableArray(null);
                self.fileData = ko.observable("Test Data.....");
                $('input[type=file]').bootstrapFileInput();
                $('.file-inputs').bootstrapFileInput();
                self.jsonDataFile = ko.observable();
                self.fileoutputData = ko.observable();

                self.viewfileContent = function() {
                    console.log("viewing file" + self.jsonDataFile());
                    var reader = new FileReader();
                    reader.readAsBinaryString(self.jsonDataFile());
                    console.log("reader created...");
                    reader.onload = function(event) {
                        // readJSON(event.target.result);
                        console.log("alert(file loaded)");
                        alert("file loaded");
                        self.fileData(JSON.stringify($.xml2json($.parseXML(event.target.result))));
//                        console.log("file::: " + reader.readAsText(self.jsonDataFile()));
                        // self.fileData(reader.readAsText(self.jsonDataFile()));
//                        self.fileData(reader.readAsBinaryString(self.jsonDataFile()));
                    };


                }
//                $.jQuery.x
//               self.sample="<xml><element1>test</element1></xml>";
//                console.log("sample"+ self.xmlToJson($.parseXML(self.sample)));
                self.xmlToJson = function(xml) {
                    console.log("converting xml to json.............");
//                    xml=xml.firstElementChild;
                    // Create the return object
                    var obj = {};

                    if (xml.nodeType == 1) { // element
                        // do attributes
                        if (xml.attributes.length > 0) {
                            obj["@attributes"] = {};
                            for (var j = 0; j < xml.attributes.length; j++) {
                                var attribute = xml.attributes.item(j);
                                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                            }
                        }
                    }
                    // do children
                    if (xml.hasChildNodes()) {
                        if (xml.childNodes.length == 1 && xml.firstChild.nodeType == 3) {
                            console.log(JSON.stringify(obj));

                            obj[xml.nodeName] = xml.firstChild.nodeValue;
                            console.log(JSON.stringify(obj));
                        }
                        else {
                            for (var i = 0; i < xml.childNodes.length; i++) {
                                var item = xml.childNodes.item(i);
                                if (item.nodeType != 3) {
                                    var nodeName = item.nodeName;
                                    if (typeof (obj[nodeName]) == "undefined") {
                                        obj[nodeName] = self.xmlToJson(item);
                                    } else {
                                        if (typeof (obj[nodeName].push) == "undefined") {
                                            var old = obj[nodeName];
                                            obj[nodeName] = [];
                                            obj[nodeName].push(old);
                                        }
                                        obj[nodeName].push(self.xmlToJson(item));
                                    }
                                }

                            }
                        }
                    }
                    return obj;
                }
                ;








                self.beforeRoutingAction = function(context) {


                    /*
                     * XML to JSon 
                     */

//                    var xmlString = '<ALEXA VER="0.9" URL="davidwalsh.name/" HOME="0" AID="="><SD TITLE="A" FLAGS="" HOST="davidwalsh.name"><TITLE TEXT="David Walsh Blog :: PHP, MySQL, CSS, Javascript, MooTools, and Everything Else"/><LINKSIN NUM="1102"/><SPEED TEXT="1421" PCT="51"/></SD><SD><POPULARITY URL="davidwalsh.name/" TEXT="7131"/><REACH RANK="5952"/><RANK DELTA="-1648"/></SD></ALEXA>';
//                    var xmlDoc = $.parseXML(xmlString);
//                    console.log("Json Conveted" + JSON.stringify(xmlToJson(xmlDoc)));














                    $('input[type=file]').bootstrapFileInput();
                    $('.file-inputs').bootstrapFileInput();
                    console.log("Before Routing Action of Provisioning Service.ddd..");
                    console.log("Getting Target List ...");
                    $.getJSON("js/mock/lifecycle/provisioning_targets.json", function(data) {
                        console.log("Got data:" + JSON.stringify(data));
                        self.targetList.pushAll(data);
                        console.log("target List: " + self.targetList())
                    });
                    console.log("Getting Targets Detail List ...");
                    $.getJSON("js/mock/lifecycle/provisioning_detail.json", function(data) {
                        console.log("Got data:" + JSON.stringify(data));
                        self.targetsDetailList.pushAll(data);
                        console.log("targetsDetailList: " + self.targetsDetailList())
                    });
                    console.log("Getting targetStatusList List ...");
                    $.getJSON("js/mock/lifecycle/provisioning_status.json", function(data) {
                        console.log("Got data:" + JSON.stringify(data));
                        self.targetStatusList.pushAll(data);
                        console.log("targetStatusList: " + self.targetStatusList())
                    });



                    self.fileoutputData(ko.toJSON("{name:shivank, age:22, surname:goyal}"));
                    console.log("self.fileoutputData::::" + self.fileoutputData)
                    self.targetListGridOptions = {
                        showFilter: true,
                        enablePaging: true,
                        fixedViewPortHeight: false,
                        selectedItems: self.selectedTargetList,
                        selectWithCheckboxOnly: true,
                        displaySelectionCheckbox: true,
                        showToolbar: true,
                        rightToolbarTemplate: '<div class="row"><input type="file" data-filename-placement="inside" data-bind="event: { change: function() { jsonDataFile($element.files[0]); } }"></div>',
                        data: self.targetList,
                        columnDefs: [
                            {field: 'hostname', displayName: 'Hostname'},
                            {field: 'server_type', displayName: 'Server Type'},
                            {field: 'os', displayName: 'Operating System'},
                            {field: 'os_version', displayName: 'OS Version'},
                            {field: 'primary_ip', displayName: 'Primary IP Address'},
                            {field: 'total_cpu', displayName: 'Total vCPU '},
                            {field: 'allocated_cpu', displayName: 'Allocated vCPU'},
                            {field: "total_memory", displayName: 'Total Memory(gb)'},
                            {field: "allocated_memory", displayName: 'Allocated Memory(gb)'},
                            {field: "total_disk", displayName: 'Total Disk(gb)'},
                            {field: "allocated_disk", displayName: 'Allocated Disk(gb)'}
                        ]};

                    self.targetDetailsGridOptions = {
                        showFilter: true,
                        enablePaging: true,
                        fixedViewPortHeight: false,
                        selectedItems: self.selectedTargetList,
                        selectWithCheckboxOnly: true,
                        displaySelectionCheckbox: true,
                        showToolbar: true,
                        rightToolbarTemplate: '<div><button type="button">Import</button><button> <a href = "data:application/json;charset=utf-8," + encodeURIComponent("shivank") download = "shivank.json" target = "_blank">Exports</a></button></div>',
                        data: self.targetsDetailList,
                        columnDefs: [
                            {field: 'control_host', displayName: 'Control Host'},
                            {field: 'virtual_host', displayName: 'Virtual Host'},
                            {field: 'os', displayName: 'OS Type'},
                            {field: 'os_version', displayName: 'OS Version'},
                            {field: 'allocated_cpu', displayName: 'vCPU'},
                            {field: "allocated_memory", displayName: 'Memory(gb)'},
                            {field: "allocated_disk", displayName: 'Disk(gb)'},
                            {field: 'primary_ip', displayName: 'IP Address'},
                        ]};
                    self.targetStatusGridOptions = {
                        showFilter: true,
                        enablePaging: true,
                        fixedViewPortHeight: false,
                        selectedItems: self.selectedTargetStatusList,
                        selectWithCheckboxOnly: true,
                        displaySelectionCheckbox: true,
                        multiSelect: false,
                        data: self.targetStatusList,
                        columnDefs: [
                            {field: 'hostname', displayName: 'Hostname'},
                            {field: 'control_host', displayName: 'Control Host'},
                            {field: 'os', displayName: 'OS Type'},
                            {field: 'os_version', displayName: 'Version'},
                            {field: 'allocated_cpu', displayName: 'CPU (cores)'},
                            {field: "allocated_memory", displayName: 'Memory(gb)'},
                            {field: "allocated_disk", displayName: 'Total Disks(gb)'},
                            {field: 'status', displayName: 'Status'},
                            {field: 'status', displayName: 'Customer Ready', cellTemplate: '<div class="kgAction"><div data-bind="visible: $parent.entity[\'status\'] === \'UP\' "> <i class="fa fa-check-circle fa-2x"></i></div><div data-bind="visible: $parent.entity[\'status\'] == \'DOWN\' "> <i class="fa fa-times-circle fa-2x"></i></div></div>'}
                        ]};
                };
                ko.computed(function() {
                    if (self.selectedTargetStatusList().length > 0) {
                        console.log("Selected length:" + self.selectedTargetStatusList().length)
                        self.selectedHostName(self.selectedTargetStatusList()[0].hostname);
                        self.selectedControlHostName(self.selectedTargetStatusList()[0].control_host);
                    }
                });
                self.forceResize = function() {
                    setTimeout(function() {
                        $(window).resize();
                    }, 500);
                };
                self.afterRender = function() {
                    console.log("executing after render...");
                    /* resize the kogrid when tab is activated */
                    $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
                        $(window).resize();
                    });
                    $('input[type=file]').bootstrapFileInput();
                };
            }
            return new ProvisioningScopeVM();
        });
