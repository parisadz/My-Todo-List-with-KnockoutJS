function Task(text, status) {
  this.text = ko.observable(text);
  this.status = ko.observable(status);
}

function TaskListViewModel() {
  var self = this;

  self.tasks = ko.observableArray(
    JSON.parse(localStorage.getItem("tasks")) || []
  );
  self.newTask = ko.observable("");
  self.statuses = ["All", "Pending", "Completed"];
  self.selectedStatus = ko.observable("All");

  self.filterTasks = function () {
    var status = self.selectedStatus();
    if (status == "All") {
      return self.tasks();
    } else if (status == "Pending") {
      return ko.utils.arrayFilter(self.tasks(), function (task) {
        return !task.status();
      });
    } else {
      return ko.utils.arrayFilter(self.tasks(), function (task) {
        return task.status();
      });
    }
  };

  self.filteredTasks = ko.computed(self.filterTasks);

  self.addTask = function () {
    var newTaskText = self.newTask().trim();
    if (!newTaskText) {
      return;
    }

    var newTask = new Task(newTaskText, false);
    self.tasks.push(newTask);
    self.newTask("");
    localStorage.setItem("tasks", ko.toJSON(self.tasks));
  };

  self.editTask = function (task) {
    var newText = prompt("Enter new task", task.text());
    if (newText) {
      task.text(newText);
      localStorage.setItem("tasks", ko.toJSON(self.tasks));
    }
  };

  self.removeTask = function (task) {
    self.tasks.remove(task);
    localStorage.setItem("tasks", ko.toJSON(self.tasks));
  };

  self.removeAllCompletedTasks = function () {
    self.tasks.remove(function (task) {
      return task.status();
    });
    localStorage.setItem("tasks", ko.toJSON(self.tasks));
  };
}

ko.applyBindings(new TaskListViewModel());
