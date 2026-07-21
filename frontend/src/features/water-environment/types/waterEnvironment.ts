export type WaterSourceType = "borehole" | "well" | "surface" | "network" | "reused" | "other";
export type WaterTitle = { id: string; name: string; sourceType: WaterSourceType; titleNumber: string; issueDate: string; expiryDate: string; authorizedAnnualVolumeM3: number; meterId: string; notes: string; createdAt: string };
export type WaterReading = { id: string; titleId: string; date: string; meterValueM3: number; createdAt: string };
export type WasteRecord = { id: string; date: string; wasteType: string; lerCode: string; quantity: number; unit: "kg" | "t" | "l"; destination: string; egarNumber: string; notes: string; createdAt: string };
