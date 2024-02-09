class Task {
	constructor(taskTitle) {
		this.taskTitle = taskTitle;
		this.id = Date.now();
		this.completed = false;
		this.description = "Task Description";
		this.reminder = {
			date: new Date().toISOString().slice(0, 10),
			time: new Date().toLocaleTimeString(),
			ON: false,
		};
		this.priority = "low";
		this.repeat = {
			when: "never",
			ON: false,
		};
	}
}
