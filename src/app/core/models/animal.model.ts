export interface Animal {
  id: number | null;
  name: string;
  breed: string;
  species: string;
  photo: string;
  environment: string;
}

export interface AnimalCreateRequest {
  name: string;
  breed: string;
  species: string;
  photo: string;
  environment: string;
}

export interface AnimalUpdateRequest extends AnimalCreateRequest {
  id: number;
}

