Ext.define(document.appName + '.view.customer.CustomerWindow', {
    extend: 'Ext.window.Window',
    xtype: 'customerWindow',
    width: 500,
    title: TextLabel.addCustomerCmdLabel,
    resizable: false,
    closable: false,
    config: {
        editData: null,
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
                    var vals = form.getValues();
                    //console.log(vals);
                    Ext.MessageBox.wait("กำลังบันทึกข้อมูล...", 'กรุณารอ');
                    var model = form.getRecord();
                    var saveData = Ext.create('widget.customer', {
                        ID: vals.ID,
                        Name: vals.Name,
                        ContactChannel: vals.ContactChannel
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
                                    if (self.customerStore) {
                                        self.customerStore.load();
                                    }
                                    if (self.editData) {
                                        self.close();
                                    } else {
                                        form.reset();
                                        self.textName.focus(false, 200);
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

        var textName = Ext.create('widget.textfield', {
            fieldLabel: TextLabel.customerNameLabel + ' <span class="required">*</span>',
            itemId: 'Name',
            name: 'Name',
            //colspan: 1,
            maxLength: 255
        });
        self.textName = textName;

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
                itemId: 'ID',
                name: 'ID',
                allowBlank: true,
                hidden: true
            }, textName, {
                xtype: 'textarea',
                itemId: 'ContactChannel',
                name: 'ContactChannel',
                height: 200,
                fieldLabel: TextLabel.customerContactChannelLabel,
                emptyText: "ตัวอย่าง: ที่อยู่, เบอร์โทรติดต่อ, email, fax, facebook, website",
                allowBlank: true
            }],
            buttons: [
                new Ext.button.Button(addAction),
                new Ext.button.Button(CommandActionBuilder.cancleAction(self))
            ]
        }];

        self.callParent();
    },

    listeners: {
        show: function () {

            this.textName.focus(false, 200);
        }
    },

    setValues: function (record) {
        //console.log(record);
        var form = this.down('form').getForm();
        form.loadRecord(record);
    }
});