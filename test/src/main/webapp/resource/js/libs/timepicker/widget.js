$.fn.datePicker = function(o) {
    var self = $(this);
    var dfop={
        showWeek: false,    // 月份视图中开始时间为第一周的第一天
        changeMonth: true,  // 选择月份为下拉
        changeYear: true,   // 选择年份为下拉
        yearSuffix: '',     // 附加文本在年下拉后显示
        dateFormat:'yy-mm-dd',  // 日期格式
        showButtonPanel: true,  // 显示底部按钮面板 以及 今天 和 关闭 两个按钮
        showClearButton:true    // 显示清除按钮
    };
    $.extend(dfop,o);
    if(!$("#ui-datepicker-div").attr("id")){
        $.datepicker.initialized = false;
    }
    $(this).datepicker(dfop);
};

$.fn.dateTimePicker = function(o) {
    var self = $(this);
    var dfop={
        showWeek: false,
        changeMonth: true,
        changeYear: true,
        yearSuffix: '',
        dateFormat:'yy-mm-dd',
        showButtonPanel: true,
        showClearButton:true,
        // other ...
        
        
        timeFormat: 'HH:mm:ss',
        stepHour: 1,
        stepMinute: 1,
        stepSecond: 15,
        showSecond:false,
        showMinute:true,
        currentText: '今天',
        clearText: '清除',
        closeText: '确定',
        amNames: ['上午', 'A'],
        pmNames: ['下午', 'P'],
        timeSuffix: '',
        timeOnlyTitle: '选择时间',
        timeText: '时间',
        hourText: '时：',
        minuteText: '分：',
        secondText: '秒：',
        controlType:{
            create: function(tp_inst, obj, unit, val, min, max, step){
                $('<input class="ui-timepicker-input" value="'+val+'" style="width:50%">')
                    .appendTo(obj)
                    .spinner({
                        min: min,
                        max: max,
                        step: step,
                        change: function(e,ui){ // key events
                                // don't call if api was used and not key press
                                if(e.originalEvent !== undefined)
                                    tp_inst._onTimeChange();
                                tp_inst._onSelectHandler();
                            },
                        spin: function(e,ui){ // spin events
                                tp_inst.control.value(tp_inst, obj, unit, ui.value);
                                tp_inst._onTimeChange();
                                tp_inst._onSelectHandler();
                            }
                    });
                return obj;
            },
            options: function(tp_inst, obj, unit, opts, val){
                if(typeof(opts) == 'string' && val !== undefined)
                        return obj.find('.ui-timepicker-input').spinner(opts, val);
                return obj.find('.ui-timepicker-input').spinner(opts);
            },
            value: function(tp_inst, obj, unit, val){
                if(val !== undefined)
                    return obj.find('.ui-timepicker-input').spinner('value', val);
                return obj.find('.ui-timepicker-input').spinner('value');
            }
        }
    };
    $.extend(dfop,o);
    $(this).datetimepicker(dfop);
    if(self.val()!=''){
        var thisValue=self.val();
        var arr=thisValue.split(" ");
        var date=arr[0].split("-");
        var time=arr[1].split(":");
        self.datetimepicker('setDate',new Date(parseInt(date[0],10),parseInt(date[1],10)-1,parseInt(date[2],10),time[0],time[1],time[2]));
    }
    
};