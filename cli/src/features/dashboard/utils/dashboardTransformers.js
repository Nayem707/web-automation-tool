const asPercent = (value) => `${value.toFixed(1)}%`;

const buildStats = ({ users, posts, todos }) => {
  const completedTodos = todos.filter((item) => item.completed).length;
  const completionRate = todos.length ? (completedTodos / todos.length) * 100 : 0;

  return [
    { id: 'users', label: 'Total Users', value: users.length, trend: '+4.2%' },
    { id: 'posts', label: 'Total Posts', value: posts.length, trend: '+7.5%' },
    { id: 'todos', label: 'Interactions', value: todos.length, trend: '+11.3%' },
    {
      id: 'completion',
      label: 'Completion Rate',
      value: asPercent(completionRate),
      trend: '+2.1%',
    },
  ];
};

const buildActivity = (todos) => {
  return todos.slice(0, 8).map((item) => ({
    id: item.id,
    title: item.title,
    type: item.completed ? 'Completed' : 'Pending',
    status: item.completed ? 'success' : 'warning',
  }));
};

const buildUsers = (users) => {
  return users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    company: user.company?.name || 'N/A',
    location: user.address?.city || 'N/A',
  }));
};

export const transformDashboardData = (payload) => {
  return {
    stats: buildStats(payload),
    activity: buildActivity(payload.todos),
    users: buildUsers(payload.users),
  };
};
