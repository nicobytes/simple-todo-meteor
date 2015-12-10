Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {

  Template.body.helpers({
    tasks: function(){
      if(Session.get('hideCompleted')){
        return Tasks.find({checked: { $ne: true}}, {sort: {createdAt: -1}})
      }
      return Tasks.find({}, {sort: {createdAt: -1}});
    },
    hideCompleted: function(){
      return Session.get('hideCompleted');
    },
    incompleteCount: function(){
      return Tasks.find({checked: { $ne: true}}).count();
    }
  });

  Template.body.events({
    "submit .new-task": function(event){
      event.preventDefault();

      Tasks.insert({
        text: event.target.text.value,
        createdAt: new Date()
      });

      event.target.text.value = "";
    },
    "click .toggle-checked": function(){
      Tasks.update(this._id, {
        $set: {checked: !this.checked}
      });
    },
    "click .delete": function(){
      var rta = confirm("¿Esta seguro?");
      if(rta) Tasks.remove(this._id); 
    },
    "click .hide-completed input": function(event){
      Session.set("hideCompleted", event.target.checked);
    }
  });

  /*Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });*/
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
