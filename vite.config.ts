export default {
    server: {
      proxy: {
        '/socket': {
          target: 'http://localhost:4000',
          ws: true,
        },
      },
    },
  };