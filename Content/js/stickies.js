(function(query){
	models.note = function(){
		var self = models.model.apply(this, []);
		var id = 0;
		Object.defineProperty(this, 'id', {
			get: function(){return id;}
			, set: function(v){
				var old = id;
				id = v;
				this.changed('id', old, v, this);
			}
		});
		var order = 0;
		Object.defineProperty(this, 'order', {
			get: function(){return order;}
			, set: function(v){
				var old = order;
				order = v;
				this.changed('order', old, v, this);
			}
		});
		var text = null;
		Object.defineProperty(this, 'text', {
			get: function(){return text;}
			, set: function(v){
				var old = text;
				text = v;
				this.changed('text', old, v, this);
			}
		});
		var timestamp = new Date();
		Object.defineProperty(this, 'timestamp', {
			get: function(){return timestamp;}
			, set: function(v){
				var old = timestamp;
				timestamp = v;
				this.changed('timestamp', old, v, this);
			}
		});
		var top = 0;
		Object.defineProperty(this, 'top', {
			get: function(){return top;}
			, set: function(v){
				var old = top;
				top = v;
				this.changed('top', old, v, this);
			}
		});
		var left = 0;
		Object.defineProperty(this, 'left', {
			get: function(){return left;}
			, set: function(v){
				var old = left;
				left = v;
				this.changed('left', old, v, this);
			}
		});
		var z = 0;
		Object.defineProperty(this, 'z', {
			get: function(){return z;}
			, set: function(v){
				var old = z;
				z = v;
				this.changed('z', old, v, this);
			}
		});
		var parent_id = 0;
		Object.defineProperty(this, 'parent_id', {
			get: function(){return parent_id;}
			, set: function(v){
				var old = parent_id;
				parent_id = v;
				this.changed('parent_id', old, v, this);
			}
		});
		var owner_id = 0;
		Object.defineProperty(this, 'owner_id', {
			get: function(){return owner_id;}
			, set: function(v){
				var old = owner_id;
				owner_id = v;
				this.changed('owner_id', old, v, this);
			}
		});
		var created = new Date();
		Object.defineProperty(this, 'created', {
			get: function(){return created;}
			, set: function(v){
				var old = created;
				created = v;
				this.changed('created', old, v, this);
			}
		});
		var url = null;
		Object.defineProperty(this, 'url', {
			get: function(){return url;}
			, set: function(v){
				var old = url;
				url = v;
				this.changed('url', old, v, this);
			}
		});
		return this;
	};
	models.notes = function(){
		var self = models.list.apply(this, []);
		return this;
	};
	views.signup = function(id, c, m, options){
		var self = views.view.apply(this, [id, c, m, options]);
		var name = this.container.querySelector("input[name='name']");
		var password = this.container.querySelector("input[name='password']");
		var button = this.container.querySelector("button");
		Object.defineProperty(this, "form", {
			get: function(){return this.container;}
		});
		Object.defineProperty(this, "button", {
			get: function(){return button;}
		});
		Object.defineProperty(this, "name", {
			get: function(){return name;}
		});
		Object.defineProperty(this, "password", {
			get: function(){return password;}
		});
		var nameErrorLabel = document.createElement('span');
		nameErrorLabel.className = 'validationError';
		nameErrorLabel.style.display = 'none';
		nameErrorLabel.innerHTML = 'Please enter a properly formated email address like joey@neverendingstickies.com';
		name.parentNode.insertBefore(nameErrorLabel, name.nextSibling);
		this.model.error.subscribe('name', this);
		this.will_release = function(){};
		this.update = function(key, old, v, m){
			if(m === this.model.error && key === 'name') nameErrorLabel.style.display = 'block';
		};
		return this;
	};
	controllers.signup = function(delegate, m){
		var self = controllers.controller.apply(this, [delegate, m]);
		var formSubmitDelegate = function(e){self.submit(e);};
		this.load_view = function(){
			this.view = new views.signup("signup", this, this.model);
			this.view.form.addEventListener("submit", formSubmitDelegate, true);
			return this;
		};
		this.hide = function(){
			this.view.hidden = true;
			return this;
		};
		this.submit = function(e){
			e.preventDefault();
			this.model.name = this.view.name.value;
			this.model.password = this.view.password.value;
			if(this.model.name.indexOf('@') === -1){
				this.model.error.name = 'Please enter a property formated email address like joey@neverendingstickies.com';
				return;
			}
			if(this.model.password.length === 0){
				this.model.error.password = 'You have to enter a password.';
				return;
			}
			this.view.button.disabled = true;
			Parse.User.signUp(this.model.name
				, this.model.password
				, { ACL: new Parse.ACL() }
				, {
					success: function(user) {
						console.log(user);
						notificationCenter.publish('didsignup', self, user);
					}
					, error: function(user, error) {
						console.log([user, error]);
						self.view.button.disabled = false;
					}
				}
		      );
		};
		
		this.will_release = function(){
			this.view.form.removeEventListener('submit', formSubmitDelegate, true);
		};
		return this;
	};
	views.sticky = function(id, c, m, options){
		var container = document.createElement('div');
		var header = document.createElement('header');
		var closeButton = document.createElement('button');
		var textarea = document.createElement('textarea');
		var overlay = document.createElement('div');

		closeButton.setAttribute('type', 'button');
		container.className = 'sticky';
		textarea.value = m ? m.text : '';
		overlay.className = 'overlay';
		closeButton.innerHTML = 'x';
		header.appendChild(closeButton);
		container.appendChild(header);
		container.appendChild(textarea);
		container.appendChild(overlay);
		
		var self = views.view.apply(this, [container, c, m, options]);
		m.subscribe('unique_id', this);
		m.subscribe('text', this);
		m.subscribe('top', this);
		m.subscribe('left', this);
		m.subscribe('z', this);
		m.subscribe('timestamp', this);
		this.hidden = true;
		document.body.appendChild(this.container);
		notificationCenter.publish('stickyhasloaded', this, m);
		Object.defineProperty(this, 'closeButton', {
			get: function(){ return closeButton;}
		});
		Object.defineProperty(this, 'textarea', {
			get: function(){return textarea;}
		});
		Object.defineProperty(this, 'overlay', {
			get: function(){return overlay;}
		});
		this.update = function(key, old, v, m){
			if(key === 'top') this.top = v;
			if(key === 'left') this.left = v;
			if(key === 'z') this.z = v;
		};
		return this;
	};
	
	controllers.sticky = function(delegate, m){
		var self = controllers.controller.apply(this, [delegate, m]);
		this.isActive = true;
		var message = document.createElement('p');
		var closeButtonDelegate = function(e){ self.closeButtonWasClicked(e);};
		document.body.appendChild(message);
		function getTouchEvent(e){
			if(e.touches && e.touches.length > 0){
				for(var i = 0; i < e.touches.length; i++){
					if(e.touches[i].target === self.view.header){
						e = e.touches[i];
						break;
					}
				}
			}
			return e;
		}
		this.load_view = function(){
			this.view = new views.sticky(null, this, this.model);
			this.view.container.addEventListener(device.CLICK, this, false);
		    this.view.header.addEventListener(device.CLICK, this, true);
		    this.view.header.addEventListener(device.MOUSEDOWN, this, false);
		    this.view.textarea.addEventListener(device.KEYUP, this, false);
		    this.view.closeButton.addEventListener(device.CLICK, closeButtonDelegate, false);
			this.view.textarea.addEventListener(device.FOCUS, this, true);
			this.view.textarea.addEventListener(device.BLUR, this, true);
			this.view.top = this.model.top;
			this.view.left = this.model.left;
			this.view.z = this.model.z;
			this.view.hidden = false;
		};
		this.handleEvent = function(e){
			if(this[e.type]){
				return this[e.type](e);
			}
			if(e.type === device.MOUSEMOVE){
				this.drag(e);
			}else if(e.type === device.MOUSEUP){
				this.dragEnd(e);
			}
		};
		this.drag = function(e){
			if(!this.isActive) return;
			e.preventDefault();
			e = getTouchEvent(e);
			if(e.clientY - this.view.start_y < 0) return false;
			if(e.clientX - this.view.start_x < 0) return false;
			this.model.left = e.clientX - this.view.start_x;
			this.model.top = e.clientY - this.view.start_y;
			var envelope = {top: this.model.top, left: this.model.left, bottom: this.view.size.height + this.model.top, right: this.model.left + this.view.size.width};
			return false;
		};
		this.dragStart = function(e){
			e.preventDefault();
			e = getTouchEvent(e);
			this.view.start_x = e.clientX - this.view.container.offsetLeft;
			this.view.start_y = e.clientY - this.view.container.offsetTop;
			window.addEventListener(device.MOUSEMOVE, this, true);
			window.addEventListener(device.MOUSEUP, this, true);
			return false;
		};
		this.dragEnd = function(e){
			window.removeEventListener(device.MOUSEMOVE, this, true);
			window.removeEventListener(device.MOUSEUP, this, true);
			var envelope = {top: this.model.top, left: this.model.left, bottom: this.view.size.height + this.model.top, right: this.model.left + this.view.size.width};
			this.delegate.stickyWasDropped(this, envelope);
			return false;
		};
		
		var saveTimer = null;
		var timerInterval = null;
		function timer(start, fireTimeInMilliSeconds, delegate){
			Object.defineProperty(this, 'start', {
				get: function(){ return start;}
				, set: function(v){ start = v;}
			});
			this.execute = function(){
				if(((new Date()) - start)/1000 > (fireTimeInMilliSeconds / 1000)) delegate();
			};
			return this;
		}
		
		this.keyup = function(e){
			this.model.text = e.target.value;
			if(saveTimer === null){
				saveTimer = new timer(new Date(), 1000, function(){
					clearInterval(timerInterval);
					self.delegate.stickyDidEndEditing(self, self.model);
					saveTimer = null;
					timerInterval = null;
				});
			}
			saveTimer.start = new Date();
			if(timerInterval === null) timerInterval = setInterval(saveTimer.execute, 250);
		};
		this.touchstart = function(e){
			this.mousedown(e);
		};
		this.mousedown = function(e){
			var target = e.target;
			if(e.target.nodeType === 3){
				target = e.target.parentNode;
			}
			e.preventDefault();
			this.delegate.setActive(this, e);
			if(target === this.view.closeButton){
			}else{
				this.dragStart(e);
			}
		};
		this.closeButtonWasClicked = function(e){
			if(e.button === 0 || device.CANTOUCH) this.delegate.closeSticky(this, e);			
		};
		this.blur = function(e){
			clearInterval(timerInterval);
			saveTimer = null;
			timerInterval = null;
			this.delegate.stickyDidEndEditing(this, this.model);
		};
		this.focus = function(e){
			this.delegate.stickyDidStartEditing(this, this.model);
		};
		this.click = function(e){
			e = getTouchEvent(e);
			if(e.target === this.view.closeButton) return;
			this.view.container.className = 'sticky';
			this.view.overlay.className = 'overlay';
			this.delegate.setActive(this);
		};
		this.hide = function(){
			this.view.hidden = true;
		};
		this.will_release = function(){
			window.removeEventListener(device.MOUSEMOVE, this, true);
			window.removeEventListener(device.MOUSEUP, this, true);
			this.view.container.removeEventListener(device.CLICK, this, false);
		    this.view.header.removeEventListener(device.CLICK, this, true);
		    this.view.header.removeEventListener(device.MOUSEDOWN, this, false);
		    this.view.textarea.removeEventListener(device.KEYUP, this, false);
		    this.view.closeButton.removeEventListener(device.CLICK, closeButtonDelegate, false);
			this.view.textarea.removeEventListener(device.FOCUS, this, true);
			this.view.textarea.removeEventListener(device.BLUR, this, true);
		};
		return this;
	};
	controllers.board = function(delegate, m){
		var self = controllers.controller.apply(this, [delegate, m]);
		var stickyControllers = [];
		var viewControllers = [];
		this.model.notes.subscribe('push', this);
		this.model.notes.subscribe('pop', this);
		this.model.notes.subscribe('remove', this);
		this.update = function(key, old, v, m){
			if(key === 'push') this.createSticky(v);
		};
		this.createSticky = function(note){
			var c = new controllers.sticky(this, note);
			c.load_view();
			viewControllers.push(c);
			this.setActive(c);
		};
		this.load_view = function(){
			for(var i=0;i<this.model.notes.length-1;i++){
				
			}
		};
		this.hide = function(){
			this.view.hidden = true;
		};
		this.stickyDidEndEditing = function(c, e){
			if(this.model.user) notificationCenter.publish("stickydidendediting", c, c.model);
		};
		this.stickyDidStartEditing = function(c, e){
			if(this.model.user) notificationCenter.publish("stickydidstartediting", c, c.model);
		};
		this.stickyWasDropped = function(c, e){
			if(this.model.user) notificationCenter.publish("stickywasdropped", c, c.model);
		};
		function findHighestZIndex(){
			var i = 0;
			var elems = document.querySelectorAll('body *');
			var ubounds = elems.length;
			var newZ = 0;
			var z = 0;
			for(i=0;i<ubounds;i++){
				if(getStyle(elems[i], 'position') !== 'static'){
					newZ = parseInt(getStyle(elems[i], 'z-index'));
					if(newZ > z) z = newZ;
				}
			}
			return z;
		}
		this.newSticky = function(){
			var note = new models.note();
			note.z = findHighestZIndex() + 1;
			note.url = window.location.href.replace(/http(s)?\:\/\//, '').replace(/\/$/, '');
			this.model.notes.push(note);
			if(this.model.user) notificationCenter.publish("stickywascreated", this, note);
		};
		this.closeSticky = function(c, e){
			if(this.model.user) notificationCenter.publish("stickywasclosed", c, c.model);			
			c.release();
		};
		this.setActive = function(c){
			for(var i = 0; i < viewControllers.length; i++){
				viewControllers[i].model.z = 1;
			}
			c.model.z = findHighestZIndex() + 1;
		};
		this.will_release = function(){};
		return this;
	};
	views.signin = function(id, c, m, options){
		var self = views.view.apply(this, [id, c, m, options]);
		var name = this.container.querySelector("input[name='name']");
		var password = this.container.querySelector("input[name='password']");
		var button = this.container.querySelector("button");
		Object.defineProperty(this, "form", {
			get: function(){return this.container;}
		});
		Object.defineProperty(this, "button", {
			get: function(){return button;}
		});
		Object.defineProperty(this, "name", {
			get: function(){return name;}
		});
		Object.defineProperty(this, "password", {
			get: function(){return password;}
		});
		this.will_release = function(){};
		return this;
	};
		
	controllers.signin = function(delegate, m){
		var self = controllers.controller.apply(this, [delegate, m]);
		var formSubmitDelegate = function(e){self.submit(e);};
		this.load_view = function(){
			this.view = new views.signin("signin", this, this.model);
			this.view.form.addEventListener("submit", formSubmitDelegate, true);
		};
		this.hide = function(){
			this.view.hidden = true;
		};
		this.submit = function(e){
			this.view.button.disabled = true;
			e.preventDefault();
			this.model.name = this.view.name.value;
			this.model.password = this.view.password.value;
			Parse.User.logIn(this.model.name
				, this.model.password
				, {
					success: function(user) {
						notificationCenter.publish("didsignin", self, user);
					}
					, error: function(user, error) {
						console.log([user, error]);
						self.view.button.disabled = false;
					}
				}
		      );
		};
		
		this.will_release = function(){
			this.view.form.removeEventListener("submit", formSubmitDelegate, true);
		};
		return this;
	};
	views.menu = function(id, c, m, options){
		var self = views.view.apply(this, [id, c, m, options]);
		if(!this.container){
			this.container = document.createElement('div');
			this.container.innerHTML = '<nav id="menu"><button type="button" id="newButton">New Sticky</button><a href="javascript:void(0);" id="signout">sign out</a></nav>';
			document.body.appendChild(this.container);
		}
		var signout = this.container.querySelector('#signout');
		Object.defineProperty(this, 'signout', {
			get: function(){return signout;}
			, configurable: false
		});
		var newButton = this.container.querySelector('#newButton');
		Object.defineProperty(this, 'newButton', {
			get: function(){return newButton;}
			, configurable: false
		});
		return this;
	}
	controllers.menu = function(delegate, m){
		var self = controllers.controller.apply(this, [delegate, m]);
		var signoutClickedDelegate = function(e){self.signoutClicked(e);};
		var newButtonClickedDelegate = function(e){self.newClicked(e);};
		
		this.load_view = function(){
			this.view = new views.menu('menu', this, this.model, null);
			this.view.signout.addEventListener('click', signoutClickedDelegate, true);
			this.view.newButton.addEventListener('click', newButtonClickedDelegate, true);
		};
		this.newClicked = function(e){
			e.preventDefault();
			this.delegate.newSticky(e);
		};
		this.signoutClicked = function(e){
			e.preventDefault();
			notificationCenter.publish('didsignout', this, this);
		};
		return this;
	}
	models.signupError = function(){
		var self = models.model.apply(this, []);
		var name = null;
		Object.defineProperty(this, 'name', {
			get: function(){return name;}
			, set: function(v){
				var old = name;
				name = v;
				this.changed('name', old, v, this);
			}
		});
		return self;
	};
	models.user = function(){
		var self = models.model.apply(this, []);
		Object.defineProperty(this, 'signedin', {
			get: function(){return Parse.User.current() !== null;}
		});
		
		var error = new models.signupError();
		Object.defineProperty(this, 'error', {
			get: function(){return error;}
			, set: function(v){
				var old = error;
				error = v;
				this.changed('error', old, v, this);
			}
		});
		return self;
	};
	// Repo to save models.
	controllers.ParseRepo = function(delegate, m){
		var self = controllers.controller.apply(this, [delegate, m]);
		var ParseNote = Parse.Object.extend('Note');
		var isSaving = false;
		notificationCenter.subscribe('stickywascreated', this, null);
		notificationCenter.subscribe('stickywasclosed', this, null);
		notificationCenter.subscribe('stickywasdropped', this, null);
		notificationCenter.subscribe('stickydidendediting', this, null);
		this.getAllForCurrentUser = function(delegate){
			var query = new Parse.Query('Note');
			query.find({
				success: function(results){
					delegate(results);
				}
				, error: function(error){
					console.log(error);
				}
			});
		};
		this.findByUrl = function(url, delegate){
			var query = new Parse.Query('Note');
			url = url.replace(/http(s?)\:\/\//, '').replace(/\/$/, '');
			query.containedIn('url', [url]).find({
				success: function(results){
					delegate(results);
				}
				, error: function(error){
					console.log(error);
				}
			});
		};
		this.delete = function(m, delegate){
			var note = new ParseNote();
			note.id = m.id;
			note.destroy();
		};
		this.save = function(m, delegate){
			if(isSaving) return;
			isSaving = true;
			var note = new ParseNote();
			note.set('order', m.order);
			note.set('text', m.text);
			note.set('top', m.top);
			note.set('left', m.left);
			note.set('z', m.z);
			if(m.url) note.set('url', m.url);
			note.id = m.id ? m.id : null;
			note.set('parent_id', m.parent_id);
			note.set('ACL', new Parse.ACL(Parse.User.current()));
			note.id = m.id ? m.id : null;
			note.save(null, {
				success: function(obj){
					m.id = obj.id;
					if(delegate) delegate(obj);
				}
				, error: function(obj, error){
					console.log(error);
				}
			});
			isSaving = false;
		};
		this.stickywasclosed = function(publisher, info){
			this.delete(info, null);
		};
		this.stickywascreated = function(publisher, info){
			this.save(info, null);
		};
		this.stickydidendediting = function(publisher, info){
			this.save(info, null);
		};
		this.stickywasdropped = function(publisher, info){
			this.save(info, null);
		};
		return this;
	};
	
	var app = (function(query){
		Parse.$ = query;
		Parse.initialize("8P7ZUzESH46eAfPhQrNdZrAHFTxNizeGUrqzegEG", "Ouc1yIeCbbQMIdVLBylHQuaiOwPYI683ViW7ZENd");
		var user = new models.user();
		var signupController = null;
		var signinController = null;
		var boardController = null;
		var menuController = null;
		var board = {note: new models.note(), notes: new models.notes(), user: Parse.User.current()};
		var repo = new controllers.ParseRepo(this, board.notes);
		var url = null;
		var scripts = document.getElementsByTagName('script');
		scripts=Array.prototype.slice.call(scripts);
		var script = scripts.pop();
		var div = document.createElement('div');
		while(script!=null){
			if(script.src!=undefined){
				if(script.src.indexOf('/public/js/index.js') > -1){
					url = script.src.replace('/public/js/index.js', '').split('?')[0];
				}
			}
			script = scripts.pop();
		}
		var self = {
			unload: function(e){
				if(boardController) boardController.release();
				if(menuController) menuController.release();
				if(signupController) signupController.release();
				if(signinController) signinController.release();
			}
			, didsignin: function(publisher, info){
				signupController.release();
				signinController.release();
				boardController = new controllers.board(this, board);
				boardController.load_view();
				menuController.load_view();
				div.parentNode.removeChild(div);				
				if(window.location.href.indexOf(url) === -1){
					repo.findByUrl(window.location.href, self.initializeStickies);
				}else{
					repo.getAllForCurrentUser(self.initializeStickies);				
				}
			}
			, didsignup: function(publisher, info){
				this.didsignin(publisher, info);
			}
			, didsignout: function(publisher, info){
				if(Parse.User.current() === null) return;
				Parse.User.logOut();
				window.location.href = "/";
			}
			, newSticky: function(e){
				boardController.newSticky();
			}
			, initializeStickies: function(stickies){
				for(var i = 0; i < stickies.length; i++){
					var note = new models.note();
					note.id = stickies[i].id;
					note.text = stickies[i].get('text');
					note.order = stickies[i].get('order');
					note.top = stickies[i].get('top');
					note.z = stickies[i].get('z');
					note.left = stickies[i].get('left');
					board.notes.push(note);
				}
			}
			, setActive: function(c, e){
				
			}
			, stickyWasDropped: function(c, envelope){
				
			}
			, closeSticky: function(c, e){
				c.release();
			}
			, handleEvent: function(e){
				console.log(e);
			}
		};
		menuController = new controllers.menu(self, user);
		menuController.load_view();
		menuController.view.hidden = false;
		boardController = new controllers.board(self, board);
		if(Parse.User.current() !== null){
			if(window.location.href.indexOf(url) === -1){
				repo.findByUrl(window.location.href, self.initializeStickies);
			}else{
				repo.getAllForCurrentUser(self.initializeStickies);				
			}
		}else{
			menuController.view.signout.style['display'] = 'none';
			$.get(url + "/signin.phtml", function(data){
				div.className = 'neverendingstickies signin';
				div.innerHTML = '<header>Neverending Stickies</header>' + data;
				$.get(url + "/signup.phtml", function(data){
					div.innerHTML += data;
					document.body.appendChild(div);
					signinController = new controllers.signin(this, user);
					signupController = new controllers.signup(this, user);
					signinController.load_view();
					signupController.load_view();
				});
			});
			var note = new models.note();
			note.top = 500;
			note.left = 100;
			note.text = "You can add stickies to any web page. Try it right now on this page by clicking on the New Sticky button.";
			board.notes.push(note);
		}
		
		notificationCenter.subscribe('didsignin', self, null);
		notificationCenter.subscribe('didsignup', self, null);
		notificationCenter.subscribe('didsignout', self, null);
		return self;
	})(query);
	window.addEventListener('unload', app.unload, true);
})(jQuery);
var neverendingStickiesAnalytics = (function(_gaq){
	_gaq.push(['_neverendingStickiesTracker._setAccount', 'UA-26060958-1']);
	_gaq.push(['_neverendingStickiesTracker._setAllowLinker', true]);
	_gaq.push(['_neverendingStickiesTracker._setDomainName', 'none']);
	_gaq.push(['_neverendingStickiesTracker._trackPageview']);
	var scripts = document.getElementsByTagName('script');
	var hasGoogleAnalytics = false;
	for(var i = 0; i < scripts.length; i++){
		if(scripts[i].src.indexOf('google-analytics.com') > -1){
			hasGoogleAnalytics = true;
			break;
		}
	}
	if(!hasGoogleAnalytics){
		(function() {
			var ga = document.createElement('script');
			ga.type = 'text/javascript'; ga.async = true;
			ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
			var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
		})();				
	}
	notificationCenter.subscribe('didsignup', this, null);
	notificationCenter.subscribe('didsignin', this, null);
	notificationCenter.subscribe('didsignout', this, null);
	notificationCenter.subscribe('stickywascreated', this, null);
	this.didsignup = function(publisher, info){
		_gaq.push(['_neverendingStickiesTracker._trackEvent', 'Register', 'Register']);
	};
	this.didsignin = function(publisher, info){
		_gaq.push(['_neverendingStickiesTracker._trackEvent', 'Signin', 'Signin']);
	};
	this.didsignout = function(publisher, info){
		_gaq.push(['_neverendingStickiesTracker._trackEvent', 'Signout', 'Signout']);
	};
	this.stickywascreated = function(publisher, info){
		_gaq.push(['_neverendingStickiesTracker._trackEvent', 'NewSticky', 'New Sticky']);
	};
	_gaq.push(['_neverendingStickiesTracker._trackEvent', 'BookmarkletLoaded', 'Bookmarklet Loaded']);
	return this;
})(_gaq || []);
