import axios from 'axios';

const USERS_ENDPOINT = 'https://jsonplaceholder.typicode.com/users';
const POSTS_ENDPOINT = 'https://jsonplaceholder.typicode.com/posts';
const TODOS_ENDPOINT = 'https://jsonplaceholder.typicode.com/todos';

export const fetchDashboardPayload = async () => {
  const [usersResponse, postsResponse, todosResponse] = await Promise.all([
    axios.get(USERS_ENDPOINT),
    axios.get(POSTS_ENDPOINT),
    axios.get(TODOS_ENDPOINT),
  ]);

  return {
    users: usersResponse.data,
    posts: postsResponse.data,
    todos: todosResponse.data,
  };
};
