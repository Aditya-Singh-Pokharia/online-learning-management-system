import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import Alert from '../../components/Alert';
import { Award, Download, ShieldCheck } from 'lucide-react';

// Public-ish verification view: /certificate/:id
export default function CertificateView() {
  const { id } = useParams();
  const [cert, setCert] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/certificates/${id}`)
      .then((res) => setCert(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Certificate not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (error) return <div className="container-page max-w-2xl py-16"><Alert type="error" message={error} /></div>;

  return (
    <div className="container-page max-w-3xl py-12 sm:py-16">
      <div className="relative bg-white rounded-3xl p-10 sm:p-14 text-center shadow-card border border-slate-100 overflow-hidden print:shadow-none print:border-0">
        <div className="absolute inset-0 border-[10px] border-brand-50 rounded-3xl m-3 pointer-events-none print:hidden" />
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-brand-gradient-soft rounded-full opacity-70 print:hidden" />
        <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-brand-gradient-soft rounded-full opacity-70 print:hidden" />

        <div className="relative">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-gradient flex items-center justify-center text-white shadow-lift mb-6">
            <Award size={28} />
          </div>
          <p className="text-brand-600 font-semibold tracking-[0.2em] text-xs mb-6">CERTIFICATE OF COMPLETION</p>
          <p className="text-slate-500">This certifies that</p>
          <h1 className="text-3xl sm:text-4xl font-display font-bold my-3 text-ink">{cert.studentName}</h1>
          <p className="text-slate-500">has successfully completed the course</p>
          <h2 className="text-xl sm:text-2xl font-display font-semibold text-brand-700 my-3">{cert.courseName}</h2>
          <p className="text-slate-500">Instructed by {cert.instructorName}</p>

          <div className="flex justify-center gap-12 mt-9 text-sm">
            <div>
              <p className="font-semibold text-ink">{new Date(cert.completionDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p className="text-slate-400 text-xs mt-0.5">Completion date</p>
            </div>
            <div>
              <p className="font-semibold text-ink font-mono">{cert.certificateId}</p>
              <p className="text-slate-400 text-xs mt-0.5">Certificate ID</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mt-8">
            <ShieldCheck size={13} /> Verified by LearnHub
          </div>

          <button onClick={() => window.print()} className="btn-primary mt-8 print:hidden">
            <Download size={16} /> Download / Print
          </button>
        </div>
      </div>
    </div>
  );
}
