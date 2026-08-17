import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import Alert from '../../components/Alert';
import { PartyPopper, BarChart2, ArrowLeft, RotateCcw, FileQuestion } from 'lucide-react';

export default function QuizPage() {
  const { quizId, courseId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/quizzes/${quizId}`)
      .then((res) => setQuiz(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load quiz'))
      .finally(() => setLoading(false));
  }, [quizId]);

  const selectAnswer = (questionIdx, optionIdx) => {
    setAnswers((prev) => ({ ...prev, [questionIdx]: optionIdx }));
  };

  const answeredCount = Object.keys(answers).length;

  const handleSubmit = async () => {
    if (answeredCount !== quiz.questions.length) {
      setError('Please answer every question before submitting.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const orderedAnswers = quiz.questions.map((_, idx) => answers[idx]);
      const res = await api.post(`/quizzes/${quizId}/submit`, { answers: orderedAnswers });
      setResult(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;
  if (error && !quiz) return <div className="container-page max-w-2xl py-16"><Alert type="error" message={error} /></div>;

  if (result) {
    return (
      <div className="container-page max-w-xl py-16 text-center">
        <div className="card p-10">
          <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-5 ${result.passed ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'}`}>
            {result.passed ? <PartyPopper size={28} /> : <BarChart2 size={28} />}
          </div>
          <h1 className="text-2xl font-display font-bold mb-2">{result.passed ? 'You passed!' : 'Not quite there'}</h1>
          <p className="text-slate-500 mb-2">You scored</p>
          <p className="text-4xl font-display font-bold text-gradient mb-6">{result.scorePercent}%</p>
          <p className="text-sm text-slate-500 mb-7">{result.correctCount} of {result.totalQuestions} answered correctly</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate(`/student/learn/${courseId}`)} className="btn-primary">
              <ArrowLeft size={16} /> Back to course
            </button>
            {!result.passed && (
              <button onClick={() => { setResult(null); setAnswers({}); }} className="btn-secondary">
                <RotateCcw size={16} /> Retake quiz
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page max-w-2xl py-10">
      <div className="flex items-center gap-3 mb-1">
        <span className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0"><FileQuestion size={17} /></span>
        <h1 className="text-2xl font-display font-bold">{quiz.title}</h1>
      </div>
      <p className="text-slate-500 mb-2 ml-12">Passing score: {quiz.passingScorePercent}% · {quiz.questions.length} questions</p>

      <div className="ml-12 mb-6">
        <div className="flex justify-between text-xs text-slate-400 mb-1.5">
          <span>Answered</span>
          <span>{answeredCount}/{quiz.questions.length}</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${(answeredCount / quiz.questions.length) * 100}%` }} />
        </div>
      </div>

      <Alert type="error" message={error} />

      <div className="space-y-5">
        {quiz.questions.map((q, qIdx) => (
          <div key={q._id} className="card p-5">
            <p className="font-medium text-ink mb-4 flex gap-2">
              <span className="text-brand-500">{qIdx + 1}.</span> {q.questionText}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, oIdx) => (
                <label
                  key={oIdx}
                  className={`flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer text-sm transition-colors ${
                    answers[qIdx] === oIdx ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${qIdx}`}
                    className="accent-brand-600"
                    checked={answers[qIdx] === oIdx}
                    onChange={() => selectAnswer(qIdx, oIdx)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button onClick={handleSubmit} disabled={submitting} className="btn-primary w-full mt-6">
        {submitting ? 'Submitting...' : 'Submit quiz'}
      </button>
    </div>
  );
}
