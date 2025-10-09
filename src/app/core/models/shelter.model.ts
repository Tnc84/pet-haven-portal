export interface Shelter {
  id: number | null;
  name: string;
  city: string;
  environment: string;
}

export interface ShelterCreateRequest {
  name: string;
  city: string;
  environment: string;
}

export interface ShelterUpdateRequest extends ShelterCreateRequest {
  id: number;
}

