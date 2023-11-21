// api/auth/auth.js

export const setLoginSession = (res, session) => {
  res.setHeader(
    'Set-Cookie',
    `loggedIn=${session.user_id}; Path=/; HttpOnly; SameSite=Strict`
  );
};
