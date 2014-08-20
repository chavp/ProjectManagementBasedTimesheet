Ext.define(document.appName + '.view.ProjectWindow', {
    extend: 'Ext.window.Window',
    xtype: 'projectWindow',
    width: 780,
    title: '<i class="glyphicon glyphicon-plus"></i> เพิ่มโปรเจ็ค',
    resizable: false,
    closable: false,
    config: {
        editData: null,
        projectStore: null,
        customerStore: null
    },

    initComponent: function () {
        var self = this;

        var addAction = Ext.create('Ext.Action', {
            //iconCls: 'add-button',
            text: TextLabel.saveActionText,
            disabled: false,
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
                defaultType: 'textfield',
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
                    fieldLabel: TextLabel.projectCodeLabel + ' <span class="required">*</span>',
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
                    }
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
                    }
                }, {
                    fieldLabel: TextLabel.projectNameLabel + ' <span class="required">*</span>',
                    id: 'Name',
                    name: 'Name',
                    maxLength: 255,
                    width: '95%'
                }
                //, {
                //    fieldLabel: 'ชื่อลูกค้า <span class="required">*</span>',
                //    id: 'CustomerName',
                //    name: 'CustomerName',
                //    width: '95%',
                //    allowBlank: false
                //}
                , {
                    xtype: 'combo',
                    id: cmbCustomerID,
                    itemId: 'CustomerID',
                    name: 'CustomerID',
                    store: self.customerStore,
                    queryMode: 'local',
                    displayField: 'Name',
                    valueField: 'ID',
                    fieldLabel: TextLabel.customerLabel + ' <span class="required">*</span>',
                    emptyText: TextLabel.requireInputEmptyText,
                    minChars: 1,
                    editable: true,
                    anyMatch: true,
                    forceSelection: true,
                    width: '95%',
                    listConfig: { itemTpl: highlightMatch.createItemTpl('Name', cmbCustomerID) }
                }
                , {
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
                            }
                        }
                    }, {
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
                            }
                        }
                    }]
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
                    editable: false
                }],
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
            Ext.getCmp('Code').focus(false, 200);
        }
    },

    setValues: function (record) {
        var form = this.down('form').getForm();
        form.loadRecord(record);
        //console.log(record);
        Ext.getCmp('ProjectStatus').setValue(record.data.ProjectStatusID);
    }
});