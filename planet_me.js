
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
			_that.ps.push({id: id, value: {'user': name, 'planet': circle, 'color': color}});
		}
		
		//console.info(this.ps);
		
		
		
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
		
		this.haloNameAngle = this.haloNameAngle || {};
		var beg = this.haloNameAngle[name] || startAngle ;
		this.haloNameAngle[name] = beg - 2*Math.PI/60;
		_that = this;
		//console.info(this);

		ctx.translate(circle.x, circle.y);
		ctx.rotate(startAngle);
		ctx.font = '13px comic sans MS, sans-serif';
		for(var i = 0; i < name.length; i++)
		{
			ctx.save();
			//console.info(name[i], i*eachCharAngle);
			ctx.rotate(_that.haloNameAngle[name]+ i*eachCharAngle);
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

		if(true)
		{			
			var c = ps[0].value.planet;
			var t = pr.textBase;
			var h = this.canvas.height;
			var w = this.canvas.width;
			//////////////////// random bounce ////////////////////
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
			////////////////// end random bounce //////////////////
			

			//ps[p].planet = c;
			//pr.textBase = t;
			
			//_that.gradient_circle(c, pr.lineWidth, ps[0].value.color);
			//_that.cxt.rotate();
			_that.circle(c, pr.lineWidth+10, ps[0].value.color);	
			_that.circleText(c, t, pr.lineWidth, ps[0].value.color, ps[0].value.user, false);

			//console.info('fp: ', fp);
			var halo1r = c.r + 100;
			var halo2r = c.r + 250;

			var opcolor1 = ps[0].value.color.replace(/0?\.\d/, '0.10');
			var opcolor2 = ps[0].value.color.replace(/0?\.\d/, '0.08');
			var shadow = {color: opcolor1, alpha: 0.4, offsetX: 6, offsetY: 6, blur: 10};
			
			//first halo
			_that.circle({'x': c.x, 'y': c.y, 'r': halo1r}, 50, opcolor1, shadow);

			var fpLen = ps.length - 1;
			var eachFpAngle = 2*Math.PI/fpLen;
			//console.info('ps.length', ps, ps.length);
			//console.info('eachFpAngle', fpLen, eachFpAngle);			

			//the rotate angle of first halo
			_that.halo1OffsetAngle = _that.halo1OffsetAngle || 0;
			_that.halo1OffsetAngle += -2*Math.PI/360;
			_that.halo1OffsetAngle %= -2*Math.PI;

			var offsetAngle = _that.halo1OffsetAngle;

			var stepi = 0;
			for(var fp in ps)
			{
				if(ps[fp].id != ps[0].id)
				{
					_that.ctx.save();
					_that.ctx.translate(c.x, c.y);//same effect with plus ix and iy the c.x and c.y
					
					//the first halo 
					var ix = halo1r * Math.cos(stepi*eachFpAngle + offsetAngle);// + c.x;
					var iy = halo1r * Math.sin(stepi*eachFpAngle + offsetAngle);// - c.y;
					
					
					var halo1c = {'x': ix, 'y': iy, 'r': ps[fp].value.planet.r};
					//if mouse over certain sub halo circle
					

					var coords = {'x': ix+c.x, 'y': c.y+iy, 'r': ps[fp].value.planet.r};
					//check if the cursor is enclosed by current sub sircle
					
					_that.enlargeCircle = _that.enlargeCircle || false;
					// if cursor not move and already in circle
					if(_that.mouse)
					{
						_that.enlargeCircle = _that.enclose_check(coords, _that.mouse);
					}
					//if cursor moved, do check if enclure condition
					_that.canvas.onmousemove = function(event) {			
							var m = _that.get_mouse(event, _that.canvas);				
							_that.enlargeCircle = _that.enclose_check(coords, m);
						};
					
					if(_that.enlargeCircle)
					{
						halo1c.r += 10;
						_that.enlargeCircle = false;
					}


					//console.info(halo1c);
					_that.circle(halo1c, pr.lineWidth, ps[fp].value.color);	
					_that.circleText(halo1c, t, pr.lineWidth, ps[fp].value.color, ps[fp].value.user, false);
					
					_that.ctx.restore();
					stepi++;
				}
			}

			//draw the second halo;
			_that.circle({'x': c.x, 'y': c.y, 'r': halo2r}, 50, opcolor2, shadow);
			
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

		_that.rotateY();

		return this;
	},
	
	shake: function(circle) {
		//move planet base point
		_that = this;
		_that.res = false;
		this.canvas.onmousemove = function(event) {
			//var o = e.target || e.srcElement;
			var m = mouse = _that.get_mouse(event, _that.canvas);
			
			if(circle)
			{
				//console.info('event ');
				//console.info(circle, m);
				//console.info('yyyyy', _that.enclose_check(circle, m));
				_that.res = _that.enclose_check(circle, m);
				
			}
			//console.info($res);
			/*
			for(var p in _that.ps)
			{
				var v = _that.ps[p].value.planet;
				//_that.ctx.clearRect(m.x, m.y, 2, 2);
				if(_that.enclose_check(v, m))
				{
					return 'in';
					console.info('in '+p);
					//_that.pop_div('me', v.x, v.y, 30, 30, 'rereadyou');
				}
				else
				{
					return 'out';
					console.info('out '+p);
				}
				
			}
			*/
			
			
		};
		//console.info('res: ', _that.res);
		return _that.res;
		//return this;
	},
	
	enclose_check: function(circle, mouse)
	{
		var c = circle;
		var m = mouse;
		//console.info(c, m);
		var $r = (m.x-c.x)*(m.x-c.x) + (m.y-c.y)*(m.y-c.y) < (c.r)*(c.r);
		//console.info('$r: ', $r);
		this.res = $r;
		//console.info(this.res);
		return $r;
	},

	get_mouse: function(event, canvas){
		 this.mouse = mouse = {	x: event.pageX - canvas.offsetLeft,
		        			y: event.pageY - canvas.offsetTop
		    			};
		return mouse;
	},
	
	project: function(p3d, zAngle){
		// project the 3d anxis to 2d anxis, the default angle is PI/4,
		// that is 45'
		var radius = zAngle || Math.PI/4,
				cos = Math.cos(radius);
				sin = Math.sin(radius);
				var z = p3d.z;
				var y = p3d.y;
				p3d.z = z*cos - y*sin;
				p3d.y = y*cos + z*sin;
			
			
			
		
		return p3d;
	},

	rotateY: function(p3d, radius){
		/*
		this.ctx.save();
		this.line({x:400, y:250}, {x:400, y:251},  20, 'rgba(5, 5, 5, 0.9)');
		this.line({x:400, y:250}, {x:401, y:250},  20, 'rgba(5, 5, 5, 0.9)');
		this.line({x:400, y:250}, {x:400, y:249},  20, 'rgba(5, 5, 5, 0.9)');
		this.line({x:400, y:250}, {x:399, y:250},  20, 'rgba(5, 5, 5, 0.9)');
		//anxis core
		this.ctx.translate(400, 200);
		
		this.radius = this.radius || 0;
		 var radius = (this.radius+Math.PI/360)%(2*Math.PI);
		this.radius = radius;
		*/
	    //radius is
		// cos(a+b) = cos(a)*cos(b) - sin(a)*sin(b);
		// cos(a-b) = cos(a)*cos(b) + sib(a)*sib(b);
		// sin(a+b) = sin(a)*cos(b) + cos(a)*sin(b);
		// sin(a-b) = sin(a)*cos(b) - cos(a)*sin(b);
		var p2 = {},  R = Math.round,  cos = Math.cos(radius), sin = Math.sin(radius);

		//   var x1 = r.cos(theta+radius);
		//	  x1 = r.cos(theta).cos(radius) - r*sin(theta).sin(radius);
		//   var z1 = r*sin(theta+radius);
		//    z1 = r*sin(theta)*cos(radius) + r*cos(theta)*sin(radius);
	    // r.cos(theta) == p3d.x
		// r.sin(theta) == p3d.z
		//console.info(this.$3dlines);
		var x = p3d.x, y = p3d.y, z = p3d.z;

		var x1 = x*cos - z*sin;
		var z1 = z*cos - x*cos;
		var y1 = y;
	
		return p3d = {x: R(x1), y: R(y1), z: R(z1)};

		/*
		for(var line in this.$3dlines)
		{
			var beg = this.$3dlines[line].beg;
			var end = this.$3dlines[line].end;

			var x = beg.x*cos - beg.z*sin;
			var z = beg.z*cos - beg.x*cos;
			var y = beg.y;

			var x1 = end.x*cos - end.z*sin;
			var z1 = end.z*cos - end.x*cos;
			var y1 = end.y;
			
			var xx = {x: x,  y: y};
			var zz = {x: x1,  y: y1};

			beg = {x: x, y: y, z: z};
			end = {x: x1, y: y1, z: z1};
		
			//this.line( xx,  zz, 2, 'rgba(5, 5, 5, 0.9)');
		}
		*/
		
		//this.ctx.restore();
		//return p2;
	},

	rotateX: function(p3d, radius) 
	{
		var p2 = {} ,  cos = Math.cos(radius), sin = Math.sin(radius); 
		var x = p3d.x, y = p3d.y, z = p3d.z;

		var x1 = x;
		var y1 = y*cos + z*sin;
		var z1 = z*cos - y*sin;
		
		return p3d = {x: x1, y: y1, z: z1};
	},

	rotateZ: function(p3d, radius) 
	{
		var p2 = {} ,  cos = Math.cos(radius), sin = Math.sin(radius); 
		var x = p3d.x, y = p3d.y, z = p3d.z;

		var x1 = x*cos - y*sin;
		var y1 = y*cos + x*sin;
		var z1 = z;
		
		return p3d = {x: Math.round(x1), y: Math.round(y1), z: Math.round(z1)};
	},

	box: function(core, length, width, height)
	{
		var $lines = this.$3dlines = this.$3dlines || [];
		// a box is totally of 12 lines
		/*      a                       b
			   /|-------2--------/|
			 /  |                       / |
		   1   5                     3 6
		  /     |                    /    |
	  c/--------4--------/d    |
	    |   a'/-------10----|----/b'
		|    /                      |    /
	   8  9            *         7 11
	    | /                         | /
	 c |--------12--------|d'

				        ^
					   /|\
			             |    /
				       y|  /
					     |/     x
			--------+---------->
				       /|
				    z/ |
				    /   |
				 \/__
			   
		*/
		//push the 3d xyz value to lines for every of the 12 lines
		var l = length / 2;
		var w = width / 2;
		var h = height / 2;
		var x = core.x;
		var y = core.y;
		var z = core.z;
		//suppose the x axis is from * to right, y is from * to down, z is from * to up
		var a = {x: -l, y: -w, z: h}, 
			b = {x: l,  y: -w, z: h}, 
			c = {x: -l, y: w,  z: h}, 
			d = {x: l,  y: w,  z: h},
			a1 = {x: -l, y: -w, z: -h}, 
			b1 = {x: l,  y: -w, z: -h}, 
			c1 = {x: -l, y: w,  z: -h}, 
			d1 = {x: l,  y: w,  z: -h};

		$lines.push({beg:c, end:a}); // line 1
		$lines.push({beg:a, end:b}); // line 1
		$lines.push({beg:b, end:d}); // line 1
		$lines.push({beg:d, end:c}); // line 1

		$lines.push({beg:a, end:a1}); // line 1
		$lines.push({beg:b, end:b1}); // line 1
		$lines.push({beg:c, end:c1}); // line 1
		$lines.push({beg:d, end:d1}); // line 1

		$lines.push({beg:c1, end:a1}); // line 1
		$lines.push({beg:a1, end:b1}); // line 1
		$lines.push({beg:b1, end:d1}); // line 1
		$lines.push({beg:d1, end:c1}); // line 1

		//console.info(this.$3dlines);
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
	
	bubble: function() {
		
	},
	
	run: function(interval){
		
		_that = this;
		//this.draw();

		var radiusX = Math.PI/36;
		var radiusZ = Math.PI/36;
		this.box({x: 50, y: 50, z: 50}, 100, 100, 100);
		var timer = setInterval(function(){ _that.clear(); 
				_that.canvas.onmousemove

				_that.radius = _that.radius || 0;
				  var radius = (_that.radius+Math.PI/360)%(2*Math.PI);
				_that.radius = radius;

		_that.line({x:400, y:250}, {x:400, y:251},  20, 'rgba(5, 5, 5, 0.9)');
		_that.line({x:400, y:250}, {x:401, y:250},  20, 'rgba(5, 5, 5, 0.9)');
		_that.line({x:400, y:250}, {x:400, y:249},  20, 'rgba(5, 5, 5, 0.9)');
		_that.line({x:400, y:250}, {x:399, y:250},  20, 'rgba(5, 5, 5, 0.9)');
				_that.ctx.save();
				_that.ctx.translate(400, 250);
				
				
				for(var l in _that.$3dlines)
				{

					var e = _that.$3dlines[l];
					//console.info(e);
					var beg = _that.$3dlines[l].beg;
					var end = _that.$3dlines[l].end;
						
						beg = _that.rotateY(beg, radius);
						end = _that.rotateY(end, radius);
					
					
					//beg = _that.rotateX(beg, radiusX);
					//end = _that.rotateX(end, radiusX);

					//beg = _that.rotateZ(beg, radiusZ);
					//end = _that.rotateZ(end, radiusZ);
					
					var b = beg;
						  b = _that.project(b, Math.PI/4);
					var e = end;
						  e = _that.project(e, Math.PI/4);
					
					_that.line(b, e, 1, 'rgba(0,0,0,0.5)');
					//console.info(r, g, b);
				}
				_that.ctx.restore();
				//clearInterval(timer);
			//_that.draw();
			},  1000/24);
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


