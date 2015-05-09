
(function(){

  var root = this;
  var Stupeflix = {};
  root.Stupeflix = Stupeflix;

  // ----------------------------------------------------------------------------

  function capitalize1st(str){
    return str.replace(/^[a-z]/, function(match){
      return match.toUpperCase();
    });
  }

  function invoke(obj, name){
    var handler = obj[name];
    if(handler){
      var args = _.rest(arguments, 2);
      return handler.apply(target, args);
    }
  }

  // ----------------------------------------------------------------------------

  function fireEvent(source, listeners, eventName, eventData){
    var ret = true;
    _.each(listeners, function(entry){
      ret &= (dispatchEvent(source, entry.listener, eventName, eventData, entry.ns) !== false);
    });
    return ret;
  }

  function dispatchEvent(source, listener, eventName, eventData, ns){
    var handlerBaseName = "on" + capitalize1st(ns || "");
    var getHandler = listener._getHandlerFor || function(name){ return this[name]; };

    var ret = true, handler = getHandler.call(listener, handlerBaseName + "All");
    if(handler){
      ret &= (handler.call(listener, source, eventName, eventData) !== false);
    }

    handler = getHandler.call(listener, handlerBaseName + capitalize1st(eventName));
    if(handler){
      eventData = [source].concat(eventData);
      ret &= (handler.apply(listener, eventData) !== false);
    }

    return ret;
  }

  // ----------------------------------------------------------------------------

  var Controller = {

    addListener: function(listener, ns){
      if(!this._listeners) this._listeners = [];
      this._listeners.push({
        listener: listener,
        ns: ns || ""
      });
      return this;
    },

    removeListener: function(listener){
      if(!this._listeners) return;
      this._listeners = _.filter(this._listeners, function(entry){
        return entry.listener !== listener;
      });
      return this;
    },

    setDelegate: function(delegate, ns){
      if(this._delegate){
        Controller.removeListener.call(this, this._delegate);
      }
      if(delegate){
        Controller.addListener.call(this, delegate, ns);
      }
      this._delegate = delegate;
      return this;
    },

    fire: function(eventName){
      if(!this._listeners) return true;
      var eventData = _.rest(arguments, 1);
      return fireEvent(this, this._listeners, eventName, eventData);
    },

    fireEvent: function(eventName, eventData){
      if(!this._listeners) return true;
      return fireEvent(this, this._listeners, eventName, eventData);
    }
  };

  // ----------------------------------------------------------------------------

  var OperationQueue = function(){
      this._q = [];
  };
  _.extend(OperationQueue.prototype, {

    len: function(){
      return this._q.length;
    },

    queue: function(fct, bind){
      if(Queue.isOperation(fct)){
        this._q.push(fct);
        this.dequeue();
      }else if(typeof(fct) === "function"){
        this.queue(new Queue.Callback(fct, bind));
      }else if(fct === undefined){
        /* Silent */
      }else{
        throw "invalid queue operation";
      }
      return this;
    },

    remove: function(operation){
      this._q.remove(operation);
      if(operation === this._op){
        this._cancelCurrentOperation();
        this.dequeue();
      }
    },

    dequeue: function(){
      if(!this._op && this._q.length > 0){
        this._op = this._q.shift();
        this._op.addListener(this, "operation");
        this._op.start(this);
      }
    },

    onOperationComplete: function(){
      this._op.removeListener(this);
      this._op = undefined;
      this.dequeue();
    },

    _cancelCurrentOperation: function(){
      this._op.removeListener(this);
      invoke(this._op, "cancel");
      this._op = undefined;
    },

    clear: function(){
      this._q = [];
      return this;
    },

    cancel: function(){
      this.clear();
      if(this._op){
        this._cancelCurrentOperation();
      }
      return this;
    },

    delay: function(ms){
      return this.queue(new Queue.Delay(ms));
    }

  });

  // ----------------------------------------------------------------------------

  var Queue = {
    isOperation: function(obj){
      return obj && _.isObject(obj) && _.isFunction(obj.start);
    }
  };

  // ----------------------------------------------------------------------------

  Queue.Callback = function(fct, bind){
    this._fct = fct;
    this._bind = bind;
  };
  _.extend(Queue.Callback.prototype, Controller, {

    start: function(queue){
      var ret = this._fct.call(this._bind, queue);

      if(Queue.isOperation(ret)){
        // ret is a task, wait for it
        this._ret = ret.addListener(this, "task");
        this._ret.start(queue);

      }else{
        this.fire("complete");
      }
    },

    onTaskComplete: function(){
      this.fire("complete");
    },

    cancel: function(){
      if(this._ret){
        invoke(this._ret, "cancel");
      }
    }
  });

  // ----------------------------------------------------------------------------

  Queue.Delay = function(ms){
    this._ms = ms;
  };
  _.extend(Queue.Delay.prototype, Controller, {

    start: function(){
      var me = this;
      this._timer = setTimeout(function(){
        me.fire("complete");
      }, this._ms);
    },
    cancel: function(){
      clearTimeout(this._timer);
    }
  });

  // ----------------------------------------------------------------------------

  var TaskResult = function(result){
    if(result !== undefined){
      this.mark("success", result);
    }
  };
  _.extend(TaskResult.prototype, Controller, {
      
    mark: function(state, result){
      if(this.state) return false;

      this.state = state;
      this.result = result;
      this.fire(state, result);
      this.fire("complete", state, result);
      
      // Remove all listeners
      if(this._listeners) delete this._listeners;

      return true;
    },
    
    addListener: function(listener, ns){
      if(this.state){
        dispatchEvent(this, listener, this.state, [this.result], ns);
        dispatchEvent(this, listener, "complete", [this.state, this.result], ns);
      }else{
        Controller.addListener.call(this, listener, ns);
      }
      return this;
    },

    then: function(onSuccess, onError){
      return new Promise(this, onSuccess, onError);
    }

  });

  // ----------------------------------------------------------------------------

  var Promise = function(trigger, onSuccess, onError){
    this._callbacks = {
      "success": onSuccess,
      "error": onError
    };
    trigger.addListener(this, "trigger");
  };

  _.extend(Promise.prototype, TaskResult.prototype, {
    onTriggerComplete: function(trigger, state, result){
      var callback = this._callbacks[state];

      if(_.isFunction(callback)){
        var callbackResult;
        try {
          callbackResult = callback(result);
        } catch(e) {
          return this.mark("error", e);
        }

        if(_.isObject(callbackResult) && _.isFunction(callbackResult.then)){
          // callbackResult is a new Promise, wait for it
          callbackResult.addListener(this, "callbackResult");
        }else{
          this.mark("success", callbackResult);
        }
      }else{
        this.mark(state, result);
      }
    },

    onCallbackResultComplete: function(callbackResult, state, result){
      this.mark(state, result);
    }
  });

  // ----------------------------------------------------------------------------

  var Task = function(manager){
    this._manager = manager;
  };
  _.extend(Task.prototype, TaskResult.prototype, {
    
    _update: function(serverData){
      var status = serverData.status;

      if(status === "error"){
        this._manager._removeListener(this);
        this.mark("error", serverData);

      }else if(status === "success"){
        this._manager._removeListener(this);
        this.mark('success', serverData);
        
      }else{
        this.fire('progress', serverData);
      }
    },
    
    cancel: function(){
      this._manager._removeListener(this);
      this.mark('cancel');
    }

  });

  // ----------------------------------------------------------------------------

  var TaskManager = Stupeflix.TaskManager = function(options){
    this.options = _.extend({
      endpoint: "https://dragon.stupeflix.com/v2/",
      update_delay: 2000,
      retry_delay: 20 * 1000,
      metas: false
    }, options);

    this._taskId = 0;
    this._createBatch = [];
    this._listeners = [];

    this._createQueue = new OperationQueue();
    this._updateQueue = new OperationQueue();
  };

  _.extend(TaskManager.prototype, {

    create: function(params){
      var task = new Task(this);
      task.params = params;

      // Augment params with task_meta
      if(_.isObject(this.options.metas)){
        params.task_metas = _.extend({}, this.options.metas, params.task_metas);
      }

      var id = this._newTaskId();
      this._createBatch.push({id: id, params: params});
      this._listeners.push({id: id, listener: task, creating: true});
      this._scheduleCreate();

      return task;
    },

    getStatus: function(taskId){
      var task = new Task(this);
      this._listeners.push({id: id, listener: task});
      this._scheduleUpdate();
      return task;
    },

    _req: function(verb, path, data, onSuccess, onError){
      var endpoint = this.options.endpoint.concat(path);
      var req = new XMLHttpRequest();
      req.open(verb, endpoint, true);

      req.onload = function(){
        if(this.status === 200){
          var response = JSON.parse(this.response);
          if(onSuccess) onSuccess(response, this);
        }else{
          if(onError) onError(this);
        }
      };

      data.api_key = this.options.api_key;

      req.send(JSON.stringify(data));
      return req;
    },

    _newTaskId: function(){
      return "task" + this._taskId++;
    },
    
    _scheduleCreate: function(delay){
      if(this._createQueue.len() === 0){
        this._createQueue.delay(delay || 0).queue(this._doCreate, this);
      }
    },

    _doCreate: function(){
      if(this._createBatch.length === 0) return;

      var batch = this._createBatch;
      this._createBatch = [];

      var me = this;
      this._req("post", "create", {
        tasks: _.pluck(batch, "params")

      }, function(tasks){
        _.each(batch, function(batchEntry){
          var task = tasks.shift();
          _.each(me._getListeners(batchEntry.id), function(listenerEntry){
            listenerEntry.id = task.key;
            listenerEntry.creating = false;
            listenerEntry.listener._update(task);
          });
        });
        me._scheduleUpdate();

      }, function(){
        me._requeueCreateTasks(batch);
      });
    },

    _requeueCreateTasks: function(batch){
      var validListeners = _.pluck(this._listeners, "id");

      _.each(batch, function(entry){
        if(_.contains(validListeners, entry.id)){
          this._createBatch.push(entry);
        }
      }, this);
      
      this._scheduleCreate(this.options.retry_delay);
    },

    _getListeners: function(id){
      return _.filter(this._listeners, function(entry){
        return entry.id === id;
      });
    },

    _scheduleUpdate: function(delay){
      if(this._updateQueue.len() === 0){
        this._updateQueue.delay(delay || this.options.update_delay).queue(this._doUpdate, this);
      }
    },

    _doUpdate: function(){
      var tasks = [];
      _.each(this._listeners, function(entry){
        if(!entry.creating) tasks.push(entry.id);
      });

      if(tasks.length === 0) return;

      var me = this;
      this._req("post", "status", {
        tasks: tasks

      }, function(tasks){
        _.each(tasks, function(task){
          _.each(me._getListeners(task.key), function(entry){
            entry.listener._update(task);
          });
        });
        me._scheduleUpdate();

      }, function(){
        me._scheduleUpdate(me.options.retry_delay);
      });
    },

    _removeListener: function(listener){
      this._listeners = _.filter(this._listeners, function(entry){
        return entry.listener != listener;
      });
    }

  });

}).call(this);
