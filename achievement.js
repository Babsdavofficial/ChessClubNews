/* =====================================================
   ACHIEVEMENT ENGINE
   Chess News Hub
===================================================== */


/* =====================================================
   ACHIEVEMENT LEVEL
   Used for Fantasy Point player levels
===================================================== */

export function getAchievementLevel(points) {
  points = Number(points) || 0;

  if (points >= 4100) {
    return {
      level: 15,
      name: "Legendary",
      icon: "👑",
      className: "league-legendary"
    };
  }

  if (points >= 3800) {
    return {
      level: 14,
      name: "Immortal",
      icon: "🌟",
      className: "league-immortal"
    };
  }

  if (points >= 3500) {
    return {
      level: 13,
      name: "Champion",
      icon: "⚡",
      className: "league-champion"
    };
  }

  if (points >= 3200) {
    return {
      level: 12,
      name: "Grandmaster",
      icon: "🐉",
      className: "league-grandmaster"
    };
  }

  if (points >= 2900) {
    return {
      level: 11,
      name: "Master",
      icon: "👑",
      className: "league-master"
    };
  }

  if (points >= 2600) {
    return {
      level: 10,
      name: "Elite",
      icon: "🔥",
      className: "league-elite"
    };
  }

  if (points >= 2300) {
    return {
      level: 9,
      name: "Diamond",
      icon: "💎",
      className: "league-diamond"
    };
  }

  if (points >= 2000) {
    return {
      level: 8,
      name: "Platinum",
      icon: "💠",
      className: "league-platinum"
    };
  }

  if (points >= 1700) {
    return {
      level: 7,
      name: "Gold",
      icon: "🥇",
      className: "league-gold"
    };
  }

  if (points >= 1400) {
    return {
      level: 6,
      name: "Hunter",
      icon: "🏹",
      className: "league-hunter"
    };
  }

  if (points >= 1100) {
    return {
      level: 5,
      name: "Silver",
      icon: "🥈",
      className: "league-silver"
    };
  }

  if (points >= 800) {
    return {
      level: 4,
      name: "Iron",
      icon: "⚔️",
      className: "league-iron"
    };
  }

  if (points >= 500) {
    return {
      level: 3,
      name: "Bronze",
      icon: "🥉",
      className: "league-bronze"
    };
  }

  if (points >= 200) {
    return {
      level: 2,
      name: "Stone",
      icon: "🪨",
      className: "league-stone"
    };
  }

  return {
    level: 1,
    name: "Wood",
    icon: "🪵",
    className: "league-wood"
  };
}


/* =====================================================
   DEFAULT / PERMANENT ACHIEVEMENTS
===================================================== */

