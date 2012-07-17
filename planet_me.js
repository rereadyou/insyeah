
var pm = planet_me = planet = {
	//init the planet
	init: function(pps){
	
		this.canvas = canvas = document.getElementById('planet_me');
		this.ctx = ctx 	= canvas.getContext('2d');
		
		this.property = this.property || {};
		this.property.lineWidth = 10.0;
		this.property.textBase  = {x: 100, y: 100};
		
		this.prop = this.property;
		this.dx = 10;
		this.dy = 10;
		this.psdxdy = this.psdxdy || {};
		
		//push current id's people in dqueue
		this.ps = this.ps || [];

		_that = this;
		for(var p in pps)
		{
			//console.info('p = ', p, ' pps[p] = ', pps[p]);
			//id, name, gender, color, value
			var id		= pps[p][0];
			var name	= pps[p][1];
			var gender	= pps[p][2];
			var color	= pps[p][3];
			var value	= pps[p][4];

			_that.psdxdy[id] = {'dx': _that.dx, 'dy': _that.dy};

			var randX = 400 || Math.floor(Math.random()*300) + 100;
			var randY = 250 || Math.floor(Math.random()*100) + 100;

			var circle = {x: randX, y: randY, r: value};

			//console.log(value, circle);
			_that.ps[id] = {'user': name, 'planet': circle, 'color': color};
		}
		
		
		
		
		
		return this;
	},
	
	circle: function(circle, lineWidth, color, shadow){
		var clockWise 	= 'true';
		var arcRange 	= {start: 0, end: Math.PI*2};
		
		var ctx = this.ctx;
		
			ctx.shadowColor	  = shadow ? shadow.color : color;
			ctx.shadowOffsetX = shadow ? shadow.offsetX : 1;
			ctx.shadowOffsetY = shadow ? shadow.offsetY : 1;
			ctx.shadowBlur	  = shadow ? shadow.blur : 2;
			//console.info('shadow color: ', ctx.shadowColor);

			ctx.beginPath();
			
			ctx.strokeStyle = color;
			ctx.lineColor 	= color;
			ctx.lineWidth 	= lineWidth;
			
			ctx.arc(circle.x, circle.y, circle.r, arcRange.start,  arcRange.end, clockWise);
			
			ctx.closePath();
			ctx.stroke();
			
		return this;
	},
	
	line: function(startPoint, endPoint, lineWidth, color)
	{
		var ctx = this.ctx;

		ctx.strokeStyle = color || 'rgba(125, 125, 125, 0.5)';
		ctx.lineWidth = lineWidth || 1;
		ctx.beginPath();
		ctx.moveTo(startPoint.x, startPoint.y);
		ctx.lineTo(endPoint.x, endPoint.y);
		ctx.stroke();

		return this;
	},

	txt: function(textBase, lineWidth, color, name)
	{
		var txtBaseline = 'top';
		var font 		= 'px arial, sans-serif';
		var fontSize 	= 1.5 * lineWidth || 12;
		var ctx = this.ctx;

		//calculate the text width on the screen which is about to print
		var txtWidth	= ctx.measureText(name).width;
		var offset		= txtWidth/2 + lineWidth;
		
		console.info(txtWidth, offset);

		ctx.fillStyle 	= color;
		ctx.font 		= fontSize + font;
		ctx.textBaseline= txtBaseline;				

		ctx.fillText(name, textBase.x - offset, textBase.y-fontSize/2);

		return this;
	},
	
	circleText: function(circle, textBase, lineWidth, color, name, fillCircumference){
		
		var fill	 = fillCircumference || false;
		var ctx		 = this.ctx;
		//save previous context;
		ctx.save();
			
		var txtWidth = ctx.measureText(name).width * lineWidth; //1.5 * lineWidth; 
		var circumference = 2 * Math.PI * circle.r;
		var eachCharAngle = txtWidth/circumference/name.length;
		
		//console.info(eachCharAngle, eachCharAngle*name.length, '|',txtWidth, circumference);

		var startAngle	  = 270 - eachCharAngle*name.length/2;
		
		this.holoNameAngle = this.holoNameAngle || {};
		var beg = this.holoNameAngle[name] || startAngle ;
		this.holoNameAngle[name] = beg - 0.2;
		_that = this;
		//console.info(this);

		ctx.translate(circle.x, circle.y);
		ctx.rotate(startAngle);
		ctx.font = '13px comic sans MS, sans-serif';
		for(var i = 0; i < name.length; i++)
		{
			ctx.save();
			//console.info(name[i], i*eachCharAngle);
			ctx.rotate(_that.holoNameAngle[name]+ i*eachCharAngle);
			ctx.fillText(name[i], 0, -circle.r+lineWidth/2);
			ctx.restore();
		}
		//restore context;
		ctx.restore();
	},
	
	coordinates_offset: function(angle, radious) {
		var r = radious;
		var x = r * Math.cos(angle);
		var y = r * Math.sin(angle);

		return {'x': x, 'y': y};
	},


	gradient_circle: function(circle, lineWidth, color) {
		var ctx = this.ctx;
		var c	= circle;
		
		ctx.save();

		ctx.beginPath();
		var gr = ctx.createRadialGradient(c.x, c.y, c.r+50, c.x, c.y, c.r+80);
			gr.addColorStop(0, 'rgba(255,0,0,0.5)');
			gr.addColorStop(1, 'rgba(0,255,0,0.5)');
		ctx.fillStyle = gr;
		ctx.fillRect(c.x-c.r-lineWidth, c.y-c.r-lineWidth, 300, 300);
		//ctx.fill();
		//ctx.fill(c.x-c.r-lineWidth, c.y-c.r-lineWidth, 2*(c.r+80), 2*(c.r+80));
		//ctx.arc(c.x, c.y, c.r+80, 0,  360, true);
		ctx.fill();
		
		ctx.restore();
	},

	clear: function() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		//console.info(this.canvas.width, this.canvas.height);
		return this;
	},
	
	load_date: function(json){
		//(id, name, gender, color, value)
		
	},
	
	draw: function(){
		var ps = this.ps;
		var pr = this.property;

		_that = this;

		//console.log('this.ps = ', this.ps['me']);
		//for(var p in ps)
		{
			var p = 'me';
			//console.info(p, ps);
			var c = ps[p].planet;
			var t = pr.textBase;
			var h = this.canvas.height;
			var w = this.canvas.width;
			
			/*
			c.x += _that.psdxdy[p].dx;
			c.y += _that.psdxdy[p].dy;
			t.x = c.x;
			t.y = c.y;
			
			//console.info(c, t);
			//console.info('1. c, t:', c, t);
			if(c.x > (w - c.r - 10) || c.x < c.r + 10)
			{
				_that.psdxdy[p].dx = - _that.psdxdy[p].dx;
			}
			if(c.y > (h - c.r - 10) || c.y < c.r + 10)
			{
				_that.psdxdy[p].dy = - _that.psdxdy[p].dy;
			}
			*/
		
			//console.info('c, t:', c, t);

			//ps[p].planet = c;
			//pr.textBase = t;
			
			//_that.gradient_circle(c, pr.lineWidth, ps[p].color);
			_that.circle(c, pr.lineWidth, ps[p].color);	
			_that.circleText(c, t, pr.lineWidth, ps[p].color, ps[p].user, false);

			var opcolor1 = ps[p].color.replace(/0?\.\d/, '0.08');
			var opcolor2 = ps[p].color.replace(/0?\.\d/, '0.05');
			var shadow = {color: opcolor1, alpha: 0.8, offsetX: 6, offsetY: 6, blur: 10};
			
			var fpLen = ps.length - 1;
			var eachFpAngle = 360/fpLen;
//console.info(this);
			var stepi = 0;
			for(var fp in ps)
			{
				
				var holo1r = c.r + 100;
				_that.circle({'x': c.x, 'y': c.y, 'r': holo1r}, 50, opcolor1, shadow);

				if(fp != p)
				{
					//console.info(fp, stepi, eachFpAngle);
					stepi++;

					_that.ctx.save();
					_that.ctx.translate(c.x, c.y);
					//_that.ctx.rotate(stepi*eachFpAngle);

					//the first holo 
					var ix = holo1r*Math.cos(stepi*eachFpAngle);
					var iy = holo1r*Math.sin(stepi*eachFpAngle);
					//var off = coordinates_offset(12, holo1r);
					var holo1c = {'x': ix, 'y': iy, 'r': ps[fp].planet.r};
					//console.info(holo1c);
					_that.circle(holo1c, pr.lineWidth, ps[fp].color);	
					_that.circleText(holo1c, t, pr.lineWidth, ps[fp].color, ps[fp].user, false);
					//_that.ps[fp];
					_that.ctx.restore();
				}
			}
			_that.circle({'x': c.x, 'y': c.y, 'r': c.r + 250}, 50, opcolor2, shadow);
			
			//_that.circle({'x': c.x, 'y': c.y, 'r': c.r + 170}, 1, ps[p].color);
			//echo name

			
			//_that.txt(t, pr.lineWidth, ps[p].color, ps[p].user);

			//draw connect line between pointers

			/*
			for(var p2 in _that.ps)
			{
				if(p != p2)
				{
					var b = {'x': c.x, 'y': c.y};
					var e = {'x': _that.ps[p2].planet.x, 'y': _that.ps[p2].planet.y};

					var pilot = '0'+b.x+b.y+e.x+e.y;
					
					_that.linesPilot = _that.linesPilot || 0;
					var withPilot = _that.linesPilot ^ parseInt(pilot);
					console.info(parseInt(pilot), withPilot);

					if(withPilot)
					{
						_that.linesPilot = withPilot;
						_that.line(b, e, 1, ps[p].color);
					
						_that.wire = _that.wire || [];
						_that.wire[_that.wire.length] = {'from': p, 'to': p2, 'beg': b, 'end': e};
					}
				}
			}
			*/
		}

		return this;
	},
	
	shake: function() {
		//move planet base point
		_that = this;
		this.canvas.onmousemove = function(event) {
			//var o = e.target || e.srcElement;
			var m = mouse = _that.get_mouse(event, _that.canvas);
			
			
			for(var p in _that.ps)
			{
				var v = _that.ps[p];
				//_that.ctx.clearRect(m.x, m.y, 2, 2);
				if(_that.enclose_check(v, m))
				{
					console.info('in '+p);
					_that.pop_div('me', v.x, v.y, 30, 30, 'rereadyou');
				}
				else
				{
					console.info('out '+p);
				}
				
			}
			
			
		};
		
		return this;
	},
	
	get_mouse: function(event, canvas){
		return mouse = {	x: event.pageX - canvas.offsetLeft,
		        			y: event.pageY - canvas.offsetTop
		    			};
		
	},
	
	pop_div: function(id, x, y, width, height, txt){
		if(document.getElementById(id))
		{
			return ;
		}
		var e = document.createElement('div');
			e.id = id;
			
			e.style.width = width;
			e.style.height = height;
			e.style.top = x;
			e.style.left = y;
			
			$(e).css({'index': '10', 'background-color': '#EEccFF', 'border': '1px solid #000000'}).html(txt);

			
		this.doc = window.document;
		this.canvas.parentNode.appendChild(e);
			
	},
	
	enclose_check: function(circle, mouse)
	{
		var c = circle;
		var m = mouse;
		
		return (m.x-c.x)*(m.x-c.x) + (m.y-c.y)*(m.y-c.y) < (c.r)*(c.r);
	},
	
	bubble: function() {
		
	},
	
	run: function(interval){
		
		_that = this;
		//this.draw();
		setInterval(function(){ _that.clear(); _that.draw();}, 100);
		//return this;
	}
	
};



planet.init([['me', 'rereadyou', 'male', 'rgba(75, 192, 238, 0.5)', 70],
			 ['he', 'zhangb', 'male', 'rgba(175, 92, 138, 0.5)', 40],
			 ['she', 'she', 'female', 'rgba(225, 92, 38, 0.5)', 40],
			 ['sea', 'sea', 'male', 'rgba(25, 92, 38, 0.5)', 40],
			 ['sky', 'sky', 'male', 'rgba(225, 192, 38, 0.5)', 45],
			 ['et', 'edward', 'female', 'rgba(225, 92, 138, 0.5)', 45],
			 ['may', 'may', 'female', 'rgba(85, 92, 38, 0.5)', 40]]);/*
			 ]);
	*/
//planet.loaddata();
planet.run();
//planet.draw();
//setInterval(planet.draw, 1000);
//pm.shake();

//console.info(pm);


