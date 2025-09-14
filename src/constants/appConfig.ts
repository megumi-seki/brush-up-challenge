import toDatestring from "../hooks/toDatestring";
import type { Employee, ShiftType, TimeRecorderType } from "../types";

export const GRAPH_START_HOUR = 7;
export const GRAPH_END_HOUR = 24;
export const GRAPH_TOTAL_MINUTES = (GRAPH_END_HOUR - GRAPH_START_HOUR) * 60; // 1020分 分単位でグラフ化

export const NOW = new Date();

export const EMPLOYEE_DEMO_DATA: Employee[] = [
        { id: "001", name: "佐藤太郎", roles: ["oven"] },
        { id: "002", name: "鈴木花子", roles: ["oven"] },
        { id: "003", name: "高橋健一", roles: ["dough"] },
        { id: "004", name: "田中美咲", roles: ["dough"] },
        { id: "005", name: "伊藤翔", roles: ["sandwich", "cafe", "shaping"] },
        { id: "006", name: "渡辺彩香", roles: ["sandwich", "cafe", "shaping"] },
        { id: "007", name: "山本大輔", roles: ["sandwich", "cafe", "shaping"] },
        { id: "008", name: "中村里奈", roles: ["sandwich", "wrapping", "cafe", "sales"] },
        { id: "009", name: "小林直樹", roles: ["sandwich", "wrapping", "cafe", "sales"] },
        { id: "010", name: "加藤優子", roles: ["sandwich", "cafe"] },
        { id: "011", name: "吉田亮", roles: ["sandwich", "cafe", "wrapping"] },
        { id: "012", name: "山田恵美", roles: ["sandwich", "wrapping", "shaping"] },
        { id: "013", name: "佐々木悠人", roles: ["sandwich"] },
        { id: "014", name: "松本真奈美", roles: ["sandwich"] },
        { id: "015", name: "木村拓真", roles: ["oven", "cafe"] },
        { id: "016", name: "清水愛", roles: ["sales", "sandwich", "dough"] },
        { id: "017", name: "林陽介", roles: ["sales", "shaping"] },
        { id: "018", name: "山口菜々子", roles: ["sales"] },
        { id: "019", name: "斎藤智也", roles: ["sales", "cafe"] },
        { id: "020", name: "井上結衣", roles: ["sales", "cafe"] },
        { id: "021", name: "岡田俊介", roles: ["sales", "cafe"] },
        { id: "022", name: "杉山由紀", roles: ["sales", "cafe"] },
        { id: "023", name: "平野達也", roles: ["sales", "cafe"] },
        { id: "024", name: "森彩乃", roles: ["sales", "cafe"] },
        { id: "025", name: "石井大地", roles: ["sales", "cafe"] },
        { id: "026", name: "原田美和", roles: ["sales", "cafe"] },
        { id: "027", name: "野口慎", roles: ["sales"] },
        { id: "028", name: "岡本梨花", roles: ["sales"] },
        { id: "029", name: "村上一樹", roles: ["sales"] },
        { id: "030", name: "青木さくら", roles: ["sales"] },
        { id: "031", name: "藤田光", roles: ["sales"] },
        { id: "032", name: "三浦千尋", roles: ["sales"] },
        { id: "033", name: "福田悠真", roles: ["sales"] },
        { id: "034", name: "西村佳奈", roles: ["sales"] },
        { id: "035", name: "大野直人", roles: ["sales"] },
        { id: "036", name: "長谷川美月", roles: ["sales"] },
        { id: "037", name: "本田誠", roles: ["sales"] },
        { id: "038", name: "宮崎亜衣", roles: ["sales"] },
        { id: "039", name: "石田拓海", roles: ["sales"] },
        { id: "040", name: "内田真央", roles: ["sales"] },

      ];

