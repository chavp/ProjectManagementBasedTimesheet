var ThaiDatepickerText = {
    mounthNames: [
        { name: 'มกราคม', shortName: 'ม.ค.' },
        { name: 'กุมภาพันธ์', shortName: 'ก.พ.' },
        { name: 'มีนาคม', shortName: 'มี.ค.' },
        { name: 'เมษายน', shortName: 'เม.ย.' },
        { name: 'พฤษภาคม', shortName: 'พ.ค.' },
        { name: 'มิถุนายน', shortName: 'มิ.ย.' },
        { name: 'กรกฎาคม', shortName: 'ก.ค.' },
        { name: 'สิงหาคม', shortName: 'ส.ค.' },
        { name: 'กันยายน', shortName: 'ก.ย.' },
        { name: 'ตุลาคม', shortName: 'ต.ค.' },
        { name: 'พฤศจิกายน', shortName: 'พ.ย.' },
        { name: 'ธันวาคม', shortName: 'ธ.ค.' }
    ],

    dayNames: [
        { name: 'อาทิตย์', shortName: 'อา' },
        { name: 'จันทร์', shortName: 'จ' },
        { name: 'อังคาร', shortName: 'อ' },
        { name: 'พุธ', shortName: 'พ' },
        { name: 'พฤหัสบดี', shortName: 'พฤ' },
        { name: 'ศุกร์', shortName: 'ศ' },
        { name: 'เสาร์', shortName: 'ส' }
    ]
};

var _monthNames = [];
for (var i = 0; i < ThaiDatepickerText.mounthNames.length; i++) {
    var mounthName = ThaiDatepickerText.mounthNames[i];
    _monthNames.push(mounthName.name);
}

var _dayNames = [];
for (var i = 0; i < ThaiDatepickerText.dayNames.length; i++) {
    var dayName = ThaiDatepickerText.dayNames[i];
    _dayNames.push(dayName.name);
}

