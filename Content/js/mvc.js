var mvc = {};
mvc.device = (function () {
    var self = {};
    self.CANTOUCH = ("createTouch" in document);
    self.MOUSEDOWN = self.CANTOUCH ? "touchstart" : "mousedown";
    self.MOUSEMOVE = self.CANTOUCH ? "touchmove" : "mousemove";
    self.MOUSEUP = self.CANTOUCH ? "touchend" : "mouseup";
    self.CLICK = "click";
    self.DOUBLECLICK = "dblclick";
    self.KEYUP = "keyup";
    self.SEARCH = "search";
    self.INPUT = "input";
    self.BLUR = "blur";
    self.UNLOAD = "unload";
    self.CHANGE = "change";
    self.SCROLL = "scroll";
    self.FOCUS = "focus";
    self.SUBMIT = "submit";
    return self;
})();

mvc.model = function (obj) {
    var dependents = {};
	var self = this;
    this.subscribe = function (key, subscriber) {
        if (dependents[key] === undefined) dependents[key] = [];
        dependents[key].push(subscriber);
    };
    this.unsubscribe = function (subscriber) {
        for (key in dependents) {
            var i = 0;
            var ubounds = dependents[key].length;
            for (i; i < ubounds; i++) {
                if (dependents[key][i] === subscriber) {
                    dependents[key].splice(i, 1);
                    if (dependents[key].length === 0) delete dependents[key];
                    break;
                }
            }
        }
    };
    this.changed = function (key, old, v) {
        if (dependents[key] === undefined) return;
        var i = 0;
        var ubounds = dependents[key].length;
        for (i; i < ubounds; i++) {
            dependents[key][i].update(key, old, v, this);
        }
    };
	if(obj){
		for(key in obj){
			Object.defineProperty(this, key, {
				get: function(){
					return obj[key];
				}
				, set: function(v){
					var old = obj[key];
					obj[key] = v;
					self.changed(key, old, v);
				}
			})
		}
	}
    return this;
};
mvc.model.init = function (obj, m) {
    for (key in obj) {
        m[key] = obj[key];
    }
    return m;
};
mvc.model.list = function (list) {
    mvc.model.apply(this, []);
    var inner_list = list ? list : [];
    this.push = function (item) {
        inner_list.push(item);
        this.changed("push", null, item);
    };
    this.pop = function () {
        var last = inner_list.pop();
        this.changed("pop", last, null);
        return last;
    };
    this.shift = function () {
        var first = inner_list.shift();
        this.changed("shift", null, first);
        return first;
    };
    this.unshift = function (items) {
        var length = inner_list.unshift(items);
        this.changed("unshift", null, items);
        return length;
    };
    this.remove = function (delegate) {
        var i = 0;
        var ubounds = inner_list.length;
        var deleted = [];
        for (i; i < ubounds; i++) {
            if (delegate(i, inner_list[i])) {
                deleted = inner_list.splice(i, 1);
                this.changed("remove", deleted[0], i);
                break;
            }
        }
        return deleted[0];
    };
    this.item = function (i) {
        return inner_list[i];
    };
    this.find = function (delegate) {
        var i = 0;
        var ubounds = inner_list.length;
        for (i; i < ubounds; i++) {
            if (delegate(i, inner_list[i])) return inner_list[i];
        }
        return null;
    };
    this.items = function () {
        return inner_list;
    };
    this.length = function () {
        return inner_list.length;
    };
    this.clear = function () {
        while (this.length() > 0) {
            this.pop();
        }
        inner_list = [];
    };
    return this;
};

