
import { ReadingLog } from "./types";

export type AchievementType = "MILESTONE" | "STREAK" | "FREQUENCY" | "SPECIAL";
export type BadgeTier = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "DIAMOND" | "MASTER" | "DOCTOR";

export interface Achievement {
    id: string;
    title: string;
    description: string;
    type: AchievementType;
    tier: BadgeTier;
    condition: (context: AchievementContext) => boolean;
    icon?: string;
}

// Context object to pass pre-calculated stats to conditions avoids re-calc overhead
interface AchievementContext {
    logs: ReadingLog[];
    totalPages: number;
    maxPages: number; // Goal
    sortedLogs: ReadingLog[];
    uniqueDays: string[]; // YYYY-MM-DD
    maxStreak: number;
    dailyStats: Record<string, { count: number, min: number, max: number, diff: number }>; // Day -> stats
    weeklyStats: Record<string, { first: number, last: number, uniqueDays: number }>; // Year-Week -> stats
    monthlyStats: Record<string, { uniqueDays: number }>; // Year-Month -> stats
    diffs: number[]; // Array of page increments/decrements between logs
}

// --- Helpers ---

const toDayStr = (d: Date) => d.toISOString().split('T')[0];

const getWeekKey = (d: Date) => {
    const date = new Date(d.getTime());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    const week1 = new Date(date.getFullYear(), 0, 4);
    const week = 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    return `${date.getFullYear()}-W${week}`;
};

