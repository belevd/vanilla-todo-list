const createElement = (tag, classes = [], content) => {
  const element = document.createElement(tag);

  if (classes.length) {
    element.classList.add(...classes);
  }

  if (content && typeof content === 'string') {
    element.textContent = content;
  } else if (Array.isArray(content)) {
    content.forEach((contentElement) => {
      element.insertAdjacentElement('beforeend', contentElement);
    });
  }

  return element;
}

function renderList(state) {
  const list = createElement('ul', ['todo__list']);

  state.forEach((todo, index) => {
    const listElStatus = createElement('div', ['todo__status']);
    const listElText = createElement('span', ['todo__text'], todo.text);
    const listClasses = todo.done ? ['todo__element', 'todo__element_checked'] : ['todo__element'];
    const listEl = createElement('li', listClasses, [listElStatus, listElText]);
    listEl.setAttribute('data-name', todo.text);
    listEl.style.top = `${(index / state.length) * 100}%`
    list.insertAdjacentElement('beforeend', listEl);
  });

  return list;
}

const rerender = function rerender(prevElement, newElement) {
  prevElement.insertAdjacentElement('afterend', newElement);
  prevElement.remove();
  return newElement;
}

function addListeners(element, listeners = []) {
  if (!element) {
    return;
  }

  if (!listeners.length) {
    return
  }

  listeners.forEach((listener) => {
    element.addEventListener(listener.trigger, listener.cb)
  })
}

export const createList = function createList(rootElement, defaultState) {
  const state = [...defaultState];
  const listeners = [
    {
      trigger: 'click',
      cb: handleDone,
    },
  ]
  
  let list = renderList(state);
  rootElement.insertAdjacentElement('afterbegin', list);

  function handleDone(e) {
    const todoElement = e.target.closest('.todo__element');
    if (!todoElement) {
      return;
    }

    const name = todoElement.getAttribute('data-name');
    const indexTodo = state.findIndex((todo) => todo.text === name);
    const [todo] = state.splice(indexTodo, 1);
    if (!todo) {
      return;
    }

    todo.done = !todo.done;
    let delay = 0;
    if (todo.done) {
      state.push(todo);
      if (todoElement.style.top.slice(0, 6) !== `${((state.length - 1) / state.length) * 100}%`.slice(0, 6)) {
        const placeholder = createElement('li', ['todo__element', 'todo__element_placeholder']);
        todoElement.insertAdjacentElement('beforebegin', placeholder);
        todoElement.classList.add('todo__element_move');
        todoElement.style.top = `110%`;
        delay = 300;
      }
    } else {
      state.unshift(todo);
      if (todoElement.style.top !== '0%') {
        const placeholder = createElement('li', ['todo__element', 'todo__element_placeholder']);
        const placeholder2 = createElement('li', ['todo__element', 'todo__element_placeholder'])
        list.insertAdjacentElement('afterbegin', placeholder);
        todoElement.insertAdjacentElement('beforebegin', placeholder2);
        todoElement.classList.add('todo__element_move');
        todoElement.style.top = `0%`;
        delay = 300;
      }
    }

    setTimeout(() => {
      list = rerender(list, renderList(state));
      addListeners(list, listeners);
    }, delay)
  }

  addListeners(list, listeners);
}