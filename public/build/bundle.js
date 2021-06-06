
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function set_store_value(store, ret, value = ret) {
        store.set(value);
        return ret;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        if (value != null || input.value) {
            input.value = value;
        }
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    const seen_callbacks = new Set();
    function flush() {
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.18.1' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const filter = writable('all');
    const error = writable(false);
    const tasks = writable([]);

    /* src/components/Task.svelte generated by Svelte v3.18.1 */
    const file = "src/components/Task.svelte";

    // (29:8) {:else}
    function create_else_block(ctx) {
    	let button;
    	let t;
    	let button_id_value;
    	let button_class_value;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text("✔");
    			attr_dev(button, "id", button_id_value = "complete" + /*index*/ ctx[1]);
    			attr_dev(button, "class", button_class_value = /*task*/ ctx[0].status == "completed" ? "active" : "");
    			add_location(button, file, 29, 12, 876);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);
    			dispose = listen_dev(button, "click", /*click_handler_3*/ ctx[9], false, false, false);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*index*/ 2 && button_id_value !== (button_id_value = "complete" + /*index*/ ctx[1])) {
    				attr_dev(button, "id", button_id_value);
    			}

    			if (dirty & /*task*/ 1 && button_class_value !== (button_class_value = /*task*/ ctx[0].status == "completed" ? "active" : "")) {
    				attr_dev(button, "class", button_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(29:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (27:39) 
    function create_if_block_1(ctx) {
    	let button;
    	let t;
    	let button_id_value;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text("✖");
    			attr_dev(button, "id", button_id_value = "remove" + /*index*/ ctx[1]);
    			add_location(button, file, 27, 12, 768);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);
    			dispose = listen_dev(button, "click", /*click_handler_2*/ ctx[8], false, false, false);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*index*/ 2 && button_id_value !== (button_id_value = "remove" + /*index*/ ctx[1])) {
    				attr_dev(button, "id", button_id_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(27:39) ",
    		ctx
    	});

    	return block;
    }

    // (24:8) {#if $filter=='all'}
    function create_if_block(ctx) {
    	let button0;
    	let t0;
    	let button0_id_value;
    	let button0_class_value;
    	let t1;
    	let button1;
    	let t2;
    	let button1_id_value;
    	let dispose;

    	const block = {
    		c: function create() {
    			button0 = element("button");
    			t0 = text("✔");
    			t1 = space();
    			button1 = element("button");
    			t2 = text("✖");
    			attr_dev(button0, "id", button0_id_value = "complete" + /*index*/ ctx[1]);
    			attr_dev(button0, "class", button0_class_value = /*task*/ ctx[0].status == "completed" ? "active" : "");
    			add_location(button0, file, 24, 12, 496);
    			attr_dev(button1, "id", button1_id_value = "remove" + /*index*/ ctx[1]);
    			add_location(button1, file, 25, 12, 636);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button0, anchor);
    			append_dev(button0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button1, anchor);
    			append_dev(button1, t2);

    			dispose = [
    				listen_dev(button0, "click", /*click_handler*/ ctx[6], false, false, false),
    				listen_dev(button1, "click", /*click_handler_1*/ ctx[7], false, false, false)
    			];
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*index*/ 2 && button0_id_value !== (button0_id_value = "complete" + /*index*/ ctx[1])) {
    				attr_dev(button0, "id", button0_id_value);
    			}

    			if (dirty & /*task*/ 1 && button0_class_value !== (button0_class_value = /*task*/ ctx[0].status == "completed" ? "active" : "")) {
    				attr_dev(button0, "class", button0_class_value);
    			}

    			if (dirty & /*index*/ 2 && button1_id_value !== (button1_id_value = "remove" + /*index*/ ctx[1])) {
    				attr_dev(button1, "id", button1_id_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button1);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(24:8) {#if $filter=='all'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div1;
    	let h4;
    	let t0_value = /*task*/ ctx[0].titleTask + "";
    	let t0;
    	let t1;
    	let div0;

    	function select_block_type(ctx, dirty) {
    		if (/*$filter*/ ctx[2] == "all") return create_if_block;
    		if (/*$filter*/ ctx[2] == "completed") return create_if_block_1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h4 = element("h4");
    			t0 = text(t0_value);
    			t1 = space();
    			div0 = element("div");
    			if_block.c();
    			add_location(h4, file, 21, 4, 401);
    			attr_dev(div0, "class", "btn-group");
    			add_location(div0, file, 22, 4, 431);
    			attr_dev(div1, "class", "task");
    			add_location(div1, file, 20, 0, 378);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h4);
    			append_dev(h4, t0);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			if_block.m(div0, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*task*/ 1 && t0_value !== (t0_value = /*task*/ ctx[0].titleTask + "")) set_data_dev(t0, t0_value);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $tasks;
    	let $filter;
    	validate_store(tasks, "tasks");
    	component_subscribe($$self, tasks, $$value => $$invalidate(5, $tasks = $$value));
    	validate_store(filter, "filter");
    	component_subscribe($$self, filter, $$value => $$invalidate(2, $filter = $$value));
    	let { task } = $$props, { index } = $$props;

    	function markComplete(index) {
    		if ($tasks[index].status === "pending") {
    			set_store_value(tasks, $tasks[index].status = "completed", $tasks);
    		} else {
    			set_store_value(tasks, $tasks[index].status = "pending", $tasks);
    		}

    		set_store_value(tasks, $tasks = [...$tasks]);
    	}

    	function removeTask(index) {
    		$tasks.splice(index, 1);
    		set_store_value(tasks, $tasks = [...$tasks]);
    	}

    	const writable_props = ["task", "index"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Task> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => markComplete(index);

    	const click_handler_1 = () => {
    		removeTask(index);
    	};

    	const click_handler_2 = () => {
    		removeTask(index);
    	};

    	const click_handler_3 = () => markComplete(index);

    	$$self.$set = $$props => {
    		if ("task" in $$props) $$invalidate(0, task = $$props.task);
    		if ("index" in $$props) $$invalidate(1, index = $$props.index);
    	};

    	$$self.$capture_state = () => {
    		return { task, index, $tasks, $filter };
    	};

    	$$self.$inject_state = $$props => {
    		if ("task" in $$props) $$invalidate(0, task = $$props.task);
    		if ("index" in $$props) $$invalidate(1, index = $$props.index);
    		if ("$tasks" in $$props) tasks.set($tasks = $$props.$tasks);
    		if ("$filter" in $$props) filter.set($filter = $$props.$filter);
    	};

    	return [
    		task,
    		index,
    		$filter,
    		markComplete,
    		removeTask,
    		$tasks,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class Task extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { task: 0, index: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Task",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*task*/ ctx[0] === undefined && !("task" in props)) {
    			console.warn("<Task> was created without expected prop 'task'");
    		}

    		if (/*index*/ ctx[1] === undefined && !("index" in props)) {
    			console.warn("<Task> was created without expected prop 'index'");
    		}
    	}

    	get task() {
    		throw new Error("<Task>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set task(value) {
    		throw new Error("<Task>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get index() {
    		throw new Error("<Task>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set index(value) {
    		throw new Error("<Task>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/TaskList.svelte generated by Svelte v3.18.1 */
    const file$1 = "src/components/TaskList.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	child_ctx[6] = list;
    	child_ctx[7] = i;
    	return child_ctx;
    }

    // (15:12) {#if task.status=='pending'}
    function create_if_block_3(ctx) {
    	let updating_task;
    	let current;

    	function task_task_binding_2(value) {
    		/*task_task_binding_2*/ ctx[4].call(null, value, /*task*/ ctx[5], /*each_value*/ ctx[6], /*index*/ ctx[7]);
    	}

    	let task_props = { index: /*index*/ ctx[7] };

    	if (/*task*/ ctx[5] !== void 0) {
    		task_props.task = /*task*/ ctx[5];
    	}

    	const task = new Task({ props: task_props, $$inline: true });
    	binding_callbacks.push(() => bind(task, "task", task_task_binding_2));

    	const block = {
    		c: function create() {
    			create_component(task.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(task, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const task_changes = {};

    			if (!updating_task && dirty & /*$tasks*/ 1) {
    				updating_task = true;
    				task_changes.task = /*task*/ ctx[5];
    				add_flush_callback(() => updating_task = false);
    			}

    			task.$set(task_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(task.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(task.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(task, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(15:12) {#if task.status=='pending'}",
    		ctx
    	});

    	return block;
    }

    // (10:39) 
    function create_if_block_1$1(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*task*/ ctx[5].status == "completed" && create_if_block_2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*task*/ ctx[5].status == "completed") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    					transition_in(if_block, 1);
    				} else {
    					if_block = create_if_block_2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(10:39) ",
    		ctx
    	});

    	return block;
    }

    // (8:8) {#if $filter=='all'}
    function create_if_block$1(ctx) {
    	let updating_task;
    	let current;

    	function task_task_binding(value) {
    		/*task_task_binding*/ ctx[2].call(null, value, /*task*/ ctx[5], /*each_value*/ ctx[6], /*index*/ ctx[7]);
    	}

    	let task_props = { index: /*index*/ ctx[7] };

    	if (/*task*/ ctx[5] !== void 0) {
    		task_props.task = /*task*/ ctx[5];
    	}

    	const task = new Task({ props: task_props, $$inline: true });
    	binding_callbacks.push(() => bind(task, "task", task_task_binding));

    	const block = {
    		c: function create() {
    			create_component(task.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(task, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const task_changes = {};

    			if (!updating_task && dirty & /*$tasks*/ 1) {
    				updating_task = true;
    				task_changes.task = /*task*/ ctx[5];
    				add_flush_callback(() => updating_task = false);
    			}

    			task.$set(task_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(task.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(task.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(task, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(8:8) {#if $filter=='all'}",
    		ctx
    	});

    	return block;
    }

    // (11:12) {#if task.status=='completed'}
    function create_if_block_2(ctx) {
    	let updating_task;
    	let current;

    	function task_task_binding_1(value) {
    		/*task_task_binding_1*/ ctx[3].call(null, value, /*task*/ ctx[5], /*each_value*/ ctx[6], /*index*/ ctx[7]);
    	}

    	let task_props = { index: /*index*/ ctx[7] };

    	if (/*task*/ ctx[5] !== void 0) {
    		task_props.task = /*task*/ ctx[5];
    	}

    	const task = new Task({ props: task_props, $$inline: true });
    	binding_callbacks.push(() => bind(task, "task", task_task_binding_1));

    	const block = {
    		c: function create() {
    			create_component(task.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(task, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const task_changes = {};

    			if (!updating_task && dirty & /*$tasks*/ 1) {
    				updating_task = true;
    				task_changes.task = /*task*/ ctx[5];
    				add_flush_callback(() => updating_task = false);
    			}

    			task.$set(task_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(task.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(task.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(task, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(11:12) {#if task.status=='completed'}",
    		ctx
    	});

    	return block;
    }

    // (7:4) {#each $tasks as task, index}
    function create_each_block(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$1, create_if_block_1$1, create_if_block_3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$filter*/ ctx[1] == "all") return 0;
    		if (/*$filter*/ ctx[1] == "completed") return 1;
    		if (/*task*/ ctx[5].status == "pending") return 2;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(7:4) {#each $tasks as task, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div;
    	let current;
    	let each_value = /*$tasks*/ ctx[0];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "tasks");
    			add_location(div, file$1, 5, 0, 101);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$tasks, $filter*/ 3) {
    				each_value = /*$tasks*/ ctx[0];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $tasks;
    	let $filter;
    	validate_store(tasks, "tasks");
    	component_subscribe($$self, tasks, $$value => $$invalidate(0, $tasks = $$value));
    	validate_store(filter, "filter");
    	component_subscribe($$self, filter, $$value => $$invalidate(1, $filter = $$value));

    	function task_task_binding(value, task, each_value, index) {
    		each_value[index] = value;
    		tasks.set($tasks);
    	}

    	function task_task_binding_1(value, task, each_value, index) {
    		each_value[index] = value;
    		tasks.set($tasks);
    	}

    	function task_task_binding_2(value, task, each_value, index) {
    		each_value[index] = value;
    		tasks.set($tasks);
    	}

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("$tasks" in $$props) tasks.set($tasks = $$props.$tasks);
    		if ("$filter" in $$props) filter.set($filter = $$props.$filter);
    	};

    	return [$tasks, $filter, task_task_binding, task_task_binding_1, task_task_binding_2];
    }

    class TaskList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TaskList",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/components/Filters.svelte generated by Svelte v3.18.1 */
    const file$2 = "src/components/Filters.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let button0;
    	let t0;

    	let t1_value = (/*allTasks*/ ctx[0] != 0
    	? "(" + /*allTasks*/ ctx[0] + ")"
    	: "") + "";

    	let t1;
    	let button0_class_value;
    	let t2;
    	let button1;
    	let t3;

    	let t4_value = (/*completedTasks*/ ctx[1] != 0
    	? "(" + /*completedTasks*/ ctx[1] + ")"
    	: "") + "";

    	let t4;
    	let button1_class_value;
    	let t5;
    	let button2;
    	let t6;

    	let t7_value = (/*incompleteTasks*/ ctx[2] != 0
    	? "(" + /*incompleteTasks*/ ctx[2] + ")"
    	: "") + "";

    	let t7;
    	let button2_class_value;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button0 = element("button");
    			t0 = text("All ");
    			t1 = text(t1_value);
    			t2 = space();
    			button1 = element("button");
    			t3 = text("Completed ");
    			t4 = text(t4_value);
    			t5 = space();
    			button2 = element("button");
    			t6 = text("Incomplete ");
    			t7 = text(t7_value);
    			attr_dev(button0, "id", "all");
    			attr_dev(button0, "class", button0_class_value = /*$filter*/ ctx[3] == "all" ? "active" : "");
    			add_location(button0, file$2, 24, 2, 474);
    			attr_dev(button1, "id", "completed");
    			attr_dev(button1, "class", button1_class_value = /*$filter*/ ctx[3] == "completed" ? "active" : "");
    			add_location(button1, file$2, 25, 2, 618);
    			attr_dev(button2, "id", "incomplete");
    			attr_dev(button2, "class", button2_class_value = /*$filter*/ ctx[3] == "incomplete" ? "active" : "");
    			add_location(button2, file$2, 26, 2, 797);
    			attr_dev(div, "class", "filters");
    			add_location(div, file$2, 23, 0, 450);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button0);
    			append_dev(button0, t0);
    			append_dev(button0, t1);
    			append_dev(div, t2);
    			append_dev(div, button1);
    			append_dev(button1, t3);
    			append_dev(button1, t4);
    			append_dev(div, t5);
    			append_dev(div, button2);
    			append_dev(button2, t6);
    			append_dev(button2, t7);

    			dispose = [
    				listen_dev(button0, "click", /*click_handler*/ ctx[7], false, false, false),
    				listen_dev(button1, "click", /*click_handler_1*/ ctx[8], false, false, false),
    				listen_dev(button2, "click", /*click_handler_2*/ ctx[9], false, false, false)
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*allTasks*/ 1 && t1_value !== (t1_value = (/*allTasks*/ ctx[0] != 0
    			? "(" + /*allTasks*/ ctx[0] + ")"
    			: "") + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*$filter*/ 8 && button0_class_value !== (button0_class_value = /*$filter*/ ctx[3] == "all" ? "active" : "")) {
    				attr_dev(button0, "class", button0_class_value);
    			}

    			if (dirty & /*completedTasks*/ 2 && t4_value !== (t4_value = (/*completedTasks*/ ctx[1] != 0
    			? "(" + /*completedTasks*/ ctx[1] + ")"
    			: "") + "")) set_data_dev(t4, t4_value);

    			if (dirty & /*$filter*/ 8 && button1_class_value !== (button1_class_value = /*$filter*/ ctx[3] == "completed" ? "active" : "")) {
    				attr_dev(button1, "class", button1_class_value);
    			}

    			if (dirty & /*incompleteTasks*/ 4 && t7_value !== (t7_value = (/*incompleteTasks*/ ctx[2] != 0
    			? "(" + /*incompleteTasks*/ ctx[2] + ")"
    			: "") + "")) set_data_dev(t7, t7_value);

    			if (dirty & /*$filter*/ 8 && button2_class_value !== (button2_class_value = /*$filter*/ ctx[3] == "incomplete" ? "active" : "")) {
    				attr_dev(button2, "class", button2_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $tasks;
    	let $filter;
    	validate_store(tasks, "tasks");
    	component_subscribe($$self, tasks, $$value => $$invalidate(6, $tasks = $$value));
    	validate_store(filter, "filter");
    	component_subscribe($$self, filter, $$value => $$invalidate(3, $filter = $$value));
    	let completed = 0, incomplete = 0;
    	const click_handler = () => set_store_value(filter, $filter = "all");
    	const click_handler_1 = () => set_store_value(filter, $filter = "completed");
    	const click_handler_2 = () => set_store_value(filter, $filter = "incomplete");

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("completed" in $$props) $$invalidate(4, completed = $$props.completed);
    		if ("incomplete" in $$props) $$invalidate(5, incomplete = $$props.incomplete);
    		if ("$tasks" in $$props) tasks.set($tasks = $$props.$tasks);
    		if ("allTasks" in $$props) $$invalidate(0, allTasks = $$props.allTasks);
    		if ("completedTasks" in $$props) $$invalidate(1, completedTasks = $$props.completedTasks);
    		if ("incompleteTasks" in $$props) $$invalidate(2, incompleteTasks = $$props.incompleteTasks);
    		if ("$filter" in $$props) filter.set($filter = $$props.$filter);
    	};

    	let allTasks;
    	let completedTasks;
    	let incompleteTasks;

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$tasks, incomplete, completed*/ 112) {
    			 {
    				($$invalidate(4, completed = 0), $$invalidate(5, incomplete = 0));

    				for (let i in $tasks) {
    					if ($tasks[i].status == "pending") {
    						$$invalidate(5, incomplete++, incomplete);
    					} else {
    						$$invalidate(4, completed++, completed);
    					}
    				}
    			}
    		}

    		if ($$self.$$.dirty & /*$tasks*/ 64) {
    			 $$invalidate(0, allTasks = $tasks.length);
    		}

    		if ($$self.$$.dirty & /*completed*/ 16) {
    			 $$invalidate(1, completedTasks = completed);
    		}

    		if ($$self.$$.dirty & /*incomplete*/ 32) {
    			 $$invalidate(2, incompleteTasks = incomplete);
    		}
    	};

    	return [
    		allTasks,
    		completedTasks,
    		incompleteTasks,
    		$filter,
    		completed,
    		incomplete,
    		$tasks,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class Filters extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Filters",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/components/AddTask.svelte generated by Svelte v3.18.1 */
    const file$3 = "src/components/AddTask.svelte";

    function create_fragment$3(ctx) {
    	let form;
    	let input;
    	let t0;
    	let button0;
    	let t2;
    	let button1;
    	let t4;
    	let p;
    	let t5;
    	let p_class_value;
    	let dispose;

    	const block = {
    		c: function create() {
    			form = element("form");
    			input = element("input");
    			t0 = space();
    			button0 = element("button");
    			button0.textContent = "Add";
    			t2 = space();
    			button1 = element("button");
    			button1.textContent = "Clear";
    			t4 = space();
    			p = element("p");
    			t5 = text("Give the task a title first.");
    			attr_dev(input, "id", "input");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Add a new task!");
    			add_location(input, file$3, 20, 4, 334);
    			attr_dev(button0, "id", "add");
    			add_location(button0, file$3, 21, 4, 424);
    			add_location(button1, file$3, 22, 4, 492);
    			attr_dev(form, "class", "form");
    			add_location(form, file$3, 19, 0, 310);
    			attr_dev(p, "class", p_class_value = "MsgError " + (!/*$error*/ ctx[2] ? "opacity" : " "));
    			add_location(p, file$3, 25, 0, 566);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, input);
    			set_input_value(input, /*CurrentTask*/ ctx[0]);
    			append_dev(form, t0);
    			append_dev(form, button0);
    			append_dev(form, t2);
    			append_dev(form, button1);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t5);

    			dispose = [
    				listen_dev(input, "input", /*input_input_handler*/ ctx[4]),
    				listen_dev(button0, "click", prevent_default(/*addTask*/ ctx[3]), false, true, false),
    				listen_dev(button1, "click", prevent_default(/*click_handler*/ ctx[5]), false, true, false)
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*CurrentTask*/ 1 && input.value !== /*CurrentTask*/ ctx[0]) {
    				set_input_value(input, /*CurrentTask*/ ctx[0]);
    			}

    			if (dirty & /*$error*/ 4 && p_class_value !== (p_class_value = "MsgError " + (!/*$error*/ ctx[2] ? "opacity" : " "))) {
    				attr_dev(p, "class", p_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(p);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $tasks;
    	let $error;
    	validate_store(tasks, "tasks");
    	component_subscribe($$self, tasks, $$value => $$invalidate(1, $tasks = $$value));
    	validate_store(error, "error");
    	component_subscribe($$self, error, $$value => $$invalidate(2, $error = $$value));
    	let CurrentTask = "";

    	function addTask() {
    		if (CurrentTask != "") {
    			set_store_value(tasks, $tasks = [
    				{
    					titleTask: CurrentTask,
    					status: "pending"
    				},
    				...$tasks
    			]);

    			$$invalidate(0, CurrentTask = "");
    		} else {
    			set_store_value(error, $error = true);

    			setTimeout(
    				() => {
    					set_store_value(error, $error = false);
    				},
    				2000
    			);
    		}
    	}

    	function input_input_handler() {
    		CurrentTask = this.value;
    		$$invalidate(0, CurrentTask);
    	}

    	const click_handler = () => set_store_value(tasks, $tasks = []);

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("CurrentTask" in $$props) $$invalidate(0, CurrentTask = $$props.CurrentTask);
    		if ("$tasks" in $$props) tasks.set($tasks = $$props.$tasks);
    		if ("$error" in $$props) error.set($error = $$props.$error);
    	};

    	return [CurrentTask, $tasks, $error, addTask, input_input_handler, click_handler];
    }

    class AddTask extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AddTask",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.18.1 */
    const file$4 = "src/App.svelte";

    function create_fragment$4(ctx) {
    	let main;
    	let div;
    	let t0;
    	let t1;
    	let current;
    	const addtask = new AddTask({ $$inline: true });
    	const tasklist = new TaskList({ $$inline: true });
    	const filter = new Filters({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			div = element("div");
    			create_component(addtask.$$.fragment);
    			t0 = space();
    			create_component(tasklist.$$.fragment);
    			t1 = space();
    			create_component(filter.$$.fragment);
    			attr_dev(div, "class", "To-Do");
    			add_location(div, file$4, 7, 1, 204);
    			attr_dev(main, "class", "container");
    			add_location(main, file$4, 6, 0, 178);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			mount_component(addtask, div, null);
    			append_dev(div, t0);
    			mount_component(tasklist, div, null);
    			append_dev(div, t1);
    			mount_component(filter, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(addtask.$$.fragment, local);
    			transition_in(tasklist.$$.fragment, local);
    			transition_in(filter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(addtask.$$.fragment, local);
    			transition_out(tasklist.$$.fragment, local);
    			transition_out(filter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(addtask);
    			destroy_component(tasklist);
    			destroy_component(filter);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
