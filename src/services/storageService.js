/**
 * Unified Storage Service for EcoTrack
 * 
 * Supports LocalStorage with complete offline fallback & sample persistence,
 * and can be connected directly to Firebase Cloud Firestore.
 */

import {
  INITIAL_ENERGY_RECORDS,
  INITIAL_WASTE_RECORDS,
  INITIAL_CHALLENGES,
  INITIAL_LEADERBOARD,
  INITIAL_SUGGESTIONS,
  INITIAL_TARGETS,
  INITIAL_EMISSION_FACTORS,
  INITIAL_USER_PARTICIPATION,
  INITIAL_BUILDINGS
} from '../data/initialData';

const STORAGE_KEYS = {
  ENERGY: 'ecotrack_energy_records',
  WASTE: 'ecotrack_waste_records',
  CHALLENGES: 'ecotrack_challenges',
  LEADERBOARD: 'ecotrack_leaderboard',
  SUGGESTIONS: 'ecotrack_suggestions',
  TARGETS: 'ecotrack_targets',
  FACTORS: 'ecotrack_emission_factors',
  USER_PARTICIPATION: 'ecotrack_user_participation',
  BUILDINGS: 'ecotrack_buildings',
  CONFIG: 'ecotrack_system_config'
};

function getLocal(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return defaultValue;
  }
}

function setLocal(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
  }
}

export const storageService = {
  // Energy Records CRUD
  getEnergyRecords() {
    return getLocal(STORAGE_KEYS.ENERGY, INITIAL_ENERGY_RECORDS);
  },
  saveEnergyRecord(record) {
    const list = this.getEnergyRecords();
    let updated;
    if (record.id) {
      updated = list.map(item => item.id === record.id ? { ...item, ...record } : item);
    } else {
      const newRecord = {
        ...record,
        id: `en-${Date.now()}`,
        isSample: false
      };
      updated = [newRecord, ...list];
    }
    setLocal(STORAGE_KEYS.ENERGY, updated);
    return updated;
  },
  deleteEnergyRecord(id) {
    const list = this.getEnergyRecords();
    const updated = list.filter(item => item.id !== id);
    setLocal(STORAGE_KEYS.ENERGY, updated);
    return updated;
  },

  // Waste Records CRUD
  getWasteRecords() {
    return getLocal(STORAGE_KEYS.WASTE, INITIAL_WASTE_RECORDS);
  },
  saveWasteRecord(record) {
    const list = this.getWasteRecords();
    let updated;
    if (record.id) {
      updated = list.map(item => item.id === record.id ? { ...item, ...record } : item);
    } else {
      const newRecord = {
        ...record,
        id: `ws-${Date.now()}`,
        isSample: false
      };
      updated = [newRecord, ...list];
    }
    setLocal(STORAGE_KEYS.WASTE, updated);
    return updated;
  },
  deleteWasteRecord(id) {
    const list = this.getWasteRecords();
    const updated = list.filter(item => item.id !== id);
    setLocal(STORAGE_KEYS.WASTE, updated);
    return updated;
  },

  // Challenges CRUD & Participation
  getChallenges() {
    return getLocal(STORAGE_KEYS.CHALLENGES, INITIAL_CHALLENGES);
  },
  saveChallenge(challenge) {
    const list = this.getChallenges();
    let updated;
    if (challenge.id) {
      updated = list.map(item => item.id === challenge.id ? { ...item, ...challenge } : item);
    } else {
      const newChallenge = {
        ...challenge,
        id: `ch-${Date.now()}`,
        currentCount: 0,
        status: challenge.status || 'active',
        createdDate: new Date().toISOString().split('T')[0]
      };
      updated = [newChallenge, ...list];
    }
    setLocal(STORAGE_KEYS.CHALLENGES, updated);
    return updated;
  },
  deleteChallenge(id) {
    const list = this.getChallenges();
    const updated = list.filter(item => item.id !== id);
    setLocal(STORAGE_KEYS.CHALLENGES, updated);
    return updated;
  },

  // User Participation State
  getUserParticipation() {
    return getLocal(STORAGE_KEYS.USER_PARTICIPATION, INITIAL_USER_PARTICIPATION);
  },
  saveUserParticipation(data) {
    setLocal(STORAGE_KEYS.USER_PARTICIPATION, data);
    return data;
  },

  // Leaderboard
  getLeaderboard() {
    return getLocal(STORAGE_KEYS.LEADERBOARD, INITIAL_LEADERBOARD);
  },
  updateLeaderboardUser(userPointsIncrement) {
    const list = this.getLeaderboard();
    const updated = list.map(user => {
      if (user.id === 'usr-student') {
        return {
          ...user,
          points: user.points + userPointsIncrement,
          challengesCompleted: user.challengesCompleted + 1
        };
      }
      return user;
    });
    // sort descending
    updated.sort((a, b) => b.points - a.points);
    setLocal(STORAGE_KEYS.LEADERBOARD, updated);
    return updated;
  },

  // Suggestions CRUD
  getSuggestions() {
    return getLocal(STORAGE_KEYS.SUGGESTIONS, INITIAL_SUGGESTIONS);
  },
  saveSuggestion(suggestion) {
    const list = this.getSuggestions();
    let updated;
    if (suggestion.id) {
      updated = list.map(item => item.id === suggestion.id ? { ...item, ...suggestion } : item);
    } else {
      const newSuggestion = {
        ...suggestion,
        id: `sg-${Date.now()}`,
        submittedDate: new Date().toISOString().split('T')[0],
        status: 'Submitted',
        adminNotes: 'Review pending by sustainability department'
      };
      updated = [newSuggestion, ...list];
    }
    setLocal(STORAGE_KEYS.SUGGESTIONS, updated);
    return updated;
  },

  // Targets & Emission Factors Configuration
  getTargets() {
    return getLocal(STORAGE_KEYS.TARGETS, INITIAL_TARGETS);
  },
  saveTargets(targets) {
    setLocal(STORAGE_KEYS.TARGETS, targets);
    return targets;
  },

  getEmissionFactors() {
    return getLocal(STORAGE_KEYS.FACTORS, INITIAL_EMISSION_FACTORS);
  },
  saveEmissionFactors(factors) {
    setLocal(STORAGE_KEYS.FACTORS, factors);
    return factors;
  },

  // Buildings list
  getBuildings() {
    return getLocal(STORAGE_KEYS.BUILDINGS, INITIAL_BUILDINGS);
  },

  // Reset all to sample demo state
  resetToSampleData() {
    localStorage.setItem(STORAGE_KEYS.ENERGY, JSON.stringify(INITIAL_ENERGY_RECORDS));
    localStorage.setItem(STORAGE_KEYS.WASTE, JSON.stringify(INITIAL_WASTE_RECORDS));
    localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(INITIAL_CHALLENGES));
    localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(INITIAL_LEADERBOARD));
    localStorage.setItem(STORAGE_KEYS.SUGGESTIONS, JSON.stringify(INITIAL_SUGGESTIONS));
    localStorage.setItem(STORAGE_KEYS.TARGETS, JSON.stringify(INITIAL_TARGETS));
    localStorage.setItem(STORAGE_KEYS.FACTORS, JSON.stringify(INITIAL_EMISSION_FACTORS));
    localStorage.setItem(STORAGE_KEYS.USER_PARTICIPATION, JSON.stringify(INITIAL_USER_PARTICIPATION));
    localStorage.setItem(STORAGE_KEYS.BUILDINGS, JSON.stringify(INITIAL_BUILDINGS));
  }
};
