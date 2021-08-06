export interface IRol {
	id: string;
	name: 'Analistas' | 'Administrador' | 'Jefe de riesgos' | 'Alta gerencia';
	normalizedName: string;
	concurrencyStamp?: any;
}