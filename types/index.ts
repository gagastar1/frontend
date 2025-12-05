export interface Animal {
  animalId?: number;
  name: string;
  scientificName: string;
  location: string;
  zone: string;
  count: number;
  speciesType: string;
  conservationStatus: string;
  lastSightingDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Tree {
  treeId?: number;
  commonName: string;
  scientificName: string;
  location: string;
  zone: string;
  heightMeters?: number;
  ageYears?: number;
  diameterCm?: number;
  healthStatus: string;
  plantationDate?: string;
  treeType: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Plant {
  plantId?: number;
  commonName: string;
  scientificName: string;
  location: string;
  zone: string;
  plantType: string;
  coverageAreaSqm?: number;
  floweringSeason?: string;
  medicinalUse: boolean;
  count: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ForestOfficer {
  officerId?: number;
  firstName: string;
  lastName: string;
  employeeId: string;
  designation: string;
  department: string;
  assignedZone: string;
  contactNumber: string;
  email: string;
  joiningDate?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Visitor {
  visitorId?: number;
  fullName: string;
  contactNumber: string;
  email: string;
  visitDate: string;
  entryTime?: string;
  exitTime?: string;
  visitorType: string;
  groupSize: number;
  permitNumber?: string;
  zoneVisited: string;
  purpose: string;
  createdAt?: string;
}

export interface Resource {
  resourceId?: number;
  resourceName: string;
  resourceType: string;
  quantity: number;
  unit: string;
  location: string;
  assignedZone: string;
  assignedOfficer?: ForestOfficer;
  conditionStatus: string;
  purchaseDate?: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  cost?: number;
  createdAt?: string;
  updatedAt?: string;
}