mvc.controller = function (model, delegate) {
    var view = null;
    var options = null;
    var self = this;
    Object.defineProperty(this, "view", {
        get: function () { return view; }
        , set: function (v) { view = v; }
        , configurable: false
    });
    Object.defineProperty(this, "delegate", {
        get: function () { return delegate; }
        , set: function (v) { delegate = v; }
        , configurable: false
    });
    Object.defineProperty(this, "model", {
        get: function () { return model; }
        , set: function (v) { model = v; }
        , configurable: false
    });

    this.set_editing = function (animated) {
        if (this.view.set_editing) this.view.set_editing(animated);
    };
    this.view_did_load = function (view) {
        return;
    };
    this.view_did_unload = function () {
        return;
    };
    this.release = function () {
        if (this.view === null) return;
        this.view.release();
        this.view = null;
    };
    this.load_view = function () {
        return;
    };
    var eventMatchers = {
        "HTMLEvents": /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
        "MouseEvents": /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
    };
    var defaultOptions = {
        pointerX: 0,
        pointerY: 0,
        button: 0,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false,
        bubbles: true,
        cancelable: true
    };
    function extend(destination, source) {
        for (var property in source)
            destination[property] = source[property];
        return destination;
    }

    this.fire = function (element, eventName) {
        var options = extend(defaultOptions, arguments[2] || {});
        var oEvent, eventType = null;
        for (var name in eventMatchers) {
            if (eventMatchers[name].test(eventName)) { eventType = name; break; }
        }
        if (!eventType)
            throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');
        if (document.createEvent) {
            oEvent = document.createEvent(eventType);
            if (eventType == 'HTMLEvents') {
                oEvent.initEvent(eventName, options.bubbles, options.cancelable);
            } else {
                oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
					options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
					options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
            }
            element.dispatchEvent(oEvent);
        } else {
            options.clientX = options.pointerX;
            options.clientY = options.pointerY;
            var evt = document.createEventObject();
            oEvent = extend(evt, options);
            element.fireEvent('on' + eventName, oEvent);
        }
        return element;
    };

    return this;
};

(function (obj) {
    var views = [];
    obj.set_active_view = function (v) {
        var i = 0;
        var ubounds = views.length;
        var z = 1;
        var viewZ = 0;
        for (i = 0; i < ubounds; i++) {
            viewZ = views[i].container.style["z-index"];
            if(viewZ && parseInt(viewZ) > z) z = parseInt(viewZ);
        }
        v.container.style["z-index"] = z;
    };
    obj.add_view = function (v) {
        views.push(v);
    };
    obj.remove_view = function (v) {
        var i = 0;
        var ubounds = views.length;
        for (i = 0; i < ubounds; i++) {
            if (views[i] === v) {
                return views.splice(i, 1);
            }
        }
    };
})(mvc.controller);

