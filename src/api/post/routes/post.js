module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/posts',
      handler: 'post.find',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/posts/:id',
      handler: 'post.findOne',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/posts',
      handler: 'post.create',
      config: {
        policies: [],
      },
    },
    {
      method: 'PUT',
      path: '/posts/:id',
      handler: 'post.update',
      config: {
        policies: [],
      },
    },
    {
      method: 'DELETE',
      path: '/posts/:id',
      handler: 'post.delete',
      config: {
        policies: [],
      },
    },
  ],
};
