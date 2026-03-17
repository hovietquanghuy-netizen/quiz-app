import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const ResultsChart = ({ correct, wrong }: { correct: number, wrong: number }) => {
  const data = [
    { name: 'Đúng', value: correct, color: '#22c55e' }, // green-500
    { name: 'Sai/Chưa làm', value: wrong, color: '#ef4444' }, // red-500
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
