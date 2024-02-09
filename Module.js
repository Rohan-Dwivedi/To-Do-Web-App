let todoApp = (() => {
	let tempId;
	const inputTask = document.getElementById("task");
	const submitTask = document.getElementById("taskSubmit");
	const upperTabs = document
		.querySelectorAll(".tabs-box")[0]
		.querySelectorAll(".tabs");
	const lowerTabs = document
		.querySelectorAll(".tabs-box")[1]
		.querySelectorAll(".tabs");
	const allTabContent = document.querySelectorAll(".scroll > .content")[0];
	const incompleteTabContent =
		document.querySelectorAll(".scroll > .content")[1];
	const completedTabContent =
		document.querySelectorAll(".scroll > .content")[2];
	let taskItemTemplate = allTabContent.querySelector(".task").cloneNode(true);
	taskItemTemplate.style.display = "flex";
	const setDate = (() => {
		const today =
			new Date().toDateString().split(" ").slice(0, 1) +
			", " +
			new Date().toDateString().split(" ").slice(1, 4).join(" ");
		document.querySelector(".hoverDisplay #today").textContent = today;
	})();
	const taskCount = () => {
		const taskList = getLocalStorage("taskList");
		const count = taskList.filter((task) => task.completed === false).length;
		lowerTabs[1].textContent = `${count} Tasks Left`;
	};
	const addTaskToDOM = (task) => {
		taskItemTemplate.querySelector(".text p").textContent = task.taskTitle;
		taskItemTemplate.querySelector(".text p").id = task.id;
		if (task.completed === true) {
			taskItemTemplate
				.querySelector(".text p")
				.classList.add("line-through");
		} else {
			taskItemTemplate
				.querySelector(".text p")
				.classList.remove("line-through");
		}
		allTabContent.appendChild(taskItemTemplate);
		taskItemTemplate = taskItemTemplate.cloneNode(true);
	};
	const deleteTasksFromDOM = () => {
		const tabs = [
			...allTabContent.querySelectorAll("div.task"),
			...incompleteTabContent.querySelectorAll("div.task"),
			...completedTabContent.querySelectorAll("div.task"),
		];
		tabs.forEach((element) => element.remove());
	};

	const renderTabContent = (taskList) => {
		taskList.forEach((task) => addTaskToDOM(task));
	};

	const renderTaskList = () => {
		let taskList = getLocalStorage("taskList");
		let activeTab = localStorage.getItem("active");
		if (taskList !== null) {
			if (taskList.length > 0) {
				deleteTasksFromDOM();
				upperTabs.forEach((element) => element.classList.remove("active"));
				if (activeTab === "all") {
					upperTabs[0].classList.add("active");
					renderTabContent(taskList);
				} else if (activeTab === "incomplete") {
					upperTabs[1].classList.add("active");
					taskList = taskList.filter((task) => task.completed === false);
					renderTabContent(taskList);
				} else if (activeTab === "completed") {
					
					upperTabs[2].classList.add("active");
					
					taskList = taskList.filter((task) => task.completed === true);
					renderTabContent(taskList);
				}
				taskCount();
				return;
			}
		} else {
			upperTabs[0].classList.remove("active");
			upperTabs[1].classList.remove("active");
			upperTabs[2].classList.remove("active");
			deleteTasksFromDOM();
			lowerTabs[1].textContent = `${0} Tasks Left`;
		}
	};

	const addTask = (taskTitle) => {
		if (taskTitle) {
			const data = getLocalStorage("taskList");
			if (data) {
				data.push(new Task(taskTitle));
				setLocalStorage(data);
			} else {
				const taskList = [];
				const task = new Task(taskTitle);
				taskList.push(task);
				setLocalStorage(taskList);
			}
			renderTaskList();
			return;
		}
	};

	const setLocalStorage = (taskList) => {
		if (taskList.length > 0) {
			window.localStorage.setItem("taskList", JSON.stringify(taskList));
			return;
		}
	};

	const getLocalStorage = (taskList) => {
		return JSON.parse(window.localStorage.getItem(taskList));
	};

	const taskCompletedToggle = (taskId) => {
		const taskList = getLocalStorage("taskList");
		taskList.forEach((task) => {
			if (task.id === Number(taskId)) {
				task.completed = !task.completed;
				setLocalStorage(taskList);
				renderTaskList();
				return;
			}
		});
	};

	const handleKeyPress = (event) => {
		if (event.key === "Enter") {
			const activeElement = document.activeElement;
			if (inputTask === activeElement) {
				submitTask.click();
			}
		}
	};

	const handleClick = (event) => {
		const target = event.target;
		
		if (target.id === "taskSubmit") {
			
			const taskTitle = inputTask?.value;
			if (taskTitle === "") return;

			localStorage.setItem("active", "all");
			addTask(taskTitle);
			inputTask.focus();
			inputTask.value = "";
		}
		
		if (target.id === "check") {
			const ele = target.parentNode.nextElementSibling.querySelector("p");
			ele.classList.toggle("line-through");
			taskCompletedToggle(ele.id);
			return;
		}
		
		if (target.id === "all") {
			const taskList = getLocalStorage("taskList");
			if (taskList === null) return;
			if (taskList.length > 0) {
				localStorage.setItem("active", target.id);
				renderTaskList();
				return;
			}
		}
		
		if (target.id === "incomplete") {
			let taskList = getLocalStorage("taskList");
			if (taskList === null) return;
			taskList = taskList.filter((task) => task.completed === false);
			if (taskList.length > 0) {
				localStorage.setItem("active", target.id);
				renderTaskList();
				return;
			}
		}

		if (target.id === "completed") {
			let taskList = getLocalStorage("taskList");
			if (taskList === null) return;
			taskList = taskList.filter((task) => task.completed === true);
			if (taskList.length > 0) {
				localStorage.setItem("active", target.id);
				renderTaskList();
				return;
			}
		}

		if (target.id === "complete-all") {
			let taskList = getLocalStorage("taskList");
			if (taskList.length > 0) {
				taskList.forEach((task) => {
					task.completed = true;
				});
				setLocalStorage(taskList);
				renderTaskList();
				return;
			}
		}
		
		if (target.id === "clear-completed") {
			let taskList = getLocalStorage("taskList");
			taskList = taskList.filter((task) => task.completed === false);
			if (taskList.length > 0) {
				setLocalStorage(taskList);
			} else {
				localStorage.clear();
			}
			renderTaskList();
			return;
		}
		
		if (target.id === "delete") {
			const ele = target.parentNode.parentNode;
			const id = ele.querySelector(".text p").id;
			ele.classList.add("delete-animation");
			
			setTimeout(() => {
				const ele = target.parentNode.parentNode;
				const id = ele.querySelector(".text p").id;
				const taskList = getLocalStorage("taskList");
				if (taskList === null) {
					list = null;
					localStorage.clear();
					renderTaskList();
					return;
				}
				let list = taskList.filter((task) => task.id !== Number(id));
				
				ele.addEventListener("transitionend", () => {
					ele.remove();
				});
				localStorage.removeItem("taskList");
				setLocalStorage(list);
				renderTaskList();
			}, 1000);
			return;
		}

		if (target.id === "save") {
			const taskList = getLocalStorage("taskList");
			taskList.forEach((task) => {
				if (task.id === Number(tempId)) {
					task.taskTitle = document.querySelector(
						"#modal input[type='text']"
					).value;
					task.description =
						document.querySelector("#modal #textarea").value;
					task.reminder.date = document.querySelector(
						"#modal input[type='date']"
					).value;
					task.reminder.time = document.querySelector(
						"#modal input[type='time']"
					).value;
					task.priority = document.querySelector(
						'input[name="priority"]:checked'
					).value;
					task.repeat = document.querySelector(
						'input[name="repeat"]:checked'
					).value;
				}
			});
			setLocalStorage(taskList);
			const modal = document.getElementById("modal");
			modal.classList.remove("popIn");
			modal.classList.add("popOut");
			setTimeout(() => {
				modal.classList.remove("popOut");
				modal.classList.add("hide");
				renderTaskList();
			}, 500);
			return;
		}
		if (target.className === "fa-solid fa-sun") {
			document.querySelector(".hoverDisplay .fa-moon").id = "";
			document.querySelector(".hoverDisplay .fa-sun").id = "hide";
			document.body.style.backgroundColor = "black";
			for (let i = 1; i <= 4; i++) {
				document.getElementById(`circle${i}`).style.backgroundColor =
					"rgb(35, 35, 35)";
				document.getElementById(`circle${i}`).style.boxShadow =
					"0px 0px 30px 30px rgb(35, 35, 35)";
			}
			return;
		}
		if (target.className === "fa-solid fa-moon") {
			document.querySelector(".hoverDisplay .fa-sun").id = "";
			document.querySelector(".hoverDisplay .fa-moon").id = "hide";
			document.body.style.backgroundColor = "#24c6dc";
			for (let i = 1; i <= 4; i++) {
				document.getElementById(`circle${i}`).style.backgroundColor =
					"#6be4e6";
				document.getElementById(`circle${i}`).style.boxShadow =
					"0px 0px 30px 30px #6be4e6";
			}
			return;
		}
	};
	const initialiseApp = () => {
		document.addEventListener("click", handleClick);
		document.addEventListener("keyup", handleKeyPress);
		window.onload = () => {
			const data = getLocalStorage("taskList");
			if (data) renderTaskList();
		};
	};
	return {
		initialise: initialiseApp,
	};
})();