const yesterday = new Date().setDate(NOW.getDate() - 1);
const formattedYesterday = toDatestring(new Date(yesterday))
export const TIME_RECORDER_DEMO_DATA: TimeRecorderType[] = [

        {
          emp_id: "001",
          datetime: `${formattedYesterday}T07:30:00.000+0900`,
          role: "oven",
          type: "clock_in",
          note: "",
        },
        
        {
          emp_id: "001",
          datetime: `${formattedYesterday}T13:10:00.000+0900`,
          role: "oven",
          type: "break_begin",
          note: "",
        },
        {
          emp_id: "001",
          datetime: `${formattedYesterday}T13:51:00.000+0900`,
          role: "oven",
          type: "break_end",
          note: "",
        },
        {
          emp_id: "001",
          datetime: `${formattedYesterday}T17:00:00.000+0900`,
          role: "oven",
          type: "clock_out",
          note: "",
        },
        {
          emp_id: "003",
          datetime: `${formattedYesterday}T07:00:00.000+0900`,
          role: "dough",
          type: "clock_in",
          note: "",
        },
        {
          emp_id: "003",
          datetime: `${formattedYesterday}T12:00:00.000+0900`,
          role: "dough",
          type: "break_begin",
          note: "",
        },
        {
          emp_id: "003",
          datetime: `${formattedYesterday}T12:50:00.000+0900`,
          role: "dough",
          type: "break_end",
          note: "",
        },
        {
          emp_id: "003",
          datetime: `${formattedYesterday}T16:36:00.000+0900`,
          role: "dough",
          type: "clock_out",
          note: "",
        },
        
        {
          emp_id: "008",
          datetime: `${formattedYesterday}T08:58:00.000+0900`,
          role: "wrapping",
          type: "clock_in",
          note: "",
        },
        {
          emp_id: "008",
          datetime: `${formattedYesterday}T14:00:00.000+0900`,
          role: "wrapping",
          type: "break_begin",
          note: "",
        },
        {
          emp_id: "008",
          datetime: `${formattedYesterday}T14:58:00.000+0900`,
          role: "cafe",
          type: "break_end",
          note: "",
        },
        {
          emp_id: "008",
          datetime: `${formattedYesterday}T17:15:00.000+0900`,
          role: "wrapping",
          type: "role_change",
          note: "",
        },
        {
          emp_id: "008",
          datetime: `${formattedYesterday}T18:15:00.000+0900`,
          role: "wrapping",
          type: "clock_out",
          note: "",
        },
        
        {
          emp_id: "017",
          datetime: `${formattedYesterday}T08:30:00.000+0900`,
          role: "shaping",
          type: "clock_in",
          note: "",
        },
        {
          emp_id: "017",
          datetime: `${formattedYesterday}T12:03:00.000+0900`,
          role: "shaping",
          type: "break_begin",
          note: "",
        },
        {
          emp_id: "017",
          datetime: `${formattedYesterday}T12:35:00.000+0900`,
          role: "shaping",
          type: "break_end",
          note: "",
        },
        {
          emp_id: "017",
          datetime: `${formattedYesterday}T17:55:00.000+0900`,
          role: "shaping",
          type: "clock_out",
          note: "",
        },
        
        {
          emp_id: "005",
          datetime: `${formattedYesterday}T07:55:00.000+0900`,
          role: "sandwich",
          type: "clock_in",
          note: "",
        },
         {
          emp_id: "005",
          datetime: `${formattedYesterday}T13:04:00.000+0900`,
          role: "sandwich",
          type: "break_begin",
          note: "",
        },
        {
          emp_id: "005",
          datetime: `${formattedYesterday}T13:42:00.000+0900`,
          role: "cafe",
          type: "break_end",
          note: "",
        },
        {
          emp_id: "005",
          datetime: `${formattedYesterday}T16:00:00.000+0900`,
          role: "cafe",
          type: "clock_out",
          note: "",
        },

        {
          emp_id: "012",
          datetime: `${formattedYesterday}T07:00:00.000+0900`,
          role: "sandwich",
          type: "clock_in",
          note: "",
        },
        
        {
          emp_id: "012",
          datetime: `${formattedYesterday}T11:30:00.000+0900`,
          role: "shaping",
          type: "role_change",
          note: "",
        },
        {
          emp_id: "012",
          datetime: `${formattedYesterday}T12:00:00.000+0900`,
          role: "shaping",
          type: "break_begin",
          note: "",
        },
        
        {
          emp_id: "012",
          datetime: `${formattedYesterday}T13:00:00.000+0900`,
          role: "shaping",
          type: "break_end",
          note: "",
        },
        {
          emp_id: "012",
          datetime: `${formattedYesterday}T15:00:00.000+0900`,
          role: "shaping",
          type: "clock_out",
          note: "",
        },

        {
          emp_id: "015",
          datetime: `${formattedYesterday}T13:00:00.000+0900`,
          role: "cafe",
          type: "clock_in",
          note: "",
        },
        {
          emp_id: "015",
          datetime: `${formattedYesterday}T17:00:00.000+0900`,
          role: "cafe",
          type: "clock_out",
          note: "",
        },
        
        {
          emp_id: "027",
          datetime: `${formattedYesterday}T16:15:00.000+0900`,
          role: "sales",
          type: "clock_in",
          note: "",
        },
        {
          emp_id: "027",
          datetime: `${formattedYesterday}T22:05:00.000+0900`,
          role: "sales",
          type: "clock_out",
          note: "",
        },
        
        {
          emp_id: "028",
          datetime: `${formattedYesterday}T10:55:00.000+0900`,
          role: "sales",
          type: "clock_in",
          note: "",
        },
        {
          emp_id: "028",
          datetime: `${formattedYesterday}T14:00:00.000+0900`,
          role: "sales",
          type: "clock_out",
          note: "",
        },
        {
          emp_id: "029",
          datetime: `${formattedYesterday}T10:03:00.000+0900`,
          role: "sales",
          type: "clock_in",
          note: "",
        },
        {
          emp_id: "029",
          datetime: `${formattedYesterday}T16:04:00.000+0900`,
          role: "sales",
          type: "clock_out",
          note: "",
        },

        {
          emp_id: "030",
          datetime: `${formattedYesterday}T16:48:00.000+0900`,
          role: "sales",
          type: "clock_in",
          note: "",
        },
        {
          emp_id: "030",
          datetime: `${formattedYesterday}T22:55:00.000+0900`,
          role: "sales",
          type: "clock_out",
          note: "",
        },
        
        {
          emp_id: "031",
          datetime: `${formattedYesterday}T08:54:00.000+0900`,
          role: "sales",
          type: "clock_in",
          note: "",
        },
        {
          emp_id: "031",
          datetime: `${formattedYesterday}T13:38:00.000+0900`,
          role: "sales",
          type: "clock_out",
          note: "",
        },
      ];