mvc.view = function (id, controller, model, options) {
    this.container = id && id.search ? document.getElementById(id) : id;
    this.sub_views = [];
    this.options = options;
    this.controller = controller;
    this.start_x = 0;
    this.start_y = 0;
    if (this.container === null) throw id + " was not found in the DOM";
    var header = this.container.querySelector("header");
    this.release = function () {
        if (this.will_release) this.will_release();
        if (this.model) this.model.unsubscribe(this);
        this.model = null;
        var i = 0;
        var ubounds = this.sub_views.length - 1;
        for (i = 0; i < ubounds; i++) {
            this.sub_views[i].release();
        }
        this.hide();
        var parent = this.container.parentNode;
        if(parent) parent.removeChild(this.container);
    };
    this.serialize = function (form) {
        var tags = { input: null, select: null, textarea: null };
        var data = [];
        for (tag in tags) {
            var fields = form.querySelectorAll(tag);
            if (fields.length > 0) {
                var i = 0;
                var ubounds = fields.length;
                for (i; i < ubounds; i++) {
                    var f = new field(fields[i]);
                    var v = f.serialize();
                    if (v === null) continue;
                    data.push(v);
                }
            }
        }
        return data.join("&");
    };
    Object.defineProperty(this, "z", {
        get: function(){return this.container.style["z-index"];}
        , set: function(v){ this.container.style["z-index"] = v;}
        , configurable: false
    });
    Object.defineProperty(this, "top", {
        get: function(){return parseInt(this.container.style.top.replace("px", ""));}
        , set: function(v){ this.container.style.top = v + "px"; }
        , configurable: false
    });
    Object.defineProperty(this, "left", {
        get: function(){return parseInt(this.container.style.left.replace("px", ""));}
        , set: function(v){ this.container.style.left = v + "px"; }
        , configurable: false
    });
    Object.defineProperty(this, "header", {
        get: function(){return header;}
        , set: function(v){ header = v; }
        , configurable: false
    });
    Object.defineProperty(this, "hidden", {
        get: function(){return this.container.style.display === "none";}
        , set: function(v){ this.container.style.display = v ? "none" : "block"; }
        , configurable: false
    });

    Object.defineProperty(this, "is_editing", {
        get: function(){ return /\s?edit\s?/.test(this.container.className);}
        , configurable: false
    });
    Object.defineProperty(this, "title", {
        get: function(){ return header.querySelector("h1").innerHTML;}
        , set: function(v){header.querySelector("h1").innerHTML = v;}
        , configurable: false
    });
    Object.defineProperty(this, "model", {
        get: function(){ return model;}
        , set: function(v){model = v;}
        , configurable: false
    });

    this.set_editing = function (flag, animated) {
        if (flag) {
            var c = this.container.className.split(" ");
            var separator = c.length === 1 && c[0].length === 0 ? "" : " ";
            c.push("edit");
            this.container.className = c.join(separator);
        } else {
            this.container.className = this.container.className.replace(/\s?edit\s?/, "");
        }
    };
    this.add_view = function (view) {
        this.sub_views.push(view);
        this.container.appendChild(view.container);
    };
    this.show = function (delegate) {
        if (delegate) return delegate(this);
        this.hidden = false;
    };
    this.hide = function (delegate) {
        if (delegate) return delegate(this);
        this.hidden = true;
    };
    this.add_class_name = function (className, name) {
        if (className.indexOf(name) === -1) {
            var names = className.split(" ");
            names.push(name);
            return names.join(" ");
        }
    };
    this.remove_class_name = function (className, name) {
        if (className.indexOf(name) > -1) {
            var new_ones = [];
            var parts = className.split(" ");
            var working = "";
            while (working = parts.shift()) {
                if (working === name) continue;
                new_ones.push(working);
            }
            return new_ones.join(" ");
        }
    };
    return this;
}
function field(elem){
	this.elem = elem;
	return this;
}
field.prototype.serialize = function(){
	if(this.elem.type === "checkbox" && !this.value()) return null;
	return this.elem.name + "=" + this.value();				
};
field.prototype.value = function(){
	if(this.elem.type === "checkbox") return this.elem.checked;
	if(this.elem.type === "select") return this.elem.options[this.elem.selectedIndex];
	return this.elem.value;
};


