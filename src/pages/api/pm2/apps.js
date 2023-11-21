import pm2 from 'pm2';
import Image from 'next/image';

export default async function handler(req, res) {
  try {
    console.log('Request received');
    await new Promise((resolve, reject) => {
      pm2.connect((err) => {
        if (err) {
          console.error(err);
          res.status(500).send('Could not connect to PM2');
          reject(err);
          return;
        }

        pm2.list((err, processDescriptionList) => {
          pm2.disconnect();

          if (err) {
            console.error(err);
            res.status(500).send('Could not retrieve PM2 list');
            reject(err);
            return;
          }

          const apps = processDescriptionList.map((process) => {
            const { monit, pm2_env } = process;
            return {
              name: pm2_env.name,
              status: pm2_env.status,
              cpu: monit ? monit.cpu : null,
              memory: monit ? monit.memory : null,
              uptime: pm2_env.pm_uptime
                ? convertMsToTime(Date.now() - pm2_env.pm_uptime)
                : null,
              pid: process.pid || pm2_env.pid,
              instanceId: pm2_env.NODE_APP_INSTANCE,
            };
          });

          console.log('Sending response');
          res.status(200).json(apps);
          resolve();
        });
      });
    });
  } catch (error) {
    console.error(error);
  }
}

function convertMsToTime(milliseconds) {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);

  seconds %= 60;
  minutes %= 60;
  hours %= 24;

  let timeString = '';
  if (days > 0) {
    timeString += `${days}d `;
  }
  if (hours > 0 || timeString.length > 0) {
    timeString += `${hours}h `;
  }
  if (minutes > 0 || timeString.length > 0) {
    timeString += `${minutes}m `;
  }
  if (seconds > 0 || timeString.length > 0) {
    timeString += `${seconds}s`;
  }

  return timeString.trim();
}