var _buddhaOffset = 543;
Ext.onReady(function () {

    Ext.define("Ext.locale.th.picker.Month", {
        override: "Ext.picker.Month",
        okText: "&#160;ตกลง&#160;",
        cancelText: "ยกเลิก"
    });

    Ext.define("Ext.locale.th.window.MessageBox", {
        override: "Ext.window.MessageBox",
        buttonText: {
            ok: "ตกลง",
            cancel: "ยกเลิก",
            yes: "ใช่",
            no: "ไม่"
        }
    });

    Ext.override(Ext.Date, {

        monthNames: _monthNames,

        getShortMonthName: function (month) {
            var mounthName = ThaiDatepickerText.mounthNames[month];
            return mounthName.shortName;
        },

        dayNames: _dayNames,

        getShortDayName: function (day) {
            var dayName = ThaiDatepickerText.dayNames[day];
            return dayName.shortName;
        }

    });

    Ext.override(Ext.picker.Month, {
        updateBody: function(){
            var me = this,
                years = me.years,
                months = me.months,
                yearNumbers = me.getYears(),
                cls = me.selectedCls,
                value = me.getYear(null),
                month = me.value[0],
                monthOffset = me.monthOffset,
                year,
                yearItems, y, yLen, el;

            if (me.rendered) {
                years.removeCls(cls);
                months.removeCls(cls);

                yearItems = years.elements;
                yLen      = yearItems.length;

                for (y = 0; y < yLen; y++) {
                    el = Ext.fly(yearItems[y]);
                    year = yearNumbers[y];

                    // ********************************************
                    el.dom.innerHTML = year + _buddhaOffset;
                    // ********************************************

                    if (year == value) {
                        el.addCls(cls);
                    }
                }
                if (month !== null) {
                    if (month < monthOffset) {
                        month = month * 2;
                    } else {
                        month = (month - monthOffset) * 2 + 1;
                    }
                    months.item(month).addCls(cls);
                }
            }
        }
    });

    Ext.override(Ext.picker.Date, {
        todayText: "วันนี้",
        minText: "This date is before the minimum date",
        maxText: "This date is after the maximum date",
        disabledDaysText: "",
        disabledDatesText: "",
        nextText: 'เดือนถัดไป (กด Control+Right)',
        prevText: 'เดือนก่อน (กด Control+Left)',
        monthYearText: 'เลือกเดือน (กด Control+Up/Down เพื่อเลื่อนไปยังปีถัดไป)',
        todayTip: "{0} (เลือกวันนี้ กด Spacebar)",
        format: "d/m/Y",

        getDayInitial: function (value) {
            // ********************************************
            var selectedDayNames = ThaiDatepickerText.dayNames.filter(function (item) {
                return item.name === value;
            });
            return selectedDayNames[0].shortName;
            // ********************************************
        },

        fullUpdate: function (date) {
            var me = this;
            me.callParent(arguments);
            // ********************************************
            var diplay = Ext.Date.format(date, me.monthYearFormat);
            diplay = diplay.replace(date.getFullYear(), date.getFullYear() + _buddhaOffset);
            me.monthBtn.setText(diplay);
            // ********************************************
        }
    });

    Ext.form.field.Date.prototype.rawToRealRawValue = function (rawValue) {
        if (rawValue) {
            var present_st = rawValue.split('/');
            var year = parseInt(present_st[2]);
            if (year >= 2500) {
                rawValue = rawValue.replace(present_st[2], year - _buddhaOffset);
            }
        }
        return rawValue;
    };

    Ext.override(Ext.form.field.Date, {
        getErrors: function (value) {
            var me = this,
                format = Ext.String.format,
                clearTime = Ext.Date.clearTime,
                errors = me.callParent(arguments),
                disabledDays = me.disabledDays,
                disabledDatesRE = me.disabledDatesRE,
                minValue = me.minValue,
                maxValue = me.maxValue,
                len = disabledDays ? disabledDays.length : 0,
                i = 0,
                svalue,
                fvalue,
                day,
                time;

            errors = [];
            var realRawValue = me.rawToRealRawValue(me.getRawValue());
            value = me.rawToRealRawValue(value);

            value = me.formatDate(value || me.processRawValue(realRawValue));
            
            if (value === null || value.length < 1) { // if it's blank and textfield didn't flag it then it's valid
                return errors;
            }

            svalue = value;
            value = me.parseDate(value);
            if (!value) {
                errors.push(format(me.invalidText, svalue, Ext.Date.unescapeFormat(me.format)));
                return errors;
            }

            time = value.getTime();

            if (minValue && time < clearTime(minValue).getTime()) {
                errors.push(format(me.minText, me.formatDate(minValue)));
            }

            if (maxValue && time > clearTime(maxValue).getTime()) {
                errors.push(format(me.maxText, me.formatDate(maxValue)));
            }

            if (disabledDays) {
                day = value.getDay();

                for (; i < len; i++) {
                    if (day === disabledDays[i]) {
                        errors.push(me.disabledDaysText);
                        break;
                    }
                }
            }

            fvalue = me.formatDate(value);
            if (disabledDatesRE && disabledDatesRE.test(fvalue)) {
                console.log("disabledDatesRE && disabledDatesRE.test(fvalue)");
                errors.push(format(me.disabledDatesText, fvalue));
            }

            return errors;
        },

        rawToValue: function (rawValue) {
            var val = this.parseDate(rawValue) || rawValue || null;
            if (rawValue) {
                var present_st = rawValue.split('/');
                var year = parseInt(present_st[2]);
                //console.log(year);
                if (year >= 2500) {
                    rawValue = rawValue.replace(present_st[2], year - _buddhaOffset);
                    val = this.parseDate(rawValue) || rawValue || null;
                }
            }
            //console.log(val);
            return val;
        },

        valueToRaw: function (value) {
            var render = this.formatDate(this.parseDate(value));
            if (render) {
                var present_st = render.split('/');
                var year = parseInt(present_st[2]);
                render = render.replace(present_st[2], year + _buddhaOffset);
            }
            return render;
        }
    });
});

//http://www.imooh.com/jquery-thai-calendars-datepicker-plugin