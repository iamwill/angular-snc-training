"use strict";

var TodoListPage = function() {
	this.todoInput = element(by.css('#new-todo'));
	this.todoEntries = element.all(by.repeater('task in taskList'));

	this.get = function() {
		browser.get('/$todo.do');
	};

	this.addTodo = function(todoTitle) {
		this.todoInput.clear();
		this.todoInput.sendKeys(todoTitle);
		this.todoInput.submit();
	};

	this.getLastEntry = function() {
		return this.todoEntries.last();
	};

	this.getEntry = function(rowNumber) {
		return this.todoEntries.get(rowNumber)
	};

	this.getAllEntries = function() {
		return this.todoEntries;
	};

	this.getFooter = function() {
		return element(by.css('#footer'));
	}

	this.toggleCompletionOfEntry = function(idx) {
		this.todoEntries.get(idx).$('input.toggle').click();
	};

	this.deleteEntry = function(idx) {
		var toDelete = this.getEntry(idx);
		var deleteButton = toDelete.$('button.destroy');
		browser.actions()
			.mouseMove(toDelete)
			.perform();
		deleteButton.click();
	};
};

describe('todo list homepage', function() {
	var todoListPage;

	beforeEach(function() {
		todoListPage = new TodoListPage();
		todoListPage.get();
	});

	describe('adding a todo entry', function() {
		it('adds a new entry to the end of the list', function() {
			todoListPage.addTodo("My new todo entry");
			expect(todoListPage.getLastEntry().getText()).toEqual("My new todo entry");
		});

		it('adds multiple entries to the list', function() {
			todoListPage.addTodo("My first todo");
			todoListPage.addTodo("My second todo");
			expect(todoListPage.getEntry(0).getText()).toEqual("My first todo");
			expect(todoListPage.getEntry(1).getText()).toEqual("My second todo");
		});
	});

	describe('toggling completion', function() {
		beforeEach(function() {
			todoListPage.addTodo("My todo");
		});

		it('starts out in an incomplete state', function() {
			expect(todoListPage.getEntry(0).getAttribute('class')).not.toContain('completed');
		});

		it('sets the completed class on an entry when the checkmark is set', function() {
			todoListPage.toggleCompletionOfEntry(0);
			expect(todoListPage.getEntry(0).getAttribute('class')).toContain('completed');
		});

		it('unsets the completed class when the checkmark is unset', function() {
			todoListPage.toggleCompletionOfEntry(0);
			todoListPage.toggleCompletionOfEntry(0);
			expect(todoListPage.getEntry(0).getAttribute('class')).not.toContain('completed');
		});

	});

	describe('deleting a todo', function() {
		it('deletes a task when the red x is clicked on', function() {
			todoListPage.addTodo("To delete");
			todoListPage.deleteEntry(0);
			expect(todoListPage.getAllEntries().count()).toBe(0);
		});
	});

	describe('managing the footer', function() {
		it('hides the footer when there are no tasks', function() {
			expect(todoListPage.getFooter().getAttribute('class')).toContain('ng-hide');
		});

		it('shows the footer when a task is added', function() {
			todoListPage.addTodo("First todo");
			expect(todoListPage.getFooter().getAttribute('class')).not.toContain('ng-hide');
		});
	});
});