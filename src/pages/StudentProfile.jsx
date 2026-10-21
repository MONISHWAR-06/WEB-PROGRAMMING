import React from 'react';
import {
  User,
  Award,
  Sparkles,
  Trophy,
  History,
  CheckCircle,
  Lightbulb,
  ShieldCheck,
  Zap,
  Trees
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';

export default function StudentProfile() {
  const { currentUser } = useAuth();
  const userParticipation = storageService.getUserParticipation();
  const challenges = storageService.getChallenges();

  const joinedChallenges = challenges.filter((c) =>
    userParticipation.joinedChallengeIds.includes(c.id)
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, var(--primary-700), var(--primary-900))',
          color: '#fff',
          padding: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.25rem',
              border: '2px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            {currentUser.avatar || '🌿'}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>
                {currentUser.name}
              </h1>
              <span className="badge badge-success" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#fff' }}>
                Level 3 Eco Pioneer
              </span>
            </div>
            <p style={{ color: 'var(--primary-100)', fontSize: '0.9rem', marginTop: '4px' }}>
              {currentUser.title || 'Student Sustainability Advocate'} • {currentUser.department}
            </p>
          </div>
        </div>

        {/* Points Display */}
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center', padding: '0.75rem 1.25rem', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--primary-200)', display: 'block' }}>Green Points</span>
            <span style={{ fontSize: '1.75rem', fontWeight: 800 }}>420</span>
          </div>

          <div style={{ textAlign: 'center', padding: '0.75rem 1.25rem', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--primary-200)', display: 'block' }}>Quests Done</span>
            <span style={{ fontSize: '1.75rem', fontWeight: 800 }}>{userParticipation.completedChallengeIds.length}</span>
          </div>
        </div>
      </div>

      {/* Badges Earned Showcase */}
      <div className="card">
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Award size={20} color="#f59e0b" />
          <span>Earned Sustainability Badges</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {userParticipation.badges.map((b) => (
            <div
              key={b.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '1rem',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-subtle)'
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--primary-100)',
                  color: 'var(--primary-700)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ShieldCheck size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>{b.title}</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unlocked: {b.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Active Quests & Activity History */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {/* Active Quests Joined */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>
            My Active Challenges ({joinedChallenges.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {joinedChallenges.map((c) => {
              const isCompleted = userParticipation.completedChallengeIds.includes(c.id);
              return (
                <div
                  key={c.id}
                  style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>{c.title}</h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Deadline: {c.deadline} • +{c.points} pts
                    </span>
                  </div>

                  <span className={`badge ${isCompleted ? 'badge-success' : 'badge-warning'}`}>
                    {isCompleted ? 'Completed' : 'In Progress'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity & Points Timeline */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <History size={18} color="var(--primary-600)" />
            <span>Green Activity Log</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {userParticipation.activityHistory.map((act) => (
              <div
                key={act.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.65rem 0',
                  borderBottom: '1px solid var(--border-light)',
                  fontSize: '0.85rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{act.action}</div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{act.date}</span>
                </div>

                {act.points > 0 && (
                  <span style={{ fontWeight: 700, color: 'var(--primary-700)' }}>
                    +{act.points} pts
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
