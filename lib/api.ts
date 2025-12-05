// API Base URL Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Generic fetch wrapper with error handling
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// Animal API
export const animalAPI = {
  getAll: () => fetchAPI('/animals'),
  getById: (id: number) => fetchAPI(`/animals/${id}`),
  getByZone: (zone: string) => fetchAPI(`/animals/zone/${zone}`),
  getByConservationStatus: (status: string) => fetchAPI(`/animals/conservation-status/${status}`),
  create: (data: any) => fetchAPI('/animals', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => fetchAPI(`/animals/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => fetchAPI(`/animals/${id}`, { method: 'DELETE' }),
};

// Tree API
export const treeAPI = {
  getAll: () => fetchAPI('/trees'),
  getById: (id: number) => fetchAPI(`/trees/${id}`),
  getByZone: (zone: string) => fetchAPI(`/trees/zone/${zone}`),
  getByHealthStatus: (status: string) => fetchAPI(`/trees/health-status/${status}`),
  create: (data: any) => fetchAPI('/trees', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => fetchAPI(`/trees/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => fetchAPI(`/trees/${id}`, { method: 'DELETE' }),
};

// Plant API
export const plantAPI = {
  getAll: () => fetchAPI('/plants'),
  getById: (id: number) => fetchAPI(`/plants/${id}`),
  getByZone: (zone: string) => fetchAPI(`/plants/zone/${zone}`),
  getMedicinal: () => fetchAPI('/plants/medicinal'),
  create: (data: any) => fetchAPI('/plants', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => fetchAPI(`/plants/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => fetchAPI(`/plants/${id}`, { method: 'DELETE' }),
};

// Forest Officer API
export const officerAPI = {
  getAll: () => fetchAPI('/officers'),
  getById: (id: number) => fetchAPI(`/officers/${id}`),
  getByZone: (zone: string) => fetchAPI(`/officers/zone/${zone}`),
  getActive: () => fetchAPI('/officers/active'),
  create: (data: any) => fetchAPI('/officers', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => fetchAPI(`/officers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => fetchAPI(`/officers/${id}`, { method: 'DELETE' }),
};

// Visitor API
export const visitorAPI = {
  getAll: () => fetchAPI('/visitors'),
  getById: (id: number) => fetchAPI(`/visitors/${id}`),
  getByDate: (date: string) => fetchAPI(`/visitors/date/${date}`),
  getByZone: (zone: string) => fetchAPI(`/visitors/zone/${zone}`),
  create: (data: any) => fetchAPI('/visitors', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => fetchAPI(`/visitors/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => fetchAPI(`/visitors/${id}`, { method: 'DELETE' }),
};

// Resource API
export const resourceAPI = {
  getAll: () => fetchAPI('/resources'),
  getById: (id: number) => fetchAPI(`/resources/${id}`),
  getByZone: (zone: string) => fetchAPI(`/resources/zone/${zone}`),
  getByType: (type: string) => fetchAPI(`/resources/type/${type}`),
  create: (data: any) => fetchAPI('/resources', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => fetchAPI(`/resources/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => fetchAPI(`/resources/${id}`, { method: 'DELETE' }),
};