export const SHIFT_DEMO_DATA: ShiftType[] =  [

        {
          emp_id: "001",
          datetime: `${formattedYesterday}T08:00:00.000+0900`,
          role: "oven",
          type: "clock_in",
        },
        
        {
          emp_id: "001",
          datetime: `${formattedYesterday}T13:00:00.000+0900`,
          role: "oven",
          type: "break_begin",
        },
        {
          emp_id: "001",
          datetime: `${formattedYesterday}T14:00:00.000+0900`,
          role: "oven",
          type: "break_end",
        },
        {
          emp_id: "001",
          datetime: `${formattedYesterday}T17:00:00.000+0900`,
          role: "oven",
          type: "clock_out",
        },
        {
          emp_id: "003",
          datetime: `${formattedYesterday}T07:00:00.000+0900`,
          role: "dough",
          type: "clock_in",
        },
        {
          emp_id: "003",
          datetime: `${formattedYesterday}T12:00:00.000+0900`,
          role: "dough",
          type: "break_begin",
        },
        {
          emp_id: "003",
          datetime: `${formattedYesterday}T13:00:00.000+0900`,
          role: "dough",
          type: "break_end",
        },
        {
          emp_id: "003",
          datetime: `${formattedYesterday}T16:00:00.000+0900`,
          role: "dough",
          type: "clock_out",
        },
        
        {
          emp_id: "008",
          datetime: `${formattedYesterday}T09:00:00.000+0900`,
          role: "wrapping",
          type: "clock_in",
        },
        {
          emp_id: "008",
          datetime: `${formattedYesterday}T14:00:00.000+0900`,
          role: "wrapping",
          type: "break_begin",
        },
        {
          emp_id: "008",
          datetime: `${formattedYesterday}T15:00:00.000+0900`,
          role: "cafe",
          type: "break_end",
        },
        {
          emp_id: "008",
          datetime: `${formattedYesterday}T17:00:00.000+0900`,
          role: "wrapping",
          type: "role_change",
        },
        {
          emp_id: "008",
          datetime: `${formattedYesterday}T18:00:00.000+0900`,
          role: "wrapping",
          type: "clock_out",
        },
        
        {
          emp_id: "017",
          datetime: `${formattedYesterday}T08:30:00.000+0900`,
          role: "shaping",
          type: "clock_in",
        },
        {
          emp_id: "017",
          datetime: `${formattedYesterday}T12:00:00.000+0900`,
          role: "shaping",
          type: "break_begin",
        },
        {
          emp_id: "017",
          datetime: `${formattedYesterday}T13:00:00.000+0900`,
          role: "shaping",
          type: "break_end",
        },
        {
          emp_id: "017",
          datetime: `${formattedYesterday}T17:30:00.000+0900`,
          role: "shaping",
          type: "clock_out",
        },
        
        {
          emp_id: "005",
          datetime: `${formattedYesterday}T08:00:00.000+0900`,
          role: "sandwich",
          type: "clock_in",
        },
         {
          emp_id: "005",
          datetime: `${formattedYesterday}T13:00:00.000+0900`,
          role: "sandwich",
          type: "break_begin",
        },
        {
          emp_id: "005",
          datetime: `${formattedYesterday}T14:00:00.000+0900`,
          role: "cafe",
          type: "break_end",
        },
        {
          emp_id: "005",
          datetime: `${formattedYesterday}T16:00:00.000+0900`,
          role: "cafe",
          type: "clock_out",
        },

        {
          emp_id: "012",
          datetime: `${formattedYesterday}T07:00:00.000+0900`,
          role: "sandwich",
          type: "clock_in",
        },
        {
          emp_id: "012",
          datetime: `${formattedYesterday}T12:00:00.000+0900`,
          role: "sandwich",
          type: "break_begin",
        },
        {
          emp_id: "012",
          datetime: `${formattedYesterday}T13:00:00.000+0900`,
          role: "cafe",
          type: "break_end",
        },
        
        {
          emp_id: "012",
          datetime: `${formattedYesterday}T13:00:00.000+0900`,
          role: "shaping",
          type: "role_change",
        },
        {
          emp_id: "012",
          datetime: `${formattedYesterday}T15:00:00.000+0900`,
          role: "shaping",
          type: "clock_out",
        },

        {
          emp_id: "015",
          datetime: `${formattedYesterday}T13:00:00.000+0900`,
          role: "cafe",
          type: "clock_in",
        },
        {
          emp_id: "015",
          datetime: `${formattedYesterday}T17:00:00.000+0900`,
          role: "cafe",
          type: "clock_out",
        },
        
        {
          emp_id: "027",
          datetime: `${formattedYesterday}T16:00:00.000+0900`,
          role: "sales",
          type: "clock_in",
        },
        {
          emp_id: "027",
          datetime: `${formattedYesterday}T22:00:00.000+0900`,
          role: "sales",
          type: "clock_out",
        },
        
        {
          emp_id: "028",
          datetime: `${formattedYesterday}T11:00:00.000+0900`,
          role: "sales",
          type: "clock_in",
        },
        {
          emp_id: "028",
          datetime: `${formattedYesterday}T14:00:00.000+0900`,
          role: "sales",
          type: "clock_out",
        },
        {
          emp_id: "029",
          datetime: `${formattedYesterday}T10:00:00.000+0900`,
          role: "sales",
          type: "clock_in",
        },
        {
          emp_id: "029",
          datetime: `${formattedYesterday}T16:00:00.000+0900`,
          role: "sales",
          type: "clock_out",
        },

        {
          emp_id: "030",
          datetime: `${formattedYesterday}T17:00:00.000+0900`,
          role: "sales",
          type: "clock_in",
        },
        {
          emp_id: "030",
          datetime: `${formattedYesterday}T22:30:00.000+0900`,
          role: "sales",
          type: "clock_out",
        },
        
        {
          emp_id: "031",
          datetime: `${formattedYesterday}T09:00:00.000+0900`,
          role: "sales",
          type: "clock_in",
        },
        {
          emp_id: "031",
          datetime: `${formattedYesterday}T13:00:00.000+0900`,
          role: "sales",
          type: "clock_out",
        },
      ];