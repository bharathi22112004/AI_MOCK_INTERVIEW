import React, { useEffect, useState, useContext } from 'react';
import '../css/ReviewPageNew.css';
import Markdown from 'react-markdown';
import axios from 'axios';
import { toast } from 'react-toastify';
import { toastErrorStyle } from '../components/utils/toastStyle';
import { GlobalContext } from '../components/utils/GlobalState';
import Canvas3D from '../components/utils/Canvas3D';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

function ReviewPage() {
  const { gJobRole, gQtns, gAns, gEmotionData, gValidReview, gSuspiciousCount } = useContext(GlobalContext);
  const [review, setReview] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [scores, setScores] = useState([]);
  const navigate = useNavigate();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384'];

  useEffect(() => {
    let count = 0;
    let temp = '';
    let speed = review.length > 1000 ? 20 : 40;
    const intervalId = setInterval(() => {
      if (count >= review.length) {
        clearInterval(intervalId);
        return;
      }
      temp += review[count];
      setDisplayText(temp);
      count++;
    }, speed);
    return () => clearInterval(intervalId);
  }, [review]);

  useEffect(() => {
    if (!gValidReview) {
      window.location.replace('/');
    }
  }, []);

  useEffect(() => {
    getReview();
  }, [gAns]);

  const getReview = async () => {
    if (gAns.length === 0 || review !== '') return;

    try {
      const response = await axios.post('http://localhost:5000/api/get-review', {
        job_role: gJobRole,
        qns: gQtns,
        ans: gAns,
        emotion: gEmotionData,
        suspiciousCount: gSuspiciousCount
      });
      setReview(response.data.review);
      setScores(response.data.scores || []);
    } catch (error) {
      toast.error(error.response ? error.response.data.errorMsg : error.message || error, { ...toastErrorStyle(), autoClose: 2000 });
    }
  };

  const gotoHomePage = () => {
    navigate('/interview', { replace: true });
  };

  const goToChartPage = () => {
    navigate('/chart', {
      state: {
        scores: {
          Happy: 0.3,
          Sad: 0.2,
          Neutral: 0.15,
          Angry: 0.1,
          Fear: 0.05,
          Disgust: 0.1,
          Surprise: 0.1,
        },
      },
    });
        
  };

  const data = scores.length > 0 ? scores.map((score, index) => ({ name: `Q${index + 1}`, value: score })) : [];

  return (
    <div className='review-main-div'>
      <div className='left-main-div'>
        {review.length <= 0 ? (
          <div className='loading-div'>
            <Canvas3D pos={[0, -3, 0]} scale={[6.5, 6.5, 6.5]} modelPath={'/robot1.glb'} classname={'robotloading'} />
            <center><h1>Generating Review...</h1></center>
          </div>
        ) : (
          <div className='review-text-mainDiv'>
            <div className='robotImage-div'>
              <Canvas3D pos={[0, -3, 0]} scale={[6.7, 6.7, 6.7]} modelPath={'/robot1.glb'} classname={'robotImage'} />
              <h1>Feedback</h1>
            </div>
            <div className='review-text-wrapper'>
              <Markdown className='review-text'>{displayText}</Markdown>
            </div>
          </div>
        )}
      </div>

      <div className='right-main-div'>
        <div className='right-content1-main'>
          <div className='right-content1-sub1'>
            <div className='right-content1-sub1-text'>
              <p>Thank You <br />for choosing our<br /> Mock Interview System</p>
            </div>
            <div className='right-content1-sub1-model'>
              <Canvas3D pos={[0, 0, 0]} scale={[0.015, 0.015, 0.015]} modelPath={'/rubix_cube2.glb'} classname={'threeD_model'} preset={'apartment'} camControls={true} />
            </div>
          </div>
          <div className='right-content1-sub2'>
            <p>
              Practice with us, get feedback, and walk into your interviews with confidence. Let's make sure you're ready to impress!
            </p>
          </div>
        </div>

        {/* Pie Chart Display */}
        <div className='right-content2-main'>
          <p></p>
          {data.length > 0 ? (
            <PieChart width={400} height={400}>
              <Pie data={data} cx='50%' cy='50%' outerRadius={150} fill='#8884d8' dataKey='value' label>
                {data.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          ) : (
            <p></p>
          )}
          <div style={{ display:'flex', gap: '60px', marginTop: '1rem'}}>
            
          <button onClick={gotoHomePage} style={{ width: '200px' }}>Take Interview</button>


            
            <button style={{ width: '200px' }}
  onClick={() =>
    navigate('/chart', {
      state: {
        scores: {
          Happy: 0.3,
          Sad: 0.15,
          Neutral: 0.25,
          Angry: 0.1,
          Fear: 0.05,
          Disgust: 0.05,
          Surprise: 0.1,
        },
      },
    })
  }
>
  Check Performance
</button>



          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewPage;
