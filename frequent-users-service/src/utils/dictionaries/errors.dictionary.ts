export const errors = {
  notFound: {
    user: { message: 'User not found', statusCode: 404 },
    users: { message: 'No users yet', statusCode: 404 },
  },
  conflict: { message: 'User already exists', statusCode: 409 },
};
