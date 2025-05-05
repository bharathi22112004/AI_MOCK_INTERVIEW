import React, { useContext } from 'react';
import '../css/BarChartPage.css';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';
import { GlobalContext } from '../components/utils/GlobalState';

const BarChartPage = () => {
  const navigate = useNavigate();
  const { gEmotionData } = useContext(GlobalContext);

  const data = Object.entries(gEmotionData || {}).map(([emotion, value]) => ({
    name: emotion.charAt(0).toUpperCase() + emotion.slice(1),
    value: parseFloat(value),
  }));

  if (!data.length) {
    return (
      <div className="barchart-container">
        <h2 className="barchart-title">Interview Performance - Emotion Analysis</h2>
        <p style={{ marginTop: '2rem' }}>⚠️ No data available to display the chart.</p>
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back to Review
        </button>
      </div>
    );
  }

  return (
    <div className="barchart-container">
      <h2 className="barchart-title">Interview Performance - Emotion Analysis</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(tick) => `${tick}%`} />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#611a98" />
        </BarChart>
      </ResponsiveContainer>

      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back to Review
      </button>
    </div>
  );
};

export default BarChartPage;
