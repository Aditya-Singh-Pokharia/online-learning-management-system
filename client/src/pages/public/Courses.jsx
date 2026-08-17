import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api/axios';
import CourseCard from '../../components/CourseCard';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';
import { Search, SlidersHorizontal, SearchX } from 'lucide-react';

export default function Courses() {
  const [params, setParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(params.get('search') || '');
  const [category, setCategory] = useState(params.get('category') || '');
  const [difficulty, setDifficulty] = useState(params.get('difficulty') || '');

  const fetchCourses = async (query) => {
    setLoading(true);
    try {
      const res = await api.get('/courses', { params: query });
      setCourses(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const query = {};
    if (search) query.search = search;
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    fetchCourses(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (search) next.search = search;
    if (category) next.category = category;
    if (difficulty) next.difficulty = difficulty;
    setParams(next);
  };

  const clearFilters = () => {
    setSearch(''); setCategory(''); setDifficulty('');
    setParams({});
  };

  const hasFilters = search || category || difficulty;

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-1">Browse courses</h1>
        <p className="text-slate-500">{loading ? 'Searching...' : `${courses.length} course${courses.length === 1 ? '' : 's'} found`}</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-4 mb-8">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="input pl-10"
              placeholder="Search by title, description, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <input
            className="input lg:max-w-xs"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <select className="select lg:max-w-[10rem]" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="">Any level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          <button type="submit" className="btn-primary shrink-0">
            <SlidersHorizontal size={15} /> Apply
          </button>
          {hasFilters && (
            <button type="button" onClick={clearFilters} className="btn-secondary shrink-0">Clear</button>
          )}
        </div>
      </form>

      {loading ? (
        <Spinner />
      ) : courses.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No courses found"
          description="Try a different search term or clear your filters to see everything."
          action={hasFilters && <button onClick={clearFilters} className="btn-primary">Clear filters</button>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((c) => <CourseCard key={c._id} course={c} />)}
        </div>
      )}
    </div>
  );
}
