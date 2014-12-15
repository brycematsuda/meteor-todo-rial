Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {  
 // This code only runs on the client
 Template.body.helpers({
  tasks: function() {
    return Tasks.find({});
  }
});

 Template.body.events({
  "submit .new-task": function (event) {
    // This function is called when the new task form is submitted

    var text = event.target.text.value;

    Tasks.insert({
      text: text,
      createdAt: new Date() // current time
    });

    // Clear form
    event.target.text.value = "";

    // Prevent default form submit
    return false;
  },
  "submit .m3u-parse": function (event) {
    
    // Get textarea value, and filter out only the "#EXTINF" with song information.
    var parseText = event.target.textarea.value.split("\n");

    var songArray = jQuery.grep(parseText, function( n ) {
      return (n.substr(0, 7) == "#EXTINF");
    });

    // Insert list of songs into task list.
    var i = 0;
    for (i = 0; i < songArray.length; i++){

      var splitInf = songArray[i].split(",");
      
      Tasks.insert({
        text: splitInf[1],
        createdAt: new Date() // current time
      });
    }

    // Clear form
    event.target.textarea.value = "";

    // Prevent default form submit
    return false;
  }
});

 Template.task.events({
  "click .toggle-checked": function () {
    // Set the checked property to the opposite of its current value
    Tasks.update(this._id, {$set: {checked: ! this.checked}});
  },
  "click .delete": function () {
    Tasks.remove(this._id);
  }
});


}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
