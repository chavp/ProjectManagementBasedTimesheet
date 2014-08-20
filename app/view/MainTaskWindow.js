Ext.define(document.appName + '.view.MainTaskWindow', {
    extend: 'Ext.window.Window',
    xtype: 'mainTaskWindow',
    width: 500,
    title: TextLabel.addMainTaskCmdLabel,
    resizable: false,
    closable: false,
    config: {
        editData: null,
        mainTaskStore: null
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
                    var saveData = Ext.create('widget.mainTask', {
                        ID: vals.ID,
                        Name: vals.Name
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
                                    if (self.mainTaskStore) {
                                        self.mainTaskStore.load();
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
            fieldLabel: TextLabel.mainTaskNameLabel + ' <span class="required">*</span>',
            itemId: 'Name',
            name: 'Name',
            //colspan: 1,
            maxLength: 100
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
            },
            textName],
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