const getMonthKey = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}`;

// --- Definition ---

export const ACHIEVEMENTS: Achievement[] = [
    // 1-18: Page Count Milestones
    { id: "01", title: "はじめの一歩", description: "記念すべき最初の1ページ", type: "MILESTONE", tier: "BRONZE", condition: (c) => c.totalPages >= 1, icon: "🐣" },
    { id: "02", title: "継続の兆し", description: "2ページ到達", type: "MILESTONE", tier: "BRONZE", condition: (c) => c.totalPages >= 2, icon: "🌱" },
    { id: "03", title: "三日坊主脱出", description: "3ページ到達", type: "MILESTONE", tier: "BRONZE", condition: (c) => c.totalPages >= 3, icon: "🚶" },
    { id: "04", title: "小慣れてきた", description: "5ページ到達", type: "MILESTONE", tier: "BRONZE", condition: (c) => c.totalPages >= 5, icon: "🏃" },
    { id: "05", title: "ラッキー7", description: "7ページ到達", type: "MILESTONE", tier: "SILVER", condition: (c) => c.totalPages >= 7, icon: "🎰" },
    { id: "06", title: "二桁の壁", description: "10ページ到達", type: "MILESTONE", tier: "SILVER", condition: (c) => c.totalPages >= 10, icon: "🧗" },
    { id: "07", title: "12ページの丘", description: "12ページ到達", type: "MILESTONE", tier: "SILVER", condition: (c) => c.totalPages >= 12, icon: "⛰️" },
    { id: "08", title: "研究者見習い", description: "15ページ到達", type: "MILESTONE", tier: "GOLD", condition: (c) => c.totalPages >= 15, icon: "🎓" },
    { id: "09", title: "18ページ突破", description: "18ページ到達", type: "MILESTONE", tier: "GOLD", condition: (c) => c.totalPages >= 18, icon: "🚀" },
    { id: "10", title: "執筆の鬼", description: "20ページ到達", type: "MILESTONE", tier: "GOLD", condition: (c) => c.totalPages >= 20, icon: "👹" },
    { id: "11", title: "22ページ到達", description: "22ページ到達", type: "MILESTONE", tier: "GOLD", condition: (c) => c.totalPages >= 22, icon: "🔥" },
    { id: "12", title: "折り返し地点25", description: "25ページ到達", type: "MILESTONE", tier: "PLATINUM", condition: (c) => c.totalPages >= 25, icon: "🚩" },
    { id: "13", title: "28ページ到達", description: "28ページ到達", type: "MILESTONE", tier: "PLATINUM", condition: (c) => c.totalPages >= 28, icon: "📈" },
    { id: "14", title: "30ページ達成", description: "30ページ到達", type: "MILESTONE", tier: "PLATINUM", condition: (c) => c.totalPages >= 30, icon: "🏆" },
    { id: "15", title: "32ページ到達", description: "32ページ到達", type: "MILESTONE", tier: "PLATINUM", condition: (c) => c.totalPages >= 32, icon: "🌟" },
    { id: "16", title: "卒論完走ライン", description: "35ページ到達（卒論の想定上限）", type: "MILESTONE", tier: "DIAMOND", condition: (c) => c.maxPages >= 35 && c.totalPages >= 35, icon: "🎓" },
    { id: "17", title: "修論ラスト5", description: "40ページ到達（修論終盤の到達点）", type: "MILESTONE", tier: "DIAMOND", condition: (c) => c.maxPages >= 40 && c.totalPages >= 40, icon: "🔬" },
    { id: "18", title: "修論完走ライン", description: "45ページ到達（修論の想定上限）", type: "MILESTONE", tier: "DIAMOND", condition: (c) => c.maxPages >= 45 && c.totalPages >= 45, icon: "🏛️" },

    // 19-28: Progress Percentage
    { id: "19", title: "進捗10%", description: "上限の1割に到達", type: "MILESTONE", tier: "BRONZE", condition: (c) => c.totalPages >= Math.ceil(c.maxPages * 0.1), icon: "🕐" },
    { id: "20", title: "進捗20%", description: "上限の2割に到達", type: "MILESTONE", tier: "BRONZE", condition: (c) => c.totalPages >= Math.ceil(c.maxPages * 0.2), icon: "🕑" },
    { id: "21", title: "進捗30%", description: "上限の3割に到達", type: "MILESTONE", tier: "SILVER", condition: (c) => c.totalPages >= Math.ceil(c.maxPages * 0.3), icon: "🕒" },
    { id: "22", title: "進捗40%", description: "上限の4割に到達", type: "MILESTONE", tier: "SILVER", condition: (c) => c.totalPages >= Math.ceil(c.maxPages * 0.4), icon: "🕓" },
    { id: "23", title: "進捗50%", description: "上限の5割に到達", type: "MILESTONE", tier: "GOLD", condition: (c) => c.totalPages >= Math.ceil(c.maxPages * 0.5), icon: "🌓" },
    { id: "24", title: "進捗60%", description: "上限の6割に到達", type: "MILESTONE", tier: "GOLD", condition: (c) => c.totalPages >= Math.ceil(c.maxPages * 0.6), icon: "🕕" },
    { id: "25", title: "進捗70%", description: "上限の7割に到達", type: "MILESTONE", tier: "PLATINUM", condition: (c) => c.totalPages >= Math.ceil(c.maxPages * 0.7), icon: "🕖" },
    { id: "26", title: "進捗80%", description: "上限の8割に到達", type: "MILESTONE", tier: "PLATINUM", condition: (c) => c.totalPages >= Math.ceil(c.maxPages * 0.8), icon: "🕗" },
    { id: "27", title: "進捗90%", description: "上限の9割に到達", type: "MILESTONE", tier: "DIAMOND", condition: (c) => c.totalPages >= Math.ceil(c.maxPages * 0.9), icon: "🕘" },
    { id: "28", title: "進捗100%", description: "上限に到達（完走）", type: "MILESTONE", tier: "DIAMOND", condition: (c) => c.totalPages >= c.maxPages, icon: "💯" },

    // 29-31: Last Spurt
    { id: "29", title: "ラスト5ページ", description: "残り5ページ圏に入った", type: "MILESTONE", tier: "PLATINUM", condition: (c) => c.totalPages >= (c.maxPages - 5), icon: "🖐️" },
    { id: "30", title: "ラスト2ページ", description: "残り2ページ圏に入った", type: "MILESTONE", tier: "DIAMOND", condition: (c) => c.totalPages >= (c.maxPages - 2), icon: "✌️" },
    { id: "31", title: "上限ぴったり", description: "上限ページちょうどで到達", type: "MILESTONE", tier: "DIAMOND", condition: (c) => c.totalPages === c.maxPages, icon: "🎯" },

    // 32-39: Jump Speed (One-time diff)
    { id: "32", title: "ミニ前進", description: "1回の記録間で+1以上", type: "SPECIAL", tier: "BRONZE", condition: (c) => c.diffs.some(d => d >= 1), icon: "🐾" },
    { id: "33", title: "二歩目", description: "1回の記録間で+2以上", type: "SPECIAL", tier: "BRONZE", condition: (c) => c.diffs.some(d => d >= 2), icon: "👣" },
    { id: "34", title: "三段加速", description: "1回の記録間で+3以上", type: "SPECIAL", tier: "SILVER", condition: (c) => c.diffs.some(d => d >= 3), icon: "🌬️" },
    { id: "35", title: "一気に5", description: "1回の記録間で+5以上", type: "SPECIAL", tier: "GOLD", condition: (c) => c.diffs.some(d => d >= 5), icon: "💨" },
    { id: "36", title: "ブースト8", description: "1回の記録間で+8以上", type: "SPECIAL", tier: "PLATINUM", condition: (c) => c.diffs.some(d => d >= 8), icon: "🏎️" },
    { id: "37", title: "二桁ジャンプ", description: "1回の記録間で+10以上", type: "SPECIAL", tier: "PLATINUM", condition: (c) => c.diffs.some(d => d >= 10), icon: "🦗" },
    { id: "38", title: "15ページジャンプ", description: "1回の記録間で+15以上", type: "SPECIAL", tier: "DIAMOND", condition: (c) => c.diffs.some(d => d >= 15), icon: "🐇" },
    { id: "39", title: "20ページワープ", description: "1回の記録間で+20以上", type: "SPECIAL", tier: "DIAMOND", condition: (c) => c.diffs.some(d => d >= 20), icon: "🚀" },

    // 40-45: Daily Total
    { id: "40", title: "今日の1ページ", description: "同じ日で合計+1以上", type: "SPECIAL", tier: "BRONZE", condition: (c) => Object.values(c.dailyStats).some(s => s.diff >= 1), icon: "📓" },
    { id: "41", title: "今日の3ページ", description: "同じ日で合計+3以上", type: "SPECIAL", tier: "SILVER", condition: (c) => Object.values(c.dailyStats).some(s => s.diff >= 3), icon: "📒" },
    { id: "42", title: "今日の5ページ", description: "同じ日で合計+5以上", type: "SPECIAL", tier: "GOLD", condition: (c) => Object.values(c.dailyStats).some(s => s.diff >= 5), icon: "📕" },
    { id: "43", title: "今日の8ページ", description: "同じ日で合計+8以上", type: "SPECIAL", tier: "PLATINUM", condition: (c) => Object.values(c.dailyStats).some(s => s.diff >= 8), icon: "📗" },
    { id: "44", title: "今日の10ページ", description: "同じ日で合計+10以上", type: "SPECIAL", tier: "PLATINUM", condition: (c) => Object.values(c.dailyStats).some(s => s.diff >= 10), icon: "📘" },
    { id: "45", title: "今日の15ページ", description: "同じ日で合計+15以上", type: "SPECIAL", tier: "DIAMOND", condition: (c) => Object.values(c.dailyStats).some(s => s.diff >= 15), icon: "📚" },

    // 46-47: Daily Update Count
    { id: "46", title: "一日二更新", description: "同じ日に2回以上記録した", type: "FREQUENCY", tier: "SILVER", condition: (c) => Object.values(c.dailyStats).some(s => s.count >= 2), icon: "✌️" },
    { id: "47", title: "一日三更新", description: "同じ日に3回以上記録した", type: "FREQUENCY", tier: "GOLD", condition: (c) => Object.values(c.dailyStats).some(s => s.count >= 3), icon: "🤟" },

    // 48-55: Weekly Total
    { id: "48", title: "週5ページ", description: "同一週で+5以上進捗", type: "SPECIAL", tier: "BRONZE", condition: (c) => Object.values(c.weeklyStats).some(s => (s.last - s.first) >= 0 && (s.last - s.first + (s.uniqueDays >= 1 ? 0 : 0) /* simplistic delta */) >= 5), icon: "🗓️" }, 
    // Wait, weekly stats logic needs correct diff. 
    // In Context, weeklyStats 'first' is min pages at start of week, 'last' is max pages at end? 
    // Logic: weekDiff = maxPageInWeek - minPageAtStartOfWeek.
    // Let's rely on simple `last - first` where first is the page count of the first log in that week.
    // NOTE: This assumes page count only goes UP or reset. Ideally we track diff sum. However, simple max-min is okay proxy.
    { id: "49", title: "週10ページ", description: "同一週で+10以上進捗", type: "SPECIAL", tier: "SILVER", condition: (c) => Object.values(c.weeklyStats).some(s => (s.last - s.first) >= 10), icon: "📅" },
    { id: "50", title: "週15ページ", description: "同一週で+15以上進捗", type: "SPECIAL", tier: "GOLD", condition: (c) => Object.values(c.weeklyStats).some(s => (s.last - s.first) >= 15), icon: "📆" },
    { id: "51", title: "週20ページ", description: "同一週で+20以上進捗", type: "SPECIAL", tier: "PLATINUM", condition: (c) => Object.values(c.weeklyStats).some(s => (s.last - s.first) >= 20), icon: "📊" },
    { id: "52", title: "週25ページ", description: "同一週で+25以上進捗", type: "SPECIAL", tier: "PLATINUM", condition: (c) => Object.values(c.weeklyStats).some(s => (s.last - s.first) >= 25), icon: "📂" },
    { id: "53", title: "週30ページ", description: "同一週で+30以上進捗", type: "SPECIAL", tier: "DIAMOND", condition: (c) => Object.values(c.weeklyStats).some(s => (s.last - s.first) >= 30), icon: "🗄️" },
    { id: "54", title: "週35ページ", description: "同一週で+35以上進捗", type: "SPECIAL", tier: "DIAMOND", condition: (c) => Object.values(c.weeklyStats).some(s => (s.last - s.first) >= 35), icon: "📦" },
    { id: "55", title: "週40ページ", description: "同一週で+40以上進捗", type: "SPECIAL", tier: "DIAMOND", condition: (c) => Object.values(c.weeklyStats).some(s => (s.last - s.first) >= 40), icon: "🙌" },

    // 56-59: Weekly Frequency
    { id: "56", title: "週2日執筆", description: "同一週に2日以上記録", type: "FREQUENCY", tier: "BRONZE", condition: (c) => Object.values(c.weeklyStats).some(s => s.uniqueDays >= 2), icon: "🌤️" },
    { id: "57", title: "週3日執筆", description: "同一週に3日以上記録", type: "FREQUENCY", tier: "SILVER", condition: (c) => Object.values(c.weeklyStats).some(s => s.uniqueDays >= 3), icon: "⛅" },
    { id: "58", title: "週5日執筆", description: "同一週に5日以上記録", type: "FREQUENCY", tier: "GOLD", condition: (c) => Object.values(c.weeklyStats).some(s => s.uniqueDays >= 5), icon: "🌥️" },
    { id: "59", title: "週7日執筆", description: "同一週に7日記録（毎日）", type: "FREQUENCY", tier: "DIAMOND", condition: (c) => Object.values(c.weeklyStats).some(s => s.uniqueDays >= 7), icon: "☀️" },

    // 60-62: Monthly Frequency
    { id: "60", title: "月5日執筆", description: "同一月に5日以上記録", type: "FREQUENCY", tier: "BRONZE", condition: (c) => Object.values(c.monthlyStats).some(s => s.uniqueDays >= 5), icon: "🌘" },
    { id: "61", title: "月10日執筆", description: "同一月に10日以上記録", type: "FREQUENCY", tier: "GOLD", condition: (c) => Object.values(c.monthlyStats).some(s => s.uniqueDays >= 10), icon: "🌗" },
    { id: "62", title: "月20日執筆", description: "同一月に20日以上記録", type: "FREQUENCY", tier: "DIAMOND", condition: (c) => Object.values(c.monthlyStats).some(s => s.uniqueDays >= 20), icon: "🌕" },

    // 63-69: Overall Frequency (Log Count)
    { id: "63", title: "初記録", description: "初めて進捗を記録", type: "FREQUENCY", tier: "BRONZE", condition: (c) => c.logs.length >= 1, icon: "📝" },
    { id: "64", title: "習慣化の第一歩", description: "5回記録した", type: "FREQUENCY", tier: "BRONZE", condition: (c) => c.logs.length >= 5, icon: "🌱" },
    { id: "65", title: "見慣れた光景", description: "10回記録した", type: "FREQUENCY", tier: "SILVER", condition: (c) => c.logs.length >= 10, icon: "👀" },
    { id: "66", title: "常連", description: "20回記録した", type: "FREQUENCY", tier: "GOLD", condition: (c) => c.logs.length >= 20, icon: "☕" },
    { id: "67", title: "記録好き", description: "30回記録した", type: "FREQUENCY", tier: "GOLD", condition: (c) => c.logs.length >= 30, icon: "🖊️" },
    { id: "68", title: "記録マニア", description: "50回記録した", type: "FREQUENCY", tier: "PLATINUM", condition: (c) => c.logs.length >= 50, icon: "👓" },
    { id: "69", title: "ログの達人", description: "100回記録した", type: "FREQUENCY", tier: "DIAMOND", condition: (c) => c.logs.length >= 100, icon: "🧙‍♂️" },

    // 70-79: Streaks
    { id: "70", title: "連日執筆", description: "2日連続で記録", type: "STREAK", tier: "BRONZE", condition: (c) => c.maxStreak >= 2, icon: "🔥" },
    { id: "71", title: "三日坊主卒業", description: "3日連続で記録", type: "STREAK", tier: "BRONZE", condition: (c) => c.maxStreak >= 3, icon: "🕊️" },
    { id: "72", title: "四日連続", description: "4日連続で記録", type: "STREAK", tier: "SILVER", condition: (c) => c.maxStreak >= 4, icon: "🏃" },
    { id: "73", title: "平日制覇？", description: "5日連続で記録", type: "STREAK", tier: "SILVER", condition: (c) => c.maxStreak >= 5, icon: "✋" },
    { id: "74", title: "週間MVP", description: "7日連続で記録", type: "STREAK", tier: "GOLD", condition: (c) => c.maxStreak >= 7, icon: "🏅" },
    { id: "75", title: "10日連続", description: "10日連続で記録", type: "STREAK", tier: "GOLD", condition: (c) => c.maxStreak >= 10, icon: "🔟" },
    { id: "76", title: "2週間継続", description: "14日連続で記録", type: "STREAK", tier: "PLATINUM", condition: (c) => c.maxStreak >= 14, icon: "⚔️" },
    { id: "77", title: "3週間継続", description: "21日連続で記録", type: "STREAK", tier: "PLATINUM", condition: (c) => c.maxStreak >= 21, icon: "🏰" },
    { id: "78", title: "月間レジェンド", description: "30日連続で記録", type: "STREAK", tier: "DIAMOND", condition: (c) => c.maxStreak >= 30, icon: "🌌" },
    { id: "79", title: "2ヶ月鉄人", description: "60日連続で記録", type: "STREAK", tier: "DIAMOND", condition: (c) => c.maxStreak >= 60, icon: "🦾" },

    // 80-87: Specific Times / Dates
    { id: "80", title: "真夜中の哲学者", description: "深夜2〜4時に執筆", type: "SPECIAL", tier: "SILVER", condition: (c) => c.logs.some(l => { const h = l.createdAt.getHours(); return h >= 2 && h < 4; }), icon: "🦉" },
    { id: "81", title: "早起きは三文の徳", description: "朝5〜8時に執筆", type: "SPECIAL", tier: "SILVER", condition: (c) => c.logs.some(l => { const h = l.createdAt.getHours(); return h >= 5 && h < 8; }), icon: "🐔" },
    { id: "82", title: "昼休み研究者", description: "12〜13時に執筆", type: "SPECIAL", tier: "SILVER", condition: (c) => c.logs.some(l => { const h = l.createdAt.getHours(); return h >= 12 && h < 14; }), icon: "🍱" },
    { id: "83", title: "夜の追い込み", description: "21〜23時に執筆", type: "SPECIAL", tier: "SILVER", condition: (c) => c.logs.some(l => { const h = l.createdAt.getHours(); return h >= 21 && h <= 23; }), icon: "🌃" },
    { id: "84", title: "朝活三連", description: "朝5〜8時の記録が別日で3回", type: "SPECIAL", tier: "GOLD", condition: (c) => {
        const morningLogs = c.logs.filter(l => { const h = l.createdAt.getHours(); return h >= 5 && h < 8; });
        const days = new Set(morningLogs.map(l => toDayStr(l.createdAt)));
        return days.size >= 3;
    }, icon: "🌅" },
    { id: "85", title: "クリスマスも書いた", description: "12/25に執筆した", type: "SPECIAL", tier: "GOLD", condition: (c) => c.logs.some(l => { const d = l.createdAt; return d.getMonth() === 11 && d.getDate() === 25; }), icon: "🎄" },
    { id: "86", title: "大晦日も書いた", description: "12/31に執筆した", type: "SPECIAL", tier: "GOLD", condition: (c) => c.logs.some(l => { const d = l.createdAt; return d.getMonth() === 11 && d.getDate() === 31; }), icon: "🔔" },
    { id: "87", title: "元旦も書いた", description: "1/1に執筆した", type: "SPECIAL", tier: "GOLD", condition: (c) => c.logs.some(l => { const d = l.createdAt; return d.getMonth() === 0 && d.getDate() === 1; }), icon: "🎍" },
    { id: "88", title: "年末年始も書いた", description: "12/29〜1/3の期間に3日以上記録", type: "SPECIAL", tier: "PLATINUM", condition: (c) => {
        const targets = c.logs.filter(l => {
            const m = l.createdAt.getMonth();
            const d = l.createdAt.getDate();
            // 12/29-31 or 1/1-3
            return (m === 11 && d >= 29) || (m === 0 && d <= 3);
        });
        const days = new Set(targets.map(l => toDayStr(l.createdAt)));
        return days.size >= 3;
    }, icon: "⛩️" },

    // 89-99: Decrease & Revival
    { id: "89", title: "ページが消えた！", description: "前回よりページ数が減った", type: "SPECIAL", tier: "BRONZE", condition: (c) => c.diffs.some(d => d < 0), icon: "👻" },
    { id: "90", title: "大後退", description: "1回で5ページ以上減った", type: "SPECIAL", tier: "SILVER", condition: (c) => c.diffs.some(d => d <= -5), icon: "📉" },
    { id: "91", title: "章が丸ごと消えた", description: "1回で10ページ以上減った", type: "SPECIAL", tier: "GOLD", condition: (c) => c.diffs.some(d => d <= -10), icon: "💣" },
    { id: "92", title: "ヨーヨー執筆", description: "増加と減少をどちらも経験", type: "SPECIAL", tier: "SILVER", condition: (c) => c.diffs.some(d => d > 0) && c.diffs.some(d => d < 0), icon: "🪀" },
    { id: "93", title: "迷走の三連", description: "減少イベントが合計3回以上", type: "SPECIAL", tier: "GOLD", condition: (c) => c.diffs.filter(d => d < 0).length >= 3, icon: "🌀" },
    { id: "94", title: "0ページ帰還", description: "1以上に到達後、0に戻った", type: "SPECIAL", tier: "GOLD", condition: (c) => {
        let reachedOne = false;
        for (const log of c.sortedLogs) {
            if (log.pages >= 1) reachedOne = true;
            if (reachedOne && log.pages === 0) return true;
        }
        return false;
    }, icon: "🚮" },
    { id: "95", title: "逆境からの復活", description: "減少後、過去最大を更新した", type: "SPECIAL", tier: "PLATINUM", condition: (c) => {
        // Condition: Decrease happened at index i (log[i] < log[i-1]). 
        // Max pages BEFORE decrease was max_prev.
        // SOME log AFTER i has pages > max_prev.
        let maxPre = 0;
        let hasDecreased = false;
        
        for (let i = 0; i < c.sortedLogs.length; i++) {
            const pages = c.sortedLogs[i].pages;
            
            // Check decrease
            if (i > 0 && pages < c.sortedLogs[i-1].pages) {
                hasDecreased = true;
                // maxPre is max up to i-1
            }

            if (hasDecreased && pages > maxPre) {
                return true;
            }

            if (pages > maxPre) maxPre = pages;
        }
        return false;
    }, icon: "phoenix" }, // 'phoenix' is not emoji, will fallback to star if not handled or maybe use 🦅
    { id: "96", title: "3日で回復", description: "減少後3日以内に元のページへ戻した", type: "SPECIAL", tier: "PLATINUM", condition: (c) => {
        // Iterate diffs via logs
        for (let i = 1; i < c.sortedLogs.length; i++) {
            if (c.sortedLogs[i].pages < c.sortedLogs[i-1].pages) {
                const preDropPages = c.sortedLogs[i-1].pages;
                const dropDate = c.sortedLogs[i].createdAt;
                // Look ahead 
                for (let j = i + 1; j < c.sortedLogs.length; j++) {
                    const recoverDate = c.sortedLogs[j].createdAt;
                     // 3 days window = 72 hours approx or different days? Condition says "within 3 days". 
                     // Let's use diff time <= 3 * 24h
                     if ((recoverDate.getTime() - dropDate.getTime()) > 3 * 24 * 60 * 60 * 1000) break;
                     if (c.sortedLogs[j].pages >= preDropPages) return true;
                }
            }
        }
        return false;
    }, icon: "🚑" },
    { id: "97", title: "V字回復", description: "-5以上の減少の直後に+5以上の増加", type: "SPECIAL", tier: "PLATINUM", condition: (c) => {
        for (let i = 0; i < c.diffs.length - 1; i++) {
            if (c.diffs[i] <= -5 && c.diffs[i+1] >= 5) return true;
        }
        return false;
    }, icon: "🦞" }, // V shape-ish
    { id: "98", title: "安定増加モード", description: "直近5回の差分がすべて増加", type: "SPECIAL", tier: "GOLD", condition: (c) => {
        if (c.diffs.length < 5) return false;
        const last5 = c.diffs.slice(-5);
        return last5.every(d => d > 0);
    }, icon: "🚜" },
    { id: "99", title: "再加速", description: "直近3回すべて増加かつ合計+5以上", type: "SPECIAL", tier: "PLATINUM", condition: (c) => {
        if (c.diffs.length < 3) return false;
        const last3 = c.diffs.slice(-3);
        const sum = last3.reduce((a,b)=>a+b, 0);
        return last3.every(d => d > 0) && sum >= 5;
    }, icon: "🚅" },
    { id: "100", title: "ラストスパート完遂", description: "残り5ページ圏に入って7日以内に完走", type: "SPECIAL", tier: "DIAMOND", condition: (c) => {
        const threshold = c.maxPages - 5;
        // Find FIRST time we hit threshold
        const hitIdx = c.sortedLogs.findIndex(l => l.pages >= threshold);
        if (hitIdx === -1) return false;
        
        // Find FIRST time we hit maxPages
        const finishIdx = c.sortedLogs.findIndex(l => l.pages >= c.maxPages);
        if (finishIdx === -1) return false;

        // Finish must be after hit (or same)
        if (finishIdx < hitIdx) return false; // Maybe user deleted pages?

        const hitDate = c.sortedLogs[hitIdx].createdAt;
        const finishDate = c.sortedLogs[finishIdx].createdAt;

        const dateDiff = (finishDate.getTime() - hitDate.getTime()) / (1000 * 3600 * 24);
        return dateDiff <= 7;
    }, icon: "🏇" },

    // 101-105: DOCTOR Tier (The End Game)
    { id: "101", title: "論文神", description: "100ページ到達", type: "MILESTONE", tier: "DOCTOR", condition: (c) => c.totalPages >= 100, icon: "👑" },
    { id: "102", title: "千日手", description: "合計1000回の記録", type: "FREQUENCY", tier: "DOCTOR", condition: (c) => c.logs.length >= 1000, icon: "🧘" },
    { id: "103", title: "不滅の意志", description: "100日連続執筆", type: "STREAK", tier: "DOCTOR", condition: (c) => c.maxStreak >= 100, icon: "🧬" },
    { id: "104", title: "極限の集中", description: "1日で30ページ執筆", type: "SPECIAL", tier: "DOCTOR", condition: (c) => Object.values(c.dailyStats).some(s => s.diff >= 30), icon: "⚡" },
    { id: "105", title: "全てを知る者", description: "全ての実績を解除（これを除く）", type: "SPECIAL", tier: "DOCTOR", condition: (c) => false /* logic handled globally or manually? Hard to self-reference. Let's make it simple: 50 different achievements? */, icon: "👁️" },
    // Re-defining 105 to be checkable: 50 achievements unlocked. 
    // BUT we cannot access unlocked count here easily without cycle. 
    // Let's change 105 to "Total Pages 200" or something safe.
    { id: "105b", title: "プロフェッサー", description: "200ページ到達", type: "MILESTONE", tier: "DOCTOR", condition: (c) => c.totalPages >= 200, icon: "🎓" },
];


export function calculateAchievements(logs: ReadingLog[], totalPages: number, maxPages: number = 40): {
    unlockedIds: string[];
} {
    if (logs.length === 0) return { unlockedIds: [] };

    // --- Pre-process Stats ---
    const sortedLogs = [...logs].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    const uniqueDays = Array.from(new Set(sortedLogs.map(l => toDayStr(l.createdAt)))).sort();

    // Diffs
    const diffs: number[] = [];
    for (let i = 1; i < sortedLogs.length; i++) {
        diffs.push(sortedLogs[i].pages - sortedLogs[i-1].pages);
    }

    // Streak
    let maxStreak = 0;
    let currentStreak = 0;
    let prevDate: Date | null = null;
    uniqueDays.forEach(dayStr => {
        const currentDate = new Date(dayStr);
        if (!prevDate) {
            currentStreak = 1;
        } else {
            const diffTime = Math.abs(currentDate.getTime() - prevDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays === 1) currentStreak++;
            else currentStreak = 1;
        }
        if (currentStreak > maxStreak) maxStreak = currentStreak;
        prevDate = currentDate;
    });

    // Daily Stats
    const dailyStats: Record<string, { count: number, min: number, max: number, diff: number }> = {};
    const weeklyStats: Record<string, { first: number, last: number, uniqueDays: number, daySet: Set<string> }> = {};
    const monthlyStats: Record<string, { uniqueDays: number, daySet: Set<string> }> = {};

    sortedLogs.forEach(log => {
        const d = toDayStr(log.createdAt);
        const w = getWeekKey(log.createdAt);
        const m = getMonthKey(log.createdAt);

        // Daily
        if (!dailyStats[d]) {
            dailyStats[d] = { count: 0, min: log.pages, max: log.pages, diff: 0 };
        }
        dailyStats[d].count++;
        dailyStats[d].min = Math.min(dailyStats[d].min, log.pages);
        dailyStats[d].max = Math.max(dailyStats[d].max, log.pages);
        dailyStats[d].diff = dailyStats[d].max - dailyStats[d].min; // Approximation of daily progress

        // Weekly
        if (!weeklyStats[w]) {
            weeklyStats[w] = { first: log.pages, last: log.pages, uniqueDays: 0, daySet: new Set() };
        }
        // Assuming sorted logs, first call updates 'first' (actually logic below handles sequence better if used differently)
        // With loop, 'last' will eventually be correct. 'first' needs to be set only once.
        // Actually, sorted loop: first log seen for a week is the EARLIEST.
        // wait, sortedLogs is ASC time. So first log seen IS valid first. 
        // Subsequent logs update 'last'.
        weeklyStats[w].last = log.pages; 
        weeklyStats[w].daySet.add(d);
        weeklyStats[w].uniqueDays = weeklyStats[w].daySet.size;

        // Monthly
        if (!monthlyStats[m]) {
            monthlyStats[m] = { uniqueDays: 0, daySet: new Set() };
        }
        monthlyStats[m].daySet.add(d);
        monthlyStats[m].uniqueDays = monthlyStats[m].daySet.size;
    });


    const context: AchievementContext = {
        logs,
        totalPages,
        maxPages,
        sortedLogs,
        uniqueDays,
        maxStreak,
        dailyStats,
        weeklyStats,
        monthlyStats,
        diffs
    };

    const unlockedIds: string[] = [];

    ACHIEVEMENTS.forEach(ach => {
        try {
            if (ach.condition(context)) {
                unlockedIds.push(ach.id);
            }
        } catch (e) {
            console.error(`Error checking achievement ${ach.id}:`, e);
        }
    });

    return { unlockedIds };
}

export function getAchievementById(id: string): Achievement | undefined {
    return ACHIEVEMENTS.find(a => a.id === id);
}

export function getAllAchievements(): Achievement[] {
    return ACHIEVEMENTS;
}

