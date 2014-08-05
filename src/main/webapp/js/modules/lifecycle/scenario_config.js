define(['jquery', 'knockout', 'modules/common/dialog-utils', 'modules/lifecycle/lifecycleServiceUtil', 'modules/common/user', 'date-util', 'moment-timezone', 'date-picker'],
        function($, ko, dialog, su, userToken) {
            console.log("Defining Scenario Configuration  View Module ...");
            ko.validation.init({insertMessages: false,
                errorsAsTitle: false,
                decorateInputElement: true,
                errorElementClass: 'validationErrorInput',
                errorMessageClass: 'validationErrorMessage'}, true);

            function ScenarioConfigViewModel() {
                var self = this;
                self.serviceId;
                self.isTarget = ko.observable(false);
                self.isCollectionDate = ko.observable(false);
                self.isDataExtrationDate = ko.observable(false);
                self.isSqlTunningReplayName = ko.observable(false);
                self.scenarioParams = ko.observableArray([]);
                self.engagementPropertyList = ko.observableArray([]);
                self.targetParams = ko.observableArray([]);
                self.scenario = ko.observable(null);
                self.dbConfGUID = [];
                self.destnConfGUID = [];
                self.dbConfObjList = ko.observableArray([]);
                self.destnConfLst = ko.observableArray([]);
                self.engagementName = ko.observable();
                self.currentSenarioId = null;
                self.scenarioParamsValidated = [];
                self.scenarioName = ko.observable().extend({required: true});
                self.startDate = ko.observable().extend({required: true});
                self.endDate = ko.observable().extend({date: true, required: true});
                self.extractionDate = ko.observable().extend({required: true});
                self.timezoneList = ko.observableArray(su.getTimezoneList());

                var Choice = function(text, code) {
                    this.text = text;
                    this.code = code;
                };

                self.utilizationOption = ko.observableArray([
                    new Choice('--select--', ' '),
                    new Choice('External', 'External'),
                    new Choice('Normal', 'Normal'),
                    new Choice('High', 'High')]);

                self.yesNoOption = ko.observableArray([
                    new Choice('YES', 'Y'),
                    new Choice('NO', 'N')]);

                self.feedbackList = ko.observableArray([
                    new Choice('1:Default feedback level', 1),
                    new Choice('2:Basic debug', 2),
                    new Choice('3:Detailed debug', 3),
                    new Choice('4:10046 trace name context forever, level 4', 4),
                    new Choice('8:10046 trace name context forever, level 8', 8),
                    new Choice('12:10046 trace name context forever, level 12', 12)
                ]);

                self.analysisData = function() {
                    var arrayData = [];
                    arrayData.push(new Choice('Exclude', 0));
                    for (var i = 1; i <= 100; i++) {
                        arrayData.push(new Choice(i, i));
                    }
                    return arrayData;
                };

                self.analysisFeild = ko.observableArray(self.analysisData());

                /**
                 * Get JsonObject based on the parameter name 
                 *
                 * @param jsonList,paramName
                 * @return jsonObject
                 */
                self.getPropertyName = function(jsonLst, paramName) {
                    var pName = paramName.toLowerCase();
                    if (!pName) {
                        return null;
                    } else {
                        return ko.utils.arrayFirst(jsonLst, function(item) {
                            return item.name.toLowerCase().indexOf(pName) !== -1;
                        });
                    }
                };


                /**
                 * Get all the JsonList based on the scope
                 *
                 * @param jsonList,scope
                 * @return jsonList
                 */
                self.getScope = function(jsonLst, scope) {
                    var pName = scope;
                    if (!pName) {
                        return null;
                    } else {
                        return ko.utils.arrayFilter(jsonLst, function(item) {
                            return item.scope.indexOf(pName) !== -1;
                        });
                    }
                };


                /**
                 * Get all the JsonList based on the refId
                 *
                 * @param jsonList,refId
                 * @return jsonList
                 */
                self.getRefId = function(jsonLst, refid) {
                    var pName = refid;
                    if (!pName) {
                        return null;
                    } else {
                        return ko.utils.arrayFilter(jsonLst, function(item) {
                            return item.refId == pName;
                        });
                    }
                };


                /**
                 * Get JsonObject based on the refId
                 *
                 * @param jsonList,refId
                 * @return jsonObject
                 */
                self.getHostGUId = function(jsonLst, refid) {
                    var pName = refid;
                    if (!pName) {
                        return null;
                    } else {
                        return ko.utils.arrayFirst(jsonLst, function(item) {
                            return item.TARGET_GUID.indexOf(pName) !== -1;
                        });
                    }
                };


                /**
                 * Create JsonObject based on the refId
                 *
                 * @param scope, name, value, refId
                 * @return jsonObject
                 */
                self.jsonRow = function(scope, name, value, refId) {
                    return({
                        "scenarioId": self.currentSenarioId, "scope": scope, "name": name, "value": value, "refId": refId});
                };


                /**
                 * Initiating the scenario edit functionality with default function call
                 *
                 * @param engagement_Id,scenario_Id
                 */
                self.init = function(engagement_Id, scenario_Id) {
                    self.setToDefault();
                    self.engagementDetail(engagement_Id);
                    self.currentSenarioId = scenario_Id;
                };


                /**
                 * Retrieving Engagement related information  
                 *
                 * @param engagement_Id
                 */
                self.engagementDetail = function(engagement_Id) {
                    console.log("Getting Engagement Details ...");
                    $.ajax({
                        type: 'POST',
                        url: "rest/lifecycle/getEngagementScoping",
                        dataType: "json",
                        data: JSON.stringify({"engagementId": engagement_Id}),
                        contentType: "application/json; charset=utf-8",
                        success: function(data, textStatus, jqXHR) {
                            self.engagementName = data.description;
                            self.serviceId = data.serviceId;
                            self.enableScenarioParameter(self.serviceId);
                            self.engagementPropertyList = data.properties;
                            if (self.serviceId === 1)
                                self.getServiceTargetList(self.serviceId);
                            self.viewScenarioConfig(self.currentSenarioId);
                        }
                    });
                };


                /**
                 * Enabling and Disabling parameter based on Service Id
                 *
                 * @param serviceId
                 */
                self.enableScenarioParameter = function(serviceId) {
                    console.log("Enabling Service Based Parameter Name ...");
                    if (self.serviceId == 1 || self.serviceId == 3 || self.serviceId == 5) {
                        self.isCollectionDate(true);
                        if (self.serviceId == 1) {
                            self.isTarget(true);
                        }
                    }
                    if (self.serviceId == 2 || self.serviceId == 3 || self.serviceId == 4 || self.serviceId == 5) {
                        self.isDataExtrationDate(true);
                        if (self.serviceId == 4) {
                            self.isSqlTunningReplayName(true);
                        }
                    }
                };


                /**
                 * Fetching all the parameter for User Interface
                 *
                 * @param scenario_Id
                 */
                self.viewScenarioConfig = function(scenario_Id) {
                    console.log("Getting Parameters for selected Scenario ...");
                    $.ajax({
                        type: 'POST',
                        url: "rest/lifecycle/findScenarios",
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify({"scenarioId": scenario_Id}),
                        success: function(data, textStatus, jqXHR) {
                            self.scenario = data[0];
                            self.scenarioName(self.scenario.description);
                            self.scenarioParams = self.scenario.properties;
                            self.currentSenarioId = self.scenario.scenarioId;
                            if (self.isTarget())
                                self.validatingTargetPropertyJson();
                            self.populate();
                            location.hash = '#/lifecycle/scenarioConfig';
                        }
                    });
                };


                /**
                 * Extracting Scenario based parameter 
                 *
                 * @param paraName
                 * @return jsonObject
                 */
                self.getScenarioProperty = function(paraName) {
                    var nameRslt = (self.getPropertyName(self.scenarioParams, paraName));
                    if (nameRslt === null) {
                        var item;
                        if (paraName == 'MAX_ALLOWED_CPU_PCT') {
                            item = self.jsonRow('SCENARIO', paraName, '70', null);
                        } else if (paraName == 'MAX_ALLOWED_MEM_PCT') {
                            item = self.jsonRow('SCENARIO', paraName, '80', null);
                        } else if (paraName == 'MAX_ALLOWED_DSK_PCT') {
                            item = self.jsonRow('SCENARIO', paraName, '80', null);
                        } else if (paraName == 'MAX_ALLOWED_DSKIO_PCT') {
                            item = self.jsonRow('SCENARIO', paraName, '85', null);
                        } else
                            item = self.jsonRow('SCENARIO', paraName, '', null);
                        self.applyValidation(item);
                        self.scenarioParams.push(item);
                        self.scenarioParamsValidated.push(item);
                        return item;
                    }
                    if (paraName == 'CONS_LIFECYCLE_STATUS' || paraName == 'CONS_DEPARTMENT' || paraName == 'CONS_LINE_OF_BUSINESS' || paraName == 'CONS_LOCATION') {
                        nameRslt.value === 'Y' ? true : false;
                    }
                    if ((self.getPropertyName(self.scenarioParamsValidated, paraName)) === null) {
                        self.applyValidation(nameRslt);
                        self.scenarioParamsValidated.push(nameRslt);
                    }
                    return nameRslt;
                };


                /**
                 * Populating the parameter of targets 
                 *
                 */
                self.validatingTargetPropertyJson = function() {
                    console.log("Getting Targets Parameters for Consolidation Planning Service ...");
                    if (self.destnConfGUID.length > 0)
                        self.destnConfGUID = [];
                    if (self.dbConfGUID.length > 0)
                        self.dbConfGUID = [];
                    var db_guid = null;
                    var dest_guid = null;
                    $.each(self.engagementPropertyList, function(idx, item) {
                        if (item.scope.toUpperCase() === "SOURCE" && item.name.toUpperCase() === "HOST_GUID") {
                            if ((db_guid === null) || (db_guid !== item.refId)) {
                                db_guid = item.refId;
                                if ($.isEmptyObject(self.getRefId(self.scenarioParams, db_guid))) {
                                    self.scenarioParams.push(self.jsonRow('SOURCE', 'HOST_GUID', item.value, item.refId));
                                    self.scenarioParams.push(self.jsonRow('SOURCE', 'EXCLUDE', 'N', item.refId));
                                    self.scenarioParams.push(self.jsonRow('SOURCE', "DB_NAME", (self.getHostGUId(self.targetParams, item.refId)).TARGET_NAME, item.refId));
                                }
                                self.dbConfGUID.push(db_guid);
                            }
                        } else if (item.scope.toUpperCase() === "DESTINATION" && (item.name.toUpperCase() === "HOST_GUID" || item.name.toUpperCase() === "PHANTOM_SERVER_ID")) {
                            if ((dest_guid === null) || (dest_guid !== item.refId)) {
                                dest_guid = item.refId;
                                if ($.isEmptyObject(self.getRefId(self.scenarioParams, dest_guid))) {

                                    if ((self.getPropertyName(self.engagementPropertyList, 'ENG_TYPE')).value === 'REGULAR') {
                                        self.scenarioParams.push(self.jsonRow('DESTINATION', 'HOST_GUID', item.value, item.refId));
                                        self.scenarioParams.push(self.jsonRow('DESTINATION', "HOST_NAME", (self.getHostGUId(self.targetParams, item.refId)).HOST_NAME, item.refId));
                                        self.scenarioParams.push(self.jsonRow('DESTINATION', "TARGET_NAME", (self.getHostGUId(self.targetParams, item.refId)).TARGET_NAME, item.refId));
                                    } else {
                                        self.scenarioParams.push(self.jsonRow('DESTINATION', 'PHANTOM_SERVER_ID', item.value, item.refId));
                                        self.scenarioParams.push(self.jsonRow('DESTINATION', "TARGET_NAME", (self.getPropertyName((self.getRefId(self.engagementPropertyList, item.refId)), 'HOST_NAME')).value, item.refId));
                                        self.scenarioParams.push(self.jsonRow('DESTINATION', "HOST_NAME", (self.getPropertyName((self.getRefId(self.engagementPropertyList, item.refId)), 'HOST_NAME')).value, item.refId));
                                    }
                                    self.scenarioParams.push(self.jsonRow('DESTINATION', 'EXCLUDE', 'N', item.refId));
                                }
                                self.destnConfGUID.push(dest_guid);
                            }
                        }
                    });
                };


                /**
                 * To display the source and destination target for the particular engagement 
                 *
                 */
                self.populate = function() {
                    console.log("Preparing Structure For the User Interface ...");
                    if (self.isDataExtrationDate())
                        self.extractionDate(new Date((self.getScenarioProperty('RUN_START_DTTM')).dateValue));
                    if (self.isTarget() || self.isCollectionDate()) {
                        self.startDate(new Date((self.getScenarioProperty('COLLECTION_START_DTTM')).dateValue));
                        self.endDate(new Date((self.getScenarioProperty('COLLECTION_END_DTTM')).dateValue));
                    }
                    if (self.isTarget()) {
                        var tempObj;
                        $.each(self.dbConfGUID, function(idx, item) {
                            tempObj = ko.toJS({
                                "GUID": item,
                                "scope": "SOURCE",
                                "DB_NAME": ko.observable((self.getSourceProperty(item, "DB_NAME")).value),
                                "SPECINT_OVERRIDE": ko.observable((self.getSourceProperty(item, "SPECINT_OVERRIDE")).value),
                                "MEM_PCT_GROWTH": ko.observable((self.getSourceProperty(item, "MEM_PCT_GROWTH")).value),
                                "CPU_PCT_GROWTH": ko.observable((self.getSourceProperty(item, "CPU_PCT_GROWTH")).value),
                                "DISK_PCT_GROWTH": ko.observable((self.getSourceProperty(item, "DISK_PCT_GROWTH")).value),
                                "IO_PCT_GROWTH": ko.observable((self.getSourceProperty(item, "IO_PCT_GROWTH")).value),
                                "INC_RAC_DISK_ANALYSIS": ko.observable((self.getSourceProperty(item, "INC_RAC_DISK_ANALYSIS")).value),
                                "HCC_COMPRESS_SEG_SIZE_GB": ko.observable((self.getSourceProperty(item, "HCC_COMPRESS_SEG_SIZE_GB")).value),
                                "ADV_COMPRESS_SEG_SIZE_GB": ko.observable((self.getSourceProperty(item, "ADV_COMPRESS_SEG_SIZE_GB")).value),
                                "EXCLUDE": ko.observable((self.getSourceProperty(item, "EXCLUDE")).value)
                            });
                            self.applyValidation(tempObj);
                            self.dbConfObjList.push(tempObj);
                        });
                        $.each(self.destnConfGUID, function(idx, item) {
                            tempObj = ko.toJS({
                                "GUID": item,
                                "scope": "DESTINATION",
                                "TARGET_NAME": ko.observable((self.getDestinationProperty(item, "TARGET_NAME")).value),
                                "SPECINT_OVERRIDE": ko.observable((self.getDestinationProperty(item, "SPECINT_OVERRIDE")).value),
                                "USABLE_MEM_GB": ko.observable((self.getDestinationProperty(item, "USABLE_MEM_GB")).value),
                                "USABLE_DISK_SPACE_GB": ko.observable((self.getDestinationProperty(item, "USABLE_DISK_SPACE_GB")).value),
                                "DISK_IO_SEC": ko.observable((self.getDestinationProperty(item, "DISK_IO_SEC")).value),
                                "ASM_REDUNDANCY": ko.observable((self.getDestinationProperty(item, "ASM_REDUNDANCY")).value),
                                "EXCLUDE": ko.observable((self.getDestinationProperty(item, "EXCLUDE")).value)
                            });
                            self.applyValidation(tempObj);
                            self.destnConfLst.push(tempObj);
                        });
                    }
                };


                /**
                 * Extracting Source based parameter 
                 *
                 * @param refId , propertyName
                 * @return jsonObject
                 */
                self.getSourceProperty = function(refId, propName) {
                    var result;
                    if (self.getRefId(self.scenarioParams, refId) === null || self.getPropertyName(self.scenarioParams, propName) === null || self.getPropertyName(self.getRefId(self.scenarioParams, refId), propName) === null)
                    {
                        propName === 'INC_RAC_DISK_ANALYSIS' ? (result = true) : (result = '');
                        result = self.jsonRow('SOURCE', propName, result, refId);
                        self.scenarioParams.push(result);
                    }
                    else {
                        result = self.getPropertyName(self.getRefId(self.getScope(self.scenarioParams, 'SOURCE'), refId), propName);
                    }
                    return result;
                };


                /**
                 * Excluding and Including the targets
                 *
                 * @param targetJsonObject
                 */
                self.addTarget = function(target) {
                    if (target.EXCLUDE === 'N')
                        target.EXCLUDE = 'Y';
                    else
                        target.EXCLUDE = 'N';
                    if (target.SCOPE === 'SOURCE') {
                        self.dbConfObjList.remove(target);
                        self.dbConfObjList.push(target);
                    }
                    else {
                        self.destnConfLst.remove(target);
                        self.destnConfLst.push(target);
                    }
                };


                /**
                 * Condition based setting Y and N to parameter value 
                 *
                 * @param  jsonList, paramName, condParamName
                 */
                self.getYN = function(jsonList, paramName, condParamName) {
                    var jsonItem = self.getPropertyName(jsonList, paramName);
                    if (jsonList !== null && condParamName === null) {
                        ko.toJSON(jsonItem.value) === 'true' ? jsonItem.value = 'Y' : jsonItem.value = 'N';
                    }
                    if (jsonList !== null && condParamName !== null) {
                        var condItem = self.getPropertyName(jsonList, condParamName);
                        if (condItem === null) {
                            condItem = self.jsonRow('SCENARIO', condParamName, '', null);
                            jsonList.push(condItem);
                        }
                        ko.toJSON(jsonItem.value) !== '0' ? condItem.value = 'Y' : condItem.value = 'N';
                    }
                };


                /**
                 * Extracting Destination based parameter
                 *
                 * @param refId , propertyName
                 * @return jsonObject
                 */
                self.getDestinationProperty = function(refId, propName) {
                    var result;
                    if (refId === null) {
                        if (self.getPropertyName(self.scenarioParams, propName) === null)
                        {
                            var item = self.jsonRow('DESTINATION', propName, '', refId);
                            self.scenarioParams.push(item);
                            self.scenarioParamsValidated.push(item);
                            result = item;
                        } else
                            result = (self.getPropertyName(self.scenarioParams, propName));
                    } else {
                        if (self.getRefId(self.scenarioParams, refId) === null || self.getPropertyName(self.scenarioParams, propName) === null || self.getPropertyName(self.getRefId(self.scenarioParams, refId), propName) === null)
                        {
                            result = '';
                            result = self.jsonRow('DESTINATION', propName, result, refId);
                            self.scenarioParams.push(result);
                        } else
                            result = self.getPropertyName(self.getRefId(self.getScope(self.scenarioParams, 'DESTINATION'), refId), propName);
                    }
                    return result;
                };


                /**
                 * To get all serviceTarget list based on serviceId
                 *
                 * @param service_id
                 */
                self.getServiceTargetList = function(service_id) {
                    console.log("Getting Service Based Target List...");
                    $.ajax({
                        type: 'POST',
                        url: "rest/lifecycle/sql",
                        dataType: "json",
                        data: JSON.stringify({"NAME": "target_list", "serviceId": service_id}),
                        contentType: "application/json; charset=utf-8",
                        async: false,
                        success: function(data, textStatus, jqXHR) {
                            self.targetParams = data;
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            console.log("<------Temporary Support For Dev Environment----->");
                            $.getJSON("js/mock/lifecycle/sql/serviceTargets.json", function(data) {
                                self.targetParams = data;
                            });
                        }
                    });
                };

                /**
                 * Applying Validation
                 *
                 * @param jsonObject
                 */
                self.applyValidation = function(scenarioParam) {
                    var paramDef;
                    if (scenarioParam.scope === 'SCENARIO' || scenarioParam.value !== undefined) {
                        paramDef = ko.utils.arrayFirst(su.getServiceParamDef(self.serviceId), function(item) {
                            return (item.PARAMETER_NAME.indexOf(scenarioParam.name) != -1 && item.SCOPE.indexOf(scenarioParam.scope) != -1);
                        });
                        self.applyValidationRule(paramDef, scenarioParam, 'value');
                    } else {
                        var data = $.parseJSON(ko.toJSON(scenarioParam));
                        for (var key in data) {
                            if (key !== 'GUID' && key !== '__kg_selected__' && key !== 'SCOPE') {
                                paramDef = ko.utils.arrayFirst(su.getServiceParamDef(self.serviceId), function(item) {
                                    return (item.PARAMETER_NAME.indexOf(key) != -1 && item.SCOPE.indexOf(scenarioParam.scope) != -1);
                                });
                                self.applyValidationRule(paramDef, scenarioParam, key);
                            }
                        }
                    }

                };


                /**
                 * Rules of Validation for Varchar, Numeric and Date
                 *
                 * @param serviceParamDefJsonObj , jsonObject, Propertykey
                 */
                self.applyValidationRule = function(paramDef, scenarioParam, key) {
                    if (paramDef !== null) {
                        var isMandatory = false;
                        if (paramDef.MANDATORY === 'Y')
                            isMandatory = true;
                        var min = 0;
                        var max = 0;
                        if (paramDef.DATA_TYPE === 'N')
                        {
                            min = paramDef.LOWER_VALUE;
                            max = paramDef.UPPER_VALUE;
                            if (min !== null && max !== null) {
                                if (isMandatory)
                                    scenarioParam[key] = min;

                                scenarioParam[key] = ko.observable(scenarioParam[key]).extend({
                                    required: isMandatory,
                                    min: min,
                                    max: max
                                });
                            } else {
                                scenarioParam[key] = ko.observable(scenarioParam[key]).extend({
                                    required: isMandatory
                                });
                            }
                        } else {
                            scenarioParam[key] = ko.observable(scenarioParam[key]).extend({
                                required: isMandatory
                            });
                        }
                    }
                };


                /**
                 * Saving Modified Scenario Data
                 */
                self.saveChanges = function() {
                    console.log("Checking Errors before Saving ...");
                    var failedInputCount = 0;
                    var errorMessage = [];
                    if ((self.isTarget() || self.isCollectionDate()) && self.endDate() != 'Invalid Date') {
                        if ((self.startDate() > self.endDate())) {
                            dialog.alertError('Collection Start Date & time must be less than Collection End Date & Time');
                            return;
                        }
                        (self.getScenarioProperty('COLLECTION_END_DTTM')).value = su.formatDate(self.endDate());
                        (self.getScenarioProperty('COLLECTION_END_DTTM')).dateValue = self.endDate();
                    }
                    if ((self.isTarget() || self.isCollectionDate()) && self.startDate() != 'Invalid Date') {
                        (self.getScenarioProperty('COLLECTION_START_DTTM')).value = su.formatDate(self.startDate());
                        (self.getScenarioProperty('COLLECTION_START_DTTM')).dateValue = self.startDate();
                    }
                    if (self.isDataExtrationDate() && self.extractionDate() != 'Invalid Date') {
                        if (self.endDate() != 'undefined' && self.endDate() !== null && (self.endDate() > self.extractionDate())) {
                            dialog.alertError('Collection End Date & time must be less than Data Extraction Date & Time');
                            return;
                        }
                        (self.getScenarioProperty('RUN_START_DTTM')).value = su.formatDate(self.extractionDate());
                        (self.getScenarioProperty('RUN_START_DTTM')).dateValue = self.extractionDate();
                    }
                    if (self.isSqlTunningReplayName()) {
                        var sqlTunning = self.getPropertyName(self.scenarioParams, 'SQL_TUNING_SET').value !== '';
                        var replayName = self.getPropertyName(self.scenarioParams, 'REPLAY_NAME').value !== '';
                        if (!((sqlTunning || replayName) && !(sqlTunning && replayName))) {
                            dialog.alertError('Please enter either Sql Tunning Set Name or Database Replay Name');
                            return;
                        }
                    }
                    self.scenario.description = self.scenarioName();
                    if (self.isTarget()) {
                        self.getYN(self.scenarioParams, 'MAX_ALLOWED_CPU_PCT', 'INC_CPU_ANALYSIS');
                        self.getYN(self.scenarioParams, 'MAX_ALLOWED_DSK_PCT', 'INC_DISK_ANALYSIS');
                        self.getYN(self.scenarioParams, 'MAX_ALLOWED_MEM_PCT', 'INC_MEM_ANALYSIS');
                        self.getYN(self.scenarioParams, 'MAX_ALLOWED_DSKIO_PCT', 'INC_IO_ANALYSIS');
                        self.getYN(self.scenarioParams, 'CONS_LIFECYCLE_STATUS', null);
                        self.getYN(self.scenarioParams, 'CONS_DEPARTMENT', null);
                        self.getYN(self.scenarioParams, 'CONS_LINE_OF_BUSINESS', null);
                        self.getYN(self.scenarioParams, 'CONS_LOCATION', null);
                        var data;
                        if (self.dbConfObjList().length !== 0) {
                            for (i = 0; i < self.dbConfObjList().length; i++) {
                                data = $.parseJSON(ko.toJSON(self.dbConfObjList()[i]));
                                for (var key in data) {
                                    if (key !== 'GUID' && key !== '__kg_selected__' && key !== 'scope' && key !== 'errors') {
                                        if (key === 'INC_RAC_DISK_ANALYSIS')
                                            data[key] ? (data[key] = 'Y') : (data[key] = 'N');
                                        self.getPropertyName(self.getRefId(self.scenarioParams, data['GUID']), key).value = data[key];
                                        self.applyValidation(self.getPropertyName(self.getRefId(self.scenarioParams, data['GUID']), key));

                                    }
                                }
                            }
                        }
                        if (self.destnConfLst().length !== 0) {
                            for (i = 0; i < self.destnConfLst().length; i++) {
                                data = $.parseJSON(ko.toJSON(self.destnConfLst()[i]));
                                for (var key in data) {
                                    if (key !== 'GUID' && key !== '__kg_selected__' && key !== 'scope' && key !== 'errors') {
                                        self.getPropertyName(self.getRefId(self.scenarioParams, data['GUID']), key).value = data[key];
                                        self.applyValidation(self.getPropertyName(self.getRefId(self.scenarioParams, data['GUID']), key));
                                    }
                                }
                            }
                        }

                    }
                    ko.utils.arrayForEach(self.scenarioParams, function(property) {
                        ko.validation.group(property, {evaluate: true});
                        failedInputCount += property.errors().length;
                        if (property.errors().length > 0)
                            errorMessage.push(property.scope + " -> " + property.name + " : " + property.errors());
                        delete property.errors;
                    });
                    if (failedInputCount > 0) {
                        dialog.alertError(errorMessage);
                        return;
                    }


                    delete self.scenarioParams.errors;
                    self.scenario.lastModifyBy = userToken.userName();

                    if (self.isTarget()) {
                        self.uniqueSelect = ko.dependentObservable(function() {
                            var types = ko.utils.arrayMap(self.scenarioParams, function(item) {
                                return item.refId;
                            });
                            return ko.utils.arrayGetDistinctValues(types);
                        });
                        $.each(self.uniqueSelect(), function(idx, item) {
                            if (item !== null && self.destnConfGUID.indexOf(item) === -1 && self.dbConfGUID.indexOf(item) === -1) {
                                self.tempList = self.getRefId(self.scenarioParams, item);
                                self.filteringScenario = ko.observableArray(self.scenario.properties);
                                $.each(self.tempList, function(idx, element) {
                                    self.filteringScenario.remove(element);
                                });
                            }
                        });
                    }

                    console.log("Saving the data ....");
                    $('#modalPreloader').modal('show');
                    $.ajax({
                        type: 'POST',
                        url: "rest/lifecycle/saveScenarioConfig",
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        data: ko.toJSON(self.scenario),
                        success: function(data, textStatus, jqXHR) {
                            dialog.notifySuccess('Operation Succeeded', 'Scenario saved successfully');
                            console.log("Responce from save_scenario_param:" + ko.toJSON(data));
                            location.hash = '#/lifecycle/tam-admin';
                        },
                        complete: function(jqXHR, textStatus) {
                            $('#modalPreloader').modal('hide');
                        }
                    });
                };


                /**
                 * To clear all the arrayList and boolean after the operating the edit functionality
                 */
                self.setToDefault = function() {
                    self.startDate(null);
                    self.extractionDate(null);
                    self.endDate(null);
                    self.isCollectionDate(false);
                    self.isTarget(false);
                    self.isDataExtrationDate(false);
                    self.isSqlTunningReplayName(false);
                    self.dbConfObjList.removeAll();
                    self.destnConfLst.removeAll();
                    self.scenarioParamsValidated = [];
                };


            }
            return new ScenarioConfigViewModel();
        }
);