import React, { useEffect, useState } from 'react';
import { get } from '../../Axios/Axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import moment from 'moment';

const Stats = () => {
  const [stats, setStats] = useState({
    longestStreak: 0,
    totalSuccess: 0,
    totalFailure: 0,
    totalOther: 0,
    statusCount: { success: 0, fail: 0, other: 0 },
    streakData: []
  });

  useEffect(() => {
    get('userTasks/getUserHistory', (res) => {
      const data = res.data;
      calculateStats(data);
    });
  }, []);

  const calculateStats = (data) => {
    let longestStreak = 0;
    let currentStreak = 0;
    let totalSuccess = 0;
    let totalFailure = 0;
    let totalOther = 0;
    let streakData = [];
    let successCount = 0;
    let failCount = 0;
    let otherCount = 0;

    const sortedData = data?.sort((a, b) => new Date(a.date) - new Date(b.date));

    sortedData?.forEach((task) => {
      const status = task.status;
      if (status === 'success') {
        totalSuccess++;
        successCount++;
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else if (status === 'fail') {
        totalFailure++;
        failCount++;
        currentStreak = 0; 
      } else {
        totalOther++;
        otherCount++;
        currentStreak = 0; 
      }

      streakData.push({ date: moment(task.date).format('YYYY-MM-DD'), streak: currentStreak });
    });

    setStats({
      longestStreak,
      totalSuccess,
      totalFailure,
      totalOther,
      streakData,
      statusCount: { success: successCount, fail: failCount, other: otherCount }
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>User Task History</h3>
      <p><strong>Longest Streak:</strong> {stats.longestStreak} days</p>
      <p><strong>Total Successes:</strong> {stats.totalSuccess}</p>
      <p><strong>Total Failures:</strong> {stats.totalFailure}</p>
      <p><strong>Total Other:</strong> {stats.totalOther}</p>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={[
              { name: 'Success', value: stats.statusCount.success },
              { name: 'Failure', value: stats.statusCount.fail },
              { name: 'Other', value: stats.statusCount.other }
            ]}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {stats.statusCount.success > 0 && <Cell fill="#00C49F" />}
            {stats.statusCount.fail > 0 && <Cell fill="#FF0000" />}
            {stats.statusCount.other > 0 && <Cell fill="#FFBB28" />}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <h4>Task Streak Over Time</h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={stats.streakData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="streak" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>

      <h4>Status Overview (Success vs Fail vs Other)</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={[
            { name: 'Success', value: stats.statusCount.success },
            { name: 'Fail', value: stats.statusCount.fail },
            { name: 'Other', value: stats.statusCount.other }
          ]}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Stats;
