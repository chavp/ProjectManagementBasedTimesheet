Ext.define(document.appName + '.view.ProjectManagementPanel', {
    extend: 'Ext.tab.Panel',
    xtype: 'projectManagementPanel',
    plain: true,
    tabPosition: 'left',
    tabRotation: 0,
    defaults: {
        layout: 'fit',
        border: 1
    },
    config: {
        projectStore: null,
        customerStore: null,
        phaseStore: null,
        taskTypeStore: null,
        mainTaskStore: null
    },

    activeTab:0,

    requires: [
        'Ext.layout.container.Accordion'
    ],

    initComponent: function () {
        var self = this;

        Ext.apply(self, {
            items: [{
                title: '<i class="glyphicon glyphicon-gift"></i> ' + TextLabel.projectLabel,
                height: AppConfig.height - 140,
                xtype: 'projectPanel',
                projectStore: self.projectStore,
                customerStore: self.customerStore
            }, {
                title: '<i class="glyphicon glyphicon-th"></i> ' + TextLabel.projectActivitiesLabel,
                height: AppConfig.height - 170,
                xtype: 'projectActivitiesPanel',
                phaseStore: self.phaseStore,
                taskTypeStore: self.taskTypeStore,
                mainTaskStore: self.mainTaskStore
            }]
        });

        self.callParent();
    }
});