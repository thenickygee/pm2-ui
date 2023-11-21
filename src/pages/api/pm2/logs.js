import pm2 from 'pm2';
import readLastLines from 'read-last-lines';

export default function logsHandler(req, res) {
  const { appName } = req.query;
  const linesToRead = 200; // This is the number of last lines you want to read from the log

  pm2.connect((err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Could not connect to PM2');
      return;
    }

    pm2.describe(appName, async (err, processDescription) => {
      pm2.disconnect();
      if (err) {
        console.error(err);
        res.status(500).send(`Could not retrieve logs for ${appName}`);
        return;
      }

      if (!processDescription || processDescription.length === 0) {
        res.status(404).send(`No processes found for ${appName}`);
        return;
      }

      const outLogPath = processDescription[0].pm2_env.pm_out_log_path;
      const errorLogPath = processDescription[0].pm2_env.pm_err_log_path;

      try {
        const [outLogs, errorLogs] = await Promise.all([
          readLastLines.read(outLogPath, linesToRead),
          readLastLines.read(errorLogPath, linesToRead),
        ]);

        const logs = {
          out: outLogs.split('\n'),
          error: errorLogs.split('\n'),
        };

        res.status(200).json(logs);
      } catch (fileErr) {
        console.error(fileErr);
        res.status(500).send(`Error reading logs for ${appName}`);
      }
    });
  });
}
