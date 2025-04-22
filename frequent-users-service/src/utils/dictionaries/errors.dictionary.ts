export const errors = {
  notFound: {
    user: { message: 'User not found', statusCode: 404 },
    users: { message: 'No users yet', statusCode: 404 },
    email: { message: 'Email not found', statusCode: 404 },
  },
  conflict: {
    user: { message: 'User already exists', statusCode: 409 },
    email: { message: 'Email already in use', statusCode: 409 },
  },
};