mvc.view.draggable = function (id, c, m, options) {
    if (id === null) {
        var container = document.createElement("div");
        var header = document.createElement("header");
        var close_button = document.createElement("button");
        var title = document.createElement("h1");
        title.innerHTML = m.title ? m.title : "";
        close_button.setAttribute("type", "button");
        close_button.innerHTML = "x";
        close_button.className = "close";
        close_button.style.position = "absolute";
        close_button.style.top = 0;
        close_button.style.left = 0;
        header.appendChild(close_button);
        header.appendChild(title);
        container.appendChild(header);
        id = container;
        container.style.display = "none";
        container.className = "draggable";
        container.style.position = "absolute";
        document.body.appendChild(container);
        this.close_button = close_button;
    }
    var self = view.apply(this, [id, c, m, options]);
    this.model.subscribe("position", this);
    return this;
};
mvc.view.draggable.prototype.update = function (key, old, v, obj) {
    this.left = v.left;
    this.top = v.top;
};
mvc.controller.draggable = function (m, delegate) {
    if (m === null) {
        m = new model();
        mvc.model.init({ position: { top: 0, left: 0 }, title: "" }, m);
    }
    var self = mvc.controller.apply(this, [delegate, m]);
    var container_click_delegate = function (e) { self.container_click(e); };
    this.move_delegate = function (e) { self.mouse_move(e); };
    this.up_delegate = function (e) { self.mouse_up(e); };
    this.down_delegate = function (e) { self.mouse_down(e); };
    this.click_delegate = function (e) { self.click(e); };
    this.close_clicked_delegate = function (e) { self.close_clicked(e); };
    this.load_view = function () {
        this.view = new mvc.view.draggable(null, this, this.model, null);
        this.view.title = this.model.title;
        this.view.top = this.model.position.top;
        this.view.left = this.model.position.left;
        this.view.add_view(this.delegate.view);
        this.view.header.addEventListener(device.MOUSEDOWN, this.down_delegate, true);
        this.view.close_button.addEventListener(device.MOUSEDOWN, this.close_clicked_delegate, true);
        this.view.container.addEventListener(device.MOUSEDOWN, container_click_delegate, true);
        this.view.show();
        controller.add_view(this.view);
        //controller.set_active_view(this.view);
    };
    this.view_did_unload = function (v) {
        if (v !== null) {
            controller.remove_view(v);
            v.container.removeEventListener("mousedown", container_click_delegate, true);
        }
        v.header.removeEventListener(device.MOUSEDOWN, this.down_delegate, true);
        v.close_button.removeEventListener(device.MOUSEDOWN, this.close_clicked_delegate, true);
        if (this.delegate.view_did_unload) this.delegate.view_did_unload(v);
    };
    this.container_click = function (e) {
        //controller.set_active_view(this.view);
    };
    return this;
};
mvc.controller.draggable.prototype = {
    mouse_down: function (e) {
        this.drag_start(e);
    }
	, mouse_up: function (e) {
	    this.drag_end(e);
	}
	, mouse_move: function (e) {
	    this.drag_move(e);
	}
	, drag_start: function (e) {
	    // stop page from panning on iPhone/iPad - we're moving a note, not the page
	    e.preventDefault();
	    e = (device.CANTOUCH && e.touches && e.touches.length > 0) ? e.touches[0] : e;
	    this.view.start_x = e.clientX - this.view.container.offsetLeft;
	    this.view.start_y = e.clientY - this.view.container.offsetTop;
	    this.model.position = { top: e.clientY - this.view.start_y, left: e.clientX - this.view.start_x };
	    window.addEventListener(device.MOUSEMOVE, this.move_delegate, true);
	    window.addEventListener(device.MOUSEUP, this.up_delegate, true);
	    return false;
	}
	, calculate_margin_left: function (x, y) {
	    var w = window.innerWidth;
	    var l = 0;
	    if (x <= w / 2) l = -(w / 2 - x) / w * 100;
	    else l = (x - w / 2) / w * 100;
	    return l;
	}
	, drag_move: function (e) {
	    // stop page from panning on iPhone/iPad - we're moving a note, not the page
	    e.preventDefault();
	    if (this.view === null) return;
	    e = (device.CANTOUCH && e.touches && e.touches.length > 0) ? e.touches[0] : e;
	    if (e.clientY - this.view.start_y < 0) return false;
	    if (e.clientX - this.view.start_x < 0) return false;
	    this.model.position = { top: e.clientY - this.view.start_y, left: e.clientX - this.view.start_x };
	    return false;
	}
	, drag_end: function (e) {
	    if (this.view === null) return;
	    window.removeEventListener(device.MOUSEMOVE, this.move_delegate, true);
	    window.removeEventListener(device.MOUSEUP, this.up_delegate, true);
	    this.model.position = { top: this.view.top, left: this.view.left };
	    return false;
	}
	, close_clicked: function (e) {
	    if (e.which === 3) return;
	    this.view.hide();
	    if (this.delegate.view_did_unload) this.delegate.view_did_unload(this.view);
	}
	, keyup: function (e) {
	    if (this.delegate.keyup) this.delegate.keyup(e);
	}
	, hide: function () {
	    this.view.hide();
	    if (this.delegate.view_did_unload) this.delegate.view_did_unload(this.view);
	}
    , show: function(){
        this.view.show();
    }
};