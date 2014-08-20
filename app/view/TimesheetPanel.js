Ext.define(document.appName + '.view.TimesheetPanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'timesheetPanel',
    config: {
        projectStore: null,
        timesheetStore: null,
        phaseStore: null,
        taskTypeStore: null,
        mainTaskStore: null,

        firstDayOfWeek: '',
        toDay: ''
    },
    initComponent: function () {
        var self = this;

        self.projectStore.proxy.extraParams.includeAll = 'All';
        self.projectStore.proxy.extraParams.isTimesheet = true;
        self.projectStore.load();

        self.timesheetStore.proxy.extraParams.projectID = -1;
        self.timesheetStore.proxy.extraParams.fromDateText = self.firstDayOfWeek;
        self.timesheetStore.proxy.extraParams.toDateText = self.toDay;
        self.timesheetStore.load();

        var searchTimesheet = function () {
            var form = Ext.getCmp('searchTimesheetForm');
            var values = form.getValues();
            //console.log(values);
            if (form.isValid()) {
                var values = form.getValues();

                var projectID = values.projectID;
                var fromDate = values.fromStartTimesheet;
                var toDate = values.toStartTimesheet;

                projectID = projectID || -1;

                self.timesheetStore.currentPage = 1;
                self.timesheetStore.proxy.extraParams.projectID = projectID;
                self.timesheetStore.proxy.extraParams.fromDateText = fromDate;
                self.timesheetStore.proxy.extraParams.toDateText = toDate;

                self.timesheetStore.load();
            }
        };

        // set Default
        var setDefault = function () {
            //Ext.getCmp('fromStartTimesheet').setValue(self.firstDayOfWeek);
            //Ext.getCmp('toStartTimesheet').setValue(self.toDay);

            Ext.getCmp('fromStartTimesheet').setMaxValue(Ext.getCmp('toStartTimesheet').getValue());
            Ext.getCmp('toStartTimesheet').setMinValue(Ext.getCmp('fromStartTimesheet').getValue());
        };

        var searchProjectCriFieldset = {
            xtype: 'fieldset',
            title: '<h5>' + TextLabel.criterionLabel + '</h5>',
            border: false,
            defaultType: 'field',
            defaults: {
                labelWidth: 220,
                allowBlank: false,
                labelAlign: 'right'
            },
            bodyPadding: 10,
            items: [{
                xtype: 'combo',
                id: 'projectID',
                name: 'projectID',
                fieldLabel: TextLabel.projectLabel,
                displayField: 'Display',
                valueField: 'ID',
                forceSelection: true,
                minChars: 1,
                triggerAction: 'all',
                queryMode: 'local',
                allowBlank: true,
                editable: true,
                value: -1,
                initialValue: -1,
                store: self.projectStore,
                width: '80%',
                anyMatch: true,
                listConfig: { itemTpl: highlightMatch.createItemTpl('Display', 'projectID') }
            },
            {
                xtype: 'fieldcontainer',
                fieldLabel: TextLabel.dateRangeLabel,
                name: 'dateBetween',
                layout: 'hbox',
                items: [{
                    xtype: 'datefield',
                    id: 'fromStartTimesheet',
                    name: 'fromStartTimesheet',
                    fieldLabel: '',
                    width: 120,
                    format: "d/m/Y",
                    editable: false,
                    value: self.firstDayOfWeek,
                    maxValue: self.toDay,
                    listeners: {
                        select: function (field, value, eOpts) {
                            Ext.getCmp('toStartTimesheet').setMinValue(value);
                        }
                    }
                }, {
                    xtype: 'displayfield',
                    margin: '0 5 0 5',
                    value: '-'
                }, {
                    xtype: 'datefield',
                    id: 'toStartTimesheet',
                    name: 'toStartTimesheet',
                    fieldLabel: '',
                    width: 120,
                    format: "d/m/Y",
                    editable: false,
                    value: self.toDay,
                    minValue: self.firstDayOfWeek,
                    maxValue: self.toDay,
                    listeners: {
                        select: function (field, value, eOpts) {
                            Ext.getCmp('fromStartTimesheet').setMaxValue(value);
                        }
                    }
                }, {
                    xtype: 'displayfield',
                    margin: '0 5 0 5',
                    value: '(วันอาทิตย์ - วันนี้ ของสัปดาห์ปัจจุบัน)'
                }]
            }]
        };

        Ext.apply(self, {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            border: 0,
            defaults: {
                frame: false,
                split: false
            },
            items: [{
                xtype: 'form',
                id: 'searchTimesheetForm',
                title: '',
                region: 'north',
                //height: 160,
                collapsible: false,
                bodyPadding: "0 20 0 20",
                items: [searchProjectCriFieldset],
                buttonAlign: 'center',
                buttons: [
                    {
                        text: '<i class="glyphicon glyphicon-search"></i> ' + TextLabel.searchCmdLabel,
                        handler: function (btn) {
                            searchTimesheet();
                        }
                    }, {
                        text: '<i class="glyphicon glyphicon-trash"></i> ' + TextLabel.clearCmdLabel,
                        handler: function (btn) {
                            var form = Ext.getCmp('searchTimesheetForm').getForm();
                            form.reset();

                            setDefault();
                            searchTimesheet();
                        }
                    }
                ]
            }, {
                xtype: 'gridpanel',
                autoScroll: true,
                store: self.timesheetStore,
                height: AppConfig.height - 360,
                columns: {
                    items: [
                        {
                            xtype: 'rownumberer',
                            width: 30,
                            locked: true
                        }, {
                            xtype: 'actioncolumn',
                            width: 60,
                            items: [{
                                // Use a URL in the icon config
                                xtype: 'button',
                                tooltip: TextLabel.editCmdLabel,
                                iconCls: 'edit-icon',
                                handler: function (grid, rowIndex, colIndex, item, event, record, row) {
                                    grid.getSelectionModel().select(record);
                                    var editForm = Ext.create('widget.timesheetWindow', {
                                        title: TextLabel.editCmdLabel + 'ข้อมูล' + TextLabel.timesheetLabel,
                                        iconCls: 'edit-icon',
                                        animateTarget: row,
                                        modal: true,
                                        toDay: self.toDay,
                                        projectStore: self.projectStore,
                                        timesheetStore: self.timesheetStore,
                                        phaseStore: self.phaseStore,
                                        taskTypeStore: self.taskTypeStore,
                                        mainTaskStore: self.mainTaskStore,
                                        editData: record
                                    });

                                    editForm.setValues(record);
                                    editForm.show();
                                }
                            }, {
                                iconCls: 'delete-icon',
                                tooltip: TextLabel.deleteCmdLabel,
                                xtype: 'button',
                                handler: function (grid, rowIndex, colIndex, item, event, record, row) {
                                    grid.getSelectionModel().select(record);
                                    Ext.MessageBox.confirm('ยืนยัน', 'คุณต้องการลบข้อมูลนี้ใช่ หรือ ไม่?',
                                    function (btn) {
                                        if (btn === "yes") {
                                            Ext.MessageBox.wait("กำลังลบข้อมูล...", 'กรุณารอ');
                                            record.erase({
                                                success: function (record, operation) {
                                                    self.timesheetStore.load();
                                                    Ext.MessageBox.show({
                                                        title: TextLabel.successTitle,
                                                        msg: 'ลบข้อมูลเสร็จสมบูรณ์',
                                                        //width: 300,
                                                        buttons: Ext.MessageBox.OK,
                                                        icon: Ext.MessageBox.INFO,
                                                        fn: function (btn) {
                                                        }
                                                    });
                                                },
                                                failure: function (record, operation) {
                                                    self.timesheetStore.load();
                                                }
                                            });
                                        }
                                    });
                                }
                            }]
                        },
                        { text: 'ID', dataIndex: 'ID', hidden: true },
                        { text: TextLabel.projectCodeLabel, dataIndex: 'ProjectCode', width: 150 },
                        { text: TextLabel.projectNameLabel, dataIndex: 'ProjectName', width: 250},
                        { text: TextLabel.timesheetStartDateLabel, dataIndex: 'StartDateText', width: 110, align: 'center' },
                        { text: TextLabel.projectPhaseLabel, dataIndex: 'Phase', width: 230 },
                        { text: TextLabel.taskTypeLabel, dataIndex: 'TaskType', width: 120, align: 'center' },
                        { text: TextLabel.mainTaskLabel, dataIndex: 'MainTaskDesc', width: 120 },
                        {
                            text: TextLabel.hourUsedLabel, dataIndex: 'HourUsed', flex: 1, align: 'right',
                            renderer: function (value, metaData, record, rowIdx, colIdx, store) {
                                // Sample value: msimms & Co. "like" putting <code> tags around your code

                                var isOT = record.get('IsOT');
                                if (isOT) {
                                    value = Ext.String.htmlEncode(value);

                                    // "double-encode" before adding it as a data-qtip attribute
                                    metaData.tdAttr = 'data-qtip="เป็นช่วงเวลางาน OT"';
                                    metaData.style = "color:red;";
                                }
                                return value;
                            }
                        }
                    ],
                    defaults: {
                        sortable: false,
                        menuDisabled: true,
                        renderer: function (value, metaData, record, rowIdx, colIdx, store) {
                            if (value) {
                                value = Ext.String.htmlEncode(value);
                                // "double-encode" before adding it as a data-qtip attribute
                                metaData.tdAttr = 'data-qtip="' + Ext.String.htmlEncode(value) + '"';
                            }
                            return value;
                        }
                    }
                },
                tbar: [{
                    cls: 'btn',
                    xtype: 'button',
                    iconCls: 'add-icon',
                    text: TextLabel.addTimesheetCmdLabel,
                    handler: function (btn, evt) {
                        var addForm = Ext.create('widget.timesheetWindow', {
                            iconCls: 'add-icon',
                            title: TextLabel.addTimesheetCmdLabel,
                            animateTarget: btn,
                            modal: true,
                            toDay: self.toDay,
                            projectStore: self.projectStore,
                            timesheetStore: self.timesheetStore,
                            phaseStore: self.phaseStore,
                            taskTypeStore: self.taskTypeStore,
                            mainTaskStore: self.mainTaskStore
                        });
                        addForm.show();
                    }
                }],
                // paging bar on the bottom
                bbar: Ext.create('Ext.PagingToolbar', {
                    displayInfo: true,
                    store: self.timesheetStore,
                    displayMsg: TextLabel.timesheetLabel + ' ที่กำลังแสดงอยู่ {0} - {1} of {2}',
                    emptyMsg: "ไม่มี " + TextLabel.timesheetLabel
                })
            }]
        });

        self.callParent();
    }
});