export const DEFAULT_ACHIEVEMENTS = [

  /* ---------------------------------------------------
     FANTASY POINTS
  --------------------------------------------------- */

  {
    id: "fp_200",
    type: "default",
    category: "fantasyPoints",
    name: "Stone Climber",
    icon: "🪨",
    description: "Reach 200 Fantasy Points.",
    requirement: "200 FP",
    field: "fantasyPoints",
    threshold: 200
  },

  {
    id: "fp_500",
    type: "default",
    category: "fantasyPoints",
    name: "Bronze Fighter",
    icon: "🥉",
    description: "Reach 500 Fantasy Points.",
    requirement: "500 FP",
    field: "fantasyPoints",
    threshold: 500
  },

  {
    id: "fp_800",
    type: "default",
    category: "fantasyPoints",
    name: "Iron Warrior",
    icon: "⚔️",
    description: "Reach 800 Fantasy Points.",
    requirement: "800 FP",
    field: "fantasyPoints",
    threshold: 800
  },

  {
    id: "fp_1100",
    type: "default",
    category: "fantasyPoints",
    name: "Silver Player",
    icon: "🥈",
    description: "Reach 1,100 Fantasy Points.",
    requirement: "1,100 FP",
    field: "fantasyPoints",
    threshold: 1100
  },

  {
    id: "fp_1400",
    type: "default",
    category: "fantasyPoints",
    name: "Hunter",
    icon: "🏹",
    description: "Reach 1,400 Fantasy Points.",
    requirement: "1,400 FP",
    field: "fantasyPoints",
    threshold: 1400
  },

  {
    id: "fp_1700",
    type: "default",
    category: "fantasyPoints",
    name: "Gold Player",
    icon: "🥇",
    description: "Reach 1,700 Fantasy Points.",
    requirement: "1,700 FP",
    field: "fantasyPoints",
    threshold: 1700
  },

  {
    id: "fp_2000",
    type: "default",
    category: "fantasyPoints",
    name: "Platinum Player",
    icon: "💠",
    description: "Reach 2,000 Fantasy Points.",
    requirement: "2,000 FP",
    field: "fantasyPoints",
    threshold: 2000
  },

  {
    id: "fp_2300",
    type: "default",
    category: "fantasyPoints",
    name: "Diamond Player",
    icon: "💎",
    description: "Reach 2,300 Fantasy Points.",
    requirement: "2,300 FP",
    field: "fantasyPoints",
    threshold: 2300
  },

  {
    id: "fp_2600",
    type: "default",
    category: "fantasyPoints",
    name: "Elite Player",
    icon: "🔥",
    description: "Reach 2,600 Fantasy Points.",
    requirement: "2,600 FP",
    field: "fantasyPoints",
    threshold: 2600
  },

  {
    id: "fp_2900",
    type: "default",
    category: "fantasyPoints",
    name: "Master Player",
    icon: "👑",
    description: "Reach 2,900 Fantasy Points.",
    requirement: "2,900 FP",
    field: "fantasyPoints",
    threshold: 2900
  },

  {
    id: "fp_3200",
    type: "default",
    category: "fantasyPoints",
    name: "Grandmaster",
    icon: "🐉",
    description: "Reach 3,200 Fantasy Points.",
    requirement: "3,200 FP",
    field: "fantasyPoints",
    threshold: 3200
  },

  {
    id: "fp_3500",
    type: "default",
    category: "fantasyPoints",
    name: "Champion",
    icon: "⚡",
    description: "Reach 3,500 Fantasy Points.",
    requirement: "3,500 FP",
    field: "fantasyPoints",
    threshold: 3500
  },

  {
    id: "fp_3800",
    type: "default",
    category: "fantasyPoints",
    name: "Immortal",
    icon: "🌟",
    description: "Reach 3,800 Fantasy Points.",
    requirement: "3,800 FP",
    field: "fantasyPoints",
    threshold: 3800
  },

  {
    id: "fp_4100",
    type: "default",
    category: "fantasyPoints",
    name: "Legendary",
    icon: "👑",
    description: "Reach 4,100 Fantasy Points.",
    requirement: "4,100 FP",
    field: "fantasyPoints",
    threshold: 4100
  },


  /* ---------------------------------------------------
     TRIVIA
  --------------------------------------------------- */

  {
    id: "trivia_1",
    type: "default",
    category: "trivia",
    name: "First Answer",
    icon: "🧠",
    description: "Answer your first trivia question correctly.",
    requirement: "1 correct answer",
    field: "triviaCorrect",
    threshold: 1
  },

  {
    id: "trivia_10",
    type: "default",
    category: "trivia",
    name: "Trivia Student",
    icon: "📚",
    description: "Answer 10 trivia questions correctly.",
    requirement: "10 correct answers",
    field: "triviaCorrect",
    threshold: 10
  },

  {
    id: "trivia_25",
    type: "default",
    category: "trivia",
    name: "Trivia Solver",
    icon: "🧩",
    description: "Answer 25 trivia questions correctly.",
    requirement: "25 correct answers",
    field: "triviaCorrect",
    threshold: 25
  },

  {
    id: "trivia_50",
    type: "default",
    category: "trivia",
    name: "Trivia Expert",
    icon: "🎓",
    description: "Answer 50 trivia questions correctly.",
    requirement: "50 correct answers",
    field: "triviaCorrect",
    threshold: 50
  },

  {
    id: "trivia_100",
    type: "default",
    category: "trivia",
    name: "Trivia Master",
    icon: "🏆",
    description: "Answer 100 trivia questions correctly.",
    requirement: "100 correct answers",
    field: "triviaCorrect",
    threshold: 100
  },

  {
    id: "trivia_250",
    type: "default",
    category: "trivia",
    name: "Trivia Champion",
    icon: "👑",
    description: "Answer 250 trivia questions correctly.",
    requirement: "250 correct answers",
    field: "triviaCorrect",
    threshold: 250
  },

  {
    id: "trivia_500",
    type: "default",
    category: "trivia",
    name: "Trivia Legend",
    icon: "🌟",
    description: "Answer 500 trivia questions correctly.",
    requirement: "500 correct answers",
    field: "triviaCorrect",
    threshold: 500
  },

  {
    id: "trivia_1000",
    type: "default",
    category: "trivia",
    name: "Trivia Genius",
    icon: "🧠",
    description: "Answer 1,000 trivia questions correctly.",
    requirement: "1,000 correct answers",
    field: "triviaCorrect",
    threshold: 1000
  },


  /* ---------------------------------------------------
     PREDICTIONS
  --------------------------------------------------- */

  {
    id: "prediction_1",
    type: "default",
    category: "prediction",
    name: "First Prediction",
    icon: "🎯",
    description: "Get your first prediction correct.",
    requirement: "1 correct prediction",
    field: "predictionScore",
    threshold: 1
  },

  {
    id: "prediction_10",
    type: "default",
    category: "prediction",
    name: "Predictor",
    icon: "🎯",
    description: "Get 10 predictions correct.",
    requirement: "10 correct predictions",
    field: "predictionScore",
    threshold: 10
  },

  {
    id: "prediction_25",
    type: "default",
    category: "prediction",
    name: "Sharp Eye",
    icon: "👁️",
    description: "Get 25 predictions correct.",
    requirement: "25 correct predictions",
    field: "predictionScore",
    threshold: 25
  },

  {
    id: "prediction_50",
    type: "default",
    category: "prediction",
    name: "Accurate Predictor",
    icon: "🎯",
    description: "Get 50 predictions correct.",
    requirement: "50 correct predictions",
    field: "predictionScore",
    threshold: 50
  },

  {
    id: "prediction_100",
    type: "default",
    category: "prediction",
    name: "Prediction Expert",
    icon: "🔮",
    description: "Get 100 predictions correct.",
    requirement: "100 correct predictions",
    field: "predictionScore",
    threshold: 100
  },

  {
    id: "prediction_250",
    type: "default",
    category: "prediction",
    name: "Prediction Master",
    icon: "🏆",
    description: "Get 250 predictions correct.",
    requirement: "250 correct predictions",
    field: "predictionScore",
    threshold: 250
  },

  {
    id: "prediction_500",
    type: "default",
    category: "prediction",
    name: "Prediction Champion",
    icon: "👑",
    description: "Get 500 predictions correct.",
    requirement: "500 correct predictions",
    field: "predictionScore",
    threshold: 500
  },

  {
    id: "prediction_1000",
    type: "default",
    category: "prediction",
    name: "Prediction Legend",
    icon: "🌟",
    description: "Get 1,000 predictions correct.",
    requirement: "1,000 correct predictions",
    field: "predictionScore",
    threshold: 1000
  },


  /* ---------------------------------------------------
     STREAK
  --------------------------------------------------- */

  {
    id: "streak_1",
    type: "default",
    category: "streak",
    name: "First Spark",
    icon: "🔥",
    description: "Complete activity for 1 day.",
    requirement: "1-day streak",
    field: "highestStreak",
    threshold: 1
  },

  {
    id: "streak_3",
    type: "default",
    category: "streak",
    name: "Getting Started",
    icon: "🔥",
    description: "Maintain a 3-day activity streak.",
    requirement: "3-day streak",
    field: "highestStreak",
    threshold: 3
  },

  {
    id: "streak_7",
    type: "default",
    category: "streak",
    name: "On Fire",
    icon: "🔥",
    description: "Maintain a 7-day activity streak.",
    requirement: "7-day streak",
    field: "highestStreak",
    threshold: 7
  },

  {
    id: "streak_10",
    type: "default",
    category: "streak",
    name: "Dedicated",
    icon: "🔥",
    description: "Maintain a 10-day activity streak.",
    requirement: "10-day streak",
    field: "highestStreak",
    threshold: 10
  },

  {
    id: "streak_30",
    type: "default",
    category: "streak",
    name: "Consistent",
    icon: "🔥",
    description: "Maintain a 30-day activity streak.",
    requirement: "30-day streak",
    field: "highestStreak",
    threshold: 30
  },

  {
    id: "streak_50",
    type: "default",
    category: "streak",
    name: "Unstoppable",
    icon: "⚡",
    description: "Maintain a 50-day activity streak.",
    requirement: "50-day streak",
    field: "highestStreak",
    threshold: 50
  },

  {
    id: "streak_100",
    type: "default",
    category: "streak",
    name: "Elite Streak",
    icon: "👑",
    description: "Maintain a 100-day activity streak.",
    requirement: "100-day streak",
    field: "highestStreak",
    threshold: 100
  },

  {
    id: "streak_365",
    type: "default",
    category: "streak",
    name: "Legendary Streak",
    icon: "🌟",
    description: "Maintain a 365-day activity streak.",
    requirement: "365-day streak",
    field: "highestStreak",
    threshold: 365
  }

];


