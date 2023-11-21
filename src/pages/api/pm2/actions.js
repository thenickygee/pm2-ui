// pages/api/pm2/actions.js
import pm2 from 'pm2';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const { appName, action } = req.body;
  if (!appName || typeof appName !== 'string') {
    res.status(400).send('Invalid or missing appName');
    return;
  }

  const validActions = ['restart', 'stop', 'reload', 'start', 'delete'];
  if (!validActions.includes(action)) {
    res.status(400).send('Invalid action');
    return;
  }

  pm2.connect((err) => {
    if (err) {
      console.error('PM2 connect error:', err);
      res.status(500).send('Could not connect to PM2');
      return;
    }

    pm2[action](appName, (err, proc) => {
      pm2.disconnect();
      if (err) {
        console.error(`PM2 ${action} error:`, err);
        res.status(500).send(`Failed to ${action} app ${appName}`);
        return;
      }
      res
        .status(200)
        .json({ message: `Successfully ${action}ed app ${appName}` });
    });
  });
}
