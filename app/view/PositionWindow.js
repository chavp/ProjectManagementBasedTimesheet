Ext.define(document.appName + '.view.PositionWindow', {
    extend: 'Ext.window.Window',
    xtype: 'positionWindow',
    width: 500,
    title: TextLabel.addPositionCmdLabel,
    resizable: false,
    closable: false,
    config: {
        editData: null,
        positionStore: null
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
                        icon: Ext.MessageBox.WARNING,
                        fn: function (btn) {
                            self.setFieldFocus();
                        }
                    });
                    return false;
                }

                if (form.isValid()) {
                    //console.log(vals);
                    Ext.MessageBox.wait("กำลังบันทึกข้อมูล...", 'กรุณารอ');

                    var positionID = form.getComponent('PositionID').getValue();
                    var positionName = form.getComponent('PositionName').getValue();
                    var projectRoleRateCost = form.getComponent('ProjectRoleRateCost').getValue();

                    var saveData = Ext.create('widget.position', {
                        PositionID: positionID,
                        PositionName: positionName,
                        ProjectRoleRateCost: projectRoleRateCost
                    });

                    saveData.save({
                        success: function (record, operation) {
                            Ext.MessageBox.show({
                                title: TextLabel.successTitle,
                                msg: 'บันทึกข้อมูลเสร็จสมบูรณ์',
                                //width: 300,
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.INFO,
                                fn: function (btn) {
                                    if (self.positionStore) {
                                        self.positionStore.load();
                                    }
                                    //self.departmentStore.load();
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

        self.items = [{
            xtype: 'form',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaultType: 'textfield',
            bodyStyle: 'padding: 6px',
            fieldDefaults: {
                labelWidth: 180,
                allowBlank: false,
                labelAlign: 'right'
            },
            items: [{
                itemId: 'PositionID',
                name: 'PositionID',
                allowBlank: true,
                hidden: true
            }
            , {
                fieldLabel: 'ชื่อตำแหน่ง <span class="required">*</span>',
                itemId: 'PositionName',
                name: 'PositionName',
                //colspan: 1,
                maxLength: 100
            }
            , {
                xtype: 'numberfield',
                fieldLabel: TextLabel.positionProjectRoleRateCostLabel,
                itemId: 'ProjectRoleRateCost',
                name: 'ProjectRoleRateCost',
                allowBlank: true,
                maxLength: 13,
                forcePrecision: true,
                decimalPrecision: 0,
                useThousandSeparator: true,
                fieldCls: 'a-form-num-field',
                step : 100,
                //padding: '0 100 0 0',
                listeners: {
                    blur: function (field) {
                        field.setRawValue(Ext.util.Format.number(field.getValue(), '0,000'));//0,000.00
                    }
                }
            }
            ],
            buttons: [
                new Ext.button.Button(addAction),
                new Ext.button.Button(CommandActionBuilder.cancleAction(self))
            ]
        }];

        self.callParent();
    },

    listeners: {
        show: function () {
            this.setFieldFocus();
        }
    },

    setFieldFocus: function () {
        var form = this.down('form');
        form.getComponent('PositionName').focus(false, 200);
    },

    setValues: function (record) {
        //console.log(record);
        var form = this.down('form').getForm();
        form.loadRecord(record);

    }
});