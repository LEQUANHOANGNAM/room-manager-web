import { useState } from 'react';
import { chatApi } from '../services/api';
import './Chat.css';

const Chat = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    try {
      const res = await chatApi(question);
      setAnswer(res.answer);
    } catch (error) {
      setAnswer('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <h2>Chat Hỗ Trợ</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Nhập câu hỏi của bạn..."
          rows={4}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Đang xử lý...' : 'Gửi'}
        </button>
      </form>
      {answer && (
        <div className="answer">
          <h3>Trả lời:</h3>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

export default Chat;