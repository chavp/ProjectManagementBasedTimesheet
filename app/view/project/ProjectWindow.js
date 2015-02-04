Ext.define(document.appName + '.view.project.ProjectWindow', {
    extend: 'Ext.window.Window',
    xtype: 'projectWindow',
    width: 780,
    title: '<i class="glyphicon glyphicon-plus"></i> เพิ่มโปรเจ็ค',
    resizable: false,
    closable: false,
    config: {
        editData: null,
        projectStore: null,
        projectTimesheetStore: null,
        customerStore: null
    },

    initComponent: function () {
        var self = this;

        var requireSymbol = ' <span class="required">*</span>';
        var requireInputEmptyText = TextLabel.requireInputEmptyText;
        if (self.getReadOnly()) {
            requireSymbol = '';
            requireInputEmptyText = '';
        }
        var addAction = Ext.create('Ext.Action', {
            //iconCls: 'add-button',
            text: TextLabel.saveActionText,
            hidden: self.getReadOnly(),
            handler: function (widget, event) {
                var form = self.down('form');
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

                    Ext.MessageBox.wait("กำลังบันทึกข้อมูล...", 'กรุณารอ');

                    var vals = form.getValues();
                    //console.log(vals);

                    var startDate = Ext.Date.format(Ext.getCmp('StartDate').getValue(), 'd/m/Y');
                    var endDate = Ext.Date.format(Ext.getCmp('EndDate').getValue(), 'd/m/Y');

                    var saveData = Ext.create('widget.project', {
                        ID: vals.ID,
                        Code: vals.Code,
                        Name: vals.Name,
                        CustomerID: vals.CustomerID,
                        StringStartDate: startDate,
                        StringEndDate: endDate,
                        ProjectStatusID: vals.ProjectStatus,
                        EstimateProjectValue: vals.EstimateProjectValue
                    });

                    //console.log(saveData);
                    saveData.save({
                        success: function (record, operation) {
                            Ext.MessageBox.show({
                                title: TextLabel.successTitle,
                                msg: 'บันทึกข้อมูลเสร็จสมบูรณ์',
                                //width: 300,
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.INFO,
                                fn: function (btn) {
                                    self.projectStore.load();
                                    if (self.projectTimesheetStore) {
                                        self.projectTimesheetStore.load();
                                    }
                                    if (self.editData) {
                                        self.close();
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

        var cmbCustomerID = self.id + '-CustomerID';

        var customerNameDisplay = Ext.create('widget.displayfield', {
            itemId: 'CustomerName',
            name: 'CustomerName',
            fieldLabel: TextLabel.customerLabel,
            width: '95%',
            readOnly: self.getReadOnly(),
            hidden: !self.getReadOnly()
        });
        self.customerNameDisplay = customerNameDisplay;

        var projectStatusNameDisplay = Ext.create('widget.displayfield', {
            itemId: 'ProjectStatusName',
            name: 'ProjectStatusName',
            fieldLabel: TextLabel.projectStatusLabel,
            width: '95%',
            readOnly: self.getReadOnly(),
            hidden: !self.getReadOnly()
        });
        self.projectStatusNameDisplay = projectStatusNameDisplay;

        var startDateDisplay = Ext.create('widget.displayfield', {
            itemId: 'StartDateDisplay',
            name: 'StartDateDisplay',
            width: 75,
            readOnly: self.getReadOnly(),
            hidden: !self.getReadOnly()
        });
        self.startDateDisplay = startDateDisplay;

        var endDateDisplay = Ext.create('widget.displayfield', {
            itemId: 'EndDateDisplay',
            name: 'EndDateDisplay',
            width: 90,
            readOnly: self.getReadOnly(),
            hidden: !self.getReadOnly()
        });
        self.endDateDisplay = endDateDisplay;

        var textboxXType = 'textfield';
        var numfieldXType = 'numberfield';
        if (self.getReadOnly()) {
            textboxXType = 'displayfield';
        }
        self.items = [{
            xtype: 'panel',
            items: [{
                xtype: 'form',
                layout: {
                    type: 'vbox'
                },
                frame: false,
                border: 0,
                bodyStyle: 'padding: 6px',
                defaultType: textboxXType,
                fieldDefaults: {
                    labelWidth: 200,
                    allowBlank: false,
                    labelAlign: 'right'
                },
                items: [{
                    id: 'ID',
                    name: 'ID',
                    allowBlank: true,
                    hidden: true
                }, {

                    fieldLabel: TextLabel.projectCodeLabel + requireSymbol,
                    id: 'Code',
                    name: 'Code',
                    validFlag: true,
                    width: 400,
                    minLength: 4,
                    maxLength: 50,
                    validator: function () {
                        return this.validFlag;
                    },
                    listeners: {
                        'change': function (textfield, newValue, oldValue) {
                            var me = this;
                            newValue = newValue.toUpperCase();
                            me.setRawValue(newValue);
                        }
                    },
                    readOnly: self.getReadOnly()
                }, {
                    xtype: 'numberfield',
                    fieldLabel: TextLabel.estimateProjectValueLabel,
                    id: 'EstimateProjectValue',
                    name: 'EstimateProjectValue',
                    allowBlank: true,
                    maxLength: 15,
                    forcePrecision: true,
                    decimalPrecision: 2,
                    useThousandSeparator: true,
                    fieldCls: 'a-form-num-field',
                    width: '61%',
                    step: 100000,
                    listeners: {
                        blur: function (field) {
                            field.setRawValue(Ext.util.Format.number(field.getValue(), '0,000.00'));
                        }
                    },
                    readOnly: self.getReadOnly(),
                    hidden: self.getReadOnly()
                }, {
                    fieldLabel: TextLabel.projectNameLabel + requireSymbol,
                    id: 'Name',
                    name: 'Name',
                    maxLength: 255,
                    width: '95%',
                    readOnly: self.getReadOnly()
                },
                //, {
                //    fieldLabel: 'ชื่อลูกค้า <span class="required">*</span>',
                //    id: 'CustomerName',
                //    name: 'CustomerName',
                //    width: '95%',
                //    allowBlank: false
                //}
                {
                    xtype: 'combo',
                    id: cmbCustomerID,
                    itemId: 'CustomerID',
                    name: 'CustomerID',
                    store: self.customerStore,
                    queryMode: 'local',
                    displayField: 'Name',
                    valueField: 'ID',
                    fieldLabel: TextLabel.customerLabel + requireSymbol,
                    emptyText: requireInputEmptyText,
                    minChars: 1,
                    editable: true,
                    anyMatch: true,
                    forceSelection: true,
                    width: '95%',
                    listConfig: { itemTpl: highlightMatch.createItemTpl('Name', cmbCustomerID) },
                    readOnly: self.getReadOnly(),
                    hidden: self.getReadOnly(),
                    listeners: {
                        change: function (cmb, newValue, oldValue, opts) {
                            self.customerNameDisplay.setValue(cmb.getRawValue());
                        }
                    }
                },
                customerNameDisplay,
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: TextLabel.projectContractStartEndDateLabel,
                    id: 'startDateBetween',
                    name: 'startDateBetween',
                    layout: 'hbox',
                    items: [{
                        xtype: 'datefield',
                        id: 'StartDate',
                        name: 'StartDate',
                        width: 130,
                        //fieldLabel: 'วันที่เริ่มต้นโครงการ / Project Start Date',
                        format: "d/m/Y",
                        allowBlank: true,
                        editable: false,
                        listeners: {
                            change: function (field, value, eOpts) {
                                Ext.getCmp('EndDate').setMinValue(value);
                                self.startDateDisplay.setValue(field.getRawValue());
                            }
                        },
                        readOnly: self.getReadOnly(),
                        hidden: self.getReadOnly()
                    },
                    startDateDisplay,
                    {
                        xtype: 'displayfield',
                        margin: '0 5 0 5',
                        value: '-'
                    }, {
                        xtype: 'datefield',
                        id: 'EndDate',
                        name: 'EndDate',
                        width: 130,
                        //fieldLabel: 'วันที่สิ้นสุดโครงการ / Project End Date',
                        format: "d/m/Y",
                        allowBlank: true,
                        editable: false,
                        listeners: {
                            change: function (field, value, eOpts) {
                                Ext.getCmp('StartDate').setMaxValue(value);
                                self.endDateDisplay.setValue(field.getRawValue());
                            }
                        },
                        readOnly: self.getReadOnly(),
                        hidden: self.getReadOnly()
                    },
                    endDateDisplay]
                }, {
                    xtype: 'combo',
                    fieldLabel: TextLabel.projectStatusLabel,
                    id: 'ProjectStatus',
                    name: 'ProjectStatus',
                    margin: '5 0 0 0',
                    //width: '100%',
                    //colspan: 2,
                    queryMode: 'local',
                    displayField: 'Name',
                    valueField: 'ID',
                    emptyText: TextLabel.requireInputEmptyText,
                    store: 'ProjectStatusStore',
                    //labelWidth: 100,
                    value: 1,
                    //width: '50%',
                    //forceSelection: true,
                    editable: false,
                    readOnly: self.getReadOnly(),
                    hidden: self.getReadOnly(),
                    listeners: {
                        change: function (cmb, newValue, oldValue, opts) {
                            self.projectStatusNameDisplay.setValue(cmb.getRawValue());
                        }
                    }
                },
                projectStatusNameDisplay],
                buttons: [
                    new Ext.button.Button(addAction),
                    new Ext.button.Button(CommandActionBuilder.cancleAction(self))
                ]
            }]
        }];

        self.callParent();
    },

    listeners: {
        show: function () {
            if (this.isManager) {
                Ext.getCmp('Code').focus(false, 200);
            }
        }
    },

    setValues: function (record) {
        var form = this.down('form').getForm();
        form.loadRecord(record);
        //console.log(record);
        Ext.getCmp('ProjectStatus').setValue(record.data.ProjectStatusID);
    },

    getReadOnly: function () {
        return LoginToken.roles.indexOf('Manager') >= 0;
    }
});