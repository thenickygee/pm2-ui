// pages/api/auth.js
import { setLoginSession } from '../../api/auth/auth';

export default async function login(req, res) {
  const { username, password } = req.body;
  const knownPlainTextPassword = process.env.ADMIN_PASSWORD;
  const adminUsername = process.env.ADMIN_USERNAME;

  if (username === adminUsername && password === knownPlainTextPassword) {
    const session = { user_id: username };

    await setLoginSession(res, session);

    return res.status(200).end();
  }

  return res.status(401).send('Invalid credentials');
}
