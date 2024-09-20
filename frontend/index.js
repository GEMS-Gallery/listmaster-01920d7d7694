import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', () => {
  const itemInput = document.getElementById('itemInput');
  const addButton = document.getElementById('addButton');
  const itemList = document.getElementById('itemList');

  // Load the items when the page loads
  loadItems();

  // Add a new item
  addButton.addEventListener('click', async () => {
    const text = itemInput.value.trim();
    if (text !== '') {
      await backend.addItem(text);
      itemInput.value = '';
      loadItems();
    }
  });

  // Listen for Enter key press on the input field
  itemInput.addEventListener('keypress', async (event) => {
    if (event.key === 'Enter') {
      addButton.click();
    }
  });

  // Load items from the backend
  async function loadItems() {
    const items = await backend.getItems();
    itemList.innerHTML = '';
    items.forEach(item => {
      const li = document.createElement('li');
      li.dataset.id = item.id;
      if (item.completed) {
        li.classList.add('completed');
      }

      const span = document.createElement('span');
      span.className = 'item-text';
      span.textContent = item.text;
      span.addEventListener('click', async () => {
        await backend.markItemCompleted(item.id);
        loadItems();
      });
      li.appendChild(span);

      const deleteButton = document.createElement('button');
      deleteButton.className = 'delete-button';
      deleteButton.innerHTML = '&times;';
      deleteButton.addEventListener('click', async (event) => {
        event.stopPropagation(); // Prevent triggering the li click event
        await backend.deleteItem(item.id);
        loadItems();
      });
      li.appendChild(deleteButton);

      itemList.appendChild(li);
    });
  }
});
