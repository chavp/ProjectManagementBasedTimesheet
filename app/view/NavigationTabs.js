Ext.define(document.appName + '.view.NavigationTabs', {
    extend: 'Ext.panel.Panel',
    xtype: 'navigation-tabs',
    controller: 'navigation-tabs',

    initComponent: function () {
        var self = this;

        Ext.apply(self, {
            items: [{
                id: 'main-tabs',
                xtype: 'tabpanel',
                plain: false,
                frame: false,
                bodyPadding: 15,
                autoScroll: true,
                reference: 'navigation',
                listeners: {
                    tabchange: CommandActionBuilder.onTabChange
                }
            }]
        });

        self.callParent();
    }
});