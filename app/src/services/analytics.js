// app/src/services/analytics.js
import {
  getAnalytics,
  logEvent,
  setUserId,
  setUserProperties,
} from "firebase/analytics";
import app from "../firebase/config";

// Inicializar Analytics
const analytics = getAnalytics(app);

// ============================================================
// USER EVENTS - Autenticação e perfil
// ============================================================

export const trackSignUp = (method = "email") => {
  logEvent(analytics, "sign_up", {
    method, // "email", "google", etc
  });
};

export const trackLogin = (method = "email") => {
  logEvent(analytics, "login", {
    method,
  });
};

export const trackSetUserId = (userId) => {
  setUserId(analytics, userId);
};

export const trackUserProperties = (properties) => {
  // Exemplo: { plan: "free", registration_date: "2024-01-15" }
  setUserProperties(analytics, properties);
};

// ============================================================
// CYCLE EVENTS - Gerenciamento de ciclos
// ============================================================

export const trackCycleCreated = (cycleData) => {
  logEvent(analytics, "cycle_created", {
    days_count: cycleData.daysCount || 0,
    exercises_count: cycleData.exercisesCount || 0,
    cycle_type: cycleData.type || "custom", // "custom", "template", etc
  });
};

export const trackCycleEdited = (cycleId) => {
  logEvent(analytics, "cycle_edited", {
    cycle_id: cycleId,
  });
};

export const trackCycleDeleted = (cycleId, reason = null) => {
  logEvent(analytics, "cycle_deleted", {
    cycle_id: cycleId,
    reason, // "not_working", "completed", "replaced", null
  });
};

export const trackCycleActivated = (cycleId) => {
  logEvent(analytics, "cycle_activated", {
    cycle_id: cycleId,
  });
};

// ============================================================
// WORKOUT EVENTS - Treinos
// ============================================================

export const trackWorkoutStarted = (workoutData) => {
  logEvent(analytics, "workout_started", {
    cycle_id: workoutData.cycleId,
    day_index: workoutData.dayIndex,
    exercises_count: workoutData.exercisesCount || 0,
  });
};

export const trackWorkoutCompleted = (workoutData) => {
  logEvent(analytics, "workout_completed", {
    cycle_id: workoutData.cycleId,
    day_index: workoutData.dayIndex,
    duration_minutes: workoutData.durationMinutes || null,
    exercises_completed: workoutData.exercisesCompleted || 0,
    is_first_workout: workoutData.isFirstWorkout || false,
  });
};

export const trackWorkoutSkipped = (workoutData) => {
  logEvent(analytics, "workout_skipped", {
    cycle_id: workoutData.cycleId,
    day_index: workoutData.dayIndex,
    reason: workoutData.reason || null, // "rest_day", "injury", "busy", null
  });
};

// ============================================================
// ACHIEVEMENT EVENTS - Conquistas e gamificação
// ============================================================

export const trackAchievementUnlocked = (achievementData) => {
  logEvent(analytics, "achievement_unlocked", {
    achievement_id: achievementData.id,
    achievement_tier: achievementData.tier, // "bronze", "silver", "gold", etc
    achievement_category: achievementData.category, // "streak", "workouts", etc
  });
};

export const trackAchievementsViewed = () => {
  logEvent(analytics, "achievements_viewed");
};

export const trackAchievementShared = (achievementId) => {
  logEvent(analytics, "achievement_shared", {
    achievement_id: achievementId,
  });
};

// ============================================================
// FEEDBACK & RATING EVENTS
// ============================================================

export const trackFeedbackSubmitted = (hasContact) => {
  logEvent(analytics, "feedback_submitted", {
    has_contact_info: hasContact, // true se forneceu nome/email
  });
};

export const trackRatingSubmitted = (ratingData) => {
  logEvent(analytics, "rating_submitted", {
    rating: ratingData.rating, // 1-5
    has_comment: ratingData.hasComment,
    allow_public_share: ratingData.allowPublicShare,
  });
};

export const trackRatingPromptShown = () => {
  logEvent(analytics, "rating_prompt_shown");
};

export const trackRatingPromptDismissed = () => {
  logEvent(analytics, "rating_prompt_dismissed");
};

// ============================================================
// NAVIGATION EVENTS - Páginas
// ============================================================

export const trackPageView = (pageName, additionalParams = {}) => {
  logEvent(analytics, "page_view", {
    page_name: pageName,
    page_location: window.location.pathname,
    ...additionalParams,
  });
};

export const trackScreenView = (screenName) => {
  logEvent(analytics, "screen_view", {
    screen_name: screenName,
  });
};

// ============================================================
// STATS & ENGAGEMENT EVENTS
// ============================================================

export const trackStatsViewed = (statsData) => {
  logEvent(analytics, "stats_viewed", {
    total_workouts: statsData.totalWorkouts || 0,
    current_streak: statsData.currentStreak || 0,
  });
};

export const trackHistoryViewed = () => {
  logEvent(analytics, "history_viewed");
};

export const trackStreakMilestone = (streakDays) => {
  logEvent(analytics, "streak_milestone", {
    streak_days: streakDays,
    milestone_type: getMilestoneType(streakDays),
  });
};

// Helper para definir tipo de milestone
const getMilestoneType = (days) => {
  if (days === 7) return "week";
  if (days === 30) return "month";
  if (days === 90) return "quarter";
  if (days === 365) return "year";
  return "custom";
};

// ============================================================
// ONBOARDING & TUTORIAL EVENTS
// ============================================================

export const trackOnboardingStarted = () => {
  logEvent(analytics, "onboarding_started");
};

export const trackOnboardingCompleted = () => {
  logEvent(analytics, "onboarding_completed");
};

export const trackTutorialStarted = (tutorialName) => {
  logEvent(analytics, "tutorial_started", {
    tutorial_name: tutorialName,
  });
};

export const trackTutorialCompleted = (tutorialName) => {
  logEvent(analytics, "tutorial_completed", {
    tutorial_name: tutorialName,
  });
};

export const trackFirstCycleCreated = () => {
  logEvent(analytics, "first_cycle_created");
};

export const trackFirstWorkoutCompleted = () => {
  logEvent(analytics, "first_workout_completed");
};

// ============================================================
// SHARE & SOCIAL EVENTS
// ============================================================

export const trackAppShared = (method) => {
  logEvent(analytics, "share_app", {
    method, // "whatsapp", "twitter", "copy_link", etc
  });
};

export const trackInviteSent = () => {
  logEvent(analytics, "invite_sent");
};

// ============================================================
// ERROR & PERFORMANCE EVENTS
// ============================================================

export const trackError = (errorData) => {
  logEvent(analytics, "app_error", {
    error_message: errorData.message,
    error_location: errorData.location,
    error_type: errorData.type || "unknown",
  });
};

export const trackPerformance = (actionName, durationMs) => {
  logEvent(analytics, "performance_metric", {
    action_name: actionName,
    duration_ms: durationMs,
  });
};

// ============================================================
// CUSTOM EVENTS - Adicione seus próprios aqui
// ============================================================

export const trackCustomEvent = (eventName, params = {}) => {
  logEvent(analytics, eventName, params);
};

// ============================================================
// EXPORT DEFAULT
// ============================================================

export default analytics;