/* =====================================================
   CHECK WHICH DEFAULT ACHIEVEMENTS ARE EARNED
===================================================== */

export function getEligibleDefaultAchievements(userData = {}) {

  return DEFAULT_ACHIEVEMENTS.filter(achievement => {

    const value =
      Number(userData[achievement.field]) || 0;

    return value >= achievement.threshold;

  });

}


/* =====================================================
   FIRESTORE IMPORTS
   Loaded here because achievement.js
   also handles permanent badge storage.
===================================================== */

import {
  collection,
  doc,
  getDocs,
  setDoc,
  writeBatch,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { db } from "./firebase.js";


/* =====================================================
   AWARD ONE ACHIEVEMENT
===================================================== */

export async function awardAchievement(
  uid,
  achievement,
  extraData = {}
) {

  if (!uid || !achievement) {
    return;
  }

  try {

    const achievementRef =
      doc(
        db,
        "users",
        uid,
        "achievements",
        achievement.id
      );

    await setDoc(
      achievementRef,
      {
        achievementId: achievement.id,

        type:
          achievement.type || "custom",

        category:
          achievement.category || "custom",

        name:
          achievement.name || "Achievement",

        icon:
          achievement.icon || "🏅",

        description:
          achievement.description || "",

        requirement:
          achievement.requirement || "",

        earnedAt:
          serverTimestamp(),

        ...extraData
      },
      {
        merge: true
      }
    );

    console.log(
      `🏅 Achievement earned: ${achievement.name}`
    );

  } catch (error) {

    console.error(
      "Error awarding achievement:",
      error
    );

  }

}


/* =====================================================
   SYNC DEFAULT ACHIEVEMENTS
   Automatically gives users every milestone
   they have already reached.

   Example:
   If someone already has 600 FP,
   they receive both:
   - Stone Climber
   - Bronze Fighter

   They do not have to earn them again.
===================================================== */

export async function syncDefaultAchievements(
  uid,
  userData = {}
) {

  if (!uid) {
    return [];
  }

  try {

    const eligible =
      getEligibleDefaultAchievements(userData);

    if (eligible.length === 0) {
      return [];
    }


    /* -----------------------------------------------
       Get achievements the player already owns
    ------------------------------------------------ */

    const achievementsSnapshot =
      await getDocs(
        collection(
          db,
          "users",
          uid,
          "achievements"
        )
      );

    const existingIds = new Set();

    achievementsSnapshot.forEach(snapshot => {
      existingIds.add(snapshot.id);
    });


    /* -----------------------------------------------
       Only create missing achievements
    ------------------------------------------------ */

    const missing =
      eligible.filter(
        achievement =>
          !existingIds.has(achievement.id)
      );


    if (missing.length === 0) {
      return eligible;
    }


    /* -----------------------------------------------
       Save all missing achievements together
    ------------------------------------------------ */

    const batch = writeBatch(db);

    missing.forEach(achievement => {

      const achievementRef =
        doc(
          db,
          "users",
          uid,
          "achievements",
          achievement.id
        );

      batch.set(
        achievementRef,
        {
          achievementId: achievement.id,

          type: achievement.type,

          category: achievement.category,

          name: achievement.name,

          icon: achievement.icon,

          description: achievement.description,

          requirement: achievement.requirement,

          earnedAt: serverTimestamp()
        }
      );

    });

    await batch.commit();


    console.log(
      `🏅 ${missing.length} new achievement(s) awarded.`
    );

    return eligible;

  } catch (error) {

    console.error(
      "Error syncing achievements:",
      error
    );

    return [];

  }

}


/* =====================================================
   LOAD PLAYER ACHIEVEMENTS
===================================================== */

export async function getUserAchievements(uid) {

  if (!uid) {
    return [];
  }

  try {

    const snapshot =
      await getDocs(
        collection(
          db,
          "users",
          uid,
          "achievements"
        )
      );

    const achievements = [];

    snapshot.forEach(docSnap => {

      achievements.push({
        id: docSnap.id,
        ...docSnap.data()
      });

    });

    return achievements;

  } catch (error) {

    console.error(
      "Error loading user achievements:",
      error
    );

    return [];

  }

}


/* =====================================================
   EVENT ACHIEVEMENT
   Reserved for future events.

   Example:
   Fantasy Team Participant
   Fantasy Champion
   Puzzle Event Winner
===================================================== */

export async function awardEventAchievement(
  uid,
  achievementId,
  data = {}
) {

  if (!uid || !achievementId) {
    return;
  }

  const achievement = {
    id: achievementId,

    type: "event",

    category:
      data.category || "event",

    name:
      data.name || "Event Achievement",

    icon:
      data.icon || "🏆",

    description:
      data.description || "",

    requirement:
      data.requirement || ""
  };

  await awardAchievement(
    uid,
    achievement,
    {
      eventId:
        data.eventId || "",

      eventName:
        data.eventName || ""
    }
  );

}


/* =====================================================
   CUSTOM / ADMIN ACHIEVEMENT
   Reserved for future manual awards.
===================================================== */

export async function awardCustomAchievement(
  uid,
  achievementId,
  data = {}
) {

  if (!uid || !achievementId) {
    return;
  }

  const achievement = {
    id: achievementId,

    type: "custom",

    category:
      data.category || "custom",

    name:
      data.name || "Special Achievement",

    icon:
      data.icon || "🏅",

    description:
      data.description || "",

    requirement:
      data.requirement || ""
  };

  await awardAchievement(
    uid,
    achievement
  );

}


// =====================================================
// FANTASY TEAM PARTICIPATION ACHIEVEMENTS
// =====================================================

export const FANTASY_PARTICIPATION_ACHIEVEMENTS = [

  {
    id: "fantasy_1",
    name: "Fantasy Participant ×1",
    icon: "🏆",
    description: "Submitted your first Fantasy Team.",
    type: "event",
    category: "fantasy",
    requirement: 1
  },

  {
    id: "fantasy_5",
    name: "Fantasy Participant ×5",
    icon: "🏆",
    description: "Submitted Fantasy Teams in 5 events.",
    type: "event",
    category: "fantasy",
    requirement: 5
  },

  {
    id: "fantasy_10",
    name: "Fantasy Participant ×10",
    icon: "🏆",
    description: "Submitted Fantasy Teams in 10 events.",
    type: "event",
    category: "fantasy",
    requirement: 10
  },

  {
    id: "fantasy_15",
    name: "Fantasy Participant ×15",
    icon: "🏆",
    description: "Submitted Fantasy Teams in 15 events.",
    type: "event",
    category: "fantasy",
    requirement: 15
  },

  {
    id: "fantasy_20",
    name: "Fantasy Participant ×20",
    icon: "🏆",
    description: "Submitted Fantasy Teams in 20 events.",
    type: "event",
    category: "fantasy",
    requirement: 20
  },

  {
    id: "fantasy_25",
    name: "Fantasy Participant ×25",
    icon: "🏆",
    description: "Submitted Fantasy Teams in 25 events.",
    type: "event",
    category: "fantasy",
    requirement: 25
  },

  {
    id: "fantasy_50",
    name: "Fantasy Participant ×50",
    icon: "🏆",
    description: "Submitted Fantasy Teams in 50 events.",
    type: "event",
    category: "fantasy",
    requirement: 50
  },

  {
    id: "fantasy_100",
    name: "Fantasy Participant ×100",
    icon: "👑",
    description: "Submitted Fantasy Teams in 100 events.",
    type: "event",
    category: "fantasy",
    requirement: 100
  }

];
