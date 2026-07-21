export type FieldDiaryActivity = "soil_preparation" | "inspection" | "planting" | "irrigation" | "fertilization" | "spraying" | "pruning" | "harvest" | "maintenance" | "observation" | "other";

export type FieldDiaryEntry = {
  id: string;
  farm: string;
  field: string;
  crop: string;
  date: string;
  activity: FieldDiaryActivity;
  title: string;
  responsible: string;
  weather: string;
  notes: string;
  complianceObligationId?: string;
  product?: string;
  quantity?: string;
  unit?: string;
  equipment?: string;
  evidenceReference?: string;
  photoName: string;
  photoDataUrl: string;
  createdAt: string;
};

export type FieldDiaryDraft = Omit<FieldDiaryEntry, "id" | "createdAt">;
