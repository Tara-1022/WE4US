export default {
    server: {
      proxy: {
        '/socket': {
          target: 'https://we4us.co.in/socket',
          ws: true,
        },
      },
    },
  };