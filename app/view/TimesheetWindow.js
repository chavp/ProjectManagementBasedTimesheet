Ext.define(document.appName + '.view.TimesheetWindow', {
    extend: 'Ext.window.Window',
    xtype: 'timesheetWindow',
    width: 700,
    title: 'เพิ่ม' + TextLabel.timesheetLabel,
    resizable: false,
    closable: false,
    config: {
        editData: null,
        timesheetStore: null,
        projectStore: null,

        phaseStore: null,
        taskTypeStore: null,
        mainTaskStore: null,
        toDay: ''
    },
    initComponent: function () {
        var me = this;
        //console.log(me.id);
        me.saveTextAction = TextLabel.saveActionText;

        var projectCodeLabel = TextLabel.projectLabel + ' <span class="required">*</span>';

        var showProjectCombo = true;
        var projectDisplay = "";
        if (me.editData) {
            me.title = "แก้ไข" + TextLabel.timesheetLabel;
            //me.saveTextAction = '<i class="glyphicon glyphicon-floppy-disk"></i> บันทึกข้อมูล / Save';
            projectCodeLabel = TextLabel.projectLabel;
            projectDisplay = me.editData.data.ProjectCode + "(" + me.editData.data.ProjectName + ")";

            showProjectCombo = false;
        }

        me.projectStore.clearFilter();
        me.projectStore.filter([
            { filterFn: function (item) { return item.get("ID") > -1; } }
        ]);

        var closeForm = function () {
            me.projectStore.clearFilter();
            me.close();
        }

        var cancleAction = Ext.create('Ext.Action', {
            //iconCls: 'add-button',
            text: TextLabel.cancleActionText,
            disabled: false,
            handler: function (widget, event) {
                closeForm();
            }
        });

        var addAction = Ext.create('Ext.Action', {
            //iconCls: 'add-button',
            text: me.saveTextAction,
            disabled: false,
            handler: function (widget, event) {
                var form = me.down('form');

                if (!form.isValid()) {
                    Ext.MessageBox.show({
                        title: TextLabel.validationTitle,
                        msg: TextLabel.validationWarning,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.WARNING
                    });

                    return false;
                }
                if (form.isValid()) {

                    var vals = form.getValues();
                    var projectID = form.getComponent('ProjectCode').getValue();
                    var startDate = Ext.Date.format(form.getComponent('StartDate').getValue(), 'd/m/Y');
                    var phaseID = form.getComponent('Phase').getValue();
                    var taskTypeID = form.getComponent('TaskType').getValue();
                    var mainTaskDesc = form.getComponent('MainTask').getRawValue();

                    var saveData = Ext.create('widget.timesheet', {
                        ID: vals.ID,
                        ProjectID: projectID,
                        StartDateText: startDate,
                        PhaseID: phaseID,
                        TaskTypeID: taskTypeID,
                        MainTaskDesc: mainTaskDesc,
                        SubTaskDesc: vals.SubTaskDesc,
                        HourUsed: vals.HourUsed,
                        IsOT: vals.IsOT
                    });

                    Ext.MessageBox.wait("กำลังบันทึกข้อมูล...", 'กรุณารอ');

                    saveData.save({
                        success: function (record, operation) {
                            Ext.MessageBox.show({
                                title: TextLabel.successTitle,
                                msg: 'บันทึกข้อมูลเสร็จสมบูรณ์',
                                //width: 300,
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.INFO,
                                fn: function (btn) {
                                    me.timesheetStore.load();
                                    if (me.editData) {
                                        closeForm();
                                    } else {
                                        form.reset();
                                    }
                                }
                            });
                        },
                        failure: function (record, operation) {

                        }
                    });
                }
            }
        });

        //console.log(paramsView.maxDateText);

        var hourUsedStore = Ext.create('Ext.data.Store', {
            fields: ['value', 'text'],
            data: []
        });
        for (var i = 0.5; i <= 24; i += 0.5) {
            hourUsedStore.add({
                value: i,
                text: i
            });
        }

        var cmbProjectCodeId = me.id + '-ProjectCode';
        var cmbMainTaskId = me.id + '-MainTask';

        me.items = [{
            xtype: 'form',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            frame: false,
            width: '100%',
            border: 0,
            bodyStyle: 'padding: 6px',
            fieldDefaults: {
                labelWidth: 200,
                allowBlank: false,
                labelAlign: 'right'
            },
            items: [{
                id: 'ID',
                name: 'ID',
                xtype: 'textarea',
                allowBlank: true,
                hidden: true
            }, {
                xtype: 'displayfield',
                itemId: 'Project',
                fieldLabel: TextLabel.projectLabel,
                fieldStyle: 'font-weight: bold;',
                value: projectDisplay,
                hidden: showProjectCombo
            }, {
                xtype: 'combo',
                id: cmbProjectCodeId,
                itemId: 'ProjectCode',
                name: 'ProjectID',
                store: me.projectStore,
                queryMode: 'local',
                displayField: 'Display',
                valueField: 'ID',
                forceSelection: true,
                minChars: 1,
                fieldLabel: projectCodeLabel,
                emptyText: TextLabel.requireInputEmptyText,
                editable: true,
                disabled: (me.editData),
                hidden: !showProjectCombo,
                anyMatch: true,
                selectOnFocus: true,
                listConfig: { itemTpl: highlightMatch.createItemTpl('Display', cmbProjectCodeId) }
            }, {
                xtype: 'datefield',
                itemId: 'StartDate',
                name: 'StartDate',
                margin: '0 350 7 0',
                fieldLabel: TextLabel.timesheetStartDateLabel + ' <span class="required">*</span>',
                format: "d/m/Y",
                value: new Date(),
                maxValue: me.toDay,
                editable: false
            }, {
                xtype: 'combo',
                itemId: 'Phase',
                name: 'PhaseID',
                store: me.phaseStore,
                queryMode: 'local',
                displayField: 'Name',
                valueField: 'ID',
                fieldLabel: TextLabel.projectPhaseLabel + ' <span class="required">*</span>',
                emptyText: TextLabel.requireSelectEmptyText,
                editable: false
            }, {
                xtype: 'combo',
                itemId: 'TaskType',
                name: 'TaskTypeID',
                store: me.taskTypeStore,
                queryMode: 'local',
                displayField: 'Name',
                valueField: 'ID',
                fieldLabel: TextLabel.taskTypeLabel + ' <span class="required">*</span>',
                emptyText: TextLabel.requireSelectEmptyText,
                value: 1,
                editable: false
            }, {
                xtype: 'combo',
                id: cmbMainTaskId,
                itemId: 'MainTask',
                name: 'MainTaskDesc',
                store: me.mainTaskStore,
                queryMode: 'local',
                displayField: 'Name',
                valueField: 'ID',
                fieldLabel: TextLabel.mainTaskLabel + ' <span class="required">*</span>',
                emptyText: TextLabel.requireInputEmptyText,
                minChars: 1,
                editable: true,
                anyMatch: true,
                listConfig: { itemTpl: highlightMatch.createItemTpl('Name', cmbMainTaskId) }
            }, {
                xtype: 'textarea',
                itemId: 'SubTaskDesc',
                name: 'SubTaskDesc',
                height : 200,
                fieldLabel: TextLabel.subTaskLabel + ' <span class="required">*</span>',
                emptyText: TextLabel.requireInputEmptyText
            },
            {
                xtype: 'fieldcontainer',
                layout: 'hbox',
                defaultType: 'textfield',
                defaults: {
                    //labelWidth: 100,
                    allowBlank: false,
                    labelAlign: 'right'
                },
                items: [{
                    xtype: 'combo',
                    name: 'HourUsed',
                    id: 'HourUsed',
                    fieldLabel: TextLabel.hourUsedLabel + ' <span class="required">*</span>',
                    emptyText: TextLabel.requireInputEmptyText,
                    //margin: '0 400 7 0',
                    forceSelection: true,
                    store: hourUsedStore,
                    queryMode: 'local',
                    displayField: 'text',
                    valueField: 'value',
                    editable: true,
                    fieldCls: 'a-form-num-field'
                }, {
                    xtype: 'checkbox',
                    margin: '0 0 0 10',
                    name: 'IsOT',
                    id: 'IsOT',
                    inputValue: true,
                    boxLabel: TextLabel.timesheetOTLabel
                }]
            }],
            //buttonAlign: 'center',
            buttons: [
                new Ext.button.Button(addAction),
                new Ext.button.Button(cancleAction)
            ]
        }];

        me.callParent();
    },

    setFocusProject: function () {
        Ext.getCmp('ProjectCode').focus();

    },

    setValues: function (record) {
        var form = this.down('form').getForm();
        form.loadRecord(record);
    }
});