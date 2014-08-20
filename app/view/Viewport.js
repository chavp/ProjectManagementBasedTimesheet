Ext.define(document.appName + '.view.Viewport', {
    extend: 'Ext.container.Viewport',
    layout: 'fit',

    stateful: true,
    stateId: 'pbm-viewport',
    monitorResize: true,

    initComponent: function () {
        var self = this;
        var headerHtml = '<img src="' + document.logoFilePath + '" />';

        //console.log(LoginToken.isAuthenticated);

        //LoginToken.isAuthenticated = true;
        //console.log(LoginToken.roles);
        if (LoginToken.isAuthenticated) {
            self.items = {
                xtype: 'panel',
                layout: 'border',

                items: [{
                    region: 'north',
                    xtype: 'panel',
                    layout: 'border',
                    height: 80,

                    items: [{
                        region: 'west',
                        width: 285,
                        html: headerHtml
                    }, {
                        xtype: 'panel',
                        region: 'center',
                        tbar: ['->', {
                            xtype: 'tbtext',
                            text: '<i class="glyphicon glyphicon-user"></i>: ' + LoginToken.userName
                        }, '-', {
                            xtype: 'tbtext',
                            text: '<strong>ตำแหน่ง</strong>: ' + LoginToken.position + ' [' + LoginToken.roles + ']'
                        }, '-', {
                            xtype: 'tbtext',
                            text: '<button class="btn btn-info" id="cmdChangePassword" title="เปลี่ยน Password"><i class="glyphicon glyphicon-lock"></i>&nbsp;เปลี่ยนรหัสผ่าน</button>'
                        }, {
                            xtype: 'tbtext',
                            text: "<button id='cmdLogOff' class='btn btn-danger'><i class='glyphicon glyphicon-log-out'></i>&nbsp;ออกจากระบบ</button>"
                        }]
                    }]
                }, {
                    region: 'center',
                    xtype: 'navigation-tabs'
                }, {
                    region: 'south',
                    title: '',
                    html: '<div class="container corp-footer-name">© 2014 PABOONMA CREATIVE SOLUTIONS CO.,LTD.</div>'
                }]
            };
        } else {

            var doLogin = function (widget, event) {
                var from = widget.up('form');

                var loginModel = {
                    UserName: Ext.getCmp('login-username').getValue(),
                    Password: Ext.getCmp('login-password').getValue()
                };

                if (!from.isValid()) {
                    Ext.MessageBox.show({
                        title: TextLabel.validationTitle,
                        msg: TextLabel.validationWarning,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.WARNING,
                        fn: function (btn) {
                            if (loginModel.UserName === "") {
                                Ext.getCmp('login-username').focus(false, 200);
                            }
                            else if (loginModel.Password === "") {
                                Ext.getCmp('login-password').focus(false, 200);
                            }
                            
                        }
                    });

                    return false;
                }
                from.setLoading('กำลังเข้าระบบ...');
                from.submit({
                    url: document.urlAppApi + '/Login',
                    success: function (form, action) {
                        from.setLoading(false);
                        window.location.href = document.urlAppRoot;
                    },
                    failure: function (form, action) {
                        Ext.MessageBox.show({
                            title: TextLabel.errorAlertTitle,
                            msg: 'การเข้าระบบล้มเหลว ' + action.respose.message,
                            //width: 300,
                            buttons: Ext.MessageBox.OK,
                            //animateTarget: from,
                            icon: Ext.MessageBox.ERROR
                        });
                    }
                    //,
                    //failure: function (form, action) {
                    //    from.setLoading(false);
                    //    var respose = action.result;
                    //    Ext.MessageBox.show({
                    //        title: TextLabel.errorAlertTitle,
                    //        msg: "เกิดข้อผิดพลาดในการเข้าระบบ " + respose.message,
                    //        //width: 300,
                    //        buttons: Ext.MessageBox.OK,
                    //        //animateTarget: from,
                    //        icon: Ext.MessageBox.ERROR
                    //    });
                    //}
                });
                //Ext.Ajax.request({
                //    url: document.urlAppApi + '/Login',
                //    success: function (transport) {
                //        from.setLoading(false);
                //        var respose = Ext.decode(transport.responseText);
                //        if (respose.success) {
                //            window.location.href = document.urlAppRoot;
                //        } else {
                //            Ext.MessageBox.show({
                //                title: TextLabel.errorAlertTitle,
                //                msg: 'การเข้าระบบล้มเหลว ' + respose.message,
                //                //width: 300,
                //                buttons: Ext.MessageBox.OK,
                //                //animateTarget: from,
                //                icon: Ext.MessageBox.ERROR
                //            });
                //        }
                //    },
                //    failure: function (transport) {
                //        from.setLoading(false);
                //        Ext.MessageBox.show({
                //            title: TextLabel.errorAlertTitle,
                //            msg: "เกิดข้อผิดพลาดในการเข้าระบบ " + transport.responseText,
                //            //width: 300,
                //            buttons: Ext.MessageBox.OK,
                //            //animateTarget: from,
                //            icon: Ext.MessageBox.ERROR
                //        });
                //    },
                //    jsonData: loginModel
                //});
            }

            self.items = {
                xtype: 'panel',
                layout: 'border',
                items: [{
                    region: 'north',
                    xtype: 'panel',
                    layout: 'border',
                    height: 110,

                    items: [{
                        region: 'west',
                        width: 285,
                        html: headerHtml
                    }, {
                        xtype: 'panel',
                        region: 'center',
                        tbar: ['->']
                    }, {
                        region: 'south',
                        xtype: 'panel',
                        items: [{ xtype: 'tabpanel' }]
                    }]
                }, {
                    region: 'center',
                    xtype: 'panel',
                    layout: {
                                type: 'vbox',
                                align: 'center'
                    }, layout: {
                        type: 'vbox',
                        align: 'center'
                    },
                    items: [{
                        xtype: 'form',
                        autoEl: {
                            tag: 'form',
                            action: document.urlAppApi + '/LogOff',
                            method: 'post'
                        },
                        items: [{
                            xtype: 'fieldset',
                            title: 'กรุณาระบุข้อมูล',
                            defaultType: 'textfield',
                            fieldDefaults: {
                                allowBlank: false,
                                width: 300
                            },
                            items: [{
                                vtype: 'email',
                                id: 'login-username',
                                name: 'UserName',
                                fieldLabel: '',
                                emptyText: 'อีเมล์พนักงาน',
                                inputAttrTpl: [
                                    "autocomplete=\"on\""
                                ],
                                listeners: {
                                    specialkey: function (field, e) {
                                        if (e.getKey() == e.ENTER) {
                                            doLogin(field, e);
                                        }
                                    }
                                }
                            }, {
                                id: 'login-password',
                                name: 'Password',
                                fieldLabel: '',
                                emptyText: 'รหัสเข้าระบบ',
                                inputType: 'password',
                                listeners: {
                                    specialkey: function (field, e) {
                                        if (e.getKey() == e.ENTER) {
                                            doLogin(field, e);
                                        }
                                    }
                                }
                            }]
                        }],
                        buttonAlign: 'center',
                        buttons: [{
                            text: '<i class="glyphicon glyphicon-log-out"></i>&nbsp;เข้าระบบ',
                            width: '100%',
                            handler: function (widget, event) {
                                doLogin(widget, event);
                            }
                        }]
                    }]
                }, {
                    region: 'south',
                    title: '',
                    html: '<div class="container corp-footer-name">© 2014 PABOONMA CREATIVE SOLUTIONS CO.,LTD.</div>'
                }]
            };
        }

        self.callParent();
    },

    listeners: {
        afterrender: function (vPort, eOpts) {
            $('#cmdLogOff').click(function (e) {
                vPort.setLoading('กำลังออกจากระบบ...');
                $.post(document.urlAppApi + '/LogOff', function () {
                    window.location.href = document.urlAppRoot;
                }).fail(function () {
                    Ext.MessageBox.show({
                        title: TextLabel.errorAlertTitle,
                        msg: 'เกิดข้อผิดพลาดในขั้นตอนเชื่อต่อระบบ',
                        //width: 300,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR,
                        fn: function (btn) {
                            window.location.href = document.urlAppRoot;
                        }
                    });

                });
            });

            var $cmdChangePassword = $('#cmdChangePassword');
            $cmdChangePassword.click(function (e) {
                e.preventDefault();
                var self = this;

                var popup = Ext.create('widget.userChangePasswordWindow', {
                    animateTarget: self,
                    modal: true
                });
                var offset = $(self).offset();
                popup.showAt(offset.left - popup.width + $cmdChangePassword.width() + 30, offset.top);
                //popup.show();
            });

            if (!LoginToken.isAuthenticated) {
                //console.log(Ext.util.Cookies.get('aut-bpm-timesheet'));

                Ext.getCmp('login-username').focus(false, 200);
            }
        }
    }
});
