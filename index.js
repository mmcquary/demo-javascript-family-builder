(function() {
	"use strict";
	// Stores the valid household data
	let household_data = [];
/******************************************************************************/
/*** Store the DOM element references ***/
/******************************************************************************/
	let e_builder = document.getElementsByClassName('builder')[0];
	let e_form = document.getElementsByTagName('form')[0];
	let e_age = document.getElementsByName('age')[0];
	let e_relationship = document.getElementsByName('rel')[0];
	let e_smoker = document.getElementsByName('smoker')[0];
	let e_add = document.getElementsByClassName('add')[0];
	let e_submit = document.getElementsByTagName('button')[1];
	let e_debug = document.getElementsByClassName('debug')[0];
/******************************************************************************/
/*** Modify the DOM ***/
/******************************************************************************/
	// Create the age error message
	let e_error_age = document.createElement('span');
	e_error_age.style.visibility = "hidden";
	e_error_age.innerHTML = 'Age is required to be a number greater than zero.';
	e_error_age.style.color = 'red';
	e_age.parentNode.insertBefore(e_error_age, null);

	// Create the relationship error message
	let e_error_relationship = document.createElement('span');
	e_error_relationship.style.visibility = "hidden";
	e_error_relationship.innerHTML = 'A relationship must be selected.';
	e_error_relationship.style.color = 'red';
	e_relationship.parentNode.insertBefore(e_error_relationship, null);

	// Fix 'add' button from defaulting to submit type
	e_add.setAttribute('type', 'button');
	
	// Create the household display section as a table after the family div
	let e_family = document.createElement('div');
	let e_table = document.createElement('table');
	e_family.appendChild(e_table);

	let header_data = ['Age', 'Relationship', 'Smoker', ''];
	let e_header = e_table.createTHead();
	let e_row = e_header.insertRow();
	for (let column_text of header_data) {
		let e_th = document.createElement('th');
		e_th.innerHTML = column_text;
		e_row.appendChild(e_th);
	}
	e_table.appendChild(e_header);

	e_builder.appendChild(e_family);

	e_age.focus();

	// For testing only
	//prefill_table();
/******************************************************************************/
/*** Create the listeners ***/
/******************************************************************************/
	e_age.addEventListener('input',
		function() { is_valid_age('ERROR_OFF_ONLY') }
	);
	e_age.addEventListener('blur',
		function() { is_valid_age('ERROR_OFF_ONLY') }
	);
	e_relationship.addEventListener('change',
		function() { is_valid_relationship('ERROR_OFF_ONLY') }
	);
	e_relationship.addEventListener('blur',
		function() { is_valid_relationship('ERROR_OFF_ONLY') }
	);
	e_add.addEventListener('click', add_member_click);
	e_form.addEventListener('submit', form_submit);
/******************************************************************************/
/*** Event functions ***/
/******************************************************************************/
	function add_member_click() {
		/* The 'add' button click event.
		   Adds a member to the household_data array if valid */
		let valid = is_valid_age();
		if (is_valid_relationship() && valid) {
			let next_id = 0;
			for (let member of household_data) {
				if (member.id >= next_id) next_id = member.id + 1;
			};
			console.log(next_id);
			let new_member = {
				id: next_id,
				age: e_age.value,
				relationship: e_relationship.options[e_relationship.selectedIndex].value,
				smoker: e_smoker.checked
			};
			household_data.push(new_member);
			add_table_row(new_member);
			e_form.reset();
			e_age.focus();
		}
	}
//------------------------------------------------------------------------------
	function delete_member_click(member_id) {
		let member_index = household_data.findIndex(
			function(e) { return member_id === e.id }
		);
		household_data.splice(member_index, 1);
		let e_row = document.getElementById('row_member_id_' + member_id);
		e_row.parentNode.removeChild(e_row);
		e_age.focus();
	}
//------------------------------------------------------------------------------
	function form_submit(event) {
		event.preventDefault();
		
		// Remove the 'id' properties
		let json_data = JSON.parse(JSON.stringify(household_data));
		for (let member of json_data) {
			delete member.id;
		}
		json_data = JSON.stringify(json_data);
		e_debug.innerHTML = json_data;
		e_debug.style.display = 'inline'
		e_age.focus();
	}
/******************************************************************************/
/*** Helper functions ***/
/******************************************************************************/
	function is_valid_age(error_off_only) {
		/* Validate that the age is greater than zero */
		if (e_age.value > 0) {
			e_error_age.style.visibility = "hidden";
			return true;
		} else {
			if (error_off_only !== 'ERROR_OFF_ONLY') {
				e_error_age.style.visibility = "visible";
			}
			return false;
		}
	}
//------------------------------------------------------------------------------
	function is_valid_relationship(error_off_only) {
		/* Validate that a relationship has been chosen */
		if (e_relationship.selectedIndex !== 0) {
			e_error_relationship.style.visibility = "hidden";
			return true;
		} else {
			if (error_off_only !== 'ERROR_OFF_ONLY') {
				e_error_relationship.style.visibility = "visible";
			}
			return false;
		}
	}
//------------------------------------------------------------------------------
	function add_table_row(new_member) {
		/* Adds a newly added member to the display table */
		let e_row = e_table.insertRow();
		e_row.setAttribute('id', 'row_member_id_' + new_member.id);
		for (let key in new_member) {
			if (key === 'id') continue;
			let e_cell = e_row.insertCell();
			e_cell.innerHTML = new_member[key]
		}
		let e_cell = e_row.insertCell();
		e_cell.innerHTML = '<a href="javascript:void(0);">Delete</a>';
		e_cell.addEventListener('click',
			function() { delete_member_click(new_member.id) }
		);
		e_table.appendChild(e_row);
	}
//------------------------------------------------------------------------------
	function prefill_table() {
		/* For testing only */
		household_data = [
			{id: 0, age: 45, relationship: 'self', smoker: false},
			{id: 1, age: 44, relationship: 'spouse', smoker: true},
			{id: 2, age: 6, relationship: 'child', smoker: false},
			{id: 3, age: 77, relationship: 'parent', smoker: false},
			{id: 4, age: 99, relationship: 'grandparent', smoker: true},
			{id: 5, age: 15, relationship: 'other', smoker: false}
		]
		for (let member of household_data) {
			add_table_row(member);
		}
	}
//------------------------------------------------------------------------------
}());
