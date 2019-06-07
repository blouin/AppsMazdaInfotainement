/**
 * [Custom compass for car]
 *
 * @version: 1.0.0
 * @author: JF Blouin
 * @description Displays a compass
 *
 * Note: 
 *   Background image taken from SDK Speedometer app
 */
 
CustomApplicationsHandler.register("app.compass", new CustomApplication({

	/**
	 * (require) Dependencies for the application
	 */
	require: {
		js: [],
		css: ['app.css'],
		images: { },
	},

	/**
	 * (settings) Settings for application
	 */
	settings: {
		// terminateOnLost: false,
		title: 'Boussole',
		statusbar: false,
		statusbarIcon: true,
		statusbarTitle: false,
		// statusbarHideHomeButton: true,
		hasLeftButton: false,
		hasMenuCaret: false,
		hasRightArc: false,

	},
		
	coordinates: [
		['N', 'main', 157.5, 202.5, 180],
		['NE', 'alt', 202.5, 247.5, 225],
		['E', 'small', 247.5, 292.5, 270],
		['SE', 'alt', 292.5, 337.5, 315],
		['S', 'small', 337.5, 380, 0], // Also, 0 - 22.5
		['SO', 'alt', 22.5, 67.5, 45],
		['O', 'small', 67.5, 112.5, 90],
		['NO', 'alt', 112.5, 157.5, 135],
	],
	coordinateDefault: 4, // S
	coordinateDegreeOff: 0, // Last degree off from true value [4]

	/**
	 * (created) Creates the UI
	 */
	created: function() {
		var divTop = document.createElement("div");
		divTop.setAttribute("id", "top");
		divTop.setAttribute("class", "top");
		divTop.innerHTML = "";
		divTop.innerHTML += "<div class='marker left'></div>";
		divTop.innerHTML += "<div class='marker center'></div>";
		divTop.innerHTML += "<div class='marker right'></div>";
		divTop.innerHTML += "<div class='on3 orientation' style='left: -1%'></div>";
		divTop.innerHTML += "<div class='on2 orientation' style='left: 14%'></div>";
		divTop.innerHTML += "<div class='on1 orientation' style='left: 29%'></div>";
		divTop.innerHTML += "<div class='ozero orientation main' style='left: 44%'>N</div>";
		divTop.innerHTML += "<div class='op1 orientation' style='left: 59%'></div>";
		divTop.innerHTML += "<div class='op2 orientation' style='left: 74%'></div>";
		divTop.innerHTML += "<div class='op3 orientation' style='left: 89%'></div>";
		this.canvas.get(0).appendChild(divTop);
		
		var divSep = document.createElement("div");
		divSep.setAttribute("id", "seperator");
		divSep.setAttribute("class", "seperator");
		this.canvas.get(0).appendChild(divSep);
		
		var divBottom = document.createElement("div");
		divBottom.setAttribute("id", "bottom");
		divBottom.setAttribute("class", "bottom");
		divBottom.innerHTML = "";
		divBottom.innerHTML += "<div class='info'></div>";
		divBottom.innerHTML += "<div class='time'>...</div>";
		this.canvas.get(0).appendChild(divBottom);
		
		var divLight = document.createElement("div");
		divLight.setAttribute("id", "lighting");
		divLight.setAttribute("class", "lighting");
		this.canvas.get(0).appendChild(divLight);
		
		// Defaults
		this.screenOff = false;
		this.screenOpacity = 0;
	},
	
	/**
	 * (focused) When application is put into focus
	 */
	focused: function() {
		var that = this;
		
		this.timeCompass = setInterval( function() {
			
			// Get detail
			var utcSeconds = CustomApplicationDataHandler.get(VehicleData.gps.timestamp).value;
			var longitude = CustomApplicationDataHandler.get(VehicleData.gps.longitude).value;
			var latitude = CustomApplicationDataHandler.get(VehicleData.gps.latitude).value;
			var altitude = CustomApplicationDataHandler.get(VehicleData.gps.altitude).value;
			var heading = CustomApplicationDataHandler.get(VehicleData.gps.heading).value;
			
			// Write detail
			var sLatitude = that.formatGpsCoordinate(latitude, 'S', 'N');
			var sLongitude = that.formatGpsCoordinate(longitude, 'O', 'E');
			$('.bottom .info').html(sLatitude + '<br />' + sLongitude + '<br />' + altitude.toFixed(2) + ' m');
			
			// Draw compass
			that.drawCompass(heading);
			
			// Write time
			if (utcSeconds != 0) {
				
				var curdate = new Date(0);
				utcSeconds = that.calculateOffset(utcSeconds);
				curdate.setUTCSeconds(utcSeconds);
					
				var timeText = (curdate.getHours() ) + ":" + (curdate.getMinutes() < 10 ? '0' + curdate.getMinutes() : curdate.getMinutes());
				$('.bottom .time').text(timeText);
			}
		}, 100 );
	},


	/**
	 * (lost) When application loses focus
	 */
	lost: function() {
		clearInterval(this.timeCompass);
	},

	/**
	 * (event) When a controller key is pressed
	 */
	onControllerEvent: function(eventId) {
		switch(eventId) {
			case "selectStart":
				if (this.screenOff){
					$('#lighting').css({opacity: this.screenOpacity });
				}
				else {
					$('#lighting').css({opacity: 1 });
				}
				this.screenOff = !this.screenOff
				break;
			case "cw":
				this.screenOpacity = this.screenOpacity - 0.1;
				if (this.screenOpacity < 0)
					this.screenOpacity = 0;
				$('#lighting').css({opacity: this.screenOpacity });
				break;
			case "ccw":
				this.screenOpacity = this.screenOpacity + 0.1;
				if (this.screenOpacity > 0.5)
					this.screenOpacity = 0.5;
				$('#lighting').css({opacity: this.screenOpacity });
				break;
		}		
	},

	drawCompass: function(heading) {
		
		// Fix heading (in case)
		if (heading < 0) {
			heading + 360;
		}
		
		// Find origin (center div)
		var origin = this.coordinateDefault; // South
		for (i = 0; i < this.coordinates.length; i++) {
			if (heading >= this.coordinates[i][2] && heading < this.coordinates[i][3]) {
				origin = i;
				break;
			}
		}
		
		// Write values
		$('.on3').text(this.coordinates[this.adjustValueForArray(origin, -3)][0]);
		$('.on2').text(this.coordinates[this.adjustValueForArray(origin, -2)][0]);
		$('.on1').text(this.coordinates[this.adjustValueForArray(origin, -1)][0]);
		$('.ozero').text(this.coordinates[origin][0]);
		$('.op1').text(this.coordinates[this.adjustValueForArray(origin, 1)][0]);
		$('.op2').text(this.coordinates[this.adjustValueForArray(origin, 2)][0]);
		$('.op3').text(this.coordinates[this.adjustValueForArray(origin, 3)][0]);
		
		// Set style
		$('.orientation').removeClass('main');
		$('.orientation').removeClass('alt');
		$('.orientation').removeClass('small');
		$('.on3').addClass(this.coordinates[this.adjustValueForArray(origin, -3)][1]);
		$('.on2').addClass(this.coordinates[this.adjustValueForArray(origin, -2)][1]);
		$('.on1').addClass(this.coordinates[this.adjustValueForArray(origin, -1)][1]);
		$('.ozero').addClass(this.coordinates[origin][1]);
		$('.op1').addClass(this.coordinates[this.adjustValueForArray(origin, 1)][1]);
		$('.op2').addClass(this.coordinates[this.adjustValueForArray(origin, 2)][1]);
		$('.op3').addClass(this.coordinates[this.adjustValueForArray(origin, 3)][1]);

		// Set position
		var degOffset = (this.coordinates[origin][4] - heading) / 15;
		$('.on3').css("left", (-1 + degOffset) + "%");
		$('.on2').css("left", 14 + degOffset + "%");
		$('.on1').css("left", 29 + degOffset + "%");
		$('.ozero').css("left", (44 + degOffset) + "%");
		$('.op1').css("left", 59 + degOffset + "%");
		$('.op2').css("left", 74 + degOffset + "%");
		$('.op3').css("left", 89 + degOffset + "%");
	},
	
	adjustValueForArray: function(input, offset) {
		
		var value = input + offset;
		if (value < 0) {
			return value + this.coordinates.length;
		}
		else if (value >= this.coordinates.length) {
			return value - this.coordinates.length;
		}
		else {
			return value;
		}
	},
	
	formatGpsCoordinate: function(input, neg, pos) {

		var whole = Math.abs(~~(input));
		var minutes = Math.abs((input - ~~(input))) * 60;
		var seconds = (minutes - ~~(minutes)) * 60;
		return whole + '&deg; ' + ~~(minutes) + '&#39; ' + seconds.toFixed(2) + '&quot; ' + (input >= 0 ? pos : neg);
		
	},
	
	calculateOffset: function(utcSeconds) {
		
		// SUMMER: 
		utcSeconds = utcSeconds - (4 * 3600);
		// WINTER: 
		//utcSeconds = utcSeconds - (5 * 3600);
		
		return utcSeconds;
	}


})); /** EOF **/
