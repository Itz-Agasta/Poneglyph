import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { getDataForQuery, getStats, ctdcData } from '@poneglyph/data';

const app = new Hono();

app.use('*', cors());

// Health check
app.get('/', (c) => {
  return c.json({ 
    status: 'ok', 
    message: 'Poneglyph Research API',
    dataSource: 'CTDC K-anonymized Dataset',
    endpoints: [
      '/api/stats',
      '/api/by-region',
      '/api/by-exploitation',
      '/api/by-age',
      '/api/by-gender',
      '/api/by-nationality',
      '/api/trends',
      '/api/query?q=...'
    ]
  });
});

// Get summary stats
app.get('/api/stats', (c) => {
  const stats = getStats();
  return c.json(stats);
});

// Get data by region
app.get('/api/by-region', (c) => {
  return c.json({
    title: 'Victims by Region',
    data: ctdcData.byRegion,
    total: ctdcData.summary.totalVictims
  });
});

// Get data by exploitation type
app.get('/api/by-exploitation', (c) => {
  return c.json({
    title: 'Exploitation Types',
    data: ctdcData.byExploitationType
  });
});

// Get data by age
app.get('/api/by-age', (c) => {
  return c.json({
    title: 'Victims by Age Group',
    data: ctdcData.byAge
  });
});

// Get data by gender
app.get('/api/by-gender', (c) => {
  return c.json({
    title: 'Victims by Gender',
    data: ctdcData.byGender
  });
});

// Get data by nationality
app.get('/api/by-nationality', (c) => {
  return c.json({
    title: 'Top Countries of Origin',
    data: ctdcData.byNationality
  });
});

// Get yearly trends
app.get('/api/trends', (c) => {
  return c.json({
    title: 'Victims Identified Over Time',
    data: ctdcData.yearlyTrend
  });
});

// Natural language query endpoint
app.get('/api/query', (c) => {
  const query = c.req.query('q') || c.req.query('query');
  
  if (!query) {
    return c.json({ 
      error: 'Missing query parameter. Use ?q= or ?query=',
      examples: [
        '?q=What regions have the most victims?',
        '?q=How many children are trafficked?',
        '?q=What are the main exploitation types?'
      ]
    }, 400);
  }
  
  const result = getDataForQuery(query);
  
  return c.json({
    query,
    answer: result.answer,
    charts: result.charts,
    sources: [{ 
      title: 'CTDC Global K-anonymized Dataset', 
      url: 'https://www.ctdatacollaborative.org/page/global-k-anonymized-dataset' 
    }]
  });
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not found' }, 404);
});

export default app;