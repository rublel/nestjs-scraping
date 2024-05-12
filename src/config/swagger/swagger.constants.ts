export const SWAGGER = {
  SITE: {
    DESCRIPTION: 'POSB2C Middleware API Documentation',
    SITE_TITLE: 'POSB2C - Middleware - Documentation',
    TITLE: 'POSBC - Middleware',
    VERSION: '0.0.1',
  },
  SERVER: {
    LOCAL: `http://localhost:3000`,
    DEV: 'https://pos-b2c-d94e95f73222.herokuapp.com',
  },
  ENVS: ['dev', 'uat', 'prod'],
  ROUTE: '/api/v1/doc',
  AUTH: {
    challenge: false,
    users: {
      [process.env.SWAGGER_USERNAME]: process.env.SWAGGER_PASSWORD,
    },
  },
} as const;
