import {seEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import MenuBar from '../components/MenuBar';
import '../styles/MissingResult.css';
import matches from '../data/dummyMatches';
import '../styles/wrap.css';

function MissingResult() {
  const [responses, setResponses] = useState({});
  const [showFailed, setShowFailed] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    fetch('http://localhost:5002/api/clip-result')
      .then((res) => res.json())
      .then((data) => setResult(data));
  }, []);

  const handleYes = (id) => {
    setResponses({ ...responses, [id]: 'yes' });
  };

  const handleNo = (id) => {
    setResponses({ ...responses, [id]: 'no' });
  };

  const toggleShowFailed = () => {
    setShowFailed((prev) => !prev);
  };

  const grouped = {
    unanswered: [],
    matched: [],
    failed: [],
  };

  matches.forEach((match) => {
    const response = responses[match.id];
    if (!response) grouped.unanswered.push(match);
    else if (response === 'yes') grouped.matched.push(match);
    else grouped.failed.push(match);
  });

  const renderCard = (match) => {
    const response = responses[match.id];
    return (
      <div key={match.id} className={`card ${response === 'no' ? 'faded' : ''}`} style={{ width: '100%' }}>
        <div className="card-left">
          <img src={match.image} alt="animal" />
        </div>
        <div className="card-right">
          <p className="card-question">혹시 이 아이가 맞으신가요?</p>
          <ul className="card-info">
            <li><strong>품종</strong> {match.type} {'>'} {match.breed}</li>
            <li><strong>구조일</strong> {match.date}</li>
            <li><strong>구조장소</strong> {match.location}</li>
            <li><strong>성별</strong> {match.gender}</li>
            <li><strong>털색</strong> {match.colors.join(', ')}</li>
            <li><strong>특징</strong> {match.features}</li>
          </ul>
          {response === 'no' && <p className="card-fail">매칭 실패</p>}
          {response === 'yes' && (
            <button className="move-button" onClick={() => navigate(`/animal/${match.id}`)}>
              상세 페이지로 이동
            </button>
          )}
          {!response && (
            <div className="card-actions">
              <button className="yes" onClick={() => handleYes(match.id)}>예, 맞습니다</button>
              <button className="no" onClick={() => handleNo(match.id)}>아니오</button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="missing-result">
      <Header />
      <MenuBar />
      <div className="wrap">
        <h2>매칭 결과</h2>

        {grouped.unanswered.length > 0 && (
          <div className="section">
            <h3>답변 대기 중</h3>
            {grouped.unanswered.map(renderCard)}
          </div>
        )}

        {grouped.matched.length > 0 && (
          <div className="section">
            <h3>매칭 성공</h3>
            {grouped.matched.map(renderCard)}
          </div>
        )}

        {grouped.failed.length > 0 && (
          <div className="section">
            <h3 className="collapsible-header" onClick={toggleShowFailed}>
              매칭 실패 {showFailed ? '▶' : '▼'}
            </h3>
            {showFailed && grouped.failed.map(renderCard)}
          </div>
        )}
      </div>
    </div>
  );
}

export default MissingResult;
