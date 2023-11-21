import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Popover, Switch } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClock,
  faCog,
  faCube,
  faFilter,
  faIdCard,
  faMemory,
  faMicrochip,
  faPlayCircle,
  faRecycle,
  faSkull,
  faStop,
  faSyncAlt,
  faTerminal,
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const AppCard = () => {
  const [apps, setApps] = useState([]);
  const [groupedApps, setGroupedApps] = useState({});
  const [filter, setFilter] = useState('');
  const [showOnline, setShowOnline] = useState(true);
  const [showError, setShowError] = useState(true);
  const [showStopped, setShowStopped] = useState(true);

  const toggleVisibility = (app) => {
    return (
      (showOnline && app.status === 'online') ||
      (showError && app.status === 'error') ||
      (showStopped && app.status === 'stopped')
    );
  };

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

  if (apps.length === 0) {
    return (
      <div className='text-center text-white bg-zinc-700 p-3 rounded-md select-none cursor-default mt-4'>
        No processes running
      </div>
    );
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value.toLowerCase());
  };

  const filteredGroupNames = Object.keys(groupedApps).filter((groupName) =>
    groupName.toLowerCase().includes(filter)
  );

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
      toast.success(result.message); // Display success toast
    } catch (error) {
      console.error('Error performing action on app:', error);
      toast.error('Error performing action on app'); // Display error toast
    }
  };

  function getColorClass(value, thresholds) {
    if (value < thresholds.green) return 'text-green-500';
    if (value < thresholds.yellow) return 'text-yellow-500';
    if (value < thresholds.orange) return 'text-orange-500';
    return 'text-red-500';
  }

  const StatusSwitch = ({ label, isEnabled, onToggle }) => {
    return (
      <Switch.Group
        as='div'
        className='flex items-center w-full justify-between'
      >
        <Switch.Label as='span' className='pr-20'>
          {label}
        </Switch.Label>
        <Switch
          checked={isEnabled}
          onChange={onToggle}
          className={`${
            isEnabled ? 'bg-blue-600' : 'bg-gray-400'
          } relative inline-flex items-center h-6 rounded-full w-11 gap-4`}
        >
          <span
            className={`${
              isEnabled ? 'translate-x-6' : 'translate-x-1'
            } inline-block w-4 h-4 transform bg-white rounded-full`}
          />
        </Switch>
      </Switch.Group>
    );
  };

  const getGroupBackgroundColor = (apps) => {
    let onlineCount = 0;
    let offlineCount = 0;

    apps.forEach((app) => {
      if (app.status === 'online') {
        onlineCount += 1;
      } else {
        offlineCount += 1;
      }
    });

    if (onlineCount === apps.length) {
      return 'bg-green-800'; // All instances online
    } else if (offlineCount === apps.length) {
      return 'bg-red-800'; // All instances offline
    } else {
      return 'bg-orange-700'; // Mixed instance statuses
    }
  };

  return (
    <>
      <div className='flex flex-col sm:flex-row justify-between mb-4 px-3 text-zinc-100 gap-2'></div>
      <div className='flex'>
        <Popover className='relative'>
          <Popover.Button
            as='div'
            className='text-gray-100 bg-zinc-950 p-2 rounded cursor-pointer'
          >
            <FontAwesomeIcon icon={faFilter} />
          </Popover.Button>
          <Popover.Panel className='absolute z-10'>
            <div className='bg-black rounded-lg shadow-xl p-4 mt-2 text-gray-100 flex flex-col gap-2 items-stretch'>
              <StatusSwitch
                label='Online'
                isEnabled={showOnline}
                onToggle={() => setShowOnline(!showOnline)}
              />
              <StatusSwitch
                label='Error'
                isEnabled={showError}
                onToggle={() => setShowError(!showError)}
              />
              <StatusSwitch
                label='Stopped'
                isEnabled={showStopped}
                onToggle={() => setShowStopped(!showStopped)}
              />
            </div>
          </Popover.Panel>
        </Popover>
        <div className='w-full flex justify-center px-2 gap-2'>
          <input
            type='text'
            placeholder='Filter by group name...'
            className='text-white p-2 w-full 2xl:max-w-3xl max-w-md rounded-md shadow-xl bg-zinc-950 mb-4'
            value={filter}
            onChange={handleFilterChange}
          />
        </div>
      </div>
      <div className='flex flex-col lg:grid 2xl:grid lg:grid-cols-2 2xl:grid-cols-3 gap-y-2 gap-x-4 px-4 w-full 2xl:max-w-[1800px]'>
        {filteredGroupNames.map((groupName) => {
          const visibleApps = groupedApps[groupName].filter(toggleVisibility);
          if (visibleApps.length === 0) return null;
          const groupBgColorClass = getGroupBackgroundColor(visibleApps); // Get the color based on the app statuses

          return (
            <div
              key={groupName}
              className={`${groupBgColorClass} mb-2 min-w-full overflow-y-auto rounded-md p-2 shadow-lg flex flex-col gap-4 justify-between bg-opacity-40`}
            >
              <h3 className='text-xl font-bold text-white flex gap-2 items-center align-middle'>
                <FontAwesomeIcon icon={faCube} className='h-5 text-amber-50' />
                {groupName}
              </h3>
              <div className='flex flex-col md:flex-row gap-2 w-full min-w-max'>
                {visibleApps.map((app, index) => (
                  <div
                    key={app.instanceId}
                    className='flex flex-col rounded-md shadow-xl max-w-content bg-zinc-950 p-2 py-0 pb-2 w-full'
                  >
                    <div className='flex flex-col'>
                      <div className='flex items-center justify-between gap-6 py-1.5 mb-2 rounded-md'>
                        <p className='flex items-center gap-2 text-xl font-bold'>
                          {' '}
                          <span className='font-bold text-zinc-300 min-w-max'>
                            Instance [ {app.instanceId} ]
                          </span>
                        </p>
                        <span
                          className={`badge ${
                            app.status === 'online'
                              ? 'bg-green-800 text-white px-2 py-0.5 rounded-md min-w-max'
                              : 'bg-red-800 text-white px-2 py-0.5 rounded-md min-w-max'
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>

                      <div className='flex flex-col pb-4'>
                        <p
                          className={`${
                            index === 1 ? 'md:md:flex-row-reverse' : 'flex'
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
                          <span className='font-bold text-zinc-100'>
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
                          <span className='font-bold text-zinc-100'>
                            {(app.memory / (1024 * 1024)).toFixed(2)} MB
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
                          <span className='font-bold text-zinc-100'>
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
                          <Popover className='relative flex w-full justify-around gap-2'>
                            <Popover.Button className='bg-zinc-900 hover:border-zinc-400 border-zinc-800 border p-3 rounded-md flex items-center justify-center gap-2 text-zinc-100 w-full'>
                              <FontAwesomeIcon
                                icon={faCog}
                                className='h-5 text-amber-50'
                              />
                              Actions
                            </Popover.Button>
                            {/* {app.index !== undefined && ( */}
                            <Link
                              href={`/logs/${encodeURIComponent(
                                app.name
                              )}?index=${app.index || 0}`}
                            >
                              <button className='bg-zinc-900 hover:border-zinc-400 border-zinc-800 border rounded-md py-3 px-6 text-zinc-100 w-full flex gap-2'>
                                <FontAwesomeIcon
                                  icon={faTerminal}
                                  className=' text-amber-50'
                                />{' '}
                                Logs
                              </button>
                            </Link>
                            {/* )} */}
                            <Popover.Panel className='absolute z-10 -mt-36 shadow-2xl mr-24'>
                              <div className='flex flex-col gap-2 bg-black shadow-2xl p-3 rounded-md'>
                                <button
                                  className='flex items-center justify-center gap-2 p-1 px-6 bg-zinc-800 rounded-md hover:bg-zinc-900 text-zinc-100'
                                  aria-label='Reload'
                                  onClick={() =>
                                    pm2AppAction(app.name, 'reload')
                                  }
                                >
                                  <FontAwesomeIcon
                                    icon={faSyncAlt}
                                    className='text-amber-50'
                                  />
                                  Reload
                                </button>
                                <button
                                  className='flex items-center justify-center gap-2 p-1 px-3 bg-zinc-800 rounded-md hover:bg-zinc-900 text-zinc-100'
                                  aria-label='Restart'
                                  onClick={() =>
                                    pm2AppAction(app.name, 'restart')
                                  }
                                >
                                  <FontAwesomeIcon
                                    icon={faRecycle}
                                    className='text-white'
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
                                    className='text-white'
                                  />
                                  Stop
                                </button>
                              </div>
                            </Popover.Panel>
                          </Popover>
                        </>
                      ) : (
                        <button
                          className='flex items-center justify-center gap-2 py-3 bg-zinc-800 rounded-md hover:bg-green-800 text-zinc-100'
                          aria-label='Start'
                          onClick={() => pm2AppAction(app.name, 'start')}
                        >
                          <FontAwesomeIcon
                            icon={faPlayCircle}
                            className='text-amber-50'
                          />
                          Start
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button
                className='flex items-center justify-center gap-2 p-1 px-3 bg-zinc-800 rounded-md hover:bg-red-900 text-zinc-100 -mt-1'
                aria-label='delete'
                onClick={() => pm2AppAction(app.name, 'delete')}
              >
                <FontAwesomeIcon icon={faSkull} className=' text-white' />
                Kill
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default AppCard;
