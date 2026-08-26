// =====================================================
// ACHIEVEMENT / FANTASY POINT LEVEL SYSTEM
// =====================================================

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
