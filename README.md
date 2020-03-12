<h1 align="center">
  <a href="https://datagrid-yuskiv.netlify.com">Datagrid</a>
</h1>

# Self evaluation:

1. ## Task: https://github.com/rolling-scopes-school/tasks/blob/master/tasks/datagrid.md
2. ## 02.03.2020 / 15.03.2020

## Total

### Self evaluation - **300**
<hr>

### Non-interactive scope - **30**
- [x] **30** Data is displayed in the table in accordance with the functional requirements.

### Basic scope - **70**
- [x] **10** Single column sorting implemented.
- [x] **10** Clear indication of which column is sorted and in which direction (ascending or descending).
- [x] **10** Filtering by the entered text has been implemented (search for a substring in at least one column).
- [x] **10** (In addition to the previous one) When filtering by text, a substring is searched in several columns.
- [x] **10** Filtering by boolean column using the toggle UI-element or similar.
- [x] **10** Implemented filtering by enum column. You can use react-select or a similar UI-element.
- [x] **10** (In addition to the previous one) When filtering by enum column, you can select several values (multiselect UI-element).

### Advanced scope - **150**
- [x] **20** With the shift/ctrl pressed, you can sort by multiple columns.
- [x] **30** Implemented series virtualization to display a large amount of data.
- [x] **10** The virtualization function can be turned off using toggle and compare the speed and rendering of the page.
- [x] **20** Ряд таблицы можно выделить кликом и применить к нему какое-либо действие. Выделенный ряд должен отличатся визуально.
- [x] **20** (In addition to the previous one) By holding ctrl/shift and/or the checkboxes column to the left, you can select several rows at the same time and apply an action to them.
- [x] **20** You can adjust the visibility of the columns (all or some).
- [x] **10** The fixed table header is aka sticky header, that is, when scrolling the table, the row with column names remains visible on top of the data.
- [x] **20** Fixed left column.

### Hacker scope - **50**
- [x] **20** Saving values for sorting, filtering, column visibility (if implemented) are stored in localStorage so that when the page is refreshed, the state of the table is saved.
- [x] **20** Export data to a CSV file (only visible rows with sorting preserved).
- [x] **10** Filter values for text and enum columns can be passed to querystring (higher priority than localStorage).

---
