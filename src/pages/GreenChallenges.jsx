import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Award,
  CheckCircle2,
  Clock,
  Users,
  Plus,
  ShieldCheck,
  Zap,
  Trees,
  FileCheck,
  Bike,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Modal from '../components/Modal';
import { storageService } from '../services/storageService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function GreenChallenges() {
  const { isAdmin, isStudent, currentUser } = useAuth();
  const { addToast } = useToast();

  const [challenges, setChallenges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userParticipation, setUserParticipation] = useState(storageService.getUserParticipation());

  // Admin Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Waste Reduction',
    points: 150,
    targetCount: 300,
    deadline: '2026-11-30',
    badgeName: 'Eco Champion'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setChallenges(storageService.getChallenges());
    setLeaderboard(storageService.getLeaderboard());
    setUserParticipation(storageService.getUserParticipation());
  };

  const handleJoinChallenge = (challengeId) => {
    if (userParticipation.joinedChallengeIds.includes(challengeId)) return;

    const updated = {
      ...userParticipation,
      joinedChallengeIds: [...userParticipation.joinedChallengeIds, challengeId]
    };
    storageService.saveUserParticipation(updated);
    setUserParticipation(updated);
    addToast('You have joined this green challenge! Track your progress.', 'info');
  };

  const handleLeaveChallenge = (challengeId) => {
    const updated = {
      ...userParticipation,
      joinedChallengeIds: userParticipation.joinedChallengeIds.filter((id) => id !== challengeId)
    };
    storageService.saveUserParticipation(updated);
    setUserParticipation(updated);
    addToast('Left challenge.', 'info');
  };

  const handleClaimPoints = (challenge) => {
    if (userParticipation.claimedRewardChallengeIds.includes(challenge.id)) {
      addToast('You have already claimed completion points for this challenge!', 'error');
      return;
    }

    // Award points and add badge
    const newBadge = {
      id: `b-${Date.now()}`,
      title: challenge.badgeName || 'Eco Hero',
      icon: 'ShieldCheck',
      date: new Date().toISOString().split('T')[0]
    };

    const newActivity = {
      id: `act-${Date.now()}`,
      action: `Completed challenge: ${challenge.title}`,
      points: challenge.points,
      date: new Date().toISOString().split('T')[0]
    };

    const updated = {
      ...userParticipation,
      completedChallengeIds: [...userParticipation.completedChallengeIds, challenge.id],
      claimedRewardChallengeIds: [...userParticipation.claimedRewardChallengeIds, challenge.id],
      badges: [...userParticipation.badges, newBadge],
      activityHistory: [newActivity, ...userParticipation.activityHistory]
    };

    storageService.saveUserParticipation(updated);
    setUserParticipation(updated);

    // Update leaderboard
    const updatedLeaderboard = storageService.updateLeaderboardUser(challenge.points);
    setLeaderboard(updatedLeaderboard);

    // Update challenge counter
    const updatedChallenges = challenges.map((c) =>
      c.id === challenge.id ? { ...c, currentCount: c.currentCount + 1 } : c
    );
    storageService.saveChallenge({ ...challenge, currentCount: challenge.currentCount + 1 });
    setChallenges(updatedChallenges);

    addToast(`Congratulations! Awarded +${challenge.points} sustainability points!`, 'success');
  };

  const handleCreateChallenge = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      addToast('Challenge title is required', 'error');
      return;
    }

    const payload = {
      ...formData,
      points: Number(formData.points),
      targetCount: Number(formData.targetCount),
      status: 'active'
    };

    const updated = storageService.saveChallenge(payload);
    setChallenges(updated);
    setIsModalOpen(false);
    addToast('New campus sustainability challenge published!', 'success');
  };

  const handleToggleStatus = (c) => {
    const newStatus = c.status === 'active' ? 'closed' : 'active';
    const updated = storageService.saveChallenge({ ...c, status: newStatus });
    setChallenges(updated);
    addToast(`Challenge is now marked as ${newStatus}`, 'info');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Green Campus Challenges</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Gamified student sustainability initiatives, point-earning green pledges, and verified participation
          </p>
        </div>

        {isAdmin && (
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
            <Plus size={16} />
            <span>Create New Challenge</span>
          </button>
        )}
      </div>

      {/* Main Grid: Challenges List & Leaderboard */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left Column: Challenges */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={20} color="var(--primary-600)" />
            <span>Active Environmental Quests</span>
          </h2>

          {challenges.map((c) => {
            const isJoined = userParticipation.joinedChallengeIds.includes(c.id);
            const isClaimed = userParticipation.claimedRewardChallengeIds.includes(c.id);
            const pct = Math.min(100, Math.round((c.currentCount / c.targetCount) * 100));

            return (
              <div
                key={c.id}
                className="card card-hover"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  borderLeft: `4px solid ${c.status === 'active' ? 'var(--primary-500)' : '#94a3b8'}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-success">{c.category}</span>
                      <span className={`badge ${c.status === 'active' ? 'badge-info' : 'badge-neutral'}`}>
                        {c.status === 'active' ? 'In Progress' : 'Closed'}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '0.5rem' }}>
                      {c.title}
                    </h3>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-700)' }}>
                      +{c.points}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Points</span>
                  </div>
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {c.description}
                </p>

                {/* Participant Goal Progress */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={14} /> {c.currentCount} participants
                    </span>
                    <span>Target: {c.targetCount} ({pct}%)</span>
                  </div>
                  <div style={{ height: '7px', background: 'var(--bg-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: 'var(--primary-500)', borderRadius: '999px' }} />
                  </div>
                </div>

                {/* Footer with Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <Clock size={13} />
                    <span>Deadline: {c.deadline}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {isAdmin && (
                      <button
                        onClick={() => handleToggleStatus(c)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem' }}
                      >
                        {c.status === 'active' ? 'Close Quest' : 'Reactivate'}
                      </button>
                    )}

                    {c.status === 'active' && (
                      <>
                        {!isJoined ? (
                          <button
                            onClick={() => handleJoinChallenge(c.id)}
                            className="btn btn-outline-primary btn-sm"
                          >
                            Join Quest
                          </button>
                        ) : isClaimed ? (
                          <span className="badge badge-success" style={{ gap: '4px' }}>
                            <CheckCircle2 size={13} /> Completed (+{c.points} pts)
                          </span>
                        ) : (
                          <button
                            onClick={() => handleClaimPoints(c)}
                            className="btn btn-primary btn-sm"
                          >
                            Verify & Claim Points
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Student Leaderboard */}
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Trophy size={20} color="#f59e0b" />
                <span>Campus Eco Leaderboard</span>
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Top sustainability point earners this semester</p>
            </div>
            <span className="badge badge-warning">Term 1 Live</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {leaderboard.map((user, idx) => {
              const isCurrentUser = user.id === 'usr-student';
              return (
                <div
                  key={user.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.9rem 1.25rem',
                    borderBottom: '1px solid var(--border-light)',
                    backgroundColor: isCurrentUser ? 'var(--primary-50)' : 'transparent'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span
                      style={{
                        width: '24px',
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        color: idx === 0 ? '#d97706' : idx === 1 ? '#64748b' : idx === 2 ? '#b45309' : 'var(--text-subtle)'
                      }}
                    >
                      #{idx + 1}
                    </span>

                    <span style={{ fontSize: '1.3rem' }}>{user.avatar}</span>

                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {user.name} {isCurrentUser && <span className="badge badge-success" style={{ fontSize: '0.65rem', padding: '1px 4px' }}>You</span>}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {user.department} • {user.challengesCompleted} challenges completed
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-700)' }}>
                      {user.points}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>pts</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Admin Modal: Create Challenge */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Campus Green Challenge"
      >
        <form onSubmit={handleCreateChallenge} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
              Challenge Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Bring Your Own Cup Campus Drive"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
              Quest Description & Criteria *
            </label>
            <textarea
              rows={3}
              placeholder="Describe actions required for students to complete this quest..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Waste Reduction">Waste Reduction</option>
                <option value="Energy Conservation">Energy Conservation</option>
                <option value="Community Action">Community Action</option>
                <option value="Resource Efficiency">Resource Efficiency</option>
                <option value="Mobility & Carbon">Mobility & Carbon</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                Reward Points
              </label>
              <input
                type="number"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                Target Student Count
              </label>
              <input
                type="number"
                value={formData.targetCount}
                onChange={(e) => setFormData({ ...formData, targetCount: e.target.value })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                Challenge Deadline
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
              Badge Title Unlocked
            </label>
            <input
              type="text"
              placeholder="e.g. Hydration Master"
              value={formData.badgeName}
              onChange={(e) => setFormData({ ...formData, badgeName: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Publish Challenge
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
