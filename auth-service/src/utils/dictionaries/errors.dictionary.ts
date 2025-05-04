export const errors = {
  notFound: {
    user: { message: 'User not found', statusCode: 404 },
    email: { message: 'Email not found', statusCode: 404 },
    changeRequest: {
      message: 'Update request not found',
      statusCode: 404,
    },
  },
  forbidden: {
    changeNotAllowed: {
      message: 'Change not authorized',
      statusCode: 403,
    },
  },
  unauthorized: {
    password: { message: 'Incorrect password', statusCode: 401 },
    currentPassword: {
      message: 'Current password not correct.',
      statusCode: 401,
    },
  },
  badRequest: {
    nameInPassword: {
      message: "Password can't include user's name",
      statusCode: 400,
    },
  },
};
