/*
 * jDigiClock plugin 3.0.2
 *
 * http://www.radoslavdimov.com/jquery-plugins/jquery-plugin-digiclock/
 *
 * Copyright (c) 2009 Radoslav Dimov
 *
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * 17-NOV-2013:  2.1.1 Modified by Andrew Mercer to use offset from Server Time. Allows display of other timezones.
 * 08-FEB-2015:  2.1.2 Adapted to use Yahoo weather (AccuWeather not working) and JSONP (No proxy)
 * 21-MAR-2015:  2.1.3 Added .promise().done(function () {}) reference for compatibility with later jquery versions
 *                     Avoids repeated sliding panels on left/right clicks. Based on update by s4ty at
 *                     http://www.jquery-board.de/threads/3458-jDigiClock/page4
 *                     Doc here : http://www.baldwhiteguy.co.nz/jdigiclock/
 * 31-MAY-2016:  2.1.4 Adapted to have only 1 single view page, added French language
 * 13-JAN-2017:  2.1.5 Fixed Yahoo API connection issues 
 * 5-JAN-2019:   3.0.0 Migrated to undocumented MeteoFrance API
 * 7-AUG-2020:   3.0.1 Change of API for sunrise / sunset
 * 11-APR-2021   3.0.2 Fix MeteoFrance API
 *                
 *
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 
 */


