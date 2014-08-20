Ext.define(document.appName + '.view.OrganizationPanel', {
    extend: 'Ext.tab.Panel',
    xtype: 'organizationPanel',
    plain: true,
    bodyPadding: 20,
    tabPosition: 'left',

    height: AppConfig.height - 150,

    tabRotation: 0,
    config: {
        departmentStore: null,
        employeeStore: null,
        positionStore: null
    },
    
    defaults: {
        layout: 'fit'
    },

    activeTab: 0,

    initComponent: function () {
        var self = this;

        //var departmentStore = Ext.create('widget.departmentStore', {

        //});

        self.items = [{
            title: '<i class="glyphicon glyphicon-th"></i> ' + TextLabel.departmentLabel,
            items: [{
                xtype: 'departmentPanel',
                departmentStore: self.departmentStore
            }]
        }, {
            title: '<i class="glyphicon glyphicon-hand-right"></i> ' + TextLabel.positionLabel,
            items: [{
                xtype: 'positionPanel',
                positionStore: self.positionStore
            }]
        }, {
            title: '<i class="glyphicon glyphicon-user"></i> ' + TextLabel.empLabel,
            items: [{
                xtype: 'employeePanel',
                employeeStore: self.employeeStore,
                departmentStore: self.departmentStore,
                positionStore: self.positionStore
            }]
        }];

        self.callParent();
    }
});