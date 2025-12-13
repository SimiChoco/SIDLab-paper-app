
import { ReadingLog } from "./types";

export type AchievementType = "MILESTONE" | "STREAK" | "FREQUENCY" | "SPECIAL";
export type BadgeTier = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "DIAMOND";

export interface Achievement {
    id: string;
    title: string;
    description: string;
    type: AchievementType;
    tier: BadgeTier;
    condition: (logs: ReadingLog[], totalPages: number) => boolean;
    icon?: string;
}

export const ACHIEVEMENTS: Achievement[] = [
    // --- Milestones (Page Count) ---
    { id: "page_1", title: "はじめの一歩", description: "記念すべき最初の1ページ", type: "MILESTONE", tier: "BRONZE", condition: (_, total) => total >= 1, icon: "🐣" },
    { id: "page_2", title: "継続の兆し", description: "2ページ達成", type: "MILESTONE", tier: "BRONZE", condition: (_, total) => total >= 2, icon: "🌱" },
    { id: "page_3", title: "三日坊主脱出", description: "3ページ達成", type: "MILESTONE", tier: "BRONZE", condition: (_, total) => total >= 3, icon: "🚶" },
    { id: "page_5", title: "小慣れてきた", description: "5ページ達成", type: "MILESTONE", tier: "BRONZE", condition: (_, total) => total >= 5, icon: "🏃" },
    { id: "page_7", title: "ラッキー7", description: "7ページ達成", type: "MILESTONE", tier: "SILVER", condition: (_, total) => total >= 7, icon: "🎰" },
    { id: "page_10", title: "二桁の壁", description: "10ページ達成", type: "MILESTONE", tier: "SILVER", condition: (_, total) => total >= 10, icon: "📜" },
    { id: "page_15", title: "研究者見習い", description: "15ページ達成", type: "MILESTONE", tier: "GOLD", condition: (_, total) => total >= 15, icon: "🎓" },
    { id: "page_20", title: "執筆の鬼", description: "20ページ達成", type: "MILESTONE", tier: "GOLD", condition: (_, total) => total >= 20, icon: "👹" },
    { id: "page_30", title: "熟練の書き手", description: "30ページ達成", type: "MILESTONE", tier: "PLATINUM", condition: (_, total) => total >= 30, icon: "✒️" },
    { id: "page_40", title: "論文の匠", description: "40ページ達成 (Epic)", type: "MILESTONE", tier: "PLATINUM", condition: (_, total) => total >= 40, icon: "🧘" },
    { id: "page_50", title: "レジェンド", description: "50ページ達成 (Legendary)", type: "MILESTONE", tier: "DIAMOND", condition: (_, total) => total >= 50, icon: "👑" },

    // --- Frequency (Log Count) ---
    { id: "freq_1", title: "初記録", description: "初めて進捗を記録した", type: "FREQUENCY", tier: "BRONZE", condition: (logs) => logs.length >= 1, icon: "📝" },
    { id: "freq_5", title: "習慣化の第一歩", description: "5回記録した", type: "FREQUENCY", tier: "BRONZE", condition: (logs) => logs.length >= 5, icon: "📅" },
    { id: "freq_10", title: "見慣れた光景", description: "10回記録した", type: "FREQUENCY", tier: "SILVER", condition: (logs) => logs.length >= 10, icon: "👀" },
    { id: "freq_50", title: "記録マニア", description: "50回記録した", type: "FREQUENCY", tier: "GOLD", condition: (logs) => logs.length >= 50, icon: "📚" },

    // --- Special (Time & Speed) ---
    {
        id: "midnight_philosopher",
        title: "真夜中の哲学者",
        description: "深夜2時〜4時に執筆した",
        type: "SPECIAL",
        tier: "SILVER",
        condition: (logs) => logs.some(log => {
            const h = log.createdAt.getHours();
            return h >= 2 && h < 4;
        }),
        icon: "🦉"
    },
    {
        id: "early_bird",
        title: "早起きは三文の徳",
        description: "朝5時〜8時に執筆した",
        type: "SPECIAL",
        tier: "SILVER",
        condition: (logs) => logs.some(log => {
            const h = log.createdAt.getHours();
            return h >= 5 && h < 8;
        }),
        icon: "🐔"
    },
    {
        id: "unstoppable",
        title: "筆が止まらない",
        description: "1日で5ページ以上進捗した",
        type: "SPECIAL",
        tier: "GOLD",
        condition: (logs) => {
            // Check if any single log entry has increment >= 5
            // But wait, logs store "total pages at that time", not increment.
            // We need to compare with previous log or store diff. 
            // In db.ts, `updateReadingLog` calculates diff, but `addReadingLog` just stores absolute current total.
            // However, `addReadingLog` is called with `currentTotalPages`. 
            // WE NEED TO FIND THE INCREMENT.
            // Since we receive all logs for a user, we can sort them and check diffs.
            if (logs.length < 2) return false;
            const sortedLogs = [...logs].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
            
            // Initial check: if first log is >= 5, that counts (assuming started from 0)
            if (sortedLogs[0].pages >= 5) return true;

            for (let i = 1; i < sortedLogs.length; i++) {
                const diff = sortedLogs[i].pages - sortedLogs[i - 1].pages;
                if (diff >= 5) return true;
            }
            return false;
        },
        icon: "🚀"
    },
    {
        id: "page_decrease_1",
        title: "後退の味",
        description: "ページ数が減少した",
        type: "SPECIAL",
        tier: "BRONZE",
        condition: (logs) => {
            if (logs.length < 2) return false;
            const sortedLogs = [...logs].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
            for (let i = 1; i < sortedLogs.length; i++) {
                if (sortedLogs[i].pages < sortedLogs[i - 1].pages) {
                    return true;
                }
            }
            return false;
        },
        icon: "🥀"
    },
];

