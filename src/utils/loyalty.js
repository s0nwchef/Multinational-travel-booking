export const LOYALTY_TIERS = [
  {
    name: "Bronze",
    points: 0,
    cardClass: "bg-gradient-to-r from-orange-100 to-amber-100 text-orange-900 border-orange-200",
    progressClass: "bg-orange-400",
  },
  {
    name: "Silver",
    points: 500,
    cardClass: "bg-gradient-to-r from-slate-100 to-zinc-100 text-slate-800 border-slate-200",
    progressClass: "bg-slate-400",
  },
  {
    name: "Gold",
    points: 1000,
    cardClass: "bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-900 border-yellow-200",
    progressClass: "bg-amber-400",
  },
  {
    name: "Platium",
    points: 1500,
    cardClass: "bg-gradient-to-r from-cyan-100 to-sky-100 text-sky-900 border-cyan-200",
    progressClass: "bg-sky-400",
  },
  {
    name: "Diamond",
    points: 2000,
    cardClass: "bg-gradient-to-r from-violet-100 to-fuchsia-100 text-violet-900 border-violet-200",
    progressClass: "bg-violet-400",
  },
];

export function getLoyaltyStatus(rawPoints = 1) {
  const points = Math.max(
    Number.isFinite(Number(rawPoints)) ? Number(rawPoints) : 1,
    1,
  );
  const currentIndex = LOYALTY_TIERS.reduce((bestIndex, tier, index) => {
    return points >= tier.points ? index : bestIndex;
  }, 0);
  const currentTier = LOYALTY_TIERS[currentIndex];
  const nextTier = LOYALTY_TIERS[currentIndex + 1] || null;
  const pointsToNextTier = nextTier
    ? Math.max(nextTier.points - points, 0)
    : 0;
  const progressStart = currentTier.points;
  const progressEnd = nextTier?.points || currentTier.points;
  const progressRange = Math.max(progressEnd - progressStart, 1);
  const progressPercent = nextTier
    ? Math.min(((points - progressStart) / progressRange) * 100, 100)
    : 100;

  return {
    points,
    currentTier,
    currentTierName: currentTier.name,
    nextTier,
    nextTierName: nextTier?.name || "Max level",
    pointsToNextTier,
    progressPercent,
  };
}

export function formatPoints(points = 1) {
  return Number(points || 0).toLocaleString("en-US");
}