(function($) {
    $.fn.extend({

        jdigiclock: function(options) {

            var defaults = {
                imagesPath: '/dashboard/jdigiclock/images/',
                lang: 'fr',
                am_pm: false,
                weatherLocationCode: '751170', // Meteofrance city code
                weatherUpdate: 59,
                svrOffset: 0   
            };

            var regional = [];
            regional['fr'] = {
                monthNames: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'],
                dayNames: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
                lang: 'fr'
            }
            regional['en'] = {
                monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                lang: 'en'
            }


            var options = $.extend(defaults, options);

            return this.each(function() {
                
                var $this = $(this);
                var o = options;
                $this.imagesPath = o.imagesPath;
                $this.lang = regional[o.lang] == undefined ? regional['en'] : regional[o.lang];
                $this.am_pm = o.am_pm;
                $this.weatherLocationCode = o.weatherLocationCode;
                $this.weatherUpdate = o.weatherUpdate;
                $this.svrOffset = o.svrOffset;
                $this.clockImagesPath = o.imagesPath + 'clock/';
                $this.weatherImagesPath = o.imagesPath + 'picto/';
                $this.currDate = '';
                $this.timeUpdate = '';


                var html = '<div id="plugin_container">';
                html    += '<div id="clock"></div>';
                html    += '<div id="weather"></div>';
                html    += '</div>';

                $this.html(html);

                $this.find('#weather').html('<p class="loading">Update Weather ...<br><span style="font-size:16px;"><img src="' + $this.imagesPath + 'refresh_grey.png" alt="reload" title="reload" id="reload" /> Reload</span></p>');

                $this.displayClock($this);

                $this.displayWeather($this);               

            });
        }
    });
   



    $.fn.displayClock = function(el) {
        $.fn.getTime(el);
        setTimeout(function() {$.fn.displayClock(el)}, $.fn.delay());
    }

    $.fn.displayWeather = function(el) {
        $.fn.getWeather(el);
        if (el.weatherUpdate > 0) {
            setTimeout(function() {$.fn.displayWeather(el)}, (el.weatherUpdate * 60 * 1000));
        }
    }

    $.fn.delay = function() {
        var now = new Date();
        var delay = (60 - now.getSeconds()) * 1000;
        
        return delay;
    }

    $.fn.getTime = function(el) {
        var localtime = new Date();
        var now = new Date(localtime.getTime() - el.svrOffset);
        var old = new Date();
        old.setTime(now.getTime() - 60000);
        
        var now_hours, now_minutes, old_hours, old_minutes, timeOld = '';
        now_hours =  now.getHours();
        now_minutes = now.getMinutes();
        old_hours =  old.getHours();
        old_minutes = old.getMinutes();

        if (el.am_pm) {
            var am_pm = now_hours > 11 ? 'pm' : 'am';
            now_hours = ((now_hours > 12) ? now_hours - 12 : now_hours);
            old_hours = ((old_hours > 12) ? old_hours - 12 : old_hours);
        } 

        now_hours   = ((now_hours <  10) ? "0" : "") + now_hours;
        now_minutes = ((now_minutes <  10) ? "0" : "") + now_minutes;
        old_hours   = ((old_hours <  10) ? "0" : "") + old_hours;
        old_minutes = ((old_minutes <  10) ? "0" : "") + old_minutes;
        // date
        el.currDate = el.lang.dayNames[now.getDay()] + '&nbsp;' + now.getDate() + '&nbsp;' + el.lang.monthNames[now.getMonth()];
        // time update
        el.timeUpdate = now_hours + ':' + now_minutes;

        var firstHourDigit = old_hours.substr(0,1);
        var secondHourDigit = old_hours.substr(1,1);
        var firstMinuteDigit = old_minutes.substr(0,1);
        var secondMinuteDigit = old_minutes.substr(1,1);
        
        timeOld += '<div id="hours"><div class="line"></div>';
        timeOld += '<div id="hours_bg"><img src="' + el.clockImagesPath + 'clockbg1.png" /></div>';
        timeOld += '<img src="' + el.clockImagesPath + firstHourDigit + '.png" id="fhd" class="first_digit" />';
        timeOld += '<img src="' + el.clockImagesPath + secondHourDigit + '.png" id="shd" class="second_digit" />';
        timeOld += '</div>';
        timeOld += '<div id="minutes"><div class="line"></div>';
        if (el.am_pm) {
            timeOld += '<div id="am_pm"><img src="' + el.clockImagesPath + am_pm + '.png" /></div>';
        }
        timeOld += '<div id="minutes_bg"><img src="' + el.clockImagesPath + 'clockbg1.png" /></div>';
        timeOld += '<img src="' + el.clockImagesPath + firstMinuteDigit + '.png" id="fmd" class="first_digit" />';
        timeOld += '<img src="' + el.clockImagesPath + secondMinuteDigit + '.png" id="smd" class="second_digit" />';
        timeOld += '</div>';

        el.find('#clock').html(timeOld);

        // set minutes
        if (secondMinuteDigit != '9') {
            firstMinuteDigit = firstMinuteDigit + '1';
        }

        if (old_minutes == '59') {
            firstMinuteDigit = '511';
        }

        setTimeout(function() {
            $('#fmd').attr('src', el.clockImagesPath + firstMinuteDigit + '-1.png');
            $('#minutes_bg img').attr('src', el.clockImagesPath + 'clockbg2.png');
        },200);
        setTimeout(function() { $('#minutes_bg img').attr('src', el.clockImagesPath + 'clockbg3.png')},250);
        setTimeout(function() {
            $('#fmd').attr('src', el.clockImagesPath + firstMinuteDigit + '-2.png');
            $('#minutes_bg img').attr('src', el.clockImagesPath + 'clockbg4.png');
        },400);
        setTimeout(function() { $('#minutes_bg img').attr('src', el.clockImagesPath + 'clockbg5.png')},450);
        setTimeout(function() {
            $('#fmd').attr('src', el.clockImagesPath + firstMinuteDigit + '-3.png');
            $('#minutes_bg img').attr('src', el.clockImagesPath + 'clockbg6.png');
        },600);

        setTimeout(function() {
            $('#smd').attr('src', el.clockImagesPath + secondMinuteDigit + '-1.png');
            $('#minutes_bg img').attr('src', el.clockImagesPath + 'clockbg2.png');
        },200);
        setTimeout(function() { $('#minutes_bg img').attr('src', el.clockImagesPath + 'clockbg3.png')},250);
        setTimeout(function() {
            $('#smd').attr('src', el.clockImagesPath + secondMinuteDigit + '-2.png');
            $('#minutes_bg img').attr('src', el.clockImagesPath + 'clockbg4.png');
        },400);
        setTimeout(function() { $('#minutes_bg img').attr('src', el.clockImagesPath + 'clockbg5.png')},450);
        setTimeout(function() {
            $('#smd').attr('src', el.clockImagesPath + secondMinuteDigit + '-3.png');
            $('#minutes_bg img').attr('src', el.clockImagesPath + 'clockbg6.png');
        },600);

        setTimeout(function() {$('#fmd').attr('src', el.clockImagesPath + now_minutes.substr(0,1) + '.png')},800);
        setTimeout(function() {$('#smd').attr('src', el.clockImagesPath + now_minutes.substr(1,1) + '.png')},800);
        setTimeout(function() { $('#minutes_bg img').attr('src', el.clockImagesPath + 'clockbg1.png')},850);

        // set hours
        if (now_minutes == '00') {
           
            if (el.am_pm) {
                if (now_hours == '00') {                   
                    firstHourDigit = firstHourDigit + '1';
                    now_hours = '12';
                } else if (now_hours == '01') {
                    firstHourDigit = '001';
                    secondHourDigit = '111';
                } else {
                    firstHourDigit = firstHourDigit + '1';
                }
            } else {
                if (now_hours != '10') {
                    firstHourDigit = firstHourDigit + '1';
                }

                if (now_hours == '20') {
                    firstHourDigit = '1';
                }

                if (now_hours == '00') {
                    firstHourDigit = firstHourDigit + '1';
                    secondHourDigit = secondHourDigit + '11';
                }
            }

            setTimeout(function() {
                $('#fhd').attr('src', el.clockImagesPath + firstHourDigit + '-1.png');
                $('#hours_bg img').attr('src', el.clockImagesPath + 'clockbg2.png');
            },200);
            setTimeout(function() { $('#hours_bg img').attr('src', el.clockImagesPath + 'clockbg3.png')},250);
            setTimeout(function() {
                $('#fhd').attr('src', el.clockImagesPath + firstHourDigit + '-2.png');
                $('#hours_bg img').attr('src', el.clockImagesPath + 'clockbg4.png');
            },400);
            setTimeout(function() { $('#hours_bg img').attr('src', el.clockImagesPath + 'clockbg5.png')},450);
            setTimeout(function() {
                $('#fhd').attr('src', el.clockImagesPath + firstHourDigit + '-3.png');
                $('#hours_bg img').attr('src', el.clockImagesPath + 'clockbg6.png');
            },600);

            setTimeout(function() {
            $('#shd').attr('src', el.clockImagesPath + secondHourDigit + '-1.png');
            $('#hours_bg img').attr('src', el.clockImagesPath + 'clockbg2.png');
            },200);
            setTimeout(function() { $('#hours_bg img').attr('src', el.clockImagesPath + 'clockbg3.png')},250);
            setTimeout(function() {
                $('#shd').attr('src', el.clockImagesPath + secondHourDigit + '-2.png');
                $('#hours_bg img').attr('src', el.clockImagesPath + 'clockbg4.png');
            },400);
            setTimeout(function() { $('#hours_bg img').attr('src', el.clockImagesPath + 'clockbg5.png')},450);
            setTimeout(function() {
                $('#shd').attr('src', el.clockImagesPath + secondHourDigit + '-3.png');
                $('#hours_bg img').attr('src', el.clockImagesPath + 'clockbg6.png');
            },600);

            setTimeout(function() {$('#fhd').attr('src', el.clockImagesPath + now_hours.substr(0,1) + '.png')},800);
            setTimeout(function() {$('#shd').attr('src', el.clockImagesPath + now_hours.substr(1,1) + '.png')},800);
            setTimeout(function() { $('#hours_bg img').attr('src', el.clockImagesPath + 'clockbg1.png')},850);
        }
    }

 $.fn.getWeather = function(el) {


    // On récupère les prévisions
    $.getJSON('https://rpcache-aa.meteofrance.com/internet2018client/2.0/forecast?id=' + el.weatherLocationCode + '&instants=&day=5&token=__Wj7dVSTjV9YGu1guveLyDq0g7S7TfTjaHBTPTpO0kj8__' // http://ws.meteofrance.com/ws/getDetail/france/'+ el.weatherLocationCode + '.json'
        , function (data) {

            // On met à jour les data que si l'API a retourné des données
            if (typeof data !== 'undefined' && data != null) {
 
                // 1er élèment du forecast 48h. On fait la moyenne entre Min et Max (déprécié)
                //var temp_now = Math.round(( parseFloat(data.result.previsions48h[Object.keys(data.result.previsions48h)[0]].temperatureMin) + parseFloat(data.result.previsions48h[Object.keys(data.result.previsions48h)[0]].temperatureMax)) / 2) 

                // 1er forecast après l'heure actuelle
                var temp_now_utc = new Date();
                temp_now_utc.setMinutes(0);
                temp_now_utc.setSeconds(0);
                temp_now_utc.setMilliseconds(0)
                temp_now_utc = temp_now_utc.toISOString(); // UTC

                i = 0;
                while (i + 1 < data.properties.forecast.length) {
                    var forecast_time = new Date(data.properties.forecast[i].time).toISOString();
                    if (forecast_time >= temp_now_utc)
                        break;
                    i=i+1;
                }
                var forecast_now = data.properties.forecast[i].T;
                var curr_temp = '<p class="temp">' + String(forecast_now) 
                               + '&deg;<span class="metric">'
                               + 'C' + '</span></p>';

                 el.find('#weather').css('background','url(' + el.weatherImagesPath + data.properties.forecast[0].weather_icon  + '.svg) ');
                 el.find('#weather').css('background-repeat','no-repeat');
                 el.find('#weather').css('background-position','50% -20%');
                 el.find('#weather').css('background-size','50%');
                                     
                 var weather = '<div id="local"><p class="city">' 
                             + data.properties.name
                             + '</p>' 
                             + '<p class="high_low">' 
                              + Math.round(data.properties.daily_forecast[0].T_min)
                              + '&deg;&nbsp;/&nbsp;' 
                              + Math.round(data.properties.daily_forecast[0].T_max)
                              + '&deg;</p></div>';

                 weather += '<div id="temp"><p id="date">' 
                         + el.currDate 
                         + '</p>' 
                         + curr_temp + '</div>';

                 el.find('#weather').html(weather);


                 el.find('#weather').append('<ul id="forecast"></ul>');
                 for (i = 1; i <= 4; i++) {
                    
                     var d_date = new Date(data.properties.daily_forecast[i].time);
                     var forecast = '<li>';

                  
                     forecast    += '<p class="dayname">' + el.lang.dayNames[d_date.getDay()] + '&nbsp;' + d_date.getDate() + '</p>'
                                  + '<img style="position: relative; top: -20px;" src="' 
                                  + el.weatherImagesPath 
                                  + data.properties.daily_forecast[i].daily_weather_icon
                                  + '.svg" alt="' 
                                  + data.properties.daily_forecast[i].daily_weather_description
                                  + '" title="' 
                                  + data.properties.daily_forecast[i].daily_weather_description
                                  + '" />';
                               
                     forecast    += '<div class="daytemp">' 
                                  + Math.round(data.properties.daily_forecast[i].T_min)
                                  + '&deg;&nbsp;/&nbsp;' 
                                  + Math.round(data.properties.daily_forecast[i].T_max)
                                  + '&deg;</div>';
                               
                     forecast    += '</li>';
                     el.find('#forecast').append(forecast);

                 }
                

                el.find('#weather').append('<div id="bottom"><div id="soleil"></div><div id="update"><img src="' + el.imagesPath + 'refresh_grey.png" alt="reload" title="reload" id="reload" />' + el.timeUpdate + '</div></div>');
                
                sunrise = new Date( data.properties.daily_forecast[0].sunrise_time );
                sunrise_formatted = sunrise.getHours() + "h" + (sunrise.getMinutes()<10?'0':'') + sunrise.getMinutes();
                sunset = new Date( data.properties.daily_forecast[0].sunset_time );
                sunset_formatted = sunset.getHours() + "h" + (sunset.getMinutes()<10?'0':'') + sunset.getMinutes();

                soleil = '<font color="yellow">☀</font> ▲&nbsp;' + sunrise_formatted + '&nbsp;&nbsp;&nbsp;▼&nbsp;' + sunset_formatted;                
                el.find('#soleil').append(soleil);

        
            }

            else { // Si pb de connexion à l'API
                // On change la couleur du bouton refresh en rouge
                $('#reload').attr('src', el.imagesPath + 'refresh_red.png');  
            }


            $('#reload').click(function() {
                
                 $.fn.getWeather(el);
            });
             
        });


    }
})(jQuery);
