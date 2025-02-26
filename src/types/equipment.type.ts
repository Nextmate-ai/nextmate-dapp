export interface Equipment {
	id: string;
	name: string;
	description: string | null;
	type: string;
	image: string | null;
	attributes: any | null;
}

export interface EquipmentCount {
	equipments: Equipment;
	count: number;
}
