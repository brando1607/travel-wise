export const errors = {
  notFound: {
    user: { message: 'User not found', statusCode: 404 },
    users: { message: 'No users yet', statusCode: 404 },
    email: { message: 'Email not found', statusCode: 404 },
    changeRequest: {
      message: 'Name change request not found',
      statusCode: 404,
    },
  },
  conflict: {
    user: { message: 'User already exists', statusCode: 409 },
    email: { message: 'Email already in use', statusCode: 409 },
  },
  missing: {
    entry: { message: 'Missing or empty entry', statusCode: 400 },
    nameNotDifferent: {
      message: 'Name entered is the same as the current one',
      statusCode: 400,
    },
    users: {
      message:
        'The following users were not found. Make sure they are frequent users, otherwise just add their information manually.',
      statusCode: 404,
    },
  },
  forbidden: {
    nameChangeNotAllowed: {
      message: 'Name change not authorized',
      statusCode: 403,
    },
    accountBlocked: {
      message: 'Account is blocked. Request a new password to activate it.',
      statusCode: 403,
    },
  },
};
