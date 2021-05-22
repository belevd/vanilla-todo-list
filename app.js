import { createList } from './scripts/todo';

const root = document.querySelector('#root');

const defaultList = [
  {
    text: 'Live',
    done: false,
  },
  {
    text: 'Die',
    done: false,
  },
  {
    text: 'Repeat',
    done: false,
  },
]

createList(root, defaultList);