// Separate Streaks as they need more complex calculation logic involving dates
export const STREAK_ACHIEVEMENTS: Achievement[] = [
    { id: "streak_2", title: "連日執筆", description: "2日連続で記録", type: "STREAK", tier: "BRONZE", condition: () => false, icon: "🔥" }, // Verified in calc
    { id: "streak_3", title: "三日坊主卒業", description: "3日連続で記録", type: "STREAK", tier: "BRONZE", condition: () => false, icon: "🕊️" },
    { id: "streak_5", title: "平日制覇？", description: "5日連続で記録", type: "STREAK", tier: "SILVER", condition: () => false, icon: "🖐️" },
    { id: "streak_7", title: "週間MVP", description: "1週間連続で記録", type: "STREAK", tier: "GOLD", condition: () => false, icon: "📅" },
    { id: "streak_14", title: "2週間継続", description: "2週間連続で記録", type: "STREAK", tier: "PLATINUM", condition: () => false, icon: "⚔️" },
    { id: "streak_30", title: "月間レジェンド", description: "30日連続で記録", type: "STREAK", tier: "DIAMOND", condition: () => false, icon: "🌌" },
];

export function calculateAchievements(logs: ReadingLog[], totalPages: number): {
    unlockedIds: string[];
    recentUnlock?: Achievement; // The most interesting recent one
} {
    const unlockedIds: string[] = [];

    // 1. Basic Checks
    ACHIEVEMENTS.forEach(ach => {
        if (ach.condition(logs, totalPages)) {
            unlockedIds.push(ach.id);
        }
    });

    // 2. Streak Calculation
    if (logs.length > 0) {
        const sortedLogs = [...logs].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        // Extract unique days (YYYY-MM-DD)
        const days = Array.from(new Set(sortedLogs.map(l => l.createdAt.toISOString().split('T')[0]))).sort();
        
        let maxStreak = 0;
        let currentStreak = 0;
        let prevDate: Date | null = null;

        days.forEach(dayStr => {
            const currentDate = new Date(dayStr);
            if (!prevDate) {
                currentStreak = 1;
            } else {
                const diffTime = Math.abs(currentDate.getTime() - prevDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                
                if (diffDays === 1) {
                    currentStreak++;
                } else {
                    currentStreak = 1;
                }
            }
            if (currentStreak > maxStreak) maxStreak = currentStreak;
            prevDate = currentDate;
        });

        // Check Streak Achievements
        if (maxStreak >= 2) unlockedIds.push("streak_2");
        if (maxStreak >= 3) unlockedIds.push("streak_3");
        if (maxStreak >= 5) unlockedIds.push("streak_5");
        if (maxStreak >= 7) unlockedIds.push("streak_7");
        if (maxStreak >= 14) unlockedIds.push("streak_14");
        if (maxStreak >= 30) unlockedIds.push("streak_30");
    }

    return { unlockedIds };
}

export function getAchievementById(id: string): Achievement | undefined {
    return [...ACHIEVEMENTS, ...STREAK_ACHIEVEMENTS].find(a => a.id === id);
}

export function getAllAchievements(): Achievement[] {
    return [...ACHIEVEMENTS, ...STREAK_ACHIEVEMENTS];
}
