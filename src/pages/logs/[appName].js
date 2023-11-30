// pages/logs/[appName].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '../components/nav';
import Link from 'next/link';
import { faBackward } from '@fortawesome/free-solid-svg-icons';
import { Popover } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClock,
  faCog,
  faIdCard,
  faMemory,
  faMicrochip,
  faPlayCircle,
  faRecycle,
  faStop,
  faSyncAlt,
  faTerminal,
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const LogsPage = (app) => {
  const router = useRouter();
  const { appName, index } = router.query;

  const [logs, setLogs] = useState({ out: [], error: [] });
  const [loading, setLoading] = useState(false);
  const [apps, setApps] = useState([]);
  const [currentAppData, setCurrentAppData] = useState(null);
  const [groupedApps, setGroupedApps] = useState({});

  useEffect(() => {
    async function fetchApps() {
      const res = await fetch('/api/pm2/apps');
      const data = await res.json();

      const grouped = data.reduce((acc, app) => {
        if (!acc[app.name]) acc[app.name] = [];
        acc[app.name].push(app);
        return acc;
      }, {});
      setApps(data);
      setGroupedApps(grouped);
    }

    fetchApps();

    const intervalId = setInterval(() => {
      fetchApps();
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const pm2AppAction = async (appName, action) => {
    try {
      const response = await fetch('/api/pm2/actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ appName, action }),
      });

      if (!response.ok) {
        throw new Error('PM2 action failed');
      }

      const result = await response.json();
      toast.success(result.message);
    } catch (error) {
      console.error('Error performing action on app:', error);
      toast.error('Error performing action on app');
    }
  };

  useEffect(() => {
    if (appName && groupedApps[appName] && groupedApps[appName].length > 0) {
      setCurrentAppData(groupedApps[appName][0]);
    }
  }, [appName, groupedApps]);

  useEffect(() => {
    if (appName) {
      const fetchLogs = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `/api/pm2/logs?appName=${encodeURIComponent(appName)}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          if (
            data.out &&
            Array.isArray(data.out) &&
            data.error &&
            Array.isArray(data.error)
          ) {
            setLogs(data);
          } else {
            throw new Error('Log format is incorrect');
          }
        } catch (error) {
          console.error('Failed to fetch logs:', error);
          setLogs({
            out: [`Error fetching logs: ${error.message}`],
            error: [],
          });
        }
        setLoading(false);
      };

      fetchLogs();
    }
  }, [appName]);

  function getColorClass(value, thresholds) {
    if (value < thresholds.green) return 'text-green-500';
    if (value < thresholds.yellow) return 'text-yellow-500';
    if (value < thresholds.orange) return 'text-orange-500';
    return 'text-red-500';
  }

  useEffect(() => {
    if (appName && groupedApps[appName]) {
      setCurrentAppData(groupedApps[appName]);
    }
  }, [appName, groupedApps]);

  return (
    <>
      <Navbar />
      <div className='bg-zinc-900 min-h-screen min-w-screen p-4 pt-16'>
        <Link href={`/`}>
          <button className='bg-zinc-700 hover:border-zinc-400 border-zinc-800 border rounded-md py-2 px-6 mb-4 mt-2 font-bold text-gray-100 gap-2 flex justify-center align-middle items-center'>
            <FontAwesomeIcon icon={faBackward} className=' text-gray-100' />{' '}
            DASHBOARD
          </button>
        </Link>
        {app.status}
        <div
          key={app.instanceId}
          className='flex flex-col rounded-md shadow-xl min-w-max max-w-content bg-zinc-950 p-2 py-0 pb-2 w-full max-w-5xl mb-4'
        >
          <div className='flex flex-col'>
            <div className='flex items-center justify-between gap-6 p-2 mb-2 rounded-md'>
              <p className='flex items-center gap-2 text-xl font-bold text-gray-100'>
                {' '}
                <span className='font-bold text-zinc-300'>
                  Instance [ {app.instanceId} ]
                </span>
              </p>
              <span
                className={`badge ${
                  app.status === 'online'
                    ? 'bg-green-800 text-white px-2 py-0.5 rounded-md'
                    : 'bg-red-800 text-white px-2 py-0.5 rounded-md'
                }`}
              >
                {app.status}
              </span>
            </div>

            <div className='flex flex-col pb-4'>
              <p
                className={`${
                  index === 1 ? 'md:flex-row-reverse' : 'flex'
                } flex items-center gap-2 w-full justify-between`}
              >
                <span
                  className={`${
                    index === 1 ? 'md:flex-row-reverse' : 'flex'
                  } flex gap-2`}
                >
                  {' '}
                  <FontAwesomeIcon
                    icon={faMicrochip}
                    className={`h-5 ${getColorClass(app.cpu, {
                      green: 50,
                      yellow: 70,
                      orange: 85,
                    })}`}
                  />
                  <span className='text-zinc-400'>CPU</span>
                </span>
                <span className='font-bold text-zinc-100 text-xl'>
                  {app.cpu}%
                </span>
              </p>
              <p
                className={`${
                  index === 1 ? 'md:flex-row-reverse' : 'flex'
                } flex items-center gap-2 w-full justify-between`}
              >
                {' '}
                <span
                  className={`${
                    index === 1 ? 'md:flex-row-reverse' : 'flex'
                  } flex gap-2`}
                >
                  <FontAwesomeIcon
                    icon={faMemory}
                    className={`h-5 ${getColorClass(app.memory, {
                      green: 50000000,
                      yellow: 10000000,
                      orange: 150000000,
                    })}`}
                  />
                  <span className='text-zinc-400'>MEM</span>
                </span>
                <span className='text-xl font-bold text-gray-100'>
                  {(app.memory / (1024 * 1024)).toFixed(2) || '0'} MB
                </span>
              </p>
              <p
                className={`${
                  index === 1 ? 'md:flex-row-reverse' : 'flex'
                } flex items-center gap-2 w-full justify-between`}
              >
                {' '}
                <span
                  className={`${
                    index === 1 ? 'md:flex-row-reverse' : 'flex'
                  } flex gap-2`}
                >
                  {' '}
                  <FontAwesomeIcon
                    icon={faClock}
                    className='h-5 text-amber-50'
                  />
                  <span className='text-zinc-400'>UPTIME</span>
                </span>
                <span className='font-bold text-zinc-100 text-xl'>
                  {app.uptime || 'n/a'}
                </span>
              </p>
              <p
                className={`${
                  index === 1 ? 'md:flex-row-reverse' : 'flex'
                } flex items-center gap-2 w-full justify-between`}
              >
                {' '}
                <span
                  className={`${
                    index === 1 ? 'md:flex-row-reverse' : 'flex'
                  } flex gap-2`}
                >
                  {' '}
                  <FontAwesomeIcon
                    icon={faIdCard}
                    className='h-5 text-amber-50'
                  />
                  <span className='text-zinc-400'>PID</span>
                </span>
                <span className='font-bold text-zinc-100'>
                  {app.pid || 'n/a'}
                </span>
              </p>
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            {/* Conditional rendering for buttons based on app status */}
            {app.status === 'online' ? (
              <>
                <Popover className='relative flex w-full justify-around gap-2 text-zinc-100'>
                  <Popover.Button className='bg-zinc-900 hover:border-zinc-400 border-zinc-800 border p-3 rounded-md flex items-center gap-2 text-zinc-100'>
                    <FontAwesomeIcon
                      icon={faCog}
                      className='h-5 text-amber-50'
                    />
                    Actions
                  </Popover.Button>
                  <Link href={`/logs/${encodeURIComponent(app.name)}`}>
                    <button className='bg-zinc-900 hover:border-zinc-400 border-zinc-800 border rounded-md py-3 px-6 text-zinc-100'>
                      <FontAwesomeIcon
                        icon={faTerminal}
                        className=' text-amber-50'
                      />{' '}
                      <p>Logs</p>
                    </button>
                  </Link>
                  <Popover.Panel className='absolute z-10 -mt-36 shadow-2xl'>
                    <div className='flex flex-col gap-2 bg-zinc-700 p-3 rounded-md'>
                      <button
                        className='flex items-center justify-center gap-2 p-1 px-6 bg-zinc-800 rounded-md hover:bg-zinc-900 text-zinc-100'
                        aria-label='Reload'
                        onClick={() => pm2AppAction(app.name, 'reload')}
                      >
                        <FontAwesomeIcon
                          icon={faSyncAlt}
                          className='h-5 text-amber-50'
                        />
                        Reload
                      </button>
                      <button
                        className='flex items-center justify-center gap-2 p-1 px-3 bg-zinc-800 rounded-md hover:bg-zinc-900 text-zinc-100'
                        aria-label='Restart'
                        onClick={() => pm2AppAction(app.name, 'restart')}
                      >
                        <FontAwesomeIcon
                          icon={faRecycle}
                          className='h-5 text-white'
                        />
                        Restart
                      </button>
                      <button
                        className='flex items-center justify-center gap-2 p-1 px-3 bg-zinc-800 rounded-md hover:bg-red-900 text-zinc-100'
                        aria-label='Stop'
                        onClick={() => pm2AppAction(app.name, 'stop')}
                      >
                        <FontAwesomeIcon
                          icon={faStop}
                          className='h-5 text-white'
                        />
                        Stop
                      </button>
                    </div>
                  </Popover.Panel>
                </Popover>
              </>
            ) : (
              <button
                className='flex items-center justify-center gap-2 py-3 bg-green-600 rounded-md hover:bg-green-700 text-zinc-100'
                aria-label='Start'
                onClick={() => pm2AppAction(app.name, 'start')}
              >
                <FontAwesomeIcon
                  icon={faPlayCircle}
                  className='h-5 text-amber-50'
                />
                Start
              </button>
            )}
          </div>
        </div>
        <h1 className='text-2xl font-bold mb-4 text-gray-100'>
          Logs for {appName}
        </h1>
        {loading ? (
          <div className='text-white'>Loading...</div>
        ) : (
          <>
            <div className='flex flex-col 2xl:max-w-[1400px] gap-2 text-gray-100'>
              <div className='mb-4 bg-zinc-800 rounded-md w-full p-3 whitespace-pre-wrap'>
                <h2 className='text-xl font-bold bg-zinc-900 p-2 rounded-md'>
                  Standard Output:
                </h2>
                <pre className='log-wrap break-all whitespace-pre'>
                  {logs.out.map((line, index) => (
                    <div key={`out-line-${index}`}>{line}</div>
                  ))}
                </pre>
              </div>
              <div className='mb-4 bg-zinc-800 rounded-md w-full p-3 break-words'>
                <h2 className='text-xl font-bold bg-zinc-900 p-2 rounded-md'>
                  Error Output:
                </h2>
                <pre className='log-wrap break-all whitespace-pre-wrap'>
                  {logs.error.map((line, index) => (
                    <div key={`error-line-${index}`}>{line}</div>
                  ))}
                </pre>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default LogsPage;
