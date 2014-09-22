(function() {

	var BCRUtils = {
		BCRClass : function() {},
		addTestButton : function(id, num, callback, text) {
			return $("<button></button>").attr("id", id)
				.text(BCRUtils.capitalize(text?text:id))
				.css("top", (30 * num - 15) + "px")
				.appendTo($("#game_container")).on("click", callback);
		},
		capitalize : function(str) {
			return str.charAt(0).toUpperCase() + str.slice(1);
		},
		degToRad : function(deg) {
			return deg * Math.PI / 180;
		},
		getRandColor : function() {
			var hue = (("undefined" === typeof this.lastHue ? Math.random() : this.lastHue) + this.goldenRatioConjugate) % 1;
			this.lastHue = hue;
			var saturation = 0.99;
			var value = 0.99;
			var chroma = saturation * value;
			var hue_1 = hue * 6;
			var x = chroma * (1 - Math.abs(hue_1 % 2 - 1));
			var color_1 = [0, 0, 0];
			switch(true) {
				case "undefined" === typeof hue :
					color_1 = [0, 0, 0];
					break;
				case 0 <= hue_1 && hue_1 < 1 :
					color_1 = [chroma, x, 0];
					break;
				case 1 <= hue_1 && hue_1 < 2 :
					color_1 = [x, chroma, 0];
					break;
				case 2 <= hue_1 && hue_1 < 3 :
					color_1 = [0, chroma, x];
					break;
				case 3 <= hue_1 && hue_1 < 4 :
					color_1 = [0, x, chroma];
					break;
				case 4 <= hue_1 && hue_1 < 5 :
					color_1 = [x, 0, chroma];
					break;
				case 5 <= hue_1 && hue_1 < 6 :
					color_1 = [chroma, 0, x];
					break;
			}
			var m = value - chroma;
			var color = [color_1[0] + m, color_1[1] + m, color_1[2] + m];

			return "#" + this.toFullHexString(Math.round(color[0] * 255)) + this.toFullHexString(Math.round(color[1] * 255)) + this.toFullHexString(Math.round(color[2] * 255));
		},
		goldenRatioConjugate : 0.618033988749895,
		simulateClick : function(x, y) {
			var clickEvent= document.createEvent('MouseEvents');
			clickEvent.initMouseEvent(
			'click', true, true, window, 0,
			0, 0, x, y, false, false,
			false, false, 0, null
			);
			document.elementFromPoint(x, y).dispatchEvent(clickEvent);
		},
		toFullHexString : function(value) {
			return (value < 16 ? "0" : "") + value.toString(16);
		}
	}
	BCRUtils.BCRClass.prototype.__construct = function() {};
	BCRUtils.BCRClass.extend = function(className, def) {
		switch(className) {
			case "BCRSphere" :
				var BCRSphere = function() { if(arguments[0] !== BCRUtils.BCRClass) { this.__construct.apply(this, arguments); } };
				var thisClass = BCRSphere;
				break;
			case "BCRPowerUp" :
				var BCRPowerUp = function() { if(arguments[0] !== BCRUtils.BCRClass) { this.__construct.apply(this, arguments); } };
				var thisClass = BCRPowerUp;
				break;
			case "BCRPowerUps.Double" :
				var BCRPowerUps = BCRPowerUps || {};
				BCRPowerUps.Double = function() { if(arguments[0] !== BCRUtils.BCRClass) { this.__construct.apply(this, arguments); } };
				var thisClass = BCRPowerUps.Double;
				break;
			case "BCRPowerUps.Radius" :
				var BCRPowerUps = BCRPowerUps || {};
				BCRPowerUps.Radius = function() { if(arguments[0] !== BCRUtils.BCRClass) { this.__construct.apply(this, arguments); } };
				var thisClass = BCRPowerUps.Radius;
				break;
			case "BCRPowerUps.Time" :
				var BCRPowerUps = BCRPowerUps || {};
				BCRPowerUps.Time = function() { if(arguments[0] !== BCRUtils.BCRClass) { this.__construct.apply(this, arguments); } };
				var thisClass = BCRPowerUps.Time;
				break;
		}

		var proto = new this(BCRUtils.BCRClass);
		var superClass = this.prototype;

		for(var n in def) {
			var item = def[n];
			if(item instanceof Function) item.$ = superClass;
			proto[n] = item;
		}

		thisClass.prototype = proto;
		thisClass.extend = this.extend;
		return thisClass;
	};

	var BCRText = function(options) { return this.__construct(options); }

	BCRText.prototype = {
		// constructor
		__construct : function(options) {
			this.x = options.position.x;
			this.y = options.position.y;
			this.text = options.text;

			this.kineticNode = new Kinetic.Text({
				x : this.x,
				y : this.y,
				text : this.text,
				fill : "#ffffff"
			});

			return this;
		},

		// methods
		remove : function() { this.kineticNode.remove(); return this; },

		// getters
		getKineticNode : function() { return this.kineticNode; },
		getHeight : function() { return this.kineticNode.height(); },
		getWidth : function() { return this.kineticNode.width(); },

		// setters
		setOffsetX : function(val) { if("undefined" !== typeof val) this.kineticNode.offsetX(val); return this; },
		setOffsetY : function(val) { if("undefined" !== typeof val) this.kineticNode.offsetY(val); return this; },
		setText : function(val) { if("undefined" !== typeof val) this.kineticNode.text(val); return this; }
	}

	var BCRExplosion = function(options) { return this.__construct(options); }

	BCRExplosion.prototype = {
		// constructor
		__construct : function(options) {
			var defaults = {
				radius : 0,
				opacity : 1,
				animation : {
					mid : {
						radius : BCRGameInstance.explosionRadius,
						opacity : 0.2,
						easing : Kinetic.Easings.StrongEaseOut,
						duration : BCRGameInstance.explosionDuration
					},
					end : {
						radius : 0,
						opacity : 0.2,
						easing : Kinetic.Easings.StrongEaseIn,
						duration : 0.5
					}
				},
				chainable : true,
				grade : 0
			}
			$.extend(true, defaults, options);
			this.x = defaults.position.x;
			this.y = defaults.position.y;
			this.fill = defaults.fill;
			this.grade = defaults.grade;
			this.chainable = defaults.chainable;
			this.animation = defaults.animation;
			this.origin = defaults.origin;
			if("undefined" !== typeof defaults.textString)
				this.textString = defaults.textString;
			else if(this.grade > 1)
				this.textString = this.grade;
			else
				this.textString = "";

			this.id;

			this.kineticNode = new Kinetic.Circle({
				x : this.x,
				y : this.y,
				radius : defaults.radius,
				opacity : defaults.opacity,
				fill : this.fill
			});

			if(this.textString != "")
				this.text = new BCRText({
					position : { x : this.x, y : this.y },
					text : this.textString
				});

			return this;
		},

		// methods
		addToBoard : function() {
			BCRGameInstance.addToBoard(this);
			this.play();
			if(this.hasText()) {
				BCRGameInstance.addToBoard(this.text);
				this.text.setOffsetX(this.text.getWidth() / 2).setOffsetY(this.text.getHeight() / 2);
			}

			return this;
		},
		hasText : function() { return "undefined" !== typeof this.text; },
		isChainable : function() { return this.chainable; },
		play : function() {
			var that = this;
			var t = new Kinetic.Tween({
				node : that.kineticNode,
				radius : that.animation.mid.radius,
				opacity : that.animation.mid.opacity,
				easing : that.animation.mid.easing,
				duration : that.animation.mid.duration,
				onFinish : function() {
					var t = new Kinetic.Tween({
						node : that.kineticNode,
						radius : that.animation.end.radius,
						opacity : that.animation.end.opacity,
						easing : that.animation.end.easing,
						duration : that.animation.end.duration,
						onFinish : function() {
							if(that.kineticNode.getStage())
								game.removeExplosion(that.id);
						}
					});
					t.play();
				}
			});
			t.play();

			return this;
		},
		remove : function() {
			this.kineticNode.remove();
			if(this.hasText())
				this.text.remove();
		},

		// getters
		getGrade : function() { return this.grade; },
		getId : function() { return this.id; },
		getKineticNode : function() { return this.kineticNode; },
		getRadius : function() { return this.kineticNode.radius(); },
		getText : function() { return this.text; },
		getTextString : function() { return this.textString; },
		getX : function() { return this.x; },
		getY : function() { return this.y; },

		// setters
		setChainable : function(val) { if("undefined" !== typeof val) this.chainable = val; return this; },
		setId : function(val) { if("undefined" !== typeof val) this.id = val; return this; },
		setMidAnimationRadius : function(val) { if("undefined" !== typeof val) this.animation.mid.radius = val; return this; }
	}

	var BCRSphere = BCRUtils.BCRClass.extend("BCRSphere", {
		// constructor
		__construct : function(options) {
			var defaultRadius = "undefined" !== typeof options && "undefined" !== typeof options.radius ? options.radius : 5;
			var defaults = {
				deg : Math.random() * 30 + 30,
				fill : BCRUtils.getRandColor(),
				radius : defaultRadius,
				speed : Math.random() * 1 + 1,
				x : Math.round(Math.random() * (BCRGameInstance.stage.width() - defaultRadius * 2)) + defaultRadius,
				y : Math.round(Math.random() * (BCRGameInstance.stage.height() - defaultRadius * 2)) + defaultRadius
			}
			$.extend(defaults, options);

			this.deg = defaults.deg;
			this.fill = defaults.fill;
			this.id = defaults.id;
			this.radius = defaults.radius;
			this.speed = defaults.speed;
			this.x = defaults.x;
			this.y = defaults.y;

			this.rad = BCRUtils.degToRad(this.deg);
			this.speedX = Math.cos(this.rad) * this.speed * (Math.round(Math.random()) === 0 ? 1 : -1);
			this.speedY = Math.sin(this.rad) * this.speed * (Math.round(Math.random()) === 0 ? 1 : -1);

			this.kineticNode = new Kinetic.Circle(defaults);

			return this;
		},

		// methods
		addToBoard : function() {
			BCRGameInstance.addToBoard(this);
			this.getKineticNode().cache({
				x : -this.getRadius(),
				y : -this.getRadius()
			}).offset({
				x : this.getRadius(),
				y : this.getRadius()
			});

			return this;
		},
		explode : function(grade) {
			var newGrade = grade * 2;
			BCRGameInstance.addExplosion({
				position : { x : this.x, y : this.y },
				fill : this.fill,
				grade : newGrade,
				origin : "BCRSphere",
				text : newGrade
			});
			if(newGrade > BCRGameInstance.maximumGrade) BCRGameInstance.setMaxGrade(newGrade);
			BCRGameInstance.setPoints(BCRGameInstance.points + newGrade);
			return this;
		},
		isColliding : function(cloud) {
			var r0 = this.getRadius();
			var r1 = cloud.getRadius();
			var x0 = this.getX();
			var y0 = this.getY();
			var x1 = cloud.getX();
			var y1 = cloud.getY();

			var r0mr1 = r0-r1;
			var x0mx1 = x0-x1;
			var y0my1 = y0-y1;
			var r0pr1 = r0+r1;

			var r0mr12 = r0mr1*r0mr1;
			var x0mx12 = x0mx1*x0mx1;
			var y0my12 = y0my1*y0my1;
			var r0pr12 = r0pr1*r0pr1;

			var x0mx12py0my12 = x0mx12+y0my12;

			return r0mr12 <= x0mx12py0my12 && x0mx12py0my12 <= r0pr12;
		},
		remove : function() { this.kineticNode.remove(); return this; },

		// getters
		getId : function() { return this.id; },
		getKineticNode : function() { return this.kineticNode; },
		getRadius : function() { return this.radius; },
		getSpeedX : function() { return this.speedX; },
		getSpeedY : function() { return this.speedY; },
		getX : function() { return this.x; },
		getY : function() { return this.y; },

		// setters
		setId : function(val) { if("undefined" !== typeof val) this.id = val; return this; },
		setSpeedX : function(val) { if("undefined" !== typeof val) this.speedX = val; return this; },
		setSpeedY : function(val) { if("undefined" !== typeof val) this.speedY = val; return this; },
		setX : function(val) { if("undefined" !== typeof val) { this.x = val; this.kineticNode.x(this.x); } return this; },
		setY : function(val) { if("undefined" !== typeof val) { this.y = val; this.kineticNode.y(this.y); } return this; }
	});

	var BCRPowerUp = BCRSphere.extend("BCRPowerUp", {
		// constructor
		__construct : function(options) {
			var defaults = {
				radius : 10,
				speed : 1
			}
			$.extend(defaults, options);
			var parent = arguments.callee.$.__construct.call(this, defaults);

			for(var key in parent)
				if("function" !== typeof parent[key]) this[key] = parent[key];
			delete parent;

			return this;
		},

		// methods
		explode : function(origin, text) {
			this.text = new BCRText({
				position : { x : this.x, y : this.y },
				text : text
			});
			BCRGameInstance.addToBoard(this.text);
			this.text.setOffsetX(this.text.getWidth() / 2).setOffsetY(this.text.getHeight() / 2);
			var textNode = this.text.getKineticNode();
			var t = new Kinetic.Tween({
				node : textNode,
				opacity : 0,
				y : this.y - 50,
				easing : Kinetic.Easings.EaseIn,
				duration : 1,
				onFinish : function() {
					textNode.remove();
				}
			});
			t.play();

			return this;
		}
	});

	var BCRPowerUps = {
		Double : BCRPowerUp.extend("BCRPowerUps.Double", {
			//methods
			activate : function() {
				BCRGameInstance.$container.addClass("active");
			},
			explode : function(grade) { return arguments.callee.$.explode.call(this, "BCRPowerUps.Double", "DOUBLE"); }
		}),
		Radius : BCRPowerUp.extend("BCRPowerUps.Radius", {
			//methods
			activate : function() {
				var that = this;
				BCRGameInstance.explosionRadius = BCRGameInstance.defaults.poweredExplosionRadius;
				setTimeout(function() {
					that.deactivate();
				}, BCRGameInstance.powerUpDuration * 1000);
			},
			deactivate : function() {
				BCRGameInstance.explosionRadius = BCRGameInstance.defaults.baseExplosionRadius;
			},
			explode : function(grade) { return arguments.callee.$.explode.call(this, "BCRPowerUps.Radius", "RADIUS"); }
		}),
		Time : BCRPowerUp.extend("BCRPowerUps.Time", {
			//methods
			activate : function() {
				var that = this;
				BCRGameInstance.explosionDuration = BCRGameInstance.defaults.poweredExplosionDuration;
				setTimeout(function() {
					that.deactivate();
				}, BCRGameInstance.powerUpDuration * 1000);
			},
			deactivate : function() {
				BCRGameInstance.explosionDuration = BCRGameInstance.defaults.baseExplosionDuration;
			},
			explode : function(grade) { return arguments.callee.$.explode.call(this, "BCRPowerUps.Time", "TIME"); }
		}),
	}

	var BCRGameInstance;

	var BCRGame = function(containerId) {
		var game = this;
		this.$container = $("#" + containerId);

		this.defaults = {
			baseExplosionDuration : 2,
			baseExplosionRadius : 35,
			poweredExplosionDuration : 4,
			poweredExplosionRadius : 70,
			powerUpDuration : 2
		}

		this.explosionDuration = this.defaults.baseExplosionDuration;
		this.explosionRadius = this.defaults.baseExplosionRadius;
		this.powerUpDuration = this.defaults.powerUpDuration;

		this.levels = [{
			minimumGrade : Math.pow(2,1),
			spheres : 5
		},{
			minimumGrade : Math.pow(2,2),
			spheres : 10
		},{
			minimumGrade : Math.pow(2,3),
			spheres : 15
		},{
			minimumGrade : Math.pow(2,4),
			spheres : 20
		},{
			minimumGrade : Math.pow(2,6),
			spheres : 25
		},{
			minimumGrade : Math.pow(2,8),
			spheres : 30
		},{
			minimumGrade : Math.pow(2,10),
			spheres : 35
		},{
			minimumGrade : Math.pow(2,12),
			spheres : 40
		},{
			minimumGrade : Math.pow(2,15),
			spheres : 45
		},{
			minimumGrade : Math.pow(2,18),
			spheres : 50
		},{
			minimumGrade : Math.pow(2,21),
			spheres : 55
		},{
			minimumGrade : Math.pow(2,24),
			spheres : 60
		}];
		this.currentLevel = 0;

		this.spheres = [];
		this.activeExplosions = {};
		this.lastExplosionId = 0;

		this.maximumGrade = 0;
		this.points = 0;

		this.stage = new Kinetic.Stage({
			container : containerId,
			width : $("#" + containerId).width(),
			height : $("#" + containerId).height()
		});

		this.boardLayer = new Kinetic.Layer();
		this.HUDLayer = new Kinetic.Layer();

		$(document).on("click", "#" + containerId + ".active", function(event) {
			game.startChain({
				x : "undefined" !== typeof event.offsetX ? event.offsetX : event.originalEvent.layerX,
				y : "undefined" !== typeof event.offsetY ? event.offsetY : event.originalEvent.layerY
			});
		})
		this.$container.addClass("active");

		this.pointsText = new BCRText({
			position : { x : 5, y : 5},
			text : "Points: " + this.points
		});
		this.maxGradeText = new BCRText({
			position : { x : 5, y : this.stage.height() - 15 },
			text : "Max grade: " + this.maximumGrade
		});
		this.addToHUD(this.pointsText).addToHUD(this.maxGradeText);

		this.stage.add(this.boardLayer).add(this.HUDLayer);

		// test
		BCRUtils.addTestButton("start", 1, $.proxy(function() { this.start(); }, this));
		// BCRUtils.addTestButton("stop", 2, $.proxy(function() { this.stop(); }, this));
		// BCRUtils.addTestButton("clear", 3, $.proxy(function() { this.clearBoard(); }, this));
		// BCRUtils.addTestButton("sphere", 4, $.proxy(function() { this.addSphere(); }, this));
		// BCRUtils.addTestButton("add100", 5, $.proxy(function() { for(var i=0; i<100; i++) this.addSphere(); }, this));
		// BCRUtils.addTestButton("addDouble", 6, $.proxy(function() { this.addPowerUp("double"); }, this));
		// BCRUtils.addTestButton("addRadius", 7, $.proxy(function() { this.addPowerUp("radius"); }, this));
		// BCRUtils.addTestButton("addTime", 8, $.proxy(function() { this.addPowerUp("time"); }, this));
		// BCRUtils.addTestButton("useDouble", 9, $.proxy(function() { this.activatePowerUp("double"); }, this));
		BCRUtils.addTestButton("useRadius", 10, $.proxy(function() { this.activatePowerUp("radius"); }, this));
		BCRUtils.addTestButton("useTime", 11, $.proxy(function() { this.activatePowerUp("time"); }, this));

		// BCRUtils.addTestButton("test_0", 1, function() { game.test(0); });
		// BCRUtils.addTestButton("test_1", 2, function() { game.test(1); });
		// BCRUtils.addTestButton("test_2", 3, function() { game.test(2); });
		// BCRUtils.addTestButton("test_3", 4, function() { game.test(3); });
		// BCRUtils.addTestButton("test_4", 5, function() { game.test(4); });
		// BCRUtils.addTestButton("test_5", 6, function() { game.test(5); });
		// BCRUtils.addTestButton("test_6", 7, function() { game.test(6); });
		// BCRUtils.addTestButton("test_7", 8, function() { game.test(7); });
		// BCRUtils.addTestButton("test_8", 9, function() { game.test(8); });
		// BCRUtils.addTestButton("test_9", 10, function() { game.test(9); });
		// BCRUtils.addTestButton("test_10", 11, function() { game.test(10); });
		// BCRUtils.addTestButton("test_11", 12, function() { game.test(11); });

		return this;
	}

	BCRGame.prototype = {
		activatePowerUp : function(type) {
			var types = ["Double", "Radius", "Time"];
			type = "undefined" !== typeof type ? BCRUtils.capitalize(type) : types[Math.floor(Math.random() * 3)];
			BCRPowerUps[type].prototype.activate();
			return this;
		},
		addExplosion : function(options) {
			var e = new BCRExplosion(options);
			this.activeExplosions[this.lastExplosionId] = e.setId(this.lastExplosionId);
			this.lastExplosionId++;
			return e.addToBoard();
		},
		addPowerUp : function(type) {
			var types = ["Double", "Radius", "Time"];
			type = "undefined" !== typeof type ? BCRUtils.capitalize(type) : types[Math.floor(Math.random() * 3)];
			var p = new BCRPowerUps[type]();
			p.setId(this.spheres.push(p) - 1);
			return p.addToBoard();
		},
		addSphere : function(options) {
			var s = new BCRSphere(options);
			s.setId(this.spheres.push(s) - 1);
			return s.addToBoard();
		},
		addToBoard : function(obj) {
			this.boardLayer.add(obj.getKineticNode()).batchDraw();
			return this;
		},
		addToHUD : function(obj) {
			this.HUDLayer.add(obj.getKineticNode()).batchDraw();
			return this;
		},
		clearBoard : function() {
			this.spheres = [];
			delete this.starter;
			this.boardLayer.removeChildren();
			this.drawBoard();
			this.$container.addClass("active");
			return this;
		},
		drawBoard : function() {
			this.boardLayer.batchDraw();
			return this;
		},
		drawHUD : function() {
			this.HUDLayer.batchDraw();
			return this;
		},
		end : function() {
			this.stop();
			if(this.maximumGrade >= this.levels[this.currentLevel].minimumGrade)
				if("undefined" !== typeof this.levels[this.currentLevel + 1]) {
					alert("Level cleared! Advance to next level.");
					this.playLevel(this.currentLevel + 1, true);
				}
				else {
					alert("Game ended!\nPoints: " + game.points + "\nMaximum grade reached: " + game.maximumGrade);
					this.playLevel(0).setPoints(0).setMaxGrade(0);
				}
			else {
				alert("Level not cleared! Try again.");
				this.playLevel(this.currentLevel, true);
			}
			return this;
		},
		fire : function(event) {
			this.stage.fire(event);
			return this;
		},
		on : function(event, callback) {
			this.stage.on(event, callback);
			return this;
		},
		playLevel : function(level, start) {
			this.clearBoard();
			this.setMaxGrade(0);
			this.currentLevel = level;
			for(var i=0; i<this.levels[this.currentLevel].spheres; i++) this.addSphere();
			if(start === true) this.start();
			return this;
		},
		removeExplosion : function(id) {
			var e = this.activeExplosions[id];
			e.remove();
			delete this.activeExplosions[id];
			return this;
		},
		removeSphere : function(id) {
			var s = this.spheres[id];
			s.remove()
			delete this.spheres[id];
			return this;
		},
		setMaxGrade : function(grade) {
			this.maximumGrade = grade;
			this.maxGradeText.setText("Max grade: " + this.maximumGrade);
			this.drawHUD();
			return this;
		},
		setPoints : function(points) {
			this.points = points;
			this.pointsText.setText("Points: " + this.points);
			this.drawHUD();
			return this;
		},
		start : function() {
			if("undefined" === typeof this.rAF)
				this.updateBoard();
			return this;
		},
		startChain : function(position) {
			this.$container.removeClass("active");
			this.starter = this.addExplosion({
				position : position,
				fill : "#DDDDDD",
				grade : 1,
				chainable : true
			});
			return this;
		},
		stop : function() {
			cancelAnimationFrame(this.rAF);
			delete this.rAF;
			return this;
		},
		test : function(level) {
			this.playLevel(level, true);
			// BCRUtils.simulateClick(this.stage.width() / 2 + this.$container.offset().left, this.stage.height() / 2 + this.$container.offset().top);
			BCRUtils.simulateClick(this.$container.offset().left + 5, this.$container.offset().top + 5);
			return this;
		},
		updateBoard : function() {
			var game = this;
			function update() {
				game.rAF = requestAnimationFrame(update);

				for(var i=0; i<game.spheres.length; i++) {
					var sphere = game.spheres[i];
					if("undefined" !== typeof sphere) {
						var newX = sphere.getX() + sphere.getSpeedX();
						var newY = sphere.getY() + sphere.getSpeedY();
						switch(true) {
							case newY + sphere.getRadius() >= game.stage.height() :
							case newY - sphere.getRadius() <= 0 :
								sphere.setSpeedY(sphere.getSpeedY() * -1);
								newY = sphere.getY() + sphere.getSpeedY();
							break;
							case newX + sphere.getRadius() >= game.stage.width() :
							case newX - sphere.getRadius() <= 0 :
								sphere.setSpeedX(sphere.getSpeedX() * -1);
								newX = sphere.getX() + sphere.getSpeedX();
							break;
						}
						sphere.setX(newX);
						sphere.setY(newY);

						for(var j in game.activeExplosions) {
							var cloud = game.activeExplosions[j];
							if(cloud.isChainable() && sphere.isColliding(cloud)) {
								game.removeSphere(sphere.explode(cloud.getGrade()).getId());
								break;
							}
						}
					}
				}

				if("undefined" !== typeof game.starter && Object.keys(game.activeExplosions).length === 0) {
					game.end();
				}

				game.drawBoard();
			}
			update();
		}
	}

	window.BCRGame = function(containerId) {
		return BCRGameInstance = BCRGameInstance || new BCRGame(containerId);
	}

})();
