Ext.define(document.appName + '.view.DepartmentWindow', {
    extend: 'Ext.window.Window',
    xtype: 'departmentWindow',
    width: 500,
    title: 'เพิ่มแผนก',
    resizable: false,
    closable: false,
    config: {
        editData: null,
        departmentStore: null,
        departmentTreeStore: null
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
                    var vals = form.getValues();
                    //console.log(vals);
                    Ext.MessageBox.wait("กำลังบันทึกข้อมูล...", 'กรุณารอ');
                    var model = form.getRecord();
                    var saveData = Ext.create('widget.department', {
                        ID: vals.DepartmentID,
                        NameTH: vals.Department,
                        NameEN: vals.Department
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
                                    if (self.departmentTreeStore) {
                                        self.departmentTreeStore.load();
                                    }
                                    if (self.departmentStore) {
                                        self.departmentStore.load();
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
                labelWidth: 120,
                allowBlank: false,
                labelAlign: 'right'
            },
            items: [{
                id: 'DepartmentID',
                name: 'DepartmentID',
                allowBlank: true,
                hidden: true
            }, {
                fieldLabel: 'ชื่อแผนก <span class="required">*</span>',
                id: 'Department',
                name: 'Department',
                //colspan: 1,
                maxLength: 100
            }
            //, {
            //    xtype: 'numberfield',
            //    fieldLabel: 'ต้นทุนแผนกต่อวัน',
            //    id: 'ProjectRoleCost',
            //    name: 'ProjectRoleCost',
            //    allowBlank: true,
            //    maxLength: 15,
            //    forcePrecision: true,
            //    decimalPrecision: 2,
            //    useThousandSeparator: true,
            //    fieldCls: 'a-form-num-field',
            //    //padding: '0 100 0 0',
            //    listeners: {
            //        blur: function (field) {
            //            field.setRawValue(Ext.util.Format.number(field.getValue(), '0,000.00'));
            //        }
            //    }
            //}
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
            Ext.getCmp('Department').focus(false, 200);
        }
    },

    setValues: function (record) {
        //console.log(record);
        var form = this.down('form').getForm();
        form.loadRecord(record);
    }
});