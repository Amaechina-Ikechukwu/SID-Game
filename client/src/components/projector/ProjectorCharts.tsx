import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const COLORS = ['#00ff00', '#333333', '#ffffff', '#666666'];

export const CyberBarChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 40, right: 40, left: 40, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis dataKey="name" stroke="#00ff00" tick={{ fill: '#00ff00', fontFamily: 'Courier Prime', fontSize: 22 }} />
        <YAxis stroke="#00ff00" tick={{ fill: '#00ff00', fontFamily: 'Courier Prime', fontSize: 20 }} allowDecimals={false} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#000', border: '1px solid #00ff00', color: '#00ff00', fontFamily: 'Courier Prime' }}
          itemStyle={{ color: '#00ff00' }}
        />
        <Bar dataKey="value" fill="#00ff00" barSize={80} label={{ position: 'top', fill: '#00ff00', fontFamily: 'Courier Prime', fontSize: 24, fontWeight: 'bold' }}>
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#00ff00' : '#ffffff'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export const CyberDonutChart: React.FC<{ data: any[] }> = ({ data }) => {
  const renderLabel = ({ name, value, percent, cx, cy, midAngle, outerRadius: or }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = or + 40;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="#00ff00" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontFamily="Courier Prime" fontSize={24} fontWeight="bold">
        {`${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={100}
          outerRadius={160}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          label={renderLabel}
          labelLine={false}
        >
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
             contentStyle={{ backgroundColor: '#000', border: '1px solid #00ff00', color: '#00ff00', fontFamily: 'Courier Prime' }}
             itemStyle={{ color: '#00ff00' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const CyberGroupedBarChart: React.FC<{ data: any[]; keys: string[]; colors?: string[] }> = ({ data, keys, colors = ['#00ff00', '#ff4444'] }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 40, right: 40, left: 40, bottom: 40 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis dataKey="name" stroke="#00ff00" tick={{ fill: '#00ff00', fontFamily: 'Courier Prime', fontSize: 20 }} />
        <YAxis stroke="#00ff00" tick={{ fill: '#00ff00', fontFamily: 'Courier Prime', fontSize: 18 }} allowDecimals={false} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#000', border: '1px solid #00ff00', color: '#00ff00', fontFamily: 'Courier Prime' }}
          itemStyle={{ color: '#00ff00' }}
        />
        <Legend wrapperStyle={{ color: '#00ff00', fontFamily: 'Courier Prime', fontSize: 20 }} />
        {keys.map((key, i) => (
          <Bar key={key} dataKey={key} fill={colors[i % colors.length]} barSize={60} label={{ position: 'top', fill: colors[i % colors.length], fontFamily: 'Courier Prime', fontSize: 20, fontWeight: 'bold' }} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export const Leaderboard: React.FC<{ data: any[] }> = ({ data }) => {
    return (
        <div style={{ width: '100%', height: '100%', overflowY: 'auto', padding: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#00ff00', fontFamily: 'Courier Prime' }}>
                <thead>
                    <tr style={{ borderBottom: '3px solid #00ff00' }}>
                        <th style={{ textAlign: 'left', padding: '15px 20px', fontSize: '1.6rem' }}>RANK</th>
                        <th style={{ textAlign: 'left', padding: '15px 20px', fontSize: '1.6rem' }}>AGENT</th>
                        <th style={{ textAlign: 'right', padding: '15px 20px', fontSize: '1.6rem' }}>SCORE</th>
                    </tr>
                </thead>
                <tbody>
                    {data.sort((a,b) => b.score - a.score).slice(0, 10).map((player, index) => (
                        <tr key={index} style={{ borderBottom: '1px dashed #333', background: index < 3 ? 'rgba(0,255,0,0.05)' : 'transparent' }}>
                            <td style={{ padding: '14px 20px', fontSize: index < 3 ? '2rem' : '1.5rem' }}>
                                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                            </td>
                            <td style={{ padding: '14px 20px', fontSize: index < 3 ? '1.8rem' : '1.4rem', fontWeight: index < 3 ? 'bold' : 'normal' }}>{player.name}</td>
                            <td style={{ padding: '14px 20px', textAlign: 'right', fontSize: index < 3 ? '2rem' : '1.5rem', fontWeight: 'bold' }}>{player.score}/6</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
