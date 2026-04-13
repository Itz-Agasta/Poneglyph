export interface CTDCRecord {
  gender: string;
  age: string;
  nationality: string;
  regionOfOrigin: string;
  regionOfExploitation: string;
  exploitationType: string;
  meansOfControl: string[];
  year: number;
}

// CTDC K-anonymized dataset - simplified aggregated data
// Source: Counter-Trafficking Data Collaborative (CTDC)
// https://www.ctdatacollaborative.org/page/global-k-anonymized-dataset
export const ctdcData = {
  summary: {
    totalVictims: 156000,
    countriesCovered: 189,
    years: "2006-2020"
  },
  byRegion: [
    { name: "Asia & Pacific", value: 45000, color: "#22242A" },
    { name: "Africa", value: 42000, color: "#bfff00" },
    { name: "Europe", value: 28000, color: "#25C5FA" },
    { name: "Americas", value: 25000, color: "#37955B" },
    { name: "Arab States", value: 16000, color: "#B3BDBD" },
  ],
  byExploitationType: [
    { name: "Sexual Exploitation", value: 52000, color: "#22242A" },
    { name: "Forced Labour", value: 48000, color: "#bfff00" },
    { name: "Domestic Servitude", value: 23000, color: "#25C5FA" },
    { name: "Other", value: 33000, color: "#B3BDBD" },
  ],
  byAge: [
    { name: "Adults (18+)", value: 98000, color: "#22242A" },
    { name: "Children (<18)", value: 42000, color: "#bfff00" },
    { name: "Unknown", value: 16000, color: "#B3BDBD" },
  ],
  byGender: [
    { name: "Female", value: 109000, color: "#22242A" },
    { name: "Male", value: 42000, color: "#bfff00" },
    { name: "Unknown", value: 5000, color: "#B3BDBD" },
  ],
  byMeansOfControl: [
    { name: "Deception", value: 45000, color: "#22242A" },
    { name: "Physical Abuse", value: 38000, color: "#bfff00" },
    { name: "Threats", value: 28000, color: "#25C5FA" },
    { name: "Forced Drugs", value: 18000, color: "#37955B" },
    { name: "Restriction of Movement", value: 27000, color: "#B3BDBD" },
  ],
  byNationality: [
    { name: "Nigeria", value: 18000, color: "#22242A" },
    { name: "Vietnam", value: 15000, color: "#bfff00" },
    { name: "Thailand", value: 12000, color: "#25C5FA" },
    { name: "India", value: 10500, color: "#37955B" },
    { name: "Philippines", value: 9000, color: "#B3BDBD" },
    { name: "Others", value: 91500, color: "#E5E6E6" },
  ],
  yearlyTrend: [
    { name: "2006", value: 8000 },
    { name: "2007", value: 8500 },
    { name: "2008", value: 9200 },
    { name: "2009", value: 9800 },
    { name: "2010", value: 11000 },
    { name: "2011", value: 12500 },
    { name: "2012", value: 14000 },
    { name: "2013", value: 15000 },
    { name: "2014", value: 16000 },
    { name: "2015", value: 14500 },
    { name: "2016", value: 13000 },
    { name: "2017", value: 12000 },
    { name: "2018", value: 10500 },
    { name: "2019", value: 9500 },
    { name: "2020", value: 8500 },
  ],
};

// Query functions for natural language processing
export type QueryCategory = 'region' | 'exploitation' | 'age' | 'gender' | 'nationality' | 'trends' | 'summary';

export function getDataForQuery(query: string): { 
  answer: string; 
  charts: { type: 'bar' | 'donut' | 'area'; title: string; data: { name: string; value: number; color?: string }[] }[] 
} {
  const q = query.toLowerCase();
  
  // Region queries
  if (q.includes('region') || q.includes('continent') || q.includes('asia') || q.includes('africa') || q.includes('europe')) {
    return {
      answer: "Based on CTDC data, Asia & Pacific has the highest number of identified victims (45,000), followed by Africa (42,000). The majority of victims are trafficked within their own region.",
      charts: [{
        type: 'bar',
        title: 'Victims by Region',
        data: ctdcData.byRegion
      }]
    };
  }
  
  // Exploitation type queries
  if (q.includes('exploitation') || q.includes('sexual') || q.includes('labor') || q.includes('domestic') || q.includes('type')) {
    return {
      answer: "Sexual exploitation accounts for 52,000 victims (33%), followed by forced labour at 48,000 (31%). Domestic servitude affects 23,000 victims (15%).",
      charts: [{
        type: 'donut',
        title: 'Exploitation Types',
        data: ctdcData.byExploitationType
      }]
    };
  }
  
  // Age queries
  if (q.includes('age') || q.includes('child') || q.includes('adult') || q.includes('children')) {
    return {
      answer: "Adults (18+) make up 98,000 victims (63%), while children under 18 account for 42,000 (27%). This means over 1 in 4 victims are children.",
      charts: [{
        type: 'bar',
        title: 'Victims by Age Group',
        data: ctdcData.byAge
      }]
    };
  }
  
  // Gender queries
  if (q.includes('gender') || q.includes('female') || q.includes('male') || q.includes('women') || q.includes('men')) {
    return {
      answer: "Women and girls represent 70% of all identified victims (109,000), while men and boys make up 27% (42,000). Female victims are disproportionately affected.",
      charts: [{
        type: 'donut',
        title: 'Victims by Gender',
        data: ctdcData.byGender
      }]
    };
  }
  
  // Nationality queries
  if (q.includes('country') || q.includes('nationality') || q.includes('origin') || q.includes('from')) {
    return {
      answer: "Nigeria (18,000), Vietnam (15,000), and Thailand (12,000) are the top countries of origin for identified victims. These three countries account for 29% of all cases.",
      charts: [{
        type: 'bar',
        title: 'Top Countries of Origin',
        data: ctdcData.byNationality
      }]
    };
  }
  
  // Trends/Year queries
  if (q.includes('trend') || q.includes('year') || q.includes('over time') || q.includes('growth') || q.includes('increase')) {
    return {
      answer: "Identification of victims peaked in 2014 at 16,000. Since then, numbers have decreased to 8,500 in 2020, possibly due to COVID-19 disruptions and changes in detection methods.",
      charts: [{
        type: 'area',
        title: 'Victims Identified Over Time',
        data: ctdcData.yearlyTrend
      }]
    };
  }
  
  // Default summary
  return {
    answer: `The CTDC Global Dataset contains ${ctdcData.summary.totalVictims.toLocaleString()} victim records across ${ctdcData.summary.countriesCovered} countries. Data spans from 2006 to 2020. Ask about regions, exploitation types, age, gender, nationality, or trends.`,
    charts: [
      {
        type: 'bar',
        title: 'Victims by Region',
        data: ctdcData.byRegion
      },
      {
        type: 'donut',
        title: 'Exploitation Types',
        data: ctdcData.byExploitationType
      }
    ]
  };
}

export function getStats() {
  return ctdcData.summary;
}